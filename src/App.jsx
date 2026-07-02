/**
 * 두근두근타운 채집 도감 v2 - Premium Dark Edition
 * 
 * 기능:
 * - 글래스모피즘 + 네온 다크 테마
 * - 시간/날씨 기반 필터링
 * - 카드 클릭 시 상세 모달
 * - 풍부한 애니메이션 & 마이크로 인터랙션
 * - 브라우저 뒤로가기 / 모바일 뒤로가기 지원
 */

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import collectionData from './data/collectionData';
import './App.css';

export default function App() {
  // ===== 상태 관리 =====
  const [view, setView] = useState('landing');
  const [activeTab, setActiveTab] = useState('available');
  const [selectedItem, setSelectedItem] = useState(null); // 상세 모달용

  // 히스토리 조작 중 popstate 무한 루프 방지 플래그
  const isNavigatingRef = useRef(false);

  // ===== 브라우저 History API 연동 =====
  // 초기 로드 시 히스토리 상태 설정
  useEffect(() => {
    // 초기 상태를 replaceState로 설정 (landing)
    window.history.replaceState({ view: 'landing', modal: false }, '', '');
  }, []);

  // popstate 이벤트 리스너 (브라우저/모바일 뒤로가기)
  useEffect(() => {
    const handlePopState = (event) => {
      if (isNavigatingRef.current) return;
      isNavigatingRef.current = true;

      const state = event.state;

      if (!state) {
        // state가 없으면 landing으로
        setSelectedItem(null);
        setView('landing');
        setActiveTab('available');
        setSearchQuery('');
      } else if (state.modal && state.view === 'guide') {
        // 모달이 열린 guide 상태 → 여기서 뒤로가면 모달만 닫힘
        // 실제로는 모달 닫기 (guide로 돌아감)
        // popstate가 뒤로가기를 의미하므로 모달을 닫아야 함
        // 하지만 state가 modal이면 그 상태로 복원하는 것이므로...
        // 뒤로 갈 때는 이전 state로 감 → guide (modal:false)
        setSelectedItem(null);
        setView('guide');
      } else if (state.view === 'guide') {
        setSelectedItem(null);
        setView('guide');
        setSearchQuery('');
      } else if (state.view === 'landing') {
        setSelectedItem(null);
        setView('landing');
        setActiveTab('available');
        setSearchQuery('');
      }

      // 뒤로가기 후 스크롤 위치 맨 위로
      window.scrollTo({ top: 0, behavior: 'instant' });

      setTimeout(() => {
        isNavigatingRef.current = false;
      }, 100);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 설정 입력값 - 현재 시간을 기반으로 시간대 자동 선택
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(() => {
    const hours = new Date().getHours();
    if (hours >= 0 && hours < 6) return '00-06';
    if (hours >= 6 && hours < 12) return '06-12';
    if (hours >= 12 && hours < 18) return '12-18';
    return '18-00';
  });
  const [selectedWeather, setSelectedWeather] = useState('sunny');

  // 도감 필터
  const [selectedType, setSelectedType] = useState('fish');
  const [locationFilter, setLocationFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [excludeSunny, setExcludeSunny] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // ===== 스크롤 감지 =====
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // ===== 시간대 데이터 =====
  const timeSlots = [
    { id: '00-06', label: '새벽', sub: '0시 ~ 6시', icon: '🌃', color: '#6366f1', glow: 'rgba(99, 102, 241, 0.4)' },
    { id: '06-12', label: '오전', sub: '6시 ~ 12시', icon: '🌄', color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)' },
    { id: '12-18', label: '오후', sub: '12시 ~ 18시', icon: '🌇', color: '#ef4444', glow: 'rgba(239, 68, 68, 0.4)' },
    { id: '18-00', label: '저녁', sub: '18시 ~ 0시', icon: '🌆', color: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.4)' },
  ];

  // 사용자 지정 시간 (기본값은 현재 실제 시간)
  const [customTime, setCustomTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });

  // 입력된 시간에 따른 자동 시간대 감지
  const autoDetectedSlot = useMemo(() => {
    if (!customTime) return '12-18';
    const hours = parseInt(customTime.split(':')[0], 10);
    if (hours >= 0 && hours < 6) return '00-06';
    if (hours >= 6 && hours < 12) return '06-12';
    if (hours >= 12 && hours < 18) return '12-18';
    return '18-00';
  }, [customTime]);

  const handleTimeChange = (e) => {
    const newTime = e.target.value;
    setCustomTime(newTime);
    if (!newTime) return;
    const h = parseInt(newTime.split(':')[0], 10);
    let newSlot = '18-00';
    if (h >= 0 && h < 6) newSlot = '00-06';
    else if (h >= 6 && h < 12) newSlot = '06-12';
    else if (h >= 12 && h < 18) newSlot = '12-18';
    setSelectedTimeSlot(newSlot);
  };

  // 선택된 시간대의 라벨 가져오기
  const getSlotInfo = (slotId) => timeSlots.find(s => s.id === slotId);

  // ===== 필터링 =====
  const filteredData = useMemo(() => {
    return collectionData
      .filter(item => {
        if (item.type !== selectedType) return false;
        if (activeTab === 'available') {
            if (!item.time_slots.includes(selectedTimeSlot)) return false;
          if (!item.weathers.includes(selectedWeather)) return false;
        }
        if (excludeSunny && item.weathers.includes('sunny')) return false;
        if (locationFilter && item.location && item.location.split('-')[0].trim() !== locationFilter) return false;
        if (levelFilter !== 'all' && item.hobby_level !== Number(levelFilter)) return false;
        if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => a.hobby_level - b.hobby_level);
  }, [selectedType, activeTab, selectedTimeSlot, selectedWeather, locationFilter, levelFilter, excludeSunny, searchQuery]);

  // 전체 개수 (현재 타입)
  const totalTypeCount = useMemo(() => {
    return collectionData.filter(i => i.type === selectedType).length;
  }, [selectedType]);

  const locations = useMemo(() => {
    const locs = new Set(
      collectionData.filter(i => i.type === selectedType)
      .map(i => i.location ? i.location.split('-')[0].trim() : '')
      .filter(loc => loc)
    );
    return Array.from(locs).sort();
  }, [selectedType]);

  const levels = useMemo(() => {
    const lvls = new Set(
      collectionData.filter(i => i.type === selectedType).map(i => i.hobby_level)
    );
    return Array.from(lvls).filter(l => l).sort((a,b) => a-b);
  }, [selectedType]);

  // ===== 핸들러 (History API 연동) =====
  const handleConfirm = () => {
    setView('guide');
    setSearchQuery('');
    window.history.pushState({ view: 'guide', modal: false }, '', '#guide');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleGoBack = () => {
    // 브라우저 히스토리를 통해 뒤로가기
    window.history.back();
  };

  const handleAllBook = () => {
    setActiveTab('all');
    setView('guide');
    setSearchQuery('');
    window.history.pushState({ view: 'guide', modal: false }, '', '#guide');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const weatherLabel = (w) => w === 'sunny' ? '맑음' : w === 'rain' ? '비/눈' : '무지개';

  const timeSlotShortLabel = (ts) => {
    return ts;
  };

  const typeLabel = (t) => t === 'fish' ? '물고기' : t === 'insect' ? '곤충' : '새';

  // ===== 랜딩 화면 =====
  if (view === 'landing') {
    return (
      <div className="app-container">
        <div className="ambient-background" />
        <motion.div
          className="landing-view"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* 로고 */}
          <header className="logo-header">
            <motion.div
              className="logo-box"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <img 
                src="/logo.png" 
                alt="두근두근타운 채집도감 로고" 
                className="logo-image" 
              />
            </motion.div>
          </header>

          {/* 모드 선택 */}
          <motion.div
            className="mode-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              className={`mode-btn mode-btn--available ${activeTab === 'available' ? 'active' : ''}`}
              onClick={() => setActiveTab('available')}
              whileTap={{ scale: 0.97 }}
            >
              🎣 현재 잡을 수 있는 도감
            </motion.button>
            <motion.button
              className={`mode-btn mode-btn--all ${activeTab === 'all' ? 'active' : ''}`}
              onClick={handleAllBook}
              whileTap={{ scale: 0.97 }}
            >
              📖 전체 도감 보기
            </motion.button>
          </motion.div>

          {/* 시간/날씨 설정 */}
          <AnimatePresence>
            {activeTab === 'available' && (
              <motion.div
                className="setup-card"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', stiffness: 250, damping: 25 }}
              >
                <div className="form-group">
                  <label className="form-label">⏰ 시간 설정</label>
                  <div className="current-time-display mode-custom-time">
                    <div className="custom-time-label">
                      <span className="current-time-clock">🕐</span>
                      <span className="current-time-value">기준 시간</span>
                    </div>
                    <input 
                      type="time" 
                      value={customTime} 
                      onChange={handleTimeChange} 
                      className="time-picker-glass"
                    />
                  </div>
                  <div className="time-slot-grid">
                    {timeSlots.map((slot, i) => (
                      <motion.button
                        key={slot.id}
                        className={`time-slot-card ${selectedTimeSlot === slot.id ? 'active' : ''} ${autoDetectedSlot === slot.id ? 'is-now' : ''}`}
                        style={selectedTimeSlot === slot.id ? {
                          borderColor: slot.color,
                          boxShadow: `0 0 20px ${slot.glow}`,
                        } : {}}
                        onClick={() => setSelectedTimeSlot(slot.id)}
                        whileTap={{ scale: 0.93 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                      >
                        <span className="time-slot-icon">{slot.icon}</span>
                        <div className="time-slot-text">
                          <span className="time-slot-label">{slot.label}</span>
                          <span className="time-slot-sub">{slot.sub}</span>
                        </div>
                        {autoDetectedSlot === slot.id && (
                          <span className="time-slot-now-badge">NOW</span>
                        )}
                      </motion.button>
                    ))}
                  </div>
                  {selectedTimeSlot !== autoDetectedSlot && (
                    <motion.p
                      className="time-slot-hint"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      💡 현재 시간과 다른 시간대를 선택했어요
                    </motion.p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">🌤️ 날씨 선택</label>
                  <div className="weather-grid">
                    {[
                      { id: 'sunny', label: '맑음', icon: '☀️', cls: 'weather-btn--sunny' },
                      { id: 'rain', label: '비/눈', icon: '🌧️', cls: 'weather-btn--rain' },
                      { id: 'rainbow', label: '무지개', icon: '🌈', cls: 'weather-btn--rainbow' },
                    ].map(w => (
                      <motion.button
                        key={w.id}
                        className={`weather-btn ${w.cls} ${selectedWeather === w.id ? 'active' : ''}`}
                        onClick={() => setSelectedWeather(w.id)}
                        whileTap={{ scale: 0.93 }}
                      >
                        <span className="weather-icon">{w.icon}</span>
                        <span className="weather-label">{w.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <motion.button
                  className="confirm-btn"
                  onClick={handleConfirm}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  ✨ 도감 열기
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <footer className="app-footer">
          <p>© 2026 두근두근타운 채집 도감 · Premium Edition</p>
        </footer>
      </div>
    );
  }

  // ===== 도감 화면 =====
  return (
    <div className="app-container">
      <div className="ambient-background" />
      <motion.div
        className="guide-view"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* 상단 네비게이션 */}
        <nav className="guide-nav">
          <motion.button
            className="back-btn"
            onClick={handleGoBack}
            whileTap={{ scale: 0.95 }}
          >
            ← 뒤로
          </motion.button>
          <div className="nav-badges">
            {activeTab === 'available' ? (
              <>
                <span className="nav-badge nav-badge--time">{getSlotInfo(selectedTimeSlot)?.icon} {getSlotInfo(selectedTimeSlot)?.label}</span>
                <span className="nav-badge nav-badge--weather">
                  {selectedWeather === 'sunny' ? '☀️' : selectedWeather === 'rain' ? '🌧️' : '🌈'}{' '}
                  {weatherLabel(selectedWeather)}
                </span>
              </>
            ) : (
              <span className="nav-badge nav-badge--all">📖 전체 도감</span>
            )}
          </div>
        </nav>

        {/* 필터 블록 */}
        <div className="filter-block">
          <div className="type-tabs">
            {[
              { id: 'fish', label: '물고기', icon: '🐟', cls: 'type-tab--fish' },
              { id: 'insect', label: '곤충', icon: '🐛', cls: 'type-tab--insect' },
              { id: 'bird', label: '새', icon: '🐦', cls: 'type-tab--bird' },
            ].map(type => (
              <motion.button
                key={type.id}
                className={`type-tab ${type.cls} ${selectedType === type.id ? 'active' : ''}`}
                onClick={() => {
                  setSelectedType(type.id);
                  setLocationFilter('');
                  setLevelFilter('all');
                }}
                whileTap={{ scale: 0.9 }}
              >
                <span className="tab-icon">{type.icon}</span>
                <span className="tab-label">{type.label}</span>
              </motion.button>
            ))}
          </div>

          <div className="detail-filters">
            <div className="filter-select-wrapper">
              <span className="filter-icon">📍</span>
              <select
                className="filter-select"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              >
                <option value="">모든 위치</option>
                {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
              </select>
            </div>
            <div className="filter-select-wrapper">
              <img src="/src/data/취미_nobg.png" className="filter-icon icon-money" alt="hobby" />
              <select
                className="filter-select"
                value={levelFilter}
                onChange={(e) => setLevelFilter(e.target.value)}
              >
                <option value="all">모든 취미레벨</option>
                {levels.map(lv => <option key={lv} value={lv}>취미레벨 {lv}</option>)}
              </select>
            </div>
            <button 
              className={`exclude-sunny-btn ${excludeSunny ? 'active' : ''}`}
              onClick={() => setExcludeSunny(!excludeSunny)}
              style={{
                padding: '6px 10px', fontSize: '11px', borderRadius: '8px', 
                background: excludeSunny ? 'rgba(255,107,157,0.2)' : 'rgba(255,255,255,0.05)',
                color: excludeSunny ? '#ff6b9d' : '#94a3b8',
                border: `1px solid ${excludeSunny ? 'rgba(255,107,157,0.4)' : 'rgba(255,255,255,0.1)'}`,
                cursor: 'pointer', transition: 'all 0.3s',
                whiteSpace: 'nowrap'
              }}
            >
              {excludeSunny ? '🚫 맑음 제외됨' : '🌤️ 맑음 제외하기'}
            </button>
          </div>
        </div>

        {/* 검색 */}
        <div className="search-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="이름으로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>

        {/* 통계 배너 */}
        <div className="stats-banner">
          <div className="stats-text">
            <strong>{filteredData.length}</strong> / {totalTypeCount}종
          </div>
          <div className="stats-progress-bar">
            <div
              className="stats-progress-fill"
              style={{ width: `${totalTypeCount > 0 ? (filteredData.length / totalTypeCount) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* 결과 카운트 */}
        <p className="result-count">
          <span className="count-num">{filteredData.length}</span>개의 {typeLabel(selectedType)}
          {activeTab === 'available' ? '를 잡을 수 있어요!' : '가 등록되어 있어요!'}
        </p>

        {/* 도감 카드 리스트 */}
        <div className="card-list">
          <AnimatePresence mode="popLayout">
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <motion.div
                  className="item-card"
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05, type: 'spring', stiffness: 300, damping: 30 }}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedItem(item);
                    window.history.pushState({ view: 'guide', modal: true }, '', '#detail');
                  }}
                >
                  <div className="item-image-wrapper">
                    <img src={item.image_url} alt={item.name} loading="lazy" referrerPolicy="no-referrer" style={{ transform: item.type === 'fish' ? 'scale(1.15)' : 'scale(1)' }} />
                  </div>
                  <div className="item-info">
                    <div className="item-top-row">
                      <span className="item-name">{item.name}</span>
                      <span className={`item-level item-level--${item.hobby_level}`}>
                        <span className="level-num">Lv.{item.hobby_level}</span>
                      </span>
                    </div>
                    <div className="item-desc" style={{display: 'flex', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '5px 0 10px', fontWeight: 'bold'}}>
                      {item.shadow_size && <span>그림자: {item.shadow_size}</span>}
                      {item.price && <span>가격: {item.price}</span>}
                    </div>
                    <div className="item-meta">
                      <span className="item-location">📍 {item.location}</span>
                      <div className="item-weathers">
                        {item.weathers.map(w => (
                          <span key={w} className="item-weather-tag">{weatherLabel(w)}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                className="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="empty-icon">🔍</div>
                <p>검색 결과가 없어요!</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* 상세 모달 */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => window.history.back()}
          >
            <motion.div
              className="modal-card"
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => window.history.back()}>✕</button>

              <div className="modal-image">
                <img src={selectedItem.image_url} alt={selectedItem.name} referrerPolicy="no-referrer" style={{ transform: selectedItem.type === 'fish' ? 'scale(1.15)' : 'scale(1)' }} />
              </div>

              <h2 className="modal-name">{selectedItem.name}</h2>

              <div className="modal-stats" style={{marginTop: '20px'}}>
                {selectedItem.shadow_size && (
                  <div className="modal-stat">
                    <div className="modal-stat-label">그림자</div>
                    <div className="modal-stat-value">{selectedItem.shadow_size}</div>
                  </div>
                )}
                <div className="modal-stat">
                  <div className="modal-stat-label">가격</div>
                  <div className="modal-stat-value" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'}}>
                    <img src="/src/data/돈_nobg.png" className="icon-money" alt="money" /> {selectedItem.price ? selectedItem.price : '-'}
                  </div>
                </div>
                <div className="modal-stat">
                  <div className="modal-stat-label">종류</div>
                  <div className="modal-stat-value">
                    {selectedItem.type === 'fish' ? '🐟' : selectedItem.type === 'insect' ? '🐛' : '🐦'}{' '}
                    {typeLabel(selectedItem.type)}
                  </div>
                </div>
                <div className="modal-stat">
                  <div className="modal-stat-label">레벨</div>
                  <div className="modal-stat-value" style={{display: 'flex', justifyContent: 'center', gap: '4px', alignItems: 'center'}}>
                    <img src="/src/data/취미_nobg.png" className="icon-money" alt="hobby" />
                    {selectedItem.hobby_level}
                  </div>
                </div>
                <div className="modal-stat">
                  <div className="modal-stat-label">위치</div>
                  <div className="modal-stat-value">📍 {selectedItem.location}</div>
                </div>
                <div className="modal-stat">
                  <div className="modal-stat-label">날씨</div>
                  <div className="modal-stat-value">
                    {selectedItem.weathers.map(w => weatherLabel(w)).join(', ')}
                  </div>
                </div>
                <div className="modal-stat" style={{ gridColumn: 'span 2' }}>
                  <div className="modal-stat-label">시간</div>
                  <div className="modal-stat-value">
                    {selectedItem.time_slots.length === 4 
                      ? '0-24' 
                      : selectedItem.time_slots.map(ts => timeSlotShortLabel(ts)).join(', ')}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="app-footer">
        <p>© 2026 두근두근타운 채집 도감 · Premium Edition</p>
      </footer>

      {/* 스크롤 투 탑 */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            className="scroll-top-btn"
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ↑
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

// ===================================================
// 두근두근타운 채집 도감 데이터
// 
// 데이터는 종류별 JSON 파일에서 관리합니다:
//   - fish.json    : 물고기 데이터
//   - insect.json  : 곤충 데이터
//   - bird.json    : 새 데이터
//
// 새로운 항목을 추가하려면 해당 JSON 파일을 열어서 수정하세요!
// ===================================================

import fishData from './fish.json';
import insectData from './insect.json';
import birdData from './bird.json';

// 3개의 JSON 파일을 하나로 합침
const collectionData = [...fishData, ...insectData, ...birdData];

export default collectionData;

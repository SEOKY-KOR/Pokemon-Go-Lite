'use strict';

// ===================================
// DOM 요소 가져오기
// ===================================
const mapContainer = document.getElementById('map-container');
const catchContainer = document.getElementById('catch-container');
const mapElement = document.getElementById('map');
const pokemonSprite = document.getElementById('pokemon-sprite');
const closeCatchViewButton = document.getElementById('close-catch-view');
const pokedexButton = document.getElementById('pokedex-button');
const pokedexContainer = document.getElementById('pokedex-container');
const pokedexGrid = document.getElementById('pokedex-grid');
const closePokedexButton = document.getElementById('close-pokedex');
const pokeballElement = document.getElementById('pokeball');
const pokeballThrowArea = document.getElementById('pokeball-throw-area'); // 몬스터볼 던지기 영역


// ===================================
// 게임 상태 및 설정 변수
// ===================================
let map;
let playerMarker;
const pokemonMarkers = [];
let currentCatchTarget = null;
let pokedexData = {};

const POKEMON_SPAWN_PROBABILITY = 0.3;
const CATCH_PROBABILITY = 0.5;
const POKEMON_DATA = [
    { id: 1, name: '이상해씨', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png' },
    { id: 4, name: '파이리', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png' },
    { id: 7, name: '꼬부기', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png' },
    { id: 10, name: '캐터피', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10.png' },
    { id: 13, name: '뿔충이', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/13.png' },
    { id: 16, name: '구구', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/16.png' },
    { id: 19, name: '꼬렛', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/19.png' },
    { id: 21, name: '깨비참', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/21.png' },
    { id: 23, name: '아보', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/23.png' },
    { id: 25, name: '피카츄', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png' },
    { id: 27, name: '모래두지', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/27.png' },
    { id: 29, name: '니드런♀', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/29.png' },
    { id: 32, name: '니드런♂', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/32.png' },
    { id: 35, name: '삐삐', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/35.png' },
    { id: 37, name: '식스테일', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/37.png' },
    { id: 39, name: '푸린', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/39.png' },
    { id: 41, name: '주뱃', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/41.png' },
    { id: 43, name: '뚜벅쵸', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/43.png' },
    { id: 50, name: '디그다', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/50.png' },
    { id: 52, name: '나옹', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/52.png' },
    { id: 54, name: '고라파덕', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/54.png' },
    { id: 56, name: '망키', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/56.png' },
    { id: 58, name: '가디', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/58.png' },
    { id: 60, name: '발챙이', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/60.png' },
    { id: 63, name: '캐이시', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/63.png' },
    { id: 66, name: '알통몬', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/66.png' },
    { id: 69, name: '모다피', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/69.png' },
    { id: 72, name: '왕눈해', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/72.png' },
    { id: 74, name: '꼬마돌', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/74.png' },
    { id: 77, name: '포니타', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/77.png' },
    { id: 81, name: '코일', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/81.png' },
    { id: 83, name: '파오리', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/83.png' },
    { id: 84, name: '두두', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/84.png' },
    { id: 86, name: '쥬쥬', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/86.png' },
    { id: 88, name: '질퍽이', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/88.png' },
    { id: 90, name: '셀러', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/90.png' },
    { id: 92, name: '고오스', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/92.png' },
    { id: 95, name: '롱스톤', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/95.png' },
    { id: 96, name: '슬리프', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/96.png' },
    { id: 98, name: '크랩', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/98.png' },
    { id: 100, name: '찌리리공', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/100.png' },
    { id: 102, name: '아라리', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/102.png' },
    { id: 104, name: '탕구리', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/104.png' },
    { id: 108, name: '내루미', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/108.png' },
    { id: 109, name: '또가스', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/109.png' },
    { id: 111, name: '뿔카노', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/111.png' },
    { id: 113, name: '럭키', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/113.png' },
    { id: 114, name: '덩쿠리', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/114.png' },
    { id: 115, name: '캥카', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/115.png' },
    { id: 116, name: '쏘드라', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/116.png' },
    { id: 118, name: '콘치', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/118.png' },
    { id: 120, name: '별가사리', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/120.png' },
    { id: 122, name: '마임맨', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/122.png' },
    { id: 123, name: '스라크', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/123.png' },
    { id: 124, name: '루주라', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/124.png' },
    { id: 125, name: '에레브', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/125.png' },
    { id: 126, name: '마그마', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/126.png' },
    { id: 127, name: '쁘사이저', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/127.png' },
    { id: 128, name: '켄타로스', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/128.png' },
    { id: 129, name: '잉어킹', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/129.png' },
    { id: 131, name: '라프라스', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/131.png' },
    { id: 132, name: '메타몽', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png' },
    { id: 133, name: '이브이', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/133.png' },
    { id: 137, name: '폴리곤', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/137.png' },
    { id: 138, name: '암나이트', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/138.png' },
    { id: 140, name: '투구', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/140.png' },
    { id: 142, name: '프테라', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/142.png' },
    { id: 143, name: '잠만보', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png' },
    { id: 147, name: '미뇽', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/147.png' },
    { id: 151, name: '뮤', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png' }
];

// 스와이프 감지를 위한 변수
let startY = 0; // 마우스/터치 다운 시 Y 좌표
let currentY = 0; // 마우스/터치 이동 중 Y 좌표
let isDragging = false;
const SWIPE_THRESHOLD = 50; // 이 값보다 더 위로 스와이프해야 던져짐

// 몬스터볼의 초기 X, Y 위치 (마우스/터치 시작 시 몬스터볼 내부에서의 상대 위치)
let offsetX = 0;
let offsetY = 0;

// 날씨 관련 변수 (시뮬레이션)
const WEATHER_CONDITIONS = ['clear', 'rainy', 'snowy', 'cloudy'];
let currentWeatherData = 'clear';

// ===================================
// 지도 관리 모듈
// ===================================
function initMap(lat, lng) {
    if (map) {
        map.remove();
    }
    map = L.map('map').setView([lat, lng], 17);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // 플레이어 마커 이미지를 지우 이미지로 변경
    const playerIcon = L.icon({
        iconUrl: 'https://i.namu.wiki/i/BlHJWPt7_Vvv1YP8dgsQGjCTPSLW9ioANCkCypunj-NhYND5tnh7ihWEo_QTjIbByMM2F_dt0zk0bK2frqsMsABPKSIGFwZY6yJtnpoWBId-_7HFAgBL-p9xWrqyc6Wg7F-Dtg62cvBGE2CWUAQpxg.webp', // Ash (지우) 이미지 URL, 필요에 따라 변경하세요
        iconSize: [40, 40],
    });
    playerMarker = L.marker([lat, lng], { icon: playerIcon }).addTo(map);
    playerMarker.bindPopup("나의 위치").openPopup();
}

// ===================================
// 포켓몬 관리 모듈
// ===================================
function spawnPokemon(playerLat, playerLng) {
    // 이미 존재하는 포켓몬 마커와 너무 가까운 곳에 스폰되지 않도록 처리
    for (const marker of pokemonMarkers) {
        const markerLatLng = marker.getLatLng();
        const distance = L.latLng(playerLat, playerLng).distanceTo(markerLatLng);
        if (distance < 50) { // 50미터 이내에는 스폰하지 않음
            return;
        }
    }

    const latOffset = (Math.random() - 0.5) * 0.001;
    const lngOffset = (Math.random() - 0.5) * 0.001;
    const spawnLat = playerLat + latOffset;
    const spawnLng = playerLng + lngOffset;

    const randomPokemon = POKEMON_DATA[Math.floor(Math.random() * POKEMON_DATA.length)];

    const pokemonIcon = L.icon({
        iconUrl: randomPokemon.image,
        iconSize: [60, 60],
    });

    const marker = L.marker([spawnLat, spawnLng], { icon: pokemonIcon }).addTo(map);
    marker.on('click', () => {
        console.log(`${randomPokemon.name}을(를) 만났다!`);
        currentCatchTarget = { pokemon: randomPokemon, marker: marker };
        showCatchScreen(randomPokemon);
    });

    pokemonMarkers.push(marker);
}

// ===================================
// 날씨 관리 모듈
// ===================================
function simulateWeatherChange() {
    const randomIndex = Math.floor(Math.random() * WEATHER_CONDITIONS.length);
    currentWeatherData = WEATHER_CONDITIONS[randomIndex];
    console.log(`현재 날씨: ${currentWeatherData}`);
}

function applyWeatherBackground() {
    WEATHER_CONDITIONS.forEach(condition => {
        catchContainer.classList.remove(`weather-${condition}`);
    });
    catchContainer.classList.add(`weather-${currentWeatherData}`);
}


// ===================================
// 포획 화면 관리 모듈
// ===================================
function showCatchScreen(pokemon) {
    mapContainer.classList.add('hidden');
    catchContainer.classList.remove('hidden');

    pokemonSprite.src = pokemon.image;

    // 몬스터볼 위치 초기화: 중앙 하단으로
    pokeballElement.classList.remove('pokeball-thrown'); // 던지기 애니메이션 클래스 제거
    pokeballElement.style.transition = 'none'; // 위치 초기화 시 애니메이션 방지

    // CSS의 flexbox 정렬을 따르도록 left/top/transform 속성 제거
    // 이 속성들은 마우스 드래그 중에만 적용되고, 초기 상태에서는 CSS에 의해 결정되어야 함.
    pokeballElement.style.left = '';
    pokeballElement.style.top = '';
    pokeballElement.style.transform = '';
    pokeballElement.style.bottom = '20px'; // CSS에 정의된 초기 bottom 값과 일치 (선택 사항)

    pokeballElement.style.pointerEvents = 'auto'; // 마우스 이벤트 다시 활성화
    pokeballElement.style.cursor = 'grab'; // 커서 변경

    applyWeatherBackground();
}

function hideCatchScreen() {
    catchContainer.classList.add('hidden');
    mapContainer.classList.remove('hidden');

    currentCatchTarget = null;
}

function attemptCatch() {
    if (!currentCatchTarget) return;

    pokeballElement.classList.add('pokeball-thrown'); // 던지기 애니메이션 시작
    pokeballElement.style.pointerEvents = 'none'; // 던지는 중에는 다시 클릭/드래그 방지
    pokeballElement.style.cursor = 'default';

    // 몬스터볼이 날아가면서 포켓몬에 도달하는 애니메이션을 위한 최종 위치 설정 (선택 사항)
    // pokeballElement.style.transform = `translate(${pokemonSprite.offsetLeft - pokeballElement.offsetLeft}px, ${pokemonSprite.offsetTop - pokeballElement.offsetTop}px)`;


    setTimeout(() => {
        if (Math.random() < CATCH_PROBABILITY) {
            alert(`${currentCatchTarget.pokemon.name}을(를) 잡았다!`);
            addToPokedex(currentCatchTarget.pokemon);

            map.removeLayer(currentCatchTarget.marker);
            const index = pokemonMarkers.indexOf(currentCatchTarget.marker);
            if (index > -1) {
                pokemonMarkers.splice(index, 1);
            }
        } else {
            alert(`${currentCatchTarget.pokemon.name}이(가) 도망갔다...`);
        }
        hideCatchScreen();
        // 몬스터볼 던지기 애니메이션이 끝난 후 초기화
        pokeballElement.classList.remove('pokeball-thrown');
        pokeballElement.style.transition = 'none'; // 다시 애니메이션 비활성화 (위치 복귀 시 갑자기 움직이지 않도록)
        pokeballElement.style.left = '';
        pokeballElement.style.top = '';
        pokeballElement.style.transform = '';
        pokeballElement.style.bottom = '20px'; // 초기 bottom 값으로 복귀
        pokeballElement.style.pointerEvents = 'auto'; // 다음 포획을 위해 다시 활성화
        pokeballElement.style.cursor = 'grab';
    }, 800);
}


// ===================================
// 도감 관리 모듈
// ===================================
function loadPokedexData() {
    const savedData = localStorage.getItem('pokedexData');
    if (savedData) {
        pokedexData = JSON.parse(savedData);
        console.log("도감 데이터를 불러왔습니다.", pokedexData);
    }
}

function savePokedexData() {
    localStorage.setItem('pokedexData', JSON.stringify(pokedexData));
    console.log("도감 데이터를 저장했습니다.");
}

function addToPokedex(pokemon) {
    if (!pokedexData[pokemon.id]) {
        pokedexData[pokemon.id] = { caught: true, name: pokemon.name, image: pokemon.image };
        savePokedexData();
    }
}

function renderPokedex() {
    pokedexGrid.innerHTML = '';

    POKEMON_DATA.forEach(pokemon => {
        const isCaught = pokedexData[pokemon.id]?.caught;
        const entry = document.createElement('div');
        entry.className = 'pokedex-entry';
        if (!isCaught) {
            entry.classList.add('not-caught');
        }

        const img = document.createElement('img');
        img.src = pokemon.image;
        
        const name = document.createElement('p');
        name.textContent = isCaught ? pokemon.name : '???';

        entry.appendChild(img);
        entry.appendChild(name);
        pokedexGrid.appendChild(entry);
    });
}

function showPokedex() {
    mapContainer.classList.add('hidden');
    renderPokedex();
    pokedexContainer.classList.remove('hidden');
}

function hidePokedex() {
    pokedexContainer.classList.add('hidden');
    mapContainer.classList.remove('hidden');
}

// ===================================
// 이벤트 리스너 연결
// ===================================
closeCatchViewButton.addEventListener('click', hideCatchScreen);
pokedexButton.addEventListener('click', showPokedex);
closePokedexButton.addEventListener('click', hidePokedex);

// 몬스터볼 마우스/터치 드래그 및 스와이프 감지 이벤트 리스너
// 몬스터볼을 잡는 순간
pokeballElement.addEventListener('mousedown', (e) => {
    // 포획 화면이 아닐 때는 작동하지 않음
    if (catchContainer.classList.contains('hidden')) return; 
    
    isDragging = true;
    startY = e.clientY; // 마우스 다운 시 Y 위치 저장
    
    // 몬스터볼의 현재 위치를 기준으로 마우스 포인터와의 상대적인 offset 계산
    const rect = pokeballElement.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    pokeballElement.style.transition = 'none'; // 드래그 중에는 애니메이션 비활성화
    pokeballElement.style.cursor = 'grabbing'; // 커서 변경
});

pokeballElement.addEventListener('touchstart', (e) => {
    // 포획 화면이 아닐 때는 작동하지 않음
    if (catchContainer.classList.contains('hidden')) return;

    isDragging = true;
    const touch = e.touches[0];
    startY = touch.clientY; // 터치 다운 시 Y 위치 저장
    
    const rect = pokeballElement.getBoundingClientRect();
    offsetX = touch.clientX - rect.left;
    offsetY = touch.clientY - rect.top;

    pokeballElement.style.transition = 'none';
    e.preventDefault(); // 모바일 스크롤 방지
});


// 마우스/터치 이동 중 몬스터볼 위치 업데이트 (document에 바인딩)
document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    // 몬스터볼 던지기 영역 내부로 제한
    const throwAreaRect = pokeballThrowArea.getBoundingClientRect();

    let newX = e.clientX - offsetX;
    let newY = e.clientY - offsetY;

    // x축 제한: 던지기 영역 왼쪽 경계부터 오른쪽 경계 - 몬스터볼 너비
    newX = Math.max(throwAreaRect.left, Math.min(newX, throwAreaRect.right - pokeballElement.offsetWidth));
    // y축 제한: 던지기 영역 상단 경계부터 하단 경계 - 몬스터볼 높이
    newY = Math.max(throwAreaRect.top, Math.min(newY, throwAreaRect.bottom - pokeballElement.offsetHeight));

    pokeballElement.style.left = `${newX}px`;
    pokeballElement.style.top = `${newY}px`;
    pokeballElement.style.transform = 'none'; // left/top으로 위치 지정 시 transform 초기화
    
    currentY = e.clientY; // 현재 Y 위치 업데이트
});

document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    e.preventDefault(); // 기본 드래그 동작(스크롤 등) 방지

    const touch = e.touches[0];
    const throwAreaRect = pokeballThrowArea.getBoundingClientRect();

    let newX = touch.clientX - offsetX;
    let newY = touch.clientY - offsetY;

    newX = Math.max(throwAreaRect.left, Math.min(newX, throwAreaRect.right - pokeballElement.offsetWidth));
    newY = Math.max(throwAreaRect.top, Math.min(newY, throwAreaRect.bottom - pokeballElement.offsetHeight));

    pokeballElement.style.left = `${newX}px`;
    pokeballElement.style.top = `${newY}px`;
    pokeballElement.style.transform = 'none';
    
    currentY = touch.clientY; // 현재 Y 위치 업데이트
});


// 마우스/터치에서 손을 떼는 순간 (던지기 판별)
document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;

    // 스와이프 거리 계산: (시작 Y - 현재 Y) -> 위로 움직이면 양수
    const swipeDistance = startY - currentY; 

    if (swipeDistance > SWIPE_THRESHOLD) {
        attemptCatch();
    } else {
        // 던지지 않았다면 초기 위치로 복귀 (CSS의 초기값으로)
        pokeballElement.style.transition = 'left 0.2s ease-out, top 0.2s ease-out, transform 0.2s ease-out';
        pokeballElement.style.left = ''; // CSS에 맡김
        pokeballElement.style.top = ''; // CSS에 맡김
        pokeballElement.style.transform = ''; // CSS에 맡김
        pokeballElement.style.bottom = '20px'; // CSS에 정의된 초기 bottom 값과 일치
    }
    pokeballElement.style.cursor = 'grab'; // 커서 복귀
});

document.addEventListener('touchend', () => {
    if (!isDragging) return;
    isDragging = false;

    const swipeDistance = startY - currentY;

    if (swipeDistance > SWIPE_THRESHOLD) {
        attemptCatch();
    } else {
        pokeballElement.style.transition = 'left 0.2s ease-out, top 0.2s ease-out, transform 0.2s ease-out';
        pokeballElement.style.left = '';
        pokeballElement.style.top = '';
        pokeballElement.style.transform = '';
        pokeballElement.style.bottom = '20px';
    }
    // 터치에서는 cursor 속성이 적용되지 않으므로 굳이 변경할 필요는 없음
});


// ===================================
// 키보드 이벤트로 플레이어 마커 이동 기능
// ===================================
document.addEventListener('keydown', (e) => {
    if (!map || !playerMarker) return;

    // 포획 화면일 때는 키보드 이동을 막습니다.
    if (!catchContainer.classList.contains('hidden')) {
        return;
    }

    const moveAmount = 0.00005; // 마커 이동 거리 (미세 조정 가능)
    let currentLatLng = playerMarker.getLatLng();
    let newLat = currentLatLng.lat;
    let newLng = currentLatLng.lng;

    switch (e.key) {
        case 'ArrowUp':
            newLat += moveAmount;
            break;
        case 'ArrowDown':
            newLat -= moveAmount;
            break;
        case 'ArrowLeft':
            newLng -= moveAmount;
            break;
        case 'ArrowRight':
            newLng += moveAmount;
            break;
        default:
            return;
    }

    playerMarker.setLatLng([newLat, newLng]);
    map.setView([newLat, newLng], map.getZoom());

    // 플레이어 마커 이동 후, 일정 확률로 포켓몬 스폰 시도
    if (Math.random() < POKEMON_SPAWN_PROBABILITY) {
        spawnPokemon(newLat, newLng);
    }
});


// ===================================
// 앱 시작
// ===================================
loadPokedexData();
simulateWeatherChange();
setInterval(simulateWeatherChange, 30000);

if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            initMap(latitude, longitude);
            spawnPokemon(latitude, longitude); // 초기 위치에서 포켓몬 한 번 스폰
        },
        (error) => {
            console.error("초기 위치를 가져올 수 없습니다:", error);
            alert("위치 권한을 허용해주세요! 기본 위치로 시작합니다.");
            const defaultLat = 37.5665; // 서울 시청 기본 위치
            const defaultLng = 126.9780;
            initMap(defaultLat, defaultLng);
            spawnPokemon(defaultLat, defaultLng); // 기본 위치에서 포켓몬 스폰
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }
    );
} else {
    alert("이 브라우저는 위치 추적을 지원하지 않습니다. 기본 위치로 시작합니다.");
    const defaultLat = 37.5665; // 서울 시청 기본 위치
    const defaultLng = 126.9780;
    initMap(defaultLat, defaultLng);
    spawnPokemon(defaultLat, defaultLng); // 기본 위치에서 포켓몬 스폰
}

const FINAL_LINK = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; // ← tu wstaw swój link 😄
let finalUnlocked = false;

const TEST_MODE = false;
const TEST_OPENED = [1, 5, 14];

// Zawartość dla każdego dnia — 24 elementy
const DAY_CONTENT = [
  "",
  "Mandarynka 🍊",
  "Zupka OYOKATA 🍜",
  "Maseczka ISANA ",
  "RedBull ⚡",
  "Haribo złote",
  "Mikołaj czekoladowy 🎅🍫",
  "KinderJoy + owocki🍒",
  "Haribo cola ",
  "HappyHippo",
  "Czypsy 🍟",
  "Orbit gum ",
  "Wywar z Igi 🧪✨",
  "KinderJoy ",
  "„iPhone” ",
  "Lizak ",
  "Dare ",
  "KinderJoy ",
  "Hydrożel ISANA ",
  "Złota monetka ",
  "Haribo żółte ",
  "Owocki jeżynki ",
  "Oreło ⚫",
  "Pieguski 🍪",
  "LipBalm + owocki🍑"
];



const calendar = document.querySelector('.calendar');

/* ====== TASOWANIE NUMERÓW (1-24) ====== */
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const shuffledNumbers = shuffle([...Array(24).keys()].map(n => n + 1));

/* ====== TWORZENIE PREZENTÓW ====== */
for (let idx = 0; idx < 24; idx++) {
  const number = shuffledNumbers[idx];
  const door = document.createElement('div');
  door.classList.add('door');

  // Dodanie numeru
  const numberText = document.createElement('span');
  numberText.classList.add('day-number');
  numberText.textContent = number;
  door.appendChild(numberText);

  // KOLOR PREZENTU (ZAPISANY W PAMIĘCI)
  let savedColor = localStorage.getItem(`color-${number}`);

  if (!savedColor) {
    savedColor = Math.random() > 0.5 ? "red" : "green";
    localStorage.setItem(`color-${number}`, savedColor);
  }

  door.dataset.color = savedColor;
  door.classList.add(`closed-${savedColor}`);

  // MOCK STANU OTWARTOŚCI
  if (TEST_MODE && TEST_OPENED.includes(number)) {
    door.classList.remove(`closed-${savedColor}`);
    door.classList.add(`opened-${savedColor}`);
  }

  door.addEventListener('click', () => openDoor(number, door));
  calendar.appendChild(door);
}


/* ====== KLIKNIĘCIE PREZENTU ====== */
function openDoor(number, element) {
  const today = new Date().getDate();
  const color = element.dataset.color;
  const isAlreadyOpened = element.classList.contains(`opened-${color}`);

  // Jeśli już otwarty → zawsze pozwól zobaczyć niespodziankę
  if (isAlreadyOpened) {
    showModal(color,number);
    return;
  }

  if (!isAlreadyOpened) {
  const sound = document.getElementById("open-sound");
  sound.currentTime = 0; // restart jeśli klikane szybko
  sound.play();
}

  // Jeśli jeszcze nie otwarty → sprawdź datę
  if (!TEST_MODE && number !== today) {
    alert("Jeszcze nie czas! 🎅");
    return;
  }

  // Otwórz prezent 🎁
  element.classList.remove(`closed-${color}`);
  element.classList.add(`opened-${color}`);
  localStorage.setItem(`door-${number}`, "opened");

  // Jeśli to 24 dzień → odpal finał!
if (number === 24) {
  finalUnlocked = true; // ale jeszcze nic nie pokazujemy!
}

  showModal(color,number);

}



/* ====== WGRYWANIE ZAPISANEGO STANU ====== */
window.addEventListener('load', () => {
  if (TEST_MODE) {
    // W trybie testowym zawsze czyścimy zapisane otwarcia
    for (let i = 1; i <= 24; i++) {
      localStorage.removeItem(`door-${i}`);
    }

    // A otwarte mają być TYLKO te z TEST_OPENED
    const doors = document.querySelectorAll('.door');
    TEST_OPENED.forEach(num => {
      const door = Array.from(doors)
        .find(d => d.querySelector('.day-number').textContent == num);

      if (!door) return;
      const color = door.dataset.color;
      door.classList.remove(`closed-${color}`);
      door.classList.add(`opened-${color}`);
    });
  } else {
    // W normalnym trybie — zachowujemy zapis użytkownika
    const doors = document.querySelectorAll('.door');
    for (let i = 1; i <= 24; i++) {
      if (localStorage.getItem(`door-${i}`) === "opened") {
        const door = Array.from(doors)
          .find(d => d.querySelector('.day-number').textContent == i);

        if (!door) return;
        const color = door.dataset.color;
        door.classList.remove(`closed-${color}`);
        door.classList.add(`opened-${color}`);
      }
    }
  }
});



/* ====== MODAL ====== */
function showModal(color, number) {
  const modal = document.querySelector('.modal');
  const img = document.getElementById('modal-present');
  const text = document.getElementById('modal-text');

  img.src = color === "red"
    ? "img/red-opened.png"
    : "img/green-opened.png";

  text.textContent = DAY_CONTENT[number];

  modal.classList.add('active');
}

function showFinal() {
  const finalMessage = document.getElementById("final-message");

  finalMessage.textContent = "Merry Christmas Baby! 🎄❤️";
  finalMessage.classList.add("visible");

  // otwiera link do piosenki
  window.open(FINAL_LINK, "_blank");
}


document.querySelector('.modal').addEventListener('click', (e) => {
  // Jeśli kliknięto TŁO (poza modal-content)
  if (e.target.classList.contains('modal')) {
    e.target.classList.remove('active');
  }
  if (finalUnlocked) {
    showFinal();
    finalUnlocked = false; // reset, żeby nie odpaliło drugi raz
  }
});


// ❄️ Generowanie płatków śniegu
function createSnow() {
  const snow = document.createElement('div');
  snow.classList.add('snowflake');
  snow.textContent = '❄';

  // Losowa pozycja i prędkość
  snow.style.left = Math.random() * 100 + 'vw';
  snow.style.animationDuration = (3 + Math.random() * 5) + 's';

  document.body.appendChild(snow);

  // Usuwamy płatek po zakończeniu animacji
  setTimeout(() => snow.remove(), 8000);
}

// Tworzymy śnieg co 150 ms
setInterval(createSnow, 150);



localStorage.clear();

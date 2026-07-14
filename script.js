const PASSWORD = "Kuku1507";
let celebrationStarted = false;

function checkPassword() {
  const input = document.getElementById("password").value;

  if (input !== PASSWORD) {
    document.getElementById("error").innerHTML = "Wrong Password";

    return;
  }

  document.getElementById("loginBox").style.display = "none";

  document.getElementById("birthdayPage").style.display = "flex";

  startMic();
}

async function startMic() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
      },
    });

    const audio = new AudioContext();

    const analyser = audio.createAnalyser();

    analyser.fftSize = 1024;

    const source = audio.createMediaStreamSource(stream);

    source.connect(analyser);

    const data = new Uint8Array(analyser.fftSize);

    const flames = [...document.querySelectorAll(".flame")];

    let candleIndex = 0;

    function detect() {
      analyser.getByteTimeDomainData(data);

      let sum = 0;

      for (let i = 0; i < data.length; i++) {
        const x = (data[i] - 128) / 128;

        sum += x * x;
      }

      const volume = Math.sqrt(sum / data.length);

      if (volume > 0.03) {
        let candlesToRemove = Math.floor(volume * 60);

        candlesToRemove = Math.max(1, candlesToRemove);

        while (candlesToRemove-- && candleIndex < flames.length) {
          flames[candleIndex].classList.add("off");

          createSmoke(flames[candleIndex]);

          candleIndex++;
        }

        if (candleIndex >= flames.length && !celebrationStarted) {
          celebrationStarted = true;

          setTimeout(showBirthdayMessage, 1200);
        }
      }
      requestAnimationFrame(detect);
    }

    detect();
  } catch (e) {
    console.log(e);
  }
}

function createSmoke(flame) {
  const smoke = document.createElement("div");

  smoke.className = "smoke";

  const rect = flame.getBoundingClientRect();

  smoke.style.left = rect.left + "px";

  smoke.style.top = rect.top + "px";

  document.body.appendChild(smoke);

  setTimeout(() => smoke.remove(), 2500);
}

function showBirthdayMessage() {
  // Create message and place it INSIDE the .scene column so it
  // stacks under the cake instead of becoming a sibling flex item
  // of <body> (which was causing the side-by-side overlap bug).
  const msg = document.createElement("div");

  msg.className = "birthdayMessage";

  msg.innerHTML = `
        <h1>
          <span class="msg-text">Once again, Happy Birthday</span>
          <span class="msg-emoji">🎉</span>
        </h1>
        <p>Wishing You Happiness, Health &amp; Success ❤️</p>
    `;

  const scene = document.querySelector(".scene");
  scene.appendChild(msg);

  startConfetti();

  startFireworks();

  createBalloons();
}

function startConfetti() {
  const duration = 12000;

  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 6,

      spread: 70,

      origin: {
        x: Math.random(),
        y: Math.random() - 0.2,
      },
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

function startFireworks() {
  setInterval(() => {
    confetti({
      particleCount: 150,

      spread: 120,

      startVelocity: 65,

      origin: {
        x: Math.random(),
        y: Math.random() * 0.4,
      },

      colors: [
        "#ff0000",
        "#ffff00",
        "#00ffff",
        "#ff00ff",
        "#00ff00",
        "#ffffff",
      ],
    });
  }, 900);
}

function createBalloons() {
  // Balloons go into the fixed #balloonLayer overlay, not <body>,
  // so they never interfere with the page's flex layout.
  const layer = document.getElementById("balloonLayer");

  for (let i = 0; i < 25; i++) {
    let balloon = document.createElement("div");

    balloon.className = "balloon";

    balloon.style.left = Math.random() * 100 + "vw";

    balloon.style.animationDuration = 8 + Math.random() * 8 + "s";

    balloon.style.background = `hsl(${Math.random() * 360},90%,60%)`;

    layer.appendChild(balloon);
  }
}

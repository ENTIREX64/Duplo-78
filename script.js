if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
  
    const startButton = document.getElementById('start-btn');
    const statusText = document.getElementById('status');
    const commandOutput = document.getElementById('command-output');
    const backgroundMusic = document.getElementById('background-music');
    const heading = document.querySelector('h1');
    const calculator = document.getElementById('calculator');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultSpan = document.getElementById('result');
    const menuBtn = document.getElementById('menu-btn');
    const functionMenu = document.getElementById('function-menu');
    const closeBtn = document.getElementById('close-btn');
    const functionList = document.getElementById('function-list');
    const hoverMessage = document.getElementById('hover-message');
  
    // Set predefined volume for the music
    backgroundMusic.volume = 0.5;
  
    // Disable scrolling initially
    document.body.classList.add('no-scroll');
    heading.classList.add('gliding');
  
    console.log('%cHey there! Find out what the program thinks you are saying here.', 'font-size: 30px; font-weight: bold; color: #00408a; text-align: center;');
  
    functionList.querySelectorAll('li').forEach(item => {
      item.addEventListener('mouseover', (event) => {
        const message = event.target.getAttribute('data-message');
        hoverMessage.textContent = message;
        hoverMessage.style.display = 'block';
        hoverMessage.style.top = `${event.clientY + 10}px`; 
        hoverMessage.style.left = `${event.clientX + 10}px`;
      });
    
      item.addEventListener('mouseout', () => {
        hoverMessage.style.display = 'none'; 
      });
    });
  
    menuBtn.addEventListener('click', () => {
        functionMenu.style.display = 'flex';
    });
  
    closeBtn.addEventListener('click', () => {
        functionMenu.style.display = 'none';
    });
  
    window.addEventListener('click', (event) => {
        if (event.target === functionMenu) {
            functionMenu.style.display = 'none';
        }
    });
  
    startButton.addEventListener('click', () => {
        recognition.start();
        statusText.textContent = 'Listening... Please speak.';
        statusText.classList.add('listening');
        heading.classList.remove('gliding');
    });
  
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        console.log("Transcript recorded: ", transcript);
        commandOutput.textContent = `You said: "${transcript}"`
        heading.classList.add('gliding');
        handleCommands(transcript);
    };
  
    recognition.onerror = (event) => {
        setCommandOutput('Error occurred: ' + event.error);
        statusText.classList.remove('listening');
        heading.classList.add('gliding');
    };
  
    recognition.onend = () => {
        statusText.textContent = 'Stopped listening. Press the button to try again.';
        statusText.classList.remove('listening');
        heading.classList.add('gliding');
    };
  
    function handleCommands(transcript) {
      try {
          if (transcript.includes('background')) {
              changeBackground(transcript);
          } else if (transcript.includes('calculator')) {
              toggleCalculator(transcript);
          } else if (transcript.includes('go to')) {
              openApplication(transcript);
          } else if (transcript.includes('music')) {
              controlMusic(transcript);
          } else if (transcript.includes('reset')) {
              location.reload();
          } else if (transcript.includes('what is the date and time')) {
              announceDateTime();
          } else if (transcript.includes('weather in')) {
              const city = transcript.split('weather in')[1].trim();
              getWeatherInfo(city);
          } else if (transcript.includes('tell a joke')) {
              getJoke();
          } else if (transcript.includes('fact')) {
             tellAFact();
          } else if (transcript.includes('news')) {
            fetchNews();
          } else {
              setCommandOutput('Sorry, I didn\'t understand that.');
          }
      } catch (error) {
          console.error("Error handling command: ", error);
          setCommandOutput('An error occurred while processing your command.');
      } finally {
          statusText.textContent = 'Press the button and say another command.';
          statusText.classList.remove('listening');
          heading.classList.add('gliding');
      }
    }
  
    function setCommandOutput(message) {
        commandOutput.textContent = message;
        speakText(message);
    }
  
    function speakText(message) {
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
    }
  
    function changeBackground(transcript) {
        const colors = ['blue', 'red', 'green', 'yellow', 'orange', 'magenta', 'black', 'white', 'purple', 'turquoise'];
        const foundColor = colors.find(color => transcript.includes(color));
        if (foundColor) {
            document.body.style.backgroundColor = foundColor;
            setCommandOutput(`Changed background to ${foundColor}`);
        } else {
            setCommandOutput('Sorry, I didn\'t recognize the color.');
        }
    }
  
    function openApplication(transcript) {
        const apps = {
            youtube: 'https://www.youtube.com',
            google: 'https://www.google.com',
            instagram: 'https://www.instagram.com',
            facebook: 'https://www.facebook.com',
            firefox: 'https://www.firefox.com',
            spotify: 'https://open.spotify.com',
            amazon: 'https://www.amazon.in',
            twitter: 'https://www.twitter.com',
            linkedin: 'https://www.linkedin.com',
            pinterest: 'https://www.pinterest.com',
            reddit: 'https://www.reddit.com',
            netflix: 'https://www.netflix.com',
        };
  
        const appFound = Object.keys(apps).find(app => transcript.includes(app));
        if (appFound) {
            window.open(apps[appFound]);
            setCommandOutput(`Here's ${appFound}`);
        } else {
            setCommandOutput('Sorry, I didn\'t recognize the app.');
        }
    }
  
    function controlMusic(transcript) {
        if (transcript.includes('play')) {
            backgroundMusic.play();
            backgroundMusic.currentTime = 13.76;
            setCommandOutput('Playing music...');
        } else if (transcript.includes('pause')) {
            backgroundMusic.pause();
            setCommandOutput('Paused');
        } else if (transcript.includes('stop')) {
            backgroundMusic.pause();
            backgroundMusic.currentTime = 13.76;
            setCommandOutput('');
        }
    }
  
    function toggleCalculator(transcript) {
        if (transcript.includes('open the calculator')) {
            calculator.style.display = 'block';
            setCommandOutput('Scroll down to access the calculator');
            document.body.classList.remove('no-scroll');
        } else if (transcript.includes('close the calculator')) {
            calculator.style.display = 'none';
            document.body.classList.add('no-scroll');
        }
  
        calculateBtn.addEventListener('click', () => {
            const num1 = parseFloat(document.getElementById('num1').value);
            const operator = document.getElementById('operator').value;
            const num2 = parseFloat(document.getElementById('num2').value);
            let result;
  
            if (!isNaN(num1) && !isNaN(num2)) {
                switch (operator) {
                    case '+':
                        result = num1 + num2;
                        break;
                    case '-':
                        result = num1 - num2;
                        break;
                    case '*':
                        result = num1 * num2;
                        break;
                    case '/':
                        result = num1 / num2;
                        break;
                    default:
                        result = 'Invalid operation';
                }
                resultSpan.textContent = result;
                speakText(`The result is ${result}`);
            } else {
                resultSpan.textContent = 'Please enter valid numbers';
            }
        });
    }
  
    function announceDateTime() {
      const currentDateTime = getCurrentDateTime();
      setCommandOutput(`The current date and time is: ${currentDateTime}`);
    }
  
    function getCurrentDateTime() {
      const now = new Date();
      const options = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
      };
  
      return now.toLocaleString('en-US', options);
    }

      // Function to fetch weather data from the OpenWeatherMap API
      async function fetchWeather(city) {
        const apiKey = 'cb055688292138eb0d20670465c7e954'; // Replace with your OpenWeatherMap API key
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('City not found');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching weather:', error);
            return null;
        }
    }
  
    async function getWeatherInfo(city) {
      const weatherData = await fetchWeather(city);
  
      if (weatherData) {
          const description = weatherData.weather[0].description;
          const temp = weatherData.main.temp;
          const cityName = weatherData.name;
  
          const weatherText = `The weather in ${cityName} is currently ${description} with a temperature of ${temp} degrees Celsius.`;
          setCommandOutput(weatherText);
      } else {
          setCommandOutput('Sorry, I could not retrieve the weather for that location.');
      }
    }
  
    function getJoke() {
      fetch('https://official-joke-api.appspot.com/random_joke')
          .then(response => response.json())
          .then(data => {
              const joke = `${data.setup} ... ${data.punchline}`;
              setCommandOutput(joke);
          })
          .catch(error => {
              setCommandOutput('Sorry, I could not fetch a joke.');
          });
    }
  
    function tellAFact() {
      fetch('http://numbersapi.com/random/trivia')
          .then(response => {
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              return response.text();
          })
          .then(data => {
              setCommandOutput(data);
          })
          .catch(error => {
              setCommandOutput('Sorry, I could not fetch a fact.');
          });
    }

    function fetchNews() {
    const apiKey = '15e6ed2a6de9468eb73a09cede2a9d7c';
    const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching news');
            }
            return response.json();
        })
        .then(data => {
            displayNewsInCommandOutput(data.articles);
        })
        .catch(error => {
            console.error('Error:', error);
            commandOutput.textContent = 'Sorry, unable to fetch news at the moment.';
        });
}

function displayNewsInCommandOutput(articles) {
    if (articles.length === 0) {
        commandOutput.textContent = 'No news articles found.';
        return;
    }

    let newsContent = 'Here are the latest news headlines:\n\n';
    articles.slice(0, 3).forEach((article, index) => {
        newsContent += `${index + 1}. ${article.title}\n`;
    });

    commandOutput.textContent = newsContent;
    speakText('Here are the latest news headlines.')
}
  
  } else {
    alert('Sorry, your browser does not support the Web Speech API.');
  }  

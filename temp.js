const form = document.querySelector('.top-banner form');
const input = document.querySelector('.top-banner input');
const msg = document.querySelector('.top-banner .msg');
const list = document.querySelector('.building .cities');
const apiKey = '1dca8b306a1b627e8d7c4dfd8813b78e';
let index = 0;
let temp = [];


async function calculateAverage(average) {
  let total = 0;
  let count = 0;

average.forEach(function(item, _index) {
  total += item;
  count++;
});

return total / count;
}

$(document).ready(function () {
  $('button').click(function () {
    $('p').hide();
  });
});

$(document).ready(function () {
  /*! Fades in page on load */
  $('body').css('display', 'none');
  $('body').fadeIn(2000);
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log();
  let inputVal = input.value;

  const listItems = list.querySelectorAll('.building .city');
  const listItemsArray = Array.from(listItems);

  //built-in array filter
  if (listItemsArray.length > 0) {
    const filteredArray = listItemsArray.filter((el) => {
      let content = '';

      if (inputVal.includes(',')) {
        if (inputVal.split(',')[1].length > 2) {
          inputVal = inputVal.split(',')[0];
          content = el
            .querySelector('.city-name span')
            .textContent.toLowerCase();
        } else {
          content = el.querySelector('.city-name').dataset.name.toLowerCase();
        }
      } else {
        content = el.querySelector('.city-name span').textContent.toLowerCase();
      }
      return content == inputVal.toLowerCase();
    });

    if (filteredArray.length > 0) {
      msg.textContent = `You already know the weather for ${
        filteredArray[0].querySelector('.city-name span').textContent
      } ...add country code to be more specific`;
      form.reset();
      input.focus();
      return;
    }
  }

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=imperial`
  )
    .then((response) => response.json())
    .then(async (data) => {
      const { main, name, sys, weather } = data;
      const icon = `https://openweathermap.org/img/wn/${weather[0]['icon']}@2x.png`;

      const li = document.createElement('li');
      li.classList.add('city');

      const markup = `
  <h2 class="city-name" data-name="${name},${sys.country}">
    <span>${name}</span>
    <sup>${sys.country}</sup>
  </h2>
  <div class="city-temp">${Math.round(main.temp)}<sup>°F</sup>
  </div>
  <figure>
    <img class="city-icon" src=${icon} alt=${weather[0]['main']}>
    <figcaption>${weather[0]['description']}</figcaption>
  </figure>
`;
      $('.building .cities').append(
        `<li id='city${index}' class='city'>${markup}</li>`
      );
      $(`#city${index}`).hide().fadeIn(2000);
      index++;
      temp.push(Math.round(main.temp));

    document.getElementById('avg').innerHTML= (await calculateAverage(temp) + ' is the average temperature!');
    })
     .catch(() => {
      msg.textContent = 'City not valid';
    });
  msg.textContent = '';
  form.reset();
  input.focus();
});



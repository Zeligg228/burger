const headerLinks = document.querySelectorAll('.header__links a');
const discoverSection = document.getElementById('discover');
const craftSection = document.getElementById('craft');
const body = document.querySelector('body');
const modalEmail = document.getElementById('modal-email');
const modalPhone = document.getElementById('modal-phone');
const headerCall = document.querySelectorAll('.header__call');
const craftOrder = document.querySelectorAll('.craft__order');
const modalClose = document.querySelectorAll('.modal__close');
const form = document.querySelector('#modal-email .modal__main-form');
const summaryKcal = document.querySelector('#summary-kcal span');
const summaryTime = document.querySelector('#summary-time span');
const summaryWeight = document.querySelector('#summary-weight span');
const ingredientsItem = document.querySelectorAll('.craft__ingredients-item');
const summaryPrice = document.querySelector('.craft__summary-price span');
const summaryGift = document.querySelector('.craft__summary-gift');
const summaryKetchup = document.querySelector('.craft__summary-ketchup');
const burgerContainer = document.querySelector('.craft__burger-parts');
const burger = document.querySelector('.craft__burger');
const burgerExcessive = document.querySelector('.craft__burger-excessive');
const countButtons = document.querySelectorAll('.craft__ingredients-count button');
const burgerOpen = document.querySelector('.burger__open');
const burgerClose = document.querySelector('.burger__close');
const burgerMenu = document.querySelector('.burger');

function toggleActiveClass(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      if (entry.target.id === 'discover') {
        headerLinks[0].classList.add('active');
        headerLinks[2].classList.add('active');
        headerLinks[1].classList.remove('active');
        headerLinks[3].classList.remove('active');
      } else if (entry.target.id === 'craft') {
        headerLinks[0].classList.remove('active');
        headerLinks[2].classList.remove('active');
        headerLinks[1].classList.add('active');
        headerLinks[3].classList.add('active');
      }
    }
  });
}

headerLinks.forEach(button => {
  button.addEventListener('click', function() {
    body.classList.remove('modal-open');
    burgerMenu.classList.remove('active');
    burgerClose.style.display = 'none';
    burgerOpen.style.display = 'block';
  });
});

const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.3 
};

const observer = new IntersectionObserver(toggleActiveClass, observerOptions);

observer.observe(discoverSection);
observer.observe(craftSection);

function openModal(modal) {
  body.classList.add('modal-open');
  modal.style.display = 'flex';
}

headerCall.forEach(button => {
  button.addEventListener('click', function() {
    openModal(modalPhone);
    burgerMenu.classList.remove('active');
    if (window.innerWidth < 769) {
      burgerClose.style.display = 'none';
      burgerOpen.style.display = 'block';
    }
  });
});
craftOrder.forEach(button => {
  button.addEventListener('click', function() {
    if (!this.classList.contains('disabled')) {
      finishBurger();
      setTimeout(() => {
        openModal(modalEmail);
      }, 1100);
    }
  });
});

modalClose.forEach(function(button) {
  button.addEventListener('click', function() {
    body.classList.remove('modal-open');
    const modal = button.closest('.modal');
    if (modal) {
      modal.style.display = 'none';
      const burgerFinish = document.querySelector('.burger__finish');
      if (burgerFinish) {
        burgerFinish.remove();
      }
    }
  });
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const currentModal = document.querySelector('#modal-email');
  const otherModal = document.querySelector('#modal-success');
  currentModal.style.display = 'none'
  if (otherModal) {
    otherModal.style.display = 'flex';
  }
});

document.querySelectorAll('#modal-success button').forEach(button => {
  button.addEventListener('click', () => {
    location.reload();
  });
});

let totalKcal = 0;
let totalTime = 0;
let totalWeight = 0;
let totalPrice = 0;
const addedIngredients = [];

function checkTotalPrice() {
  if (totalPrice > 5) {
    summaryGift.style.display = 'none';
    summaryKetchup.style.display = 'flex';
  } else {
    summaryKetchup.style.display = 'none';
    summaryGift.style.display = 'block';
  }
}

ingredientsItem.forEach(item => {
  const kcal = parseInt(item.querySelector('.craft__ingredients-stats__item:nth-child(1) span').textContent);
  const time = parseInt(item.querySelector('.craft__ingredients-stats__item:nth-child(2) span').textContent);
  const weight = parseInt(item.querySelector('.craft__ingredients-stats__item:nth-child(3) span').textContent);
  const cost = parseFloat(item.getAttribute('data-cost'));
  const currentCount = item.querySelector('.craft__ingredients-current');
  const ingredientName = item.getAttribute('data-ingredient');
  let count = 0;

  const updateSummary = (increment) => {
    totalKcal += increment * kcal;
    totalTime += increment * time;
    totalWeight += increment * weight;
    totalPrice += increment * cost;
    summaryKcal.textContent = totalKcal;
    summaryTime.textContent = (totalTime / 60).toFixed(1);
    summaryWeight.textContent = totalWeight;
    summaryPrice.textContent = `$${totalPrice.toFixed(2)}`;
  };

  const addIngredientToBurger = () => {
    const ingredientImage = document.createElement('img');
    ingredientImage.src = `img/${ingredientName}-big.png`;
    ingredientImage.alt = ingredientName;
    ingredientImage.classList.add('craft__burger-parts__image', 'falling');
    burgerContainer.appendChild(ingredientImage);
    addedIngredients.push(ingredientName);

    const ingredientIndex = addedIngredients.length - 1;
    const bottomPosition = 40 + ingredientIndex * 30;
    ingredientImage.style.bottom = `${bottomPosition}px`;
    if (window.innerWidth < 577) {
      const bottomPosition = 30 + ingredientIndex * 10;
      ingredientImage.style.bottom = `${bottomPosition}px`;
    }

    ingredientImage.addEventListener('animationend', () => {
      ingredientImage.classList.remove('falling');
      ingredientImage.classList.add('placed');
    });
    checkCraftOrder();

  };

  const removeIngredientFromBurger = () => {
    if (addedIngredients.includes(ingredientName)) {
      const ingredientIndex = addedIngredients.lastIndexOf(ingredientName);
      addedIngredients.splice(ingredientIndex, 1);

      const ingredientImages = burgerContainer.querySelectorAll(`.craft__burger-parts__image[src="img/${ingredientName}-big.png"]`);
      if (ingredientImages.length > 0) {
        const lastImage = ingredientImages[ingredientImages.length - 1];
        burgerContainer.removeChild(lastImage);
      }

      const remainingImages = burgerContainer.querySelectorAll('.craft__burger-parts__image.placed');
      remainingImages.forEach((img, index) => {
        const bottomPosition = 40 + index * 30;
        img.style.bottom = `${bottomPosition}px`;
        if (window.innerWidth < 577) {
          const bottomPosition = 30 + index * 10;
          img.style.bottom = `${bottomPosition}px`;
        }
      });

    }
    checkCraftOrder();
  };

  const checkCraftOrder = () => {
    if (totalPrice > 0.01) {
      craftOrder.forEach(order => order.classList.remove('disabled'));
    } else {
      craftOrder.forEach(order => order.classList.add('disabled'));
    }
  }

  item.querySelector('.craft__ingredients-plus').addEventListener('click', (e) => {
    e.stopPropagation();
    count++;
    currentCount.textContent = count;
    updateSummary(1);
    checkTotalPrice();
    addIngredientToBurger();
  });

  item.querySelector('.craft__ingredients-minus').addEventListener('click', (e) => {
    e.stopPropagation();
    if (count > 0) {
      count--;
      currentCount.textContent = count;
      updateSummary(-1);
      checkTotalPrice();
      removeIngredientFromBurger();
    }
  });

  if (window.innerWidth < 769) {
    item.addEventListener('click', function() {
      const data = {
        cost: this.getAttribute('data-cost'),
        ingredient: this.getAttribute('data-ingredient'),
        img: this.querySelector('.craft__ingredients-image img').getAttribute('src'),
        title: this.querySelector('.craft__ingredients-title').innerText,
        kcal: this.querySelector('.craft__ingredients-stats__item:nth-child(1) span').innerText,
        time: this.querySelector('.craft__ingredients-stats__item:nth-child(2) span').innerText,
        weight: this.querySelector('.craft__ingredients-stats__item:nth-child(3) span').innerText,
        count: this.querySelector('.craft__ingredients-current').innerText
      };

      const newItem = document.createElement('div');
      newItem.classList.add('craft__ingredients-item', 'mobile');
      newItem.setAttribute('data-cost', data.cost);
      newItem.setAttribute('data-ingredient', data.ingredient);

      newItem.innerHTML = `
        <div class="craft__ingredients-close" onclick="this.parentElement.remove()"></div>
        <div class="craft__ingredients-image"><img src="${data.img}" alt="${data.ingredient}"></div>
        <h3 class="craft__ingredients-title">${data.title}</h3>
        <div class="craft__ingredients-stats">
          <div class="craft__ingredients-stats__item">
            <img src="img/kcal-icon.svg" alt="kcal-icon">
            <span>${data.kcal}</span>
            <h5>kcal</h5>
          </div>
          <div class="craft__ingredients-stats__item">
            <img src="img/time-icon.svg" alt="time-icon">
            <span>${data.time}</span>
            <h5>sec</h5>
          </div>
          <div class="craft__ingredients-stats__item">
            <img src="img/weight-icon.svg" alt="weight-icon">
            <span>${data.weight}</span>
            <h5>g</h5>
          </div>
        </div>
        <div class="craft__ingredients-count">
          <button class="btn craft__ingredients-minus"><img src="img/minus-icon.svg" alt="minus-icon"></button>
          <span class="craft__ingredients-current">${data.count}</span>
          <button class="btn craft__ingredients-plus"><img src="img/plus-icon.svg" alt="plus-icon"></button>
        </div>
      `;

      body.appendChild(newItem);

      let newCount = parseInt(data.count);
      newItem.querySelector('.craft__ingredients-plus').addEventListener('click', (e) => {
        e.stopPropagation();
        count++;
        currentCount.textContent = count;
        newCount++;
        newItem.querySelector('.craft__ingredients-current').textContent = newCount;
        updateSummary(1);
        checkTotalPrice();
        addIngredientToBurger();
      });
    
      newItem.querySelector('.craft__ingredients-minus').addEventListener('click', (e) => {
        e.stopPropagation();
        if (count > 0) {
          count--;
          currentCount.textContent = count;
          newCount--;
          newItem.querySelector('.craft__ingredients-current').textContent = newCount;
          updateSummary(-1);
          checkTotalPrice();
          removeIngredientFromBurger();
        }
      });
    });
  }

});

const finishBurger = () => {
  if (addedIngredients.length > 0) {
    const burgerTopElement = document.querySelector('[data-ingredient="burger-top"]');
    const imgSrc = burgerTopElement.src; 
    const burgerTopImage = document.createElement('img');
    burgerTopImage.src = imgSrc;
    burgerTopImage.classList.add('craft__burger-parts__image', 'falling', 'burger__finish');

    const bottomPosition = 60 + addedIngredients.length * 30;
    burgerTopImage.style.bottom = `${bottomPosition}px`;
    if (window.innerWidth < 577) {
      const bottomPosition = 45 + addedIngredients.length * 10;
      burgerTopImage.style.bottom = `${bottomPosition}px`;
    }

    burgerContainer.appendChild(burgerTopImage);

    burgerTopImage.addEventListener('animationend', () => {
      burgerTopImage.classList.remove('falling');
      burgerTopImage.classList.add('placed');
    });
  }
};

const checkBurgerHeight = () => {
  const bottomPosition = 40 + addedIngredients.length * 30;
  const burgerHeight = burger.getBoundingClientRect().bottom;
  if (bottomPosition > burgerHeight - 60) {
    burgerExcessive.style.bottom = `${burgerHeight - 150}px`;
    burgerExcessive.style.display = 'flex';
  } else {
    burgerExcessive.style.display = 'none';
  }
}
countButtons.forEach(button => {
  button.addEventListener('click', checkBurgerHeight);
});


const discover = document.querySelector('.discover__block');
const parallaxContainer = document.querySelector('.discover__image');

discover.addEventListener('mousemove', function(e) {
  const items = document.querySelectorAll('.discover__image-item');
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const containerWidth = parallaxContainer.offsetWidth;
  const containerHeight = parallaxContainer.offsetHeight;

  const containerSpeed = 0.3;
  const containerCenterX = discover.getBoundingClientRect().left + containerWidth / 2;
  const containerCenterY = discover.getBoundingClientRect().top + containerHeight / 2;
  const containerMouseFromCenterX = mouseX - containerCenterX;
  const containerMouseFromCenterY = mouseY - containerCenterY;
  const containerMoveX = (containerMouseFromCenterX / containerWidth) * 100 * containerSpeed;
  const containerMoveY = (containerMouseFromCenterY / containerHeight) * 100 * containerSpeed;
  parallaxContainer.style.transform = `translate(${containerMoveX}px, ${containerMoveY}px)`;

  items.forEach(function(item) {
    const speed = parseFloat(item.getAttribute('data-speed'));
    const itemWidth = item.offsetWidth;
    const itemOffset = item.getBoundingClientRect().left + itemWidth / 2;
    const mouseFromCenter = mouseX - itemOffset;
    const move = (mouseFromCenter / containerWidth) * 100 * speed;
    item.style.transform = `translateX(${move}px)`;
  });
});

burgerOpen.addEventListener('click', function() {
  body.classList.add('modal-open');
  burgerMenu.classList.add('active');
  this.style.display = 'none';
  burgerClose.style.display = 'block';
});
burgerClose.addEventListener('click', function() {
  body.classList.remove('modal-open');
  burgerMenu.classList.remove('active');
  this.style.display = 'none';
  burgerOpen.style.display = 'block';
});

function handleScroll(container) {
  let isMouseDown = false;
  let startX, scrollLeft;

  container.addEventListener('mousedown', function(e) {
    isMouseDown = true;
    startX = e.pageX - container.offsetLeft;
    scrollLeft = container.scrollLeft;
  });

  container.addEventListener('mouseleave', function() {
    isMouseDown = false;
  });

  container.addEventListener('mouseup', function() {
    isMouseDown = false;
  });

  container.addEventListener('mousemove', function(e) {
    if (!isMouseDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX);
    container.scrollLeft = scrollLeft - walk;
  });
}

const scrollContainer1 = document.querySelector('.craft__ingredients-wrapper');
handleScroll(scrollContainer1);

const element = document.getElementById('phone');
const maskOptions = {
  mask: '+{38}(\\000)000-00-00',
};

const mask = IMask(element, maskOptions);

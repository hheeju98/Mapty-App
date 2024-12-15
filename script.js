'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class App {
    #map;
    #mapEvent; // private instance property

    constructor() {
        this._getPosition();
        form.addEventListener('submit', this._newWorkout.bind(this));
        inputType.addEventListener('change', this._toggleElevationField);
    } // 생성자가 만들어질때 바로 실행되는 함수

    _getPosition() {
        if (navigator.geolocation)
            navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function () {
                alert('Could not get your position');
            });
    }
    _loadMap(position) {
        const { latitude } = position.coords;
        const { longitude } = position.coords;
        console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

        const coords = [latitude, longitude];
        this.#map = L.map('map').setView(coords, 13);

        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);


        // Handling clicks on map
        this.#map.on('click', this._showForm.bind(this));
    }
    _showForm(mapE) {
        this.#mapEvent = mapE;
        form.classList.remove('hidden');
        inputDistance.focus();
    }
    _toggleElevationField() {
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden'); //closest : 자식이 아닌 부모를 선택함
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    }
    _newWorkout(e) {
        e.preventDefault();


        // Clear input fields
        inputDistance.value = inputDuration.value = inputCadence.value = inputElevation.value = '';


        // Display marker
        const { lat, lng } = this.#mapEvent.latlng;
        L.marker([lat, lng]).addTo(this.#map)
            .bindPopup(L.popup({
                maxWidth: 250,
                minWidth: 100,
                autoClose: false,
                closeOnClick: false,
                className: 'running-popup',
            })
            )
            .setPopupContent('Workout')
            .openPopup();
    }
}

const app = new App();



//함수 호출과 메서드 호출의 차이 this
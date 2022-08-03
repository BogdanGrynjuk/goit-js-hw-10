import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';


const DEBOUNCE_DELAY = 300;
const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchBox.addEventListener('input', debounce(onFormInput, DEBOUNCE_DELAY));

function onFormInput(event) {
  const nameCountry = event.target.value.trim();

  if (!nameCountry) {      
    return;
  }
  
  fetchCountries(nameCountry)
    .then((countries) => {
      if (countries.length === 1) {
        countryList.innerHTML = '';
        renderCountryInfo(countries[0])
      } else if (countries.length > 2 && countries.length <= 10) {
        countryInfo.innerHTML = '';
        renderCountriesList(countries);
      } else if (countries.length > 10) {        
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        countryList.innerHTML = '';
        countryInfo.innerHTML = '';        
      }
    })
    .catch((error) => {
      if (error.message === '404') {
        Notiflix.Notify.failure('Oops, there is no country with that name');
        countryList.innerHTML = '';
        countryInfo.innerHTML = '';
        return;
      }      
    })
  ; 
}



function renderCountriesList(countries) {
  const markup = countries
    .map((country) => {
      return `
        <li>
          <img src="${country.flags.svg}" alt="flag" class="country-flag">
          <span>${country.name.official}</span>          
        </li>`;
    })
    .join("");
  
  countryList.innerHTML = markup;
}

function renderCountryInfo(country) {  
  const languages = Object.values(country.languages).join(", ");  
  const markup = `
        <div class="general-info">        
          <img src="${country.flags.svg}" alt="flag" class="country-flag">
          <span class="country-name"><b>${country.name.official}</b></span>
        </div>
        <ul class="detailed-info">
          <li class="detailed-info-item"><b>Capital: </b>${country.capital}</li>
          <li class="detailed-info-item"><b>Population: </b>${country.population}</li>
          <li class="detailed-info-item"><b>Languages: </b>${languages}</li>
        </ul>`;
  
  countryInfo.innerHTML = markup;
}



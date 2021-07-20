import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }

  checkForNumerics(keyCode){
    let letters = /^[0-9]+$/;
    let input = String.fromCharCode(keyCode);
    if(!input.match(letters))
      return false;
    else
      return true;
  }

  checkForAplphabetsWithSpace(keyCode){
    let letters = /^[A-Za-z ]+$/;
    let input = String.fromCharCode(keyCode);
    if(!input.match(letters))
      return false;
    else
      return true;
  }

}

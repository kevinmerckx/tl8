import { Component } from '@angular/core';
import { TL8Module } from 'tl8';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports:[
    TL8Module
  ],
  standalone: true
})
export class AppComponent {}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.page.html',
  styleUrls: ['./ajustes.page.scss'],
})
export class AjustesPage implements OnInit {

  constructor() { }

  openVideo() {
    window.open('https://www.youtube.com/watch?v=L8XbI9aJOXk', '_blank');
  }
  ngOnInit() {
  }
  
}

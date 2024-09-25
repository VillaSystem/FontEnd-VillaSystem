import {Component, ViewChild} from '@angular/core';
import {MatListItem, MatNavList} from "@angular/material/list";
import {MatIcon} from "@angular/material/icon";
import {RouterLink, RouterOutlet} from "@angular/router";
import {MatSidenav, MatSidenavContainer} from "@angular/material/sidenav";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatToolbar} from "@angular/material/toolbar";
import {MatSidenavModule} from '@angular/material/sidenav';
import {FooterContentComponent} from "../footer-content/footer-content.component";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    MatListItem,
    MatIcon,
    RouterLink,
    MatNavList,
    MatSidenav,
    MatSidenavContainer,
    MatButton,
    MatIconButton,
    MatToolbar,
    RouterOutlet,
    MatSidenavModule,
    FooterContentComponent,
    NgOptimizedImage
  ],
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  // Variable para almacenar el nombre del usuario
  userName: string = 'Usuario';

  constructor() {
    // Aquí puedes obtener el nombre del usuario del sistema de autenticación
    // Por ejemplo: this.userName = authService.getUserName();
  }

  toggleSidenav() {
    this.sidenav.toggle();
  }

  closeSidenav() {
    this.sidenav.close();
  }

  logout() {
    console.log("Sesión cerrada");
    // Redirigir al login
    window.location.href = '/login';
  }
}

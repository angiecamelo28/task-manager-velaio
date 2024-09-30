import { AfterViewInit, Component, HostListener, OnInit, ChangeDetectorRef  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SettingsService } from 'src/app/core/services/settings.service';
/* import { AdministrationService } from 'src/app/core/administration/services/administration.service'; */
import Swal from 'sweetalert2';

declare var $: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  public role: string | null | undefined;
  public loading: boolean = false;
  public username: String | null | undefined;
  public location: String | null | undefined;
  public document: String | null | undefined;
  public viewPQR: boolean = false;

  constructor(
    private router: Router,
    private routeActive: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {

  }

  ngOnInit(): void {
    this.reload();

  }

  private reload(): void {
  }

 
  ngAfterViewInit(): void {
    setTimeout(() => {
      $(window).ready(function () {
        $('.navbar-minimalize').on('click', function (event: MouseEvent) {
          event.preventDefault();
          $("body").toggleClass("mini-navbar");
          SmoothlyMenu();
        });
      });
    }, 1000);

    function SmoothlyMenu() {
      if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
        // Hide menu in order to smoothly turn on when maximize menu
        $('#side-menu').hide();
        // For smoothly turn on menu
        setTimeout(
          function () {
            $('#side-menu').show(400);
          }, 200);
      } else if ($('body').hasClass('fixed-sidebar')) {
        $('#side-menu').hide();
        setTimeout(
          function () {
            $('#side-menu').show(400);
          }, 100);
      } else {
        // Remove all inline style from jquery fadeIn function to reset menu state
        $('#side-menu').removeAttr('style');
      }
    }
  }


  @HostListener('document:click', ['$event'])
  toggleMobileNavbar(event: Event) {
    const target = event.target as HTMLElement;
    const navbar = document.querySelector('#navbar');

    // Toggle mobile navbar
    if (target && target.classList.contains('mobile-nav-toggle')) {
      if (navbar) {
        navbar.classList.toggle('navbar-mobile');
      }
      target.classList.toggle('bi-list');
      target.classList.toggle('bi-x');
      return; // Salir del método si se detecta un clic en el icono de mobile-nav-toggle
    }

    // Toggle dropdown
    if (target && navbar && target.closest('.navbar .dropdown > a')) {

      const dropdownLink = target.closest('.navbar .dropdown > a');
      const dropdownMenu = dropdownLink?.nextElementSibling;

      if (navbar && navbar.classList.contains('navbar-mobile') && dropdownMenu) {
        event.preventDefault();
        dropdownMenu.classList.toggle('dropdown-active');
      }
    }
  }

}

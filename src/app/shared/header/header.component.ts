import { AfterViewInit, Component, HostListener } from '@angular/core';

declare var $: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements AfterViewInit {

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
        $('#side-menu').hide();
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
        $('#side-menu').removeAttr('style');
      }
    }
  }


  @HostListener('document:click', ['$event'])
  toggleMobileNavbar(event: Event) {
    const target = event.target as HTMLElement;
    const navbar = document.querySelector('#navbar');
    if (target && target.classList.contains('mobile-nav-toggle')) {
      if (navbar) {
        navbar.classList.toggle('navbar-mobile');
      }
      target.classList.toggle('bi-list');
      target.classList.toggle('bi-x');
      return;
    }
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

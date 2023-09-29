---
title: Tutorial - Add sign-in and sign-out to an Angular single-page app (SPA) for a customer tenant
description: Learn how to configure an Angular single-page app (SPA) to sign in and sign out users with your Azure Active Directory (AD) for customers tenant.
services: active-directory
author: godonnell
manager: celestedg

ms.service: active-directory
ms.subservice: ciam
ms.topic: tutorial
ms.date: 05/23/2023
ms.author: godonnell

#Customer intent: As a developer I want to add sign-in and sign-out functionality to my Angular single-page app
---

# Tutorial: Add sign-in and sign-out to an Angular single-page app (SPA) for a customer tenant



## Sign in using pop-ups
      
1. Open _src/app/app.component.ts_ and replace the code with the following to sign in a user using a pop-up:

    ```javascript	
    import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
    import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
    import { AuthenticationResult, InteractionStatus, InteractionType, PopupRequest, RedirectRequest } from '@azure/msal-browser';
    import { Subject } from 'rxjs';
    import { filter, takeUntil } from 'rxjs/operators';
    
    @Component({
      selector: 'app-root',
      templateUrl: './app.component.html',
      styleUrls: ['./app.component.css']
    })
    export class AppComponent implements OnInit, OnDestroy {
      title = 'Angular 14 - MSAL v2 Quickstart Sample';
      isIframe = false;
      loginDisplay = false;
      private readonly _destroying$ = new Subject<void>();
    
      constructor(
        @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
        private authService: MsalService,
        private msalBroadcastService: MsalBroadcastService
      ) { }
    
      ngOnInit(): void {
        this.isIframe = window !== window.parent && !window.opener;
    
        this.msalBroadcastService.inProgress$
          .pipe(
            filter((status: InteractionStatus) => status === InteractionStatus.None),
            takeUntil(this._destroying$)
          )
          .subscribe(() => {
            this.setLoginDisplay();
          });
      }
    
      setLoginDisplay() {
        this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
      }
    
      login() {
        if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
          if (this.msalGuardConfig.authRequest) {
            this.authService.loginPopup({ ...this.msalGuardConfig.authRequest } as PopupRequest)
              .subscribe((response: AuthenticationResult) => {
                this.authService.instance.setActiveAccount(response.account);
              });
          } else {
            this.authService.loginPopup()
              .subscribe((response: AuthenticationResult) => {
                this.authService.instance.setActiveAccount(response.account);
              });
          }
        } else {
          if (this.msalGuardConfig.authRequest) {
            this.authService.loginRedirect({ ...this.msalGuardConfig.authRequest } as RedirectRequest);
          } else {
            this.authService.loginRedirect();
          }
        }
      }
    
      logout() {
        if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
          this.authService.logoutPopup({
            postLogoutRedirectUri: "/",
            mainWindowRedirectUri: "/"
          });
        } else {
          this.authService.logoutRedirect({
            postLogoutRedirectUri: "/",
          });
        }
      }
    
      ngOnDestroy(): void {
        this._destroying$.next(undefined);
        this._destroying$.complete();
      }
    }
    ```

## Sign out using pop-ups

1. Update the code in _src/app/app.component.ts_ to sign out a user using pop-ups:
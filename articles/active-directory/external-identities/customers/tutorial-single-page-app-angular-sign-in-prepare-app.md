---
title: Tutorial - Prepare an Angular single-page app (SPA) for authentication in a customer tenant
description: Learn how to prepare an Angular single-page app (SPA) for authentication with your Azure Active Directory (AD) for customers tenant.
services: active-directory
author: garrodonnell
manager: celestedg
ms.service: active-directory
ms.subservice: ciam
ms.topic: tutorial
ms.date: 05/23/2023
ms.author: godonnell
#Customer intent: As a dev, devops, or IT admin, I want to learn how to enable authentication in my own Angular single-page app
---

# Tutorial: Prepare an Angular single-page app (SPA) for authentication in a customer tenant

In the [previous article](./tutorial-single-page-app-angular-sign-in-prepare-tenant.md), you registered an application and configured user flows in your Azure Active Directory (AD) for customers tenant. This tutorial demonstrates how to create an Angular single-page app using `npm` and create files needed for authentication and authorization.

In this tutorial;

> [!div class="checklist"]
> * Create a React project in Visual Studio Code
> * Install identity and bootstrap packages
> * Configure the settings for the application

## Prerequisites

* Completion of the prerequisites and steps in [Prepare your customer tenant to authenticate users in an Angular single-page app (SPA)](./tutorial-single-page-app-angular-sign-in-prepare-tenant.md).
* Although any integrated development environment (IDE) that supports Angular applications can be used, this tutorial uses **Visual Studio Code**. You can download it [here](https://visualstudio.microsoft.com/downloads/).
* [Node.js](https://nodejs.org/en/download/).

## Create an Angular project

1. Open Visual Studio Code, select **File** > **Open Folder...**. Navigate to and select the location in which to create your project.
1. Open a new terminal by selecting **Terminal** > **New Terminal**.
1. Run the following commands to create a new Angular project with the name angularspalocal, install Angular Material component libraries, MSAL Browser, MSAL Angular and generate home and profile components.

    ```powershell
    npm install -g @angular/cli
    ng new angularspalocal --routing=true --style=css --strict=false
    cd angularspalocal
    npm install @angular/material @angular/cdk
    npm install @azure/msal-browser @azure/msal-angular
    ng generate component home
    ng generate component profile
    ng generate component guarded
    ```

1. Open _src/app/app.module.ts_. The `MsalModule` and `MsalInterceptor` need to be added to `imports` along with the `isIE` constant. You'll also add the material modules. Replace the entire contents of the file with the following snippet:

    ```javascript	
    import { BrowserModule } from '@angular/platform-browser';
    import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
    import { NgModule } from '@angular/core';
    
    import { MatToolbarModule } from '@angular/material/toolbar';
    import { MatButtonModule } from '@angular/material/button';
    import { MatListModule } from '@angular/material/list';
    
    
    import { AppRoutingModule } from './app-routing.module';
    import { AppComponent } from './app.component';
    import { HomeComponent } from './home/home.component';
    import { ProfileComponent } from './profile/profile.component';
    
    import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
    import {
      IPublicClientApplication,
      PublicClientApplication,
      BrowserCacheLocation,
      LogLevel,
      InteractionType,
    } from '@azure/msal-browser';
    import {
      MSAL_INSTANCE,
      MSAL_INTERCEPTOR_CONFIG,
      MsalInterceptorConfiguration,
      MSAL_GUARD_CONFIG,
      MsalGuardConfiguration,
      MsalBroadcastService,
      MsalService,
      MsalGuard,
      MsalRedirectComponent,
      MsalModule,
      MsalInterceptor,
    } from '@azure/msal-angular';
    
    const GRAPH_ENDPOINT = 'Enter_the_Graph_Endpoint_Herev1.0/me';
    
    const isIE =
      window.navigator.userAgent.indexOf('MSIE ') > -1 ||
      window.navigator.userAgent.indexOf('Trident/') > -1;
    
    export function loggerCallback(logLevel: LogLevel, message: string) {
      console.log(message);
    }
    
    export function MSALInstanceFactory(): IPublicClientApplication {
      return new PublicClientApplication({
        auth: {
          clientId: 'Enter_the_Application_Id_Here',
          authority: 'Enter_the_Cloud_Instance_Id_HereEnter_the_Tenant_Info_Here',
          redirectUri: 'Enter_the_Redirect_Uri_Here',
        },
        cache: {
          cacheLocation: BrowserCacheLocation.LocalStorage,
          storeAuthStateInCookie: isIE, // set to true for IE 11
        },
        system: {
          loggerOptions: {
            loggerCallback,
            logLevel: LogLevel.Info,
            piiLoggingEnabled: false,
          },
        },
      });
    }
    
    export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
      const protectedResourceMap = new Map<string, Array<string>>();
      protectedResourceMap.set(GRAPH_ENDPOINT, ['user.read']);
    
      return {
        interactionType: InteractionType.Redirect,
        protectedResourceMap,
      };
    }
    
    export function MSALGuardConfigFactory(): MsalGuardConfiguration {
      return {
        interactionType: InteractionType.Redirect,
        authRequest: {
          scopes: ['user.read'],
        },
      };
    }
    @NgModule({
      declarations: [AppComponent, HomeComponent, ProfileComponent],
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        MatButtonModule,
        MatToolbarModule,
        MatListModule,
        HttpClientModule,
        MsalModule,
      ],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: MsalInterceptor,
          multi: true,
        },
        {
          provide: MSAL_INSTANCE,
          useFactory: MSALInstanceFactory,
        },
        {
          provide: MSAL_GUARD_CONFIG,
          useFactory: MSALGuardConfigFactory,
        },
        {
          provide: MSAL_INTERCEPTOR_CONFIG,
          useFactory: MSALInterceptorConfigFactory,
        },
        MsalService,
        MsalGuard,
        MsalBroadcastService,
      ],
      bootstrap: [AppComponent, MsalRedirectComponent],
    })
    export class AppModule {}
    ```

## Next step

> [!div class="nextstepaction"]
> [Configure SPA for authentication](./tutorial-single-page-app-react-sign-in-configure-authentication.md)
---
title: "Tutorial: Create an Angular app that uses the Microsoft identity platform for authentication using auth code flow"
description: In this tutorial, you build an Angular single-page app (SPA) using auth code flow that uses the Microsoft identity platform to sign in users and get an access token to call the Microsoft Graph API on their behalf.
services: active-directory
author: henrymbuguakiarie
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: tutorial
ms.workload: identity
ms.date: 05/08/2023
ms.author: henrymbugua
ms.reviewer: joarroyo
ms.custom: aaddev, devx-track-js
---

# Tutorial: Sign in users and call the Microsoft Graph API from an Angular single-page application (SPA) using auth code flow

In this tutorial, you'll build an Angular single-page application (SPA) that signs in users and calls the Microsoft Graph API by using the authorization code flow with PKCE. The SPA you build uses the Microsoft Authentication Library (MSAL) for Angular v2.

In this tutorial:

> [!div class="checklist"]
>
> - Register the application in the Microsoft Entra admin center
> - Create an Angular project with `npm`
> - Add code to support user sign-in and sign-out
> - Add code to call Microsoft Graph API
> - Test the app

MSAL Angular v2 improves on MSAL Angular v1 by supporting the authorization code flow in the browser instead of the implicit grant flow. MSAL Angular v2 does **NOT** support the implicit flow.

## Prerequisites

- [Node.js](https://nodejs.org/en/download/) for running a local web server.
- [Visual Studio Code](https://code.visualstudio.com/download) or other editor for modifying project files.

## How the sample app works

:::image type="content" source="media/tutorial-v2-javascript-auth-code/diagram-01-auth-code-flow.png" alt-text="Diagram showing the authorization code flow in a single-page application":::

The sample application created in this tutorial enables an Angular SPA to query the Microsoft Graph API or a web API that accepts tokens issued by the Microsoft identity platform. It uses the Microsoft Authentication Library (MSAL) for Angular v2, a wrapper of the MSAL.js v2 library. MSAL Angular enables Angular 9+ applications to authenticate enterprise users by using Microsoft Entra ID, and also users with Microsoft accounts and social identities like Facebook, Google, and LinkedIn. The library also enables applications to get access to Microsoft cloud services and Microsoft Graph.

In this scenario, after a user signs in, an access token is requested and added to HTTP requests through the authorization header. Token acquisition and renewal are handled by MSAL.

### Libraries

This tutorial uses the following libraries:

| Library                                                                                                      | Description                                                        |
| ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| [MSAL Angular](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-angular) | Microsoft Authentication Library for JavaScript Angular Wrapper    |
| [MSAL Browser](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-browser) | Microsoft Authentication Library for JavaScript v2 browser package |

You can find the source code for all of the MSAL.js libraries in the [`microsoft-authentication-library-for-js`](https://github.com/AzureAD/microsoft-authentication-library-for-js) repository on GitHub.

### Get the completed code sample

Do you prefer to download the completed sample project for this tutorial instead? Clone the [ms-identity-javascript-angular-spa](https://github.com/Azure-Samples/ms-identity-javascript-angular-spa)

```bash
git clone https://github.com/Azure-Samples/ms-identity-javascript-angular-spa.git
```

To continue with the tutorial and build the application yourself, move on to the next section, [Register the application and record identifiers](#register-the-application-and-record-identifiers).

## Register the application and record identifiers

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

To complete registration, provide the application a name, specify the supported account types, and add a redirect URI. Once registered, the application **Overview** pane displays the identifiers needed in the application source code.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least an [Application Developer](../roles/permissions-reference.md#application-developer).
1. If access to multiple tenants is available, use the **Directories + subscriptions** filter :::image type="icon" source="media/common/portal-directory-subscription-filter.png" border="false"::: in the top menu to switch to the tenant in which you want to register the application.
1. Browse to **Identity** > **Applications** > **App registrations**.
1. Select **New registration**.
1. Enter a **Name** for the application, such as _Angular-SPA-auth-code_.
1. For **Supported account types**, select **Accounts in this organizational directory only**. For information on different account types, select the **Help me choose** option.
1. Under **Redirect URI (optional)**, use the drop-down menu to select **Single-page-application (SPA)** and enter `http://localhost:4200` into the text box.
1. Select **Register**.
1. The application's **Overview** pane is displayed when registration is complete. Record the **Directory (tenant) ID** and the **Application (client) ID** to be used in your application source code.

## Create your project

1. Open Visual Studio Code, select **File** > **Open Folder...**. Navigate to and select the location in which to create your project.
1. Open a new terminal by selecting **Terminal** > **New Terminal**.
   1. You may need to switch terminal types. Select the down arrow next to the **+** icon in the terminal and select **Command Prompt**.
1. Run the following commands to create a new Angular project with the name `msal-angular-tutorial`, install Angular Material component libraries, MSAL Browser, MSAL Angular and generate home and profile components.

   ```cmd
   npm install -g @angular/cli
   ng new msal-angular-tutorial --routing=true --style=css --strict=false
   cd msal-angular-tutorial
   npm install @angular/material @angular/cdk
   npm install @azure/msal-browser @azure/msal-angular
   ng generate component home
   ng generate component profile
   ```

## Configure the application and edit the base UI

1. Open _src/app/app.module.ts_. The `MsalModule` and `MsalInterceptor` need to be added to `imports` along with the `isIE` constant. You'll also add the material modules. Replace the entire contents of the file with the following snippet:

   ```javascript
   import { BrowserModule } from "@angular/platform-browser";
   import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
   import { NgModule } from "@angular/core";

   import { MatButtonModule } from "@angular/material/button";
   import { MatToolbarModule } from "@angular/material/toolbar";
   import { MatListModule } from "@angular/material/list";

   import { AppRoutingModule } from "./app-routing.module";
   import { AppComponent } from "./app.component";
   import { HomeComponent } from "./home/home.component";
   import { ProfileComponent } from "./profile/profile.component";

   import { MsalModule, MsalRedirectComponent } from "@azure/msal-angular";
   import { PublicClientApplication } from "@azure/msal-browser";

   const isIE =
     window.navigator.userAgent.indexOf("MSIE ") > -1 ||
     window.navigator.userAgent.indexOf("Trident/") > -1;

   @NgModule({
     declarations: [AppComponent, HomeComponent, ProfileComponent],
     imports: [
       BrowserModule,
       BrowserAnimationsModule,
       AppRoutingModule,
       MatButtonModule,
       MatToolbarModule,
       MatListModule,
       MsalModule.forRoot(
         new PublicClientApplication({
           auth: {
             clientId: "Enter_the_Application_Id_here", // Application (client) ID from the app registration
             authority:
               "Enter_the_Cloud_Instance_Id_Here/Enter_the_Tenant_Info_Here", // The Azure cloud instance and the app's sign-in audience (tenant ID, common, organizations, or consumers)
             redirectUri: "Enter_the_Redirect_Uri_Here", // This is your redirect URI
           },
           cache: {
             cacheLocation: "localStorage",
             storeAuthStateInCookie: isIE, // Set to true for Internet Explorer 11
           },
         }),
         null,
         null
       ),
     ],
     providers: [],
     bootstrap: [AppComponent, MsalRedirectComponent],
   })
   export class AppModule {}
   ```

1. Replace the following values with the values obtained from the Microsoft Entra admin center. For more information about available configurable options, see [Initialize client applications](msal-js-initializing-client-applications.md).

   - `clientId` - The identifier of the application, also referred to as the client. Replace `Enter_the_Application_Id_Here` with the **Application (client) ID** value that was recorded earlier from the overview page of the registered application.
   - `authority` - This is composed of two parts:
     - The _Instance_ is endpoint of the cloud provider. For the main or global Azure cloud, enter `https://login.microsoftonline.com`. Check with the different available endpoints in [National clouds](authentication-national-cloud.md#azure-ad-authentication-endpoints).
     - The _Tenant ID_ is the identifier of the tenant where the application is registered. Replace the `_Enter_the_Tenant_Info_Here` with the **Directory (tenant) ID** value that was recorded earlier from the overview page of the registered application.
   - `redirectUri` - the location where the authorization server sends the user once the app has been successfully authorized and granted an authorization code or access token. Replace `Enter_the_Redirect_Uri_Here` with `http://localhost:4200`.

1. Open _src/app/app-routing.module.ts_ and add routes to the _home_ and _profile_ components. Replace the entire contents of the file with the following snippet:

   ```javascript
   import { NgModule } from "@angular/core";
   import { Routes, RouterModule } from "@angular/router";
   import { BrowserUtils } from "@azure/msal-browser";
   import { HomeComponent } from "./home/home.component";
   import { ProfileComponent } from "./profile/profile.component";

   const routes: Routes = [
     {
       path: "profile",
       component: ProfileComponent,
     },
     {
       path: "",
       component: HomeComponent,
     },
   ];

   const isIframe = window !== window.parent && !window.opener;

   @NgModule({
     imports: [
       RouterModule.forRoot(routes, {
         // Don't perform initial navigation in iframes or popups
         initialNavigation:
           !BrowserUtils.isInIframe() && !BrowserUtils.isInPopup()
             ? "enabledNonBlocking"
             : "disabled", // Set to enabledBlocking to use Angular Universal
       }),
     ],
     exports: [RouterModule],
   })
   export class AppRoutingModule {}
   ```

1. Open _src/app/app.component.html_ and replace the existing code with the following:

   ```HTML
   <mat-toolbar color="primary">
     <a class="title" href="/">{{ title }}</a>

     <div class="toolbar-spacer"></div>

     <a mat-button [routerLink]="['profile']">Profile</a>

     <button mat-raised-button *ngIf="!loginDisplay" (click)="login()">Login</button>

   </mat-toolbar>
   <div class="container">
     <!--This is to avoid reload during acquireTokenSilent() because of hidden iframe -->
     <router-outlet *ngIf="!isIframe"></router-outlet>
   </div>
   ```

1. Open _src/style.css_ to define the CSS:

   ```css
   @import "~@angular/material/prebuilt-themes/deeppurple-amber.css";

   html,
   body {
     height: 100%;
   }
   body {
     margin: 0;
     font-family: Roboto, "Helvetica Neue", sans-serif;
   }
   .container {
     margin: 1%;
   }
   ```

1. Open _src/app/app.component.css_ to add CSS styling to the application:

   ```css
   .toolbar-spacer {
     flex: 1 1 auto;
   }

   a.title {
     color: white;
   }
   ```

## Sign in using pop-ups

1. Open _src/app/app.component.ts_ and replace the contents of the file to the following to sign in a user using a pop-up window:

   ```javascript
   import { MsalService } from '@azure/msal-angular';
   import { Component, OnInit } from '@angular/core';

   @Component({
     selector: 'app-root',
     templateUrl: './app.component.html',
     styleUrls: ['./app.component.css']
   })
   export class AppComponent implements OnInit {
     title = 'msal-angular-tutorial';
     isIframe = false;
     loginDisplay = false;

     constructor(private authService: MsalService) { }

     ngOnInit() {
       this.isIframe = window !== window.parent && !window.opener;
     }

     login() {
       this.authService.loginPopup()
         .subscribe({
           next: (result) => {
             console.log(result);
             this.setLoginDisplay();
           },
           error: (error) => console.log(error)
         });
     }

     setLoginDisplay() {
       this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
     }
   }
   ```

## Sign in using redirects

1. Update _src/app/app.module.ts_ to bootstrap the `MsalRedirectComponent`. This is a dedicated redirect component, which handles redirects. Change the `MsalModule` import and `AppComponent` bootstrap to resemble the following:

   ```javascript
   ...
   import { MsalModule, MsalRedirectComponent } from '@azure/msal-angular'; // Updated import
   ...
     bootstrap: [AppComponent, MsalRedirectComponent] // MsalRedirectComponent bootstrapped here
   ...
   ```

2. Open _src/index.html_ and replace the entire contents of the file with the following snippet, which adds the `<app-redirect>` selector:

   ```HTML
   <!doctype html>
   <html lang="en">
   <head>
     <meta charset="utf-8">
     <title>msal-angular-tutorial</title>
     <base href="/">
     <meta name="viewport" content="width=device-width, initial-scale=1">
     <link rel="icon" type="image/x-icon" href="favicon.ico">
   </head>
   <body>
     <app-root></app-root>
     <app-redirect></app-redirect>
   </body>
   </html>
   ```

3. Open _src/app/app.component.ts_ and replace the code with the following to sign in a user using a full-frame redirect:

   ```javascript
   import { MsalService } from '@azure/msal-angular';
   import { Component, OnInit } from '@angular/core';

   @Component({
     selector: 'app-root',
     templateUrl: './app.component.html',
     styleUrls: ['./app.component.css']
   })
   export class AppComponent implements OnInit {
     title = 'msal-angular-tutorial';
     isIframe = false;
     loginDisplay = false;

     constructor(private authService: MsalService) { }

     ngOnInit() {
       this.isIframe = window !== window.parent && !window.opener;
     }

     login() {
       this.authService.loginRedirect();
     }

     setLoginDisplay() {
       this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
     }
   }
   ```

4. Navigate to _src/app/home/home.component.ts_ and replace the entire contents of the file with the following snippet to subscribe to the `LOGIN_SUCCESS` event:

   ```javascript
   import { Component, OnInit } from '@angular/core';
   import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
   import { EventMessage, EventType, InteractionStatus } from '@azure/msal-browser';
   import { filter } from 'rxjs/operators';

   @Component({
     selector: 'app-home',
     templateUrl: './home.component.html',
     styleUrls: ['./home.component.css']
   })
   export class HomeComponent implements OnInit {
     constructor(private authService: MsalService, private msalBroadcastService: MsalBroadcastService) { }

     ngOnInit(): void {
       this.msalBroadcastService.msalSubject$
         .pipe(
           filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
         )
         .subscribe((result: EventMessage) => {
           console.log(result);
         });
     }
   }
   ```

## Conditional rendering

In order to render certain User Interface (UI) only for authenticated users, components have to subscribe to the `MsalBroadcastService` to see if users have been signed in, and interaction has completed.

1. Add the `MsalBroadcastService` to _src/app/app.component.ts_ and subscribe to the `inProgress$` observable to check if interaction is complete and an account is signed in before rendering UI. Your code should now look like this:

   ```javascript
   import { Component, OnInit, OnDestroy } from '@angular/core';
   import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
   import { InteractionStatus } from '@azure/msal-browser';
   import { Subject } from 'rxjs';
   import { filter, takeUntil } from 'rxjs/operators';

   @Component({
     selector: 'app-root',
     templateUrl: './app.component.html',
     styleUrls: ['./app.component.css']
   })
   export class AppComponent implements OnInit, OnDestroy {
     title = 'msal-angular-tutorial';
     isIframe = false;
     loginDisplay = false;
     private readonly _destroying$ = new Subject<void>();

     constructor(private broadcastService: MsalBroadcastService, private authService: MsalService) { }

     ngOnInit() {
       this.isIframe = window !== window.parent && !window.opener;

       this.broadcastService.inProgress$
       .pipe(
         filter((status: InteractionStatus) => status === InteractionStatus.None),
         takeUntil(this._destroying$)
       )
       .subscribe(() => {
         this.setLoginDisplay();
       })
     }

     login() {
       this.authService.loginRedirect();
     }

     setLoginDisplay() {
       this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
     }

     ngOnDestroy(): void {
       this._destroying$.next(undefined);
       this._destroying$.complete();
     }
   }
   ```

2. Update the code in _src/app/home/home.component.ts_ to also check for interaction to be completed before updating UI. Your code should now look like this:

   ```javascript
   import { Component, OnInit } from '@angular/core';
   import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
   import { EventMessage, EventType, InteractionStatus } from '@azure/msal-browser';
   import { filter } from 'rxjs/operators';

   @Component({
     selector: 'app-home',
     templateUrl: './home.component.html',
     styleUrls: ['./home.component.css']
   })
   export class HomeComponent implements OnInit {
     loginDisplay = false;

     constructor(private authService: MsalService, private msalBroadcastService: MsalBroadcastService) { }

     ngOnInit(): void {
       this.msalBroadcastService.msalSubject$
         .pipe(
           filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
         )
         .subscribe((result: EventMessage) => {
           console.log(result);
         });

       this.msalBroadcastService.inProgress$
         .pipe(
           filter((status: InteractionStatus) => status === InteractionStatus.None)
         )
         .subscribe(() => {
           this.setLoginDisplay();
         })
     }

     setLoginDisplay() {
       this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
     }
   }
   ```

3. Replace the code in _src/app/home/home.component.html_ with the following conditional displays:

   ```HTML
   <div *ngIf="!loginDisplay">
       <p>Please sign-in to see your profile information.</p>
   </div>

   <div *ngIf="loginDisplay">
       <p>Login successful!</p>
       <p>Request your profile information by clicking Profile above.</p>
   </div>
   ```

## Implement Angular Guard

The `MsalGuard` class is one you can use to protect routes and require authentication before accessing the protected route. The following steps add the `MsalGuard` to the `Profile` route. Protecting the `Profile` route means that even if a user doesn't sign in using the `Login` button, if they try to access the `Profile` route or select the `Profile` button, the `MsalGuard` prompts the user to authenticate via pop-up or redirect before showing the `Profile` page.

`MsalGuard` is a convenience class you can use to improve the user experience, but it shouldn't be relied upon for security. Attackers can potentially get around client-side guards, and you should ensure that the server doesn't return any data the user shouldn't access.

1. Add the `MsalGuard` class as a provider in your application in _src/app/app.module.ts_, and add the configurations for the `MsalGuard`. Scopes needed for acquiring tokens later can be provided in the `authRequest`, and the type of interaction for the Guard can be set to `Redirect` or `Popup`. Your code should look like the following:

   ```javascript
   import { BrowserModule } from "@angular/platform-browser";
   import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
   import { NgModule } from "@angular/core";

   import { MatButtonModule } from "@angular/material/button";
   import { MatToolbarModule } from "@angular/material/toolbar";
   import { MatListModule } from "@angular/material/list";

   import { AppRoutingModule } from "./app-routing.module";
   import { AppComponent } from "./app.component";
   import { HomeComponent } from "./home/home.component";
   import { ProfileComponent } from "./profile/profile.component";

   import {
     MsalModule,
     MsalRedirectComponent,
     MsalGuard,
   } from "@azure/msal-angular"; // MsalGuard added to imports
   import {
     PublicClientApplication,
     InteractionType,
   } from "@azure/msal-browser"; // InteractionType added to imports

   const isIE =
     window.navigator.userAgent.indexOf("MSIE ") > -1 ||
     window.navigator.userAgent.indexOf("Trident/") > -1;

   @NgModule({
     declarations: [AppComponent, HomeComponent, ProfileComponent],
     imports: [
       BrowserModule,
       BrowserAnimationsModule,
       AppRoutingModule,
       MatButtonModule,
       MatToolbarModule,
       MatListModule,
       MsalModule.forRoot(
         new PublicClientApplication({
           auth: {
             clientId: "Enter_the_Application_Id_here",
             authority:
               "Enter_the_Cloud_Instance_Id_Here/Enter_the_Tenant_Info_Here",
             redirectUri: "Enter_the_Redirect_Uri_Here",
           },
           cache: {
             cacheLocation: "localStorage",
             storeAuthStateInCookie: isIE,
           },
         }),
         {
           interactionType: InteractionType.Redirect, // MSAL Guard Configuration
           authRequest: {
             scopes: ["user.read"],
           },
         },
         null
       ),
     ],
     providers: [
       MsalGuard, // MsalGuard added as provider here
     ],
     bootstrap: [AppComponent, MsalRedirectComponent],
   })
   export class AppModule {}
   ```

2. Set the `MsalGuard` on the routes you wish to protect in _src/app/app-routing.module.ts_:

   ```javascript
   import { NgModule } from "@angular/core";
   import { Routes, RouterModule } from "@angular/router";
   import { HomeComponent } from "./home/home.component";
   import { ProfileComponent } from "./profile/profile.component";
   import { MsalGuard } from "@azure/msal-angular";

   const routes: Routes = [
     {
       path: "profile",
       component: ProfileComponent,
       canActivate: [MsalGuard],
     },
     {
       path: "",
       component: HomeComponent,
     },
   ];

   const isIframe = window !== window.parent && !window.opener;

   @NgModule({
     imports: [
       RouterModule.forRoot(routes, {
         // Don't perform initial navigation in iframes or popups
         initialNavigation:
           !BrowserUtils.isInIframe() && !BrowserUtils.isInPopup()
             ? "enabledNonBlocking"
             : "disabled", // Set to enabledBlocking to use Angular Universal
       }),
     ],
     exports: [RouterModule],
   })
   export class AppRoutingModule {}
   ```

3. Adjust the login calls in _src/app/app.component.ts_ to take the `authRequest` set in the guard configurations into account. Your code should now look like the following:

   ```javascript
   import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
   import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
   import { InteractionStatus, RedirectRequest } from '@azure/msal-browser';
   import { Subject } from 'rxjs';
   import { filter, takeUntil } from 'rxjs/operators';

   @Component({
     selector: 'app-root',
     templateUrl: './app.component.html',
     styleUrls: ['./app.component.css']
   })
   export class AppComponent implements OnInit, OnDestroy {
     title = 'msal-angular-tutorial';
     isIframe = false;
     loginDisplay = false;
     private readonly _destroying$ = new Subject<void>();

     constructor(@Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration, private broadcastService: MsalBroadcastService, private authService: MsalService) { }

     ngOnInit() {
       this.isIframe = window !== window.parent && !window.opener;

       this.broadcastService.inProgress$
       .pipe(
         filter((status: InteractionStatus) => status === InteractionStatus.None),
         takeUntil(this._destroying$)
       )
       .subscribe(() => {
         this.setLoginDisplay();
       })
     }

     login() {
       if (this.msalGuardConfig.authRequest){
         this.authService.loginRedirect({...this.msalGuardConfig.authRequest} as RedirectRequest);
       } else {
         this.authService.loginRedirect();
       }
     }

     setLoginDisplay() {
       this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
     }

     ngOnDestroy(): void {
       this._destroying$.next(undefined);
       this._destroying$.complete();
     }
   }
   ```

## Acquire a token

### Angular Interceptor

MSAL Angular provides an `Interceptor` class that automatically acquires tokens for outgoing requests that use the Angular `http` client to known protected resources.

1. Add the `Interceptor` class as a provider to your application in _src/app/app.module.ts_, with its configurations. Your code should now look like the following:

   ```javascript
   import { BrowserModule } from "@angular/platform-browser";
   import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
   import { NgModule } from "@angular/core";
   import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http"; // Import

   import { MatButtonModule } from "@angular/material/button";
   import { MatToolbarModule } from "@angular/material/toolbar";
   import { MatListModule } from "@angular/material/list";

   import { AppRoutingModule } from "./app-routing.module";
   import { AppComponent } from "./app.component";
   import { HomeComponent } from "./home/home.component";
   import { ProfileComponent } from "./profile/profile.component";

   import {
     MsalModule,
     MsalRedirectComponent,
     MsalGuard,
     MsalInterceptor,
   } from "@azure/msal-angular"; // Import MsalInterceptor
   import {
     InteractionType,
     PublicClientApplication,
   } from "@azure/msal-browser";

   const isIE =
     window.navigator.userAgent.indexOf("MSIE ") > -1 ||
     window.navigator.userAgent.indexOf("Trident/") > -1;

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
       MsalModule.forRoot(
         new PublicClientApplication({
           auth: {
             clientId: "Enter_the_Application_Id_Here",
             authority:
               "Enter_the_Cloud_Instance_Id_Here/Enter_the_Tenant_Info_Here",
             redirectUri: "Enter_the_Redirect_Uri_Here",
           },
           cache: {
             cacheLocation: "localStorage",
             storeAuthStateInCookie: isIE,
           },
         }),
         {
           interactionType: InteractionType.Redirect,
           authRequest: {
             scopes: ["user.read"],
           },
         },
         {
           interactionType: InteractionType.Redirect, // MSAL Interceptor Configuration
           protectedResourceMap: new Map([
             ["Enter_the_Graph_Endpoint_Here/v1.0/me", ["user.read"]],
           ]),
         }
       ),
     ],
     providers: [
       {
         provide: HTTP_INTERCEPTORS,
         useClass: MsalInterceptor,
         multi: true,
       },
       MsalGuard,
     ],
     bootstrap: [AppComponent, MsalRedirectComponent],
   })
   export class AppModule {}
   ```

   The protected resources are provided as a `protectedResourceMap`. The URLs you provide in the `protectedResourceMap` collection are case-sensitive. For each resource, add scopes being requested to be returned in the access token.

   For example:

   - `["user.read"]` for Microsoft Graph
   - `["<Application ID URL>/scope"]` for custom web APIs (that is, `api://<Application ID>/access_as_user`)

   Modify the values in the `protectedResourceMap` as described here:

   - `Enter_the_Graph_Endpoint_Here` is the instance of the Microsoft Graph API the application should communicate with. For the **global** Microsoft Graph API endpoint, replace this string with `https://graph.microsoft.com`. For endpoints in **national** cloud deployments, see [National cloud deployments](/graph/deployments) in the Microsoft Graph documentation.

2. Replace the code in _src/app/profile/profile.component.ts_ to retrieve a user's profile with an HTTP request, and replace the `GRAPH_ENDPOINT` with the Microsoft Graph endpoint:

   ```JavaScript
   import { Component, OnInit } from '@angular/core';
   import { HttpClient } from '@angular/common/http';

   const GRAPH_ENDPOINT = 'Enter_the_Graph_Endpoint_Here/v1.0/me';

   type ProfileType = {
     givenName?: string,
     surname?: string,
     userPrincipalName?: string,
     id?: string
   };

   @Component({
     selector: 'app-profile',
     templateUrl: './profile.component.html',
     styleUrls: ['./profile.component.css']
   })
   export class ProfileComponent implements OnInit {
     profile!: ProfileType;

     constructor(
       private http: HttpClient
     ) { }

     ngOnInit() {
       this.getProfile();
     }

     getProfile() {
       this.http.get(GRAPH_ENDPOINT)
         .subscribe(profile => {
           this.profile = profile;
         });
     }
   }
   ```

3. Replace the UI in _src/app/profile/profile.component.html_ to display profile information:

   ```HTML
   <div>
       <p><strong>First Name: </strong> {{profile?.givenName}}</p>
       <p><strong>Last Name: </strong> {{profile?.surname}}</p>
       <p><strong>Email: </strong> {{profile?.userPrincipalName}}</p>
       <p><strong>Id: </strong> {{profile?.id}}</p>
   </div>
   ```

## Sign out

1. Update the code in _src/app/app.component.html_ to conditionally display a `Logout` button:

   ```HTML
   <mat-toolbar color="primary">
     <a class="title" href="/">{{ title }}</a>

     <div class="toolbar-spacer"></div>

     <a mat-button [routerLink]="['profile']">Profile</a>

     <button mat-raised-button *ngIf="!loginDisplay" (click)="login()">Login</button>
     <button mat-raised-button *ngIf="loginDisplay" (click)="logout()">Logout</button>

   </mat-toolbar>
   <div class="container">
     <!--This is to avoid reload during acquireTokenSilent() because of hidden iframe -->
     <router-outlet *ngIf="!isIframe"></router-outlet>
   </div>
   ```

### Sign out using redirects

1. Update the code in _src/app/app.component.ts_ to sign out a user using redirects:

   ```javascript
   import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
   import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
   import { InteractionStatus, RedirectRequest } from '@azure/msal-browser';
   import { Subject } from 'rxjs';
   import { filter, takeUntil } from 'rxjs/operators';

   @Component({
     selector: 'app-root',
     templateUrl: './app.component.html',
     styleUrls: ['./app.component.css']
   })
   export class AppComponent implements OnInit, OnDestroy {
     title = 'msal-angular-tutorial';
     isIframe = false;
     loginDisplay = false;
     private readonly _destroying$ = new Subject<void>();

     constructor(@Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration, private broadcastService: MsalBroadcastService, private authService: MsalService) { }

     ngOnInit() {
       this.isIframe = window !== window.parent && !window.opener;

       this.broadcastService.inProgress$
       .pipe(
         filter((status: InteractionStatus) => status === InteractionStatus.None),
         takeUntil(this._destroying$)
       )
       .subscribe(() => {
         this.setLoginDisplay();
       })
     }

     login() {
       if (this.msalGuardConfig.authRequest){
         this.authService.loginRedirect({...this.msalGuardConfig.authRequest} as RedirectRequest);
       } else {
         this.authService.loginRedirect();
       }
     }

     logout() { // Add log out function here
       this.authService.logoutRedirect({
         postLogoutRedirectUri: 'http://localhost:4200'
       });
     }

     setLoginDisplay() {
       this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
     }

     ngOnDestroy(): void {
       this._destroying$.next(undefined);
       this._destroying$.complete();
     }
   }
   ```

### Sign out using pop-ups

1. Update the code in _src/app/app.component.ts_ to sign out a user using pop-ups:

   ```javascript
   import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
   import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
   import { InteractionStatus, PopupRequest } from '@azure/msal-browser';
   import { Subject } from 'rxjs';
   import { filter, takeUntil } from 'rxjs/operators';

   @Component({
     selector: 'app-root',
     templateUrl: './app.component.html',
     styleUrls: ['./app.component.css']
   })
   export class AppComponent implements OnInit, OnDestroy {
     title = 'msal-angular-tutorial';
     isIframe = false;
     loginDisplay = false;
     private readonly _destroying$ = new Subject<void>();

     constructor(@Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration, private broadcastService: MsalBroadcastService, private authService: MsalService) { }

     ngOnInit() {
       this.isIframe = window !== window.parent && !window.opener;

       this.broadcastService.inProgress$
       .pipe(
         filter((status: InteractionStatus) => status === InteractionStatus.None),
         takeUntil(this._destroying$)
       )
       .subscribe(() => {
         this.setLoginDisplay();
       })
     }

     login() {
       if (this.msalGuardConfig.authRequest){
         this.authService.loginPopup({...this.msalGuardConfig.authRequest} as PopupRequest)
           .subscribe({
             next: (result) => {
               console.log(result);
               this.setLoginDisplay();
             },
             error: (error) => console.log(error)
           });
       } else {
         this.authService.loginPopup()
           .subscribe({
             next: (result) => {
               console.log(result);
               this.setLoginDisplay();
             },
             error: (error) => console.log(error)
           });
       }
     }

     logout() { // Add log out function here
       this.authService.logoutPopup({
         mainWindowRedirectUri: "/"
       });
     }

     setLoginDisplay() {
       this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
     }

     ngOnDestroy(): void {
       this._destroying$.next(undefined);
       this._destroying$.complete();
     }
   }
   ```

## Test your code

1. Start the web server to listen to the port by running the following commands at a command-line prompt from the application folder:

   ```bash
   npm install
   npm start
   ```

1. In your browser, enter `http://localhost:4200`, and you should see a page that looks like the following.

   :::image type="content" source="media/tutorial-v2-angular-auth-code/angular-01-not-signed-in.png" alt-text="Web browser displaying sign-in dialog":::

1. Select **Accept** to grant the app permissions to your profile. This will happen the first time that you start to sign in.

   :::image type="content" source="media/tutorial-v2-javascript-auth-code/spa-02-consent-dialog.png" alt-text="Content dialog displayed in web browser":::

1. After consenting, the following If you consent to the requested permissions, the web application shows a successful login page.

   :::image type="content" source="media/tutorial-v2-angular-auth-code/angular-02-signed-in.png" alt-text="Results of a successful sign-in in the web browser":::

1. Select **Profile** to view the user profile information returned in the response from the call to the Microsoft Graph API:

   :::image type="content" source="media/tutorial-v2-angular-auth-code/angular-03-profile-data.png" alt-text="Profile information from Microsoft Graph displayed in the browser":::

## Add scopes and delegated permissions

The Microsoft Graph API requires the _User.Read_ scope to read a user's profile. The _User.Read_ scope is added automatically to every app registration. Other APIs for Microsoft Graph, and custom APIs for your back-end server, might require other scopes. For example, the Microsoft Graph API requires the _Mail.Read_ scope in order to list the user's email.

As you add scopes, your users might be prompted to provide extra consent for the added scopes.

> [!NOTE]
> The user might be prompted for additional consents as you increase the number of scopes.

[!INCLUDE [Help and support](./includes/error-handling-and-tips/help-support-include.md)]

## Next steps

Delve deeper into single-page application (SPA) development on the Microsoft identity platform in our multi-part article series.

> [!div class="nextstepaction"] 
> [Scenario: Single-page application](scenario-spa-overview.md)

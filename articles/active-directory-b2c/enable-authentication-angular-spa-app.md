---
title: Enable authentication in an Angular application using Azure Active Directory B2C building blocks
description:  The building blocks of Azure Active Directory B2C to sign in and sign up users in an Angular application.
services: active-directory-b2c
author: msmimart
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 07/29/2021
ms.author: mimart
ms.subservice: B2C
ms.custom: "b2c-support"
---

# Enable authentication in your own Angular Application using Azure Active Directory B2C

This article shows you how to add Azure Active Directory B2C (Azure AD B2C) authentication to your own Angular Single Page Application (SPA). Learn how to integrate an Angular application with [MSAL for Angular](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/master/lib/msal-angular) authentication library. 

Use this article with [Configure authentication in a sample Angular SPA application](./configure-authentication-sample-angular-spa-app.md), substituting the sample Angular app with your own Angular app. After completing the steps in this article, your application will accept sign-ins via Azure AD B2C.

## Prerequisites

Review the prerequisites and integration steps in [Configure authentication in a sample Angular SPA application](configure-authentication-sample-angular-spa-app.md) article.

## Create an Angular app project

You can use an existing Angular app project, or create a new one. To create a new project, run the following commands. 

The following commands:

1. Install the [Angular CLI](https://angular.io/cli) using the npm package manager.
1. [Creates an Angular workspace](https://angular.io/cli/new) with routing module. The app name is `msal-angular-tutorial`, you can change it to any valid angular app name, such as `contoso-car-service`.
1. Change to the app directory folder.

```
npm install -g @angular/cli 
ng new msal-angular-tutorial --routing=true --style=css --strict=false
cd msal-angular-tutorial
```

## Install the dependencies

To install the [MSAL Browser](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/master/lib/msal-browser) and [MSAL Angular](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/master/lib/msal-angular) libraries in your application, in your command shell run the following commands:

```
npm install @azure/msal-browser @azure/msal-angular
```

Install the [Angular Material component library](https://material.angular.io/) (optional, for UI).

```
npm install @angular/material @angular/cdk
```

## Add the authentication components

The sample code is made up of the following components: 

|Component  |Type  |Description  |
|---------|---------|---------|
| auth-config.ts| Constants | A configuration file that contains information about your Azure AD B2C identity provider and the web API service. The Angular app uses this information to establish a trust relationship with Azure AD B2C, sign the user in and out, acquire tokens, and validate them. |
| app.module.ts| [Angular module](https://angular.io/guide/architecture-modules)| Describes how the application parts fit together. This is the root module that is used to bootstrap and launch the application. In this walkthrough, you add some components to the *app.module.ts* module, and initiate the MSAL library with the MSAL config object.  |
| app-routing.module.ts | [Angular routing module](https://angular.io/tutorial/toh-pt5) | Enables navigation by interpreting a browser URL and loading the corresponding component.  In this walkthrough, you add some components to the routing module, and protect components with [MSAL guard](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular/docs/v2-docs/msal-guard.md). Only authorized users can access the protected components.   |
| app.component.* | [Angular component](https://angular.io/guide/architecture-components) | The `ng new` command created an Angular project with a root component. In this walkthrough, you change the app component to host the top navigation bar. The navigation bar contains various buttons, including sign-in and sign-out. The *app.component.ts* class handles the sign-in and sign-out events.  |
| home.component.* | [Angular component](https://angular.io/guide/architecture-components)|In this walkthrough, you add the *home* component to render the anonymous access home page. This component demonstrates how to check whether a user has signed in.  |
| profile.component.* | [Angular component](https://angular.io/guide/architecture-components) | In this walkthrough, you add the *profile* component to learn how to read the ID token claims. |
| webapi.component.* | [Angular component](https://angular.io/guide/architecture-components)| In this walkthrough, you add the *webapi* component to learn how to call a web API. |



To add the following components to your app, run the following Angular CLI commands. The `generate component` commands:

1. Creates a folder for each component. The folder contains the TypeScript, HTML, CSS, and test files. 
1. Updates the `app.module.ts` and the `app-routing.module.ts` files with references to the new components. 

```
ng generate component home
ng generate component profile
ng generate component webapi
```

## Add the app settings

Azure AD B2C identity provider and web API settings are stored in the `auth-config.ts` file. In your *src/app* folder, create a file named *auth-config.ts* containing the following code. Then change the settings as described in the [3.1 Configure the Angular sample](configure-authentication-sample-angular-spa-app.md#31-configure-the-angular-sample).

```typescript
import { LogLevel, Configuration, BrowserCacheLocation } from '@azure/msal-browser';

const isIE = window.navigator.userAgent.indexOf("MSIE ") > -1 || window.navigator.userAgent.indexOf("Trident/") > -1;
 
export const b2cPolicies = {
     names: {
         signUpSignIn: "b2c_1_susi_reset_v2",
         editProfile: "b2c_1_edit_profile_v2"
     },
     authorities: {
         signUpSignIn: {
             authority: "https://your-tenant-name.b2clogin.com/your-tenant-name.onmicrosoft.com/b2c_1_susi_reset_v2",
         },
         editProfile: {
             authority: "https://your-tenant-name.b2clogin.com/your-tenant-name.onmicrosoft.com/b2c_1_edit_profile_v2"
         }
     },
     authorityDomain: "your-tenant-name.b2clogin.com"
 };
 
 
export const msalConfig: Configuration = {
     auth: {
         clientId: '<your-MyApp-application-ID>',
         authority: b2cPolicies.authorities.signUpSignIn.
         knownAuthorities: [b2cPolicies.authorityDomain],
         redirectUri: '/', 
     },
     cache: {
         cacheLocation: BrowserCacheLocation.LocalStorage,.
         storeAuthStateInCookie: isIE, 
     },
     system: {
         loggerOptions: {
            loggerCallback: (logLevel, message, containsPii) => {
                console.log(message);
             },
             logLevel: LogLevel.Verbose,
             piiLoggingEnabled: false
         }
     }
 }

export const protectedResources = {
  todoListApi: {
    endpoint: "http://localhost:5000/api/todolist",
    scopes: ["https://your-tenant-namee.onmicrosoft.com/api/tasks.read"],
  },
}
export const loginRequest = {
  scopes: []
};
```

## Initiate the authentication libraries

Public client applications are not trusted to safely keep application secrets and therefore don't have client secrets. In the *src/app* folder, open the *app.module.ts*, and make the following changes:

1. Import MSAL and MSAL browser libraries.
1. Import the Azure AD B2C configuration module.
1. Import the `HttpClientModule`. The HTTP client is used to call web APIs.
1. Import the Angular HTTP interceptor. MSAL uses the interceptor to inject the bearer token to the HTTP authorization header.
1. Add the essential Angular materials.
1. Instantiate MSAL using the multiple account public client application object. The MSAL initialization includes passing:
    1. The *auth-config.ts* configuration object.
    1. The routing guard configuration object.
    1. The MSAL interceptor configuration object. The interceptor class automatically acquires tokens for outgoing requests that use the Angular [HttpClient](https://angular.io/api/common/http/HttpClient) to known protected resources.
1. Configure the `HTTP_INTERCEPTORS`, and `MsalGuard` [Angular providers](https://angular.io/guide/providers).  
1. Add the `MsalRedirectComponent` to the [Angular bootstrap](https://angular.io/guide/bootstrapping).

In the *src/app* folder, edit *app.module.ts* and make the following modifications shown in the code snippet below. The changes are flagged with *Changes start here*, and *Changes end here*. After the changes, your code should look like the following code snippet.

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

/* Changes start here. */
// Import MSAL and MSAL browser libraries. 
import { MsalGuard, MsalInterceptor, MsalModule, MsalRedirectComponent } from '@azure/msal-angular';
import { InteractionType, PublicClientApplication } from '@azure/msal-browser';

// Import the Azure AD B2C configuration 
import { msalConfig, protectedResources } from './auth-config';

// Import the Angular HTTP interceptor. 
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { WebapiComponent } from './webapi/webapi.component';

// Add the essential Angular materials.
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
/* Changes end here. */

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    HomeComponent,
    WebapiComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    /* Changes start here. */
    // Import the following Angular materials. 
    MatButtonModule,
    MatToolbarModule,
    MatListModule,
    MatTableModule,
    // Import the HTTP client. 
    HttpClientModule,

    // Initiate the MSAL library with the MSAL config object
    MsalModule.forRoot(new PublicClientApplication(msalConfig),
      {
        // The routing guard configuration. 
        interactionType: InteractionType.Redirect,
        authRequest: {
          scopes: protectedResources.todoListApi.scopes
        }
      },
      {
        // MSAL interceptor configuration.
        // The protected resource mapping maps your web API with the corresponding app scopes. If your code needs to call another web API, add the URI mapping here.
        interactionType: InteractionType.Redirect,
        protectedResourceMap: new Map([
          [protectedResources.todoListApi.endpoint, protectedResources.todoListApi.scopes]
        ])
      })
    /* Changes end here. */
  ],
  providers: [
    /* Changes start here. */
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    MsalGuard
    /* Changes end here. */
  ],
  bootstrap: [
    AppComponent,
    /* Changes start here. */
    MsalRedirectComponent
    /* Changes end here. */
  ]
})
export class AppModule { }
```

## Configure routes

In this section, configure the routes for your Angular application. When a user selects a link on the page to navigate within your single-page application, or types a URL in the address bar, the routes map the URL to an Angular component. The Angular routing [canActivate](https://angular.io/api/router/CanActivate) interface uses the MSAL Guard to checks if user is signed-in. If the user isn't signed-in, MSAL takes the user to Azure AD B2C to authenticate.

In the *src/app* folder, edit *app-routing.module.ts* make the following modifications shown in the code snippet below. The changes are flagged with *Changes start here*, and *Changes end here*. 

After the changes, your code should look like the following code snippet.

```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { WebapiComponent } from './webapi/webapi.component';

const routes: Routes = [
  /* Changes start here. */
  {
    path: 'profile',
    component: ProfileComponent,
    // The profile component is protected with MSAL guard.
    canActivate: [MsalGuard]
  },
  {
    path: 'webapi',
    component: WebapiComponent,
    // The profile component is protected with MSAL guard.
    canActivate: [MsalGuard]
  },
  {
    // The home component allows anonymous access
    path: '',
    component: HomeComponent
  }
  /* Changes end here. */
];


@NgModule({
  /* Changes start here. */
  // Replace the following line with the next one
  //imports: [RouterModule.forRoot(routes)],
  imports: [RouterModule.forRoot(routes, {
    initialNavigation:'enabled'
  })],
  /* Changes end here. */
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

## Add the sign-in and sign-out buttons

In this section, you add the sign-in and sign-out buttons the *app* component. In the *src/app* folder, open the *app.component.ts*, and make the following changes:

1. Import the required components.
1. Change the class to implement [OnInit method](https://angular.io/api/core/OnInit). The `OnInit` method subscribes to the [MSAL MsalBroadcastService](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular/docs/v2-docs/events.md) `inProgress$` observable event. Use this event to know the status of user interactions, particularly to check that interactions are completed. Before interacting with MSAL account object, check the `InteractionStatus` property returns `InteractionStatus.None`. The `subscribe` event calls the `setLoginDisplay` method to check if the user is authenticated.
1. Add class variables.
1. Add the `login` method that initiates authorization flow.
1. Add the `logout` method that signs out the user. 
1. Add the `setLoginDisplay` method that checks if the user is authenticated.
1. Add the [ngOnDestroy](https://angular.io/api/core/OnDestroy) method to clean up the `inProgress$` subscribe event.

After the changes, your code should look like the following code snippet:

```typescript
import { Component, OnInit, Inject } from '@angular/core';
import { MsalService, MsalBroadcastService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { InteractionStatus, RedirectRequest } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

/* Changes start here. */
export class AppComponent implements OnInit{
  title = 'msal-angular-tutorial';
  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>();

  constructor(@Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration, private broadcastService: MsalBroadcastService, private authService: MsalService) { }

  ngOnInit() {

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

  logout() { 
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
  /* Changes end here. */
}
```

In the *src/app* folder, edit *app.component.html*, and make the following changes:

1. Add a link to the profile and web API components.
1. Add the login button with click event attribute set to the `login()` method. This button appears only if `loginDisplay` class variable is `false`.
1. Add the logout button with click event attribute set to the `logout()` method. This button appears only if `loginDisplay` class variable is `true`.
1. Add a [router-outlet](https://angular.io/api/router/RouterOutlet) element. 

After the changes, your code should look like the following code snippet.

```html
<mat-toolbar color="primary">
  <a class="title" href="/">{{ title }}</a>

  <div class="toolbar-spacer"></div>

  <a mat-button [routerLink]="['profile']">Profile</a>
  <a mat-button [routerLink]="['webapi']">Web API</a>

  <button mat-raised-button *ngIf="!loginDisplay" (click)="login()">Login</button>
  <button mat-raised-button *ngIf="loginDisplay" (click)="logout()">Logout</button>

</mat-toolbar>
<div class="container">
  <router-outlet></router-outlet>
</div>
```

Optionally, update the *app.component.css* file with the following CSS snippet. 

```css
.toolbar-spacer {
    flex: 1 1 auto;
  }

  a.title {
    color: white;
  }
```

## Handle the app redirects 

When using redirects with MSAL, it is mandatory to add the [app-redirect](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular/docs/v2-docs/redirects.md) directive to the *index.html*. In the *src* folder, edit *index.html*. 

After the changes, your code should look like the following code snippet.

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>MsalAngularTutorial</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
</head>
<body>
  <app-root></app-root>
  <!-- Changes start here -->
  <app-redirect></app-redirect>
  <!-- Changes end here -->
</body>
</html>
```

## Set app CSS (Optional)

In the */src* folder, update the *styles.css* file with the following CSS snippet. 

```css
@import '~@angular/material/prebuilt-themes/deeppurple-amber.css';

html, body { height: 100%; }
body { margin: 0; font-family: Roboto, "Helvetica Neue", sans-serif; }
.container { margin: 1%; }
```

> [!TIP]
> At this point you can run your app and test the sign-in experience. To run your application, see the [Run the Angular application](#run-the-angular-application) section.

## Check if a user is authenticated

The `home.component` demonstrates how to check the user is authenticated. In the *src/app/home* folder, update the *home.component.ts* with the following code snippet. 


The code:

1. Subscribes to the [MSAL MsalBroadcastService](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular/docs/v2-docs/events.md) `msalSubject$` and `inProgress$` observable events. 
1. The `msalSubject$` writes the authentication result to the browser console.
1. The `inProgress$` checks if a user is authenticated. The `getAllAccounts()` returns one, or more objects.


```typescript
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

In the *src/app/home* folder, update *home.component.html* with the following HTML snippet. The [*ngIf](https://angular.io/api/common/NgIf) directive checks the `loginDisplay` class variable to show or hide the welcome messages.

```html
<div *ngIf="!loginDisplay">
    <p>Please sign-in to see your profile information.</p>
</div>

<div *ngIf="loginDisplay">
    <p>Login successful!</p>
    <p>Request your profile information by clicking Profile above.</p>
</div>
```

## Read the ID token claims

The `profile.component` demonstrates how to access the user's ID token claims. In the *src/app/profile* folder, update the *profile.component.ts* with the following code snippet. 

The code:

1. Imports the required components.
1. Subscribes to the [MSAL MsalBroadcastService](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular/docs/v2-docs/events.md) `inProgress$` observable event. The event loads the account, and reads the ID token claims.
1. The `checkAndSetActiveAccount` method checks and sets the active account. This is common when the app interacts with multiple Azure AD B2C user flows or custom policies.
1. The `getClaims` method gets the ID token claims from the active MSAL account object. Then adds them to the `dataSource` array. The array is rendered to the user with the component's template binding.

```typescript
import { Component, OnInit } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { EventMessage, EventType, InteractionStatus } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  displayedColumns: string[] = ['claim', 'value'];
  dataSource: Claim[] = [];
  private readonly _destroying$ = new Subject<void>();
  
  constructor(private authService: MsalService, private msalBroadcastService: MsalBroadcastService) { }

  ngOnInit(): void {

    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) =>  status === InteractionStatus.None || status === InteractionStatus.HandleRedirect),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.checkAndSetActiveAccount();
        this.getClaims(this.authService.instance.getActiveAccount()?.idTokenClaims)
      })
  }

  checkAndSetActiveAccount() {

    let activeAccount = this.authService.instance.getActiveAccount();

    if (!activeAccount && this.authService.instance.getAllAccounts().length > 0) {
      let accounts = this.authService.instance.getAllAccounts();
      this.authService.instance.setActiveAccount(accounts[0]);
    }
  }

  getClaims(claims: any) {

    let list: Claim[]  =  new Array<Claim>();

    Object.keys(claims).forEach(function(k, v){
      
      let c = new Claim()
      c.id = v;
      c.claim = k;
      c.value =  claims ? claims[k]: null;
      list.push(c);
    });
    this.dataSource = list;

  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}

export class Claim {
  id: number;
  claim: string;
  value: string;
}
``` 

In the *src/app/profile* folder, update the *profile.component.html* with the following HTML snippet. 

```html
<h1>ID token claims:</h1>

<table mat-table [dataSource]="dataSource" class="mat-elevation-z8">

  <!-- Claim Column -->
  <ng-container matColumnDef="claim">
    <th mat-header-cell *matHeaderCellDef> Claim </th>
    <td mat-cell *matCellDef="let element"> {{element.claim}} </td>
  </ng-container>

  <!-- Value Column -->
  <ng-container matColumnDef="value">
    <th mat-header-cell *matHeaderCellDef> Value </th>
    <td mat-cell *matCellDef="let element"> {{element.value}} </td>
  </ng-container>

  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
</table>
```

## Call a web API

To call a [token-based authorization web API](enable-authentication-web-api.md), the app needs to have a valid access token. The [MsalInterceptor](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular/docs/v2-docs/msal-interceptor.md) provider automatically acquires tokens for outgoing requests that use the Angular [HttpClient](https://angular.io/api/common/http/HttpClient) to known protected resources.

> [!IMPORTANT]
> The MSAL initialization method (in the *app.module.ts* class) maps protected resources, such as web APIs with the required app scopes using the `protectedResourceMap` object. If your code needs to call another web API, add the web API URI, the web API HTTP method, with the corresponding scopes to the `protectedResourceMap` object. For more information, see [Protected Resource Map](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/master/lib/msal-angular/docs/v2-docs/msal-interceptor.md#protected-resource-map) article.


When the [HttpClient](https://angular.io/api/common/http/HttpClient)  object calls a web API, the [MsalInterceptor](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular/docs/v2-docs/msal-interceptor.md) provider takes the following steps:

1. Acquires an access token with the required permissions (scopes) for the web API endpoint. 
1. Passes the access token as a bearer token in the authorization header of the HTTP request using this format:

```http
Authorization: Bearer <access-token>
```

The `webapi.component` demonstrates how to call a web API. In the *src/app/webapi* folder, update the *webapi.component.ts* with the following code snippet.  

The following code:

1. Uses the Angular [HttpClient](https://angular.io/guide/http) to call the web API.
1. Reads the `auth-config` class's `protectedResources.todoListApi.endpoint`. This element specifies the web API URI. Based on the web API URI, the MSAL interceptor acquires an access token with the corresponding scopes. 
1. Gets the profile from the web API, and sets the `profile` class variable.

```typescript
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { protectedResources } from '../auth-config';

type ProfileType = {
  name?: string
};

@Component({
  selector: 'app-webapi',
  templateUrl: './webapi.component.html',
  styleUrls: ['./webapi.component.css']
})
export class WebapiComponent implements OnInit {
  todoListEndpoint: string = protectedResources.todoListApi.endpoint;
  profile!: ProfileType;

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.getProfile();
  }

  getProfile() {
    this.http.get(this.todoListEndpoint)
      .subscribe(profile => {
        this.profile = profile;
      });
  }
}
```

In the *src/app/webapi* folder, update *webapi.component.html* with the following HTML snippet. The component's template renders the `name` that returned by the web API. At the bottom of the page, the template renders the web API address.

```html
<h1>The web API returns:</h1>
<div>
    <p><strong>Name: </strong> {{profile?.name}}</p>
</div>

<div class="footer-text">
    Web API: {{todoListEndpoint}}
</div>
```

Optionally, update the *webapi.component.css* file with the following CSS snippet. 

```css
.footer-text {
    position: absolute;
    bottom: 50px;
    color: gray;
}
```

## Run the Angular application


Run the following commands:

```console
npm start
```

The console window displays the port number of where the application is hosted.

```console
Listening on port 4200...
```

> [!TIP]
> Alternatively to run the `npm start` command, use [VS Code debugger](https://code.visualstudio.com/docs/editor/debugging). VS Code's built-in debugger helps accelerate your edit, compile and debug loop.

Navigate to `http://localhost:4200` in your browser to view the application.


## Next steps

* Configure [Authentication options in your own Angular application using Azure AD B2C](enable-authentication-angular-spa-app-options.md)
* [Enable authentication in your own web API](enable-authentication-web-api.md)

---
title: Avoid page reloads (MSAL.js) | Azure
titleSuffix: Microsoft identity platform
description: Learn how to avoid page reloads when acquiring and renewing tokens silently using the Microsoft Authentication Library for JavaScript (MSAL.js).
services: active-directory
author: mmacy
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: how-to
ms.workload: identity
ms.date: 05/29/2019
ms.author: marsma
ms.reviewer: saeeda
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn about avoiding page reloads so I can create more robust applications.
---

# Avoid page reloads when acquiring and renewing tokens silently using MSAL.js
Microsoft Authentication Library for JavaScript (MSAL.js) uses hidden `iframe` elements to acquire and renew tokens silently in the background. Azure AD returns the token back to the registered redirect_uri specified in the token request(by default this is the app's root page). Since the response is a 302, it results in the HTML corresponding to the `redirect_uri` getting loaded in the `iframe`. Usually the app's `redirect_uri` is the root page and this causes it to reload.

In other cases, if navigating to the app's root page requires authentication, it might lead to nested `iframe` elements or `X-Frame-Options: deny` error.

Since MSAL.js cannot dismiss the 302 issued by Azure AD and is required to process the returned token, it cannot prevent the `redirect_uri` from getting loaded in the `iframe`.

To avoid the entire app reloading again or other errors caused due to this, please follow these workarounds.

## Specify different HTML for the iframe

Set the `redirect_uri` property on config to a simple page, that does not require authentication. You have to make sure that it matches with the `redirect_uri` registered in Azure portal. This will not affect user's login experience as MSAL saves the start page when user begins the login process and redirects back to the exact location after login is completed.

## Initialization in your main app file

If your app is structured such that there is one central Javascript file that defines the app's initialization, routing, and other stuff, you can conditionally load your app modules based on whether the app is loading in an `iframe` or not. For example:

In AngularJS: app.js

```javascript
// Check that the window is an iframe and not popup
if (window !== window.parent && !window.opener) {
angular.module('todoApp', ['ui.router', 'MsalAngular'])
    .config(['$httpProvider', 'msalAuthenticationServiceProvider','$locationProvider', function ($httpProvider, msalProvider,$locationProvider) {
        msalProvider.init(
            // msal configuration
        );

        $locationProvider.html5Mode(false).hashPrefix('');
    }]);
}
else {
    angular.module('todoApp', ['ui.router', 'MsalAngular'])
        .config(['$stateProvider', '$httpProvider', 'msalAuthenticationServiceProvider', '$locationProvider', function ($stateProvider, $httpProvider, msalProvider, $locationProvider) {
            $stateProvider.state("Home", {
                url: '/Home',
                controller: "homeCtrl",
                templateUrl: "/App/Views/Home.html",
            }).state("TodoList", {
                url: '/TodoList',
                controller: "todoListCtrl",
                templateUrl: "/App/Views/TodoList.html",
                requireLogin: true
            })

            $locationProvider.html5Mode(false).hashPrefix('');

            msalProvider.init(
                // msal configuration
            );
        }]);
}
```

In Angular: app.module.ts

```javascript
// Imports...
@NgModule({
  declarations: [
    AppComponent,
    MsalComponent,
    MainMenuComponent,
    AccountMenuComponent,
    OsNavComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    MsalModule.forRoot(environment.MsalConfig),
    SuiModule,
    PagesModule
  ],
  providers: [
    HttpServiceHelper,
    {provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true},
    AuthService
  ],
  entryComponents: [
    AppComponent,
    MsalComponent
  ]
})
export class AppModule {
  constructor() {
    console.log('APP Module Constructor!');
  }

  ngDoBootstrap(ref: ApplicationRef) {
    if (window !== window.parent && !window.opener)
    {
      console.log("Bootstrap: MSAL");
      ref.bootstrap(MsalComponent);
    }
    else
    {
    //this.router.resetConfig(RouterModule);
      console.log("Bootstrap: App");
      ref.bootstrap(AppComponent);
    }
  }
}
```

MsalComponent:

```javascript
import { Component} from '@angular/core';
import { MsalService } from '@azure/msal-angular';

// This component is used only to avoid Angular reload
// when doing acquireTokenSilent()

@Component({
  selector: 'app-root',
  template: '',
})
export class MsalComponent {
  constructor(private Msal: MsalService) {
  }
}
```

## Next steps
Learn more about [building a single-page application (SPA)](scenario-spa-overview.md) using MSAL.js.
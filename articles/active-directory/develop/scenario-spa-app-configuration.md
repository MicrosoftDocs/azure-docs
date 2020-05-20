---
title: Configure single-page app - Microsoft identity platform | Azure
description: Learn how to build a single-page application (app's code configuration)
services: active-directory
author: navyasric
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 02/11/2020
ms.author: nacanuma
ms.custom: aaddev
#Customer intent: As an application developer, I want to know how to write a single-page application by using the Microsoft identity platform for developers.
---

# Single-page application: Code configuration

Learn how to configure the code for your single-page application (SPA).

## MSAL libraries that support implicit flow

The Microsoft identity platform provides the following Microsoft Authentication Library (MSAL) libraries to support implicit flow by using industry-recommended security practices:

| MSAL library | Description |
|--------------|--------------|
| ![MSAL.js](media/sample-v2-code/logo_js.png) <br/> [MSAL.js](https://github.com/AzureAD/microsoft-authentication-library-for-js)  | Plain JavaScript library for use in any client-side web app that's built through JavaScript or SPA frameworks such as Angular, Vue.js, and React.js. |
| ![MSAL Angular](media/sample-v2-code/logo_angular.png) <br/> [MSAL Angular](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-angular/README.md) | Wrapper of the core MSAL.js library to simplify use in single-page apps that are built through the Angular framework. |

## Application code configuration

In an MSAL library, the application registration information is passed as configuration during the library initialization.

# [JavaScript](#tab/javascript)

```javascript
// Configuration object constructed.
const config = {
    auth: {
        clientId: 'your_app_id',
        redirectUri: "your_app_redirect_uri" //defaults to application start page
    }
}

// create UserAgentApplication instance
const userAgentApplication = new UserAgentApplication(config);
```

For more information on the configurable options, see [Initializing application with MSAL.js](msal-js-initializing-client-applications.md).

# [Angular](#tab/angular)

```javascript
// App.module.ts
import { MsalModule } from '@azure/msal-angular';

@NgModule({
    imports: [
        MsalModule.forRoot({
            auth: {
                clientId: 'your_app_id'
            }
        })
    ]
})

export class AppModule { }
```

---

## Next steps

> [!div class="nextstepaction"]
> [Sign-in and sign-out](scenario-spa-sign-in.md)

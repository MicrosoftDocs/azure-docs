---
title: Configure single-page app
description: Learn how to build a single-page application (app's code configuration)
services: active-directory
author: OwenRichards1
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 02/11/2020
ms.author: owenrichards
ms.custom: aaddev
#Customer intent: As an application developer, I want to know how to write a single-page application by using the Microsoft identity platform.
---

# Single-page application: Code configuration

Learn how to configure the code for your single-page application (SPA).

## Microsoft libraries supporting single-page apps

The following Microsoft libraries support single-page apps:

[!INCLUDE [active-directory-develop-libraries-spa](./includes/libraries/libraries-spa.md)]

## Application code configuration

In an MSAL library, the application registration information is passed as configuration during the library initialization.

# [JavaScript (MSAL.js v2)](#tab/javascript2)

```javascript
import * as Msal from "@azure/msal-browser"; // if using CDN, 'Msal' will be available in global scope

// Configuration object constructed.
const config = {
    auth: {
        clientId: 'your_client_id'
    }
};

// create PublicClientApplication instance
const publicClientApplication = new Msal.PublicClientApplication(config);
```

For more information on the configurable options, see [Initializing application with MSAL.js](msal-js-initializing-client-applications.md).

# [JavaScript (MSAL.js v1)](#tab/javascript1)

```javascript
import * as Msal from "msal"; // if using CDN, 'Msal' will be available in global scope

// Configuration object constructed.
const config = {
    auth: {
        clientId: 'your_client_id'
    }
};

// create UserAgentApplication instance
const userAgentApplication = new Msal.UserAgentApplication(config);
```

For more information on the configurable options, see [Initializing application with MSAL.js](msal-js-initializing-client-applications.md).

# [Angular (MSAL.js v2)](#tab/angular2)

```javascript
// In app.module.ts
import { MsalModule } from '@azure/msal-angular';
import { PublicClientApplication } from '@azure/msal-browser';

@NgModule({
    imports: [
        MsalModule.forRoot( new PublicClientApplication({
            auth: {
                clientId: 'Enter_the_Application_Id_Here',
            }
        }), null, null)
    ]
})
export class AppModule { }
```

# [Angular (MSAL.js v1)](#tab/angular1)

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

# [React](#tab/react)

```javascript
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";

// Configuration object constructed.
const config = {
    auth: {
        clientId: 'your_client_id'
    }
};

// create PublicClientApplication instance
const publicClientApplication = new PublicClientApplication(config);

// Wrap your app component tree in the MsalProvider component
ReactDOM.render(
    <React.StrictMode>
        <MsalProvider instance={publicClientApplication}>
            <App />
        </ MsalProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
```

---

## Next steps

Move on to the next article in this scenario, [Sign-in and sign-out](scenario-spa-sign-in.md).

---
title: Configure single-page app | Azure
titleSuffix: Microsoft identity platform
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
#Customer intent: As an application developer, I want to know how to write a single-page application by using the Microsoft identity platform.
---

# Single-page application: Code configuration

Learn how to configure the code for your single-page application (SPA).

## Microsoft libraries supporting single-page apps 

The following Microsoft libraries support single-page apps:

[!INCLUDE [active-directory-develop-libraries-spa](../../../includes/active-directory-develop-libraries-spa.md)]

## Application code configuration

In an MSAL library, the application registration information is passed as configuration during the library initialization.

# [JavaScript](#tab/javascript)

```javascript
// Configuration object constructed.
const config = {
    auth: {
        clientId: 'your_client_id'
    }
};

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

Move on to the next article in this scenario, [Sign-in and sign-out](scenario-spa-sign-in.md).

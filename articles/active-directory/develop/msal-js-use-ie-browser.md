---
title: Use Internet Explorer (Microsoft Authentication Library for JavaScript) | Azure
description: Learn about using the Microsoft Authentication Library for JavaScript (MSAL.js) with Internet Explorer browser.
services: active-directory
documentationcenter: dev-center-name
author: navyasric
manager: CelesteDG
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/16/2019
ms.author: nacanuma
ms.reviewer: saeeda
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn about issues with MSAL.js library so I can decide if this platform meets my application development needs and requirements.
ms.collection: M365-identity-device-management
---

# Known issues on Internet Explorer and Microsoft Edge browsers with MSAL.js

Microsoft Authentication Library for JavaScript (MSAL.js) is generated for [JavaScript ES5](https://fr.wikipedia.org/wiki/ECMAScript#ECMAScript_Edition_5_.28ES5.29) so that it can run in Internet Explorer. There are, however, a few things to know.

## Run an app in Internet Explorer
If you intend to use MSAL.js in applications that can run in Internet Explorer, you will need to add a reference to a promise polyfill before referencing the MSAL.js script.

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.3.4/bluebird.min.js" class="pre"></script>
```

This is because Internet Explorer does not support JavaScript promises natively.

## Debugging an application running in Internet Explorer

### Running in production
Deploying your application to production (for instance in Azure Web apps) normally works fine, provided the end user has accepted popups. We tested it with Internet Explorer 11.

### Running locally
If you want to run and debug locally your application running in Internet Explorer, you need to be aware of the following considerations (assume that you want to run your application as *http://localhost:1234*):

- Internet Explorer has a security mechanism named "protected mode", which prevents MSAL.js from working correctly. Among the symptoms, after you sign in, the page can be redirected to http://localhost:1234/null.

- To run and debug your application locally, you'll need to disable this "protected mode". For this:

    1. Click Internet Explorer **Tools** (the gear icon).
    1. Select **Internet Options** and then the **Security** tab.
    1. Click on the **Internet** zone, and uncheck **Enable Protected Mode (requires restarting Internet Explorer)**. Internet Explorer warns that your computer is no longer protected. Click **OK**.
    1. Restart Internet Explorer.
    1. Run and debug your application.

When you are done, restore the Internet Explorer security settings.  Select **Settings** -> **Internet Options** -> **Security** -> **Reset all zones to default level**.

## Next steps
Learn more about [Known issues when using MSAL.js in Internet Explorer](msal-js-use-ie-browser.md).
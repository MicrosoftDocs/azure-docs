---
title: Issues on Internet Explorer (MSAL.js) | Azure
titleSuffix: Microsoft identity platform
description: Use the Microsoft Authentication Library for JavaScript (MSAL.js) with Internet Explorer browser.
services: active-directory
author: mmacy
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 11/25/2021
ms.author: marsma
ms.reviewer: saeeda
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn about issues with MSAL.js library so I can decide if this platform meets my application development needs and requirements.
---

# Known issues on Internet Explorer browsers (MSAL.js)

The Microsoft Authentication Library for JavaScript (MSAL.js) is generated for [JavaScript ES5](https://fr.wikipedia.org/wiki/ECMAScript#ECMAScript_Edition_5_.28ES5.29) so that it can run in Internet Explorer. There are, however, a few things to know.

## Run an app in Internet Explorer

If you intend to use MSAL.js in applications that can run in Internet Explorer, you'll need to add a reference to a promise polyfill before referencing the MSAL.js script.

```html
<script
  src="https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.3.4/bluebird.min.js"
  class="pre"
></script>
```

Internet Explorer doesn't support JavaScript promises natively.

## Debugging an application running in Internet Explorer

### Running in production

Deploying your application to production (for instance in Azure Web apps) normally works fine, provided the end user has accepted popups. We tested it with Internet Explorer 11.

### Running locally

If you want to run and debug your application locally in Internet Explorer, be aware of the following considerations (assuming that you want to run your application at _http://localhost:1234_):

- Internet Explorer has a security mechanism named "protected mode", which prevents MSAL.js from working correctly. Among the symptoms, after you sign in, the page can be redirected to _http://localhost:1234/null_.

- To run and debug your application locally, you'll need to disable "protected mode". Follow these steps to disable "protected mode":

  1. Select Internet Explorer **Tools** (the gear icon).
  1. Select **Internet Options** and then the **Security** tab.
  1. Select **Internet** zone, and uncheck **Enable Protected Mode (requires restarting Internet Explorer)**. Internet Explorer warns that your computer is no longer protected. Select **OK**.
  1. Restart Internet Explorer.
  1. Run and debug your application.

When you're done, restore the Internet Explorer security settings. Select **Settings** -> **Internet Options** -> **Security** -> **Reset all zones to default level**.

## Next steps

Learn more about [Known issues when using MSAL.js in Internet Explorer](msal-js-known-issues-ie-edge-browsers.md).

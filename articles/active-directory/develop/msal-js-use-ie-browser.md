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

For better compatibility with Internet Explorer, we generate the Microsoft Authentication Library for JavaScript (MSAL.js) for [JavaScript ES5](https://262.ecma-international.org/5.1/), but there are other things to consider as you develop your application.

## Run an app in Internet Explorer

Internet Explorer lacks native support for JavaScript Promises, required by MSAL.js.

To support JavaScript Promises in an Internet Explorer app, reference a Promise polyfill before you reference MSAL.js.

```html
<script
  src="https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.3.4/bluebird.min.js"
  class="pre"
></script>
```


## Debugging an application running in Internet Explorer

### Running in production

Deploying your application to production (for instance in Azure Web apps) normally works fine, provided the end user has accepted popups. We tested it with Internet Explorer 11.

### Running locally

If you want to run and debug your application locally in Internet Explorer, be aware of the following considerations (assuming that you want to run your application at _http://localhost:1234_):

- Internet Explorer has a security mechanism named "protected mode", which prevents MSAL.js from working correctly. Among the symptoms, after you sign in, the page can be redirected to _http://localhost:1234/null_.

- To run and debug your application locally, you'll need to disable "protected mode". Follow these steps to disable "protected mode":

  1. In Internet Explorer, select **Tools** > **Internet Options** > **Security** tab > **Internet** zone.
  1. Clear the **Enable Protected Mode (requires restarting Internet Explorer)** checkbox.
  1. Select **OK** to restart Internet Explorer.

When you're done debugging, follow the previous steps and select (instead of clear) the **Enable Protected Mode (requires restarting Internet Explorer)** checkbox.

## Next steps

Learn more about [Known issues when using MSAL.js in Internet Explorer](msal-js-known-issues-ie-edge-browsers.md).

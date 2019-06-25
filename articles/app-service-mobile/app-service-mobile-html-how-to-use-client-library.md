---
title: How to Use the JavaScript SDK for Azure Mobile Apps
description: How to Use v for Azure Mobile Apps
services: app-service\mobile
documentationcenter: javascript
author: elamalani
manager: crdun
editor: ''

ms.assetid: 53b78965-caa3-4b22-bb67-5bd5c19d03c4
ms.service: app-service-mobile
ms.workload: mobile
ms.tgt_pltfrm: html
ms.devlang: javascript
ms.topic: article
ms.date: 06/25/2019
ms.author: emalani
---
# How to Use the JavaScript client library for Azure Mobile Apps
[!INCLUDE [app-service-mobile-selector-client-library](../../includes/app-service-mobile-selector-client-library.md)]

> [!NOTE]
> Visual Studio App Center is investing in new and integrated services central to mobile app development. Developers can use **Build**, **Test** and **Distribute** services to set up Continuous Integration and Delivery pipeline. Once the app is deployed, developers can monitor the status and usage of their app using the **Analytics** and **Diagnostics** services, and engage with users using the **Push** service. Developers can also leverage **Auth** to authenticate their users and **Data** service to persist and sync app data in the cloud. Check out [App Center](https://appcenter.ms/?utm_source=zumo&utm_campaign=app-service-mobile-html-how-to-use-client-library) today.
>

## Overview
This guide teaches you to perform common scenarios using the latest [JavaScript SDK for Azure Mobile Apps]. If you are
new to Azure Mobile Apps, first complete [Azure Mobile Apps Quick Start] to create a backend and create a table. In this
guide, we focus on using the mobile backend in HTML/JavaScript Web applications.

## Supported platforms
We limit browser support to the current and last versions of the major browsers:  Google Chrome, Microsoft Edge,
Microsoft Internet Explorer, and Mozilla Firefox.  We expect the SDK to function with any relatively modern
browser.

The package is distributed as a Universal JavaScript Module, so it supports globals, AMD, and CommonJS formats.

## <a name="Setup"></a>Setup and prerequisites
This guide assumes that you have created a backend with a table. This guide assumes that the table has the same
schema as the tables in those tutorials.

Installing the Azure Mobile Apps JavaScript SDK can be done via the `npm` command:

```
npm install azure-mobile-apps-client --save
```

The library can also be used as an ES2015 module, within CommonJS environments such as Browserify and
Webpack and as an AMD library.  For example:

```javascript
// For ECMAScript 5.1 CommonJS
var WindowsAzure = require('azure-mobile-apps-client');
// For ES2015 modules
import * as WindowsAzure from 'azure-mobile-apps-client';
```

You can also use a pre-built version of the SDK by downloading directly from our CDN:

```html
<script src="https://zumo.blob.core.windows.net/sdk/azure-mobile-apps-client.min.js"></script>
```

[!INCLUDE [app-service-mobile-html-js-library](../../includes/app-service-mobile-html-js-library.md)]

## <a name="auth"></a>How to: Authenticate users
Azure App Service supports authenticating and authorizing app users using various external identity
providers: Facebook, Google, Microsoft Account, and Twitter. You can set permissions on tables to restrict
access for specific operations to only authenticated users. You can also use the identity of authenticated
users to implement authorization rules in server scripts. For more information, see the [Get started with authentication] tutorial.

Two authentication flows are supported: a server flow and a client flow.  The server flow provides the simplest
authentication experience, as it relies on the provider's web authentication interface. The client flow allows for
deeper integration with device-specific capabilities such as single-sign-on as it relies on provider-specific SDKs.

[!INCLUDE [app-service-mobile-html-js-auth-library](../../includes/app-service-mobile-html-js-auth-library.md)]

### <a name="configure-external-redirect-urls"></a>How to: Configure your Mobile App Service for external redirect URLs.
Several types of JavaScript applications use a loopback capability to handle OAuth UI flows.  These capabilities include:

* Running your service locally
* Using Live Reload with the Ionic Framework
* Redirecting to App Service for authentication.

Running locally can cause problems because, by default, App Service authentication is only configured to allow access from
your Mobile App backend. Use the following steps to change the App Service settings to enable authentication when running
the server locally:

1. Log in to the [Azure portal]
2. Navigate to your Mobile App backend.
3. Select **Resource explorer** in the **DEVELOPMENT TOOLS** menu.
4. Click **Go** to open the resource explorer for your Mobile App backend in a new tab or window.
5. Expand the **config** > **authsettings** node for your app.
6. Click the **Edit** button to enable editing of the resource.
7. Find the **allowedExternalRedirectUrls** element, which should be null. Add your URLs in an array:

         "allowedExternalRedirectUrls": [
             "http://localhost:3000",
             "https://localhost:3000"
         ],

    Replace the URLs in the array with the URLs of your service, which in this example is `http://localhost:3000` for the local Node.js sample service. You could also use `http://localhost:4400` for the Ripple service or some other URL, depending on how your app is configured.
8. At the top of the page, click **Read/Write**, then click **PUT** to save your updates.

You also need to add the same loopback URLs to the CORS whitelist settings:

1. Navigate back to the [Azure portal].
2. Navigate to your Mobile App backend.
3. Click **CORS** in the **API** menu.
4. Enter each URL in the empty **Allowed Origins** text box.  A new text box is created.
5. Click **SAVE**

After the backend updates, you will be able to use the new loopback URLs in your app.

<!-- URLs. -->
[Azure Mobile Apps Quick Start]: app-service-mobile-cordova-get-started.md
[Get started with authentication]: app-service-mobile-cordova-get-started-users.md
[Add authentication to your app]: app-service-mobile-cordova-get-started-users.md

[Azure portal]: https://portal.azure.com/
[JavaScript SDK for Azure Mobile Apps]: https://www.npmjs.com/package/azure-mobile-apps-client
[Query object documentation]: https://msdn.microsoft.com/library/azure/jj613353.aspx

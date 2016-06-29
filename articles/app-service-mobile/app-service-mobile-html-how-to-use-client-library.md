<properties
	pageTitle="How to Use the JavaScript SDK for Azure Mobile Apps"
	description="How to Use v for Azure Mobile Apps"
	services="app-service\mobile"
	documentationCenter="javascript"
	authors="adrianhall"
	manager="erikre"
	editor=""/>

<tags
	ms.service="app-service-mobile"
	ms.workload="mobile"
	ms.tgt_pltfrm="html"
	ms.devlang="javascript"
	ms.topic="article"
	ms.date="06/29/2016"
	ms.author="adrianha;ricksal"/>

# How to Use the JavaScript Client Library for Azure Mobile Apps

[AZURE.INCLUDE [app-service-mobile-selector-client-library](../../includes/app-service-mobile-selector-client-library.md)]

This guide teaches you to perform common scenarios using the latest [JavaScript SDK for Azure Mobile Apps]. If you are new to Azure Mobile
Apps, first complete [Azure Mobile Apps Quick Start] to create a backend and create a table. In this guide, we focus on using the mobile
backend in HTML/JavaScript Web applications.

##<a name="Setup"></a>Setup and Prerequisites

This guide assumes that you have created a backend with a table. This guide assumes that the table has the same schema as the tables in those
tutorials.

Installing the Azure Mobile Apps JavaScript SDK can be done via the `npm` command:

```
npm install azure-mobile-apps-client --save
```

Once installed, the library is located in `node_modules/azure-mobile-apps-client/dist/MobileServices.Web.min.js`.  Copy this file to your web area.

```
<script src="path/to/MobileServices.Web.min.js"></script>
```

The library can also be used as an ES2015 module, within CommonJS environments such as Browserify and
Webpack and as an AMD library.  For example:

```
# For ECMAScript 5.1 CommonJS
var WindowsAzure = require('azure-mobile-apps-client');
# For ES2015 modules
import * as WindowsAzure from 'azure-mobile-apps-client';
```

[AZURE.INCLUDE [app-service-mobile-html-js-library](../../includes/app-service-mobile-html-js-library.md)]

##<a name="auth"></a>How to: Authenticate Users

Azure App Service supports authenticating and authorizing app users using a variety of external identity
providers: Facebook, Google, Microsoft Account, and Twitter.   You can set permissions on tables to restrict
access for specific operations to only authenticated users. You can also use the identity of authenticated
users to implement authorization rules in server scripts. For more information, see the [Get started with authentication] tutorial.

Two authentication flows are supported: a server flow and a client flow.  The server flow provides the simplest
authentication experience, as it relies on the provider's web authentication interface. The client flow allows for
deeper integration with device-specific capabilities such as single-sign-on as it relies on provider-specific SDKs.

[AZURE.INCLUDE [app-service-mobile-html-js-auth-library](../../includes/app-service-mobile-html-js-auth-library.md)]

###<a name="configure-external-redirect-urls"></a>How to: Configure your Mobile App Service for External Redirect URLs.

Several types of JavaScript applications use a loopback capability to handle OAuth UI flows, such as when running your service locally, using live reload in the Ionic Framework, or when redirecting to App Service for authentication. This can cause problems because, by default, App Service authentication is only configured to allow access from your Mobile App backend. 

Use the following steps to change the App Service settings to enable authentication from your localhost:

1. Log into the [Azure Portal], navigate to your Mobile App backend, then click **Tools** > **Resource explorer** > **Go** to open a new resource explorer window for your Mobile App backend (site).

2. Expand the **config** node for your app, then click  **authsettings** > **Edit**, find the **allowedExternalRedirectUrls** element, which should be null, and change it to the following:

         "allowedExternalRedirectUrls": [
             "http://localhost:3000",
             "https://localhost:3000"
         ],

    Replace the URLs in the array with the URLs of your service, which in this example is `http://localhost:3000` for the local Node.js sample service. You could also use `http://localhost:4400` for the Ripple service or some other URL, depending on how your app is configured.  
    
3. At the top of the page, click **Read/Write**, then click **PUT** to save your updates.

    You still need to add the same loopback URLs to the CORS whitelist settings:

4. Back in the [Azure Portal] in your mobile app backend, click  **All Settings** > **CORS**, add the loopback URLs to whitelist, then click  **Save**.

After the backend updates, you will be able to use the new loopback URLs in your app.

<!-- URLs. -->
[Azure Mobile Apps Quick Start]: app-service-mobile-cordova-get-started.md
[Get started with authentication]: app-service-mobile-cordova-get-started-users.md
[Add authentication to your app]: app-service-mobile-cordova-get-started-users.md

[JavaScript SDK for Azure Mobile Apps]: https://www.npmjs.com/package/azure-mobile-apps-client
[Query object documentation]: https://msdn.microsoft.com/en-us/library/azure/jj613353.aspx


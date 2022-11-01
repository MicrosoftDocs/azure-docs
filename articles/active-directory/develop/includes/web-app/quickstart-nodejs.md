---
title: "Quickstart: Add user sign-in to a Node.js web app"
description: In this quickstart, you learn how to implement authentication in a Node.js web application using OpenID Connect.
services: active-directory
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: quickstart
ms.workload: identity
ms.date: 11/17/2021
ms.author: jmprieur
ms.custom: aaddev, identityplatformtop40, scenarios:getting-started, languages:ASP.NET, devx-track-js
#Customer intent: As an application developer, I want to know how to set up OpenID Connect authentication in a web application built using Node.js with Express.
---

In this quickstart, you download and run a code sample that demonstrates how to set up OpenID Connect authentication in a web application built using Node.js with Express. The sample is designed to run on any platform.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [Node.js](https://nodejs.org/en/download/).

## Register your application

1. Sign in to the <a href="https://portal.azure.com/" target="_blank">Azure portal</a>.
1. If you have access to multiple tenants, use the **Directories + subscriptions** filter :::image type="icon" source="../../media/common/portal-directory-subscription-filter.png" border="false"::: in the top menu to switch to the tenant in which you want to register the application.
1. Search for and select **Azure Active Directory**.
1. Under **Manage**, select **App registrations** > **New registration**.
1. Enter a **Name** for your application, for example `MyWebApp`. Users of your app might see this name, and you can change it later.
1. In the **Supported account types** section, select **Accounts in any organizational directory and personal Microsoft accounts (e.g. Skype, Xbox, Outlook.com)**.

    If there are more than one redirect URIs, add these from the **Authentication** tab later after the app has been successfully created.

1. Select **Register** to create the app.
1. On the app's **Overview** page, find the **Application (client) ID** value and record it for later. You'll need this value to configure the application later in this project.
1. Under **Manage**, select **Authentication**.
1. Select **Add a platform** > **Web**. 
1. In the **Redirect URIs** section,  enter `http://localhost:3000/auth/openid/return`.
1. Enter a **Front-channel logout URL** `https://localhost:3000`.
1. In the **Implicit grant and hybrid flows** section, select **ID tokens** as this sample requires the [Implicit grant flow](../../v2-oauth2-implicit-grant-flow.md) to be enabled to sign-in the user.
1. Select **Configure**.
1. Under **Manage**, select **Certificates & secrets** > **Client secrets** > **New client secret**.
1. Enter a key description (for instance app secret).
1. Select a key duration of either **In 1 year, In 2 years,** or **Never Expires**.
1. Select **Add**. The key value will be displayed. Copy the key value and save it in a safe location for later use.


## Download the sample application and modules

Next, clone the sample repo and install the NPM modules.

From your shell or command line:

```
$ git clone git@github.com:AzureADQuickStarts/AppModelv2-WebApp-OpenIDConnect-nodejs.git 
```
or

```
$ git clone https://github.com/AzureADQuickStarts/AppModelv2-WebApp-OpenIDConnect-nodejs.git
```

From the project root directory, run the command:

```
$ npm install

```

## Configure the application

Provide the parameters in `exports.creds` in config.js as instructed.

* Update `<tenant_name>` in `exports.identityMetadata` with the Azure AD tenant name of the format \*.onmicrosoft.com.
* Update `exports.clientID` with the Application ID noted from app registration.
* Update `exports.clientSecret` with the Application secret noted from app registration.
* Update `exports.redirectUrl` with the Redirect URI noted from app registration.

**Optional configuration for production apps:**

* Update `exports.destroySessionUrl` in config.js, if you want to use a different `post_logout_redirect_uri`.

* Set `exports.useMongoDBSessionStore` in config.js to true, if you want to use [mongoDB](https://www.mongodb.com) or other [compatible session stores](https://github.com/expressjs/session#compatible-session-stores).
The default session store in this sample is `express-session`. The default session store isn't suitable for production.

* Update `exports.databaseUri`, if you want to use mongoDB session store and a different database URI.

* Update `exports.mongoDBSessionMaxAge`. Here you can specify how long you want to keep a session in mongoDB. The unit is second(s).

## Build and run the application

Start mongoDB service. If you're using mongoDB session store in this app, you have to [install mongoDB](http://www.mongodb.org/) and start the service first. If you're using the default session store, you can skip this step.

Run the app using the following command from your command line.

```
$ node app.js
```

**Is the server output hard to understand?:** We use `bunyan` for logging in this sample. The console won't make much sense to you unless you also install bunyan and run the server like above but pipe it through the bunyan binary:

```
$ npm install -g bunyan

$ node app.js | bunyan
```

### You're done!

You'll have a server successfully running on `http://localhost:3000`.

[!INCLUDE [Help and support](../../../../../includes/active-directory-develop-help-support-include.md)]

## Next steps
Learn more about the web app scenario that the Microsoft identity platform supports:
> [!div class="nextstepaction"]
> [Web app that signs in users scenario](../../scenario-web-app-sign-user-overview.md)
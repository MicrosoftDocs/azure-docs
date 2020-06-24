---
title: Add OIDC sign in to a Node.js Web app - Microsoft identity platform | Azure
description: Learn how to implement authentication in a Node.js web application using OpenID Connect.
services: active-directory
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: quickstart
ms.workload: identity
ms.date: 10/28/2019
ms.author: jmprieur
ms.custom: aaddev, identityplatformtop40, scenarios:getting-started, languages:ASP.NET
#Customer intent: As an application developer, I want to know how to set up OpenID Connect authentication in a web application built using Node.js with Express.
---

# Quickstart: Add sign in using OpenID Connect to a Node.js web app

In this quickstart, you'll learn how to set up OpenID Connect authentication in a web application built using Node.js with Express. The sample is designed to run on any platform.

## Prerequisites

To run this sample, you will need:

* Install Node.js from http://nodejs.org/

* Either a [Microsoft account](https://www.outlook.com) or [Microsoft 365 Developer Program](/office/developer-program/office-365-developer-program)

## Register your application
1. Sign in to the [Azure portal](https://portal.azure.com/) using either a work or school account, or a personal Microsoft account.
1. If your account is present in more than one Azure AD tenant:
    - Select your profile from the menu on the top-right corner of the page, and then **Switch directory**.
    - Change your session to the Azure AD tenant where you want to create your application.

1. Navigate to [Azure Active Directory > App registrations](https://go.microsoft.com/fwlink/?linkid=2083908) to register your app.

1. Select **New registration.**

1. When the **Register an application** page appears, enter your app's registration information:
    - In the **Name** section, enter a meaningful name that will be displayed to users of the app. For example: MyWebApp
    - In the **Supported account types** section, select **Accounts in any organizational directory and personal Microsoft accounts (e.g. Skype, Xbox, Outlook.com)**.

    If there are more than one redirect URIs, you'll need to add these from the **Authentication** tab later after the app has been successfully created.

1. Select **Register** to create the app.

1. On the app's **Overview** page, find the **Application (client) ID** value and record it for later. You'll need this value to configure the application later in this project.

1. In the list of pages for the app, select **Authentication**.
    - In the **Redirect URIs** section, select **Web** in the combo-box and enter the following redirect URI:
    `http://localhost:3000/auth/openid/return`
    - In the **Advanced settings** section, set **Logout URL** to `http://localhost:3000`.
    - In the **Advanced settings > Implicit grant** section, check **ID tokens** as this sample requires the [Implicit grant flow](https://docs.microsoft.com/azure/active-directory/develop/v2-oauth2-implicit-grant-flow) to be enabled to sign-in the user.

1. Select **Save**.

1. From the **Certificates & secrets** page, in the **Client secrets** section, choose **New client secret**.
    - Enter a key description (for instance app secret).
    - Select a key duration of either **In 1 year, In 2 years,** or **Never Expires**.
    - When you click the **Add** button, the key value will be displayed. Copy the key value and save it in a safe location.

    You'll need this key later to configure the application. This key value will not be displayed again, nor retrievable by any other means, so record it as soon as it is visible from the Azure portal.

## Download the sample application and modules

Next, clone the sample repo and install the NPM modules.

From your shell or command line:

`$ git clone git@github.com:AzureADQuickStarts/AppModelv2-WebApp-OpenIDConnect-nodejs.git`

or

`$ git clone https://github.com/AzureADQuickStarts/AppModelv2-WebApp-OpenIDConnect-nodejs.git`

From the project root directory, run the command:

`$ npm install`

## Configure the application

Provide the parameters in `exports.creds` in config.js as instructed.

* Update `<tenant_name>` in `exports.identityMetadata` with the Azure AD tenant name of the format \*.onmicrosoft.com.
* Update `exports.clientID` with the Application ID noted from app registration.
* Update `exports.clientSecret` with the Application secret noted from app registration.
* Update `exports.redirectUrl` with the Redirect URI noted from app registration.

**Optional configuration for production apps:**

* Update `exports.destroySessionUrl` in config.js, if you want to use a different `post_logout_redirect_uri`.

* Set `exports.useMongoDBSessionStore` in config.js to true, if you want to use [mongoDB](https://www.mongodb.com) or other [compatible session stores](https://github.com/expressjs/session#compatible-session-stores).
The default session store in this sample is `express-session`. The default session store is not suitable for production.

* Update `exports.databaseUri`, if you want to use mongoDB session store and a different database URI.

* Update `exports.mongoDBSessionMaxAge`. Here you can specify how long you want to keep a session in mongoDB. The unit is second(s).

## Build and run the application

Start mongoDB service. If you are using mongoDB session store in this app, you have to [install mongoDB](http://www.mongodb.org/) and start the service first. If you are using the default session store, you can skip this step.

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

You will have a server successfully running on `http://localhost:3000`.

[!INCLUDE [Help and support](../../../includes/active-directory-develop-help-support-include.md)]

## Next steps
Learn more about the web app scenario that the Microsoft identity platform supports:
> [!div class="nextstepaction"]
> [Web app that signs in users scenario](scenario-web-app-sign-user-overview.md)

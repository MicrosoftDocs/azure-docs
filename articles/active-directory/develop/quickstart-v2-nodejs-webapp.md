---
title: Microsoft identity platform ASP.NET web server quickstart | Azure
description: Learn how to implement Microsoft Sign-in on an ASP.NET web app using OpenID Connect.
services: active-directory
documentationcenter: dev-center-name
author: jmprieur
manager: CelesteDG
editor: ''

ms.assetid: 
ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 10/25/2019
ms.author: jmprieur
ms.custom: aaddev, identityplatformtop40, scenarios:getting-started, languages:ASP.NET
#Customer intent: As an application developer, I want to know how to set up OpenId Connect authentication in a web application built using Node.js with Express.
ms.collection: M365-identity-device-management
---

# Quickstart: Azure Active Directory OIDC Node.js Web Sample

[!INCLUDE [active-directory-develop-applies-v2](../../../includes/active-directory-develop-applies-v2.md)]

In this quickstart, you'll learn how to set up OpenId Connect authentication in a web application built using Node.js with Express. The sample is designed to run on any platform.

## Prerequisites

To run this sample you will need the following:

* Install Node.js from http://nodejs.org/

* Either a [Microsoft account](https://www.outlook.com) or [Office 365 for business account](https://msdn.microsoft.com/en-us/office/office365/howto/setup-development-environment#bk_Office365Account)

## Register the sample

1. Sign in to the [Azure portal](https://portal.azure.com/) using either a work or school account, or a personal Microsoft account.

1. If your account is present in more than one Azure AD tenant:
    - Select your profile from the menu on the top right corner of the page, and then **Switch directory**.
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

* `$ git clone git@github.com:AzureADQuickStarts/AppModelv2-WebApp-OpenIDConnect-nodejs.git`

or

* `$ git clone https://github.com/AzureADQuickStarts/AppModelv2-WebApp-OpenIDConnect-nodejs.git`


From the project root directory, run the command:

* `$ npm install`   


## Configure the application

Provide the parameters in `exports.creds` in config.js as instructed.

* Update `<tenant_name>` in `exports.identityMetadata` with the Azure AD tenant name of the format \*.onmicrosoft.com.
* Update `exports.clientID` with the Application Id noted from app registration.
* Update `exports.clientSecret` with the Application secret noted from app registration.
* Update `exports.redirectUrl` with the Redirect URI noted from app registration.

**Optional configuration for production apps:**

* Update `exports.destroySessionUrl` in config.js, if you want to use a different `post_logout_redirect_uri`.

* Set `exports.useMongoDBSessionStore` in config.js to true, if you want to use use mongoDB or other [compatible session stores](https://github.com/expressjs/session#compatible-session-stores).
The default session store in this sample is `express-session`. Note that the default session store is not suitable for production.

* Update `exports.databaseUri`, if you want to use mongoDB session store and a different database URI.

* Update `exports.mongoDBSessionMaxAge`. Here you can specify how long you want to keep a session in mongoDB. The unit is second(s).

## Build and run the application

* Start mongoDB service. If you are using mongoDB session store in this app, you have to [install mongoDB](http://www.mongodb.org/) and start the service first. If you are using the default session store, you can skip this step.

* Run the app using the following command from your command line.

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

## Community Help and Support

We use [Stack Overflow](http://stackoverflow.com/questions/tagged/azure-active-directory) with the community to provide support. We highly recommend you ask your questions on Stack Overflow first and browse existing issues to see if someone has asked your question before. Make sure that your questions or comments are tagged with [azure-active-directory].

If you find a bug or issue with this sample, please raise the issue on [GitHub Issues](../../issues).

For issues with the passport-azure-ad library, please raise the issue on the library GitHub repo.

## Contributing

If you'd like to contribute to this sample, please follow the [GitHub Fork and Pull request model](https://help.github.com/articles/fork-a-repo/).

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.   

## Security Library

This library controls how users sign-in and access services. We recommend you always take the latest version of our library in your app when possible.

## Security Reporting

If you find a security issue with our libraries or services please report it to [secure@microsoft.com](mailto:secure@microsoft.com) with as much detail as possible. Your submission may be eligible for a bounty through the [Microsoft Bounty](http://aka.ms/bugbounty) program. Please do not post security issues to GitHub Issues or any other public site. We will contact you shortly upon receiving the information. We encourage you to get notifications of when security incidents occur by visiting [this page](https://technet.microsoft.com/en-us/security/dd252948) and subscribing to Security Advisory Alerts.

Copyright (c) Microsoft Corporation.  All rights reserved. Licensed under the MIT License (the "License");

### Acknowledgements

We would like to acknowledge the folks who own/contribute to the following projects for their support of Azure Active Directory and their libraries that were used to build this sample. In places where we forked these libraries to add additional functionality, we ensured that the chain of forking remains intact so you can navigate back to the original package. Working with such great partners in the open source community clearly illustrates what open collaboration can accomplish. Thank you!
---
title: Move web app that signs in users to production
description: Learn how to build a web app that signs in users (move to production)
services: active-directory
author: cilwerner
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 09/17/2019
ms.author: cwerner
ms.reviewer: jmprieur
ms.custom: aaddev, devx-track-extended-java, devx-track-js
#Customer intent: As an application developer, I want to know how to write a web app that signs in users by using the Microsoft identity platform.
---

# Web app that signs in users: Move to production

Now that you know how to get a token to call web APIs, here are some things to consider when moving your application to production.

[!INCLUDE [Common steps to move to production](./includes/scenarios/scenarios-production.md)]

## Troubleshooting
When users sign-in to the web application for the first time, they will need to consent. However, in some organizations, users can see a message like the following:
*AppName needs permissions to access resources in your organization that only an admin can grant. Please ask an admin to grant permission to this app before you can use it.*
This is because your tenant administrator has **disabled** the ability for users to consent. In that case, contact your tenant administrators so that they do an admin-consent for the scopes required by the application.

## Same site

Make sure you understand possible issues with new versions of the Chrome browser:
[How to handle SameSite cookie changes in Chrome browser](howto-handle-samesite-cookie-changes-chrome-browser.md).

The Microsoft.Identity.Web NuGet package handles the most common SameSite issues.

## Deep dive: ASP.NET Core web app tutorial

Learn about other ways to sign in users with this ASP.NET Core tutorial: 

[Enable your web apps to sign in users and call APIs with the Microsoft identity platform for developers](https://github.com/Azure-Samples/ms-identity-aspnetcore-webapp-tutorial)

This progressive tutorial has production-ready code for a web app, including how to add sign-in with accounts in:

- Your organization
- Multiple organizations
- Work or school accounts, or personal Microsoft accounts
- [Azure AD B2C](../../active-directory-b2c/overview.md)
- National clouds

## Tutorial: Node.js web app

Learn more about the Node.js web in this tutorial:

[Tutorial: Sign-in users in a Node.js & Express web app](./tutorial-v2-nodejs-webapp-msal.md)

## Sample code: Java web app

Learn more about the Java web app from this sample on GitHub: 

[A Java Web application that signs in users with the Microsoft identity platform and calls Microsoft Graph](https://github.com/Azure-Samples/ms-identity-java-webapp)

## Next Steps

After your web app signs in users, it can call web APIs on behalf of the signed-in users. Calling web APIs from the web app is the object of the following scenario: 
[Web app that calls web APIs](scenario-web-app-call-api-overview.md).

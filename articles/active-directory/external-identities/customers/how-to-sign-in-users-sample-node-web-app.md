---
title: Sign in users in a sample Node.js web application by using Microsoft Entra
description: Learn how to configure a sample web app to sign in and sign out users by using Microsoft Entra.
services: active-directory
author: kengaderdus
manager: mwongerapk

ms.author: kengaderdus
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 04/05/2023
ms.custom: developer

#Customer intent: As a dev, devops, I want to learn about how to configure a sample web app to sign in and sign out users with my CIAM tenant
---

# Sign in users in a sample Node.js web application by using Microsoft Entra

This how-to guide uses a sample Node.js web application to show how to add authentication to a web application by using Microsoft Entra. The sample application enables users to sign in and sign out. The sample web application uses [Microsoft Authentication Library (MSAL)](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node) for Node to handle authentication.

In this article, you’ll do the following tasks:

- Register a web application in the Microsoft Entra admin center. 

- Create a sign in and sign out user flow in Microsoft Entra admin center.

- Associate your web application with the user flow. 

- Update a sample Node.js web application using your own Azure Active Directory (Azure AD) for customers tenant.

- Run and test the sample web application.

## Prerequisites

- [Node.js](https://nodejs.org).

- [Visual Studio Code](https://code.visualstudio.com/download) or another code editor.

- Azure AD for customers tenant. If you don't already have one, [sign up for a free trial](http://developer.microsoft.com/identity/customers)


## Register the web app

[!INCLUDE [active-directory-b2c-register-app](./includes/register-app/register-client-app-common.md)]
[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/register-app/add-platform-redirect-url-node.md)]  

## Create a user flow 

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/configure-user-flow/create-sign-in-sign-out-user-flow.md)] 

## Associate the web application with the user flow

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/configure-user-flow/add-app-user-flow.md)]

## Clone or download sample web application


## Install project dependencies 


## Run and test sample web app 


## Next steps
---
title: Sign in users in a sample Electron desktop application by using Microsoft Entra
description: Learn how to configure a sample Electron desktop to sign in and sign out users by using Microsoft Entra.
services: active-directory
author: kengaderdus
manager: mwongerapk

ms.author: kengaderdus
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 04/30/2023
ms.custom: developer

#Customer intent: As a dev, devops, I want to learn about how to configure a sample Electron desktop app to sign in and sign out users with my Azure Active Directory (Azure AD) for customers tenant
---

# Sign in users in a sample Electron desktop application by using Microsoft Entra

Overview here 

## Prerequisites

- [Node.js](https://nodejs.org).

- [Visual Studio Code](https://code.visualstudio.com/download) or another code editor.

- Azure AD for customers tenant. If you don't already have one, [sign up for a free trial](https://developer.microsoft.com/identity/customers). 

<!--Awaiting this link http://developer.microsoft.com/identity/customers to go live on Developer hub-->

## Register desktop app

[!INCLUDE [active-directory-b2c-register-app](./includes/register-app/register-client-app-common.md)]
[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/register-app/add-platform-redirect-url-electron.md)] 

## Grant API permissions

[!INCLUDE [active-directory-b2c-grant-delegated-permissions](./includes/register-app/grant-api-permission-sign-in.md)] 

## Configure Optional Claims

[!INCLUDE [active-directory-configure-optional-claims](./includes/register-app/add-optional-claims-id.md)] 
 
## Create a user flow

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/configure-user-flow/create-sign-in-sign-out-user-flow.md)] 

## Associate the web application with the user flow

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/configure-user-flow/add-app-user-flow.md)]

## Clone or download sample web application


## Install project dependencies


## Configure the sample web app


## Run and test sample web app


## Next steps

Share About the code
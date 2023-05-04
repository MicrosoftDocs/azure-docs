---
title: Call an API in a sample Node.js daemon application
description: Learn how to Configure a sample Node.js daemon application that calls an API protected by using Microsoft Entra
services: active-directory
author: kengaderdus
manager: mwongerapk

ms.author: kengaderdus
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 05/05/2023
ms.custom: developer

#Customer intent: As a dev, devops, I want to Configure a sample Node.js daemon application that calls an API protected by Azure Active Directory (Azure AD) for customers tenant
---

# Call an API in a sample Node.js daemon application 

In this article uses a sample Node.js daemon application to show you how a daemon app acquires a token to call a web API. Azure Active Directory (Azure AD) for customers protects the Web API. 

A daemon application acquires a token on behalf of itself (not on behalf of a user). Users can't interact with a daemon application because it requires its own identity. This type of application requests an access token by using its application identity and presenting its application ID, credential (password or certificate), and application ID URI to Azure AD. 

A daemon app uses the standard [OAuth 2.0 client credentials grant](../../develop/v2-oauth2-client-creds-grant-flow.md). 


## Prerequisites

- [Node.js](https://nodejs.org).

- [.NET 7.0](https://dotnet.microsoft.com/learn/dotnet/hello-world-tutorial/install) or later. 

- [Visual Studio Code](https://code.visualstudio.com/download) or another code editor.

- Azure AD for customers tenant. If you don't already have one, [sign up for free trial](https://aka.ms/ciam-hub-free-trial).

## Register a daemon application and a web API

In this step, you create the daemon and the web API application registrations, and you specify the scopes of your web API.

### Register a web API application

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/register-app/register-api-app.md)]

### Configure API scopes

This API needs to expose permissions, which a client (in this case a daemon app) needs to acquire for calling the API:

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/register-app/add-api-scopes.md)]

### Configure app roles

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/register-app/add-app-role.md)]

### Configure optional claims

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/register-app/add-optional-claims-access.md)]

### Register the daemon app

[!INCLUDE [active-directory-b2c-register-app](./includes/register-app/register-client-app-common.md)]

### Create a client secret

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/register-app/add-app-client-secret.md)]

### Grant API permissions to the daemon app

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/register-app/grant-api-permissions-app-permissions.md)]

##  Clone or download sample daemon application and web API


##  Install project dependencies


## Configure the sample daemon app and API


##  Run and test sample daemon app and API 


### How it works


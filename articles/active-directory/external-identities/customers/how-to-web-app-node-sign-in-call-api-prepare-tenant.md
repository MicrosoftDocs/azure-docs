---
title: Sign in users and call an API in a Node.js web application  - prepare your tenant
description: Learn about how to prepare your Microsoft Entra ID for customers tenant to sign in users and call an API in your own Node.js web application.
services: active-directory
author: kengaderdus
manager: mwongerapk

ms.author: kengaderdus
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 07/28/2023
ms.custom: developer, devx-track-js
---

# Sign in users and call an API in a Node.js web application  - prepare your tenant

In this article, you prepare your Microsoft Entra ID for customers tenant for authentication and authorization. To prepare your tenant, you do the following tasks:

- Register a web API and configure permissions/scopes in the Microsoft Entra admin center. 

- Register a client web application and grant it API permissions in the Microsoft Entra admin center.

- Create a sign in and sign out user flow in Microsoft Entra admin center.

- Associate your client web application with the user flow. 

After you complete the tasks, you collect:

- *Application (client) ID* for your client web app and one for your web API.

- A *Client secret* for your client web app.

- A *Directory (tenant) ID* for your External ID for customers tenant.

- Web API permissions/scopes. 

- App permissions/roles.

If you've already registered a client web application and a web API in the Microsoft Entra admin center, and created a sign in and sign up user flow, you can skip the steps in this article, then proceed to [Prepare your web application and API](how-to-web-app-node-sign-in-call-api-prepare-app.md).

## Register a web application and a web API

In this step, you create the web and the web API application registrations, and you specify the scopes of your web API.

### Register a web API application

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/register-app/register-api-app.md)]

### Configure API scopes

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/register-app/add-api-scopes.md)]

### Configure app roles

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/register-app/add-app-role.md)]

### Configure idtyp token claim

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/register-app/add-optional-claims-access.md)]

### Register the web app

[!INCLUDE [active-directory-b2c-register-app](./includes/register-app/register-client-app-common.md)]
[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/register-app/add-platform-redirect-url-node.md)]  

### Create a client secret

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/register-app/add-app-client-secret.md)]

### Grant API permissions to the web app

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/register-app/grant-api-permission-call-api.md)]

## Create a user flow 

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/configure-user-flow/create-sign-in-sign-out-user-flow.md)] 

##  Associate web application with the user flow

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/configure-user-flow/add-app-user-flow.md)]


## Next steps

Next, learn how to prepare your web application and API.

> [!div class="nextstepaction"]
> [Start building your web application and API >](how-to-web-app-node-sign-in-call-api-prepare-app.md)

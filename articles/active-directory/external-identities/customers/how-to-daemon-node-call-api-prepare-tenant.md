---
title: Call an API in your Node.js daemon application - prepare your tenant
description: Learn about how to prepare your Azure Active Directory (Azure AD) tenant for customers to acquire an access token using client credentials flow in your Node.js daemon application
services: active-directory
author: kengaderdus
manager: mwongerapk

ms.author: kengaderdus
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 05/22/2023
ms.custom: developer
---

# Call an API in your Node.js daemon application - prepare your tenant

In this article, you prepare your Azure Active Directory (Azure AD) for customers tenant for authorization. To prepare your tenant, you do the following tasks:

- Register a web API and configure app permissions the Microsoft Entra admin center. 

- Register a client daemon application and grant it app permissions in the Microsoft Entra admin center.

- Create a client secret for your daemon application in the Microsoft Entra admin center.

After you complete the tasks, you collect:

- *Application (client) ID* for your client daemon app and one for your web API.

- A *Client secret* for your client daemon app.

- A *Directory (tenant) ID* for your Azure AD for customers tenant.

- App permissions/roles.

If you've already registered a client daemon application and a web API in the Microsoft Entra admin center, you can skip the steps in this article, then proceed to [Prepare your daemon application and web API](how-to-daemon-node-call-api-prepare-app.md).

## Register a web API application

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/register-app/register-api-app.md)]

## Configure app roles

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/register-app/add-app-role.md)]

## Configure optional claims

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/register-app/add-optional-claims-access.md)]

## Register the daemon app

[!INCLUDE [active-directory-b2c-register-app](./includes/register-app/register-client-app-common.md)]

## Create a client secret

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/register-app/add-app-client-secret.md)]

## Grant API permissions to the daemon app

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/register-app/grant-api-permissions-app-permissions.md)]


## Next steps

Next, learn how to prepare your daemon application and web API.

> [!div class="nextstepaction"]
> [Prepare your daemon application and web API >](how-to-daemon-node-call-api-prepare-app.md)
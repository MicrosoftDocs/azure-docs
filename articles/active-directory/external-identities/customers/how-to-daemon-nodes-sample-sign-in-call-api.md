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

To get the web app sample code, you can do either of the following tasks:

- [Download the .zip file](https://github.com/Azure-Samples/ms-identity-ciam-javascript-tutorial/archive/refs/heads/main.zip) or clone the sample web application from GitHub by running the following command:

    ```console
        git clone https://github.com/Azure-Samples/ms-identity-ciam-javascript-tutorial.git
    ```
If you choose to download the *.zip* file, extract the sample app file to a folder where the total length of the path is 260 or fewer characters.

##  Install project dependencies

1. Open a console window, and change to the directory that contains the Node.js sample app:

    ```console
        cd 2-Authorization\3-call-api-node-daemon\App
    ```
1. Run the following commands to install app dependencies:

    ```console
        npm install && npm update
    ```

## Configure the sample daemon app and API

To use your app registration in the client web app sample:

1. In your code editor, open `App\authConfig.js` file.

1. Find the placeholder:

    - `Enter_the_Application_Id_Here` and replace it with the Application (client) ID of the daemon app you registered earlier.
     
    - `Enter_the_Tenant_Subdomain_Here` and replace it with the Directory (tenant) subdomain. For example, if your tenant primary domain is `contoso.onmicrosoft.com`, use `contoso`. If you don't have your tenant name, learn how to [read your tenant details](how-to-create-customer-tenant-portal.md#get-the-customer-tenant-details). 
    
    - `Enter_the_Client_Secret_Here` and replace it with the daemon app secret value you copied earlier.
    
    - `Enter_the_Web_Api_Application_Id_Here` and replace it with the Application (client) ID of the web API you copied earlier.

To use your app registration in the web API sample: 

1. In your code editor, open `API\ToDoListAPI\appsettings.json` file.

1. Find the placeholder:
    
    - `Enter_the_Application_Id_Here` and replace it with the Application (client) ID of the web API you copied. 
    
    - `Enter_the_Tenant_Id_Here` and replace it with the Directory (tenant) ID you copied earlier.
    
    - `Enter_the_Tenant_Subdomain_Here` and replace it with the Directory (tenant) subdomain. For example, if your tenant primary domain is `contoso.onmicrosoft.com`, use `contoso`. If you don't have your tenant name, learn how to [read your tenant details](how-to-create-customer-tenant-portal.md#get-the-customer-tenant-details).

##  Run and test sample daemon app and API 

1. Open a console window, then run the web API by using the following commands:

    ```powershell
    cd 2-Authorization\3-call-api-node-daemon\API\ToDoListAPI
    dotnet run
    ``` 
1. Run the web app client by using the following commands:

    ```powershell
        2-Authorization\3-call-api-node-daemon\App
         node . --op getToDos
    ```

If your daemon app and wep API successfully run, you should see something similar to the following JSON array in your console window

    ```json
    [
      {
        id: 1,
        owner: '3e8....-db63-43a2-a767-5d7db...',
        description: 'Pick up grocerie'
      },
      {
        id: 2,
        owner: 'c3cc....-c4ec-4531-a197-cb919ed.....',
        description: 'Finish invoice report'
      },
      {
        id: 3,
        owner: 'a35e....-3b8a-4632-8c4f-ffb840d.....',
        description: 'Water plants'
      }
    ]
    ```

### How it works
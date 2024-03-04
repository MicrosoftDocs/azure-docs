---
title: Call an API in a sample .NET daemon application
description: Learn how to configure a sample .NET daemon application that calls an API protected with Azure Active Directory (Azure AD) for customers
services: active-directory
author: SHERMANOUKO
manager: mwongerapk

ms.author: shermanouko
ms.service: active-directory
ms.subservice: ciam
ms.custom: devx-track-dotnet
ms.topic: sample
ms.date: 07/13/2023
#Customer intent: As a dev, devops, I want to configure a sample .NET daemon application that calls an API protected by Azure Active Directory (Azure AD) for customers tenant
---

# Call an API in a sample .NET daemon application 

This article uses a sample .NET daemon application to show you how a daemon application acquires a token to call a protected web API. Azure Active Directory (Azure AD) for customers protects the Web API. 

A daemon application acquires a token on behalf of itself (not on behalf of a user). Users can't interact with a daemon application because it requires its own identity. This type of application requests an access token by using its application identity and presenting its application ID, credential (password or certificate), and application ID URI to Azure AD. 

## Prerequisites

- [.NET 7.0](https://dotnet.microsoft.com/download/dotnet/7.0) or later. 

- [Visual Studio Code](https://code.visualstudio.com/download) or another code editor.

- Azure AD for customers tenant. If you don't already have one, [sign up for a free trial](https://aka.ms/ciam-free-trial?wt.mc_id=ciamcustomertenantfreetrial_linkclick_content_cnl)</a>.

## Register a daemon application and a web API

In this step, you create the daemon and the web API application registrations, and you specify the scopes of your web API.

### Register a web API application

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/register-app/register-api-app.md)]

### Configure application roles

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/register-app/add-app-role.md)]

### Configure optional claims

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/register-app/add-optional-claims-access.md)]

### Register the daemon application

[!INCLUDE [active-directory-b2c-register-app](./includes/register-app/register-client-app-common.md)]

### Create a client secret

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/register-app/add-app-client-secret.md)]

### Grant API permissions to the daemon application

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/register-app/grant-api-permissions-app-permissions.md)]

##  Clone or download sample daemon application and web API

To get the web application sample code, you can do either of the following tasks:

- [Download the .zip file](https://github.com/Azure-Samples/ms-identity-ciam-dotnet-tutorial/archive/refs/heads/main.zip) or clone the sample web application from GitHub by running the following command:

    ```console
        git clone https://github.com/Azure-Samples/ms-identity-ciam-dotnet-tutorial.git
    ```
If you choose to download the *.zip* file, extract the sample application file to a folder where the total length of the path is 260 or fewer characters.

## Configure the sample daemon application and API

To use your app registration in the client web application sample:

1. In your code editor, open *ms-identity-ciam-dotnet-tutorial/2-Authorization/3-call-own-api-dotnet-core-daemon/ToDoListClient/appsettings.json* file.

1. Find the placeholder:

    - `Enter_the_Application_Id_Here` and replace it with the Application (client) ID of the daemon application you registered earlier.
     
    - `Enter_the_Tenant_Subdomain_Here` and replace it with the Directory (tenant) subdomain. For example, if your tenant primary domain is `contoso.onmicrosoft.com`, use `contoso`. If you don't have your tenant name, learn how to [read your tenant details](how-to-create-customer-tenant-portal.md#get-the-customer-tenant-details). 
    
    - `Enter_the_Client_Secret_Here` and replace it with the daemon application secret value you copied earlier.
    
    - `Enter_the_Web_Api_Application_Id_Here` and replace it with the Application (client) ID of the web API you copied earlier.

To use your app registration in the web API sample: 

1. In your code editor, open *ms-identity-ciam-dotnet-tutorial/2-Authorization/3-call-own-api-dotnet-core-daemon/ToDoListAPI/appsettings.json* file.

1. Find the placeholder:
    
    - `Enter_the_Application_Id_Here` and replace it with the Application (client) ID of the web API you copied. 
    
    - `Enter_the_Tenant_Id_Here` and replace it with the Directory (tenant) ID you copied earlier.
    
    - `Enter_the_Tenant_Subdomain_Here` and replace it with the Directory (tenant) subdomain. For example, if your tenant primary domain is `contoso.onmicrosoft.com`, use `contoso`. If you don't have your tenant name, learn how to [read your tenant details](how-to-create-customer-tenant-portal.md#get-the-customer-tenant-details).

##  Run and test sample daemon application and API 

1. Open a console window, then run the web API by using the following commands:

    ```console
    cd 2-Authorization\3-call-own-api-dotnet-core-daemon\ToDoListAPI
    dotnet run
    ``` 
1. Run the daemon client by using the following commands:

    ```console
    cd 2-Authorization\3-call-own-api-dotnet-core-daemon\ToDoListClient
    dotnet run
    ```

If your daemon application and web API successfully run, you should see something similar to the following JSON array in your console window

```bash
Posting a to-do...
Retrieving to-do's from server...
To-do data:
ID: 1
User ID: 41b1e1a8-8e51-4514-8dab-e568afa2826c
Message: Bake bread
Posting a second to-do...
Retrieving to-do's from server...
To-do data:
ID: 1
User ID: 41b1e1a8-8e51-4514-8dab-e568afa2826c
Message: Bake bread
ID: 2
User ID: 41b1e1a8-8e51-4514-8dab-e568afa2826c
Message: Butter bread
Deleting a to-do...
Retrieving to-do's from server...
To-do data:
ID: 2
User ID: 41b1e1a8-8e51-4514-8dab-e568afa2826c
Message: Butter bread
Editing a to-do...
Retrieving to-do's from server...
To-do data:
ID: 2
User ID: 41b1e1a8-8e51-4514-8dab-e568afa2826c
Message: Eat bread
Deleting remaining to-do...
Retrieving to-do's from server...
There are no to-do's in server
```

## How it works

The daemon application use [OAuth2.0 client credentials grant](../../develop/v2-oauth2-client-creds-grant-flow.md) to acquire an access token for itself and not for the user. The access token that the app requests contains the permissions represented as roles. The client credential flow uses this set of permissions in place of user scopes for application tokens. You [exposed these application permissions](#configure-application-roles) in the web API earlier, then [granted them to the daemon app](#grant-api-permissions-to-the-daemon-application). The daemon app in this article uses [Microsoft Authentication Library for .NET](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet) to simplify the process of acquiring a token.

On the API side, the web API must verify that the access token has the required permissions (application permissions). The web API rejects access tokens that don't have the required permissions. 

## See also

See the tutorial on how to [build your own .NET daemon app that calls an API](./tutorial-daemon-dotnet-call-api-prepare-tenant.md)

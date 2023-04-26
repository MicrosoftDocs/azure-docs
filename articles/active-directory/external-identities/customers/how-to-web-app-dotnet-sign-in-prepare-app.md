---
title: Sign in users in your own ASP.NET web application by using Microsoft Entra - Prepare your application 
description: Create and prepare an ASP.NET web app for authentication
services: active-directory
author: cilwerner
ms.author: cwerner
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 04/04/2023
ms.custom: it-pro
#Customer intent: As a dev, devops, I want to learn about how to enable authentication in my own ASP.NET web app with Azure Active Directory (Azure AD) for customers tenant
---

# Sign in users in your own ASP.NET web application by using Microsoft Entra - Prepare your application

After registering an application and creating a user flow in a CIAM tenant, an ASP.NET web application can be created using an integrated development environment (IDE). In this article, you'll create an ASP.NET project in your IDE, and configure it for authentication.

## Prerequisites

- Completion of the prerequisites and steps in [Sign in users in your own ASP.NET web application by using Microsoft Entra - Prepare your tenant](./how-to-web-app-dotnet-sign-in-prepare-tenant.md).
- Although any IDE that supports React applications can be used, Visual Studio Code is used for this guide. This can be downloaded from the [Downloads](https://visualstudio.microsoft.com/downloads/) page.
- [.NET 7.0 SDK](https://dotnet.microsoft.com/download/dotnet).

## Create an ASP.NET project

1. Open a terminal in your IDE and navigate to the location in which to create your project.
1. Enter the following command to make the project folder and create your project.

    ```powershell
    dotnet new mvc -n aspnet_ciam_webapp
    ```

## Configure the application for authentication

1. Open the *appsettings.json* file and replace the existing code with the following snippet.

    ```json
    {
        "AzureAd": {
        "Authority": "https://Enter_the_Tenant_Name_Here.ciamlogin.com/",
        "ExtraQueryParameters": { "dc": "ESTS-PUB-EUS-AZ1-FD000-TEST1" },
        "ClientId": "Enter_the_Application_Id_Here",
        "CallbackPath": "/signin-oidc",
        "SignedOutCallbackPath": "/signout-callback-oidc"
      },
      "Logging": {
        "LogLevel": {
          "Default": "Information",
          "Microsoft.AspNetCore": "Warning"
        }
      },
      "AllowedHosts": "*"
    }
    ```

    * `Instance` - The authentication endpoint. Check with the different available endpoints in [National clouds](../../develop/authentication-national-cloud.md#azure-ad-authentication-endpoints).
    * `Authority` - The identity provider instance and sign-in audience for the app. Replace `Enter_the_Tenant_Name_Here` with the name of your CIAM tenant.
    * `ClientId` - The identifier of the application, also referred to as the client. Replace the text in quotes with the **Application (client) ID** value that was recorded earlier from the overview page of the registered application.
    * `CallbackPath` - Is an identifier to help the server redirect a response to the appropriate application.
    
1. Save changes to the file.
1. Open the *Properties/launchSettings.json* file.
1. Find and record the `https` value `applicationURI` within *launchSettings.json*, for example `https://localhost:{port}`. You use this URL to define the **Redirect URI**.

## Next steps

> [!div class="nextstepaction"]
> [Sign in and sign out](how-to-web-app-dotnet-sign-in-sign-out.md)
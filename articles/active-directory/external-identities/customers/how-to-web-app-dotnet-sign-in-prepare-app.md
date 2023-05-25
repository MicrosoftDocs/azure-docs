---
title: Prepare your application - Sign in users to an ASP.NET web app 
description: Create and prepare an ASP.NET web app for authentication
services: active-directory
author: cilwerner
ms.author: cwerner
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 05/23/2023
ms.custom: it-pro
#Customer intent: As a dev, devops, I want to learn about how to enable authentication in my own ASP.NET web app with Azure Active Directory (Azure AD) for customers tenant.
---

# Prepare your application: Sign in users to an ASP.NET web app using an Azure Active Directory (AD) for customers tenant

After registering an application and creating a user flow in a Azure Active Directory (AD) for customers tenant, an ASP.NET web application can be created using an integrated development environment (IDE). In this article, you'll create an ASP.NET project in your IDE, and configure it for authentication.

## Prerequisites

- Completion of the prerequisites and steps in [Sign in users in your own ASP.NET web application by using an Azure AD for customers tenant - Prepare your tenant](./how-to-web-app-dotnet-sign-in-prepare-tenant.md).
- Although any IDE that supports React applications can be used, Visual Studio Code is used for this guide. This can be downloaded from the [Downloads](https://visualstudio.microsoft.com/downloads/) page.
- [.NET 7.0 SDK](https://dotnet.microsoft.com/download/dotnet).

## Create an ASP.NET project

1. Open a terminal in your IDE and navigate to the location in which to create your project.
1. Enter the following command to make the project folder and create your project.

    ```powershell
    dotnet new mvc -n aspnet_webapp
    ```

## Configure the application for authentication

1. Open the *appsettings.json* file and replace the existing code with the following snippet.

    ```json
    {
      "AzureAd": {
        "Authority": "https://Enter_the_Tenant_Subdomain_Here.ciamlogin.com/",
        "ClientId": "Enter_the_Application_Id_Here",
        "ClientCredentials": [
          {
            "SourceType": "ClientSecret",
            "ClientSecret": "Enter_the_Client_Secret_Here"
          }
        ],
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

    * `Authority` - The identity provider instance and sign-in audience for the app. Replace `Enter_the_Tenant_Subdomain_Here` with the sub-domain of your customer tenant. To find this, select **Overview** in the sidebar menu, then switch to the **Overview tab**. Find the **Primary domain**, in the form *caseyjensen.onmicrosoft.com*. The sub-domain is *caseyjensen*.
    * `ClientId` - The identifier of the application, also referred to as the client. Replace the text in quotes with the **Application (client) ID** value that was recorded earlier from the overview page of the registered application.
    * `ClientSecret` - The value of the client secret you created in [Prepare your tenant](./how-to-web-app-dotnet-sign-in-prepare-tenant.md). Replace the text in quotes with the client secret **value** in the Microsoft Entra admin center.
    * `CallbackPath` - Is an identifier to help the server redirect a response to the appropriate application.
    
1. Save changes to the file.
1. Open the *Properties/launchSettings.json* file.
1. In the `https` section of `profiles`, change the `https` URL in `applicationUrl` so that it reads `https://localhost:7274`. You used this URL to define the **Redirect URI**.
1. Save the changes to your file.

## Next steps

> [!div class="nextstepaction"]
> [Sign in and sign out](how-to-web-app-dotnet-sign-in-sign-out.md)

---
title: Sign in users in your own ASP.NET Core web application by using Microsoft Entra - Prepare your application 
description: Create and prepare an ASP.NET Core web app for authentication
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
#Customer intent: As a dev, devops, I want to learn about how to enable authentication in my own ASP.NET Core web app with Azure Active Directory (Azure AD) for customers tenant
---

# Sign in users in your own ASP.NET Core web application by using Microsoft Entra - Prepare your application

After registering an application and created a user flow in a CIAM tenant, an ASP.NET Core web application can be created using an integrated development environment (IDE). This how-to guide demonstrates how to create an ASP.NET Core web wpp using an IDE.

## Prerequisites

- Completion of the prerequisites and steps in [Sign in users in your own ASP.NET Core web application by using Microsoft Entra - Prepare your tenant](./how-to-web-app-dotnet-sign-in-prepare-tenant.md).
- A minimum requirement of [.NET Core 6.0 SDK](https://dotnet.microsoft.com/en-us/download/dotnet).

## Create an ASP.NET Core project

1. Open a terminal in your IDE and navigate to the location in which to create your project.
1. Enter the following code snippet to make the project folder and create your project.

    ```powershell
    mkdir aspnet_ciam_webapp
    cd aspnet_ciam_webapp
    dotnet new mvc
    ```

## Configure the application for authentication

1. Open the *appsettings.json* file and replace the existing code with the following snippet.

    ```csharp
    {
      "AzureAd": {
        "Instance": "https://login.microsoftonline.com/",
        "TenantId": "[Enter the Tenant Id obtained from the Azure portal]",
        "ClientId": "[Enter the Client Id (Application ID) obtained from the Azure portal)]",
        "CallbackPath": "/signin-oidc",
        "SignedOutCallbackPath ": "/signout-oidc"
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
    * `TenantId` - The identifier of the tenant where the application is registered. Replace the text in quotes with the **Directory (tenant) ID** value that was recorded earlier from the overview page of the registered application.
    * `ClientId` - The identifier of the application, also referred to as the client. Replace the text in quotes with the **Application (client) ID** value that was recorded earlier from the overview page of the registered application.
    * `CallbackPath` - Is an identifier to help the server redirect a response to the appropriate application.
    
1. Save changes to the file.
1. In the **Properties** folder, open the *launchSettings.json* file.
1. Find and record the `https` value `applicationURI` within *launchSettings.json*, for example `https://localhost:{port}`. This URL is used when defining the **Redirect URI**.

## Define the platform and URLs

1. In the Microsoft Entra admin center, under **Manage**, select **App registrations**, and then select the application that was previously created.
1. In the left menu, under **Manage**, select **Authentication**.
1. In **Platform configurations**, select **Add a platform**, and then select **Web**.
1. Under **Redirect URIs**, enter the `applicationURL` and the `CallbackPath`, `/signin-oidc`, in the form of `https://localhost:{port}/signin-oidc`.
1. Under **Front-channel logout URL**, enter the following URL for signing out, `https://localhost:{port}/signout-oidc`.
1. Under **Implicit grant and hybrid flows**, select the **ID tokens** checkbox.
1. Select **Configure**.

## Next steps

> [!div class="nextstepaction"]
> [Sign in users in your own ASP.NET Core web application by using Microsoft Entra - Sign in and sign out ](how-to-web-app-dotnet-sign-in-sign-out.md)
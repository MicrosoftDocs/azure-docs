---
title: Prepare an ASP.NET Core web app for authentication with CIAM
description: 
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
#Customer intent
---

# Prepare an ASP.NET Core application for authentication

After registering an application and created a user flow in a CIAM tenant, an ASP.NET web application can be created using an integrated development environment (IDE). This how-to guide demonstrates how to create an ASP.NET Core Web App using an IDE. You'll also create and upload a self-signed certificate to the Azure portal and configure the application for authentication.

## Prerequisites

- Completion of the prerequisites and steps in [Register an application in a CIAM tenant](./how-to-dotnet-web-app-01-register-application.md).
- 
- A minimum requirement of [.NET Core 6.0 SDK](https://dotnet.microsoft.com/en-us/download/dotnet).

## Create an ASP.NET Core project

1. Open a terminal in your IDE and navigate to and select the location in which to create your project.
1. 

```powershell
mkdir ASPNET_CIAMWebApp
cd ASPNET_CIAMWebApp
dotnet new webapp
```

## Create a client secret/certificate <--- ??

## Configure the application for authentication

1. Open the *appsettings.json* file and replace the existing code with the following snippet.

    ```csharp
    {
      "AzureAd": {
        "Instance": "https://login.microsoftonline.com/",
        "Domain": "[Enter the domain of your tenant, e.g. contoso.onmicrosoft.com]",
        "TenantId": "[Enter the Tenant Id obtained from the Azure portal]",
        "ClientId": "[Enter the Client Id (Application ID) obtained from the Azure portal)]",
        "CallbackPath": "/signin-oidc",
        "SignedOutCallbackPath ": "/signout-callback-oidc"
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

    * `Instance` - The authentication endpoint. Check with the different available endpoints in [National clouds](authentication-national-cloud.md#azure-ad-authentication-endpoints).
    * `TenantId` - The identifier of the tenant where the application is registered. Replace the text in quotes with the **Directory (tenant) ID** value that was recorded earlier from the overview page of the registered application.
    * `ClientId` - The identifier of the application, also referred to as the client. Replace the text in quotes with the **Application (client) ID** value that was recorded earlier from the overview page of the registered application.
    * `CallbackPath` - Is an identifier to help the server redirect a response to the appropriate application.
    
1. Save changes to the file.
1. In the **Properties** folder, open the *launchSettings.json* file.
1. Find and record the `https` value `applicationURI` within *launchSettings.json*, for example `https://localhost:{port}`. This URL will be used when defining the **Redirect URI**.

## Define the platform and URLs

1. In the Azure portal, under **Manage**, select **App registrations**, and then select the application that was previously created.
1. In the left menu, under **Manage**, select **Authentication**.
1. In **Platform configurations**, select **Add a platform**, and then select **Web**.

    <!--:::image type="content" source="./media/web-app-tutorial-02-prepare-application/select-platform-inline.png" alt-text="Screenshot on how to select the platform for the application." lightbox="./media/web-app-tutorial-02-prepare-application/select-platform-expanded.png":::-->

1. Under **Redirect URIs**, enter the `applicationURL` and the `CallbackPath`, `/signin-oidc`, in the form of `https://localhost:{port}/signin-oidc`.
1. Under **Front-channel logout URL**, enter the following URL for signing out, `https://localhost:{port}/signout-oidc`.
1. Under **Implicit grant abd hybrid flows**, select the **ID tokens** checkbox.
1. Select **Configure**.

## Add delegated permissions

1. In the Azure portal, under **Manage**, select **API permissions** > **Add a permission**
1. Under the **Microsoft APIs** tab, select **Microsoft Graph**.
1. In **Request API permissions**, select **Delegated permissions**.
1. Under the **OpenId permissions** dropdown, select the checkboxes for **openid** and **offline_access**.
1. Select **Grant admin consent for <CIAM_tenant>**, and select **Yes** in the **Grant admin consent conformation** dialog box.
---
title: "Quickstart: Sign in users and call the Microsoft Graph API from an ASP.NET Core web app"
description: Learn how an ASP.NET Core web app uses Microsoft.Identity.Web to implement Microsoft sign-in using OpenID Connect and call Microsoft Graph
services: active-directory
author: cilwerner
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: quickstart
ms.workload: identity

ms.date: 04/16/2023
ms.author: cwerner

ms.reviewer: jmprieur
ms.custom: "devx-track-csharp, aaddev, identityplatformtop40, scenarios:getting-started, languages:aspnet-core"
#Customer intent: As an application developer, I want to know how to write an ASP.NET Core web app that can sign in personal Microsoft accounts and work/school accounts from any Azure Active Directory instance,  then access their data in Microsoft Graph on their behalf.
---

# Quickstart: Sign in users and call the Microsoft Graph API from an ASP.NET Core web app

This quickstart uses a sample ASP.NET Core web app to show the fundamentals of modern authentication using the [Microsoft Authentication Library for .NET](/entra/msal/dotnet/) and [Microsoft Identity Web](/entra/msal/dotnet/microsoft-identity-web/) for ASP.NET to handle authentication.

In this article you register a web application in the Microsoft Entra admin center, and download a sample ASP.NET web application. You'll run the sample application, sign in with your personal Microsoft account or a work or school account, and sign out.

<!--See [How the sample works](#how-the-sample-works) for an illustration.-->

## Prerequisites

* An Azure account with an active subscription. Use the link to [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
[Visual Studio 2022](https://visualstudio.microsoft.com/vs/) or [Visual Studio Code](https://code.visualstudio.com/)
* [.NET Core SDK 6.0+](https://dotnet.microsoft.com/download)

## Register the application in the Microsoft Entra admin center

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com/).
    1. If you have access to multiple tenants, use the **Directories + subscriptions** filter :::image type="icon" source="media/common/portal-directory-subscription-filter.png" border="false"::: in the top menu to switch to the tenant in which to register the application. We recommend that you use your default tenant for this quickstart.
1. On the left blade, search for and select **Identity**.
1. Select **Applications** > **App registrations**.
1. On the page that appears, select **+ New registration**.
1. For **Name**, enter a name for the application. For example, enter *aspnet-web-app*. App users can see this name, and it can be changed later.
1. Under **Supported account types**, select *Accounts in this organizational directory only*.
1. Select **Register**. A new page appears, listing the app's details. Copy the **Application (client) ID** and **Directory (tenant) ID** values, as they're needed to configure the app in a later step.

## Apply application redirect URIs

1. Under **Manage**, select **Authentication**.
1. Under **Platform configurations**, select **Add a platform**.
1. A **Configure platforms** pane appears. Under **Web applications**, select **Web**.
1. For **Redirect URIs**, enter `https://localhost:5001/signin-oidc`.
1. Under **Front-channel logout URL**, enter `https://localhost:5001/signout-oidc`.
1. Select **Configure**.


## Clone or download the sample application

To obtain the sample application, you can either clone it from GitHub or download it as a .zip file.
- [Download the .zip file](https://github.com/Azure-Samples/ms-identity-docs-code-dotnet/archive/refs/heads/main.zip). Extract it to a file path where the length of the name is fewer than 260 characters.
- To clone the sample, open a command prompt and navigate to where you wish to create the project, and enter the following command:
    
    ```console
    git clone https://github.com/Azure-Samples/ms-identity-docs-code-dotnet.git
    ```

## Create and upload a self-signed certificate

1. Using your terminal, use the following commands to navigate to the project directory, and then create a self-signed certificate:

    ```console
    cd ms-identity-docs-code-dotnet\web-app-aspnet\
    dotnet dev-certs https -ep ./certificate.crt --trust
    ```

1. Return to the Microsoft Entra admin center, and under **Manage**, select **Certificates & secrets** > **Upload certificate**.
1. Select the **Certificates (0)** tab, then select **Upload certificate**.
1. An **Upload certificate** pane appears. Use the icon to navigate to the certificate file you created in the previous step, and select **Open**.
1. Enter a description for the certificate, for example *Certificate for aspnet-web-app*, and select **Add**.
1. Record the **Thumbprint** value for use in the next step.

## Configure the project

1. Use your chosen IDE, for example, **Visual Studio Code**, to open the correct project folder *ms-identity-docs-code-dotnet\web-app-aspnet*.
1. Open *appsettings.json* and replace the file contents with the following snippet;

    ```json
    {
      "AzureAd": {
        "Instance": "https://login.microsoftonline.com/",
        "TenantId": "Enter the tenant ID obtained from the Microsoft Entra admin center",
        "ClientId": "Enter the client ID obtained from the Microsoft Entra admin center",
        "ClientCertificates": [
          {
            "SourceType": "StoreWithThumbprint",
            "CertificateStorePath": "CurrentUser/My",
            "CertificateThumbprint": "Enter the certificate thumbprint obtained from the Microsoft Entra admin center"
          }   
        ],
        "CallbackPath": "/signin-oidc"
      },
      "DownstreamApi": {
        "BaseUrl": "https://graph.microsoft.com/v1.0/me",
        "Scopes": "user.read"
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

    * `TenantId` - The identifier of the tenant where the application is registered. Replace the text in quotes with the `Directory (tenant) ID` that was recorded earlier from the overview page of the registered application.
    * `ClientId` - The identifier of the application, also referred to as the client. Replace the text in quotes with the `Application (client) ID` value that was recorded earlier from the overview page of the registered application.
    * `ClientCertificates` - A self-signed certificate is used for authentication in the application. Replace the text of the `CertificateThumbprint` with the thumbprint of the certificate that was previously recorded.

## Run the application and sign in

1. In your project directory, use the terminal, to enter the following command;

    ```console
    dotnet run
    ```

1. Copy the https URL that appears in the terminal, for example, `https://localhost:5001`, and paste it into a browser. We recommend using a private or incognito browser session.
1. Follow the steps and enter the necessary details to sign in with your Microsoft account. You'll be requested an email address so a one time passcode can be sent to you. Enter the code when prompted.
1. The application will request permission to maintain access to data you have given it access to, and to sign you in and read your profile. Select **Accept**.
1. The following screenshot appears, indicating that you have signed in to the application and have accessed your profile details from the Microsoft Graph API.

## Sign-out from the application

1. Find the **Sign out** link in the top right corner of the page, and select it.
1. You'll be prompted to pick an account to sign out from. Select the account you used to sign in.
1. A message appears indicating that you have signed out.
1. Although you have signed out, the application is still running from your terminal. To stop the application in your terminal, press **Ctrl+C**. 

## What problem did we solve?

This quickstart showed you how to register a web app in the Microsoft Entra admin center. You downloaded a sample sign-in application that uses the Microsoft Authentication Library for .NET and Microsoft Identity Web to sign in users and call the Microsoft Graph API. You created and uploaded a self-signed certificate, and configured the project to use it for authentication using the app's registration details. You then ran the application, signed in with your Microsoft account, and signed out.

## Clean up resources

If you're not going to continue to use this application, delete your local and registered application with the following steps.

### Delete the local application

1. In your terminal, stop the application by pressing **Ctrl+C**.
1. Delete the project folder.

### Delete the registered application

1. In the Microsoft Entra admin center, on your applications **Overview** page, select **Delete**.
1. In the **Delete app registration** pane, check the box, and select **Delete**.
1. The application has now been deleted. You may need to refresh the page to see the change.

## See also

- [Quickstart: Protect an ASP.NET Core web API with the Microsoft identity platform](./quickstart-web-api-aspnet-core-protect-api.md)
- Create an ASP.NET web app from scratch with the series [Tutorial: Register an application with the Microsoft identity platform](./web-app-tutorial-01-register-application.md)
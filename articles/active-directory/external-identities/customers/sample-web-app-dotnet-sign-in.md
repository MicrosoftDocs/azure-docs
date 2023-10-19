---
title: Sign in users to a sample ASP.NET web application
description: Learn how to configure a sample ASP.NET web app to sign in and sign out users by using a Microsoft Entra ID for customers tenant.
services: active-directory
author: cilwerner
manager: celestedg

ms.author: cwerner
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: sample
ms.date: 06/23/2023
ms.custom: developer, devx-track-dotnet
#Customer intent: As a dev, devops, I want to learn about how to configure a sample ASP.NET web app to sign in and sign out users with my Microsoft Entra ID for customers tenant
---

# Sign in users for a sample ASP.NET web app in a Microsoft Entra ID for customers tenant

This how-to guide uses a sample ASP.NET web application to show the fundamentals of modern authentication using the [Microsoft Authentication Library for .NET](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet) and [Microsoft Identity Web](https://github.com/AzureAD/microsoft-identity-web/) for ASP.NET to handle authentication.

In this article, you'll register a web application in the Microsoft Entra admin center and create a sign in and sign out user flow. You'll associate your web application with the user flow, download and update a sample ASP.NET web application using your own Microsoft Entra ID for customers tenant details. Finally, you'll run and test the sample web application.

## Prerequisites

- Although any IDE that supports ASP.NET applications can be used, Visual Studio Code is used for this guide. It can be downloaded from the [Downloads](https://visualstudio.microsoft.com/downloads/) page.
- [.NET 7.0 SDK](https://dotnet.microsoft.com/download/dotnet).
- Microsoft Entra ID for customers tenant. If you don't already have one, <a href="https://aka.ms/ciam-free-trial?wt.mc_id=ciamcustomertenantfreetrial_linkclick_content_cnl" target="_blank">sign up for a free trial</a>.

## Register the web app

[!INCLUDE [active-directory-b2c-register-app](./includes/register-app/register-client-app-common.md)]

## Define the platform and URLs

[!INCLUDE [ciam-redirect-url-dotnet](./includes/register-app/add-platform-redirect-url-dotnet.md)]

## Add app client secret

[!INCLUDE [ciam-add-client-secret](./includes/register-app/add-app-client-secret.md)]

## Grant API permissions

[!INCLUDE [ciam-grant-delegated-permissions](./includes/register-app/grant-api-permission-sign-in.md)]

## Create a user flow

[!INCLUDE [ciam-app-integration-add-user-flow](./includes/configure-user-flow/create-sign-in-sign-out-user-flow.md)]

## Associate the web application with the user flow

[!INCLUDE [ciam-integration-add-user-flow](./includes/configure-user-flow/add-app-user-flow.md)]

## Clone or download sample web application

To get the web app sample code, you can do either of the following tasks:

- [Download the .zip file](https://github.com/Azure-Samples/ms-identity-ciam-dotnet-tutorial/archive/refs/heads/main.zip). Extract the sample app file to a folder where the total length of the path is 260 or fewer characters.
- Clone the sample web application from GitHub by running the following command:

    ```powershell
    git clone https://github.com/Azure-Samples/ms-identity-ciam-dotnet-tutorial.git
    ```

## Configure the application

1. Navigate to the root folder of the sample you have downloaded and directory that contains the ASP.NET sample app:

    ```powershell
    cd 1-Authentication\1-sign-in-aspnet-core-mvc
    ```

1. Open the *appsettings.json* file.
1. In **Authority**, find `Enter_the_Tenant_Subdomain_Here` and replace it with the subdomain of your tenant. For example, if your tenant primary domain is *caseyjensen@onmicrosoft.com*, the value you should enter is *casyjensen*.
1. Find the `Enter_the_Application_Id_Here` value and replace it with the application ID (clientId) of the app you registered in the Microsoft Entra admin center.
1. Replace `Enter_the_Client_Secret_Here` with the client secret value you set up in [Add app client secret](#add-app-client-secret).

## Run the code sample

1. From your shell or command line, execute the following commands:

    ```powershell
    dotnet run
    ```

1. Open your web browser and navigate to `https://localhost:7274`.

1. Sign-in with an account registered to the customer tenant.

1. Once signed in the display name is shown next to the **Sign out** button as shown in the following screenshot.

    :::image type="content" source="media/tutorial-web-app-dotnet-sign-in-sign-in-out/display-aspnet-welcome.png" alt-text="Screenshot of sign in into a ASP.NET web app.":::

1. To sign-out from the application, select the **Sign out** button.

## Next steps

- [Enable password reset](how-to-enable-password-reset-customers.md)
- [Customize the default branding](how-to-customize-branding-customers.md)
- [Configure sign-in with Google](how-to-google-federation-customers.md)
- [Sign in users in your own ASP.NET web application by using a Microsoft Entra ID for customers tenant](tutorial-web-app-dotnet-sign-in-prepare-app.md)

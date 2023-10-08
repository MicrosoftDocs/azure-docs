---
title: Sign in users in a sample WPF desktop application 
description: Learn how to configure a sample WPF desktop to sign in and sign out users.
services: active-directory
author: SHERMANOUKO
manager: mwongerapk

ms.author: shermanouko
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: sample
ms.date: 07/26/2023
ms.custom: developer, devx-track-dotnet
#Customer intent: As a dev, devops, I want to learn about how to configure a sample WPF desktop app to sign in and sign out users with my Microsoft Entra ID for customers tenant
---

# Sign in users in a sample WPF desktop application 

This article uses a sample Windows Presentation Foundation (WPF) application to show you how to add authentication to a WPF desktop application. The sample application enables users to sign in and sign out. The sample desktop application uses [Microsoft Authentication Library for .NET](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet) for .NET to handle authentication.

## Prerequisites

- [.NET 7.0](https://dotnet.microsoft.com/download/dotnet/7.0) or later. 

- [Visual Studio Code](https://code.visualstudio.com/download) or another code editor.

- Microsoft Entra ID for customers tenant. If you don't already have one, [sign up for a free trial](https://aka.ms/ciam-free-trial?wt.mc_id=ciamcustomertenantfreetrial_linkclick_content_cnl).

## Register the desktop app

[!INCLUDE [active-directory-b2c-register-app](./includes/register-app/register-client-app-common.md)]

## Specify your app platform

[!INCLUDE [active-directory-b2c-wpf-app-platform](./includes/register-app/add-platform-redirect-url-wpf.md)]  

## Grant API permissions

Since this app signs-in users, add delegated permissions:

[!INCLUDE [active-directory-b2c-grant-delegated-permissions](./includes/register-app/grant-api-permission-sign-in.md)] 

## Create a user flow 

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/configure-user-flow/create-sign-in-sign-out-user-flow.md)] 

## Associate the WPF application with the user flow

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/configure-user-flow/add-app-user-flow.md)]

## Clone or download sample WPF application

To get the WPF desktop app sample code, you can do either of the following tasks:

- [Download the .zip file](https://github.com/Azure-Samples/ms-identity-ciam-dotnet-tutorial/archive/refs/heads/main.zip) or clone the sample desktop application from GitHub by running the following command:

    ```console
        git clone https://github.com/Azure-Samples/ms-identity-ciam-dotnet-tutorial.git
    ```

If you choose to download the *.zip* file, extract the sample app file to a folder where the total length of the path is 260 or fewer characters.

## Configure the sample WPF app

1. Open the project in your IDE (like Visual Studio or Visual Studio Code) to configure the code.

1. In your code editor, open the *appsettings.json* file in the **ms-identity-ciam-dotnet-tutorial** > **1-Authentication** > **5-sign-in-dotnet-wpf** folder.

1. Replace `Enter_the_Application_Id_Here` with the Application (client) ID of the app you registered earlier.
 
1. Replace `Enter_the_Tenant_Subdomain_Here` with the Directory (tenant) subdomain. For example, if your primary domain is *contoso.onmicrosoft.com*, replace `Enter_the_Tenant_Subdomain_Here` with *contoso*. If you don't have your primary domain, learn how to [read tenant details](how-to-create-customer-tenant-portal.md#get-the-customer-tenant-details).

## Run and test sample WPF desktop app 

1. Open a console window, and change to the directory that contains the WPF desktop sample app:

    ```console
    cd 1-Authentication\5-sign-in-dotnet-wpf
    ```

1. In your terminal, run the app by running the following command:

    ```console
    dotnet run
    ```

1. After you launch the sample you should see a window with a **Sign-In** button. Select the **Sign-In** button.

    :::image type="content" source="./media/sample-wpf-dotnet-sign-in/wpf-sign-in-screen.png" alt-text="Screenshot of sign-in screen for a WPF desktop application.":::

1. On the sign-in page, enter your account email address. If you don't have an account, select **No account? Create one**, which starts the sign-up flow. Follow through this flow to create a new account and sign in.
1. Once you sign in, you'll see a screen displaying successful sign-in and basic information about your user account stored in the retrieved token.

    :::image type="content" source="./media/sample-wpf-dotnet-sign-in/wpf-successful-sign-in.png" alt-text="Screenshot of successful sign-in for desktop WPF app.":::

### How it works

The main configuration for the public client application is handled within the *App.xaml.cs* file. A `PublicClientApplication` is initialized along with a cache for storing access tokens. The application will first check whether there's a cached token that can be used to sign the user in. If there's no cached token, the user will be prompted to provide credentials and sign-in. Upon signing-out, the cache is cleared of all accounts and all corresponding access tokens.

## Next steps

See the tutorial on how to [build your own WPF desktop app that authenticates users](tutorial-desktop-wpf-dotnet-sign-in-prepare-tenant.md)

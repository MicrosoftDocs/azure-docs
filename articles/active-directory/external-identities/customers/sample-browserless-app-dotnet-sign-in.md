---
title: Sign in users in a sample ASP.NET browserless app
description: Use a sample to learn how to configure a sample ASP.NET browserless app.
services: active-directory
author: SHERMANOUKO
manager: mwongerapk

ms.author: shermanouko
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: sample
ms.date: 06/23/2023
ms.custom: developer, devx-track-dotnet
#Customer intent: As a dev, devops, I want to learn about how to configure a sample ASP.NET browserless app to sign in users with my Azure Active Directory (Azure AD) for customers tenant
---

# Sign in users into a sample ASP.NET browserless app using Device Code flow

This how-to guide uses a sample ASP.NET browserless app to show how to add authentication to the app. The sample app enables users to sign in. The sample ASP.NET browserless app uses [Microsoft Authentication Library for .NET (MSAL NET)](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet) to handle authentication.

## Prerequisites

- [.NET 7 SDK](https://dotnet.microsoft.com/download/dotnet/7.0).

- [Visual Studio Code](https://code.visualstudio.com/download) or another code editor.

- Azure AD for customers tenant. If you don't already have one, <a href="https://aka.ms/ciam-free-trial?wt.mc_id=ciamcustomertenantfreetrial_linkclick_content_cnl" target="_blank">sign up for a free trial</a>. 

## Register the headless app

[!INCLUDE [active-directory-b2c-register-app](./includes/register-app/register-client-app-common.md)]

## Enable public client flow

[!INCLUDE [enable-public-client-flow](./includes/register-app/enable-public-client-flow.md)]

## Grant API permissions

Since this app signs-in users, add delegated permissions:

[!INCLUDE [active-directory-b2c-grant-delegated-permissions](./includes/register-app/grant-api-permission-sign-in.md)] 

## Create a user flow 

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/configure-user-flow/create-sign-in-sign-out-user-flow.md)] 

## Associate the browserless app with the user flow

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/configure-user-flow/add-app-user-flow.md)]

## Clone or download sample browserless app

To get the browserless app sample code, you can do either of the following tasks: [Download the .zip file](https://github.com/Azure-Samples/ms-identity-ciam-dotnet-tutorial/archive/refs/heads/main.zip) or clone the sample web application from GitHub by running the following command:

```console
git clone https://github.com/Azure-Samples/ms-identity-ciam-dotnet-tutorial.git
```
If you choose to download the *.zip* file, extract the sample app file to a folder where the total length of the path is 260 or fewer characters.

## Configure the sample browserless app

1. Open the project in your IDE (like Visual Studio or Visual Studio Code) to configure the code.

1. In your code editor, open the *appsettings.json* file in the *1-Authentication* > *4-sign-in-device-code* folder.

1. Replace `Enter_the_Application_Id_Here` with the Application (client) ID of the app you registered earlier.
 
1. Replace `Enter_the_Tenant_Subdomain_Here` with the Directory (tenant) subdomain. For example, if your primary domain is *contoso.onmicrosoft.com*, replace `Enter_the_Tenant_Subdomain_Here` with *contoso*. If you don't have your primary domain, learn how to [read tenant details](how-to-create-customer-tenant-portal.md#get-the-customer-tenant-details).

## Run and test sample browserless app 

1. Open a console window, and change to the directory that contains the ASP.NET browserless sample app:

    ```console
    cd 1-Authentication/4-sign-in-device-code
    ```

1. In your terminal, run the app by running the following command:

    ```console
    dotnet run
    ```
1. When the app launches, copy the suggested URL *https://microsoft.com/devicelogin* from the terminal and visit it in a browser. Then, copy the device code from the terminal and [follow the prompts](./tutorial-browserless-app-dotnet-sign-in-build-app.md#sign-in-to-your-app) on *https://microsoft.com/devicelogin*.

## How it works

The browserless app is initialized as a public client application. You acquire token using the device code auth grant flow. This flow allows users to sign in to input-constrained devices such as a smart TV, IoT device, or a printer. You then pass a callback to the `AcquireTokenWithDeviceCodeAsync` method. This callback contains a `DeviceCodeResult` object that contains the URL a user navigates to and sign in. Once the user signs in, an `AuthenticationResult` is returned containing an access token and some basic account information.

```csharp
var scopes = new string[] { }; // by default, MSAL attaches OIDC scopes to every token request
var result = await app.AcquireTokenWithDeviceCode(scopes, async deviceCode => {
    Console.WriteLine($"In a broswer, navigate to the URL '{deviceCode.VerificationUrl}' and enter the code '{deviceCode.UserCode}'");
    await Task.FromResult(0);
}).ExecuteAsync();

Console.WriteLine($"You signed in as {result.Account.Username}");
```

## Next steps

Next, learn how to prepare your Azure AD for customers tenant.

> [!div class="nextstepaction"]
> [Build your own ASP.NET browserless app and sign in users >](./tutorial-browserless-app-dotnet-sign-in-prepare-tenant.md)

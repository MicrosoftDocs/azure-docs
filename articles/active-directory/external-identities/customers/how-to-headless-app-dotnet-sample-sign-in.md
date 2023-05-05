---
title: Sign in users in a sample headless application by using Microsoft Entra
description: Use a sample to learn how to configure a headless (browserless) app to sign in users using Microsoft Entra.
services: active-directory
author: SHERMANOUKO
manager: mwongerapk

ms.author: shermanouko
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 05/05/2023
ms.custom: developer

#Customer intent: As a dev, devops, I want to learn about how to configure a sample ASP.NET Core headless app to sign in and sign out users with my Azure Active Directory (Azure AD) for customers tenant
---

# Sign in users in a sample ASP.NET Core headless application by using Microsoft Entra

This how-to guide uses a sample ASP.NET Core headless application to show how to add authentication to a headless application by using Microsoft Entra. Headless applications are also known as browserless applications. The sample application enables users to sign in. The sample HEADLESS application uses [Microsoft Authentication Library for .NET (MSAL NET)](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet) to handle authentication.

In this article, you do the following tasks:

- Register a headless application in the Microsoft Entra admin center. 

- Create a user flow in Microsoft Entra admin center.

- Associate your headless application with the user flow. 

- Update a sample ASP.NET Core headless application using your own Azure Active Directory (Azure AD) for customers tenant details.

- Run and test the sample headless application.

## Prerequisites

- [ASP.NET Core 7.0](https://dotnet.microsoft.com/download/dotnet/7.0).

- [Visual Studio Code](https://code.visualstudio.com/download) or another code editor.

- Azure AD for customers tenant. If you don't already have one, [sign up for a free trial](https://aka.ms/ciam-free-trial). 

## Register the headless app

[!INCLUDE [active-directory-b2c-register-app](./includes/register-app/register-client-app-common.md)]

## Enable public client flow

[!INCLUDE [enable-public-client-flow](./includes/register-app/enable-public-client-flow.md)]

## Grant API permissions

Since this app signs-in users, add delegated permissions:

[!INCLUDE [active-directory-b2c-grant-delegated-permissions](./includes/register-app/grant-api-permission-sign-in.md)] 

## Create a user flow 

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/configure-user-flow/create-sign-in-sign-out-user-flow.md)] 

## Associate the headless application with the user flow

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/configure-user-flow/add-app-user-flow.md)]

## Clone or download sample headless application

To get the web app sample code, you can do either of the following tasks:

- [Download the .zip file](https://github.com/Azure-Samples/ms-identity-ciam-dotnet-tutorial/archive/refs/heads/main.zip) or clone the sample web application from GitHub by running the following command:

    ```console
        git clone git clone https://github.com/Azure-Samples/ms-identity-ciam-dotnet-tutorial.git
    ```
If you choose to download the *.zip* file, extract the sample app file to a folder where the total length of the path is 260 or fewer characters.

## Configure the sample headless app

1. Open the project in your IDE (like Visual Studio or Visual Studio Code) to configure the code.

1. In your code editor, open the *appsettings.json* file in the *1-Authentication* > *4-sign-in-device-code* folder.

1. Find the placeholder: 
    
    1. `Enter_the_Application_Id_Here` and replace it with the Application (client) ID of the app you registered earlier.
     
    1. `Enter_the_Tenant_Name_Here` and replace it with the first part of your primary domain name. For example, if your primary domain name is *contoso.onmicrosoft.com*, replace `Enter_the_Tenant_Name_Here` with *contoso*. If you don't have your primary domain name name, learn how to [read tenant details](how-to-create-customer-tenant-portal.md#get-the-customer-tenant-details).

## Run and test sample headless app 

1. Open a console window, and change to the directory that contains the ASP.NET Core headless sample app:

    ```console
        cd 1-Authentication/4-sign-in-device-code
    ```

1. In your terminal, run the app by running the following command:

    ```console
        dotnet run
    ```
1. When the app launches, copy the suggested URL *https://microsoft.com/devicelogin* from the terminal and visit it in a browser. Then, copy the device code from terminal and follow the prompts on *https://microsoft.com/devicelogin*.

## How it works

The headless app is initialized as a public client application. We then acquire token using the device code auth grant flow. This flow allows users to sign in to input-constrained devices such as a smart TV, IoT device, or a printer. We pass a callback to the `AcquireTokenWithDeviceCodeAsync` method. This callback contains a `DeviceCodeResult` object which contains the URL a user will navigate to and sign in. Once the user signs in, an `AuthenticationResult` is returned containing an access token and some basic account information.

```javascript
var result = await app.AcquireTokenWithDeviceCode(new [] { "openid" }, async deviceCode => {
    Console.WriteLine($"In a broswer, navigate to the URL '{deviceCode.VerificationUrl}' and enter the code '{deviceCode.UserCode}'");
    await Task.FromResult(0);
})
.ExecuteAsync();

Console.WriteLine($"You signed in as {result.Account.Username}");
```

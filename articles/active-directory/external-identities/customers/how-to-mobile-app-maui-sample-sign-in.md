---
title: Sign in users in a sample .NET MAUI mobile application by using Microsoft Entra ID for customers tenant
description: Learn how to configure a sample .NET MAUI mobile to sign in and sign out users by using Microsoft Entra ID for customers tenant.
services: active-directory
author: henrymbuguakiarie
manager: mwongerapk

ms.author: henrymbugua
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 05/22/2023
ms.custom: developer, devx-track-dotnet
#Customer intent: As a dev, devops, I want to learn about how to configure a sample .NET MAUI mobile app to sign in and sign out users with Microsoft Entra ID for customers tenant
---

# Sign in users in a sample .NET MAUI Android application

This how-to guide uses a sample .NET Multi-platform App UI (.NET MAUI) to show how to add authentication to an Android application by using Microsoft Entra ID for customers tenant. The sample application enables users to sign in and sign out. The sample .NET MAUI Android application uses [Microsoft Authentication Library (MSAL)](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet) for .NET to handle authentication.

In this article, you do the following tasks:

- Register a .NET MAUI Android application in the Microsoft Entra ID for customers tenant.
- Create a sign-in and sign-out user flow in the Microsoft Entra ID for customers tenant.
- Associate your .NET MAUI Android application with the user flow.
- Update a sample .NET MAUI Android application to use your own Microsoft Entra ID for customers tenant details.
- Run and test the sample .NET MAUI Android application.

## Prerequisites

- [.NET 7.0 SDK](https://dotnet.microsoft.com/download/dotnet/7.0)
- [Visual Studio 2022](https://aka.ms/vsdownloads) with the MAUI workload installed:
  - [Instructions for Windows](/dotnet/maui/get-started/installation?tabs=vswin)
  - [Instructions for macOS](/dotnet/maui/get-started/installation?tabs=vsmac)
- Microsoft Entra ID for customers tenant. If you don't already have one, [sign up for a free trial](https://aka.ms/ciam-free-trial?wt.mc_id=ciamcustomertenantfreetrial_linkclick_content_cnl).

## Register .NET MAUI Android application

[!INCLUDE [active-directory-b2c-register-app](./includes/register-app/register-client-app-common.md)]
[!INCLUDE [active-directory-b2c-app-integration-add-platform](./includes/register-app/add-platform-redirect-url-dotnet-maui.md)]

## Grant API permissions

[!INCLUDE [active-directory-b2c-grant-delegated-permissions](./includes/register-app/grant-api-permission-sign-in.md)]

## Create a user flow

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/configure-user-flow/create-sign-in-sign-out-user-flow.md)]

## Associate the .NET MAUI Android application with the user flow

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](./includes/configure-user-flow/add-app-user-flow.md)]

## Clone or download sample .NET MAUI Android application

To get the .NET MAUI Android application sample code, [download the .zip file](https://github.com/Azure-Samples/ms-identity-ciam-dotnet-tutorial/archive/refs/heads/main.zip) or clone the sample .NET MAUI Android application from GitHub by running the following command:

```bash
git clone https://github.com/Azure-Samples/ms-identity-ciam-dotnet-tutorial.git
```

## Configure the sample .NET MAUI Android application

1. In Visual Studio, open *ms-identity-ciam-dotnet-tutorial-main/1-Authentication/2-sign-in-maui/appsettings.json* file.
1. Find the placeholder:
   1. `Enter_the_Tenant_Subdomain_Here` and replace it with the Directory (tenant) subdomain. For example, if your tenant primary domain is `contoso.onmicrosoft.com`, use `contoso`. If you don't have your tenant name, learn how to [read your tenant details](how-to-create-customer-tenant-portal.md#get-the-customer-tenant-details).
   1. `Enter_the_Application_Id_Here` and replace it with the **Application (client) ID** of the app you registered earlier.
1. In Visual Studio, open *ms-identity-ciam-dotnet-tutorial-main/1-Authentication/2-sign-in-maui/Platforms/Android/AndroidManifest.xml* file.
1. Find the placeholder:
   1. `Enter_the_Application_Id_Here` and replace it with the **Application (client) ID** of the app you registered earlier.

## Run and test sample .NET MAUI Android application

.NET MAUI apps are designed to run on multiple operating systems and devices. You'll need to select which target you want to test and debug your app with.

Set the **Debug Target** in the Visual Studio toolbar to the device you want to debug and test with. The following steps demonstrate setting the **Debug Target** to _Android_:

1. Select **Debug Target** drop-down.
1. Select **Android Emulators**. 
1. Select emulator device.

Run the app by pressing _F5_ or select the _play button_ at the top of Visual Studio.

1. You can now test the sample .NET MAUI Android app. After you run the app, the Android app window appears in an emulator:

   :::image type="content" source="media/how-to-mobile-app-maui-sample-sign-in/maui-android-sign-in.jpg" alt-text="Screenshot of the sign-in button in the Android application.":::

1. On the Android window that appears, select the **Sign In** button. A browser window opens, and you're prompted to sign in.

   :::image type="content" source="media/how-to-mobile-app-maui-sample-sign-in/maui-android-sign-in-prompt.jpg" alt-text="Screenshot of user prompt to enter credential in Android application.":::

   During the sign in process, you're prompted to grant various permissions (to allow the application to access your data). Upon successful sign in and consent, the application screen displays the main page.

   :::image type="content" source="media/how-to-mobile-app-maui-sample-sign-in/maui-android-after-sign-in.png" alt-text="Screenshot of the main page in the Android application after signing in.":::

## Next Steps

- [Customize the default branding](how-to-customize-branding-customers.md).
- [Configure sign-in with Google](how-to-google-federation-customers.md).

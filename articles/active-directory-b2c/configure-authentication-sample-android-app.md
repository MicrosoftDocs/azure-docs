---
title: Configure authentication in a sample Android application using Azure Active Directory B2C
description:  Using Azure Active Directory B2C to sign in and sign up users in an Android application.
services: active-directory-b2c
author: msmimart
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 07/05/2021
ms.author: mimart
ms.subservice: B2C
ms.custom: "b2c-support"
---

# Configure authentication in a sample Android application using Azure Active Directory B2C

This article uses a sample Android application (Kotlin and Java) to illustrate how to add Azure Active Directory B2C (Azure AD B2C) authentication to your mobile apps.

## Overview

OpenID Connect (OIDC) is an authentication protocol built on OAuth 2.0, which you can securely use to sign-in in a user to an application. This mobile app sample uses [MSAL](../active-directory/develop/msal-overview.md) library with OpenId Connect authorization code PKCE flow. The MSAL library is a Microsoft provided library that simplifies adding authentication and authorization support to mobile apps. 

The sign-in flow involves following steps:

1. The user opens the app and selects **sign-in**.
1. The app opens the mobile device's system browser, and starts an authentication request to Azure AD B2C.
1. The user [signs-up or signs-in](add-sign-up-and-sign-in-policy.md), [resets the password](add-password-reset-policy.md), or signs-in with a [social account](add-identity-provider.md).
1. Upon successful sign-in, Azure AD B2C returns an authorization code to the app.
1. The app takes the following actions:
    1. Exchanges the authorization code to an ID token, access token and refresh token.
    1. Reads the ID token claims.
    1. Stores the tokens to an in-memory cache for later use.

### App registration overview

To enable your app to sign in with Azure AD B2C and call a web API, register two applications in the Azure AD B2C directory.  

- The **mobile application** registration enables your app to sign in with Azure AD B2C. During app registration, specify the *Redirect URI*. The redirect URI is the endpoint to which the user is redirected by Azure AD B2C after they authenticate with Azure AD B2C is completed. The app registration process generates an *Application ID*, also known as the *client ID*, that uniquely identifies your mobile app. For example, **App ID: 1**.

- The  **web API** registration enables your app to call a protected web API. The registration exposes the web API permissions (scopes). The app registration process generates an *Application ID*, that uniquely identifies your web API.  For example, **App ID: 2**. Grant your mobile app (App ID: 1) permissions to the web API scopes (App ID: 2). 


The following diagrams describe the apps registration and the application architecture.

![Mobile app with web API call registrations and tokens](./media/configure-authentication-sample-android-app/mobile-app-with-api-architecture.png) 

### Call to a web API

[!INCLUDE [active-directory-b2c-app-integration-call-api](../../includes/active-directory-b2c-app-integration-call-api.md)]

### Sign-out

[!INCLUDE [active-directory-b2c-app-integration-sign-out-flow](../../includes/active-directory-b2c-app-integration-sign-out-flow.md)]

## Prerequisites

A computer that's running: 


- [Java Development Kit (JDK)](https://openjdk.java.net/) 8, or above.
- [Apache Maven](https://maven.apache.org/)
- [Android API Level 16](https://developer.android.com/studio/releases/platforms), or above.
- [Android studio](https://developer.android.com/studio), or another code editor.


## Step 1: Configure your user flow

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](../../includes/active-directory-b2c-app-integration-add-user-flow.md)]

## Step 2: Register mobile applications

In this step, create the mobile app and the web API application registration, and specify the scopes of your web API.

### 2.1 Register the web API app

[!INCLUDE [active-directory-b2c-app-integration-register-api](../../includes/active-directory-b2c-app-integration-register-api.md)]

### 2.2 Configure web API app scopes

[!INCLUDE [active-directory-b2c-app-integration-api-scopes](../../includes/active-directory-b2c-app-integration-api-scopes.md)]


### 2.3 Register the mobile app

Follow these steps to create the mobile app registration:

1. Select **App registrations**, and then select **New registration**.
1. Enter a **Name** for the application. For example, *android-app1*.
1. Under **Supported account types**, select **Accounts in any identity provider or organizational directory (for authenticating users with user flows)**. 
1. Under **Redirect URI**, select **Public client/native (mobile & desktop)**, and then in the URL text box, enter one of the following URIs:
    - For the Kotlin sample: `msauth://com.azuresamples.msalandroidkotlinapp/1wIqXSqBj7w%2Bh11ZifsnqwgyKrY%3D`
    - For the Java sample: `msauth://com.azuresamples.msalandroidapp/1wIqXSqBj7w%2Bh11ZifsnqwgyKrY%3D`
1. Select **Register**.
1. After the app registration is completed, select **Overview**.
1. Record the **Application (client) ID** for use in a later step when you configure the mobile application.

    ![Get your mobile application ID](./media/configure-authentication-sample-android-app/get-azure-ad-b2c-app-id.png)  


### 2.4 Grant the mobile app permissions for the web API

[!INCLUDE [active-directory-b2c-app-integration-grant-permissions](../../includes/active-directory-b2c-app-integration-grant-permissions.md)]

## Step 3: Get the Android mobile app sample

Download one of the following samples: [Kotlin](https://github.com/Azure-Samples/ms-identity-android-kotlin/archive/refs/heads/master.zip), or [Java](https://github.com/Azure-Samples/ms-identity-android-java/archive/refs/heads/master.zip). Extract the sample ZIP file to your working folder.

Or clone the sample Android mobile application from GitHub. 

#### [Kotlin](#tab/kotlin)


```bash
git clone https://github.com/Azure-Samples/ms-identity-android-kotlin
```

#### [Java](#tab/java)

```bash
git clone https://github.com/Azure-Samples/ms-identity-android-java
```

--- 


## Step 4: Configure the sample web API

This sample acquires an access token with the relevant scopes the mobile app can use to for a web API. To call a web API from code, follow these steps:

1. Use an existing web API, or create a new one. For more information, see [Enable authentication in your own web API using Azure AD B2C](enable-authentication-web-api.md).
1. Change the sample code to [call a web API](enable-authentication-android-app.md#call-a-web-api).

## Step 5: Configure the sample mobile app

Open the sample project with Android Studio, or other code editor.  Then open the `/app/src/main/res/raw/auth_config_b2c.json` file. 

The *auth_config_b2c.json* configuration file contains information about your Azure AD B2C identity provider. The mobile app uses this information to establish a trust relationship with Azure AD B2C, sign-in the user in and out, acquire tokens, and validate them. 

Update the following properties of the app settings:

|Key  |Value  |
|---------|---------|
| [client_id](../active-directory/develop/msal-client-application-configuration.md#client-id) | The mobile application ID from [step 2.3](#23-register-the-mobile-app). | 
| [redirect_uri](../active-directory/develop/msal-client-application-configuration.md#redirect-uri) | The mobile application redirect URI from [step 2.3](#23-register-the-mobile-app). | 
| [authorities](../active-directory/develop/msal-client-application-configuration.md#authority)| The authority is a URL that indicates a directory that MSAL can request tokens from. Use the following format: `https://<your-tenant-name>.b2clogin.com/<your-tenant-name>.onmicrosoft.com/<your-sign-in-sign-up-policy>`. Replace the `<your-tenant-name>` with your Azure AD B2C [tenant name](tenant-management.md#get-your-tenant-name). Then, replace the `<your-sign-in-sign-up-policy>` with the user flows, or custom policy you created in [step 1](#step-1-configure-your-user-flow). | 


Open the `B2CConfiguration` class, and  update the following class members:

|Key  |Value  |
|---------|---------|
| Policies| List of the user flows, or custom policies you created in [step 1](#step-1-configure-your-user-flow).|
| azureAdB2CHostName| The first part of your Azure AD B2C [tenant name](tenant-management.md#get-your-tenant-name). For example, `https://contoso.b2clogin.com`.|
| tenantName| Your Azure AD B2C tenant full [tenant name](tenant-management.md#get-your-tenant-name). For example, `contoso.onmicrosoft.com`.|
| scopes| The web API scopes you created in [step 2.4](#24-grant-the-mobile-app-permissions-for-the-web-api).|


## Step 6: Run and test the mobile app

1. Build and run the project.
1. Select the hamburger icon.
    
    ![Screenshot demonstrate how to select the hamburger icon.](./media/configure-authentication-sample-android-app/select-hamburger-icon.png)

1. Select **B2C mode**.

    ![Screenshot demonstrate how to select B2C mode.](./media/configure-authentication-sample-android-app/select-azure-ad-b2c-mode.png)

1. Select **RUN USER FLOW**.

    ![Screenshot demonstrate how to start the sign-in flow.](./media/configure-authentication-sample-android-app/select-policy-and-sign-in.png)

1. Sign-up or sign-in with your Azure AD B2C local or social account.

1. After successful authentication, you'll see your display name in the navigation bar.

    ![Azure AD B2C access token and user ID.](./media/configure-authentication-sample-android-app/access-token.png) 

## Next steps

* Learn how to [Enable authentication in your own Android application](enable-authentication-android-app.md)
* [Configure authentication options in an Android application](enable-authentication-android-app-options.md)
* [Enable authentication in your own web API](enable-authentication-web-api.md)

---
title: Configure authentication in a sample Android application by using Azure Active Directory B2C
description:  This article discusses how to use Azure Active Directory B2C to sign in and sign up users in an Android application.

author: kengaderdus
manager: CelesteDG
ms.service: active-directory

ms.topic: reference
ms.date: 07/05/2021
ms.author: kengaderdus
ms.subservice: B2C
ms.custom: "b2c-support"
---

# Configure authentication in a sample Android app by using Azure AD B2C

This article uses a sample Android application (Kotlin and Java) to illustrate how to add Azure Active Directory B2C (Azure AD B2C) authentication to your mobile apps.

## Overview

OpenID Connect (OIDC) is an authentication protocol that's built on OAuth 2.0. You can use OIDC to securely sign users in to an application. This mobile app sample uses the [Microsoft Authentication Library (MSAL)](../active-directory/develop/msal-overview.md) with OIDC authorization code PKCE flow. The MSAL is a Microsoft-provided library that simplifies adding authentication and authorization support to mobile apps. 

The sign-in flow involves the following steps:

1. Users open the app and select **sign-in**.
1. The app opens the mobile device's system browser and starts an authentication request to Azure AD B2C.
1. Users [sign up or sign in](add-sign-up-and-sign-in-policy.md), [reset the password](add-password-reset-policy.md), or sign in with a [social account](add-identity-provider.md).
1. After users sign in successfully, Azure AD B2C returns an authorization code to the app.
1. The app takes the following actions:
    1. It exchanges the authorization code to an ID token, access token, and refresh token.
    1. It reads the ID token claims.
    1. It stores the tokens in an in-memory cache for later use.

### App registration overview

To enable your app to sign in with Azure AD B2C and call a web API, register two applications in the Azure AD B2C directory.  

- The **mobile application** registration enables your app to sign in with Azure AD B2C. During app registration, specify the *redirect URI*. The redirect URI is the endpoint to which users are redirected by Azure AD B2C after they've authenticated with Azure AD B2C. The app registration process generates an *Application ID*, also known as the *client ID*, which uniquely identifies your mobile app (for example, *App ID: 1*).

- The **web API** registration enables your app to call a protected web API. The registration exposes the web API permissions (scopes). The app registration process generates an *Application ID*, which uniquely identifies your web API (for example, *App ID: 2*). Grant your mobile app (App ID: 1) permissions to the web API scopes (App ID: 2). 


The apps registration and application architecture are illustrated in the following diagrams:

![Diagram of the mobile app with web API call registrations and tokens.](./media/configure-authentication-sample-android-app/mobile-app-with-api-architecture.png) 

### Call to a web API

[!INCLUDE [active-directory-b2c-app-integration-call-api](../../includes/active-directory-b2c-app-integration-call-api.md)]

### The sign-out flow

[!INCLUDE [active-directory-b2c-app-integration-sign-out-flow](../../includes/active-directory-b2c-app-integration-sign-out-flow.md)]

## Prerequisites

A computer that's running: 


- [Java Development Kit (JDK) 8 or later](https://openjdk.org/)
- [Apache Maven](https://maven.apache.org/)
- [Android API level 16 or later](https://developer.android.com/tools/releases/platforms)
- [Android Studio](https://developer.android.com/studio) or another code editor


## Step 1: Configure your user flow

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](../../includes/active-directory-b2c-app-integration-add-user-flow.md)]

## Step 2: Register mobile applications

Create the mobile app and web API application registration, and specify the scopes of your web API.

### Step 2.1: Register the web API app

[!INCLUDE [active-directory-b2c-app-integration-register-api](../../includes/active-directory-b2c-app-integration-register-api.md)]

### Step 2.2: Configure web API app scopes

[!INCLUDE [active-directory-b2c-app-integration-api-scopes](../../includes/active-directory-b2c-app-integration-api-scopes.md)]


### Step 2.3: Register the mobile app

To create the mobile app registration, do the following:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **App registrations**, and then select **New registration**.
1. Under **Name**, enter a name for the application (for example, *android-app1*).
1. Under **Supported account types**, select **Accounts in any identity provider or organizational directory (for authenticating users with user flows)**. 
1. Under **Redirect URI**, select **Public client/native (mobile & desktop)** and then, in the URL box, enter one of the following URIs:
    - For the Kotlin sample: `msauth://com.azuresamples.msalandroidkotlinapp/1wIqXSqBj7w%2Bh11ZifsnqwgyKrY%3D`
    - For the Java sample: `msauth://com.azuresamples.msalandroidapp/1wIqXSqBj7w%2Bh11ZifsnqwgyKrY%3D`
1. Select **Register**.
1. After the app registration is completed, select **Overview**.
1. Record the **Application (client) ID** for later use, when you configure the mobile application.

    ![Screenshot highlighting the Android application ID](./media/configure-authentication-sample-android-app/get-azure-ad-b2c-app-id.png)  


### Step 2.4: Grant the mobile app permissions for the web API

[!INCLUDE [active-directory-b2c-app-integration-grant-permissions](../../includes/active-directory-b2c-app-integration-grant-permissions.md)]

## Step 3: Get the Android mobile app sample

Do either of the following:

- Download either of these samples: 
   - [Kotlin](https://github.com/Azure-Samples/ms-identity-android-kotlin/archive/refs/heads/master.zip)
   - [Java](https://github.com/Azure-Samples/ms-identity-android-java/archive/refs/heads/master.zip) 

   Extract the sample .zip file to your working folder.

- Clone the sample Android mobile application from GitHub. 

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

This sample acquires an access token with the relevant scopes that the mobile app can use for a web API. To call a web API from code, do the following:

1. Use an existing web API, or create a new one. For more information, see [Enable authentication in your own web API by using Azure AD B2C](enable-authentication-web-api.md).
1. Change the sample code to [call a web API](enable-authentication-android-app.md#step-6-call-a-web-api).

## Step 5: Configure the sample mobile app

Open the sample project with Android Studio or another code editor, and then open the */app/src/main/res/raw/auth_config_b2c.json* file. 

The *auth_config_b2c.json* configuration file contains information about your Azure AD B2C identity provider. The mobile app uses this information to establish a trust relationship with Azure AD B2C, sign users in and out, acquire tokens, and validate them. 

Update the following app settings properties:

|Key  |Value  |
|---------|---------|
| [client_id](../active-directory/develop/msal-client-application-configuration.md#client-id) | The mobile application ID from [step 2.3](#step-23-register-the-mobile-app). | 
| [redirect_uri](../active-directory/develop/msal-client-application-configuration.md#redirect-uri) | The mobile application redirect URI from [step 2.3](#step-23-register-the-mobile-app). | 
| [authorities](../active-directory/develop/msal-client-application-configuration.md#authority)| The authority is a URL that indicates a directory that the MSAL can request tokens from. Use the following format: `https://<your-tenant-name>.b2clogin.com/<your-tenant-name>.onmicrosoft.com/<your-sign-in-sign-up-policy>`. Replace `<your-tenant-name>` with your Azure AD B2C [tenant name]( tenant-management-read-tenant-name.md#get-your-tenant-name). Then, replace `<your-sign-in-sign-up-policy>` with the user flows or custom policy that you created in [step 1](#step-1-configure-your-user-flow). |
| | | 


Open the `B2CConfiguration` class, and update the following class members:

|Key  |Value  |
|---------|---------|
| Policies| The list of user flows or custom policies that you created in [step 1](#step-1-configure-your-user-flow).|
| azureAdB2CHostName| The first part of your Azure AD B2C [tenant name]( tenant-management-read-tenant-name.md#get-your-tenant-name) (for example, `https://contoso.b2clogin.com`).|
| tenantName| Your Azure AD B2C tenant full [tenant name]( tenant-management-read-tenant-name.md#get-your-tenant-name) (for example, `contoso.onmicrosoft.com`).|
| scopes| The web API scopes that you created in [step 2.4](#step-24-grant-the-mobile-app-permissions-for-the-web-api).|
| | |


## Step 6: Run and test the mobile app

1. Build and run the project.
1. At the top left, select the hamburger icon (also called the collapsed menu icon), as shown here:
    
    ![Screenshot highlighting the hamburger, or collapsed menu, icon.](./media/configure-authentication-sample-android-app/select-hamburger-icon.png)

1. On the left pane, select **B2C Mode**.

    ![Screenshot highlighting the "B2C Mode" command on the left pane.](./media/configure-authentication-sample-android-app/select-azure-ad-b2c-mode.png)

1. Select **Run User Flow**.

    ![Screenshot highlighting the "Run User Flow" button.](./media/configure-authentication-sample-android-app/select-policy-and-sign-in.png)

1. Sign up or sign in with your Azure AD B2C local or social account.

1. After successful authentication, you'll see your display name on the **B2C mode** pane.

    ![Screenshot showing a successful authentication, with signed-in user and policy displayed.](./media/configure-authentication-sample-android-app/access-token.png) 

## Next steps

Learn how to:
* [Enable authentication in your own Android app](enable-authentication-android-app.md)
* [Configure authentication options in an Android app](enable-authentication-android-app-options.md)
* [Enable authentication in your own web API](enable-authentication-web-api.md)

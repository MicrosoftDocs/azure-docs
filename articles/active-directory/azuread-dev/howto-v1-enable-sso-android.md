---
title: How to enable cross-app SSO on Android using ADAL | Microsoft Docs
description: How to use the features of the ADAL SDK to enable single sign-on across your applications.
services: active-directory
author: rwike77
manager: CelesteDG

ms.assetid: 40710225-05ab-40a3-9aec-8b4e96b6b5e7
ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.tgt_pltfrm: android
ms.devlang: java
ms.topic: conceptual
ms.date: 09/24/2018
ms.author: ryanwi
ms.reviewer: brandwe, jmprieur
ms.custom: aaddev
---

# How to: Enable cross-app SSO on Android using ADAL

[!INCLUDE [active-directory-develop-applies-v1-adal](../../../includes/active-directory-develop-applies-v1-adal.md)]

Single sign-on (SSO) allows users to only enter their credentials once and have those credentials automatically work across applications and across platforms that other applications may use (such as Microsoft Accounts or a work account from Microsoft 365) no matter the publisher.

Microsoft's identity platform, along with the SDKs, makes it easy to enable SSO within your own suite of apps, or with the broker capability and Authenticator applications, across the entire device.

In this how-to, you'll learn how to configure the SDK within your application to provide SSO to your customers.

## Prerequisites

This how-to assumes that you know how to:

- Provision your app using the legacy portal for Azure Active Directory (Azure AD). For more info, see [Register an app](quickstart-register-app.md)
- Integrate your application with the [Azure AD Android SDK](https://github.com/AzureAD/azure-activedirectory-library-for-android).

## Single sign-on concepts

### Identity brokers

Microsoft provides applications for every mobile platform that allow for the bridging of credentials across applications from different vendors and for enhanced features that require a single secure place from where to validate credentials. These are called **brokers**.

On iOS and Android, brokers are provided through downloadable applications that customers either install independently or pushed to the device by a company who manages some, or all, of the devices for their employees. Brokers support managing security just for some applications or the entire device based on IT admin configuration. In Windows, this functionality is provided by an account chooser built in to the operating system, known technically as the Web Authentication Broker.

#### Broker assisted login

Broker-assisted logins are login experiences that occur within the broker application and use the storage and security of the broker to share credentials across all applications on the device that apply the identity platform. The implication being your applications will rely on the broker to sign users in. On iOS and Android, these brokers are provided through downloadable applications that customers either install independently or can be pushed to the device by a company who manages the device for their user. An example of this type of application is the Microsoft Authenticator application on iOS. In Windows, this functionality is provided by an account chooser built in to the operating system, known technically as the Web Authentication Broker.
The experience varies by platform and can sometimes be disruptive to users if not managed correctly. You're probably most familiar with this pattern if you have the Facebook application installed and use Facebook Connect from another application. The identity platform uses the same pattern.

On Android, the account chooser is displayed on top of your application, which is less disruptive to the user.

#### How the broker gets invoked

If a compatible broker is installed on the device, like the Microsoft Authenticator application, the identity SDKs will automatically do the work of invoking the broker for you when a user indicates they wish to log in using any account from the identity platform.

#### How Microsoft ensures the application is valid

The need to ensure the identity of an application call the broker is crucial to the security provided in broker assisted logins. iOS and Android do not enforce unique identifiers that are valid only for a given application, so malicious applications may "spoof" a legitimate application's identifier and receive the tokens meant for the legitimate application. To ensure Microsoft is always communicating with the right application at runtime, the developer is asked to provide a custom redirectURI when registering their application with Microsoft. **How developers should craft this redirect URI is discussed in detail below.** This custom redirectURI contains the certificate thumbprint of the application and is ensured to be unique to the application by the Google Play Store. When an application calls the broker, the broker asks the Android operating system to provide it with the certificate thumbprint that called the broker. The broker provides this certificate thumbprint to Microsoft in the call to the identity system. If the certificate thumbprint of the application does not match the certificate thumbprint provided to us by the developer during registration, access is denied to the tokens for the resource the application is requesting. This check ensures that only the application registered by the developer receives tokens.

Brokered-SSO logins have the following benefits:

* User experiences SSO across all their applications no matter the vendor.
* Your application can use more advanced business features such as Conditional Access and support Intune scenarios.
* Your application can support certificate-based authentication for business users.
* More secure sign-in experience as the identity of the application and the user are verified by the broker application with additional security algorithms and encryption.

Here is a representation of how the SDKs work with the broker applications to enable SSO:

```
+------------+ +------------+   +-------------+
|            | |            |   |             |
|   App 1    | |   App 2    |   |   Someone   |
|            | |            |   |    else's   |
|            | |            |   |     App     |
+------------+ +------------+   +-------------+
|  ADAL SDK  | |  ADAL SDK  |   |  ADAL SDK   |
+-----+------+-+-----+------+-  +-------+-----+
      |              |                  |
      |       +------v------+           |
      |       |             |           |
      |       | Microsoft   |           |
      +-------> Broker      |^----------+
              | Application
              |             |
              +-------------+
              |             |
              |   Broker    |
              |   Storage   |
              |             |
              +-------------+

```

### Turning on SSO for broker assisted SSO

The ability for an application to use any broker that is installed on the device is turned off by default. In order to use your application with the broker, you must do some additional configuration and add some code to your application.

The steps to follow are:

1. Enable broker mode in your application code's calling to the MS SDK
2. Establish a new redirect URI and provide that to both the app and your app registration
3. Setting up the correct permissions in the Android manifest

#### Step 1: Enable broker mode in your application

The ability for your application to use the broker is turned on when you create the "settings" or initial setup of your Authentication instance. To do this in your app:

```
AuthenticationSettings.Instance.setUseBroker(true);
```

#### Step 2: Establish a new redirect URI with your URL Scheme

In order to ensure that the right application receives the returned the credential tokens, there is a need to make sure the call back to your application in a way that the Android operating system can verify. The Android operating system uses the hash of the certificate in the Google Play store. This hash of the certificate cannot be spoofed by a rogue application. Along with the URI of the broker application, Microsoft ensures that the tokens are returned to the correct application. A unique redirect URI is required to be registered on the application.

Your redirect URI must be in the proper form of:

`msauth://packagename/Base64UrlencodedSignature`

ex: *msauth://com.example.userapp/IcB5PxIyvbLkbFVtBI%2FitkW%2Fejk%3D*

You can register this redirect URI in your app registration using the [Azure portal](https://portal.azure.com/). For more information on Azure AD app registration, see [Integrating with Azure Active Directory](active-directory-how-to-integrate.md).

#### Step 3: Set up the correct permissions in your application

The broker application in Android uses the Accounts Manager feature of the Android OS to manage credentials across applications. In order to use the broker in Android your app manifest must have permissions to use AccountManager accounts. These permissions are discussed in detail in the [Google documentation for Account Manager here](https://developer.android.com/reference/android/accounts/AccountManager.html)

In particular, these permissions are:

```
GET_ACCOUNTS
USE_CREDENTIALS
MANAGE_ACCOUNTS
```

### You've configured SSO!

Now the identity SDK will automatically both share credentials across your applications and invoke the broker if it's present on their device.

## Next steps

* Learn about [Single sign-on SAML protocol](single-sign-on-saml-protocol.md)

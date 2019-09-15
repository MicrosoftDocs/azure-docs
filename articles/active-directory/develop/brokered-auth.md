---
title: Brokered authentication & authorization | Azure
description: An overview of brokered authentication & authorization in the Microsoft identity platform
services: active-directory
documentationcenter: ''
author: shoatman
manager: nadima
editor: ''
ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 09/14/2019
ms.author: shoatman
ms.custom: aaddev
ms.reviewer: shoatman
ms.collection: M365-identity-device-management
---

# Brokered authentication & authorization

## Introduction

You need to use one of Microsoft's authentication brokers in order to participate in device wide SSO as well as to be able to meet organizational conditional access policies.  The following is a list of things that integration with the broker supports:

- Device Single Sign On
- Conditional Access Relative to:
  - Intune App Protection
  - Device Registration (Workplace Join)
  - Mobile Device Management
- Device Wide Account Management
  - Via Android AccountManager & Account Settings
  - "Work Account" - Custom Account Type

On Android the Microsoft Authentication Broker is a component that's included with both:

- [Microsoft Authenticator App](https://play.google.com/store/apps/details?id=com.azure.authenticator&hl=en_US)
- [Intune Company Portal ](https://play.google.com/store/apps/details?id=com.microsoft.windowsintune.companyportal&hl=en_US)

>NOTE: Only one application hosting the broker will be active as the broker at a time.  Which application is active as a broker is determined by installation order on the device.  The first to be installed or the last present on the device becomes the active broker.

The following diagram illustrates the relationship between your app, MSAL and Microsoft's authentication brokers.

![Broker Deployment Diagram](./images/brokerdeploymentdiagram.png)

## Installation of apps hosting the Broker

Broker hosting apps can be installed by the device owner from their app store (usually Google Play Store) at any time.  With that said some APIs (resources) are protected using Conditional Access Policies that require devices to be:

- Registered (workplace joined) and/or
- Enrolled in Device Management or
- Enrolled in Intune App Protection

If a device does not already have a broker MSAL will instruct the end user to install one when attempting to get a token interactively (authorize endpoint).  Those apps will lead the user through the needed step to make their devices compliant with the required policy.

## Installing, Uninstalling Broker

### Broker installed

When installed on a device all subsequent interactive token requests (calls to acquireToken) will be handled by the broker rather than locally using MSAL.  Any SSO state previously available to MSAL not be available to the broker.  As a result your end user will need to authenticate again or select an account from the existing list of accounts known to the device.

Installation of the broker does not require a user to sign in again.  Only when the user natually needs to resolve an MsalUiRequiredException will the next request go to the broker.  For example: MsalUiRequiredException can be thrown for a number of reasons and needs to be resolved interactively; these are some common ones:

- User changed the password associated with their accounts
- Their account no longer meets a conditional access policy
- The user revoked their consent to your app associated with their account
- etc...

### Active broker uninstalled

If there is only one broker hosting app installed and it is removed.  Your user will need to sign in again.  Uninstalling the active broker removes the account and associated tokens from the device.

If Intune Company Portal is installed and is operating as the active broker and Microsoft Authenticator is also installed.  If the Intune Company Portal (active broker) is uninstalled then your user will need to sign in again.  Once they sign in again then the Microsoft Authenticator app will become the active broker.

## Integrating with broker

### Generating Redirect URI for Broker

A redirect URI that is broker compatible needs to be registered for your app. The redirect for broker needs to include your apps package name as well as the base64 encoded representation of your app signature.

The format of the redirect URI is as follows:

msauth://\<yourpackagename\>/\<base64urlencodedsignature\> 

You can generate your base 64 url encoded signature using your signing keys for you app.  Examples of commands for using your debug signing keys follows:

#### macOS
keytool -exportcert -alias androiddebugkey -keystore ~/.android/debug.keystore | openssl sha1 -binary | openssl base64

#### windows
keytool -exportcert -alias androiddebugkey -keystore %HOMEPATH%\.android\debug.keystore | openssl sha1 -binary | openssl base64

For generation information on signing your API please refer to: https://developer.android.com/studio/publish/app-signing

>Note: You'll need to use your production signing key for the production version of your app.

### MSAL configuration for broker

In order for your app to use broker you need to attest that you've configured your broker redirect.  For example include both your broker enabled redirect URI and indicate that you registered it by including the following in your MSAL configuration file:

```javascript
"redirect_uri" : "<yourbrokerredirecturi>",
"broker_redirect_uri_registered": true
```

> NOTE: The latest Azure Portal app registrations UI helps you in generating the broker redirect URI.  For those who registered your apps in the older experiences or via the Microsoft app registration portal you may need to generate the redirect URI and update the list of redirect URIs manually within the portal.

### Broker Related Exception

MSAL communicates with Broker via 2 possible paths:

- Broker bound service
- Android AccountManager

MSAL will first try and use the broker bound service as calling this service does not require any specific Android permissions.  If for any reasons that binding to the bound service fails.  MSAL will attempt to fallback to using the Android AccountManager API.  It will only do this if your app has already been granted the "READ_CONTACTS" permission.  

If you see an MsalClientException with error code "BROKER_BIND_FAILURE".  You have two options:

- Request the user to disable power optimization relative to both the Microsoft Authenticator app and the Intune Company Portal
- Request the user to grant the Android "READ_CONTACTS" permission

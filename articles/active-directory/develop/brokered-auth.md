---
title: Brokered authentication in Android | Azure
titleSuffix: Microsoft identity platform
description: An overview of brokered authentication & authorization for Android in the Microsoft identity platform
services: active-directory
author: shoatman
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 09/17/2020
ms.author: shoatman
ms.custom: aaddev
ms.reviewer: shoatman, hahamil, brianmel
---

# Brokered authentication in Android

You must use one of Microsoft's authentication brokers to participate in device-wide single sign-on (SSO) and to meet organizational Conditional Access policies. Integrating with a broker provides the following benefits:

- Device single sign-on
- Conditional access for:
  - Intune App Protection
  - Device Registration (Workplace Join)
  - Mobile Device Management
- Device-wide Account Management
  -  via Android AccountManager & Account Settings
  - "Work Account" - custom account type

On Android, the Microsoft Authentication Broker is a component that's included with [Microsoft Authenticator App](https://play.google.com/store/apps/details?id=com.azure.authenticator) and [Intune Company Portal](https://play.google.com/store/apps/details?id=com.microsoft.windowsintune.companyportal).

The following diagram illustrates the relationship between your app, the Microsoft Authentication Library (MSAL), and Microsoft's authentication brokers.

![Diagram showing how an application relates to MSAL, broker apps, and the Android account manager.](./media/brokered-auth/brokered-deployment-diagram.png)

## Installing apps that host a broker

Broker-hosting apps can be installed by the device owner from their app store (typically Google Play Store) at any time. However, some APIs (resources) are protected by Conditional Access Policies that require devices to be:

- Registered (workplace joined) and/or
- Enrolled in Device Management or
- Enrolled in Intune App Protection

If a device doesn't already have a broker app installed, MSAL instructs the user to install one as soon as the app attempts to get a token interactively. The app will then need to lead the user through the steps to make the device compliant with the required policy.

## Effects of installing and uninstalling a broker

### When a broker is installed

When a broker is installed on a device, all subsequent interactive token requests (calls to `acquireToken()`) are handled by the broker rather than locally by MSAL. Any SSO state previously available to MSAL is not available to the broker. As a result, the user will need to authenticate again, or select an account from the existing list of accounts known to the device.

Installing a broker doesn't require the user to sign in again. Only when the user needs to resolve an `MsalUiRequiredException` will the next request go to the broker. `MsalUiRequiredException` can be thrown for several reasons, and needs to be resolved interactively. For example:

- The user changed the password associated with their account.
- The user's account no longer meets a Conditional Access policy.
- The user revoked their consent for the app to be associated with their account.

#### Multiple brokers

If multiple brokers are installed on a device, the broker that was installed first is always the active broker. Only a single broker can be active on a device.

### When a broker is uninstalled

If there is only one broker hosting app installed, and it is removed, then the user will need to sign in again. Uninstalling the active broker removes the account and associated tokens from the device.

If Intune Company Portal is installed and is operating as the active broker, and Microsoft Authenticator is also installed, then if the Intune Company Portal (active broker) is uninstalled the user will need to sign in again. Once they sign in again, the Microsoft Authenticator app  becomes the active broker.

## Integrating with a broker

### Generating a redirect URI for a broker

You must register a redirect URI that is compatible with the broker. The redirect URI for the broker should include your app's package name and the Base64-encoded representation of your app's signature.

The format of the redirect URI is: `msauth://<yourpackagename>/<base64urlencodedsignature>`

You can use [keytool](https://manpages.debian.org/buster/openjdk-11-jre-headless/keytool.1.en.html) to generate a Base64-encoded signature hash using your app's signing keys, and then use the Azure portal to generate your redirect URI using that hash.

Linux and macOS:

```bash
keytool -exportcert -alias androiddebugkey -keystore ~/.android/debug.keystore | openssl sha1 -binary | openssl base64
```

Windows:

```powershell
keytool -exportcert -alias androiddebugkey -keystore %HOMEPATH%\.android\debug.keystore | openssl sha1 -binary | openssl base64
```

Once you've generated a signature hash with *keytool*, use the Azure portal to generate the redirect URI:

1. Sign in to the [Azure portal](https://portal.azure.com) and select your Android app in **App registrations**.
1. Select **Authentication** > **Add a platform** > **Android**.
1. In the **Configure your Android app** pane that opens, enter the **Signature hash** that you generated earlier and a **Package name**.
1. Select the **Configure** button.

The Azure portal generates the redirect URI for you and displays it in the **Android configuration** pane's **Redirect URI** field.

For more information about signing your app, see [Sign your app](https://developer.android.com/studio/publish/app-signing) in the Android Studio User Guide.

> [!IMPORTANT]
> Use your production signing key for the production version of your app.

### Configure MSAL to use a broker

To use a broker in your app, you must attest that you've configured your broker redirect. For example, include both your broker enabled redirect URI--and indicate that you registered it--by including the following settings in your MSAL configuration file:

```json
"redirect_uri" : "<yourbrokerredirecturi>",
"broker_redirect_uri_registered": true
```

### Broker-related exceptions

MSAL communicates with the broker in two ways:

- Broker bound service
- Android AccountManager

MSAL first uses the broker-bound service because calling this service doesn't require any Android permissions. If binding to the bound service fails, MSAL will use the Android AccountManager API. MSAL only does so if your app has already been granted the `"READ_CONTACTS"` permission.

If you get an `MsalClientException` with error code `"BROKER_BIND_FAILURE"`, then there are two options:

- Ask the user to disable power optimization for the Microsoft Authenticator app and the Intune Company Portal.
- Ask the user to grant the `"READ_CONTACTS"` permission

## Verifying broker integration

It might not be immediately clear that broker integration is working, but you can use the following steps to check:

1. On your Android device, complete a request using the broker.
1. In the settings on your Android device, look for a newly created account corresponding to the account that you authenticated with. The account should be of type *Work account*.

You can remove the account from settings if you want to repeat the test.

## Next steps

[Shared device mode for Android devices](msal-android-shared-devices.md) allows you to configure an Android device so that it can be easily shared by multiple employees.

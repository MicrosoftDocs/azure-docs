---
title: How to enable cross-app SSO on iOS using ADAL | Microsoft Docs
description: How to use the features of the ADAL SDK to enable Single Sign On across your applications.
services: active-directory
author: CelesteDG 
manager: mtillman
ms.assetid: d042d6da-7503-4e20-bb55-06917de01fcd
ms.service: active-directory
ms.component: develop
ms.workload: identity
ms.tgt_pltfrm: ios
ms.devlang: objective-c
ms.topic: article
ms.date: 09/24/2018
ms.author: celested
ms.reviewer: brandwe
ms.custom: aaddev
---

# How to: Enable cross-app SSO on iOS using ADAL

[!INCLUDE [active-directory-develop-applies-v1-adal](../../../includes/active-directory-develop-applies-v1-adal.md)]

Single sign-on (SSO) allows users to only enter their credentials once and have those credentials automatically work across applications and across platforms that other applications may use (such as Microsoft Accounts or a work account from Microsoft 365) no matter the publisher.

Microsoft's identity platform, along with the SDKs, makes it easy to enable SSO within your own suite of apps, or with the broker capability and Authenticator applications, across the entire device.

In this how-to, you'll learn how to configure the SDK within your application to provide SSO to your customers.

This how-to applies to:

* Azure Active Directory (Azure Active Directory)
* Azure Active Directory B2C
* Azure Active Directory B2B
* Azure Active Directory Conditional Access

## Prerequisites

This how-to assumes that you know how to:

* Provision your app using the legacy portal for Azure AD. For more info, see [Register an app with the Azure AD v1.0 endpoint](quickstart-v1-add-azure-ad-app.md)
* Integrate your application with the [Azure AD iOS SDK](https://github.com/AzureAD/azure-activedirectory-library-for-objc).

## Single sign-on concepts

### Identity brokers

Microsoft provides applications for every mobile platform that allow for the bridging of credentials across applications from different vendors and for enhanced features that require a single secure place from where to validate credentials. These are called **brokers**.

On iOS and Android, brokers are provided through downloadable applications that customers either install independently or pushed to the device by a company who manages some, or all, of the devices for their employees. Brokers support managing security just for some applications or the entire device based on IT admin configuration. In Windows, this functionality is provided by an account chooser built in to the operating system, known technically as the Web Authentication Broker.

### Patterns for logging in on mobile devices

Access to credentials on devices follow two basic patterns:

* Non-broker assisted logins
* Broker assisted logins

#### Non-broker assisted logins

Non-broker assisted logins are login experiences that happen inline with the application and use the local storage on the device for that application. This storage may be shared across applications but the credentials are tightly bound to the app or suite of apps using that credential. You've most likely experienced this in many mobile applications when you enter a username and password within the application itself.

These logins have the following benefits:

* User experience exists entirely within the application.
* Credentials can be shared across applications that are signed by the same certificate, providing a single sign-on experience to your suite of applications.
* Control around the experience of logging in is provided to the application before and after sign-in.

These logins have the following drawbacks:

* Users cannot experience single-sign on across all apps that use a Microsoft identity, only across those Microsoft identities that your application has configured.
* Your application cannot be used with more advanced business features such as Conditional Access or use the Intune suite of products.
* Your application can't support certificate-based authentication for business users.

Here is a representation of how the SDKs work with the shared storage of your applications to enable SSO:

```
+------------+ +------------+  +-------------+
|            | |            |  |             |
|   App 1    | |   App 2    |  |   App 3     |
|            | |            |  |             |
|            | |            |  |             |
+------------+ +------------+  +-------------+
| ADAL SDK  |  |  ADAL SDK  |  |  ADAL SDK   |
+------------+-+------------+--+-------------+
|                                            |
|            App Shared Storage              |
+--------------------------------------------+
```

#### Broker assisted logins

Broker-assisted logins are login experiences that occur within the broker application and use the storage and security of the broker to share credentials across all applications on the device that apply the identity platform. This means that your applications rely on the broker to sign users in. On iOS and Android, these brokers are provided through downloadable applications that customers either install independently or pushed to the device by a company who manages the device for their user. An example of this type of application is the Microsoft Authenticator application on iOS. In Windows this functionality is provided by an account chooser built in to the operating system, known technically as the Web Authentication Broker.

The experience varies by platform and can sometimes be disruptive to users if not managed correctly. You're probably most familiar with this pattern if you have the Facebook application installed and use Facebook Connect from another application. The identity platform uses the same pattern.

For iOS this leads to a "transition" animation where your application is sent to the background while the Microsoft Authenticator applications comes to the foreground for the user to select which account they would like to sign in with.

For Android and Windows the account chooser is displayed on top of your application, which is less disruptive to the user.

#### How the broker gets invoked

If a compatible broker is installed on the device, like the Microsoft Authenticator application, the SDKs will automatically do the work of invoking the broker for you when a user indicates they wish to log in using any account from the identity platform. This account could be a personal Microsoft Account, a work or school account, or an account that you provide and host in Azure using our B2C and B2B products.

#### How we ensure the application is valid

The need to ensure the identity of an application call the broker is crucial to the security we provide in broker assisted logins. Neither iOS nor Android enforces unique identifiers that are valid only for a given application, so malicious applications may "spoof" a legitimate application's identifier and receive the tokens meant for the legitimate application. To ensure we are always communicating with the right application at runtime, we ask the developer to provide a custom redirectURI when registering their application with Microsoft. How developers should craft this redirect URI is discussed in detail below. This custom redirectURI contains the Bundle ID of the application and is ensured to be unique to the application by the Apple App Store. When an application calls the broker, the broker asks the iOS operating system to provide it with the Bundle ID that called the broker. The broker provides this Bundle ID to Microsoft in the call to our identity system. If the Bundle ID of the application does not match the Bundle ID provided to us by the developer during registration, we will deny access to the tokens for the resource the application is requesting. This check ensures that only the application registered by the developer receives tokens.

**The developer has the choice whether the SDK calls the broker or uses the non-broker assisted flow.** However if the developer chooses not to use the broker-assisted flow they lose the benefit of using SSO credentials that the user may have already added on the device and prevents their application from being used with business features Microsoft provides its customers such as Conditional Access, Intune management capabilities, and certificate-based authentication.

These logins have the following benefits:

* User experiences SSO across all their applications no matter the vendor.
* Your application can use more advanced business features such as Conditional Access or use the Intune suite of products.
* Your application can support certificate-based authentication for business users.
* Much more secure sign-in experience as the identity of the application and the user are verified by the broker application with additional security algorithms and encryption.

These logins have the following drawbacks:

* In iOS the user is transitioned out of your application's experience while credentials are chosen.
* Loss of the ability to manage the login experience for your customers within your application.

Here is a representation of how the SDKs work with the broker applications to enable SSO:

```
+------------+ +------------+   +-------------+
|            | |            |   |             |
|   App 1    | |   App 2    |   |   Someone   |
|            | |            |   |    Else's   |
|            | |            |   |     App     |
+------------+ +------------+   +-------------+
| Azure SDK  | | Azure SDK  |   | Azure SDK   |
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

## Enabling cross-app SSO using ADAL

Here we use the ADAL iOS SDK to:

* Turn on non-broker assisted SSO for your suite of apps
* Turn on support for broker-assisted SSO

### Turning on SSO for non-broker assisted SSO

For non-broker assisted SSO across applications, the SDKs manage much of the complexity of SSO for you. This includes finding the right user in the cache and maintaining a list of logged in users for you to query.

To enable SSO across applications you own you need to do the following:

1. Ensure all your applications user the same Client ID or Application ID.
2. Ensure that all of your applications share the same signing certificate from Apple so that you can share keychains.
3. Request the same keychain entitlement for each of your applications.
4. Tell the SDKs about the shared keychain you want us to use.

#### Using the same Client ID / Application ID for all the applications in your suite of apps

In order for the identity platform to know that it's allowed to share tokens across your applications, each of your applications will need to share the same Client ID or Application ID. This is the unique identifier that was provided to you when you registered your first application in the portal.

Redirect URIs allow you to identify different apps to the Microsoft identity service if it uses the same Application ID. Each application can have multiple Redirect URIs registered in the onboarding portal. Each app in your suite will have a different redirect URI. An example of how this looks is below:

App1 Redirect URI: `x-msauth-mytestiosapp://com.myapp.mytestapp`

App2 Redirect URI: `x-msauth-mytestiosapp://com.myapp.mytestapp2`

App3 Redirect URI: `x-msauth-mytestiosapp://com.myapp.mytestapp3`

....

These are nested under the same client ID / application ID and looked up based on the redirect URI you return to us in your SDK configuration.

```
+-------------------+
|                   |
|  Client ID        |
+---------+---------+
          |
          |           +-----------------------------------+
          |           |  App 1 Redirect URI               |
          +----------^+                                   |
          |           +-----------------------------------+
          |
          |           +-----------------------------------+
          +----------^+  App 2 Redirect URI               |
          |           |                                   |
          |           +-----------------------------------+
          |
          +----------^+-----------------------------------+
                      |  App 3 Redirect URI               |
                      |                                   |
                      +-----------------------------------+

```

The format of these redirect URIs is explained below. You may use any Redirect URI unless you wish to support the broker, in which case they must look something like the above*

#### Create keychain sharing between applications

Enabling keychain sharing is beyond the scope of this document and covered by Apple in their document [Adding Capabilities](https://developer.apple.com/library/ios/documentation/IDEs/Conceptual/AppDistributionGuide/AddingCapabilities/AddingCapabilities.html). What is important is that you decide what you want your keychain to be called and add that capability across all your applications.

When you do have entitlements set up correctly you should see a file in your project directory entitled `entitlements.plist` that contains something that looks like the following:

```
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>keychain-access-groups</key>
    <array>
        <string>$(AppIdentifierPrefix)com.myapp.mytestapp</string>
        <string>$(AppIdentifierPrefix)com.myapp.mycache</string>
    </array>
</dict>
</plist>
```

Once you have the keychain entitlement enabled in each of your applications, and you are ready to use SSO, tell the odentity SDK about your keychain by using the following setting in your `ADAuthenticationSettings` with the following setting:

```
defaultKeychainSharingGroup=@"com.myapp.mycache";
```

> [!WARNING]
> When you share a keychain across your applications any application can delete users or worse delete all the tokens across your application. This is particularly disastrous if you have applications that rely on the tokens to do background work. Sharing a keychain means that you must be very careful in any and all remove operations through the identity SDKs.

That's it! The SDK will now share credentials across all your applications. The user list will also be shared across application instances.

### Turning on SSO for broker assisted SSO

The ability for an application to use any broker that is installed on the device is **turned off by default**. In order to use your application with the broker you must do some additional configuration and add some code to your application.

The steps to follow are:

1. Enable broker mode in your application code's call to the MS SDK.
2. Establish a new redirect URI and provide that to both the app and your app registration.
3. Registering a URL Scheme.
4. Add a permission to your info.plist file.

#### Step 1: Enable broker mode in your application

The ability for your application to use the broker is turned on when you create the "context" or initial setup of your Authentication object. You do this by setting your credentials type in your code:

```
/*! See the ADCredentialsType enumeration definition for details */
@propertyADCredentialsType credentialsType;
```
The `AD_CREDENTIALS_AUTO` setting will allow the SDK to try to call out to the broker, `AD_CREDENTIALS_EMBEDDED` will prevent the SDK from calling to the broker.

#### Step 2: Registering a URL Scheme

The identity platform uses URLs to invoke the broker and then return control back to your application. To finish that round trip you need a URL scheme registered for your application that the identity platform will know about. This can be in addition to any other app schemes you may have previously registered with your application.

> [!WARNING]
> We recommend making the URL scheme fairly unique to minimize the chances of another app using the same URL scheme. Apple does not enforce the uniqueness of URL schemes that are registered in the app store.

Below is an example of how this appears in your project configuration. You may also do this in XCode as well:

```
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleTypeRole</key>
        <string>Editor</string>
        <key>CFBundleURLName</key>
        <string>com.myapp.mytestapp</string>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>x-msauth-mytestiosapp</string>
        </array>
    </dict>
</array>
```

#### Step 3: Establish a new redirect URI with your URL Scheme

In order to ensure that we always return the credential tokens to the correct application, we need to make sure we call back to your application in a way that the iOS operating system can verify. The iOS operating system reports to the Microsoft broker applications the Bundle ID of the application calling it. This cannot be spoofed by a rogue application. Therefore, we leverage this along with the URI of our broker application to ensure that the tokens are returned to the correct application. We require you to establish this unique redirect URI both in your application and set as a Redirect URI in our developer portal.

Your redirect URI must be in the proper form of:

`<app-scheme>://<your.bundle.id>`

ex: *x-msauth-mytestiosapp://com.myapp.mytestapp*

This redirect URI needs to be specified in your app registration using the [Azure portal](https://portal.azure.com/). For more information on Azure AD app registration, see [Integrating with Azure Active Directory](active-directory-how-to-integrate.md).

##### Step 3a: Add a redirect URI in your app and dev portal to support certificate-based authentication

To support cert-based authentication a second "msauth"  needs to be registered in your application and the [Azure portal](https://portal.azure.com/) to handle certificate authentication if you wish to add that support in your application.

`msauth://code/<broker-redirect-uri-in-url-encoded-form>`

ex: *msauth://code/x-msauth-mytestiosapp%3A%2F%2Fcom.myapp.mytestapp*

#### Step 4: Add a configuration parameter to your app

ADAL uses –canOpenURL: to check if the broker is installed on the device. In iOS 9 on, Apple locked down what schemes an application can query for. You will need to add “msauth” to the LSApplicationQueriesSchemes section of your `info.plist file`.

```
    <key>LSApplicationQueriesSchemes</key>
    <array>
        <string>msauth</string>
    </array>

```

### You've configured SSO!

Now the identity SDK will automatically both share credentials across your applications and invoke the broker if it's present on their device.

## Next steps

* Learn about [Single sign-on SAML protocol](single-sign-on-saml-protocol.md)

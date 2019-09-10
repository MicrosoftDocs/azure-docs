---
title: Migrating Xamarin iOS applications using Microsoft Authenticator from ADAL.NET to MSAL.NET | Azure
description: Learn how to migrate Xamarin iOS applications using Microsoft Authenticator from the Azure AD Authentication Library for .NET (ADAL.NET) to the Microsoft Authentication Library for .NET (MSAL.NET)
documentationcenter: dev-center-name
author: jmprieur
manager: CelesteDG
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 09/08/2019
ms.author: jmprieur
ms.reviewer: saeeda
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn how to migrate my iOS applications using Microsoft Authenticator from ADAL.NET to MSAL.NET 
ms.collection: M365-identity-device-management
---

# Migrating iOS applications using Microsoft Authenticator from ADAL.NET to MSAL.NET

You've been using ADAL.NET and the iOS broker, and it's time to migrate to MSAL.NET [Microsoft authentication library](msal-overview.md),which, supports the broker on iOS from release 4.3 onwards. 

Where to start? This article will help you migrate your Xamarin iOS app from ADAL to MSAL.

## Prerequisites
This document assumes that you already have a Xamarin iOS app that is integrated with the iOS broker. If you don't, it would be best to move directly to MSAL.NET and begin the broker implementation there. See [this documentation](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki/Leveraging-the-broker-on-iOS#why-use-brokers-on-xamarinios-and-xamarinandroid-applications) for details on invoking the iOS broker in MSAL.NET with a new application.

## Background

### What are brokers?

Brokers are applications, provided by Microsoft, on Android and iOS ([Microsoft Authenticator](https://www.microsoft.com/account/authenticator) on iOS and Android, Intune Company Portal on Android). 

They enable:

- Single-Sign-On,
- Device identification, which is required by some [conditional access policies](../conditional-access/overview.md) (See [Device management](../conditional-access/conditions.md#device-platforms))
- Application identification verification, also required in some enterprise scenarios (See for instance [Intune mobile application management, or MAM](https://docs.microsoft.com/intune/mam-faq))

## Migrate from ADAL to MSAL

### Step 1: Enable the broker

<table>
<tr><td>Current ADAL code:</td><td>MSAL counterpart:</td></tr>
<tr><td>
In ADAL.NET, broker support was enabled on a per-authentication context basis, it's disabled by default. You had to set a `useBroker` flag to true in the `PlatformParameters` constructor to call broker:

```CSharp
public PlatformParameters(
        UIViewController callerViewController, 
        bool useBroker)
```
Also, in the platform-specific code, in this example, in the page renderer for iOS, set the 
`useBroker` 
flag to true:
```CSharp
page.BrokerParameters = new PlatformParameters(
          this, 
          true, 
          PromptBehavior.SelectAccount);
```

Then, include the parameters in the acquire token call:
```CSharp
 AuthenticationResult result =
                    await
                        AuthContext.AcquireTokenAsync(
                              Resource, 
                              ClientId, 
                              new Uri(RedirectURI), 
                              platformParameters)
                              .ConfigureAwait(false);
```

</td><td>
In MSAL.NET, broker support is enabled on a per-Public Client Application basis. It is disabled by default. To enable it, use: 

`WithBroker()` 
parameter (set to true by default) in order to call broker:

```CSharp
var app = PublicClientApplicationBuilder
                .Create(ClientId)
                .WithBroker()
                .WithReplyUri(redirectUriOnIos)
                .Build();
```
In the Acquire Token call:
```CSharp
result = await app.AcquireTokenInteractive(scopes)
             .WithParentActivityOrWindow(App.RootViewController)
             .ExecuteAsync();
```
</table>

### Step 2: Set a UIViewController()
In ADAL.NET, you passed in the UIViewController as part of the PlatformParameters (see example in Step 1). However, in MSAL.NET, to give the developer more flexibility, an object window is used, but not required in regular iOS usage. However, in order to use the broker, you'll need to set the object window in order to send and receive responses from broker. 
<table>
<tr><td>Current ADAL code:</td><td>MSAL counterpart:</td></tr>
<tr><td>
The UIViewController is passed into the PlatformParamters in the iOS specific platform.

```CSharp
page.BrokerParameters = new PlatformParameters(
          this, 
          true, 
          PromptBehavior.SelectAccount);
```
</td><td>
In MSAL.NET, you'll need to do two things to set the object window for iOS:

1) In `AppDelegate.cs`, set the `App.RootViewController` to a new `UIViewController()`. 
This assignment will ensure that there's a UIViewController with the call to the broker. If it isn't set correctly, you may get this error:
`"uiviewcontroller_required_for_ios_broker":"UIViewController is null, so MSAL.NET cannot invoke the iOS broker. See https://aka.ms/msal-net-ios-broker"`
2) On the AcquireTokenInteractive call, use the 
`.WithParentActivityOrWindow(App.RootViewController)`
 and pass in the reference to the object window you'will use.

**For example:**

In `App.cs`:
```CSharp
   public static object RootViewController { get; set; }
```
In `AppDelegate.cs`:
```CSharp
   LoadApplication(new App());
   App.RootViewController = new UIViewController();
```
In the Acquire Token call:
```CSharp
result = await app.AcquireTokenInteractive(scopes)
             .WithParentActivityOrWindow(App.RootViewController)
             .ExecuteAsync();
```

</table>

### Step 3: Update AppDelegate to handle the callback
Both ADAL and MSAL will call the broker, and broker will, in turn, call back to your application through the `OpenUrl` method of the `AppDelegate` class. More information available [here](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki/Leveraging-the-broker-on-iOS/_edit#step-two-update-appdelegate-to-handle-the-callback)

:heavy_check_mark:**There are no changes here between ADAL.NET and MSAL.NET**

### Step 4: Register a URL scheme
ADAL.NET and MSAL.NET use URLs to invoke the broker and return the broker response back to the app. Register the URL scheme in the `Info.plist` file for your app as follows:

<table>
<tr><td>Current ADAL code:</td><td>MSAL counterpart:</td></tr>
<tr><td>
The URL Scheme is unique to your app.
</td><td>
The 

`CFBundleURLSchemes` 
name must include 

`msauth.`

as a prefix, followed by your
`CFBundleURLName`

For example:
`$"msauth.(BundleId")`

```CSharp
 <key>CFBundleURLTypes</key>
    <array>
      <dict>
        <key>CFBundleTypeRole</key>
        <string>Editor</string>
        <key>CFBundleURLName</key>
        <string>com.yourcompany.xforms</string>
        <key>CFBundleURLSchemes</key>
        <array>
          <string>msauth.com.yourcompany.xforms</string>
        </array>
      </dict>
    </array>
```

> [!NOTE]
>  This URL scheme will become part of the RedirectUri used for uniquely identifying the app when receiving the response from broker

</table>

### Step 5: LSApplicationQueriesSchemes

ADAL.NET and MSAL.NET both use `-canOpenURL:` to check if the broker is installed on the device. Add the correct identifier for the iOS broker to the LSApplicationQueriesSchemes section of the info.plist file as follows: 
<table>
<tr><td>Current ADAL code:</td><td>MSAL counterpart:</td></tr>
<tr><td>
Uses 

`msauth`


```CSharp
<key>LSApplicationQueriesSchemes</key>
<array>
     <string>msauth</string>
</array>
```
</td><td>
Uses 

`msauthv2`


```CSharp
<key>LSApplicationQueriesSchemes</key>
<array>
     <string>msauthv2</string>
</array>
```
</table>

### Step 6: Register you RedirectUri in the portal

ADAL.NET and MSAL.NET both add an extra requirement on the redirectUri when targeting broker. Register the redirect URI with your application in the portal.
<table>
<tr><td>Current ADAL code:</td><td>MSAL counterpart:</td></tr>
<tr><td>

`"<app-scheme>://<your.bundle.id>"`
example: `mytestiosapp://com.mycompany.myapp`
</td><td>

`$"msauth.{BundleId}://auth"`

example:

`public static string redirectUriOnIos = "msauth.com.yourcompany.XForms://auth"; `

</table>

For more information about registering the redirectUri in the portal, see [Leveraging the broker in Xamarin.iOS applications](msal-net-use-brokers-with-xamarin-apps.md#step-7-make-sure-the-redirect-uri-is-registered-with-your-app) for more details.

## Next steps

Learn about [Xamarin iOS-specific considerations with MSAL.NET](msal-net-xamarin-ios-considerations.md). 

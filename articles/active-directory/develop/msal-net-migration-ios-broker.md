---
title: Migrate Xamarin apps using brokers to MSAL.NET 
titleSuffix: Microsoft identity platform
description: Learn how to migrate Xamarin iOS apps that use Microsoft Authenticator from ADAL.NET to MSAL.NET.
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 09/08/2019
ms.author: jmprieur
ms.reviewer: saeeda
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn how to migrate my iOS applications that use Microsoft Authenticator from ADAL.NET to MSAL.NET. 
---

# Migrate iOS applications that use Microsoft Authenticator from ADAL.NET to MSAL.NET

You've been using the Azure Active Directory Authentication Library for .NET (ADAL.NET) and the iOS broker. Now it's time to migrate to the [Microsoft Authentication Library](msal-overview.md) for .NET (MSAL.NET), which supports the broker on iOS from release 4.3 onward. 

Where should you start? This article helps you migrate your Xamarin iOS app from ADAL to MSAL.

## Prerequisites
This article assumes that you already have a Xamarin iOS app that's integrated with the iOS broker. If you don't, move directly to MSAL.NET and begin the broker implementation there. For information on how to invoke the iOS broker in MSAL.NET with a new application, see [this documentation](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki/Leveraging-the-broker-on-iOS#why-use-brokers-on-xamarinios-and-xamarinandroid-applications).

## Background

### What are brokers?

Brokers are applications provided by Microsoft on Android and iOS. (See the [Microsoft Authenticator](https://www.microsoft.com/p/microsoft-authenticator/9nblgggzmcj6) app on iOS and Android, and the Intune Company Portal app on Android.) 

They enable:

- Single sign-on.
- Device identification, which is required by some [Conditional Access policies](../conditional-access/overview.md). For more information, see [Device management](../conditional-access/concept-conditional-access-conditions.md#device-platforms).
- Application identification verification, which is also required in some enterprise scenarios. For more information, see [Intune mobile application management (MAM)](https://docs.microsoft.com/intune/mam-faq).

## Migrate from ADAL to MSAL

### Step 1: Enable the broker

<table>
<tr><td>Current ADAL code:</td><td>MSAL counterpart:</td></tr>
<tr><td>
In ADAL.NET, broker support was enabled on a per-authentication context basis. It's disabled by default. You had to set a 

`useBroker` flag to true in the `PlatformParameters` constructor to call the broker:

```csharp
public PlatformParameters(
        UIViewController callerViewController, 
        bool useBroker)
```
Also, in the platform-specific code, in this example, in the page renderer for iOS, set the 
`useBroker` 
flag to true:
```csharp
page.BrokerParameters = new PlatformParameters(
          this, 
          true, 
          PromptBehavior.SelectAccount);
```

Then, include the parameters in the acquire token call:
```csharp
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
In MSAL.NET, broker support is enabled on a per-PublicClientApplication basis. It's disabled by default. To enable it, use the 

`WithBroker()` 
parameter (set to true by default) in order to call the broker:

```csharp
var app = PublicClientApplicationBuilder
                .Create(ClientId)
                .WithBroker()
                .WithReplyUri(redirectUriOnIos)
                .Build();
```
In the acquire token call:
```csharp
result = await app.AcquireTokenInteractive(scopes)
             .WithParentActivityOrWindow(App.RootViewController)
             .ExecuteAsync();
```
</table>

### Step 2: Set a UIViewController()
In ADAL.NET, you passed in a UIViewController as part of `PlatformParameters`. (See the example in Step 1.) In MSAL.NET, to give developers more flexibility, an object window is used, but it's not required in regular iOS usage. To use the broker, set the object window in order to send and receive responses from the broker. 
<table>
<tr><td>Current ADAL code:</td><td>MSAL counterpart:</td></tr>
<tr><td>
A UIViewController is passed into 

`PlatformParameters` in the iOS-specific platform.

```csharp
page.BrokerParameters = new PlatformParameters(
          this, 
          true, 
          PromptBehavior.SelectAccount);
```
</td><td>
In MSAL.NET, you do two things to set the object window for iOS:

1. In `AppDelegate.cs`, set `App.RootViewController` to a new `UIViewController()`. 
This assignment ensures that there's a UIViewController with the call to the broker. If it isn't set correctly, you might get this error:
`"uiviewcontroller_required_for_ios_broker":"UIViewController is null, so MSAL.NET cannot invoke the iOS broker. See https://aka.ms/msal-net-ios-broker"`
1. On the AcquireTokenInteractive call, use 
`.WithParentActivityOrWindow(App.RootViewController)`,
 and pass in the reference to the object window you'll use.

**For example:**

In `App.cs`:
```csharp
   public static object RootViewController { get; set; }
```
In `AppDelegate.cs`:
```csharp
   LoadApplication(new App());
   App.RootViewController = new UIViewController();
```
In the acquire token call:
```csharp
result = await app.AcquireTokenInteractive(scopes)
             .WithParentActivityOrWindow(App.RootViewController)
             .ExecuteAsync();
```

</table>

### Step 3: Update AppDelegate to handle the callback
Both ADAL and MSAL call the broker, and the broker in turn calls back to your application through the `OpenUrl` method of the `AppDelegate` class. For more information, see [this documentation](msal-net-use-brokers-with-xamarin-apps.md#step-3-update-appdelegate-to-handle-the-callback).

There are no changes here between ADAL.NET and MSAL.NET.

### Step 4: Register a URL scheme
ADAL.NET and MSAL.NET use URLs to invoke the broker and return the broker response back to the app. Register the URL scheme in the `Info.plist` file for your app as follows:

<table>
<tr><td>Current ADAL code:</td><td>MSAL counterpart:</td></tr>
<tr><td>
The URL scheme is unique to your app.
</td><td>
The 

`CFBundleURLSchemes` 
name must include 

`msauth.`

as a prefix, followed by your
`CFBundleURLName`

For example:
`$"msauth.(BundleId")`

```csharp
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
> This URL scheme becomes part of the redirect URI that's used to uniquely identify the app when it receives the response from the broker.

</table>

### Step 5: Add the broker identifier to the LSApplicationQueriesSchemes section

ADAL.NET and MSAL.NET both use `-canOpenURL:` to check if the broker is installed on the device. Add the correct identifier for the iOS broker to the LSApplicationQueriesSchemes section of the info.plist file as follows:

<table>
<tr><td>Current ADAL code:</td><td>MSAL counterpart:</td></tr>
<tr><td>
Uses 

`msauth`


```csharp
<key>LSApplicationQueriesSchemes</key>
<array>
     <string>msauth</string>
</array>
```
</td><td>
Uses 

`msauthv2`


```csharp
<key>LSApplicationQueriesSchemes</key>
<array>
     <string>msauthv2</string>
     <string>msauthv3</string>
</array>
```
</table>

### Step 6: Register your redirect URI in the portal

ADAL.NET and MSAL.NET both add an extra requirement on the redirect URI when it targets the broker. Register the redirect URI with your application in the portal.
<table>
<tr><td>Current ADAL code:</td><td>MSAL counterpart:</td></tr>
<tr><td>

`"<app-scheme>://<your.bundle.id>"`

Example: 

`mytestiosapp://com.mycompany.myapp`
</td><td>

`$"msauth.{BundleId}://auth"`

Example:

`public static string redirectUriOnIos = "msauth.com.yourcompany.XForms://auth"; `

</table>

For more information about how to register the redirect URI in the portal, see [Leverage the broker in Xamarin.iOS applications](msal-net-use-brokers-with-xamarin-apps.md#step-8-make-sure-the-redirect-uri-is-registered-with-your-app).

## Next steps

Learn about [Xamarin iOS-specific considerations with MSAL.NET](msal-net-xamarin-ios-considerations.md). 

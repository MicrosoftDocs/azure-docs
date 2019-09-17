---
title: Use Microsoft Authenticator or Microsoft Intune company portal on Xamarin iOS and Android applications | Azure
description: Learn how to migrate Xamarin iOS applications can use Microsoft Authenticator from the Azure AD Authentication Library for .NET (ADAL.NET) to the Microsoft Authentication Library for .NET (MSAL.NET)
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
#Customer intent: As an application developer, I want to learn how to use brokers with my Xamarin iOS or Android application
ms.collection: M365-identity-device-management
---

# Use Microsoft Authenticator or Microsoft Intune company portal on Xamarin applications

On Android and iOS, brokers like Microsoft Authenticator or Microsoft Intune company portal enable (Android only):

- Single Sign On (SSO). Your users won't need to sign-in to each application.
- Device identification. By accessing the device certificate, which was created on the device when it was workplace joined.
- Application identification verification. When an application calls the broker, it passes its redirect url, and the broker verifies it.

To enable one of these features, application developers need to use the `WithBroker()` parameter when calling the `PublicClientApplicationBuilder.CreateApplication` method. `.WithBroker()` is set to true by default. Developers will also need to follow the steps below for [iOS](#brokered-authentication-for-ios) or [Android](#brokered-authentication-for-android) applications.

## Brokered authentication for iOS

Follow the steps below to enable your Xamarin.iOS app to talk with the [Microsoft Authenticator](https://itunes.apple.com/us/app/microsoft-authenticator/id983156458) app.

### Step 1: Enable broker support
Broker support is enabled on a per-PublicClientApplication basis. It's disabled by default. Use the `WithBroker()` parameter (set to true by default) when creating the PublicClientApplication through the PublicClientApplicationBuilder.

```CSharp
var app = PublicClientApplicationBuilder
                .Create(ClientId)
                .WithBroker()
                .WithReplyUri(redirectUriOnIos) // $"msauth.{Bundle.Id}://auth" (see step 6 below)
                .Build();
```

### Step 2: Update AppDelegate to handle the callback
When MSAL.NET calls the broker, the broker will, in turn, call back to your application through the `OpenUrl` method of the `AppDelegate` class. Since MSAL will wait for the response from the broker, your application needs to cooperate to call MSAL.NET back. To enable this cooperation, update the `AppDelegate.cs` file to override the below method.

```CSharp
public override bool OpenUrl(UIApplication app, NSUrl url, 
                             string sourceApplication,
                             NSObject annotation)
{
    if (AuthenticationContinuationHelper.IsBrokerResponse(sourceApplication))
    {
      AuthenticationContinuationHelper.SetBrokerContinuationEventArgs(url);
      return true;
    }
    
    else if (!AuthenticationContinuationHelper.SetAuthenticationContinuationEventArgs(url))
    {	            
         return false;	              
    }
	
    return true;	 
}	        
```

This method is invoked every time the application is launched and is used as an opportunity to process the response from the broker and complete the authentication process initiated by MSAL.NET.

### Step 3: Set a UIViewController()
Still in `AppDelegate.cs`, you'll need to set an object window. Normally, with Xamarin iOS, you don't need to set the object window, but to send and receive responses from broker, you'll need an object window. 

To do this, you'll need to do two things. 
1) In `AppDelegate.cs`, set the `App.RootViewController` to a new `UIViewController()`. This assignment will make sure there's a UIViewController with the call to the broker. If it isn't set correctly, you may get this error:
`"uiviewcontroller_required_for_ios_broker":"UIViewController is null, so MSAL.NET cannot invoke the iOS broker. See https://aka.ms/msal-net-ios-broker"`
2) On the AcquireTokenInteractive call, use the `.WithParentActivityOrWindow(App.RootViewController)` and pass in the reference to the object window you'll use.

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

### Step 4: Register a URL scheme
MSAL.NET uses URLs to invoke the broker and then return the broker response back to your app. To finish the round trip, you need to register a URL scheme for your app in the `Info.plist` file.

The `CFBundleURLSchemes` name must include `msauth.` as a prefix, followed by your `CFBundleURLName`.

`$"msauth.(BundleId)"`

**For example:**
`msauth.com.yourcompany.xforms`

> [!NOTE]
> This will become part of the RedirectUri used for uniquely identifying your app when receiving the response from the broker.

```XML
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

### Step 5: LSApplicationQueriesSchemes
MSAL uses `–canOpenURL:` to check if the broker is installed on the device. In iOS 9, Apple locked down what schemes an application can query for. 

**Add** **`msauthv2`** to the `LSApplicationQueriesSchemes` section of the `Info.plist` file.

```XML 
<key>LSApplicationQueriesSchemes</key>
    <array>
      <string>msauthv2</string>
    </array>
```

### Step 6: Register your RedirectUri in the application portal
Using the broker adds an extra requirement on your redirectUri. The redirectUri _**must**_ have the following format:
```CSharp
$"msauth.{BundleId}://auth"
```
**For example:**
```CSharp
public static string redirectUriOnIos = "msauth.com.yourcompany.XForms://auth"; 
```
**You'll notice the RedirectUri matches the `CFBundleURLSchemes` name you included in the `Info.plist` file.**

### Step 7: make sure the redirect URI is registered with your app

This Redirect URI needs to be registered on the app registration portal (https://portal.azure.com) as a valid redirect URI for your application. 

The portal has a new experience app registration portal to help you compute the brokered reply URI from the bundle ID:

1. In the app registration, choose **Authentication** and select **Try-out the new experience**.
   ![Try out the new app registration experience](media/msal-net-use-brokers-with-xamarin-apps/60799285-2d031b00-a173-11e9-9d28-ac07a7ae894a.png)

2. Select **Add platform**.
   ![Add a platform](media/msal-net-use-brokers-with-xamarin-apps/60799366-4c01ad00-a173-11e9-934f-f02e26c9429e.png)

3. When the list of platforms is supported, select **iOS**.
   ![Configure iOS](media/msal-net-use-brokers-with-xamarin-apps/60799411-60de4080-a173-11e9-9dcc-d39a45826d42.png)

4. Enter your bundle ID as requested, and then press **Register**.
   ![Enter Bundle ID](media/msal-net-use-brokers-with-xamarin-apps/60799477-7eaba580-a173-11e9-9f8b-431f5b09344e.png)

5. The redirect URI is computed for you.
   ![Copy redirect URI](media/msal-net-use-brokers-with-xamarin-apps/60799538-9e42ce00-a173-11e9-860a-015a1840fd19.png)

## Brokered Authentication for Android

The broker support isn't available for Android

## Next steps

[Universal Windows Platform-specific considerations with MSAL.NET](msal-net-uwp-considerations.md)
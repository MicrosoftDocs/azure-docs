---
title: Use brokers with Xamarin iOS & Android | Azure
titleSuffix: Microsoft identity platform
description: Learn how to setup Xamarin iOS applications that can use Microsoft Authenticator and Microsoft Authentication Library for .NET (MSAL.NET). Also learn how to migrate from Azure AD Authentication Library for .NET (ADAL.NET) to Microsoft Authentication Library for .NET (MSAL.NET).
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
#Customer intent: As an application developer, I want to learn how to use brokers with my Xamarin iOS or Android application.
---

# Use Microsoft Authenticator or Intune Company Portal on Xamarin applications

On Android and iOS, brokers like Microsoft Authenticator and the Android-specific Microsoft Intune Company Portal enable:

- **Single sign-on (SSO)**: Users don't need to sign in to each application.
- **Device identification**: The broker accesses the device certificate. This certificate is created on the device when it's joined to the workplace.
- **Application identification verification**: When an application calls the broker, it passes its redirect URL. The broker verifies the URL.

To enable one of these features, use the `WithBroker()` parameter when you call the `PublicClientApplicationBuilder.CreateApplication` method. The `.WithBroker()` parameter is set to true by default. 

Also use the instructions in the following sections to set up brokered authentication for [iOS](#brokered-authentication-for-ios) applications or [Android](#brokered-authentication-for-android) applications.

## Brokered authentication for iOS

Use the following steps to enable your Xamarin.iOS app to talk with the [Microsoft Authenticator](https://itunes.apple.com/us/app/microsoft-authenticator/id983156458) app.

### Step 1: Enable broker support
You must enable broker support for individual instances of `PublicClientApplication`. Support is disabled by default. When you create `PublicClientApplication` through `PublicClientApplicationBuilder`, use the `WithBroker()` parameter as the following example shows. The `WithBroker()` parameter is set to true by default.

```csharp
var app = PublicClientApplicationBuilder
                .Create(ClientId)
                .WithBroker()
                .WithReplyUri(redirectUriOnIos) // $"msauth.{Bundle.Id}://auth" (see step 6 below)
                .Build();
```

### Step 2: Enable keychain access

To enable keychain access, you must have a keychain access group for your application. You can use the `WithIosKeychainSecurityGroup()` API to set your keychain access group when you create your application:

```csharp
var builder = PublicClientApplicationBuilder
     .Create(ClientId)
      
     .WithIosKeychainSecurityGroup("com.microsoft.adalcache")
     .Build();
```

For more information, see [Enable keychain access](msal-net-xamarin-ios-considerations.md#enable-keychain-access).

### Step 3: Update AppDelegate to handle the callback
When Microsoft Authentication Library for .NET (MSAL.NET) calls the broker, the broker calls back to your application through the `OpenUrl` method of the `AppDelegate` class. Because MSAL waits for the broker's response, your application needs to cooperate to call MSAL.NET back. To enable this cooperation, update the `AppDelegate.cs` file to override the following method.

```csharp
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

This method is invoked every time the application is started. It's used as an opportunity to process the response from the broker and complete the authentication process that MSAL.NET started.

### Step 4: Set UIViewController()
Still in the `AppDelegate.cs` file, you need to set an object window. Normally, for Xamarin iOS you don't need to set the object window. But you do need an object window to send and receive responses from the broker. 

To set up the object window: 
1. In the `AppDelegate.cs` file, set `App.RootViewController` to a new `UIViewController()`. This assignment ensures that the call to the broker includes `UIViewController`. If this setting is assigned incorrectly, you might get this error:

      `"uiviewcontroller_required_for_ios_broker":"UIViewController is null, so MSAL.NET cannot invoke the iOS broker. See https://aka.ms/msal-net-ios-broker"`

1. On the `AcquireTokenInteractive` call, use `.WithParentActivityOrWindow(App.RootViewController)` and then pass in the reference to the object window you'll use.

    In `App.cs`:
    
    ```csharp
       public static object RootViewController { get; set; }
    ```
    
    In `AppDelegate.cs`:
    
    ```csharp
       LoadApplication(new App());
       App.RootViewController = new UIViewController();
    ```
    
    In the `AcquireToken` call:
    
    ```csharp
    result = await app.AcquireTokenInteractive(scopes)
                 .WithParentActivityOrWindow(App.RootViewController)
                 .ExecuteAsync();
    ```

### Step 5: Register a URL scheme
MSAL.NET uses URLs to invoke the broker and then return the broker response to your app. To finish the round trip, register a URL scheme for your app in the `Info.plist` file.

The `CFBundleURLSchemes` name must include `msauth.` as a prefix. Follow the prefix with `CFBundleURLName`. 

In the URL scheme, `BundleId` uniquely identifies the app: `$"msauth.(BundleId)"`. So if `BundleId` is `com.yourcompany.xforms`, then the URL scheme is `msauth.com.yourcompany.xforms`.

> [!NOTE]
> This URL scheme becomes part of the redirect URI that uniquely identifies your app when it receives the response from the broker.

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

### Step 6: Add the broker identifier to the LSApplicationQueriesSchemes section
MSAL uses `–canOpenURL:` to check whether the broker is installed on the device. In iOS 9, Apple locked down the schemes that an application can query for. 

Add `msauthv2` to the `LSApplicationQueriesSchemes` section of the `Info.plist` file, as in the following example:

```XML 
<key>LSApplicationQueriesSchemes</key>
    <array>
      <string>msauthv2</string>
      <string>msauthv3</string>
    </array>
```

### Step 7: Register your redirect URI in the application portal
When you use the broker, your redirect URI has an extra requirement. The redirect URI _must_ have the following format:
```csharp
$"msauth.{BundleId}://auth"
```

Here's an example: 

```csharp
public static string redirectUriOnIos = "msauth.com.yourcompany.XForms://auth"; 
```
Notice that the redirect URI matches the `CFBundleURLSchemes` name that you included in the `Info.plist` file.

### Step 8: Make sure the redirect URI is registered with your app

The redirect URI needs to be registered on the [app registration portal](https://portal.azure.com) as a valid redirect URI for your application. 

The app registration portal provides a new experience to help you compute the brokered reply URI from the bundle ID. 

To compute the redirect URI:

1. In the app registration portal, choose **Authentication** > **Try out the new experience**.

   ![Try out the new app registration experience](media/msal-net-use-brokers-with-xamarin-apps/60799285-2d031b00-a173-11e9-9d28-ac07a7ae894a.png)

1. Select **Add a platform**.

   ![Add a platform](media/msal-net-use-brokers-with-xamarin-apps/60799366-4c01ad00-a173-11e9-934f-f02e26c9429e.png)

1. When the list of platforms is supported, select **iOS**.

   ![Configure iOS](media/msal-net-use-brokers-with-xamarin-apps/60799411-60de4080-a173-11e9-9dcc-d39a45826d42.png)

1. Enter your bundle ID as requested, and then select **Configure**.

   ![Enter the bundle ID](media/msal-net-use-brokers-with-xamarin-apps/60799477-7eaba580-a173-11e9-9f8b-431f5b09344e.png)

When you finish the steps, the redirect URI is computed for you.

![Copy redirect URI](media/msal-net-use-brokers-with-xamarin-apps/60799538-9e42ce00-a173-11e9-860a-015a1840fd19.png)

## Brokered authentication for Android

MSAL.NET supports only the Xamarin.iOS platform. It doesn't yet support brokers for the Xamarin.Android platform.

The MSAL Android native library already supports brokered authentication. For more information, see [Brokered authentication in Android](brokered-auth.md).

## Next steps

Learn about [Considerations for using Universal Windows Platform with MSAL.NET](msal-net-uwp-considerations.md).

---
title: Configure mobile apps that call web APIs - Microsoft identity platform | Azure
description: Learn how to build a mobile app that calls web APIs (app's code configuration)
services: active-directory
documentationcenter: dev-center-name
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 07/23/2019
ms.author: jmprieur
ms.custom: aaddev 
#Customer intent: As an application developer, I want to know how to write a mobile app that calls web APIs using the Microsoft identity platform for developers.
ms.collection: M365-identity-device-management
---

# Configure a mobile app that calls web APIs

After you create your application, you'll learn how to configure the code by using the app registration parameters. Mobile applications present some complexities related to fitting into the framework that you use to build these apps.

## Find MSAL support for mobile apps

The following Microsoft Authentication Library (MSAL) types support mobile apps.

MSAL | Description
------------ | ----------
![MSAL.NET](media/sample-v2-code/logo_NET.png) <br/> MSAL.NET  | Used to develop portable applications. MSAL.NET supports the following platforms for building a mobile application: UWP, Xamarin.iOS, and Xamarin.Android.
![MSAL.iOS](media/sample-v2-code/logo_iOS.png) <br/> MSAL.iOS | Used to develop native iOS applications by using Objective-C or Swift.
![MSAL.Android](media/sample-v2-code/logo_android.png) <br/> MSAL.Android | Used to develop native Android applications in Java for Android.

## Instantiate the application

### Android

Mobile applications use the `PublicClientApplication` class. Here's how to instantiate it:

```Java
PublicClientApplication sampleApp = new PublicClientApplication(
                    this.getApplicationContext(),
                    R.raw.auth_config);
```

### iOS

Mobile applications on iOS need to instantiate the `MSALPublicClientApplication` class. To instantiate the class, use the following code. 

```objc
NSError *msalError = nil;
     
MSALPublicClientApplicationConfig *config = [[MSALPublicClientApplicationConfig alloc] initWithClientId:@"<your-client-id-here>"];    
MSALPublicClientApplication *application = [[MSALPublicClientApplication alloc] initWithConfiguration:config error:&msalError];
```

```swift
let config = MSALPublicClientApplicationConfig(clientId: "<your-client-id-here>")
if let application = try? MSALPublicClientApplication(configuration: config){ /* Use application */}
```

[Additional MSALPublicClientApplicationConfig properties](https://azuread.github.io/microsoft-authentication-library-for-objc/Classes/MSALPublicClientApplicationConfig.html#/Configuration%20options) can override the default authority, specify a redirect URI, or change the behavior of MSAL token caching. 

### Xamarin or UWP

This section explains how to instantiate the application for Xamarin.iOS, Xamarin.Android, and Universal Windows Platform (UWP) apps.

#### Instantiate the application

In Xamarin or UWP, the simplest way to instantiate the application is as follows. In this code, the `ClientId` is the GUID of your registered app.

```csharp
var app = PublicClientApplicationBuilder.Create(clientId)
                                        .Build();
```

Additional With*parameter* methods set the UI parent, override the default authority, specify a client name and version for telemetry, specify a redirect URI, and specify the HTTP factory to use. The HTTP factory might be used, for instance, to handle proxies and to specify telemetry and logging. 

The following sections provide more information about instantiating the application.

##### Specify the parent UI, window, or activity

On Android, you need to pass the parent activity before you do the interactive authentication. On iOS, when you use a broker, you need to pass-in ViewController. In the same way on UWP, you might want to pass-in the parent window. You pass it in when you acquire the token. But when you're creating the app, you can also specify a callback as a delegate that returns UIParent.

```csharp
IPublicClientApplication application = PublicClientApplicationBuilder.Create(clientId)
  .ParentActivityOrWindowFunc(() => parentUi)
  .Build();
```

On Android, we recommend that you use [`CurrentActivityPlugin`](https://github.com/jamesmontemagno/CurrentActivityPlugin). The resulting `PublicClientApplication` builder code looks like this:

```csharp
// Requires MSAL.NET 4.2 or above
var pca = PublicClientApplicationBuilder
  .Create("<your-client-id-here>")
  .WithParentActivityOrWindow(() => CrossCurrentActivity.Current)
  .Build();
```

##### Find more app-building parameters

For a list of all modifiers that are available on `PublicClientApplicationBuilder`, see the [Methods list](https://docs.microsoft.com/dotnet/api/microsoft.identity.client.publicclientapplicationbuilder#methods).

For a description of all options that are exposed in `PublicClientApplicationOptions`, see the[reference documentation](https://docs.microsoft.com/dotnet/api/microsoft.identity.client.publicclientapplicationoptions).

## Considerations for Xamarin iOS

If you use MSAL.NET on Xamarin iOS, do the following tasks.

* [Override and implement the `OpenUrl` function in `AppDelegate`](msal-net-xamarin-ios-considerations.md#implement-openurl)
* [Enable keychain groups](msal-net-xamarin-ios-considerations.md#enable-keychain-access)
* [Enable token cache sharing](msal-net-xamarin-ios-considerations.md#enable-token-cache-sharing-across-ios-applications)
* [Enable keychain access](msal-net-xamarin-ios-considerations.md#enable-keychain-access)

For more information, see [Xamarin iOS considerations](msal-net-xamarin-ios-considerations.md).

## Considerations for MSAL for iOS and macOS

Similar tasks are necessary when you use MSAL for iOS and macOS:

1. [Implement the `openURL` callback](#brokered-authentication-for-msal-for-ios-and-macos)
2. [Enable keychain access groups](howto-v2-keychain-objc.md)
3. [Customize browsers and WebViews](customize-webviews.md)

## Considerations for Xamarin Android

Here are Xamarin Android specifics:

- [Ensuring control goes back to MSAL once the interactive portion of the authentication flow ends](msal-net-xamarin-android-considerations.md#ensuring-control-goes-back-to-msal-once-the-interactive-portion-of-the-authentication-flow-ends)
- [Update the Android manifest](msal-net-xamarin-android-considerations.md#update-the-android-manifest)
- [Use the embedded web view (optional)](msal-net-xamarin-android-considerations.md#use-the-embedded-web-view-optional)
- [Troubleshooting](msal-net-xamarin-android-considerations.md#troubleshooting)

Details are provided in [Xamarin Android considerations](msal-net-xamarin-android-considerations.md)

Finally, there are some specificities to know about the browsers on Android. They are explained in [Xamarin Android-specific considerations with MSAL.NET](msal-net-system-browser-android-considerations.md)

#### Considerations for UWP

On UWP, you can use corporate networks. For additional information about using the MSAL library with UWP, see [Universal Windows Platform-specific considerations with MSAL.NET](msal-net-uwp-considerations.md).

## Configure the application to use the broker

### Why use brokers in iOS and Android applications?

On Android and iOS, brokers enable:

- Single Sign On (SSO) when device is registered with AAD. Your users won't need to sign-in to each application.
- Device identification. Enables Azure AD device related Conditional Access policies, by accessing the device certificate that was created on the device when it was workplace joined.
- Application identification verification. When an application calls the broker, it passes its redirect url, and the broker verifies it.

### Enable the broker on Xamarin

To enable one of these features, use the `WithBroker()` parameter when calling the `PublicClientApplicationBuilder.CreateApplication` method. `.WithBroker()` is set to true by default. Follow the steps below for [Xamarin.iOS](#brokered-authentication-for-xamarinios).

### Enable the broker for MSAL for Android

See [Brokered auth in Android](brokered-auth.md) for information about enabling a broker on Android. 

### Enable the broker for MSAL for iOS and macOS

Brokered authentication is enabled by default for AAD scenarios in MSAL for iOS and macOS. Follow the steps below to configure your application for brokered authentication support for [MSAL for iOS and macOS](#brokered-authentication-for-msal-for-ios-and-macos). Note that some steps are different between [MSAL for Xamarin.iOS](#brokered-authentication-for-xamarinios) and [MSAL for iOS and macOS](#brokered-authentication-for-msal-for-ios-and-macos).

### Brokered authentication for Xamarin.iOS

Follow the steps in this section to enable your Xamarin.iOS app to talk with the [Microsoft Authenticator](https://itunes.apple.com/us/app/microsoft-authenticator/id983156458) app.

#### Step 1: Enable broker support

Broker support is enabled on a per-`PublicClientApplication` basis. It's disabled by default. You must use the `WithBroker()` parameter (set to true by default) when creating the `PublicClientApplication` through the `PublicClientApplicationBuilder`.

```csharp
var app = PublicClientApplicationBuilder
                .Create(ClientId)
                .WithBroker()
                .WithReplyUri(redirectUriOnIos) // $"msauth.{Bundle.Id}://auth" (see step 6 below)
                .Build();
```

#### Step 2: Update AppDelegate to handle the callback

When MSAL.NET calls the broker, the broker will, in turn, call back to your application through the `AppDelegate.OpenUrl` method. Since MSAL will wait for the response from the broker, your application needs to cooperate to call MSAL.NET back. You do this by updating the `AppDelegate.cs` file to override the below method.

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

This method is invoked every time the application is launched, and is used as an opportunity to process the response from the broker and complete the authentication process initiated by MSAL.NET.

#### Step 3: Set a UIViewController()

With Xamarin iOS, you don't normally need to set an object window, but in this case you do in order to send and receive responses from a broker. Still in `AppDelegate.cs`, set a ViewController.

Do the following to set the object window:

1) In `AppDelegate.cs`, set the `App.RootViewController` to a new `UIViewController()`. This will make sure there's a `UIViewController` with the call to the broker. If it isn't set correctly, you may get this error:
`"uiviewcontroller_required_for_ios_broker":"UIViewController is null, so MSAL.NET cannot invoke the iOS broker. See https://aka.ms/msal-net-ios-broker"`
2) On the AcquireTokenInteractive call, use the `.WithParentActivityOrWindow(App.RootViewController)` and pass in the reference to the object window you'll use.

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
In the Acquire Token call:
```csharp
result = await app.AcquireTokenInteractive(scopes)
             .WithParentActivityOrWindow(App.RootViewController)
             .ExecuteAsync();
```

#### Step 4: Register a URL scheme

MSAL.NET uses URLs to invoke the broker and then return the broker response back to your app. To finish the round trip, you need to register a URL scheme for your app in the `Info.plist` file.

Prefix the `CFBundleURLSchemes` with `msauth`. Then add `CFBundleURLName` to the end.

`$"msauth.(BundleId)"`

**For example:**
`msauth.com.yourcompany.xforms`

> [!NOTE]
> This URL scheme will become part of the RedirectUri used for uniquely identifying your app when receiving the response from the broker.

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

#### Step 5: LSApplicationQueriesSchemes

MSAL uses `–canOpenURL:` to check if the broker is installed on the device. In iOS 9, Apple locked down what schemes an application can query for.

**Add** **`msauthv2`** to the `LSApplicationQueriesSchemes` section of the `Info.plist` file.

```XML 
<key>LSApplicationQueriesSchemes</key>
    <array>
      <string>msauthv2</string>
    </array>
```

### Broker authentication for MSAL for iOS and macOS

Brokered authentication is enabled by default for AAD scenarios.

#### Step 1: Update AppDelegate to handle the callback

When MSAL for iOS and macOS calls the broker, the broker will, in turn, call back to your application through the `openURL`  method. Since MSAL will wait for the response from the broker, your application needs to cooperate to call MSAL back. You do this by updating the `AppDelegate.m` file to override the below method.

Objective-C:

```objc
- (BOOL)application:(UIApplication *)app
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
    return [MSALPublicClientApplication handleMSALResponse:url 
                                         sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey]];
}
```

Swift:

```swift
    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
        
        guard let sourceApplication = options[UIApplication.OpenURLOptionsKey.sourceApplication] as? String else {
            return false
        }
        
        return MSALPublicClientApplication.handleMSALResponse(url, sourceApplication: sourceApplication)
    }
```

Note, that if you adopted UISceneDelegate on iOS 13+, MSAL callback needs to be placed into the `scene:openURLContexts:` of UISceneDelegate instead (see [Apple documentation](https://developer.apple.com/documentation/uikit/uiscenedelegate/3238059-scene?language=objc)). MSAL `handleMSALResponse:sourceApplication:` must be called only once for each URL.

#### Step 2: Register a URL scheme

MSAL for iOS and macOS uses URLs to invoke the broker and then return the broker response back to your app. To finish the round trip, you need to register a URL scheme for your app in the `Info.plist` file.

Prefix your custom URL scheme with `msauth`. Then add **your Bundle Identifier** to the end.

`msauth.(BundleId)`

**For example:**
`msauth.com.yourcompany.xforms`

> [!NOTE]
> This URL scheme will become part of the RedirectUri used for uniquely identifying your app when receiving the response from the broker. Make sure that the RedirectUri in the format of `msauth.(BundleId)://auth` is registered for your application in the [Azure Portal](https://portal.azure.com).

```XML
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>msauth.[BUNDLE_ID]</string>
        </array>
    </dict>
</array>
```

#### Step 3: LSApplicationQueriesSchemes

**Add `LSApplicationQueriesSchemes`** to allow making call to Microsoft Authenticator if installed.
Note that "msauthv3" scheme is needed when compiling your app with Xcode 11 and later. 

```XML 
<key>LSApplicationQueriesSchemes</key>
<array>
  <string>msauthv2</string>
  <string>msauthv3</string>
</array>
```

### Broker authentication for Xamarin.Android

MSAL.NET doesn't support brokers for Android.

## Next steps

> [!div class="nextstepaction"]
> [Acquiring a token](scenario-mobile-acquire-token.md)

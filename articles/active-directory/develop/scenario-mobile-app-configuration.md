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
---

# Mobile app that calls web APIs - code configuration

Once you've created your application, you'll learn how to configure the code using the app registration parameters. Mobile applications also have some complex specifics, which have to do with fitting into the framework used to build these apps

## MSAL libraries supporting mobile apps

The Microsoft libraries supporting mobile apps are:

  MSAL library | Description
  ------------ | ----------
  ![MSAL.NET](media/sample-v2-code/logo_NET.png) <br/> MSAL.NET  | To develop portable applications. MSAL.NET supported platforms to build a mobile application are UWP, Xamarin.iOS, and Xamarin.Android.
  ![MSAL.iOS](media/sample-v2-code/logo_iOS.png) <br/> MSAL.iOS | To develop native iOS applications with Objective-C or Swift
  ![MSAL.Android](media/sample-v2-code/logo_android.png) <br/> MSAL.Android | To develop native Android applications in Java for Android

## Instantiating the application

### Android

Mobile applications use the `PublicClientApplication` class. Here is how to instantiate it:

```Java
PublicClientApplication sampleApp = new PublicClientApplication(
                    this.getApplicationContext(),
                    R.raw.auth_config);
```

### iOS

Mobile applications on iOS need to instantiate the `MSALPublicClientApplication` class.

Objective-C:

```objc
NSError *msalError = nil;
     
MSALPublicClientApplicationConfig *config = [[MSALPublicClientApplicationConfig alloc] initWithClientId:@"<your-client-id-here>"];    
MSALPublicClientApplication *application = [[MSALPublicClientApplication alloc] initWithConfiguration:config error:&msalError];
```

Swift:
```swift
let config = MSALPublicClientApplicationConfig(clientId: "<your-client-id-here>")
if let application = try? MSALPublicClientApplication(configuration: config){ /* Use application */}
```

There are [additional MSALPublicClientApplicationConfig properties](https://azuread.github.io/microsoft-authentication-library-for-objc/Classes/MSALPublicClientApplicationConfig.html#/Configuration%20options) which can override the default authority, specify a redirect URI or change MSAL token caching behavior. 

### Xamarin or UWP

The following paragraph explains how to instantiate the application for Xamarin.iOS, Xamarin.Android, and UWP apps.

#### Instantiating the application

In Xamarin, or UWP, the simplest way to instantiate the application is as follows, where the `ClientId` is the Guid of your registered app.

```csharp
var app = PublicClientApplicationBuilder.Create(clientId)
                                        .Build();
```

There are additional With*parameter* methods which set the UI parent, override the default authority, specify a client name and version (for telemetry), specify a redirect URI, Specify the Http factory to use (for instance to handle proxies, specify telemetry and logging) . This is the topic of the following paragraphs.

##### Specifying the parent UI/Window/Activity

On Android, you need to pass the parent activity before you do the interactive authentication. On iOS, when using a broker, you need to pass-in the ViewController. In the same way on UWP, you might want to pass-in the parent window. This is possible when you acquire the token, but it's also possible to specify a callback at app creation time a delegate returning the UIParent.

```csharp
IPublicClientApplication application = PublicClientApplicationBuilder.Create(clientId)
  .ParentActivityOrWindowFunc(() => parentUi)
  .Build();
```

On Android, we recommend you use the `CurrentActivityPlugin` [here](https://github.com/jamesmontemagno/CurrentActivityPlugin).  Then your `PublicClientApplication` builder code would look like this:

```csharp
// Requires MSAL.NET 4.2 or above
var pca = PublicClientApplicationBuilder
  .Create("<your-client-id-here>")
  .WithParentActivityOrWindow(() => CrossCurrentActivity.Current)
  .Build();
```

##### More app building parameters

- For the list of all modifiers available on `PublicClientApplicationBuilder`, see the reference documentation [PublicClientApplicationBuilder](https://docs.microsoft.com/dotnet/api/microsoft.identity.client.publicclientapplicationbuilder#methods)
- For the description of all the options exposed in `PublicClientApplicationOptions` see [PublicClientApplicationOptions](https://docs.microsoft.com/dotnet/api/microsoft.identity.client.publicclientapplicationoptions), in the reference documentation

## Xamarin iOS specific considerations

On Xamarin iOS, there are several considerations that you must take into account when using MSAL.NET:

1. [Override and implement the `OpenUrl` function in the `AppDelegate`](msal-net-xamarin-ios-considerations.md#implement-openurl)
1. [Enable Keychain groups](msal-net-xamarin-ios-considerations.md#enable-keychain-access)
1. [Enable token cache sharing](msal-net-xamarin-ios-considerations.md#enable-token-cache-sharing-across-ios-applications)
1. [Enable Keychain access](msal-net-xamarin-ios-considerations.md#enable-keychain-access)

Details are provided in [Xamarin iOS considerations](msal-net-xamarin-ios-considerations.md)

## MSAL for iOS and macOS specific considerations

Similar considerations apply when using MSAL for iOS and macOS:

1. [Implement the `openURL` callback](#brokered-authentication-for-msal-for-ios-and-macos)
2. [Enable keychain access groups](howto-v2-keychain-objc.md)
3. [Customize browsers and WebViews](customize-webviews.md)

## Xamarin Android specific considerations

Here are Xamarin Android specifics:

- [Ensuring control goes back to MSAL once the interactive portion of the authentication flow ends](msal-net-xamarin-android-considerations.md#ensuring-control-goes-back-to-msal-once-the-interactive-portion-of-the-authentication-flow-ends)
- [Update the Android manifest](msal-net-xamarin-android-considerations.md#update-the-android-manifest)
- [Use the embedded web view (optional)](msal-net-xamarin-android-considerations.md#use-the-embedded-web-view-optional)
- [Troubleshooting](msal-net-xamarin-android-considerations.md#troubleshooting)

Details are provided in [Xamarin Android considerations](msal-net-xamarin-android-considerations.md)

Finally, there are some specificities to know about the browsers on Android. They are explained in [Xamarin Android-specific considerations with MSAL.NET](msal-net-system-browser-android-considerations.md)

#### UWP specific considerations

On UWP, you can use corporate networks. For additional information about using the MSAL library with UWP, see [Universal Windows Platform-specific considerations with MSAL.NET](msal-net-uwp-considerations.md).

## Configuring the application to use the broker

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

### Brokered Authentication for Xamarin.iOS

Follow the steps below to enable your Xamarin.iOS app to talk with the [Microsoft Authenticator](https://itunes.apple.com/us/app/microsoft-authenticator/id983156458) app.

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

### Brokered Authentication for MSAL for iOS and macOS

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

### Brokered authentication for Xamarin.Android

MSAL.NET does not yet support brokers for Android.

## Next steps

> [!div class="nextstepaction"]
> [Acquiring a token](scenario-mobile-acquire-token.md)

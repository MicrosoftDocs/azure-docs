---
title: Configure mobile apps that call web APIs
description: Learn how to configure your mobile app's code to call a web API
services: active-directory
author: henrymbuguakiarie
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: how-to
ms.workload: identity
ms.date: 06/16/2020
ms.author: henrymbugua
ms.reviewer: jmprieur
ms.custom: aaddev
#Customer intent: As an application developer, I want to know how to write a mobile app that calls web APIs using the Microsoft identity platform.
---

# Configure a mobile app that calls web APIs

After you create your application, you'll learn how to configure the code by using the app registration parameters. Mobile applications present some complexities related to fitting into their creation framework.

## Microsoft libraries supporting mobile apps

The following Microsoft libraries support mobile apps:

[!INCLUDE [develop-libraries-mobile](./includes/libraries/libraries-mobile.md)]

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

This section explains how to instantiate the application for Xamarin.iOS, Xamarin.Android, and UWP apps.

#### Instantiate the application

In Xamarin or UWP, the simplest way to instantiate the application is by using the following code. In this code, `ClientId` is the GUID of your registered app.

```csharp
var app = PublicClientApplicationBuilder.Create(clientId)
                                        .Build();
```

Additional `With<Parameter>` methods set the UI parent, override the default authority, specify a client name and version for telemetry, specify a redirect URI, and specify the HTTP factory to use. The HTTP factory might be used, for instance, to handle proxies and to specify telemetry and logging.

The following sections provide more information about instantiating the application.

##### Specify the parent UI, window, or activity

On Android, pass the parent activity before you do the interactive authentication. On iOS, when you use a broker, pass-in `ViewController`. In the same way on UWP, you might want to pass-in the parent window. You pass it in when you acquire the token. But when you're creating the app, you can also specify a callback as a delegate that returns `UIParent`.

```csharp
IPublicClientApplication application = PublicClientApplicationBuilder.Create(clientId)
  .ParentActivityOrWindowFunc(() => parentUi)
  .Build();
```

On Android, we recommend that you use [`CurrentActivityPlugin`](https://github.com/jamesmontemagno/CurrentActivityPlugin). The resulting `PublicClientApplication` builder code looks like this example:

```csharp
// Requires MSAL.NET 4.2 or above
var pca = PublicClientApplicationBuilder
  .Create("<your-client-id-here>")
  .WithParentActivityOrWindow(() => CrossCurrentActivity.Current)
  .Build();
```

##### Find more app-building parameters

For a list of all methods that are available on `PublicClientApplicationBuilder`, see the [Methods list](/dotnet/api/microsoft.identity.client.publicclientapplicationbuilder#methods).

For a description of all options that are exposed in `PublicClientApplicationOptions`, see the [reference documentation](/dotnet/api/microsoft.identity.client.publicclientapplicationoptions).

## Tasks for Xamarin iOS

If you use MSAL.NET on Xamarin iOS, do the following tasks.

* [Override and implement the `OpenUrl` function in `AppDelegate`](msal-net-xamarin-ios-considerations.md#implement-openurl)
* [Enable keychain groups](msal-net-xamarin-ios-considerations.md#enable-keychain-access)
* [Enable token cache sharing](msal-net-xamarin-ios-considerations.md#enable-token-cache-sharing-across-ios-applications)
* [Enable keychain access](msal-net-xamarin-ios-considerations.md#enable-keychain-access)

For more information, see [Xamarin iOS considerations](msal-net-xamarin-ios-considerations.md).

## Tasks for MSAL for iOS and macOS

These tasks are necessary when you use MSAL for iOS and macOS:

* [Implement the `openURL` callback](#brokered-authentication-for-msal-for-ios-and-macos)
* [Enable keychain access groups](howto-v2-keychain-objc.md)
* [Customize browsers and WebViews](customize-webviews.md)

## Tasks for Xamarin.Android

If you use Xamarin.Android, do the following tasks:

- [Ensure control goes back to MSAL after the interactive portion of the authentication flow ends](msal-net-xamarin-android-considerations.md#ensure-that-control-returns-to-msal)
- [Update the Android manifest](msal-net-xamarin-android-considerations.md#update-the-android-manifest-for-system-webview-support)
- [Use the embedded web view (optional)](msal-net-xamarin-android-considerations.md#use-the-embedded-web-view-optional)
- [Troubleshoot as necessary](msal-net-xamarin-android-considerations.md#troubleshooting)

For more information, see [Xamarin.Android considerations](msal-net-xamarin-android-considerations.md).

For considerations about the browsers on Android, see [Xamarin.Android-specific considerations with MSAL.NET](msal-net-system-browser-android-considerations.md).

#### Tasks for UWP

On UWP, you can use corporate networks. The following sections explain the tasks that you should complete in the corporate scenario.

For more information, see [UWP-specific considerations with MSAL.NET](/entra/msal/dotnet/acquiring-tokens/desktop-mobile/uwp).

## Configure the application to use the broker

On Android and iOS, brokers enable:

- **Single sign-on (SSO)**: You can use SSO for devices that are registered with Microsoft Entra ID. When you use SSO, your users don't need to sign in to each application.
- **Device identification**: This setting enables conditional-access policies that are related to Microsoft Entra devices. The authentication process uses the device certificate that was created when the device was joined to the workplace.
- **Application identification verification**: When an application calls the broker, it passes its redirect URL. Then the broker verifies it.

### Enable the broker on Xamarin

To enable the broker on Xamarin, use the `WithBroker()` parameter when you call the `PublicClientApplicationBuilder.CreateApplication` method. By default, `.WithBroker()` is set to true.

To enable brokered authentication for Xamarin.iOS, follow the steps in the [Xamarin.iOS section](#enable-brokered-authentication-for-xamarin-ios) in this article.

### Enable the broker for MSAL for Android

For information about enabling a broker on Android, see [Brokered authentication on Android](msal-android-single-sign-on.md).

### Enable the broker for MSAL for iOS and macOS

Brokered authentication is enabled by default for Microsoft Entra scenarios in MSAL for iOS and macOS.

The following sections provide instructions to configure your application for brokered authentication support for either MSAL for Xamarin.iOS or MSAL for iOS and macOS. In the two sets of instructions, some of the steps differ.

### Enable brokered authentication for Xamarin iOS

Follow the steps in this section to enable your Xamarin.iOS app to talk with the [Microsoft Authenticator](https://itunes.apple.com/us/app/microsoft-authenticator/id983156458) app.

#### Step 1: Enable broker support

Broker support is disabled by default. You enable it for an individual `PublicClientApplication` class. Use the `WithBroker()` parameter when you create the `PublicClientApplication` class through `PublicClientApplicationBuilder`. The `WithBroker()` parameter is set to true by default.

```csharp
var app = PublicClientApplicationBuilder
                .Create(ClientId)
                .WithBroker()
                .WithReplyUri(redirectUriOnIos) // $"msauth.{Bundle.Id}://auth" (see step 6 below)
                .Build();
```

#### Step 2: Update AppDelegate to handle the callback

When MSAL.NET calls the broker, the broker then calls back to your application. It calls back by using the `AppDelegate.OpenUrl` method. Because MSAL waits for the response from the broker, your application needs to cooperate to call MSAL.NET back. You set up this behavior by updating the `AppDelegate.cs` file to override the method, as the following code shows.

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

This method is invoked every time the application is launched. It's an opportunity to process the response from the broker and to complete the authentication process that MSAL.NET started.

#### Step 3: Set a UIViewController()

For Xamarin iOS, you don't normally need to set an object window. But in this case you should set it so that you can send and receive responses from a broker. To set an object window, in `AppDelegate.cs`, you set a `ViewController`.

To set the object window, follow these steps:

1. In `AppDelegate.cs`, set the `App.RootViewController` to a new `UIViewController()`. This setting ensures that the call to the broker includes `UIViewController`. If it isn't set correctly, you might get this error:

    `"uiviewcontroller_required_for_ios_broker":"UIViewController is null, so MSAL.NET cannot invoke the iOS broker. See https://aka.ms/msal-net-ios-broker."`

1. On the `AcquireTokenInteractive` call, use `.WithParentActivityOrWindow(App.RootViewController)`. Pass in the reference to the object window that you'll use. Here's an example:

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

#### Step 4: Register a URL scheme

MSAL.NET uses URLs to invoke the broker and then return the broker response back to your app. To finish the round trip, register your app's URL scheme in the `Info.plist` file.

To register your app's URL scheme, follow these steps:

1. Prefix `CFBundleURLSchemes` with `msauth`.
1. Add `CFBundleURLName` to the end. Follow this pattern:

   `$"msauth.(BundleId)"`

   Here, `BundleId` uniquely identifies your device. For example, if `BundleId` is `yourcompany.xforms`, your URL scheme is `msauth.com.yourcompany.xforms`.

      This URL scheme will become part of the redirect URI that uniquely identifies your app when it receives the broker's response.

   ```xml
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

#### Step 5: Add to the LSApplicationQueriesSchemes section

MSAL uses `–canOpenURL:` to check if the broker is installed on the device. In iOS 9, Apple locked down the schemes that an application can query for.

Add `msauthv2` to the `LSApplicationQueriesSchemes` section of the `Info.plist` file, as in the following code example:

```xml
<key>LSApplicationQueriesSchemes</key>
    <array>
      <string>msauthv2</string>
    </array>
```

### Brokered authentication for MSAL for iOS and macOS

Brokered authentication is enabled by default for Microsoft Entra scenarios.

#### Step 1: Update AppDelegate to handle the callback

When MSAL for iOS and macOS calls the broker, the broker calls back to your application by using the `openURL` method. Because MSAL waits for the response from the broker, your application needs to cooperate to call back MSAL. Set up this capability by updating the `AppDelegate.m` file to override the method, as the following code examples show.

```objc
- (BOOL)application:(UIApplication *)app
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
    return [MSALPublicClientApplication handleMSALResponse:url
                                         sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey]];
}
```

```swift
    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {

        guard let sourceApplication = options[UIApplication.OpenURLOptionsKey.sourceApplication] as? String else {
            return false
        }

        return MSALPublicClientApplication.handleMSALResponse(url, sourceApplication: sourceApplication)
    }
```

If you adopted `UISceneDelegate` on iOS 13 or later, then place the MSAL callback into the `scene:openURLContexts:` of `UISceneDelegate` instead. MSAL `handleMSALResponse:sourceApplication:` must be called only once for each URL.

For more information, see the [Apple documentation](https://developer.apple.com/documentation/uikit/uiscenedelegate/3238059-scene?language=objc).

#### Step 2: Register a URL scheme

MSAL for iOS and macOS uses URLs to invoke the broker and then return the broker response to your app. To finish the round trip, register a URL scheme for your app in the `Info.plist` file.

To register a scheme for your app:

1. Prefix your custom URL scheme with `msauth`.

1. Add your bundle identifier to the end of your scheme. Follow this pattern:

   `$"msauth.(BundleId)"`

   Here, `BundleId` uniquely identifies your device. For example, if `BundleId` is `yourcompany.xforms`, your URL scheme is `msauth.com.yourcompany.xforms`.

    This URL scheme will become part of the redirect URI that uniquely identifies your app when it receives the broker's response. Make sure that the redirect URI in the format `msauth.(BundleId)://auth` is registered for your application.

   ```xml
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

#### Step 3: Add LSApplicationQueriesSchemes

Add `LSApplicationQueriesSchemes` to allow calls to the Microsoft Authenticator app, if it's installed.

> [!NOTE]
> The `msauthv3` scheme is needed when your app is compiled by using Xcode 11 and later.

Here's an example of how to add `LSApplicationQueriesSchemes`:

```xml
<key>LSApplicationQueriesSchemes</key>
<array>
  <string>msauthv2</string>
  <string>msauthv3</string>
</array>
```

### Brokered authentication for Xamarin.Android

For information about enabling a broker on Android, see [Brokered authentication on Xamarin.Android](msal-net-use-brokers-with-xamarin-apps.md#brokered-authentication-for-android).

## Next steps

Move on to the next article in this scenario, 
[Acquiring a token](scenario-mobile-acquire-token.md).

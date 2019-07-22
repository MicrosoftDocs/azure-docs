---
title: Mobile app that calls web APIs (code configuration) - Microsoft identity platform
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
ms.date: 05/07/2019
ms.author: jmprieur
ms.custom: aaddev 
#Customer intent: As an application developer, I want to know how to write a mobile app that calls web APIs using the Microsoft identity platform for developers.
ms.collection: M365-identity-device-management
---

# Mobile app that calls web APIs - code configuration

Now that you've created your application, you'll learn how to configure the code with the application's coordinates. Mobile applications also have some complex specifics, which have to do with fitting into the framework used to build these apps

## MSAL Libraries supporting mobile apps

The Microsoft libraries supporting mobile apps are:

  MSAL library | Description
  ------------ | ----------
  ![MSAL.NET](media/sample-v2-code/logo_NET.png) <br/> MSAL.NET  | To develop portable applications. MSAL.NET supported platforms to build a mobile application are UWP, Xamarin.iOS, and Xamarin.Android.
  ![MSAL.iOS](media/sample-v2-code/logo_iOS.png) <br/> MSAL.iOS | To develop native iOS applications with objective C or Swift
  ![MSAL.Android](media/sample-v2-code/logo_android.png) <br/> MSAL.Android | To develop native Android applications in Java for Android

## Configuring the application

Mobile applications use the MSAL's Public client application class. Here is how to instantiate it:

### Android

```Java
PublicClientApplication sampleApp = new PublicClientApplication(
                    this.getApplicationContext(),
                    R.raw.auth_config);
```

### iOS

```swift
// Initialize the app.
guard let authorityURL = URL(string: kAuthority) else {
    self.loggingText.text = "Unable to create authority URL"
    return
}
let authority = try MSALAADAuthority(url: authorityURL)
let msalConfiguration = MSALPublicClientApplicationConfig(clientId: kClientID, redirectUri: nil, authority: authority)
self.applicationContext = try MSALPublicClientApplication(configuration: msalConfiguration)
}
```

### Xamarin or UWP

#### Instantiating the application

##### The simple way
In Xamarin, or UWP, the application is instantiated as follows:

```CSharp
var app = PublicClientApplicationBuilder.Create(clientId)
                                        .Build();
```

##### Specifying the parent UI/Window/Activity

On Android, you need to pass the parent activity before you do the interactive authentication. On iOS, when using a broker, you need to pass-in the ViewController. In the same way on UWP, you might want to pass-in the parent window. This is possible when you acquire the token, but it's also possible to specify a callback at app creation time a delegate returning the UIParent.

```CSharp
IPublicClientApplication application = PublicClientApplicationBuilder.Create(clientId)
  .ParentActivityOrWindowFunc(() => parentUi)
  .Build();
```

On Android, a recommendation is to use the CurrentActivityPlugin [here](https://github.com/jamesmontemagno/CurrentActivityPlugin).  Then your PublicClientApplication builder code would look like this:

```CSharp
// Requires MSAL.NET 4.2 or above
var pca = PublicClientApplicationBuilder
  .Create("<your-client-id-here>")
  .WithParentActivityOrWindow(() => CrossCurrentActivity.Current)
  .Build();
```

##### More parameters

- For the list of all modifiers available on `PublicClientApplicationBuilder`, see the reference documentation [PublicClientApplicationBuilder](https://docs.microsoft.com/dotnet/api/microsoft.identity.client.publicclientapplicationbuilder#methods)
- For the description of all the options exposed in `PublicClientApplicationOptions` see [PublicClientApplicationOptions](https://docs.microsoft.com/dotnet/api/microsoft.identity.client.publicclientapplicationoptions), in the reference documentation

#### Other Xamarin iOS specific considerations

On Xamarin iOS, there are several considerations that you must take into account when using MSAL.NET. Details are provided in [Xamarin iOS considerations](msal-net-xamarin-ios-considerations.md):

1. [Override and implement the `OpenUrl` function in the `AppDelegate`](msal-net-xamarin-ios-considerations.md#implement-openurl)
1. [Enable Keychain groups](msal-net-xamarin-ios-considerations.md#enable-keychain-groups)
1. [Enable token cache sharing](msal-net-xamarin-ios-considerations.md#enable-token-cache-sharing-across-ios-applications)
1. [Enable Keychain access](msal-net-xamarin-ios-considerations.md#enable-keychain-access)

#### Other Xamarin Android specific considerations

Like for iOS, Xamarin has specifics. Details are provided in [Xamarin Android considerations](#msal-net-xamarin-android-considerations) 

- [Ensuring control goes back to MSAL once the interactive portion of the authentication flow ends](msal-net-xamarin-android-considerations.md#ensuring-control-goes-back-to-msal-once-the-interactive-portion-of-the-authentication-flow-ends)
- [Update the Android manifest](msal-net-xamarin-android-considerations.md#update-the-android-manifest)
- [Use the embedded web view (optional)](msal-net-xamarin-android-considerations.md#use-the-embedded-web-view-optional)
- [Troubleshooting](msal-net-xamarin-android-considerations.md#troubleshooting)

## Configuring the application to use the broker

### Why use brokers on Xamarin.iOS and Xamarin.Android applications?

On Android and iOS, brokers enable:

- Single Sign On (SSO). Your users won't need to sign-in to each application.
- Device identification. By accessing the device certificate that was created on the device when it was workplace joined.
- Application identification verification. When an application calls the broker, it passes its redirect url, and the broker verifies it.

### Enable the brokers on Xamarin

To enable one of these features, application developers need to use the `WithBroker()` parameter when calling the `PublicClientApplicationBuilder.CreateApplication` method. `.WithBroker()` is set to true by default. Developers will also need to follow the steps below for [iOS](#brokered-authentication-for-ios).

#### Brokered Authentication for Xamarin.iOS

Follow the steps below to enable your Xamarin.iOS app to talk with the [Microsoft Authenticator](https://itunes.apple.com/us/app/microsoft-authenticator/id983156458) app.

### Step 1: Enable broker support

Broker support is enabled on a per-PublicClientApplication basis. It's disabled by default. You must use the `WithBroker()` parameter (set to true by default) when creating the PublicClientApplication through the PublicClientApplicationBuilder.

```CSharp
var app = PublicClientApplicationBuilder
                .Create(ClientId)
                .WithBroker()
                .WithReplyUri(redirectUriOnIos) // $"msauth.{Bundle.Id}://auth" (see step 6 below)
                .Build();
```

### Step 2: Update AppDelegate to handle the callback

When MSAL.NET calls the broker, the broker will, in turn, call back to your application through the `OpenUrl` method of the `AppDelegate` class. Since MSAL will wait for the response from the broker, your application needs to cooperate to call MSAL.NET back. You do this by updating the `AppDelegate.cs` file to override the below method.

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

This method is invoked every time the application is launched, and is used as an opportunity to process the response from the broker and complete the authentication process initiated by MSAL.NET.

### Step 3: Set a UIViewController()

Still in `AppDelegate.cs`, you'll need to set an object window. Normally, with Xamarin iOS, you don't need to set the object window, but in order to send and receive responses from broker, you'll need an object window.

To do this, you'll need to do two things:

1) In `AppDelegate.cs`, set the `App.RootViewController` to a new `UIViewController()`. This will make sure there's a `UIViewController` with the call to the broker. If it isn't set correctly, you may get this error:
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

### Step 4: Register a URL Scheme

MSAL.NET uses URLs to invoke the broker and then return the broker response back to your app. To finish the round trip, you need to register a URL scheme for your app in the `Info.plist` file.

The `CFBundleURLSchemes` name must include `msauth.` as a prefix, followed by your `CFBundleURLName`.

`$"msauth.(BundleId)"`

**For example:**
`msauth.com.yourcompany.xforms`

**Note** This will become part of the RedirectUri used for uniquely identifying your app when receiving the response from the broker.

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

### Step 5: LSApplicationQueriesSchemes

MSAL uses `–canOpenURL:` to check if the broker is installed on the device. In iOS 9, Apple locked down what schemes an application can query for.

**Add** **`msauthv2`** to the `LSApplicationQueriesSchemes` section of the `Info.plist` file.

```CSharp 
<key>LSApplicationQueriesSchemes</key>
    <array>
      <string>msauthv2</string>
    </array>
```

## Next steps

> [!div class="nextstepaction"]
> [Acquiring a token](scenario-mobile-acquire-token.md)

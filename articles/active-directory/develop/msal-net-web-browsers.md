---
title: Web browsers in Microsoft Authentication Library for .NET | Azure
description: Learn about specific considerations when using Xamarin Android with the Microsoft Authentication Library for .NET (MSAL.NET).
services: active-directory
documentationcenter: dev-center-name
author: rwike77
manager: CelesteDG
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/06/2019
ms.author: jmprieur
ms.reviewer: saeeda
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn about web browsers MSAL.NET so I can decide if this platform meets my application development needs and requirements.
ms.collection: M365-identity-device-management
---

# Using web browsers in MSAL.NET
Web browsers are required for interactive authentication. By default, MSAL.NET supports the [system web browser](#system-web-browser-on-xamarinios-and-xamarinandroid) on Xamarin.iOS and [Xamarin.Android](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki/system-browser). But [you can also enable the Embedded Web browser](#enable-embedded-webviews) depending on your requirements (UX, need for single sign-on (SSO), security)  in [Xamarin.iOS](#choosing-between-embedded-web-browser-or-system-browser-on-xamarinios) and [Xamarin.Android](#choosing-between-embedded-web-browser-or-system-browser-on-xamarinandroid) apps. And you can even [choose dynamically](#detecting-the-presence-of-custom-tabs-on-xamarinandroid) which web browser to use based on the presence of Chrome or a browser supporting Chrome custom tabs in Android.

## Web browsers in MSAL.NET

It is important to understand that when acquiring a token interactively, the content of the dialog box is not provided by the library but by the STS (Security Token Service). The authentication endpoint sends back some HTML and JavaScript that controls the interaction, which is rendered in a web browser or web control. Allowing the STS to handle the HTML interaction has many advantages:

- The password (if one was typed) is never stored by the application, nor the authentication library.
- Enables redirections to other identity providers (for instance login-in with a work school account or a personal account with MSAL, or with a social account with Azure AD B2C).
- Lets the STS control Conditional Access, for example, by having the user do multiple factor authentication (MFA) during the authentication phase (entering a Windows Hello pin, or being called on their phone, or on an authentication app on their phone). In cases where the required multi factor authentication is not set it up yet, the user can set it up just in time in the same dialog.  The user enters their mobile phone number and is guided to install an authentication application and scan a QR tag to add their account. This server driven interaction is a great experience!
- Lets the user change their password in this same dialog when the password has expired (providing additional fields for the old password and the new password).
- Enables branding of the tenant, or the application (images) controlled by the Azure AD tenant admin / application owner.
- Enables the users to consent to let the application access resources / scopes in their name just after the authentication.

## System web browser on Xamarin.iOS and Xamarin.Android

By default, MSAL.NET supports the system web browser on Xamarin.iOS and Xamarin.Android. For all the platforms that provide UI (that is, not .NET Core), a dialog is provided by the library embedding a Web browser control. MSAL.NET also uses an embedded web view for the .NET Desktop and WAB for the UWP platform. However, it leverages by default the **system web browser** for Xamarin iOS and Xamarin Android applications. On iOS, it even chooses the web view to use depending on the version of the Operating System (iOS12, iOS11, and earlier).

Using the system browser has the significant advantage of sharing the SSO state with other applications and with web applications without needing a broker (Company portal / Authenticator). The system browser was used, by default, in the MSAL.NET for the Xamarin iOS and Xamarin Android platforms because, on these platforms, the system web browser occupies the whole screen, and the user experience is better. The system web view is not distinguishable from a dialog. On iOS, though, the user might have to give consent for the browser to call back the application, which can be annoying.

### UWP does not use the System Webview

For desktop applications, however, launching a System Webview leads to a subpar user experience, as the user sees the browser, where they might already have other tabs opened. And when authentication has happened, the users gets a page asking them to close this window. If the user does not pay attention, they can close the entire process (including other tabs, which are unrelated to the authentication). Leveraging the system browser on desktop would also require opening local ports and listening on them, which might require advanced permissions for the application. You, as a developer, user, or administrator, might be reluctant about this requirement.

## Enable embedded webviews 
You can also enable embedded webviews in Xamarin.iOS and Xamarin.Android apps. Starting with MSAL.NET 2.0.0-preview, MSAL.NET also supports using the **embedded** webview option. For ADAL.NET, embedded webview is the only option supported.

As a developer using MSAL.NET targeting Xamarin, you may choose to use either embedded webviews or system browsers. This is your choice depending on the user experience and security concerns you want to target.

Currently, MSAL.NET does not yet support the Android and iOS brokers. Therefore if you need to provide single sign-on (SSO), the system browser might still be a better option. Supporting brokers with the embedded web browser is on the MSAL.NET backlog.

### Differences between embedded webview and system browser 
There are some visual differences between embedded webview and system browser in MSAL.NET.

**Interactive sign-in with MSAL.NET using the Embedded Webview:**

![embedded](media/msal-net-web-browsers/embedded-webview.png)

**Interactive sign-in with MSAL.NET using the System Browser:**

![System browser](media/msal-net-web-browsers/system-browser.png)

### Developer Options

As a developer using MSAL.NET, you have several options for displaying the interactive dialog from STS:

- **System browser.** The system browser is set by default in the library. If using Android, read [system browsers](msal-net-system-browser-android-considerations.md) for specific information about which browsers are supported for authentication. When using the system browser in Android, we recommend the device has a browser that supports Chrome custom tabs.  Otherwise, authentication may fail.
- **Embedded webview.** To use only embedded webview in MSAL.NET, the `AcquireTokenInteractively` parameters builder contains a `WithUseEmbeddedWebView()` method.

    iOS

    ```csharp
    AuthenticationResult authResult;
    authResult = app.AcquireTokenInteractively(scopes)
                    .WithUseEmbeddedWebView(useEmbeddedWebview)
                    .ExecuteAsync();
    ```

    Android:

    ```csharp
    authResult = app.AcquireTokenInteractively(scopes)
                .WithParentActivityOrWindow(activity)
                .WithUseEmbeddedWebView(useEmbeddedWebview)
                .ExecuteAsync();
    ```

#### Choosing between embedded web browser or system browser on Xamarin.iOS

In your iOS app, in `AppDelegate.cs` you can initialize the `ParentWindow` to `null`. It's not used in iOS

```csharp
App.ParentWindow = null; // no UI parent on iOS
```

#### Choosing between embedded web browser or system browser on Xamarin.Android

In your Android app, in `MainActivity.cs` you can set the parent activity, so that the authentication results gets back to it:

```csharp
 App.ParentWindow = this;
```

Then in the `MainPage.xaml.cs`:

```csharp
authResult = await App.PCA.AcquireTokenInteractive(App.Scopes)
                      .WithParentActivityOrWindow(App.ParentWindow)
                      .WithUseEmbeddedWebView(true)
                      .ExecuteAsync();
```

#### Detecting the presence of custom tabs on Xamarin.Android

If you want to use the system web browser to enable SSO with the apps running in the browser, but are worried about the user experience for Android devices not having a browser with custom tab support, you have the option to decide by calling the `IsSystemWebViewAvailable()` method in `IPublicClientApplication`. This method returns `true` if the PackageManager detects custom tabs and `false` if they are not detected on the device.

Based on the value returned by this method, and your requirements, you can make a decision:

- You can return a custom error message to the user. For example: "Please install Chrome to continue with authentication" -OR-
- You can fall back to the embedded webview option and launch the UI as an embedded webview.

The code below shows the embedded webview option:

```csharp
bool useSystemBrowser = app.IsSystemWebviewAvailable();

authResult = await App.PCA.AcquireTokenInteractive(App.Scopes)
                      .WithParentActivityOrWindow(App.ParentWindow)
                      .WithUseEmbeddedWebView(!useSystemBrowser)
                      .ExecuteAsync();
```

## .NET Core does not support interactive authentication out of the box

For .NET Core, acquisition of tokens interactively is not available. Indeed, .NET Core does not provide UI yet. If you want to provide interactive sign-in for a .NET Core application, you could let the application present to the user a code and a URL to go to sign in interactively (See [Device Code Flow](msal-authentication-flows.md#device-code)).

Alternatively you can implement the [IWithCustomUI](scenario-desktop-acquire-token.md#withcustomwebui) interface and provide your own browser
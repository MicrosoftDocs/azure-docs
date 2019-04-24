---
title: Xamarin Android considerations (Microsoft Authentication Library for .NET) | Azure
description: Learn about specific considerations when using Xamarin Android with the Microsoft Authentication Library for .NET (MSAL.NET).
services: active-directory
documentationcenter: dev-center-name
author: rwike77
manager: celested
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/12/2019
ms.author: ryanwi
ms.reviewer: saeeda
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn about specific considerations when using Xamarin Android and MSAL.NET so I can decide if this platform meets my application development needs and requirements.
ms.collection: M365-identity-device-management
---

# Using web browsers in MSAL.NET
Web browsers are required for interactive authentication. By default, MSAL.NET supports the [system web browser](#by-default-msalnet-supports-a-system-web-browser-on-xamarinios-and-xamarinandroid) on Xamarin.iOS and [Xamarin.Android](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki/system-browser). But [you can also enable the Embedded Web browser](#you-can-also-enable-embedded-webviews-in-xamarinios-and-xamarinandroid-apps) depending on your requirements (UX, need for SSO, security)  in [Xamarin.iOS](#choosing-between-embedded-web-browser-or-system-browser-on-xamarinios) and [Xamarin.Android](#choosing-between-embedded-web-browser-or-system-browser-on-xamarinandroid) apps. And you can even [choose dynamically](#detecting-the-presence-of-chrome--chrome-tabs-on-xamarinandroid) which web browser to use based on the presence of Chrome or a browser supporting Chrome custom tabs in Android.

## Web browsers in MSAL.NET

One important understanding with authentication libraries and Azure AD is that, when acquiring a token interactively, the content of the dialog box is not provided by the library, but by the STS (Security Token Service). The authentication endpoint sends back some HTML and JavaScript that control the interaction, and it's rendered in a web browser or web control. Allowing the STS to handle the HTML interaction has many advantages:

- The password (if one was typed) is never stored by the application, nor the authentication library.
- Enabling redirections to other identity providers (for instance login-in with a work school account or a personal account with MSAL, or with a social account with Azure AD B2C).
- Letting the STS control conditional access, for instance by having the user do multiple factor authentication (MFA) during this authentication phase (entering a Windows Hello pin, or being called on their phone, or on an authentication app on their phone). In cases where multi factor authentication is required and the user has not set it up yet, they can even set it up just in time in the same dialog: they enter their mobile phone number, and are guided to install an authentication application and scan a QR tag to add their account. This server driven interaction is a great experience!
- Letting the user change their password in this same dialog when the password has expired (providing additional fields for the old password and the new password).
- Enabling branding of the tenant, or the application (images) controlled by the Azure AD tenant admin / application owner.
- Enabling the users to consent to let the application access resources / scopes in their name just after the authentication.


## By default, MSAL.NET supports a system web browser on Xamarin.iOS and Xamarin.Android

To host this interaction with the STS, ADAL.NET only uses the **embedded** web browser. For all the platforms that provide UI (i.e. not .NET Core), a dialog is provided by the library embedding a Web browser control. MSAL.NET also uses an embedded web view for the .NET Desktop, and WAB for the UWP platform. However, it leverages by default the **system web browser** for Xamarin iOS and Xamarin Android applications. On iOS, it even choses the web view to use depending on the version of the Operating System (iOS12, iOS11, and earlier)

Using the system browser has the significant advantage of sharing the SSO state with other applications and with web applications without needing a broker (Company portal / Authenticator). The system browser was used, by default, in the MSAL.NET for the Xamarin iOS and Xamarin Android platforms because, on these platforms, the system web browser occupies the whole screen, and the user experience is better. The system web view is not distinguishable from a dialog. On iOS, though, the user might have to give consent for the browser to call back the application, which can be annoying.

#### UWP does not use the System Webview

For desktop applications, however, launching a System Webview leads to a sub-par user experience, as the user sees the browser, where they might already have other tabs opened. And when authentication has happened, the users gets a page asking them to close this window. If the user does not pay attention, they can close the entire process (including other tabs, which are unrelated to the authentication). Leveraging the system browser on desktop would also require opening local ports and listening on them, which might require advanced permissions for the application. You, as a developer, user, or administrator, might be reluctant about this requirement.

## You can also enable Embedded Webviews in Xamarin.iOS and Xamarin.Android apps

Starting with MSAL.NET 2.0.0-preview, MSAL.NET also supports using the **embedded** webview option. Note that for ADAL.NET, embedded webview is the only option supported.
As a developer using MSAL.NET targeting Xamarin, you may choose to use either embedded webviews or system browsers. This is your choice depending on the user experience and security concerns you want to target.

> Note that as of today, MSAL.NET does not yet support the Android and iOS brokers. Therefore if you need to provide Single Sign On (SSO), the system browser might still be a better option. Supporting brokers with the embedded web browser is on the MSAL.NET backlog.

### Visual Differences Between Embedded Webview and System Browser in MSAL.NET

**Interactive sign-in with MSAL.NET using the Embedded Webview:**

![embedded](https://user-images.githubusercontent.com/19942418/40319714-f5df7a36-5cdd-11e8-9efc-9f1b6661f4be.PNG)

**Interactive sign-in with MSAL.NET using the System Browser:**

![systemBrowser](https://user-images.githubusercontent.com/19942418/40319616-a563346c-5cdd-11e8-82d3-2328bef9c172.PNG)

### Developer Options

> Note: The way you chose between the system browser and the embedded webview will change some time in the near future (before official release).

As a developer using MSAL.NET, you have several options for displaying the interactive dialog from STS:

- **System browser.** The system browser is set by default in the library. If using Android, please see [system browsers](Android-system-browser) with specific information about which browsers are supported for authentication. Note that when using system browser in Android, we recommend the device have a browser which supports Chrome custom tabs, otherwise, authentication may fail. For more information about these issues, read the section on [Android system browsers](Android-system-browser).
- **Embedded webview.** To use only embedded webview in MSAL.NET, there are overloads of the `UIParent()` constructor available for Android and iOS.

    > iOS:

    ```csharp
    public UIParent(bool useEmbeddedWebview)
    ```

    > Android:

    ```csharp
    public UIParent(Activity activity, bool useEmbeddedWebview)
    ```

#### Choosing between embedded web browser or system browser on Xamarin.iOS

In your iOS app, in `AppDelegate.cs` you can use either system browser or embedded webview.

```csharp
// Use only embedded webview
App.UIParent = new UIParent(true);

// Use only system browser
App.UIParent = new UIParent();
```

#### Choosing between embedded web browser or system browser on Xamarin.Android

In your Android app, in `MainActivity.cs` you can decide how to implement the webview options.

```csharp
// Use only embedded webview
App.UIParent = new UIParent(Xamarin.Forms.Forms.Context as Activity, true);

// or
// Use only system browser
App.UIParent = new UIParent(Xamarin.Forms.Forms.Context as Activity);
```

#### Detecting the presence of custom tabs on Xamarin.Android

If you want to use the system web browser to enable SSO with the apps running in the browser, but are worried about the user experience for Android devices not having a browser with custom tab support, you have the option to decide by calling the `IsSystemWebViewAvailable()` method in `UIParent`. This method returns `true` if the PackageManager detects custom tabs and `false` if they are not detected on the device.

Based on the value returned by this method, and your requirements, as the developer, you can make a decision:

- You can return a custom error message to the user. For example: "Please install Chrome to continue with authentication" -OR-
- You can fallback to the embedded webview option and launch the UI as an embedded webview

The code below shows how you would do the later:

```csharp
bool useSystemBrowser = UIParent.IsSystemWebviewAvailable();
if (useSystemBrowser)
{
    // A browser with custom tabs is present on device, use system browser
    App.UIParent = new UIParent(Xamarin.Forms.Forms.Context as Activity);
}
else
{
    // A browser with custom tabs is not present on device, use embedded webview
    App.UIParent = new UIParent(Xamarin.Forms.Forms.Context as Activity, true);
}

// Alternative:
App.UIParent = new UIParent(Xamarin.Forms.Forms.Context as Activity, !useSystemBrowser);

```

## .NET Core does not support interactive authentication

Note, finally, that for .NET Core, acquisition of tokens interactively is not available. Indeed, .NET Core does not provide UI yet. If you want to provide interactive sign-in for a .NET Core application, you could let the application present to the user a code and a URL to go to sign-in interactively (See [Device Code Flow](https://aka.ms/msal-net-device-code-flow))
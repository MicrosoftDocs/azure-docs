---
title: Customize browsers and WebViews | Microsoft identity platform
description: Learn how to customize the browser experience used by MSAL for iOS and macOS to sign in users
services: active-directory
documentationcenter: dev-center-name
author: tylermsft
manager: CelesteDG
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 08/22/2019
ms.author: twhitney
ms.reviewer: 
ms.custom: aaddev
ms.collection: M365-identity-device-management
---

# How to: Customize browsers and WebViews for iOS/macOS

The Microsoft Authentication Library (MSAL) uses an external web browser by default, which might appear on top of your app, to do interactive authentication to sign in users. You can change the experience by customizing the configuration to other options for displaying web content, such as:

- [ASWebAuthenticationSession](https://developer.apple.com/documentation/authenticationservices/aswebauthenticationsession?language=objc)
- [SFAuthenticationSession](https://developer.apple.com/documentation/safariservices/sfauthenticationsession?language=objc) 
- [SFSafariViewController](https://developer.apple.com/documentation/safariservices/sfsafariviewcontroller?language=objc)
- [WKWebView](https://developer.apple.com/documentation/webkit/wkwebview?language=objc).

## System browsers

`ASWebAuthenticationSession`, `SFAuthenticationSession`, and `SFSafariViewController` are considered system browsers. In general, system browsers share cookies and other website data with the Safari browser application.

- `ASWebAuthenticationSession` replaces `SFAuthenticationSession`, which has been available since iOS 11. Use this class to show login between Safari and an app.
- `SFSafariViewController` is more general purpose and provides an interface for browsing the web and can be used for login purposes as well. In iOS 9 and 10, cookies and other website data are shared with Safari, but not in iOS 11 and later.

## In-app browser

[WKWebView](https://developer.apple.com/documentation/webkit/wkwebview) is an in-app browser that displays web content. It does not share cookies or web site data with other **WKWebView** instances, or with the Safari browser.

## Cookie sharing and Single sign-on (SSO) implications

The browser you use impacts the SSO experience because of how they share cookies. The following tables summarize the SSO options per browser.

| Technology    | Browser Type  | Availability | Shares cookies and other data  | SSO |
|:-------------:|:-------------:|:-------------:|:-------------:|-------------:|
| [ASWebAuthenticationSession](https://developer.apple.com/documentation/authenticationservices/aswebauthenticationsession) | System | iOS12 | Yes | w/ Safari instances
| [SFAuthenticationSession](https://developer.apple.com/documentation/safariservices/sfauthenticationsession) | System | iOS11 | Yes |  w/ Safari instances
| [SFSafariViewController](https://developer.apple.com/documentation/safariservices/sfsafariviewcontroller) | System | iOS11 and up | No | No**
| **SFSafariViewController** | System | iOS10 | Yes |  w/ Safari instances
| **WKWebView**  | In-app | iOS9 and up | No | No**

** For SSO to work, tokens need to be shared between apps which requires a token cache or broker application such as Microsoft Authenticator for iOS.

By default, the MSAL for iOS and macOS library uses the following system web browser depending on the version of iOS:

    |Version  | Web browser |
    |----------|----------------|
    | iOS12    | `ASWebAuthenticationSession` |
    | iOS11    | `SFAuthenticationSession` |
    | iOS9-10 | `SFSafariViewController` |
    
## Change the default browser

You can use an in-app browser, or a specific system browser depending on your UX requirements, by changing the following property:

```objc
MSALGlobalConfig.defaultWebviewType = MSALWebviewTypeWKWebView;
```

## Change per interactive request

Each request can be configured to override the default browser by changing the `MSALInteractiveTokenParameters.webviewType` property before passing it to the `acquireTokenWithParameters:completionBlock:` method.

Additionally, MSAL supports passing in a custom `WKWebView` by setting the `MSALWebviewParameters.customWebView` property.

If you use a custom webview, notifications are used to indicate the status of the web content being displayed, such as:

```objc
/*! Fired at the start of a resource load in the webview. The URL of the load, if available, will be in the @"url" key in the userInfo dictionary */
extern NSString *MSALWebAuthDidStartLoadNotification;

/*! Fired when a resource finishes loading in the webview. */
extern NSString *MSALWebAuthDidFinishLoadNotification;

/*! Fired when web authentication fails due to reasons originating from the network. Look at the @"error" key in the userInfo dictionary for more details.*/
extern NSString *MSALWebAuthDidFailNotification;

/*! Fired when authentication finishes */
extern NSString *MSALWebAuthDidCompleteNotification;

/*! Fired before ADAL invokes the broker app */
extern NSString *MSALWebAuthWillSwitchToBrokerApp;
```

### Options
```objc
typedef NS_ENUM(NSInteger, MSALWebviewType)
{
    // For iOS 11 and up, uses AuthenticationSession (ASWebAuthenticationSession
    // or SFAuthenticationSession).
    // For older versions, with AuthenticationSession not being available, uses
    // SafariViewController.
    MSALWebviewTypeDefault,
    
    // Use SFAuthenticationSession/ASWebAuthenticationSession only, fail on iOS10 and older
    MSALWebviewTypeAuthenticationSession,
    
    // Use SFSafariViewController for all versions.
    MSALWebviewTypeSafariViewController,
    
    // Use WKWebView
    MSALWebviewTypeWKWebView,
};
```

## Next steps

Learn more about [Authentication flows and application scenarios](authentication-flows-app-scenarios.md)

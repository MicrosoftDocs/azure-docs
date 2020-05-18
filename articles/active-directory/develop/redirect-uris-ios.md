---
title: Use redirect URIs with MSAL (iOS/macOS) | Azure
titleSuffix: Microsoft identity platform
description: Learn about the differences between Microsoft Authentication Library for ObjectiveC (MSAL for iOS and macOS) and Azure AD Authentication Library for ObjectiveC (ADAL.ObjC) and how to migrate between them.
services: active-directory
author: mmacy
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: overview
ms.workload: identity
ms.date: 08/28/2019
ms.author: marsma
ms.reviewer: jak
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn about how to use redirect URIs.
---

# Using redirect URIs with the Microsoft authentication library for iOS and macOS

When a user authenticates, Azure Active Directory (Azure AD) sends the token to the app by using the redirect URI registered with the Azure AD application.

The Microsoft Authentication library (MSAL) requires that the redirect URI be registered with the Azure AD app in a specific format. MSAL uses a default redirect URI, if you don't specify one. The format is `msauth.[Your_Bundle_Id]://auth`.

The default redirect URI format works for most apps and scenarios, including brokered authentication and system web view. Use the default format whenever possible.

However, you may need to change the redirect URI for advanced scenarios, as described below.

## Scenarios that require a different redirect URI

### Cross-app single sign on (SSO)

For the Microsoft Identity platform to share tokens across apps, each app needs to have the same client ID or application ID. This is the unique identifier provided when you registered your app in the portal (not the application bundle ID that you register per app with Apple).

The redirect URIs need to be different for each iOS app. This allows the Microsoft identity service to uniquely identify different apps that share an application ID. Each application can have multiple redirect URIs registered in the Azure portal. Each app in your suite will have a different redirect URI. For example:

Given the following application registration in the Azure portal:

    Client ID: ABCDE-12345 (this is a single client ID)
    RedirectUris: msauth.com.contoso.app1://auth, msauth.com.contoso.app2://auth, msauth.com.contoso.app3://auth

App1 uses redirect `msauth.com.contoso.app1://auth`
App2 uses `msauth.com.contoso.app2://auth`
App3 uses `msauth.com.contoso.app1://auth`

### Migrating from ADAL to MSAL

When migrating code that used the Azure AD Authentication Library (ADAL) to MSAL, you may already have a redirect URI configured for your app. You can continue using the same redirect URI as long as your ADAL app was configured to support brokered scenarios and your redirect URI satisfies the MSAL redirect URI format requirements.

## MSAL redirect URI format requirements

* The MSAL redirect URI must be in the form `<scheme>://host`

    Where `<scheme>` is a unique string that identifies your app. It's primarily based on the Bundle Identifier of your application to guarantee uniqueness. For example, if your app's Bundle ID is `com.contoso.myapp`, your redirect URI would be in the form: `msauth.com.contoso.myapp://auth`.

    If you're migrating from ADAL, your redirect URI will likely have this format: `<scheme>://[Your_Bundle_Id]`, where `scheme` is a  unique string. This format will continue to work when you use MSAL.

* `<scheme>` must be registered in your app's Info.plist under `CFBundleURLTypes > CFBundleURLSchemes`.  In this example, Info.plist has been opened as source code:

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
    

MSAL will verify if your redirect URI registers correctly, and return an error if it's not.
    
* If you want to use universal links as a redirect URI, the `<scheme>` must be `https` and doesn't need to be declared in `CFBundleURLSchemes`. Instead, configure the app and domain per Apple's instructions at [Universal Links for Developers](https://developer.apple.com/ios/universal-links/) and call the `handleMSALResponse:sourceApplication:` method of `MSALPublicClientApplication` when your application is opened through a universal link.

## Use a custom redirect URI

To use a custom redirect URI, pass the `redirectUri` parameter to `MSALPublicClientApplicationConfig` and pass that object to `MSALPublicClientApplication` when you initialize the object. If the redirect URI is invalid, the initializer will return `nil` and set the `redirectURIError`with additional information.  For example:

Objective-C:

```objc
MSALPublicClientApplicationConfig *config =
        [[MSALPublicClientApplicationConfig alloc] initWithClientId:@"your-client-id"
                                                        redirectUri:@"your-redirect-uri"
                                                        authority:authority];
NSError *redirectURIError;
MSALPublicClientApplication *application =
        [[MSALPublicClientApplication alloc] initWithConfiguration:config error:&redirectURIError];
```

Swift:

```swift
let config = MSALPublicClientApplicationConfig(clientId: "your-client-id",
                                            redirectUri: "your-redirect-uri",
                                              authority: authority)
do {
  let application = try MSALPublicClientApplication(configuration: config)
  // continue on with application          
} catch let error as NSError {
  // handle error here
}       
```



## Handle the URL opened event

Your application should call MSAL when it receives any response through URL schemes or universal links. Call the `handleMSALResponse:sourceApplication:` method of `MSALPublicClientApplication` when your application is opened. Here's an example for custom schemes:

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
    return MSALPublicClientApplication.handleMSALResponse(url, sourceApplication: options[UIApplication.OpenURLOptionsKey.sourceApplication] as? String)
}
```



## Next steps

Learn more about [Authentication flows and application scenarios](authentication-flows-app-scenarios.md)

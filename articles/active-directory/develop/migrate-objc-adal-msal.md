---
title: ADAL to MSAL migration guide (MSAL iOS/macOS)
description: Learn the differences between MSAL for iOS/macOS and the Azure AD Authentication Library for Objective-C (ADAL.ObjC) and how to migrate to MSAL for iOS/macOS.
services: active-directory
author: OwenRichards1
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 08/28/2019
ms.author: owenrichards
ms.reviewer: oldalton
ms.custom: aaddev, has-adal-ref
#Customer intent: As an application developer, I want to learn about the differences between the Objective-C ADAL and MSAL for iOS and macOS libraries so I can migrate my applications to MSAL for iOS and macOS.
---

# Migrate applications to MSAL for iOS and macOS

The Azure Active Directory Authentication Library ([ADAL Objective-C](https://github.com/AzureAD/azure-activedirectory-library-for-objc)) was created to work with  Microsoft Entra accounts via the v1.0 endpoint.

The Microsoft Authentication Library for iOS and macOS (MSAL) is built to work with all Microsoft identities such as Microsoft Entra accounts, personal Microsoft accounts, and Azure AD B2C accounts via the Microsoft identity platform (formally the Azure AD v2.0 endpoint).

The Microsoft identity platform has a few key differences with Azure AD v1.0. This article highlights these differences and provides guidance to migrate an app from ADAL to MSAL.

## ADAL and MSAL app capability differences

### Who can sign in

* ADAL only supports work and school accounts--also known as Microsoft Entra accounts.
* MSAL supports personal Microsoft accounts (MSA accounts) such as Hotmail.com, Outlook.com, and Live.com.
* MSAL supports work and school accounts, and Azure AD B2C accounts.

### Standards compliance

* The Microsoft identity platform follows OAuth 2.0 and OpenId Connect standards.

### Incremental and dynamic consent

* The Microsoft identity platform allows you to request permissions dynamically. Apps can ask for permissions only as needed and request more as the app needs them. For more information, see [permissions and consent](./permissions-consent-overview.md#consent).

## ADAL and MSAL library differences

The MSAL public API reflects a few key differences between Azure AD v1.0 and the Microsoft identity platform.

### MSALPublicClientApplication instead of ADAuthenticationContext

`ADAuthenticationContext` is the first object an ADAL app creates. It represents an instantiation of ADAL. Apps create a new instance of `ADAuthenticationContext` for each Microsoft Entra cloud and tenant (authority) combination. The same `ADAuthenticationContext` can be used to get tokens for multiple public client applications.

In MSAL, the main interaction is through an `MSALPublicClientApplication` object, which is modeled after [OAuth 2.0 Public Client](https://tools.ietf.org/html/rfc6749#section-2.1). One instance of `MSALPublicClientApplication` can be used to interact with multiple Microsoft Entra clouds, and tenants, without needing to create a new instance for each authority. For most apps, one `MSALPublicClientApplication` instance is sufficient.

### Scopes instead of resources

In ADAL, an app had to provide a *resource* identifier like `https://graph.microsoft.com` to acquire tokens from the Azure AD v1.0 endpoint. A resource can define a number of scopes, or oAuth2Permissions in the app manifest, that it understands. This allowed client apps to request tokens from that resource for a certain set of scopes pre-defined during app registration.

In MSAL, instead of a single resource identifier, apps provide a set of scopes per request. A scope is a resource identifier followed by a permission name in the form resource/permission. For example, `https://graph.microsoft.com/user.read`

There are two ways to provide scopes in MSAL:

* Provide a list of all the permissions your apps needs. For example: 

    `@[@"https://graph.microsoft.com/directory.read", @"https://graph.microsoft.com/directory.write"]`

    In this case, the app requests the `directory.read` and `directory.write` permissions. The user will be asked to consent for those permissions if they haven't consented to them before for this app. The application might also receive additional permissions that the user has already consented to for the application. The user will only be prompted to consent for new permissions, or permissions that haven't been granted.

* The `/.default` scope.

This is the built-in scope for every application. It refers to the static list of permissions configured when the application was registered. Its behavior is similar to that of `resource`. This can be useful when migrating to ensure that a similar set of scopes and user experience is maintained.

To use the `/.default` scope, append `/.default` to the resource identifier. For example: `https://graph.microsoft.com/.default`. If your resource ends with a slash (`/`), you should still append `/.default`, including the leading forward slash, resulting in a scope that has a double forward slash (`//`) in it.

You can read more information about using the "/.default" scope [here](./permissions-consent-overview.md).

### Supporting different WebView types & browsers

ADAL only supports UIWebView/WKWebView for iOS, and WebView for macOS. MSAL for iOS supports more options for displaying web content when requesting an authorization code, and no longer supports `UIWebView`; which can improve the user experience and security.

By default, MSAL on iOS uses [ASWebAuthenticationSession](https://developer.apple.com/documentation/authenticationservices/aswebauthenticationsession?language=objc), which is the web component Apple recommends for authentication on iOS 12+ devices. It provides single sign-on (SSO) benefits through cookie sharing between apps and the Safari browser.

You can choose to use a different web component depending on app requirements and the end-user experience you want. See [supported web view types](customize-webviews.md) for more options.

When migrating from ADAL to MSAL, `WKWebView` provides the user experience most similar to ADAL on iOS and macOS. We encourage you to migrate to `ASWebAuthenticationSession` on iOS, if possible. For macOS, we encourage you to use `WKWebView`.

### Account management API differences

When you call the ADAL methods `acquireToken()` or `acquireTokenSilent()`, you receive an `ADUserInformation` object containing a list of claims from the `id_token` that represents the account being authenticated. Additionally, `ADUserInformation` returns a `userId` based on the `upn` claim. After initial interactive token acquisition, ADAL expects developer to provide `userId` in all silent calls.

ADAL doesn't provide an API to retrieve known user identities. It relies on the app to save and manage those accounts.

MSAL provides a set of APIs to list all accounts known to MSAL without having to acquire a token.

Like ADAL, MSAL returns account information that holds a list of claims from the `id_token`. It's part of the `MSALAccount` object inside the `MSALResult` object.

MSAL provides a set of APIs to remove accounts, making the removed accounts inaccessible to the app. After the account is removed, later token acquisition calls will prompt the user to do interactive token acquisition. Account removal only applies to the client application that started it, and doesn't remove the account from the other apps running on the device or from the system browser. This ensures that the user continues to have a SSO experience on the device even after signing out of an individual app.

Additionally, MSAL also returns an account identifier that can be used to request a token silently later. However, the account identifier (accessible through `identifier` property in the `MSALAccount` object) isn't displayable and you can't assume what format it is in nor should you try to interpret or parse it.

### Migrating the account cache

When migrating from ADAL, apps normally store ADAL's `userId`, which doesn't have the `identifier` required by MSAL. As a one-time migration step, an app can query an MSAL account using ADAL's userId with the following API:

`- (nullable MSALAccount *)accountForUsername:(nonnull NSString *)username error:(NSError * _Nullable __autoreleasing * _Nullable)error;`

This API reads both MSAL's and ADAL's cache to find the account by ADAL userId (UPN).

If the account is found, the developer should use the account to do silent token acquisition. The first silent token acquisition will effectively upgrade the account, and the developer will get a MSAL compatible account identifier in the MSAL result (`identifier`). After that, only `identifier` should be used for  account lookups by using the following API:

`- (nullable MSALAccount *)accountForIdentifier:(nonnull NSString *)identifier error:(NSError * _Nullable __autoreleasing * _Nullable)error;`

Although it's possible to continue using ADAL's `userId` for all operations in MSAL, since `userId` is based on UPN, it's subject to multiple limitations that result in a bad user experience. For example, if the UPN changes, the user has to sign in again. We recommend all apps use the non-displayable account `identifier` for all operations.

Read more about [cache state migration](sso-between-adal-msal-apps-macos-ios.md).

### Token acquisition changes

MSAL introduces some token acquisition call changes:

* Like ADAL, `acquireTokenSilent` always results in a silent request.
* Unlike ADAL, `acquireToken` always results in user actionable UI either through the web view or the Microsoft Authenticator app. Depending on the SSO state inside webview/Microsoft Authenticator, the user may be prompted to enter their credentials.
* In ADAL, `acquireToken` with `AD_PROMPT_AUTO` first tries silent token acquisition, and only shows UI if the silent request fails. In MSAL, this logic can be achieved by first calling `acquireTokenSilent` and only calling `acquireToken` if silent acquisition fails. This allows developers to customize user experience before starting interactive token acquisition.

### Error handling differences

MSAL provides more clarity between errors that can be handled by your app and those that require intervention by the user. There are a limited number of errors developer must handle:

* `MSALErrorInteractionRequired`: The user must do an interactive request. This can be caused for various reasons such as an expired authentication session, Conditional Access policy has changed, a refresh token expired or was revoked, there are no valid tokens in the cache, and so on.
* `MSALErrorServerDeclinedScopes`: The request wasn't fully completed and some scopes weren't granted access. This can be caused by a user declining consent to one or more scopes.

Handling all other errors in the [`MSALError` list](https://github.com/AzureAD/microsoft-authentication-library-for-objc/blob/master/MSAL/src/public/MSALError.h#L128) is optional. You could use the information in those errors to improve the user experience.

See [Handling exceptions and errors using MSAL](msal-error-handling-ios.md) for more about MSAL error handling.

### Broker support

MSAL, starting with version 0.3.0, provides support for brokered authentication using the Microsoft Authenticator app. Microsoft Authenticator also enables support for Conditional Access scenarios. Examples of Conditional Access scenarios include device compliance policies that require the user to enroll the device through Intune or register with Microsoft Entra ID to get a token. And Mobile Application Management (MAM) Conditional Access policies, which require proof of compliance before your app can get a token.

To enable broker for your application:

1. Register a broker compatible redirect URI format for the application. The broker compatible redirect URI format is `msauth.<app.bundle.id>://auth`. Replace `<app.bundle.id>` with your application's bundle ID. If you're migrating from ADAL and your application was already broker capable, there's nothing extra you need to do. Your previous redirect URI is fully compatible with MSAL, so you can skip to step 3.

2. Add your application's redirect URI scheme to your info.plist file. For the default MSAL redirect URI, the format is `msauth.<app.bundle.id>`. For example:

    ```xml
    <key>CFBundleURLSchemes</key>
    <array>
        <string>msauth.<app.bundle.id></string>
    </array>
    ```

3. Add following schemes to your app's Info.plist under LSApplicationQueriesSchemes:

    ```xml
    <key>LSApplicationQueriesSchemes</key>
    <array>
         <string>msauthv2</string>
         <string>msauthv3</string>
    </array>
    ```

4. Add the following to your AppDelegate.m file to handle callbacks:
Objective-C:
    
    ```objc
    - (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<NSString *,id> *)options`
    {
        return [MSALPublicClientApplication handleMSALResponse:url sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey]];
    }
    ```
    
    Swift:
    
    ```swift
    func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
        return MSALPublicClientApplication.handleMSALResponse(url, sourceApplication: options[UIApplication.OpenURLOptionsKey.sourceApplication] as? String)
    }
    ```

### Business to business (B2B)

In ADAL, you create separate instances of `ADAuthenticationContext` for each tenant that the app requests tokens for. This is no longer a requirement in MSAL. In MSAL, you can create a single instance of `MSALPublicClientApplication` and use it for any Microsoft Entra cloud and organization by specifying a different authority for acquireToken and acquireTokenSilent calls.

## SSO in partnership with other SDKs

MSAL for iOS can achieve SSO via a unified cache with the following SDKs:

- ADAL Objective-C 2.7.x+
- MSAL.NET for Xamarin 2.4.x+
- ADAL.NET for Xamarin 4.4.x+

SSO is achieved via iOS keychain sharing and is only available between apps published from the same Apple Developer account.

SSO through iOS keychain sharing is the only silent SSO type.

On macOS, MSAL can achieve SSO with other MSAL for iOS and macOS based applications and ADAL Objective-C-based applications.

MSAL on iOS also supports two other types of SSO:

* SSO through the web browser. MSAL for iOS supports `ASWebAuthenticationSession`, which provides SSO through cookies shared between other apps on the device and specifically the Safari browser.
* SSO through an Authentication broker. On an iOS device, Microsoft Authenticator acts as the Authentication broker. It can follow Conditional Access policies such as requiring a compliant device, and provides SSO for registered devices. MSAL SDKs starting with version 0.3.0 support a broker by default.

## Intune MAM SDK

The [Intune MAM SDK](/intune/app-sdk-get-started) supports MSAL for iOS starting with version [11.1.2](https://github.com/msintuneappsdk/ms-intune-app-sdk-ios/releases/tag/11.1.2)

## MSAL and ADAL in the same app

ADAL version 2.7.0, and above, can't coexist with MSAL in the same application. The main reason is because of the shared submodule common code. Because Objective-C doesn't support namespaces, if you add both ADAL and MSAL frameworks to your application, there will be two instances of the same class. There's no guarantee for which one gets picked at runtime. If both SDKs are using same version of the conflicting class, your app may still work. However, if it's a different version, your app might experience unexpected crashes that are difficult to diagnose.

Running ADAL and MSAL in the same production application isn't supported. However, if you're just testing and migrating your users from ADAL Objective-C to MSAL for iOS and macOS, you can continue using [ADAL Objective-C 2.6.10](https://github.com/AzureAD/azure-activedirectory-library-for-objc/releases/tag/2.6.10). It's the only version that works with MSAL in the same application. There will be no new feature updates for this ADAL version, so it should be only used for migration and testing purposes. Your app shouldn't rely on ADAL and MSAL coexistence long term.

ADAL and MSAL coexistence in the same application isn't supported.
ADAL and MSAL coexistence between multiple applications is fully supported.

## Practical migration steps

### App registration migration

You don't need to change your existing Microsoft Entra application to switch to MSAL and enable Microsoft Entra accounts. However, if your ADAL-based application doesn't support brokered authentication, you'll need to register a new redirect URI for the application before you can switch to MSAL.

The redirect URI should be in this format: `msauth.<app.bundle.id>://auth`. Replace `<app.bundle.id>` with your application's bundle ID. Specify the redirect URI in the [Microsoft Entra admin center](https://entra.microsoft.com/?feature.broker=true#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade).

For iOS only, to support cert-based authentication, an additional redirect URI needs to be registered in your application and the Microsoft Entra admin center in the following format: `msauth://code/<broker-redirect-uri-in-url-encoded-form>`. For example, `msauth://code/msauth.com.microsoft.mybundleId%3A%2F%2Fauth`

We recommend all apps register both redirect URIs.

If you wish to add support for incremental consent, select the APIs and permissions your app is configured to request access to in your app registration under the **API permissions** tab.

If you're migrating from ADAL and want to support both Microsoft Entra ID and MSA accounts, your existing application registration needs to be updated to support both. We don't recommend you update your existing production app to support both Microsoft Entra ID and MSA right away. Instead, create another client ID that supports both Microsoft Entra ID and MSA for testing, and after you've verified that all scenarios work, update the existing app.

### Add MSAL to your app

You can add MSAL SDK to your app using your preferred package management tool. See [detailed instructions here](https://github.com/AzureAD/microsoft-authentication-library-for-objc/wiki/Installation).

### Update your app's Info.plist file

For iOS only, add your application's redirect URI scheme to your info.plist file. For ADAL broker compatible apps, it should be there already. The default MSAL redirect URI scheme will be in the format: `msauth.<app.bundle.id>`.  

```xml
<key>CFBundleURLSchemes</key>
<array>
    <string>msauth.<app.bundle.id></string>
</array>
```

Add following schemes to your app's Info.plist under `LSApplicationQueriesSchemes`.

```xml
<key>LSApplicationQueriesSchemes</key>
<array>
     <string>msauthv2</string>
     <string>msauthv3</string>
</array>
```

### Update your AppDelegate code

For iOS only, add the following to your AppDelegate.m file:

Objective-C:

```objc
- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<NSString *,id> *)options`
{
    return [MSALPublicClientApplication handleMSALResponse:url sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey]];
}
```

Swift:

```swift
func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
    return MSALPublicClientApplication.handleMSALResponse(url, sourceApplication: options[UIApplication.OpenURLOptionsKey.sourceApplication] as? String)
}
```

**If you are using Xcode 11**, you should place MSAL callback into the `SceneDelegate` file instead.
If you support both UISceneDelegate and UIApplicationDelegate for compatibility with older iOS, MSAL callback would need to be placed into both files.

Objective-C:

```objc
 - (void)scene:(UIScene *)scene openURLContexts:(NSSet<UIOpenURLContext *> *)URLContexts
 {
     UIOpenURLContext *context = URLContexts.anyObject;
     NSURL *url = context.URL;
     NSString *sourceApplication = context.options.sourceApplication;
     
     [MSALPublicClientApplication handleMSALResponse:url sourceApplication:sourceApplication];
 }
```

Swift:

```swift
func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
        
        guard let urlContext = URLContexts.first else {
            return
        }
        
        let url = urlContext.url
        let sourceApp = urlContext.options.sourceApplication
        
        MSALPublicClientApplication.handleMSALResponse(url, sourceApplication: sourceApp)
    }
```

This allows MSAL to handle responses from the broker and web component.
This wasn't necessary in ADAL since it "swizzled" app delegate methods automatically. Adding it manually is less error prone and gives the application more control.

### Enable token caching

By default, MSAL caches your app's tokens in the iOS or macOS keychain. 

To enable token caching:
1. Ensure your application is properly signed
2. Go to your Xcode Project Settings > **Capabilities tab** > **Enable Keychain Sharing**
3. Click **+** and enter a following **Keychain Groups** entry:
3.a For iOS, enter `com.microsoft.adalcache`
3.b For macOS enter `com.microsoft.identity.universalstorage`

### Create MSALPublicClientApplication and switch to its acquireToken and acquireTokeSilent calls

You can create `MSALPublicClientApplication` using following code:

Objective-C:

```objc
NSError *error = nil;
MSALPublicClientApplicationConfig *configuration = [[MSALPublicClientApplicationConfig alloc] initWithClientId:@"<your-client-id-here>"];
    
MSALPublicClientApplication *application =
[[MSALPublicClientApplication alloc] initWithConfiguration:configuration
                                                     error:&error];
```

Swift:

```swift
let config = MSALPublicClientApplicationConfig(clientId: "<your-client-id-here>")
do {
  let application = try MSALPublicClientApplication(configuration: config)
  // continue on with application
            
} catch let error as NSError {
  // handle error here
}
```

Then call the account management API to see if there are any accounts in the cache:

Objective-C:

```objc
NSString *accountIdentifier = nil /*previously saved MSAL account identifier */;
NSError *error = nil;
MSALAccount *account = [application accountForIdentifier:accountIdentifier error:&error];
```

Swift:

```swift
// definitions that need to be initialized
let application: MSALPublicClientApplication!
let accountIdentifier: String! /*previously saved MSAL account identifier */

do {
  let account = try application.account(forIdentifier: accountIdentifier)
  // continue with account usage
} catch let error as NSError {
  // handle error here
}
```



or read all of the accounts:

Objective-C:

```objc
NSError *error = nil;
NSArray<MSALAccount *> *accounts = [application allAccounts:&error];
```

Swift:

```swift
let application: MSALPublicClientApplication!
do {
  let accounts = try application.allAccounts()
  // continue with account usage
} catch let error as NSError {
  // handle error here
}
```



If an account is found, call the MSAL `acquireTokenSilent` API:

Objective-C:

```objc
MSALSilentTokenParameters *silentParameters = [[MSALSilentTokenParameters alloc] initWithScopes:@[@"<your-resource-here>/.default"] account:account];
    
[application acquireTokenSilentWithParameters:silentParameters
                              completionBlock:^(MSALResult *result, NSError *error)
{
    if (result)
    {
        NSString *accessToken = result.accessToken;
        // Use your token
    }
    else
    {
        // Check the error
        if ([error.domain isEqual:MSALErrorDomain] && error.code == MSALErrorInteractionRequired)
        {
            // Interactive auth will be required
        }
            
        // Other errors may require trying again later, or reporting authentication problems to the user
    }
}];
```

Swift:

```swift
let application: MSALPublicClientApplication!
let account: MSALAccount!
        
let silentParameters = MSALSilentTokenParameters(scopes: ["<your-resource-here>/.default"], 
                                                 account: account)
application.acquireTokenSilent(with: silentParameters) {
  (result: MSALResult?, error: Error?) in
  if let accessToken = result?.accessToken {
     // use accessToken
  }
  else {
    // Check the error
    guard let error = error else {
      assert(true, "callback should contain a valid result or error")
      return
    }
    
    let nsError = error as NSError
    if (nsError.domain == MSALErrorDomain
        && nsError.code == MSALError.interactionRequired.rawValue) {
      // Interactive auth will be required
    }
                
    // Other errors may require trying again later, or reporting authentication problems to the user
  }
}
```



## Next steps

Learn more about [Authentication flows and application scenarios](authentication-flows-app-scenarios.md)

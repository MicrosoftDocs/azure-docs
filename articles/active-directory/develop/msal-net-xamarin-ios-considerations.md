---
title: Xamarin iOS considerations (MSAL.NET)
description: Learn about considerations for using Xamarin iOS with the Microsoft Authentication Library for .NET (MSAL.NET).
services: active-directory
author: Dickson-Mwendia
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 09/09/2020
ms.author: dmwendia
ms.reviewer: saeeda
ms.custom: devx-track-csharp, aaddev, has-adal-ref, devx-track-dotnet
#Customer intent: As an application developer, I want to learn about considerations for using Xamarin iOS and MSAL.NET.
---

# Considerations for using Xamarin iOS with MSAL.NET

When you use the Microsoft Authentication Library for .NET (MSAL.NET) on Xamarin iOS, you should:

- Override and implement the `OpenUrl` function in `AppDelegate`.
- Enable keychain groups.
- Enable token cache sharing.
- Enable keychain access.
- Understand known issues with iOS 12 and iOS 13 and authentication.

## Implement OpenUrl

Override the `OpenUrl` method of the `FormsApplicationDelegate` derived class and call `AuthenticationContinuationHelper.SetAuthenticationContinuationEventArgs`. Here's an example:

```csharp
public override bool OpenUrl(UIApplication app, NSUrl url, NSDictionary options)
{
    AuthenticationContinuationHelper.SetAuthenticationContinuationEventArgs(url);
    return true;
}
```

Also, perform the following tasks:

* Define a redirect URI scheme.
* Require permissions for your app to call another app.
* Have a specific form for the redirect URI.
* [Register a redirect URI](quickstart-register-app.md#add-a-redirect-uri) in the Azure portal.

### Enable keychain access

To enable keychain access, make sure that your application has a keychain access group. You can set the keychain access group when you create your application by using the `WithIosKeychainSecurityGroup()` API.

To benefit from the cache and single sign-on (SSO), set the keychain access group to the same value in all of your applications.

This example of the setup uses MSAL 4.x:

```csharp
var builder = PublicClientApplicationBuilder
     .Create(ClientId)
     .WithIosKeychainSecurityGroup("com.microsoft.adalcache")
     .Build();
```

Also enable keychain access in the `Entitlements.plist` file. Use either the following access group or your own access group.

```xml
<dict>
  <key>keychain-access-groups</key>
  <array>
    <string>$(AppIdentifierPrefix)com.microsoft.adalcache</string>
  </array>
</dict>
```

When you use the `WithIosKeychainSecurityGroup()` API, MSAL automatically appends your security group to the end of the application's *team ID* (`AppIdentifierPrefix`). MSAL adds your security group because when you build your application in Xcode, it will do the same. That's why the entitlements in the `Entitlements.plist` file need to include `$(AppIdentifierPrefix)` before the keychain access group.

For more information, see the [iOS entitlements documentation](https://developer.apple.com/documentation/security/keychain_services/keychain_items/sharing_access_to_keychain_items_among_a_collection_of_apps).

#### Troubleshooting KeyChain access

If you get an error message similar to "The application cannot access the iOS keychain for the application publisher (the TeamId is null)", this means MSAL is not able to access the KeyChain. This is a configuration issue. To troubleshoot, try to access the KeyChain on your own, for example:

```csharp
var queryRecord = new SecRecord(SecKind.GenericPassword)
{
    Service = "",
    Account = "SomeTeamId",
    Accessible = SecAccessible.Always
};

SecRecord match = SecKeyChain.QueryAsRecord(queryRecord, out SecStatusCode resultCode);

if (resultCode == SecStatusCode.ItemNotFound)
{
    SecKeyChain.Add(queryRecord);
    match = SecKeyChain.QueryAsRecord(queryRecord, out resultCode);
}

// Make sure that  resultCode == SecStatusCode.Success
```

### Enable token cache sharing across iOS applications

Starting in MSAL 2.x, you can specify a keychain access group to persist the token cache across multiple applications. This setting enables you to share the token cache among several applications that have the same keychain access group. You can share the token cache among [ADAL.NET](https://aka.ms/adal-net) applications, MSAL.NET Xamarin.iOS applications, and native iOS applications that were developed in [ADAL.objc](https://github.com/AzureAD/azure-activedirectory-library-for-objc) or [MSAL.objc](https://github.com/AzureAD/microsoft-authentication-library-for-objc).

By sharing the token cache, you allow single sign-on (SSO) among all of the applications that use the same keychain access group.

To enable this cache sharing, use the `WithIosKeychainSecurityGroup()` method to set the keychain access group to the same value in all applications that share the same cache. The first code example in this article shows how to use the method.

Earlier in this article, you learned that MSAL adds `$(AppIdentifierPrefix)` whenever you use the `WithIosKeychainSecurityGroup()` API. MSAL adds this element because the team ID `AppIdentifierPrefix` ensures that only applications that are made by the same publisher can share keychain access.

> [!NOTE]
> The `KeychainSecurityGroup` property is deprecated. Use the `iOSKeychainSecurityGroup` property instead. The `TeamId` prefix is not required when you use `iOSKeychainSecurityGroup`.

### Use Microsoft Authenticator

Your application can use Microsoft Authenticator as a broker to enable:

- **SSO**: When you enable SSO, your users don't need to sign in to each application.
- **Device identification**: Use device identification to authenticate by accessing the device certificate. This certificate is created on the device when it's joined to the workplace. Your application will be ready if the tenant administrators enable Conditional Access related to the devices.
- **Application identification verification**: When an application calls the broker, it passes its redirect URL. The broker verifies the redirect URL.

For details about how to enable a broker, see [Use Microsoft Authenticator or Microsoft Intune Company Portal on Xamarin iOS and Android applications](msal-net-use-brokers-with-xamarin-apps.md).

## Known issues with iOS 12 and authentication

Microsoft released a [security advisory](https://github.com/aspnet/AspNetCore/issues/4647) about an incompatibility between iOS 12 and some types of authentication. The incompatibility breaks social, WSFed, and OIDC sign-ins. The security advisory helps you understand how to remove ASP.NET security restrictions from your applications to make them compatible with iOS 12.

When you develop MSAL.NET applications on Xamarin iOS, you might see an infinite loop when you try to sign in to websites from iOS 12. Such behavior is similar to this ADAL issue on GitHub: [Infinite loop when trying to login to website from iOS 12 #1329](https://github.com/AzureAD/azure-activedirectory-library-for-dotnet/issues/1329).

You might also see a break in ASP.NET Core OIDC authentication with iOS 12 Safari. For more information, see this [WebKit issue](https://bugs.webkit.org/show_bug.cgi?id=188165).

## Known issues with iOS 13 and authentication

If your app requires Conditional Access or certificate authentication support, enable your app to communicate with the Microsoft Authenticator broker app. MSAL is then responsible for handling requests and responses between your application and Microsoft Authenticator.

On iOS 13, Apple made a breaking API change by removing the application's ability to read the source application when receiving a response from an external application through custom URL schemes.

Apple's documentation for [UIApplicationOpenURLOptionsSourceApplicationKey](https://developer.apple.com/documentation/uikit/uiapplicationopenurloptionssourceapplicationkey?language=objc) states:

> *If the request originated from another app belonging to your team, UIKit sets the value of this key to the ID of that app. If the team identifier of the originating app is different than the team identifier of the current app, the value of the key is nil.*

This change is breaking for MSAL because it relied on `UIApplication.SharedApplication.OpenUrl` to verify communication between MSAL and the Microsoft Authenticator app.

Additionally, on iOS 13, the developer is required to provide a presentation controller when using `ASWebAuthenticationSession`.

Your app is impacted if you're building with Xcode 11 and you use either iOS broker or `ASWebAuthenticationSession`.

In such cases, use [MSAL.NET 4.4.0+](https://www.nuget.org/packages/Microsoft.Identity.Client/) to enable successful authentication.

### Additional requirements

- When using the latest MSAL libraries, ensure that **Microsoft Authenticator version 6.3.19+** is installed on the device.
- When updating to MSAL.NET 4.4.0+, update the your `LSApplicationQueriesSchemes` in the *Info.plist* file and add `msauthv3`:

    ```xml
    <key>LSApplicationQueriesSchemes</key>
    <array>
         <string>msauthv2</string>
         <string>msauthv3</string>
    </array>
    ```

    Adding `msauthv3` to *Info.plist* is necessary to detect the presence of the latest Microsoft Authenticator app on the device that supports iOS 13.

## Report an issue

If you have questions or would like to report an issue you've found in MSAL.NET, open an issue in the [`microsoft-authentication-library-for-dotnet`](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/issues) repository on GitHub.

## Next steps

For information about properties for Xamarin iOS, see the [iOS-specific considerations](https://github.com/Azure-Samples/active-directory-xamarin-native-v2/tree/master/1-Basic#ios-specific-considerations) paragraph of the following sample's README.md file:

Sample | Platform | Description
------ | -------- | -----------
[https://github.com/Azure-Samples/active-directory-xamarin-native-v2](https://github.com/azure-samples/active-directory-xamarin-native-v2) | Xamarin iOS, Android, Universal Windows Platform (UWP) | A Xamarin Forms app showcasing how to use MSAL.NET to authenticate work or school and Microsoft personal accounts with the Microsoft identity platform, and access the Microsoft Graph with the resulting token.

<!--- https://github.com/Azure-Samples/active-directory-xamarin-native-v2/blob/master/ReadmeFiles/Topology.png -->

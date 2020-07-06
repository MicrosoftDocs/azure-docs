---
title: Xamarin iOS considerations (MSAL.NET) | Azure
titleSuffix: Microsoft identity platform
description: Learn about considerations for using Xamarin iOS with Microsoft Authentication Library for .NET (MSAL.NET).
services: active-directory
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 07/16/2019
ms.author: marsma
ms.reviewer: saeeda
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn about considerations for using Xamarin iOS and MSAL.NET so I can decide if this platform meets my application development needs.
---

# Considerations for using Xamarin iOS with MSAL.NET
When you use Microsoft Authentication Library for .NET (MSAL.NET) on Xamarin iOS, you should: 

- Override and implement the `OpenUrl` function in `AppDelegate`.
- Enable keychain groups.
- Enable token cache sharing.
- Enable keychain access.
- Understand known issues with iOS 12 and authentication.

## Implement OpenUrl

Override the `OpenUrl` method of the `FormsApplicationDelegate` derived class and call `AuthenticationContinuationHelper.SetAuthenticationContinuationEventArgs`. Here's an example:

```csharp
public override bool OpenUrl(UIApplication app, NSUrl url, NSDictionary options)
{
    AuthenticationContinuationHelper.SetAuthenticationContinuationEventArgs(url);
    return true;
}
```

Also do the following tasks: 
* Define a URL scheme.
* Require permissions for your app to call another app.
* Have a specific form for the redirect URL.
* Register the redirect URL in the [Azure portal](https://portal.azure.com).

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

### Enable token cache sharing across iOS applications

Starting in MSAL 2.x, you can specify a keychain access group to persist the token cache across multiple applications. This setting enables you to share the token cache among several applications that have the same keychain access group. You can share the token cash among [ADAL.NET](https://aka.ms/adal-net) applications, MSAL.NET Xamarin.iOS applications, and native iOS applications that were developed in [ADAL.objc](https://github.com/AzureAD/azure-activedirectory-library-for-objc) or [MSAL.objc](https://github.com/AzureAD/microsoft-authentication-library-for-objc).

By sharing the token cache, you allow single sign-on (SSO) among all of the applications that use the same keychain access group.

To enable this cache sharing, use the `WithIosKeychainSecurityGroup()` method to set the keychain access group to the same value in all applications that share the same cache. The first code example in this article shows how to use the method.

Earlier in this article, you learned that MSAL adds `$(AppIdentifierPrefix)` whenever you use the `WithIosKeychainSecurityGroup()` API. MSAL adds this element because the team ID `AppIdentifierPrefix` ensures that only applications that are made by the same publisher can share keychain access.

> [!NOTE]
> The `KeychainSecurityGroup` property is deprecated.
> 
> Starting in MSAL 2.x, developers were forced to include the `TeamId` prefix when they used the `KeychainSecurityGroup` property. But starting in MSAL 2.7.x, when you use the new `iOSKeychainSecurityGroup` property, MSAL resolves the `TeamId` prefix during runtime. When you use this property, don't include the `TeamId` prefix in the value. The prefix is not required.
>
> Because the `KeychainSecurityGroup` property is obsolete, use the `iOSKeychainSecurityGroup` property.

### Use Microsoft Authenticator

Your application can use Microsoft Authenticator as a broker to enable:

- **SSO**: When you enable SSO, your users don't need to sign in to each application.
- **Device identification**: Use device identification to authenticate by accessing the device certificate. This certificate is created on the device when it's joined to the workplace. Your application will be ready if the tenant administrators enable conditional access related to the devices.
- **Application identification verification**: When an application calls the broker, it passes its redirect URL. The broker verifies the redirect URL.

For details about how to enable a broker, see [Use Microsoft Authenticator or Microsoft Intune Company Portal on Xamarin iOS and Android applications](msal-net-use-brokers-with-xamarin-apps.md).

## Known issues with iOS 12 and authentication
Microsoft released a [security advisory](https://github.com/aspnet/AspNetCore/issues/4647) about an incompatibility between iOS 12 and some types of authentication. The incompatibility breaks social, WSFed, and OIDC sign-ins. The security advisory helps developers understand how to remove ASP.NET security restrictions from their applications to make them compatible with iOS 12.  

When you develop MSAL.NET applications on Xamarin iOS, you might see an infinite loop when you try to sign in to websites from iOS 12. This behavior is similar to this [ADAL issue](https://github.com/AzureAD/azure-activedirectory-library-for-dotnet/issues/1329). 

You might also see a break in ASP.NET Core OIDC authentication with iOS 12 Safari. For more information, see this [WebKit issue](https://bugs.webkit.org/show_bug.cgi?id=188165).

## Next steps

For information about properties for Xamarin iOS, see the [iOS-specific considerations](https://github.com/Azure-Samples/active-directory-xamarin-native-v2/tree/master/1-Basic#ios-specific-considerations) paragraph of the following sample's README.md file:

Sample | Platform | Description
------ | -------- | -----------
[https://github.com/Azure-Samples/active-directory-xamarin-native-v2](https://github.com/azure-samples/active-directory-xamarin-native-v2) | Xamarin iOS, Android, Universal Windows Platform (UWP) | A simple Xamarin Forms app that shows how to use MSAL to authenticate Microsoft personal accounts and Azure AD via the Azure AD 2.0 endpoint. The app also shows how to use the resulting token to access Microsoft Graph.

<!--- https://github.com/Azure-Samples/active-directory-xamarin-native-v2/blob/master/ReadmeFiles/Topology.png -->
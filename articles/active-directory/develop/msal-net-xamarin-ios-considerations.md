---
title: Xamarin iOS considerations (MSAL.NET) | Azure
titleSuffix: Microsoft identity platform
description: Learn about specific considerations when using Xamarin iOS with the Microsoft Authentication Library for .NET (MSAL.NET).
services: active-directory
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 07/16/2019
ms.author: twhitney
ms.reviewer: saeeda
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn about specific considerations when using Xamarin iOS and MSAL.NET so I can decide if this platform meets my application development needs and requirements.
---

# Xamarin iOS-specific considerations with MSAL.NET
On Xamarin iOS, there are several considerations that you must take into account when using MSAL.NET

- [Known issues with iOS 12 and authentication](#known-issues-with-ios-12-and-authentication)
- [Override and implement the `OpenUrl` function in the `AppDelegate`](#implement-openurl)
- [Enable Keychain groups](#enable-keychain-access)
- [Enable token cache sharing](#enable-token-cache-sharing-across-ios-applications)
- [Enable Keychain access](#enable-keychain-access)

## Implement OpenUrl

First you need to override the `OpenUrl` method of the `FormsApplicationDelegate` derived class and call `AuthenticationContinuationHelper.SetAuthenticationContinuationEventArgs`.

```csharp
public override bool OpenUrl(UIApplication app, NSUrl url, NSDictionary options)
{
    AuthenticationContinuationHelper.SetAuthenticationContinuationEventArgs(url);
    return true;
}
```

You'll also need to define a URL scheme, require permissions for your app to call another app, have a specific form for the redirect URL, and register this redirect URL in the [Azure portal](https://portal.azure.com)

### Enable keychain access

To enable keychain access, your application must have a keychain access group.
You can set your keychain access group by using the `WithIosKeychainSecurityGroup()` api when creating your application as shown below:

To benefit from the cache and single sign-on, you need to set the keychain access group to the same value in all of your applications.

An example of this using MSAL v4.x would be:
```csharp
var builder = PublicClientApplicationBuilder
     .Create(ClientId)
     .WithIosKeychainSecurityGroup("com.microsoft.adalcache")
     .Build();
```

This change is *in addition* to enabling keychain access in the `Entitlements.plist` file, using either the below access group or your own:

```xml
<dict>
  <key>keychain-access-groups</key>
  <array>
    <string>$(AppIdentifierPrefix)com.microsoft.adalcache</string>
  </array>
</dict>
```

When you use the `WithIosKeychainSecurityGroup()` api, MSAL automatically appends your security group to the end of the application's *team ID* (AppIdentifierPrefix) because when you build your application using xcode, it will do the same. For more information, see [iOS entitlements documentation](https://developer.apple.com/documentation/security/keychain_services/keychain_items/sharing_access_to_keychain_items_among_a_collection_of_apps). That's why the entitlements need to include `$(AppIdentifierPrefix)` before the keychain access group in the `Entitlements.plist`.

### Enable token cache sharing across iOS applications

From MSAL 2.x, you can specify a Keychain Access Group to use for persisting the token cache across multiple applications. This setting enables you to share the token cache between several applications having the same keychain access group including those developed with [ADAL.NET](https://aka.ms/adal-net), MSAL.NET Xamarin.iOS applications, and native iOS applications developed with [ADAL.objc](https://github.com/AzureAD/azure-activedirectory-library-for-objc) or [MSAL.objc](https://github.com/AzureAD/microsoft-authentication-library-for-objc)).

Sharing the token cache allows single sign-on between all of the applications that use the same Keychain access Group.

To enable this cache sharing, you need to set the use the 'WithIosKeychainSecurityGroup()' method to set the keychain access group to the same value in all applications sharing the same cache as shown in the example above.

Earlier, it was mentioned that MSAL added the $(AppIdentifierPrefix) whenever you use the `WithIosKeychainSecurityGroup()` api. This is because the AppIdentifierPrefix or the "team ID" is used to ensure only applications made by the same publisher can share keychain access.

> [!NOTE]
> **The `KeychainSecurityGroup` property is deprecated.**
> 
> Previously, from MSAL 2.x, developers were forced to include the TeamId prefix when using the `KeychainSecurityGroup` property.
>
>  From MSAL 2.7.x, when using the new `iOSKeychainSecurityGroup` property, MSAL will resolve the TeamId prefix during runtime. When using this property, the value should not contain the TeamId prefix.
>  Use the new `iOSKeychainSecurityGroup` property, which does not require you to provide the TeamId, as the previous `KeychainSecurityGroup` property is now obsolete.

### Use Microsoft Authenticator

Your application can use Microsoft Authenticator (a broker) to enable:

- Single Sign On (SSO). Your users won't need to sign-in to each application.
- Device identification. By accessing the device certificate, which was created on the device when it was workplace joined. Your application will be ready if the tenant admins enable Conditional Access related to the devices.
- Application identification verification. When an application calls the broker, it passes its redirect url, and the broker verifies it.

For details on how to enable the broker, see [Use Microsoft Authenticator or Microsoft Intune company portal on Xamarin iOS and Android applications](msal-net-use-brokers-with-xamarin-apps.md).

### Sample illustrating Xamarin iOS specific properties

More details are provided in the [iOS Specific Considerations](https://github.com/azure-samples/active-directory-xamarin-native-v2#ios-specific-considerations) paragraph of the following sample's readme.md file:

Sample | Platform | Description
------ | -------- | -----------
[https://github.com/Azure-Samples/active-directory-xamarin-native-v2](https://github.com/azure-samples/active-directory-xamarin-native-v2) | Xamarin iOS, Android, UWP | A simple Xamarin Forms app showcasing how to use MSAL to authenticate MSA and Azure AD via the Azure AD V2.0 endpoint, and access the Microsoft Graph with the resulting token.

<!--- https://github.com/Azure-Samples/active-directory-xamarin-native-v2/blob/master/ReadmeFiles/Topology.png -->

## Known issues with iOS 12 and authentication
Microsoft has released a [security advisory](https://github.com/aspnet/AspNetCore/issues/4647) to provide information about an incompatibility between iOS12 and some types of authentication. The incompatibility breaks social, WSFed, and OIDC logins. This advisory also provides guidance on what developers can do to remove current security restrictions added by ASP.NET to their applications to become compatible with iOS12.  

When developing MSAL.NET applications on Xamarin iOS, you might see an infinite loop when trying to sign in to websites from iOS 12 (similar to this [ADAL issue](https://github.com/AzureAD/azure-activedirectory-library-for-dotnet/issues/1329)). 

You might also see a break in ASP.NET Core OIDC authentication with iOS 12 Safari as described in this [WebKit issue](https://bugs.webkit.org/show_bug.cgi?id=188165).

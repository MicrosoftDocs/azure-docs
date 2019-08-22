---
title: Initialize a MSAL client application (Microsoft Authentication Library for Android) | Azure
description: Learn how to configure and initialize your Android client app so that it can use the Microsoft Identity platform
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
ms.date: 07/30/2019
ms.author: twhitney
ms.reviewer: brianmel
ms.custom: aaddev
#Customer intent: As an Android app developer, I want to learn how to configure and initialize my Android client app so I can use the Microsoft identity platform
ms.collection: M365-identity-device-management
---

Overall:
- Preface material introducing app registration / portal
- Pulling down the JSON configuration for MSAL, documenting relevant fields inside of this config
- Creating an instance of PublicClientApplication in Single or Multiple Account Mode
- Some discussion of brokered vs non-brokered authentication (Brandon, suggest you weigh-in to determine what level of detail is appropriate here)

# Initialize client applications using MSAL.Android

This article describes the initialization and configuration that your app needs to do before it can use the Microsoft Authentication Library for Android (MSAL.Android).

## Prerequisites

Before you can use the MSAL.Android library, you need [register it](quickstart-register-app.md) so that your app can be integrated with the Microsoft identity platform. After registration, you may need the following information (which can be found in the Azure portal):

- The client ID (a string representing a GUID)
- The identity provider URL (named the instance) and the sign-in audience for your application. These two parameters are collectively known as the authority.
- The tenant ID if you are writing a line of business application solely for your organization (also named single-tenant application).
- The application secret (client secret string) or certificate (of type X509Certificate2) if it's a confidential client app.
- For web apps, and sometimes for public client apps (in particular when your app needs to use a broker), you'll have also set the redirectUri where the identity provider will contact back your application with the security tokens.

## Ways to initialize applications

There are many different ways to instantiate client applications.

### Initializing a public client application from code

The following code instantiates a public client application, signing-in users in the Microsoft Azure public cloud, with their work and school accounts, or their personal Microsoft accounts.

```csharp
IPublicClientApplication app = PublicClientApplicationBuilder.Create(clientId)
    .Build();
```

### Initializing a confidential client application from code

In the same way, the following code instantiates a confidential application (a Web app located at `https://myapp.azurewebsites.net`) handling tokens from users in the Microsoft Azure public cloud, with their work and school accounts, or their personal Microsoft accounts. The application is identified with the identity provider by sharing a client secret:

```csharp
string redirectUri = "https://myapp.azurewebsites.net";
IConfidentialClientApplication app = ConfidentialClientApplicationBuilder.Create(clientId)
    .WithClientSecret(clientSecret)
    .WithRedirectUri(redirectUri )
    .Build();
```

As you might know, in production, rather than using a client secret, you might want to share with Azure AD a certificate. The code would then be the following:

```csharp
IConfidentialClientApplication app = ConfidentialClientApplicationBuilder.Create(clientId)
    .WithCertificate(certificate)
    .WithRedirectUri(redirectUri )
    .Build();
```

### Initializing a public client application from configuration options

The following code instantiates a public client application from a configuration object, which could be filled-in programmatically or read from a configuration file:

```csharp
PublicClientApplicationOptions options = GetOptions(); // your own method
IPublicClientApplication app = PublicClientApplicationBuilder.CreateWithApplicationOptions(options)
    .Build();
```

### Initializing a confidential client application from configuration options

The same kind of pattern applies to confidential client applications. You can also add other parameters using `.WithXXX` modifiers (here a certificate).

```csharp
ConfidentialClientApplicationOptions options = GetOptions(); // your own method
IConfidentialClientApplication app = ConfidentialClientApplicationBuilder.CreateWithApplicationOptions(options)
    .WithCertificate(certificate)
    .Build();
```

## Builder modifiers

In the code snippets using application builders, a number of `.With` methods can be applied as modifiers (for example, `.WithCertificate` and `.WithRedirectUri`). 

### Modifiers common to public and confidential client applications

The modifiers you can set on a public client or confidential client application builder are:

|Parameter | Description|
|--------- | --------- |
|`.WithAuthority()` 7 overrides | Sets the application default authority to an Azure AD authority, with the possibility of choosing the Azure Cloud, the audience, the tenant (tenant ID or domain name), or providing directly the authority URI.|
|`.WithAdfsAuthority(string)` | Sets the application default authority to be an ADFS authority.|
|`.WithB2CAuthority(string)` | Sets the application default authority to be an Azure AD B2C authority.|
|`.WithClientId(string)` | Overrides the client ID.|
|`.WithComponent(string)` | Sets the name of the library using MSAL.NET (for telemetry reasons). |
|`.WithDebugLoggingCallback()` | If called, the application will call `Debug.Write` simply enabling debugging traces. See [Logging](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki/logging) for more information.|
|`.WithExtraQueryParameters(IDictionary<string,string> eqp)` | Set the application level extra query parameters that will be sent in all authentication request. This is overridable at each token acquisition method level (with the same `.WithExtraQueryParameters pattern`).|
|`.WithHttpClientFactory(IMsalHttpClientFactory httpClientFactory)` | Enables advanced scenarios such as configuring for an HTTP proxy, or to force MSAL to use a particular HttpClient (for instance in ASP.NET Core web apps/APIs).|
|`.WithLogging()` | If called, the application will call a callback with debugging traces. See [Logging](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki/logging) for more information.|
|`.WithRedirectUri(string redirectUri)` | Overrides the default redirect URI. In the case of public client applications, this will be useful for scenarios involving the broker.|
|`.WithTelemetry(TelemetryCallback telemetryCallback)` | Sets the delegate used to send telemetry.|
|`.WithTenantId(string tenantId)` | Overrides the tenant ID, or the tenant description.|

### Modifiers specific to Xamarin.iOS applications

The modifiers you can set on a public client application builder on Xamarin.iOS are:

|Parameter | Description|
|--------- | --------- |
|`.WithIosKeychainSecurityGroup()` | **Xamarin.iOS only**: Sets the iOS key chain security group (for the cache persistence).|

### Modifiers specific to confidential client applications

The modifiers you can set on a confidential client application builder are:

|Parameter | Description|
|--------- | --------- |
|`.WithCertificate(X509Certificate2 certificate)` | Sets the certificate identifying the application with Azure AD.|
|`.WithClientSecret(string clientSecret)` | Sets the client secret (app password) identifying the application with Azure AD.|

These modifiers are mutually exclusive. If you provide both, MSAL will throw a meaningful exception.

### Example of usage of modifiers

Let's assume that your application is a line-of-business application, which is only for your organization. Then you can write:

```csharp
IPublicClientApplication app;
app = PublicClientApplicationBuilder.Create(clientId)
        .WithAadAuthority(AzureCloudInstance.AzurePublic, tenantId)
        .Build();
```

Where it becomes interesting is that programming for national clouds has now simplified. If you want your application to be a multi-tenant application in a national cloud, you could write, for instance:

```csharp
IPublicClientApplication app;
app = PublicClientApplicationBuilder.Create(clientId)
        .WithAadAuthority(AzureCloudInstance.AzureUsGovernment, AadAuthorityAudience.AzureAdMultipleOrgs)
        .Build();
```

There is also an override for ADFS (ADFS 2019 is currently not supported):
```csharp
IPublicClientApplication app;
app = PublicClientApplicationBuilder.Create(clientId)
        .WithAdfsAuthority("https://consoso.com/adfs")
        .Build();
```

Finally, if you are an Azure AD B2C developer, you can specify your tenant like this:

```csharp
IPublicClientApplication app;
app = PublicClientApplicationBuilder.Create(clientId)
        .WithB2CAuthority("https://fabrikamb2c.b2clogin.com/tfp/{tenant}/{PolicySignInSignUp}")
        .Build();
```

JTW: See the [android tutorial]
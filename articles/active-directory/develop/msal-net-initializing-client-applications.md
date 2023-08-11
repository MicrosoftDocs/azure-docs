---
title: Initialize MSAL.NET client applications
description: Learn about initializing public client and confidential client applications using the Microsoft Authentication Library for .NET (MSAL.NET).
services: active-directory
author: Dickson-Mwendia
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 12/19/2022
ms.author: dmwendia
ms.reviewer: saeeda
ms.custom: devx-track-csharp, aaddev, engagement-fy23, devx-track-dotnet
#Customer intent: As an application developer, I want to learn about initializing client applications so I can decide if this platform meets my application development needs and requirements.
---

# Initialize client applications using MSAL.NET

This article describes initializing public client and confidential client applications using the Microsoft Authentication Library for .NET (MSAL.NET).  To learn more about the client application types, see [Public client and confidential client applications](msal-client-applications.md).

With MSAL.NET 3.x, the recommended way to instantiate an application is by using the application builders: `PublicClientApplicationBuilder` and `ConfidentialClientApplicationBuilder`. They offer a powerful mechanism to configure the application from the code, a configuration file, or even by mixing both approaches.

## Prerequisites

Before initializing an application, you first need to register it so that your app can be integrated with the Microsoft identity platform. Refer to the [Quickstart: Register an application with the Microsoft identity platform](quickstart-register-app.md) for more information. After registration, you may need the following information (which can be found in the Azure portal):

- **Application (client) ID** - This is a string representing a GUID.
- **Directory (tenant) ID** - Provides identity and access management (IAM) capabilities to applications and resources used by your organization. It can specify if you're writing a line of business application solely for your organization (also named single-tenant application).
- The identity provider URL (named the **instance**) and the sign-in audience for your application. These two parameters are collectively known as the authority.
- **Client credentials** - which can take the form of an application secret (client secret string) or certificate (of type `X509Certificate2`) if it's a confidential client app.
- For web apps, and sometimes for public client apps (in particular when your app needs to use a broker), you'll have also set the **Redirect URI** where the identity provider will contact back your application with the security tokens.

## Initializing applications

There are many different ways to instantiate client applications.

### Initializing a public client application from code

The following code instantiates a public client application, signing-in users in the Microsoft Azure public cloud, with their work, school or personal Microsoft accounts.

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

In production however, certificates are recommended as they're more secure than client secrets. They can be created and uploaded to the Azure portal. The code would then be the following:

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

The same kind of pattern applies to confidential client applications. You can also add other parameters using `.WithXXX` modifiers. This example uses `.WithCertificate`.

```csharp
ConfidentialClientApplicationOptions options = GetOptions(); // your own method
IConfidentialClientApplication app = ConfidentialClientApplicationBuilder.CreateWithApplicationOptions(options)
    .WithCertificate(certificate)
    .Build();
```

## Builder modifiers

In the code snippets using application builders, many `.With` methods can be applied as modifiers (for example, `.WithCertificate` and `.WithRedirectUri`). 

### Modifiers common to public and confidential client applications

The modifiers you can set on a public client or confidential client application builder can be found in the `AbstractApplicationBuilder<T>` class. The different methods can be found in the [Azure SDK for .NET documentation](/dotnet/api/microsoft.identity.client.abstractapplicationbuilder-1).

### Modifiers specific to Xamarin.iOS applications

The modifiers you can set on a public client application builder on Xamarin.iOS are:

|Modifier | Description|
|--------- | --------- |
|`.WithIosKeychainSecurityGroup()` | **Xamarin.iOS only**: Sets the iOS key chain security group (for the cache persistence).|

### Modifiers specific to confidential client applications

The modifiers you can set that are specific to a confidential client application builder can be found in the `ConfidentialClientApplicationBuilder` class. The different methods can be found in the [Azure SDK for .NET documentation](/dotnet/api/microsoft.identity.client.confidentialclientapplicationbuilder). 

Modifiers such as `.WithCertificate(X509Certificate2 certificate)` and `.WithClientSecret(string clientSecret)` are mutually exclusive. If you provide both, MSAL will throw a meaningful exception.

### Example of usage of modifiers

Let's assume that your application is a line-of-business application, which is only for your organization. Then you can write:

```csharp
IPublicClientApplication app;
app = PublicClientApplicationBuilder.Create(clientId)
        .WithAuthority(AzureCloudInstance.AzurePublic, tenantId)
        .Build();
```

Programming for national clouds has simplified, so if you want your application to be a multi-tenant application in a national cloud, you could write, for instance:

```csharp
IPublicClientApplication app;
app = PublicClientApplicationBuilder.Create(clientId)
        .WithAuthority(AzureCloudInstance.AzureUsGovernment, AadAuthorityAudience.AzureAdMultipleOrgs)
        .Build();
```

There's also an override for ADFS (MSAL.NET will only support ADFS 2019 or later):

```csharp
IPublicClientApplication app;
app = PublicClientApplicationBuilder.Create(clientId)
        .WithAdfsAuthority("https://consoso.com/adfs")
        .Build();
```

Finally, if you're an Azure AD B2C developer, you can specify your tenant like this:

```csharp
IPublicClientApplication app;
app = PublicClientApplicationBuilder.Create(clientId)
        .WithB2CAuthority("https://fabrikamb2c.b2clogin.com/tfp/{tenant}/{PolicySignInSignUp}")
        .Build();
```

## See also

[API reference documentation](/dotnet/api/microsoft.identity.client) 

[Package on NuGet](https://www.nuget.org/packages/Microsoft.Identity.Client/)

[Library source code](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet) 

[Code samples](sample-v2-code.md)

## Next steps

After you've initialized the client application, your next task is to add support for user sign-in, authorized API access, or both.

Our application scenario documentation provides guidance for signing in a user and acquiring an access token to access an API on behalf of that user:

- [Web app that signs in users: Sign-in and sign-out](scenario-web-app-sign-user-sign-in.md)
- [Web app that calls web APIs: Acquire a token](scenario-web-app-call-api-acquire-token.md)

---
title: Daemon app calling web APIs (app configuration) - Microsoft identity platform
description: Learn how to build a daemon app that calls web APIs (app configuration)
services: active-directory
documentationcenter: dev-center-name
author: jmprieur
manager: CelesteDG
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/07/2019
ms.author: jmprieur
ms.custom: aaddev 
#Customer intent: As an application developer, I want to know how to write a daemon app that can call web APIs using the Microsoft identity platform for developers.
ms.collection: M365-identity-device-management
---

# Daemon app that calls web APIs - code configuration

Learn how to configure the code for your daemon application that calls web APIs.

## MSAL Libraries supporting daemon apps

The Microsoft libraries supporting daemon apps are:

  MSAL library | Description
  ------------ | ----------
  ![MSAL.NET](media/sample-v2-code/logo_NET.png) <br/> MSAL.NET  | Supported platforms to build a daemon application are .NET Framework and .NET Core platforms (not UWP, Xamarin.iOS, and Xamarin.Android as those platforms are used to build public client applications)
  ![Python](media/sample-v2-code/logo_python.png) <br/> MSAL.Python | Development in progress - in public preview
  ![Java](media/sample-v2-code/logo_java.png) <br/> MSAL.Java | Development in progress - in public preview

## Configuration of the Authority

Given that the daemon applications don't use delegated permissions, but application permissions, their *supported account type* cannot be *Accounts in any organizational directory and personal Microsoft accounts (for example, Skype, Xbox, Outlook.com)*. Indeed, there is no tenant admin to grant consent to the daemon application for Microsoft personal accounts. You'll need to choose *accounts in my organization* or *accounts in any organization*.

Therefore the authority specified in the application configuration should be tenant-ed (specifying a Tenant ID or a domain name associated with your organization).

If you are an ISV and want to provide a multi-tenant tool, you can use `organizations`. But keep in mind that you will also need to explain to your customers how to grant admin consent. See [Requesting consent for an entire tenant](v2-permissions-and-consent.md#requesting-consent-for-an-entire-tenant) for details. Also there is currently a limitation in MSAL that `organizations` is only allowed when the client credentials are an application secret (not a certificate). See [MSAL.NET bug #891](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/issues/891)

## Application configuration and instantiation

In MSAL libraries, the client credentials (secret or certificate) are passed as a parameter of the confidential client application construction.

> [!IMPORTANT]
> Even if your application is a console application running as a service, if it's a daemon application it needs to be a confidential client application.

### MSAL.NET

Add the [Microsoft.IdentityClient](https://www.nuget.org/packages/Microsoft.Identity.Client) NuGet package to your application.

Use MSAL.NET namespace

```CSharp
using Microsoft.Identity.Client;
```

The daemon application will be presented by an `IConfidentialClientApplication`

```CSharp
IConfidentialClientApplication app;
```

Here is the code to build an application with an application secret:

```CSharp
app = ConfidentialClientApplicationBuilder.Create(config.ClientId)
           .WithClientSecret(config.ClientSecret)
           .WithAuthority(new Uri(config.Authority))
           .Build();
```

Here is the code to build an application with a certificate:

```CSharp
X509Certificate2 certificate = ReadCertificate(config.CertificateName);
app = ConfidentialClientApplicationBuilder.Create(config.ClientId)
    .WithCertificate(certificate)
    .WithAuthority(new Uri(config.Authority))
    .Build();
```

### MSAL.Python

```Python
# Create a preferably long-lived app instance which maintains a token cache.

app = msal.ConfidentialClientApplication(
    config["client_id"], authority=config["authority"],
    client_credential=config["secret"],
    # token_cache=...  # Default cache is in memory only.
                       # You can learn how to use SerializableTokenCache from
                       # https://msal-python.rtfd.io/en/latest/#msal.SerializableTokenCache

    )
```

### MSAL.Java

```Java
PrivateKey key = getPrivateKey();
X509Certificate publicCertificate = getPublicCertificate();

// create clientCredential with public and private key
IClientCredential credential = ClientCredentialFactory.create(key, publicCertificate);

ConfidentialClientApplication cca = ConfidentialClientApplication
  .builder(CLIENT_ID, credential)
  .authority(AUTHORITY_MICROSOFT)
  .build();
```

## Next steps

> [!div class="nextstepaction"]
> [Daemon app - acquiring tokens for the app](./scenario-daemon-acquire-token.md)
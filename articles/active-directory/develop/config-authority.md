---
title: Configure a MSAL for iOS and macOS to use different identity providers | Microsoft identity platform
description: Learn how to use different authorities such as B2C, sovereign clouds, and guest users, with MSAL for iOS and macOS.
services: active-directory
documentationcenter: ''
author: tylermsft
manager: CelesteDG
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 08/20/2019
ms.author: twhitney
ms.reviewer: ''
ms.custom: aaddev
ms.collection: M365-identity-device-management
---

# How to: Configure MSAL for iOS and macOS to use different identity providers

This article will show you how to configure your Microsoft authentication library app for iOS and macOS (MSAL) for different authorities such as Azure Active Directory (Azure AD), business-to-consumer (B2C), sovereign clouds, and guest users.  Throughout this article, you can generally think of an authority as an identity provider.

## Default authority configuration

`MSALPublicClientApplication` is configured with a default authority URL of `https://login.microsoftonline.com/common`, which is suitable for most Azure Active Directory (AAD) scenarios. Unless you're implementing advanced scenarios, or working with B2C, you won't need to change it.

> [!NOTE]
> Active Directory Federation Service (AD FS) is currently not supported.

## Change the default authority

In some scenarios, such as business-to-consumer (B2C), you may need to change the default authority.

### B2C

To work with B2C, the [Microsoft Authentication Library (MSAL)](reference-v2-libraries.md) requires a different authority configuration. MSAL supports one authority URL format for B2C unless the authority is declared as a known authority. The supported format is `https://<host>/tfp/<tenant>/<policy>`, for example `https://login.microsoftonline.com/tfp/contoso.onmicrosoft.com/B2C_1_SignInPolicy`.

To support an arbitrary URL format for B2C, add it to `@property MSALAuthority *authority` in `MSALPublicClientApplicationConfig` before creating MSALPublicClientApplication. For example:

```ObjC

    // Create authority
    MSALB2CAuthority *b2cAuthority = [MSALB2CAuthority initWithURL:[NSURL URLWithString:@"your url"] error:&initError];

    // Create MSALPublicClientApplication configuration
    MSALPublicClientApplicationConfig *b2cApplicationConfig = [[MSALPublicClientApplicationConfig alloc]
                                                                   initWithClientId:@"your-client-id"
                                                                   redirectUri:@"your-redirect-uri"
                                                                   authority:b2cAuthority];

    // Initialize MSALPublicClientApplication
    MSALPublicClientApplication *b2cApplication =
    [[MSALPublicClientApplication alloc] initWithConfiguration:b2cApplicationConfig error:&error];
```

When your app requests a new policy, the authority URL needs to be changed because the authority URL is different for each policy. To configure a B2C application, create an instance of `MSALB2CAuthority` and pass it to the MSALPublicClientApplication, like this: 

```ObjC
    // Create B2C authority URL
    NSURL *authorityURL = [NSURL URLWithString:@"https://login.microsoftonline.com/tfp/contoso.onmicrosoft.com/B2C_1_SignInPolicy"];
    
    MSALB2CAuthority *b2cAuthority = [[MSALB2CAuthority alloc] initWithURL:authorityURL
                                                                     error:&b2cAuthorityError];
    if (!b2cAuthority)
    {
        // Handle error
        return;
    }
    
    // Create MSALPublicClientApplication configuration
    MSALPublicClientApplicationConfig *b2cApplicationConfig = [[MSALPublicClientApplicationConfig alloc]
                                                                   initWithClientId:@"your-client-id"
                                                                   redirectUri:@"your-redirect-uri"
                                                                   authority:b2cAuthority];

    // Initialize MSALPublicClientApplication
    MSALPublicClientApplication *b2cApplication =
    [[MSALPublicClientApplication alloc] initWithConfiguration:b2cApplicationConfig error:&error];
    
    if (!b2cApplication)
    {
        // Handle error
        return;
    }
```

### Sovereign clouds

If your app runs in a sovereign cloud, you may need to change the authority URL in the `MSALPublicClientApplication`. The following example sets the authority URL to work with the German AAD cloud:

```objc
    NSURL *authorityURL = [NSURL URLWithString:@"https://login.microsoftonline.de/common"];
    MSALAuthority *sovereignAuthority = [MSALAuthority authorityWithURL:authorityURL error:&authorityError];
    
    if (!sovereignAuthority)
    {
        // Handle error
        return;
    }
    
    MSALPublicClientApplicationConfig *b2cApplicationConfig = [[MSALPublicClientApplicationConfig alloc]
                                                               initWithClientId:@"your-client-id"
                                                               redirectUri:@"your-redirect-uri"
                                                               authority:sovereignAuthority];
    
    
    MSALPublicClientApplication *sovereignApplication = [[MSALPublicClientApplication alloc] initWithConfiguration:b2cApplicationConfig error:&error];
    
    
    if (!sovereignApplication)
    {
        // Handle error
        return;
    }
```

You may need to pass different scopes to each sovereign cloud. Which scopes to send depends on the resource that you're using. For example, you might use `"https://graph.microsoft.com/user.read"` in worldwide cloud, and `"https://graph.microsoft.de/user.read"` in German cloud.

### Signing a user into a specific tenant

When the authority URL is set to `"common"`, the user will be signed into their home tenant. However, some apps may need to sign the user into a different tenant and some apps only work with a single tenant.

To sign the user into a specific tenant, configure `MSALPublicClientApplication` with a specific authority.  MSAL doesn't currently support authorities with tenant names so use an authority with GUID tenant ID instead. For example:

**Correct:** `https://login.microsoftonline.com/469fdeb4-d4fd-4fde-991e-308a78e4bea4`
**Incorrect:** `https://login.microsoftonline.com/contoso.com`

The following shows how to sign a user into a specific tenant:

```objc
    NSURL *authorityURL = [NSURL URLWithString:@"https://login.microsoftonline.com/469fdeb4-d4fd-4fde-991e-308a78e4bea4"];
    MSALAuthority *tenantedAuthority = [MSALAuthority authorityWithURL:authorityURL error:&authorityError];
    
    if (!tenantedAuthority)
    {
        // Handle error
        return;
    }
    
    MSALPublicClientApplicationConfig *b2cApplicationConfig = [[MSALPublicClientApplicationConfig alloc]
                                                               initWithClientId:@"your-client-id"
                                                               redirectUri:@"your-redirect-uri"
                                                               authority:tenantedAuthority];
    
    MSALPublicClientApplication *application =
    [[MSALPublicClientApplication alloc] initWithConfiguration:b2cApplicationConfig error:&error];
    
    if (!application)
    {
        // Handle error
        return;
    }
```

## Supported authorities

### MSALAuthority

The `MSALAuthority` class is the base abstract class for the MSAL authority classes. Don't try to create instance of it. Instead either create one of its subclasses directly (`MSALAADAuthority`, `MSALADFSAuthority`, `MSALB2CAuthority`) or use the factory method `authorityWithURL:error:` to create subclasses using an authority URL.

Use the `url` property to get a normalized authority URL. Extra parameters and path components or fragments that are not part of authority won't be in the returned normalized authority URL.

The following are subclasses of `MSALAuthority` that you can instantiate depending on the authority want to use.

### MSALAADAuthority

`MSALAADAuthority` represents an AAD authority. The authority url should be in the following format, where `<port>` is optional: `https://<host>:<port>/<tenant>`

### MSALB2CAuthority

`MSALB2CAuthority` represents a B2C authority. The authority url should be in the following format, where `<port>` is optional: `https://<host>:<port>/tfp/<tenant>/<policy>`

### MSALADFSAuthority

`MSALADFSAuthority` represents an Active Directory Federation Service (AD FS) authority. The authority url should be in the following format, where `<port>` is optional: `https://<host>:<port>/adfs`

> [!IMPORTANT]
> AD FS is not supported.

An arbitrary URL can be used if it's declared as a known authority in `MSALPublicClientApplicationConfiguration`.

## Next steps

Learn more about [Authentication flows and application scenarios](authentication-flows-app-scenarios.md)

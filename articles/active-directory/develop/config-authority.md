---
title: Configure identity providers (MSAL iOS/macOS)
description: Learn how to use different authorities such as B2C, sovereign clouds, and guest users, with MSAL for iOS and macOS.
services: active-directory
author: cilwerner
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: conceptual
ms.date: 05/09/2023
ms.author: cwerner
ms.reviewer: oldalton
ms.custom: aaddev
---

# Configure MSAL for iOS and macOS to use different identity providers

This article will show you how to configure your Microsoft Authentication Library app for iOS and macOS (MSAL) for different authorities such as Microsoft Entra ID, Business-to-Consumer (B2C), sovereign clouds, and guest users.  Throughout this article, you can generally think of an authority as an identity provider.

## Default authority configuration

`MSALPublicClientApplication` is configured with a default authority URL of `https://login.microsoftonline.com/common`, which is suitable for most Microsoft Entra scenarios. Unless you're implementing advanced scenarios like national clouds, or working with B2C, you won't need to change it.

> [!NOTE]
> Modern authentication with Active Directory Federation Services as identity provider (ADFS) is not supported (see [ADFS for Developers](/windows-server/identity/ad-fs/overview/ad-fs-openid-connect-oauth-flows-scenarios) for details). ADFS is supported through federation.

## Change the default authority

In some scenarios, such as business-to-consumer (B2C), you may need to change the default authority.

### B2C

To work with B2C, the [Microsoft Authentication Library (MSAL)](reference-v2-libraries.md) requires a different authority configuration. MSAL recognizes one authority URL format as B2C by itself. The recognized B2C authority format is `https://<host>/tfp/<tenant>/<policy>`, for example `https://login.microsoftonline.com/tfp/contoso.onmicrosoft.com/B2C_1_SignInPolicy`. However, you can also use any other supported B2C authority URLs by declaring authority as B2C authority explicitly.

To support an arbitrary URL format for B2C, `MSALB2CAuthority` can be set with an arbitrary URL, like this:

Objective-C
```objc
NSURL *authorityURL = [NSURL URLWithString:@"arbitrary URL"];
MSALB2CAuthority *b2cAuthority = [[MSALB2CAuthority alloc] initWithURL:authorityURL
                                                                     error:&b2cAuthorityError];
```
Swift
```swift
guard let authorityURL = URL(string: "arbitrary URL") else {
    // Handle error
    return
}
let b2cAuthority = try MSALB2CAuthority(url: authorityURL)
```

All B2C authorities that don't use the default B2C authority format must be declared as known authorities.

Add each different B2C authority to the known authorities list even if authorities only differ in policy.

Objective-C
```objc
MSALPublicClientApplicationConfig *b2cApplicationConfig = [[MSALPublicClientApplicationConfig alloc]
                                                               initWithClientId:@"your-client-id"
                                                               redirectUri:@"your-redirect-uri"
                                                               authority:b2cAuthority];
b2cApplicationConfig.knownAuthorities = @[b2cAuthority];
```
Swift
```swift
let b2cApplicationConfig = MSALPublicClientApplicationConfig(clientId: "your-client-id", redirectUri: "your-redirect-uri", authority: b2cAuthority)
b2cApplicationConfig.knownAuthorities = [b2cAuthority]
```

When your app requests a new policy, the authority URL needs to be changed because the authority URL is different for each policy. 

To configure a B2C application, set `@property MSALAuthority *authority` with an instance of `MSALB2CAuthority` in `MSALPublicClientApplicationConfig` before creating `MSALPublicClientApplication`, like this:

Objective-C
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
Swift
```swift
do{
    // Create B2C authority URL
    guard let authorityURL = URL(string: "https://login.microsoftonline.com/tfp/contoso.onmicrosoft.com/B2C_1_SignInPolicy") else {
        // Handle error
        return
    }
    let b2cAuthority = try MSALB2CAuthority(url: authorityURL)

    // Create MSALPublicClientApplication configuration
    let b2cApplicationConfig = MSALPublicClientApplicationConfig(clientId: "your-client-id", redirectUri: "your-redirect-uri", authority: b2cAuthority)

    // Initialize MSALPublicClientApplication
    let b2cApplication = try MSALPublicClientApplication(configuration: b2cApplicationConfig)
} catch {
    // Handle error
}
```

### Sovereign clouds

If your app runs in a sovereign cloud, you may need to change the authority URL in the `MSALPublicClientApplication`. The following example sets the authority URL to work with the German Microsoft Entra cloud:

Objective-C
```objc
    NSURL *authorityURL = [NSURL URLWithString:@"https://login.microsoftonline.de/common"];
    MSALAuthority *sovereignAuthority = [MSALAuthority authorityWithURL:authorityURL error:&authorityError];
    
    if (!sovereignAuthority)
    {
        // Handle error
        return;
    }
    
    MSALPublicClientApplicationConfig *applicationConfig = [[MSALPublicClientApplicationConfig alloc]
                                                               initWithClientId:@"your-client-id"
                                                               redirectUri:@"your-redirect-uri"
                                                               authority:sovereignAuthority];
    
    
    MSALPublicClientApplication *sovereignApplication = [[MSALPublicClientApplication alloc] initWithConfiguration:applicationConfig error:&error];
    
    
    if (!sovereignApplication)
    {
        // Handle error
        return;
    }
```
Swift
```swift
do{
    guard let authorityURL = URL(string: "https://login.microsoftonline.de/common") else {
        //Handle error
        return
    }
    let sovereignAuthority = try MSALAuthority(url: authorityURL)
            
    let applicationConfig = MSALPublicClientApplicationConfig(clientId: "your-client-id", redirectUri: "your-redirect-uri", authority: sovereignAuthority)
            
    let sovereignApplication = try MSALPublicClientApplication(configuration: applicationConfig)
} catch {
    // Handle error
}
```

You may need to pass different scopes to each sovereign cloud. Which scopes to send depends on the resource that you're using. For example, you might use `"https://graph.microsoft.com/user.read"` in worldwide cloud, and `"https://graph.microsoft.de/user.read"` in German cloud.

### Signing a user into a specific tenant

When the authority URL is set to `"login.microsoftonline.com/common"`, the user will be signed into their home tenant. However, some apps may need to sign the user into a different tenant and some apps only work with a single tenant.

To sign the user into a specific tenant, configure `MSALPublicClientApplication` with a specific authority. For example:

`https://login.microsoftonline.com/dddd5555-eeee-6666-ffff-00001111aaaa`

If you want to sign into the Contoso tenant, use;

`https://login.microsoftonline.com/contoso.onmicrosoft.com`

The following shows how to sign a user into the Contoso tenant:

Objective-C
```objc
    NSURL *authorityURL = [NSURL URLWithString:@"https://login.microsoftonline.com/contoso.onmicrosoft.com"];
    MSALAADAuthority *tenantedAuthority = [[MSALAADAuthority alloc] initWithURL:authorityURL error:&authorityError];
    
    if (!tenantedAuthority)
    {
        // Handle error
        return;
    }
    
    MSALPublicClientApplicationConfig *applicationConfig = [[MSALPublicClientApplicationConfig alloc]
                                                               initWithClientId:@"your-client-id"
                                                               redirectUri:@"your-redirect-uri"
                                                               authority:tenantedAuthority];
    
    MSALPublicClientApplication *application =
    [[MSALPublicClientApplication alloc] initWithConfiguration:applicationConfig error:&error];
    
    if (!application)
    {
        // Handle error
        return;
    }
```
Swift
```swift
do{
    guard let authorityURL = URL(string: "https://login.microsoftonline.com/contoso.onmicrosoft.com") else {
        //Handle error
        return
    }    
    let tenantedAuthority = try MSALAADAuthority(url: authorityURL)
            
    let applicationConfig = MSALPublicClientApplicationConfig(clientId: "your-client-id", redirectUri: "your-redirect-uri", authority: tenantedAuthority)
            
    let application = try MSALPublicClientApplication(configuration: applicationConfig)
} catch {
    // Handle error
}
```

## Supported authorities

### MSALAuthority

The `MSALAuthority` class is the base abstract class for the MSAL authority classes. Don't try to create instance of it using `alloc` or `new`. Instead, either create one of its subclasses directly (`MSALAADAuthority`, `MSALB2CAuthority`) or use the factory method `authorityWithURL:error:` to create subclasses using an authority URL.

Use the `url` property to get a normalized authority URL. Extra parameters and path components or fragments that aren't part of authority won't be in the returned normalized authority URL.

The following are subclasses of `MSALAuthority` that you can instantiate depending on the authority want to use.

### MSALAADAuthority

`MSALAADAuthority` represents a Microsoft Entra authority. The authority URL should be in the following format, where `<port>` is optional: `https://<host>:<port>/<tenant>`

### MSALB2CAuthority

`MSALB2CAuthority` represents a B2C authority. By default, the B2C authority URL should be in the following format, where `<port>` is optional: `https://<host>:<port>/tfp/<tenant>/<policy>`. However, MSAL also supports other arbitrary B2C authority formats.

## Next steps

Learn more about [Authentication flows and application scenarios](authentication-flows-app-scenarios.md)

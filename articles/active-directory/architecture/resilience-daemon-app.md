---
title: Increase the resilience of authentication and authorization in daemon applications you develop
description: Learn to increase authentication and authorization resiliency in daemon application using the Microsoft identity platform 
services: active-directory 
ms.service: active-directory
ms.subservice: fundamentals 
ms.workload: identity
ms.topic: how-to
author: jricketts
ms.author: jricketts
manager: martinco
ms.date: 03/03/2023
---

# Increase the resilience of authentication and authorization in daemon applications you develop

Learn to use the Microsoft identity platform and Microsoft Entra ID to increase the resilience of daemon applications. Find information about background processes, services, server to server apps, and applications without users.

See, [What is the Microsoft identity platform?](../develop/v2-overview.md)

The following diagram illustrates a daemon application making a call to Microsoft identity platform.

   ![A daemon application making a call to Microsoft identity platform.](media/resilience-daemon-app/calling-microsoft-identity.png)

## Managed identities for Azure resources

If you're building daemon apps on Microsoft Azure, use managed identities for Azure resources, which handle secrets and credentials. The feature improves resilience by handling certificate expiry, rotation, or trust. 

See, [What are managed identities for Azure resources?](../managed-identities-azure-resources/overview.md)

Managed identities use long-lived access tokens and information from Microsoft identity platform to acquire new tokens before tokens expire. Your app runs while acquiring new tokens.

Managed identities use regional endpoints, which help prevent out-of-region failures by consolidating service dependencies. Regional endpoints help keep traffic in a geographical area. For example, if your Azure resource is in WestUS2, all traffic stays in WestUS2. 

## Microsoft Authentication Library

If you develop daemon apps and don't use managed identities, use the Microsoft Authentication Library (MSAL) for authentication and authorization. MSAL eases the process of providing client credentials. For example, your application doesn't need to create and sign JSON web token assertions with certificate-based credentials.

See, [Overview of the Microsoft Authentication Library (MSAL)](../develop/msal-overview.md)

### Microsoft.Identity.Web for .NET developers

If you develop daemon apps on ASP.NET Core, use the Microsoft.Identity.Web library to ease authorization. It includes distributed token cache strategies for distributed apps that run in multiple regions.

Learn more:

* [Microsoft Identity Web authentication library](../develop/microsoft-identity-web.md)
* [Distributed token cache](https://github.com/AzureAD/microsoft-identity-web/wiki/token-cache-serialization#distributed-token-cache)

## Cache and store tokens

If you don't use MSAL for authentication and authorization, there are best practices for caching and storing tokens. MSAL implements and follows these best practices.

An application acquires tokens from an identity provider (IdP) to authorize the application to call protected APIs. When your app receives tokens, the response with the tokens contains an `expires\_in` property that tells the application how long to cache, and reuse, the token. Ensure applications use the `expires\_in` property to determine token lifespan. Confirm application don't attempt to decode an API access token. Using the cached token prevents unnecessary traffic between an app and Microsoft identity platform. Users are signed in to your application for the token's lifetime.

## HTTP 429 and 5xx error codes

Use the following sections to learn about HTTP 429 and 5xx error codes

### HTTP 429

There are HTTP errors that affect resilience. If your application receives an HTTP 429 error code, Too Many Requests, Microsoft identity platform is throttling your requests, which prevents your app from receiving tokens. Ensure your apps don't attempt to acquire a token until the time in the **Retry-After** response field expires. The 429 error often indicates the application doesn't cache and reuse tokens correctly.

### HTTP 5xx

If an application receives an HTTP 5x error code, the app must not enter a fast retry loop. Ensure applications wait until the **Retry-After** field expires. If the response provides no Retry-After header, use an exponential back-off retry with the first retry, at least 5 seconds after the response.

When a request times out, confirm that applications don't retry immediately. Use the previously cited exponential back-off retry.

## Next steps

* [Increase the resilience of authentication and authorization in client applications you develop](resilience-client-app.md)
* [Build resilience in your identity and access management infrastructure](resilience-in-infrastructure.md)
* [Build resilience in your customer identity and access management with Azure AD B2C](resilience-b2c.md)

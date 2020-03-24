---
title: Custom token cache serialization (MSAL4j)
titleSuffix: Microsoft identity platform
description: Learn how to serialize the token cache for MSAL for Java
services: active-directory
author: sangonzal
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 11/07/2019
ms.author: sagonzal
ms.reviewer: nacanuma
ms.custom: aaddev
#Customer intent: As an application developer using the Microsoft Authentication Library for Java (MSAL4J), I want to learn how to persist the token cache so that it is available to a new instance of my application.

---

# Custom token cache serialization in MSAL for Java

To persist the token cache between instances of your application, you will need to customize the serialization. The Java classes and interfaces involved in token cache serialization are the following:

- [ITokenCache](https://static.javadoc.io/com.microsoft.azure/msal4j/0.5.0-preview/com/microsoft/aad/msal4j/ITokenCache.html):  Interface representing security token cache.
- [ITokenCacheAccessAspect](https://static.javadoc.io/com.microsoft.azure/msal4j/0.5.0-preview/com/microsoft/aad/msal4j/ITokenCacheAccessAspect.html): Interface representing operation of executing code before and after access. You would @Override *beforeCacheAccess* and *afterCacheAccess* with the logic responsible for serializing and deserializing the cache.
- [ITokenCacheContext](https://static.javadoc.io/com.microsoft.azure/msal4j/0.5.0-preview/com/microsoft/aad/msal4j/ITokenCacheAccessContext.html): Interface representing context in which the token cache is accessed. 

Below is a naive implementation of custom serialization of token cache serialization/deserialization. Do not copy and paste this into a production environment.

```Java
static class TokenPersistence implements ITokenCacheAccessAspect {
String data;

TokenPersistence(String data) {
        this.data = data;
}

@Override
public void beforeCacheAccess(ITokenCacheAccessContext iTokenCacheAccessContext) {
        iTokenCacheAccessContext.tokenCache().deserialize(data);
}

@Override
public void afterCacheAccess(ITokenCacheAccessContext iTokenCacheAccessContext) {
        data = iTokenCacheAccessContext.tokenCache().serialize();
}
```

```Java
// Loads cache from file
String dataToInitCache = readResource(this.getClass(), "/cache_data/serialized_cache.json");

ITokenCacheAccessAspect persistenceAspect = new TokenPersistence(dataToInitCache);

// By setting *TokenPersistence* on the PublicClientApplication, MSAL will call *beforeCacheAccess()* before accessing the cache and *afterCacheAccess()* after accessing the cache. 
PublicClientApplication app = 
PublicClientApplication.builder("my_client_id").setTokenCacheAccessAspect(persistenceAspect).build();
```

## Learn more

Learn about [Get and remove accounts from the token cache using MSAL for Java](msal-java-get-remove-accounts-token-cache.md).

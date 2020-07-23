---
title: Provide an HttpClient & proxy (MSAL.NET) | Azure
titleSuffix: Microsoft identity platform
description: Learn about providing your own HttpClient and proxy to connect to Azure AD using Microsoft Authentication Library for .NET (MSAL.NET).
services: active-directory
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: how-to
ms.workload: identity
ms.date: 04/23/2019
ms.author: jmprieur
ms.reviewer: saeeda
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn about providing my own HttpClient so I can have fine-grained control of the proxy.
---

# Providing your own HttpClient and proxy using MSAL.NET
When [initializing a public client application](msal-net-initializing-client-applications.md), you can use the `.WithHttpClientFactory method` to provide your own HttpClient.  Providing your own HttpClient enables advanced scenarios such fine-grained control of an HTTP proxy, customizing user agent headers, or forcing MSAL to use a specific HttpClient (for example in ASP.NET Core web apps/APIs).

## Initialize with HttpClientFactory
The following example shows to create an `HttpClientFactory` and then initialize a public client application with it:

```csharp
IMsalHttpClientFactory httpClientFactory = new MyHttpClientFactory();

var pca = PublicClientApplicationBuilder.Create(MsalTestConstants.ClientId) 
                                        .WithHttpClientFactory(httpClientFactory)
                                        .Build();
```

## HttpClient and Xamarin iOS
When using Xamarin iOS, it is recommended to create an `HttpClient` that explicitly uses the `NSURLSession`-based handler for iOS 7 and newer. MSAL.NET automatically creates an `HttpClient` that uses `NSURLSessionHandler` for iOS 7 and newer. For more information, read the [Xamarin iOS documentation for HttpClient](/xamarin/cross-platform/macios/http-stack).
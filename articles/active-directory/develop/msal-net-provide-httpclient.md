---
title: Provide an HttpClient & proxy (MSAL.NET)
description: Learn about providing your own HttpClient and proxy to connect to Azure AD using the Microsoft Authentication Library for .NET (MSAL.NET).
author: jmprieur
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.topic: how-to
ms.workload: identity
ms.date: 04/23/2019
ms.author: jmprieur
ms.reviewer: saeeda
ms.custom: "devx-track-csharp, aaddev"
#Customer intent: As an application developer, I want to learn about providing my own HttpClient so I can have fine-grained control of the proxy.
---

# Providing your own HttpClient and proxy using MSAL.NET
When [initializing a client application](msal-net-initializing-client-applications.md), you can use the `.WithHttpClientFactory method` to provide your own HttpClient.  Providing your own HttpClient enables advanced scenarios such fine-grained control of an HTTP proxy, customizing user agent headers, or forcing MSAL to use a specific HttpClient (for example in ASP.NET Core web apps/APIs).

`HttpClient` is intended to be instantiated once and then reused throughout the life of an application. See [Remarks](/dotnet/api/system.net.http.httpclient#remarks).

## Initialize with HttpClientFactory
The following example shows to create an `HttpClientFactory` and then initialize a public client application with it:

```csharp
IMsalHttpClientFactory httpClientFactory = new MyHttpClientFactory();

var pca = PublicClientApplicationBuilder.Create(MsalTestConstants.ClientId) 
                                        .WithHttpClientFactory(httpClientFactory)
                                        .Build();
```

## Example implementation using a proxy
```csharp
public class HttpFactoryWithProxy : IMsalHttpClientFactory
{
    private static HttpClient _httpClient;

    public HttpFactoryWithProxy()
    {
        // Consider using Lazy<T> 
        if (_httpClient == null) 
        {
            var proxy = new WebProxy
            {
                Address = new Uri($"http://{proxyHost}:{proxyPort}"),
                BypassProxyOnLocal = false,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(
                    userName: proxyUserName,
                    password: proxyPassword)
            };

            // Now create a client handler which uses that proxy
            var httpClientHandler = new HttpClientHandler
            {
                Proxy = proxy,
            };

            _httpClient = new HttpClient(handler: httpClientHandler);
        }
    }

    public HttpClient GetHttpClient()
    {
        return _httpClient;
    }
}
```

## HttpClient and Xamarin iOS
When using Xamarin iOS, it is recommended to create an `HttpClient` that explicitly uses the `NSURLSession`-based handler for iOS 7 and newer. MSAL.NET automatically creates an `HttpClient` that uses `NSURLSessionHandler` for iOS 7 and newer. For more information, read the [Xamarin iOS documentation for HttpClient](/xamarin/cross-platform/macios/http-stack).

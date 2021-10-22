---
title: Token cache serialization (MSAL.NET) | Azure
titleSuffix: Microsoft identity platform
description: Learn about serialization and custom serialization of the token cache using the Microsoft Authentication Library for .NET (MSAL.NET).
services: active-directory
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 09/30/2021
ms.author: jmprieur
ms.reviewer: mmacy
ms.custom: "devx-track-csharp, aaddev, has-adal-ref"
#Customer intent: As an application developer, I want to learn about token cache serialization so I can have fine-grained control of the proxy.
---

# Token cache serialization in MSAL.NET

After it [acquires a token](msal-acquire-cache-tokens.md), Microsoft Authentication Library (MSAL) caches it. Public client applications (desktop/mobile apps) should try to get a token from the cache before acquiring a token by another method. Acquisition methods on confidential client applications manage the cache themselves. This article discusses default and custom serialization of the token cache in MSAL.NET.

## Quick summary

The recommendation is:
- In web apps and web APIs, use [token cache serializers from "Microsoft.Identity.Web.TokenCache"](https://github.com/AzureAD/microsoft-identity-web/wiki/token-cache-serialization). They even provide distributed database or cache system to store tokens.
  - In ASP.NET Core [web apps](scenario-web-app-call-api-overview.md) and [web API](scenario-web-api-call-api-overview.md), use [Microsoft.Identity.Web](microsoft-identity-web.md) as a higher-level API in ASP.NET Core.
  - In ASP.NET classic, .NET Core, .NET framework, use MSAL.NET directly with [token cache serialization adapters for MSAL](msal-net-token-cache-serialization.md?tabs=aspnet) provided in the Microsoft.Identity.Web.TokenCache NuGet package. 
- In desktop applications (which can use file system to store tokens), use [Microsoft.Identity.Client.Extensions.Msal](https://github.com/AzureAD/microsoft-authentication-extensions-for-dotnet/wiki/Cross-platform-Token-Cache) with MSAL.Net.
- In mobile applications (Xamarin.iOS, Xamarin.Android, Universal Windows Platform) don't do anything, as MSAL.NET handles the cache for you: these platforms have a secure storage.

## [ASP.NET Core web apps and web APIs](#tab/aspnetcore)

The [Microsoft.Identity.Web](https://github.com/AzureAD/microsoft-identity-web) library provides a NuGet package [Microsoft.Identity.Web.TokenCache](https://www.nuget.org/packages/Microsoft.Identity.Web.TokenCache) containing token cache serialization:

| Extension Method | Description  |
| ---------------- | ------------ |
| `AddInMemoryTokenCaches` | In memory token cache serialization. This implementation is great in samples. It's also good in production applications provided you don't mind if the token cache is lost when the web app is restarted. `AddInMemoryTokenCaches` takes an optional parameter of type `MsalMemoryTokenCacheOptions` that enables you to specify the duration after which the cache entry will expire unless it's used.
| `AddSessionTokenCaches` | The token cache is bound to the user session. This option isn't ideal if the ID token contains many claims as the cookie would become too large.
| `AddDistributedTokenCaches` | The token cache is an adapter against the ASP.NET Core `IDistributedCache` implementation, therefore enabling you to choose between a distributed memory cache, a Redis cache, a distributed NCache, or a SQL Server cache. For details about the `IDistributedCache` implementations, see [Distributed memory cache](/aspnet/core/performance/caching/distributed).


Here's an example of code using the in-memory cache in the [ConfigureServices](/dotnet/api/microsoft.aspnetcore.hosting.startupbase.configureservices) method of the [Startup](/aspnet/core/fundamentals/startup) class in an ASP.NET Core application:

```CSharp
#using Microsoft.Identity.Web
```

```CSharp
using Microsoft.Identity.Web;

public class Startup
{
 const string scopesToRequest = "user.read";
  
  public void ConfigureServices(IServiceCollection services)
  {
   // code before
   services.AddAuthentication(OpenIdConnectDefaults.AuthenticationScheme)
           .AddMicrosoftIdentityWebApp(Configuration)
             .EnableTokenAcquisitionToCallDownstreamApi(new string[] { scopesToRequest })
                .AddInMemoryTokenCaches();
   // code after
  }
  // code after
}
```

From the point of view of the cache, the code would be similar in ASP.NET Core web APIs


Here are examples of possible distributed caches:

```C#
// or use a distributed Token Cache by adding
   services.AddAuthentication(OpenIdConnectDefaults.AuthenticationScheme)
           .AddMicrosoftIdentityWebApp(Configuration)
             .EnableTokenAcquisitionToCallDownstreamApi(new string[] { scopesToRequest }
               .AddDistributedTokenCaches();

// and then choose your implementation of distributed cache

// For instance the distributed in memory cache (not cleared when you stop the app)
services.AddDistributedMemoryCache();

// Or a Redis cache
// Requires the Microsoft.Extensions.Caching.StackExchangeRedis NuGet package
services.AddStackExchangeRedisCache(options =>
{
 options.Configuration = "localhost";
 options.InstanceName = "SampleInstance";
});

// Or even a SQL Server token cache
// Requires the Microsoft.Extensions.Caching.SqlServer NuGet package
services.AddDistributedSqlServerCache(options =>
{
 options.ConnectionString = _config["DistCache_ConnectionString"];
 options.SchemaName = "dbo";
 options.TableName = "TestCache";
});

// Or a Cosmos DB cache
// Requires the Microsoft.Extensions.Caching.Cosmos NuGet package
services.AddCosmosCache((CosmosCacheOptions cacheOptions) =>
{
    cacheOptions.ContainerName = Configuration["CosmosCacheContainer"];
    cacheOptions.DatabaseName = Configuration["CosmosCacheDatabase"];
    cacheOptions.ClientBuilder = new CosmosClientBuilder(Configuration["CosmosConnectionString"]);
    cacheOptions.CreateIfNotExists = true;
});
```

Their usage is featured in the [ASP.NET Core web app tutorial](/aspnet/core/tutorials/first-mvc-app/) in the phase [2-2 Token Cache](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/2-WebApp-graph-user/2-2-TokenCache).

## [Non ASP.NET Core web apps and web APIs](#tab/aspnet)

Even when you use MSAL.NET, you can benefit from token cache serializers brought in Microsoft.Identity.Web.TokenCache 

### Referencing the NuGet package

Add the [Microsoft.Identity.Web.TokenCache](https://www.nuget.org/packages/Microsoft.Identity.Web.TokenCache) NuGet package to your project in addition to MSAL.NET

### Configuring the token cache

The following code shows how to add an in-memory well-partitioned token cache to your app.

```CSharp
using Microsoft.Identity.Web;
using Microsoft.Identity.Client;
using Microsoft.Extensions.DependencyInjection;
```

```CSharp

public static async Task<AuthenticationResult> GetTokenAsync(string clientId, X509Certificate cert, string authority, string[] scopes)
 {
     // Create the confidential client application
     app= ConfidentialClientApplicationBuilder.Create(clientId)
       // Alternatively to the certificate you can use .WithClientSecret(clientSecret)
       .WithCertificate(cert)
       .WithLegacyCacheCompatibility(false)
       .WithAuthority(authority)
       .Build();

     // Add a static in-memory token cache. Other options available: see below
     app.AddInMemoryTokenCache();  // Microsoft.Identity.Web.TokenCache 1.17+
   
     // Make the call to get a token for client_credentials flow (app to app scenario) 
     return await app.AcquireTokenForClient(scopes).ExecuteAsync();
     
     // OR Make the call to get a token for OBO (web api scenario)
     return await app.AcquireTokenOnBehalfOf(scopes, userAssertion).ExecuteAsync();
     
     // OR Make the call to get a token via auth code (web app scenario)
     return await app.AcquireTokenByAuthorizationCode(scopes, authCode);    
     
     // OR, when the user has previously logged in, get a token silently
     var homeAccountId = GetHomeAccountIdFromClaimsPrincipal(); // uid and utid claims
     var account = await app.GetAccountAsync(homeAccountId);
     try
     {
          return await app.AcquireTokenSilent(scopes, account).ExecuteAsync();; 
     } 
     catch (MsalUiRequiredException)
     {
      	// cannot get a token silently, so redirect the user to be challenged 
     }
  }
```

### Available caching technologies

Instead of `app.AddInMemoryTokenCache();` you can use different caching technologies, including distributed token caches provided by .NET.

#### In memory token cache

In memory token cache serialization is great in samples. It's also good in production applications provided you don't mind if the token cache is lost when the web app is restarted.

```CSharp 
     // Add an in-memory token cache
     app.AddInMemoryTokenCache();
```

#### Distributed caches

If you use `app.AddDistributedTokenCache`, the token cache is an adapter against the .NET `IDistributedCache` implementation, therefore enabling you to choose between a distributed memory cache, a Redis cache, a CosmosDb, or a SQL Server cache. For details about the `IDistributedCache` implementations, see [Distributed memory cache](/aspnet/core/performance/caching/distributed).

##### Distributed in memory token cache

```CSharp 
     // In memory distributed token cache
     app.AddDistributedTokenCache(services =>
     {
       // In net462/net472, requires to reference Microsoft.Extensions.Caching.Memory
       services.AddDistributedMemoryCache();
     });
```

##### SQL server

```CSharp 
     // SQL Server token cache
     app.AddDistributedTokenCache(services =>
     {
      services.AddDistributedSqlServerCache(options =>
      {
       // In net462/net472, requires to reference Microsoft.Extensions.Caching.Memory

       // Requires to reference Microsoft.Extensions.Caching.SqlServer
       options.ConnectionString = @"Data Source=(localdb)\MSSQLLocalDB;Initial Catalog=TestCache;Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False";
       options.SchemaName = "dbo";
       options.TableName = "TestCache";

       // You don't want the SQL token cache to be purged before the access token has expired. Usually
       // access tokens expire after 1 hour (but this can be changed by token lifetime policies), whereas
       // the default sliding expiration for the distributed SQL database is 20 mins. 
       // Use a value which is above 60 mins (or the lifetime of a token in case of longer lived tokens)
       options.DefaultSlidingExpiration = TimeSpan.FromMinutes(90);
      });
     });
```

##### Redis cache

```CSharp 
     // Redis token cache
     app.AddDistributedTokenCache(services =>
     {
       // Requires to reference Microsoft.Extensions.Caching.StackExchangeRedis
       services.AddStackExchangeRedisCache(options =>
       {
         options.Configuration = "localhost";
         options.InstanceName = "Redis";
       });
      });
```

See also [Disabling cache synchronization](#disabling-cache-synchronization) if you observe that token acquisition occasionally takes as much time as
the redis cache timeout. 

##### Cosmos DB

```CSharp 
      // Cosmos DB token cache
      app.AddDistributedTokenCache(services =>
      {
        // Requires to reference Microsoft.Extensions.Caching.Cosmos
        services.AddCosmosCache((CosmosCacheOptions cacheOptions) =>
        {
          cacheOptions.ContainerName = Configuration["CosmosCacheContainer"];
          cacheOptions.DatabaseName = Configuration["CosmosCacheDatabase"];
          cacheOptions.ClientBuilder = new CosmosClientBuilder(Configuration["CosmosConnectionString"]);
          cacheOptions.CreateIfNotExists = true;
        });
       });
```

### Disabling legacy token cache

MSAL has some internal code specifically to enable the ability to interact with legacy ADAL cache. When MSAL and ADAL aren't used side by side (therefore the legacy cache isn't used), the related legacy cache code is unnecessary. MSAL [4.25.0](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/releases/tag/4.25.0) adds the ability to disable legacy ADAL cache code and improve cache usage performance. See pull request [#2309](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/pull/2309) for performance comparison before and after disabling the legacy cache. Call `.WithLegacyCacheCompatibility(false)` on an application builder like below.

```csharp
var app = ConfidentialClientApplicationBuilder
	.Create(clientId)
	.WithClientSecret(clientSecret)
	.WithLegacyCacheCompatibility(false)
	.Build();
```

### Disabling cache synchronization

By default, MSAL will lock cache access at the confidential client application level between cache reads and cache writes. This lock can be an issue if the cache serializer takes a long time until a timeout happens, which can be the case with Redis caches. You can set the `WithCacheSynchronization` flag to false to enable an optimistic cache locking strategy, which may result in better performance, especially when ConfidentialClientApplication objects are reused across requests. 

```csharp
var app = ConfidentialClientApplicationBuilder
	.Create(clientId)
	.WithClientSecret(clientSecret)
	.WithCacheSynchronization(false)
	.Build();
```
### Samples

- Using the token cache serializers in a .NET Framework and .NET Core applications is showed-cased in this sample [ConfidentialClientTokenCache](https://github.com/Azure-Samples/active-directory-dotnet-v1-to-v2/tree/master/ConfidentialClientTokenCache) 
- The following sample is an ASP.NET web app using the same technics: https://github.com/Azure-Samples/ms-identity-aspnet-webapp-openidconnect (See [WebApp/Utils/MsalAppBuilder.cs](https://github.com/Azure-Samples/ms-identity-aspnet-webapp-openidconnect/blob/master/WebApp/Utils/MsalAppBuilder.cs)

## [Desktop apps](#tab/desktop)

In desktop applications, the recommendation is to use the cross platform token cache.

#### Cross platform token cache (MSAL only)

MSAL.NET provides a cross platform token cache in a separate library named Microsoft.Identity.Client.Extensions.Msal, which source code is available from https://github.com/AzureAD/microsoft-authentication-extensions-for-dotnet.

##### Referencing the NuGet package

Add the [Microsoft.Identity.Client.Extensions.Msal](https://www.nuget.org/packages/Microsoft.Identity.Client.Extensions.Msal/) NuGet package to your project.

##### Configuring the token cache

See https://github.com/AzureAD/microsoft-authentication-extensions-for-dotnet/wiki/Cross-platform-Token-Cache for details. Here's an example of usage of the cross platform token cache.

```csharp
 var storageProperties =
     new StorageCreationPropertiesBuilder(Config.CacheFileName, Config.CacheDir)
     .WithLinuxKeyring(
         Config.LinuxKeyRingSchema,
         Config.LinuxKeyRingCollection,
         Config.LinuxKeyRingLabel,
         Config.LinuxKeyRingAttr1,
         Config.LinuxKeyRingAttr2)
     .WithMacKeyChain(
         Config.KeyChainServiceName,
         Config.KeyChainAccountName)
     .Build();

 IPublicClientApplication pca = PublicClientApplicationBuilder.Create(clientId)
    .WithAuthority(Config.Authority)
    .WithRedirectUri("http://localhost")  // make sure to register this redirect URI for the interactive login 
    .Build();
    

// This hooks up the cross-platform cache into MSAL
var cacheHelper = await MsalCacheHelper.CreateAsync(storageProperties );
cacheHelper.RegisterCache(pca.UserTokenCache);
         
```


##### Plain text fallback mode

The cross platform token cache allows you to store unencrypted tokens in clear text. This is intended for use in development environments for debugging purposes only. 
You can use the plain text fallback mode using the following code pattern.

```csharp
storageProperties =
    new StorageCreationPropertiesBuilder(
        Config.CacheFileName + ".plaintext",
        Config.CacheDir)
    .WithUnprotectedFile()
    .Build();

var cacheHelper = await MsalCacheHelper.CreateAsync(storageProperties).ConfigureAwait(false);
```


## [Mobile apps](#tab/mobile)

In MSAL.NET, an in-memory token cache is provided by default. Serialization is provided by default for platforms where secure storage is available for a user as part of the platform: Universal Windows Platform (UWP), Xamarin.iOS, and Xamarin.Android.

## [Write your own cache](#tab/custom)

If you really want to write your own token cache serializer, MSAL.NET provides custom token cache serialization in .NET Framework and .NET Core subplatforms. Events are fired when the cache is accessed, apps can choose whether to serialize or deserialize the cache. On confidential client applications that handle users (web apps that sign in users and call web APIs, and web APIs calling downstream web APIs), there can be many users and the users are processed in parallel. For security and performance reasons, our recommendation is to serialize one cache per user. Serialization events compute a cache key based on the identity of the processed user and serialize/deserialize a token cache for that user.

Remember, custom serialization isn't available on mobile platforms (UWP, Xamarin.iOS, and Xamarin.Android). MSAL already defines a secure and performant serialization mechanism for these platforms. .NET desktop and .NET Core applications, however, have varied architectures and MSAL can't implement a general-purpose serialization mechanism. For example, web sites may choose to store tokens in a Redis cache, or desktop apps store tokens in an encrypted file. So serialization isn't provided out-of-the-box. To have a persistent token cache application in .NET desktop or .NET Core, customize the serialization.

The following classes and interfaces are used in token cache serialization:

- `ITokenCache`, which defines events to subscribe to token cache serialization requests and methods to serialize or de-serialize the cache at various formats (ADAL v3.0, MSAL 2.x, and MSAL 3.x = ADAL v5.0).
- `TokenCacheCallback` is a callback passed to the events so that you can handle the serialization. They'll be called with arguments of type `TokenCacheNotificationArgs`.
- `TokenCacheNotificationArgs` only provides the `ClientId` of the application and a reference to the user for which the token is available.

  ![Class diagram](media/msal-net-token-cache-serialization/class-diagram.png)

> [!IMPORTANT]
> MSAL.NET creates token caches for you and provides you with the `IToken` cache when you call an application's `UserTokenCache` and `AppTokenCache` properties. You are not supposed to implement the interface yourself. Your responsibility, when you implement a custom token cache serialization, is to:
> - React to `BeforeAccess` and `AfterAccess` "events" (or their Async flavors). The `BeforeAccess` delegate is responsible to deserialize the cache, whereas the `AfterAccess` one is responsible for serializing the cache.
> - Part of these events store or load blobs, which are passed through the event argument to whatever storage you want.

The strategies are different depending on if you're writing a token cache serialization for a [public client application](msal-client-applications.md) (desktop), or a [confidential client application](msal-client-applications.md)) (web app / web API, daemon app).

### Custom Token cache for a web app or web API (confidential client application)

In web apps or web APIs, the cache could use the session, a Redis cache, a SQL database, or a Cosmos DB database. Keep one token cache per account in web apps or web APIs: 
- For web apps, the token cache should be keyed by the account ID.
- For web APIs, the account should be keyed by the hash of the token used to call the API.

Examples of token cache serializers are provided in [Microsoft.Identity.Web/TokenCacheProviders](https://github.com/AzureAD/microsoft-identity-web/tree/master/src/Microsoft.Identity.Web/TokenCacheProviders).

### Custom token cache for a desktop or mobile app (public client application)

Since MSAL.NET v2.x you have several options for serializing the token cache of a public client. You can serialize the cache only to the MSAL.NET format (the unified format cache is common across MSAL and the platforms).  You can also support the [legacy](https://github.com/AzureAD/azure-activedirectory-library-for-dotnet/wiki/Token-cache-serialization) token cache serialization of ADAL V3.

Customizing the token cache serialization to share the single sign-on state between ADAL.NET 3.x, ADAL.NET 5.x, and MSAL.NET is explained in part of the following sample: [active-directory-dotnet-v1-to-v2](https://github.com/Azure-Samples/active-directory-dotnet-v1-to-v2).

> [!Note]
> The MSAL.NET 1.1.4-preview token cache format is no longer supported in MSAL 2.x. If you have applications leveraging MSAL.NET 1.x, your users will have to re-sign-in. Alternately, the migration from ADAL 4.x (and 3.x) is supported.

#### Simple token cache serialization (MSAL only)

Below is an example of a naive implementation of custom serialization of a token cache for desktop applications. Here, the user token cache is a file in the same folder as the application.

After you build the application, you enable the serialization by calling the `TokenCacheHelper.EnableSerialization()` method and passing the application `UserTokenCache`.

```csharp
app = PublicClientApplicationBuilder.Create(ClientId)
    .Build();
TokenCacheHelper.EnableSerialization(app.UserTokenCache);
```

The `TokenCacheHelper` helper class is defined as:

```csharp
static class TokenCacheHelper
 {
  public static void EnableSerialization(ITokenCache tokenCache)
  {
   tokenCache.SetBeforeAccess(BeforeAccessNotification);
   tokenCache.SetAfterAccess(AfterAccessNotification);
  }

  /// <summary>
  /// Path to the token cache. Note that this could be something different for instance for MSIX applications:
  /// private static readonly string CacheFilePath =
  /// $"{Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData)}\{AppName}\msalcache.bin";
  /// </summary>
  public static readonly string CacheFilePath = System.Reflection.Assembly.GetExecutingAssembly().Location + ".msalcache.bin3";

  private static readonly object FileLock = new object();


  private static void BeforeAccessNotification(TokenCacheNotificationArgs args)
  {
   lock (FileLock)
   {
    args.TokenCache.DeserializeMsalV3(File.Exists(CacheFilePath)
            ? ProtectedData.Unprotect(File.ReadAllBytes(CacheFilePath),
                                      null,
                                      DataProtectionScope.CurrentUser)
            : null);
   }
  }

  private static void AfterAccessNotification(TokenCacheNotificationArgs args)
  {
   // if the access operation resulted in a cache update
   if (args.HasStateChanged)
   {
    lock (FileLock)
    {
     // reflect changesgs in the persistent store
     File.WriteAllBytes(CacheFilePath,
                         ProtectedData.Protect(args.TokenCache.SerializeMsalV3(),
                                                 null,
                                                 DataProtectionScope.CurrentUser)
                         );
    }
   }
  }
 }
```

A product quality token cache file based serializer for public client applications (for desktop applications running on Windows, Mac and Linux) is available from the [Microsoft.Identity.Client.Extensions.Msal](https://github.com/AzureAD/microsoft-authentication-extensions-for-dotnet/tree/master/src/Microsoft.Identity.Client.Extensions.Msal) open-source library. You can include it in your applications from the following NuGet package: [Microsoft.Identity.Client.Extensions.Msal](https://www.nuget.org/packages/Microsoft.Identity.Client.Extensions.Msal/).

#### Dual token cache serialization (MSAL unified cache and ADAL v3)

If you want to implement token cache serialization both with the unified cache format (common to ADAL.NET 4.x, MSAL.NET 2.x, and other MSALs of the same generation or older, on the same platform), take a look at the following code:

```csharp
string appLocation = Path.GetDirectoryName(Assembly.GetEntryAssembly().Location;
string cacheFolder = Path.GetFullPath(appLocation) + @"..\..\..\..");
string adalV3cacheFileName = Path.Combine(cacheFolder, "cacheAdalV3.bin");
string unifiedCacheFileName = Path.Combine(cacheFolder, "unifiedCache.bin");

IPublicClientApplication app;
app = PublicClientApplicationBuilder.Create(clientId)
                                    .Build();
FilesBasedTokenCacheHelper.EnableSerialization(app.UserTokenCache,
                                               unifiedCacheFileName,
                                               adalV3cacheFileName);

```

This time the helper class as defined as:

```csharp
using System;
using System.IO;
using System.Security.Cryptography;
using Microsoft.Identity.Client;

namespace CommonCacheMsalV3
{
 /// <summary>
 /// Simple persistent cache implementation of the dual cache serialization (ADAL V3 legacy
 /// and unified cache format) for a desktop applications (from MSAL 2.x)
 /// </summary>
 static class FilesBasedTokenCacheHelper
 {
  /// <summary>
  /// Enables the serialization of the token cache
  /// </summary>
  /// <param name="adalV3CacheFileName">File name where the cache is serialized with the
  /// ADAL V3 token cache format. Can
  /// be <c>null</c> if you don't want to implement the legacy ADAL V3 token cache
  /// serialization in your MSAL 2.x+ application</param>
  /// <param name="unifiedCacheFileName">File name where the cache is serialized
  /// with the Unified cache format, common to
  /// ADAL V4 and MSAL V2 and above, and also across ADAL/MSAL on the same platform.
  ///  Should not be <c>null</c></param>
  /// <returns></returns>
  public static void EnableSerialization(ITokenCache tokenCache, string unifiedCacheFileName, string adalV3CacheFileName)
  {
   UnifiedCacheFileName = unifiedCacheFileName;
   AdalV3CacheFileName = adalV3CacheFileName;

   tokenCache.SetBeforeAccess(BeforeAccessNotification);
   tokenCache.SetAfterAccess(AfterAccessNotification);
  }

  /// <summary>
  /// File path where the token cache is serialized with the unified cache format
  /// (ADAL.NET V4, MSAL.NET V3)
  /// </summary>
  public static string UnifiedCacheFileName { get; private set; }

  /// <summary>
  /// File path where the token cache is serialized with the legacy ADAL V3 format
  /// </summary>
  public static string AdalV3CacheFileName { get; private set; }

  private static readonly object FileLock = new object();

  public static void BeforeAccessNotification(TokenCacheNotificationArgs args)
  {
   lock (FileLock)
   {
    args.TokenCache.DeserializeAdalV3(ReadFromFileIfExists(AdalV3CacheFileName));
    try
    {
     args.TokenCache.DeserializeMsalV3(ReadFromFileIfExists(UnifiedCacheFileName));
    }
    catch(Exception ex)
    {
     // Compatibility with the MSAL v2 cache if you used one
     args.TokenCache.DeserializeMsalV2(ReadFromFileIfExists(UnifiedCacheFileName));
    }
   }
  }

  public static void AfterAccessNotification(TokenCacheNotificationArgs args)
  {
   // if the access operation resulted in a cache update
   if (args.HasStateChanged)
   {
    lock (FileLock)
    {
     WriteToFileIfNotNull(UnifiedCacheFileName, args.TokenCache.SerializeMsalV3());
     if (!string.IsNullOrWhiteSpace(AdalV3CacheFileName))
     {
      WriteToFileIfNotNull(AdalV3CacheFileName, args.TokenCache.SerializeAdalV3());
     }
    }
   }
  }

  /// <summary>
  /// Read the content of a file if it exists
  /// </summary>
  /// <param name="path">File path</param>
  /// <returns>Content of the file (in bytes)</returns>
  private static byte[] ReadFromFileIfExists(string path)
  {
   byte[] protectedBytes = (!string.IsNullOrEmpty(path) && File.Exists(path))
       ? File.ReadAllBytes(path) : null;
   byte[] unprotectedBytes = encrypt ?
       ((protectedBytes != null) ? ProtectedData.Unprotect(protectedBytes, null, DataProtectionScope.CurrentUser) : null)
       : protectedBytes;
   return unprotectedBytes;
  }

  /// <summary>
  /// Writes a blob of bytes to a file. If the blob is <c>null</c>, deletes the file
  /// </summary>
  /// <param name="path">path to the file to write</param>
  /// <param name="blob">Blob of bytes to write</param>
  private static void WriteToFileIfNotNull(string path, byte[] blob)
  {
   if (blob != null)
   {
    byte[] protectedBytes = encrypt
      ? ProtectedData.Protect(blob, null, DataProtectionScope.CurrentUser)
      : blob;
    File.WriteAllBytes(path, protectedBytes);
   }
   else
   {
    File.Delete(path);
   }
  }

  // Change if you want to test with an un-encrypted blob (this is a json format)
  private static bool encrypt = true;
 }
}
```

---

## Monitor cache hit ratios and cache performance

MSAL exposes important metrics as part of [AuthenticationResult.AuthenticationResultMetadata](/dotnet/api/microsoft.identity.client.authenticationresultmetadata) object. You can log these metrics to assess the health of your application.

| Metric       | Meaning     | When to trigger an alarm?    |
| :-------------: | :----------: | :-----------: |
|  `DurationTotalInMs` | Total time spent in MSAL, including network calls and cache   | Alarm on overall high latency (> 1 s). Value depends on token source. From the cache: one cache access. From AAD: two cache accesses + one HTTP call. First ever call (per-process) will take longer because of one extra HTTP call. |
|  `DurationInCacheInMs` | Time spent loading or saving the token cache, which is customized by the app developer (for example, save to Redis).| Alarm on spikes. |
|  `DurationInHttpInMs`| Time spent making HTTP calls to AAD.  | Alarm on spikes.|
|  `TokenSource` | Indicates the source of the token. Tokens are retrieved from the cache much faster (for example, ~100 ms versus ~700 ms). Can be used to monitor and alarm the cache hit ratio. | Use with `DurationTotalInMs` |


## Next steps

The following samples illustrate token cache serialization.

| Sample | Platform | Description|
| ------ | -------- | ----------- |
|[active-directory-dotnet-desktop-msgraph-v2](https://github.com/azure-samples/active-directory-dotnet-desktop-msgraph-v2) | Desktop (WPF) | Windows Desktop .NET (WPF) application calling the Microsoft Graph API. ![Diagram shows a topology with Desktop App WPF TodoListClient flowing to Azure AD by acquiring a token interactively and to Microsoft Graph.](media/msal-net-token-cache-serialization/topology.png)|
|[active-directory-dotnet-v1-to-v2](https://github.com/Azure-Samples/active-directory-dotnet-v1-to-v2) | Desktop (Console) | Set of Visual Studio solutions illustrating the migration of Azure AD v1.0 applications (using ADAL.NET) to Microsoft identity platform applications (using MSAL.NET). In particular, see [Token Cache Migration](https://github.com/Azure-Samples/active-directory-dotnet-v1-to-v2/blob/master/TokenCacheMigration/README.md) and [Confidential client token cache](https://github.com/Azure-Samples/active-directory-dotnet-v1-to-v2/tree/master/ConfidentialClientTokenCache) |
[ms-identity-aspnet-webapp-openidconnect](https://github.com/Azure-Samples/ms-identity-aspnet-webapp-openidconnect) | ASP.NET (net472) | Example of token cache serialization in an ASP.NET MVC application (using MSAL.NET). See in particular [MsalAppBuilder](https://github.com/Azure-Samples/ms-identity-aspnet-webapp-openidconnect/blob/master/WebApp/Utils/MsalAppBuilder.cs)

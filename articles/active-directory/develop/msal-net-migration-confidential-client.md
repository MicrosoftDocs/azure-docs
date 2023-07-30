---
title: Migrate confidential client applications to MSAL.NET
description: Learn how to migrate a confidential client application from Azure Active Directory Authentication Library for .NET to Microsoft Authentication Library for .NET.
services: active-directory
author: Dickson-Mwendia
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.topic: how-to
ms.workload: identity
ms.date: 06/08/2021
ms.author: dmwendia
ms.reviewer: jmprieur, saeeda, shermanouko
ms.custom: devx-track-csharp, aaddev, has-adal-ref, kr2b-contr-experiment, devx-track-dotnet
#Customer intent: As an application developer, I want to migrate my confidential client app from ADAL.NET to MSAL.NET.
---

# Migrate confidential client applications from ADAL.NET to MSAL.NET via Microsoft.Identity.Web

In this how-to guide you'll migrate a confidential client application from Azure Active Directory Authentication Library for .NET (ADAL.NET) to the higher-level APIs provided in Microsoft.Identity.Web, which uses Microsoft Authentication Library for .NET (MSAL.NET) under the covers. Confidential client applications include web apps, web APIs, and daemon applications that call another service on their own behalf. For more information about confidential apps, see [Authentication flows and application scenarios](authentication-flows-app-scenarios.md). If your app is based on ASP.NET Core, see [Microsoft.Identity.Web](microsoft-identity-web.md).

For app registrations:

- You don't need to create a new app registration. (You keep the same client ID.)
- You don't need to change the preauthorizations (admin-consented API permissions).

## Migration steps

1. Find the code that uses ADAL.NET in your app.

   The code that uses ADAL in a confidential client app instantiates `AuthenticationContext` and calls either `AcquireTokenByAuthorizationCode` or one override of `AcquireTokenAsync` with the following parameters:

   - A `resourceId` string. This variable is the app ID URI of the web API that you want to call.
   - An instance of `IClientAssertionCertificate` or `ClientAssertion`. This instance provides the client credentials for your app to prove the identity of your app.

1. After you've identified that you have apps that are using ADAL.NET, install the Microsoft.Identity.Web NuGet package [Microsoft.Identity.Web](https://www.nuget.org/packages/Microsoft.Identity.Web) and rebuild. For more information, see [Install a NuGet package](https://www.bing.com/search?q=install+nuget+package). To use token cache serializers, install [Microsoft.Identity.Web.TokenCache](https://www.nuget.org/packages/Microsoft.Identity.Web.TokenCache).

1. Update the code according to the confidential client scenario. Some steps are common and apply across all the confidential client scenarios. Other steps are unique to each scenario. 

   Confidential client scenarios:

   - [Daemon scenarios](?tabs=daemon#migrate-daemon-apps) supported by web apps, web APIs, and daemon console applications.
   - [Web API calling downstream web APIs](?tabs=obo#migrate-a-web-api-that-calls-downstream-web-apis) supported by web APIs calling downstream web APIs on behalf of the user.
   - [Web app calling web APIs](?tabs=authcode#migrate-a-web-api-that-calls-downstream-web-apis) supported by web apps that sign in users and call a downstream web API.

You might have provided a wrapper around ADAL.NET to handle certificates and caching. This guide uses the same approach to illustrate the process of migrating from ADAL.NET to MSAL.NET. However, this code is only for demonstration purposes. Don't copy/paste these wrappers or integrate them in your code as they are.

## [Daemon](#tab/daemon)

### Migrate daemon apps

Daemon scenarios use the OAuth2.0 [client credential flow](v2-oauth2-client-creds-grant-flow.md). They're also called service-to-service calls. Your app acquires a token on its own behalf, not on behalf of a user.

#### Find out if your code uses daemon scenarios

The ADAL code for your app uses daemon scenarios if it contains a call to `AuthenticationContext.AcquireTokenAsync` with the following parameters:

- A resource (app ID URI) as a first parameter
- `IClientAssertionCertificate` or `ClientAssertion` as the second parameter

`AuthenticationContext.AcquireTokenAsync` doesn't have a parameter of type `UserAssertion`. If it does, then your app is a web API, and it uses the [web API calling downstream web APIs](?tabs=obo#migrate-a-web-api-that-calls-downstream-web-apis) scenario.

#### Update the code of daemon scenarios

[!INCLUDE [Common steps](includes/msal-net-adoption-steps-confidential-clients.md)]

In this case, remove the call to `AuthenticationContext.AcquireTokenAsync` as well as any code to load certificates and replace with the higher-level APIs, as shown below. You will need to install a NuGet package [Microsoft.Identity.Abstractions](https://www.nuget.org/packages/Microsoft.Identity.Abstractions).

Here's a comparison of ADAL.NET and Microsoft.Identity.Web code for daemon scenarios with calling Microsoft Graph:

:::row:::
:::column span="":::
    ADAL
:::column-end:::
:::column span="":::
    Microsoft.Identity.Web
:::column-end:::
:::row-end:::
:::row:::
:::column span="":::
      
```csharp
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;

public partial class AuthWrapper
{
 const string ClientId = "Guid (AppID)";
 const string authority 
   = "https://login.microsoftonline.com/{tenant}";
 // App ID URI of web API to call
 const string resourceId = "https://target-api.domain.com";
 X509Certificate2 certificate = LoadCertificate();

 public async Task<AuthenticationResult> GetAuthenticationResult()
 {

  var authContext = new AuthenticationContext(authority);
  var clientAssertionCert = new ClientAssertionCertificate(
                                  ClientId,
                                  certificate);


  var authResult = await authContext.AcquireTokenAsync(
                                      resourceId,
                                      clientAssertionCert,
                                );

  return authResult;
 }
}
```
:::column-end:::   
:::column span="":::
```csharp
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Graph;
using Microsoft.Identity.Abstractions;
using Microsoft.Identity.Web;
using System;
using System.Threading.Tasks;

class Program
{
   static async Task Main(string[] _)
   {
      TokenAcquirerFactory tokenAcquirerFactory = TokenAcquirerFactory.GetDefaultInstance();

      // Configure the application options to be read from the configuration
      // and add the services you need (Graph, token cache)
      IServiceCollection services = tokenAcquirerFactory.Services;
      services.AddMicrosoftGraph();
      // By default, you get an in-memory token cache.
      // For more token cache serialization options, see https://aka.ms/msal-net-token-cache-serialization

      // Resolve the dependency injection.
      var serviceProvider = tokenAcquirerFactory.Build();

      // Call Microsoft Graph using the Graph SDK
      try
      {
            GraphServiceClient graphServiceClient = serviceProvider.GetRequiredService<GraphServiceClient>();
            var users = await graphServiceClient.Users
               .GetAsync(r => r.Options.WithAppOnly());
            Console.WriteLine($"{users.Value.Count} users");
      }
      catch (ServiceException e)
      {
            Console.WriteLine("We could not retrieve the user's list: " + $"{e}");

            // If you get the following exception, here is what you need to do
            // ---------------------------------------------------------------
            //  IDW10503: Cannot determine the cloud Instance.
            //    Provide the configuration (appsettings.json with an "AzureAd" section, and "Instance" set,
            //    the project needs to be this way)
            // <ItemGroup>
            //  < None Update = "appsettings.json" >
            //    < CopyToOutputDirectory > PreserveNewest </ CopyToOutputDirectory >
            //  </ None >
            // </ ItemGroup >
            // System.ArgumentNullException: Value cannot be null. (Parameter 'tenantId')
            //    Provide the TenantId in the configuration
            // Microsoft.Identity.Client.MsalClientException: No ClientId was specified.
            //    Provide the ClientId in the configuration
            // ErrorCode: Client_Credentials_Required_In_Confidential_Client_Application
            //    Provide a ClientCredentials section containing either a client secret, or a certificate
            //    or workload identity federation for Kubernates if your app runs in AKS
      }
   }
}
```
   :::column-end:::
:::row-end:::

#### Benefit from token caching

If you don't setup token caching, the token issuer will throttle you, resulting in errors. It also takes a lot less to get a token from the cache (10-20ms) than it is from ESTS (500-30000ms).

If you want to implement a distributed token cache, see [Token cache for a web app or web API (confidential client application)](msal-net-token-cache-serialization.md?tabs=aspnet) and the sample [active-directory-dotnet-v1-to-v2/ConfidentialClientTokenCache](https://github.com/Azure-Samples/active-directory-dotnet-v1-to-v2/tree/master/ConfidentialClientTokenCache).

[Learn more about the daemon scenario](scenario-daemon-overview.md) and how it's implemented with MSAL.NET or Microsoft.Identity.Web in new applications.

## [Web API calling downstream web APIs](#tab/obo)

### Migrate a web API that calls downstream web APIs

Web APIs that call downstream web APIs use the OAuth2.0 [on-behalf-of (OBO)](v2-oauth2-on-behalf-of-flow.md) flow. The web API uses the access token retrieved from the HTTP **Authorize** header and it validates this token. This token is then exchanged against a token to call the downstream web API. This token is used as a `UserAssertion` instance in both ADAL.NET and MSAL.NET.

#### Find out if your code uses OBO

The ADAL code for your app uses OBO if it contains a call to `AuthenticationContext.AcquireTokenAsync` with the following parameters:

- A resource (app ID URI) as a first parameter
- `IClientAssertionCertificate` or `ClientAssertion` as the second parameter
- A parameter of type `UserAssertion`

#### Update the code by using OBO

[!INCLUDE [Common steps](includes/msal-net-adoption-steps-confidential-clients.md)]

In this case, we replace the call to `AuthenticationContext.AcquireTokenAsync` with a call to `IConfidentialClientApplication.AcquireTokenOnBehalfOf`.

Here's a comparison of sample OBO code for ADAL.NET and MSAL.NET:

:::row:::
   :::column span="":::
      ADAL
   :::column-end:::
   :::column span="":::
      MSAL
   :::column-end:::
:::row-end:::
:::row:::
:::column span="":::
```csharp
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;

public partial class AuthWrapper
{
 const string ClientId = "Guid (AppID)";
  const string authority 
  = "https://login.microsoftonline.com/common";
 X509Certificate2 certificate = LoadCertificate();



 public async Task<AuthenticationResult> GetAuthenticationResult(
  string resourceId, 
  string tokenUsedToCallTheWebApi)
 {


  var authContext = new AuthenticationContext(authority);
  var clientAssertionCert = new ClientAssertionCertificate(
                                  ClientId,
                                  certificate);



  var userAssertion = new UserAssertion(tokenUsedToCallTheWebApi);

  var authResult = await authContext.AcquireTokenAsync(
                                      resourceId,
                                      clientAssertionCert,
                                      userAssertion,
                                );

  return authResult;
 }
}
```
:::column-end:::
:::column span="":::
```csharp
using Microsoft.Identity.Client;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;

public partial class AuthWrapper
{
 const string ClientId = "Guid (Application ID)";
  const string authority 
  = "https://login.microsoftonline.com/common";
 X509Certificate2 certificate = LoadCertificate();

 IConfidentialClientApplication app;

 public async Task<AuthenticationResult> GetAuthenticationResult(
  string resourceId,
  string tokenUsedToCallTheWebApi)
 {
 
  var app = ConfidentialClientApplicationBuilder.Create(ClientId)
           .WithCertificate(certificate)
           .WithAuthority(authority)
           .Build();

  // Setup token caching https://learn.microsoft.com/azure/active-directory/develop/msal-net-token-cache-serialization?tabs=aspnet
  // For example, for an in-memory cache with 1GB limit. For OBO, it is recommended to use a distributed cache like Redis.
  app.AddInMemoryTokenCache(services =>
  {
      // Configure the memory cache options
      services.Configure<MemoryCacheOptions>(options =>
      {
          options.SizeLimit = 1024 * 1024 * 1024; // in bytes (1 GB of memory)
      });
  }

  var userAssertion = new UserAssertion(tokenUsedToCallTheWebApi);

  var authResult = await app.AcquireTokenOnBehalfOf(
              new string[] { $"{resourceId}/.default" },
              userAssertion)
              // .WithTenantId(specificTenant) 
              // See https://aka.ms/msal.net/withTenantId
              .ExecuteAsync()
              .ConfigureAwait(false);
  
  return authResult;
 }
}
```

And in the appsettings.json file:
```json
{
"AzureAd": {
   "Instance": "https://login.microsoftonline.com/",
   "TenantId": "[Enter here the tenantID or domain name for your Azure AD tenant]",
   "ClientId": "[Enter here the ClientId for your application]",
   "ClientCredentials": [
      {
         "SourceType": "KeyVault",
         "KeyVaultUrl": "<VaultUri>",
         "KeyVaultCertificateName": "<CertificateName>"
      }
   ]
}
}
```
:::column-end:::
:::row-end:::

#### Benefit from token caching

For token caching in OBOs, use a distributed token cache. For details, see [Token cache for a web app or web API (confidential client app)](msal-net-token-cache-serialization.md?tabs=aspnet) and read through [sample code](https://github.com/Azure-Samples/active-directory-dotnet-v1-to-v2/tree/master/ConfidentialClientTokenCache).

```CSharp
app.UseInMemoryTokenCaches(); // or a distributed token cache.
```

[Learn more about web APIs calling downstream web APIs](scenario-web-api-call-api-overview.md) and how they're implemented with MSAL.NET or Microsoft.Identity.Web in new apps.

## [Web app calling web APIs](#tab/authcode)

### Migrate a web app that calls web APIs

If your app uses ASP.NET Core, we strongly recommend that you update to Microsoft.Identity.Web because it processes everything for you. For a quick presentation, see the [Microsoft.Identity.Web announcement of general availability](https://github.com/AzureAD/microsoft-identity-web/wiki/1.0.0) and the higher-level API improvements brought in [Microsoft.Identity.Web 2.x](https://github.com/AzureAD/microsoft-identity-web/wiki/v2.0). For details about how to use it in a web app, see [Why use Microsoft.Identity.Web in web apps?](https://aka.ms/ms-id-web/webapp).

Web apps that sign in users and call web APIs on behalf of users employ the OAuth2.0 [authorization code flow](v2-oauth2-auth-code-flow.md). Typically:

1. The app signs in a user by executing a first leg of the authorization code flow by going to the Microsoft identity platform authorize endpoint. The user signs in and performs multi-factor authentications if needed. As an outcome of this operation, the app receives the authorization code. The authentication library isn't used at this stage.
1. The app executes the second leg of the authorization code flow. It uses the authorization code to get an access token, an ID token, and a refresh token. Your application needs to provide the `redirectUri` value, which is the URI where the Microsoft identity platform endpoint will provide the security tokens. After the app receives that URI, it typically calls `AcquireTokenByAuthorizationCode` for ADAL or MSAL to redeem the code and to get a token that will be stored in the token cache.
1. The app uses ADAL or MSAL to call `AcquireTokenSilent` to get tokens for calling the necessary web APIs from the web app controllers.

#### Find out if your code uses the auth code flow

The ADAL code for your app uses auth code flow if it contains a call to `AuthenticationContext.AcquireTokenByAuthorizationCodeAsync`.

#### Update the code by using the authorization code flow

[!INCLUDE [Common steps](includes/msal-net-adoption-steps-confidential-clients.md)] 

In this case, the call to `AuthenticationContext.AcquireTokenAsync` will be replaced in the `Startup.cs` file of your web app. ASP .NET Core middleware will handle the sign0-in and acquisition of the authorization code, and Microsoft.Identity.Web will engage MSAL to exchange the code for tokens and call downstream APIs.

Here's a comparison of sample authorization code flows for ADAL.NET and Microsoft.Identity.Web:

:::row:::
   :::column span="":::
      ADAL
   :::column-end:::
   :::column span="":::
      Microsoft.Identity.Web
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
```csharp
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;

public partial class AuthWrapper
{
 const string ClientId = "Guid (AppID)";
 const string authority 
     = "https://login.microsoftonline.com/common";
 private Uri redirectUri = new Uri("host/login_oidc");
 X509Certificate2 certificate = LoadCertificate();

 public async Task<AuthenticationResult> GetAuthenticationResult(
  string resourceId,
  string authorizationCode)
 {

  var ac = new AuthenticationContext(authority);
  var clientAssertionCert = new ClientAssertionCertificate(
                                  ClientId,
                                  certificate);

  var authResult = await ac.AcquireTokenByAuthorizationCodeAsync(
                                      authorizationCode,
                                      redirectUri,
                                      clientAssertionCert,
                                      resourceId,
                                );
  return authResult;
 }
}
```      
   :::column-end:::
   :::column span="":::
```csharp
﻿using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Identity.Web;
using Microsoft.Identity.Web.UI;

public class Startup
{
   public Startup(IConfiguration configuration)
   {
      Configuration = configuration;
   }

   public IConfiguration Configuration { get; }

   // This method gets called by the runtime. Use this method to add services to the container.
   public void ConfigureServices(IServiceCollection services)
   {
      // Sign-in users with the Microsoft identity platform
      services.AddAuthentication(OpenIdConnectDefaults.AuthenticationScheme)
      .AddMicrosoftIdentityWebApp(options => Configuration.Bind("AzureAd", options));

      services.AddControllersWithViews(options =>
      {
            var policy = new AuthorizationPolicyBuilder()
               .RequireAuthenticatedUser()
               .Build();
            options.Filters.Add(new AuthorizeFilter(policy));
      }).AddMicrosoftIdentityUI();

      services.AddRazorPages();
   }

   // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
   public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
   {    
      app.UseAuthentication();
      app.UseAuthorization();
   }
}
```
   :::column-end:::
:::row-end:::

#### Benefit from token caching

To use the in-memory token cache, update the `Startup.cs`:
```csharp
// or use a distributed Token Cache by adding
services.AddMicrosoftIdentityWebAppAuthentication(Configuration);
   .EnableTokenAcquisitionToCallDownstreamApi(new string[] { scopesToRequest })
      .AddInMemoryTokenCaches();
```
Or use a distributed cache, which is recommended for production services, update the `Startup.cs`:

```csharp
services.AddMicrosoftIdentityWebAppAuthentication(Configuration);
      .EnableTokenAcquisitionToCallDownstreamApi(new string[] { scopesToRequest })
         .AddDistributedTokenCaches();

// and then choose your implementation

// For instance the distributed in memory cache 
services.AddDistributedMemoryCache() // NOT RECOMMENDED FOR PRODUCTION! Use a persistent cache like Redis

// Or a Redis cache
services.AddStackExchangeRedisCache(options =>
{
options.Configuration = "localhost";
options.InstanceName = "SampleInstance";
});

// Or a Cosmos DB cache
services.AddCosmosCache((CosmosCacheOptions cacheOptions) =>
{
   cacheOptions.ContainerName = Configuration["CosmosCacheContainer"];
   cacheOptions.DatabaseName = Configuration["CosmosCacheDatabase"];
   cacheOptions.ClientBuilder = new CosmosClientBuilder(Configuration["CosmosConnectionString"]);
   cacheOptions.CreateIfNotExists = true;
});

// Or even a SQL Server token cache
services.AddDistributedSqlServerCache(options =>
{
options.ConnectionString = _config["DistCache_ConnectionString"];
options.SchemaName = "dbo";
options.TableName = "TestCache";
options.DefaultSlidingExpiration = TimeSpan.FromMinutes(90);
});
```
Learn more about [the L1 cache in a distributed (L2) token cache](https://github.com/AzureAD/microsoft-identity-web/wiki/L1-Cache-in-Distributed-(L2)-Token-Cache).

#### Handling MsalUiRequiredException

Microsoft.Identity.Web handles the `MsalUiRequiredException` for you, out of the box. Learn more about [conditional access and incremental consent](https://github.com/AzureAD/microsoft-identity-web/wiki/Managing-incremental-consent-and-conditional-access) or details on mitigation see how to [Handle errors and exceptions in MSAL.NET](msal-error-handling-dotnet.md).

[Learn more about web apps calling web APIs](scenario-web-app-call-api-overview.md) and how they're implemented with MSAL.NET or Microsoft.Identity.Web in new applications.

---

## MSAL and Microsoft.Identity.Web benefits

Key benefits for your app include:

- **Resilience**. 

  - [Azure AD Cached Credential Service (CCS) benefits](https://techcommunity.microsoft.com/t5/microsoft-entra-azure-ad-blog/advances-in-azure-ad-resilience/ba-p/2147048). CCS operates as an Azure AD backup.
  - Proactive renewal of tokens if the API that you call enables long-lived tokens through [continuous access evaluation](app-resilience-continuous-access-evaluation.md).

- **Security**. 
   - You can acquire Proof of Possession (PoP) tokens if the web API that you want to call requires it. For details, see [Proof Of Possession tokens in MSAL.NET](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki/Proof-Of-Possession-(PoP)-tokens).
   - Microsoft.Identity.Web leverages Microsoft.IdentityModel, the premier defensive-in-depth auth request validation library offered by Microsoft.


- **Performance and scalability**. 
   - Engingeering teams focus on performance improvements across our suite of authentication and authorization libraries, such as improvements made in Microsoft.IdentityModel 7x, which bring the requests per second from 320K to 380K.
   - The libraries are compatible with and supported by the latest and greatest versions of .NET.
   - Microsoft.Identity.Web, MSAL.NET and Microsoft.IdentityModel are Ahead of Time (AOT) compatible and trimmed.

## Troubleshooting

Find more resource on [web app troubleshooting](https://github.com/AzureAD/microsoft-identity-web/wiki/web-app-troubleshooting) and [web API troubleshooting](https://github.com/AzureAD/microsoft-identity-web/wiki/web-api-troubleshooting)

## Next steps

Learn more about:
- [differences between ADAL.NET and MSAL.NET apps](msal-net-differences-adal-net.md).
- [token cache serialization in MSAL.NET](msal-net-token-cache-serialization.md)

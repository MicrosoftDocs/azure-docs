---
title: Migrating confidential client applications to MSAL.NET
titleSuffix: Microsoft identity platform
description: Learn how to migrate a confidential client application from Azure AD Authentication Library for .NET (ADAL.NET) to Microsoft Authentication Library for .NET (MSAL.NET).
services: active-directory
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: how-to
ms.workload: identity
ms.date: 06/08/2021
ms.author: jmprieur
ms.reviewer: saeeda, shermanouko
ms.custom: "devx-track-csharp, aaddev"
#Customer intent: As an application developer, I want to migrate my confidential client app from ADAL.NET to  MSAL.NET.
---

# How to migrate confidential client applications from ADAL.NET to MSAL.NET

Confidential client applications are web apps, web APIs, and daemon applications (calling another service on their own behalf). For details see [Authentication flows and application scenarios](authentication-flows-app-scenarios.md). If your app is based on ASP.NET Core, use [Microsoft.Identity.Web](microsoft-identity-web.md)

The migration process consists of three steps:

1. Inventory - identify the code in your apps that uses ADAL.NET.
2. Install the MSAL.NET NuGet package.
3. Update the code depending on your scenario.

For app registrations, if your application isn't dual stacked (AAD and MSA being two apps):

- You don't need to create a new app registration (you keep the same ClientID)
- You don't need to change the pre-authorizations.

## Step 1 - Find the code using ADAL.NET in your app

The code using ADAL in confidential client application instantiates an `AuthenticationContext` and calls either `AcquireTokenByAuthorizationCode` or one override of `AcquireTokenAsync` with the following parameters:

- A `resourceId` string. This variable is the **App ID URI** of the web API that you want to call.
- An instance of `IClientAssertionCertificate` or `ClientAssertion` instance. This instance provides the client credentials for your app (proving the identity of your app).

## Step 2 - Install the MSAL.NET NuGet package

Once you've identified that you have apps that are using ADAL.NET, install the MSAL.NET NuGet package: [Microsoft.Identity.Client](https://www.nuget.org/packages/Microsoft.Identity.Client) and update your project library references.
For more information on how to install a NuGet package, see [install a NuGet package](https://www.bing.com/search?q=install+nuget+package).

## Step 3 - Update the code

Updating code depends on the confidential client scenario. Some steps are common and apply across all the confidential client scenarios. There are also steps that are unique to each scenario. 

The confidential client scenarios are as listed below:

- [Daemon scenarios](/active-directory/develop/msal-net-migration-confidential-client?tabs=daemon#migrate-daemon-scenarios) supported by web apps, web APIs, and daemon console applications.
- [Web api calling downstream web apis](/active-directory/develop/msal-net-migration-confidential-client?tabs=obo#migrate-on-behalf-of-calls-obo-in-web-apis) supported by web APIs calling downstream web APIs on behalf of the user.
- [Web app calling web apis](/active-directory/develop/msal-net-migration-confidential-client?tabs=authcode#migrate-acquiretokenbyauthorizationcodeasync-in-web-apps) supported by Web apps that sign in users and call a downstream web API.

You may have provided a wrapper around ADAL.NET to handle certificates and caching. This article uses the same approach to illustrate the migration from ADAL.NET to MSAL.NET process. However, this code is only for demonstration purposes. Don't copy/paste these wrappers or integrate them in your code as they are.

## [Daemon](#tab/daemon)

### Migrate daemon apps

Daemon scenarios use the OAuth2.0 [client credential flow](v2-oauth2-client-creds-grant-flow.md). They're also called service to service calls. Your app acquires a token on its own behalf, not on behalf of a user.

#### Find if your code uses daemon scenarios

The ADAL code for your app uses daemon scenarios if it contains a call to `AuthenticationContext.AcquireTokenAsync` with the following parameters:

- A resource (App ID URI) as a first parameter.
- A `IClientAssertionCertificate` or `ClientAssertion` as the second parameter.

It doesn't have a parameter of type `UserAssertion`. If it does, then your app is a web API, and it's using [on behalf of flow](/active-directory/develop/msal-net-migration-confidential-client?#migrate-on-behalf-of-calls-obo-in-web-apis) scenario.

#### Update the code of daemon scenarios

[!INCLUDE [Common steps](includes/msal-net-adoption-steps-confidential-clients.md)]

In this case, we replace the call to `AuthenticationContext.AcquireTokenAsync` by a call to `IConfidentialClientApplication.AcquireTokenClient`.

##### Sample daemon code

The following table compares the ADAL.NET and MSAL.NET code for daemon scenarios.

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
   = "https://login.microsoftonline.com/{tenant}";
 // App ID Uri of web API to call
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
using Microsoft.Identity.Client;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;

public partial class AuthWrapper
{
 const string ClientId = "Guid (Application ID)";
 const string authority 
   = "https://login.microsoftonline.com/{tenant}";
 // App ID Uri of web API to call
 const string resourceId = "https://target-api.domain.com";
 X509Certificate2 certificate = LoadCertificate();

 IConfidentialClientApplication app;

 public async Task<AuthenticationResult> GetAuthenticationResult()
 {
  if (app == null)
  {
   app = ConfidentialClientApplicationBuilder.Create(ClientId)
           .WithCertificate(certificate)
           .WithAuthority(authority)
           .Build();
  }

  var authResult = await app.AcquireTokenForClient(
              new [] { $"{resourceId}/.default" })
              .ExecuteAsync()
              .ConfigureAwait(false);

  return authResult;
 }
}
```
   :::column-end:::
:::row-end:::

#### Token caching

To benefit from the in-memory cache, the instance of `IConfidentialClientApplication` needs to be kept in a member variable. If you re-create the confidential client application each time you request a token, you won't benefit from the token cache.

You'll need to serialize the AppTokenCache if you choose not to use the default in-memory app token cache. Similarly, If you want to implement a distributed token cache, you'll need to serialize the AppTokenCache. For details see [token cache for a web app or web API (confidential client application)](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki/token-cache-serialization#token-cache-for-a-web-app-or-web-api-confidential-client-application) and this sample [active-directory-dotnet-v1-to-v2/ConfidentialClientTokenCache](https://github.com/Azure-Samples/active-directory-dotnet-v1-to-v2/tree/master/ConfidentialClientTokenCache).

[Learn more about demon scenario](scenario-daemon-overview.md) and how it's implemented with MSAL.NET or Microsoft.Identity.Web in new applications.

## [Web api calling downstream web apis](#tab/obo)

### Migrate web api calling downstream web apis

Web apis calling downstream web apis use the OAuth2.0 [On-Behalf-Of](v2-oauth2-on-behalf-of-flow.md)(OBO) flow. The code of the web API will use the token retrieved from the HTTP authorized header and validate it. This token will be exchanged against a token to call the downstream web API. This token is used as a `UserAssertion` in both ADAL.NET and MSAL.NET.

#### Find if your code uses OBO

The ADAL code for your app uses OBO if it contains a call to `AuthenticationContext.AcquireTokenAsync` with the following parameters:

- A resource (App ID URI) as a first parameter
- A `IClientAssertionCertificate` or `ClientAssertion` as the second parameter.
- A parameter of type `UserAssertion`.

#### Update the code using OBO

[!INCLUDE [Common steps](includes/msal-net-adoption-steps-confidential-clients.md)]

In this case, we replace the call to `AuthenticationContext.AcquireTokenAsync` by a call to `IConfidentialClientApplication.AcquireTokenOnBehalfOf`.

##### Sample OBO code
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
  if (app == null)
  {
   app = ConfidentialClientApplicationBuilder.Create(ClientId)
           .WithCertificate(certificate)
           .WithAuthority(authority)
           .Build();
  }


  var userAssertion = new UserAssertion(tokenUsedToCallTheWebApi);

  var authResult = await app.AcquireTokenOnBehalfOf(
              new string[] { $"{resourceId}/.default" },
              userAssertion)
              .ExecuteAsync()
              .ConfigureAwait(false);
  
  return authResult;
 }
}
```
:::column-end:::
:::row-end:::

#### Token caching

For token caching in OBOs, you need to use a distributed token cache. For details see [token cache for a web app or web API (confidential client application)](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki/token-cache-serialization#token-cache-for-a-web-app-or-web-api-confidential-client-application) and [read through sample code](https://github.com/Azure-Samples/active-directory-dotnet-v1-to-v2/tree/master/ConfidentialClientTokenCache)

```CSharp
IMsalTokenCacheProvider msalTokenCacheProvider = CreateTokenCache(cacheImplementation)
msalTokenCacheProvider.Initialize(app.UserTokenCache);
```

Refer to [code samples](https://github.com/Azure-Samples/active-directory-dotnet-v1-to-v2/blob/master/ConfidentialClientTokenCache/Program.cs) for an example of implementation of `CreateTokenCache`.

[Learn more about web APIs calling downstream web API](scenario-web-api-call-api-overview.md) and how they're implemented with MSAL.NET or Microsoft.Identity.Web in new applications.

## [Web app calling web apis.](#tab/authcode)

### Migrate web apps calling web apis

If your app uses ASP.NET Core, Microsoft strongly recommends you update to Microsoft.Identity.Web which processes everything for you. See [Microsoft identity web GA](https://github.com/AzureAD/microsoft-identity-web/wiki/1.0.0) for a quick presentation, and [https://aka.ms/ms-id-web/webapp](https://aka.ms/ms-id-web/webapp) for details about how to use it in a web app.

Web apps that sign in users and call web APIs on behalf of the user use the OAuth2.0 [authorization code flow](v2-oauth2-auth-code-flow.md). Typically:

1. The web app signs-in a user by executing a first leg of the auth code flow. It does this by going to Azure AD's authorize endpoint. The users signs-in, and performs multiple factor authentications if needed. As an outcome of this operation, the app receives the **authorization code**. So far ADAL/MSAL aren't involved.
2. The app will, then, execute the second leg of the authorization code flow. It uses the authorization code to get an access token, an ID Token, and a refresh token. Your application needs to provide the redirectUri, which is the URI at which Azure AD will provide the security tokens. Once received, the web app will typically call ADAL/MSAL `AcquireTokenByAuthorizationCode` to redeem the code, and get a token that will be stored in the token cache.
3. The app will then use ADAL or MSAL to call `AcquireTokenSilent` to acquire tokens used to call the web APIs it needs to call. This is done from the web app controllers.

#### Find if your code uses the auth code flow

The ADAL code for your app uses auth code flow if it contains a call to `AuthenticationContext.AcquireTokenByAuthorizationCodeAsync`.

#### Update the code using auth code flow

[!INCLUDE [Common steps](includes/msal-net-adoption-steps-confidential-clients.md)] 

In this case, we replace the call to `AuthenticationContext.AcquireTokenAsync` by a call to `IConfidentialClientApplication.AcquireTokenByAuthorizationCode`.

##### Sample auth code flow code

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
public partial class AuthWrapper
{
 const string ClientId = "Guid (Application ID)";
 const string authority 
     = "https://login.microsoftonline.com/{tenant}";
 private Uri redirectUri = new Uri("host/login_oidc");
 X509Certificate2 certificate = LoadCertificate();

 IConfidentialClientApplication app;

 public async Task<AuthenticationResult> GetAuthenticationResult(
  string resourceId,
  string authorizationCode)
 {
  if (app == null)
  {
   app = ConfidentialClientApplicationBuilder.Create(ClientId)
           .WithCertificate(certificate)
           .WithAuthority(authority)
           .WithRedirectUri(redirectUri.ToString())
           .Build();
  }

  var authResult = await app.AcquireTokenByAuthorizationCode(
              new [] { $"{resourceId}/.default" },
              authorizationCode)
              .ExecuteAsync()
              .ConfigureAwait(false);

  return authResult;
 }
}
```
   :::column-end:::
:::row-end:::

Calling `AcquireTokenByAuthorizationCode` adds a token to the token cache. To acquire extra token(s) for other resources or tenants, use `AcquireTokenSilent` in your controllers.

#### Token caching

Since your web app uses `AcquireTokenByAuthorizationCode`, your app needs to use a distributed token cache for token caching. For details see [token cache for a web app or web API (confidential client application)](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki/token-cache-serialization#token-cache-for-a-web-app-or-web-api-confidential-client-application) and [read through sample code](https://github.com/Azure-Samples/active-directory-dotnet-v1-to-v2/tree/master/ConfidentialClientTokenCache)


```CSharp
IMsalTokenCacheProvider msalTokenCacheProvider = CreateTokenCache(cacheImplementation)
msalTokenCacheProvider.Initialize(app.UserTokenCache);
```

Refer to [code samples](https://github.com/Azure-Samples/active-directory-dotnet-v1-to-v2/blob/master/ConfidentialClientTokenCache/Program.cs) for an example of implementation of `CreateTokenCache`.

[Learn more about web apps calling web APIs](scenario-web-app-call-api-overview.md) and how they're implemented with MSAL.NET or Microsoft.Identity.Web in new applications.

---

## MSAL benefits

Some of the key features that come with MSAL.NET are resilience, security, performance, and scalability. These are described below.

### Resilience

Using MSAL.NET ensures your app is resilient. This is achieved through the following:

- AAD Cached Credential Service(CCS) benefits. CCS operates as an AAD backup.
- Proactive renewal of tokens if the API you call enables long lived tokens through [continuous access evaluation](app-resilience-continuous-access-evaluation.md).

### Security

You can also acquire Proof of Possession (PoP) tokens if the web API that you want to call requires it. For details see [Proof Of Possession (PoP) tokens in MSAL.NET](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki/Proof-Of-Possession-(PoP)-tokens)

### Performance and scalability

If you don't need to share your cache with ADAL.NET, disable the legacy cache compatibility when creating the confidential client application (`.WithLegacyCacheCompatibility(false)`). This increases the performance significantly.
  
```csharp
app = ConfidentialClientApplicationBuilder.Create(ClientId)
        .WithCertificate(certificate)
        .WithAuthority(authority)
        .WithLegacyCacheCompatibility(false)
        .Build();
```

## Troubleshooting

This troubleshooting guide makes two assumptions: 

- It assumes that your ADAL.NET code was working.
- It assumes that you migrated to MSAL keeping the same ClientID.

### AADSTS700027 exception

If you get an exception with the following message: 

> `AADSTS700027: Client assertion contains an invalid signature. [Reason - The key was not found.]`

You can troubleshoot the exception using the steps below:

- Confirm that you're using the latest version of MSAL.NET,
- Confirm that the authority host set when building the confidential client application and the authority host you used with ADAL are similar. In particular, is it the same [cloud](msal-national-cloud.md)? (Azure Government, Azure China 21Vianet, Azure Germany).

### AADSTS700030 exception

If you get an exception with the following message: 

> `AADSTS90002: Tenant 'cf61953b-e41a-46b3-b500-663d279ea744' not found. This may happen if there are no active`
> `subscriptions for the tenant. Check to make sure you have the correct tenant ID. Check with your subscription`
> `administrator.`

You can troubleshoot the exception using the steps below:

- Confirm that you're using the latest version of MSAL.NET,
- Confirm that the authority host set when building the confidential client application and the authority host you used with ADAL are similar. In particular, is it the same [cloud](msal-national-cloud.md)? (Azure Government, Azure China 21Vianet, Azure Germany).

## Next steps

Learn more about the [Differences between ADAL.NET and MSAL.NET apps](msal-net-differences-adal-net.md)

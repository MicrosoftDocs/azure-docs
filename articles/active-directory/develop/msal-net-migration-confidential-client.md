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
ms.reviewer: saeeda
ms.custom: "devx-track-csharp, aaddev"
#Customer intent: As an application developer, I want to migrate my confidential client app from ADAL.NET to  MSAL.NET.
---

# How to migrate confidential client applications from ADAL.NET to MSAL.NET

Confidential client applications are web apps, web APIs, and daemon applications (calling another service on their own behalf).

If your app is based on ASP.NET Core, a great wrapper already exists (Microsoft.Identity.Web). See the [decision tree](msal-net-migration.md#should-you-migrate-to-msalnet-or-to-microsoftidentityweb) for more information.

The migration process consists of:

1. Inventory - identify the code in your apps that uses ADAL.NET.
2. Install the MSAL.NET NuGet package.
3. Update the code:
   1. Replace resourceID by scopes.
   2. Replace AuthenticationContext by IConfidentialClientApplication and its builder.
   3. Depending on your scenario, replace AcquireTokenAsync by AcquireTokenXXX.
   4. Handle the MSAL exceptions.
   5. Enable token caching for better performance.
   6. Improve your code to enable resilience.

From the point of view of the app registration, if your application is not dual stacked (AAD and MSA being two apps), things should be relatively simple:

- You don't need to create a new app registration (you keep the same ClientID)
- You don't need to change the pre-authorizations.

## Step 1 - Find the code using ADAL.NET in your app

The code using ADAL in confidential client application instantiates an `AuthenticationContext` and calls `AcquireTokenAsync` with the following parameters:

- a `resourceId` string. This is the **App ID URI** of the web API that you want to call.
- an instance of `IClientAssertionCertificate` or `ClientAssertion` instance. This is providing the client credentials for your app (proving the identity of your app).

## Step 2 - Update the code

Some steps are common, others depend on the scenarios that your app implements.

### common steps

- Install the MSAL.NET NuGet package: [Microsoft.Identity.Client](https://www.nuget.org/packages/Microsoft.Identity.Client) and update your project library references.
- Add the MSAL.NET namespace in your source code: `using Microsoft.Identity.Client;`
- Instead of instantiating an `AuthenticationContext`, use `ConfidentialClientApplicationBuilder.Create` to instantiate a `IConfidentialClientApplication`.
- Instead of the `resourceId` string, MSAL.NET uses scopes. As first party applications are pre-authorized you can always use the following scopes: `new string[] { $"{resourceId}/.default" }`
- Replace the call to `AuthenticationContext.AcquireTokenAsync` by a call to `IConfidentialClientApplication.AcquireTokenXXX` where XXX depends on your scenario.

The confidential client scenarios are the following:

- [Daemon scenarios](&tabs=daemon#migrate-daemon-scenarios) supported by web apps, web APIs and daemon console applications.
- [On behalf of](&tabs=obo#migrate-on-behalf-of-calls-obo-in-web-apis) supported by web APIs calling downstream web APIs on behalf of the user.
- [Authorization code flow](&tabs=authcode#migrate-acquiretokenbyauthorizationcodeasync-in-web-apps) supported by Web apps that sign-in users and call a downstream web API.

Most of you provided a wrapper around ADAL.NET. Therefore, in this document, we illustrate migrating scenarios using code such a wrapper, but this is only to show equivalent code (we are not suggesting that you copy/paste these wrapper or integrate them in your code)

# [Daemon](#tab/daemon)

### Migrate Daemon scenarios

Daemon scenarios use the OAuth2.0 [Client credential flow](v2-oauth2-client-creds-grant-flow.md). They are also called service to service calls. Your app acquires a token on its own behalf, not on behalf of a user.

#### Find if your code uses daemon scenarios

The ADAL code for your app uses daemon scenarios if it contains a call to `AuthenticationContext.AcquireTokenAsync` taking:

- a resource (App ID URI) as a first parameter
- a `IClientAssertionCertificate` or `ClientAssertion` as the second parameter.
- Optionally it sets `sendX5c` to help certificate rotation

It does not have a parameter of type `UserAssertion`. If it does, then your app is a web API, and it's using another flow: the [on behalf of flow](#how-to-migrate-on-behalf-of-calls-obo-in-web-apis).

#### Update the code of daemon scenarios

The following table compares the ADAL.NET and MSAL.NET code for daemon scenarios.

<table>
<tr>
<td>ADAL</td>
<td>MSAL</td>
</tr>

<tr>
<td valign="top">

```c#
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;

public partial class AuthWrapper
{
 const string ClientId = "Guid (AppID)";
 const string authority 
   = "https://login.microsoftonline.com/{tenant}";
 const string resourceId = "App ID Uri of web API to call";
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
                                      sendX5c: true);


  return authResult;
 }
}
```

</td>
<td valign="top">

```c#
using Microsoft.Identity.Client;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;

public partial class AuthWrapper
{
 const string ClientId = "Guid (Application ID)";
 const string authority 
   = "https://login.microsoftonline.com/{tenant}";
 const string resourceId = "App ID Uri of web API to call";
 X509Certificate2 certificate = LoadCertificate();

 IConfidentialClientApplication app;

 public async Task<AuthenticationResult> GetAuthenticationResult()
 {
  if (app == null)
  {
   app = ConfidentialClientApplicationBuilder.Create(ClientId)
           .WithCertificate(certificate)
           .WithAuthority(authority)
           .WithAzureRegion()
           .Build();
  }

  var authResult = await app.AcquireTokenForClient(
              new [] { $"{resourceId}/.default" })
              .WithSendX5C(true)
              .ExecuteAsync()
              .ConfigureAwait(false);

  return authResult;
 }
}
```

</td>
</tr>
</table>

#### Remarks about the code

##### Resilience

Resilience is ensured in the following way:

- `.WithAzureRegion()` will attempt an automatic region detection. For details, see [Use MSAL to target regional ESTS](https://aka.ms/msal/estsr/guidance).
- You will automatically benefit from CCS.
- Tokens are proactively renewed by MSAL.NET if you enable long lived tokens.

##### Security

`.WithSendX5C` helps you rotate the certificate credentials by leveraging [Subject Name and Issuer Authentication](https://aka.ms/msal-net-sni)

##### Performance and scalability

- The Instance of `IConfidentialClientApplication` needs to be kept in member variable in order to benefit from the in-memory cache. If you re-create the confidential client application each time you request a token you won't benefit from the token cache.
- If you don't need to share your cache with ADAL.NET, disable the legacy cache compatibility when creating the confidential client application (`.WithLegacyCacheCompatibility(false)`). You'll increase the performance significantly.
  
  ```c#
  app = ConfidentialClientApplicationBuilder.Create(ClientId)
           .WithCertificate(certificate)
           .WithAuthority(authority)
           .WithAzureRegion()
           .WithLegacyCacheCompatibility(false)
           .Build();
  ```

- If you don't want to use the default in-memory app token cache, or want to implement a distributed token cache, you'll need to serialize the AppTokenCache. For details see [Token cache for a web app or web API (confidential client application)](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki/token-cache-serialization#token-cache-for-a-web-app-or-web-api-confidential-client-application) and this sample [active-directory-dotnet-v1-to-v2/ConfidentialClientTokenCache](https://github.com/Azure-Samples/active-directory-dotnet-v1-to-v2/tree/master/ConfidentialClientTokenCache)

#### More about the daemon scenario

If you want to learn more about the daemon scenario and how it's implemented with MSAL.NET or Microsoft.Identity.Web in new applications, see [Scenario: Daemon application that calls web APIs](scenario-daemon-overview.md)

# [On Behalf of](#tab/obo)

### Migrate on-behalf-of calls (OBO) in web APIs

Web APIs that call downstream web APIs on behalf of the user use the OAuth2.0 [On-Behalf-Of flow](v2-oauth2-on-behalf-of-flow.md), in short OBO. The code will use the token that was used to call your web API (which retrieved it from the HTTP Authorize header and validated it). This token will be exchanged against a token to call the downstream web API. This token is used as a `UserAssertion` (both in ADAL.NET and MSAL.NET)

#### Find if your code uses OBO

The ADAL code for your app uses OBO if it contains a call to `AuthenticationContext.AcquireTokenAsync` taking:

- a resource (App ID URI) as a first parameter
- a `IClientAssertionCertificate` or `ClientAssertion` as the second parameter.
- a parameter of type `UserAssertion`.
- Optionally it sets `sendX5c` to enable certificate rotation.

#### Update the code using OBO

<table>
<tr>
<td>ADAL</td>
<td>MSAL</td>
</tr>

<tr>
<td valign="top">

```c#
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
                                      sendX5c: true);

  return authResult;
 }
}
```

</td>
<td valign="top" style="font-size:x-small;">

```c#
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
           .WithAzureRegion()
           .Build();
  }

  var userAssertion = new UserAssertion(tokenUsedToCallTheWebApi);

  var authResult = await app.AcquireTokenOnBehalfOf(
              new string[] { $"{resourceId}/.default" },
              userAssertion)
              .WithSendX5C(true)
              .ExecuteAsync()
              .ConfigureAwait(false);
  return authResult;
 }
}
```

</td>
</tr>
</table>

#### Remarks about the code of OBO scenarios

##### Resilience

Resilience is ensured in the following way:

- `.WithAzureRegion()` will attempt an automatic region detection. For details, see [Use MSAL to target regional ESTS](https://aka.ms/msal/estsr/guidance).
- You will automatically benefit from CCS.
- Tokens are proactively renewed by MSAL.NET if you enable long lived tokens.

##### Security

`.WithSendX5C` helps you rotate the certificate credentials by leveraging [Subject Name and Issuer Authentication](https://aka.ms/msal-net-sni)

##### Performance and scalability

- The Instance of `IConfidentialClientApplication` needs to be kept in member variable in order to benefit from the in-memory cache. If you re-create the confidential client application each time you request a token you won't benefit from the token cache.
- If you don't need to share your cache with ADAL.NET, disable the legacy cache compatibility when creating the confidential client application (`.WithLegacyCacheCompatibility(false)`). You'll increase the performance significantly.
  
  ```c#
  app = ConfidentialClientApplicationBuilder.Create(ClientId)
           .WithCertificate(certificate)
           .WithAuthority(authority)
           .WithAzureRegion()
           .WithLegacyCacheCompatibility(false)
           .Build();
  ```

- If your web API uses OBO, you need to leverage a distributed token cache. For details see [Token cache for a web app or web API (confidential client application)](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki/token-cache-serialization#token-cache-for-a-web-app-or-web-api-confidential-client-application) and this sample [active-directory-dotnet-v1-to-v2/ConfidentialClientTokenCache](https://github.com/Azure-Samples/active-directory-dotnet-v1-to-v2/tree/master/ConfidentialClientTokenCache)

  ```CSharp
  IMsalTokenCacheProvider msalTokenCacheProvider = CreateTokenCache(cacheImplementation)
  msalTokenCacheProvider.Initialize(app.AppTokenCache);
  ```

  For an example of implementation of CreateTokenCache, see [this sample](https://github.com/Azure-Samples/active-directory-dotnet-v1-to-v2/blob/master/ConfidentialClientTokenCache/Program.cs)

#### More about web APIs calling downstream APIs

If you want to learn more about web APIs calling downstream web API and how they are implemented with MSAL.NET or Microsoft.Identity.Web in new applications, see [Scenario: A web API that calls web APIs](scenario-web-api-call-api-overview.md)

# [Auth code flow](#tab/authcode)

### Migrate AcquireTokenByAuthorizationCodeAsync in web apps

If your app uses ASP.NET Core, Microsoft strongly recommends that you update to Microsoft.Identity.Web which processes everything for you. See [Microsoft identity web GA](https://github.com/AzureAD/microsoft-identity-web/wiki/1.0.0) for a quick presentation, and [https://aka.ms/ms-id-web/webapp](https://aka.ms/ms-id-web/webapp) for details about how to use it in a web app.

Web apps that call sign in users and call web APIs on behalf of the user use the OAuth2.0 [authorization code flow](v2-oauth2-auth-code-flow.md). Typically:

1. the web app signs-in a user by executing a first leg of the auth code flow (by going to Azure AD's authorize endpoint). The users signs-in, and performs multiple factor authentication is needed. As an outcome of this operation, the app then gets, from Azure AD, a string which is named the **authorization code**. So far ADAL/MSAL were not involved.
2. The app will, then, execute the second leg of the authorization code flow, to redeem the authorization code to get an access token (and an ID Token, and refresh token). You application needs to provide the redirectUri which is the URI at which Azure AD will provide the security tokens. Once received, the web app will typically call ADAL/MSAL `AcquireTokenByAuthorizationCode` to redeem the code, and get a token that will be stored in the token cache.
3. Then, from the web app controllers, the app will use ADAL/MSAL to call AcquireTokenSilent in order to acquire tokens to call the web APIs it needs to call.

#### Find if your code uses the auth code flow

The ADAL code for your app uses auth code flow if it contains a call to `AuthenticationContext.AcquireTokenByAuthorizationCodeAsync`.

#### Update the code using auth code flow

<table>
<tr>
<td>ADAL</td>
<td>MSAL</td>
</tr>

<tr>
<td valign="top">

```c#
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
                                      sendX5c: true); ;
  return authResult;
 }
}
```

</td>
<td valign="top">

```c#
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
           .WithAzureRegion()
           .Build();
  }

  var authResult = await app.AcquireTokenByAuthorizationCode(
              new [] { $"{resourceId}/.default" },
              authorizationCode)
              .WithSendX5C(true)
              .ExecuteAsync()
              .ConfigureAwait(false);
  return authResult;
 }
}
```

</td>
</tr>
</table>

#### Remarks about the code

##### Resilience

Resilience is ensured in the following way:

- `.WithAzureRegion()` will attempt an automatic region detection. For details, see [Use MSAL to target regional ESTS](https://aka.ms/msal/estsr/guidance).
- You will automatically benefit from CCS.
- Tokens are proactively renewed by MSAL.NET if you enable long lived tokens.

##### Security

`.WithSendX5C` helps you rotate the certificate credentials by leveraging [Subject Name and Issuer Authentication](https://aka.ms/msal-net-sni)

##### Performance and scalability

- The Instance of `IConfidentialClientApplication` needs to be kept in member variable in order to benefit from the in-memory cache. If you re-create the confidential client application each time you request a token you won't benefit from the token cache.
- If you don't need to share your cache with ADAL.NET, disable the legacy cache compatibility when creating the confidential client application (`.WithLegacyCacheCompatibility(false)`). You'll increase the performance significantly.
  
  ```c#
  app = ConfidentialClientApplicationBuilder.Create(ClientId)
           .WithCertificate(certificate)
           .WithAuthority(authority)
           .WithAzureRegion()
           .WithLegacyCacheCompatibility(false)
           .Build();
  ```

- If your web API uses `AcquireTokenByAuthorizationCode`, you need to leverage a distributed token cache. For details see [Token cache for a web app or web API (confidential client application)](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki/token-cache-serialization#token-cache-for-a-web-app-or-web-api-confidential-client-application) and this sample [active-directory-dotnet-v1-to-v2/ConfidentialClientTokenCache](https://github.com/Azure-Samples/active-directory-dotnet-v1-to-v2/tree/master/ConfidentialClientTokenCache)

  ```CSharp
  IMsalTokenCacheProvider msalTokenCacheProvider = CreateTokenCache(cacheImplementation)
  msalTokenCacheProvider.Initialize(app.UserTokenCache);
  ```

  For an example of implementation of CreateTokenCache, see [this sample](https://github.com/Azure-Samples/active-directory-dotnet-v1-to-v2/blob/master/ConfidentialClientTokenCache/Program.cs)

#### More about web apps calling APIs

If you want to learn more about web apps calling web API and how they are implemented with MSAL.NET or Microsoft.Identity.Web in new applications, see [Scenario: A web app that calls web APIs](scenario-web-app-call-api-overview.md)

---

## Next steps

Learn more about the [Differences between ADAL.NET and MSAL.NET apps](msal-net-differences-adal-net.md)
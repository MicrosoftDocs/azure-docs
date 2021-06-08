---
title: Migrating to MSAL.NET
titleSuffix: Microsoft identity platform
description: Learn how to migrate a confidential client application from Azure AD Authentication Library for .NET (ADAL.NET) to Microsoft Authentication Library for .NET (MSAL.NET).
services: active-directory
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 04/10/2019
ms.author: jmprieur
ms.reviewer: saeeda
ms.custom: "devx-track-csharp, aaddev"
#Customer intent: As an application developer, I want to migrate my app from ADAL.NET to  MSAL.NET.
---

# How to migrate confidential client applications from ADAL.NET to MSAL.NET

Confidential client applications are web apps, web APIs, and daemon applications (calling another service on their own behalf).

If you are on ASP.NET Core, a great wrapper already exists (Microsoft.Identity.Web)


## Finding the code using ADAL.NET

The code using ADAL in confidential client application instantiates an `AuthenticationContext` and calls `AcquireTokenAsync` with the following parameters:
- a `resourceId` string. This is the **App ID URI** of the web API that you want to call
- a `IClientAssertionCertificate` or a `ClientAssertion` instance. This is providing the client credentials for your app (proving the identity of your app).

## How to migrate to MSAL.NET - common steps

- Add MSAL.NET NuGet package: [Microsoft.Identity.Client](https://www.nuget.org/packages/Microsoft.Identity.Client).
- Add MSAL.NET namespace in your source code: `using Microsoft.Identity.Client;`
- Instead of instantiating an `AuthenticationContext`, use `ConfidentialClientApplicationBuilder.Create` to instantiate a `IConfidentialClientApplication`.
- Instead of the `resourceId` string, MSAL.NET uses scopes. As first party applications are pre-authorize you can always use the following scopes: `new string[] { $"{resourceId}/.default" }`
- Replace the call to `AuthenticationContext.AcquireTokenAsync` by a call to `IConfidentialClientApplication.AcquireTokenXXX` where XXX depends on your scenario.

The confidential client scenarios are the following:
- [Daemon scenarios](#Daemon-scenarios) supported by web apps, web APIs and daemon console applications
- [On behalf of]() supported by web APIs calling downstream web APIs on behalf of the user.
- [Authorization code flow]() supported by Web apps that sign-in users and call a downstream web API

Most of you provided a wrapper around ADAL.NET. Therefore, in this document, we illustrate migrating scenarios using code such a wrapper, but this is only to show equivalent code (we are not suggesting that you copy/paste these wrapper or integrate them in your code)

## How to migrate Daemon scenarios

Daemon scenarios use the OAuth2.0 Client credential flow. They are also called service to service calls. Your app acquires a token on its
own behalf, not on behalf of a user. 

### How to recognize daemon scenarios

The ADAL code for your app contains a call to `AuthenticationContext.AcquireTokenAsync` taking
- a resource (App ID URI) as a first parameter
- a `IClientAssertionCertificate` as the second parameter.
- Optionally it sets `sendX5c` to enable certificate rotation

It does not have a parameter of type `UserAssertion`. If it does, then your app is using another flow: the on behalf of flow.

### How to migrate the code of daemon scenarios

<table>
<tr>
<td>ADAL</td>
<td>MSAL</td>
</tr>

<tr>
<td valign="top" style="font-size:x-small;">

```c#
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;

public partial class AuthWrapper
{
 const string ClientId = "Guid (AppID)";
 const string authority = "";
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
<td valign="top" style="font-size:x-small;">

```c#
using Microsoft.Identity.Client;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;

public partial class AuthWrapper
{
 const string ClientId = "Guid (Application ID)";
 const string authority = "https://login.microsoftonline.com/{tenant}";
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
              new string[] { $"{resourceId}/.default" })
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
- `.WithAzureRegion()` will attempt an automatic region detection. For details, see [Regional endpoint]().
- You will automatically benefit from CCS.
- Tokens are automatically renewed by MSAL.NET

**Security** is ensured by:
- `.WithSendX5C` helps your rotate the certificate credentials by leveraging Subject/Name issuer

**Performance**
- The Instance of `IConfidentialClientApplication` needs to be kept in member variable in order to benefit from the in-memory cache. If you re-create the confidential client application each time you request a token you won't benefit from the cache.
- If you don't need to share your cache with ADAL.NET, disable the legacy cache compatibility when creating the confidential client application. You'll increase the performance
  
  ```CSharp
  app = ConfidentialClientApplicationBuilder.Create(ClientId)
           .WithCertificate(certificate)
           .WithAuthority(authority)
           .WithAzureRegion()
           .WithLegacyCacheCompatibility(false)
           .Build();
  ```

- If you don't want to use the default in-memory cache, or want to implement a distributed token cache, you'll need to serialize the AppTokenCache. For details see [Token cache for a web app or web API (confidential client application)](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki/token-cache-serialization#token-cache-for-a-web-app-or-web-api-confidential-client-application) and this sample [active-directory-dotnet-v1-to-v2/ConfidentialClientTokenCache](https://github.com/Azure-Samples/active-directory-dotnet-v1-to-v2/tree/master/ConfidentialClientTokenCache)

## How to migrate on-behalf-of in web APIs


## How to migrate auth code flow in web apps

## Next steps

Learn more about the [Differences between ADAL.NET and MSAL.NET apps](msal-net-differences-adal-net.md)
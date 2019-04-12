---
title: Differences between MSAL.NET and ADAL.NET | Azure
description: Learn about the differences between the MSAL.NET and ADAL.NET libraries.
services: active-directory
documentationcenter: dev-center-name
author: rwike77
manager: celested
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/10/2019
ms.author: ryanwi
ms.reviewer: saeeda
ms.custom: aaddev

---

# Differences between MSAL.NET and ADAL.NET
## Choosing between ADAL.NET (Azure AD v1.0) and MSAL.NET (Azure AD v2.0)

See [choosing between ADAL.NET (Azure AD v1.0) and MSAL.NET (Azure AD v2.0)](Register-your-application-with-Azure-Active-Directory#choosing-between-adalnet-azure-ad-v1-and-msalnet-azure-ad-v2) to understand why you might want to use MSAL.NET instead of ADAL.NET, and the current constraints.

If you are already familiar with the v1.0 endpoint (and ADAL.NET), you might want to read [What's different about the v2.0 endpoint?](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-v2-compare)

## Differences between ADAL.NET (Azure AD v1.0) and MSAL.NET (Azure AD v2.0) apps

### Overview of the differences

The picture below summarizes some of the differences between ADAL.NET and MSAL.NET
![sideBySideCodeAdalMsal](https://user-images.githubusercontent.com/13203188/37241832-04d26a46-2460-11e8-8401-d97434317d6f.png)

### Details

#### NuGet packages and Namespaces

ADAL.NET is consumed from the [Microsoft.IdentityModel.Clients.ActiveDirectory](https://www.nuget.org/packages/Microsoft.IdentityModel.Clients.ActiveDirectory) NuGet package. the namespace to use is ``Microsoft.IdentityModel.Clients.ActiveDirectory``.

To use MSAL.NET you will need to add the [Microsoft.Identity.Client](https://www.nuget.org/packages/Microsoft.Identity.Client) NuGet package (for the moment in Preview), and use the ``Microsoft.Identity.Client`` namespace

#### Scopes not resources

Whereas ADAL.NET acquires token for *resources*, MSAL.NET acquires them for **scopes**. A number of MSAL.NET AcquireToken overrides require a parameter called scopes(``IEnumerable<string> scopes``). This parameter is a simple list of strings that declare the desired permissions and resources that are requested. Well known scopes are the [Microsoft Graph's scopes](https://developer.microsoft.com/en-us/graph/docs/concepts/permissions_reference).

It's also possible in MSAL.NET to access v1.0 resources. See details in [Scopes for a v1.0 application](#scopes-for-a-v1-application) below

#### Core classes

- ADAL.NET uses [AuthenticationContext](https://github.com/AzureAD/azure-activedirectory-library-for-dotnet/wiki/AuthenticationContext:-the-connection-to-Azure-AD) as the representation of your connection to the Security Token Service (STS) or authorization server, through an Authority. On the contrary, MSAL.NET is designed around [client applications](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki/Client-Applications). It provides two separate classes ``PublicClientApplication`` and ``ConfidentialClientApplication``

- Acquiring Tokens: ADAL.NET and MSAL.NET have the same authentication calls (``AcquireTokenAsync`` and  ``AcquireTokenSilentAsync``) but with different parameters required. One difference is the fact that, in MSAL.NET, you no longer have to pass in the ``ClientID`` of your application in every AcquireTokenXX call. Indeed, the ``ClientID`` is set only  once when calling the constructor of the (``PublicClientApplication`` or ``ConfidentialClientApplication``.

#### IAccount not IUser

ADAL.NET manipulated users. However, a user is a human or a software agent, but it can possess/own/be responsible for one or more accounts in the Microsoft identity system (several Azure AD accounts, Azure AD B2C, Microsoft personal accounts). 

MSAL.NET 2.x now defines the notion of Account (through the IAccount interface). This breaking change provides the right semantics: the fact that the same user can have several accounts, in different Azure AD directories. Also MSAL.NET provides better information in guest scenarios, as home account information is provided.

For more information about the differences between IUser and IAccount see https://aka.ms/msal-net-2-released

#### Exceptions

##### Interaction required exceptions

MSAL.NET has more explicit [exceptions](exceptions). For example: when silent authentication fails in ADAL, the current procedure is to catch the exception and look for the “user_interaction_required” error code:

ADAL.NET:

```csharp
catch(AdalException exception)
{
 if (exception.ErrorCode == ““user_interaction_required”)
 {
  try
  {“try to authenticate interactively”}}
 }
}
```

See details in [The recommended pattern to acquire a token](https://github.com/AzureAD/azure-activedirectory-library-for-dotnet/wiki/AcquireTokenSilentAsync-using-a-cached-token#recommended-pattern-to-acquire-a-token) with ADAL.NET

In MSAL.NET, you can catch ``MsalUiRequiredException`` as described in [AcquireTokenSilentAsync](AcquireTokenSilentAsync)

```csharp
catch(MsalUiRequiredException exception)
{
 Try {“try to authenticate interactively”}
}
```

##### Handling Claim challenge exceptions

###### How ADAL.NET does it?

- ``AdalClaimChallengeException`` is an exception (deriving from ``AdalServiceException``) thrown by the service in case a resource requires more claims from the user (for instance two-factors authentication). The ``Claims`` member contains some json fragment with the claims, which are expected.
- Still in ADAL.NET, the public client application receiving this exception needs to call the ``AcquireTokenAsync`` override having a claims parameter. This override of ``AcquireTokenAsync`` does not even try to hit the cache, it’s necessarily interactive. The reason is that the token in the cache does not have the right claims (otherwise an ``AdalClaimChallengeException`` would not have been thrown). Therefore, there is no need looking at the cache. The ``ClaimChallengeException`` can be received in a WebAPI doing OBO, whereas the ``AcquireTokenAsync`` needs to be called in a public client application calling this Web API.
- for details, including samples see Handling [AdalClaimChallengeException](https://github.com/AzureAD/azure-activedirectory-library-for-dotnet/wiki/Exceptions-in-ADAL.NET#handling-adalclaimchallengeexception)

###### How to handle claim challenge exceptions in MSAL.NET?

- The ``Claims`` are surfaced in the ``MsalServiceException``.
- Almost all the ``AcquireTokenAsync`` overrides in MSAL.NET all have ``extraQueryParameters`` parameter. The way to go today is to add ``$"&claims={msalServiceException.Claims}”`` to the current ``extraQueryParameters``.

#### Supported grants

Not all the grants are yet supported in MSAL.NET / the AAD v2.0 endpoint. Here is a summary comparing ADAL.NET and MSAL.NET's supported grants

##### Public client applications

Here are the grants supported in ADAL.NET and MSAL.NET for Desktop and Mobile applications

Grant | ADAL.NET | MSAL.NET
----- |----- | -----
Interactive | [Interactive Auth](https://github.com/AzureAD/azure-activedirectory-library-for-dotnet/wiki/Acquiring-tokens-interactively---Public-client-application-flows) | [Acquiring tokens interactively in MSAL.NET](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki/Acquiring-tokens-interactively)
Integrated Windows Authentication | [AcquireTokenSilentAsync using Integrated authentication on Windows (Kerberos)](https://github.com/AzureAD/azure-activedirectory-library-for-dotnet/wiki/AcquireTokenSilentAsync-using-Integrated-authentication-on-Windows-(Kerberos)) | [Integrated Windows Authentication](https://aka.ms/msal-net-iwa)
Username / Password | [Acquiring tokens with username and password](https://github.com/AzureAD/azure-activedirectory-library-for-dotnet/wiki/Acquiring-tokens-with-username-and-password)| [Username Password Authentication](https://aka.ms/msal-net-up)
Device code flow | [Device profile for devices without web browsers](https://github.com/AzureAD/azure-activedirectory-library-for-dotnet/wiki/Device-profile-for-devices-without-web-browsers) | [Device Code flow](Device-Code-Flow)

##### Confidential client applications

Here are the grants supported in ADAL.NET and MSAL.NET for Web Applications, Web APIs, and daemon applications:

Type of App | Grant | ADAL.NET | MSAL.NET
----- | ----- | ----- | -----
Web App, Web API, daemon | Client Credentials | [Client credential flows in ADAL.NET](https://github.com/AzureAD/azure-activedirectory-library-for-dotnet/wiki/Client-credential-flows) | [Client credential flows in MSAL.NET](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki/Client-credential-flows)
Web API | On behalf of | [Service to service calls on behalf of the user with ADAL.NET](https://github.com/AzureAD/azure-activedirectory-library-for-dotnet/wiki/Service-to-service-calls-on-behalf-of-the-user) | [On behalf of in MSAL.NET](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki/on-behalf-of)
Web App | Auth Code | [Acquiring tokens with authorization codes on web apps with ADAL.NET](https://github.com/AzureAD/azure-activedirectory-library-for-dotnet/wiki/Acquiring-tokens-with-authorization-codes-on-web-apps) | [Acquiring tokens with authorization codes on web apps with A MSAL.NET](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki/Acquiring-tokens-with-authorization-codes-on-web-apps)

#### Cache persistence

ADAL.NET allows you to extend the ``TokenCache`` class to implement the desired persistence functionality on platforms without a secure storage (.NET Framework and .NET core) by using the ``BeforeAccess``,  , and ``BeforeWrite`` methods. For details, see [Token Cache Serialization in ADAL.NET](https://github.com/AzureAD/azure-activedirectory-library-for-dotnet/wiki/Token-cache-serialization).

MSAL.NET makes the token cache a sealed class, removing the ability to extend it. Therefore, your implementation of token cache persistence must be in the form of a helper class that interacts with the sealed token cache. This interaction is described in [Token Cache Serialization in MSAL.NET](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki/token-cache-serialization)

### Signification of the common authority

In v1.0, if you use the https://login.microsoftonline.com/common authority, you will allow users to sign in with any AAD account (for any organization). See [Authority Validation in ADAL.NET](https://github.com/AzureAD/azure-activedirectory-library-for-dotnet/wiki/AuthenticationContext:-the-connection-to-Azure-AD#authority-validation)

If you use the https://login.microsoftonline.com/common authority in v2.0, you will allow users to sign in with any AAD organization or a Microsoft personal account (MSA). In MSAL.NET, if you want to restrict login to any AAD account (same behavior as with ADAL.NET), you need to use https://login.microsoftonline.com/organizations. For details, see the ``authority`` parameter in [public client application](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/wiki/Client-Applications#publicclientapplication).

### v1.0 and v2.0 Tokens

There are two versions of tokens:
- v1.0 tokens
- v2.0 tokens 

the v1.0 endpoint (used by ADAL) only emits v1.0 tokens.
However the v2.0 endpoints (used by MSAL) emits the version of the token that the Web API accepts. A property of the application manifest of the Web API enables developers to choose which version of token is accepted. See `accessTokenAcceptedVersion` in the [Application manifest](https://docs.microsoft.com/en-us/azure/active-directory/develop/reference-app-manifest) reference documentation.

For more information about v1.0 and v2.0 tokens see [Azure Active Directory access tokens](https://docs.microsoft.com/en-us/azure/active-directory/develop/access-tokens)

### Scopes for a Web API accepting v1.0 tokens

OAuth2 permissions are  permission scopes that a v1.0 web API (resource) application exposes to client applications. These permission scopes may be granted to client applications during consent. See the section about oauth2Permissions in the [Azure Active Directory application manifest](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-application-manifest) article

#### Scopes to request access to specific OAuth2 permissions of a v1.0 application

if you want to acquire tokens for specific scopes of a v1.0 application (for instance the AAD graph, which is https://graph.windows.net), you'd need to create ``scopes`` by concatenating a desired resource identifier with a desired OAuth2 permission for that resource.

For instance, to access, in the name of the user, a v1.0 Web API which App ID URI is `ResourceId`, you'd want to use:

```csharp
var scopes = new [] {  ResourceId+"/user_impersonation"};
```

If you want to read and write with MSAL.NET Azure Active Directory using the AAD graph API (https://graph.windows.net/), you would create a list of scopes like in the following snippet:

```csharp
ResourceId = "https://graph.windows.net/";
var scopes = new [] { ResourceId + “Directory.Read”, ResourceID + “Directory.Write”}
```

##### Warning: Should you have one or two slashes in the scope corresponding to a v1.0 Web API

If you want to write the scope corresponding to the Azure Resource Manager API (https://management.core.windows.net/) , you'll notice that you'll need to request the following scope (note the two slashes) 

```csharp
var scopes = new[] {"https://management.core.windows.net//user_impersonation"};
var result = await app.AcquireTokenAsync(scopes);

// then call the API: https://management.azure.com/subscriptions?api-version=2016-09-01
```

This is because the ARM API expects a slash in its audience claim (`aud`), and then there is a slash to separate the API name from the scope.

The logic used by Azure AD is the following:
- For ADAL (v1.0) endpoint with a v1.0 access token (the only possible), aud=resource
- For MSAL (v2.0 endpoint) asking an access token for a resource accepting v2.0 tokens, aud=resource.AppId
- For MSAL (v2.0 endpoint) asking an access token for a resource accepting a v1.0 access token (which is the case above), Azure AD parses the desired audience from the requested scope by taking everything before the last slash and using it as the resource identifier. Therefore if https://database.windows.net expects an audience of "https://database.windows.net/", you'll need to request a scope of https://database.windows.net//.default. See also issue #[747](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/issues/747): Resource url's trailing slash is omitted, which caused sql auth failure #747


#### Scopes to request access to all the permissions of a v1.0 application

For instance, if you want to acquire a token for all the static scopes of a v1.0 application, one would need to use

```csharp
ResourceId = "someAppIDURI";
var scopes = new [] {  ResourceId+"/.default"};
```

#### Scopes to request in the case of client credential flow / daemon app

In the case of client credential flow, the scope to pass would also be `/.default`. This tells to Azure AD: "all the app-level permissions that the admin has consented to in the application registration.

### ADAL.NET v2.x migration to MSAL.NET v2.x.

In ADAL.NET v2.X, the refresh tokens were exposed allowing you to develop solutions around the use of these tokens by caching them and using the AcquireTokenByRefreshToken methods provided by ADAL 2.x. 
Some of those solutions were used in scenarios such as:
* Long running services that do actions including refreshing dashboards on behalf of the users whereas the users are no longer connected. 
* WebFarm scenarios for enabling the client to bring the RT to the web service (caching is done client side, encrypted cookie, and not server side)

This is not the case with MSAL 2.x however as we no longer recommend utilizing refresh tokens in this manner for security reasons. This would make it difficult to migrate to MSAL 2.x as the API does not provide a way to pass in previously acquired refresh tokens. 

Fortunately, MSAL now has an API that allows you to migrate your previous refresh tokens into the ConfidentialClientApplication. 

```csharp
/// <summary>
/// Acquires an access token from an existing refresh token and stores it and the refresh token into 
/// the application user token cache, where it will be available for further AcquireTokenSilentAsync calls.
/// This method can be used in migration to MSAL from ADAL v2 and in various integration 
/// scenarios where you have a RefreshToken available. 
/// (see https://aka.ms/msal-net-migration-adal2-msal2)
/// </summary>
/// <param name="scopes">Scope to request from the token endpoint. 
/// Setting this to null or empty will request an access token, refresh token and ID token with default scopes</param>
/// <param name="refreshToken">The refresh token from ADAL 2.x</param>
async Task<AuthenticationResult> IByRefreshToken.AcquireTokenByRefreshTokenAsync(IEnumerable<string> scopes, string refreshToken);
```
 
With this method, you can provide the previously used refresh token along with any scopes (resources) you desire. The refresh token will be exchanged for a new one and cached into your application.  

As this method is intended for scenarios that are not typical, it is not readily accessible with the ConfidentialClientApplication without first casting it to IByRefreshToken.

This code snippet shows some migration code in a confidential client application. `GetCachedRefreshTokenForSignedInUser` retrieve the refresh token that was stored in some storage by a previous version of the application that used to leverage ADAL 2.x. `GetTokenCacheForSignedInUser` deserializes a cache for the signed-in user (as confidential client applications should have one cache per user)

```csharp
TokenCache userCache = GetTokenCacheForSignedInUser();
string rt = GetCachedRefreshTokenForSignedInUser();
ClientCredential cc = new ClientCredential(ClientSecret);
ConfidentialClientApplication app = new ConfidentialClientApplication(serviceBundle, ClientId, Authority, RedirectUri, cc, userCache, null);
         
AuthenticationResult result = await (app as IByRefreshToken).AcquireTokenByRefreshTokenAsync(null, rt).ConfigureAwait(false);
```
You will see an access token and ID token returned in your AuthenticationResult while your new refresh token is stored in the cache.

Note: You can also use this method for various integration scenarios where you have a refresh token available.

### More information

you can find more information about the scopes in [Scopes, permissions, and consent in the Azure Active Directory v2.0 endpoint](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#accessing-v10-resources)
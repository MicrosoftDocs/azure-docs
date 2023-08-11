---
title: ADAL to MSAL migration guide (MSAL4j)
description: Learn how to migrate your Azure Active Directory Authentication Library (ADAL) Java app to the Microsoft Authentication Library (MSAL).
services: active-directory
author: Dickson-Mwendia
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.tgt_pltfrm: Java
ms.workload: identity
ms.date: 11/04/2019
ms.author: dmwendia
ms.reviewer: nacanuma, twhitney
ms.custom: aaddev, devx-track-java, has-adal-ref, devx-track-extended-java
#Customer intent: As a Java application developer, I want to learn how to migrate my v1 ADAL app to v2 MSAL.
---

# ADAL to MSAL migration guide for Java

This article highlights changes you need to make to migrate an app that uses the Azure Active Directory Authentication Library (ADAL) to use the Microsoft Authentication Library (MSAL).

Both the Microsoft Authentication Library for Java (MSAL4J) and Azure AD Authentication Library for Java (ADAL4J) are used to authenticate Azure AD entities and request tokens from Azure AD. Until now, most developers have worked with Azure AD for developers platform (v1.0) to authenticate Azure AD identities (work and school accounts) by requesting tokens using Azure AD Authentication Library (ADAL).

MSAL offers the following benefits:

- Because it uses the newer Microsoft identity platform, you can authenticate a broader set of Microsoft identities such as Azure AD identities, Microsoft accounts, and social and local accounts through Azure AD Business to Consumer (B2C).
- Your users will get the best single-sign-on experience.
- Your application can enable incremental consent, and supporting Conditional Access is easier.

MSAL for Java is the auth library we recommend you use with the Microsoft identity platform. No new features will be implemented on ADAL4J. All efforts going forward are focused on improving MSAL.

You can learn more about MSAL and get started with an [overview of the Microsoft Authentication Library](msal-overview.md).

## Scopes not resources

ADAL4J acquires tokens for resources whereas MSAL for Java acquires tokens for scopes. Many MSAL for Java classes require a scopes parameter. This parameter is a list of strings that declare the desired permissions and resources that are requested. See [Microsoft Graph's scopes](/graph/permissions-reference) to see example scopes.

You can add the `/.default` scope suffix to the resource to help migrate your apps from the ADAL to MSAL. For example, for the resource value of `https://graph.microsoft.com`, the equivalent scope value is `https://graph.microsoft.com/.default`.  If the resource isn't in the URL form, but a resource ID of the form `XXXXXXXX-XXXX-XXXX-XXXXXXXXXXXX`, you can still use the scope value as `XXXXXXXX-XXXX-XXXX-XXXXXXXXXXXX/.default`.

For more details about the different types of scopes, refer
[Permissions and consent in the Microsoft identity platform](./v2-permissions-and-consent.md) and the [Scopes for a Web API accepting v1.0 tokens](./msal-v1-app-scopes.md) articles.

## Core classes

In ADAL4J, the `AuthenticationContext` class represents your connection to the Security Token Service (STS), or authorization server, through an Authority. However, MSAL for Java is designed around client applications. It provides two separate classes: `PublicClientApplication` and `ConfidentialClientApplication` to represent client applications.  The latter, `ConfidentialClientApplication`, represents an application that is designed to securely maintain a secret such as an application identifier for a daemon app.

The following table shows how ADAL4J functions map to the new MSAL for Java functions:

| ADAL4J method| MSAL4J method|
|------|-------|
|acquireToken(String resource, ClientCredential credential, AuthenticationCallback callback) | acquireToken(ClientCredentialParameters)|
|acquireToken(String resource, ClientAssertion assertion, AuthenticationCallback callback)|acquireToken(ClientCredentialParameters)|
|acquireToken(String resource, AsymmetricKeyCredential credential, AuthenticationCallback callback)|acquireToken(ClientCredentialParameters)|
|acquireToken(String resource, String clientId, String username, String password, AuthenticationCallback callback)| acquireToken(UsernamePasswordParameters)|
|acquireToken(String resource, String clientId, String username, String password=null, AuthenticationCallback callback)|acquireToken(IntegratedWindowsAuthenticationParameters)|
|acquireToken(String resource, UserAssertion userAssertion, ClientCredential credential, AuthenticationCallback callback)| acquireToken(OnBehalfOfParameters)|
|acquireTokenByAuthorizationCode() | acquireToken(AuthorizationCodeParameters) |
| acquireDeviceCode() and acquireTokenByDeviceCode()| acquireToken(DeviceCodeParameters)|
|acquireTokenByRefreshToken()| acquireTokenSilently(SilentParameters)|

## IAccount instead of IUser

ADAL4J manipulated users. Although a user represents a single human or software agent, it can have one or more accounts in the Microsoft identity system. For example, a user may have several Azure AD, Azure AD B2C, or Microsoft personal accounts.

MSAL for Java defines the concept of Account via the `IAccount` interface. This is a breaking change from ADAL4J, but it's a good one because it captures the fact that the same user can have several accounts, and perhaps even in different Azure AD directories. MSAL for Java provides better information in guest scenarios because home account information is provided.

## Cache persistence

ADAL4J didn't have support for token cache.
MSAL for Java adds a [token cache](msal-acquire-cache-tokens.md) to simplify managing token lifetimes by automatically refreshing expired tokens when possible and preventing unnecessary prompts for the user to provide credentials when possible.

## Common Authority

In v1.0, if you use the `https://login.microsoftonline.com/common` authority, users can sign in with any Azure Active Directory (Azure AD) account (for any organization).

If you use the `https://login.microsoftonline.com/common` authority in v2.0, users can sign in with any Azure AD organization, or even a Microsoft personal account (MSA). In MSAL for Java, if you want to restrict login to any Azure AD account, use the `https://login.microsoftonline.com/organizations` authority (which is the same behavior as with ADAL4J). To specify an authority, set the `authority` parameter in the [PublicClientApplication.Builder](https://javadoc.io/doc/com.microsoft.azure/msal4j/1.0.0/com/microsoft/aad/msal4j/PublicClientApplication.Builder.html) method when you create your `PublicClientApplication` class.

## v1.0 and v2.0 tokens

The v1.0 endpoint (used by ADAL) only emits v1.0 tokens.

The v2.0 endpoint (used by MSAL) can emit v1.0 and v2.0 tokens. A property of the application manifest of the web API enables developers to choose which version of token is accepted. See `accessTokenAcceptedVersion` in the [application manifest](./reference-app-manifest.md) reference documentation.

For more information about v1.0 and v2.0 tokens, see [Azure Active Directory access tokens](./access-tokens.md).

## ADAL to MSAL migration

In ADAL4J, the refresh tokens were exposed--which allowed developers to cache them. They would then use `AcquireTokenByRefreshToken()` to enable solutions such as implementing long-running services that refresh dashboards on behalf of the user when the user is no longer connected.

MSAL for Java doesn't expose refresh tokens for security reasons. Instead, MSAL handles refreshing tokens for you.

MSAL for Java has an API that allows you to migrate refresh tokens you acquired with ADAL4j into the ClientApplication: [acquireToken(RefreshTokenParameters)](https://javadoc.io/static/com.microsoft.azure/msal4j/1.0.0/com/microsoft/aad/msal4j/PublicClientApplication.html#acquireToken-com.microsoft.aad.msal4j.RefreshTokenParameters-). With this method, you can provide the previously used refresh token along with any scopes (resources) you desire. The refresh token will be exchanged for a new one and cached for use by your application.

The following code snippet shows some migration code in a confidential client application:

```java
String rt = GetCachedRefreshTokenForSignedInUser(); // Get refresh token from where you have them stored
Set<String> scopes = Collections.singleton("SCOPE_FOR_REFRESH_TOKEN");

RefreshTokenParameters parameters = RefreshTokenParameters.builder(scopes, rt).build();

PublicClientApplication app = PublicClientApplication.builder(CLIENT_ID) // ClientId for your application
                .authority(AUTHORITY)  //plug in your authority
                .build();

IAuthenticationResult result = app.acquireToken(parameters);
```

The `IAuthenticationResult` returns an access token and ID token, while your new refresh token is stored in the cache.
The application will also now contain an IAccount:

```java
Set<IAccount> accounts =  app.getAccounts().join();
```

To use the tokens that are now in the cache, call:

```java
SilentParameters parameters = SilentParameters.builder(scope, accounts.iterator().next()).build();
IAuthenticationResult result = app.acquireToken(parameters);
```

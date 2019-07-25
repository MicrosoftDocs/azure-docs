---
title: Scopes for a v1.0 application (Microsoft Authentication Library) | Azure
description: Learn about the scopes for a v1.0 application using the Microsoft Authentication Library (MSAL).
services: active-directory
documentationcenter: dev-center-name
author: rwike77
manager: CelesteDG
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/23/2019
ms.author: ryanwi
ms.reviewer: saeeda
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn scopes for a v1.0 application so I can decide if this platform meets my application development needs and requirements.
ms.collection: M365-identity-device-management
---

# Scopes for a Web API accepting v1.0 tokens

OAuth2 permissions are permission scopes that a Azure AD for developers (v1.0) web API (resource) application exposes to client applications. These permission scopes may be granted to client applications during consent. See the section about `oauth2Permissions` in the [Azure Active Directory application manifest reference](reference-app-manifest.md#manifest-reference).

## Scopes to request access to specific OAuth2 permissions of a v1.0 application
If you want to acquire tokens for specific scopes of a v1.0 application (for example the Azure AD graph, which is https:\//graph.windows.net), you need to create scopes by concatenating a desired resource identifier with a desired OAuth2 permission for that resource.

For example, to access on behalf of the user a v1.0 web API where the app ID URI is `ResourceId`:

```csharp
var scopes = new [] {  ResourceId+"/user_impersonation"};
```

```javascript
var scopes = [ ResourceId + "/user_impersonation"];
```

If you want to read and write with MSAL.NET Azure Active Directory using the Azure AD graph API (https:\//graph.windows.net/), you would create a list of scopes as in the following:

```csharp
string ResourceId = "https://graph.windows.net/";
var scopes = new [] { ResourceId + "Directory.Read", ResourceID + "Directory.Write"}
```

```javascript
var ResourceId = "https://graph.windows.net/";
var scopes = [ ResourceId + "Directory.Read", ResourceID + "Directory.Write"];
```

If you want to write the scope corresponding to the Azure Resource Manager API (https:\//management.core.windows.net/), you need to request the following scope (note the two slashes):

```csharp
var scopes = new[] {"https://management.core.windows.net//user_impersonation"};
var result = await app.AcquireTokenInteractive(scopes).ExecuteAsync();

// then call the API: https://management.azure.com/subscriptions?api-version=2016-09-01
```

> [!NOTE]
> You need to use two slashes because the Azure Resource Manager API expects a slash in its audience claim (aud), and then there is a slash to separate the API name from the scope.

The logic used by Azure AD is the following:

- For ADAL (v1.0) endpoint with a v1.0 access token (the only possible), aud=resource
- For MSAL (Microsoft identity platform (v2.0) endpoint) asking an access token for a resource accepting v2.0 tokens, aud=resource.AppId
- For MSAL (v2.0 endpoint) asking an access token for a resource accepting a v1.0 access token (which is the case above), Azure AD parses the desired audience from the requested scope by taking everything before the last slash and using it as the resource identifier. Therefore if https:\//database.windows.net expects an audience of "https:\//database.windows.net/", you'll need to request a scope of "https:\//database.windows.net//.default". See also GitHub issue [#747: Resource url's trailing slash is omitted, which caused sql auth failure](https://github.com/AzureAD/microsoft-authentication-library-for-dotnet/issues/747).

## Scopes to request access to all the permissions of a v1.0 application
If you want to acquire a token for all the static scopes of a v1.0 application, append ".default" to the app ID URI of the API:

```csharp
ResourceId = "someAppIDURI";
var scopes = new [] {  ResourceId+"/.default"};
```

```javascript
var ResourceId = "someAppIDURI";
var scopes = [ ResourceId + "/.default"];
```

## Scopes to request for client credential flow / daemon app
In the case of client credential flow, the scope to pass would also be `/.default`. This tells to Azure AD: "all the app-level permissions that the admin has consented to in the application registration.

---
title: Work with User Identities in AuthN/AuthZ
description: Learn how to access user identities when you use the built-in authentication and authorization in Azure App Service.
ms.topic: how-to
ms.date: 07/02/2025
ms.custom: AppServiceIdentity
author: cephalin
ms.author: cephalin
---

# Work with user identities in Azure App Service authentication

This article shows you how to work with user identities when you use [built-in authentication and authorization](overview-authentication-authorization.md) in Azure App Service.

## Prerequisites

A web application running on Azure App Service that has the [App Service authentication/authorization module enabled](scenario-secure-app-authentication-app-service.md).

## Access user claims in app code

Your app's authenticated end users or client applications make claims in incoming tokens. App Service makes the claims available to your code by injecting them into request headers. External requests aren't allowed to set these headers, so they're present only if App Service sets them.

You can use the claims information that App Service authentication provides to perform authorization checks in your app code. Code in any language or framework can get needed information from the request headers. Some code frameworks provide extra options that might be more convenient. See [Framework-specific alternatives](#framework-specific-alternatives).

The following table describes some example headers:

| Header                       | Description                                                           |
|------------------------------|-----------------------------------------------------------------------|
| `X-MS-CLIENT-PRINCIPAL`      | A Base64-encoded JSON representation of available claims. For more information, see [Decode the client principal header](#decode-the-client-principal-header).   |
| `X-MS-CLIENT-PRINCIPAL-ID`   | An identifier that the identity provider sets for the caller.            |
| `X-MS-CLIENT-PRINCIPAL-NAME` | A human-readable name that the identity provider sets for the caller, such as an email address or user principal name.   |
| `X-MS-CLIENT-PRINCIPAL-IDP`  | The name of the identity provider that App Service authentication uses. |

Similar headers expose [provider tokens](configure-authentication-oauth-tokens.md). For example, Microsoft Entra sets `X-MS-TOKEN-AAD-ACCESS-TOKEN` and `X-MS-TOKEN-AAD-ID-TOKEN` provider token headers as appropriate.

> [!NOTE]
> App Service makes the request headers available to all language frameworks. Different language frameworks might present these headers to the app code in different formats, such as lowercase or title case.

### Decode the client principal header

The `X-MS-CLIENT-PRINCIPAL` header contains the full set of available claims in Base64-encoded JSON. To process this header, your app must decode the payload and iterate through the `claims` array to find relevant claims.

> [!NOTE]
> These claims undergo a default claims-mapping process, so some names might be different than they appear in the tokens.

The decoded payload structure is as follows:

```json
{
    "auth_typ": "",
    "claims": [
        {
            "typ": "",
            "val": ""
        }
    ],
    "name_typ": "",
    "role_typ": ""
}
```

The following table describes the properties.

| Property   | Type             | Description                           |
|------------|------------------|---------------------------------------|
| `auth_typ` | string           | The name of the identity provider that App Service authentication uses. |
| `claims`   | array            | An array of objects that represent the available claims. Each object contains `typ` and `val` properties. |
| `typ`      | string           | The name of the claim, which might be subject to default claims mapping and be different from the corresponding claim in the token. |
| `val`      | string           | The value of the claim.                                      |
| `name_typ` | string           | The name claim type, which is typically a URI that provides scheme information about the `name` claim if one is defined. |
| `role_typ` | string           | The role claim type, which is typically a URI that provides scheme information about the `role` claim if one is defined. |

For convenience, you can convert claims into a representation that the app's language framework uses. The following C# example constructs a [`ClaimsPrincipal`](/dotnet/api/system.security.claims.claimsprincipal) type for the app to use.

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Http;

public static class ClaimsPrincipalParser
{
    private class ClientPrincipalClaim
    {
        [JsonPropertyName("typ")]
        public string Type { get; set; }
        [JsonPropertyName("val")]
        public string Value { get; set; }
    }

    private class ClientPrincipal
    {
        [JsonPropertyName("auth_typ")]
        public string IdentityProvider { get; set; }
        [JsonPropertyName("name_typ")]
        public string NameClaimType { get; set; }
        [JsonPropertyName("role_typ")]
        public string RoleClaimType { get; set; }
        [JsonPropertyName("claims")]
        public IEnumerable<ClientPrincipalClaim> Claims { get; set; }
    }

    public static ClaimsPrincipal Parse(HttpRequest req)
    {
        var principal = new ClientPrincipal();

        if (req.Headers.TryGetValue("x-ms-client-principal", out var header))
        {
            var data = header[0];
            var decoded = Convert.FromBase64String(data);
            var json = Encoding.UTF8.GetString(decoded);
            principal = JsonSerializer.Deserialize<ClientPrincipal>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
        }
```
At this point, the code can iterate through `principal.Claims` to check claims as part of validation. Alternatively, you can convert `principal.Claims` into a standard object and use it to do those checks later in the request pipeline. You can also use that object to associate user data and for other uses.

The rest of the function performs this conversion to create a `ClaimsPrincipal` that can be used in other .NET code.

```csharp
        var identity = new ClaimsIdentity(principal.IdentityProvider, principal.NameClaimType, principal.RoleClaimType);
        identity.AddClaims(principal.Claims.Select(c => new Claim(c.Type, c.Value)));
        
        return new ClaimsPrincipal(identity);
    }
}
```

### Framework-specific alternatives

- For ASP.NET 4.6 apps, App Service populates [`ClaimsPrincipal.Current`](/dotnet/api/system.security.claims.claimsprincipal.current) with the authenticated user's claims. You can follow the standard .NET code pattern, including the `[Authorize]` attribute.

  `ClaimsPrincipal.Current` isn't populated for .NET code in [Azure Functions](../azure-functions/functions-overview.md), but you can still find the user claims in the request headers, or get the `ClaimsPrincipal` object from the request context or through a binding parameter. For more information, see [Work with client identities in Azure Functions](../azure-functions/functions-bindings-http-webhook-trigger.md#working-with-client-identities).
  
- For PHP apps, App Service similarly populates the `_SERVER['REMOTE_USER']` variable.

- For Java apps, the claims are accessible from the [Tomcat servlet](configure-language-java-security.md?pivots=java-tomcat#authenticate-users-easy-auth).

- For .NET Core, [`Microsoft.Identity.Web`](https://www.nuget.org/packages/Microsoft.Identity.Web/) supports populating the current user with App Service authentication. For more information, see [Integration with Azure App Services authentication of web apps running with Microsoft.Identity.Web](https://github.com/AzureAD/microsoft-identity-web/wiki/1.2.0#integration-with-azure-app-services-authentication-of-web-apps-running-with-microsoftidentityweb). For a demonstration of a web app accessing Microsoft Graph, see [Tutorial: Access Microsoft Graph from a secured .NET app as the user](scenario-secure-app-access-microsoft-graph-as-user.md).

> [!NOTE]
> For claims mapping to work, you must enable the [token store](overview-authentication-authorization.md#token-store) for your app.

## Access user claims by using the API

If the [token store](overview-authentication-authorization.md#token-store) is enabled for your app, you can also call `/.auth/me` to obtain other details on the authenticated user.

## Related content

- [Authentication and authorization in Azure App Service and Azure Functions](overview-authentication-authorization.md)
- [Tutorial: Authenticate and authorize users end to end](tutorial-auth-aad.md)

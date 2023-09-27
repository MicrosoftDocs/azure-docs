---
title: User identities in AuthN/AuthZ
description: Learn how to access user identities when using the built-in authentication and authorization in App Service.
ms.topic: article
ms.date: 03/29/2021
ms.custom: AppServiceIdentity
author: cephalin
ms.author: cephalin
---

# Work with user identities in Azure App Service authentication

This article shows you how to work with user identities when using the built-in [authentication and authorization in App Service](overview-authentication-authorization.md). 

## Access user claims in app code

For all language frameworks, App Service makes the claims in the incoming token (whether from an authenticated end user or a client application) available to your code by injecting them into the request headers. External requests aren't allowed to set these headers, so they're present only if set by App Service. Some example headers include:

| Header                       | Description                                                           |
|------------------------------|-----------------------------------------------------------------------|
| `X-MS-CLIENT-PRINCIPAL`      | A Base64 encoded JSON representation of available claims. For more information, see [Decoding the client principal header](#decoding-the-client-principal-header).   |
| `X-MS-CLIENT-PRINCIPAL-ID`   | An identifier for the caller set by the identity provider.            |
| `X-MS-CLIENT-PRINCIPAL-NAME` | A human-readable name for the caller set by the identity provider, e.g. Email Address, User Principal Name.   |
| `X-MS-CLIENT-PRINCIPAL-IDP`  | The name of the identity provider used by App Service Authentication. |

Provider tokens are also exposed through similar headers. For example, the Microsoft Identity Provider also sets `X-MS-TOKEN-AAD-ACCESS-TOKEN` and `X-MS-TOKEN-AAD-ID-TOKEN` as appropriate.

> [!NOTE]
> Different language frameworks may present these headers to the app code in different formats, such as lowercase or title case.

Code that is written in any language or framework can get the information that it needs from these headers. [Decoding the client principal header](#decoding-the-client-principal-header) covers this process. For some frameworks, the platform also provides extra options that may be more convenient.

### Decoding the client principal header

`X-MS-CLIENT-PRINCIPAL` contains the full set of available claims as Base64 encoded JSON. These claims go through a default claims-mapping process, so some may have different names than you would see if processing the token directly. The decoded payload is structured as follows:

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

| Property   | Type             | Description                           |
|------------|------------------|---------------------------------------|
| `auth_typ` | string           | The name of the identity provider used by App Service Authentication. |
| `claims`   | array of objects | An array of objects representing the available claims. Each object contains `typ` and `val` properties. |
| `typ`      | string           | The name of the claim. This may have been subject to default claims mapping and could be different from the corresponding claim contained in a token. |
| `val`      | string           | The value of the claim.                                      |
| `name_typ` | string           | The name claim type, which is typically a URI providing scheme information about the `name` claim if one is defined. |
| `role_typ` | string           | The role claim type, which is typically a URI providing scheme information about the `role` claim if one is defined. |

To process this header, your app will need to decode the payload and iterate through the `claims` array to find the claims of interest. It may be convenient to convert these into a representation used by the app's language framework. Here's an example of this process in C# that constructs a [ClaimsPrincipal](/dotnet/api/system.security.claims.claimsprincipal) type for the app to use:

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

        /** 
         *  At this point, the code can iterate through `principal.Claims` to
         *  check claims as part of validation. Alternatively, we can convert
         *  it into a standard object with which to perform those checks later
         *  in the request pipeline. That object can also be leveraged for 
         *  associating user data, etc. The rest of this function performs such
         *  a conversion to create a `ClaimsPrincipal` as might be used in 
         *  other .NET code.
         */

        var identity = new ClaimsIdentity(principal.IdentityProvider, principal.NameClaimType, principal.RoleClaimType);
        identity.AddClaims(principal.Claims.Select(c => new Claim(c.Type, c.Value)));
        
        return new ClaimsPrincipal(identity);
    }
}
```

### Framework-specific alternatives

For ASP.NET 4.6 apps, App Service populates [ClaimsPrincipal.Current](/dotnet/api/system.security.claims.claimsprincipal.current) with the authenticated user's claims, so you can follow the standard .NET code pattern, including the `[Authorize]` attribute. Similarly, for PHP apps, App Service populates the `_SERVER['REMOTE_USER']` variable. For Java apps, the claims are [accessible from the Tomcat servlet](configure-language-java.md#authenticate-users-easy-auth).

For [Azure Functions](../azure-functions/functions-overview.md), `ClaimsPrincipal.Current` isn't populated for .NET code, but you can still find the user claims in the request headers, or get the `ClaimsPrincipal` object from the request context or even through a binding parameter. For more information, see [Working with client identities in Azure Functions](../azure-functions/functions-bindings-http-webhook-trigger.md#working-with-client-identities).

For .NET Core, [Microsoft.Identity.Web](https://www.nuget.org/packages/Microsoft.Identity.Web/) supports populating the current user with App Service authentication. To learn more, you can read about it on the [Microsoft.Identity.Web wiki](https://github.com/AzureAD/microsoft-identity-web/wiki/1.2.0#integration-with-azure-app-services-authentication-of-web-apps-running-with-microsoftidentityweb), or see it demonstrated in [this tutorial for a web app accessing Microsoft Graph](./scenario-secure-app-access-microsoft-graph-as-user.md?tabs=command-line#install-client-library-packages).

> [!NOTE]
> For claims mapping to work, you must enable the [Token store](overview-authentication-authorization.md#token-store).

## Access user claims using the API

If the [token store](overview-authentication-authorization.md#token-store) is enabled for your app, you can also obtain other details on the authenticated user by calling `/.auth/me`. 

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Authenticate and authorize users end-to-end](tutorial-auth-aad.md)

---
title: Accessing user information in Azure Static Web Apps
description: Learn to read authorization provider-returned user data.
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic: conceptual
ms.date: 04/09/2021
ms.author: cshoe
ms.custom:
---

# Accessing user information in Azure Static Web Apps

Azure Static Web Apps provides authentication-related user information via a [direct-access endpoint](#direct-access-endpoint) and to [API functions](#api-functions).

Many user interfaces rely heavily on user authentication data. The direct-access endpoint is a utility API that exposes user information without having to implement a custom function. Beyond convenience, the direct-access endpoint isn't subject to cold start delays that are associated with serverless architecture.

## Client principal data

Client principal data object exposes user-identifiable information to your app. The following properties are featured in the client principal object:

| Property           | Description                                                                                                                                                                                                                                                                                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `identityProvider` | The name of the [identity provider](authentication-authorization.md).                                                                                                                                                                                                                                                                                              |
| `userId`           | An Azure Static Web Apps-specific unique identifier for the user. <ul><li>The value is unique on a per-app basis. For instance, the same user returns a different `userId` value on a different Static Web Apps resource.<li>The value persists for the lifetime of a user. If you delete and add the same user back to the app, a new `userId` is generated.</ul> |
| `userDetails`      | Username or email address of the user. Some providers return the [user's email address](authentication-authorization.md), while others send the [user handle](authentication-authorization.md).                                                                                                                                                                    |
| `userRoles`        | An array of the [user's assigned roles](authentication-authorization.md).                                                                                                                                                                                                                                                                                          |
| `claims`        | An array of claims returned by your [custom authentication provider](authentication-custom.md). Only accessible in the direct-access endpoint.                                                                                                                                                                                                                                                                       |

The following example is a sample client principal object:

```json
{
  "identityProvider": "github",
  "userId": "d75b260a64504067bfc5b2905e3b8182",
  "userDetails": "username",
  "userRoles": ["anonymous", "authenticated"],
  "claims": [{
    "typ": "name",
    "val": "Azure Static Web Apps"
  }]
}
```

## Direct-access endpoint

You can send a `GET` request to the `/.auth/me` route and receive direct access to the client principal data. When the state of your view relies on authorization data, use this approach for the best performance.

For logged-in users, the response contains a client principal JSON object. Requests from unauthenticated users returns `null`.

Using the [fetch](https://developer.mozilla.org/docs/Web/API/Fetch_API/Using_Fetch)<sup>1</sup> API, you can access the client principal data using the following syntax.

```javascript
async function getUserInfo() {
  const response = await fetch('/.auth/me');
  const payload = await response.json();
  const { clientPrincipal } = payload;
  return clientPrincipal;
}

(async () => {
console.log(await getUserInfo());
})();
```

## API functions

The API functions available in Static Web Apps via the Azure Functions backend have access to the same user information as a client application, with the exception of the `claims` array. While the API does receive user-identifiable information, it does not perform its own checks if the user is authenticated or if they match a required role. Access control rules are defined in the [`staticwebapp.config.json`](configuration.md#routes) file.

# [JavaScript](#tab/javascript)

Client principal data is passed to API functions in the `x-ms-client-principal` request header. The client principal data is sent as a [Base64](https://www.wikipedia.org/wiki/Base64)-encoded string containing a serialized JSON object.

The following example function shows how to read and return user information.

```javascript
module.exports = async function (context, req) {
  const header = req.headers['x-ms-client-principal'];
  const encoded = Buffer.from(header, 'base64');
  const decoded = encoded.toString('ascii');

  context.res = {
    body: {
      clientPrincipal: JSON.parse(decoded),
    },
  };
};
```

Assuming the above function is named `user`, you can use the [fetch](https://developer.mozilla.org/docs/Web/API/Fetch_API/Using_Fetch)<sup>1</sup> browser API to access the API's response using the following syntax.

```javascript
async function getUser() {
  const response = await fetch('/api/user');
  const payload = await response.json();
  const { clientPrincipal } = payload;
  return clientPrincipal;
}

console.log(await getUser());
```

# [C#](#tab/csharp)

In a C# function, the user information is available from the `x-ms-client-principal` header which can be deserialized into a `ClaimsPrincipal` object, or your own custom type. The following code demonstrates how to unpack the header into an intermediary type, `ClientPrincipal`, which is then turned into a `ClaimsPrincipal` instance.

```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Http;

public static class StaticWebAppsAuth
{
  private class ClientPrincipal
  {
      public string IdentityProvider { get; set; }
      public string UserId { get; set; }
      public string UserDetails { get; set; }
      public IEnumerable<string> UserRoles { get; set; }
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

      principal.UserRoles = principal.UserRoles?.Except(new string[] { "anonymous" }, StringComparer.CurrentCultureIgnoreCase);

      if (!principal.UserRoles?.Any() ?? true)
      {
          return new ClaimsPrincipal();
      }

      var identity = new ClaimsIdentity(principal.IdentityProvider);
      identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, principal.UserId));
      identity.AddClaim(new Claim(ClaimTypes.Name, principal.UserDetails));
      identity.AddClaims(principal.UserRoles.Select(r => new Claim(ClaimTypes.Role, r)));

      return new ClaimsPrincipal(identity);
  }
}
```

---

When a user is logged in, the `x-ms-client-principal` header is added to the requests for user information via the Static Web Apps edge nodes.

> [!NOTE]
> The `x-ms-client-principal` header accessible in the API function does not contain the `claims` array.

<sup>1</sup> The [fetch](https://caniuse.com/#feat=fetch) API and [await](https://caniuse.com/#feat=mdn-javascript_operators_await) operator aren't supported in Internet Explorer.

## Next steps

> [!div class="nextstepaction"]
> [Configure app settings](application-settings.md)

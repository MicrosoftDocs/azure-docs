---
title: Protected web API - app code configuration | Azure Active Directory
description: Learn how to build a protected Web API and configure your application's code.
services: active-directory
documentationcenter: dev-center-name
author: jmprieur
manager: CelesteDG
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/07/2019
ms.author: jmprieur
ms.custom: aaddev 
#Customer intent: As an application developer, I want to learn how to write a protected Web API using the Microsoft identity platform for developers.
ms.collection: M365-identity-device-management
---

# Protected web API - adding authorization to your API

This article describes how you can add authorization to your Web API. This protection ensures that it's only called by:

- applications on behalf of users with the right scopes 
- or by daemon apps with the right application roles.

For an ASP.NET / ASP.NET Core Web API to be protected, you'll need to add the `[Authorize]` attribute on:

- the Controller itself if you want all the actions of the controller to be protected
- or the individual controller action for your API.

```CSharp
    [Authorize]
    public class TodoListController : Controller
    {
     ...
    }
```

But this protection isn't enough. It only guaranties that ASP.NET / ASP.NET Core will validate the token. Your API needs to verify that the token used to call your Web API was requested with the claims it expects, in particular:

- the **scopes** if the API is called on behalf of a user
- the **app roles** if the API can be called from a daemon app.

## Verifying scopes in APIs called on behalf of users

If your API is called by a client app on behalf of a user, then it needs to request a bearer token with specific scopes for the API (see [Code configuration | Bearer token](scenario-protected-web-api-app-configuration.md#bearer-token))

```CSharp
[Authorize]
public class TodoListController : Controller
{
    /// <summary>
    /// The Web API will only accept tokens 1) for users, 2) having the `access_as_user` scope for
    /// this API
    /// </summary>
    const string scopeRequiredByAPI = "access_as_user";

    // GET: api/values
    [HttpGet]
    public IEnumerable<TodoItem> Get()
    {
        VerifyUserHasAnyAcceptedScope(scopeRequiredByAPI);
        // Do the work and return the result
        ...
    }
...
}
```

The `VerifyUserHasAnyAcceptedScope` method would do something like the following:

- verify that there's a claims named `http://schemas.microsoft.com/identity/claims/scope` or `scp`
- verify that the claim has a value containing the scope expected by the API.

```CSharp
    /// <summary>
    /// When applied to an <see cref="HttpContext"/>, verifies that the user authenticated in the 
    /// Web API has any of the accepted scopes.
    /// If the authenticated user does not have any of these <paramref name="acceptedScopes"/>, the
    /// method throws an HTTP Unauthorized with the message telling which scopes are expected in the token
    /// </summary>
    /// <param name="acceptedScopes">Scopes accepted by this API</param>
    /// <exception cref="HttpRequestException"/> with a <see cref="HttpResponse.StatusCode"/> set to 
    /// <see cref="HttpStatusCode.Unauthorized"/>
    public static void VerifyUserHasAnyAcceptedScope(this HttpContext context,
                                                     params string[] acceptedScopes)
    {
        if (acceptedScopes == null)
        {
            throw new ArgumentNullException(nameof(acceptedScopes));
        }
        Claim scopeClaim = HttpContext?.User
                                      ?.FindFirst("http://schemas.microsoft.com/identity/claims/scope");
        if (scopeClaim == null || !scopeClaim.Value.Split(' ').Intersect(acceptedScopes).Any())
        {
            context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
            string message = $"The 'scope' claim does not contain scopes '{string.Join(",", acceptedScopes)}' or was not found";
            throw new HttpRequestException(message);
        }
    }
```

This sample code is for ASP.NET Core. For ASP.NET just replace `HttpContext.User` by `ClaimsPrincipal.Current`, and the claim type `"http://schemas.microsoft.com/identity/claims/scope"` by `"scp"` (See also the code snippet below)

## Verifying app roles in APIs called by daemon apps

If your Web API is called by a [Daemon application](scenario-daemon-overview.md), then that application should require an application permission to your Web API. We've seen in [scenario-protected-web-api-app-registration.md#how-to-expose-application-permissions--app-roles-] that your API exposes such permissions (for instance as the `access_as_application` app role).
You now need to have your APIs verify that the token it received contains the `roles` claims and
that this claim has the value it expects. The code doing this verification is similar to the code that verifies delegated permissions, except that, instead of testing for `scopes`, your controller action will test for `roles`:

```CSharp
[Authorize]
public class TodoListController : ApiController
{
    public IEnumerable<TodoItem> Get()
    {
        ValidateAppRole("access_as_application");
        ...
    }
```

The `ValidateAppRole()` method can be something like this:

```CSharp
private void ValidateAppRole(string appRole)
{
    //
    // The `role` claim tells you what permissions the client application has in the service.
    // In this case we look for a `role` value of `access_as_application`
    //
    Claim roleClaim = ClaimsPrincipal.Current.FindFirst("roles");
    if (roleClaim == null || !roleClaim.Value.Split(' ').Contains(appRole))
    {
        throw new HttpResponseException(new HttpResponseMessage 
        { StatusCode = HttpStatusCode.Unauthorized, 
            ReasonPhrase = $"The 'roles' claim does not contain '{appRole}' or was not found" 
        });
    }
}
}
```

This sample code is for ASP.NET. For ASP.NET Core, just replace `ClaimsPrincipal.Current` by `HttpContext.User` and the `"roles"` claim name by `"http://schemas.microsoft.com/identity/claims/roles"` (see also the code snippet above)

### Accepting app only tokens if the Web API should only be called by daemon apps

The `roles` claim is also used for users in user assignment patterns (See [How to: Add app roles in your application and receive them in the token](howto-add-app-roles-in-azure-ad-apps.md)). So just checking roles will allow apps to sign in as users and the other way around, if the roles are assignable to both. We recommend having different roles declared for users and apps to prevent this confusion.

If you want to only allow daemon applications to call your Web API, you'll want to add a condition, when you validate the app role, that the token is an app-only token:

```CSharp
string oid = ClaimsPrincipal.Current.FindFirst("oid");
string sub = ClaimsPrincipal.Current.FindFirst("sub");
bool isAppOnlyToken = oid == sub;
```

Checking the inverse condition will allow only apps that sign in a user, to call your API.

## Next steps

> [!div class="nextstepaction"]
> [Move to production](scenario-protected-web-api-production.md)

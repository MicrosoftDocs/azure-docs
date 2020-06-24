---
title: Verify scopes and app roles protected web API | Azure
titleSuffix: Microsoft identity platform
description: Learn how to build a protected web API and configure your application's code.
services: active-directory
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 05/07/2019
ms.author: jmprieur
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn how to write a protected web API using the Microsoft identity platform for developers.
---

# Protected web API: Verify scopes and app roles

This article describes how you can add authorization to your web API. This protection ensures that the API is called only by:

- Applications on behalf of users who have the right scopes.
- Daemon apps that have the right application roles.

> [!NOTE]
> The code snippets from this article are extracted from the following samples, which are fully functional:
>
> - [ASP.NET Core web API incremental tutorial](https://github.com/Azure-Samples/active-directory-dotnet-native-aspnetcore-v2/blob/02352945c1c4abb895f0b700053506dcde7ed04a/1.%20Desktop%20app%20calls%20Web%20API/TodoListService/Controllers/TodoListController.cs#L37) on GitHub
> - [ASP.NET web API sample](https://github.com/Azure-Samples/ms-identity-aspnet-webapi-onbehalfof/blob/dfd0115533d5a230baff6a3259c76cf117568bd9/TodoListService/Controllers/TodoListController.cs#L48)

To protect an ASP.NET or ASP.NET Core web API, you must add the `[Authorize]` attribute to one of the following items:

- The controller itself if you want all controller actions to be protected
- The individual controller action for your API

```csharp
    [Authorize]
    public class TodoListController : Controller
    {
     ...
    }
```

But this protection isn't enough. It guarantees only that ASP.NET and ASP.NET Core validate the token. Your API needs to verify that the token used to call the API is requested with the expected claims. These claims in particular need verification:

- The *scopes* if the API is called on behalf of a user.
- The *app roles* if the API can be called from a daemon app.

## Verify scopes in APIs called on behalf of users

If a client app calls your API on behalf of a user, the API needs to request a bearer token that has specific scopes for the API. For more information, see [Code configuration | Bearer token](scenario-protected-web-api-app-configuration.md#bearer-token).

```csharp
[Authorize]
public class TodoListController : Controller
{
    /// <summary>
    /// The web API will accept only tokens 1) for users, 2) that have the `access_as_user` scope for
    /// this API.
    /// </summary>
    const string scopeRequiredByAPI = "access_as_user";

    // GET: api/values
    [HttpGet]
    public IEnumerable<TodoItem> Get()
    {
        VerifyUserHasAnyAcceptedScope(scopeRequiredByAPI);
        // Do the work and return the result.
        ...
    }
...
}
```

The `VerifyUserHasAnyAcceptedScope` method does something like the following steps:

- Verify there's a claim named `http://schemas.microsoft.com/identity/claims/scope` or `scp`.
- Verify the claim has a value that contains the scope expected by the API.

```csharp
    /// <summary>
    /// When applied to a <see cref="HttpContext"/>, verifies that the user authenticated in the
    /// web API has any of the accepted scopes.
    /// If the authenticated user doesn't have any of these <paramref name="acceptedScopes"/>, the
    /// method throws an HTTP Unauthorized error with a message noting which scopes are expected in the token.
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

The preceding [sample code](https://github.com/Azure-Samples/active-directory-dotnet-native-aspnetcore-v2/blob/02352945c1c4abb895f0b700053506dcde7ed04a/Microsoft.Identity.Web/Resource/ScopesRequiredByWebAPIExtension.cs#L47) is for ASP.NET Core. For ASP.NET, just replace `HttpContext.User` with `ClaimsPrincipal.Current`, and replace the claim type `"http://schemas.microsoft.com/identity/claims/scope"` with `"scp"`. Also see the code snippet later in this article.

## Verify app roles in APIs called by daemon apps

If your web API is called by a [daemon app](scenario-daemon-overview.md), that app should require an application permission to your web API. As shown in [Exposing application permissions (app roles)](https://docs.microsoft.com/azure/active-directory/develop/scenario-protected-web-api-app-registration#exposing-application-permissions-app-roles), your API exposes such permissions. One example is the `access_as_application` app role.

You now need to have your API verify that the token it receives contains the `roles` claim and that this claim has the expected value. The verification code is similar to the code that verifies delegated permissions, except that your controller action tests for roles instead of scopes:

```csharp
[Authorize]
public class TodoListController : ApiController
{
    public IEnumerable<TodoItem> Get()
    {
        ValidateAppRole("access_as_application");
        ...
    }
```

The `ValidateAppRole` method can be something like this:

```csharp
private void ValidateAppRole(string appRole)
{
    //
    // The `role` claim tells you what permissions the client application has in the service.
    // In this case, we look for a `role` value of `access_as_application`.
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

This time, the code snippet is for ASP.NET. For ASP.NET Core, just replace `ClaimsPrincipal.Current` with `HttpContext.User`, and replace the `"roles"` claim name with `"http://schemas.microsoft.com/ws/2008/06/identity/claims/role"`. Also see the code snippet earlier in this article.

### Accepting app-only tokens if the web API should be called only by daemon apps

Users can also use roles claims in user assignment patterns, as shown in [How to: Add app roles in your application and receive them in the token](howto-add-app-roles-in-azure-ad-apps.md). If the roles are assignable to both, checking roles will let apps sign in as users and users to sign in as apps. We recommend that you declare different roles for users and apps to prevent this confusion.

If you want only daemon apps to call your web API, add the condition that the token is an app-only token when you validate the app role.

```csharp
string oid = ClaimsPrincipal.Current.FindFirst("oid")?.Value;
string sub = ClaimsPrincipal.Current.FindFirst("sub")?.Value;
bool isAppOnlyToken = oid == sub;
```

Checking the inverse condition allows only apps that sign in a user to call your API.

## Next steps

> [!div class="nextstepaction"]
> [Move to production](scenario-protected-web-api-production.md)

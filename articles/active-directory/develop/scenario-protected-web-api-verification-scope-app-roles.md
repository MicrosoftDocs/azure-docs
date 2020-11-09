---
title: Verify scopes and app roles protected web API | Azure
titleSuffix: Microsoft identity platform
description: Verify that the API is only called by applications on behalf of users who have the right scopes and by daemon apps that have the right application roles.
services: active-directory
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 07/15/2020
ms.author: jmprieur
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn how to write a protected web API using the Microsoft identity platform for developers.
---

# Protected web API: Verify scopes and app roles

This article describes how you can add authorization to your web API. This protection ensures that the API is called only by:

- Applications on behalf of users who have the right scopes.
- Daemon apps that have the right application roles.

> [!NOTE]
> The code snippets in this article are extracted from the following code samples on GitHub:
>
> - [ASP.NET Core web API incremental tutorial](https://github.com/Azure-Samples/active-directory-dotnet-native-aspnetcore-v2/blob/master/1.%20Desktop%20app%20calls%20Web%20API/TodoListService/Controllers/TodoListController.cs)
> - [ASP.NET web API sample](https://github.com/Azure-Samples/ms-identity-aspnet-webapi-onbehalfof/blob/master/TodoListService/Controllers/TodoListController.cs)

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

### .NET Core

#### Verify the scopes on each controller action

```csharp
[Authorize]
public class TodoListController : Controller
{
    /// <summary>
    /// The web API will accept only tokens 1) for users, 2) that have the `access_as_user` scope for
    /// this API.
    /// </summary>
    static readonly string[] scopeRequiredByApi = new string[] { "access_as_user" };

    // GET: api/values
    [HttpGet]
    public IEnumerable<TodoItem> Get()
    {
         HttpContext.VerifyUserHasAnyAcceptedScope(scopeRequiredByApi);
        // Do the work and return the result.
        // ...
    }
...
}
```

The `VerifyUserHasAnyAcceptedScope` method does something like the following steps:

- Verify there's a claim named `http://schemas.microsoft.com/identity/claims/scope` or `scp`.
- Verify the claim has a value that contains the scope expected by the API.


#### Verify the scopes more globally

Defining granular scopes for your web API and verifying the scopes in each controller action is the recommended approach. However, it's also possible to verify the scopes at the level of the application or a controller by using ASP.NET Core. For details, see [Claim-based authorization](/aspnet/core/security/authorization/claims) in the ASP.NET core documentation.

### .NET MVC

For ASP.NET, just replace `HttpContext.User` with `ClaimsPrincipal.Current`, and replace the claim type `"http://schemas.microsoft.com/identity/claims/scope"` with `"scp"`. Also see the code snippet later in this article.

## Verify app roles in APIs called by daemon apps

If your web API is called by a [daemon app](scenario-daemon-overview.md), that app should require an application permission to your web API. As shown in [Exposing application permissions (app roles)](./scenario-protected-web-api-app-registration.md#exposing-application-permissions-app-roles), your API exposes such permissions. One example is the `access_as_application` app role.

You now need to have your API verify that the token it receives contains the `roles` claim and that this claim has the expected value. The verification code is similar to the code that verifies delegated permissions, except that your controller action tests for roles instead of scopes:

### ASP.NET Core

```csharp
[Authorize]
public class TodoListController : ApiController
{
    public IEnumerable<TodoItem> Get()
    {
        HttpContext.ValidateAppRole("access_as_application");
        ...
    }
```

The `ValidateAppRole` method is defined in Microsoft.Identity.Web in [RolesRequiredHttpContextExtensions.cs](https://github.com/AzureAD/microsoft-identity-web/blob/d2ad0f5f830391a34175d48621a2c56011a45082/src/Microsoft.Identity.Web/Resource/RolesRequiredHttpContextExtensions.cs#L28).

### ASP.NET MVC

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

Move on to the next article in this scenario,
[Move to production](scenario-protected-web-api-production.md)

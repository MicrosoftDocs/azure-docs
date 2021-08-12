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
     // ...
    }
```

But this protection isn't enough. It guarantees only that ASP.NET and ASP.NET Core validate the token. Your API needs to verify that the token used to call the API is requested with the expected claims. These claims in particular need verification:

- The *scopes* if the API is called on behalf of a user.
- The *app roles* if the API can be called from a daemon app.

## Verify scopes in APIs called on behalf of users

If a client app calls your API on behalf of a user, the API needs to request a bearer token that has specific scopes for the API. For more information, see [Code configuration | Bearer token](scenario-protected-web-api-app-configuration.md#bearer-token).

### [ASP.NET Core](#tab/aspnetcore)

In ASP.NET Core, you can use Microsoft.Identity.Web to verify scopes in each controller action. You can also verify them at the level of the controller or for the whole application.

#### Verify the scopes on each controller action

You can verify the scopes in the controller action by using the `[RequiredScope]` attribute. This attribute
has several overrides. One that takes the required scopes directly, and one that takes a key to the configuration.

##### Verify the scopes on a controller action with hardcoded scopes

The following code snippet shows the usage of the `[RequiredScope]` attribute with hardcoded scopes.

```csharp
using Microsoft.Identity.Web

[Authorize]
public class TodoListController : Controller
{
    /// <summary>
    /// The web API will accept only tokens that have the `access_as_user` scope for
    /// this API.
    /// </summary>
    static readonly string[] scopeRequiredByApi = new string[] { "access_as_user" };

    // GET: api/values
    [HttpGet]
    [RequiredScope(scopeRequiredByApi)
    public IEnumerable<TodoItem> Get()
    {
        // Do the work and return the result.
        // ...
    }
 // ...
}
```

##### Verify the scopes on a controller action with scopes defined in configuration

You can also declare these required scopes in the configuration, and reference the configuration key:

For instance if, in the appsettings.json you have the following configuration:

```JSon
{
 "AzureAd" : {
   // more settings
   "Scopes" : "access_as_user access_as_admin"
  }
}
```

Then, reference it in the `[RequiredScope]` attribute:

```csharp
using Microsoft.Identity.Web

[Authorize]
public class TodoListController : Controller
{
    // GET: api/values
    [HttpGet]
    [RequiredScope(RequiredScopesConfigurationKey = "AzureAd:Scopes")
    public IEnumerable<TodoItem> Get()
    {
        // Do the work and return the result.
        // ...
    }
 // ...
}
```

##### Verify scopes conditionally

There are cases where you want to verify scopes conditionally. You can do this using the `VerifyUserHasAnyAcceptedScope` extension method on the `HttpContext`.

```csharp
using Microsoft.Identity.Web

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
 // ...
}
```

#### Verify the scopes at the level of the controller

You can also verify the scopes for the whole controller

##### Verify the scopes on a controller with hardcoded scopes

The following code snippet shows the usage of the `[RequiredScope]` attribute with hardcoded scopes on the controller.

```csharp
using Microsoft.Identity.Web

[Authorize]
[RequiredScope(scopeRequiredByApi)]
public class TodoListController : Controller
{
    /// <summary>
    /// The web API will accept only tokens 1) for users, 2) that have the `access_as_user` scope for
    /// this API.
    /// </summary>
    const string[] scopeRequiredByApi = new string[] { "access_as_user" };

    // GET: api/values
    [HttpGet]
    public IEnumerable<TodoItem> Get()
    {
        // Do the work and return the result.
        // ...
    }
 // ...
}
```

##### Verify the scopes on a controller with scopes defined in configuration

Like on action, you can also declare these required scopes in the configuration, and reference the configuration key:

```csharp
using Microsoft.Identity.Web

[Authorize]
[RequiredScope(RequiredScopesConfigurationKey = "AzureAd:Scopes")
public class TodoListController : Controller
{
    // GET: api/values
    [HttpGet]
    public IEnumerable<TodoItem> Get()
    {
        // Do the work and return the result.
        // ...
    }
 // ...
}
```

#### Verify the scopes more globally

Defining granular scopes for your web API and verifying the scopes in each controller action is the recommended approach. However it's also possible to verify the scopes at the level of the application or a controller. For details, see [Claim-based authorization](/aspnet/core/security/authorization/claims) in the ASP.NET core documentation.

#### What is verified?

The `[RequiredScope]` attribute and `VerifyUserHasAnyAcceptedScope` method, does something like the following steps:

- Verify there's a claim named `http://schemas.microsoft.com/identity/claims/scope` or `scp`.
- Verify the claim has a value that contains the scope expected by the API.

### [ASP.NET Classic](#tab/aspnet)

In an ASP.NET application, you can validate scopes in the following way:

```CSharp
[Authorize]
public class TodoListController : ApiController
{
    public IEnumerable<TodoItem> Get()
    {
       ValidateScopes(new[] {"read"; "admin" } );
       // ...
    }
```

Below is a simplified version of  `ValidateScopes`:

```csharp
private void ValidateScopes(IEnumerable<string> acceptedScopes)
{
    //
    // The `role` claim tells you what permissions the client application has in the service.
    // In this case, we look for a `role` value of `access_as_application`.
    //
    Claim scopeClaim = ClaimsPrincipal.Current.FindFirst("scp");
    if (scopeClaim == null || !scopeClaim.Value.Split(' ').Intersect(acceptedScopes).Any())
    {
        throw new HttpResponseException(new HttpResponseMessage
        { StatusCode = HttpStatusCode.Forbidden,
            ReasonPhrase = $"The 'scp' claim does not contain '{scopeClaim}' or was not found"
        });
    }
}
```

For a full version of `ValidateScopes` for ASP.NET Core, [*ScopesRequiredHttpContextExtensions.cs*](https://github.com/AzureAD/microsoft-identity-web/blob/master/src/Microsoft.Identity.Web/Resource/ScopesRequiredHttpContextExtensions.cs)

---

## Verify app roles in APIs called by daemon apps

If your web API is called by a [daemon app](scenario-daemon-overview.md), that app should require an application permission to your web API. As shown in [Exposing application permissions (app roles)](./scenario-protected-web-api-app-registration.md#exposing-application-permissions-app-roles), your API exposes such permissions. One example is the `access_as_application` app role.

You now need to have your API verify that the token it receives contains the `roles` claim and that this claim has the expected value. The verification code is similar to the code that verifies delegated permissions, except that your controller action tests for roles instead of scopes:

### [ASP.NET Core](#tab/aspnetcore)

The following code snippet shows how to verify the application role

```csharp
using Microsoft.Identity.Web

[Authorize]
public class TodoListController : ApiController
{
    public IEnumerable<TodoItem> Get()
    {
        HttpContext.ValidateAppRole("access_as_application");
        // ...
    }
```

Instead, you can use the [Authorize("role")] attributes on the controller or an action (or a razor page).

```CSharp
[Authorize("role")]
MyController : ApiController
{
    // ...
}
```

But for this, you'll need to map the Role claim to "roles" in the Startup.cs file:


```CSharp
 services.Configure<OpenIdConnectOptions>(OpenIdConnectDefaults.AuthenticationScheme, options =>
 {
    // The claim in the Jwt token where App roles are available.
    options.TokenValidationParameters.RoleClaimType = "roles";
 });
```

This isn't the best solution if you also need to do authorization based on groups.

For details, see the web app incremental tutorial on [authorization by roles and groups](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/5-WebApp-AuthZ).

### [ASP.NET Classic](#tab/aspnet)

In an ASP.NET application, you can validate app roles in the following way:

```CSharp
[Authorize]
public class TodoListController : ApiController
{
    public IEnumerable<TodoItem> Get()
    {
       ValidateAppRole("access_as_application");
       // ...
    }
```

A simplified version of  `ValidateAppRole` is:

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
```

For a full version of `ValidateAppRole` for ASP.NET Core, see [*RolesRequiredHttpContextExtensions.cs*](https://github.com/AzureAD/microsoft-identity-web/blob/master/src/Microsoft.Identity.Web/Resource/RolesRequiredHttpContextExtensions.cs) code.

---

### Accepting app-only tokens if the web API should be called only by daemon apps

Users can also use roles claims in user assignment patterns, as shown in [How to: Add app roles in your application and receive them in the token](howto-add-app-roles-in-azure-ad-apps.md). If the roles are assignable to both, checking roles will let apps sign in as users and users to sign in as apps. We recommend that you declare different roles for users and apps to prevent this confusion.

If you want only daemon apps to call your web API, add the condition that the token is an app-only token when you validate the app role.

```csharp
string oid = ClaimsPrincipal.Current.FindFirst("oid")?.Value;
string sub = ClaimsPrincipal.Current.FindFirst("sub")?.Value;
bool isAppOnly = oid != null && sub != null && oid == sub;
```

Checking the inverse condition allows only apps that sign in a user to call your API.

### Using ACL-based authorization

Alternatively to app-roles based authorization, you can
protect your web API with an Access Control List (ACL) based authorization pattern to [control tokens without the `roles` claim](v2-oauth2-client-creds-grant-flow.md#controlling-tokens-without-the-roles-claim).

If you are using Microsoft.Identity.Web on ASP.NET core, you'll need to declare that you are using ACL-based authorization, otherwise Microsoft Identity Web will throw an exception when neither roles nor scopes are in the Claims provided:

```Text
System.UnauthorizedAccessException: IDW10201: Neither scope or roles claim was found in the bearer token.
```

 To avoid this exception, set the `AllowWebApiToBeAuthorizedByACL` configuration property to true, in the appsettings.json or programmatically.

```Json
{
 "AzureAD"
 {
  // other properties
  "AllowWebApiToBeAuthorizedByACL" : true,
  // other properties
 }
}
```

If you set `AllowWebApiToBeAuthorizedByACL` to true, this is **your responsibility** to ensure the ACL mechanism.

## Next steps

Move on to the next article in this scenario,
[Move to production](scenario-protected-web-api-production.md).

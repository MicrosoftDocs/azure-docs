---
title: Routes in Azure Static Web Apps
description: Learn about back-end routing rules and how to secure routes with roles.
services: azure-functions
author: craigshoemaker
ms.service: azure-functions
ms.topic:  conceptual
ms.date: 05/08/2020
ms.author: cshoe
---

# Routes in Azure Static Web Apps

Routing in Azure Static Web Apps enforces back-end routing rules and authorization behavior for both static content and APIs. The rules are defined and controlled by the _routes.json_ file. Routing rules are defined as an array of rules that are enforced in the same order as they appear in the array.

- The _routes.json_ file must exist at the root of the static app.
- Roles are defined in the _routes.json_ file and users are associated to roles via [invitations](authentication-authorization.md).
- You have full control over role names. There is no system-wide master list you must use.

The topic of routing significantly overlaps with authentication and authorization concepts. Make sure to read the [authentication and authorization](authentication-authorization.md) guide along with this article.

## Defining routes

Routes are defined the _routes.json_ file as an array of route rules on the `routes` property.

```json
{
  "routes": [ ... ]
}
```

Each rule is composed of a route to match the incoming request, along with one or more of the optional rule properties.

| Rule property  | Required | Default value | Comment                                                      |
| -------------- | -------- | ------------- | ------------------------------------------------------------ |
| `route`        | Yes      | none          | The route requested by the caller. [Wildcards](#route-wildcards) are supported at the end of route paths. For instance, the route _admin/\*_ matches any route under the _admin_ path. |
| `serve`        | No       | none          | Defines the file returned from the request. The file path and name can be different from the requested path. If no path or file is defined, then the requested path is used. |
| `allowedRoles` | No       | anonymous     | An array of role names. <ul><li>Valid characters include `a-z`, `A-Z`, `0-9`, and `_`.<li>The built-in role `anonymous` applies to all unauthenticated users.<li>The built-in role `authenticated` applies any logged-in user.<li>Users must belong to at least one role<li>Roles are matched on an _OR_ basis. If a user is in at any of the listed roles, then access is granted.</ul> |
| `statusCode`   | No       | 200           | The [HTTP status](https://wikipedia.org/wiki/List_of_HTTP_status_codes) server response for the request. |

## Security

By default, every user belongs to the built-in `anonymous` role and all logged-in users are members of the `authenticated` role.

Routes are secured by listing one or more _roles_ in a routing rule. For instance, to require that only logged-in users have access to a route, add the built-in `authenticated` role to the `allowedRoles` array.

```json
{
  "route": "/profile",
  "allowedRoles": ["authenticated"]
}
```

To customize your security rules, you can create new roles as needed in the roles array. If you wanted to secure a route to only administrators, you could define an `administrator` role in the `allowedRoles` array.

```json
{
  "route": "/admin",
  "allowedRoles": ["administrator"]
}
```

You have full control over role names. There is no master list to which your roles must adhere.

## Wildcards

Wildcards rules match all requests under a given route. If you define a `serve` value in your rule, the designated file is served in response to requests for any matching routes.

For instance, to implement a site that handles a series of routes for a calendar application, you can map all URLs that fall under the _calendar_ route to serve a single HTML file.

```json
{
  "route": "/calendar/*",
  "serve": "/calendar.html"
}
```

The _calendar.html_ file can then use client-side routing to serve a different view for URL variations like `/calendar/january/1`, `/calendar/august/18`, and `/calendar/december/25`.

You can also use wildcards to secure an entire path tree. In the following example, any file requested under the _admin_ path requires an authenticated user who is a member of the _administrator_ role.

```json
{
  "route": "/admin/*",
  "allowedRoles": ["administrator"]
}
```

> [!NOTE]
> Requests for files referenced by a served file are only evaluated for authentication checks. For instance, if a served file references a CSS file under a wild card path, the CSS file is served to the browser if the user meets the required authentication requirements.

## Redirects

By designating [HTTP redirect status codes](https://www.wikipedia.org/wiki/URL_redirection#HTTP_status_codes_3xx), you can redirect requests from one route to another.

For instance, the following rule creates a 301 redirect from one page to another.

```json
{
  "route": "/old-page.html",
  "serve": "/new-page.html",
  "statusCode": 301
}
```

Redirects also work with paths that don't list distinct files.

```json
{
  "route": "/about-us",
  "serve": "/about",
  "statusCode": 301
}
```

## Custom error pages

Ranging from requesting files not found (404) to a host of authorization-related errors, users may encounter scenarios which can result in an error. Using the `platformErrorOverrides` array, you can provide a custom experience in response to these errors.

The following table lists the available platform error overrides:

| Error type  | HTTP status code | Description |
|---------|---------|---------|
| `NotFound` | 401  | The page is not found |
| `Unauthenticated` | 401 | You haven't logged in |
| `Unauthorized_InsufficientUserInformation` | 401 | You haven't configured the auth provider to publicize the data |
| `Unauthorized_InvalidInvitationLink` | 401 | Expired or "not for you" link |
| `Unauthorized_MissingRoles` | 401 | You don't have the required role |
| `Unauthorized_TooManyUsers` | 401 | Throttling number of invited users |
| `Unauthorized_Unknown` | 401 | Identity provider doesn't recognize you. You tell provider not to allow consent |

## Example route file

The following example shows how to build route rules in a _routes.json_ file.

```json
{
  "routes": [
    {
      "route": "/profile",
      "roles": ["authenticated"]
    },
    {
      "route": "/admin/*",
      "allowedRoles": ["admin"]
    },
    {
      "route": "/login",
      "serve": "/.auth/login/github"
    },
    {
      "route": "/logout",
      "serve": "/.auth/logout"
    },
    {
      "route": "/calendar/*",
      "serve": "/calendar.html"
    },
    {
      "route": "/specials",
      "serve": "/deals",
      "statusCode": 301
    }
  ],
  "platformErrorOverrides": [
    {
      "errorType": "NotFound",
      "serve": "/custom-404.html"
    }
  ]
}
```

The following explanation describes what happens when a request matches a rule.

|Requests to...  | Result in... |
|---------|---------|
| _/profile_ | Authenticated users are served the _/profile/index.html_ file. Unauthenticated users are challenged to authenticate. |
| _/admin/reports_ | Authenticated users are served the _/admin/reports/index.html_ file. Unauthenticated users are challenged to authenticate. |
| _/login_     | Unauthenticated users are challenged to authenticate with GitHub. |
| _/logout_     | Users are logged out of any authentication provider. |
| _/calendar/2020/01_ | The browser is served the _/calendar.html_ file. |
| _/specials_ | TODO |
| _/foo_     | The _/custom-404.html_ file is served, with a 404 HTTP status code. |

## Restrictions

- The _routes.json_ file cannot be more than 100KB
- The _routes.json_ file supports a maximum of 50 distinct roles

## Next steps

> [!div class="nextstepaction"]
> [Setup authentication and authorization](authentication-authorization.md)

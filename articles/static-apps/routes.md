---
title: Routes in App Service Static Apps
description: Learn about server-side routing rules and how to secure routes with roles.
services: azure-functions
author: craigshoemaker
ms.service: azure-functions
ms.topic:  conceptual
ms.date: 05/08/2020
ms.author: cshoe
---

# Routes in App Service Static Apps

Routing in App Service Static Apps enforces server-side routing rules and authorization behavior for both static content and APIs. The rules are defined and controlled by the _routes.json_ file, which features an array of routing rules that are enforced in the same order as they appear in the array.

- The _routes.json_ file must exist at the root of the static app.
- Roles are defined in the _routes.json_ file and users are associated to roles via invitations.
- You have full control over how to name roles. There is no system-wide master list you must follow.

The topic of routing overlaps with authentication and authorization concepts. Make sure to read the [authentication and authorization](authentication-authorization.md) guide along with this article.

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
| `route`        | Yes      | none          | The route requested by the caller. [Wildcards](#route-wildcards) are supported at the end of routes. For instance, the route _admin/\*_ matches any route under the _admin_ path. |
| `serve`        | No       | none          | Defines the file returned from the request. The file path and name can be different from the requested path. If no path or file is defined, then the requested path is used. |
| `allowedRoles` | No       | anonymous     | An array of role names. <ul><li>Valid characters include `a-z`, `A-Z`, `0-9`, and `_` <li>The built-in role `anonymous` applies to all unauthenticated users <li>The built-in role `authenticated` applies any logged-in user<li>Users must belong to at least one role<li>Roles are matched on an _OR_ basis. If a user is in at any of the listed roles, then access is granted.</ul> |
| `statusCode`   | No       | 200           | The [HTTP status](https://wikipedia.org/wiki/List_of_HTTP_status_codes) server response for the request. |

## Securing routes

**TODO**: restate built-in roles

Routes are secured by defining one or more _roles_ in a routing rule. For instance, to require only logged-in users have access to a route, add the built-in `authenticated` role to the `allowedRoles` array. The `authenticated` role matches against any logged in user.

```json
{
  "route": "/profile",
  "allowedRoles": ["authenticated"]
}
```

To customize your security rules, you can create new roles as needed in the roles array. If you wanted to secure a route to only administrators, you could define an `admin` role in the `allowedRoles` array.

```json
{
  "route": "/admin",
  "allowedRoles": ["admin"]
}
```

## Route wildcards

Wildcards rules match all requests under a given route. If you define a `serve` value in your rule, the designated file is served in response to requests for any matching routes.

For instance, to implement a site that handles a series of routes for a calendar application, you can map all URLs that fall under the _calendar_ route to server a single HTML file.

```json
{
  "route": "/calendar/*",
  "serve": "/calendar.html"
}
```

The _calendar.html_ file can then use a front-end framework with client-side routing to serve a different view for URL variations like `/calendar/january/1`, `/calendar/august/18`, and `/calendar/december/25`.

You can also use wildcards to secure an entire path tree. The the following example any requested file under the _admin_ path requires an authenticated user to be a member of the _admin_ role.

```json
{
  "route": "/admin/*",
  "allowedRoles": ["admin"]
}
```

**TODO**: harmonized explanation with SPA routing (for SPA apps, common to have a fallback route) - section on working with client-side routing

**TODO:** with wild route, request under the route for files only auth checks

## Redirects

By defining custom HTTP status codes, you can create redirects from one route to another.

For instance, the following rule creates a 301 redirect from one page to another.

```json
{
  "route": "/old-page.html",
  "serve": "/new-page.html",
  "statusCode": 301
}
```

Redirects also work with paths are are not distinct files.

```json
{
  "route": "/about-us",
  "serve": "/about",
  "statusCode": 301
}
```

## Restrictions

- The _routes.json_ file cannot be more than 100KB
- The _routes.json_ file supports a maximum of 50 distinct roles

## Next steps

> [!div class="nextstepaction"]
> [Setup authentication and authorization](authentication-authorization.md)

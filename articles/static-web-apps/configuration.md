---
title: Configure Azure Static Web Apps
description: Learn to configure routes, enforce security rules, and global settings for Azure Static Web Apps.
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  quickstart
ms.date: 12/08/2020
ms.author: cshoe
---

# Configure Azure Static Web Apps

Configuration for Azure Static Web Apps is defined in the _staticwebapp.config.json_ file, which defines the following rules:

- Back-end routing
- Authentication and authorization
- Global HTTP header definitions
- HTTP response overrides

The _staticwebapp.config.json_ file may be placed in any location under the _app_ folder.

See the [example configuration](#example-configuration-file) file for details.

> [!IMPORTANT]
> The [_routes.json_](./routes.md) file is ignored if a _staticwebapp.config.json_ exists.

## Routes

Routes are defined as an array of routing rules. See the [example route file](#example-configuration-file) for usage examples.

- Rules are executed in the order as they appear in the `routes` array.
- Rule evaluation stops at the first match. Routing rules aren't chained together.
- Roles are defined in the _staticwebapp.config.json_ file and users are associated to roles via [invitations](./authentication-authorization.md).
- You have full control over role names.

The routing concerns significantly overlap with authentication and authorization concepts. Make sure to read the [authentication and authorization](authentication-authorization.md) guide along with this article.

## Defining routes

Each rule is composed of a route pattern, along with one or more of the optional rule properties. See the [example route file](#example-configuration-file) for usage examples.

| Rule property  | Required | Default value | Comment                                                      |
| -------------- | -------- | ------------- | ------------------------------------------------------------ |
| `route`        | Yes      | n/a          | The route pattern requested by the caller.<ul><li>[Wildcards](#wildcards) are supported at the end of route paths.<ul><li>For instance, the route _admin/\*_ matches any route under the _admin_ path.</ul><li>A route serves the folder's _index.html_ file by default.</ul>|
| `rewrite`        | No       | n/a          | Defines the file or path returned from the request.<ul><li>Is mutually exclusive to a `redirect` rule<li>Rewrite rules don't change the browser's location<li>Values must point to actual files<li>Querystring parameters aren't supported</ul>  |
| `redirect`        | No       | n/a          | Defines the file or path redirect destination for a request.<ul><li>Is mutually exclusive to a `rewrite` rule<li>Redirect rules change the browser's location<li>Default response code is a [`302`](https://developer.mozilla.org/docs/Web/HTTP/Status/302) temporary redirect, but you can override with a [`301`](https://developer.mozilla.org/docs/Web/HTTP/Status/301) permanent redirect<li>Querystring parameters aren't supported</ul> |
| `allowedRoles` | No       | anonymous     | An array of role names. <ul><li>Valid characters include `a-z`, `A-Z`, `0-9`, and `_`<li>The built-in role, [`anonymous`](./authentication-authorization.md), applies to all unauthenticated users<li>The built-in role, [`authenticated`](./authentication-authorization.md), applies to any logged-in use.<li>Users must belong to at least one role<li>Roles are matched on an _OR_ basis.<ul><li>If a user is in any of the listed roles, then access is granted</ul><li>Individual users are associated to roles through [invitations](authentication-authorization.md).</ul> |
| `headers`<a id="route-headers"></a> | No | n/a | Set of [HTTP headers](https://developer.mozilla.org/docs/Web/HTTP/Headers) associated with the request.<ul><li>Route-specific headers take precedence over [`globalHeaders`](#global-headers)</ul> |
| `statusCode`   | No       | 200           | The [HTTP status code](https://developer.mozilla.org/docs/Web/HTTP/Status) response for the request. |
| `methods` | No | n/a | An array of HTTP methods. Available methods include: `GET`, `HEAD`, `POST`, `PUT`, `DELETE`, `CONNECT`, `OPTIONS`, `TRACE`, `PATCH` |

## Securing routes with roles

Routes are secured by adding one or more role names into a rule's `allowedRoles` array. See the [example route file](#example-configuration-file) for usage examples.

By default, every user belongs to the built-in `anonymous` role, and all logged-in users are members of the `authenticated` role.

For instance, to restrict a route to only authenticated users, add the built-in `authenticated` role to the `allowedRoles` array.

```json
{
  "route": "/profile",
  "allowedRoles": ["authenticated"]
}
```

You can create new roles as needed in the `allowedRoles` array. To restrict a route to only administrators, you could define an `administrators` role in the `allowedRoles` array.

```json
{
  "route": "/admin",
  "allowedRoles": ["administrators"]
}
```

- You have full control over role names; there's no list to which your roles must adhere.
- Individual users are associated to roles through [invitations](authentication-authorization.md).

## Wildcards

Wildcard rules match all requests under `rewrite` and `redirect` route patterns, and are only supported at the end of a path. See the [example route file](#example-configuration-file) for usage examples.

For instance, to implement routes for a calendar application, you can rewrite all URLs that fall under the _calendar_ route to serve a single file.

```json
{
  "route": "/calendar/*",
  "rewrite": "/calendar.html"
}
```

The _calendar.html_ file can then use client-side routing to serve a different view for URL variations like `/calendar/january/1`, `/calendar/2020`, and `/calendar/overview`.

If you don't want a wildcard route to apply to supporting files (JavaScript, CSS and image files), consider placing them in a separate folder outside the scope of the wildcard rule.

Common uses cases for wildcard routes include:

- Serving a specific file for an entire API path
- Mapping different HTTP methods to an entire API path
- Enforcing auth rules
- Implement specialized caching rules

## Global headers

The `globalHeaders` section provides a set of [HTTP headers](https://developer.mozilla.org/docs/Web/HTTP/Headers) applied to each request, unless overridden by a [route header](#route-headers) rule. See the [example route file](#example-configuration-file) for usage examples.

## Response overrides

The `responseOverrides` section provides a set of HTTP response codes that allow you to serve custom files or paths. See the [example route file](#example-configuration-file) for usage examples.

The following HTTP codes are available to override:

| Status Code | Meaning | Cause |
| --- | --- | --- |
| [400](https://developer.mozilla.org/docs/Web/HTTP/Status/400) | Bad request |	<ul><li>Invalid invitation link</ul> |
| [401](https://developer.mozilla.org/docs/Web/HTTP/Status/401) | Unauthorized | <ul><li>Request to restricted pages while unauthenticated</ul> |
| [403](https://developer.mozilla.org/docs/Web/HTTP/Status/403) | Forbidden |	<ul><li>User is logged in but doesn't have the roles required to view the page<li>User is logged in but the runtime cannot get the user details from their  identity claims<li>There are too many users logged in to the site with custom roles, therefore the runtime can't let this user login.</ul> |
| [404](https://developer.mozilla.org/docs/Web/HTTP/Status/404) | Not found | <ul><li>File not found</ul> |

## Fallback routes

Single Page Applications often rely on client-side routing. These client-side routing rules update the browser's window location without making requests back to the server. If you refresh the page, or navigate directly to URLs generated by client-side routing rules, a server-side fallback route is required to serve the appropriate HTML page.

Configure your app to use [response overrides](#response-overrides) to implement a fallback route as shown in the following example:

```json
{
  "responseOverrides": {
    "404": {
        "rewrite": "/index.html",
        "statusCode": 200
    },
}
```

This rule allows any file not found on the server to return the _index.html_ file with a status of `200 Success`.

## Example configuration file

```json
{
    "routes": [
        {
            "route": "/profile",
            "allowedRoles": ["authenticated"]
        },
        {
            "route": "/admin/*",
            "allowedRoles": ["administrators"]
        },
        {
            "route": "/images/*",
            "headers": {
                "cache-control": "must-revalidate, max-age=15770000"
            }
        },
        {
            "route": "/api/*",
            "methods": [ "GET" ],
            "allowedRoles": ["registeredusers"]
        },
        {
            "route": "/api/*",
            "methods": [ "PUT", "POST", "PATCH", "DELETE" ],
            "allowedRoles": ["administrators"]
        },
        {
            "route": "/api/*",
            "allowedRoles": ["authenticated"]
        },
        {
            "route": "/customers/contoso",
            "allowedRoles": ["administrators", "customers_contoso"]
        },
        {
            "route": "/login",
            "rewrite": "/.auth/login/github"
        },
        {
            "route": "/.auth/login/twitter",
            "statusCode": 404,
        },
        {
            "route": "/logout",
            "redirect": "/.auth/logout"
        },
        {
            "route": "/calendar/*",
            "rewrite": "/calendar.html"
        },
        {
            "route": "/specials",
            "redirect": "/deals",
            "statusCode": 301
        }
    ],
    "responseOverrides": {
        "404": {
            "rewrite": "/index.html",
            "statusCode": 200
        },
        "401": {
            "statusCode": 302,
            "redirect": "/login"
        },
        "403": {
            "rewrite": "/custom-forbidden-page.html"
        }
    },
    "globalHeaders": {
        "content-security-policy": "default-src https: 'unsafe-eval' 'unsafe-inline'; object-src 'none'"
    },
    "mimeTypes": {
        ".json": "text/json"
    },
}
```

Based on the above configuration, review the following scenarios.

| Requests to... | Results in... |
| --- | --- |
| _/profile_ | Authenticated users are served the _/profile/index.html_ file. Unauthenticated users are redirected to _/login_. |
| _/admin/_ | Authenticated users in the _administrators_ role are served the _/admin/index.html_ file. Authenticated users not in the _administrators_ role are served a 401 error<sup>1</sup>. Unauthenticated users are redirected to _/login_. |
| _/logo.png_ | Serves the image with a custom cache rule where the max age is a little over 182 days (15,770,000 seconds). |
| _/api/admin_ | `GET` requests from authenticated users in the _registeredusers_ role are sent to the API. Authenticated users not in the _registeredusers_ role and unauthenticated users are served a 401 error.<br/><br/>`POST`, `PUT`, `PATCH`, and `DELETE` requests from authenticated users in the _administrators_ role are sent to the API. Authenticated users not in the _administrators_ role and unauthenticated users are served a 401 error. |
| _/customers/contoso_ | Authenticated users who belong to either the _administrators_ or _customers\_contoso_ roles are served the _/customers/contoso/index.html_ file. Authenticated users not in the _administrators_ or _customers\_contoso_ roles are served a 401 error<sup>1</sup>. Unauthenticated users are redirected to _/login_. |
| _/login_ | Unauthenticated users are challenged to authenticate with GitHub. |
| _/.auth/login/twitter_ | As authorization with Twitter is disabled by the route rule, 404 error is returned, which falls back to serving _/index.html_ with a `200` status code. |
| _/logout_ | Users are logged out of any authentication provider. |
| _/calendar/2021/01_ | The browser is served the _/calendar.html_ file. |
| _/specials_ | The browser is permanently redirected to _/deals_. |
| _/unknown-folder_ | The _/index.html_ file is served with a `200` status code. |
| _/data.json_ | The file served with the `text/json` MIME type. |

<sup>1</sup> You can provide a custom error page by using a [response override rule](#response-overrides).

## Restrictions

The following restrictions exist for the _staticwebapps.config.json_ file.

- Max file size is 100 KB
- Max of 50 distinct roles

See the [Quotas article](quotas.md) for general restrictions and limitations.

## Next steps

> [!div class="nextstepaction"]
> [Setup authentication and authorization](authentication-authorization.md)
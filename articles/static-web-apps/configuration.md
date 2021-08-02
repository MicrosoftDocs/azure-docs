---
title: Configure Azure Static Web Apps
description: Learn to configure routes, enforce security rules, and global settings for Azure Static Web Apps.
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic: conceptual
ms.date: 06/17/2021
ms.author: cshoe
---

# Configure Azure Static Web Apps

Configuration for Azure Static Web Apps is defined in the _staticwebapp.config.json_ file, which controls the following settings:

- Routing
- Authentication
- Authorization
- Fallback rules
- HTTP response overrides
- Global HTTP header definitions
- Custom MIME types
- Networking

> [!NOTE]
> [_routes.json_](https://github.com/Azure/static-web-apps/wiki/routes.json-reference-(deprecated)) that was previously used to configure routing is deprecated. Use _staticwebapp.config.json_ as described in this article to configure routing and other settings for your static web app.
> 
> This document is regarding Azure Static Web Apps, which is a standalone product and separate from the [static website hosting](../storage/blobs/storage-blob-static-website.md) feature of Azure Storage.

## File location

The recommended location for the _staticwebapp.config.json_ is in the folder set as the `app_location` in the [workflow file](./github-actions-workflow.md). However, the file may be placed in any subfolder within the folder set as the `app_location`.

See the [example configuration](#example-configuration-file) file for details.

> [!IMPORTANT]
> The deprecated [_routes.json_ file](https://github.com/Azure/static-web-apps/wiki/routes.json-reference-(deprecated)) is ignored if a _staticwebapp.config.json_ exists.

## Routes

Route rules allow you to define the pattern of URLs that allow access to your application to the web. Routes are defined as an array of routing rules. See the [example configuration file](#example-configuration-file) for usage examples.

- Rules are defined in the `routes` array, even if you only have one route.
- Rules are executed in the order as they appear in the `routes` array.
- Rule evaluation stops at the first match - routing rules aren't chained together.
- You have full control over custom role names.
  - There are a few built-in role names which include [`anonymous`](./authentication-authorization.md) and [`authenticated`](./authentication-authorization.md).

The routing concerns significantly overlap with authentication (identifying the user) and authorization (assigning abilities to the user) concepts. Make sure to read the [authentication and authorization](authentication-authorization.md) guide along with this article.

The default file for static content is the _index.html_ file.

## Defining routes

Each rule is composed of a route pattern, along with one or more of the optional rule properties. Route rules are defined in the `routes` array. See the [example configuration file](#example-configuration-file) for usage examples.

| Rule property                       | Required | Default value                        | Comment                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ----------------------------------- | -------- | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `route`                             | Yes      | n/a                                  | The route pattern requested by the caller.<ul><li>[Wildcards](#wildcards) are supported at the end of route paths.<ul><li>For instance, the route _admin/\*_ matches any route under the _admin_ path.</ul></ul>                                                                                                                                                                                                                                                                                                                                                                                                        |
| `rewrite`                           | No       | n/a                                  | Defines the file or path returned from the request.<ul><li>Is mutually exclusive to a `redirect` rule<li>Rewrite rules don't change the browser's location.<li>Values must be relative to the root of the app</ul>                                                                                                                                                                                                                                                                                                                                                                                                      |
| `redirect`                          | No       | n/a                                  | Defines the file or path redirect destination for a request.<ul><li>Is mutually exclusive to a `rewrite` rule.<li>Redirect rules change the browser's location.<li>Default response code is a [`302`](https://developer.mozilla.org/docs/Web/HTTP/Status/302) (temporary redirect), but you can override with a [`301`](https://developer.mozilla.org/docs/Web/HTTP/Status/301) (permanent redirect).</ul>                                                                                                                                                                                                              |
| `allowedRoles`                      | No       | anonymous                            | Defines a list of role names required to access a route. <ul><li>Valid characters include `a-z`, `A-Z`, `0-9`, and `_`.<li>The built-in role, [`anonymous`](./authentication-authorization.md), applies to all unauthenticated users<li>The built-in role, [`authenticated`](./authentication-authorization.md), applies to any logged-in user.<li>Users must belong to at least one role.<li>Roles are matched on an _OR_ basis.<ul><li>If a user is in any of the listed roles, then access is granted.</ul><li>Individual users are associated to roles through [invitations](authentication-authorization.md).</ul> |
| `headers`<a id="route-headers"></a> | No       | n/a                                  | Set of [HTTP headers](https://developer.mozilla.org/docs/Web/HTTP/Headers) added to the response. <ul><li>Route-specific headers override [`globalHeaders`](#global-headers) when the route-specific header is the same as the global header is in the response.<li>To remove a header, set the value to an empty string.</ul>                                                                                                                                                                                                                                                                                          |
| `statusCode`                        | No       | `200`, `301`, or `302` for redirects | The [HTTP status code](https://developer.mozilla.org/docs/Web/HTTP/Status) of the response.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `methods`                           | No       | All methods                          | List of request methods which match a route. Available methods include: `GET`, `HEAD`, `POST`, `PUT`, `DELETE`, `CONNECT`, `OPTIONS`, `TRACE`, and `PATCH`.                                                                                                                                                                                                                                                                                                                                                                                                                                                             |

Each property has a specific purpose in the request/response pipeline.

| Purpose                                        | Properties                                                                                   |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Match routes                                   | `route`, `methods`                                                                           |
| Authorize after a route is matched             | `allowedRoles`                                                                               |
| Process after a rule is matched and authorized | `rewrite` (modifies request) <br><br>`redirect`, `headers`, `statusCode` (modifies response) |

## Securing routes with roles

Routes are secured by adding one or more role names into a rule's `allowedRoles` array. See the [example configuration file](#example-configuration-file) for usage examples.

By default, every user belongs to the built-in `anonymous` role, and all logged-in users are members of the `authenticated` role. Optionally, users are associated to custom roles via [invitations](./authentication-authorization.md).

For instance, to restrict a route to only authenticated users, add the built-in `authenticated` role to the `allowedRoles` array.

```json
{
  "route": "/profile",
  "allowedRoles": ["authenticated"]
}
```

You can create new roles as needed in the `allowedRoles` array. To restrict a route to only administrators, you could define your own role named `administrator`, in the `allowedRoles` array.

```json
{
  "route": "/admin",
  "allowedRoles": ["administrator"]
}
```

- You have full control over role names; there's no list to which your roles must adhere.
- Individual users are associated to roles through [invitations](authentication-authorization.md).

## Wildcards

Wildcard rules match all requests in a route pattern, are only supported at the end of a path, and may be filtered by file extension. See the [example configuration file](#example-configuration-file) for usage examples.

For instance, to implement routes for a calendar application, you can rewrite all URLs that fall under the _calendar_ route to serve a single file.

```json
{
  "route": "/calendar/*",
  "rewrite": "/calendar.html"
}
```

The _calendar.html_ file can then use client-side routing to serve a different view for URL variations like `/calendar/january/1`, `/calendar/2020`, and `/calendar/overview`.

You can filter wildcard matches by file extension. For instance, if you wanted to add a rule that only matches HTML files in a given path you could create the following rule:

```json
{
  "route": "/articles/*.html",
  "headers": {
    "Cache-Control": "public, max-age=604800, immutable"
  }
}
```

To filter on multiple file extensions, you include the options in curly braces, as shown in this example:

```json
{
  "route": "/images/thumbnails/*.{png,jpg,gif}",
  "headers": {
    "Cache-Control": "public, max-age=604800, immutable"
  }
}
```

Common uses cases for wildcard routes include:

- Serving a specific file for an entire path pattern
- Mapping different HTTP methods to an entire path pattern
- Enforcing authentication and authorization rules
- Implement specialized caching rules

## Fallback routes

Single Page Applications often rely on client-side routing. These client-side routing rules update the browser's window location without making requests back to the server. If you refresh the page, or navigate directly to URLs generated by client-side routing rules, a server-side fallback route is required to serve the appropriate HTML page (which is generally the _index.html_ for your client-side app).

You can define a fallback rule by adding a `navigationFallback` section. The following example returns _/index.html_ for all static file requests that do not match a deployed file.

```json
{
  "navigationFallback": {
    "rewrite": "/index.html"
  }
}
```

You can control which requests return the fallback file by defining a filter. In the following example, requests for certain routes in the _/images_ folder and all files in the _/css_ folder are excluded from returning the fallback file.

```json
{
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/images/*.{png,jpg,gif}", "/css/*"]
  }
}
```

The example file structure below, the following outcomes are possible with this rule.

```files
├── images
│   ├── logo.png
│   ├── headshot.jpg
│   └── screenshot.gif
│
├── css
│   └── global.css
│
└── index.html
```

| Requests to...                                         | returns...                                                                                                    | with the status... |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- | ------------------ |
| _/about/_                                              | The _/index.html_ file                                                                                        | `200`              |
| _/images/logo.png_                                     | The image file                                                                                                | `200`              |
| _/images/icon.svg_                                     | The _/index.html_ file - since the _svg_ file extension is not listed in the `/images/*.{png,jpg,gif}` filter | `200`              |
| _/images/unknown.png_                                  | File not found error                                                                                          | `404`              |
| _/css/unknown.css_                                     | File not found error                                                                                          | `404`              |
| _/css/global.css_                                      | The stylesheet file                                                                                           | `200`              |
| Any other file outside the _/images_ or _/css_ folders | The _/index.html_ file                                                                                        | `200`              |

> [!IMPORTANT]
> If you are migrating from the deprecated [_routes.json_](https://github.com/Azure/static-web-apps/wiki/routes.json-reference-(deprecated)) file, do not include the legacy fallback route (`"route": "/*"`) in the [routing rules](#routes).

## Global headers

The `globalHeaders` section provides a set of [HTTP headers](https://developer.mozilla.org/docs/Web/HTTP/Headers) applied to each response, unless overridden by a [route header](#route-headers) rule, otherwise the union of both the headers from the route and the global headers is returned.

See the [example configuration file](#example-configuration-file) for usage examples.

To remove a header, set the value to an empty string (`""`).

Some common use cases for global headers include:

- Custom caching rules
- Enforcing security policies
- Encoding settings

## Response overrides

The `responseOverrides` section provides an opportunity to define a custom response when the server would otherwise return an error code. See the [example configuration file](#example-configuration-file) for usage examples.

The following HTTP codes are available to override:

| Status Code                                                   | Meaning      | Possible cause                                                                                                                                                                                                                                                                                     |
| ------------------------------------------------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [400](https://developer.mozilla.org/docs/Web/HTTP/Status/400) | Bad request  | Invalid invitation link                                                                                                                                                                                                                                                                            |
| [401](https://developer.mozilla.org/docs/Web/HTTP/Status/401) | Unauthorized | Request to restricted pages while unauthenticated                                                                                                                                                                                                                                                  |
| [403](https://developer.mozilla.org/docs/Web/HTTP/Status/403) | Forbidden    | <ul><li>User is logged in but doesn't have the roles required to view the page.<li>User is logged in but the runtime cannot get the user details from their identity claims.<li>There are too many users logged in to the site with custom roles, therefore the runtime can't login the user.</ul> |
| [404](https://developer.mozilla.org/docs/Web/HTTP/Status/404) | Not found    | File not found                                                                                                                                                                                                                                                                                     |

The following example configuration demonstrates how to override an error code.

```json
{
  "responseOverrides": {
    "400": {
      "rewrite": "/invalid-invitation-error.html",
      "statusCode": 200
    },
    "401": {
      "statusCode": 302,
      "redirect": "/login"
    },
    "403": {
      "rewrite": "/custom-forbidden-page.html",
      "statusCode": 200
    },
    "404": {
      "rewrite": "/custom-404.html",
      "statusCode": 200
    }
  }
}
```

## Networking

The `networking` section controls the network configuration of your static web app. To restrict access to your app, specify a list of allowed IP address blocks in `allowedIpRanges`.

> [!NOTE]
> Networking configuration is only available in the Azure Static Web Apps Standard plan.

Define each IPv4 address block in Classless Inter-Domain Routing (CIDR) notation. To learn more about CIDR notation, see [Classless Inter-Domain Routing](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing). Each IPv4 address block can denote either a public or private address space. If you only want to allow access from a single IP Address you can use the `/32` CIDR block.

```json
{
  "networking": {
    "allowedIpRanges": [
      "10.0.0.0/24",
      "100.0.0.0/32",
      "192.168.100.0/22"
    ]
  }
}
```

When one or more IP address blocks are specified, requests originating from IP addresses that do not match a value in `allowedIpRanges` are denied access.

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
      "allowedRoles": ["administrator"]
    },
    {
      "route": "/images/*",
      "headers": {
        "cache-control": "must-revalidate, max-age=15770000"
      }
    },
    {
      "route": "/api/*",
      "methods": ["GET"],
      "allowedRoles": ["registeredusers"]
    },
    {
      "route": "/api/*",
      "methods": ["PUT", "POST", "PATCH", "DELETE"],
      "allowedRoles": ["administrator"]
    },
    {
      "route": "/api/*",
      "allowedRoles": ["authenticated"]
    },
    {
      "route": "/customers/contoso",
      "allowedRoles": ["administrator", "customers_contoso"]
    },
    {
      "route": "/login",
      "rewrite": "/.auth/login/github"
    },
    {
      "route": "/.auth/login/twitter",
      "statusCode": 404
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
  "navigationFallback": {
    "rewrite": "index.html",
    "exclude": ["/images/*.{png,jpg,gif}", "/css/*"]
  },
  "responseOverrides": {
    "400": {
      "rewrite": "/invalid-invitation-error.html"
    },
    "401": {
      "redirect": "/login",
      "statusCode": 302
    },
    "403": {
      "rewrite": "/custom-forbidden-page.html"
    },
    "404": {
      "rewrite": "/404.html"
    }
  },
  "globalHeaders": {
    "content-security-policy": "default-src https: 'unsafe-eval' 'unsafe-inline'; object-src 'none'"
  },
  "mimeTypes": {
    ".json": "text/json"
  }
}
```

Based on the above configuration, review the following scenarios.

| Requests to...                                                    | results in...                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _/profile_                                                        | Authenticated users are served the _/profile/index.html_ file. Unauthenticated users are redirected to _/login_.                                                                                                                                                                                                                                                                                                                              |
| _/admin/_                                                         | Authenticated users in the _administrator_ role are served the _/admin/index.html_ file. Authenticated users not in the _administrator_ role are served a `403` error<sup>1</sup>. Unauthenticated users are redirected to _/login_.                                                                                                                                                                                                          |
| _/logo.png_                                                       | Serves the image with a custom cache rule where the max age is a little over 182 days (15,770,000 seconds).                                                                                                                                                                                                                                                                                                                                   |
| _/api/admin_                                                      | `GET` requests from authenticated users in the _registeredusers_ role are sent to the API. Authenticated users not in the _registeredusers_ role and unauthenticated users are served a `401` error.<br/><br/>`POST`, `PUT`, `PATCH`, and `DELETE` requests from authenticated users in the _administrator_ role are sent to the API. Authenticated users not in the _administrator_ role and unauthenticated users are served a `401` error. |
| _/customers/contoso_                                              | Authenticated users who belong to either the _administrator_ or _customers_contoso_ roles are served the _/customers/contoso/index.html_ file. Authenticated users not in the _administrator_ or _customers_contoso_ roles are served a `403` error<sup>1</sup>. Unauthenticated users are redirected to _/login_.                                                                                                                            |
| _/login_                                                          | Unauthenticated users are challenged to authenticate with GitHub.                                                                                                                                                                                                                                                                                                                                                                             |
| _/.auth/login/twitter_                                            | As authorization with Twitter is disabled by the route rule, `404` error is returned, which falls back to serving _/index.html_ with a `200` status code.                                                                                                                                                                                                                                                                                     |
| _/logout_                                                         | Users are logged out of any authentication provider.                                                                                                                                                                                                                                                                                                                                                                                          |
| _/calendar/2021/01_                                               | The browser is served the _/calendar.html_ file.                                                                                                                                                                                                                                                                                                                                                                                              |
| _/specials_                                                       | The browser is permanently redirected to _/deals_.                                                                                                                                                                                                                                                                                                                                                                                            |
| _/data.json_                                                      | The file served with the `text/json` MIME type.                                                                                                                                                                                                                                                                                                                                                                                               |
| _/about_, or any folder that matches client side routing patterns | The _/index.html_ file is served with a `200` status code.                                                                                                                                                                                                                                                                                                                                                                                    |
| An non-existent file in the _/images/_ folder                     | A `404` error.                                                                                                                                                                                                                                                                                                                                                                                                                                |

<sup>1</sup> You can provide a custom error page by using a [response override rule](#response-overrides).

## Restrictions

The following restrictions exist for the _staticwebapp.config.json_ file.

- Max file size is 100 KB
- Max of 50 distinct roles

See the [Quotas article](quotas.md) for general restrictions and limitations.

## Next steps

> [!div class="nextstepaction"]
> [Setup authentication and authorization](authentication-authorization.md)

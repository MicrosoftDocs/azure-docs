---
title: Configure Azure Static Web Apps
description: Learn how to configure routes and enforce security rules and global settings for Azure Static Web Apps.
services: static-web-apps
ms.custom: engagement-fy23
author: craigshoemaker
ms.service: static-web-apps
ms.topic: conceptual
ms.date: 01/10/2023
ms.author: cshoe
---

# Configure Azure Static Web Apps

You can define configuration for Azure Static Web Apps in the _staticwebapp.config.json_ file, which controls the following settings:

- [Routing](#routes)
- [Authentication](#authentication)
- [Authorization](#routes)
- [Fallback rules](#fallback-routes)
- [HTTP response overrides](#response-overrides)
- [Global HTTP header definitions](#global-headers)
- [Custom MIME types](#example-configuration-file)
- [Networking](#networking)

> [!NOTE]
> [_routes.json_](https://github.com/Azure/static-web-apps/wiki/routes.json-reference-(deprecated)) that was previously used to configure routing is deprecated. Use _staticwebapp.config.json_ as described in this article to configure routing and other settings for your static web app.
> 
> This document is regarding Azure Static Web Apps, which is a standalone product and separate from the [static website hosting](../storage/blobs/storage-blob-static-website.md) feature of Azure Storage.

## File location

The recommended location for the _staticwebapp.config.json_ is in the folder set as the `app_location` in the [workflow file](./build-configuration.md). However, the file may be placed in any subfolder within the folder set as the `app_location`. Additionally, if there is a build step, you must ensure that the build step outputs the file to the root of the output_location.

See the [example configuration](#example-configuration-file) file for details.

> [!IMPORTANT]
> The deprecated [_routes.json_ file](https://github.com/Azure/static-web-apps/wiki/routes.json-reference-(deprecated)) is ignored if a _staticwebapp.config.json_ exists.

## Routes

You can define rules for one or more routes in your static web app. Route rules allow you to restrict access to users in specific roles or perform actions such as redirect or rewrite. Routes are defined as an array of routing rules. See the [example configuration file](#example-configuration-file) for usage examples.

- Rules are defined in the `routes` array, even if you only have one route.
- Rules are evaluated in the order as they appear in the `routes` array.
- Rule evaluation stops at the first match. A match occurs when the `route` property and a value in the `methods` array (if specified) match the request. Each request can match at most one rule.

The routing concerns significantly overlap with authentication (identifying the user) and authorization (assigning abilities to the user) concepts. Make sure to read the [authentication and authorization](authentication-authorization.md) guide along with this article.

### Define routes

Each rule is composed of a route pattern, along with one or more of the optional rule properties. Route rules are defined in the `routes` array. See the [example configuration file](#example-configuration-file) for usage examples.

> [!IMPORTANT]
> Only the `route` and `methods` (if specified) properties are used to determine whether a rule matches a request.

| Rule property | Required | Default value | Comment |
|--|--|--|--|
| `route` | Yes | n/a | The route pattern requested by the caller.<ul><li>[Wildcards](#wildcards) are supported at the end of route paths.<ul><li>For instance, the route _/admin\*_ matches any route beginning with _/admin_.</ul></ul> |
| `methods` | No | All methods | Defines an array of request methods that match a route. Available methods include: `GET`, `HEAD`, `POST`, `PUT`, `DELETE`, `CONNECT`, `OPTIONS`, `TRACE`, and `PATCH`. |
| `rewrite` | No | n/a | Defines the file or path returned from the request.<ul><li>Is mutually exclusive to a `redirect` rule.<li>Rewrite rules don't change the browser's location.<li>Values must be relative to the root of the app.</ul> |
| `redirect` | No | n/a | Defines the file or path redirect destination for a request.<ul><li>Is mutually exclusive to a `rewrite` rule.<li>Redirect rules change the browser's location.<li>Default response code is a [`302`](https://developer.mozilla.org/docs/Web/HTTP/Status/302) (temporary redirect), but you can override with a [`301`](https://developer.mozilla.org/docs/Web/HTTP/Status/301) (permanent redirect).</ul> |
| `statusCode` | No | `301` or `302` for redirects | The [HTTP status code](https://developer.mozilla.org/docs/Web/HTTP/Status) of the response. |
| `headers`<a id="route-headers"></a> | No | n/a | Set of [HTTP headers](https://developer.mozilla.org/docs/Web/HTTP/Headers) added to the response. <ul><li>Route-specific headers override [`globalHeaders`](#global-headers) when the route-specific header is the same as the global header is in the response.<li>To remove a header, set the value to an empty string.</ul> |
| `allowedRoles` | No | anonymous | Defines an array of role names required to access a route. <ul><li>Valid characters include `a-z`, `A-Z`, `0-9`, and `_`.<li>The built-in role, [`anonymous`](./authentication-authorization.md), applies to all users.<li>The built-in role, [`authenticated`](./authentication-authorization.md), applies to any logged-in user.<li>Users must belong to at least one role.<li>Roles are matched on an _OR_ basis.<ul><li>If a user is in any of the listed roles, then access is granted.</ul><li>Individual users are associated to roles through [invitations](authentication-authorization.md).</ul> |

Each property has a specific purpose in the request/response pipeline.

| Purpose | Properties |
|--|--|
| Match routes | `route`, `methods` |
| Process after a rule is matched and authorized | `rewrite` (modifies request) <br><br>`redirect`, `headers`, `statusCode` (modifies response) |
| Authorize after a route is matched | `allowedRoles` |

### Specify route patterns

The `route` property can be an exact route or a wildcard pattern.

#### Exact route

To define an exact route, place the full path of the file in the `route` property.

```json
{
  "route": "/profile/index.html",
  "allowedRoles": ["authenticated"]
}
```

This rule matches requests for the file _/profile/index.html_. Because _index.html_ is the default file, the rule also matches requests for the folder (_/profile_ or _/profile/_).

> [!IMPORTANT]
> If you use a folder path (`/profile` or `/profile/`) in the `route` property, it won't match requests for the file _/profile/index.html_. When protecting a route that serves a file, always use the full path of the file such as `/profile/index.html`.

#### <a name="wildcards"></a>Wildcard pattern

Wildcard rules match all requests in a route pattern, are only supported at the end of a path, and may be filtered by file extension. See the [example configuration file](#example-configuration-file) for usage examples.

For instance, to implement routes for a calendar application, you can rewrite all URLs that fall under the _calendar_ route to serve a single file.

```json
{
  "route": "/calendar*",
  "rewrite": "/calendar.html"
}
```

The _calendar.html_ file can then use client-side routing to serve a different view for URL variations like `/calendar/january/1`, `/calendar/2020`, and `/calendar/overview`.

> [!NOTE]
> A route pattern of `/calendar/*` matches all requests under the _/calendar/_ path. However, it won't match requests for the paths _/calendar_ or _/calendar.html_. Use `/calendar*` to match all requests that begin with _/calendar_.

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
- Enforcing authentication and authorization rules
- Implementing specialized caching rules

### <a name="securing-routes-with-roles"></a>Secure routes with roles

Routes are secured by adding one or more role names into a rule's `allowedRoles` array. See the [example configuration file](#example-configuration-file) for usage examples.

> [!IMPORTANT]
> Routing rules can only secure HTTP requests to routes that are served from Static Web Apps. Many front-end frameworks use client-side routing that modifies routes in the browser without issuing requests to Static Web Apps. Routing rules don't secure client-side routes. Clients should call [HTTP APIs](apis-overview.md) to retrieve sensitive data. Ensure APIs validate a [user's identity](user-information.md) before returning data.

By default, every user belongs to the built-in `anonymous` role, and all logged-in users are members of the `authenticated` role. Optionally, users are associated to custom roles via [invitations](./authentication-authorization.md).

For instance, to restrict a route to only authenticated users, add the built-in `authenticated` role to the `allowedRoles` array.

```json
{
  "route": "/profile*",
  "allowedRoles": ["authenticated"]
}
```

You can create new roles as needed in the `allowedRoles` array. To restrict a route to only administrators, you could define your own role named `administrator`, in the `allowedRoles` array.

```json
{
  "route": "/admin*",
  "allowedRoles": ["administrator"]
}
```

- You have full control over role names; there's no list to which your roles must adhere.
- Individual users are associated to roles through [invitations](authentication-authorization.md).

> [!IMPORTANT]
> When securing content, specify exact files when possible. If you have many files to secure, use wildcards after a shared prefix. For example: `/profile*` secures all possible routes that start with _/profile_, including _/profile_.

#### Restrict access to entire application

It's common to require authentication for every route in an application. To enable this, add a rule that matches all routes and include the built-in `authenticated` role in the `allowedRoles` array.

The following example configuration blocks anonymous access and redirects all unauthenticated users to the Microsoft Entra sign-in page.

```json
{
  "routes": [
    {
      "route": "/*",
      "allowedRoles": ["authenticated"]
    }
  ],
  "responseOverrides": {
    "401": {
      "statusCode": 302,
      "redirect": "/.auth/login/aad"
    }
  }
}
```

> [!NOTE]
> By default, all pre-configured identity providers are enabled. To block an authentication provider, see [Authentication and authorization](authentication-authorization.md#block-an-authentication-provider).

## Fallback routes

Single Page Applications often rely on client-side routing. These client-side routing rules update the browser's window location without making requests back to the server. If you refresh the page, or go directly to URLs generated by client-side routing rules, a server-side fallback route is required to serve the appropriate HTML page, which is generally the _index.html_ for your client-side app.

You can define a fallback rule by adding a `navigationFallback` section. The following example returns _/index.html_ for all static file requests that don't match a deployed file.

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

For example, with the directory structure below, the above navigation fallback rule would result in the outcomes detailed in the table below.

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

| Requests to... | returns... | with the status... |
|--|--|--|
| _/about/_ | The _/index.html_ file | `200` |
| _/images/logo.png_ | The image file | `200` |
| _/images/icon.svg_ | The _/index.html_ file - since the _svg_ file extension isn't listed in the `/images/*.{png,jpg,gif}` filter | `200` |
| _/images/unknown.png_ | File not found error | `404` |
| _/css/unknown.css_ | File not found error | `404` |
| _/css/global.css_ | The stylesheet file | `200` |
| Any other file outside the _/images_ or _/css_ folders | The _/index.html_ file | `200` |

> [!IMPORTANT]
> If you are migrating from the deprecated [_routes.json_](https://github.com/Azure/static-web-apps/wiki/routes.json-reference-(deprecated)) file, do not include the legacy fallback route (`"route": "/*"`) in the [routing rules](#routes).

## Global headers

The `globalHeaders` section provides a set of HTTP headers applied to each response, unless overridden by a [route header](#route-headers) rule, otherwise the union of both the headers from the route and the global headers is returned.

See the [example configuration file](#example-configuration-file) for usage examples.

To remove a header, set the value to an empty string (`""`).

Some common use cases for global headers include:

- Custom caching rules
- Enforcing security policies
- Encoding settings
- Configuring cross-origin resource sharing ([CORS](https://developer.mozilla.org/docs/Web/HTTP/CORS))

The following example implements a custom CORS configuration.

```json
{
  "globalHeaders": {
    "Access-Control-Allow-Origin": "https://example.com",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS"
  }
}
```

> [!NOTE]
> Global headers do not affect API responses. Headers in API responses are preserved and returned to the client.

## Response overrides

The `responseOverrides` section provides an opportunity to define a custom response when the server would otherwise return an error code. See the [example configuration file](#example-configuration-file) for usage examples.

The following HTTP codes are available to override:

| Status Code | Meaning | Possible cause |
|--|--|--|
| [400](https://developer.mozilla.org/docs/Web/HTTP/Status/400) | Bad request | Invalid invitation link |
| [401](https://developer.mozilla.org/docs/Web/HTTP/Status/401) | Unauthorized | Request to restricted pages while unauthenticated |
| [403](https://developer.mozilla.org/docs/Web/HTTP/Status/403) | Forbidden | <ul><li>User is logged in but doesn't have the roles required to view the page.<li>User is logged in but the runtime can't get the user details from their identity claims.<li>There are too many users logged in to the site with custom roles, therefore the runtime can't sign in the user.</ul> |
| [404](https://developer.mozilla.org/docs/Web/HTTP/Status/404) | Not found | File not found |

The following example configuration demonstrates how to override an error code.

```json
{
  "responseOverrides": {
    "400": {
      "rewrite": "/invalid-invitation-error.html"
    },
    "401": {
      "statusCode": 302,
      "redirect": "/login"
    },
    "403": {
      "rewrite": "/custom-forbidden-page.html"
    },
    "404": {
      "rewrite": "/custom-404.html"
    }
  }
}
```

## Platform

The `platform` section controls platform specific settings, such as the API language runtime version.

### Select the API language runtime version

[!INCLUDE [Languages and runtimes](../../includes/static-web-apps-languages-runtimes.md)]

## Networking

The `networking` section controls the network configuration of your static web app. To restrict access to your app, specify a list of allowed IP address blocks in `allowedIpRanges`. For more information about the number of allowed IP address blocks, see [Quotas in Azure Static Web Apps](../static-web-apps/quotas.md). 

> [!NOTE]
> Networking configuration is only available in the Azure Static Web Apps Standard plan.

Define each IPv4 address block in Classless Inter-Domain Routing (CIDR) notation. To learn more about CIDR notation, see [Classless Inter-Domain Routing](https://en.wikipedia.org/wiki/Classless_Inter-Domain_Routing). Each IPv4 address block can denote either a public or private address space. If you only want to allow access from a single IP Address, you can use the `/32` CIDR block.

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

When one or more IP address blocks are specified, requests originating from IP addresses that don't match a value in `allowedIpRanges` are denied access.

In addition to IP address blocks, you can also specify [service tags](../virtual-network/service-tags-overview.md#discover-service-tags-by-using-downloadable-json-files) in the `allowedIpRanges` array to restrict traffic to certain Azure services.

```json
"networking": {
  "allowedIpRanges": ["AzureFrontDoor.Backend"]
}
```

## Authentication

* [Default authentication providers](authentication-authorization.md#set-up-sign-in), don't require settings in the configuration file. 
* [Custom authentication providers](authentication-custom.md) use the `auth` section of the settings file.

For details on how to restrict routes to authenticated users, see [Securing routes with roles](#securing-routes-with-roles).

### Disable cache for authenticated paths

If you set up [manual integration with Azure Front Door](front-door-manual.md), you may want to disable caching for your secured routes. With [enterprise-grade edge](enterprise-edge.md) enabled, this is already configured for you.

To disable Azure Front Door caching for secured routes, add `"Cache-Control": "no-store"` to the route header definition.

For example:

```json
{
    "route": "/members",
    "allowedRoles": ["authenticated, members"],
    "headers": {
        "Cache-Control": "no-store"
    }
}
```

## Forwarding gateway

The `forwardingGateway` section configures how a static web app is accessed from a forwarding gateway such as a CDN or Azure Front Door.

> [!NOTE]
> Forwarding gateway configuration is only available in the Azure Static Web Apps Standard plan.

### Allowed Forwarded Hosts
  
The `allowedForwardedHosts` list specifies which hostnames to accept in the [X-Forwarded-Host](https://developer.mozilla.org/docs/Web/HTTP/Headers/X-Forwarded-Host) header. If a matching domain is in the list, Static Web Apps uses the `X-Forwarded-Host` value when constructing redirect URLs, such as after a successful sign-in.

For Static Web Apps to function correctly behind a forwarding gateway, the request from the gateway must include the correct hostname in the `X-Forwarded-Host` header and the same hostname must be listed in `allowedForwardedHosts`.

```json
"forwardingGateway": {
  "allowedForwardedHosts": [
    "example.org",
    "www.example.org",
    "staging.example.org"
  ]
}
```

If the `X-Forwarded-Host` header doesn't match a value in the list, the requests still succeed, but the header isn't used in the response.

### Required headers

Required headers are HTTP headers that must be sent with each request to your site. One use of required headers is to deny access to a site unless all of the required headers are present in each request.

For example, the following configuration shows how you can add a unique identifier for [Azure Front Door](../frontdoor/front-door-overview.md) that limits access to your site from a specific Azure Front Door instance. See the [Configure Azure Front Door tutorial](front-door-manual.md) for full details.

```json
"forwardingGateway": {
  "requiredHeaders": {
    "X-Azure-FDID" : "692a448c-2b5d-4e4d-9fcc-2bc4a6e2335f"
  }
}
```

- Key/value pairs can be any set of arbitrary strings
- Keys are case insensitive
- Values are case-sensitive

## Trailing slash

A trailing slash is the `/` at the end of a URL. Conventionally, trailing slash URL refers to a directory on the web server, while a non-trailing slash indicates a file. 

Search engines treat the two URLs separately, regardless of whether it's a file or a directory. When the same content is rendered at both of these URLs, your website serves duplicate content, which can negatively affect search engine optimization (SEO). When explicitly configured, Static Web Apps applies a set of URL normalization and redirect rules that help improve your website’s performance and SEO. 

The following normalization and redirect rules apply for each of the available configurations:

### Always 

When you're setting `trailingSlash` to `always`, all requests that don't include a trailing slash are redirected to a trailing slash URL. For example, `/contact` is redirected to `/contact/`.

```json
"trailingSlash": "always"
```

| Requests to... | returns... | with the status... | and path... |
|--|--|--|--|
| _/about_ | The _/about/index.html_ file | `301` | _/about/_ |
| _/about/_ | The _/about/index.html_ file | `200` | _/about/_ |
| _/about/index.html_ | The _/about/index.html_ file | `301` | _/about/_ |
| _/contact_ | The _/contact.html_ file | `301` | _/contact/_ |
| _/contact/_ | The _/contact.html_ file | `200` | _/contact/_ |
| _/contact.html_ | The _/contact.html_ file | `301` | _/contact/_ |

### Never

When setting `trailingSlash` to `never`, all requests ending in a trailing slash are redirected to a non-trailing slash URL. For example, `/contact/` is redirected to `/contact`.

```json
"trailingSlash": "never"
```

| Requests to... | returns... | with the status... | and path... |
|--|--|--|--|
| _/about_ | The _/about/index.html_ file | `200` | _/about_ |
| _/about/_ | The _/about/index.html_ file | `301` | _/about_ |
| _/about/index.html_ | The _/about/index.html_ file | `301` | _/about_ |
| _/contact_ | The _/contact.html_ file | `200` | _/contact_ |
| _/contact/_ | The _/contact.html_ file | `301` | _/contact_ |
| _/contact.html_ | The _/contact.html_ file | `301` | _/contact_ |

### Auto

When you set `trailingSlash` to `auto`, all requests to folders are redirected to a URL with a trailing slash. All requests to files are redirected to a non-trailing slash URL.

```json
"trailingSlash": "auto"
```

| Requests to... | returns... | with the status... | and path... |
|--|--|--|--|
| _/about_ | The _/about/index.html_ file | `301` | _/about/_ |
| _/about/_ | The _/about/index.html_ file | `200` | _/about/_ |
| _/about/index.html_ | The _/about/index.html_ file | `301` | _/about/_ |
| _/contact_ | The _/contact.html_ file | `200` | _/contact_ |
| _/contact/_ | The _/contact.html_ file | `301` | _/contact_ |
| _/contact.html_ | The _/contact.html_ file | `301` | _/contact_ |

For optimal website performance, configure a trailing slash strategy using one of the `always`, `never` or `auto` modes.

By default, when the `trailingSlash` configuration is omitted, Static Web Apps applies the following rules: 

| Requests to... | returns... | with the status... | and path... |
|--|--|--|--|
| _/about_ | The _/about/index.html_ file | `200` | _/about_ |
| _/about/_ | The _/about/index.html_ file | `200` | _/about/_ |
| _/about/index.html_ | The _/about/index.html_ file | `200` | _/about/index.html_ |
| _/contact_ | The _/contact.html_ file | `200` | _/contact_ |
| _/contact/_ | The _/contact.html_ file | `301` | _/contact_ |
| _/contact.html_ | The _/contact.html_ file | `200` | _/contact.html_ |


## Example configuration file

```json
{
  "trailingSlash": "auto",
  "routes": [
    {
      "route": "/profile*",
      "allowedRoles": ["authenticated"]
    },
    {
      "route": "/admin/index.html",
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
      "route": "/customers/contoso*",
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
      "route": "/calendar*",
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

| Requests to... | results in... |
|--|--|
| _/profile_ | Authenticated users are served the _/profile/index.html_ file. Unauthenticated users are redirected to _/login_ by the `401` response override rule. |
| _/admin_, _/admin/_, or _/admin/index.html_ | Authenticated users in the _administrator_ role are served the _/admin/index.html_ file. Authenticated users not in the _administrator_ role are served a `403` error<sup>1</sup>. Unauthenticated users are redirected to _/login_ |
| _/images/logo.png_ | Serves the image with a custom cache rule where the max age is a little over 182 days (15,770,000 seconds). |
| _/api/admin_ | `GET` requests from authenticated users in the _registeredusers_ role are sent to the API. Authenticated users not in the _registeredusers_ role and unauthenticated users are served a `401` error.<br/><br/>`POST`, `PUT`, `PATCH`, and `DELETE` requests from authenticated users in the _administrator_ role are sent to the API. Authenticated users not in the _administrator_ role and unauthenticated users are served a `401` error. |
| _/customers/contoso_ | Authenticated users who belong to either the _administrator_ or _customers_contoso_ roles are served the _/customers/contoso/index.html_ file. Authenticated users not in the _administrator_ or _customers_contoso_ roles are served a `403` error<sup>1</sup>. Unauthenticated users are redirected to _/login_. |
| _/login_ | Unauthenticated users are challenged to authenticate with GitHub. |
| _/.auth/login/twitter_ | As authorization with Twitter is disabled by the route rule, `404` error is returned, which falls back to serving _/index.html_ with a `200` status code. |
| _/logout_ | Users are logged out of any authentication provider. |
| _/calendar/2021/01_ | The browser is served the _/calendar.html_ file. |
| _/specials_ | The browser is permanently redirected to _/deals_. |
| _/data.json_ | The file served with the `text/json` MIME type. |
| _/about_, or any folder that matches client side routing patterns | The _/index.html_ file is served with a `200` status code. |
| An non-existent file in the _/images/_ folder | A `404` error. |

<sup>1</sup> You can provide a custom error page by using a [response override rule](#response-overrides).

## Restrictions

The following restrictions exist for the _staticwebapp.config.json_ file.

- Max file size is 20 KB
- Max of 50 distinct roles

See the [Quotas article](quotas.md) for general restrictions and limitations.

## Next steps

> [!div class="nextstepaction"]
> [Set up authentication and authorization](authentication-authorization.md)

## Related articles

- [Set application-level settings and environment variables that can be used by backend APIs](application-settings.md)
- [Define settings that control the build process](./build-configuration.md)

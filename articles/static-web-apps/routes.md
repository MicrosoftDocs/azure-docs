---
title: Routes in Azure Static Web Apps
description: Learn about back-end routing rules and how to secure routes with roles.
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  conceptual
ms.date: 05/08/2020
ms.author: cshoe
---

# Routes in Azure Static Web Apps Preview

Routing in Azure Static Web Apps defines back-end routing rules and authorization behavior for both static content and APIs<sup>1</sup>. The rules are defined as an array of rules in the _routes.json_ file.

- The _routes.json_ file must exist at the root of app's build artifact folder.
- Rules are executed in the order as they appear in the `routes` array.
- Rule evaluation stops at the first match. Routing rules are not chained together.
- Roles are defined in the _routes.json_ file and users are associated to roles via [invitations](authentication-authorization.md).
- You have full control over role names.

The topic of routing significantly overlaps with authentication and authorization concepts. Make sure to read the [authentication and authorization](authentication-authorization.md) guide along with this article.

## Location

The _routes.json_ file must exist at the root of app's build artifact folder. If your web app includes a build step that copies built files from a specific folder to your build artifact folder, then the _routes.json_ file needs to exist in that specific folder.

The following table lists the appropriate location to put your _routes.json_ file for a number of front-end JavaScript frameworks and libraries.

|Framework / library | Location  |
|---------|----------|
| Angular | _assets_   |
| React   | _public_  |
| Svelte  | _public_   |
| Vue     | _public_ |

## Defining routes

Routes are defined in the _routes.json_ file as an array of route rules on the `routes` property. Each rule is composed of a route pattern, along with one or more of the optional rule properties. See the [example route file](#example-route-file) for usage examples.

| Rule property  | Required | Default value | Comment                                                      |
| -------------- | -------- | ------------- | ------------------------------------------------------------ |
| `route`        | Yes      | n/a          | The route pattern requested by the caller.<ul><li>[Wildcards](#wildcards) are supported at the end of route paths. For instance, the route _admin/\*_ matches any route under the _admin_ path.<li>A route's default file is _index.html_.</ul>|
| `serve`        | No       | n/a          | Defines the file or path returned from the request. The file path and name can be different from the requested path. If a `serve` value is defined, then the requested path is used. Querystring parameters are not supported; `serve` values must point to actual files.  |
| `allowedRoles` | No       | anonymous     | An array of role names. <ul><li>Valid characters include `a-z`, `A-Z`, `0-9`, and `_`.<li>The built-in role `anonymous` applies to all unauthenticated users.<li>The built-in role `authenticated` applies to any logged-in user.<li>Users must belong to at least one role.<li>Roles are matched on an _OR_ basis. If a user is in any of the listed roles, then access is granted.<li>Individual users are associated to roles by through [invitations](authentication-authorization.md).</ul> |
| `statusCode`   | No       | 200           | The [HTTP status code](https://wikipedia.org/wiki/List_of_HTTP_status_codes) response for the request. |

## Securing routes with roles

Routes are secured by adding one or more role names into a rule's `allowedRoles` array. See the [example route file](#example-route-file) for usage examples.

By default, every user belongs to the built-in `anonymous` role, and all logged-in users are members of the `authenticated` role. For instance, to restrict a route to only authenticated users, add the built-in `authenticated` role to the `allowedRoles` array.

```json
{
  "route": "/profile",
  "allowedRoles": ["authenticated"]
}
```

You can create new roles as needed in the `allowedRoles` array. To restrict a route to only administrators, you could define an `administrator` role in the `allowedRoles` array.

```json
{
  "route": "/admin",
  "allowedRoles": ["administrator"]
}
```

- You have full control over role names; there's no master list to which your roles must adhere.
- Individual users are associated to roles through [invitations](authentication-authorization.md).

## Wildcards

Wildcard rules match all requests under a given route pattern. If you define a `serve` value in your rule, the named file or path is served as the response.

For instance, to implement routes for a calendar application, you can map all URLs that fall under the _calendar_ route to serve a single file.

```json
{
  "route": "/calendar/*",
  "serve": "/calendar.html"
}
```

The _calendar.html_ file can then use client-side routing to serve a different view for URL variations like `/calendar/january/1`, `/calendar/2020`, and `/calendar/overview`.

You can also secure routes with wildcards. In the following example, any file requested under the _admin_ path requires an authenticated user who is a member of the _administrator_ role.

```json
{
  "route": "/admin/*",
  "allowedRoles": ["administrator"]
}
```

> [!NOTE]
> Requests for files referenced by a served file are only evaluated for authentication checks. For instance, requests to a CSS file under a wildcard path serve the CSS file, and not what is defined as the `serve` file. The CSS file is served as long as the user meets the required authentication requirements.

## Fallback routes

Front-end JavaScript frameworks or libraries often rely on client-side routing for web app navigation. These client-side routing rules update the browser's window location without making requests back to the server. If you refresh the page, or navigate directly to locations generated by client-side routing rules, a server-side fallback route is required to serve the appropriate HTML page.

A common fallback route is shown in the following example:

```json
{
  "routes": [
    {
      "route": "/*",
      "serve": "/index.html",
      "statusCode": 200
    }
  ]
}
```

The fallback route must be listed last in your routing rules, as it catches all requests not caught by previously defined rules.

## Redirects

You can use [301](https://en.wikipedia.org/wiki/HTTP_301) and [302](https://en.wikipedia.org/wiki/HTTP_302) HTTP status codes to redirect requests from one route to another.

For instance, the following rule creates a 301 redirect from _old-page.html_ to _new-page.html_.

```json
{
  "route": "/old-page.html",
  "serve": "/new-page.html",
  "statusCode": 301
}
```

Redirects also work with paths that don't define distinct files.

```json
{
  "route": "/about-us",
  "serve": "/about",
  "statusCode": 301
}
```

## Custom error pages

Users may encounter a number of different situations that may result in an error. Using the `platformErrorOverrides` array, you can provide a custom experience in response to these errors. Refer to the [example route file](#example-route-file) for placement of the array in the _routes.json_ file.

> [!NOTE]
> Once a request makes it to the platform overrides level, route rules not revaluated.

The following table lists the available platform error overrides:

| Error type  | HTTP status code | Description |
|---------|---------|---------|
| `NotFound` | 404  | A page is not found on the server. |
| `Unauthenticated` | 401 | The user is not logged in with an [authentication provider](authentication-authorization.md). |
| `Unauthorized_InsufficientUserInformation` | 401 | The user's account on the authentication provider is not configured to expose required data. This error may happen in situations like when the app asks the authentication provider for the user's email address, but the user chose to restrict access to the email address. |
| `Unauthorized_InvalidInvitationLink` | 401 | An invitation has either expired, or the user followed an invitation link generated for another recipient.  |
| `Unauthorized_MissingRoles` | 401 | The user is not a member of a required role. |
| `Unauthorized_TooManyUsers` | 401 | The site has reached the maximum number of users, and the server is limiting further additions. This error is exposed to the client because there's no limit to the number of [invitations](authentication-authorization.md) you can generate, and some users may never accept their invitation.|
| `Unauthorized_Unknown` | 401 | There is an unknown problem while trying to authenticate the user. One cause for this error may be that the user isn't recognized because they didn't grant consent to the application.|

## Example route file

The following example shows how to build route rules for static content and APIs in a _routes.json_ file. Some routes use the [_/.auth_ system folder](authentication-authorization.md) that access authentication-related endpoints.

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
      "route": "/api/admin",
      "allowedRoles": ["administrator"]
    },
    {
      "route": "/customers/contoso",
      "allowedRoles": ["administrator", "customers_contoso"]
    },
    {
      "route": "/login",
      "serve": "/.auth/login/github"
    },
    {
      "route": "/.auth/login/twitter",
      "statusCode": "404"
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
    },
    {
      "errorType": "Unauthenticated",
      "statusCode": "302",
      "serve": "/login"
    }
  ]
}
```

The following examples describe what happens when a request matches a rule.

|Requests to...  | Result in... |
|---------|---------|---------|
| _/profile_ | Authenticated users are served the _/profile/index.html_ file. Unauthenticated users redirected to _/login_. |
| _/admin/reports_ | Authenticated users in the _administrators_ role are served the _/admin/reports/index.html_ file. Authenticated users not in the _administrators_ role are served a 401 error<sup>2</sup>. Unauthenticated users redirected to _/login_. |
| _/api/admin_ | Requests from authenticated users in the _administrators_ role are sent to the API. Authenticated users not in the _administrators_ role and unauthenticated users are served a 401 error. |
| _/customers/contoso_ | Authenticated users who belong to either the _administrators_ or _customers\_contoso_ roles are served the _/customers/contoso/index.html_ file<sup>2</sup>. Authenticated users not in the _administrators_ or _customers\_contoso_ roles are served a 401 error. Unauthenticated users redirected to _/login_. |
| _/login_     | Unauthenticated users are challenged to authenticate with GitHub. |
| _/.auth/login/twitter_     | Authorization with Twitter is disabled. The server responds with a 404 error. |
| _/logout_     | Users are logged out of any authentication provider. |
| _/calendar/2020/01_ | The browser is served the _/calendar.html_ file. |
| _/specials_ | The browser is redirected to _/deals_. |
| _/unknown-folder_     | The _/custom-404.html_ file is served. |

<sup>1</sup> Route rules for API functions only support [redirects](#redirects) and [securing routes with roles](#securing-routes-with-roles).

<sup>2</sup> You can provide a custom error page by defining a `Unauthorized_MissingRoles` rule in the `platformErrorOverrides` array.

## Restrictions

- The _routes.json_ file cannot be more than 100 KB
- The _routes.json_ file supports a maximum of 50 distinct roles

## Next steps

> [!div class="nextstepaction"]
> [Setup authentication and authorization](authentication-authorization.md)

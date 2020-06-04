---
title: Authentication and authorization for Azure Static Web Apps
description: Learn to use different authorization providers to secure your static app.
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  conceptual
ms.date: 05/08/2020
ms.author: cshoe
---

# Authentication and authorization for Azure Static Web Apps Preview

Azure Static Web Apps streamlines the authentication experience by managing authentication with the following providers:

- Azure Active Directory
- GitHub
- Facebook
- Google<sup>1</sup>
- Twitter

Provider-specific [invitations](#invitations) associate users with roles, and authorized users are granted access to [routes](routes.md) by rules defined in the _routes.json_ file.

All authentication providers are enabled by default. To restrict an authentication provider, [block access](#block-an-authorization-provider) with a custom route rule.

The topics of authentication and authorization significantly overlap with routing concepts. Make sure to read the [routing guide](routes.md) along with this article.

## Roles

Every user who accesses a static web app belongs to one or more roles.  There are two built-in roles that users can belong to:

- **anonymous**: All users automatically belong to the _anonymous_ role.
- **authenticated**: All users who are logged in belong to the _authenticated_ role.

Beyond the built-in roles, you can create new roles, assign them to users via invitations, and reference them in the _routes.json_ file.

## Role management

### Add a user to a role

To add users to your web site, you generate invitations which allow you to associate users to specific roles. Roles are defined and maintained in the _routes.json_ file.

<a name="invitations" id="invitations"></a>

#### Create an invitation

Invitations are specific to individual authorization-providers, so consider the needs of your app as you select which providers to support. Some providers expose a user's email address, while others only provide the site's username.

<a name="provider-user-details" id="provider-user-details"></a>

| Authorization provider | Exposes a user's  |
| ---------------------- | ----------------- |
| Azure Active Directory | email address     |
| Facebook               | email address     |
| GitHub                 | username          |
| Google<sup>1</sup>     | email address     |
| Twitter                | username          |

1. Navigate to a Static Web Apps resource in the [Azure portal](https://portal.azure.com).
1. Under _Settings_, click on **Role Management**.
1. Click on the **Invite** button.
1. Select an _Authorization provider_ from the list of options.
1. Add either the username or email address of the recipient in the _Invitee details_ box.
    - For GitHub and Twitter, you enter the username. For all others, enter the recipient's email address.
1. Select the domain of your static site from the _Domain_ drop-down.
    - The domain you select is the domain that appears in the invitation. If you have a custom domain associated with your site, you probably want to choose the custom domain.
1. Add a comma-separated list of role names in the _Role_ box.
1. Enter the maximum number of hours you want the invitation to remain valid.
    - The maximum possible limit is 168 hours, which is 7 days.
1. Click the **Generate** button.
1. Copy the link from the _Invite link_ box.
1. Email the invitation link to the person you're granting access to your app.

When the user clicks the link in the invitation, they're prompted to log in with their corresponding account. Once successfully logged-in, the user is associated with the selected roles.

> [!CAUTION]
> Make sure your route rules don't conflict with your selected authentication providers. Blocking a provider with a route rule would prevent users from accepting invitations.

### Update role assignments

1. Navigate to a Static Web Apps resource in the [Azure portal](https://portal.azure.com).
1. Under _Settings_, click on **Role Management**.
1. Click on the user in the list.
1. Edit the list of roles in the _Role_ box.
1. Click the **Update** button.

### Remove user

1. Navigate to a Static Web Apps resource in the [Azure portal](https://portal.azure.com).
1. Under _Settings_, click on **Role Management**.
1. Locate the user in the list.
1. Check the checkbox on the user's row.
1. Click the **Delete** button.

As you remove a user, keep in mind the following items:

1. Removing a user invalidates their permissions.
1. Worldwide propagation may take a few minutes.
1. If the user is added back to the app, the [`userId` changes](user-information.md).

## Remove personal identifying information

When you grant consent to an application as an end-user, the application has access to your email address or your username depending on the identity provider. Once this information is provided, the owner of the application decides how to manage personally identifying information.

End-users need to contact administrators of individual web apps to to revoke this information from their systems.

To remove personally identifying information from the Azure Static Web Apps platform, and prevent the platform from providing this information on future requests, submit a request using the URL:

```url
https://identity.azurestaticapps.net/.auth/purge/<AUTHENTICATION_PROVIDER_NAME>
```

To prevent the platform from providing this information on future requests to individual apps, submit a request to the following URL:

```url
https://<WEB_APP_DOMAIN_NAME>/.auth/purge/<AUTHENTICATION_PROVIDER_NAME>
```

## System folder

Azure Static Web Apps uses the `/.auth` system folder to provide access to authorization-related APIs. Rather than exposing any of the routes under the `/.auth` folder directly to end users, consider creating [routing rules](routes.md) to create friendly URLs.

## Login

Use the following table to find the provider-specific login route.

| Authorization provider | Login route             |
| ---------------------- | ----------------------- |
| Azure Active Directory | `/.auth/login/aad`      |
| Facebook               | `/.auth/login/facebook` |
| GitHub                 | `/.auth/login/github`   |
| Google<sup>1</sup>     | `/.auth/login/google`   |
| Twitter                | `/.auth/login/twitter`  |

For example, to login with GitHub you could include a login link like the following snippet:

```html
<a href="/.auth/login/github">Login</a>
```

If you chose to support more than one provider, then you need to expose a provider-specific link for each on your website.

You can use a [route rule](routes.md) to map a default provider to a friendly route like _/login_.

```json
{
  "route": "/login",
  "serve": "/.auth/login/github"
}
```

### Post login redirect

If you want a user to return to a specific page after login, provide a URL in `post_login_redirect_uri` query string parameter.


## Logout

The `/.auth/logout` route logs users out from the website. You can add a link to your site navigation to allow the user to log out as shown in the following example.

```html
<a href="/.auth/logout">Log out</a>
```

You can use a [route rule](routes.md) to map a friendly route like _/logout_.

```json
{
  "route": "/logout",
  "serve": "/.auth/logout"
}
```

### Post logout redirect

If you want a user to return to a specific page after logout, provide a URL in `post_logout_redirect_uri` query string parameter.

## Block an authorization provider

You may want to restrict your app from using an authorization provider. For instance, your app may want to standardize only on [providers that expose email addresses](#provider-user-details).

To block a provider, you can create [route rules](routes.md) to return a 404 for requests to the blocked provider-specific route. For example, to restrict Twitter as provider, add the following route rule.

```json
{
  "route": "/.auth/login/twitter",
  "statusCode": "404"
}
```

## Next steps

> [!div class="nextstepaction"]
> [Access user authentication and authorization data](user-information.md)

<sup>1</sup> Pending external certification.

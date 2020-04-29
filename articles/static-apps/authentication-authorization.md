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

# Authentication and authorization for Azure Static Web Apps

Azure Static Web Apps streamlines the authentication experience by managing authentication with the following providers:

- Azure Active Directory
- GitHub
- Facebook
- Twitter
- Google

Authorization is enforced by associating users with roles via a provider-specific [invitations](#invitations). Authorized users are granted access to [routes](routes.md) by rules listed in the _routes.json_ file.

The topics of authentication and authorization significantly overlap with routing concepts. Make sure to read the [routing guide](routes.md) along with this article.

## Roles

Every user that accesses a static web app belongs to one or more roles. There are two built-in roles that identify users as anonymous or authenticated.

- **anonymous**: All users automatically belong to the _anonymous_ role.
- **authenticated**: Any user that is logged in belongs to the _authenticated_ role.

Beyond the built-in roles, you can create new roles in the _routes.json_ file and assign them to users via invitations.

## Role management

### Add a user to a role

To add users to your site, you generate invitations which allow you to associate users to specific roles. Roles are defined and maintained in the _routes.json_ file.

<a name="invitations" id="invitations"></a>

#### Create an invitation

- Navigate to a Static Web Apps resource in the [Azure portal](https://portal.azure.com).
- Under _Settings_, click on **Role Management**.
- Click on the **Invite** button.
- Select an _Authorization provider_ from the list of options.
- Add either the user account name or email address of the recipient in the _Invitee details_ box.
  - For GitHub and Twitter you enter the user account name. For all others, enter the recipient's email address.
- Select the domain of your static site from the _Domain_ drop-down.
- Add a comma separated list of role names in the _Role_ box.
- Enter the maximum number of hours you want the invitation to remain valid.
  - The maximum possible limit is 7 days, or 168 hours.
- Click the **Generate** button.
- Copy the link from the _Invite link_ box.
- Email the invitation link to the person you are granting access to your app.

When the user clicks the link in the invitation, they are prompted to login with the corresponding account. Once successfully logged-in, the designated roles are are granted to the user.

### Update role assignments

- Navigate to a Static Web Apps resource in the [Azure portal](https://portal.azure.com).
- Under _Settings_, click on **Role Management**.
- Locate the user in the list.
- Check the checkbox on the user's row.
- Click the **Edit** button to open the _Edit user roles_ window.
- Edit the list of roles in the _Role_ box.
- Click the **Update** button.

### Remove user

- Navigate to a Static Web Apps resource in the [Azure portal](https://portal.azure.com).
- Under _Settings_, click on **Role Management**.
- Locate the user in the list.
- Check the checkbox on the user's row.
- Click the **Delete** button.

As you remove a user, keep in mind the following items:

- Removing a user invalidates the permissions for the user.
- Worldwide propagation may a few minutes.
- If the user is added back to the app, the [`userId` changes](user-information.md).

## System folder

Azure Static Web Apps uses the `/.auth` system folder to provide access to authorization-related utility APIs. Rather than exposing any of the routes under the `/.auth` folder directly to end-users, consider creating [routing rules](routing.md) to create friendly URLs.

## Login

An authorization provider is selected when invitations are created while granting user access to the site.

Consider the needs of your app as you select which authentication providers to support. Some providers expose a user's email address, while others only provide the site's username.

Use the following routes to enable logins for a specific authentication provider.

| Authorization provider | Login route             | User details  |
| ---------------------- | ----------------------- | ------------- |
| Azure Active Directory | `/.auth/login/aad`      | Email address |
| Facebook               | `/.auth/login/facebook` | Email address |
| GitHub                 | `/.auth/login/github`   | Username      |
| Google                 | `/.auth/login/google`   | Email address |
| Twitter                | `/.auth/login/twitter`  | Username      |

For example, to login with GitHub you could include a login link like the following snippet:

```html
<a href="/.auth/login/github">Login</a>
```

If you chose to support more than one provider, then you need to to provide a provider-specific link for each provider on your website.

You can use a [route rule](routes.md) to map a default provider to a friendly route like _/login_.

```json
{
  "route": "/login",
  "serve": "/.auth/login/github"
}
```

## Logout

The `/.auth/logout` route logs users out from the website. You can add a link to your site navigation to allow the user to log out as shown the the following example.

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

## Block an authorization provider

In some cases, you may want to restrict some apps from using an authorization provider. For instance, your app may want to standardize only on providers that expose email addresses.

To block a provider, [route rules](routes.md) are used to return a 404 when requesting the blocked provider-specific route. For example, to restrict Twitter as provider, add the following route rule.

```json
{
  "route": "/.auth/login/twitter",
  "statusCode": "404"
}
```

## Next steps

> [!div class="nextstepaction"]
> [Review pull requests in pre-production environments](review-publish-pull-requests.md)

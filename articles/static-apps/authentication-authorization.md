---
title: Authentication and authorization for App Service Static Apps
description: Learn to use different authorization providers to secure your static app.
services: azure-functions
author: craigshoemaker
ms.service: azure-functions
ms.topic:  conceptual
ms.date: 05/08/2020
ms.author: cshoe
---

# Authentication and authorization for App Service Static Apps

Authentication and authorization is enforced by rules defined in the _routes.json_ file and managed through the role management features in the portal. Granting access to secured routes is enabled by creating invitations that associate a user to roles. Roles are defined in the _routes.json_ file and invitations are tied to one of the following authorization providers:

- Azure Active Directory
- GitHub
- Facebook
- Twitter
- Google

The topics of authentication and authorization overlaps with routing rules. Make sure to read the [routing guide](routes.md) along with this article.

## Roles

Every user that accesses a static app belongs to one or more roles. There are two built-in roles that identify users as anonymous or authenticated.

- **anonymous**: All users automatically belong to the _anonymous_ role.
- **authenticated**: Any user that is logged in belongs to the _authenticated_ role.

Beyond the built-in roles, you can create new roles in the _routes.json_ file and assign them to users via invitations.

## Add user

To add users to your site, you generate invitations which allow you to associate users to specific roles. Roles are defined and maintained in the _routes.json_ file.

## Create an invitation

- Navigate to a static app in the Azure portal
- Under _Settings_, click on **Role Management**
- Click on the **Invite** button
- Select an _Authorization provider_ from the list of options
- Add either the user account name or email address of the recipient in the _Invitee details_ box
  - For GitHub and Twitter you enter the user account name. For all others, enter the recipients email address.
- Select the domain of your static site from the _Domain_ drop down
- Add a comma separated list of role names in the _Role_ box
- Enter the maximum number of hours you want the invitation to remain valid.
  - The maximum possible limit is 7 days, or 168 hours.
- Click the **Generate** button
- Copy the link from the _Invite link_ box
- Email the invitation link to the person you are granting access to your app

## Update role assignments

- Navigate to a static app in the Azure portal
- Under _Settings_, click on **Role Management**
- Locate the user in the list
- Check the checkbox on the user's row
- Click the **Edit** button to open the _Edit user roles_ window
- Edit the list of roles in the _Role_ box
- Click the **Update** button

## Remove user

- Navigate to a static app in the Azure portal
- Under _Settings_, click on **Role Management**
- Locate the user in the list
- Check the checkbox on the user's row
- Click the **Delete** button

Removing a user also invalidates the permissions for the user. This action may take a few minutes to propagate the change worldwide.

## Login

An authorization provider is selected when invitations are created while granting user access to the site. Users need to follow a route that matches the provider they used to login.

| Authorization provider | Login route             |
| ---------------------- | ----------------------- |
| Azure Active Directory | `/.auth/login/aad`      |
| Facebook               | `/.auth/login/facebook` |
| GitHub                 | `/.auth/login/github`   |
| Google                 | `/.auth/login/google`   |
| Twitter                | `/.auth/login/twitter`  |

For example, to login with GitHub you could include a login link like the following snippet:

```html
<a href="/.auth/login/github">Login</a>
```

If you chose to support more than one provider, then you need to to provide a provider-specific link for each provider on your website.

## Logout

The `/.auth/logout` route logs a user out of the website. You can add a link to your site navigation to allow the user to log out as shown the the following example:

```html
<a href="/.auth/logout">Log out</a>
```

## Block an authorization provider

You may want to restrict some apps from using an authorization provider. For instance, your app may want to standardize on providers that expose email addresses to your app, or your app must only use Azure Active Directory.

To block providers, a route rules are used to return a 404 when requesting the provider-specific route. For example, to restrict Twitter as provider, add the following route rule:

```json
{
  "route": "/.auth/login/twitter",
  "statusCode": "404"
}
```

## Next steps

> [!div class="nextstepaction"]
> [Review pull requests in preproduction environments](review-publish-pull-requests.md)

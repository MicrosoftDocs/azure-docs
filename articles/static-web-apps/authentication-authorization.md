---
title: Authenticate and authorize Static Web Apps
description: Learn to use different authorization providers to secure your Azure Static Web Apps.
services: static-web-apps
ms.custom: engagement-fy23
author: craigshoemaker
ms.service: static-web-apps
ms.topic: how-to
ms.date: 12/22/2022
ms.author: cshoe
---

# Authenticate and authorize Static Web Apps

> [!WARNING]
> Due to changes in X(formerly Twitter) API policy we can’t continue to support it as part of the pre-configured providers for your app.
> If you want to continue to use X(formerly Twitter) for authentication/authorization with your app, update your app configuration to [register a custom provider](./authentication-custom.md).


Azure Static Web Apps provides a streamlined authentication experience, where no other actions or configurations are required to use GitHub and Microsoft Entra ID for authentication.

In this article, learn about default behavior, how to set up sign-in and sign-out, how to block an authentication provider, and more.

You can [register a custom provider](./authentication-custom.md), which disables all pre-configured providers.

## Prerequisites

Be aware of the following defaults and resources for authentication and authorization with Azure Static Web Apps.

**Defaults:**
- Any user can authenticate with a pre-configured provider
  - GitHub
  - Microsoft Entra ID
  - To restrict an authentication provider, [block access](#block-an-authentication-provider) with a custom route rule
- After sign-in, users belong to the `anonymous` and `authenticated` roles. For more information about roles, see [Manage roles](authentication-custom.md#manage-roles)

**Resources:**
- Define rules in the [staticwebapp.config.json file](./configuration.md) for authorized users to gain access to restricted [routes](configuration.md#routes)
- Assign users custom roles using the built-in [invitations system](authentication-custom.md#manage-roles)
- Programmatically assign users custom roles at sign-in with an [API function](apis-overview.md)
- Understand that authentication and authorization significantly overlap with routing concepts, which are detailed in the [Application configuration guide](configuration.md)
- Restrict sign-in to a specific Microsoft Entra tenant by [configuring a custom Microsoft Entra provider](authentication-custom.md?tabs=aad). The pre-configured Microsoft Entra provider allows any Microsoft account to sign in.
## Set up sign-in

Azure Static Web Apps uses the `/.auth` system folder to provide access to authorization-related APIs. Rather than expose any of the routes under the `/.auth` folder directly to end users, create [routing rules](configuration.md#routes) for friendly URLs.

Use the following table to find the provider-specific route.

| Authorization provider | Sign in route             |
| ---------------------- | ----------------------- |
| Microsoft Entra ID | `/.auth/login/aad`      |
| GitHub                 | `/.auth/login/github`   |

For example, to sign in with GitHub, you could include something similar to the following link.

```html
<a href="/.auth/login/github">Login</a>
```

If you chose to support more than one provider, expose a provider-specific link for each on your website.
Use a [route rule](./configuration.md#routes) to map a default provider to a friendly route like _/login_.

```json
{
  "route": "/login",
  "redirect": "/.auth/login/github"
}
```

### Set up post-sign-in redirect

Return a user to a specific page after they sign in by providing a fully qualified URL in the `post_login_redirect_uri` query string parameter, like in the following example.

```html
<a href="/.auth/login/github?post_login_redirect_uri=https://zealous-water.azurestaticapps.net/success">Login</a>
```

You can also redirect unauthenticated users back to the referring page after they sign in. To configure this behavior, create a [response override](configuration.md#response-overrides) rule that sets `post_login_redirect_uri` to `.referrer`, like in the following example.

```json
{
  "responseOverrides": {
    "401": {
      "redirect": "/.auth/login/github?post_login_redirect_uri=.referrer",
      "statusCode": 302
    }
  }
}
```

## Set up sign-out

The `/.auth/logout` route signs users out from the website. You can add a link to your site navigation to allow the user to sign out, like in the following example.

```html
<a href="/.auth/logout">Log out</a>
```

Use a [route rule](./configuration.md#routes) to map a friendly route like _/logout_.

```json
{
  "route": "/logout",
  "redirect": "/.auth/logout"
}
```

### Set up post-sign-out redirect

To return a user to a specific page after they sign out, provide a URL in `post_logout_redirect_uri` query string parameter.

## Block an authentication provider

You may want to restrict your app from using an authentication provider, since all authentication providers are enabled. For instance, your app may want to standardize only on [providers that expose email addresses](authentication-custom.md#create-an-invitation).

To block a provider, you can create [route rules](configuration.md#routes) to return a 404 status code for requests to the blocked provider-specific route. For example, to restrict Twitter as provider, add the following route rule.

```json
{
  "route": "/.auth/login/twitter",
  "statusCode": 404
}
```

## Remove personal data

When you grant consent to an application as an end user, the application has access to your email address or username, depending on the identity provider. Once this information is provided, the owner of the application can decide how to manage personal data.

End users need to contact administrators of individual web apps to revoke this information from their systems.

To remove personal data from the Azure Static Web Apps platform, and prevent the platform from providing this information on future requests, submit a request using the following URL:

```url
https://identity.azurestaticapps.net/.auth/purge/<AUTHENTICATION_PROVIDER_NAME>
```

To prevent the platform from providing this information on future requests to individual apps, submit a request using the following URL:

```url
https://<WEB_APP_DOMAIN_NAME>/.auth/purge/<AUTHENTICATION_PROVIDER_NAME>
```

If you're using Microsoft Entra ID, use `aad` as the value for the `<AUTHENTICATION_PROVIDER_NAME>` placeholder.

> [!TIP]
> For information about general restrictions and limitations, see [Quotas](quotas.md).

## Next steps

> [!div class="nextstepaction"]
> [Use routes to set allowed roles to control page access](configuration.md)

## Related articles

- [Manage roles with custom authentication](authentication-custom.md#manage-roles)
- [Application configuration guide, Routing concepts](configuration.md)
- [Access user authentication and authorization data](user-information.md)

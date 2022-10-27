---
title: Migrate to the new developer portal from the legacy developer portal
titleSuffix: Azure API Management
description: Learn how to migrate from the legacy developer portal to the new developer portal in API Management.
services: api-management
documentationcenter: API Management
author: dlepow

ms.service: api-management
ms.topic: article
ms.date: 04/15/2021
ms.author: danlep
---

# Migrate to the new developer portal

This article describes the steps you need to take to migrate from the deprecated legacy portal to the new developer portal in API Management.

> [!IMPORTANT]
> The legacy developer portal is now deprecated and it will receive security updates only. You can continue to use it, as per usual, until its retirement in October 2023, when it will be removed from all API Management services.

![API Management developer portal](media/api-management-howto-developer-portal/cover.png)

[!INCLUDE [premium-dev-standard-basic.md](../../includes/api-management-availability-premium-dev-standard-basic.md)]

## Improvements in new developer portal

The new developer portal addresses many limitations of the deprecated portal. It features a [visual drag-and-drop editor for editing content](api-management-howto-developer-portal-customize.md) and a dedicated panel for designers to style the website. Pages, customizations, and configuration are saved as Azure Resource Manager resources in your API Management service, which lets you [automate portal deployments](automate-portal-deployments.md). Lastly, the portal's codebase is open-source, so [you can extend it with custom functionality](api-management-howto-developer-portal.md#managed-vs-self-hosted).

## How to migrate to new developer portal

The new developer portal is incompatible with the deprecated portal and automated migration isn't possible. You need to manually recreate the content (pages, text, media files) and customize the look of the new portal. Precise steps will vary depending on the customizations and complexity of your portal. Refer to [the developer portal tutorial](api-management-howto-developer-portal-customize.md) for guidance. Remaining configuration, like the list of APIs, products, users, identity providers, is automatically shared across both portals.

> [!IMPORTANT]
> If you've launched the new developer portal before, but you haven't made any changes, reset the default content to update it to the latest version.

When you migrate from the deprecated portal, keep in mind the following changes:

- If you expose your developer portal via a custom domain, [assign a domain](configure-custom-domain.md) to the new developer portal. Use the **Developer portal** option from the dropdown in the Azure portal.
- [Apply a CORS policy](developer-portal-faq.md#cors) on your APIs to enable the interactive test console.
- If you inject custom CSS to style the portal, you need to [replicate the styling using the built-in design panel](api-management-howto-developer-portal-customize.md). CSS injection isn't allowed in the new portal.
- You can inject custom JavaScript only in the [self-hosted version of the new portal](api-management-howto-developer-portal.md#managed-vs-self-hosted).
- If your API Management is in a virtual network and is exposed to the Internet via Application Gateway, [refer to this documentation article](api-management-howto-integrate-internal-vnet-appgateway.md) for precise configuration steps. You need to:

    - Enable connectivity to the API Management's management endpoint.
    - Enable connectivity to the new portal endpoint.
    - Disable selected Web Application Firewall rules.

- If you changed the default e-mail notification templates to include an explicitly defined deprecated portal URL, change them to either use the portal URL parameter or point to the new portal URL. If the templates use the     built-in portal URL parameter instead, no changes are required.
- *Issues* and *Applications* aren't supported in the new developer portal.
- Direct integration with Facebook, Microsoft, Twitter, and Google as identity providers isn't supported in the new developer portal. You can integrate with those providers via Azure AD B2C.
- If you use delegation, change the return URL in your applications and use the [*Get Shared Access Token* API endpoint](/rest/api/apimanagement/current-ga/user/get-shared-access-token) instead of the *Generate SSO URL* endpoint.
- If you use Azure AD as an identity provider:

    - Change the return URL in your application to point to the new developer portal domain.
    - Modify the suffix of the return URL in your application from `/signin-aad` to `/signin`.

- If you use Azure AD B2C as an identity provider:

    - Change the return URL in your application to point to the new developer portal domain.
    - Modify the suffix of the return URL in your application from `/signin-aad` to `/signin`.
    - Include *Given Name*, *Surname*, and *User's Object ID* in the application claims.

- If you use OAuth 2.0 in the interactive test console, change the return URL in your application to point to the new developer portal domain and modify the suffix:

    - From `/docs/services/[serverName]/console/oauth2/authorizationcode/callback` to `/signin-oauth/code/callback/[serverName]` for the authorization code grant flow.
    - From `/docs/services/[serverName]/console/oauth2/implicit/callback` to `/signin-oauth/implicit/callback` for the implicit grant flow.
- If you use OpenID Connect in the interactive test console, change the return URL in your application to point to the new developer portal domain and modify the suffix:

    - From `/docs/services/[serverName]/console/openidconnect/authorizationcode/callback` to `/signin-oauth/code/callback/[serverName]` for the authorization code grant flow.
    - From `/docs/services/[serverName]/console/openidconnect/implicit/callback` to `/signin-oauth/implicit/callback` for the implicit grant flow.

## Next steps

Learn more about the developer portal:

- [Azure API Management developer portal overview](api-management-howto-developer-portal.md)
- [Access and customize the developer portal](api-management-howto-developer-portal-customize.md)

---
title: How to set up single sign-on with Azure AD for Spring Cloud Gateway and API Portal for Tanzu
titleSuffix: Azure Spring Apps Enterprise plan
description: How to set up single sign-on with Azure Active Directory for Spring Cloud Gateway and API Portal for Tanzu with the Azure Spring Apps Enterprise plan.
author: KarlErickson
ms.author: ninpan
ms.service: spring-apps
ms.topic: how-to
ms.date: 05/20/2022
ms.custom: devx-track-java
---

# Set up single sign-on using Azure Active Directory for Spring Cloud Gateway and API Portal

**This article applies to:** ❌ Basic/Standard ✔️ Enterprise

This article shows you how to configure single sign-on (SSO) for Spring Cloud Gateway or API Portal using the Azure Active Directory (Azure AD) as an OpenID identify provider.

## Prerequisites

- An Enterprise plan instance with Spring Cloud Gateway or API portal enabled. For more information, see [Quickstart: Build and deploy apps to Azure Spring Apps using the Enterprise plan](quickstart-deploy-apps-enterprise.md).
- Sufficient permissions to manage Azure AD applications.

To enable SSO for Spring Cloud Gateway or API Portal, you need the following four properties configured:

| SSO Property | Azure AD Configuration |
| - | - |
| clientId | See [Register App](#create-an-azure-ad-application-registration) |
| clientSecret | See [Create Client Secret](#add-a-client-secret) |
| scope | See [Configure Scope](#configure-scope) |
| issuerUri | See [Generate Issuer URI](#configure-issuer-uri) |

You'll configure the properties in Azure AD in the following steps.

## Assign an endpoint for Spring Cloud Gateway or API Portal

First, you must get the assigned public endpoint for Spring Cloud Gateway and API portal by following these steps:

1. Open your Enterprise plan service instance in the [Azure portal](https://portal.azure.com).
1. Select **Spring Cloud Gateway** or **API portal** under *VMware Tanzu components* in the left menu. 
1. Select **Yes** next to *Assign endpoint*.
1. Copy the URL for use in the next section of this article.

## Create an Azure AD application registration

Register your application to establish a trust relationship between your app and the Microsoft identity platform using the following steps:

1. From the *Home* screen, select **Azure Active Directory** from the left menu.
1. Select **App Registrations** under *Manage*, then select **New registration**.
1. Enter a display name for your application under *Name*, then select an account type to register under *Supported account types*.
1. In *Redirect URI (optional)* select **Web**, then enter the URL from the above section in the text box. The redirect URI is the location where Azure AD redirects your client and sends security tokens after authentication.
1. Select **Register** to finish registering the application.

:::image type="content" source="./media/how-to-setup-sso-with-azure-ad/sso-create-app-registration.png" alt-text="Screenshot of how to fill out the Add App Registration screen." lightbox="./media/how-to-setup-sso-with-azure-ad/sso-create-app-registration.png":::

When registration finishes, you'll see the *Application (client) ID* on the **Overview** screen of the *App registrations** page.

## Add a redirect URI after app registration

You can also add redirect URIs after app registration by following these steps:

1. From your application overview, under *Manage* in the left menu, select **Authentication**.
1. Select **Web**, then select **Add URI** under *Redirect URIs*.
1. Add a new redirect URI, then select **Save**.

:::image type="content" source="./media/how-to-setup-sso-with-azure-ad/sso-redirect-uri.png" alt-text="Screenshot of adding a redirect U R I to the authentication screen." lightbox="./media/how-to-setup-sso-with-azure-ad/sso-redirect-uri.png":::

For more information on Application Registration, see [Quickstart: Register an app in the Microsoft identity platform ](../active-directory/develop/quickstart-register-app.md#quickstart-register-an-application-with-the-microsoft-identity-platform).

## Add a client secret

The application uses a client secret to authenticate itself in SSO workflow. You can add a client secret using the following steps:

1. From your application overview, under *Manage* in the left menu, select **Certificates & secrets**.
1. Select **Client secrets**, then select **New client secret**.
1. Enter a description for the client secret, then set an expiration date.
1. Select **Add**.

> [!WARNING]
> Remember to save the client secret in a secure place. You can't retrieve it after you leave this page. The client secret should be provided with the client ID when you sign in as the application.

## Configure scope

The `scope` property of SSO is a list of scopes to be included in JWT identity tokens. They're often referred to permissions. Identity platform supports several [OpenID Connect scopes](../active-directory/develop/v2-permissions-and-consent.md#openid-connect-scopes), such as `openid`, `email` and `profile`.

## Configure issuer URI

The issuer URI is the URI that is asserted as its Issuer Identifier. For example, if the issuer-uri provided is `https://example.com`, then an OpenID Provider Configuration Request will be made to `https://example.com/.well-known/openid-configuration`.

The issuer URI of Azure AD is like `<authentication-endpoint>/<Your-TenantID>/v2.0`. Replace `<authentication-endpoint>` with the authentication endpoint for your cloud environment (for example, `https://login.microsoftonline.com` for global Azure), and replace `<Your-TenantID>` with the Directory (tenant) ID where the application was registered.

## Configure SSO

After configuring your Azure AD application, you can set up the SSO properties of Spring Cloud Gateway or API Portal following these steps:

1. Select **Spring Cloud Gateway** or **API portal** under *VMware Tanzu components* in the left menu, then select **Configuration**.
1. Enter the `Scope`, `Client Id`, `Client Secret`, and `Issuer URI` in the appropriate fields. Separate multiple scopes with a comma.
1. Select **Save** to enable the SSO configuration.

> [!NOTE]
> After configuring SSO properties, remember to enable SSO for the Spring Cloud Gateway routes by setting `ssoEnabled=true`. For more information, see [route configuration](./how-to-use-enterprise-spring-cloud-gateway.md#configure-routes).

## Next steps
- [Configure routes](./how-to-use-enterprise-spring-cloud-gateway.md#configure-routes)

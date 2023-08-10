---
title: 'Add an OpenID Connect-based single sign-on application'
description: Learn how to add OpenID Connect-based single sign-on application in Azure Active Directory.
services: active-directory
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: conceptual
ms.workload: identity
ms.date: 04/14/2023
ms.author: jomondi
ms.reviewer: ergreenl
ms.custom: enterprise-apps
---

# Add an OpenID Connect-based single sign-on application

Add an application that supports [OpenID Connect (OIDC)](../develop/active-directory-v2-protocols.md) based single sign-on (SSO) to your Azure Active Directory (Azure AD) tenant.

It is recommended that you use a non-production environment to test the steps in this page.

[!INCLUDE [portal updates](../includes/portal-update.md)]

## Prerequisites

To configure OIDC-based SSO, you need:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- One of the following roles: Global Administrator, or owner of the service principal.

## Add the application

When you add an enterprise application that uses the OIDC standard for SSO, you select a setup button. When you select the button, you complete the sign-up process for the application.

To configure OIDC-based SSO for an application:

1. Sign in to the [Azure portal](https://portal.azure.com) and sign in using one of the roles listed in the prerequisites.
1. Browse to **Azure Active Directory** > **Enterprise applications**. The **All applications** pane opens and displays a list of the applications in your Azure AD tenant. 
1. In the **Enterprise applications** pane, select **New application**.
1. The **Browse Azure AD Gallery** pane opens and displays tiles for cloud platforms, on-premises applications, and featured applications. Applications listed in the **Featured applications** section have icons indicating whether they support federated SSO and provisioning. Search for and select the application. In this example, **SmartSheet** is being used.
1. Select **Sign-up**. Sign in with the user account credentials from Azure Active Directory. If you already have a subscription to the application, then user details and tenant information is validated. If the application is not able to verify the user, then it redirects you to sign up for the application service.

    :::image type="content" source="media/add-application-portal-setup-oidc-sso/oidc-sso-configuration.png" alt-text="Complete the consent screen for an application.":::

1. Select **Consent on behalf of your organization** and then select **Accept**. The application is added to your tenant and the application home page appears. To learn more about user and admin consent, see [Understand user and admin consent](../develop/howto-convert-app-to-be-multi-tenant.md#understand-user-and-admin-consent-and-make-appropriate-code-changes).

## Next steps

Learn more about planning a single sign-on deployment.
> [!div class="nextstepaction"]
> [Plan single sign-on deployment](plan-sso-deployment.md)

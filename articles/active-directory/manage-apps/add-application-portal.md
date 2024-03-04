---
title: 'Quickstart: Add an enterprise application'
description: Add an enterprise application in Azure Active Directory.
services: active-directory
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: quickstart
ms.workload: identity
ms.date: 03/22/2023
ms.author: jomondi
ms.reviewer: ergreenl
ms.custom: mode-other, enterprise-apps
#Customer intent: As an administrator of an Azure AD tenant, I want to add an enterprise application.
---

# Quickstart: Add an enterprise application

In this quickstart, you use the Azure portal to add an enterprise application to your Azure Active Directory (Azure AD) tenant. Azure AD has a gallery that contains thousands of enterprise applications that have been preintegrated. Many of the applications your organization uses are probably already in the gallery. This quickstart uses the application named **Azure AD SAML Toolkit** as an example, but the concepts apply for most [enterprise applications in the gallery](../saas-apps/tutorial-list.md).

It's recommended that you use a nonproduction environment to test the steps in this quickstart.

## Prerequisites

To add an enterprise application to your Azure AD tenant, you need:

- An Azure AD user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- One of the following roles: Global Administrator, or Application Administrator.

## Add an enterprise application

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

To add an enterprise application to your tenant:

1. Sign in to the [Azure portal](https://portal.azure.com) and sign in using one of the roles listed in the prerequisites.
1. Browse to **Azure Active Directory** and select **Enterprise applications**. The **All applications** pane opens and displays a list of the applications in your Azure AD tenant.
1. In the **Enterprise applications** pane, select **New application**.
1. The **Browse Azure AD Gallery** pane opens and displays tiles for cloud platforms, on-premises applications, and featured applications. Applications listed in the **Featured applications** section have icons indicating whether they support federated single sign-on (SSO) and provisioning. Search for and select the application. In this quickstart, **Azure AD SAML Toolkit** is being used.

    :::image type="content" source="media/add-application-portal/browse-gallery.png" alt-text="Browse in the enterprise application gallery for the application that you want to add.":::

1. Enter a name that you want to use to recognize the instance of the application. For example, `Azure AD SAML Toolkit 1`.
1. Select **Create**.

If you choose to install an application that uses OpenID Connect based SSO, instead of seeing a **Create** button, you see a button that redirects you to the application sign-in or sign-up page depending on whether you already have an account there. For more information, see [Add an OpenID Connect based single sign-on application](add-application-portal-setup-oidc-sso.md). After sign-in, the application is added to your tenant.

## Clean up resources

If you're planning to complete the next quickstart, keep the enterprise application that you created. Otherwise, you can consider deleting it to clean up your tenant. For more information, see [Delete an application](delete-application-portal.md).

## Next steps

Learn how to create a user account and assign it to the enterprise application that you added.
> [!div class="nextstepaction"]
> [Create and assign a user account](add-application-portal-assign-users.md)

---
title: 'Quickstart: Add an enterprise application'
description: In this quickstart, you use the Azure Active Directory Admin Center to add an enterprise application to your Azure Active Directory tenant.
titleSuffix: Azure AD
services: active-directory
author: davidmu1
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: quickstart
ms.workload: identity
ms.date: 09/07/2021
ms.author: davidmu
ms.reviewer: ergleenl
# Customer intent: As an administrator of an Azure AD tenant, I want to add an enterprise application.
---

# Quickstart: Add an enterprise application

In this quickstart, you use the Azure Active Directory Admin Center to add an enterprise application to your Azure Active Directory (Azure AD) tenant. Azure AD has a gallery that contains thousands of enterprise applications that have been pre-integrated. Many of the applications your organization uses are probably already in the gallery. This quickstart uses the application named **Azure AD SAML Toolkit** as an example, but the concepts apply for most [enterprise applications in the gallery](../saas-apps/tutorial-list.md).

It is recommended that you use a non-production environment to test the steps in this quickstart.

## Prerequisites

To add an enterprise application to your Azure AD tenant, you need:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.

## Add an enterprise application

1. In the [Azure portal](https://portal.azure.com), in the **Azure services** pane select **Enterprise applications**. The **All applications** pane opens and displays a random sample of the applications in your Azure AD tenant.
2. In the **Enterprise applications** pane, select **New application**.
3. The **Browse Azure AD Gallery** pane opens and displays tiles for cloud platforms, on-premises applications, and featured applications. Applications listed in the **Featured applications** section have icons indicating whether they support federated single sign-on (SSO) and provisioning.
    ![Search for an app by name or category](media/add-application-portal/browse-gallery.png)
4. You can browse the gallery for the application you want to add, or search for the application by entering its name in the search box. Then select the application from the results.
5. The next step depends on the way the developer of the application implemented single sign-on (SSO). Single sign-on can be implemented by app developers in four ways. The four ways are SAML, OpenID Connect, Password, and Linked. When you add an app, you can choose to filter and see only apps using a particular SSO implementation as shown in the screenshot. For example, a popular standard to implement SSO is called Security Assertion Markup Language (SAML). Another standard that is popular is called OpenId Connect (OIDC). The way you configure SSO with these standards is different so take note of the type of SSO that is implemented by the app that you are adding.

You can choose from the many enterprise applications in the gallery to add one to your Azure AD tenant.

To add an enterprise application to your tenant:

1. Go to the [Azure Active Directory Admin Center](https://aad.portal.azure.com) and sign in using one of the roles listed in the prerequisites.
1. In the left menu, select **Enterprise applications**. The **All applications** pane opens and displays a list of the applications in your Azure AD tenant.
1. In the **Enterprise applications** pane, select **New application**.
1. The **Browse Azure AD Gallery** pane opens and displays tiles for cloud platforms, on-premises applications, and featured applications. Applications listed in the **Featured applications** section have icons indicating whether they support federated single sign-on (SSO) and provisioning. Search for and select the application. In this quickstart, **Azure AD SAML Toolkit** is being used.

    :::image type="content" source="media/add-application-portal/browse-gallery.png" alt-text="Browse in the enterprise application gallery for the application that you want to add.":::

1. Enter a name that you want to use to recognize the instance of the application. For example, `Azure AD SAML Toolkit 1`.
1. Select **Create**.

If you choose to install an application that uses OpenID Connect based single sign-on, instead of seeing a **Create** button, you see a button that redirects you to the application sign-in or sign-up page depending on whether you already have an account there. For more information, see [Add an OpenID Connect based single sign-on application](add-application-portal-setup-oidc-sso.md). After sign-in, the application is added to your tenant.

## Clean up resources

If you are planning to complete the next quickstart, keep the enterprise application that you created. Otherwise, you can consider deleting it to clean up your tenant. For more information, see [Delete an application](delete-application-portal.md).

## Next steps

Learn how to create a user account and assign it to the enterprise application that you added.
> [!div class="nextstepaction"]
> [Create and assign a user account](add-application-portal-assign-users.md)

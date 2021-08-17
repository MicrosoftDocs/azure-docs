---
title: 'Quickstart: Set up SAML-based single sign-on for an application'
titleSuffix: Azure AD
description: This quickstart walks through the process of setting up SAML-based single sign-on (SSO) for an application in your Azure Active Directory (Azure AD) tenant.
services: active-directory
author: davidmu1
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: quickstart
ms.workload: identity
ms.date: 07/23/2020
ms.author: davidmu
ms.reviewer: ergleenl
---

# Quickstart: Set up SAML-based single sign-on for an application

Get started with simplified user logins by setting up single sign-on (SSO) for an application that you added to your Azure Active Directory (Azure AD) tenant. After you set up SSO, your users can sign in to an application by using their Azure AD credentials. SSO is included in the free edition of Azure AD.

## Prerequisites

To set up SSO for an application that you added to your Azure AD tenant, you need:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
- An application that supports SSO and that was already preconfigured and added to the Azure AD gallery. Most apps can use Azure AD for SSO. The apps in the Azure AD gallery are preconfigured. If your app isn't listed or is a custom-developed app, you can still use it with Azure AD. Check out the tutorials and other documentation in the table of contents. This quickstart focuses on apps that were preconfigured for SSO and added to the Azure AD gallery by the app developers.
- Optional: Completion of [View your apps](view-applications-portal.md).
- Optional: Completion of [Add an app](add-application-portal.md).
- Optional: Completion of [Configure an app](add-application-portal-configure.md).
- Optional: Completion of [Assign users to an app](add-application-portal-assign-users.md).

>[!IMPORTANT]
>Use a non-production environment to test the steps in this quickstart.

## Enable single sign-on for an app

After you finish adding an application to your Azure AD tenant, the overview page appears. If you're configuring an application that was already added, look at the first quickstart. It walks you through viewing the applications added to your tenant.

To set up single sign-on for an application:

1. In the Azure AD portal, select **Enterprise applications**. Then find and select the application you want to set up for single sign-on.
1. In the **Manage** section, select **Single sign-on** to open the **Single sign-on** pane for editing.

    > [!IMPORTANT]
    > If the app uses the OpenID Connect (OIDC) standard for SSO then you will not see a single sign-on option in the navigation. Refer to the quickstart on OIDC-based SSO to learn how to set it up.

1. Select **SAML** to open the SSO configuration page. In this example, the application we're configuring for SSO is GitHub. After GitHub is set up, your users can sign in to GitHub by using their credentials from your Azure AD tenant.

    :::image type="content" source="media/add-application-portal-setup-sso/github-sso.png" alt-text="Screenshot shows the Single sign-on config page on GitHub.":::

1. The process of configuring an application to use Azure AD for SAML-based SSO varies depending on the application. There's a link to the guidance for GitHub. To find guides for other apps, see [Tutorials for integrating SaaS applications with Azure Active Directory](/azure/active-directory/saas-apps/).
1. Follow the guide to set up SSO for the application. Many applications have specific subscription requirements for SSO functionality. For example, GitHub requires an Enterprise subscription.
    > [!TIP]
    > To learn more about the SAML configuration options, see [Configure SAML-based single sign-on](configure-saml-single-sign-on.md).

> [!TIP]
> You can automate app management using the Graph API, see [Automate app management with Microsoft Graph API](/graph/application-saml-sso-configure-api).

## Clean up resources

When you're done with this quickstart series, consider deleting the app to clean up your test tenant. Deleting the app is covered in the last quickstart in this series, see [Delete an app](delete-application-portal.md).

## Next steps

Advance to the next article to learn how to delete an app.
> [!div class="nextstepaction"]
> [Delete an app](delete-application-portal.md)

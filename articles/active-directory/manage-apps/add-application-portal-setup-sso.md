---
title: 'Quickstart: Set up Single Sign-On (SSO) for an application in your Azure Active Directory (Azure AD) tenant'
description: This quickstart walks through the process of setting up Single Sign-On (SSO) for an application in your Azure Active Directory (Azure AD) tenant.
services: active-directory
author: kenwith
manager: celestedg
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: quickstart
ms.workload: identity
ms.date: 07/01/2020
ms.author: kenwith
ms.collection: M365-identity-device-management
---

# Quickstart: Set up Single Sign-On (SSO) for an application in your Azure Active Directory (Azure AD) tenant

Get started with simplified user logins by setting up SSO for an application you have added to your Azure AD tenant. After setting up SSO, your users will be able to sign into an application using their Azure AD credentials. SSO is included in the free edition of Azure AD.

## Prerequisites

To set up SSO for an application you have added to your Azure AD tenant, you need:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
- An application that supports single sign-on and that has already been pre-configured and added to the Azure AD gallery. Most apps can use Azure AD for single sign-on. The apps in the Azure AD gallery have been pre-configured. If your app is not listed, or is a custom developed app, you can still use it with Azure AD. Check out the tutorials and other documentation in the table of contents. This quickstart focuses on apps that have been pre-configured for SSO and added to the Azure AD gallery by the app developers.
- (Optional: Completion of [View your apps](view-applications-portal.md)).
- (Optional: Completion of [Add an app](add-application-portal.md)).
- (Optional: Completion of [Configure an app](add-application-portal-configure.md)).


>[!IMPORTANT]
>We recommend using a non-production environment to test the steps in this quickstart.


## Enable single sign-on for an app

When you finish adding an application to your Azure AD tenant, you are immediately presented with the overview page for it. If you are configuring an application that has already been added, then look at the first quickstart, it walks you through viewing the applications added to your tenant. 

To set up single sign-on for an application:

1. In the Azure AD portal, select **Enterprise applications** and then find and select the application you want to set up for single sign-on.
2. In the Manage section, select **Single sign-on** to open the properties pane for editing.
    :::image type="content" source="media/add-application-portal-setup-sso/configure-sso.png" alt-text="Shows the single sign-on config page in Azure AD portal.":::
3. Select SAML to open the SSO configuration page. In this example, the application we are configuring for SSO is GitHub. After GitHub is set up, your users will be able to sign into GitHub using their credentials from our Azure AD tenant.
    :::image type="content" source="media/add-application-portal-setup-sso/github-sso.png" alt-text="Shows the single sign-on config page on GitHub.":::
4. The process to configure an application to use Azure AD for SAML-based SSO varies depending on the application. Notice there is a link to the guidance for GitHub. You can find guides for other apps at: https://docs.microsoft.com/azure/active-directory/saas-apps/
5. Follow the guide to set up SSO for the application. Many applications have specific subscription requirements for SSO functionality. For example, GitHub requires an Enterprise subscription.
    :::image type="content" source="media/add-application-portal-setup-sso/github-pricing.png" alt-text="Shows the single sign-on option in the Enterprise subscription of the GitHub pricing page.":::


## Next steps

- [Delete an app](delete-application-portal.md)
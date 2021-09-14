---
title: 'Quickstart: Set up OIDC-based single sign-on for an application'
titleSuffix: Azure AD
description: This quickstart walks through the process of setting up OIDC-based single sign-on (SSO) for an application in your Azure Active Directory (Azure AD) tenant.
services: active-directory
author: davidmu1
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: quickstart
ms.workload: identity
ms.date: 07/23/2020
ms.author: davidmu
ms.reviewer: ergreenl
---

# Quickstart: Set up OIDC-based single sign-on for an application

Get started with simplified user logins by setting up single sign-on (SSO) for an application that you added to your Azure Active Directory (Azure AD) tenant. After you set up SSO, your users can sign in to an application by using their Azure AD credentials. SSO is included in the free edition of Azure AD.

To learn more about OIDC-based SSO, see [Understand OIDC-based single sign-on](configure-oidc-single-sign-on.md).

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

When you add an app that uses the OIDC standard for SSO, you have a setup button. When you select the button, you go to the applications site and complete the sign-up process for the app. The process of adding an app is covered in the Add an app quickstart earlier in this series. If you're configuring an application that was already added, look at the first quickstart. It walks you through viewing the applications already in your tenant.

To set up single sign-on for an application:

1. In the quickstart earlier in this series, you learned how to add an app that will use your Azure AD tenant for identity management. If the app developer used the OIDC standard to implement SSO, then you are presented with a sign-up button when adding the app.

    :::image type="content" source="media/add-application-portal-setup-oidc-sso/sign-up-oidc-sso.png" alt-text="Screenshot shows the single sign-on option and the sign-up button." lightbox="media/add-application-portal-setup-oidc-sso/sign-up-oidc-sso.png":::

2. Select **Sign-up** and you will be taken to the app developers sign-on page. Sign in using Azure Active Directory sign-in credentials.

   > [!IMPORTANT]
    > If you already have a subscription to the application then validation of user details and tenant/directory information will happen. If the application is not able to verify the user then it will redirect you to sign-up for the application service or to the error page.

3. After successful authentication, a dialog appears asking for admin consent. Select **Consent on behalf of your organization** and then select **Accept**. To learn more about user and admin consent, see [Understand user and admin consent](../develop/howto-convert-app-to-be-multi-tenant.md#understand-user-and-admin-consent).

    :::image type="content" source="media/add-application-portal-setup-oidc-sso/consent.png" alt-text="Screenshot shows the consent screen for an app." lightbox="media/add-application-portal-setup-oidc-sso/consent.png":::

4. The application is added to your tenant and the application home page appears.

> [!TIP]
> You can automate app management using the Graph API, see [Automate app management with Microsoft Graph API](/graph/application-saml-sso-configure-api).

Here is a video walking through additional details of adding an OIDC-based app to Azure AD.

Adding an OIDC-based app in Azure Active Directory

> [!VIDEO https://www.microsoft.com/videoplayer/embed/RE4HoNI]

## Clean up resources

When you're done with this quickstart series, consider deleting the app to clean up your test tenant. Deleting the app is covered in the last quickstart in this series, see [Delete an app](delete-application-portal.md).

## Next steps

Advance to the next article to learn how to delete an app.
> [!div class="nextstepaction"]
> [Delete an app](delete-application-portal.md)

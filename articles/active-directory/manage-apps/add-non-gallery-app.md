---
title: Add a non-gallery application - Microsoft identity platform | Microsoft Docs
description: Add a non-gallery applications to you Azure AD tenant.
services: active-directory
author: msmimart
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: article
ms.workload: identity
ms.date: 06/18/2019
ms.author: mimart
ms.reviewer: arvinh,luleon
ms.collection: M365-identity-device-management
---

# Add an unlisted (non-gallery) application to your Azure AD organization

In addition to the choices in the [Azure AD application gallery](https://azure.microsoft.com/documentation/articles/active-directory-saas-tutorial-list/), you have the option to add a **non-gallery application** when the application you want is not listed there. Using this capability, you can add any application that already exists in your organization, or any third-party application  from a vendor who is not already part of the Azure AD gallery. Depending on your [license agreement](https://azure.microsoft.com/pricing/details/active-directory/), the following capabilities are available:

- Self-service integration of any application that supports [Security Assertion Markup Language (SAML) 2.0](https://wikipedia.org/wiki/SAML_2.0) identity providers (SP-initiated or IdP-initiated)
- Self-service integration of any web application that has an HTML-based sign-in page using [password-based SSO](what-is-single-sign-on.md#password-based-sso)
- Self-service connection of applications that use the [System for Cross-Domain Identity Management (SCIM) protocol for user provisioning](use-scim-to-provision-users-and-groups.md)
- Ability to add links to any application in the [Office 365 app launcher](https://www.microsoft.com/microsoft-365/blog/2014/10/16/organize-office-365-new-app-launcher-2/) or the [Azure AD access panel](what-is-single-sign-on.md#linked-sign-on)

This article describes how to add a non-gallery application to Azure AD using the **Enterprise Applications** blade in the Azure portal *without writing code*. If instead you're looking for developer guidance on how to integrate custom apps with Azure AD, see [Authentication Scenarios for Azure AD](../develop/authentication-scenarios.md). When you develop an app that uses a modern protocol like [OpenId Connect/OAuth](../develop/active-directory-v2-protocols.md) to authenticate users, you can register it with the Microsoft identity platform by using the [App registrations](../develop/quickstart-register-app.md) experience in the Azure portal.

## To add a non-gallery application

1. Sign in to the [Azure Active Directory portal](https://aad.portal.azure.com/) using your Microsoft identity platform administrator account.
1. Select **Enterprise Applications** > **New application**.
2. (Optional but recommended) In the **Add from the gallery** search box, enter the display name of the application. If the application appears in the search results, select it and skip the rest of this procedure.
3. Select **Non-gallery application**. The **Add your own application** page appears.

   ![Add application](./media/configure-single-sign-on-non-gallery-applications/add-your-own-application.png)
5. Enter the display name for your new application.
6. Select **Add**.

## Next steps

Now that you've added the application to your Azure AD organization, [choose a single sign-on method](what-is-single-sign-on.md#choosing-a-single-sign-on-method) you want to use and refer to the appropriate article below:

- [Configure SAML-based single sign-on](configure-single-sign-on-portal.md)
- [Configure password single sign-on](configure-password-single-sign-on.md)
- [Configure linked sign-on](configure-linked-sign-on.md)

## Password single sign-on

Select this option to configure [password-based single sign-on](what-is-single-sign-on.md) for a web application with an HTML sign-in page. Password-based SSO, also referred to as password vaulting, enables you to manage user access and passwords to web applications that don't support identity federation. It's also useful for scenarios where several users need to share a single account, such as to your organization's social media app accounts.

After you select **Password-based**, you're prompted to enter the URL of the application's web-based sign-in page.

![Password-based single sign-on](./media/configure-single-sign-on-non-gallery-applications/password-based-sso.png)

Then do these steps:

1. Enter the URL. This string must be the page that includes the username input field.
2. Select **Save**. Azure AD tries to parse the sign-in page for a username input and a password input.
3. If Azure AD's parsing attempt fails, select **Configure \<application name> Password Single Sign-on Settings** to display the **Configure sign-on** page. (If the attempt succeeds, you can disregard the rest of this procedure.)
4. Select **Manually detect sign-in fields**. Additional instructions describing the manual detection of sign-in fields appear.

   ![Manual configuration of password-based single sign-on](./media/configure-single-sign-on-non-gallery-applications/password-configure-sign-on.png)
5. Select **Capture sign-in fields**. A capture status page opens in a new tab, showing the message **metadata capture is currently in progress**.
6. If the **Access Panel Extension Required** box appears in a new tab, select **Install Now** to install the **My Apps Secure Sign-in Extension** browser extension. (The browser extension requires Microsoft Edge, Chrome, or Firefox.) Then install, launch, and enable the extension, and refresh the capture status page.

   The browser extension then opens another tab that displays the entered URL.
7. In the tab with the entered URL, go through the sign-in process. Fill in the username and password fields, and try to sign in. (You don't have to provide the correct password.)

   A prompt asks you to save the captured sign-in fields.
8. Select **OK**. The tab closes, the browser extension updates the capture status page with the message **Metadata has been updated for the application**, and that browser tab also closes.
9. In the Azure AD **Configure sign-on** page, select **Ok, I was able to sign-in to the app successfully**.
10. Select **OK**.

After the capture of the sign-in page, you may assign users and groups, and you can set up credential policies just like regular [password SSO applications](what-is-single-sign-on.md).

> [!NOTE]
> You can upload a tile logo for the application using the **Upload Logo** button on the **Configure** tab for the application.

## Existing single sign-on

Select this option to add a link to the application in your organization's Azure AD Access Panel or Office 365 portal. You can use this method to add links to custom web applications that currently use Active Directory Federation Services (or other federation service) instead of Azure AD for authentication. Or, you can add deep links to specific SharePoint pages or other web pages that you just want to appear on your user's Access Panels.

After you select **Linked**, you're prompted to enter the URL of the application to link to. Type the URL and select **Save**. You may assign users and groups to the application, which causes the application to appear in the [Office 365 app launcher](https://blogs.office.com/2014/10/16/organize-office-365-new-app-launcher-2/) or the [Azure AD access panel](end-user-experiences.md) for those users.

> [!NOTE]
> You can upload a tile logo for the application using the **Upload Logo** button on the **Configure** tab for the application.

## Related articles

- [How to: Customize claims issued in the SAML token for enterprise applications](../develop/active-directory-saml-claims-customization.md)
- [Debug SAML-based single sign-on to applications in Azure Active Directory](../develop/howto-v1-debug-saml-sso-issues.md)
- [Microsoft identity platform (formerly Azure Active Directory for developers)](../develop/index.yml)

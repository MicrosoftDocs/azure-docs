---
title: Password single sign-on for Azure AD applications - Microsoft identity platform | Microsoft Docs
description: Configure password single sign-on (SSO) to your Azure AD enterprise applications in Microsoft identity platform (Azure AD)
services: active-directory
author: msmimart
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: article
ms.workload: identity
ms.date: 06/18/2019
ms.author: msmimart
ms.reviewer: arvinh,luleon
ms.collection: M365-identity-device-management
---

# Configure password single sign-on

When you add a gallery or non-gallery web application, one of the single sign-on options available to you is [password-based single sign-on](what-is-single-sign-on.md). This option is available for any web with an HTML sign-in page. Password-based SSO, also referred to as password vaulting, enables you to manage user access and passwords to web applications that don't support identity federation. It's also useful for scenarios where several users need to share a single account, such as to your organization's social media app accounts.

## Before you begin

If the application hasn't been added to your Azure AD tenant, see [Add a gallery app](add-gallery-app.md) or [Add a non-gallery app](add-non-gallery-app.md).

## Open the app and select password single sign-on

1. Sign in to the [Azure portal](https://portal.azure.com) as a cloud application admin, or an application admin for your Azure AD tenant.

1. Navigate to **Azure Active Directory** > **Enterprise applications**. A random sample of the applications in your Azure AD tenant appears. 

1. In the **Application Type** menu, select **All applications**, and then select **Apply**.

1. Enter the name of the application in the search box, and then select the application from the results.

1. Under the **Manage** section, select **Single sign-on**. 

1. Select **Password-based**.

1. Enter the URL of the application's web-based sign-in page. This string must be the page that includes the username input field.

   ![Password-based single sign-on](./media/configure-single-sign-on-non-gallery-applications/password-based-sso.png)

1. Select **Save**. Azure AD tries to parse the sign-in page for a username input and a password input. If the attempt succeeds, you're done. 

## Manual configuration

If Azure AD's parsing attempt fails, you can configure sign-on manually.

1. Under **\<application name> Configuration**, select **Configure \<application name> Password Single Sign-on Settings** to display the **Configure sign-on** page. 

3. Select **Manually detect sign-in fields**. Additional instructions describing the manual detection of sign-in fields appear.

   ![Manual configuration of password-based single sign-on](./media/configure-password-single-sign-on/password-configure-sign-on.png)
1. Select **Capture sign-in fields**. A capture status page opens in a new tab, showing the message **metadata capture is currently in progress**.
1. If the **Access Panel Extension Required** box appears in a new tab, select **Install Now** to install the **My Apps Secure Sign-in Extension** browser extension. (The browser extension requires Microsoft Edge, Chrome, or Firefox.) Then install, launch, and enable the extension, and refresh the capture status page.

   The browser extension then opens another tab that displays the entered URL.
1. In the tab with the entered URL, go through the sign-in process. Fill in the username and password fields, and try to sign in. (You don't have to provide the correct password.)

   A prompt asks you to save the captured sign-in fields.
8. Select **OK**. The tab closes, the browser extension updates the capture status page with the message **Metadata has been updated for the application**, and that browser tab also closes.
9. In the Azure AD **Configure sign-on** page, select **Ok, I was able to sign-in to the app successfully**.
10. Select **OK**.

After the capture of the sign-in page, you may assign users and groups, and you can set up credential policies just like regular [password SSO applications](what-is-single-sign-on.md).

> [!NOTE]
> You can upload a tile logo for the application using the **Upload Logo** button on the **Configure** tab for the application.

## Next steps

- [Configure automatic user account provisioning](configure-automatic-user-provisioning-portal.md)

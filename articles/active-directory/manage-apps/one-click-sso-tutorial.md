---
title: One-click, single sign-on (SSO) configuration of your Azure Active Directory app gallery application  | Microsoft Docs
description: Steps for one-click configuration of  SSO for your application from the Azure AD app gallery.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: celested

ms.assetid: e0416991-4b5d-4b18-89bb-91b6070ed3ba
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 06/11/2019
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# One Click SSO feature for Azure AD Gallery Applications

 In this tutorial, you learn how to perform One Click SSO for all the SAML applications that provide UI for SSO configuration.

## Introduction to One Click SSO

One Click SSO feature is introduced to configure the Single Sign On for Azure AD gallery apps that support SAML protocol. On Azure AD SSO configuration page, we have provided this option to allow our customers to configure the Azure AD metadata on the application side automatically. The objective is to help customers setting up SSO quickly with minimal manual efforts. 

## Advantages of the One Click SSO

- Quick SSO configuration of the gallery applications where customers need to do manual setup on application side.
- More efficient and accurate way of configuration.
- No partner communication or support needed for the setup as the application provides the UI for SAML configuration.

## Prerequisites

- Active subscription of the application with admin credentials that you want to configure with OneClick SSO.
- **My Apps Secure Sign-in browser extension** from Microsoft installed in the browser. If you would like to know more about this extension, refer to this [link](https://docs.microsoft.com/azure/active-directory/user-help/my-apps-portal-end-user-access).

## One Click SSO feature step by step details

1. Add the application from the Azure AD App gallery.

2. Click on Single sign-on.

3. Click on Enable Single sign-on.

4. Populate the mandatory configuration values in Basic SAML Configuration section.

    > [!NOTE] 
    > If application needs configuration of custom claims, please configure them before performing OneClick SSO.

5. If One Click SSO feature is implemented for any gallery application, you see following screen. If the **My Apps Secure Sign-in browser extension** is not already installed, you need to click on **Install the extension** option.

    ![Install My Apps Secure Sign-in browser extension](./media/one-click-sso-tutorial/install-myappssecure-extension.png)

6. After adding the extension to the browser, click on **Setup Application Name** which will redirect you to the application admin portal. You need to sign-in as administrator to get into the application.

    ![Setup application name](./media/one-click-sso-tutorial/setup-sso.png)

7. The browser extension will now automatically configure the application for you. It first asks your confirmation if you want to proceed. Click **Yes**.

    ![Saving the auto populated data](./media/one-click-sso-tutorial/save-autopopulate.png)

    > [!NOTE]
	> If any application needs extra nagivation or steps, you should see proper messages asking you to perform those steps. 

8. Once the configuration is done, click **Ok** to save the changes.

    ![Save the auto populated data](./media/one-click-sso-tutorial/save-data.png)

9. A successful confirmation pop-up message is displayed and your SSO settings are successfully configured. You can then test the application.

    ![SSO Configured](./media/one-click-sso-tutorial/sso-configured.png)

10. Once the configuration is successfully complete, the application will be logged off and you are returned back to Azure portal.

11. You can click on the Test button to test the Single sign-on.

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/saas-apps/tutorial-list)
* [What is My Apps Secure Sign-in browser extension](https://docs.microsoft.com/azure/active-directory/user-help/my-apps-portal-end-user-access)
 
---
title: One-click, single sign-on (SSO) configuration of your Azure Marketplace application  | Microsoft Docs
description: Steps for one-click configuration of  SSO for your application from the Azure Marketplace.
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

# One-click app configuration of single sign-on

 In this tutorial, you learn how to perform one-click, single sign-on (SSO) configuration for SAML-supporting, Azure Active Directory (Azure AD) applications from the Azure Marketplace.

## Introduction to one-click SSO

The one-click SSO feature is designed to configure single sign-on for Azure Marketplace apps that support SAML protocol. On the Azure AD SSO configuration page, this option allows you to automatically configure the Azure AD metadata on the application side. In this way, you can quickly set up SSO with minimal manual effort.

## Advantages of one-click SSO

- Quick SSO configuration of Azure Marketplace applications that require manual setup on application side.
- More efficient and accurate SSO configuration.
- No partner communication or support needed for  setup. The application provides the UI for SAML configuration.

## Prerequisites

- An active subscription of the application to configure with SSO. You also need admin credentials.
- The **My Apps Secure Sign-in extension** from Microsoft installed in the browser. For more information, see [Access and use apps on the My Apps portal](https://docs.microsoft.com/azure/active-directory/user-help/my-apps-portal-end-user-access).

## One-click SSO configuration steps

1. Add the application from the Azure Marketplace.

2. Select **Single sign-on**.

3. Select **Enable single sign-on**.

4. Populate the mandatory configuration values in the **Basic SAML Configuration** section.

    > [!NOTE]
    > If the application has custom claims that you need to configure, handle them before performing one-click SSO.

5. If the one-click SSO feature is available for your Azure Marketplace application, you see following screen. You might have to install the **My Apps Secure Sign-in browser extension** by selecting **Install the extension**.

   ![Install My Apps Secure Sign-in browser extension](./media/one-click-sso-tutorial/install-myappssecure-extension.png)

6. After you add the extension to the browser, select **Setup \<Application Name\>**. After you're redirected to the application admin portal, sign in as an administrator.

   ![Setup application name](./media/one-click-sso-tutorial/setup-sso.png)

7. The browser extension automatically configures SSO on the application. Confirm by selecting **Yes**.

   ![Saving the auto-populated data](./media/one-click-sso-tutorial/save-autopopulate.png)

   > [!NOTE]
   > If SSO configuration for your application requires additional steps, following the prompts to perform the steps.

8. After the configuration has finished, select **OK** to save the changes.

   ![Save the auto-populated data](./media/one-click-sso-tutorial/save-data.png)

9. A confirmation window displays to let you know that the SSO settings are successfully configured.

   ![SSO configured](./media/one-click-sso-tutorial/sso-configured.png)

10. After the configuration is successful, you're signed out of the application and returned to the Azure portal.

11. You can select **Test** to test single sign-on.

## Additional resources

* [List of tutorials on how to integrate SaaS apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/saas-apps/tutorial-list)
* [What is the My Apps Secure Sign-in browser extension?](https://docs.microsoft.com/azure/active-directory/user-help/my-apps-portal-end-user-access)
 

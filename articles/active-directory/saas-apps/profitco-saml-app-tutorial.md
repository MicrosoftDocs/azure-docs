---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with Profit.co | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Profit.co.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 27f42934-c636-43dd-9c20-a3c6316f2763
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: tutorial
ms.date: 04/30/2020
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with Profit.co

In this tutorial, you'll learn how to integrate Profit.co with Azure Active Directory (Azure AD). When you integrate Profit.co with Azure AD, you can:

* Control in Azure AD who has access to Profit.co.
* Enable your users to be automatically signed in to Profit.co with their Azure AD accounts.
* Manage your accounts in one central location, the Azure portal.

To learn more about software as a service (SaaS) app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Profit.co single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Profit.co supports IDP initiated SSO.

* After you configure Profit.co, you can enforce session control. This protects exfiltration and infiltration of your organization's sensitive data in real time. Session control extends from conditional access. [Learn how to enforce session control with Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/proxy-deployment-any-app).

## Add Profit.co from the gallery

To configure the integration of Profit.co into Azure AD, you need to add Profit.co from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) by using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Go to **Enterprise Applications**, and then select **All Applications**.
1. To add a new application, select **New application**.
1. In the **Add from the gallery** section, type **Profit.co** in the search box.
1. Select **Profit.co** from the results panel, and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD single sign-on for Profit.co

Configure and test Azure AD SSO with Profit.co by using a test user called **B.Simon**. For SSO to work, establish a linked relationship between an Azure AD user and the related user in Profit.co.

Here are the general steps to configure and test Azure AD SSO with Profit.co:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Profit.co SSO](#configure-profitco-sso)** to configure the single sign-on settings on the application side.
    1. **[Create Profit.co test user](#create-a-profitco-test-user)** to have a counterpart of B.Simon in Profit.co. This counterpart is linked to the Azure AD representation of the user.
1. **[Test SSO](#test-sso)** to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **Profit.co** application integration page, find the **Manage** section. Select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot of Set up single sign-on with SAML page, with pencil icon highlighted](common/edit-urls.png)

1. In the **Basic SAML Configuration** section, the application is preconfigured and the necessary URLs are already prepopulated in Azure. Users need to save the configuration by selecting the **Save** button.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section, select the **Copy** button. This copies the **App Federation Metadata Url** and saves it on your computer.

    ![Screenshot of the SAML Signing Certificate, with the copy button highlighted](common/copy-metadataurl.png)

### Create an Azure AD test user

In this section, you create a test user in the Azure portal called B.Simon.

1. From the left pane in the Azure portal, select **Azure Active Directory** > **Users** > **All users**.
1. Select **New user** at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Name** field, enter `B.Simon`.  
   1. In the **User name** field, enter the username@companydomain.extension. For example, `B.Simon@contoso.com`.
   1. Select the **Show password** check box, and then write down the value that's shown in the **Password** field.
   1. Select **Create**.

### Assign the Azure AD test user

In this section, you enable B.Simon to use Azure single sign-on by granting access to Profit.co.

1. In the Azure portal, select **Enterprise Applications** > **All applications**.
1. In the applications list, select **Profit.co**.
1. In the app's overview page, find the **Manage** section, and select **Users and groups**.

   ![Screenshot of the Manage section, with Users and groups highlighted](common/users-groups-blade.png)

1. Select **Add user**. In the **Add Assignment** dialog box, select **Users and groups**.

    ![Screenshot of Users and groups page, with Add user highlighted](common/add-assign-user.png)

1. In the **Users and groups** dialog box, select **B.Simon** from the users list. Then choose the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog box, select the appropriate role for the user from the list. Then choose the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog box, select **Assign**.

## Configure Profit.co SSO

To configure single sign-on on the Profit.co side, you need to send the App Federation Metadata URL to the [Profit.co support team](mailto:support@profit.co). They configure this setting to have the SAML SSO connection set properly on both sides.

### Create a Profit.co test user

In this section, you create a user called B.Simon in Profit.co. Work with the [Profit.co support team](mailto:support@profit.co) to add the users in the Profit.co platform. You can't use single sign-on until you create and activate users.

## Test SSO

In this section, you test your Azure AD single sign-on configuration by using Access Panel.

When you select the Profit.co tile in Access Panel, you should be automatically signed in to the Profit.co for which you set up SSO. For more information, see [Introduction to Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [Tutorials for integrating SaaS applications with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [Try Profit.co with Azure AD](https://aad.portal.azure.com/)

- [What is session control in Microsoft Cloud App Security?](https://docs.microsoft.com/cloud-app-security/proxy-intro-aad)

- [How to protect Profit.co with advanced visibility and controls](https://docs.microsoft.com/cloud-app-security/proxy-intro-aad)
---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with Cyara CX Assurance Platform | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Cyara CX Assurance Platform.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 7387bc3b-2006-4d76-8011-efeb75190a2c
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: tutorial
ms.date: 05/06/2020
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with Cyara CX Assurance Platform

In this tutorial, you'll learn how to integrate Cyara CX Assurance Platform with Azure Active Directory (Azure AD). When you integrate Cyara CX Assurance Platform with Azure AD, you can:

* Control in Azure AD who has access to Cyara CX Assurance Platform.
* Enable your users to be automatically signed-in to Cyara CX Assurance Platform with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Cyara CX Assurance Platform single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Cyara CX Assurance Platform supports **IDP** initiated SSO
* Once you configure Cyara CX Assurance Platform you can enforce session control, which protect exfiltration and infiltration of your organization’s sensitive data in real-time. Session control extend from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/proxy-deployment-any-app).

## Adding Cyara CX Assurance Platform from the gallery

To configure the integration of Cyara CX Assurance Platform into Azure AD, you need to add Cyara CX Assurance Platform from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Cyara CX Assurance Platform** in the search box.
1. Select **Cyara CX Assurance Platform** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD single sign-on for Cyara CX Assurance Platform

Configure and test Azure AD SSO with Cyara CX Assurance Platform using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Cyara CX Assurance Platform.

To configure and test Azure AD SSO with Cyara CX Assurance Platform, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Cyara CX Assurance Platform SSO](#configure-cyara-cx-assurance-platform-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Cyara CX Assurance Platform test user](#create-cyara-cx-assurance-platform-test-user)** - to have a counterpart of B.Simon in Cyara CX Assurance Platform that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **Cyara CX Assurance Platform** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Set up single sign-on with SAML** page, enter the values for the following fields:

    a. In the **Identifier** text box, type a URL using the following pattern:
    `https://www.cyaraportal.us/cyarawebidentity/identity/<provider>`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://www.cyaraportal.us/cyarawebidentity/identity/<provider>/Acs`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier and Reply URL. Contact [Cyara CX Assurance Platform Client support team](mailto:support@cyara.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. In the **SAML Signing Certificate** section, click **Edit** button to open **SAML Signing Certificate** dialog.

	![Edit SAML Signing Certificate](common/edit-certificate.png)

1. In the **SAML Signing Certificate** section, copy the **Thumbprint Value** and save it on your computer.

    ![Copy Thumbprint value](common/copy-thumbprint.png)

1. On the **Set up Cyara CX Assurance Platform** section, copy the appropriate URL(s) based on your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

### Create an Azure AD test user

In this section, you'll create a test user in the Azure portal called B.Simon.

1. From the left pane in the Azure portal, select **Azure Active Directory**, select **Users**, and then select **All users**.
1. Select **New user** at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Name** field, enter `B.Simon`.  
   1. In the **User name** field, enter the username@companydomain.extension. For example, `B.Simon@contoso.com`.
   1. Select the **Show password** check box, and then write down the value that's displayed in the **Password** box.
   1. Click **Create**.

### Assign the Azure AD test user

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Cyara CX Assurance Platform.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Cyara CX Assurance Platform**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Cyara CX Assurance Platform SSO

To configure single sign-on on **Cyara CX Assurance Platform** side, you need to send the **Thumbprint Value** and appropriate copied URLs from Azure portal to [Cyara CX Assurance Platform support team](mailto:support@cyara.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Cyara CX Assurance Platform test user

In this section, you create a user called Britta Simon in Cyara CX Assurance Platform. Work with [Cyara CX Assurance Platform support team](mailto:support@cyara.com) to add the users in the Cyara CX Assurance Platform platform. Users must be created and activated before you use single sign-on.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Cyara CX Assurance Platform tile in the Access Panel, you should be automatically signed in to the Cyara CX Assurance Platform for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [ List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory ](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory? ](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [Try Cyara CX Assurance Platform with Azure AD](https://aad.portal.azure.com/)

- [What is session control in Microsoft Cloud App Security?](https://docs.microsoft.com/cloud-app-security/proxy-intro-aad)

- [How to protect Cyara CX Assurance Platform with advanced visibility and controls](https://docs.microsoft.com/cloud-app-security/proxy-intro-aad)
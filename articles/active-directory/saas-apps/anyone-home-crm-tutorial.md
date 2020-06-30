---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with Anyone Home CRM | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Anyone Home CRM.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 1de27845-c06e-44b0-892b-010b6854b711
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: tutorial
ms.date: 05/22/2020
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with Anyone Home CRM

In this tutorial, you'll learn how to integrate Anyone Home CRM with Azure Active Directory (Azure AD). When you integrate Anyone Home CRM with Azure AD, you can:

* Control in Azure AD who has access to Anyone Home CRM.
* Enable your users to be automatically signed-in to Anyone Home CRM with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Anyone Home CRM single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Anyone Home CRM supports **IDP** initiated SSO
* Once you configure Anyone Home CRM you can enforce session control, which protect exfiltration and infiltration of your organization’s sensitive data in real-time. Session control extend from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/proxy-deployment-any-app).

## Adding Anyone Home CRM from the gallery

To configure the integration of Anyone Home CRM into Azure AD, you need to add Anyone Home CRM from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Anyone Home CRM** in the search box.
1. Select **Anyone Home CRM** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.


## Configure and test Azure AD single sign-on for Anyone Home CRM

Configure and test Azure AD SSO with Anyone Home CRM using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Anyone Home CRM.

To configure and test Azure AD SSO with Anyone Home CRM, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Anyone Home CRM SSO](#configure-anyone-home-crm-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Anyone Home CRM test user](#create-anyone-home-crm-test-user)** - to have a counterpart of B.Simon in Anyone Home CRM that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **Anyone Home CRM** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Set up single sign-on with SAML** page, enter the values for the following fields:

    a. In the **Identifier** text box, type a URL using the following pattern:
    `https://app.anyonehome.com/webroot/files/simplesamlphp/www/module.php/saml/sp/metadata.php/<Anyone_Home_Provided_Unique_Value>`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://app.anyonehome.com/webroot/files/simplesamlphp/www/module.php/saml/sp/saml2-acs.php/<Anyone_Home_Provided_Unique_Value>`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier and Reply URL. Contact [Anyone Home CRM Client support team](mailto:support@anyonehome.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. On the **Set up single sign-on with SAML** page, In the **SAML Signing Certificate** section, click copy button to copy **App Federation Metadata Url** and save it on your computer.

	![The Certificate download link](common/copy-metadataurl.png)

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Anyone Home CRM.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Anyone Home CRM**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Anyone Home CRM SSO

To configure single sign-on on **Anyone Home CRM** side, you need to send the **App Federation Metadata Url** to [Anyone Home CRM support team](mailto:support@anyonehome.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Anyone Home CRM test user

In this section, you create a user called Britta Simon in Anyone Home CRM. Work with [Anyone Home CRM support team](mailto:support@anyonehome.com) to add the users in the Anyone Home CRM platform. Users must be created and activated before you use single sign-on.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Anyone Home CRM tile in the Access Panel, you should be automatically signed in to the Anyone Home CRM for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [ List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory ](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory? ](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [Try Anyone Home CRM with Azure AD](https://aad.portal.azure.com/)

- [What is session control in Microsoft Cloud App Security?](https://docs.microsoft.com/cloud-app-security/proxy-intro-aad)

- [How to protect Anyone Home CRM with advanced visibility and controls](https://docs.microsoft.com/cloud-app-security/proxy-intro-aad)

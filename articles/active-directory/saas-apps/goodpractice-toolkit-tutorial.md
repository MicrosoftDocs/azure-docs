---
title: 'Tutorial: Azure Active Directory integration with Mind Tools Toolkit | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Mind Tools Toolkit.
services: active-directory
documentationCenter: na
author: jeevansd
manager: daveba
ms.reviewer: barbkess

ms.assetid: 65b2979d-9e2f-4530-bc08-546975269ebc
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: tutorial
ms.date: 03/12/2020
ms.author: jeedes

ms.collection: M365-identity-device-management
---
# Tutorial: Azure Active Directory integration with Mind Tools Toolkit

In this tutorial, you learn how to integrate Mind Tools Toolkit with Azure Active Directory (Azure AD).
Integrating Mind Tools Toolkit with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to Mind Tools Toolkit.
* You can enable your users to be automatically signed-in to Mind Tools Toolkit (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with Mind Tools Toolkit, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Mind Tools Toolkit single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Mind Tools Toolkit supports **SP** initiated SSO
* Mind Tools Toolkit supports **Just In Time** user provisioning
* Once you configure Mind Tools Toolkit you can enforce session control, which protect exfiltration and infiltration of your organization’s sensitive data in real-time. Session control extend from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/proxy-deployment-any-app).

## Adding Mind Tools Toolkit from the gallery

To configure the integration of Mind Tools Toolkit into Azure AD, you need to add Mind Tools Toolkit from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Mind Tools Toolkit** in the search box.
1. Select **Mind Tools Toolkit** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Mind Tools Toolkit based on a test user called **B.Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in Mind Tools Toolkit needs to be established.

To configure and test Azure AD single sign-on with Mind Tools Toolkit, you need to complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    * **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    * **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Mind Tools Toolkit SSO](#configure-mind-tools-toolkit-sso)** - to configure the single sign-on settings on application side.
    * **[Create Mind Tools Toolkit test user](#create-mind-tools-toolkit-test-user)** - to have a counterpart of B.Simon in Mind Tools Toolkit that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

### Configure Azure AD SSO

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with Mind Tools Toolkit, perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **Mind Tools Toolkit** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, perform the following steps:

	In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://app.goodpractice.net/#/<subscriptionUrl>/s/<locationId>`.

	> [!Note]
	> The Sign-on URL value is not real. Update the value with the actual Sign-On URL. Contact [Mind Tools Toolkit Client support team](mailto:support@goodpractice.com) to get the value.

5. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

6. On the **Set up Mind Tools Toolkit** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Azure AD Identifier

	c. Logout URL

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Mind Tools Toolkit.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Mind Tools Toolkit**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Mind Tools Toolkit SSO

To configure single sign-on on **Mind Tools Toolkit** side, you need to send the downloaded **Federation Metadata XML** and appropriate copied URLs from Azure portal to [Mind Tools Toolkit support team](mailto:support@goodpractice.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Mind Tools Toolkit test user

In this section, a user called B.Simon is created in Mind Tools Toolkit. Mind Tools Toolkit supports **just-in-time provisioning**, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in Mind Tools Toolkit, a new one is created when you attempt to access Mind Tools Toolkit.

### Test SSO

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Mind Tools Toolkit tile in the Access Panel, you should be automatically signed in to the Mind Tools Toolkit for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [Try Mind Tools Toolkit with Azure AD](https://aad.portal.azure.com/)

- [What is session control in Microsoft Cloud App Security?](https://docs.microsoft.com/cloud-app-security/proxy-intro-aad)

- [How to protect Mind Tools Toolkit with advanced visibility and controls](https://docs.microsoft.com/cloud-app-security/proxy-intro-aad)
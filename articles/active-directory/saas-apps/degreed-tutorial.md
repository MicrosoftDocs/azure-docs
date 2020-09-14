---
title: 'Tutorial: Azure Active Directory integration with Degreed | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Degreed.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 08/27/2020
ms.author: jeedes
---
# Tutorial: Azure Active Directory integration with Degreed

In this tutorial, you learn how to integrate Degreed with Azure Active Directory (Azure AD).
Integrating Degreed with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to Degreed.
* You can enable your users to be automatically signed-in to Degreed (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with Degreed, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get one-month trial [here](https://azure.microsoft.com/pricing/free-trial/)
* Degreed single sign-on enabled subscription

> [!NOTE]
> This integration is also available to use from Azure AD US Government Cloud environment. You can find this application in the Azure AD US Government Cloud Application Gallery and configure it in the same way as you do from public cloud.

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Degreed supports **SP** initiated SSO

* Degreed supports **Just In Time** user provisioning

* Once you configure Degreed you can enforce Session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/proxy-deployment-aad)

## Adding Degreed from the gallery

To configure the integration of Degreed into Azure AD, you need to add Degreed from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Degreed** in the search box.
1. Select **Degreed** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD SSO

In this section, you configure and test Azure AD single sign-on with Degreed based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in Degreed needs to be established.

To configure and test Azure AD single sign-on with Degreed, you need to complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    * **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
    * **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
2. **[Configure Degreed SSO](#configure-degreed-sso)** - to configure the Single Sign-On settings on application side.
    * **[Create Degreed test user](#create-degreed-test-user)** - to have a counterpart of Britta Simon in Degreed that is linked to the Azure AD representation of user.
3. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **Degreed** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, perform the following steps:

    ![Degreed Domain and URLs single sign-on information](common/sp-identifier.png)

	a. In the **Sign on URL** text box, type a URL using the following pattern:
    `https://degreed.com/?orgsso=<company code>`

    b. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:
    `https://degreed.com/<instancename>`

    c. In the **Reply URL** text box, type a URL using the following pattern:
    `https://degreed.com/SAML/<instancename>`
	
	> [!NOTE]
	> These values are not real. Update these values with the actual Sign-on URL, Identifier and Reply URL. Contact [Degreed Client support team](mailto:admin@degreed.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

5. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

6. On the **Set up Degreed** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Azure Ad Identifier

	c. Logout URL

### Create an Azure AD test user 

In this section, you'll create a test user named B.Simon in the Azure portal.

1. In the left pane of the Azure portal, select **Azure Active Directory**, select **Users**, and then select **All users**.
1. At the top of the screen, select **New user**.
1. In the **User** properties, follow these steps:
   1. In the **Name** field, enter **B.Simon**.  
   1. In the **User name** field, enter `<username>@<companydomain>.<extension>`. For example: `B.Simon@contoso.com`.
   1. Select the **Show password** check box, and then make note of the value that's displayed in the **Password** box.
   1. Select **Create**.

### Assign the Azure AD test user

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Degreed.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Degreed**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

### Configure Degreed SSO

To configure single sign-on on **Degreed** side, you need to send the downloaded **Federation Metadata XML** and appropriate copied URLs from Azure portal to [Degreed support team](mailto:admin@degreed.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Degreed test user

The objective of this section is to create a user called Britta Simon in Degreed. Degreed supports just-in-time provisioning, which is by default enabled.

There is no action item for you in this section. A new user is created during an attempt to access Degreed if it doesn't exist yet.

> [!NOTE]
> If you need to create a user manually, you need to contact the [Degreed support team](mailto:admin@degreed.com).


## Test SSO

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Degreed tile in the Access Panel, you should be automatically signed in to the Degreed for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)


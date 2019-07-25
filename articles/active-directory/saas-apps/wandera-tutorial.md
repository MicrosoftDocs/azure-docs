---
title: 'Tutorial: Azure Active Directory integration with Wandera | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Wandera.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: a4615e56-1deb-423e-ad19-2e74c0d6d17a
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 07/04/2019
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Integrate Wandera with Azure Active Directory

In this tutorial, you'll learn how to integrate Wandera with Azure Active Directory (Azure AD). When you integrate Wandera with Azure AD, you can:

* Control in Azure AD who has access to Wandera.
* Enable your users to be automatically signed-in to Wandera with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get one-month free trial [here](https://azure.microsoft.com/pricing/free-trial/).
* Wandera single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Wandera supports **IDP** initiated SSO

## Adding Wandera from the gallery

To configure the integration of Wandera into Azure AD, you need to add Wandera from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Wandera** in the search box.
1. Select **Wandera** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.


## Configure and test Azure AD single sign-on

Configure and test Azure AD SSO with Wandera using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Wandera.

To configure and test Azure AD SSO with Wandera, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
2. **[Configure Wandera SSO](#configure-wandera-sso)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Create Wandera test user](#create-wandera-test-user)** - to have a counterpart of Britta Simon in Wandera that is linked to the Azure AD representation of user.
6. **[Test SSO](#test-sso)** - to verify whether the configuration works.

### Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **Wandera** application integration page, find the **Manage** section and select **Single sign-on**.
1. On the **Select a Single sign-on method** page, select **SAML**.
1. On the **Set up Single Sign-On with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, enter the values for the following fields:

    In the **Reply URL** text box, type a URL using the following pattern:
    `https://radar.wandera.com/saml/acs/<tenant id>`

	> [!NOTE]
	> The value is not real. Update the value with the actual Reply URL. Contact [Wandera Client support team](https://www.wandera.com/about-wandera/contact/#supportsection) to get the value. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section,  find **Metadata XML** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

1. On the **Set up Single Sign-On with SAML** page, click the edit/pen icon for **SAML Signing Certificate** to edit the settings.

	![Signing Option](common/signing-option.png)

	1. Select **Signing Option** as **Sign SAML response and assertion**.

	1. Select **Signing Algorithm** as **SHA-256**.

1. On the **Set up Wandera** section, copy the appropriate URL(s) based on your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

### Configure Wandera SSO

To configure single sign-on on **Wandera** side, you need to send the downloaded **Metadata XML** and appropriate copied URLs from Azure portal to [Wandera support team](https://www.wandera.com/about-wandera/contact/#supportsection). They set this setting to have the SAML SSO connection set properly on both sides.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Wandera.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Wandera**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

### Create Wandera test user

In this section, you create a user called Britta Simon in Wandera. Work with [Wandera support team](https://www.wandera.com/about-wandera/contact/#supportsection) to add the users in the Wandera platform. Users must be created and activated before you use single sign-on.

### Test SSO

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Wandera tile in the Access Panel, you should be automatically signed in to the Wandera for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)


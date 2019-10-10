---
title: 'Tutorial: Azure Active Directory integration with Reward Gateway | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Reward Gateway.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 34336386-998a-4d47-ab55-721d97708e5e
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 03/26/2019
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Reward Gateway

In this tutorial, you learn how to integrate Reward Gateway with Azure Active Directory (Azure AD).
Integrating Reward Gateway with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to Reward Gateway.
* You can enable your users to be automatically signed-in to Reward Gateway (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with Reward Gateway, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get a [free account](https://azure.microsoft.com/free/)
* Reward Gateway single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Reward Gateway supports **IDP** initiated SSO

## Adding Reward Gateway from the gallery

To configure the integration of Reward Gateway into Azure AD, you need to add Reward Gateway from the gallery to your list of managed SaaS apps.

**To add Reward Gateway from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Navigate to **Enterprise Applications** and then select the **All Applications** option.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add new application, click **New application** button on the top of dialog.

	![The New application button](common/add-new-app.png)

4. In the search box, type **Reward Gateway**, select **Reward Gateway** from result panel then click **Add** button to add the application.

	 ![Reward Gateway in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Reward Gateway based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in Reward Gateway needs to be established.

To configure and test Azure AD single sign-on with Reward Gateway, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure Reward Gateway Single Sign-On](#configure-reward-gateway-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Create Reward Gateway test user](#create-reward-gateway-test-user)** - to have a counterpart of Britta Simon in Reward Gateway that is linked to the Azure AD representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with Reward Gateway, perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **Reward Gateway** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Set up Single Sign-On with SAML** page, perform the following steps:

    ![Reward Gateway Domain and URLs single sign-on information](common/idp-intiated.png)

    a. In the **Identifier** text box, type a URL using the following pattern:
	
	| |
	|--|
	| `https://<companyname>.rewardgateway.com`|
	| `https://<companyname>.rewardgateway.co.uk/`|
	| `https://<companyname>.rewardgateway.co.nz/`|
	| `https://<companyname>.rewardgateway.com.au/`|

    b. In the **Reply URL** text box, type a URL using the following pattern:
	
	| |
	|--|
	|  `https://<companyname>.rewardgateway.com/Authentication/EndLogin?idp=<Unique Id>`|
	| `https://<companyname>.rewardgateway.co.uk/Authentication/EndLogin?idp=<Unique Id>`|
	| `https://<companyname>.rewardgateway.co.nz/Authentication/EndLogin?idp=<Unique Id>`|
	| `https://<companyname>.rewardgateway.com.au/Authentication/EndLogin?idp=<Unique Id>`|

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier and Reply URL. To get these values start setting up an Integration on the Reward Manager Portal. Details can be found on https://success.rewardgateway.com/authentication-integrations/microsoft-azure-for-authentication

5. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

6. On the **Set up Reward Gateway** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Azure Ad Identifier

	c. Logout URL

### Configure Reward Gateway Single Sign-On

To configure single sign-on on **Reward Gateway** side, start setting up an Integration on the Reward Manager Portal. Use the downloaded metadata to obtain your Signing Certificate and upload that during the configuration. Details can be found on https://success.rewardgateway.com/authentication-integrations/microsoft-azure-for-authentication

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

1. In the Azure portal, in the left pane, select **Azure Active Directory**, select **Users**, and then select **All users**.

    ![The "Users and groups" and "All users" links](common/users.png)

2. Select **New user** at the top of the screen.

    ![New user Button](common/new-user.png)

3. In the User properties, perform the following steps.

    ![The User dialog box](common/user-properties.png)

    a. In the **Name** field enter **BrittaSimon**.
  
    b. In the **User name** field type `brittasimon@yourcompanydomain.extension`  
    For example, BrittaSimon@contoso.com

    c. Select **Show password** check box, and then write down the value that's displayed in the Password box.

    d. Click **Create**.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Reward Gateway.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **Reward Gateway**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **Reward Gateway**.

	![The Reward Gateway link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog click the **Assign** button.

### Create Reward Gateway test user

In this section, you create a user called Britta Simon in Reward Gateway. Work with [Reward Gateway support team](mailto:clientsupport@rewardgateway.com) to add the users in the Reward Gateway platform. Users must be created and activated before you use single sign-on.

### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Reward Gateway tile in the Access Panel, you should be automatically signed in to the Reward Gateway for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

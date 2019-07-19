---
title: 'Tutorial: Azure Active Directory integration with Reflektive | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Reflektive.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 799a08b9-1ce6-46d1-9064-aa9f36f6604e
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 03/27/2019
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Reflektive

In this tutorial, you learn how to integrate Reflektive with Azure Active Directory (Azure AD).
Integrating Reflektive with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to Reflektive.
* You can enable your users to be automatically signed-in to Reflektive (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with Reflektive, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get one-month trial [here](https://azure.microsoft.com/pricing/free-trial/)
* Reflektive single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Reflektive supports **SP** and **IDP** initiated SSO

## Adding Reflektive from the gallery

To configure the integration of Reflektive into Azure AD, you need to add Reflektive from the gallery to your list of managed SaaS apps.

**To add Reflektive from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Navigate to **Enterprise Applications** and then select the **All Applications** option.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add new application, click **New application** button on the top of dialog.

	![The New application button](common/add-new-app.png)

4. In the search box, type **Reflektive**, select **Reflektive** from result panel then click **Add** button to add the application.

	 ![Reflektive in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Reflektive based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in Reflektive needs to be established.

To configure and test Azure AD single sign-on with Reflektive, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure Reflektive Single Sign-On](#configure-reflektive-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Create Reflektive test user](#create-reflektive-test-user)** - to have a counterpart of Britta Simon in Reflektive that is linked to the Azure AD representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with Reflektive, perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **Reflektive** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, perform the following step:

    ![Reflektive Domain and URLs single sign-on information](common/idp-identifier.png)

    In the **Identifier** text box, use one of the below URL as per confirmation from the reflective support team:

    | |
	|--|
	| `reflektive.com` |
	| `https://www.reflektive.com/saml/metadata` |
	| |

5. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    ![image](common/both-preintegrated-signon.png)

    In the **Sign-on URL** text box, type a URL:
    `https://www.reflektive.com/app`

	> [!NOTE]
	> For SP mode you need to get the email id registered with [Reflektive support team](https://support@reflektive.com). When you enter your ID in the **Email** textbox then the single sign-on option will be enabled. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

6. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

7. On the **Set up Reflektive** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Azure AD Identifier

	c. Logout URL

### Configure Reflektive Single Sign-On

To configure single sign-on on **Reflektive** side, you need to send the downloaded **Federation Metadata XML** and appropriate copied URLs from Azure portal to [Reflektive support team](mailto:https://support@reflektive.com/). They set this setting to have the SAML SSO connection set properly on both sides.

### Create an Azure AD test user 

The objective of this section is to create a test user in the Azure portal called Britta Simon.

1. In the Azure portal, in the left pane, select **Azure Active Directory**, select **Users**, and then select **All users**.

    ![The "Users and groups" and "All users" links](common/users.png)

2. Select **New user** at the top of the screen.

    ![New user Button](common/new-user.png)

3. In the User properties, perform the following steps.

    ![The User dialog box](common/user-properties.png)

    a. In the **Name** field enter **BrittaSimon**.
  
    b. In the **User name** field type brittasimon@yourcompanydomain.extension. For example, BrittaSimon@contoso.com

    c. Select **Show password** check box, and then write down the value that's displayed in the Password box.

    d. Click **Create**.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Reflektive.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **Reflektive**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **Reflektive**.

	![The Reflektive link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog click the **Assign** button.

### Create Reflektive test user

In this section, you create a user called Britta Simon in Reflektive. Work with [Reflektive support team](mailto:https://support@reflektive.com/) to add the users in the Reflektive platform. Users must be created and activated before you use single sign-on.

### Test single sign-on 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Reflektive tile in the Access Panel, you should be automatically signed in to the Reflektive for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)


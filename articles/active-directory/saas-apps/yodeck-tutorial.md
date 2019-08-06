---
title: 'Tutorial: Azure Active Directory integration with Yodeck | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Yodeck.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: b2c8dccb-eeb0-4f4d-a24d-8320631ce819
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 03/29/2019
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Yodeck

In this tutorial, you learn how to integrate Yodeck with Azure Active Directory (Azure AD).
Integrating Yodeck with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to Yodeck.
* You can enable your users to be automatically signed-in to Yodeck (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with Yodeck, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get a [free account](https://azure.microsoft.com/free/).
* Yodeck single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Yodeck supports **SP** and **IDP** initiated SSO

## Adding Yodeck from the gallery

To configure the integration of Yodeck into Azure AD, you need to add Yodeck from the gallery to your list of managed SaaS apps.

**To add Yodeck from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Navigate to **Enterprise Applications** and then select the **All Applications** option.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add new application, click **New application** button on the top of dialog.

	![The New application button](common/add-new-app.png)

4. In the search box, type **Yodeck**, select **Yodeck** from result panel then click **Add** button to add the application.

	 ![Yodeck in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Yodeck based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in Yodeck needs to be established.

To configure and test Azure AD single sign-on with Yodeck, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure Yodeck Single Sign-On](#configure-yodeck-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Create Yodeck test user](#create-yodeck-test-user)** - to have a counterpart of Britta Simon in Yodeck that is linked to the Azure AD representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with Yodeck, perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **Yodeck** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, perform the following step:

    ![Yodeck Domain and URLs single sign-on information](common/idp-identifier.png)

    In the **Identifier** text box, type a URL:
    `https://app.yodeck.com/api/v1/account/metadata/`

5. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    ![image](common/both-preintegrated-signon.png)

    In the **Sign-on URL** text box, type a URL:
    `https://app.yodeck.com/login`

6. On the **Set up Single Sign-On with SAML** page, In the **SAML Signing Certificate** section, click copy button to copy **App Federation Metadata Url** and save it on your computer.

	![The Certificate download link](common/copy-metadataurl.png)

### Configure Yodeck Single Sign-On

1. In a different web browser window, sign in to your Yodeck company site as an administrator.

2. Click on **User Settings** option form the top right corner of the page and select **Account Settings**.

	![Yodeck Configuration](./media/yodeck-tutorial/configure1.png)

3. Select **SAML** and perform the following steps:

	![Yodeck Configuration](./media/yodeck-tutorial/configure2.png)

	a. Select **Import from URL**.

	b. In the **URL** textbox, paste the **App Federation Metadata Url** value, which you have copied from the Azure portal and click **Import**.
	
	c. After importing **App Federation Metadata Url**, the remaining fields populate automatically.

	d. Click **Save**.

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

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Yodeck.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **Yodeck**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **Yodeck**.

	![The Yodeck link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog click the **Assign** button.

### Create Yodeck test user

To enable Azure AD users to sign in to Yodeck, they must be provisioned into Yodeck. In the case of Yodeck, provisioning is a manual task.

**To provision a user account, perform the following steps:**

1. Sign in to your Yodeck company site as an administrator.

2. Click on **User Settings** option form the top right corner of the page and select **Users**.

	![Add Employee](./media/yodeck-tutorial/user1.png)

3. Click on **+User** to open the **User Details** tab.

	![Add Employee](./media/yodeck-tutorial/user2.png)

4. On the **User Details** dialog page, perform the following steps:

	![Add Employee](./media/yodeck-tutorial/user3.png)

	a. In the **First Name** textbox, type the first name of the user like **Britta**.

	b. In the **Last Name** textbox, type the last name of user like **Simon**.

	c. In the **Email** textbox, type the email address of user like brittasimon@contoso.com.

	d. Select appropriate **Account Permissions** option as per your organizational requirement.
	
	e. Click **Save**.

### Test single sign-on 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Yodeck tile in the Access Panel, you should be automatically signed in to the Yodeck for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)


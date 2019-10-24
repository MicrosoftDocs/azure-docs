---
title: 'Tutorial: Azure Active Directory integration with Envi MMIS | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Envi MMIS.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: ab89f8ee-2507-4625-94bc-b24ef3d5e006
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 02/06/2019
ms.author: jeedes

ms.collection: M365-identity-device-management
---
# Tutorial: Azure Active Directory integration with Envi MMIS

In this tutorial, you learn how to integrate Envi MMIS with Azure Active Directory (Azure AD).
Integrating Envi MMIS with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to Envi MMIS.
* You can enable your users to be automatically signed-in to Envi MMIS (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with Envi MMIS, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get one-month trial [here](https://azure.microsoft.com/pricing/free-trial/)
* Envi MMIS single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Envi MMIS supports **SP** and **IDP** initiated SSO

## Adding Envi MMIS from the gallery

To configure the integration of Envi MMIS into Azure AD, you need to add Envi MMIS from the gallery to your list of managed SaaS apps.

**To add Envi MMIS from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Navigate to **Enterprise Applications** and then select the **All Applications** option.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add new application, click **New application** button on the top of dialog.

	![The New application button](common/add-new-app.png)

4. In the search box, type **Envi MMIS**, select **Envi MMIS** from result panel then click **Add** button to add the application.

	 ![Envi MMIS in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Envi MMIS based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in Envi MMIS needs to be established.

To configure and test Azure AD single sign-on with Envi MMIS, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure Envi MMIS Single Sign-On](#configure-envi-mmis-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Create Envi MMIS test user](#create-envi-mmis-test-user)** - to have a counterpart of Britta Simon in Envi MMIS that is linked to the Azure AD representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with Envi MMIS, perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **Envi MMIS** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set-up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, If you wish to configure the application in **IDP** initiated mode, perform the following steps:

    ![Envi MMIS Domain and URLs single sign-on information](common/idp-intiated.png)

    a. In the **Identifier** text box, type a URL using the following pattern:
    `https://www.<CUSTOMER DOMAIN>.com/Account`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://www.<CUSTOMER DOMAIN>.com/Account/Acs`

5. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    ![Envi MMIS Domain and URLs single sign-on information](common/metadata-upload-additional-signon.png)

    In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://www.<CUSTOMER DOMAIN>.com/Account`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier, Reply URL and Sign-on URL. Contact [Envi MMIS Client support team](mailto:support@ioscorp.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

6. On the **Set-up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

7. On the **Set up Envi MMIS** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Azure Ad Identifier

	c. Logout URL

### Configure Envi MMIS Single Sign-On

1. In a different web browser window, sign into your Envi MMIS site as an administrator.

2. Click on **My Domain** tab.

	![Configure Single Sign-On Save button](./media/envimmis-tutorial/configure1.png)

3. Click **Edit**.

	![Configure Single Sign-On Save button](./media/envimmis-tutorial/configure2.png)

4. Select **Use remote authentication** checkbox and then select **HTTP Redirect** from the **Authentication Type** dropdown.

	![Configure Single Sign-On Save button](./media/envimmis-tutorial/configure3.png)

5. Select **Resources** tab and then click **Upload Metadata**.

	![Configure Single Sign-On Save button](./media/envimmis-tutorial/configure4.png)

6. In the **Upload Metadata** popup, perform the following steps:

	![Configure Single Sign-On Save button](./media/envimmis-tutorial/configure5.png)

	a. Select **File** option from the **Upload From** dropdown.

	b. Upload the downloaded metadata file from Azure portal by selecting the **choose file icon**.

	c. Click **Ok**.

7. After uploading the downloaded metadata file, the fields will get populated automatically. Click **Update**

	![Configure Single Sign-On Save button](./media/envimmis-tutorial/configure6.png)

### Create an Azure AD test user 

The objective of this section is to create a test user in the Azure portal called Britta Simon.

1. In the Azure portal, in the left pane, select **Azure Active Directory**, select **Users**, and then select **All users**.

    ![The "Users and groups" and "All users" links](common/users.png)

2. Select **New user** at the top of the screen.

    ![New user Button](common/new-user.png)

3. In the User properties, perform the following steps.

    ![The User dialog box](common/user-properties.png)

    a. In the **Name** field, enter **BrittaSimon**.
  
    b. In the **User name** field, type **brittasimon\@yourcompanydomain.extension**  
    For example, BrittaSimon@contoso.com

    c. Select **Show password** check box, and then write down the value that's displayed in the Password box.

    d. Click **Create**.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Envi MMIS.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **Envi MMIS**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **Envi MMIS**.

	![The Envi MMIS link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog, select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog, select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog, click the **Assign** button.

### Create Envi MMIS test user

To enable Azure AD users to sign in to Envi MMIS, they must be provisioned into Envi MMIS. In the case of Envi MMIS, provisioning is a manual task.

**To provision a user account, perform the following steps:**

1. Sign in to your Envi MMIS company site as an administrator.

2. Click on **User List** tab.

	![Add Employee](./media/envimmis-tutorial/user1.png)

3. Click **Add User** button.

	![Add Employee](./media/envimmis-tutorial/user2.png)

4. In the **Add User** section, perform the following steps:

	![Add Employee](./media/envimmis-tutorial/user3.png)

	a. In the **User Name** textbox, type the username of Britta Simon account like **brittasimon\@contoso.com**.
	
	b. In the **First Name** textbox, type the first name of BrittaSimon like **Britta**.

	c. In the **Last Name** textbox, type the last name of BrittaSimon like **Simon**.

	d. Enter the Title of the user in the **Title** of the textbox.
	
	e. In the **Email Address** textbox, type the email address of Britta Simon account like **brittasimon\@contoso.com**.

	f. In the **SSO User Name** textbox, type the username of Britta Simon account like **brittasimon\@contoso.com**.

	g. Click **Save**.

### Test single sign-on 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Envi MMIS tile in the Access Panel, you should be automatically signed in to the Envi MMIS for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)


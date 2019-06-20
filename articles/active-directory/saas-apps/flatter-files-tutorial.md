---
title: 'Tutorial: Azure Active Directory integration with Flatter Files | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Flatter Files.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: f86fe5e3-0e91-40d6-869c-3df6912d27ea
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 02/15/2019
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Flatter Files

In this tutorial, you learn how to integrate Flatter Files with Azure Active Directory (Azure AD).
Integrating Flatter Files with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to Flatter Files.
* You can enable your users to be automatically signed-in to Flatter Files (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with Flatter Files, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get one-month trial [here](https://azure.microsoft.com/pricing/free-trial/)
* Flatter Files single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Flatter Files supports **IDP** initiated SSO

## Adding Flatter Files from the gallery

To configure the integration of Flatter Files into Azure AD, you need to add Flatter Files from the gallery to your list of managed SaaS apps.

**To add Flatter Files from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Navigate to **Enterprise Applications** and then select the **All Applications** option.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add new application, click **New application** button on the top of dialog.

	![The New application button](common/add-new-app.png)

4. In the search box, type **Flatter Files**, select **Flatter Files** from result panel then click **Add** button to add the application.

	 ![Flatter Files in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Flatter Files based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in Flatter Files needs to be established.

To configure and test Azure AD single sign-on with Flatter Files, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure Flatter Files Single Sign-On](#configure-flatter-files-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Create Flatter Files test user](#create-flatter-files-test-user)** - to have a counterpart of Britta Simon in Flatter Files that is linked to the Azure AD representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with Flatter Files, perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **Flatter Files** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, the user does not have to perform any step as the app is already pre-integrated with Azure.

    ![Flatter Files Domain and URLs single sign-on information](common/preintegrated.png)

5. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Base64)** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

6. On the **Set up Flatter Files** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Azure Ad Identifier

	c. Logout URL

### Configure Flatter Files Single Sign-On

1. Sign-on to your Flatter Files application as an administrator.

2. Click **DASHBOARD**. 
   
    ![Configure Single Sign-On](./media/flatter-files-tutorial/tutorial_flatter_files_05.png)  

3. Click **Settings**, and then perform the following steps on the **Company** tab: 
   
    ![Configure Single Sign-On](./media/flatter-files-tutorial/tutorial_flatter_files_06.png)  
    
	a. Select **Use SAML 2.0 for Authentication**.
    
	b. Click **Configure SAML**.

4. On the **SAML Configuration** dialog, perform the following steps: 
   
    ![Configure Single Sign-On](./media/flatter-files-tutorial/tutorial_flatter_files_08.png)  
   
    a. In the **Domain** textbox, type your registered domain.
   
   > [!NOTE]
   > If you don't have a registered domain yet, contact your Flatter Files support team via [support@flatterfiles.com](mailto:support@flatterfiles.com). 
    
    b. In **Identity Provider URL** textbox, paste the value of **Login URL** which you have copied form Azure portal.
   
    c.  Open your base-64 encoded certificate in notepad, copy the content of it into your clipboard, and then paste it to the **Identity Provider Certificate** textbox.

    d. Click **Update**.

### Create an Azure AD test user 

The objective of this section is to create a test user in the Azure portal called Britta Simon.

1. In the Azure portal, in the left pane, select **Azure Active Directory**, select **Users**, and then select **All users**.

    ![The "Users and groups" and "All users" links](common/users.png)

2. Select **New user** at the top of the screen.

    ![New user Button](common/new-user.png)

3. In the User properties, perform the following steps.

    ![The User dialog box](common/user-properties.png)

    a. In the **Name** field enter **BrittaSimon**.
  
    b. In the **User name** field type **brittasimon\@yourcompanydomain.extension**  
    For example, BrittaSimon@contoso.com

    c. Select **Show password** check box, and then write down the value that's displayed in the Password box.

    d. Click **Create**.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Flatter Files.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **Flatter Files**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **Flatter Files**.

	![The Flatter Files link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog click the **Assign** button.

### Create Flatter Files test user

The objective of this section is to create a user called Britta Simon in Flatter Files.

**To create a user called Britta Simon in Flatter Files, perform the following steps:**

1. Sign on to your **Flatter Files** company site as administrator.

2. In the navigation pane on the left, click **Settings**, and then click the **Users** tab.
   
    ![Create a Flatter Files User](./media/flatter-files-tutorial/tutorial_flatter_files_09.png)

3. Click **Add User**. 

4. On the **Add User** dialog, perform the following steps:
   
    ![Create a Flatter Files User](./media/flatter-files-tutorial/tutorial_flatter_files_10.png)

    a. In the **First Name** textbox, type **Britta**.
   
    b. In the **Last Name** textbox, type **Simon**. 
   
    c. In the **Email Address** textbox, type Britta's email address in the Azure portal.
   
    d. Click **Submit**.   


### Test single sign-on 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Flatter Files tile in the Access Panel, you should be automatically signed in to the Flatter Files for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)


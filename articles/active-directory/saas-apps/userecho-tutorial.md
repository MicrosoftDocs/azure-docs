---
title: 'Tutorial: Azure Active Directory integration with UserEcho | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and UserEcho.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: bedd916b-8f69-4b50-9b8d-56f4ee3bd3ed
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 03/29/2019
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with UserEcho

In this tutorial, you learn how to integrate UserEcho with Azure Active Directory (Azure AD).
Integrating UserEcho with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to UserEcho.
* You can enable your users to be automatically signed-in to UserEcho (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with UserEcho, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get a [free account](https://azure.microsoft.com/free/)
* UserEcho single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* UserEcho supports **SP** initiated SSO

## Adding UserEcho from the gallery

To configure the integration of UserEcho into Azure AD, you need to add UserEcho from the gallery to your list of managed SaaS apps.

**To add UserEcho from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Navigate to **Enterprise Applications** and then select the **All Applications** option.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add new application, click **New application** button on the top of dialog.

	![The New application button](common/add-new-app.png)

4. In the search box, type **UserEcho**, select **UserEcho** from result panel then click **Add** button to add the application.

	 ![UserEcho in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with UserEcho based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in UserEcho needs to be established.

To configure and test Azure AD single sign-on with UserEcho, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure UserEcho Single Sign-On](#configure-userecho-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Create UserEcho test user](#create-userecho-test-user)** - to have a counterpart of Britta Simon in UserEcho that is linked to the Azure AD representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with UserEcho, perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **UserEcho** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, perform the following steps:

    ![UserEcho Domain and URLs single sign-on information](common/sp-identifier.png)

	a. In the **Sign on URL** text box, type a URL using the following pattern:
    `https://<companyname>.userecho.com/`

    b. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:
    `https://<companyname>.userecho.com/saml/metadata/`

	> [!NOTE]
	> These values are not real. Update these values with the actual Sign on URL and Identifier. Contact [UserEcho Client support team](https://feedback.userecho.com/) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

4. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Base64)** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

6. On the **Set up UserEcho** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Azure AD Identifier

	c. Logout URL

### Configure UserEcho Single Sign-On

1. In another browser window, sign on to your UserEcho company site as an administrator.

2. In the toolbar on the top, click your user name to expand the menu, and then click **Setup**.
   
    ![Configure Single Sign-On](./media/userecho-tutorial/tutorial_userecho_06.png) 

3. Click **Integrations**.
   
    ![Configure Single Sign-On](./media/userecho-tutorial/tutorial_userecho_07.png) 

4. Click **Website**, and then click **Single sign-on (SAML2)**.
   
    ![Configure Single Sign-On](./media/userecho-tutorial/tutorial_userecho_08.png) 

5. On the **Single sign-on (SAML)** page, perform the following steps:
   
    ![Configure Single Sign-On](./media/userecho-tutorial/tutorial_userecho_09.png)
	
	a. As **SAML-enabled**, select **Yes**.
	
	b. Paste **Login URL**, which you have copied from the Azure portal into the **SAML SSO URL** textbox.
	
	c. Paste **Logout URL**, which you have copied from the Azure portal into the **Remote Logout URL** textbox.
	
	d. Open your downloaded certificate in Notepad, copy the content, and then paste it into the **X.509 Certificate** textbox.
	
	e. Click **Save**.

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

In this section, you enable Britta Simon to use Azure single sign-on by granting access to UserEcho.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **UserEcho**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **UserEcho**.

	![The UserEcho link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog click the **Assign** button.

### Create UserEcho test user

The objective of this section is to create a user called Britta Simon in UserEcho.

**To create a user called Britta Simon in UserEcho, perform the following steps:**

1. Sign-on to your UserEcho company site as an administrator.

2. In the toolbar on the top, click your user name to expand the menu, and then click **Setup**.
   
    ![Configure Single Sign-On](./media/userecho-tutorial/tutorial_userecho_06.png)

3. Click **Users**, to expand the **Users** section.
   
    ![Configure Single Sign-On](./media/userecho-tutorial/tutorial_userecho_10.png)

4. Click **Users**.
   
    ![Configure Single Sign-On](./media/userecho-tutorial/tutorial_userecho_11.png)

5. Click **Invite a new user**.
   
    ![Configure Single Sign-On](./media/userecho-tutorial/tutorial_userecho_12.png)

6. On the **Invite a new user** dialog, perform the following steps:
   
    ![Configure Single Sign-On](./media/userecho-tutorial/tutorial_userecho_13.png)

	a. In the **Name** textbox, type name of the user like Britta Simon.
	
	b.  In the **Email** textbox, type the email address of user like Brittasimon@contoso.com.
	
	c. Click **Invite**.

### Test single sign-on 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the UserEcho tile in the Access Panel, you should be automatically signed in to the UserEcho for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)


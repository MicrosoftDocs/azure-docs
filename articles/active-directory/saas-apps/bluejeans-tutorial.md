---
title: 'Tutorial: Azure Active Directory integration with BlueJeans | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and BlueJeans.
services: active-directory
documentationCenter: na
author: jeevansd
manager: daveba
ms.reviewer: barbkess

ms.assetid: dfc634fd-1b55-4ba8-94a8-b8288429b6a9
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 04/16/2019
ms.author: jeedes

ms.collection: M365-identity-device-management
---
# Tutorial: Azure Active Directory integration with BlueJeans

In this tutorial, you learn how to integrate BlueJeans with Azure Active Directory (Azure AD).
Integrating BlueJeans with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to BlueJeans.
* You can enable your users to be automatically signed-in to BlueJeans (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with BlueJeans, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get a [free account](https://azure.microsoft.com/free/)
* BlueJeans single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* BlueJeans supports **SP** initiated SSO

* BlueJeans supports [**Automated** user provisioning](bluejeans-provisioning-tutorial.md)

## Adding BlueJeans from the gallery

To configure the integration of BlueJeans into Azure AD, you need to add BlueJeans from the gallery to your list of managed SaaS apps.

**To add BlueJeans from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Navigate to **Enterprise Applications** and then select the **All Applications** option.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add new application, click **New application** button on the top of dialog.

	![The New application button](common/add-new-app.png)

4. In the search box, type **BlueJeans**, select **BlueJeans** from result panel then click **Add** button to add the application.

	 ![BlueJeans in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with BlueJeans based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in BlueJeans needs to be established.

To configure and test Azure AD single sign-on with BlueJeans, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure BlueJeans Single Sign-On](#configure-bluejeans-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Create BlueJeans test user](#create-bluejeans-test-user)** - to have a counterpart of Britta Simon in BlueJeans that is linked to the Azure AD representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with BlueJeans, perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **BlueJeans** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](media/bluejeans-tutorial/edit-urls-bluejeans.png)

4. In the **Basic SAML Configuration** dialog, enter the following values:

    ![BlueJeans Domain and URLs single sign-on information](media/bluejeans-tutorial/tutorial_bluejeans-basic-configuration.png)

   - In the **Identifier** text box, type the following:
    `http://samlsp.bluejeans.com`
    
   - In the **Sign-on URL** text box, type the landing page URL provided to you by BlueJeans (to get this value, you can contact the [BlueJeans Client support team](https://support.bluejeans.com/contact)):
    `https://<companyname>.bluejeans.com`
    
   - Click **Save**.

5. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Base64)** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

6. On the **Set up BlueJeans** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Azure AD Identifier

	c. Logout URL

### Configure BlueJeans Single Sign-On

1. In a different web browser window, sign in to your **BlueJeans** company site as an administrator.

2. Go to **ADMIN \> GROUP SETTINGS \> SECURITY**.

	![Admin](./media/bluejeans-tutorial/ic785868.png "Admin")

3. In the **SECURITY** section, perform the following steps:

	![SAML Single Sign On](./media/bluejeans-tutorial/ic785869.png "SAML Single Sign On")

	a. Select **SAML Single Sign On**.

	b. Select **Enable automatic provisioning**.

4. Move on with the following steps:

	![Certificate Path](./media/bluejeans-tutorial/ic785870.png "Certificate Path")

	a. Click **Choose File**, to upload the base-64 encoded certificate that you have downloaded from the Azure portal.

    b. In the **Login URL** textbox, paste the value of **Login URL** which you have copied from Azure portal.

    c. In the **Password Change URL** textbox, paste the value of **Change Password URL** which you have copied from Azure portal.

    d. In the **Logout URL** textbox, paste the value of **Logout URL** which you have copied from Azure portal.

5. Move on with the following steps:

	![Save Changes](./media/bluejeans-tutorial/ic785874.png "Save Changes")

	a. In the **User Id** textbox, type `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name`.

    b. In the **Email** textbox, type `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name`.

    c. Click **SAVE CHANGES**.

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

1. In the Azure portal, in the left pane, select **Azure Active Directory**, select **Users**, and then select **All users**.

    ![The "Users and groups" and "All users" links](common/users.png)

2. Select **New user** at the top of the screen.

    ![New user Button](common/new-user.png)

3. In the User properties, perform the following steps.

    ![The User dialog box](common/user-properties.png)

    a. In the **Name** field enter **BrittaSimon**.
  
    b. In the **User name** field type `brittasimon\@yourcompanydomain.extension`. For example, BrittaSimon@contoso.com.

    c. Select **Show password** check box, and then write down the value that's displayed in the Password box.

    d. Click **Create**.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to BlueJeans.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **BlueJeans**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **BlueJeans**.

	![The BlueJeans link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog click the **Assign** button.

### Create BlueJeans test user

The objective of this section is to create a user called Britta Simon in BlueJeans. BlueJeans supports automatic user provisioning, which is by default enabled. You can find more details [here](bluejeans-provisioning-tutorial.md) on how to configure automatic user provisioning.

**If you need to create user manually, perform following steps:**

1. Sign in to your **BlueJeans** company site as an administrator.

2. Go to **ADMIN \> MANAGE USERS \> ADD USER**.

	![Admin](./media/bluejeans-tutorial/ic785877.png "Admin")

	> [!IMPORTANT]
	> The **ADD USER** tab is only available if, in the **SECUTIRY tab**, **Enable automatic provisioning** is unchecked.

3. In the **ADD USER** section, perform the following steps:

	![Add User](./media/bluejeans-tutorial/ic785886.png "Add User")

	a. In **First Name** text box, enter the first name of user like **Britta**.

	b. In **Last Name** text box, enter the last name of user like **Simon**.

	c. In **Pick a BlueJeans Username** text box, enter the username of user like **Brittasimon**

	d. In **Create a Password** text box, enter your password.

	e. In **Company** text box, enter your Company.

	f. In **Email Address** text box, enter the email of user like `brittasimon\@contoso.com`.

	g. In **Create a BlueJeans Meeting I.D** text box, enter your meeting ID.

	h. In **Pick a Moderator Passcode** text box, enter your passcode.

	i. Click **CONTINUE**.

	![Add User](./media/bluejeans-tutorial/ic785887.png "Add User")

	J. Click **ADD USER**.

> [!NOTE]
> You can use any other BlueJeans user account creation tools or APIs provided by BlueJeans to provision Azure AD user accounts.

### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the BlueJeans tile in the Access Panel, you should be automatically signed in to the BlueJeans for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

---
title: 'Tutorial: Azure Active Directory integration with Silverback | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Silverback.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 32cfc96f-2137-49ff-818b-67feadcd73b7
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 03/07/2019
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Silverback

In this tutorial, you learn how to integrate Silverback with Azure Active Directory (Azure AD).
Integrating Silverback with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to Silverback.
* You can enable your users to be automatically signed-in to Silverback (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with Silverback, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get one-month trial [here](https://azure.microsoft.com/pricing/free-trial/)
* Silverback single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Silverback supports **SP** initiated SSO

## Adding Silverback from the gallery

To configure the integration of Silverback into Azure AD, you need to add Silverback from the gallery to your list of managed SaaS apps.

**To add Silverback from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Navigate to **Enterprise Applications** and then select the **All Applications** option.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add new application, click **New application** button on the top of dialog.

	![The New application button](common/add-new-app.png)

4. In the search box, type **Silverback**, select **Silverback** from result panel then click **Add** button to add the application.

	 ![Silverback in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Silverback based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in Silverback needs to be established.

To configure and test Azure AD single sign-on with Silverback, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure Silverback Single Sign-On](#configure-silverback-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Create Silverback test user](#create-silverback-test-user)** - to have a counterpart of Britta Simon in Silverback that is linked to the Azure AD representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with Silverback, perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **Silverback** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, perform the following steps:

    ![Silverback Domain and URLs single sign-on information](common/sp-identifier-reply.png)

    a. In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://<YOURSILVERBACKURL>.com/ssp`

    b. In the **Identifier** box, type a URL using the following pattern:
    `<YOURSILVERBACKURL>.com`

    c. In the **Reply URL** text box, type a URL using the following pattern:
    `https://<YOURSILVERBACKURL>.com/sts/authorize/login`

	> [!NOTE]
	> These values are not real. Update these values with the actual Sign-On URL, Identifier and Reply URL. Contact [Silverback Client support team](mailto:helpdesk@matrix42.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

5. On the **Set up Single Sign-On with SAML** page, In the **SAML Signing Certificate** section, click copy button to copy **App Federation Metadata Url** and save it on your computer.

	![The Certificate download link](common/copy-metadataurl.png)

### Configure Silverback Single Sign-On

1. In a different web browser, login to your Silverback Server as an Administrator.

2. Navigate to **Admin** > **Authentication Provider**.

3. On the **Authentication Provider Settings** page, perform the following steps:

	![The admin](./media/silverback-tutorial/tutorial_silverback_admin.png)

	a. 	Click on **Import from URL**.

	b.	Paste the copied Metadata URL and click **OK**.

	c.	Confirm with **OK** then the values will be populated automatically.

	d.	Enable **Show on Login Page**.

	e.	Enable **Dynamic User Creation** if you want to add by Azure AD authorized users automatically (optional).

	f.	Create a **Title** for the button on the Self Service Portal.

	g.	Upload an **Icon** by clicking on **Choose File**.

	h.	Select the background **color** for the button.

	i.	Click **Save**.

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

1. In the Azure portal, in the left pane, select **Azure Active Directory**, select **Users**, and then select **All users**.

    ![The "Users and groups" and "All users" links](common/users.png)

2. Select **New user** at the top of the screen.

    ![New user Button](common/new-user.png)

3. In the User properties, perform the following steps.

    ![The User dialog box](common/user-properties.png)

    a. In the **Name** field enter **BrittaSimon**.
  
    b. In the **User name** field type **brittasimon@yourcompanydomain.extension**  
    For example, BrittaSimon@contoso.com

    c. Select **Show password** check box, and then write down the value that's displayed in the Password box.

    d. Click **Create**.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Silverback.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **Silverback**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **Silverback**.

	![The Silverback link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog click the **Assign** button.

### Create Silverback test user

To enable Azure AD users to log in to Silverback, they must be provisioned into Silverback. In Silverback, provisioning is a manual task.

**To provision a user account, perform the following steps:**

1. Login to your Silverback Server as an Administrator.

2. Navigate to **Users** and **add a new device user**.

3. On the **Basic** page, perform the following steps:

	![The user](./media/silverback-tutorial/tutorial_silverback_user.png)

	a. In **Username** text box, enter the name of user like **Britta**.

	b. In **First Name** text box, enter the first name of user like **Britta**.

	c. In **Last Name** text box, enter the last name of user like **Simon**.

	d. In **E-mail Address** text box, enter the email of user like **Brittasimon@contoso.com**.

	e. In the **Password** text box, enter your password.

	f. In the **Confirm Password** text box, Re-enter your password and confirm.

	g. Click **Save**.

> [!NOTE]
> If you don’t want to create each user manually Enable the **Dynamic User Creation** Checkbox under **Admin** > **Authentication Provider**.

### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Silverback tile in the Access Panel, you should be automatically signed in to the Silverback for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)


---
title: 'Tutorial: Azure Active Directory integration with GitHub | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and GitHub.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila 
ms.reviewer: joflore

ms.assetid: 8761f5ca-c57c-4a7e-bf14-ac0421bd3b5e
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/15/2018
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with GitHub

In this tutorial, you learn how to integrate GitHub with Azure Active Directory (Azure AD).

Integrating GitHub with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to GitHub.
- You can enable your users to automatically get signed-on to GitHub (Single Sign-On) with their Azure AD accounts.
- You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Azure AD integration with GitHub, you need the following items:

- An Azure AD subscription
- A GitHub single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding GitHub from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding GitHub from the gallery
To configure the integration of GitHub into Azure AD, you need to add GitHub from the gallery to your list of managed SaaS apps.

**To add GitHub from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![image](./media/github-tutorial/selectazuread.png)

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![image](./media/github-tutorial/a_select_app.png)
	
3. To add new application, click **New application** button on the top of dialog.

	![image](./media/github-tutorial/a_new_app.png)

4. In the search box, type **GitHub**, select **GitHub** from result panel then click **Add** button to add the application.

	 ![image](./media/github-tutorial/tutorial_github_addfromgallery.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with GitHub based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in GitHub is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in GitHub needs to be established.

To configure and test Azure AD single sign-on with GitHub, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Create a GitHub test user](#create-a-github-test-user)** - to have a counterpart of Britta Simon in GitHub that is linked to the Azure AD representation of user.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your GitHub application.

**To configure Azure AD single sign-on with GitHub, perform the following steps:**

1. In the [Azure portal](https://portal.azure.com/), on the **GitHub** application integration page, select **Single sign-on**.

    ![image](./media/github-tutorial/b1_b2_select_sso.png)

2. On the **Select a Single sign-on method** dialog, Click **Select** for **SAML** mode to enable single sign-on.

    ![image](./media/github-tutorial/b1_b2_saml_sso.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** button to open **Basic SAML Configuration** dialog.

	![image](./media/github-tutorial/b1-domains_and_urlsedit.png)

4. On the **Basic SAML Configuration** section, perform the following steps:

	![image](./media/github-tutorial/tutorial_github_url.png) 

	a. In the **Sign on URL** textbox, type a URL using the following pattern: `https://github.com/orgs/<entity-id>/sso`

	b. In the **Identifier (Entity ID)** textbox, type a URL using the following pattern: `https://github.com/orgs/<entity-id>`

	> [!NOTE]
	> Please note that these are not the real values. You have to update these values with the actual Sign on URL and Identifier. Here we suggest you to use the unique value of string in the Identifier. Go to GitHub Admin section to retrieve these values.

5. GitHub application expects the SAML assertions in a specific format. Configure the following claims for this application. You can manage the values of these attributes from the **User Attributes** section on application integration page. Click **Edit** button to open **User Attributes** dialog.

	![image](./media/github-tutorial/i3-attribute.png)

6. In the **User Claims** section on the **User Attributes** dialog, configure SAML token attribute as shown in the image above and perform the following steps:
    
	a. Click **Edit** button to open the **Manage user claims** dialog.

	![image](./media/github-tutorial/i2-attribute.png)

	![image](./media/github-tutorial/i4-attribute.png)

	b. From the **Source attribute** list, select the attribute value.

	c. Click **Save**.
 
7. In the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Base64)** and save it on your computer.

	![image](./media/github-tutorial/tutorial_github_certficate.png)

8. On the **Set up GitHub** section, copy the appropriate URL as per your requirement.

	a. Login URL

	b. Azure AD Identifier

	c. Logout URL

	![image](./media/github-tutorial/d1_samlsonfigure.png) 

9. In a different web browser window, log into your GitHub organization site as an administrator.

10. Navigate to **Settings** and click **Security**

	![Settings](./media/github-tutorial/tutorial_github_config_github_03.png)

11. Check the **Enable SAML authentication** box, revealing the Single Sign-on configuration fields. Then, use the single sign-on URL value to update the Single sign-on URL on Azure AD configuration.

	![Settings](./media/github-tutorial/tutorial_github_config_github_13.png)

12. Configure the following fields:

	![Settings](./media/github-tutorial/tutorial_github_config_github_051.png)

	a. In the **Sign on URL** textbox, paste **Login URL** value which you have copied from the Azure portal.

	b. In the **Issuer** textbox, paste **Azure AD Identifier** value which you have copied from the Azure portal.

	c. Open the downloaded certificate from Azure portal in notepad, paste the content into the **Public Certificate** textbox.

	d. Click on **Edit** icon to edit the **Signature Method** and **Digest Method** from **RSA-SHA1** and **SHA1** to **RSA-SHA256** and **SHA256** as shown below.

	![image](./media/github-tutorial/tutorial_github_sha.png) 
	
13. Click on **Test SAML configuration** to confirm that no validation failures or errors during SSO.

	![Settings](./media/github-tutorial/tutorial_github_config_github_06.png)

14. Click **Save**

> [!NOTE]
> Single sign-on in GitHub authenticates to a specific organization in GitHub and does not replace the authentication of GitHub itself. Therefore, if the user's GitHub.com session has expired, you may be asked to authenticate with GitHub's ID/password during the single sign-on process.

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

1. In the Azure portal, in the left pane, select **Azure Active Directory**, select **Users**, and then select **All users**.

    ![image](./media/github-tutorial/d_users_and_groups.png)

2. Select **New user** at the top of the screen.

    ![image](./media/github-tutorial/d_adduser.png)

3. In the User properties, perform the following steps.

    ![image](./media/github-tutorial/d_userproperties.png)

    a. In the **Name** field enter **BrittaSimon**.
  
    b. In the **User name** field type **brittasimon@yourcompanydomain.extension**  
    For example, BrittaSimon@contoso.com

    c. Select **Properties**, select the **Show password** check box, and then write down the value that's displayed in the Password box.

    d. Select **Create**.
 
### Create a GitHub test user

The objective of this section is to create a user called Britta Simon in GitHub. GitHub supports automatic user provisioning, which is by default enabled. You can find more details [here](github-provisioning-tutorial.md) on how to configure automatic user provisioning.

**If you need to create user manually, perform following steps:**

1. Log in to your GitHub company site as an administrator.

2. Click **People**.

    ![People](./media/github-tutorial/tutorial_github_config_github_08.png "People")

3. Click **Invite member**.

	![Invite Users](./media/github-tutorial/tutorial_github_config_github_09.png "Invite Users")

4. On the **Invite member** dialog page, perform the following steps:

	a. In the **Email** textbox, type the email address of Britta Simon account.

	![Invite People](./media/github-tutorial/tutorial_github_config_github_10.png "Invite People")

    b. Click **Send Invitation**.

	![Invite People](./media/github-tutorial/tutorial_github_config_github_11.png "Invite People")

	> [!NOTE]
    > The Azure Active Directory account holder will receive an email and follow a link to confirm their account before it becomes active.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to GitHub.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**.

	![image](./media/github-tutorial/d_all_applications.png)

2. In the applications list, select **GitHub**.

	![image](./media/github-tutorial/tutorial_github_app.png)

3. In the menu on the left, select **Users and groups**.

    ![image](./media/github-tutorial/d_leftpaneusers.png)

4. Select the **Add** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![image](./media/github-tutorial/d_assign_user.png)

4. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

5. In the **Add Assignment** dialog select the **Assign** button.
	
### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the GitHub tile in the Access Panel, you should get automatically signed-on to your GitHub application.
For more information about the Access Panel, see [Introduction to the Access Panel](../active-directory-saas-access-panel-introduction.md). 

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)



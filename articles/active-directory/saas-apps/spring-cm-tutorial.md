---
title: 'Tutorial: Azure Active Directory integration with SpringCM | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and SpringCM.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 4a42f797-ac58-4aca-a8e6-53bfe5529083
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 04/08/2019
ms.author: jeedes

ms.collection: M365-identity-device-management
---
# Tutorial: Azure Active Directory integration with SpringCM

In this tutorial, you learn how to integrate SpringCM with Azure Active Directory (Azure AD).
Integrating SpringCM with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to SpringCM.
* You can enable your users to be automatically signed-in to SpringCM (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with SpringCM, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get a [free account](https://azure.microsoft.com/free/)
* SpringCM single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* SpringCM supports **SP** initiated SSO

## Adding SpringCM from the gallery

To configure the integration of SpringCM into Azure AD, you need to add SpringCM from the gallery to your list of managed SaaS apps.

**To add SpringCM from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click the **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Navigate to **Enterprise Applications** and then select the **All Applications** option.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add a new application, click the **New application** button at the top of the dialog.

	![The New application button](common/add-new-app.png)

4. In the search box, type **SpringCM**, select **SpringCM** from the result panel then click the **Add** button to add the application.

	![SpringCM in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with SpringCM based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in SpringCM needs to be established.

To configure and test Azure AD single sign-on with SpringCM, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure SpringCM Single Sign-On](#configure-springcm-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Create SpringCM test user](#create-springcm-test-user)** - to have a counterpart of Britta Simon in SpringCM that is linked to the Azure AD representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with SpringCM, perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **SpringCM** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, perform the following steps:

    ![SpringCM Domain and URLs single sign-on information](common/sp-signonurl.png)

    In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://na11.springcm.com/atlas/SSO/SSOEndpoint.ashx?aid=<identifier>`

	> [!NOTE]
	> The value is not real. Update the value with the actual Sign-On URL. Contact [SpringCM Client support team](https://knowledge.springcm.com/support) to get the value. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

4. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Raw)** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/certificateraw.png)

6. On the **Set up SpringCM** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Azure AD Identifier

	c. Logout URL

### Configure SpringCM Single Sign-On

1. In a different web browser window, sign on to your **SpringCM** company site as administrator.

1. In the menu on the top, click **GO TO**, click **Preferences**, and then, in the **Account Preferences** section, click **SAML SSO**.
   
    ![SAML SSO](./media/spring-cm-tutorial/ic797051.png "SAML SSO")

1. In the Identity Provider Configuration section, perform the following steps:
   
    ![Identity Provider Configuration](./media/spring-cm-tutorial/ic797052.png "Identity Provider Configuration")
	
	a. To upload your downloaded Azure Active Directory certificate, click **Select Issuer Certificate** or **Change Issuer Certificate**.
  	
	b. In the **Issuer** textbox, paste **Azure AD Identifier** value, which you have copied from Azure portal.
  	
	c. In the **Service Provider (SP) Initiated Endpoint** textbox, paste **Login URL** value, which you have copied from the Azure portal.
	    	
	d. Select **SAML Enabled** as **Enable**.

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
  
    b. In the **User name** field type `brittasimon@yourcompanydomain.extension`. For example, BrittaSimon@contoso.com

    c. Select **Show password** check box, and then write down the value that's displayed in the Password box.

    d. Click **Create**.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to SpringCM.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **SpringCM**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **SpringCM**.

	![The SpringCM link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog click the **Assign** button.

### Create SpringCM test user

To enable Azure Active Directory users to sign in to SpringCM, they must be provisioned into SpringCM. In the case of SpringCM, provisioning is a manual task.

> [!NOTE]
> For more information, see [Create and Edit a SpringCM User](http://community.springcm.com/s/article/Create-and-Edit-a-SpringCM-User-1619481053). 

**To provision a user account to SpringCM, perform the following steps:**

1. Sign in to your **SpringCM** company site as administrator.

1. Click **GOTO**, and then click **ADDRESS BOOK**.
   
    ![Create User](./media/spring-cm-tutorial/ic797054.png "Create User")

1. Click **Create User**.

1. Select a **User Role**.

1. Select **Send Activation Email**.

1. Type the first name, last name, and email address of a valid Azure Active Directory user account you want to provision into the related textboxes.

1. Add the user to a **Security group**.

1. Click **Save**.

   > [!NOTE]
   > You can use any other SpringCM user account creation tools or APIs provided by SpringCM to provision Azure AD user accounts.

### Test single sign-on 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the SpringCM tile in the Access Panel, you should be automatically signed in to the SpringCM for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)


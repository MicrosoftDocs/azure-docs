---
title: 'Tutorial: Azure Active Directory integration with Mimecast Personal Portal | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Mimecast Personal Portal.
services: active-directory
documentationCenter: na
author: jeevansd
manager: daveba
ms.reviewer: barbkess

ms.assetid: 345b22be-d87e-45a4-b4c0-70a67eaf9bfd
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 12/24/2018
ms.author: jeedes

ms.collection: M365-identity-device-management
---
# Tutorial: Azure Active Directory integration with Mimecast Personal Portal

In this tutorial, you learn how to integrate Mimecast Personal Portal with Azure Active Directory (Azure AD).
Integrating Mimecast Personal Portal with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to Mimecast Personal Portal.
* You can enable your users to be automatically signed-in to Mimecast Personal Portal (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with Mimecast Personal Portal, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get one-month trial [here](https://azure.microsoft.com/pricing/free-trial/)
* Mimecast Personal Portal single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Mimecast Personal Portal supports **SP** initiated SSO

## Adding Mimecast Personal Portal from the gallery

To configure the integration of Mimecast Personal Portal into Azure AD, you need to add Mimecast Personal Portal from the gallery to your list of managed SaaS apps.

**To add Mimecast Personal Portal from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Navigate to **Enterprise Applications** and then select the **All Applications** option.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add new application, click **New application** button on the top of dialog.

	![The New application button](common/add-new-app.png)

4. In the search box, type **Mimecast Personal Portal**, select **Mimecast Personal Portal** from result panel then click **Add** button to add the application.

	 ![Mimecast Personal Portal in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Mimecast Personal Portal based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in Mimecast Personal Portal needs to be established.

To configure and test Azure AD single sign-on with Mimecast Personal Portal, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure Mimecast Personal Portal Single Sign-On](#configure-mimecast-personal-portal-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Create Mimecast Personal Portal test user](#create-mimecast-personal-portal-test-user)** - to have a counterpart of Britta Simon in Mimecast Personal Portal that is linked to the Azure AD representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with Mimecast Personal Portal, perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **Mimecast Personal Portal** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, perform the following steps:

    ![Mimecast Personal Portal Domain and URLs single sign-on information](common/sp-identifier-reply.png)

    a. In the **Sign-on URL** textbox, type a URL: 

	| Region  |  Value | 
	| --------------- | --------------- | 
	| Europe          | `https://eu-api.mimecast.com/login/saml`|
	| United States   | `https://us-api.mimecast.com/login/saml`|
	| South Africa    | `https://za-api.mimecast.com/login/saml`|
	| Australia       | `https://au-api.mimecast.com/login/saml`|
	| Offshore        | `https://jer-api.mimecast.com/login/saml`|

	b. In the **Identifier** textbox, type a URL using the following pattern:

    | Region  |  Value | 
	| --------------- | --------------- |
	| Europe          | `https://eu-api.mimecast.com/sso/<accountcode>`|
	| United States   | `https://us-api.mimecast.com/sso/<accountcode>`|    
	| South Africa    | `https://za-api.mimecast.com/sso/<accountcode>`|
	| Australia       | `https://au-api.mimecast.com/sso/<accountcode>`|
	| Offshore        | `https://jer-api.mimecast.com/sso/<accountcode>`|

	c. In the **Reply URL** textbox, type a URL: 

	| Region  |  Value | 
	| --------------- | --------------- | 
	| Europe          | `https://eu-api.mimecast.com/login/saml`|
	| United States   | `https://us-api.mimecast.com/login/saml`|
	| South Africa    | `https://za-api.mimecast.com/login/saml`|
	| Australia       | `https://au-api.mimecast.com/login/saml`|
	| Offshore        | `https://jer-api.mimecast.com/login/saml`|

	> [!NOTE]
	> The Identifier value is not real. Update the value with the actual Identifier. Contact [Mimecast Personal Portal Client support team](https://www.mimecast.com/customer-success/technical-support/) to get the value. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

4. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Base64)** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

6. On the **Set up Mimecast Personal Portal** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Azure Ad Identifier

	c. Logout URL

### Configure Mimecast Personal Portal Single Sign-On

1. In a different web browser window, log into your Mimecast Personal Portal as an administrator.

2. Go to **Services \> Applications**.
   
    ![Applications](./media/mimecast-personal-portal-tutorial/ic794998.png "Applications")

3. Click **Authentication Profiles**.
   
    ![Authentication Profiles](./media/mimecast-personal-portal-tutorial/ic794999.png "Authentication Profiles")

4. Click **New Authentication Profile**.
   
    ![New Authentication Profile](./media/mimecast-personal-portal-tutorial/ic795000.png "New Authentication Profile")

5. In the **Authentication Profile** section, perform the following steps:
   
    ![Authentication Profile](./media/mimecast-personal-portal-tutorial/ic795001.png "Authentication Profile")
   
    a. In the **Description** textbox, type a name for your configuration.
   
    b. Select **Enforce SAML Authentication for Mimecast Personal Portal**.
   
    c. As **Provider**, select **Azure Active Directory**.
   
    d. In **Issuer URL** textbox, paste the value of **Azure Ad Identifier**, which you have copied from Azure portal.
   
    e. In **Login URL** textbox, paste the value of **Login URL**, which you have copied from Azure portal.
   
    f. In **Logout URL** textbox, paste the value of **Logout URL**, which you have copied from Azure portal.

	g. Open your **base-64** encoded certificate in notepad downloaded from Azure portal, copy the content of it into your clipboard, and then paste it to the **Identity Provider Certificate (Metadata)** textbox.

    h. Select **Allow Single Sign On**.
   
    i. Click **Save**.

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

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Mimecast Personal Portal.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **Mimecast Personal Portal**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, type and select **Mimecast Personal Portal**.

	![The Mimecast Personal Portal link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog click the **Assign** button.

### Create Mimecast Personal Portal test user

In order to enable Azure AD users to log into Mimecast Personal Portal, they must be provisioned into Mimecast Personal Portal. In the case of Mimecast Personal Portal, provisioning is a manual task.

You need to register a domain before you can create users.

**To configure user provisioning, perform the following steps:**

1. Sign on to your **Mimecast Personal Portal** as administrator.

2. Go to **Directories \> Internal**.
   
    ![Directories](./media/mimecast-personal-portal-tutorial/ic795003.png "Directories")

3. Click **Register New Domain**.
   
    ![Register New Domain](./media/mimecast-personal-portal-tutorial/ic795004.png "Register New Domain")

4. After your new domain has been created, click **New Address**.
   
    ![New Address](./media/mimecast-personal-portal-tutorial/ic795005.png "New Address")

5. In the new address dialog, perform the following steps of a valid Azure AD account you want to provision:
   
    ![Save](./media/mimecast-personal-portal-tutorial/ic795006.png "Save")
   
    a. In the **Email Address** textbox, type **Email Address** of the user as **BrittaSimon\@contoso.com**.
	
	b. In the **Global Name** textbox, type the **username** as **BrittaSimon**.

	c. In the **Password**, and **Confirm Password** textboxes, type the **Password** of the user.
   
    b. Click **Save**.

>[!NOTE]
>You can use any other Mimecast Personal Portal user account creation tools or APIs provided by Mimecast Personal Portal to provision Azure AD user accounts.

### Test single sign-on 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Mimecast Personal Portal tile in the Access Panel, you should be automatically signed in to the Mimecast Personal Portal for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)


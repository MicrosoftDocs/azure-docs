---
title: 'Tutorial: Azure Active Directory integration with InsideView | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and InsideView.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: c489a7ab-6b1f-4efb-8a66-8bc13bca78c3
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 03/20/2019
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with InsideView

In this tutorial, you learn how to integrate InsideView with Azure Active Directory (Azure AD).
Integrating InsideView with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to InsideView.
* You can enable your users to be automatically signed-in to InsideView (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with InsideView, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get a [free account](https://azure.microsoft.com/free/)
* InsideView single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* InsideView supports **IDP** initiated SSO

## Adding InsideView from the gallery

To configure the integration of InsideView into Azure AD, you need to add InsideView from the gallery to your list of managed SaaS apps.

**To add InsideView from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Navigate to **Enterprise Applications** and then select the **All Applications** option.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add new application, click **New application** button on the top of dialog.

	![The New application button](common/add-new-app.png)

4. In the search box, type **InsideView**, select **InsideView** from result panel then click **Add** button to add the application.

	![InsideView in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with InsideView based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in InsideView needs to be established.

To configure and test Azure AD single sign-on with InsideView, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure InsideView Single Sign-On](#configure-insideview-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Create InsideView test user](#create-insideview-test-user)** - to have a counterpart of Britta Simon in InsideView that is linked to the Azure AD representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with InsideView, perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **InsideView** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, perform the following steps:

    ![InsideView Domain and URLs single sign-on information](common/idp-reply.png)

    In the **Reply URL** text box, type a URL using the following pattern:
    `https://my.insideview.com/iv/<STS Name>/login.iv`

	> [!NOTE]
	> The value is not real. Update the value with the actual Reply URL. Contact [InsideView Client support team](mailto:support@insideview.com) to get the value. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

5. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Raw)** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/certificateraw.png)

6. On the **Set up InsideView** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Azure AD Identifier

	c. Logout URL

### Configure InsideView Single Sign-On

1. In a different web browser window, sign in to your InsideView company site as an administrator.

1. In the toolbar on the top, click **Admin**, **SingleSignOn Settings**, and then click **Add SAML**.
   
   ![SAML Single Sign On Settings](./media/insideview-tutorial/ic794135.png "SAML Single Sign On Settings")

1. In the **Add a New SAML** section, perform the following steps:

	![Add a New SAML](./media/insideview-tutorial/ic794136.png "Add a New SAML")

	a. In the **STS Name** textbox, type a name for your configuration.

	b. In **SamlP/WS-Fed Unsolicited EndPoint** textbox, paste the value of **Login URL**, which you have copied from Azure portal.

	c. Open your base-64 encoded certificate, which you have downloaded from Azure portal, copy the content of it into your clipboard, and then paste it to the **STS Certificate** textbox.

	d. In the **Crm User Id Mapping** textbox, type `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress`.

	e. In the **Crm Email Mapping** textbox, type `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress`.

	f. In the **Crm First Name Mapping** textbox, type `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname`.

	g. In the **Crm lastName Mapping** textbox, type `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname`.  

	h. Click **Save**.

### Create an Azure AD test user 

The objective of this section is to create a test user in the Azure portal called Britta Simon.

1. In the Azure portal, in the left pane, select **Azure Active Directory**, select **Users**, and then select **All users**.

    ![The "Users and groups" and "All users" links](common/users.png)

2. Select **New user** at the top of the screen.

    ![New user Button](common/new-user.png)

3. In the User properties, perform the following steps.

    ![The User dialog box](common/user-properties.png)

    a. In the **Name** field enter **BrittaSimon**.
  
    b. In the **User name** field type `brittasimon@yourcompanydomain.extension`. For example, BrittaSimon@contoso.com.

    c. Select **Show password** check box, and then write down the value that's displayed in the Password box.

    d. Click **Create**.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to InsideView.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **InsideView**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **InsideView**.

	![The InsideView link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog click the **Assign** button.

### Create InsideView test user

To enable Azure AD users to sign in to InsideView, they must be provisioned in to InsideView. In the case of InsideView, provisioning is a manual task.

To get users or contacts created in InsideView, Contact [InsideView support team](mailto:support@insideview.com).

> [!NOTE]
> You can use any other InsideView user account creation tools or APIs provided by InsideView to provision Azure AD user accounts.

### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the InsideView tile in the Access Panel, you should be automatically signed in to the InsideView for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

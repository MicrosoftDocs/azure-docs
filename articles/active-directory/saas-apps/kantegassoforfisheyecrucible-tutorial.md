---
title: 'Tutorial: Azure Active Directory integration with Kantega SSO for FishEye/Crucible | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Kantega SSO for FishEye/Crucible.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 9fe951fd-1530-4d33-a1a4-390385b99ce9
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
# Tutorial: Azure Active Directory integration with Kantega SSO for FishEye/Crucible

In this tutorial, you learn how to integrate Kantega SSO for FishEye/Crucible with Azure Active Directory (Azure AD).
Integrating Kantega SSO for FishEye/Crucible with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to Kantega SSO for FishEye/Crucible.
* You can enable your users to be automatically signed-in to Kantega SSO for FishEye/Crucible (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with Kantega SSO for FishEye/Crucible, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get a [free account](https://azure.microsoft.com/free/)
* Kantega SSO for FishEye/Crucible single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Kantega SSO for FishEye/Crucible supports **SP and IDP** initiated SSO

## Adding Kantega SSO for FishEye/Crucible from the gallery

To configure the integration of Kantega SSO for FishEye/Crucible into Azure AD, you need to add Kantega SSO for FishEye/Crucible from the gallery to your list of managed SaaS apps.

**To add Kantega SSO for FishEye/Crucible from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Navigate to **Enterprise Applications** and then select the **All Applications** option.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add new application, click **New application** button on the top of dialog.

	![The New application button](common/add-new-app.png)

4. In the search box, type **Kantega SSO for FishEye/Crucible**, select **Kantega SSO for FishEye/Crucible** from result panel then click **Add** button to add the application.

	![Kantega SSO for FishEye/Crucible in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Kantega SSO for FishEye/Crucible based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in Kantega SSO for FishEye/Crucible needs to be established.

To configure and test Azure AD single sign-on with Kantega SSO for FishEye/Crucible, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure Kantega SSO for FishEye/Crucible Single Sign-On](#configure-kantega-sso-for-fisheyecrucible-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Create Kantega SSO for FishEye/Crucible test user](#create-kantega-sso-for-fisheyecrucible-test-user)** - to have a counterpart of Britta Simon in Kantega SSO for FishEye/Crucible that is linked to the Azure AD representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with Kantega SSO for FishEye/Crucible, perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **Kantega SSO for FishEye/Crucible** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, perform the following steps:

    ![Kantega SSO for FishEye/Crucible Domain and URLs single sign-on information](common/idp-intiated.png)

    a. In the **Identifier** text box, type a URL using the following pattern:
    `https://<server-base-url>/plugins/servlet/no.kantega.saml/sp/<uniqueid>/login`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://<server-base-url>/plugins/servlet/no.kantega.saml/sp/<uniqueid>/login`

5. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    ![Kantega SSO for FishEye/Crucible Domain and URLs single sign-on information](common/metadata-upload-additional-signon.png)

    In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://<server-base-url>/plugins/servlet/no.kantega.saml/sp/<uniqueid>/login`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier, Reply URL, and Sign-On URL. These values are received during the configuration of FishEye/Crucible plugin which is explained later in the tutorial.

6. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

7. On the **Set up Kantega SSO for FishEye/Crucible** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Azure AD Identifier

	c. Logout URL

### Configure Kantega SSO for FishEye/Crucible Single Sign-On

1. In a different web browser window, sign in to your FishEye/Crucible on-premises server as an administrator.

1. Hover on cog and click the **Add-ons**.

	![Configure Single Sign-On](./media/kantegassoforfisheyecrucible-tutorial/addon1.png)

1. Under System Settings section, click **Find new add-ons**. 

	![Configure Single Sign-On](./media/kantegassoforfisheyecrucible-tutorial/add-on2.png)

1. Search **Kantega SSO for Crucible** and click **Install** button to install the new SAML plugin.

	![Configure Single Sign-On](./media/kantegassoforfisheyecrucible-tutorial/addon2.png)

1. The plugin installation starts. 

	![Configure Single Sign-On](./media/kantegassoforfisheyecrucible-tutorial/addon33.png)

1. Once the installation is complete. Click **Close**.

	![Configure Single Sign-On](./media/kantegassoforfisheyecrucible-tutorial/addon34.png)

1.	Click **Manage**.

	![Configure Single Sign-On](./media/kantegassoforfisheyecrucible-tutorial/addon35.png)

1. Click **Configure** to configure the new plugin.	

	![Configure Single Sign-On](./media/kantegassoforfisheyecrucible-tutorial/addon3.png)

1. In the **SAML** section. Select **Azure Active Directory (Azure AD)** from the **Add identity provider** dropdown.

	![Configure Single Sign-On](./media/kantegassoforfisheyecrucible-tutorial/addon4.png)

1. Select subscription level as **Basic**.

	![Configure Single Sign-On](./media/kantegassoforfisheyecrucible-tutorial/addon5.png)

1. On the **App properties** section, perform following steps:

	![Configure Single Sign-On](./media/kantegassoforfisheyecrucible-tutorial/addon6.png)

	a. Copy the **App ID URI** value and use it as **Identifier, Reply URL, and Sign-On URL** on the **Basic SAML Configuration** section in Azure portal.

	b. Click **Next**.

1. On the **Metadata import** section, perform following steps:

	![Configure Single Sign-On](./media/kantegassoforfisheyecrucible-tutorial/addon7.png)

	a. Select **Metadata file on my computer**, and upload metadata file, which you have downloaded from Azure portal.

	b. Click **Next**.

1. On the **Name and SSO location** section, perform following steps:

	![Configure Single Sign-On](./media/kantegassoforfisheyecrucible-tutorial/addon8.png)

	a. Add Name of the Identity Provider in **Identity provider name** textbox (e.g Azure AD).

	b. Click **Next**.

1. Verify the Signing certificate and click **Next**.	

	![Configure Single Sign-On](./media/kantegassoforfisheyecrucible-tutorial/addon9.png)

1. On the **FishEye user accounts** section, perform following steps:

	![Configure Single Sign-On](./media/kantegassoforfisheyecrucible-tutorial/addon10.png)

	a. Select **Create users in FishEye's internal Directory if needed** and enter the appropriate name of the group for users (can be multiple no. of groups separated by comma).

	b. Click **Next**.

1. Click **Finish**.

	![Configure Single Sign-On](./media/kantegassoforfisheyecrucible-tutorial/addon11.png)

1. On the **Known domains for Azure AD** section, perform following steps:	

	![Configure Single Sign-On](./media/kantegassoforfisheyecrucible-tutorial/addon12.png)

	a. Select **Known domains** from the left panel of the page.

	b. Enter domain name in the **Known domains** textbox.

	c. Click **Save**.

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

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Kantega SSO for FishEye/Crucible.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **Kantega SSO for FishEye/Crucible**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **Kantega SSO for FishEye/Crucible**.

	![The Kantega SSO for FishEye/Crucible link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog click the **Assign** button.

### Create Kantega SSO for FishEye/Crucible test user

To enable Azure AD users to sign in to FishEye/Crucible, they must be provisioned into FishEye/Crucible. In Kantega SSO for FishEye/Crucible, provisioning is a manual task.

**To provision a user account, perform the following steps:**

1. Sign in to your Crucible on-premises server as an administrator.

1. Hover on cog and click the **Users**.

    ![Add Employee](./media/kantegassoforfisheyecrucible-tutorial/user1.png)

1. Under **Users** tab section, click **Add user**.

	![Add Employee](./media/kantegassoforfisheyecrucible-tutorial/user2.png)

1. On the **Add New User** dialog page, perform the following steps:

	![Add Employee](./media/kantegassoforfisheyecrucible-tutorial/user3.png)

	a. In the **Username** textbox, type the email of user like Brittasimon@contoso.com.

	b. In the **Display Name** textbox, type display name of the user like Britta Simon.

	c. In the **Email address** textbox, type the email address of user like Brittasimon@contoso.com.

	d. In the **Password** textbox, type the password of user.

	e. In the **Confirm Password** textbox, reenter the password of user.

	f. Click **Add**.

### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Kantega SSO for FishEye/Crucible tile in the Access Panel, you should be automatically signed in to the Kantega SSO for FishEye/Crucible for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)
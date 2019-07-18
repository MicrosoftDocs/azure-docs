---
title: 'Tutorial: Azure Active Directory integration with HappyFox | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and HappyFox.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 8204ee77-f64b-4fac-b64a-25ea534feac0
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 02/15/2019
ms.author: jeedes

ms.collection: M365-identity-device-management
---
# Tutorial: Azure Active Directory integration with HappyFox

In this tutorial, you learn how to integrate HappyFox with Azure Active Directory (Azure AD).
Integrating HappyFox with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to HappyFox.
* You can enable your users to be automatically signed-in to HappyFox (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with HappyFox, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get one-month trial [here](https://azure.microsoft.com/pricing/free-trial/)
* HappyFox single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* HappyFox supports **SP** initiated SSO


* HappyFox supports **Just In Time** user provisioning


## Adding HappyFox from the gallery

To configure the integration of HappyFox into Azure AD, you need to add HappyFox from the gallery to your list of managed SaaS apps.

**To add HappyFox from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Navigate to **Enterprise Applications** and then select the **All Applications** option.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add new application, click **New application** button on the top of dialog.

	![The New application button](common/add-new-app.png)

4. In the search box, type **HappyFox**, select **HappyFox** from result panel then click **Add** button to add the application.

	 ![HappyFox in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with HappyFox based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in HappyFox needs to be established.

To configure and test Azure AD single sign-on with HappyFox, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure HappyFox Single Sign-On](#configure-happyfox-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Create HappyFox test user](#create-happyfox-test-user)** - to have a counterpart of Britta Simon in HappyFox that is linked to the Azure AD representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with HappyFox, perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **HappyFox** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, perform the following steps:

    ![HappyFox Domain and URLs single sign-on information](common/sp-identifier.png)

	a. In the **Sign on URL** text box, type a URL using the following pattern:
    `https://<subdomain>.happyfox.com/`

    b. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:
    `https://<subdomain>.happyfox.com/saml/metadata/`

	> [!NOTE]
	> These values are not real. Update these values with the actual Sign on URL and Identifier. Contact [HappyFox Client support team](https://support.happyfox.com/home) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

4. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Base64)** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

6. On the **Set up HappyFox** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Azure Ad Identifier

	c. Logout URL

### Configure HappyFox Single Sign-On

1. In a different web browser window, sign-on to your HappyFox tenant as an administrator.

2. Navigate to **Manage**, click on **Integrations** tab.

	![Configure Single Sign-On](./media/happyfox-tutorial/header.png) 

3. In the Integrations tab, click **Configure** under **SAML Integration** to open the Single Sign On Settings.

	![Configure Single Sign-On](./media/happyfox-tutorial/configure.png)

4. Inside SAML configuration section, paste the **Login URL** value, which you have copied from Azure portal into **SSO Target URL** textbox.

	![Configure Single Sign-On](./media/happyfox-tutorial/targeturl.png)

5. Open the certificate downloaded from Azure portal in notepad and paste its content in **IdP Signature** section.

	![Configure Single Sign-On](./media/happyfox-tutorial/cert.png)

6. Click **Save Settings** button.

	![Configure Single Sign-On](./media/happyfox-tutorial/savesettings.png)

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

In this section, you enable Britta Simon to use Azure single sign-on by granting access to HappyFox.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **HappyFox**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **HappyFox**.

	![The HappyFox link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog click the **Assign** button.

### Create HappyFox test user

In this section, a user called Britta Simon is created in HappyFox. HappyFox supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in HappyFox, a new one is created after authentication.

### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

1. When you click the HappyFox tile in the Access Panel, you should get login page of HappyFox application. You should see the **‘SAML’** button on the sign-in page.

	![Plugin](./media/happyfox-tutorial/saml.png)

2. Click the **SAML** button to log in to HappyFox using your Azure AD account.

For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)
---
title: 'Tutorial: Azure Active Directory integration with Displayr | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Displayr.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: b739b4e3-1a37-4e3c-be89-c3945487f4c1
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 05/03/2019
ms.author: jeedes

ms.collection: M365-identity-device-management
---
# Tutorial: Azure Active Directory integration with Displayr

In this tutorial, you learn how to integrate Displayr with Azure Active Directory (Azure AD).
Integrating Displayr with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to Displayr.
* You can enable your users to be automatically signed-in to Displayr (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with Displayr, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get a [free account](https://azure.microsoft.com/free/)
* Displayr single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Displayr supports **SP** initiated SSO

## Adding Displayr from the gallery

To configure the integration of Displayr into Azure AD, you need to add Displayr from the gallery to your list of managed SaaS apps.

**To add Displayr from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Navigate to **Enterprise Applications** and then select the **All Applications** option.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add new application, click **New application** button on the top of dialog.

	![The New application button](common/add-new-app.png)

4. In the search box, type **Displayr**, select **Displayr** from result panel then click **Add** button to add the application.

	![Displayr in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Displayr based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in Displayr needs to be established.

To configure and test Azure AD single sign-on with Displayr, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure Displayr Single Sign-On](#configure-displayr-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Create Displayr test user](#create-displayr-test-user)** - to have a counterpart of Britta Simon in Displayr that is linked to the Azure AD representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with Displayr, perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **Displayr** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set-up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, perform the following step:

    ![Displayr Domain and URLs single sign-on information](common/sp-intiated.png)

	In the **Sign-on URL** text box, type a URL:
    `https://app.displayr.com/Login`

5. In the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Raw)** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/certificateraw.png)

6. Displayr application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes. Click **Edit** icon to open User Attributes dialog.

	![image](common/edit-attribute.png)

7. In addition to above, Displayr application expects few more attributes to be passed back in SAML response. In the **User Attributes & Claims** section on the **Group Claims (Preview)** dialog, perform the following steps:

	a. Click the **pen** next to **Groups returned in claim**.

	![image](./media/displayr-tutorial/config04.png)

	![image](./media/displayr-tutorial/config05.png)

	b. Select **All Groups** from the radio list.

	c. Select **Source Attribute** of **Group ID**.

	d. Check **Customize the name of the group claim**.

	e. Check **Emit groups as role claims**.

	f. Click **Save**.

8. On the **Set-up Displayr** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Azure AD Identifier

	c. Logout URL

### Configure Displayr Single Sign-On

1. In a different web browser window, sign in to Displayr as an Administrator.

2. Click on **Settings** then navigate to **Account**.

	![Configuration](./media/displayr-tutorial/config01.png)

3. Switch to **Settings** from the top menu and scroll down the page for clicking **Configure Single Sign On (SAML)**.

	![Configuration](./media/displayr-tutorial/config02.png)

4. On the **Single Sign On (SAML)** page, perform the following steps:

	![Configuration](./media/displayr-tutorial/config03.png)

	a. Check the **Enable Single Sign On (SAML)** box.

	b. In the **Issuer** text box, paste the value of **Azure AD Identifier**, which you have copied from Azure portal.

	c. In the **Login URL** text box, paste the value of **Login URL**, which you have copied from Azure portal.

	d. In the **Logout URL** text box, paste the value of **Logout URL**, which you have copied from Azure portal.

	e. Open the Certificate (Raw) in Notepad, copy its content and paste it into the **Certificate** text box.

	f. **Group mappings** are optional.

	g. Click **Save**.	

### Create an Azure AD test user 

The objective of this section is to create a test user in the Azure portal called Britta Simon.

1. In the Azure portal, in the left pane, select **Azure Active Directory**, select **Users**, and then select **All users**.

    ![The "Users and groups" and "All users" links](common/users.png)

2. Select **New user** at the top of the screen.

    ![New user Button](common/new-user.png)

3. In the User properties, perform the following steps.

    ![The User dialog box](common/user-properties.png)

    a. In the **Name** field, enter **BrittaSimon**.
  
    b. In the **User name** field type `brittasimon@yourcompanydomain.extension`. For example, BrittaSimon@contoso.com

    c. Select **Show password** check box, and then write down the value that's displayed in the Password box.

    d. Click **Create**.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Displayr.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **Displayr**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **Displayr**.

	![The Displayr link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog, select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog, click the **Assign** button.

### Create Displayr test user

To enable Azure AD users, sign in to Displayr, they must be provisioned into Displayr. In Displayr, provisioning is a manual task.

**To provision a user account, perform the following steps:**

1. Sign in to Displayr as an Administrator.

2. Click on **Settings** then navigate to **Account**.

	![Displayr Configuration](./media/displayr-tutorial/config01.png)

3. Switch to **Settings** from the top menu and scroll down the page, until **Users** section then click on **New User**.

	![Displayr Configuration](./media/displayr-tutorial/config07.png)

4. On the **New User** page, perform the following steps:

	![Displayr Configuration](./media/displayr-tutorial/config06.png)

	a. In **Name** text box, enter the name of user like **Brittasimon**.

	b. In **Email** text box, enter the email of user like `Brittasimon@contoso.com`.

	c. Select your appropriate **Group membership**.

	d. Click **Save**.

### Test single sign-on 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Displayr tile in the Access Panel, you should be automatically signed in to the Displayr for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)


---
title: 'Tutorial: Azure Active Directory integration with LogicMonitor | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and LogicMonitor.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 496156c3-0e22-4492-b36f-2c29c055e087
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 02/25/2019
ms.author: jeedes

ms.collection: M365-identity-device-management
---
# Tutorial: Azure Active Directory integration with LogicMonitor

In this tutorial, you learn how to integrate LogicMonitor with Azure Active Directory (Azure AD).
Integrating LogicMonitor with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to LogicMonitor.
* You can enable your users to be automatically signed-in to LogicMonitor (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with LogicMonitor, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get one-month trial [here](https://azure.microsoft.com/pricing/free-trial/)
* LogicMonitor single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* LogicMonitor supports **SP** initiated SSO

## Adding LogicMonitor from the gallery

To configure the integration of LogicMonitor into Azure AD, you need to add LogicMonitor from the gallery to your list of managed SaaS apps.

**To add LogicMonitor from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Navigate to **Enterprise Applications** and then select the **All Applications** option.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add new application, click **New application** button on the top of dialog.

	![The New application button](common/add-new-app.png)

4. In the search box, type **LogicMonitor**, select **LogicMonitor** from result panel then click **Add** button to add the application.

	 ![LogicMonitor in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with LogicMonitor based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in LogicMonitor needs to be established.

To configure and test Azure AD single sign-on with LogicMonitor, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure LogicMonitor Single Sign-On](#configure-logicmonitor-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Create LogicMonitor test user](#create-logicmonitor-test-user)** - to have a counterpart of Britta Simon in LogicMonitor that is linked to the Azure AD representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with LogicMonitor, perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **LogicMonitor** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, perform the following steps:

    ![LogicMonitor Domain and URLs single sign-on information](common/sp-identifier.png)

	a. In the **Sign on URL** text box, type a URL using the following pattern:
    `https://<companyname>.logicmonitor.com`

    b. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:
    `https://<companyname>.logicmonitor.com`

	> [!NOTE]
	> These values are not real. Update these values with the actual Sign on URL and Identifier. Contact [LogicMonitor Client support team](https://www.logicmonitor.com/contact/) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

5. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

6. On the **Set up LogicMonitor** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Azure Ad Identifier

	c. Logout URL

### Configure LogicMonitor Single Sign-On

1. Log in to your **LogicMonitor** company site as an administrator.

2. In the menu on the top, click **Settings**.

    ![Settings](./media/logicmonitor-tutorial/ic790052.png "Settings")

3. In the navigation bat on the left side, click **Single Sign On**

    ![Single Sign-On](./media/logicmonitor-tutorial/ic790053.png "Single Sign-On")

4. In the **Single Sign-on (SSO) settings** section, perform the following steps:

    ![Single Sign-On Settings](./media/logicmonitor-tutorial/ic790054.png "Single Sign-On Settings")

    a. Select **Enable Single Sign-on**.

    b. As **Default Role Assignment**, select **readonly**.

    c. Open the downloaded metadata file in notepad, and then paste content of the file into the **Identity Provider Metadata** textbox.

    d. Click **Save Changes**.

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

In this section, you enable Britta Simon to use Azure single sign-on by granting access to LogicMonitor.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **LogicMonitor**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **LogicMonitor**.

	![The LogicMonitor link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog click the **Assign** button.

### Create LogicMonitor test user

For Azure AD users to be able to sign in, they must be provisioned to the LogicMonitor application using their Azure Active Directory user names.

**To configure user provisioning, perform the following steps:**

1. Log in to your LogicMonitor company site as an administrator.

2. In the menu on the top, click **Settings**, and then click **Roles and Users**.

    ![Roles and Users](./media/logicmonitor-tutorial/ic790056.png "Roles and Users")

3. Click **Add**.

4. In the **Add an account** section, perform the following steps:

    ![Add an account](./media/logicmonitor-tutorial/ic790057.png "Add an account")

    a. Type the **Username**, **Email**, **Password**, and **Retype password** values of the Azure Active Directory user you want to provision into the related textboxes.

    b. Select **Roles**, **View Permissions**, and the **Status**.

    c. Click **Submit**.

> [!NOTE]
> You can use any other LogicMonitor user account creation tools or APIs provided by LogicMonitor to provision Azure Active Directory user accounts.

### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the LogicMonitor tile in the Access Panel, you should be automatically signed in to the LogicMonitor for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)


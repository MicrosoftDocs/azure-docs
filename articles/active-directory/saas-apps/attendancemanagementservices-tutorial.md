---
title: 'Tutorial: Azure Active Directory integration with Attendance Management Services | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Attendance Management Services.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 1f56e612-728b-4203-a545-a81dc5efda00
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 04/15/2019
ms.author: jeedes

ms.collection: M365-identity-device-management
---
# Tutorial: Azure Active Directory integration with Attendance Management Services

In this tutorial, you learn how to integrate Attendance Management Services with Azure Active Directory (Azure AD).
Integrating Attendance Management Services with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to Attendance Management Services.
* You can enable your users to be automatically signed-in to Attendance Management Services (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with Attendance Management Services, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get a [free account](https://azure.microsoft.com/free/)
* Attendance Management Services single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Attendance Management Services supports **SP** initiated SSO

## Adding Attendance Management Services from the gallery

To configure the integration of Attendance Management Services into Azure AD, you need to add Attendance Management Services from the gallery to your list of managed SaaS apps.

**To add Attendance Management Services from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Navigate to **Enterprise Applications** and then select the **All Applications** option.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add new application, click **New application** button on the top of dialog.

	![The New application button](common/add-new-app.png)

4. In the search box, type **Attendance Management Services**, select **Attendance Management Services** from result panel then click **Add** button to add the application.

	![Attendance Management Services in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Attendance Management Services based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in Attendance Management Services needs to be established.

To configure and test Azure AD single sign-on with Attendance Management Services, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure Attendance Management Services Single Sign-On](#configure-attendance-management-services-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Create Attendance Management Services test user](#create-attendance-management-services-test-user)** - to have a counterpart of Britta Simon in Attendance Management Services that is linked to the Azure AD representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with Attendance Management Services, perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **Attendance Management Services** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, perform the following steps:

    ![Attendance Management Services Domain and URLs single sign-on information](common/sp-identifier.png)

	a. In the **Sign on URL** text box, type a URL using the following pattern:
    `https://id.obc.jp/<tenant information >/`

    b. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:
    `https://id.obc.jp/<tenant information >/`

	> [!NOTE]
	> These values are not real. Update these values with the actual Sign on URL and Identifier. Contact [Attendance Management Services Client support team](https://www.obcnet.jp/) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

5. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Base64)** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

6. On the **Set up Attendance Management Services** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Azure AD Identifier

	c. Logout URL

### Configure Attendance Management Services Single Sign-On

1. In a different browser window, sign-on to your Attendance Management Services company site as administrator.

1. Click on **SAML authentication** under the **Security management section**.

	![Attendance Management Services Configuration](./media/attendancemanagementservices-tutorial/user1.png)

1. Perform the following steps:

	![Attendance Management Services Configuration](./media/attendancemanagementservices-tutorial/user2.png)

	a. Select **Use SAML authentication**.

	b. In the **Identifier** textbox, paste the value of **Azure AD Identifier** value, which you have copied from Azure portal.

	c. In the **Authentication endpoint URL** textbox, paste the value of **Login URL** value, which you have copied from Azure portal.

	d. Click **Select a file** to upload the certificate which you downloaded from Azure AD.

	e. Select **Disable password authentication**.

	f. Click **Registration**

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

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Attendance Management Services.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **Attendance Management Services**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **Attendance Management Services**.

	![The Attendance Management Services link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog click the **Assign** button.

### Create Attendance Management Services test user

To enable Azure AD users to sign in to Attendance Management Services, they must be provisioned into Attendance Management Services. In the case of Attendance Management Services, provisioning is a manual task.

**To provision a user account, perform the following steps:**

1. Sign in to your Attendance Management Services company site as an administrator.

1. Click on **User management** under the **Security management section**.

	![Add Employee](./media/attendancemanagementservices-tutorial/user5.png)

1. Click **New rules login**.

    ![Add Employee](./media/attendancemanagementservices-tutorial/user3.png)

1. In the **OBCiD information** section, perform the following steps:

	![Add Employee](./media/attendancemanagementservices-tutorial/user4.png)

	a. In the **OBCiD** textbox, type the email of user like `BrittaSimon\@contoso.com`.

	b. In the **Password** textbox, type the password of user.

	c. Click **Registration**

### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Attendance Management Services tile in the Access Panel, you should be automatically signed in to the Attendance Management Services for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)
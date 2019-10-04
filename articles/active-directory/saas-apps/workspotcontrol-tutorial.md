---
title: 'Tutorial: Azure Active Directory integration with Workspot Control | Microsoft Docs'
description: Learn how to configure single sign-on for Azure Active Directory and Workspot Control.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 3ea8e4e9-f61f-4f45-b635-b0e306eda3d1
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 3/11/2019
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Workspot Control

In this tutorial, you learn how to integrate Workspot Control with Azure Active Directory (Azure AD). When you integrate Workspot Control with Azure AD, you can:

* Use Azure AD to control who has access to Workspot Control.
* Enable users to automatically sign in to Workspot Control (single sign-on [SSO]) by using their Azure AD accounts.
* Manage your accounts in one central location: the Azure portal.

For more information about SaaS app integration with Azure AD, see [Single sign-on to applications in Azure AD](https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on).

## Prerequisites

To configure Azure AD integration with Workspot Control, you need the following things:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get a [free account](https://azure.microsoft.com/free/).

* A Workspot Control single sign-on-enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

> [!Note]
> Workspot Control supports SP-initiated and IDP-initiated SSO.


## Adding Workspot Control from the gallery

To configure integration of Workspot Control into Azure AD, you must add Workspot Control from the gallery to your list of managed SaaS apps.

**To add Workspot Control from the gallery, follow these steps:**

1. In the left pane of the [Azure portal](https://portal.azure.com), select **Azure Active Directory**.

	![The Azure Active Directory button](common/select-azuread.png)

2. Go to **Enterprise Applications** and select **All Applications**.

	![The Enterprise applications pane](common/enterprise-applications.png)

3. Select **New application** at the top of the window.

	![The New application button](common/add-new-app.png)

4. In the search box, enter **Workspot Control**, select **Workspot Control** from the results panel, and then select **Add**.

	 !["Add from the gallery" window](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Workspot Control for a test user, Britta Simon.
For single sign-on to work, you must establish a link between an Azure AD user and the related user in Workspot Control.

To configure and test Azure AD single sign-on with Workspot Control, you must complete the following tasks:

1. [Configure Azure AD single sign-on](#configure-azure-ad-single-sign-on) to enable your users to use the feature.
2. [Configure Workspot Control single sign-on](#configure-workspot-control-single-sign-on) to configure the single sign-on settings on the application side.
3. [Create an Azure AD test user](#create-an-azure-ad-test-user) to test Azure AD single sign-on for Britta Simon.
4. [Assign the Azure AD test user](#assign-the-azure-ad-test-user) to enable Britta Simon to use Azure AD single sign-on.
5. [Create a Workspot Control test user](#create-a-workspot-control-test-user) to establish a counterpart of Britta Simon in Workspot Control that's linked to the Azure AD representation of the user.
6. [Test single sign-on](#test-single-sign-on) to verify that the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with Workspot Control, follow these steps:

1. On the **Workspot Control** application integration page in the [Azure portal](https://portal.azure.com/), select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. In the **Select a single sign-on method** window, select **SAML** mode to enable single sign-on.

    ![Select a single sign-on select method window](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, select the **Edit** (pencil) icon to access **Basic SAML Configuration**.

	![Edit icon highlighted in "Basic SAML Configuration"](common/edit-urls.png)

4. In the **Basic SAML Configuration** section, if you want to configure the application in IDP-initiated mode, follow these steps:

    ![Workspot Control domain and URLs single sign-on information](common/idp-intiated.png)

    1. In the **identifier** text box, enter a URL in the following pattern:<br/>
    ***https://<<i></i>INSTANCENAME>-saml.workspot.com/saml/metadata***

    1. In the **reply URL** text box, enter a URL in the following pattern:<br/>
    ***https://<<i></i>INSTANCENAME>-saml.workspot.com/saml/assertion***

5. If you want to configure the application in SP-initiated mode, select **Set additional URLs**.

    ![Workspot Control domain and URLs single sign-on information](common/metadata-upload-additional-signon.png)

    In the **Sign-on URL** text box, enter a URL in the following pattern:<br/>
    ***https://<<i></i>INSTANCENAME>-saml.workspot.com/***

	> [!NOTE]
	> These values are not real. Replace these values with the actual identifier, reply URL, and sign-on URL. Contact the [Workspot Control Client support team](mailto:support@workspot.com) to get these values. Or you can also refer to the patterns in the **Basic SAML Configuration** section of the Azure portal.

6. On the **Set Up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, select **Download** to download **Certificate (Base64)** from the available options as per your requirements. Save it to your computer.

	![The Certificate (Base64) download link](common/certificatebase64.png)

7. In the **Set up Workspot Control** section, copy the appropriate URLs as per your requirements:

	![Copy configuration URLs](common/copy-configuration-urls.png)

	- **Login URL**

	- **Azure AD Identifier**

	- **Logout URL**

### Configure Workspot Control single sign-on

1. In a different web browser window, sign in to Workspot Control as a Security Administrator.

2. In the toolbar at the top of the page, select **Setup** and then **SAML**.

	![Setup options](./media/workspotcontrol-tutorial/tutorial_workspotcontrol_setup.png)

3. In the **Security Assertion Markup Language Configuration** window, follow these steps:
 
	![Security Assertion Markup Language Configuration window](./media/workspotcontrol-tutorial/tutorial_workspotcontrol_saml.png)

	1. In the **Entity ID** box, paste the **Azure Ad Identifier** that you copied from the Azure portal.

	1. In the **Signon Service URL** box, paste the **Login URL** that you copied from the Azure portal.

	1. In the **Logout Service URL** box, paste the **Logout URL** that you copied from the Azure portal.

	1. Select **Update File** to upload into the X.509 certificate the base-64 encoded certificate that you downloaded from the Azure portal.

	1. Select **Save**.

### Create an Azure AD test user

In this section, you create a test user in the Azure portal.

1. In the left pane of the Azure portal, select **Azure Active Directory**, **Users**, and then **All users**.

    ![The "Users and groups" and "All users" links](common/users.png)

2. Select **New user** at the top of the window.

    ![The "New user" button](common/new-user.png)

3. In the properties for the user, follow these steps:

    ![The User properties window](common/user-properties.png)

    1. In the **Name** field,  enter **BrittaSimon**.
  
    1. In the **User name** field, enter **brittasimon@*yourcompanydomain.extension***. For example, enter **BrittaSimon@contoso.<i></i>com**.

    1. Select the **Show password** check box. Then write down the value that's displayed in the **Password** box.

    1. Select **Create**.

### Assign the Azure AD test user

In this section, you grant Britta Simon access to Workspot Control to enable her to use Azure single sign-on.

1. In the Azure portal, select **Enterprise Applications**, **All applications**, and then **Workspot Control**.

	![The Enterprise applications pane](common/enterprise-applications.png)

2. From the applications list, select **Workspot Control**.

	![The Workspot Control link in the Applications list](common/all-applications.png)

3. From the menu on the left side, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Select the **Add user** button. Then select **Users and groups** in the **Add assignment** window.

    ![The "Add Assignment" window](common/add-assign-user.png)

5. In the **Users and groups** window, select **Britta Simon** from the **Users** list. Then click **Select**.

6. If you expect any role value in the SAML assertion, select the appropriate role for the user from the list in the **Select Role** window. Then click **Select** at the bottom.

7. In the **Add Assignment** window, select **Assign**.

### Create a Workspot Control test user

To enable Azure AD users to sign in to Workspot Control, they must be provisioned into Workspot Control. Provisioning is a manual task.

**To provision a user account, follow these steps:**

1. Sign in to Workspot Control as a Security Administrator.

2. In the toolbar at the top of the page, select **Users** and then **Add User**.

	!["Users" options](./media/workspotcontrol-tutorial/tutorial_workspotcontrol_adduser.png)

3. In the **Add a New User** window, follow these steps:

	!["Add a New User" window](./media/workspotcontrol-tutorial/tutorial_workspotcontrol_addnewuser.png)

	1. In **First Name** box, enter the first name of a user, such as **Britta**.

	1. In **Last Name** text box, enter the last name of the user, such as **Simon**.

	1. In **Email** box, enter the email address of the user, such as **Brittasimon@contoso.<i></i>com**.

	1. Select the appropriate user role from the **Role** drop-down list.

	1. Select the appropriate user group from the **Group** drop-down list.

	1. Select **Add User**.

### Test single sign-on

In this section, we test our Azure AD single sign-on configuration through *Access Panel*.

When you click the **Workspot Control** tile in Access Panel, you should be automatically signed in to the Workspot Control for which you set up SSO. For more information, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/user-help/my-apps-portal-end-user-access).

## Additional resources

- [Tutorials for integrating SaaS applications with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/saas-apps/tutorial-list)

- [Single sign-on to applications in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

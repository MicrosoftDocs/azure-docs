---
title: 'Tutorial: Azure Active Directory integration with PagerDuty | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and PagerDuty.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 0410456a-76f7-42a7-9bb5-f767de75a0e0
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 03/14/2019
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with PagerDuty

In this tutorial, you learn how to integrate PagerDuty with Azure Active Directory (Azure AD).
Integrating PagerDuty with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to PagerDuty.
* You can enable your users to be automatically signed-in to PagerDuty (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with PagerDuty, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get one-month trial [here](https://azure.microsoft.com/pricing/free-trial/)
* PagerDuty single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* PagerDuty supports **SP** initiated SSO

## Adding PagerDuty from the gallery

To configure the integration of PagerDuty into Azure AD, you need to add PagerDuty from the gallery to your list of managed SaaS apps.

**To add PagerDuty from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Navigate to **Enterprise Applications** and then select the **All Applications** option.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add new application, click **New application** button on the top of dialog.

	![The New application button](common/add-new-app.png)

4. In the search box, type **PagerDuty**, select **PagerDuty** from result panel then click **Add** button to add the application.

	 ![PagerDuty in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with PagerDuty based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in PagerDuty needs to be established.

To configure and test Azure AD single sign-on with PagerDuty, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure PagerDuty Single Sign-On](#configure-pagerduty-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Create PagerDuty test user](#create-pagerduty-test-user)** - to have a counterpart of Britta Simon in PagerDuty that is linked to the Azure AD representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with PagerDuty, perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **PagerDuty** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, perform the following steps:

    ![PagerDuty Domain and URLs single sign-on information](common/sp-identifier.png)

	a. In the **Sign on URL** text box, type a URL using the following pattern:
    `https://<tenant-name>.pagerduty.com`

    b. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:
    `https://<tenant-name>.pagerduty.com`

	> [!NOTE]
	> These values are not real. Update these values with the actual Sign on URL and Identifier. Contact [PagerDuty Client support team](https://www.pagerduty.com/support/) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

5. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Base64)** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

6. On the **Set up PagerDuty** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Azure AD Identifier

	c. Logout URL

### Configure PagerDuty Single Sign-On

1. In a different web browser window, log into your Pagerduty company site as an administrator.

2. In the menu on the top, click **Account Settings**.

    ![Account Settings](./media/pagerduty-tutorial/ic778535.png "Account Settings")

3. Click **Single Sign-on**.

    ![Single sign-on](./media/pagerduty-tutorial/ic778536.png "Single sign-on")

4. On the **Enable Single Sign-on (SSO)** page, perform the following steps:

    ![Enable single sign-on](./media/pagerduty-tutorial/ic778537.png "Enable single sign-on")

    a. Open your base-64 encoded certificate downloaded from Azure portal in notepad, copy the content of it into your clipboard, and then paste it to the **X.509 Certificate** textbox
  
    b. In the **Login URL** textbox, paste **Login URL** which you have copied from Azure portal.
  
    c. In the **Logout URL** textbox, paste **Logout URL** which you have copied from Azure portal.

    d. Select **Allow username/password login**.

	e. Select **Require EXACT authentication context comparison** checkbox.

    f. Click **Save Changes**.

### Create an Azure AD test user 

The objective of this section is to create a test user in the Azure portal called Britta Simon.

1. In the Azure portal, in the left pane, select **Azure Active Directory**, select **Users**, and then select **All users**.

    ![The "Users and groups" and "All users" links](common/users.png)

2. Select **New user** at the top of the screen.

    ![New user Button](common/new-user.png)

3. In the User properties, perform the following steps.

    ![The User dialog box](common/user-properties.png)

    a. In the **Name** field enter **BrittaSimon**.
  
    b. In the **User name** field type **brittasimon@yourcompanydomain.extension**  
    For example, BrittaSimon@contoso.com

    c. Select **Show password** check box, and then write down the value that's displayed in the Password box.

    d. Click **Create**.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to PagerDuty.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **PagerDuty**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **PagerDuty**.

	![The PagerDuty link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog click the **Assign** button.

### Create PagerDuty test user

To enable Azure AD users to log in to PagerDuty, they must be provisioned into PagerDuty.  
In the case of PagerDuty, provisioning is a manual task.

>[!NOTE]
>You can use any other Pagerduty user account creation tools or APIs provided by Pagerduty to provision Azure Active Directory user accounts.

**To provision a user account, perform the following steps:**

1. Log in to your **Pagerduty** tenant.

2. In the menu on the top, click **Users**.

3. Click **Add Users**.
   
    ![Add Users](./media/pagerduty-tutorial/ic778539.png "Add Users")

4.  On the **Invite your team** dialog, perform the following steps:
   
    ![Invite your team](./media/pagerduty-tutorial/ic778540.png "Invite your team")

    a. Type the **First and Last Name** of user like **Britta Simon**. 
   
    b. Enter **Email** address of user like **brittasimon\@contoso.com**.
   
    c. Click **Add**, and then click **Send Invites**.
   
    >[!NOTE]
    >All added users will receive an invite to create a PagerDuty account.

### Test single sign-on 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the PagerDuty tile in the Access Panel, you should be automatically signed in to the PagerDuty for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)


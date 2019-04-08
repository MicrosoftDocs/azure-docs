---
title: 'Tutorial: Azure Active Directory integration with AlertOps | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and AlertOps.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 3db13ed4-35c2-4b1e-bed8-9b5977061f93
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 02/08/2019
ms.author: jeedes

ms.collection: M365-identity-device-management
---
# Tutorial: Azure Active Directory integration with AlertOps

In this tutorial, you learn how to integrate AlertOps with Azure Active Directory (Azure AD).
Integrating AlertOps with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to AlertOps.
* You can enable your users to be automatically signed-in to AlertOps (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with AlertOps, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get one-month trial [here](https://azure.microsoft.com/pricing/free-trial/)
* AlertOps single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* AlertOps supports **SP and IDP** initiated SSO

## Adding AlertOps from the gallery

To configure the integration of AlertOps into Azure AD, you need to add AlertOps from the gallery to your list of managed SaaS apps.

**To add AlertOps from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Navigate to **Enterprise Applications** and then select the **All Applications** option.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add new application, click **New application** button on the top of dialog.

	![The New application button](common/add-new-app.png)

4. In the search box, type **AlertOps**, select **AlertOps** from result panel then click **Add** button to add the application.

	![AlertOps in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with AlertOps based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in AlertOps needs to be established.

To configure and test Azure AD single sign-on with AlertOps, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure AlertOps Single Sign-On](#configure-alertops-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Create AlertOps test user](#create-alertops-test-user)** - to have a counterpart of Britta Simon in AlertOps that is linked to the Azure AD representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with AlertOps, perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **AlertOps** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, If you wish to configure the application in **IDP** initiated mode, perform the following steps:

    ![AlertOps Domain and URLs single sign-on information](common/idp-intiated.png)

    a. In the **Identifier** text box, type a URL using the following pattern:
    `https://<SUBDOMAIN>.alertops.com`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://<SUBDOMAIN>.alertops.com/login.aspx`

5. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    ![AlertOps Domain and URLs single sign-on information](common/metadata-upload-additional-signon.png)

    In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://<SUBDOMAIN>.alertops.com/login.aspx`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier, Reply URL and Sign-on URL. Contact [AlertOps Client support team](mailto:support@alertops.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

6. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Base64)** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

7. On the **Set up AlertOps** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Azure Ad Identifier

	c. Logout URL

### Configure AlertOps Single Sign-On

1. In a different browser window, sign-on to your AlertOps company site as administrator.

2. Click on the **Account settings** from the left navigation panel.

    ![AlertOps configuration](./media/alertops-tutorial/configure1.png)

3. On the **Subscription Settings** page select **SSO** and perform the following steps:

    ![AlertOps configuration](./media/alertops-tutorial/configure2.png)

    a. Select **Use Single Sign-On(SSO)** checkbox.

    b. Select **Azure Active Directory** as a **SSO Provider** from the dropdown.

    c. In the **Issuer URL** textbox, use the identifier value which you have used in the **Basic SAML Configuration** section in the Azure portal.

    d. In the **SAML endpoint URL** textbox, paste the **Login URL** value which you have copied from the Azure portal.

    e. In the **SLO endpoint URL** textbox, paste the **Login URL** value which you have copied from the Azure portal.

    f. Select **SHA256** as a **SAML Signature Algorithm** from the dropdown.

    g. Open your downloaded Certificate(Base64) file in Notepad. Copy the content of it into your clipboard, and then paste it to the X.509 Certificate text box.

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

In this section, you enable Britta Simon to use Azure single sign-on by granting access to AlertOps.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **AlertOps**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **AlertOps**.

	![The AlertOps link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog click the **Assign** button.

### Create AlertOps test user

1. In a different browser window, sign-on to your AlertOps company site as administrator.

2. Click on the **Users** from the left navigation panel.

    ![AlertOps configuration](./media/alertops-tutorial/user1.png)

3. Select **Add User**.

    ![AlertOps configuration](./media/alertops-tutorial/user2.png)

4. On the **Add User** dialog, perform the following steps:

    ![AlertOps configuration](./media/alertops-tutorial/user3.png)

    a. In the **Login User Name** textbox, enter the user name of the user like **Brittasimon**.

    b. In the **Official Email** textbox, enter the email address of the user like **Brittasimon\@contoso.com**.

    c. In the **First Name** textbox, enter the first name of user like **Britta**.

    d. In the **Last Name** textbox, enter the first name of user like **Simon**.

    e. Select the **Type** value from the dropdown as per your organization.

    f. Select the **Role** of the user from the dropdown as per your organization.

    g. Select **Add**.

### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the AlertOps tile in the Access Panel, you should be automatically signed in to the AlertOps for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

---
title: 'Tutorial: Azure Active Directory integration with RFPIO | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and RFPIO.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 87187076-7b50-4247-814f-f217b052703f
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 04/14/2019
ms.author: jeedes

ms.collection: M365-identity-device-management
---
# Tutorial: Azure Active Directory integration with RFPIO

In this tutorial, you learn how to integrate RFPIO with Azure Active Directory (Azure AD).
Integrating RFPIO with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to RFPIO.
* You can enable your users to be automatically signed-in to RFPIO (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with RFPIO, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get a [free account](https://azure.microsoft.com/free/)
* RFPIO single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* RFPIO supports **SP and IDP** initiated SSO

## Adding RFPIO from the gallery

To configure the integration of RFPIO into Azure AD, you need to add RFPIO from the gallery to your list of managed SaaS apps.

**To add RFPIO from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Navigate to **Enterprise Applications** and then select the **All Applications** option.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add new application, click **New application** button on the top of dialog.

	![The New application button](common/add-new-app.png)

4. In the search box, type **RFPIO**, select **RFPIO** from result panel then click **Add** button to add the application.

	![RFPIO in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with RFPIO based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in RFPIO needs to be established.

To configure and test Azure AD single sign-on with RFPIO, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure RFPIO Single Sign-On](#configure-rfpio-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Create RFPIO test user](#create-rfpio-test-user)** - to have a counterpart of Britta Simon in RFPIO that is linked to the Azure AD representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with RFPIO, perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **RFPIO** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, perform the following step:

    ![RFPIO Domain and URLs single sign-on information](common/idp-identifier.png)

    a. In the **Identifier** text box, type a URL using the following pattern:
    `https://www.rfpio.com`

    b. Click **Set additional URLs**.

    c. In the **Relay State** textbox enter a string value. Contact [RFPIO support team](https://www.rfpio.com/contact/) to get this value.

    ![RFPIO Domain and URLs single sign-on information](common/idp-preintegrated-relay.png)

5. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    ![image](common/both-preintegrated-signon.png)

    In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://www.app.rfpio.com`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier and Sign-on URL. Contact [RFPIO Client support team](https://www.rfpio.com/contact/) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

6. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

7. On the **Set up RFPIO** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Azure AD Identifier

	c. Logout URL

### Configure RFPIO Single Sign-On

1. In a different web browser window, sign in to the **RFPIO** website as an administrator.

1. Click on the bottom left corner dropdown.

	![Configure Single Sign-On](./media/rfpio-tutorial/app1.png)

1. Click on the **Organization Settings**. 

	![Configure Single Sign-On](./media/rfpio-tutorial/app2.png)

1. Click on the **FEATURES & INTEGRATION**.

	![Configure Single Sign-On](./media/rfpio-tutorial/app4.png)

1. In the **SAML SSO Configuration** Click **Edit**.

	![Configure Single Sign-On](./media/rfpio-tutorial/app3.png)

1. In this Section perform following actions:

	![Configure Single Sign-On](./media/rfpio-tutorial/app5.png)
	
	a. Copy the content of the **Downloaded Metadata XML** and paste it into the **identity configuration** field.

	> [!NOTE]
	>To copy the content of downloaded **Federation Metadata XML** Use **Notepad++** or proper **XML Editor**.

	b. Click **Validate**.

	c. After Clicking **Validate**, Flip **SAML(Enabled)** to on.

	d. Click **Submit**.

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

In this section, you enable Britta Simon to use Azure single sign-on by granting access to RFPIO.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **RFPIO**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **RFPIO**.

	![The RFPIO link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog click the **Assign** button.

### Create RFPIO test user

1. Sign in to your RFPIO company site as an administrator.

1. Click on the bottom left corner dropdown.

	![Configure Single Sign-On](./media/rfpio-tutorial/app1.png)

1. Click on the **Organization Settings**. 

	![Configure Single Sign-On](./media/rfpio-tutorial/app2.png)

1. Click **TEAM MEMBERS**.

	![Configure Single Sign-On](./media/rfpio-tutorial/app6.png)

1. Click on **ADD MEMBERS**.

	![Configure Single Sign-On](./media/rfpio-tutorial/app7.png)

1. In the **Add New Members** section. Perform following actions:

	![Configure Single Sign-On](./media/rfpio-tutorial/app8.png)

	a. Enter **Email address** in the **Enter one email per line** field.

	b. Please select **Role** according your requirements.

	c. Click **ADD MEMBERS**.

	> [!NOTE]
    > The Azure Active Directory account holder receives an email and follows a link to confirm their account before it becomes active.

### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the RFPIO tile in the Access Panel, you should be automatically signed in to the RFPIO for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)


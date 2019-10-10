---
title: 'Tutorial: Azure Active Directory integration with SECURE DELIVER | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and SECURE DELIVER.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: fccd5668-fe6f-4e6d-a9ce-ba4f321c33d1
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

# Tutorial: Azure Active Directory integration with SECURE DELIVER

In this tutorial, you learn how to integrate SECURE DELIVER with Azure Active Directory (Azure AD).
Integrating SECURE DELIVER with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to SECURE DELIVER.
* You can enable your users to be automatically signed-in to SECURE DELIVER (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with SECURE DELIVER, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get a [free account](https://azure.microsoft.com/free/)
* SECURE DELIVER single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* SECURE DELIVER supports **SP** initiated SSO

## Adding SECURE DELIVER from the gallery

To configure the integration of SECURE DELIVER into Azure AD, you need to add SECURE DELIVER from the gallery to your list of managed SaaS apps.

**To add SECURE DELIVER from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Navigate to **Enterprise Applications** and then select the **All Applications** option.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add new application, click **New application** button on the top of dialog.

	![The New application button](common/add-new-app.png)

4. In the search box, type **SECURE DELIVER**, select **SECURE DELIVER** from result panel then click **Add** button to add the application.

	![SECURE DELIVER in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with SECURE DELIVER based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in SECURE DELIVER needs to be established.

To configure and test Azure AD single sign-on with SECURE DELIVER, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure SECURE DELIVER Single Sign-On](#configure-secure-deliver-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Create SECURE DELIVER test user](#create-secure-deliver-test-user)** - to have a counterpart of Britta Simon in SECURE DELIVER that is linked to the Azure AD representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with SECURE DELIVER, perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **SECURE DELIVER** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, perform the following steps:

    ![SECURE DELIVER Domain and URLs single sign-on information](common/sp-identifier.png)

	a. In the **Sign on URL** text box, type a URL using the following pattern:
    `https://<companyname>.i-securedeliver.jp/sd/<tenantname>/jsf/login/sso`

    b. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:
    `https://<companyname>.i-securedeliver.jp/sd/<tenantname>/postResponse`

	> [!NOTE]
	> These values are not real. Update these values with the actual Sign on URL and Identifier. Contact [SECURE DELIVER Client support team](mailto:iw-sd-support@fujifilm.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

5. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Base64)** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

6. On the **Set up SECURE DELIVER** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Azure AD Identifier

	c. Logout URL

### Configure SECURE DELIVER Single Sign-On

To configure single sign-on on **SECURE DELIVER** side, you need to send the downloaded **Certificate (Base64)** and appropriate copied URLs from Azure portal to [SECURE DELIVER support team](mailto:iw-sd-support@fujifilm.com). They set this setting to have the SAML SSO connection set properly on both sides.

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

In this section, you enable Britta Simon to use Azure single sign-on by granting access to SECURE DELIVER.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **SECURE DELIVER**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **SECURE DELIVER**.

	![The SECURE DELIVER link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog click the **Assign** button.

### Create SECURE DELIVER test user

In this section, you create a user called Britta Simon in SECURE DELIVER. Work with [SECURE DELIVER support team](mailto:iw-sd-support@fujifilm.com) to add the users in the SECURE DELIVER platform. Users must be created and activated before you use single sign-on.

### Test single sign-on 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the SECURE DELIVER tile in the Access Panel, you should be automatically signed in to the SECURE DELIVER for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)


---
title: 'Tutorial: Azure Active Directory integration with Predictix Price Reporting | Microsoft Docs'
description: In this tutorial, you'll learn how to configure single sign-on between Azure Active Directory and Predictix Price Reporting.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 691d0c43-3aa1-4220-9e46-e7a88db234ad
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 03/26/2019
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Predictix Price Reporting

In this tutorial, you'll learn how to integrate Predictix Price Reporting with Azure Active Directory (Azure AD).

This integration provides these benefits:

* You can use Azure AD to control who has access to Predictix Price Reporting.
* You can enable your users to be automatically signed in to Predictix Price Reporting (single sign-on) with their Azure AD accounts.
* You can manage your accounts in one central location: the Azure portal.

To learn more about SaaS app integration with Azure AD, see [Single sign-on to applications in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you start.

## Prerequisites

To configure Azure AD integration with Predictix Price Reporting, you need to have the following:

* An Azure AD subscription. If you don't have an Azure AD environment, you can sign up for a [one-month trial](https://azure.microsoft.com/pricing/free-trial/) subscription.
* A Predictix Price Reporting subscription that has single sign-on enabled.

## Scenario description

In this tutorial, you'll configure and test Azure AD single sign-on in a test environment.

* Predictix Price Reporting supports SP-initiated SSO.

## Adding Predictix Price Reporting from the gallery

To set up the integration of Predictix Price Reporting into Azure AD, you need to add Predictix Price Reporting from the gallery to your list of managed SaaS apps.

1. In the [Azure portal](https://portal.azure.com), in the left pane, select **Azure Active Directory**:

	![Select Azure Active Directory](common/select-azuread.png)

2. Go to **Enterprise applications** > **All applications**:

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add an application, select **New application** at the top of the window:

	![Select New application](common/add-new-app.png)

4. In the search box, enter **Predictix Price Reporting**. Select **Predictix Price Reporting** in the search results and then select **Add**.

	 ![Search results](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you'll configure and test Azure AD single sign-on with Predictix Price Reporting by using a test user named **Britta Simon**.
To enable single sign-on, you need to establish a relationship between an Azure AD user and the corresponding user in Predictix Price Reporting.

To configure and test Azure AD single sign-on with Predictix Price Reporting, you need to complete these steps:

1. **[Configure Azure AD single sign-on](#configure-azure-ad-single-sign-on)** to enable the feature for your users.
2. **[Configure Predictix Price Reporting single sign-on](#configure-predictix-price-reporting-single-sign-on)** to set up single sign-on on the application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** to test Azure AD single sign-on.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** to enable Azure AD single sign-on for the user.
5. **[Create a Predictix Price Reporting test user](#create-a-predictix-price-reporting-test-user)** that's linked to the Azure AD representation of the user.
6. **[Test single sign-on](#test-single-sign-on)** to verify that the configuration works.

### Configure Azure AD single sign-on

In this section, you'll enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with Predictix Price Reporting, take these steps:

1. In the [Azure portal](https://portal.azure.com/), on the **Predictix Price Reporting** application integration page, select **Single sign-on**:

    ![Select Single sign-on](common/select-sso.png)

2. In the **Select a single sign-on method** dialog box, select **SAML/WS-Fed** mode to enable single sign-on:

    ![Select a sign-on method](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, select the **Edit** icon to open the **Basic SAML Configuration** dialog box:

	![Edit icon](common/edit-urls.png)

4. In the **Basic SAML Configuration** section, complete the following steps.

    ![Basic SAML Configuration section](common/sp-identifier.png)

	1. In the **Sign on URL** box, enter a URL in this pattern:

       `https://<companyname-pricing>.predictix.com/sso/request`

    1. In the **Identifier (Entity ID)** box, enter a URL in this pattern:

        | |
	    |--|
	    | `https://<companyname-pricing>.predictix.com` |
	    | `https://<companyname-pricing>.dev.predictix.com` |
	    | |

	> [!NOTE]
	> These values aren't real. You need to use the actual sign-on URL and identifier. Contact the [Predictix Price Reporting support team](https://www.infor.com/company/customer-center/) to get the values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

5. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, select the **Download** link next to **Certificate (Base64)**, per your requirements, and save the certificate on your computer:

	![Certificate download link](common/certificatebase64.png)

6. In the **Set up Predictix Price Reporting** section, copy the appropriate URLs, based on your requirements.

	![Copy the configuration URLs](common/copy-configuration-urls.png)

	1. **Login URL**.

	1. **Azure AD Identifier**.

	1. **Logout URL**.

### Configure Predictix Price Reporting Single Sign-On

To configure single sign-on on **Predictix Price Reporting** side, you need to send the downloaded **Certificate (Base64)** and appropriate copied URLs from Azure portal to [Predictix Price Reporting support team](https://www.infor.com/company/customer-center/). They set this setting to have the SAML SSO connection set properly on both sides.

### Create an Azure AD test user 

The objective of this section is to create a test user in the Azure portal called Britta Simon.

1. In the Azure portal, in the left pane, select **Azure Active Directory**, select **Users**, and then select **All users**.

    ![The "Users and groups" and "All users" links](common/users.png)

2. Select **New user** at the top of the screen.

    ![New user Button](common/new-user.png)

3. In the User properties, perform the following steps.

    ![The User dialog box](common/user-properties.png)

    a. In the **Name** field enter **BrittaSimon**.
  
    b. In the **User name** field type brittasimon@yourcompanydomain.extension. For example, BrittaSimon@contoso.com

    c. Select **Show password** check box, and then write down the value that's displayed in the Password box.

    d. Click **Create**.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Predictix Price Reporting.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **Predictix Price Reporting**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **Predictix Price Reporting**.

	![The Predictix Price Reporting link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog click the **Assign** button.

### Create Predictix Price Reporting test user

In this section, you create a user called Britta Simon in Predictix Price Reporting. Work with [Predictix Price Reporting support team](https://www.infor.com/company/customer-center/) to add the users in the Predictix Price Reporting platform. Users must be created and activated before you use single sign-on.

### Test single sign-on 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Predictix Price Reporting tile in the Access Panel, you should be automatically signed in to the Predictix Price Reporting for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)


---
title: 'Tutorial: Azure Active Directory integration with xMatters OnDemand | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and xMatters OnDemand.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: ca0633db-4f95-432e-b3db-0168193b5ce9
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 03/29/2019
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with xMatters OnDemand

In this tutorial, you learn how to integrate xMatters OnDemand with Azure Active Directory (Azure AD).
Integrating xMatters OnDemand with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to xMatters OnDemand.
* You can enable your users to be automatically signed-in to xMatters OnDemand (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with xMatters OnDemand, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get a [free account](https://azure.microsoft.com/free/).
* xMatters OnDemand single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* xMatters OnDemand supports **IDP** initiated SSO

## Adding xMatters OnDemand from the gallery

To configure the integration of xMatters OnDemand into Azure AD, you need to add xMatters OnDemand from the gallery to your list of managed SaaS apps.

**To add xMatters OnDemand from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Navigate to **Enterprise Applications** and then select the **All Applications** option.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add new application, click **New application** button on the top of dialog.

	![The New application button](common/add-new-app.png)

4. In the search box, type **xMatters OnDemand**, select **xMatters OnDemand** from result panel then click **Add** button to add the application.

	 ![xMatters OnDemand in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with xMatters OnDemand based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in xMatters OnDemand needs to be established.

To configure and test Azure AD single sign-on with xMatters OnDemand, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure xMatters OnDemand Single Sign-On](#configure-xmatters-ondemand-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Create xMatters OnDemand test user](#create-xmatters-ondemand-test-user)** - to have a counterpart of Britta Simon in xMatters OnDemand that is linked to the Azure AD representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with xMatters OnDemand, perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **xMatters OnDemand** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Set up Single Sign-On with SAML** page, perform the following steps:

    ![xMatters OnDemand Domain and URLs single sign-on information](common/idp-intiated.png)

    a. In the **Identifier** text box, type a URL using the following pattern:

    | |
	|--|
	| `https://<companyname>.au1.xmatters.com.au/`|
	| `https://<companyname>.cs1.xmatters.com/`|
	| `https://<companyname>.xmatters.com/`|
	| `https://www.xmatters.com`|
	| `https://<companyname>.xmatters.com.au/`|
	| |

    b. In the **Reply URL** text box, type a URL using the following pattern:

    | |
	|--|
	| `https://<companyname>.au1.xmatters.com.au`|
	| `https://<companyname>.xmatters.com/sp/<instancename>`|
	| `https://<companyname>.cs1.xmatters.com/sp/<instancename>`|
	| `https://<companyname>.au1.xmatters.com.au/<instancename>`|
	| |

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier and Reply URL. Contact [xMatters OnDemand Client support team](https://www.xmatters.com/company/contact-us/) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

5. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Base64)** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

	> [!IMPORTANT]
    > You need to forward the certificate to the [xMatters OnDemand support team](https://www.xmatters.com/company/contact-us/). The certificate needs to be uploaded by the xMatters support team before you can finalize the single sign-on configuration.

6. On the **Set up xMatters OnDemand** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Azure AD Identifier

	c. Logout URL

### Configure xMatters OnDemand Single Sign-On

1. In a different web browser window, sign in to your XMatters OnDemand company site as an administrator.

2. In the toolbar on the top, click **Admin**, and then click **Company Details** in the navigation bar on the left side.

    ![Admin](./media/xmatters-ondemand-tutorial/IC776795.png "Admin")

3. On the **SAML Configuration** page, perform the following steps:

    ![SAML configuration](./media/xmatters-ondemand-tutorial/IC776796.png "SAML configuration")

    a. Select **Enable SAML**.

    b. In the **Identity Provider ID** textbox, paste **Azure AD Identifier** value which you have copied from the Azure portal.

    c. In the **Single Sign On URL** textbox, paste **Login URL** value which you have copied from the Azure portal.

    d. In the **Single Logout URL** textbox, paste **Logout URL**, which you have copied from the Azure portal.

    e. On the Company Details page, at the top, click **Save Changes**.

    ![Company details](./media/xmatters-ondemand-tutorial/IC776797.png "Company details")

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

In this section, you enable Britta Simon to use Azure single sign-on by granting access to xMatters OnDemand.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **xMatters OnDemand**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **xMatters OnDemand**.

	![The xMatters OnDemand link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog click the **Assign** button.

### Create xMatters OnDemand test user

The objective of this section is to create a user called Britta Simon in xMatters OnDemand.

**If you need to create user manually, perform following steps:**

1. Sign in to your **XMatters OnDemand** tenant.

2. Click **Users** tab. and then click **Add User**.

	![Users](./media/xmatters-ondemand-tutorial/IC781048.png "Users")

3. In the **Add a User** section, perform the following steps:

    ![Add a User](./media/xmatters-ondemand-tutorial/IC781049.png "Add a User")

	a. Select **Active**.

	b. In the **User ID** textbox, type the user id of user like Brittasimon@contoso.com.

    c. In the **First Name** textbox, type first name of the user like Britta.

	d. In the **Last Name** textbox, type last name of the user like Simon.

	e. In the **Site** textbox, Enter the valid site of a valid Azure AD account you want to provision.

    f. Click **Save**.

### Test single sign-on 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the xMatters OnDemand tile in the Access Panel, you should be automatically signed in to the xMatters OnDemand for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)


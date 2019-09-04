---
title: 'Tutorial: Azure Active Directory integration with Appinux | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Appinux.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: f329341b-fb77-42e5-b6a6-0cd641d19670
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 1/17/2019
ms.author: jeedes

ms.collection: M365-identity-device-management
---
# Tutorial: Azure Active Directory integration with Appinux

In this tutorial, you learn how to integrate Appinux with Azure Active Directory (Azure AD).
Integrating Appinux with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to Appinux.
* You can enable your users to be automatically signed-in to Appinux (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with Appinux, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get one-month trial [here](https://azure.microsoft.com/pricing/free-trial/)
* Appinux single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Appinux supports **SP** initiated SSO
* Appinux supports **Just In Time** user provisioning

## Adding Appinux from the gallery

To configure the integration of Appinux into Azure AD, you need to add Appinux from the gallery to your list of managed SaaS apps.

**To add Appinux from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Navigate to **Enterprise Applications** and then select the **All Applications** option.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add new application, click **New application** button on the top of dialog.

	![The New application button](common/add-new-app.png)

4. In the search box, type **Appinux**, select **Appinux** from result panel then click **Add** button to add the application.

	 ![Appinux in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Appinux based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in Appinux needs to be established.

To configure and test Azure AD single sign-on with Appinux, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure Appinux Single Sign-On](#configure-appinux-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Create Appinux test user](#create-appinux-test-user)** - to have a counterpart of Britta Simon in Appinux that is linked to the Azure AD representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with Appinux, perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **Appinux** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, perform the following steps:

    ![Appinux Domain and URLs single sign-on information](common/sp-identifier.png)

	a. In the **Sign on URL** text box, type a URL using the following pattern:
    `https://<Appinux_SUBDOMAIN>.appinux.com`

    b. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:
    `https://<Appinux_SUBDOMAIN>.appinux.com/simplesaml/module.php/saml/sp/metadata.php/default-sp`

	> [!NOTE]
	> These values are not real. Update these values with the actual Sign on URL and Identifier. Contact [Appinux Client support team](https://support.appinux.com/) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

5. Appinux application expects the SAML assertions in a specific format. Configure the following claims for this application. You can manage the values of these attributes from the **User Attributes** section on application integration page. On the **Set up Single Sign-On with SAML** page, click **Edit** button to open **User Attributes** dialog.

	![image](common/edit-attribute.png)

6. In the **User Claims** section on the **User Attributes** dialog, edit the claims by using **Edit icon** or add the claims by using **Add new claim** to configure SAML token attribute as shown in the image above and perform the following steps: 

	| **Name** | **Namespace** | **Source Attribute**|
	| ---------|---------------| --------- |
	| `givenname` | `http://schemas.xmlsoap.org/ws/2005/05/identity/claims` | `user.givenname` |
	| `surname` | `http://schemas.xmlsoap.org/ws/2005/05/identity/claims` | `user.surname` |
	| `emailaddress` | `http://schemas.xmlsoap.org/ws/2005/05/identity/claims` | `user.mail` |
	| `name` | `http://schemas.xmlsoap.org/ws/2005/05/identity/claims` | `user.userprincipalname` |
	| `UserType` | `http://bcv.appinux.com/claims` | `Provide the value as per your organization` |
	| `Tag` | `http://appinux.com/Tag` | `Provide the value as per your organization` |
	| `Role` | `http://schemas.microsoft.com/ws/2008/06/identity/claims/role` | `user.assignedroles` |
	| `email` | `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/email` | `user.mail` |
	| `wanshort` | `http://appinux.com/windowsaccountname2` | `extractmailprefix([userprincipalname])` |
	| `nameidentifier` | `http://schemas.xmlsoap.org/ws/2005/05/identity/claims` | `user.employeeid` |

	a. Click **Add new claim** to open the **Manage user claims** dialog.

	![image](common/new-save-attribute.png)

	![image](common/new-attribute-details.png)

	b. In the **Name** textbox, type the attribute name shown for that row.

	c. In the **Namespace** textbox, type the namespace value shown for that row.

	d. Select Source as **Attribute**.

	e. From the **Source attribute** list, type the attribute value shown for that row.

	f. Click **Ok**

	g. Click **Save**.

7. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

8. On the **Set up Appinux** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Azure Ad Identifier

	c. Logout URL

### Configure Appinux Single Sign-On

To configure single sign-on on **Appinux** side, you need to send the downloaded **Federation Metadata XML** and appropriate copied URLs from Azure portal to [Appinux support team](https://support.appinux.com/). They set this setting to have the SAML SSO connection set properly on both sides.

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

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Appinux.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **Appinux**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **Appinux**.

	![The Appinux link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog click the **Assign** button.

### Create Appinux test user

In this section, a user called Britta Simon is created in Appinux. Appinux supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in Appinux, a new one is created after authentication.

> [!Note]
> If you need to create a user manually, contact [Appinux support team](https://support.appinux.com).

### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Appinux tile in the Access Panel, you should be automatically signed in to the Appinux for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

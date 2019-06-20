---
title: 'Tutorial: Azure Active Directory integration with OnTrack | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and OnTrack.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: d2cafba2-3b4a-4471-ba34-80f6a96ff2b9
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 03/13/2019
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with OnTrack

In this tutorial, you learn how to integrate OnTrack with Azure Active Directory (Azure AD).
Integrating OnTrack with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to OnTrack.
* You can enable your users to be automatically signed-in to OnTrack (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with OnTrack, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get one-month trial [here](https://azure.microsoft.com/pricing/free-trial/)
* OnTrack single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* OnTrack supports **IDP** initiated SSO

## Adding OnTrack from the gallery

To configure the integration of OnTrack into Azure AD, you need to add OnTrack from the gallery to your list of managed SaaS apps.

**To add OnTrack from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Navigate to **Enterprise Applications** and then select the **All Applications** option.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add new application, click **New application** button on the top of dialog.

	![The New application button](common/add-new-app.png)

4. In the search box, type **OnTrack**, select **OnTrack** from result panel then click **Add** button to add the application.

	 ![OnTrack in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with OnTrack based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in OnTrack needs to be established.

To configure and test Azure AD single sign-on with OnTrack, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure OnTrack Single Sign-On](#configure-ontrack-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Create OnTrack test user](#create-ontrack-test-user)** - to have a counterpart of Britta Simon in OnTrack that is linked to the Azure AD representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with OnTrack, perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **OnTrack** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Set up Single Sign-On with SAML** page, perform the following steps:

    ![OnTrack Domain and URLs single sign-on information](common/idp-intiated.png)

    a. In the **Identifier** text box:

    For the testing environment, type the URL: `https://staging.insigniagroup.com/sso`

	For the production environment, type the URL: `https://oeaccessories.com/sso`

    b. In the **Reply URL** text box:

    For the testing environment, type the URL: `https://indie.staging.insigniagroup.com/sso/autonation.aspx`

	For the production environment, type the URL: `https://igaccessories.com/sso/autonation.aspx`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier and Reply URL. Contact [OnTrack Client support team](mailto:CustomerService@insigniagroup.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

5. OnTrack application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes. Click **Edit** icon to open **User Attributes** dialog.

	![image](common/edit-attribute.png)

6. In addition to above, OnTrack application expects few more attributes to be passed back in SAML response. In the **User Claims** section on the **User Attributes** dialog, perform the following steps to add SAML token attribute as shown in the below table:

	| Name | Source Attribute|
	| -------------- | ----------------|    
	| User-Role      | "42F432" |
	| Hyperion-Code  | "12345" |

	> [!NOTE]
	> **User-Role** and **Hyperion-Code** attributes are mapped with Autonation User Role and Dealer Code respectively. These values are example only, please use the correct code for your integration. You can contact [Autonation support](mailto:CustomerService@insigniagroup.com) for these values.

	a. Click **Add new claim** to open the **Manage user claims** dialog.

	![image](common/new-save-attribute.png)

	![image](common/new-attribute-details.png)

	b. In the **Name** textbox, type the attribute name shown for that row.

	c. Leave the **Namespace** blank.

	d. Select Source as **Attribute**.

	e. From the **Source attribute** list, type the attribute value shown for that row.

	f. Click **Ok**

	g. Click **Save**.

7. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

8. On the **Set up OnTrack** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Azure AD Identifier

	c. Logout URL

### Configure OnTrack Single Sign-On

To configure single sign-on on **OnTrack** side, you need to send the downloaded **Federation Metadata XML** and appropriate copied URLs from Azure portal to [OnTrack support team](mailto:CustomerService@insigniagroup.com). They set this setting to have the SAML SSO connection set properly on both sides.

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

In this section, you enable Britta Simon to use Azure single sign-on by granting access to OnTrack.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **OnTrack**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **OnTrack**.

	![The OnTrack link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog click the **Assign** button.

### Create OnTrack test user

In this section, you create a user called Britta Simon in OnTrack. Work with [OnTrack support team](mailto:CustomerService@insigniagroup.com) to add the users in the OnTrack platform. Users must be created and activated before you use single sign-on.

### Test single sign-on 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the OnTrack tile in the Access Panel, you should be automatically signed in to the OnTrack for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)


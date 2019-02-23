---
title: 'Tutorial: Azure Active Directory integration with Cisco Webex | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Cisco Webex.
services: active-directory
documentationCenter: na
author: jeevansd
manager: daveba
ms.reviewer: barbkess

ms.assetid: 26704ca7-13ed-4261-bf24-fd6252e2072b
ms.service: Azure-Active-Directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 1/4/2019
ms.author: jeedes

ms.collection: M365-identity-device-management
---
# Tutorial: Azure Active Directory integration with Cisco Webex

In this tutorial, you learn how to integrate Cisco Webex with Azure Active Directory (Azure AD).
Integrating Cisco Webex with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to Cisco Webex.
* You can enable your users to be automatically signed-in to Cisco Webex (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with Cisco Webex, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get one-month trial [here](https://azure.microsoft.com/pricing/free-trial/)
* Cisco Webex single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Cisco Webex supports **SP** initiated SSO

* Cisco Webex supports **Just In Time** user provisioning

* Cisco Webex supports **Automated** user provisioning

## Adding Cisco Webex from the gallery

To configure the integration of Cisco Webex into Azure AD, you need to add Cisco Webex from the gallery to your list of managed SaaS apps.

**To add Cisco Webex from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Navigate to **Enterprise Applications** and then select the **All Applications** option.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add new application, click **New application** button on the top of dialog.

	![The New application button](common/add-new-app.png)

4. In the search box, type **Cisco Webex**, select **Cisco Webex** from result panel then click **Add** button to add the application.

	 ![Cisco Webex in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Cisco Webex based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in Cisco Webex needs to be established.

To configure and test Azure AD single sign-on with Cisco Webex, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure Cisco Webex Single Sign-On](#configure-cisco-webex-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Create Cisco Webex test user](#create-cisco-webex-test-user)** - to have a counterpart of Britta Simon in Cisco Webex that is linked to the Azure AD representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with Cisco Webex, perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **Cisco Webex** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. In a different web browser window, sign in to your Cisco Webex company site as an administrator.

4. Click **Settings** from the left of the menu.

	![Configure Single Sign-On](./media/cisco-webex-tutorial/tutorial_cisco_webex_10.png)

5. On the settings page scroll down under the **Authentication** section, click **Modify**.

	![Configure Single Sign-On](./media/cisco-webex-tutorial/tutorial_cisco_webex_14.png)

6. Select **Integrate a 3rd-party identity provider. (Advanced)** and go to the next screen.

	![Configure Single Sign-On](./media/cisco-webex-tutorial/tutorial_cisco_webex_15.png)

7. On the **Export Directory Metadata** page, click **Download Metadata File** to download the metadata file.

	![Configure Single Sign-On](./media/cisco-webex-tutorial/tutorial_cisco_webex_16.png)

8. In the Azure portal, On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

9. On the **Basic SAML Configuration** section, upload the downloaded **Service Provider metadata** file and configure the application by performing the following steps:

	a. Click **Upload metadata file**.

    ![Upload metadata file](common/upload-metadata.png)

	b. Click on **folder logo** to select the metadata file and click **Upload**.

	![choose metadata file](common/browse-upload-metadata.png)

	c. After successful completion of uploading Service Provider metadata file the **Identifier** and **Reply URL** values get auto populated in **Basic SAML Configuration** section:

	![Cisco Webex Domain and URLs single sign-on information](common/sp-identifier-reply.png)

	In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://<SUBDOMAIN>.webex.com/`

	> [!Note]
	> The Sign on URL value is not real. Update this value with the actual Sign on URL. Contact [Cisco Webex Client support team](https://www.webex.co.in/support/support-overview.html) to get this value.

10. Cisco Webex application expects the SAML assertions in a specific format. Configure the following claims for this application. You can manage the values of these attributes from the **User Attributes** section on application integration page. On the **Set up Single Sign-On with SAML** page, click **Edit** button to open **User Attributes** dialog.

	![image](common/edit-attribute.png)

11. In the **User Claims** section on the **User Attributes** dialog, configure SAML token attribute as shown in the image above and perform the following steps:
    
	| Name | Source Attribute|
	| ---------------| --------------- | --------- |
	|   firstname    | user.givenname |
	|   lastname    | user.surname |
	|   uid    | user.mail |

	a. Click **Add new claim** to open the **Manage user claims** dialog.

	![image](common/new-save-attribute.png)

	![image](common/new-attribute-details.png)

	b. In the **Name** textbox, type the attribute name shown for that row.

	c. Leave the **Namespace** blank.

	d. Select Source as **Attribute**.

	e. From the **Source attribute** list, type the attribute value shown for that row.

	f. Click **Ok**

	g. Click **Save**.

12. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

13. On the **Set up Cisco Webex** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Azure Ad Identifier

	c. Logout URL

### Configure Cisco Webex Single Sign-On

1. On the Cisco Webex company site administrator page, use the file browser option to locate and upload the Azure AD metadata file. Then, select **Require certificate signed by a certificate authority in Metadata (more secure)** and go to next screen. 

	![Configure Single Sign-On](./media/cisco-webex-tutorial/tutorial_cisco_webex_11.png)

2. Select **Test SSO Connection**, and when a new browser tab opens, authenticate with Azure AD by signing in.

3. Return to the **Cisco Cloud Collaboration Management** browser tab. If the test was successful, select **This test was successful. Enable Single Sign-On option** and click **Save**.

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

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Cisco Webex.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **Cisco Webex**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **Cisco Webex**.

	![The Cisco Webex link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog click the **Assign** button.

### Create Cisco Webex test user

The objective of this section is to create a user called Britta Simon in Cisco Webex. Cisco Webex supports just-in-time provisioning and automatic user provisioning, which is by default enabled. There is no action item for you in this section. If a user doesn't already exist in Cisco Webex, a new one is created when you attempt to access Cisco Webex.

### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Cisco Webex tile in the Access Panel, you should be automatically signed in to the Cisco Webex for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)


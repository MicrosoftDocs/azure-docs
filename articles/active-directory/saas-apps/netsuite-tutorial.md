---
title: 'Tutorial: Azure Active Directory integration with NetSuite | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and NetSuite.
services: active-directory
documentationCenter: na
author: jeevansd
manager: daveba
ms.reviewer: barbkess

ms.assetid: dafa0864-aef2-4f5e-9eac-770504688ef4
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 12/17/2018
ms.author: jeedes

ms.collection: M365-identity-device-management
---
# Tutorial: Azure Active Directory integration with NetSuite

In this tutorial, you learn how to integrate NetSuite with Azure Active Directory (Azure AD).
Integrating NetSuite with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to NetSuite.
* You can enable your users to be automatically signed-in to NetSuite (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with NetSuite, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get one-month trial [here](https://azure.microsoft.com/pricing/free-trial/)
* NetSuite single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* NetSuite supports **IDP** initiated SSO
* NetSuite supports **Just In Time** user provisioning
* NetSuite supports [Automated user provisioning](NetSuite-provisioning-tutorial.md)

## Adding NetSuite from the gallery

To configure the integration of NetSuite into Azure AD, you need to add NetSuite from the gallery to your list of managed SaaS apps.

**To add NetSuite from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Navigate to **Enterprise Applications** and then select the **All Applications** option.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add new application, click **New application** button on the top of dialog.

	![The New application button](common/add-new-app.png)

4. In the search box, type **NetSuite**, select **NetSuite** from result panel then click **Add** button to add the application.

	 ![NetSuite in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with NetSuite based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in NetSuite needs to be established.

To configure and test Azure AD single sign-on with NetSuite, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure NetSuite Single Sign-On](#configure-netsuite-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Create NetSuite test user](#create-netsuite-test-user)** - to have a counterpart of Britta Simon in NetSuite that is linked to the Azure AD representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with NetSuite, perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **NetSuite** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, perform the following steps:

    ![NetSuite Domain and URLs single sign-on information](common/idp-reply.png)

    In the **Reply URL** textbox, type a URL using the following pattern:

    `https://<tenant-name>.NetSuite.com/saml2/acs`

	`https://<tenant-name>.na1.NetSuite.com/saml2/acs`

	`https://<tenant-name>.na2.NetSuite.com/saml2/acs`

	`https://<tenant-name>.sandbox.NetSuite.com/saml2/acs`

	`https://<tenant-name>.na1.sandbox.NetSuite.com/saml2/acs`

	`https://<tenant-name>.na2.sandbox.NetSuite.com/saml2/acs`

	> [!NOTE]
	> The value is not real. Update the value with the actual Reply URL. Contact [NetSuite Client support team](http://www.netsuite.com/portal/services/support-services/suitesupport.shtml) to get the value. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

5. NetSuite application expects the SAML assertions in a specific format. Configure the following claims for this application. You can manage the values of these attributes from the **User Attributes** section on application integration page. On the **Set up Single Sign-On with SAML** page, click **Edit** button to open **User Attributes** dialog.

	![image](common/edit-attribute.png)

6. In the **User Claims** section on the **User Attributes** dialog, edit the claims by using **Edit icon** or add the claims by using **Add new claim** to configure SAML token attribute as shown in the image above and perform the following steps:
    
	| Name | Source Attribute | 
	| ---------------| --------------- |
	| account  | `account id` |

	a. Click **Add new claim** to open the **Manage user claims** dialog.

	![image](common/new-save-attribute.png)

	![image](common/new-attribute-details.png)

	b. In the **Name** textbox, type the attribute name shown for that row.

	c. Leave the **Namespace** blank.

	d. Select Source as **Attribute**.

	e. From the **Source attribute** list, type the attribute value shown for that row.

	f. Click **Ok**

	g. Click **Save**.

	>[!NOTE]
	>The value of account attribute is not real. You will update this value, which is explained later in the tutorial.

4. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Metadata XML** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

6. On the **Set up NetSuite** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Azure Ad Identifier

	c. Logout URL

### Configure NetSuite Single Sign-On

1. Open a new tab in your browser, and sign into your NetSuite company site as an administrator.

2. In the toolbar at the top of the page, click **Setup**, then navigate to **Company** and click **Enable Features**.

    ![Configure Single Sign-On](./media/NetSuite-tutorial/ns-setupsaml.png)

3. In the toolbar at the middle of the page, click **SuiteCloud**.

    ![Configure Single Sign-On](./media/NetSuite-tutorial/ns-suitecloud.png)

4. Under **Manage Authentication** section, select **SAML SINGLE SIGN-ON** to enable the SAML SINGLE SIGN-ON option in NetSuite.

    ![Configure Single Sign-On](./media/NetSuite-tutorial/ns-ticksaml.png)

5. In the toolbar at the top of the page, click **Setup**.

    ![Configure Single Sign-On](./media/NetSuite-tutorial/ns-setup.png)

6. From the **SETUP TASKS** list, click **Integration**.

	![Configure Single Sign-On](./media/NetSuite-tutorial/ns-integration.png)

7. In the **MANAGE AUTHENTICATION** section, click **SAML Single Sign-on**.

    ![Configure Single Sign-On](./media/NetSuite-tutorial/ns-saml.png)

8. On the **SAML Setup** page, under **NetSuite Configuration** section perform the following steps:

    ![Configure Single Sign-On](./media/NetSuite-tutorial/ns-saml-setup.png)
  
    a. Select **PRIMARY AUTHENTICATION METHOD**.

    b. For the field labeled **SAMLV2 IDENTITY PROVIDER METADATA**, select **UPLOAD IDP METADATA FILE**. Then click **Browse** to upload the metadata file that you downloaded from Azure portal.

    c. Click **Submit**.

9. In NetSuite, click **Setup** then navigate to **Company** and click **Company Information** from the top navigation menu.

	![Configure Single Sign-On](./media/NetSuite-tutorial/ns-com.png)

	![Configure Single Sign-On](./media/NetSuite-tutorial/ns-account-id.png)

    b. In the **Company Information** Page on the right column copy the **ACCOUNT ID**.

    c. Paste the **Account ID** which you have copied from NetSuite account it into the **Attribute Value** field in Azure AD. 

10. Before users can perform single sign-on into NetSuite, they must first be assigned the appropriate permissions in NetSuite. Follow the instructions below to assign these permissions.

    a. On the top navigation menu, click **Setup**.

    ![Configure Single Sign-On](./media/NetSuite-tutorial/ns-setup.png)

    b. On the left navigation menu, select **Users/Roles**, then click **Manage Roles**.

    ![Configure Single Sign-On](./media/NetSuite-tutorial/ns-manage-roles.png)

    c. Click **New Role**.

    d. Type in a **Name** for your new role.

    ![Configure Single Sign-On](./media/NetSuite-tutorial/ns-new-role.png)

    e. Click **Save**.

    f. In the menu on the top, click **Permissions**. Then click **Setup**.

    ![Configure Single Sign-On](./media/NetSuite-tutorial/ns-sso.png)

    g. Select **SAML Single Sign-on**, and then click **Add**.

    h. Click **Save**.

    i. On the top navigation menu, click **Setup**, then click **Setup Manager**.

    ![Configure Single Sign-On](./media/NetSuite-tutorial/ns-setup.png)

    j. On the left navigation menu, select **Users/Roles**, then click **Manage Users**.

    ![Configure Single Sign-On](./media/NetSuite-tutorial/ns-manage-users.png)

    k. Select a test user. Then click **Edit** and then navigate to **Access** tab.

    ![Configure Single Sign-On](./media/NetSuite-tutorial/ns-edit-user.png)

    l. On the Roles dialog, assign the appropriate role that you have created.

    ![Configure Single Sign-On](./media/NetSuite-tutorial/ns-add-role.png)

    m. Click **Save**.

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

In this section, you enable Britta Simon to use Azure single sign-on by granting access to NetSuite.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **NetSuite**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, type and select **NetSuite**.

	![The NetSuite link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog click the **Assign** button.

### Create NetSuite test user

In this section, a user called Britta Simon is created in NetSuite. NetSuite supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in NetSuite, a new one is created after authentication.

### Test single sign-on 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the NetSuite tile in the Access Panel, you should be automatically signed in to the NetSuite for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [Configure User Provisioning](NetSuite-provisioning-tutorial.md)


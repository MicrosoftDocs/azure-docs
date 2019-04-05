---
title: 'Tutorial: Azure Active Directory integration with Pega Systems | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Pega Systems.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 31acf80f-1f4b-41f1-956f-a9fbae77ee69
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 03/26/2019
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Pega Systems

In this tutorial, you learn how to integrate Pega Systems with Azure Active Directory (Azure AD).
Integrating Pega Systems with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to Pega Systems.
* You can enable your users to be automatically signed-in to Pega Systems (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with Pega Systems, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get one-month trial [here](https://azure.microsoft.com/pricing/free-trial/)
* Pega Systems single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Pega Systems supports **SP** and **IDP** initiated SSO

## Adding Pega Systems from the gallery

To configure the integration of Pega Systems into Azure AD, you need to add Pega Systems from the gallery to your list of managed SaaS apps.

**To add Pega Systems from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Navigate to **Enterprise Applications** and then select the **All Applications** option.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add new application, click **New application** button on the top of dialog.

	![The New application button](common/add-new-app.png)

4. In the search box, type **Pega Systems**, select **Pega Systems** from result panel then click **Add** button to add the application.

	 ![Pega Systems in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Pega Systems based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in Pega Systems needs to be established.

To configure and test Azure AD single sign-on with Pega Systems, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure Pega Systems Single Sign-On](#configure-pega-systems-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Create Pega Systems test user](#create-pega-systems-test-user)** - to have a counterpart of Britta Simon in Pega Systems that is linked to the Azure AD representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with Pega Systems, perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **Pega Systems** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, perform the following steps:

    ![Pega Systems Domain and URLs single sign-on information](common/idp-intiated.png)

    a. In the **Identifier** text box, type a URL using the following pattern:
    `https://<CUSTOMERNAME>.pegacloud.io:443/prweb/sp/<INSTANCEID>`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://<CUSTOMERNAME>.pegacloud.io:443/prweb/PRRestService/WebSSO/SAML/AssertionConsumerService`

5. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    ![Pega Systems Domain and URLs single sign-on information](common/both-advanced-urls.png)

	a. In the **Sign on URL** text box, type the Sign on URL value.

    b. In the **Relay State** text box, type a URL using the following pattern:
    `https://<CUSTOMERNAME>.pegacloud.io/prweb/sso`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier, Reply URL, Sign on URL and Relay State URL. You can find the values of Identifier and Reply URL from Pega application which is explained later in this tutorial. For Relay State, contact [Pega Systems Client support team](https://www.pega.com/contact-us) to get the value. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

6. Pega Systems application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes. Click **Edit** icon to open **User Attributes** dialog.

	![image](common/edit-attribute.png)

7. In addition to above, Pega Systems application expects few more attributes to be passed back in SAML response. In the **User Claims** section on the **User Attributes** dialog, perform the following steps to add SAML token attribute as shown in the below table:

	| Name | Source Attribute|
	| ------------------- | -------------------- |
	| uid | *********** |
	| cn  | *********** |
	| mail | *********** |
	| accessgroup | *********** |
	| organization | *********** |
	| orgdivision | *********** |
	| orgunit | *********** |
	| workgroup | *********** |
	| Phone | *********** |

	> [!NOTE]
	> These are customer specific values. Please provide your appropriate values.

	a. Click **Add new claim** to open the **Manage user claims** dialog.

	![image](common/new-save-attribute.png)

	![image](common/new-attribute-details.png)

	b. In the **Name** textbox, type the attribute name shown for that row.

	c. Leave the **Namespace** blank.

	d. Select Source as **Attribute**.

	e. From the **Source attribute** list, type the attribute value shown for that row.

	f. Click **Ok**

	g. Click **Save**.

8. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

9. On the **Set up Pega Systems** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Azure AD Identifier

	c. Logout URL

### Configure Pega Systems Single Sign-On

1. To configure single sign-on on **Pega Systems** side, open the **Pega Portal** with admin account in another browser window.

2. Select **Create** -> **SysAdmin** -> **Authentication Service**.

	![Configure Single Sign-On Save button](./media/pegasystems-tutorial/tutorial_pegasystems_admin.png)
	
3. Perform following actions on **Create Authentication Service** screen:

	![Configure Single Sign-On Save button](./media/pegasystems-tutorial/tutorial_pegasystems_admin1.png)

	a. Select **SAML 2.0** from Type

	b. In the **Name** textbox, enter any name e.g Azure AD SSO

	c. In the **Short Description** textbox, enter any description  

	d. Click on **Create and open** 
	
4. In **Identity Provider (IdP) information** section, click on **Import IdP metadata** and browse the metadata file which you have downloaded from the Azure portal. Click **Submit** to load the metadata.

	![Configure Single Sign-On Save button](./media/pegasystems-tutorial/tutorial_pegasystems_admin2.png)
	
5. This will populate the IdP data as shown below.

	![Configure Single Sign-On Save button](./media/pegasystems-tutorial/tutorial_pegasystems_admin3.png)
	
6. Perform following actions on **Service Provider (SP) settings** section:

	![Configure Single Sign-On Save button](./media/pegasystems-tutorial/tutorial_pegasystems_admin4.png)

	a. Copy the **Entity Identification** value and paste it in to **Identifier** textbox in the **Basic SAML Configuration** in the Azure portal.

	b. Copy the **Assertion Consumer Service (ACS) location** value and paste it in to **Reply URL** textbox in the **Basic SAML Configuration** in the Azure portal.

	c. Select **Disable request signing**.

7. Click **Save**

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

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Pega Systems.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **Pega Systems**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **Pega Systems**.

	![The Pega Systems link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog click the **Assign** button.

### Create Pega Systems test user

The objective of this section is to create a user called Britta Simon in Pega Systems. Work with [Pega Systems Client support team](https://www.pega.com/contact-us) to create users in Pega Systems.

### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Pega Systems tile in the Access Panel, you should be automatically signed in to the Pega Systems for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)
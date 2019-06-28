---
title: 'Tutorial: Azure Active Directory integration with SmartDraw | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and SmartDraw.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 6f8fbbe8-c771-4fa1-9326-5a9dac991ace
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 03/13/2019
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with SmartDraw

In this tutorial, you learn how to integrate SmartDraw with Azure Active Directory (Azure AD).
Integrating SmartDraw with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to SmartDraw.
* You can enable your users to be automatically signed-in to SmartDraw (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with SmartDraw, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get one-month trial [here](https://azure.microsoft.com/pricing/free-trial/)
* SmartDraw single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* SmartDraw supports **SP and IDP** initiated SSO

* SmartDraw supports **Just In Time** user provisioning

## Adding SmartDraw from the gallery

To configure the integration of SmartDraw into Azure AD, you need to add SmartDraw from the gallery to your list of managed SaaS apps.

**To add SmartDraw from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Navigate to **Enterprise Applications** and then select the **All Applications** option.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add new application, click **New application** button on the top of dialog.

	![The New application button](common/add-new-app.png)

4. In the search box, type **SmartDraw**, select **SmartDraw** from result panel then click **Add** button to add the application.

	 ![SmartDraw in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with SmartDraw based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in SmartDraw needs to be established.

To configure and test Azure AD single sign-on with SmartDraw, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure SmartDraw Single Sign-On](#configure-smartdraw-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Create SmartDraw test user](#create-smartdraw-test-user)** - to have a counterpart of Britta Simon in SmartDraw that is linked to the Azure AD representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with SmartDraw, perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **SmartDraw** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode the user does not have to perform any step as the app is already pre-integrated with Azure.

    ![SmartDraw Domain and URLs single sign-on information](common/preintegrated.png)

5. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    ![SmartDraw Domain and URLs single sign-on information](common/metadata-upload-additional-signon.png)

    In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://cloud.smartdraw.com/sso/saml/login/<domain>`

    > [!NOTE]
	> The Sign-on URL value is not real. You will update the Sign-on URL value with the actual Sign-on URL, which is explained later in the tutorial. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

6. SmartDraw application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes. Click **Edit** icon to open **User Attributes** dialog.

	![image](common/edit-attribute.png)

7. In addition to above, SmartDraw application expects few more attributes to be passed back in SAML response. In the **User Claims** section on the **User Attributes** dialog, perform the following steps to add SAML token attribute as shown in the below table: 

	| Name | Source Attribute|
	| ---------------| --------------- |
	| FirstName | user.givenname |
	| LastName | user.surname |
	| Email | user.mail |
	| Groups | user.groups |

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

9. On the **Set up SmartDraw** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Azure AD Identifier

	c. Logout URL

### Configure SmartDraw Single Sign-On

1. In a different web browser window, login to SmartDraw as an Administrator.

2. Click on **Single Sign-On** under Manage your SmartDraw License.

	![SmartDraw Configuration](./media/smartdraw-tutorial/configure01.png)

3. On the Configuration page, perform the following steps:

	![SmartDraw Configuration](./media/smartdraw-tutorial/configure02.png)

	a. In the **Your Domain (like acme.com)** textbox, type your domain.

	b. Copy the **Your SP Initiated Login Url will be** for your instance and paste it in Sign-on URL textbox in **Basic SAML Configuration** on Azure portal.
	
	c. In the **Security Groups to Allow SmartDraw Access** textbox, type **Everyone**.

	d. In the **Your SAML Issuer Url** textbox, paste the value of **Azure AD Identifier** which you have copied from the Azure portal.

	e. In Notepad, open the Metadata XML file that you downloaded from the Azure portal, copy its content, and then paste it into the **Your SAML MetaData** box.

	f. Click **Save Configuration**	

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

In this section, you enable Britta Simon to use Azure single sign-on by granting access to SmartDraw.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **SmartDraw**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **SmartDraw**.

	![The SmartDraw link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog click the **Assign** button.

### Create SmartDraw test user

In this section, a user called Britta Simon is created in SmartDraw. SmartDraw supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in SmartDraw, a new one is created after authentication.

### Test single sign-on 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the SmartDraw tile in the Access Panel, you should be automatically signed in to the SmartDraw for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)


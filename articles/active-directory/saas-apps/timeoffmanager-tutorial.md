---
title: 'Tutorial: Azure Active Directory integration with TimeOffManager | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and TimeOffManager.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 3685912f-d5aa-4730-ab58-35a088fc1cc3
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 03/27/2019
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with TimeOffManager

In this tutorial, you learn how to integrate TimeOffManager with Azure Active Directory (Azure AD).
Integrating TimeOffManager with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to TimeOffManager.
* You can enable your users to be automatically signed-in to TimeOffManager (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with TimeOffManager, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get one-month trial [here](https://azure.microsoft.com/pricing/free-trial/)
* TimeOffManager single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* TimeOffManager supports **IDP** initiated SSO

* TimeOffManager supports **Just In Time** user provisioning

## Adding TimeOffManager from the gallery

To configure the integration of TimeOffManager into Azure AD, you need to add TimeOffManager from the gallery to your list of managed SaaS apps.

**To add TimeOffManager from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Navigate to **Enterprise Applications** and then select the **All Applications** option.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add new application, click **New application** button on the top of dialog.

	![The New application button](common/add-new-app.png)

4. In the search box, type **TimeOffManager**, select **TimeOffManager** from result panel then click **Add** button to add the application.

	 ![TimeOffManager in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with TimeOffManager based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in TimeOffManager needs to be established.

To configure and test Azure AD single sign-on with TimeOffManager, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure TimeOffManager Single Sign-On](#configure-timeoffmanager-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Create TimeOffManager test user](#create-timeoffmanager-test-user)** - to have a counterpart of Britta Simon in TimeOffManager that is linked to the Azure AD representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with TimeOffManager, perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **TimeOffManager** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, perform the following steps:

    ![TimeOffManager Domain and URLs single sign-on information](common/idp-reply.png)

    In the **Reply URL** text box, type a URL using the following pattern:
    `https://www.timeoffmanager.com/cpanel/sso/consume.aspx?company_id=<companyid>`

	> [!NOTE]
	> This value is not real. Update this value with the actual Reply URL. You can get this value from **Single Sign on settings page** which is explained later in the tutorial or Contact [TimeOffManager support team](https://www.purelyhr.com/contact-us). You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

5. TimeOffManager application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes. Click **Edit** icon to open **User Attributes** dialog.

	![image](common/edit-attribute.png)

6. In addition to above, TimeOffManager application expects few more attributes to be passed back in SAML response. In the **User Claims** section on the **User Attributes** dialog, perform the following steps to add SAML token attribute as shown in the below table: 

	| Name | Source Attribute|
	| --- | --- |
	| Firstname |User.givenname |
	| Lastname |User.surname |
	| Email |User.mail |

	a. Click **Add new claim** to open the **Manage user claims** dialog.

	![image](common/new-save-attribute.png)

	![image](common/new-attribute-details.png)

	b. In the **Name** textbox, type the attribute name shown for that row.

	c. Leave the **Namespace** blank.

	d. Select Source as **Attribute**.

	e. From the **Source attribute** list, type the attribute value shown for that row.

	f. Click **Ok**

	g. Click **Save**.

7. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Base64)** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

8. On the **Set up TimeOffManager** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Azure AD Identifier

	c. Logout URL

### Configure TimeOffManager Single Sign-On

1. In a different web browser window, sign into your TimeOffManager company site as an administrator.

2. Go to **Account \> Account Options \> Single Sign-On Settings**.
   
	![Single Sign-On Settings](./media/timeoffmanager-tutorial/ic795917.png "Single Sign-On Settings")

3. In the **Single Sign-On Settings** section, perform the following steps:
   
	![Single Sign-On Settings](./media/timeoffmanager-tutorial/ic795918.png "Single Sign-On Settings")
   
	a. Open your base-64 encoded certificate in notepad, copy the content of it into your clipboard, and then paste the entire Certificate into **X.509 Certificate** textbox.
   
	b. In **Idp Issuer** textbox, paste the value of **Azure AD Identifier** which you have copied from Azure portal.
   
	c. In **IdP Endpoint URL** textbox, paste the value of **Login URL** which you have copied from Azure portal.
   
	d. As **Enforce SAML**, select **No**.
   
	e. As **Auto-Create Users**, select **Yes**.
   
	f. In **Logout URL** textbox, paste the value of **Logout URL** which you have copied from Azure portal.
   
	g. click **Save Changes**.

4. In **Single Sign on settings** page, copy the value of **Assertion Consumer Service URL** and paste it in the **Reply URL** text box under **Basic SAML Configuration** section in Azure portal. 

	  ![Single Sign-On Settings](./media/timeoffmanager-tutorial/ic795915.png "Single Sign-On Settings")

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

In this section, you enable Britta Simon to use Azure single sign-on by granting access to TimeOffManager.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **TimeOffManager**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **TimeOffManager**.

	![The TimeOffManager link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog click the **Assign** button.

### Create TimeOffManager test user

In this section, a user called Britta Simon is created in TimeOffManager. TimeOffManager supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in TimeOffManager, a new one is created after authentication.

>[!NOTE]
>You can use any other TimeOffManager user account creation tools or APIs provided by TimeOffManager to provision Azure AD user accounts.
> 

### Test single sign-on 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the TimeOffManager tile in the Access Panel, you should be automatically signed in to the TimeOffManager for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)


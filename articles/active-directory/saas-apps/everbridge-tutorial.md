---
title: 'Tutorial: Azure Active Directory integration with EverBridge | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and EverBridge.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 58d7cd22-98c0-4606-9ce5-8bdb22ee8b3e
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 04/18/2019
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with EverBridge

In this tutorial, you learn how to integrate EverBridge with Azure Active Directory (Azure AD).
Integrating EverBridge with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to EverBridge.
* You can enable your users to be automatically signed-in to EverBridge (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with EverBridge, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get a [free account](https://azure.microsoft.com/free/)
* EverBridge single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* EverBridge supports **IDP** initiated SSO

## Adding EverBridge from the gallery

To configure the integration of EverBridge into Azure AD, you need to add EverBridge from the gallery to your list of managed SaaS apps.

**To add EverBridge from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Navigate to **Enterprise Applications** and then select the **All Applications** option.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add new application, click **New application** button on the top of dialog.

	![The New application button](common/add-new-app.png)

4. In the search box, type **EverBridge**, select **EverBridge** from result panel then click **Add** button to add the application.

	 ![EverBridge in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with EverBridge based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in EverBridge needs to be established.

To configure and test Azure AD single sign-on with EverBridge, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure EverBridge as EverBridge Manager Portal Single Sign-On](#configure-everbridge-as-everbridge-manager-portal-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Configure EverBridge as EverBridge Manager Portal Single Sign-On](#configure-everbridge-as-everbridge-member-portal-single-sign-on)** - to configure the Single Sign-On settings on application side.
4. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
5. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
6. **[Create EverBridge test user](#create-everbridge-test-user)** - to have a counterpart of Britta Simon in EverBridge that is linked to the Azure AD representation of user.
7. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with EverBridge, perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **EverBridge** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

    >[!NOTE]
	>You need to do the configurations of the application EITHER as the Manager Portal  OR as the Member Portal on both ends i.e. on Azure Portal and Everbridge Portal.

4. To configure the **EverBridge** application as **EverBridge Manager Portal**, on the **Basic SAML Configuration** section  perform the following steps:

    ![EverBridge Domain and URLs single sign-on information](common/idp-intiated.png)

    a. In the **Identifier** text box, type a URL using the following pattern:
    `https://sso.everbridge.net/<API_Name>`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://manager.everbridge.net/saml/SSO/<API_Name>/alias/defaultAlias`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier and Reply URL. Contact [EverBridge support team](mailto:support@everbridge.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

5. To configure the **EverBridge** application as **EverBridge Member Portal**, on the **Basic SAML Configuration** section, perform the following steps:

   * If you wish to configure the application in **IDP** initiated mode:

	![EverBridge Domain and URLs single sign-on information](common/idp-intiated.png)

    * In the **Identifier** textbox, type a URL using the following pattern: `https://sso.everbridge.net/<API_Name>/<Organization_ID>`

    * In the **Reply URL** textbox, type a URL using the following pattern: `https://member.everbridge.net/saml/SSO/<API_Name>/<Organization_ID>/alias/defaultAlias`

* Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    ![EverBridge Domain and URLs single sign-on information](common/both-signonurl.png)

    * In the **Sign-on URL** textbox, type a URL using the following pattern: `https://member.everbridge.net/saml/login/<API_Name>/<Organization_ID>/alias/defaultAlias?disco=true`

    > [!NOTE]
    > These values are not real. Update these values with the actual Identifier, Reply URL and Sign on URL. Contact [EverBridge support team](mailto:support@everbridge.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

6. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

7. On the **Set up EverBridge** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Azure AD Identifier

	c. Logout URL

### Configure EverBridge as EverBridge Manager Portal Single Sign-On

1. To get SSO configured for **EverBridge** as **EverBridge Manager Portal** application, perform the following steps: 
 
2. In a different web browser window, sign in to EverBridge as an Administrator.

3. In the menu on the top, click the **Settings** tab and select **Single Sign-On** under **Security**.
   
     ![Configure Single Sign-On](./media/everbridge-tutorial/tutorial_everbridge_002.png)
   
     a. In the **Name** textbox, type the name of Identifier Provider (for example: your company name).
   
     b. In the **API Name** textbox, type the name of API.
   
     c. Click **Choose File** button to upload the metadata file which you downloaded from Azure portal.
   
     d. In the SAML Identity Location, select **Identity is in the NameIdentifier element of the Subject statement**.
   
     e. In the **Identity Provider Login URL** textbox, paste the value of **Login URL** which you have copied from Azure portal.
   
     f. In the Service Provider Initiated Request Binding, select **HTTP Redirect**.

     g. Click **Save**.

### Configure EverBridge as EverBridge Member Portal Single Sign-On

To configure single sign-on on **EverBridge** as **EverBridge Member Portal**, you need to send the downloaded **Federation Metadata XML** to [Everbridge support team](mailto:support@everbridge.com). They set this setting to have the SAML SSO connection set properly on both sides.

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

In this section, you enable Britta Simon to use Azure single sign-on by granting access to EverBridge.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **EverBridge**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **EverBridge**.

	![The EverBridge link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog click the **Assign** button.

### Create EverBridge test user

In this section, you create a user called Britta Simon in Everbridge. Work with [EverBridge support team](mailto:support@everbridge.com) to add the users in the Everbridge platform. Users must be created and activated in EverBridge before you use single sign-on. 

### Test single sign-on 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the EverBridge tile in the Access Panel, you should be automatically signed in to the EverBridge for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [ List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory ](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory? ](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)


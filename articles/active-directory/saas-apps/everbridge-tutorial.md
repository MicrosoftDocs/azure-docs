---
title: 'Tutorial: Azure Active Directory integration with Everbridge | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Everbridge.
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
# Tutorial: Azure Active Directory integration with Everbridge

In this tutorial, you learn how to integrate Everbridge with Azure Active Directory (Azure AD).
When you integrate Everbridge with Azure AD, you can:

* Control in Azure AD who has access to Everbridge.
* Allow your users to be automatically signed in to Everbridge with their Azure AD accounts. This access control is called single sign-on (SSO).
* Manage your accounts in one central location by using the Azure portal.
For more information about software as a service (SaaS) app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with Everbridge, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get a [free account](https://azure.microsoft.com/free/).
* An Everbridge subscription that uses single sign-on.

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Everbridge supports IDP-initiated SSO.

## Add Everbridge from the Azure Marketplace

To configure the integration of Everbridge into Azure AD, add Everbridge from the Azure Marketplace to your list of managed SaaS apps.

To add Everbridge from the Azure Marketplace, follow these steps.

1. In the [Azure portal](https://portal.azure.com), on the left navigation pane, select **Azure Active Directory**.

	![Azure Active Directory button](common/select-azuread.png)

2. Go to **Enterprise applications**, and then select **All applications**.

	![Enterprise applications blade](common/enterprise-applications.png)

3. To add a new application, select **New application** at the top of the dialog box.

	![New application button](common/add-new-app.png)

4. In the search box, enter **Everbridge**. Select **Everbridge** from the result panel, and select **Add**.

	 ![Everbridge in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Everbridge based on the test user Britta Simon.
For single sign-on to work, establish a link relationship between an Azure AD user and the related user in Everbridge.

To configure and test Azure AD single sign-on with Everbridge, complete the following building blocks:

- [Configure Azure AD single sign-on](#configure-azure-ad-single-sign-on) to enable your users to use this feature.
- [Configure Everbridge as Everbridge manager portal single sign-on](#configure-everbridge-as-everbridge-manager-portal-single-sign-on) to configure the single sign-on settings on the application side.
- [Configure Everbridge as Everbridge member portal single sign-on](#configure-everbridge-as-everbridge-member-portal-single-sign-on) to configure the single sign-on settings on the application side.
- [Create an Azure AD test user](#create-an-azure-ad-test-user) to test Azure AD single sign-on with Britta Simon.
- [Assign the Azure AD test user](#assign-the-azure-ad-test-user) to enable Britta Simon to use Azure AD single sign-on.
- [Create an Everbridge test user](#create-an-everbridge-test-user) to have a counterpart of Britta Simon in Everbridge that's linked to the Azure AD representation of the user.
- [Test single sign-on](#test-single-sign-on) to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with Everbridge, follow these steps.

1. In the [Azure portal](https://portal.azure.com/), on the **Everbridge** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. In the **Select a single sign-on method** dialog box, select the **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, select **Edit** to open the **Basic SAML Configuration** dialog box.

	![Edit Basic SAML Configuration](common/edit-urls.png)

    >[!NOTE]
	>Configure the application either as the manager portal *or* as the member portal on both the Azure portal and the Everbridge portal.

4. To configure the **Everbridge** application as the **Everbridge manager portal**, in the **Basic SAML Configuration** section, follow these steps:

    ![Everbridge domain and URLs single sign-on information](common/idp-intiated.png)

    a. In the **Identifier** box, enter a URL that follows the pattern
    `https://sso.everbridge.net/<API_Name>`

    b. In the **Reply URL** box, enter a URL that follows the pattern
    `https://manager.everbridge.net/saml/SSO/<API_Name>/alias/defaultAlias`

	> [!NOTE]
	> These values aren't real. Update these values with the actual Identifier and Reply URL values. To get these values, contact the [Everbridge support team](mailto:support@everbridge.com). You also can refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

5. To configure the **Everbridge** application as the **Everbridge member portal**, in the **Basic SAML Configuration** section, follow these steps:

  * If you want to configure the application in IDP-initiated mode, follow these steps:

	 ![Everbridge domain and URLs single sign-on information for IDP-initiated mode](common/idp-intiated.png)

    a. In the **Identifier** box, enter a URL that follows the pattern `https://sso.everbridge.net/<API_Name>/<Organization_ID>`

    b. In the **Reply URL** box, enter a URL that follows the pattern `https://member.everbridge.net/saml/SSO/<API_Name>/<Organization_ID>/alias/defaultAlias`

   * If you want to configure the application in SP-initiated mode, select **Set additional URLs** and follow this step:

     ![Everbridge domain and URLs single sign-on information for SP-initiated mode](common/both-signonurl.png)

     a. In the **Sign on URL** box, enter a URL that follows the pattern `https://member.everbridge.net/saml/login/<API_Name>/<Organization_ID>/alias/defaultAlias?disco=true`

     > [!NOTE]
     > These values aren't real. Update these values with the actual Identifier, Reply URL, and Sign on URL values. To get these values, contact the [Everbridge support team](mailto:support@everbridge.com). You also can refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

6. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, select **Download** to download the **Federation Metadata XML**. Save it on your computer.

	![Certificate download link](common/metadataxml.png)

7. In the **Set up Everbridge** section, copy the URLs you need for your requirements:

	![Copy configuration URLs](common/copy-configuration-urls.png)

	- Login URL
	- Azure AD Identifier
	- Logout URL

### Configure Everbridge as Everbridge manager portal single sign-on

To configure SSO on **Everbridge** as an **Everbridge manager portal** application, follow these steps.
 
1. In a different web browser window, sign in to Everbridge as an administrator.

1. In the menu on the top, select the **Settings** tab. Under **Security**, select **Single Sign-On**.
   
     ![Configure single sign-on](./media/everbridge-tutorial/tutorial_everbridge_002.png)
   
     a. In the **Name** box, enter the name of the identifier provider. An example is your company name.
   
     b. In the **API Name** box, enter the name of the API.
   
     c. Select **Choose File** to upload the metadata file that you downloaded from the Azure portal.
   
     d. For **SAML Identity Location**, select **Identity is in the NameIdentifier element of the Subject statement**.
   
     e. In the **Identity Provider Login URL** box, paste the **Login URL** value that you copied from the Azure portal.
   
     f. For **Service Provider initiated Request Binding**, select **HTTP Redirect**.

     g. Select **Save**.

### Configure Everbridge as Everbridge member portal single sign-on

To configure single sign-on on **Everbridge** as an **Everbridge member portal**, send the downloaded **Federation Metadata XML** to the [Everbridge support team](mailto:support@everbridge.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create an Azure AD test user 

To create the test user Britta Simon in the Azure portal, follow these steps.

1. In the Azure portal, in the left pane, select **Azure Active Directory** > **Users** > **All users**.

    ![Users and All users links](common/users.png)

2. Select **New user** at the top of the screen.

    ![New user button](common/new-user.png)

3. In the **User** dialog box, follow these steps.

    ![User dialog box](common/user-properties.png)

    a. In the **Name** box, enter **BrittaSimon**.
  
    b. In the **User name** box, enter `brittasimon@yourcompanydomain.extension`. An example is BrittaSimon@contoso.com.

    c. Select the **Show Password** check box. Write down the value that displays in the **Password** box.

    d. Select **Create**.

### Assign the Azure AD test user

Enable Britta Simon to use Azure single sign-on by granting access to Everbridge.

1. In the Azure portal, select **Enterprise applications** > **All applications** >**Everbridge**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **Everbridge**.

	![Everbridge link in the applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![Users and groups link](common/users-groups-blade.png)

4. Select **Add user**. In the **Add Assignment** dialog box, select **Users and groups**.

    ![Add Assignment dialog box](common/add-assign-user.png)

5. In the **Users and groups** dialog box, select **Britta Simon** in the users list. Choose **Select** at the bottom of the screen.

6. If you expect any role value in the SAML assertion, in the **Select Role** dialog box, select the appropriate role for the user from the list. Choose **Select** at the bottom of the screen.

7. In the **Add Assignment** dialog box, select **Assign**.

### Create an Everbridge test user

In this section, you create the test user Britta Simon in Everbridge. To add users in the Everbridge platform, work with the [Everbridge support team](mailto:support@everbridge.com). Users must be created and activated in Everbridge before you use single sign-on. 

### Test single sign-on 

Test your Azure AD single sign-on configuration by using the Access Panel.

When you select the Everbridge tile in the Access Panel, you should be automatically signed in to the Everbridge account for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [List of tutorials on how to integrate SaaS apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)
- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)
- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)


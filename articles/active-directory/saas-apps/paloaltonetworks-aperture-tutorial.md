---
title: 'Tutorial: Azure Active Directory integration with Palo Alto Networks - Aperture | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Palo Alto Networks - Aperture.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: a5ea18d3-3aaf-4bc6-957c-783e9371d0f1
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 03/19/2019
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Palo Alto Networks - Aperture

In this tutorial, you learn how to integrate Palo Alto Networks - Aperture with Azure Active Directory (Azure AD).
Integrating Palo Alto Networks - Aperture with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to Palo Alto Networks - Aperture.
* You can enable your users to be automatically signed-in to Palo Alto Networks - Aperture (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with Palo Alto Networks - Aperture, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get one-month trial [here](https://azure.microsoft.com/pricing/free-trial/)
* Palo Alto Networks - Aperture single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Palo Alto Networks - Aperture supports **SP** and **IDP** initiated SSO

## Adding Palo Alto Networks - Aperture from the gallery

To configure the integration of Palo Alto Networks - Aperture into Azure AD, you need to add Palo Alto Networks - Aperture from the gallery to your list of managed SaaS apps.

**To add Palo Alto Networks - Aperture from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Navigate to **Enterprise Applications** and then select the **All Applications** option.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add new application, click **New application** button on the top of dialog.

	![The New application button](common/add-new-app.png)

4. In the search box, type **Palo Alto Networks - Aperture**, select **Palo Alto Networks - Aperture** from result panel then click **Add** button to add the application.

	 ![Palo Alto Networks - Aperture in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Palo Alto Networks - Aperture based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in Palo Alto Networks - Aperture needs to be established.

To configure and test Azure AD single sign-on with Palo Alto Networks - Aperture, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure Palo Alto Networks - Aperture Single Sign-On](#configure-palo-alto-networks---aperture-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Create Palo Alto Networks - Aperture test user](#create-palo-alto-networks---aperture-test-user)** - to have a counterpart of Britta Simon in Palo Alto Networks - Aperture that is linked to the Azure AD representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with Palo Alto Networks - Aperture, perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **Palo Alto Networks - Aperture** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, perform the following steps:

    ![Palo Alto Networks - Aperture Domain and URLs single sign-on information](common/idp-intiated.png)

    a. In the **Identifier** text box, type a URL using the following pattern:
    `https://<subdomain>.aperture.paloaltonetworks.com/d/users/saml/metadata`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://<subdomain>.aperture.paloaltonetworks.com/d/users/saml/auth`

5. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    ![Palo Alto Networks - Aperture Domain and URLs single sign-on information](common/metadata-upload-additional-signon.png)

    In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://<subdomain>.aperture.paloaltonetworks.com/d/users/saml/sign_in`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier, Reply URL and Sign-on URL. Contact [Palo Alto Networks - Aperture Client support team](https://live.paloaltonetworks.com/t5/custom/page/page-id/Support) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

6. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Base64)** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

7. On the **Set up Palo Alto Networks - Aperture** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Azure AD Identifier

	c. Logout URL

### Configure Palo Alto Networks - Aperture Single Sign-On

1. In a different web browser window, login to Palo Alto Networks - Aperture as an Administrator.

2. On the top menu bar, click **SETTINGS**.

	![The settings tab](./media/paloaltonetworks-aperture-tutorial/tutorial_paloaltonetwork_settings.png)

3. Navigate to **APPLICATION** section click **Authentication** form the left side of menu.

	![The Auth tab](./media/paloaltonetworks-aperture-tutorial/tutorial_paloaltonetwork_auth.png)
	
4. On the **Authentication** page perform the following steps:
	
	![The authentication tab](./media/paloaltonetworks-aperture-tutorial/tutorial_paloaltonetwork_singlesignon.png)

	a. Check the **Enable Single Sign-On(Supported SSP Providers are Okta, One login)** from **Single Sign-On** field.

	b. In the **Identity Provider ID** textbox, paste the value of **Azure AD Identifier**, which you have copied from Azure portal.

	c. Click **Choose File** to upload the downloaded Certificate from Azure AD in the **Identity Provider Certificate** field.

	d. In the **Identity Provider SSO URL** textbox, paste the value of **Login URL**, which you have copied from Azure portal.

	e. Review the IdP information from **Aperture Info** section and download the certificate from **Aperture Key** field.

	f. Click **Save**.

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

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Palo Alto Networks - Aperture.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **Palo Alto Networks - Aperture**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **Palo Alto Networks - Aperture**.

	![The Palo Alto Networks - Aperture link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog click the **Assign** button.

### Create Palo Alto Networks - Aperture test user

In this section, you create a user called Britta Simon in Palo Alto Networks - Aperture. Work with [Palo Alto Networks - Aperture Client support team](https://live.paloaltonetworks.com/t5/custom/page/page-id/Support) to add the users in the Palo Alto Networks - Aperture platform. Users must be created and activated before you use single sign-on.

### Test single sign-on 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Palo Alto Networks - Aperture tile in the Access Panel, you should be automatically signed in to the Palo Alto Networks - Aperture for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)


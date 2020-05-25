---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with Tableau Server | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Tableau Server.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: c1917375-08aa-445c-a444-e22e23fa19e0
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: tutorial
ms.date: 05/07/2020
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with Tableau Server

In this tutorial, you'll learn how to integrate Tableau Server with Azure Active Directory (Azure AD). When you integrate Tableau Server with Azure AD, you can:

* Control in Azure AD who has access to Tableau Server.
* Enable your users to be automatically signed-in to Tableau Server with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Tableau Server single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Tableau Server supports **SP** initiated SSO
* Once you configure Tableau Server you can enforce Session control, which protect exfiltration and infiltration of your organization’s sensitive data in real-time. Session control extend from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/proxy-deployment-aad)

## Adding Tableau Server from the gallery

To configure the integration of Tableau Server into Azure AD, you need to add Tableau Server from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Tableau Server** in the search box.
1. Select **Tableau Server** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD single sign-on for Tableau Server

Configure and test Azure AD SSO with Tableau Server using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Tableau Server.

To configure and test Azure AD SSO with Tableau Server, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Tableau Server SSO](#configure-tableau-server-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Tableau Server test user](#create-tableau-server-test-user)** - to have a counterpart of B.Simon in Tableau Server that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **Tableau Server** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, enter the values for the following fields:

    a. In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://azure.<domain name>.link`

    b. In the **Identifier** box, type a URL using the following pattern:
    `https://azure.<domain name>.link`

    c. In the **Reply URL** text box, type a URL using the following pattern:
    `https://azure.<domain name>.link/wg/saml/SSO/index.html`

	> [!NOTE]
	> The preceding values are not real values. Update the values with the actual URL and identifier from the Tableau Server configuration page which is explained later in the tutorial.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

1. On the **Set up Tableau Server** section, copy the appropriate URL(s) based on your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

### Create an Azure AD test user

In this section, you'll create a test user in the Azure portal called B.Simon.

1. From the left pane in the Azure portal, select **Azure Active Directory**, select **Users**, and then select **All users**.
1. Select **New user** at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Name** field, enter `B.Simon`.  
   1. In the **User name** field, enter the username@companydomain.extension. For example, `B.Simon@contoso.com`.
   1. Select the **Show password** check box, and then write down the value that's displayed in the **Password** box.
   1. Click **Create**.

### Assign the Azure AD test user

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Tableau Server.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Tableau Server**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Tableau Server SSO

1. To get SSO configured for your application, you need to sign in to your Tableau Server tenant as an administrator.

2. On the **CONFIGURATION** tab, select **User Identity & Access**, and then select the **Authentication** Method tab.

	![Configure Single Sign-On](./media/tableauserver-tutorial/tutorial-tableauserver-auth.png)

3. On the **CONFIGURATION** page, perform the following steps:

	![Configure Single Sign-On](./media/tableauserver-tutorial/tutorial-tableauserver-config.png)

	a. For **Authentication Method**, select SAML.

	b. Select the checkbox of **Enable SAML Authentication for the server**.

	c. Tableau Server return URL—The URL that Tableau Server users will be accessing, such as <http://tableau_server>. Using `http://localhost` is not recommended. Using a URL with a trailing slash (for example, `http://tableau_server/`) is not supported. Copy **Tableau Server return URL** and paste it in to **Sign On URL** textbox in **Basic SAML Configuration** section in the Azure portal

	d. SAML entity ID—The entity ID uniquely identifies your Tableau Server installation to the IdP. You can enter your Tableau Server URL again here, if you like, but it does not have to be your Tableau Server URL. Copy **SAML entity ID** and paste it in to **Identifier** textbox in **Basic SAML Configuration** section in the Azure portal

	e. Click the **Download XML Metadata File** and open it in the text editor application. Locate Assertion Consumer Service URL with Http Post and Index 0 and copy the URL. Now paste it in to **Reply URL** textbox in **Basic SAML Configuration** section in the Azure portal

	f. Locate your Federation Metadata file downloaded from Azure portal, and then upload it in the **SAML Idp metadata file**.

	g. Enter the names for the attributes that the IdP uses to hold the user names, display names, and email addresses.

	h. Click **Save**

	> [!NOTE]
	> Customer have to upload A PEM-encoded x509 Certificate file with a .crt extension and a RSA or DSA private key file that has the .key extension, as a Certificate Key file. For more information on Certificate file and Certificate Key file, please refer to [this](https://help.tableau.com/current/server/en-us/saml_requ.htm) document. If you need help configuring SAML on Tableau Server then please refer to this article [Configure Server Wide SAML](https://help.tableau.com/current/server/en-us/config_saml.htm).

### Create Tableau Server test user

The objective of this section is to create a user called B.Simon in Tableau Server. You need to provision all the users in the Tableau server.

That username of the user should match the value which you have configured in the Azure AD custom attribute of **username**. With the correct mapping the integration should work Configuring Azure AD Single Sign-On.

> [!NOTE]
> If you need to create a user manually, you need to contact the Tableau Server administrator in your organization.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Tableau Server tile in the Access Panel, you should be automatically signed in to the Tableau Server for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [ List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory ](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory? ](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [Try Tableau Server with Azure AD](https://aad.portal.azure.com/)

- [What is session control in Microsoft Cloud App Security?](https://docs.microsoft.com/cloud-app-security/proxy-intro-aad)
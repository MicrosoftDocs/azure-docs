---
title: 'Tutorial: Azure Active Directory integration with Keeper Password Manager & Digital Vault | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Keeper Password Manager & Digital Vault.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 11/13/2020
ms.author: jeedes
---
# Tutorial: Azure Active Directory integration with Keeper Password Manager & Digital Vault

In this tutorial, you learn how to integrate Keeper Password Manager & Digital Vault with Azure Active Directory (Azure AD).
This integration provides you with the following benefits:

* You can control in Azure AD who has access to Keeper Password Manager & Digital Vault.
* You can enable your users to be automatically signed in to Keeper Password Manager & Digital Vault (single sign-on) with their Azure AD accounts.
* You can manage your accounts in one central location: the Azure portal.


## Prerequisites

To configure Azure AD integration with Keeper Password Manager & Digital Vault, you need:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get a [one-month trial](https://azure.microsoft.com/pricing/free-trial/).
* Keeper Password Manager & Digital Vault subscription, enabled for single sign-on (SSO).

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Keeper Password Manager & Digital Vault supports SP-initiated SSO.

* Keeper Password Manager & Digital Vault supports just-in-time user provisioning.

## Add Keeper Password Manager & Digital Vault from the gallery

To configure the integration of Keeper Password Manager & Digital Vault into Azure AD, add the application from the gallery to your list of managed software as a service (SaaS) apps.

1. Sign in to the Azure portal by using either a work or school account, or a personal Microsoft account.
1. On the left pane, select the **Azure Active Directory** service.
1. Go to **Enterprise Applications**, and then select **All Applications**.
1. To add a new application, select **New application**.
1. In **Add from the gallery**, type **Keeper Password Manager & Digital Vault** in the search box.
1. Select **Keeper Password Manager & Digital Vault** from results panel, and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD SSO for Keeper Password Manager & Digital Vault

Configure and test Azure AD SSO with Keeper Password Manager & Digital Vault by using a test user called **B.Simon**. For SSO to work, you need to establish a linked relationship between an Azure AD user and the related user in Keeper Password Manager & Digital Vault.

To configure and test Azure AD SSO with Keeper Password Manager & Digital Vault:

1. [Configure Azure AD SSO](#configure-azure-ad-sso) to enable your users to use this feature.

    * [Create an Azure AD test user](#create-an-azure-ad-test-user) to test Azure AD single sign-on with Britta Simon.
    * [Assign the Azure AD test user](#assign-the-azure-ad-test-user) to enable Britta Simon to use Azure AD single sign-on.

1. [Configure Keeper Password Manager & Digital Vault SSO](#configure-keeper-password-manager--digital-vault-sso) to configure the SSO settings on the application side.
    * [Create a Keeper Password Manager & Digital Vault test user](#create-a-keeper-password-manager--digital-vault-test-user) to have a counterpart of Britta Simon in Keeper Password Manager & Digital Vault linked to the Azure AD representation of the user.
1. [Test SSO](#test-sso) to verify whether the configuration works.

### Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Keeper Password Manager & Digital Vault** application integration page, find the **Manage** section. Select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot of Set up Single Sign-On with SAML, with pencil icon highlighted.](common/edit-urls.png)

4. In the **Basic SAML Configuration** section, perform the following steps:

	a. For **Sign on URL**, type a URL that uses the following pattern:
    * For cloud SSO: `https://keepersecurity.com/api/rest/sso/saml/sso/<CLOUD_INSTANCE_ID>`
    * For on-premises SSO: `https://<KEEPER_FQDN>/sso-connect/saml/login`

    b. For **Identifier (Entity ID)**, type a URL that uses the following pattern:
    * For cloud SSO: `https://keepersecurity.com/api/rest/sso/saml/<CLOUD_INSTANCE_ID>`
    * For on-premises SSO: `https://<KEEPER_FQDN>/sso-connect`

    c. For **Reply URL**, type a URL that uses the following pattern:
    * For cloud SSO: `https://keepersecurity.com/api/rest/sso/saml/sso/<CLOUD_INSTANCE_ID>`
    * For on-premises SSO: `https://<KEEPER_FQDN>/sso-connect/saml/sso`

	> [!NOTE]
	> These values aren't real. Update these values with the actual sign-on URL, identifier, and reply URL. To get these values, contact the [Keeper Password Manager & Digital Vault Client support team](https://keepersecurity.com/contact.html). You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. The Keeper Password Manager & Digital Vault application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

	![Screenshot of User Attributes & Claims.](common/default-attributes.png)

1. In addition, the Keeper Password Manager & Digital Vault application expects a few more attributes to be passed back in SAML response. These are shown in the following table. These attributes are also pre-populated, but you can review them per your requirements.

	| Name | Source attribute|
	| ------------| --------- |
	| First | user.givenname |
	| Last | user.surname |
    | Email | user.mail |

5. On **Set up Single Sign-On with SAML**, in the **SAML Signing Certificate** section, select **Download**. This downloads **Federation Metadata XML** from the options per your requirement, and saves it on your computer.

	![Screenshot of SAML Signing Certificate, with Download highlighted.](common/metadataxml.png)

6. On **Set up Keeper Password Manager & Digital Vault**, copy the appropriate URLs, per your requirement.

	![Screenshot of Set up Keeper Password Manager & Digital Vault, with URLs highlighted.](common/copy-configuration-urls.png)

### Create an Azure AD test user 

In this section, you create a test user in the Azure portal called `B.Simon`.

1. From the left pane in the Azure portal, select **Azure Active Directory** > **Users** > **All users**.
1. At the top of the screen, select **New user**.
1. In the **User** properties, follow these steps:
   1. For **Name**, enter `B.Simon`.  
   1. For **User name**, enter the `username@companydomain.extension`. For example, `B.Simon@contoso.com`.
   1. Select **Show password**, and then write down the value shown.
   1. Select **Create**.

### Assign the Azure AD test user

In this section, you enable B.Simon to use Azure single sign-on by granting access to Keeper Password Manager & Digital Vault.

1. In the Azure portal, select **Enterprise Applications** > **All applications**.
1. In the applications list, select **Keeper Password Manager & Digital Vault**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**. In **Add Assignment**, select **Users and groups**.
1. In **Users and groups**, select **B.Simon** from the list of users. Then choose **Select** at the bottom of the screen.
1. If you're expecting a role to be assigned to the users, you can select it from the **Select a role** list. If no role has been set up for this app, the **Default Access** role is selected.
1. In **Add Assignment**, select **Assign**.


## Configure Keeper Password Manager & Digital Vault SSO

To configure SSO for the app, see the guidelines in the [Keeper support guide](https://docs.keeper.io/sso-connect-guide/).

### Create a Keeper Password Manager & Digital Vault test user

To enable Azure AD users to sign in to Keeper Password Manager & Digital Vault, you must provision them. The application supports just-in-time user provisioning, and after authentication users are created in the application automatically. If you want to set up users manually, contact [Keeper support](https://keepersecurity.com/contact.html).

## Test SSO

In this section, you test your Azure AD single sign-on configuration with following options. 

* In the Azure portal, select **Test this application**. This redirects to the sign-on URL for Keeper Password Manager & Digital Vault, where you can initiate the sign-on. 

* You can go directly to the sign-on URL for the application, and initiate the sign-in from there.

* You can use Microsoft Access Panel. When you select the **Keeper Password Manager & Digital Vault** tile in Access Panel, this redirects you to the sign-on URL for the application. For more information about Access Panel, see [Sign in and start apps from the My Apps portal](../user-help/my-apps-portal-end-user-access.md).


## Next steps

After you configure Keeper Password Manager & Digital Vault, you can enforce session control. This protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. For more information, see [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).
---
title: 'Tutorial: Azure AD SSO integration with ContractSafe Saml2 SSO'
description: Learn how to configure single sign-on between Azure Active Directory and ContractSafe Saml2 SSO.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 10/18/2021
ms.author: jeedes
---

# Tutorial: Integrate Azure AD SSO with ContractSafe Saml2 SSO

In this tutorial, you'll learn how to integrate ContractSafe Saml2 SSO with Azure Active Directory (Azure AD). When you integrate ContractSafe Saml2 SSO with Azure AD, you can:

* Control who has access to ContractSafe Saml2 SSO in Azure AD.
* Enable your users to automatically sign in to ContractSafe Saml2 SSO with their Azure AD accounts.
* Manage your accounts in one central location: the Azure portal.

## Prerequisites

To get started, you need:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* A ContractSafe Saml2 SSO subscription with SSO enabled.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* ContractSafe Saml2 SSO supports **IDP**-initiated SSO.

## Add ContractSafe Saml2 SSO from the gallery

To configure the integration of ContractSafe Saml2 SSO into Azure AD, you need to add ContractSafe Saml2 SSO from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal by using either a work or school account or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Go to **Enterprise Applications**, and then select **All Applications**.
1. To add a new application, select **New application**.
1. In the **Add from the gallery** section, type **ContractSafe Saml2 SSO** in the search box.
1. Select **ContractSafe Saml2 SSO** from the results panel, and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for ContractSafe Saml2 SSO

Configure and test Azure AD SSO with ContractSafe Saml2 SSO by using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in ContractSafe Saml2 SSO.

To configure and test Azure AD SSO with ContractSafe Saml2 SSO, perform the following steps:

1. [Configure Azure AD SSO](#configure-azure-ad-sso) to enable your users to use this feature.
   1. [Create an Azure AD test user](#create-an-azure-ad-test-user) to test Azure AD SSO by using the **B.Simon** account.
   1. [Assign the Azure AD test user](#assign-the-azure-ad-test-user) to enable **B.Simon** to use Azure AD SSO.
1. [Configure ContractSafe Saml2 SSO](#configure-contractsafe-saml2-sso) to configure the SSO settings on application side.
   1. [Create a ContractSafe Saml2 SSO test user](#create-a-contractsafe-saml2-sso-test-user) to have a counterpart of **B.Simon** in ContractSafe Saml2 SSO that is linked to the Azure AD representation of the user.
1. [Test SSO](#test-sso) to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal:

1. In the Azure portal, on the **ContractSafe Saml2 SSO** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, perform the following steps:

   a. In the **Identifier** text box, type a URL by using the following pattern:
    `https://app.contractsafe.com/saml2_auth/<UNIQUEID>/acs/`

   b. In the **Reply URL** text box, type a URL by using the following pattern:
    `https://app.contractsafe.com/saml2_auth/<UNIQUEID>/acs/`

	> [!NOTE]
	> These values aren't real. Update these values with the actual Identifier and Reply URL. Contact the [ContractSafe Saml2 SSO Client support team](mailto:support@contractsafe.com) to get these values. You can also refer to the formats shown in the **Basic SAML Configuration** section in the Azure portal.

1. ContractSafe Saml2 SSO expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

	![Common default attributes](common/default-attributes.png)

1. In addition to the default attributes, the ContractSafe Saml2 SSO application expects a few more attributes to be passed back in the SAML response. These attributes are pre-populated, but you can review them according to your requirements. The following list shows the additional attributes.

	| Name | Source attribute|
	| ---------------| --------------- |
	| emailname | user.userprincipalname |
	| email | user.onpremisesuserprincipalname |

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Federation Metadata XML**. Select **Download** to download the certificate, and then save it on your computer.

	![The Certificate download link](common/metadataxml.png)

1. In the **Set up ContractSafe Saml2 SSO** section, copy the appropriate URL(s) based on your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

### Create an Azure AD test user

In this section, you'll create a test user in the Azure portal called **B.Simon**.

1. From the left pane in the Azure portal, select **Azure Active Directory**. Select **Users**, and then select **All users**.
1. Select **New user** at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Name** field, enter `B.Simon`.  
   1. In the **User name** field, enter an email address in the `username@companydomain.extension` format. An example is `B.Simon@contoso.com`.
   1. Select the **Show password** check box, and then write down the value that's displayed in the **Password** box.
   1. Select **Create**.

### Assign the Azure AD test user

In this section, you'll enable **B.Simon** to use Azure SSO by granting access to ContractSafe Saml2 SSO.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **ContractSafe Saml2 SSO**.
1. In the app's overview page, find the **Manage** section, and then select **Users and groups**.
1. Select **Add user**, and then select **Users and groups** in the **Add Assignment** dialog box.
1. In the **Users and groups** dialog box, select **B.Simon** from the **Users** list. Then, select the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog box, select the appropriate role for the user from the list. Then, choose the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog box, select the **Assign** button.

## Configure ContractSafe Saml2 SSO

To configure SSO on the **ContractSafe Saml2 SSO** side, you need to send the downloaded **Federation Metadata XML** and appropriate copied URLs from the Azure portal to the [ContractSafe Saml2 SSO support team](mailto:support@contractsafe.com). The team is responsible for setting the SAML SSO connection properly on both sides.

### Create a ContractSafe Saml2 SSO test user

Create a user called B.Simon in ContractSafe Saml2 SSO. Work with the [ContractSafe Saml2 SSO support team](mailto:support@contractsafe.com) to add the users in the ContractSafe Saml2 SSO platform. Users must be created and activated before you use SSO.

## Test SSO

In this section, you test your Azure AD single sign-on configuration with following options.

* Click on Test this application in Azure portal and you should be automatically signed in to the ContractSafe Saml2 SSO for which you set up the SSO.

* You can use Microsoft My Apps. When you click the ContractSafe Saml2 SSO tile in the My Apps, you should be automatically signed in to the ContractSafe Saml2 SSO for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure ContractSafe Saml2 SSO you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).

---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with ContractSafe Saml2 SSO | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and ContractSafe Saml2 SSO.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 9d8c9eba-6a90-4c8f-b387-a6ead4af00af
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: tutorial
ms.date: 12/20/2019
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Integrate Azure Active Directory single sign-on (SSO) with ContractSafe Saml2 SSO

In this tutorial, you'll learn how to integrate ContractSafe Saml2 SSO with Azure Active Directory (Azure AD). When you integrate ContractSafe Saml2 SSO with Azure AD, you can:

* Control who has access to ContractSafe Saml2 SSO in Azure AD.
* Enable your users to automatically sign in to ContractSafe Saml2 SSO with their Azure AD accounts.
* Manage your accounts in one central location: the Azure portal.

To learn more about software as a service (SaaS) app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).

## Prerequisites

To get started, you need:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* A ContractSafe Saml2 SSO subscription with SSO enabled.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment. ContractSafe Saml2 SSO supports **IDP**-initiated SSO.

## Add ContractSafe Saml2 SSO from the gallery

To configure the integration of ContractSafe Saml2 SSO into Azure AD, you need to add ContractSafe Saml2 SSO from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) by using either a work or school account or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Go to **Enterprise Applications**, and then select **All Applications**.
1. To add a new application, select **New application**.
1. In the **Add from the gallery** section, type **ContractSafe Saml2 SSO** in the search box.
1. Select **ContractSafe Saml2 SSO** from the results panel, and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD SSO for ContractSafe Saml2 SSO

Configure and test Azure AD SSO with ContractSafe Saml2 SSO by using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in ContractSafe Saml2 SSO.

To configure and test Azure AD SSO with ContractSafe Saml2 SSO, complete the following building blocks:

1. [Configure Azure AD SSO](#configure-azure-ad-sso) to enable your users to use this feature.
   * [Create an Azure AD test user](#create-an-azure-ad-test-user) to test Azure AD SSO by using the **B.Simon** account.
   * [Assign the Azure AD test user](#assign-the-azure-ad-test-user) to enable **B.Simon** to use Azure AD SSO.

1. [Configure ContractSafe Saml2 SSO](#configure-contractsafe-saml2-sso) to configure the SSO settings on application side.
   * [Create a ContractSafe Saml2 SSO test user](#create-a-contractsafe-saml2-sso-test-user) to have a counterpart of **B.Simon** in ContractSafe Saml2 SSO that is linked to the Azure AD representation of the user.
2. [Test SSO](#test-sso) to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal:

1. In the [Azure portal](https://portal.azure.com/), on the **ContractSafe Saml2 SSO** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the edit (pen) icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Set up single sign-on with SAML** page, enter the following values in the corresponding fields:

    a. In the **Identifier** text box, enter a URL by using the following format:
    `https://app.contractsafe.com/saml2_auth/<UNIQUEID>/acs/`

    b. In the **Reply URL** text box, enter a URL by using the following format:
    `https://app.contractsafe.com/saml2_auth/<UNIQUEID>/acs/`

	> [!NOTE]
	> These values aren't real. Update these values with the actual identifier and reply URL. Contact the [ContractSafe Saml2 SSO Client support team](mailto:donne@contractsafe.com) to get these values. You can also refer to the formats shown in the **Basic SAML Configuration** section in the Azure portal.

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

## Create an Azure AD test user

In this section, you'll create a test user in the Azure portal called **B.Simon**.

1. From the left pane in the Azure portal, select **Azure Active Directory**. Select **Users**, and then select **All users**.
1. Select **New user** at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Name** field, enter `B.Simon`.  
   1. In the **User name** field, enter an email address in the `username@companydomain.extension` format. An example is `B.Simon@contoso.com`.
   1. Select the **Show password** check box, and then write down the value that's displayed in the **Password** box.
   1. Select **Create**.

## Assign the Azure AD test user

In this section, you'll enable **B.Simon** to use Azure SSO by granting access to ContractSafe Saml2 SSO.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **ContractSafe Saml2 SSO**.
1. In the app's overview page, find the **Manage** section, and then select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, and then select **Users and groups** in the **Add Assignment** dialog box.

   ![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog box, select **B.Simon** from the **Users** list. Then, select the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog box, select the appropriate role for the user from the list. Then, choose the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog box, select the **Assign** button.

## Configure ContractSafe Saml2 SSO

To configure SSO on the **ContractSafe Saml2 SSO** side, you need to send the downloaded **Federation Metadata XML** and appropriate copied URLs from the Azure portal to the [ContractSafe Saml2 SSO support team](mailto:donne@contractsafe.com). The team is responsible for setting the SAML SSO connection properly on both sides.

## Create a ContractSafe Saml2 SSO test user

Create a user called B.Simon in ContractSafe Saml2 SSO. Work with the [ContractSafe Saml2 SSO support team](mailto:donne@contractsafe.com) to add the users in the ContractSafe Saml2 SSO platform. Users must be created and activated before you use SSO.

## Test SSO

Test your Azure AD SSO configuration by using the Access Panel. When you select the ContractSafe Saml2 SSO tile in the Access Panel, you should be automatically signed in to the ContractSafe Saml2 SSO for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [ List of tutorials on how to integrate SaaS apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [Try ContractSafe Saml2 SSO with Azure AD](https://aad.portal.azure.com/)

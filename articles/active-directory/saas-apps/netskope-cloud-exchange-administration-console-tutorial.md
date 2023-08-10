---
title: Azure Active Directory SSO integration with Netskope Cloud Exchange Administration Console
description: Learn how to configure single sign-on between Azure Active Directory and Netskope Cloud Exchange Administration Console.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: how-to
ms.date: 07/19/2023
ms.author: jeedes

---

# Azure Active Directory SSO integration with Netskope Cloud Exchange Administration Console

In this article, you'll learn how to integrate Netskope Cloud Exchange Administration Console with Azure Active Directory (Azure AD). The Netskope Cloud Exchange (CE) gives customers powerful integration capabilities to leverage investments across their security and IT stacks. When you integrate Netskope Cloud Exchange Administration Console with Azure AD, you can:

* Control in Azure AD who has access to Netskope Cloud Exchange Administration Console.
* Enable your users to be automatically signed-in to Netskope Cloud Exchange Administration Console with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

You'll configure and test Azure AD single sign-on for Netskope Cloud Exchange Administration Console in a test environment. Netskope Cloud Exchange Administration Console supports **SP** initiated single sign-on.

## Prerequisites

To integrate Azure Active Directory with Netskope Cloud Exchange Administration Console, you need:

* An Azure AD user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Netskope Cloud Exchange Administration Console single sign-on (SSO) enabled subscription.

## Add application and assign a test user

Before you begin the process of configuring single sign-on, you need to add the Netskope Cloud Exchange Administration Console application from the Azure AD gallery. You need a test user account to assign to the application and test the single sign-on configuration.

### Add Netskope Cloud Exchange Administration Console from the Azure AD gallery

Add Netskope Cloud Exchange Administration Console from the Azure AD application gallery to configure single sign-on with Netskope Cloud Exchange Administration Console. For more information on how to add application from the gallery, see the [Quickstart: Add application from the gallery](../manage-apps/add-application-portal.md).

### Create and assign Azure AD test user

Follow the guidelines in the [create and assign a user account](../manage-apps/add-application-portal-assign-users.md) article to create a test user account in the Azure portal called B.Simon.

Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, and assign roles. The wizard also provides a link to the single sign-on configuration pane in the Azure portal. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides). 

## Configure Azure AD SSO

Complete the following steps to enable Azure AD single sign-on in the Azure portal.

1. In the Azure portal, on the **Netskope Cloud Exchange Administration Console** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot shows how to edit Basic SAML Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, perform the following steps:

	a. In the **Identifier** textbox, type a URL using the following pattern:
	`https://<Cloud_Exchange_FQDN>/api/metadata`

    b. In the **Reply URL** textbox, type a URL using the following pattern:
    `https://<Cloud_Exchange_FQDN>/api/ssoauth?acs=true`

	c. In the **Sign on URL** textbox, type a URL using the following pattern:
	`https://<Cloud_Exchange_FQDN>/login`

	> [!NOTE]
    > These values are not real. Update these values with the actual Identifier, Reply URL and Sign on URL based on your cloud exchange deployment. You can also contact [Netskope Cloud Exchange Administration Console support team](mailto:support@netskope.com) to get help to determine these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. Netskope Cloud Exchange Administration Console application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

	![Screenshot shows the image of attributes configuration.](common/default-attributes.png "Image")

1. In addition to above, Netskope Cloud Exchange Administration Console application expects few more attributes to be passed back in SAML response, which are shown below. These attributes are also pre populated but you can review them as per your requirements.

	| Name |  Source Attribute|
	| ---------------|  --------- |
	| username | user.mail |
	| roles | user.assignedroles |

   > [!NOTE]
   > Please click [here](../develop/howto-add-app-roles-in-azure-ad-apps.md#app-roles-ui) to know how to configure Role in Azure AD.

1. On the **Set-up single sign-on with SAML** page, in the **SAML Signing Certificate** section, find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

    ![Screenshot shows the Certificate download link.](common/certificatebase64.png "Certificate")

1. On the **Set up Netskope Cloud Exchange Administration Console** section, copy the appropriate URL(s) based on your requirement.

	![Screenshot shows to copy configuration appropriate URL.](common/copy-configuration-urls.png "Metadata")

## Configure Netskope Cloud Exchange Administration Console SSO

To configure single sign-on on **Netskope Cloud Exchange Administration Console** side, you need to send the downloaded **Certificate (Base64)** and appropriate copied URLs from Azure portal to [Netskope Cloud Exchange Administration Console support team](mailto:support@netskope.com). They set this setting to have the SAML SSO connection set properly on both sides

### Create Netskope Cloud Exchange Administration Console test user

In this section, you create a user called Britta Simon at Netskope Cloud Exchange Administration Console SSO. Work with [Netskope Cloud Exchange Administration Console support team](mailto:support@netskope.com) to add the users in the Netskope Cloud Exchange Administration Console SSO platform. Users must be created and activated before you use single sign-on.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

* Click on **Test this application** in Azure portal. This will redirect to Netskope Cloud Exchange Administration Console Sign-on URL where you can initiate the login flow. 

* Go to Netskope Cloud Exchange Administration Console Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Netskope Cloud Exchange Administration Console tile in the My Apps, this will redirect to Netskope Cloud Exchange Administration Console Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Additional resources

* [What is single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)
* [Plan a single sign-on deployment](../manage-apps/plan-sso-deployment.md).

## Next steps

Once you configure Netskope Cloud Exchange Administration Console you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).
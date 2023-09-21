---
title: Microsoft Entra SSO integration with Worthix App
description: Learn how to configure single sign-on between Microsoft Entra ID and Worthix App.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: how-to
ms.date: 07/11/2023
ms.author: jeedes

---

# Microsoft Entra SSO integration with Worthix App

In this article, you'll learn how to integrate Worthix App with Microsoft Entra ID. Worthix App is a Customer Value Alignment platform that uses I.A to dialogue with your company customers to collect their company value perceptions. When you integrate Worthix App with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to Worthix App.
* Enable your users to be automatically signed-in to Worthix App with their Microsoft Entra accounts.
* Manage your accounts in one central location.

You'll configure and test Microsoft Entra single sign-on for Worthix App in a test environment. Worthix App supports **IDP** initiated single sign-on and **Just In Time** user provisioning.

## Prerequisites

To integrate Microsoft Entra ID with Worthix App, you need:

* A Microsoft Entra user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Worthix App single sign-on (SSO) enabled subscription.

## Add application and assign a test user

Before you begin the process of configuring single sign-on, you need to add the Worthix App application from the Microsoft Entra gallery. You need a test user account to assign to the application and test the single sign-on configuration.

<a name='add-worthix-app-from-the-azure-ad-gallery'></a>

### Add Worthix App from the Microsoft Entra gallery

Add Worthix App from the Microsoft Entra application gallery to configure single sign-on with Worthix App. For more information on how to add application from the gallery, see the [Quickstart: Add application from the gallery](../manage-apps/add-application-portal.md).

<a name='create-and-assign-azure-ad-test-user'></a>

### Create and assign Microsoft Entra test user

Follow the guidelines in the [create and assign a user account](../manage-apps/add-application-portal-assign-users.md) article to create a test user account called B.Simon.

Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, and assign roles. The wizard also provides a link to the single sign-on configuration pane. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides). 

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Complete the following steps to enable Microsoft Entra single sign-on.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Worthix App** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot shows how to edit Basic SAML Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, perform the following steps:

	a. In the **Identifier** textbox, type a value using the following pattern:
	`urn:auth0:production-worthix:<Company_Name>Saml`

    b. In the **Reply URL** textbox, type a URL using the following pattern:
    `https://production-worthix.us.auth0.com/login/callback?connection=<Company_Name>Saml`
	
	> [!NOTE]
    > These values are not real. Update these values with the actual Identifier and Reply URL. Contact [Worthix App support team](mailto:support@worthix.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section.

1. On the **Set-up single sign-on with SAML** page, in the **SAML Signing Certificate** section, find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

    ![Screenshot shows the Certificate download link.](common/certificatebase64.png "Certificate")

1. On the **Set up Worthix App** section, copy the appropriate URL(s) based on your requirement.

	![Screenshot shows to copy configuration appropriate URL.](common/copy-configuration-urls.png "Metadata")

## Configure Worthix App SSO

To configure single sign-on on **Worthix App** side, you need to send the downloaded **Certificate (Base64)** and appropriate copied URLs from the application configuration to [Worthix App support team](mailto:support@worthix.com). They set this setting to have the SAML SSO connection set properly on both sides

### Create Worthix App test user

In this section, a user called B.Simon is created in Worthix App. Worthix App supports just-in-time user provisioning, which is enabled by default. There's no action item for you in this section. If a user doesn't already exist in Worthix App, a new one is commonly created after authentication.

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options.

* Click on **Test this application**, and you should be automatically signed in to the Worthix App for which you set up the SSO.

* You can use Microsoft My Apps. When you click the Worthix App tile in the My Apps, you should be automatically signed in to the Worthix App for which you set up the SSO. For more information, see [Microsoft Entra My Apps](/azure/active-directory/manage-apps/end-user-experiences#azure-ad-my-apps).

## Additional resources

* [What is single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)
* [Plan a single sign-on deployment](../manage-apps/plan-sso-deployment.md).

## Next steps

Once you configure Worthix App you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).

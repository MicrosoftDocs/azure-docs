---
title: Microsoft Entra SSO integration with Beable
description: Learn how to configure single sign-on between Microsoft Entra ID and Beable.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: how-to
ms.date: 04/11/2023
ms.author: jeedes

---

# Microsoft Entra SSO integration with Beable

In this article, you learn how to integrate Beable with Microsoft Entra ID. Beable Education offers interactive & engaging online learning platforms, textbooks & mobile apps for students to access information & succeed in studies. When you integrate Beable with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to Beable.
* Enable your users to be automatically signed-in to Beable with their Microsoft Entra accounts.
* Manage your accounts in one central location.

You configure and test Microsoft Entra single sign-on for Beable in a test environment. Beable supports **IDP** initiated single sign-on.

## Prerequisites

To integrate Microsoft Entra ID with Beable, you need:

* A Microsoft Entra user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Beable single sign-on (SSO) enabled subscription.

## Add application and assign a test user

Before you begin the process of configuring single sign-on, you need to add the Beable application from the Microsoft Entra gallery. You need a test user account to assign to the application and test the single sign-on configuration.

<a name='add-beable-from-the-azure-ad-gallery'></a>

### Add Beable from the Microsoft Entra gallery

Add Beable from the Microsoft Entra application gallery to configure single sign-on with Beable. For more information on how to add application from the gallery, see the [Quickstart: Add application from the gallery](../manage-apps/add-application-portal.md).

<a name='create-and-assign-azure-ad-test-user'></a>

### Create and assign Microsoft Entra test user

Follow the guidelines in the [create and assign a user account](../manage-apps/add-application-portal-assign-users.md) article to create a test user account called B.Simon.

Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, and assign roles. The wizard also provides a link to the single sign-on configuration pane. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides). 

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Complete the following steps to enable Microsoft Entra single sign-on.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Beable** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot shows how to edit Basic SAML Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, perform the following steps:

	a. In the **Identifier** textbox, type a URL using the following pattern:
	`https://<SUBDOMAIN>.beable.com` 

	b. In the **Reply URL** textbox, type a URL using the following pattern:
	`https://prod-literacy-backend-alb-<ID>.beable.com/login/ssoVerification/?providerId=<ProviderID>&identifier=<DOMAIN>`

	> [!Note]
    > These values are not real. Update these values with the actual Identifier and Reply URL. Contact [Beable support team](https://beable.com/contact/) to get these values. You can also refer to the patterns shown in the Basic SAML Configuration section.

1. Beable application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

	![Screenshot shows the image of attributes configuration.](common/default-attributes.png "Image")

1. In addition to above, Beable application expects few more attributes to be passed back in SAML response, which are shown below. These attributes are also pre populated but you can review them as per your requirements.

	| Name |  Source Attribute|
	| ---------------|  --------- |
    | usertype | user.usertype |
	| preferredlanguage | user.preferredlanguage |
	| assignedroles | user.assignedroles |

1. On the **Set-up single sign-on with SAML** page, in the **SAML Signing Certificate** section, find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

    ![Screenshot shows the Certificate download link.](common/certificatebase64.png "Certificate")

1. On the **Set up Beable** section, copy the appropriate URL(s) based on your requirement.

	![Screenshot shows to copy configuration appropriate URL.](common/copy-configuration-urls.png "Metadata")

## Configure Beable SSO

To configure single sign-on on **Beable** side, you need to send the downloaded **Certificate (Base64)** and appropriate copied URLs from the application configuration to [Beable support team](https://beable.com/contact/). They set this setting to have the SAML SSO connection set properly on both sides

### Create Beable test user

In this section, the users are rostered in Beable. Work with [Beable support team](https://beable.com/contact/) to provision the users in the Beable platform.

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options.

* Click on **Test this application**, and you should be automatically signed in to the Beable for which you set up the SSO.

* You can use Microsoft My Apps. When you click the Beable tile in the My Apps, you should be automatically signed in to the Beable for which you set up the SSO. For more information, see [Microsoft Entra My Apps](/azure/active-directory/manage-apps/end-user-experiences#azure-ad-my-apps).

## Next steps

Once you configure Beable you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).

---
title: Microsoft Entra SSO integration with CITI Program
description: Learn how to configure single sign-on between Microsoft Entra ID and CITI Program.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: how-to
ms.date: 08/23/2023
ms.author: jeedes

---

# Microsoft Entra SSO integration with CITI Program

In this article, you learn how to integrate CITI Program with Microsoft Entra ID. The CITI Program identifies education and training needs in the communities we serve and provides high quality, peer-reviewed, web-based educational materials to meet those needs. When you integrate CITI Program with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to CITI Program.
* Enable your users to be automatically signed-in to CITI Program with their Microsoft Entra accounts.
* Manage your accounts in one central location.

You configure and test Microsoft Entra single sign-on for CITI Program in a test environment. CITI Program supports **SP-initiated** single sign-on and **Just-In-Time** user provisioning.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Prerequisites

To integrate Microsoft Entra ID with CITI Program, you need:

* CITI Program Single Sign-On (SSO) enabled subscription. Note that [SSO is a paid service with CITI Program](https://support.citiprogram.org/s/article/single-sign-on-sso-and-shibboleth-technical-specs#General).
* A Microsoft Entra user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).

## Add application and assign a test user

Before you begin the process of configuring single sign-on, you need to add the CITI Program application from the Microsoft Entra gallery. You need a test user account to assign to the application and test the single sign-on configuration.

<a name='add-citi-program-from-the-azure-ad-gallery'></a>

### Add CITI Program from the Microsoft Entra gallery

Add CITI Program from the Microsoft Entra application gallery to configure single sign-on with CITI Program. For more information on how to add application from the gallery, see the [Quickstart: Add application from the gallery](../manage-apps/add-application-portal.md).

<a name='create-and-assign-azure-ad-test-user'></a>

### Create and assign Microsoft Entra test user

Follow the guidelines in the [create and assign a user account](../manage-apps/add-application-portal-assign-users.md) article to create a test user account.

Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, and assign roles. The wizard also provides a link to the single sign-on configuration pane. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides). 

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Complete the following steps to enable Microsoft Entra single sign-on.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **CITI Program** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot shows how to edit Basic SAML Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, perform the following steps:

	a. In the **Identifier (Entity ID)** textbox, type the URL:
	`https://www.citiprogram.org/shibboleth`

	b. In the **Reply URL (Assertion Consumer Service URL)** textbox, type the URL:
	`https://www.citiprogram.org/Shibboleth.sso/SAML2/POST`

	c. In the **Sign on URL** textbox, type a URL using the following pattern:
	`https://www.citiprogram.org/Shibboleth.sso/Login?target=https://www.citiprogram.org/Secure/Welcome.cfm?inst=<InstitutionID>&entityID=<EntityID>`

	> [!NOTE]
	> This value is not real. Update this value with the actual Sign on URL. Contact [CITI Program support team](mailto:shibboleth@citiprogram.org) to get the value. You can also refer to the patterns shown in the **Basic SAML Configuration** section.

1. The CITI Program application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

	![Screenshot shows the image of attributes configuration.](common/default-attributes.png "Default Attributes")

1. CITI Program application expects urn: oid named attributes to be passed back in the SAML response, which are shown below. These attributes are also pre-populated but you can review them as per your requirements. These are all required.

	| Name |  Source Attribute|
	| ---------------|  --------- |
	| urn:oid:1.3.6.1.4.1.5923.1.1.1.6 | user.userprincipalname |
	| urn:oid:0.9.2342.19200300.100.1.3 | user.mail |
	| urn:oid:2.5.4.42 | user.givenname |
	| urn:oid:2.5.4.4 | user.surname |

1. If you wish to pass additional information in the SAML response, CITI Program can also accept the following optional attributes.

	| Name |  Source Attribute|
	| ---------------|  --------- |
	| urn:oid:2.16.840.1.113730.3.1.241 | user.displayname |
	| urn:oid:2.16.840.1.113730.3.1.3 | user.employeeid |
	| urn:oid:1.3.6.1.4.1.22704.1.1.1.8 | [other user attribute] |
	> [!NOTE]
	> The Source Attribute is what is generally recommended, but not necessarily a rule. For example, if user.mail is unique and scoped, it can also be passed as urn:oid:1.3.6.1.4.1.5923.1.1.1.6.

1. On the **Set-up single sign-on with SAML** page, in the **SAML Signing Certificate** section, find the **App Federation Metadata Url** and copy it, or the **Federation Metadata XML** and select **Download** to download the certificate.

    ![Screenshot shows the Certificate download link.](common/metadataxml.png "Certificate")

1. On the **Set up CITI Program** section, copy the appropriate URL(s) based on your requirement.

	![Screenshot shows to copy configuration appropriate URL.](common/copy-configuration-urls.png "Metadata")

## Configure CITI Program SSO

To configure single sign-on on **CITI Program** side, you need to send the copied **App Federation Metadata Url** or the downloaded **Federation Metadata XML** to [CITI Program Support](mailto:shibboleth@citiprogram.org). This is required to have the SAML SSO connection set properly on both sides. Also, provide any additional scopes or domains for your integration.

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

* Click on **Test this application**, this will redirect to CITI Program Sign-on URL where you can initiate the login flow. 

* Go to CITI Program Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the CITI Program tile in the My Apps, this will redirect to CITI Program Sign-on URL. For more information, see [Microsoft Entra My Apps](/azure/active-directory/manage-apps/end-user-experiences#azure-ad-my-apps).

CITI Program supports just-in-time user provisioning. First time SSO users will be prompted to either: 

* Link their existing CITI Program account, in the case that they already have one
![SSOHaveAccount](https://user-images.githubusercontent.com/46728557/228357500-a74489c7-8c5f-4cbe-ad47-9757d3d9fbe6.PNG "Link existing CITI Program account")

* Or Create a new CITI Program account, which is automatically provisioned
![SSONotHaveAccount](https://user-images.githubusercontent.com/46728557/228357503-f4eba4bb-f3fa-43e9-a98a-f0da87074eeb.PNG "Provision new CITI Program account")

## Additional resources

* [CITI Program SSO Technical Information](https://support.citiprogram.org/s/article/single-sign-on-sso-and-shibboleth-technical-specs#EntityInformation)
* [What is single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)
* [Plan a single sign-on deployment](../manage-apps/plan-sso-deployment.md)

## Next steps

Once you configure CITI Program you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).

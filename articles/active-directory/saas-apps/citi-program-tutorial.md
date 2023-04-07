---
title: Azure Active Directory SSO integration with CITI Program
description: Learn how to configure single sign-on between Azure Active Directory and CITI Program.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: how-to
ms.date: 03/26/2023
ms.author: jeedes

---

# Azure Active Directory SSO integration with CITI Program

In this article, you learn how to integrate CITI Program with Azure Active Directory (Azure AD). The CITI Program identifies education and training needs in the communities we serve and provides high quality, peer-reviewed, web-based educational materials to meet those needs. When you integrate CITI Program with Azure AD, you can:

* Control in Azure AD who has access to CITI Program.
* Enable your users to be automatically signed-in to CITI Program with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

You configure and test Azure AD single sign-on for CITI Program in a test environment. CITI Program supports **SP** initiated single sign-on and **Just In Time** user provisioning.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Prerequisites

To integrate Azure Active Directory with CITI Program, you need:

* An Azure AD user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* CITI Program single sign-on (SSO) enabled subscription.

## Add application and assign a test user

Before you begin the process of configuring single sign-on, you need to add the CITI Program application from the Azure AD gallery. You need a test user account to assign to the application and test the single sign-on configuration.

### Add CITI Program from the Azure AD gallery

Add CITI Program from the Azure AD application gallery to configure single sign-on with CITI Program. For more information on how to add application from the gallery, see the [Quickstart: Add application from the gallery](../manage-apps/add-application-portal.md).

### Create and assign Azure AD test user

Follow the guidelines in the [create and assign a user account](../manage-apps/add-application-portal-assign-users.md) article to create a test user account in the Azure portal called B.Simon.

Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, and assign roles. The wizard also provides a link to the single sign-on configuration pane in the Azure portal. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides). 

## Configure Azure AD SSO

Complete the following steps to enable Azure AD single sign-on in the Azure portal.

1. In the Azure portal, on the **CITI Program** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot shows how to edit Basic SAML Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, perform the following steps:

	a. In the **Identifier** textbox, type the URL:
	`https://www.citiprogram.org/shibboleth`

	b. In the **Reply URL** textbox, type the URL:
	`https://www.citiprogram.org/Shibboleth.sso/SAML2/POST`

	c. In the **Sign on URL** textbox, type a URL using the following pattern:
	`https://www.citiprogram.org/Shibboleth.sso/Login?target=https://www.citiprogram.org/Secure/Welcome.cfm?inst=<InstitutionID>&entityID=<EntityID>`

	> [!NOTE]
	> This value is not real. Update this value with the actual Sign on URL. Contact [CITI Program support team](mailto:shibboleth@citiprogram.org) to get the value. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. CITI Program application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

	![Screenshot shows the image of attributes configuration.](common/default-attributes.png "Image")

1. In addition to above, CITI Program application expects few more attributes to be passed back in SAML response, which are shown below. These attributes are also pre populated but you can review them as per your requirements.

	| Name |  Source Attribute|
	| ---------------|  --------- |
	| urn:oid:1.3.6.1.4.1.5923.1.1.1.6 | user.userprincipalname |
	| urn:oid:0.9.2342.19200300.100.1.3 | user.userprincipalname |
	| urn:oid:2.5.4.42 | user.givenname |
	| urn:oid:2.5.4.4 | user.surname |

1. On the **Set-up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

    ![Screenshot shows the Certificate download link.](common/metadataxml.png "Certificate")

1. On the **Set up CITI Program** section, copy the appropriate URL(s) based on your requirement.

	![Screenshot shows to copy configuration appropriate URL.](common/copy-configuration-urls.png "Metadata")

## Configure CITI Program SSO

To configure single sign-on on **CITI Program** side, you need to send the downloaded **Federation Metadata XML** and appropriate copied URLs from Azure portal to [CITI Program support team](mailto:shibboleth@citiprogram.org). They set this setting to have the SAML SSO connection set properly on both sides.

### Create CITI Program test user

In this section, a user called B.Simon is created in CITI Program. CITI Program supports just-in-time user provisioning, which is enabled by default. There's no action item for you in this section. If a user doesn't already exist in CITI Program, a new one is commonly created after authentication.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

* Click on **Test this application** in Azure portal. This will redirect to CITI Program Sign-on URL where you can initiate the login flow. 

* Go to CITI Program Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the CITI Program tile in the My Apps, this will redirect to CITI Program Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Additional resources

* [What is single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)
* [Plan a single sign-on deployment](../manage-apps/plan-sso-deployment.md).

## Next steps

Once you configure CITI Program you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).
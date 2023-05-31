---
title: Azure Active Directory SSO integration with Redocly
description: Learn how to configure single sign-on between Azure Active Directory and Redocly.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: how-to
ms.date: 05/23/2023
ms.author: jeedes

---

# Azure Active Directory SSO integration with Redocly

In this article, you'll learn how to integrate Redocly with Azure Active Directory (Azure AD). Redocly is the first developer documentation tool that allows us to keep the docs in GitHub, keeping developer docs close to the developers. When you integrate Redocly with Azure AD, you can:

* Control in Azure AD who has access to Redocly.
* Enable your users to be automatically signed-in to Redocly with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

You'll configure and test Azure AD single sign-on for Redocly in a test environment. Redocly supports **SP** initiated single sign-on and **Just In Time** user provisioning.

## Prerequisites

To integrate Azure Active Directory with Redocly, you need:

* An Azure AD user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Redocly single sign-on (SSO) enabled subscription.

## Add application and assign a test user

Before you begin the process of configuring single sign-on, you need to add the Redocly application from the Azure AD gallery. You need a test user account to assign to the application and test the single sign-on configuration.

### Add Redocly from the Azure AD gallery

Add Redocly from the Azure AD application gallery to configure single sign-on with Redocly. For more information on how to add application from the gallery, see the [Quickstart: Add application from the gallery](../manage-apps/add-application-portal.md).

### Create and assign Azure AD test user

Follow the guidelines in the [create and assign a user account](../manage-apps/add-application-portal-assign-users.md) article to create a test user account in the Azure portal called B.Simon.

Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, and assign roles. The wizard also provides a link to the single sign-on configuration pane in the Azure portal. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides). 

## Configure Azure AD SSO

Complete the following steps to enable Azure AD single sign-on in the Azure portal.

1. In the Azure portal, on the **Redocly** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot shows how to edit Basic SAML Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, perform the following steps:

	a. In the **Identifier** textbox, type a URL using one of the following patterns:

	| **Identifier** |
	|-----------|
	| `https://api.redocly.com/auth/sso?idpId=<CustomerId>` |
	| `https://api.<Region>.redocly.com/auth/sso?idpId=<CustomerId>` |

	b. In the **Reply URL** textbox, type a URL using one of the following patterns:

	| **Reply URL** |
	|---------------|
	| `https://api.redocly.com/auth/sso` |
	| `https://api.<Region>.redocly.com/auth/sso` |
	| `https://<SiteName>.redoc.dev/_auth/saml2` |
	| `https://<SiteName>.<REGION>.redoc.dev/_auth/saml2` |

	c. In the **Sign on URL** textbox, type a URL using one of the following patterns:

	| **Sign on URL** |
	|------------|
	| `https://app.redocly.com/login-sso` |
	| `https://app.<Region>.redocly.com/login-sso` |
	| `https://<SiteName>.redoc.dev/_auth/idp-login` |
	| `https://<SiteName>.<REGION>.redoc.dev/_auth/idp-login` |

	> [!Note]
	> These values are not real. Update these values with the actual Identifier, Reply URL and Sign on URL. Contact [Redocly support team](mailto:team@redocly.com) to get these values. You can also refer to the patterns shown in the Basic SAML Configuration section in the Azure portal.

1. On the **Set-up single sign-on with SAML** page, in the **SAML Signing Certificate** section, find **Certificate (PEM)** and select **Download** to download the certificate and save it on your computer.

    ![Screenshot shows the Certificate download link.](common/certificate-base64-download.png "Certificate")

1. On the **Set up Redocly** section, copy the appropriate URL(s) based on your requirement.

	![Screenshot shows to copy configuration appropriate URL.](common/copy-configuration-urls.png "Metadata")

## Configure Redocly SSO

To configure single sign-on on **Redocly** side, you need to send the downloaded **Certificate (PEM)** and appropriate copied URLs from Azure portal to [Redocly support team](mailto:team@redocly.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Redocly test user

In this section, a user called B.Simon is created in Redocly. Redocly supports just-in-time user provisioning, which is enabled by default. There's no action item for you in this section. If a user doesn't already exist in Redocly, a new one is commonly created after authentication.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

* Click on **Test this application** in Azure portal. This will redirect to Redocly Sign-on URL where you can initiate the login flow. 

* Go to Redocly Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Redocly tile in the My Apps, this will redirect to Redocly Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Additional resources

* [What is single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)
* [Plan a single sign-on deployment](../manage-apps/plan-sso-deployment.md).

## Next steps

Once you configure Redocly you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).
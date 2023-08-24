---
title: Azure Active Directory SSO integration with Insightsfirst
description: Learn how to configure single sign-on between Azure Active Directory and Insightsfirst.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: how-to
ms.date: 08/24/2023
ms.author: jeedes

---

# Azure Active Directory SSO integration with Insightsfirst

In this article, you'll learn how to integrate Insightsfirst with Azure Active Directory (Azure AD). Insightsfirst helps you compete, get an edge in the marketplace, and make intelligent decisions at the right time. It's a cloud platform that harnesses power of internal and external knowledge. When you integrate Insightsfirst with Azure AD, you can:

* Control in Azure AD who has access to Insightsfirst.
* Enable your users to be automatically signed-in to Insightsfirst with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

You'll configure and test Azure AD single sign-on for Insightsfirst in a test environment. Insightsfirst supports only **SP** initiated single sign-on and also **Just In Time** user provisioning.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Prerequisites

To integrate Azure Active Directory with Insightsfirst, you need:

* An Azure AD user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Insightsfirst single sign-on (SSO) enabled subscription.

## Add application and assign a test user

Before you begin the process of configuring single sign-on, you need to add the Insightsfirst application from the Azure AD gallery. You need a test user account to assign to the application and test the single sign-on configuration.

### Add Insightsfirst from the Azure AD gallery

Add Insightsfirst from the Azure AD application gallery to configure single sign-on with Insightsfirst. For more information on how to add application from the gallery, see the [Quickstart: Add application from the gallery](../manage-apps/add-application-portal.md).

### Create and assign Azure AD test user

Follow the guidelines in the [create and assign a user account](../manage-apps/add-application-portal-assign-users.md) article to create a test user account in the Azure portal called B.Simon.

Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, and assign roles. The wizard also provides a link to the single sign-on configuration pane in the Azure portal. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides). 

## Configure Azure AD SSO

Complete the following steps to enable Azure AD single sign-on in the Azure portal.

1. In the Azure portal, on the **Insightsfirst** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot shows how to edit Basic SAML Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier** textbox, type one of the following URLs:

    | **Identifier** |
    |------------|
    | `https://insightsfirst-implementation.evalueserve.com` |
    | ` https://insightsfirst.evalueserve.com/` |

    b. In the **Reply URL** textbox, type one of the following URLs:

    | **Reply URL** |
    |------------|
    | `https://insightsfirst-implementation.evalueserve.com/InsightFirstSSO/api/Assertion/ConsumerService` |
    | `https://insightsfirst.evalueserve.com/InsightFirstSSO/api/Assertion/ConsumerService` |

	c. In the **Sign on URL** textbox, type one of the following URLs:

	| **Sign on URL** |
    |------------|
    | `https://insightsfirst.evalueserve.com/Microsoft` |
    | `https://insightsfirst-implementation.evalueserve.com/Microsoft` |

1. Insightsfirst application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

	![Screenshot shows the image of attributes configuration.](common/default-attributes.png "Image")

1. In addition to above, Insightsfirst application expects few more attributes to be passed back in SAML response, which are shown below. These attributes are also pre populated but you can review them as per your requirements.

	| Name |  Source Attribute|
	| ---------------|  --------- |
	| Email | user.mail |

1. In the **SAML Signing Certificate** section, click **Edit** button to open **SAML Signing Certificate** dialog.

	![Screenshot shows to Edit SAML Signing Certificate.](common/edit-certificate.png "Certificate")

1. In the **SAML Signing Certificate** section, copy the **Thumbprint Value** and save it on your computer.

    ![Screenshot shows to Copy Thumbprint value.](common/copy-thumbprint.png "Thumbprint")

1. On the **Set up Insightsfirst SAML** section, copy the appropriate URL(s) based on your requirement.

	![Screenshot shows to copy configuration appropriate URL.](common/copy-configuration-urls.png "Metadata")

## Configure Insightsfirst SSO

To configure single sign-on on **Insightsfirst** side, you need to send the **Thumbprint Value** and appropriate copied URLs from Azure portal to [Insightsfirst support team](mailto:insightsfirst.support@evalueserve.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Insightsfirst test user

In this section, a user called B.Simon is created in Insightsfirst SSO. Insightsfirst SSO supports just-in-time user provisioning, which is enabled by default. There's no action item for you in this section. If a user doesn't already exist in Insightsfirst SSO, a new one is created after authentication.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options.

* Click on **Test this application** in Azure portal. This will redirect to Insightsfirst Sign-on URL where you can initiate the login flow.

* Go to Insightsfirst Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Insightsfirst tile in the My Apps, this will redirect to Insightsfirst Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Additional resources

* [What is single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)
* [Plan a single sign-on deployment](../manage-apps/plan-sso-deployment.md).

## Next steps

Once you configure Insightsfirst you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).
---
title: Microsoft Entra SSO integration with Intradiem
description: Learn how to configure single sign-on between Microsoft Entra ID and Intradiem.
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

# Microsoft Entra SSO integration with Intradiem

In this article, you learn how to integrate Intradiem with Microsoft Entra ID. AI-Powered Productivity Solution that Integrates with Call Center and Workforce Management Software to Improve Savings, Productivity, and Engagement. When you integrate Intradiem with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to Intradiem.
* Enable your users to be automatically signed-in to Intradiem with their Microsoft Entra accounts.
* Manage your accounts in one central location.

You configure and test Microsoft Entra single sign-on for Intradiem in a test environment. Intradiem supports only **SP** initiated single sign-on.

## Prerequisites

To integrate Microsoft Entra ID with Intradiem, you need:

* A Microsoft Entra user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Intradiem single sign-on (SSO) enabled subscription.

## Add application and assign a test user

Before you begin the process of configuring single sign-on, you need to add the Intradiem application from the Microsoft Entra gallery. You need a test user account to assign to the application and test the single sign-on configuration.

<a name='add-intradiem-from-the-azure-ad-gallery'></a>

### Add Intradiem from the Microsoft Entra gallery

Add Intradiem from the Microsoft Entra application gallery to configure single sign-on with Intradiem. For more information on how to add application from the gallery, see the [Quickstart: Add application from the gallery](../manage-apps/add-application-portal.md).

<a name='create-and-assign-azure-ad-test-user'></a>

### Create and assign Microsoft Entra test user

Follow the guidelines in the [create and assign a user account](../manage-apps/add-application-portal-assign-users.md) article to create a test user account called B.Simon.

Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, and assign roles. The wizard also provides a link to the single sign-on configuration pane. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides). 

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Complete the following steps to enable Microsoft Entra single sign-on.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Intradiem** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot shows how to edit Basic SAML Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, perform the following steps:

	a. In the **Identifier** textbox, type a URL using one of the following patterns:

	| **Identifier** |
	|------------|
	| `https://<CustomerName>.intradiem.com/auth/realms/<CustomerName>` |
	| `https://<CustomerName>auth.intradiem.com/auth/realms/<CustomerName>` |

	b. In the **Reply URL** textbox, type a URL using one of the following patterns:

	| **Reply URL** |
	|---------|
	| `https://<CustomerName>auth.intradiem.com/auth/realms/<CustomerName>/broker/<CustomerName>/endpoint` |
	| `https://<CustomerName>.intradiem.com/auth/realms/<CustomerName>/broker/<CustomerName>/endpoint` |

	c. In the **Sign on URL** textbox, type a URL using one of the following patterns:
	
	| **Sign on URL** |
	|-------------|
	| `https://<CustomerName>auth.intradiem.com` |
	| `https://<CustomerName>.intradiem.com` |

	> [!Note]
    > These values are not real. Update these values with the actual Identifier, Reply URL and Sign on URL. Contact [Intradiem support team](mailto:support@intradiem.com) to get these values. You can also refer to the patterns shown in the Basic SAML Configuration section.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section, click copy button to copy **App Federation Metadata Url** and save it on your computer.

    ![Screenshot shows the Certificate download link.](common/copy-metadataurl.png "Certificate")

## Configure Intradiem SSO

To configure single sign-on on **Intradiem** side, you need to send the **App Federation Metadata Url** to [Intradiem support team](mailto:support@intradiem.com). They set this setting to have the SAML SSO connection set properly on both sides

### Create Intradiem test user

In this section, you create a user called Britta Simon in Intradiem. Work with [Intradiem support team](mailto:support@intradiem.com) to add the users in the Intradiem platform. Users must be created and activated before you use single sign-on.

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

* Click on **Test this application**, this will redirect to Intradiem Sign-on URL where you can initiate the login flow. 

* Go to Intradiem Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Intradiem tile in the My Apps, this will redirect to Intradiem Sign-on URL. For more information, see [Microsoft Entra My Apps](/azure/active-directory/manage-apps/end-user-experiences#azure-ad-my-apps).

## Additional resources

* [What is single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)
* [Plan a single sign-on deployment](../manage-apps/plan-sso-deployment.md).

## Next steps

Once you configure Intradiem you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).

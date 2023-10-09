---
title: Microsoft Entra SSO integration with CLOUD ATTENDANCE MANAGEMENT SYSTEM KING OF TIME
description: Learn how to configure single sign-on between Microsoft Entra ID and CLOUD ATTENDANCE MANAGEMENT SYSTEM KING OF TIME.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: how-to
ms.date: 07/02/2023
ms.author: jeedes

---

# Microsoft Entra SSO integration with CLOUD ATTENDANCE MANAGEMENT SYSTEM KING OF TIME

In this article, you'll learn how to integrate CLOUD ATTENDANCE MANAGEMENT SYSTEM KING OF TIME with Microsoft Entra ID. CLOUD ATTENDANCE MANAGEMENT SYSTEM KING OF TIME is No.1 in the attendance management system market share "KING OF TIME" reached 2.77 million active users as of April 2023. It is a cloud attendance management system with high satisfaction, recognition, and the No. 1 market share.  From offices and stores to teleworking and telecommuting in an emergency. Efficient attendance management that has become complicated by paper time cards and Excel is automatically aggregated. When you integrate CLOUD ATTENDANCE MANAGEMENT SYSTEM KING OF TIME with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to CLOUD ATTENDANCE MANAGEMENT SYSTEM KING OF TIME.
* Enable your users to be automatically signed-in to CLOUD ATTENDANCE MANAGEMENT SYSTEM KING OF TIME with their Microsoft Entra accounts.
* Manage your accounts in one central location.

You'll configure and test Microsoft Entra single sign-on for CLOUD ATTENDANCE MANAGEMENT SYSTEM KING OF TIME in a test environment. CLOUD ATTENDANCE MANAGEMENT SYSTEM KING OF TIME supports **SP** initiated single sign-on.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Prerequisites

To integrate Microsoft Entra ID with CLOUD ATTENDANCE MANAGEMENT SYSTEM KING OF TIME, you need:

* A Microsoft Entra user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* CLOUD ATTENDANCE MANAGEMENT SYSTEM KING OF TIME single sign-on (SSO) enabled subscription.

## Add application and assign a test user

Before you begin the process of configuring single sign-on, you need to add the CLOUD ATTENDANCE MANAGEMENT SYSTEM KING OF TIME application from the Microsoft Entra gallery. You need a test user account to assign to the application and test the single sign-on configuration.

<a name='add-cloud-attendance-management-system-king-of-time-from-the-azure-ad-gallery'></a>

### Add CLOUD ATTENDANCE MANAGEMENT SYSTEM KING OF TIME from the Microsoft Entra gallery

Add CLOUD ATTENDANCE MANAGEMENT SYSTEM KING OF TIME from the Microsoft Entra application gallery to configure single sign-on with CLOUD ATTENDANCE MANAGEMENT SYSTEM KING OF TIME. For more information on how to add application from the gallery, see the [Quickstart: Add application from the gallery](../manage-apps/add-application-portal.md).

<a name='create-and-assign-azure-ad-test-user'></a>

### Create and assign Microsoft Entra test user

Follow the guidelines in the [create and assign a user account](../manage-apps/add-application-portal-assign-users.md) article to create a test user account called B.Simon.

Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, and assign roles. The wizard also provides a link to the single sign-on configuration pane. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides). 

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Complete the following steps to enable Microsoft Entra single sign-on.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **CLOUD ATTENDANCE MANAGEMENT SYSTEM KING OF TIME** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot shows how to edit Basic SAML Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, perform the following steps:

	a. In the **Identifier** textbox, type one of the following URLs:
    
	| **Identifier** |
	|------------|
	| `https://s3.ta.kingoftime.jp/saml/v2.0/acs` |
	| `https://s2.ta.kingoftime.jp/saml/v2.0/acs` |

    b. In the **Reply URL** textbox, type one of the following URLs:
    
	| **Reply URL** |
	|------------|
	| `https://s2.ta.kingoftime.jp/saml/v2.0/acs` |
	| `https://s3.ta.kingoftime.jp/saml/v2.0/acs` |

	c. In the **Sign on URL** textbox, type one of the following URLs:

	| **Sign on URL** |
	|----------|
    | `https://s2.ta.kingoftime.jp/admin` |
	| `https://s3.ta.kingoftime.jp/admin` |
	| `https://s2.ta.kingoftime.jp/independent/recorder2/personal` |
	| `https://s3.ta.kingoftime.jp/independent/recorder2/personal` |

1. On the **Set-up single sign-on with SAML** page, in the **SAML Signing Certificate** section, find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

    ![Screenshot shows the Certificate download link.](common/metadataxml.png "Certificate")

1. On the **Set up CLOUD ATTENDANCE MANAGEMENT SYSTEM KING OF TIME** section, copy the appropriate URL(s) based on your requirement.

	![Screenshot shows to copy configuration appropriate URL.](common/copy-configuration-urls.png "Metadata")

## Configure CLOUD ATTENDANCE MANAGEMENT SYSTEM KING OF TIME SSO

To configure single sign-on on **CLOUD ATTENDANCE MANAGEMENT SYSTEM KING OF TIME** side, you need to send the downloaded **Federation Metadata XML** and appropriate copied URLs from the application configuration to [CLOUD ATTENDANCE MANAGEMENT SYSTEM KING OF TIME support team](https://www.kingoftime.jp/contact/). They set this setting to have the SAML SSO connection set properly on both sides.

### Create CLOUD ATTENDANCE MANAGEMENT SYSTEM KING OF TIME test user

In this section, you create a user called Britta Simon in CLOUD ATTENDANCE MANAGEMENT SYSTEM KING OF TIME. Work with [CLOUD ATTENDANCE MANAGEMENT SYSTEM KING OF TIME support team](https://www.kingoftime.jp/contact/) to add the users in the CLOUD ATTENDANCE MANAGEMENT SYSTEM KING OF TIME platform. Users must be created and activated before you use single sign-on.

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

* Click on **Test this application**, this will redirect to CLOUD ATTENDANCE MANAGEMENT SYSTEM KING OF TIME Sign-on URL where you can initiate the login flow. 

* Go to CLOUD ATTENDANCE MANAGEMENT SYSTEM KING OF TIME Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the CLOUD ATTENDANCE MANAGEMENT SYSTEM KING OF TIME tile in the My Apps, this will redirect to CLOUD ATTENDANCE MANAGEMENT SYSTEM KING OF TIME Sign-on URL. For more information, see [Microsoft Entra My Apps](/azure/active-directory/manage-apps/end-user-experiences#azure-ad-my-apps).

## Additional resources

* [What is single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)
* [Plan a single sign-on deployment](../manage-apps/plan-sso-deployment.md).

## Next steps

Once you configure CLOUD ATTENDANCE MANAGEMENT SYSTEM KING OF TIME you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).

---
title: Microsoft Entra SSO integration with DB Education Portal for Schools
description: Learn how to configure single sign-on between Microsoft Entra ID and DB Education Portal for Schools.
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

# Microsoft Entra SSO integration with DB Education Portal for Schools

In this article, you'll learn how to integrate DB Education Portal for Schools with Microsoft Entra ID. Providing single sign-on access through Microsoft Entra ID, for the DB Education Portal, available for Schools and Multi Academy Trusts across the United Kingdom. When you integrate DB Education Portal for Schools with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to DB Education Portal for Schools.
* Enable your users to be automatically signed-in to DB Education Portal for Schools with their Microsoft Entra accounts.
* Manage your accounts in one central location.

You'll configure and test Microsoft Entra single sign-on for DB Education Portal for Schools in a test environment. DB Education Portal for Schools supports **SP** initiated single sign-on.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Prerequisites

To integrate Microsoft Entra ID with DB Education Portal for Schools, you need:

* A Microsoft Entra user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* DB Education Portal for Schools single sign-on (SSO) enabled subscription.

## Add application and assign a test user

Before you begin the process of configuring single sign-on, you need to add the DB Education Portal for Schools application from the Microsoft Entra gallery. You need a test user account to assign to the application and test the single sign-on configuration.

<a name='add-db-education-portal-for-schools-from-the-azure-ad-gallery'></a>

### Add DB Education Portal for Schools from the Microsoft Entra gallery

Add DB Education Portal for Schools from the Microsoft Entra application gallery to configure single sign-on with DB Education Portal for Schools. For more information on how to add application from the gallery, see the [Quickstart: Add application from the gallery](../manage-apps/add-application-portal.md).

<a name='create-and-assign-azure-ad-test-user'></a>

### Create and assign Microsoft Entra test user

Follow the guidelines in the [create and assign a user account](../manage-apps/add-application-portal-assign-users.md) article to create a test user account called B.Simon.

Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, and assign roles. The wizard also provides a link to the single sign-on configuration pane. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides). 

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Complete the following steps to enable Microsoft Entra single sign-on.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **DB Education Portal for Schools** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot shows how to edit Basic SAML Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, perform the following steps:

	a. In the **Identifier** textbox, type the value:
	`DBEducation`

    b. In the **Reply URL** textbox, type a URL using one of the following patterns:
    
	| **Reply URL** |
	|------------|
	| `https://intranet.<CustomerName>.domain.extension/governorintranet/wp-login.php?saml_acs` |
	| `https://portal.<CustomerName>.domain.extension/governorintranet/wp-login.php?saml_acs` |
	| `https://intranet.<CustomerName>.domain.extension/studentportal/wp-login.php?saml_acs` |
	| `https://portal.<CustomerName>.domain.extension/studentportal/wp-login.php?saml_acs` |
	| `https://intranet.<CustomerName>.domain.extension/staffportal/wp-login.php?saml_acs` |
	| `https://portal.<CustomerName>.domain.extension/staffportal/wp-login.php?saml_acs` |
	| `https://intranet.<CustomerName>.domain.extension/parentportal/wp-login.php?saml_acs` |
	| `https://portal.<CustomerName>.domain.extension/parentportal/wp-login.php?saml_acs` |
	| `https://intranet.<CustomerName>.domain.extension/familyportal/wp-login.php?saml_acs` |
	| `https://portal.<CustomerName>.domain.extension/familyportal/wp-login.php?saml_acs` |

	c. In the **Sign on URL** textbox, type a URL using one of the following patterns:

	| **Sign on URL** |
	|----------|
    | `https://portal.<CustomerName>.domain.extension` |
	| `https://intranet.<CustomerName>.domain.extension` |

	> [!NOTE]
    > These values are not real. Update these values with the actual Reply URL and Sign on URL. Contact [DB Education Portal for Schools support team](mailto:contact@dbeducation.org.uk) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section.

1. DB Education Portal for Schools application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

	![Screenshot shows the image of attributes configuration.](common/default-attributes.png "Image")

1. In addition to above, DB Education Portal for Schools application expects few more attributes to be passed back in SAML response, which are shown below. These attributes are also pre populated but you can review them as per your requirements.

	| Name |  Source Attribute|
	| ---------------|  --------- |
	| groups | user.groups |

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section, click copy button to copy **App Federation Metadata Url** and save it on your computer.

    ![Screenshot shows the Certificate download link.](common/copy-metadataurl.png "Certificate")

## Configure DB Education Portal for Schools SSO

To configure single sign-on on **DB Education Portal for Schools** side, you need to send the **App Federation Metadata Url** to [DB Education Portal for Schools support team](mailto:contact@dbeducation.org.uk). They set this setting to have the SAML SSO connection set properly on both sides.

### Create DB Education Portal for Schools test user

In this section, you create a user called Britta Simon at DB Education Portal for Schools SSO. Work with [DB Education Portal for Schools SSO support team](mailto:contact@dbeducation.org.uk) to add the users in the DB Education Portal for Schools SSO platform. Users must be created and activated before you use single sign-on.

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

* Click on **Test this application**, this will redirect to DB Education Portal for Schools Sign-on URL where you can initiate the login flow. 

* Go to DB Education Portal for Schools Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the DB Education Portal for Schools tile in the My Apps, this will redirect to DB Education Portal for Schools Sign-on URL. For more information, see [Microsoft Entra My Apps](/azure/active-directory/manage-apps/end-user-experiences#azure-ad-my-apps).

## Additional resources

* [What is single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)
* [Plan a single sign-on deployment](../manage-apps/plan-sso-deployment.md).

## Next steps

Once you configure DB Education Portal for Schools you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).

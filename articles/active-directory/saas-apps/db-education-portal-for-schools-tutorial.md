---
title: Azure Active Directory SSO integration with DB Education Portal for Schools
description: Learn how to configure single sign-on between Azure Active Directory and DB Education Portal for Schools.
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

# Azure Active Directory SSO integration with DB Education Portal for Schools

In this article, you'll learn how to integrate DB Education Portal for Schools with Azure Active Directory (Azure AD). Providing single sign-on access through Azure AD, for the DB Education Portal, available for Schools and Multi Academy Trusts across the United Kingdom. When you integrate DB Education Portal for Schools with Azure AD, you can:

* Control in Azure AD who has access to DB Education Portal for Schools.
* Enable your users to be automatically signed-in to DB Education Portal for Schools with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

You'll configure and test Azure AD single sign-on for DB Education Portal for Schools in a test environment. DB Education Portal for Schools supports **SP** initiated single sign-on.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Prerequisites

To integrate Azure Active Directory with DB Education Portal for Schools, you need:

* An Azure AD user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* DB Education Portal for Schools single sign-on (SSO) enabled subscription.

## Add application and assign a test user

Before you begin the process of configuring single sign-on, you need to add the DB Education Portal for Schools application from the Azure AD gallery. You need a test user account to assign to the application and test the single sign-on configuration.

### Add DB Education Portal for Schools from the Azure AD gallery

Add DB Education Portal for Schools from the Azure AD application gallery to configure single sign-on with DB Education Portal for Schools. For more information on how to add application from the gallery, see the [Quickstart: Add application from the gallery](../manage-apps/add-application-portal.md).

### Create and assign Azure AD test user

Follow the guidelines in the [create and assign a user account](../manage-apps/add-application-portal-assign-users.md) article to create a test user account in the Azure portal called B.Simon.

Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, and assign roles. The wizard also provides a link to the single sign-on configuration pane in the Azure portal. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides). 

## Configure Azure AD SSO

Complete the following steps to enable Azure AD single sign-on in the Azure portal.

1. In the Azure portal, on the **DB Education Portal for Schools** application integration page, find the **Manage** section and select **single sign-on**.
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
    > These values are not real. Update these values with the actual Reply URL and Sign on URL. Contact [DB Education Portal for Schools support team](mailto:contact@dbeducation.org.uk) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

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

In this section, you test your Azure AD single sign-on configuration with following options. 

* Click on **Test this application** in Azure portal. This will redirect to DB Education Portal for Schools Sign-on URL where you can initiate the login flow. 

* Go to DB Education Portal for Schools Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the DB Education Portal for Schools tile in the My Apps, this will redirect to DB Education Portal for Schools Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Additional resources

* [What is single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)
* [Plan a single sign-on deployment](../manage-apps/plan-sso-deployment.md).

## Next steps

Once you configure DB Education Portal for Schools you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).
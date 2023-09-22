---
title: Microsoft Entra SSO integration with YOU at College
description: Learn how to configure single sign-on between Microsoft Entra ID and YOU at College.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: how-to
ms.date: 01/27/2023
ms.author: jeedes

---

# Microsoft Entra SSO integration with YOU at College

In this article, you learn how to integrate YOU at College with Microsoft Entra ID. YOU at College is an opt-in, web-based well-being application that higher education institutions can license and promote to their students and staff. When you integrate YOU at College with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to YOU at College.
* Enable your users to be automatically signed-in to YOU at College with their Microsoft Entra accounts.
* Manage your accounts in one central location.

You'll configure and test Microsoft Entra single sign-on for YOU at College in a test environment. YOU at College supports only **SP** initiated single sign-on and **Just In Time** user provisioning.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Prerequisites

To integrate Microsoft Entra ID with YOU at College, you need:

* A Microsoft Entra user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* YOU at College single sign-on (SSO) enabled subscription.

## Add application and assign a test user

Before you begin the process of configuring single sign-on, you need to add the YOU at College application from the Microsoft Entra gallery. You need a test user account to assign to the application and test the single sign-on configuration.

<a name='add-you-at-college-from-the-azure-ad-gallery'></a>

### Add YOU at College from the Microsoft Entra gallery

Add YOU at College from the Microsoft Entra application gallery to configure single sign-on with YOU at College. For more information on how to add application from the gallery, see the [Quickstart: Add application from the gallery](../manage-apps/add-application-portal.md).

<a name='create-and-assign-azure-ad-test-user'></a>

### Create and assign Microsoft Entra test user

Follow the guidelines in the [create and assign a user account](../manage-apps/add-application-portal-assign-users.md) article to create a test user account called B.Simon.

Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, and assign roles. The wizard also provides a link to the single sign-on configuration pane. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides). 

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Complete the following steps to enable Microsoft Entra single sign-on.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **YOU at College** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot shows how to edit Basic SAML Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier** textbox, type the URL:
    `http://sso.youatcollege.com/shibboleth`

    b. In the **Reply URL** textbox, type the URL:
    `https://sso.youatcollege.com/Shibboleth.sso/SAML2/POST`

    c. In the **Sign on URL** textbox, type a URL using the following pattern:
    `https://sso.youatcollege.com/idp-<domain>.php`

    > [!NOTE]
    > This value is not real. Update this value with the actual Sign on URL. Contact [YOU at College Client support team](mailto:technology@gritdigitalhealth.com) to get the value. You can also refer to the patterns shown in the **Basic SAML Configuration** section.

1. On the **Set-up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

    ![Screenshot shows the Certificate download link.](common/metadataxml.png "Certificate")

1. On the **Set up YOU at College** section, copy the appropriate URL(s) based on your requirement.

	![Screenshot shows to copy configuration appropriate URL.](common/copy-configuration-urls.png "Metadata")

## Configure YOU at College SSO

To configure single sign-on on **YOU at College** side, you need to send the downloaded **Federation Metadata XML** and appropriate copied URLs from the application configuration to [YOU at College support team](mailto:technology@gritdigitalhealth.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create YOU at College test user

In this section, a user called B.Simon is created in YOU at College. YOU at College supports just-in-time user provisioning, which is enabled by default. There's no action item for you in this section. If a user doesn't already exist in YOU at College, a new one is commonly created after authentication.

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

* Click on **Test this application**, this will redirect to YOU at College Sign-on URL where you can initiate the login flow. 

* Go to YOU at College Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you select the YOU at College tile in the My Apps, this will redirect to YOU at College Sign-on URL. For more information, see [Microsoft Entra My Apps](/azure/active-directory/manage-apps/end-user-experiences#azure-ad-my-apps).

## Additional resources

* [What is single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)
* [Plan a single sign-on deployment](../manage-apps/plan-sso-deployment.md).

## Next steps

Once you configure YOU at College you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).

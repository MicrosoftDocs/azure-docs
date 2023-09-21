---
title: Microsoft Entra SSO integration with Exterro Legal GRC Software Platform
description: Learn how to configure single sign-on between Microsoft Entra ID and Exterro Legal GRC Software Platform.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: how-to
ms.date: 01/04/2023
ms.author: jeedes

---

# Microsoft Entra SSO integration with Exterro Legal GRC Software Platform

In this article, you'll learn how to integrate Exterro Legal GRC Software Platform with Microsoft Entra ID. The Exterro Platform unifies all of Exterro's E-Discovery and Information Governance solutions, giving you the ability to easily add new Exterro applications as your business needs expand. When you integrate Exterro Legal GRC Software Platform with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to Exterro Legal GRC Software Platform.
* Enable your users to be automatically signed-in to Exterro Legal GRC Software Platform with their Microsoft Entra accounts.
* Manage your accounts in one central location.

You'll configure and test Microsoft Entra single sign-on for Exterro Legal GRC Software Platform in a test environment. Exterro Legal GRC Software Platform supports both **SP** and **IDP** initiated single sign-on.

## Prerequisites

To integrate Microsoft Entra ID with Exterro Legal GRC Software Platform, you need:

* A Microsoft Entra user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Exterro Legal GRC Software Platform single sign-on (SSO) enabled subscription.

## Add application and assign a test user

Before you begin the process of configuring single sign-on, you need to add the Exterro Legal GRC Software Platform application from the Microsoft Entra gallery. You need a test user account to assign to the application and test the single sign-on configuration.

<a name='add-exterro-legal-grc-software-platform-from-the-azure-ad-gallery'></a>

### Add Exterro Legal GRC Software Platform from the Microsoft Entra gallery

Add Exterro Legal GRC Software Platform from the Microsoft Entra application gallery to configure single sign-on with Exterro Legal GRC Software Platform. For more information on how to add application from the gallery, see the [Quickstart: Add application from the gallery](../manage-apps/add-application-portal.md).

<a name='create-and-assign-azure-ad-test-user'></a>

### Create and assign Microsoft Entra test user

Follow the guidelines in the [create and assign a user account](../manage-apps/add-application-portal-assign-users.md) article to create a test user account called B.Simon.

Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, and assign roles. The wizard also provides a link to the single sign-on configuration pane. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides). 

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Complete the following steps to enable Microsoft Entra single sign-on.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Exterro Legal GRC Software Platform** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot shows how to edit Basic SAML Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier** textbox, type a URL using the following pattern:
    `https://<tenant_id>.exterro.net/exterrosso`

    b. In the **Reply URL** textbox, type a URL using the following pattern:
    `https://<tenant_id>.exterro.net/exterrosso/saml/SSO`

1. If you want to configure **SP** initiated SSO, then perform the following step:  

    In the **Sign on URL** textbox, type a URL using one of the following patterns:

    | **Sign on URL** |
    |-------|
    | `https://<tenant_id>.exterro.net/exterrosso/saml/` |
    | `https://<tenant_id>.<domain>` |

    > [!Note]
    > These values are not the real. Update these values with the actual Identifier, Reply URL and Sign on URL. Contact [Exterro Legal GRC Software Platform Client support team](mailto:support@exterro.com) to get these values. You can also refer to the patterns shown in the Basic SAML Configuration section.
    
1. On the **Set-up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

    ![Screenshot shows the Certificate download link.](common/metadataxml.png "Certificate")

1. On the **Set up Exterro Legal GRC Software Platform** section, copy the appropriate URL(s) based on your requirement.

	![Screenshot shows to copy configuration appropriate URL.](common/copy-configuration-urls.png "Metadata")

## Configure Exterro Legal GRC Software Platform SSO

To configure single sign-on on **Exterro Legal GRC Software Platform** side, you need to send the downloaded **Federation Metadata XML** and appropriate copied URLs from the application configuration to [Exterro Legal GRC Software Platform support team](mailto:support@exterro.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Exterro Legal GRC Software Platform test user

In this section, you create a user called Britta Simon at Exterro Legal GRC Software Platform. Work with [Exterro Legal GRC Software Platform support team](mailto:support@exterro.com) to add the users in the Exterro Legal GRC Software Platform platform. Users must be created and activated before you use single sign-on.

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application**, this will redirect to Exterro Legal GRC Software Platform Sign-on URL where you can initiate the login flow.  

* Go to Exterro Legal GRC Software Platform Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application**, and you should be automatically signed in to the Exterro Legal GRC Software Platform for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the Exterro Legal GRC Software Platform tile in the My Apps, if configured in SP mode you would be redirected to the application sign-on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the Exterro Legal GRC Software Platform for which you set up the SSO. For more information, see [Microsoft Entra My Apps](/azure/active-directory/manage-apps/end-user-experiences#azure-ad-my-apps).

## Additional resources

* [What is single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)
* [Plan a single sign-on deployment](../manage-apps/plan-sso-deployment.md).

## Next steps

Once you configure Exterro Legal GRC Software Platform you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).

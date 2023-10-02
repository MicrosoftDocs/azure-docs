---
title: Microsoft Entra SSO integration with KanbanBOX
description: Learn how to configure single sign-on between Microsoft Entra ID and KanbanBOX.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: how-to
ms.date: 07/17/2023
ms.author: jeedes

---

# Microsoft Entra SSO integration with KanbanBOX

In this article, you'll learn how to integrate KanbanBOX with Microsoft Entra ID. KanbanBOX digitizes kanban material flows along the Supply Chain. KanbanBOX supports internal production and logistic flows, as well as collaboration with external suppliers and customers. When you integrate KanbanBOX with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to KanbanBOX.
* Enable your users to be automatically signed-in to KanbanBOX with their Microsoft Entra accounts.
* Manage your accounts in one central location.

You'll configure and test Microsoft Entra single sign-on for KanbanBOX in a test environment. KanbanBOX supports both **SP** and **IDP** initiated single sign-on.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Prerequisites

To integrate Microsoft Entra ID with KanbanBOX, you need:

* A Microsoft Entra user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* KanbanBOX single sign-on (SSO) enabled subscription.

## Add application and assign a test user

Before you begin the process of configuring single sign-on, you need to add the KanbanBOX application from the Microsoft Entra gallery. You need a test user account to assign to the application and test the single sign-on configuration.

<a name='add-kanbanbox-from-the-azure-ad-gallery'></a>

### Add KanbanBOX from the Microsoft Entra gallery

Add KanbanBOX from the Microsoft Entra application gallery to configure single sign-on with KanbanBOX. For more information on how to add application from the gallery, see the [Quickstart: Add application from the gallery](../manage-apps/add-application-portal.md).

<a name='create-and-assign-azure-ad-test-user'></a>

### Create and assign Microsoft Entra test user

Follow the guidelines in the [create and assign a user account](../manage-apps/add-application-portal-assign-users.md) article to create a test user account called B.Simon.

Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, and assign roles. The wizard also provides a link to the single sign-on configuration pane. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides). 

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Complete the following steps to enable Microsoft Entra single sign-on.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **KanbanBOX** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot shows how to edit Basic SAML Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, the user does not have to perform any step as the app is already pre-integrated with Azure.

	In the **Relay State** textbox, type the URL:
	`https://app.kanbanbox.com/auth/idp_initiated_sso_login`

1. Perform the following step, if you wish to configure the application in **SP** initiated mode:

	In the **Sign on URL** textbox, type the URL:
	`https://app.kanbanbox.com/auth/login`

1. On the **Set-up single sign-on with SAML** page, in the **SAML Signing Certificate** section, find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

    ![Screenshot shows the Certificate download link.](common/metadataxml.png "Certificate")

1. On the **Set up KanbanBOX** section, copy the appropriate URL(s) based on your requirement.

	![Screenshot shows to copy configuration appropriate U R L.](common/copy-configuration-urls.png "Attributes")

## Configure KanbanBOX SSO

To configure single sign-on on **KanbanBOX** side, you need to send the downloaded **Federation Metadata XML** and appropriate copied URLs from the application configuration to [KanbanBOX support team](mailto:help@kanbanbox.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create KanbanBOX test user

In this section, you create a user called Britta Simon at KanbanBOX SSO. Work with [KanbanBOX support team](mailto:help@kanbanbox.com) to add the users in the KanbanBOX SSO platform. Users must be created and activated before you use single sign-on.

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application**, this will redirect to KanbanBOX Sign-on URL where you can initiate the login flow.  

* Go to KanbanBOX Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application**, and you should be automatically signed in to the KanbanBOX for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the KanbanBOX tile in the My Apps, if configured in SP mode you would be redirected to the application sign-on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the KanbanBOX for which you set up the SSO. For more information, see [Microsoft Entra My Apps](/azure/active-directory/manage-apps/end-user-experiences#azure-ad-my-apps).

## Additional resources

* [What is single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)
* [Plan a single sign-on deployment](../manage-apps/plan-sso-deployment.md).

## Next steps

Once you configure KanbanBOX you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).

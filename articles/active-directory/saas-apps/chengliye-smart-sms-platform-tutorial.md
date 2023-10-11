---
title: Microsoft Entra SSO integration with Chengliye Smart SMS Platform
description: Learn how to configure single sign-on between Microsoft Entra ID and Chengliye Smart SMS Platform.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: how-to
ms.date: 06/28/2023
ms.author: jeedes

---

# Microsoft Entra SSO integration with Chengliye Smart SMS Platform

In this article, you'll learn how to integrate Chengliye Smart SMS Platform with Microsoft Entra ID. Chengliye Smart SMS Platform was founded in 2014, the company is primarily engaged in software development and telecommunications value-added services. It specializes in services such as SMS terminals and data transmission. When you integrate Chengliye Smart SMS Platform with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to Chengliye Smart SMS Platform.
* Enable your users to be automatically signed-in to Chengliye Smart SMS Platform with their Microsoft Entra accounts.
* Manage your accounts in one central location.

You'll configure and test Microsoft Entra single sign-on for Chengliye Smart SMS Platform in a test environment. Chengliye Smart SMS Platform supports **IDP** initiated single sign-on and **Just In Time** user provisioning.

## Prerequisites

To integrate Microsoft Entra ID with Chengliye Smart SMS Platform, you need:

* A Microsoft Entra user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Chengliye Smart SMS Platform single sign-on (SSO) enabled subscription.

## Add application and assign a test user

Before you begin the process of configuring single sign-on, you need to add the Chengliye Smart SMS Platform application from the Microsoft Entra gallery. You need a test user account to assign to the application and test the single sign-on configuration.

<a name='add-chengliye-smart-sms-platform-from-the-azure-ad-gallery'></a>

### Add Chengliye Smart SMS Platform from the Microsoft Entra gallery

Add Chengliye Smart SMS Platform from the Microsoft Entra application gallery to configure single sign-on with Chengliye Smart SMS Platform. For more information on how to add application from the gallery, see the [Quickstart: Add application from the gallery](../manage-apps/add-application-portal.md).

<a name='create-and-assign-azure-ad-test-user'></a>

### Create and assign Microsoft Entra test user

Follow the guidelines in the [create and assign a user account](../manage-apps/add-application-portal-assign-users.md) article to create a test user account called B.Simon.

Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, and assign roles. The wizard also provides a link to the single sign-on configuration pane. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides). 

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Complete the following steps to enable Microsoft Entra single sign-on.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Chengliye Smart SMS Platform** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot shows how to edit Basic SAML Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, the user does not have to perform any step as the app is already pre-integrated with Azure.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section, click copy button to copy **App Federation Metadata Url** and save it on your computer.

    ![Screenshot shows the Certificate download link.](common/copy-metadataurl.png "Certificate")

## Configure Chengliye Smart SMS Platform SSO

To configure single sign-on on **Chengliye Smart SMS Platform** side, you need to send the **App Federation Metadata Url** to [Chengliye Smart SMS Platform support team](http://www.cly-chn.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Chengliye Smart SMS Platform test user

In this section, a user called B.Simon is created in Chengliye Smart SMS Platform. Chengliye Smart SMS Platform supports just-in-time user provisioning, which is enabled by default. There's no action item for you in this section. If a user doesn't already exist in Chengliye Smart SMS Platform, a new one is commonly created after authentication.

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options.

* Click on **Test this application**, and you should be automatically signed in to the Chengliye Smart SMS Platform for which you set up the SSO.

* You can use Microsoft My Apps. When you click the Chengliye Smart SMS Platform tile in the My Apps, you should be automatically signed in to the Chengliye Smart SMS Platform for which you set up the SSO. For more information, see [Microsoft Entra My Apps](/azure/active-directory/manage-apps/end-user-experiences#azure-ad-my-apps).

## Next steps

Once you configure Chengliye Smart SMS Platform you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).

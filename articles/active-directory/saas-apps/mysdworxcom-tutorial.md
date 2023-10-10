---
title: Microsoft Entra SSO integration with my.sdworx.com
description: Learn how to configure single sign-on between Microsoft Entra ID and my.sdworx.com.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: how-to
ms.date: 05/03/2023
ms.author: jeedes

---

# Microsoft Entra SSO integration with my.sdworx.com

In this article, you learn how to integrate my.sdworx.com with Microsoft Entra ID. my.sdworx.com is an SD Worx portal. When you integrate my.sdworx.com with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to my.sdworx.com.
* Enable your users to be automatically signed-in to my.sdworx.com with their Microsoft Entra accounts.
* Manage your accounts in one central location.

You configure and test Microsoft Entra single sign-on for my.sdworx.com in a test environment. my.sdworx.com supports **IDP** initiated single sign-on.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Prerequisites

To integrate Microsoft Entra ID with my.sdworx.com, you need:

* Before adding the application in your Microsoft Entra tenant, please contact your SD Worx consultant first to start up the track to activate the SSO for your company. The SSO won’t work before it's implemented and activated on the SD Worx Service Provider.
* A Microsoft Entra user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* my.sdworx.com single sign-on (SSO) enabled subscription.

## Add application and assign a test user

Before you begin the process of configuring single sign-on, you need to add the my.sdworx.com application from the Microsoft Entra gallery. You need a test user account to assign to the application and test the single sign-on configuration.

<a name='add-mysdworxcom-from-the-azure-ad-gallery'></a>

### Add my.sdworx.com from the Microsoft Entra gallery

Add my.sdworx.com from the Microsoft Entra application gallery to configure single sign-on with my.sdworx.com. For more information on how to add application from the gallery, see the [Quickstart: Add application from the gallery](../manage-apps/add-application-portal.md).

<a name='create-and-assign-azure-ad-test-user'></a>

### Create and assign Microsoft Entra test user

Follow the guidelines in the [create and assign a user account](../manage-apps/add-application-portal-assign-users.md) article to create a test user account called B.Simon.

Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, and assign roles. The wizard also provides a link to the single sign-on configuration pane. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides). 

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Complete the following steps to enable Microsoft Entra single sign-on.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **my.sdworx.com** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot shows how to edit Basic SAML Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, the **Relay State** should be set to `https://auth.sdworx.com/idhub/tb/wf_startapp?AppCode=MWAM`

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section, click copy button to copy **App Federation Metadata Url** and save it on your computer.

    ![Screenshot shows the Certificate download link.](common/copy-metadataurl.png "Certificate")

## Configure my.sdworx.com SSO

To configure single sign-on on **my.sdworx.com** side, you need to send the **App Federation Metadata Url** to [my.sdworx.com support team](mailto:prod_cloud&busoper_middleware&hostsol@sdworx.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create my.sdworx.com test user

In this section, you create a user called Britta Simon at my.sdworx.com. Work with [my.sdworx.com support team](mailto:prod_cloud&busoper_middleware&hostsol@sdworx.com) to add the users in the my.sdworx.com platform. Users must be created and activated before you use single sign-on.

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options.

* Click on **Test this application**, and you should be automatically signed in to the my.sdworx.com for which you set up the SSO.

* You can use Microsoft My Apps. When you click the my.sdworx.com tile in the My Apps, you should be automatically signed in to the my.sdworx.com for which you set up the SSO. For more information, see [Microsoft Entra My Apps](/azure/active-directory/manage-apps/end-user-experiences#azure-ad-my-apps).

## Additional resources

* [What is single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)
* [Plan a single sign-on deployment](../manage-apps/plan-sso-deployment.md).

## Next steps

Once you configure my.sdworx.com you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).

---
title: Microsoft Entra SSO integration with Brainfuse Online Tutoring
description: Learn how to configure single sign-on between Microsoft Entra ID and Brainfuse Online Tutoring.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: how-to
ms.date: 05/26/2023
ms.author: jeedes

---

# Microsoft Entra SSO integration with Brainfuse Online Tutoring

In this article, you'll learn how to integrate Brainfuse Online Tutoring with Microsoft Entra ID. This app provides single sign-on integration to Brainfuse Live Tutoring. You must be a subscriber to use the app. When you integrate Brainfuse Online Tutoring with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to Brainfuse Online Tutoring.
* Enable your users to be automatically signed-in to Brainfuse Online Tutoring with their Microsoft Entra accounts.
* Manage your accounts in one central location.

You'll configure and test Microsoft Entra single sign-on for Brainfuse Online Tutoring in a test environment. Brainfuse Online Tutoring supports **SP** initiated single sign-on.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Prerequisites

To integrate Microsoft Entra ID with Brainfuse Online Tutoring, you need:

* A Microsoft Entra user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Brainfuse Online Tutoring single sign-on (SSO) enabled subscription.

## Add application and assign a test user

Before you begin the process of configuring single sign-on, you need to add the Brainfuse Online Tutoring application from the Microsoft Entra gallery. You need a test user account to assign to the application and test the single sign-on configuration.

<a name='add-brainfuse-online-tutoring-from-the-azure-ad-gallery'></a>

### Add Brainfuse Online Tutoring from the Microsoft Entra gallery

Add Brainfuse Online Tutoring from the Microsoft Entra application gallery to configure single sign-on with Brainfuse Online Tutoring. For more information on how to add application from the gallery, see the [Quickstart: Add application from the gallery](../manage-apps/add-application-portal.md).

<a name='create-and-assign-azure-ad-test-user'></a>

### Create and assign Microsoft Entra test user

Follow the guidelines in the [create and assign a user account](../manage-apps/add-application-portal-assign-users.md) article to create a test user account called B.Simon.

Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, and assign roles. The wizard also provides a link to the single sign-on configuration pane. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides). 

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Complete the following steps to enable Microsoft Entra single sign-on.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Brainfuse Online Tutoring** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot shows how to edit Basic SAML Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier** textbox, type the URL:
    `https://landing.brainfuse.com/shibboleth`

    b. In the **Reply URL** textbox, type the URL:
    `https://landing.brainfuse.com/Shibboleth.sso/SAML2/POST`

    c. In the **Sign on URL** textbox, type a URL using the following pattern:
    `https://landing.brainfuse.com/saml.asp?oauth_consumer_key=<ID>`
    
    > [!NOTE]
    > This value is not real. Update this value with the actual Sign on URL. Contact [Brainfuse Online Tutoring support team](mailto:support@brainfuse.com) to get the value. You can also refer to the patterns shown in the **Basic SAML Configuration** section.

1. Brainfuse Online Tutoring application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

    ![Screenshot shows the image of attributes configuration.](common/default-attributes.png "Attributes")

1. In addition to above, Brainfuse Online Tutoring application expects few more attributes to be passed back in SAML response, which are shown below. These attributes are also pre populated but you can review them as per your requirements.

    | Name | Source Attribute|
    | ------------ | --------- |
    | mail | user.mail |
    | primarysid | user.userprincipalname |

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section, select copy button to copy **App Federation Metadata Url** and save it on your computer.

	![Screenshot shows the Certificate download link.](common/copy-metadataurl.png "Certificate")

## Configure Brainfuse Online Tutoring SSO

To configure single sign-on on **Brainfuse Online Tutoring** side, you need to send the **App Federation Metadata Url** to [Brainfuse Online Tutoring support team](mailto:support@brainfuse.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Brainfuse Online Tutoring test user

In this section, you create a user called Britta Simon at Brainfuse Online Tutoring. Work with [Brainfuse Online Tutoring support team](mailto:support@brainfuse.com) to add the users in the Brainfuse Online Tutoring platform. Users must be created and activated before you use single sign-on.

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

* Click on **Test this application**, this will redirect to Brainfuse Online Tutoring Sign-on URL where you can initiate the login flow. 

* Go to Brainfuse Online Tutoring Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Brainfuse Online Tutoring tile in the My Apps, this will redirect to Brainfuse Online Tutoring Sign-on URL. For more information, see [Microsoft Entra My Apps](/azure/active-directory/manage-apps/end-user-experiences#azure-ad-my-apps).

## Additional resources

* [What is single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)
* [Plan a single sign-on deployment](../manage-apps/plan-sso-deployment.md).

## Next steps

Once you configure Brainfuse Online Tutoring you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).

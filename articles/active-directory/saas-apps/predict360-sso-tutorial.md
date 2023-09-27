---
title: Microsoft Entra SSO integration with Predict360 SSO
description: Learn how to configure single sign-on between Microsoft Entra ID and Predict360 SSO.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: how-to
ms.date: 04/20/2023
ms.author: jeedes

---

# Microsoft Entra SSO integration with Predict360 SSO

In this article, you learn how to integrate Predict360 SSO with Microsoft Entra ID. Predict360 is a Governance, Risk and Compliance solution for mid-sized banks and other Financial Institutions. When you integrate Predict360 SSO with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to Predict360 SSO.
* Enable your users to be automatically signed-in to Predict360 SSO with their Microsoft Entra accounts.
* Manage your accounts in one central location.

You configure and test Microsoft Entra single sign-on for Predict360 SSO in a test environment. Predict360 SSO supports both **SP** and **IDP** initiated single sign-on.

## Prerequisites

To integrate Microsoft Entra ID with Predict360 SSO, you need:

* A Microsoft Entra user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Predict360 SSO single sign-on (SSO) enabled subscription.

## Add application and assign a test user

Before you begin the process of configuring single sign-on, you need to add the Predict360 SSO application from the Microsoft Entra gallery. You need a test user account to assign to the application and test the single sign-on configuration.

<a name='add-predict360-sso-from-the-azure-ad-gallery'></a>

### Add Predict360 SSO from the Microsoft Entra gallery

Add Predict360 SSO from the Microsoft Entra application gallery to configure single sign-on with Predict360 SSO. For more information on how to add application from the gallery, see the [Quickstart: Add application from the gallery](../manage-apps/add-application-portal.md).

<a name='create-and-assign-azure-ad-test-user'></a>

### Create and assign Microsoft Entra test user

Follow the guidelines in the [create and assign a user account](../manage-apps/add-application-portal-assign-users.md) article to create a test user account called B.Simon.

Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, and assign roles. The wizard also provides a link to the single sign-on configuration pane. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides). 

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Complete the following steps to enable Microsoft Entra single sign-on.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Predict360 SSO** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot shows how to edit Basic SAML Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, if you have **Service Provider metadata file**, perform the following steps:

	a. Click **Upload metadata file**.

    ![Screenshot shows how to upload metadata file.](common/upload-metadata.png "File")

	b. Click on **folder logo** to select the metadata file and click **Upload**.

	![Screenshot shows to choose metadata file in folder.](common/browse-upload-metadata.png "Browse")

	c. After the metadata file is successfully uploaded, the **Identifier** and **Reply URL** values get auto populated in Basic SAML Configuration section.

	d. Enter the customer code/key provided by 360factors in **Relay State** textbox. Make sure the code is entered in lowercase. This is required for **IDP** initiated mode.
	
	> [!Note]
	> You will get the **Service Provider metadata file** from the [Predict360 SSO support team](mailto:support@360factors.com). If the **Identifier** and **Reply URL** values do not get auto populated, then fill in the values manually according to your requirement.

	e. If you wish to configure the application in **SP** initiated mode, then perform the following step:

    In the **Sign on URL** textbox, type your customer specific URL using the following pattern:  
    `https://<customer-key>.360factors.com/predict360/login.do`

	> [!Note]
	> This URL is shared by 360factors team. `<customer-key>` is replaced with your customer key, which is also provide by 360factors team.

1. On the **Set-up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

    ![Screenshot shows the Certificate download link.](common/metadataxml.png "Certificate")

1. Find **Certificate (Raw)** in the **SAML Signing Certificate** section, and select **Download** to download the certificate and save it on your computer.

	![Screenshot shows the Certificate Raw download link.](common/certificateraw.png " Raw Certificate")

1. On the **Set up Predict360 SSO** section, copy the appropriate URL(s) based on your requirement.

	![Screenshot shows to copy configuration appropriate URL.](common/copy-configuration-urls.png "Metadata")

## Configure Predict360 SSO

To configure single sign-on on **Predict360 SSO** side, you need to send the downloaded **Federation Metadata XML**, **Certificate (Raw)** and appropriate copied URLs from the application configuration to [Predict360 SSO support team](mailto:support@360factors.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Predict360 SSO test user

In this section, you create a user called Britta Simon at Predict360 SSO. Work with [Predict360 SSO support team](mailto:support@360factors.com) to add the users in the Predict360 SSO platform. Users must be created and activated before you use single sign-on.

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application**, this will redirect to Predict360 SSO Sign-on URL where you can initiate the login flow.  

* Go to Predict360 SSO Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application**, and you should be automatically signed in to the Predict360 SSO for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the Predict360 SSO tile in the My Apps, if configured in SP mode you would be redirected to the application sign-on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the Predict360 SSO for which you set up the SSO. For more information, see [Microsoft Entra My Apps](/azure/active-directory/manage-apps/end-user-experiences#azure-ad-my-apps).

## Additional resources

* [What is single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)
* [Plan a single sign-on deployment](../manage-apps/plan-sso-deployment.md).

## Next steps

Once you configure Predict360 SSO you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).

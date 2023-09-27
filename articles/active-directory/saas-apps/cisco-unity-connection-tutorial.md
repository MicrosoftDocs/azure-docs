---
title: Microsoft Entra SSO integration with Cisco Unity Connection
description: Learn how to configure single sign-on between Microsoft Entra ID and Cisco Unity Connection.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: how-to
ms.date: 05/05/2023
ms.author: jeedes

---

# Microsoft Entra SSO integration with Cisco Unity Connection

In this article, you learn how to integrate Cisco Unity Connection with Microsoft Entra ID. Cisco Unity Connection is a robust unified messaging and voicemail solution that provides users with flexible message access options including support for voice commands, STT transcriptions etc. When you integrate Cisco Unity Connection with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to Cisco Unity Connection.
* Enable your users to be automatically signed-in to Cisco Unity Connection with their Microsoft Entra accounts.
* Manage your accounts in one central location.

You configure and test Microsoft Entra single sign-on for Cisco Unity Connection in a test environment. Cisco Unity Connection supports **SP** initiated single sign-on.

## Prerequisites

To integrate Microsoft Entra ID with Cisco Unity Connection, you need:

* A Microsoft Entra user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Cisco Unity Connection single sign-on (SSO) enabled subscription.

## Add application and assign a test user

Before you begin the process of configuring single sign-on, you need to add the Cisco Unity Connection application from the Microsoft Entra gallery. You need a test user account to assign to the application and test the single sign-on configuration.

<a name='add-cisco-unity-connection-from-the-azure-ad-gallery'></a>

### Add Cisco Unity Connection from the Microsoft Entra gallery

Add Cisco Unity Connection from the Microsoft Entra application gallery to configure single sign-on with Cisco Unity Connection. For more information on how to add application from the gallery, see the [Quickstart: Add application from the gallery](../manage-apps/add-application-portal.md).

<a name='create-and-assign-azure-ad-test-user'></a>

### Create and assign Microsoft Entra test user

Follow the guidelines in the [create and assign a user account](../manage-apps/add-application-portal-assign-users.md) article to create a test user account called B.Simon.

Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, and assign roles. The wizard also provides a link to the single sign-on configuration pane. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides). 

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Complete the following steps to enable Microsoft Entra single sign-on.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Cisco Unity Connection** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot shows how to edit Basic SAML Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, if you have **Service Provider metadata file** then perform the following steps:

	a. Click **Upload metadata file**.

    ![Screenshot shows how to upload metadata file.](common/upload-metadata.png "File")

	b. Click on **folder logo** to select the metadata file and click **Upload**.

	![Screenshot shows to choose and browse metadata file.](common/browse-upload-metadata.png "Folder")

	c. After the metadata file is successfully uploaded, the **Identifier** and **Reply URL** values get auto populated in Basic SAML Configuration section.

	d. In the **Sign on URL** textbox, type a URL using the following pattern:
	`https://<FQDN_CUC_node>`

	> [!Note]
	> You will get the **Service Provider metadata file** from the [Cisco Unity Connection support team](mailto:unity-tme@cisco.com). If the **Identifier** and **Reply URL** values do not get auto populated, then fill the values manually according to your requirement.

1. Cisco Unity Connection application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

	![Screenshot shows the image of attributes configuration.](common/default-attributes.png "Image")

1. In addition to above, Cisco Unity Connection application expects few more attributes to be passed back in SAML response which are shown below. These attributes are also pre populated but you can review them as per your requirements.

	| Name |  Source Attribute|
	| ---------------|  --------- |
	| uid | user.onpremisessamaccountname |

1. On the **Set-up single sign-on with SAML** page, in the **SAML Signing Certificate** section, find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

    ![Screenshot shows the Certificate download link.](common/metadataxml.png "Certificate")

1. On the **Set up Cisco Unity Connection** section, copy the appropriate URL(s) based on your requirement.

	![Screenshot shows how to copy configuration appropriate URL.](common/copy-configuration-urls.png "Metadata")

## Configure Cisco Unity Connection SSO

To configure single sign-on on **Cisco Unity Connection** side, you need to send the downloaded **Federation Metadata XML** and appropriate copied URLs from the application configuration to [Cisco Unity Connection support team](mailto:unity-tme@cisco.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Cisco Unity Connection test user

In this section, you create a user called Britta Simon in Cisco Unity Connection. Work with [Cisco Unity Connection support team](mailto:unity-tme@cisco.com) to add the users in the Cisco Unity Connection platform. Users must be created and activated before you use single sign-on.

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

* Click on **Test this application**, this will redirect to Cisco Unity Connection Sign-on URL where you can initiate the login flow. 

* Go to Cisco Unity Connection Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Cisco Unity Connection tile in the My Apps, this will redirect to Cisco Unity Connection Sign-on URL. For more information, see [Microsoft Entra My Apps](/azure/active-directory/manage-apps/end-user-experiences#azure-ad-my-apps).

## Additional resources

* [What is single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)
* [Plan a single sign-on deployment](../manage-apps/plan-sso-deployment.md).

## Next steps

Once you configure Cisco Unity Connection you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).

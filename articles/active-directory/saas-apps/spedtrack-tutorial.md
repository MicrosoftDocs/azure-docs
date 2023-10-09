---
title: Microsoft Entra SSO integration with SpedTrack
description: Learn how to configure single sign-on between Microsoft Entra ID and SpedTrack.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: how-to
ms.date: 12/19/2022
ms.author: jeedes

---

# Microsoft Entra SSO integration with SpedTrack

In this article, you'll learn how to integrate SpedTrack with Microsoft Entra ID. SpedTrack provides a comprehensive web-based solution for school districts to manage their Special Services departments. When you integrate SpedTrack with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to SpedTrack.
* Enable your users to be automatically signed-in to SpedTrack with their Microsoft Entra accounts.

You'll configure and test Microsoft Entra single sign-on for SpedTrack in a test environment. SpedTrack supports both **SP** and **IDP** initiated single sign-on.

## Prerequisites

To integrate Microsoft Entra ID with SpedTrack, you need:

* A Microsoft Entra user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* SpedTrack single sign-on (SSO) enabled subscription.

## Add application and assign a test user

Before you begin the process of configuring single sign-on, you need to add the SpedTrack application from the Microsoft Entra gallery. A user within your tenant will need to be assigned to the application. This test user will need to exist within SpedTrack also. 

<a name='add-spedtrack-from-the-azure-ad-gallery'></a>

### Add SpedTrack from the Microsoft Entra gallery

Add SpedTrack from the Microsoft Entra application gallery to configure single sign-on with SpedTrack. For more information on how to add application from the gallery, see the [Quickstart: Add application from the gallery](../manage-apps/add-application-portal.md).

<a name='assign-an-azure-ad-test-user'></a>

### Assign a Microsoft Entra test user

Follow the guidelines in the [create and assign a user account](../manage-apps/add-application-portal-assign-users.md) article to create a test user account. This test user will also need to be created within SpedTrack with a matching email.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Complete the following steps to enable Microsoft Entra single sign-on.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **SpedTrack** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.

1. On the **Basic SAML Configuration** section, if you have **Service Provider metadata file** then perform the following steps:

	a. Click **Upload metadata file**.

    ![Screenshot shows how to upload metadata file.](common/upload-metadata.png "File")

	b. Click on **folder logo** to select the metadata file and click **Upload**.

	![Screenshot shows how to choose and browse metadata file.](common/browse-upload-metadata.png "Folder")

	c. After the metadata file is successfully uploaded, the **Identifier** and **Reply URL** values get auto populated in Basic SAML Configuration section.

	d. In the **Sign on URL** textbox, type a URL using the following pattern:
    `https://<SUBDOMAIN>.spedtrack.com/Login.aspx`

1. If needed, fill the values manually that copied from the SpedTrack in the **Basic SAML Configuration** section by clicking pencil icon.

    a. In the **Identifier** textbox, type a URL using the following pattern:
    `https://<SUBDOMAIN>.spedtrack.com`

    b. In the **Reply URL** textbox, type a URL using the following pattern:
    `https://<SUBDOMAIN>.spedtrack.com/SSO/AssertionConsumerService.aspx`

1. If you want to configure **SP** initiated SSO, then perform the following step:  

    In the **Sign on URL** textbox, type a URL using the following pattern:
    `https://<SUBDOMAIN>.spedtrack.com/Login.aspx`

1. On the **Set-up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

    ![Screenshot shows the Certificate download link.](common/metadataxml.png "Certificate")

## Configure SpedTrack SSO

1. Log in to your SpedTrack company site as an administrator.

1. Navigate to **Admin > District Setup > Single Sign-On**.

1. Click **Edit Config** and select **Azure** as your **IdP Provider**.

1. Download the SP Metadata file or copy the values of Identifier, Reply URL, Sign on URL and Logout URL. 

1. Select **Upload Metadata** to upload the **Federation Metadata XML** file, which you've downloaded.

1. **Save** the changes within SpedTrack after uploading the file. 

### Create SpedTrack test user

In this section, you create a user called Britta Simon in SpedTrack. Work with [SpedTrack support team](mailto:support@spedtrack.com) to add the users in the SpedTrack platform. Users must be created and activated before you use single sign-on.

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

#### SP initiated:

* Ensure the user being tested was allowed access to the application and exists within SpedTrack.
* Within SpedTrack navigate to **Admin > District Setup > Single Sign-On**. Click on **Test Config**. 

#### IDP initiated:

* Click on **Test this application**, and you should be automatically signed in to the SpedTrack for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the SpedTrack tile in the My Apps, if configured in SP mode you would be redirected to the application sign-on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the SpedTrack for which you set up the SSO. For more information, see [Microsoft Entra My Apps](/azure/active-directory/manage-apps/end-user-experiences#azure-ad-my-apps).

## Additional resources

* [What is single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)
* [Plan a single sign-on deployment](../manage-apps/plan-sso-deployment.md).

## Next steps

Once you configure SpedTrack you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).

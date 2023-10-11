---
title: Microsoft Entra SSO integration with Informatica Intelligent Data Management Cloud
description: Learn how to configure single sign-on between Microsoft Entra ID and Informatica Intelligent Data Management Cloud.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: how-to
ms.date: 07/10/2023
ms.author: jeedes

---

# Microsoft Entra SSO integration with Informatica Intelligent Data Management Cloud

In this article, you'll learn how to integrate Informatica Intelligent Data Management Cloud with Microsoft Entra ID. It is a SAML SSO Auth application to enable Informatica Intelligent Data Management Cloud on Azure Native Services. When you integrate Informatica Intelligent Data Management Cloud with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to Informatica Intelligent Data Management Cloud.
* Enable your users to be automatically signed-in to Informatica Intelligent Data Management Cloud with their Microsoft Entra accounts.
* Manage your accounts in one central location.

You'll configure and test Microsoft Entra single sign-on for Informatica Intelligent Data Management Cloud in a test environment. Informatica Intelligent Data Management Cloud supports both **SP** and **IDP** initiated single sign-on and **Just In Time** user provisioning.

## Prerequisites

To integrate Microsoft Entra ID with Informatica Intelligent Data Management Cloud, you need:

* A Microsoft Entra user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Informatica Intelligent Data Management Cloud single sign-on (SSO) enabled subscription.

## Add application and assign a test user

Before you begin the process of configuring single sign-on, you need to add the Informatica Intelligent Data Management Cloud application from the Microsoft Entra gallery. You need a test user account to assign to the application and test the single sign-on configuration.

<a name='add-informatica-intelligent-data-management-cloud-from-the-azure-ad-gallery'></a>

### Add Informatica Intelligent Data Management Cloud from the Microsoft Entra gallery

Add Informatica Intelligent Data Management Cloud from the Microsoft Entra application gallery to configure single sign-on with Informatica Intelligent Data Management Cloud. For more information on how to add application from the gallery, see the [Quickstart: Add application from the gallery](../manage-apps/add-application-portal.md).

<a name='create-and-assign-azure-ad-test-user'></a>

### Create and assign Microsoft Entra test user

Follow the guidelines in the [create and assign a user account](../manage-apps/add-application-portal-assign-users.md) article to create a test user account called B.Simon.

Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, and assign roles. The wizard also provides a link to the single sign-on configuration pane. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides). 

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Complete the following steps to enable Microsoft Entra single sign-on.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Informatica Intelligent Data Management Cloud** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot shows how to edit Basic SAML Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, perform the following steps:

    1. In the **Identifier** textbox, type a URL using the following pattern:
    `https://<ORG_ID>.<REGION>.informaticacloud.com`

    1. In the **Reply URL** textbox, type a URL using the following pattern:
    `https://<REGION>.informaticacloud.com/identity-service/acs/<ORG_ID>`

1. If you wish to configure the application in **SP** initiated mode, then perform the following step:

    In the **Sign on URL** textbox, type a URL using the following pattern:
    `https://<REGION>.informaticacloud.com/ma/sso/<ORG_ID>`

    > [!NOTE]
    > These values are not real. Update these values with the actual Identifier, Reply URL and Sign on URL. Contact [Informatica Intelligent Data Management Cloud support team](mailto:support@informatica.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section.

1. On the **Set-up single sign-on with SAML** page, in the **SAML Signing Certificate** section, find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

    ![Screenshot shows the Certificate download link.](common/certificatebase64.png "Certificate")

1. On the **Set up Informatica Intelligent Data Management Cloud** section, copy the appropriate URL(s) based on your requirement.

	![Screenshot shows to copy configuration appropriate URL.](common/copy-configuration-urls.png "Metadata")

## Configure Informatica Intelligent Data Management Cloud SSO

1. Log in to your Informatica Intelligent Data Management Cloud company site as an administrator.

1. Go to **Administrator** > **SAML Setup** and perform the following steps:

    ![Screenshot that shows the Settings page of Brainfuse.](./media/informatica-intelligent-data-management-cloud-tutorial/settings.png "Business")

    1. In the **Issuer** textbox, paste the **Microsoft Entra Identifier** value, which you copied previously.

    1. In the **Single Sign-On Service URL** textbox, paste the **Login URL**, which you copied previously.

    1. In the **Single Logout Service URL** textbox, paste the **Logout URL**, which you copied previously.

    1. Open the downloaded **Certificate (Base64)** into Notepad and paste the content into the **Signing Certificate** textbox.

    1. Click **Save** to save the details.

### Create Informatica Intelligent Data Management Cloud test user

In this section, a user called B.Simon is created in Informatica Intelligent Data Management Cloud. Informatica Intelligent Data Management Cloud supports just-in-time user provisioning, which is enabled by default. There's no action item for you in this section. If a user doesn't already exist in Informatica Intelligent Data Management Cloud, a new one is commonly created after authentication.

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application**, this will redirect to Informatica Intelligent Data Management Cloud Sign-on URL where you can initiate the login flow.  

* Go to Informatica Intelligent Data Management Cloud Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application**, and you should be automatically signed in to the Informatica Intelligent Data Management Cloud for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the Informatica Intelligent Data Management Cloud tile in the My Apps, if configured in SP mode you would be redirected to the application sign-on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the Informatica Intelligent Data Management Cloud for which you set up the SSO. For more information, see [Microsoft Entra My Apps](/azure/active-directory/manage-apps/end-user-experiences#azure-ad-my-apps).

## Additional resources

* [What is single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)
* [Plan a single sign-on deployment](../manage-apps/plan-sso-deployment.md).

## Next steps

Once you configure Informatica Intelligent Data Management Cloud you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).

---
title: Azure Active Directory SSO integration with Acoustic Connect
description: Learn how to configure single sign-on between Azure Active Directory and Acoustic Connect.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: how-to
ms.date: 07/20/2023
ms.author: jeedes

---

# Azure Active Directory SSO integration with Acoustic Connect

In this article, you'll learn how to integrate Acoustic Connect with Azure Active Directory (Azure AD). Acoustic Connect is platform that helps you create marketing campaigns that resonate with people, build a loyal following, and drive revenue. When you integrate Acoustic Connect with Azure AD, you can:

* Control in Azure AD who has access to Acoustic Connect.
* Enable your users to be automatically signed-in to Acoustic Connect with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

You'll configure and test Azure AD single sign-on for Acoustic Connect in a test environment. Acoustic Connect supports both **SP** and **IDP** initiated single sign-on and **Just In Time** user provisioning.

## Prerequisites

To integrate Azure Active Directory with Acoustic Connect, you need:

* An Azure AD user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Acoustic Connect single sign-on (SSO) enabled subscription.

## Add application and assign a test user

Before you begin the process of configuring single sign-on, you need to add the Acoustic Connect application from the Azure AD gallery. You need a test user account to assign to the application and test the single sign-on configuration.

### Add Acoustic Connect from the Azure AD gallery

Add Acoustic Connect from the Azure AD application gallery to configure single sign-on with Acoustic Connect. For more information on how to add application from the gallery, see the [Quickstart: Add application from the gallery](../manage-apps/add-application-portal.md).

### Create and assign Azure AD test user

Follow the guidelines in the [create and assign a user account](../manage-apps/add-application-portal-assign-users.md) article to create a test user account in the Azure portal called B.Simon.

Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, and assign roles. The wizard also provides a link to the single sign-on configuration pane in the Azure portal. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides). 

## Configure Azure AD SSO

Complete the following steps to enable Azure AD single sign-on in the Azure portal.

1. In the Azure portal, on the **Acoustic Connect** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot shows how to edit Basic SAML Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier** textbox, type a URL using the following pattern:
    `https://www.okta.com/saml2/service-provider/<Acoustic_ID>`

    b. In the **Reply URL** textbox, type a URL using the following pattern:
    `https://login.goacoustic.com/sso/saml2/<ID>`

1. Perform the following step, if you wish to configure the application in **SP** initiated mode:

	In the **Sign on URL** textbox, type the URL:
	`https://login.goacoustic.com/`

	> [!NOTE]
    > These values are not real. Update these values with the actual Identifier and Reply URL. Contact [Acoustic Connect support team](mailto:support@acoustic.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. On the **Set-up single sign-on with SAML** page, in the **SAML Signing Certificate** section, find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

    ![Screenshot shows the Certificate download link.](common/metadataxml.png "Certificate")

1. On the **Set up Acoustic Connect** section, copy the appropriate URL(s) based on your requirement.

	![Screenshot shows to copy configuration appropriate U R L.](common/copy-configuration-urls.png "Attributes")

## Configure Acoustic Connect SSO

To configure single sign-on on **Acoustic Connect** side, you need to send the downloaded **Federation Metadata XML** and appropriate copied URLs from Azure portal to [Acoustic Connect support team](mailto:support@acoustic.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Acoustic Connect test user

In this section, a user called B.Simon is created in Acoustic Connect. Acoustic Connect supports just-in-time user provisioning, which is enabled by default. There's no action item for you in this section. If a user doesn't already exist in Acoustic Connect, a new one is commonly created after authentication.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application** in Azure portal. This will redirect to Acoustic Connect Sign-on URL where you can initiate the login flow.  

* Go to Acoustic Connect Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application** in Azure portal and you should be automatically signed in to the Acoustic Connect for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the Acoustic Connect tile in the My Apps, if configured in SP mode you would be redirected to the application sign-on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the Acoustic Connect for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Additional resources

* [What is single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)
* [Plan a single sign-on deployment](../manage-apps/plan-sso-deployment.md).

## Next steps

Once you configure Acoustic Connect you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).
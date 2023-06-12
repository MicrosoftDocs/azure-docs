---
title: Azure Active Directory SSO integration with Proofpoint Security Awareness Training
description: Learn how to configure single sign-on between Azure Active Directory and Proofpoint Security Awareness Training.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: how-to
ms.date: 03/31/2023
ms.author: jeedes

---

# Azure Active Directory SSO integration with Proofpoint Security Awareness Training

In this article, you learn how to integrate Proofpoint Security Awareness Training with Azure Active Directory (Azure AD). This application allows Azure AD to act as SAML IdP for authenticating users to Proofpoint Security Awareness Training. When you integrate Proofpoint Security Awareness Training with Azure AD, you can:

* Control in Azure AD who has access to Proofpoint Security Awareness Training.
* Enable your users to be automatically signed-in to Proofpoint Security Awareness Training with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

You configure and test Azure AD single sign-on for Proofpoint Security Awareness Training in a test environment. Proofpoint Security Awareness Training supports both **SP** and **IDP** initiated single sign-on and **Just In Time** user provisioning.

## Prerequisites

To integrate Azure Active Directory with Proofpoint Security Awareness Training, you need:

* An Azure AD user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Proofpoint Security Awareness Training single sign-on (SSO) enabled subscription.

## Add application and assign a test user

Before you begin the process of configuring single sign-on, you need to add the Proofpoint Security Awareness Training application from the Azure AD gallery. You need a test user account to assign to the application and test the single sign-on configuration.

### Add Proofpoint Security Awareness Training from the Azure AD gallery

Add Proofpoint Security Awareness Training from the Azure AD application gallery to configure single sign-on with Proofpoint Security Awareness Training. For more information on how to add application from the gallery, see the [Quickstart: Add application from the gallery](../manage-apps/add-application-portal.md).

### Create and assign Azure AD test user

Follow the guidelines in the [create and assign a user account](../manage-apps/add-application-portal-assign-users.md) article to create a test user account in the Azure portal called B.Simon.

Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, and assign roles. The wizard also provides a link to the single sign-on configuration pane in the Azure portal. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides). 

## Configure Azure AD SSO

Complete the following steps to enable Azure AD single sign-on in the Azure portal.

1. In the Azure portal, on the **Proofpoint Security Awareness Training** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   [ ![Screenshot shows how to edit Basic SAML Configuration.](common/edit-urls.png "Basic Configuration")](common/edit-urls.png#lightbox)

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier** textbox, type a URL using the following pattern:
    `https://<SUBDOMAIN>.<ENVIRONMENT>/api/auth/saml/metadata`

    b. In the **Reply URL** textbox, type a URL using the following pattern:
    `https://<SUBDOMAIN>.<ENVIRONMENT>/api/auth/saml/SSO`

1. If you wish to configure the application in **SP** initiated mode, then perform the following steps:

    a. In the **Sign on URL** textbox, type a URL using the following pattern:
    `https://<SUBDOMAIN>.<ENVIRONMENT>`

    b. In the **Relay State** textbox, type a URL using the following pattern:
    `https://<SUBDOMAIN>.<ENVIRONMENT>`

    c. In the **Logout Url** textbox, type a URL using the following pattern:
    `https://<SUBDOMAIN>.<ENVIRONMENT>/api/auth/saml/SingleLogout`
    
    > [!NOTE]
    > These values are not real. Update these values with the actual Identifier, Reply URL, Sign on URL, Relay State and Logout Url. Contact [Proofpoint Security Awareness Training Client support team](mailto:wst-support@proofpoint.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section, click copy button to copy **App Federation Metadata Url** and save it on your computer.

    [ ![Screenshot shows the Certificate download link.](common/copy-metadataurl.png "Certificate")](common/copy-metadataurl.png#lightbox)

## Configure Proofpoint Security Awareness Training SSO

To configure single sign-on on **Proofpoint Security Awareness Training** side, you need to send the **App Federation Metadata Url** to [Proofpoint Security Awareness Training support team](mailto:wst-support@proofpoint.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Proofpoint Security Awareness Training test user

In this section, a user called B.Simon is created in Proofpoint Security Awareness Training. Proofpoint Security Awareness Training supports just-in-time user provisioning, which is enabled by default. There's no action item for you in this section. If a user doesn't already exist in Proofpoint Security Awareness Training, a new one is commonly created after authentication.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application** in Azure portal. This will redirect to Proofpoint Security Awareness Training Sign-on URL where you can initiate the login flow.  

* Go to Proofpoint Security Awareness Training Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application** in Azure portal and you should be automatically signed in to the Proofpoint Security Awareness Training for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the Proofpoint Security Awareness Training tile in the My Apps, if configured in SP mode you would be redirected to the application sign-on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the Proofpoint Security Awareness Training for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Additional resources

* [What is single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)
* [Plan a single sign-on deployment](../manage-apps/plan-sso-deployment.md).

## Next steps

Once you configure Proofpoint Security Awareness Training you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).
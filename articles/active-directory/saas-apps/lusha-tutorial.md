---
title: Azure Active Directory SSO integration with Lusha
description: Learn how to configure single sign-on between Azure Active Directory and Lusha.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: how-to
ms.date: 01/04/2023
ms.author: jeedes

---

# Azure Active Directory SSO integration with Lusha

In this article, you'll learn how to integrate Lusha with Azure Active Directory (Azure AD). Lusha is a sales intelligence solution that delivers instant and accurate contact and company data to help leading sales, marketing, and recruitment teams speed up sales with less work. When you integrate Lusha with Azure AD, you can:

* Control in Azure AD who has access to Lusha.
* Enable your users to be automatically signed-in to Lusha with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

You'll configure and test Azure AD single sign-on for Lusha in a test environment. Lusha supports both **SP** and **IDP** initiated single sign-on and also supports **Just In Time** user provisioning.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Prerequisites

To integrate Azure Active Directory with Lusha, you need:

* An Azure AD user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Lusha single sign-on (SSO) enabled subscription.

## Add application and assign a test user

Before you begin the process of configuring single sign-on, you need to add the Lusha application from the Azure AD gallery. You need a test user account to assign to the application and test the single sign-on configuration.

### Add Lusha from the Azure AD gallery

Add Lusha from the Azure AD application gallery to configure single sign-on with Lusha. For more information on how to add application from the gallery, see the [Quickstart: Add application from the gallery](../manage-apps/add-application-portal.md).

### Create and assign Azure AD test user

Follow the guidelines in the [create and assign a user account](../manage-apps/add-application-portal-assign-users.md) article to create a test user account in the Azure portal called B.Simon.

Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, and assign roles. The wizard also provides a link to the single sign-on configuration pane in the Azure portal. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides). 

## Configure Azure AD SSO

Complete the following steps to enable Azure AD single sign-on in the Azure portal.

1. In the Azure portal, on the **Lusha** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot shows how to edit Basic SAML Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, the user doesn't have to perform any step as the app is already pre-integrated with Azure.

1. If you want to configure **SP** initiated SSO, then perform the following step:  

    In the **Sign on URL** textbox, type the URL:
    `https://auth.lusha.com/sso-login`

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section, click copy button to copy **App Federation Metadata Url** and save it on your computer.

    ![Screenshot shows the Certificate download link.](common/copy-metadataurl.png "Certificate")

## Configure Lusha SSO

To configure single sign-on on **Lusha** side, you need to send the **App Federation Metadata Url** to [Lusha support team](mailto:support@lusha.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Lusha test user

In this section, a user called B.Simon is created in Lusha. Lusha supports just-in-time user provisioning, which is enabled by default. There's no action item for you in this section. If a user doesn't already exist in Lusha, a new one is created after authentication.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application** in Azure portal. This will redirect to Lusha Sign-on URL where you can initiate the login flow.  

* Go to Lusha Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application** in Azure portal and you should be automatically signed in to the Lusha for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the Lusha tile in the My Apps, if configured in SP mode you would be redirected to the application sign-on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the Lusha for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Additional resources

* [What is single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)
* [Plan a single sign-on deployment](../manage-apps/plan-sso-deployment.md).

## Next steps

Once you configure Lusha you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).
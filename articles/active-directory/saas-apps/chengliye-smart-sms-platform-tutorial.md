---
title: Azure Active Directory SSO integration with Chengliye Smart SMS Platform
description: Learn how to configure single sign-on between Azure Active Directory and Chengliye Smart SMS Platform.
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

# Azure Active Directory SSO integration with Chengliye Smart SMS Platform

In this article, you'll learn how to integrate Chengliye Smart SMS Platform with Azure Active Directory (Azure AD). Chengliye Smart SMS Platform was founded in 2014, the company is primarily engaged in software development and telecommunications value-added services. It specializes in services such as SMS terminals and data transmission. When you integrate Chengliye Smart SMS Platform with Azure AD, you can:

* Control in Azure AD who has access to Chengliye Smart SMS Platform.
* Enable your users to be automatically signed-in to Chengliye Smart SMS Platform with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

You'll configure and test Azure AD single sign-on for Chengliye Smart SMS Platform in a test environment. Chengliye Smart SMS Platform supports **IDP** initiated single sign-on and **Just In Time** user provisioning.

## Prerequisites

To integrate Azure Active Directory with Chengliye Smart SMS Platform, you need:

* An Azure AD user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Chengliye Smart SMS Platform single sign-on (SSO) enabled subscription.

## Add application and assign a test user

Before you begin the process of configuring single sign-on, you need to add the Chengliye Smart SMS Platform application from the Azure AD gallery. You need a test user account to assign to the application and test the single sign-on configuration.

### Add Chengliye Smart SMS Platform from the Azure AD gallery

Add Chengliye Smart SMS Platform from the Azure AD application gallery to configure single sign-on with Chengliye Smart SMS Platform. For more information on how to add application from the gallery, see the [Quickstart: Add application from the gallery](../manage-apps/add-application-portal.md).

### Create and assign Azure AD test user

Follow the guidelines in the [create and assign a user account](../manage-apps/add-application-portal-assign-users.md) article to create a test user account in the Azure portal called B.Simon.

Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, and assign roles. The wizard also provides a link to the single sign-on configuration pane in the Azure portal. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides). 

## Configure Azure AD SSO

Complete the following steps to enable Azure AD single sign-on in the Azure portal.

1. In the Azure portal, on the **Chengliye Smart SMS Platform** application integration page, find the **Manage** section and select **single sign-on**.
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

In this section, you test your Azure AD single sign-on configuration with following options.

* Click on Test this application in Azure portal and you should be automatically signed in to the Chengliye Smart SMS Platform for which you set up the SSO.

* You can use Microsoft My Apps. When you click the Chengliye Smart SMS Platform tile in the My Apps, you should be automatically signed in to the Chengliye Smart SMS Platform for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure Chengliye Smart SMS Platform you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).
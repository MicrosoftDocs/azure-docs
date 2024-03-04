---
title: Azure Active Directory SSO integration with Fleet Management System
description: Learn how to configure single sign-on between Azure Active Directory and Fleet Management System.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: how-to
ms.date: 07/24/2023
ms.author: jeedes

---

# Azure Active Directory SSO integration with Fleet Management System

In this article, you learn how to integrate Fleet Management System with Azure Active Directory (Azure AD). Manages and monitors a fleet of surface level vehicles and subterranean tugs and carts that Microsoft utilizes. When you integrate Fleet Management System with Azure AD, you can:

* Control in Azure AD who has access to Fleet Management System.
* Enable your users to be automatically signed-in to Fleet Management System with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

You'll configure and test Azure AD single sign-on for Fleet Management System in a test environment. Fleet Management System supports **IDP** initiated single sign-on.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Prerequisites

To integrate Azure Active Directory with Fleet Management System, you need:

* An Azure AD user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Fleet Management System single sign-on (SSO) enabled subscription.

## Add application and assign a test user

Before you begin the process of configuring single sign-on, you need to add the Fleet Management System application from the Azure AD gallery. You need a test user account to assign to the application and test the single sign-on configuration.

### Add Fleet Management System from the Azure AD gallery

Add Fleet Management System from the Azure AD application gallery to configure single sign-on with Fleet Management System. For more information on how to add application from the gallery, see the [Quickstart: Add application from the gallery](../manage-apps/add-application-portal.md).

### Create and assign Azure AD test user

Follow the guidelines in the [create and assign a user account](../manage-apps/add-application-portal-assign-users.md) article to create a test user account in the Azure portal called B.Simon.

Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, and assign roles. The wizard also provides a link to the single sign-on configuration pane in the Azure portal. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides). 

## Configure Azure AD SSO

Complete the following steps to enable Azure AD single sign-on in the Azure portal.

1. In the Azure portal, on the **Fleet Management System** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot shows how to edit Basic SAML Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier** textbox, type one of the following URLs:

    | Environment | URL |
    |----|----|
    | Production| `https://msfms.net/SAMLFms` |
    | Staging | `https://test.msfms.net/SAMLFms`|

    b. In the **Reply URL** textbox, type one of the following URLs:

    | Environment | URL |
    |----|----|
    | Production| `https://msfms.net/saml2/acs` |
    | Staging | `https://test.msfms.net/saml2/acs`|

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section, find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

    ![Screenshot shows the Certificate download link.](common/certificatebase64.png "Certificate")

1. On the **Set up Fleet Management System** section, copy the appropriate URL(s) based on your requirement.

	![Screenshot shows to copy configuration appropriate URL.](common/copy-configuration-urls.png "Metadata")

## Configure Fleet Management System SSO

To configure single sign-on on **Fleet Management System** side, you need to send the downloaded **Certificate (Base64)** and appropriate copied URLs from Azure portal to [Fleet Management System support team](mailto:fms-datashare@navagis.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Fleet Management System test user

In this section, you create a user called Britta Simon at Fleet Management System. Work with [Fleet Management System support team](mailto:fms-datashare@navagis.com) to add the users in the Fleet Management System platform. Users must be created and activated before you use single sign-on.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options.

* Click on Test this application in Azure portal and you should be automatically signed in to the Fleet Management System for which you set up the SSO.

* You can use Microsoft My Apps. When you click the Fleet Management System tile in the My Apps, you should be automatically signed in to the Fleet Management System for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Additional resources

* [What is single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)
* [Plan a single sign-on deployment](../manage-apps/plan-sso-deployment.md).

## Next steps

Once you configure Fleet Management System you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).
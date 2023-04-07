---
title: Azure Active Directory SSO integration with YOU at College
description: Learn how to configure single sign-on between Azure Active Directory and YOU at College.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: how-to
ms.date: 01/27/2023
ms.author: jeedes

---

# Azure Active Directory SSO integration with YOU at College

In this article, you learn how to integrate YOU at College with Azure Active Directory (Azure AD). YOU at College is an opt-in, web-based well-being application that higher education institutions can license and promote to their students and staff. When you integrate YOU at College with Azure AD, you can:

* Control in Azure AD who has access to YOU at College.
* Enable your users to be automatically signed-in to YOU at College with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

You'll configure and test Azure AD single sign-on for YOU at College in a test environment. YOU at College supports only **SP** initiated single sign-on and **Just In Time** user provisioning.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Prerequisites

To integrate Azure Active Directory with YOU at College, you need:

* An Azure AD user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* YOU at College single sign-on (SSO) enabled subscription.

## Add application and assign a test user

Before you begin the process of configuring single sign-on, you need to add the YOU at College application from the Azure AD gallery. You need a test user account to assign to the application and test the single sign-on configuration.

### Add YOU at College from the Azure AD gallery

Add YOU at College from the Azure AD application gallery to configure single sign-on with YOU at College. For more information on how to add application from the gallery, see the [Quickstart: Add application from the gallery](../manage-apps/add-application-portal.md).

### Create and assign Azure AD test user

Follow the guidelines in the [create and assign a user account](../manage-apps/add-application-portal-assign-users.md) article to create a test user account in the Azure portal called B.Simon.

Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, and assign roles. The wizard also provides a link to the single sign-on configuration pane in the Azure portal. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides). 

## Configure Azure AD SSO

Complete the following steps to enable Azure AD single sign-on in the Azure portal.

1. In the Azure portal, on the **YOU at College** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot shows how to edit Basic SAML Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier** textbox, type the URL:
    `http://sso.youatcollege.com/shibboleth`

    b. In the **Reply URL** textbox, type the URL:
    `https://sso.youatcollege.com/Shibboleth.sso/SAML2/POST`

    c. In the **Sign on URL** textbox, type a URL using the following pattern:
    `https://sso.youatcollege.com/idp-<domain>.php`

    > [!NOTE]
    > This value is not real. Update this value with the actual Sign on URL. Contact [YOU at College Client support team](mailto:technology@gritdigitalhealth.com) to get the value. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. On the **Set-up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

    ![Screenshot shows the Certificate download link.](common/metadataxml.png "Certificate")

1. On the **Set up YOU at College** section, copy the appropriate URL(s) based on your requirement.

	![Screenshot shows to copy configuration appropriate URL.](common/copy-configuration-urls.png "Metadata")

## Configure YOU at College SSO

To configure single sign-on on **YOU at College** side, you need to send the downloaded **Federation Metadata XML** and appropriate copied URLs from Azure portal to [YOU at College support team](mailto:technology@gritdigitalhealth.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create YOU at College test user

In this section, a user called B.Simon is created in YOU at College. YOU at College supports just-in-time user provisioning, which is enabled by default. There's no action item for you in this section. If a user doesn't already exist in YOU at College, a new one is commonly created after authentication.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

* Click on **Test this application** in Azure portal. This will redirect to YOU at College Sign-on URL where you can initiate the login flow. 

* Go to YOU at College Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you select the YOU at College tile in the My Apps, this will redirect to YOU at College Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Additional resources

* [What is single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)
* [Plan a single sign-on deployment](../manage-apps/plan-sso-deployment.md).

## Next steps

Once you configure YOU at College you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).
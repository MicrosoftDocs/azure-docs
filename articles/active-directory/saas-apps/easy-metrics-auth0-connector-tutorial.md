---
title: Azure Active Directory SSO integration with Easy Metrics Auth0 Connector
description: Learn how to configure single sign-on between Azure Active Directory and Easy Metrics Auth0 Connector.
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

# Azure Active Directory SSO integration with Easy Metrics Auth0 Connector

In this article, you learn how to integrate Easy Metrics Auth0 Connector with Azure Active Directory (Azure AD). This application is a bridge between Azure AD and Auth0, federating Authentication to Microsoft Azure AD for our customers. When you integrate Easy Metrics Auth0 Connector with Azure AD, you can:

* Control in Azure AD who has access to Easy Metrics Auth0 Connector.
* Enable your users to be automatically signed-in to Easy Metrics Auth0 Connector with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

You configure and test Azure AD single sign-on for Easy Metrics Auth0 Connector in a test environment. Easy Metrics Auth0 Connector supports only **SP** initiated single sign-on.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Prerequisites

To integrate Azure Active Directory with Easy Metrics Auth0 Connector, you need:

* An Azure AD user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Easy Metrics Auth0 Connector single sign-on (SSO) enabled subscription.

## Add application and assign a test user

Before you begin the process of configuring single sign-on, you need to add the Easy Metrics Auth0 Connector application from the Azure AD gallery. You need a test user account to assign to the application and test the single sign-on configuration.

### Add Easy Metrics Auth0 Connector from the Azure AD gallery

Add Easy Metrics Auth0 Connector from the Azure AD application gallery to configure single sign-on with Easy Metrics Auth0 Connector. For more information on how to add application from the gallery, see the [Quickstart: Add application from the gallery](../manage-apps/add-application-portal.md).

### Create and assign Azure AD test user

Follow the guidelines in the [create and assign a user account](../manage-apps/add-application-portal-assign-users.md) article to create a test user account in the Azure portal called B.Simon.

Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, and assign roles. The wizard also provides a link to the single sign-on configuration pane in the Azure portal. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides). 

## Configure Azure AD SSO

Complete the following steps to enable Azure AD single sign-on in the Azure portal.

1. In the Azure portal, on the **Easy Metrics Auth0 Connector** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot shows how to edit Basic SAML Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, perform the following steps:

	a. In the **Identifier** textbox, type the value:
	`urn:auth0:easymetrics:ups-saml-sso`

	b. In the **Reply URL** textbox, type the URL:
	`https://easymetrics.auth0.com/login/callback?connection=ups-saml-sso&organization=org_T8ro1Kth3Gleygg5`

	c. In the **Sign on URL** textbox, type the URL:
	`https://azureapp.gcp-easymetrics.com`

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (PEM)** and select **Download** to download the certificate and save it on your computer.

	![Screenshot shows the Certificate download link.](common/certificate-base64-download.png "Certificate")

## Configure Easy Metrics Auth0 Connector SSO

To configure single sign-on on **Easy Metrics Auth0 Connector** side, you need to send the **Certificate (PEM)** to [Easy Metrics Auth0 Connector support team](mailto:support@easymetrics.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Easy Metrics Auth0 Connector test user

In this section, you create a user called Britta Simon in Easy Metrics Auth0 Connector. Work with [Easy Metrics Auth0 Connector support team](mailto:support@easymetrics.com) to add the users in the Easy Metrics Auth0 Connector platform. Users must be created and activated before you use single sign-on.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

* Click on **Test this application** in Azure portal. This will redirect to Easy Metrics Auth0 Connector Sign-on URL where you can initiate the login flow. 

* Go to Easy Metrics Auth0 Connector Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Easy Metrics Auth0 Connector tile in the My Apps, this will redirect to Easy Metrics Auth0 Connector Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Additional resources

* [What is single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)
* [Plan a single sign-on deployment](../manage-apps/plan-sso-deployment.md).

## Next steps

Once you configure Easy Metrics Auth0 Connector you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).
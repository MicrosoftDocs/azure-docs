---
title: Azure Active Directory SSO integration with Exterro Legal GRC Software Platform
description: Learn how to configure single sign-on between Azure Active Directory and Exterro Legal GRC Software Platform.
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

# Azure Active Directory SSO integration with Exterro Legal GRC Software Platform

In this article, you'll learn how to integrate Exterro Legal GRC Software Platform with Azure Active Directory (Azure AD). The Exterro Platform unifies all of Exterro's E-Discovery and Information Governance solutions, giving you the ability to easily add new Exterro applications as your business needs expand. When you integrate Exterro Legal GRC Software Platform with Azure AD, you can:

* Control in Azure AD who has access to Exterro Legal GRC Software Platform.
* Enable your users to be automatically signed-in to Exterro Legal GRC Software Platform with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

You'll configure and test Azure AD single sign-on for Exterro Legal GRC Software Platform in a test environment. Exterro Legal GRC Software Platform supports both **SP** and **IDP** initiated single sign-on.

## Prerequisites

To integrate Azure Active Directory with Exterro Legal GRC Software Platform, you need:

* An Azure AD user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Exterro Legal GRC Software Platform single sign-on (SSO) enabled subscription.

## Add application and assign a test user

Before you begin the process of configuring single sign-on, you need to add the Exterro Legal GRC Software Platform application from the Azure AD gallery. You need a test user account to assign to the application and test the single sign-on configuration.

### Add Exterro Legal GRC Software Platform from the Azure AD gallery

Add Exterro Legal GRC Software Platform from the Azure AD application gallery to configure single sign-on with Exterro Legal GRC Software Platform. For more information on how to add application from the gallery, see the [Quickstart: Add application from the gallery](../manage-apps/add-application-portal.md).

### Create and assign Azure AD test user

Follow the guidelines in the [create and assign a user account](../manage-apps/add-application-portal-assign-users.md) article to create a test user account in the Azure portal called B.Simon.

Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, and assign roles. The wizard also provides a link to the single sign-on configuration pane in the Azure portal. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides). 

## Configure Azure AD SSO

Complete the following steps to enable Azure AD single sign-on in the Azure portal.

1. In the Azure portal, on the **Exterro Legal GRC Software Platform** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot shows how to edit Basic SAML Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier** textbox, type a URL using the following pattern:
    `https://<tenant_id>.exterro.net/exterrosso`

    b. In the **Reply URL** textbox, type a URL using the following pattern:
    `https://<tenant_id>.exterro.net/exterrosso/saml/SSO`

1. If you want to configure **SP** initiated SSO, then perform the following step:  

    In the **Sign on URL** textbox, type a URL using one of the following patterns:

    | **Sign on URL** |
    |-------|
    | `https://<tenant_id>.exterro.net/exterrosso/saml/` |
    | `https://<tenant_id>.<domain>` |

    > [!Note]
    > These values are not the real. Update these values with the actual Identifier, Reply URL and Sign on URL. Contact [Exterro Legal GRC Software Platform Client support team](mailto:support@exterro.com) to get these values. You can also refer to the patterns shown in the Basic SAML Configuration section in the Azure portal.
    
1. On the **Set-up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

    ![Screenshot shows the Certificate download link.](common/metadataxml.png "Certificate")

1. On the **Set up Exterro Legal GRC Software Platform** section, copy the appropriate URL(s) based on your requirement.

	![Screenshot shows to copy configuration appropriate URL.](common/copy-configuration-urls.png "Metadata")

## Configure Exterro Legal GRC Software Platform SSO

To configure single sign-on on **Exterro Legal GRC Software Platform** side, you need to send the downloaded **Federation Metadata XML** and appropriate copied URLs from Azure portal to [Exterro Legal GRC Software Platform support team](mailto:support@exterro.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Exterro Legal GRC Software Platform test user

In this section, you create a user called Britta Simon at Exterro Legal GRC Software Platform. Work with [Exterro Legal GRC Software Platform support team](mailto:support@exterro.com) to add the users in the Exterro Legal GRC Software Platform platform. Users must be created and activated before you use single sign-on.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application** in Azure portal. This will redirect to Exterro Legal GRC Software Platform Sign-on URL where you can initiate the login flow.  

* Go to Exterro Legal GRC Software Platform Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application** in Azure portal and you should be automatically signed in to the Exterro Legal GRC Software Platform for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the Exterro Legal GRC Software Platform tile in the My Apps, if configured in SP mode you would be redirected to the application sign-on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the Exterro Legal GRC Software Platform for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Additional resources

* [What is single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)
* [Plan a single sign-on deployment](../manage-apps/plan-sso-deployment.md).

## Next steps

Once you configure Exterro Legal GRC Software Platform you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).
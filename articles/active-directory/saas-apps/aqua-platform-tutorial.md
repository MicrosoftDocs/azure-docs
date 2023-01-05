---
title: Azure Active Directory SSO integration with Aqua Platform
description: Learn how to configure single sign-on between Azure Active Directory and Aqua Platform.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: how-to
ms.date: 12/26/2022
ms.author: jeedes

---

# Azure Active Directory SSO integration with Aqua Platform

In this article, you'll learn how to integrate Aqua Platform with Azure Active Directory (Azure AD). Aqua Platform enables customers to securely build, scale and automate cloud native applications. When you integrate Aqua Platform with Azure AD, you can:

* Control in Azure AD who has access to Aqua Platform.
* Enable your users to be automatically signed-in to Aqua Platform with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

You'll configure and test Azure AD single sign-on for Aqua Platform in a test environment. Aqua Platform supports only **SP** initiated single sign-on.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Prerequisites

To integrate Azure Active Directory with Aqua Platform, you need:

* An Azure AD user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Aqua Platform single sign-on (SSO) enabled subscription.

## Add application and assign a test user

Before you begin the process of configuring single sign-on, you need to add the Aqua Platform application from the Azure AD gallery. You need a test user account to assign to the application and test the single sign-on configuration.

### Add Aqua Platform from the Azure AD gallery

Add Aqua Platform from the Azure AD application gallery to configure single sign-on with Aqua Platform. For more information on how to add application from the gallery, see the [Quickstart: Add application from the gallery](../manage-apps/add-application-portal.md).

### Create and assign Azure AD test user

Follow the guidelines in the [create and assign a user account](../manage-apps/add-application-portal-assign-users.md) article to create a test user account in the Azure portal called B.Simon.

Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, and assign roles. The wizard also provides a link to the single sign-on configuration pane in the Azure portal. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides). 

## Configure Azure AD SSO

Complete the following steps to enable Azure AD single sign-on in the Azure portal.

1. In the Azure portal, on the **Aqua Platform** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot shows how to edit Basic SAML Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier** textbox, type one of the following values:

    | Environment | URL |
    |---------|---------|
    | us-east-1 |`urn:amazon:cognito:sp:us-east-1_voZ9dTvpW` |
    | Asia-1 |`urn:amazon:cognito:sp:ap-southeast-1_7AUN22FiF` |
    | EU-1 | `urn:amazon:cognito:sp:eu-central-1_RAierVJ6g` |
    | ASIA-2 | `urn:amazon:cognito:sp:ap-northeast-2_n4Oo1PAlV` |

    b. In the **Reply URL** textbox, type one of the following URLs:

    | Environment | URL |
    |---------|---------|
    | us-east-1 |`https://cloudsploit.auth.us-east-1.amazoncognito.com/saml2/idpresponse` |
    | Asia-1 | `https://auth-sg-prod.auth.ap-southeast-1.amazoncognito.com/saml2/idpresponse` |
    | EU-1 | `https://auth-eu-prod.auth.eu-central-1.amazoncognito.com/saml2/idpresponse` |
    | ASIA-2 | `https://auth-kr-prod.auth.ap-northeast-2.amazoncognito.com/saml2/idpresponse` |

    c. In the **Sign on URL** textbox, type the URL:
    `https://cloud.aquasec.com/sso`

1. Aqua Platform application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

    ![Screenshot shows the image of token attributes.](common/default-attributes.png "Image")

1. In addition to above, Aqua Platform application expects few more attributes to be passed back in SAML response, which are shown below. These attributes are also pre populated but you can review them as per your requirements.

    | Name | Source Attribute|
    | ------------ | --------- |
    | cspmgroups | user.department |
    | groups | user.groups |

1. On the **Set-up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

    ![Screenshot shows the Certificate download link.](common/metadataxml.png "Certificate")

1. On the **Set up Aqua Platform** section, copy the appropriate URL(s) based on your requirement.

	![Screenshot shows to copy configuration appropriate URL.](common/copy-configuration-urls.png "Metadata")

## Configure Aqua Platform SSO

To configure single sign-on on **Aqua Platform** side, you need to send the downloaded **Federation Metadata XML** and appropriate copied URLs from Azure portal to [Aqua Platform support team](mailto:support@aquasec.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Aqua Platform test user

In this section, you create a user called Britta Simon in Aqua Platform. Work with [Aqua Platform support team](mailto:support@aquasec.com) to add the users in the Aqua Platform platform. Users must be created and activated before you use single sign-on.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

* Click on **Test this application** in Azure portal. This will redirect to Aqua Platform Sign-on URL where you can initiate the login flow. 

* Go to Aqua Platform Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Aqua Platform tile in the My Apps, this will redirect to Aqua Platform Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Additional resources

* [What is single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)
* [Plan a single sign-on deployment](../manage-apps/plan-sso-deployment.md).

## Next steps

Once you configure Aqua Platform you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).
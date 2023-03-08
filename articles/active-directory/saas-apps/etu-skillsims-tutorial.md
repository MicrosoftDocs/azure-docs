---
title: Azure Active Directory SSO integration with ETU Skillsims
description: Learn how to configure single sign-on between Azure Active Directory and ETU Skillsims.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: how-to
ms.date: 12/14/2022
ms.author: jeedes

---

# Azure Active Directory SSO integration with ETU Skillsims

In this article, you'll learn how to integrate ETU Skillsims with Azure Active Directory (Azure AD). ETU Learning Simulation Platform SAML SSO launch for Azure AD users. Users are managed on ETU using SAML attributes. ETU enables immersive learning and simulation-based training at scale. When you integrate ETU Skillsims with Azure AD, you can:

* Control in Azure AD who has access to ETU Skillsims.
* Enable your users to be automatically signed-in to ETU Skillsims with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

You'll configure and test Azure AD single sign-on for ETU Skillsims in a test environment. ETU Skillsims supports both **SP** and **IDP** initiated single sign-on and also supports **Just In Time** user provisioning..

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Prerequisites

To integrate Azure Active Directory with ETU Skillsims, you need:

* An Azure AD user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* ETU Skillsims single sign-on (SSO) enabled subscription.

## Add application and assign a test user

Before you begin the process of configuring single sign-on, you need to add the ETU Skillsims application from the Azure AD gallery. You need a test user account to assign to the application and test the single sign-on configuration.

### Add ETU Skillsims from the Azure AD gallery

Add ETU Skillsims from the Azure AD application gallery to configure single sign-on with ETU Skillsims. For more information on how to add application from the gallery, see the [Quickstart: Add application from the gallery](../manage-apps/add-application-portal.md).

### Create and assign Azure AD test user

Follow the guidelines in the [create and assign a user account](../manage-apps/add-application-portal-assign-users.md) article to create a test user account in the Azure portal called B.Simon.

Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, and assign roles. The wizard also provides a link to the single sign-on configuration pane in the Azure portal. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides). 

## Configure Azure AD SSO

Complete the following steps to enable Azure AD single sign-on in the Azure portal.

1. In the Azure portal, on the **ETU Skillsims** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot shows how to edit Basic SAML Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier** textbox, type the URL:
    `https://etu.skillsims.com/saml`

    b. In the **Reply URL** textbox, type a URL using the following pattern:
    `https://<CustomerName>.skillsims.com/etu_saml/saml/SSO`

1. If you want to configure **SP** initiated SSO, then perform the following step:  

    In the **Sign on URL** textbox, type a URL using one of the following patterns:

    | **Sign on URL** |
    |-------|
    | `https://<CustomerName>.skillsims.com/etu_saml/etuSaml.do` |
    | `https://<CustomerName>.skillsims.com/etu_saml/etuSaml.do?sid=<SimulationUID>` |

    > [!Note]
    > These values are not the real. Update these values with the actual Reply URL and Sign on URL. Contact [ETU Skillsims Client support team](mailto:developers@etu.co) to get these values. You can also refer to the patterns shown in the Basic SAML Configuration section in the Azure portal.

1. ETU Skillsims application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

	![Screenshot shows the image of attributes configuration.](common/default-attributes.png "Image")

1. In addition to above, ETU Skillsims application expects few more attributes to be passed back in SAML response which are shown below. These attributes are also pre populated but you can review them as per your requirements.

	| Name |  Source Attribute|
	| ---------------|  --------- |
    | employeeid | user.employeeid |
    
1. On the **Set-up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

    ![Screenshot shows the Certificate download link.](common/metadataxml.png "Certificate")

1. On the **Set up ETU Skillsims** section, copy the appropriate URL(s) based on your requirement.

	![Screenshot shows to copy configuration appropriate URL.](common/copy-configuration-urls.png "Metadata")

## Configure ETU Skillsims SSO

To configure single sign-on on **ETU Skillsims** side, you need to send the downloaded **Federation Metadata XML** and appropriate copied URLs from Azure portal to [ETU Skillsims support team](mailto:developers@etu.co). They set this setting to have the SAML SSO connection set properly on both sides.

### Create ETU Skillsims test user

In this section, a user called B.Simon is created in ETU Skillsims. ETU Skillsims supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in ETU Skillsims, a new one is created after authentication.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application** in Azure portal. This will redirect to ETU Skillsims Sign-on URL where you can initiate the login flow.  

* Go to ETU Skillsims Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application** in Azure portal and you should be automatically signed in to the ETU Skillsims for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the ETU Skillsims tile in the My Apps, if configured in SP mode you would be redirected to the application sign-on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the ETU Skillsims for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Additional resources

* [What is single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)
* [Plan a single sign-on deployment](../manage-apps/plan-sso-deployment.md).

## Next steps

Once you configure ETU Skillsims you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).
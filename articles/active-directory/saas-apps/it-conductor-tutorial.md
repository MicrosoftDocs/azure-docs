---
title: Azure Active Directory SSO integration with IT-Conductor
description: Learn how to configure single sign-on between Azure Active Directory and IT-Conductor.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: how-to
ms.date: 02/06/2023
ms.author: jeedes

---

# Azure Active Directory SSO integration with IT-Conductor

In this article, you'll learn how to integrate IT-Conductor with Azure Active Directory (Azure AD). IT-Conductor is a Software-as-a-Service automation platform for remote agentless monitoring, performance management and IT operations. When you integrate IT-Conductor with Azure AD, you can:

* Control in Azure AD who has access to IT-Conductor.
* Enable your users to be automatically signed-in to IT-Conductor with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

You'll configure and test Azure AD single sign-on for IT-Conductor in a test environment. IT-Conductor supports **IDP** initiated single sign-on and **Just In Time** user provisioning.

## Prerequisites

To integrate Azure Active Directory with IT-Conductor, you need:

* An Azure AD user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* IT-Conductor single sign-on (SSO) enabled subscription.

## Add application and assign a test user

Before you begin the process of configuring single sign-on, you need to add the IT-Conductor application from the Azure AD gallery. You need a test user account to assign to the application and test the single sign-on configuration.

### Add IT-Conductor from the Azure AD gallery

Add IT-Conductor from the Azure AD application gallery to configure single sign-on with IT-Conductor. For more information on how to add application from the gallery, see the [Quickstart: Add application from the gallery](../manage-apps/add-application-portal.md).

### Create and assign Azure AD test user

Follow the guidelines in the [create and assign a user account](../manage-apps/add-application-portal-assign-users.md) article to create a test user account in the Azure portal called B.Simon.

Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, and assign roles. The wizard also provides a link to the single sign-on configuration pane in the Azure portal. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides). 

## Configure Azure AD SSO

Complete the following steps to enable Azure AD single sign-on in the Azure portal.

1. In the Azure portal, on the **IT-Conductor** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot shows how to edit Basic SAML Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, the user does not have to perform any step as the app is already pre-integrated with Azure.

1. IT-Conductor application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

	![Screenshot shows the image of attributes configuration.](common/default-attributes.png "Image")

1. In addition to above, IT-Conductor application expects few more attributes to be passed back in SAML response, which are shown below. These attributes are also pre populated but you can review them as per your requirements.

	| Name |  Source Attribute|
	| ---------------|  --------- |
    | PERSON_Email | user.mail |
	| OBJECT_Name | user.userprincipalname |
	| PERSON_FirstName | user.givenname |
	| PERSON_LastName | user.surname |

1. On the **Set-up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

    ![Screenshot shows the Certificate download link.](common/metadataxml.png "Certificate")

1. On the **Set up IT-Conductor** section, copy the appropriate URL(s) based on your requirement.

	![Screenshot shows to copy configuration appropriate URL.](common/copy-configuration-urls.png "Metadata")

## Configure IT-Conductor SSO

To configure single sign-on on **IT-Conductor** side, you need to send the downloaded **Federation Metadata XML** and appropriate copied URLs from Azure portal to [IT-Conductor support team](mailto:support@itconductor.com). They set this setting to have the SAML SSO connection set properly on both sides. For more information, please refer [this](https://docs.itconductor.com/start-here/sso-setup) link.

### Create IT-Conductor test user

In this section, a user called B.Simon is created in IT-Conductor. IT-Conductor supports just-in-time user provisioning, which is enabled by default. There's no action item for you in this section. If a user doesn't already exist in IT-Conductor, a new one is commonly created after authentication.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options.

* Click on Test this application in Azure portal and you should be automatically signed in to the IT-Conductor for which you set up the SSO.

* You can use Microsoft My Apps. When you click the IT-Conductor tile in the My Apps, you should be automatically signed in to the IT-Conductor for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Additional resources

* [What is single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)
* [Plan a single sign-on deployment](../manage-apps/plan-sso-deployment.md).

## Next steps

Once you configure IT-Conductor you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).

---
title: Azure Active Directory SSO integration with Udemy Business SAML
description: Learn how to configure single sign-on between Azure Active Directory and Udemy Business SAML.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: how-to
ms.date: 02/16/2023
ms.author: jeedes

---

# Azure Active Directory SSO integration with Udemy Business SAML

In this article, you learn how to integrate Udemy Business SAML with Azure Active Directory (Azure AD). Udemy for Business helps employees do whatever comes next - whether that’s the next project to tackle, skill to learn or role to master. When you integrate Udemy Business SAML with Azure AD, you can:

* Control in Azure AD who has access to Udemy Business SAML.
* Enable your users to be automatically signed-in to Udemy Business SAML with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

You'll configure and test Azure AD single sign-on for Udemy Business SAML in a test environment. Udemy Business SAML supports **SP** initiated single sign-on and **Just In Time** user provisioning.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Prerequisites

To integrate Azure Active Directory with Udemy Business SAML, you need:

* An Azure AD user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Udemy Business SAML single sign-on (SSO) enabled subscription.

## Add application and assign a test user

Before you begin the process of configuring single sign-on, you need to add the Udemy Business SAML application from the Azure AD gallery. You need a test user account to assign to the application and test the single sign-on configuration.

### Add Udemy Business SAML from the Azure AD gallery

Add Udemy Business SAML from the Azure AD application gallery to configure single sign-on with Udemy Business SAML. For more information on how to add application from the gallery, see the [Quickstart: Add application from the gallery](../manage-apps/add-application-portal.md).

### Create and assign Azure AD test user

Follow the guidelines in the [create and assign a user account](../manage-apps/add-application-portal-assign-users.md) article to create a test user account in the Azure portal called B.Simon.

Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, and assign roles. The wizard also provides a link to the single sign-on configuration pane in the Azure portal. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides). 

## Configure Azure AD SSO

Complete the following steps to enable Azure AD single sign-on in the Azure portal.

1. In the Azure portal, on the **Udemy Business SAML** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot shows how to edit Basic SAML Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier** textbox, type the URL:
	`https://www.udemy.com/sso/saml`

	b. In the **Reply URL** textbox, type the URL:
	`https://sso.connect.pingidentity.com/sso/sp/ACS.saml2`

	c. In the **Sign on URL** textbox, type a URL using the following pattern:
	`https://<SUBDOMAIN>.udemy.com`

	> [!Note]
    > This value is not real. Update this value with the actual Sign-on URL. Contact [Udemy Business SAML Client support team](mailto:ufbsupport@udemy.com) to get the value. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. Udemy Business SAML application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

	![Screenshot shows the image of attributes configuration.](common/default-attributes.png "Image")

1. In addition to above, Udemy Business SAML application expects few more attributes to be passed back in SAML response, which are shown below. These attributes are also pre populated but you can review them as per your requirements.

	| Name |  Source Attribute|
	| ---------------|  --------- |
    | email | user.mail |
	| firstName | user.givenname |
	| lastName | user.surname |

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section, click copy button to copy **App Federation Metadata Url** and save it on your computer.

	![Screenshot shows the Certificate download link.](common/copy-metadataurl.png "Certificate")

## Configure Udemy Business SAML SSO

To configure single sign-on on **Udemy Business SAML** side, you need to send the **App Federation Metadata Url** to [Udemy Business SAML support team](mailto:ufbsupport@udemy.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Udemy Business SAML test user

In this section, a user called B.Simon is created in Udemy Business SAML. Udemy Business SAML supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in Udemy Business SAML, a new one is created after authentication.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

* Click on **Test this application** in Azure portal. This will redirect to Udemy Business SAML Sign-on URL where you can initiate the login flow. 

* Go to Udemy Business SAML Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Udemy Business SAML tile in the My Apps, this will redirect to Udemy Business SAML Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Additional resources

* [What is single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)
* [Plan a single sign-on deployment](../manage-apps/plan-sso-deployment.md).

## Next steps

Once you configure Udemy Business SAML you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).
---
title: Azure Active Directory SSO integration with Signiant Media Shuttle
description: Learn how to configure single sign-on between Azure Active Directory and Signiant Media Shuttle.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: how-to
ms.date: 03/29/2023
ms.author: jeedes

---

# Azure Active Directory SSO integration with Signiant Media Shuttle

In this article, you learn how to integrate Signiant Media Shuttle with Azure Active Directory (Azure AD). Media Shuttle is a solution for securely moving large files and data sets to, and from, cloud-based or on-premises storage. Transfers are accelerated and can be up to hundreds of times faster than FTP. 

When you integrate Signiant Media Shuttle with Azure AD, you can:

* Control in Azure AD who has access to Signiant Media Shuttle.
* Enable your users to be automatically signed-in to Signiant Media Shuttle with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

You must configure and test Azure AD single sign-on for Signiant Media Shuttle in a test environment. Signiant Media Shuttle supports **SP** initiated single sign-on and **Just In Time** user provisioning.

## Prerequisites

To integrate Azure Active Directory with Signiant Media Shuttle, you need:

* An Azure AD user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* A Signiant Media Shuttle subscription with a SAML Web SSO license, and access to the IT and Operations Administration Consoles.

## Add application and assign a test user

Before you begin the process of configuring single sign-on, you need to add the Signiant Media Shuttle application from the Azure AD gallery. You need a test user account to assign to the application and test the single sign-on configuration.

### Add Signiant Media Shuttle from the Azure AD gallery

Add Signiant Media Shuttle from the Azure AD application gallery to configure single sign-on for Signiant Media Shuttle. For more information on how to add application from the gallery, see the [Quickstart: Add application from the gallery](../manage-apps/add-application-portal.md).

### Create and assign Azure AD test user

Follow the guidelines in the [create and assign a user account](../manage-apps/add-application-portal-assign-users.md) article to create a test user account in the Azure portal called B.Simon.

You can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, and assign roles. The wizard also provides a link to the single sign-on configuration pane in the Azure portal. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides). 

## Configure Azure AD SSO

Complete the following steps to enable Azure AD single sign-on in the Azure portal.

1. In the Azure portal, on the **Signiant Media Shuttle** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot shows how to edit Basic SAML Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, perform the following steps:

	a. In the **Identifier** textbox, type a value or URL using one of the following patterns:

   | **Configuration Type** | **Identifier**  |
   | ----------------- | ----------------- |
   | Account Level  | `mediashuttle` |
   | Portal Level  | `https://<PORTALNAME>.mediashuttle.com` |

	b. In the **Reply URL** textbox, type a URL using one of the following patterns:

   | **Configuration Type** | **Reply URL**  |
   | ----------------- | ----------------- |
   | Account Level |`https://portals.mediashuttle.com.auth` |
   | Portal Level | `https://<PORTALNAME>.mediashuttle.com/auth`|

   c. In the **Sign on URL** textbox, type a URL using one of the following patterns:

   | **Configuration Type** | **Sign on URL** |
   | ---------------------- | ----------------- |
   | Account Level | `https://portals.mediashuttle.com/auth` |
   | Portal Level | `https://<PORTALNAME>.mediashuttle.com/auth` |

	> [!Note]
    > These values are not real. Update these values with the actual Identifier, Reply URL and Sign on URL. Contact [Signiant Media Shuttle support team](mailto:support@signiant.com) to get these values. You can also refer to the patterns shown in the Basic SAML Configuration section in the Azure portal.

1. Your Signiant Media Shuttle application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows an example. The default value of **Unique User Identifier** is **user.userprincipalname** but Signiant Media Shuttle expects to be mapped with the user's email address. For that you can use **user.mail** attribute from the list or use the appropriate attribute value based on your organization configuration.

	![Screenshot shows the image of attributes configuration.](common/default-attributes.png "Image")

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section, click copy button to copy **App Federation Metadata Url** and save it on your computer.

    ![Screenshot shows the Certificate download link.](common/copy-metadataurl.png "Certificate")

## Configure Signiant Media Shuttle SSO

Once you have the **App Federation Metadata Url**, sign in to the Media Shuttle IT Administration Console.

To add Azure AD Metadata in Media Shuttle:

1. Log into your IT Administration Console.

2. On the Security page, in the Identity Provider Metadata field, paste the **App Federation Metadata Url** which you've copied from the Azure portal.

3. Click **Save**.

Once you have set up Azure AD for Media Shuttle, assigned users and groups can sign in to Media Shuttle portals through single sign-on using Azure AD authentication.

### Create Signiant Media Shuttle test user

In this section, a user called Britta Simon is created in Signiant Media Shuttle. Signiant Media Shuttle supports just-in-time user provisioning, which is enabled by default. There's no action item for you in this section. If a user doesn't already exist in Signiant Media Shuttle, a new one is created after authentication.

If **Auto-add SAML authenticated members to this portal** is not enabled as part of the SAML configuration, you must add users through the **Portal Administration** console at `https://<PORTALNAME>.mediashuttle.com/admin`.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

* Click on **Test this application** in Azure portal. This will redirect to Signiant Media Shuttle Sign-on URL where you can initiate the login flow. 

* Go to Signiant Media Shuttle Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Signiant Media Shuttle tile in the My Apps, this will redirect to Signiant Media Shuttle Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Additional resources

* [What is single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)
* [Plan a single sign-on deployment](../manage-apps/plan-sso-deployment.md).

## Next steps

Once you configure Signiant Media Shuttle you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).
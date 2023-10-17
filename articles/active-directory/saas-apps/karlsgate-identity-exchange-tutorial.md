---
title: Microsoft Entra SSO integration with Karlsgate Identity Exchange (KIE)
description: Learn how to configure single sign-on between Microsoft Entra ID and Karlsgate Identity Exchange (KIE).
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: how-to
ms.date: 03/02/2023
ms.author: jeedes

---

# Microsoft Entra SSO integration with Karlsgate Identity Exchange (KIE)

In this article, you learn how to integrate the Karlsgate Identity Exchange (KIE) with Microsoft Entra ID. Karlsgate provides Privacy Enhancing Technology for protecting data at rest, in transit, & in use. Karlsgate’s zero-trust approach allows the free flow of insights while maintaining custody of sensitive data. When you integrate Karlsgate Identity Exchange (KIE) with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to Karlsgate Identity Exchange (KIE).
* Enable your users to be automatically signed-in to Karlsgate Identity Exchange (KIE) with their Microsoft Entra accounts.
* Manage your accounts in one central location.

You'll configure and test Microsoft Entra single sign-on for Karlsgate Identity Exchange (KIE) in a test environment. Karlsgate Identity Exchange (KIE) supports **SP** and **IDP** initiated single sign-on.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Prerequisites

To integrate Microsoft Entra ID with Karlsgate Identity Exchange (KIE), you need:

* A Microsoft Entra user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* An existing Karlsgate Identity Exchange (KIE) single sign-on (SSO) eligible account.

* At least one (1) user created in your Karlsgate Identity Exchange (KIE) account.

> [!NOTE] 
> To be eligible for single sign-on (SSO) access for your Karlsgate Identity Exchange (KIE) account, your KIE account must have an SSO eligible subscription. If you have questions, please contact the [Karlsgate Identity Exchange (KIE) support team](mailto:help@karlsgate.com).

## Add application and assign a test user

Before you begin the process of configuring single sign-on, you need to add the Karlsgate Identity Exchange (KIE) application from the Microsoft Entra gallery. You need a test user account to assign to the application and test the single sign-on configuration.

<a name='add-karlsgate-identity-exchange-kie-from-the-azure-ad-gallery'></a>

### Add Karlsgate Identity Exchange (KIE) from the Microsoft Entra gallery

Add Karlsgate Identity Exchange (KIE) from the Microsoft Entra application gallery to configure single sign-on with Karlsgate Identity Exchange (KIE). For more information on how to add application from the gallery, see the [Quickstart: Add application from the gallery](../manage-apps/add-application-portal.md).

<a name='create-and-assign-azure-ad-test-user'></a>

### Create and assign Microsoft Entra test user

Follow the guidelines in the [create and assign a user account](../manage-apps/add-application-portal-assign-users.md) article to create a test user account called B.Simon.

Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, and assign roles. The wizard also provides a link to the single sign-on configuration pane. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides). 

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Complete the following steps to enable Microsoft Entra single sign-on.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Karlsgate Identity Exchange (KIE)** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot shows how to edit Basic SAML Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section,  the user does not have to perform any step as the app is already pre-integrated with Azure.

1. If you wish to configure the application in **SP** initiated mode, then perform the following step:

    In the **Sign on URL** textbox, type the URL:
    `https://portal.karlsgate.com/Identity/Account/Login`

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section, click copy button to copy **App Federation Metadata Url** and save it on your computer.

    ![Screenshot shows the Certificate download link.](common/copy-metadataurl.png "Certificate")

## Configure Karlsgate Identity Exchange (KIE) SSO

To configure single sign-on on the **Karlsgate Identity Exchange (KIE)** side, you must send the following information to the [Karlsgate Identity Exchange (KIE) support team](mailto:help@karlsgate.com).

1. Your KIE account’s configured, non-blank **Public name plate** (as a secondary confirmation of your KIE account) this value is available at: `https://portal.karlsgate.com/Profile/Edit`.

1. Your configured **Identifier (Entity ID)** (to confirm your configured value).

1. Your configured **App Federation Metadata Url**.

1. A list of one (or more) **email domain(s)** (min. 1) for users who will be accessing the Karlsgate Identity Exchange (KIE), e.g: northwind.com, de.contoso.com, fr.contoso.com, etc. (See note below.)

    > [!NOTE] 
    > Many organizations have one (1) email domain configured for their users. For example, at the fictitious company Northwind, the user "jane.smith@northwind.com" has an email domain of "northwind.com". Some organizations have multiple (2+) email domains configured for their users. For example, at the fictitious company Contoso, the user "erika.mustermann@de.contoso.com" has an email domain of "de.contoso.com", while the user "jean.dupont@fr.contoso.com" has an email domain of "fr.contoso.com".

1. The Karlsgate Identity Exchange (KIE) support team will use these settings to configure the Karlsgate Identity Exchange (KIE) application for SAML SSO access.

> [!NOTE]
> You must have an existing KIE account with an SSO eligible subscription to configure SAML SSO access. For SSO access, a KIE user’s email address must match their Microsoft Entra ID email address.

If you have questions, please contact the [Karlsgate Identity Exchange (KIE) support team](mailto:help@karlsgate.com).

### Create Karlsgate Identity Exchange (KIE) test user

Work with [Karlsgate Identity Exchange (KIE) support team](mailto:help@karlsgate.com) to create a KIE account and add users to your KIE account.

> [!NOTE] 
> For SSO access, a KIE user’s email address must match their Microsoft Entra ID email address.

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

#### SP initiated:

1. Click on **Test this application**, this will redirect to Karlsgate Identity Exchange (KIE) Sign-on URL where you can initiate the login flow.  

1. Go to Karlsgate Identity Exchange (KIE) Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

1. Click on **Test this application**, and you should be automatically signed in to the Karlsgate Identity Exchange (KIE) for which you set up the SSO. 

1. You can also use Microsoft My Apps to test the application in any mode. When you click the Karlsgate Identity Exchange (KIE) tile in the My Apps, if configured in SP mode you would be redirected to the application sign-on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the Karlsgate Identity Exchange (KIE) for which you set up the SSO. For more information, see [Microsoft Entra My Apps](/azure/active-directory/manage-apps/end-user-experiences#azure-ad-my-apps).

## Additional resources

* [What is single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)
* [Plan a single sign-on deployment](../manage-apps/plan-sso-deployment.md).

## Next steps

Once you configure Karlsgate Identity Exchange (KIE) you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).

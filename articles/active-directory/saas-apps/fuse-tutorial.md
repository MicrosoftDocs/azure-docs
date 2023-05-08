---
title: Azure Active Directory integration with Fuse
description: Learn how to configure single sign-on between Azure Active Directory and Fuse.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: how-to
ms.date: 3/10/2023
ms.author: jeedes
---
# Azure Active Directory integration with Fuse

In this article, you'll learn how to integrate Fuse with Azure Active Directory (Azure AD). Fuse is a learning platform that enables learners within an organization to access the necessary knowledge and expertise they need to improve their skills at work. When you integrate Fuse with Azure AD, you can:

- Control in Azure AD who has access to Fuse.
- Enable your users to be automatically signed-in to Fuse with their Azure AD accounts.
- Manage your accounts in one central location - the Azure portal.

You'll configure and test Azure AD single sign-on for Fuse in a test environment. Fuse supports **SP** initiated single sign-on. 

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.


## Prerequisites

To integrate Azure Active Directory with Fuse, you need:

- An Azure AD user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
- An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
- Fuse single sign-on (SSO) enabled subscription.

## Add application and assign a test user

Before you begin the process of configuring single sign-on, you need to add the Fuse application from the Azure AD gallery. You need a test user account to assign to the application and test the single sign-on configuration.

### Add Fuse from the Azure AD gallery

Add Fuse from the Azure AD application gallery to configure single sign-on with Fuse. For more information on how to add application from the gallery, see the [Quickstart: Add application from the gallery](../manage-apps/add-application-portal.md).

### Create and assign Azure AD test user

Follow the guidelines in the [create and assign a user account](../manage-apps/add-application-portal-assign-users.md) article to create a test user account in the Azure portal called B.Simon.

Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, and assign roles. The wizard also provides a link to the single sign-on configuration pane in the Azure portal. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides). 

## Configure Azure AD single sign-on

Complete the following steps to enable Azure AD single sign-on in the Azure portal.

1. In the Azure portal, on the **Fuse** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, in the **Sign-on URL** text box, the appropriate URL using the following pattern:
    `https://{tenantname}.fuseuniversal.com/`

	> [!NOTE]
	> The value is not real. Update the value with the actual Sign-On URL. Contact [Fuse Client support team](mailto:support@fusion-universal.com) to get the value. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, select **Download** to download the **Certificate (Base64)** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. On the **Set up Fuse** section, copy the appropriate URL(s) as per your requirement.

## Configure Fuse single sign-on

To configure single sign-on on **Fuse** side, send the downloaded **Certificate (Base64)** and the copied URLs from Azure portal to [Fuse support team](mailto:support@fusion-universal.com). The support team will use the copied URLs to configure the single sign-on on the application.

### Create Fuse test user

To be able to test and use single sign-on, you have to create and activate users in the fuse application.

In this section, you create a user called Britta Simon in Fuse that corresponds with the Azure AD user you already created in the previous section. Work with [Fuse support team](mailto:support@fusion-universal.com) to add the user in the Fuse platform.

## Test single sign-on

In this section, you test your Azure AD single sign-on configuration with the following options. 

- In the **Test single sign-on with Fuse** section on the **SAML-based Sign-on** pane, select **Test this application** in Azure portal. You'll be redirected to Fuse Sign-on URL where you can initiate the sign-in flow.
- Go to Fuse Sign-on URL directly and initiate the sign-in flow from application's side.
- You can use Microsoft My Apps. When you select the Fuse tile in the My Apps, you'll be redirected to Fuse Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Additional resources

- [What is single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)
- [Plan a single sign-on deployment](../manage-apps/plan-sso-deployment.md)
## Next steps

Once you configure Fuse you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).

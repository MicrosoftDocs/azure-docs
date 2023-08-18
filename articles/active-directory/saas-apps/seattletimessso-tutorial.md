---
title: Azure Active Directory SSO integration with SeattleTimesSSO
description: Learn how to configure single sign-on between Azure Active Directory and SeattleTimesSSO.
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

# Azure Active Directory SSO integration with SeattleTimesSSO

In this article, you learn how to integrate SeattleTimesSSO with Azure Active Directory (Azure AD). This is the Institutional Subscription SSO for The Seattle Times. When you integrate SeattleTimesSSO with Azure AD, you can:

* Control in Azure AD who has access to SeattleTimesSSO.
* Enable your users to be automatically signed-in to SeattleTimesSSO with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

You configure and test Azure AD single sign-on for SeattleTimesSSO in a test environment. SeattleTimesSSO supports **IDP** initiated single sign-on.

## Prerequisites

To integrate Azure Active Directory with SeattleTimesSSO, you need:

* An Azure AD user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* SeattleTimesSSO single sign-on (SSO) enabled subscription.

## Add application and assign a test user

Before you begin the process of configuring single sign-on, you need to add the SeattleTimesSSO application from the Azure AD gallery. You need a test user account to assign to the application and test the single sign-on configuration.

### Add SeattleTimesSSO from the Azure AD gallery

Add SeattleTimesSSO from the Azure AD application gallery to configure single sign-on with SeattleTimesSSO. For more information on how to add application from the gallery, see the [Quickstart: Add application from the gallery](../manage-apps/add-application-portal.md).

### Create and assign Azure AD test user

Follow the guidelines in the [create and assign a user account](../manage-apps/add-application-portal-assign-users.md) article to create a test user account in the Azure portal called B.Simon.

Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, and assign roles. The wizard also provides a link to the single sign-on configuration pane in the Azure portal. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides). 

## Configure Azure AD SSO

Complete the following steps to enable Azure AD single sign-on in the Azure portal.

1. In the Azure portal, on the **SeattleTimesSSO** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot shows how to edit Basic SAML Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, the user does not have to perform any step as the app is already pre-integrated with Azure.

1. On the **Set-up single sign-on with SAML** page, in the **SAML Signing Certificate** section, find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

    ![Screenshot shows the Certificate download link.](common/certificatebase64.png "Certificate")

1. On the **Set up SeattleTimesSSO** section, copy the appropriate URL(s) based on your requirement.

	![Screenshot shows to copy configuration appropriate URL.](common/copy-configuration-urls.png "Metadata")

## Configure SeattleTimesSSO SSO

To configure single sign-on on **SeattleTimesSSO** side, you need to send the downloaded **Certificate (Base64)** and appropriate copied URLs from Azure portal to [SeattleTimesSSO support team](mailto:it-hostingadmin@seattletimes.com). They set this setting to have the SAML SSO connection set properly on both sides

### Create SeattleTimesSSO test user

In this section, you create a user called Britta Simon in SeattleTimesSSO. Work with [SeattleTimesSSO support team](mailto:it-hostingadmin@seattletimes.com) to add the users in the SeattleTimesSSO platform. Users must be created and activated before you use single sign-on.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options.

* Click on Test this application in Azure portal and you should be automatically signed in to the SeattleTimesSSO for which you set up the SSO.

* You can use Microsoft My Apps. When you click the SeattleTimesSSO tile in the My Apps, you should be automatically signed in to the SeattleTimesSSO for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure SeattleTimesSSO you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).
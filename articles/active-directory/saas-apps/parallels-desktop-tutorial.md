---
title: Azure Active Directory SSO integration with Parallels Desktop
description: Learn how to configure single sign-on between Azure Active Directory and Parallels Desktop.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: how-to
ms.date: 02/23/2023
ms.author: jeedes

---

# Azure Active Directory SSO integration with Parallels Desktop

In this article, you'll learn how to integrate Parallels Desktop with Azure Active Directory (Azure AD). SSO/SAML authentication for employees to use Parallels Desktop. Enable your employees to sign in and activate Parallels Desktop with a corporate account. When you integrate Parallels Desktop with Azure AD, you can:

* Control in Azure AD who has access to Parallels Desktop.
* Enable your users to be automatically signed-in to Parallels Desktop with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

You'll configure and test Azure AD single sign-on for Parallels Desktop in a test environment. Parallels Desktop supports only **SP** initiated single sign-on.

## Prerequisites

To integrate Azure Active Directory with Parallels Desktop, you need:

* An Azure AD user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Parallels Desktop single sign-on (SSO) enabled subscription.

## Add application and assign a test user

Before you begin the process of configuring single sign-on, you need to add the Parallels Desktop application from the Azure AD gallery. You need a test user account to assign to the application and test the single sign-on configuration.

### Add Parallels Desktop from the Azure AD gallery

Add Parallels Desktop from the Azure AD application gallery to configure single sign-on with Parallels Desktop. For more information on how to add application from the gallery, see the [Quickstart: Add application from the gallery](../manage-apps/add-application-portal.md).

### Create and assign Azure AD test user

Follow the guidelines in the [create and assign a user account](../manage-apps/add-application-portal-assign-users.md) article to create a test user account in the Azure portal called B.Simon.

Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, and assign roles. The wizard also provides a link to the single sign-on configuration pane in the Azure portal. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides). 

## Configure Azure AD SSO

Complete the following steps to enable Azure AD single sign-on in the Azure portal.

1. In the Azure portal, on the **Parallels Desktop** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot shows how to edit Basic SAML Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier** textbox, type a URL using the following pattern:
    `https://account.parallels.com/<ID>`

    b. In the **Reply URL** textbox, type a URL using the following pattern:
    `https://account.parallels.com/webapp/sso/acs/<ID>`

    > [!NOTE]
    > These values are not real. Update these values with the actual Identifier and Reply URL. Please note the Identifier and Reply URL values are customer specific and should be able to specify it manually by copying it from Parallels My Account to the identity provider Azure. Contact [Parallels Desktop Client support team](mailto:parallels.desktop.sso@alludo.com) for any help. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

    c. In the **Sign on URL** textbox, type the URL:-
    `https://my.parallels.com/login?sso=1`

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (PEM)** and select **Download** to download the certificate and save it on your computer.

	![Screenshot of the Certificate download link.](common/certificate-base64-download.png)

1. On the **Set up Parallels Desktop** section, copy the appropriate URL(s) based on your requirement.

	![Screenshot shows to copy configuration appropriate URL.](common/copy-configuration-urls.png "Metadata")

## Configure Parallels Desktop SSO

To configure single sign-on on **Parallels Desktop** side, you need to send the downloaded **Certificate (PEM)** and appropriate copied URLs from Azure portal to [Parallels Desktop support team](mailto:parallels.desktop.sso@alludo.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Parallels Desktop test user

In this section, you create a user called Britta Simon at Parallels Desktop. Work with [Parallels Desktop support team](mailto:parallels.desktop.sso@alludo.com) to add the users in the Parallels Desktop platform. Users must be created and activated before you use single sign-on.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

* Click on **Test this application** in Azure portal. This will redirect to Parallels Desktop Sign-on URL where you can initiate the login flow. 

* Go to Parallels Desktop Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Parallels Desktop tile in the My Apps, this will redirect to Parallels Desktop Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Additional resources

* [What is single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)
* [Plan a single sign-on deployment](../manage-apps/plan-sso-deployment.md).

## Next steps

Once you configure Parallels Desktop you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).
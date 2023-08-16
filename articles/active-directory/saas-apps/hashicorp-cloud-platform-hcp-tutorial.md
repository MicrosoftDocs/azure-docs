---
title: Azure Active Directory SSO integration with HashiCorp Cloud Platform (HCP)
description: Learn how to configure single sign-on between Azure Active Directory and HashiCorp Cloud Platform (HCP).
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: how-to
ms.date: 04/19/2023
ms.author: jeedes

---

# Azure Active Directory SSO integration with HashiCorp Cloud Platform (HCP)

In this article, you learn how to integrate HashiCorp Cloud Platform (HCP) with Azure Active Directory (Azure AD). HashiCorp Cloud Platform hosting managed services of the developer tools created by HashiCorp, such Terraform, Vault, Boundary, and Consul. When you integrate HashiCorp Cloud Platform (HCP) with Azure AD, you can:

* Control in Azure AD who has access to HashiCorp Cloud Platform (HCP).
* Enable your users to be automatically signed-in to HashiCorp Cloud Platform (HCP) with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

You configure and test Azure AD single sign-on for HashiCorp Cloud Platform (HCP) in a test environment. HashiCorp Cloud Platform (HCP) supports only **SP** initiated single sign-on.

## Prerequisites

To integrate Azure Active Directory with HashiCorp Cloud Platform (HCP), you need:

* An Azure AD user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* HashiCorp Cloud Platform (HCP) single sign-on (SSO) enabled organization.

## Add application and assign a test user

Before you begin the process of configuring single sign-on, you need to add the HashiCorp Cloud Platform (HCP) application from the Azure AD gallery. You need a test user account to assign to the application and test the single sign-on configuration.

### Add HashiCorp Cloud Platform (HCP) from the Azure AD gallery

Add HashiCorp Cloud Platform (HCP) from the Azure AD application gallery to configure single sign-on with HashiCorp Cloud Platform (HCP). For more information on how to add application from the gallery, see the [Quickstart: Add application from the gallery](../manage-apps/add-application-portal.md).

### Create and assign Azure AD test user

Follow the guidelines in the [create and assign a user account](../manage-apps/add-application-portal-assign-users.md) article to create a test user account in the Azure portal called B.Simon.

Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, and assign roles. The wizard also provides a link to the single sign-on configuration pane in the Azure portal. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides). 

## Configure Azure AD SSO

Complete the following steps to enable Azure AD single sign-on in the Azure portal.

1. In the Azure portal, on the **HashiCorp Cloud Platform (HCP)** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot shows how to edit Basic SAML Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, perform the following steps:

    1. In the **Identifier** textbox, type a value using the following pattern:
    `urn:hashicorp:HCP-SSO-<HCP_ORG_ID>-samlp`

    1. In the **Reply URL** textbox, type a URL using the following pattern:
    `https://auth.hashicorp.com/login/callback?connection=HCP-SSO-<ORG_ID>-samlp`

    1. In the **Sign on URL** textbox, type a URL using the following pattern:
    `https://portal.cloud.hashicorp.com/sign-in?conn-id=HCP-SSO-<HCP_ORG_ID>-samlp`

    > [!NOTE]
    > These values are not real. Update these values with the actual Identifier, Reply URL and Sign on URL. These values are also pregenerated for you on the "Setup SAML SSO" page within your Organization settings in HashiCorp Cloud Platform (HCP). For more information SAML documentation is provided on [HashiCorp's Developer site](https://developer.hashicorp.com/hcp/docs/hcp/security/sso/sso-aad). Contact [HashiCorp Cloud Platform (HCP) Client support team](mailto:support@hashicorp.com) for any questions about this process. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. On the **Set-up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

    ![Screenshot shows the Certificate download link.](common/certificatebase64.png "Certificate")

1. On the **Set up HashiCorp Cloud Platform (HCP)** section, copy the appropriate URL(s) based on your requirement.

	![Screenshot shows to copy configuration appropriate URL.](common/copy-configuration-urls.png "Metadata")

## Configure HashiCorp Cloud Platform (HCP) SSO

To configure single sign-on on the **HashiCorp Cloud Platform (HCP)** side, you need to add a verification record TXT to your domain host, add the downloaded **Certificate (Base64)** and **Login URL** copied from Azure portal to your HashiCorp Cloud Platform (HCP) Organization "Setup SAML SSO" page. Please refer to the SAML documentation that is provided on [HashiCorp's Developer site](https://developer.hashicorp.com/hcp/docs/hcp/security/sso/sso-aad). Contact [HashiCorp Cloud Platform (HCP) Client support team](mailto:support@hashicorp.com) for any questions about this process.

## Test SSO 

In the previous [Create and assign Azure AD test user](#create-and-assign-azure-ad-test-user) section, you created a user called B.Simon and assigned it to the HashiCorp Cloud Platform (HCP) app within the Azure portal. This can now be used for testing the SSO connection. You may also use any account that is already associated with the HashiCorp Cloud Platform (HCP) app in the Azure portal. 

## Additional resources

* [What is single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)
* [Plan a single sign-on deployment](../manage-apps/plan-sso-deployment.md).
* [HashiCorp Cloud Platform (HCP) | Azure Active Directory SAML SSO Configuration](https://developer.hashicorp.com/hcp/docs/hcp/security/sso/sso-aad).

## Next steps

Once you configure HashiCorp Cloud Platform (HCP) you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).

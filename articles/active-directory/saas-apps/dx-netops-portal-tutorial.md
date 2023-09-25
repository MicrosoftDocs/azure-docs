---
title: Microsoft Entra SSO integration with DX NetOps Portal'
description: Learn how to configure single sign-on between Microsoft Entra ID and DX NetOps Portal.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: how-to
ms.date: 11/21/2022
ms.author: jeedes

---

# Microsoft Entra SSO integration with DX NetOps Portal

In this article, you'll learn how to integrate DX NetOps Portal with Microsoft Entra ID. DX NetOps Portal provides network observability, topology with fault correlation and root-cause analysis at telecom carrier level scale, over traditional and software defined networks, internal and external. When you integrate DX NetOps Portal with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to DX NetOps Portal.
* Enable your users to be automatically signed-in to DX NetOps Portal with their Microsoft Entra accounts.
* Manage your accounts in one central location.

You'll configure and test Microsoft Entra single sign-on for DX NetOps Portal in a test environment. DX NetOps Portal supports **IDP** initiated single sign-on.

## Prerequisites

To integrate Microsoft Entra ID with DX NetOps Portal, you need:

* A Microsoft Entra user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* DX NetOps Portal single sign-on (SSO) enabled subscription.

## Add application and assign a test user

Before you begin the process of configuring single sign-on, you need to add the DX NetOps Portal application from the Microsoft Entra gallery. You need a test user account to assign to the application and test the single sign-on configuration.

<a name='add-dx-netops-portal-from-the-azure-ad-gallery'></a>

### Add DX NetOps Portal from the Microsoft Entra gallery

Add DX NetOps Portal from the Microsoft Entra application gallery to configure single sign-on with DX NetOps Portal. For more information on how to add application from the gallery, see the [Quickstart: Add application from the gallery](../manage-apps/add-application-portal.md).

<a name='create-and-assign-azure-ad-test-user'></a>

### Create and assign Microsoft Entra test user

Follow the guidelines in the [create and assign a user account](../manage-apps/add-application-portal-assign-users.md) article to create a test user account called B.Simon.

Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, and assign roles. The wizard also provides a link to the single sign-on configuration pane. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides). 

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Complete the following steps to enable Microsoft Entra single sign-on.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **DX NetOps Portal** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot shows to edit Basic SAML Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier** textbox, type a value using the following pattern:
    `<DX NetOps Portal hostname>`

    b. In the **Reply URL** textbox, type a URL using the following pattern:
    `https://<DX NetOps Portal FQDN>:<SSO port>/sso/saml2/UserAssertionService`

    c. In the **Relay State** textbox, type a URL using the following pattern:
    `SsoProductCode=pc&SsoRedirectUrl=https://<DX NetOps Portal FQDN>:<https port>/pc/desktop/page`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier, Reply URL and Relay State URL. Contact [DX NetOps Portal Client support team](https://support.broadcom.com/web/ecx/contact-support) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section.

1. Your DX NetOps Portal application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows an example for this. The default value of **Unique User Identifier** is **user.userprincipalname** but DX NetOps Portal expects this to be mapped with the user's email address. For that you can use **user.mail** attribute from the list or use the appropriate attribute value based on your organization configuration.

    ![Screenshot shows the image of attributes configuration.](common/default-attributes.png "Attributes")

1. On the **Set-up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

	![Screenshot shows the Certificate download link.](common/metadataxml.png "Certificate")

1. On the **Set up DX NetOps Portal** section, copy the appropriate URL(s) as per your requirement.

	![Screenshot shows to copy configuration appropriate URL.](common/copy-configuration-urls.png "Metadata")

## Configure DX NetOps Portal SSO

To configure single sign-on on **DX NetOps Portal** side, you need to send the downloaded **Federation Metadata XML** and appropriate copied URLs from the application configuration to [DX NetOps Portal support team](https://support.broadcom.com/web/ecx/contact-support). The support team will use the copied URLs to configure the single sign-on on the application.

### Create DX NetOps Portal test user

To be able to test and use single sign-on, you have to create and activate users in the DX NetOps Portal application.

In this section, you create a user called Britta Simon in DX NetOps Portal that corresponds with the Microsoft Entra user you already created in the previous section. Work with [DX NetOps Portal support team](https://support.broadcom.com/web/ecx/contact-support) to add the user in the DX NetOps Portal platform.

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options.

* Click on **Test this application**, and you should be automatically signed in to the DX NetOps Portal for which you set up the SSO.

* You can use Microsoft My Apps. When you click the DX NetOps Portal tile in the My Apps, you should be automatically signed in to the DX NetOps Portal for which you set up the SSO. For more information, see [Microsoft Entra My Apps](/azure/active-directory/manage-apps/end-user-experiences#azure-ad-my-apps).

## Additional resources

* [What is single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)
* [Plan a single sign-on deployment](../manage-apps/plan-sso-deployment.md).

## Next steps

Once you configure DX NetOps Portal you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).

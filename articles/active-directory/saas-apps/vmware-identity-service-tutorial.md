---
title: Microsoft Entra SSO integration with VMware Identity Service
description: Learn how to configure single sign-on between Microsoft Entra ID and VMware Identity Service.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: how-to
ms.date: 12/09/2022
ms.author: jeedes

---

# Microsoft Entra SSO integration with VMware Identity Service

In this article, you'll learn how to integrate VMware Identity Service with Microsoft Entra ID. VMware Identity Service provides integration with Microsoft Entra ID for VMware products. It uses the SCIM protocol for user and group provisioning and SAML for authentication. When you integrate VMware Identity Service with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to VMware Identity Service.
* Enable your users to be automatically signed-in to VMware Identity Service with their Microsoft Entra accounts.
* Manage your accounts in one central location.

You'll configure and test Microsoft Entra single sign-on for VMware Identity Service in a test environment. VMware Identity Service supports both **SP** and **IDP** initiated single sign-on and **Just In Time** user provisioning.

## Prerequisites

To integrate Microsoft Entra ID with VMware Identity Service, you need:

* A Microsoft Entra user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* VMware Identity Service single sign-on (SSO) enabled subscription.

## Add application and assign a test user

Before you begin the process of configuring single sign-on, you need to add the VMware Identity Service application from the Microsoft Entra gallery. You need a test user account to assign to the application and test the single sign-on configuration.

<a name='add-vmware-identity-service-from-the-azure-ad-gallery'></a>

### Add VMware Identity Service from the Microsoft Entra gallery

Add VMware Identity Service from the Microsoft Entra application gallery to configure single sign-on with VMware Identity Service. For more information on how to add application from the gallery, see the [Quickstart: Add application from the gallery](../manage-apps/add-application-portal.md).

<a name='create-and-assign-azure-ad-test-user'></a>

### Create and assign Microsoft Entra test user

Follow the guidelines in the [create and assign a user account](../manage-apps/add-application-portal-assign-users.md) article to create a test user account called B.Simon.

Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, and assign roles. The wizard also provides a link to the single sign-on configuration pane. [Learn more about Microsoft 365 wizards](/microsoft-365/admin/misc/azure-ad-setup-guides). 

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Complete the following steps to enable Microsoft Entra single sign-on.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **VMware Identity Service** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot shows how to edit Basic SAML Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier** textbox, type a URL using one of the following patterns:

    | **Identifier** |
    |-----------|
    | `https://<CustomerName>.vmwareidentity.com/SAAS/API/1.0/GET/metadata/sp.xml` |
    | `https://<CustomerName>.workspaceoneaccess.com/SAAS/API/1.0/GET/metadata/sp.xml` |
    | `https://<CustomerName>.vmwareidentity.asia/SAAS/API/1.0/GET/metadata/sp.xml` |
    | `https://<CustomerName>.vmwareidentity.eu/SAAS/API/1.0/GET/metadata/sp.xml` |
    | `https://<CustomerName>.vmwareidentity.co.uk/SAAS/API/1.0/GET/metadata/sp.xml` |
    | `https://<CustomerName>.vmwareidentity.de/SAAS/API/1.0/GET/metadata/sp.xml` |
    | `https://<CustomerName>.vmwareidentity.ca/SAAS/API/1.0/GET/metadata/sp.xml` |
    | `https://<CustomerName>.vmwareidentity.com.au/SAAS/API/1.0/GET/metadata/sp.xml` |
    | `https://<CustomerName>.vidmpreview.com/SAAS/API/1.0/GET/metadata/sp.xml` |

    b. In the **Reply URL** textbox, type a URL using one of the following patterns:

    | **Reply URL** |
    |-------------|
    | `https://<CustomerName>.vmwareidentity.com/SAAS/auth/saml/response` |
    | `https://<CustomerName>.workspaceoneaccess.com/SAAS/auth/saml/response` |
    | `https://<CustomerName>.vmwareidentity.asia/SAAS/auth/saml/response` |
    | `https://<CustomerName>.vmwareidentity.eu/SAAS/auth/saml/response` |
    | ` https://<CustomerName>.vmwareidentity.co.uk/SAAS/auth/saml/response` |
    | `https://<CustomerName>.vmwareidentity.de/SAAS/auth/saml/response` |
    | `https://<CustomerName>.vmwareidentity.ca/SAAS/auth/saml/response` |
    | `https://<CustomerName>.vmwareidentity.com.au/SAAS/auth/saml/response` |
    | `https://<CustomerName>.vidmpreview.com/SAAS/auth/saml/response` |

1. If you want to configure **SP** initiated SSO, then perform the following step:  

    In the **Sign on URL** textbox, type a URL using one of the following patterns:

    | **Sign on URL** |
    |-------------|
    | `https://<CustomerName>.vmwareidentity.com` |
    | `https://<CustomerName>.workspaceoneaccess.com` |
    | `https://<CustomerName>.vmwareidentity.asia` |
    | `https://<CustomerName>.vmwareidentity.eu` |
    | `https://<CustomerName>.vmwareidentity.co.uk` |
    | `https://<CustomerName>.vmwareidentity.de` |
    | `https://<CustomerName>.vmwareidentity.ca` |
    | `https://<CustomerName>.vmwareidentity.com.au` |
    | `https://<CustomerName>.vidmpreview.com` |

    > [!Note]
    > These values are not the real. Update these values with the actual Identifier, Reply URL and Sign on URL. Contact [VMware Identity Service Client support team](mailto:support@vmware.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section.

1. VMware Identity Service application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

    ![Screenshot shows the image of token attributes.](common/default-attributes.png "Image")

1. In addition to above, VMware Identity Service application expects few more attributes to be passed back in SAML response, which are shown below. These attributes are also pre populated but you can review them as per your requirements.

    | Name | Source Attribute|
    | ------------ | --------- |
    | firstName | user.givenname |
    | lastName | user.surname |
    | userName | user.userprincipalname |
    | externalId | user.objectid |
    | email | user.mail |

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section, click copy button to copy **App Federation Metadata Url** and save it on your computer.

    ![Screenshot shows the Certificate download link.](common/copy-metadataurl.png "Certificate")

## Configure VMware Identity Service SSO

To configure single sign-on on **VMware Identity Service SSO** side, you need to send the **App Federation Metadata Url** to [VMware Identity Service SSO support team](mailto:support@vmware.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create VMware Identity Service test user

In this section, a user called B.Simon is created in VMware Identity Service. VMware Identity Service supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in VMware Identity Service, a new one is created after authentication.

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application**, this will redirect to VMware Identity Service Sign on URL where you can initiate the login flow.  

* Go to VMware Identity Service Sign on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application**, and you should be automatically signed in to the VMware Identity Service for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the VMware Identity Service tile in the My Apps, if configured in SP mode you would be redirected to the application sign-on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the VMware Identity Service for which you set up the SSO. For more information, see [Microsoft Entra My Apps](/azure/active-directory/manage-apps/end-user-experiences#azure-ad-my-apps).

## Additional resources

* [What is single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)
* [Plan a single sign-on deployment](../manage-apps/plan-sso-deployment.md).

## Next steps

Once you configure VMware Identity Service you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).

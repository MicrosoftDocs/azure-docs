---
title: Microsoft Entra SSO integration with Oracle Access Manager for Oracle E-Business Suite
description: Learn how to configure single sign-on between Microsoft Entra ID and Oracle Access Manager for Oracle E-Business Suite.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: how-to
ms.date: 02/07/2023
ms.author: jeedes

---

# Microsoft Entra SSO integration with Oracle Access Manager for Oracle E-Business Suite

In this article, you'll learn how to integrate Oracle Access Manager for Oracle E-Business Suite with Microsoft Entra ID. When you integrate Oracle Access Manager for Oracle E-Business Suite with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to Oracle Access Manager for Oracle E-Business Suite.
* Enable your users to be automatically signed-in to Oracle Access Manager for Oracle E-Business Suite with their Microsoft Entra accounts.
* Manage your accounts in one central location.

You'll configure and test Microsoft Entra single sign-on for Oracle Access Manager for Oracle E-Business Suite in a test environment. Oracle Access Manager for Oracle E-Business Suite supports only **SP** initiated single sign-on.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Prerequisites

To integrate Microsoft Entra ID with Oracle Access Manager for Oracle E-Business Suite, you need:

* A Microsoft Entra user account. If you don't already have one, you can [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* One of the following roles: Global Administrator, Cloud Application Administrator, Application Administrator, or owner of the service principal.
* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Oracle Access Manager for Oracle E-Business Suite single sign-on (SSO) enabled subscription.

## Add application and assign a test user

Before you begin the process of configuring single sign-on, you need to add the Oracle Access Manager for Oracle E-Business Suite application from the Microsoft Entra gallery. You need a test user account to assign to the application and test the single sign-on configuration.

<a name='add-oracle-access-manager-for-oracle-e-business-suite-from-the-azure-ad-gallery'></a>

### Add Oracle Access Manager for Oracle E-Business Suite from the Microsoft Entra gallery

Add Oracle Access Manager for Oracle E-Business Suite from the Microsoft Entra application gallery to configure single sign-on with Oracle Access Manager for Oracle E-Business Suite. For more information on how to add application from the gallery, see the [Quickstart: Add application from the gallery](../manage-apps/add-application-portal.md).

<a name='create-and-assign-azure-ad-test-user'></a>

### Create and assign Microsoft Entra test user

Follow the guidelines in the [create and assign a user account](../manage-apps/add-application-portal-assign-users.md) article to create a test user account called B.Simon.

Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, and assign roles. The wizard also provides a link to the single sign-on configuration pane. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides). 

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Complete the following steps to enable Microsoft Entra single sign-on.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Oracle Access Manager for Oracle E-Business Suite** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot shows how to edit Basic SAML Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier** textbox, type a URL using the following pattern: ` https://<SUBDOMAIN>.oraclecloud.com/`

    b. In the **Reply URL** textbox, type a URL using the following pattern: `https://<SUBDOMAIN>.oraclecloud.com/v1/saml/<UNIQUEID>>`

    c. In the **Sign on URL** textbox, type a URL using the following pattern:
    ` https://<SUBDOMAIN>.oraclecloud.com/`

1. Your Oracle Access Manager for Oracle E-Business Suite application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows an example for this. The default value of **Unique User Identifier** is **user.userprincipalname** but Oracle Access Manager for Oracle E-Business Suite expects this to be mapped with the user's email address. For that you can use **user.mail** attribute from the list or use the appropriate attribute value based on your organization configuration.

	![image](common/default-attributes.png)

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

## Configure Oracle Access Manager for Oracle E-Business Suite SSO

1. Sign to the Oracle Access Manager console as an Administrator.
1. Click the **Federation** tab at the top of the console.
1. In the **Federation** area of the **Launch Pad** tab, click **Service Provider Management**.
1. On the Service Provider Administration tab, click **Create Identity Provider Partner**.
1. In the **General** area, enter a name for the **Identity Provider partner** and select both **Enable Partner and Default Identity Provider Partner**. Go to the next step before saving.
1. In the **Service Information** area:

    a. Select **SAML2.0** as the protocol.

    b. Select **Load from provider metadata**.

    c. Click **Browse** (for Windows) or **Choose File** (for Mac) and select the **Federation Metadata XML** file that you downloaded previously.

    d. Go to the next step before saving.

1. In the **Mapping Options** area:

    a. Select the **User Identity Store** option that will be used as the Oracle Access Manager LDAP identity store that is checked for E-Business Suite users. Typically, this is already configured as the Oracle Access Manager identity store.

    b. Leave **User Search Base DN** blank. The search base is automatically picked from the identity store configuration.

    c. Select **Map assertion Name ID to User ID Store attribute** and enter mail in the text box.

1. Click **Save** to save the identity provider partner.
1. After the partner is saved, come back to the **Advanced** area at the bottom of the tab. Ensure that the options are configured as follows:

    a. **Enable global logout** is selected.

    b. **HTTP POST SSO** Response Binding is selected.

### Create Oracle Access Manager for Oracle E-Business Suite test user

In this section, you create a user called Britta Simon at Oracle Access Manager for Oracle E-Business Suite. Work with [Oracle Access Manager for Oracle E-Business Suite support team](https://www.oracle.com/support/advanced-customer-services/cloud/) to add the users in the Oracle Access Manager for Oracle E-Business Suite platform. Users must be created and activated before you use single sign-on.

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

* Click on **Test this application**, this will redirect to Oracle Access Manager for Oracle E-Business Suite Sign-on URL where you can initiate the login flow. 

* Go to Oracle Access Manager for Oracle E-Business Suite Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you select the Oracle Access Manager for Oracle E-Business Suite tile in the My Apps, this will redirect to Oracle Access Manager for Oracle E-Business Suite Sign-on URL. For more information, see [Microsoft Entra My Apps](/azure/active-directory/manage-apps/end-user-experiences#azure-ad-my-apps).

## Additional resources

* [What is single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)
* [Plan a single sign-on deployment](../manage-apps/plan-sso-deployment.md).

## Next steps

Once you configure Oracle Access Manager for Oracle E-Business Suite you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).

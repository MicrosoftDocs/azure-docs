---
title: 'Tutorial: Microsoft Entra SSO integration with Keeper Password Manager'
description: Learn how to configure single sign-on between Microsoft Entra ID and Keeper Password Manager.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 11/21/2022
ms.author: jeedes
---
# Tutorial: Microsoft Entra SSO integration with Keeper Password Manager

In this tutorial, you'll learn how to integrate Keeper Password Manager with Microsoft Entra ID. When you integrate Keeper Password Manager with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to Keeper Password Manager.
* Enable your users to be automatically signed-in to Keeper Password Manager with their Microsoft Entra accounts.
* Manage your accounts in one central location.

## Prerequisites

To get started, you need the following items:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Keeper Password Manager single sign-on (SSO) enabled subscription.

> [!NOTE]
> This integration is also available to use from Microsoft Entra US Government Cloud environment. You can find this application in the Microsoft Entra US Government Cloud Application Gallery and configure it in the same way as you do from public cloud.

## Scenario description

In this tutorial, you configure and test Microsoft Entra single sign-on in a test environment.

* Keeper Password Manager supports SP-initiated SSO.
* Keeper Password Manager supports [**Automated** user provisioning and deprovisioning](keeper-password-manager-digitalvault-provisioning-tutorial.md) (recommended).
* Keeper Password Manager supports just-in-time user provisioning.

## Add Keeper Password Manager from the gallery

To configure the integration of Keeper Password Manager into Microsoft Entra ID, add the application from the gallery to your list of managed software as a service (SaaS) apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In **Add from the gallery**, type **Keeper Password Manager** in the search box.
1. Select **Keeper Password Manager** from results panel, and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-sso-for-keeper-password-manager'></a>

## Configure and test Microsoft Entra SSO for Keeper Password Manager

Configure and test Microsoft Entra SSO with Keeper Password Manager by using a test user called **B.Simon**. For SSO to work, you need to establish a linked relationship between a Microsoft Entra user and the related user in Keeper Password Manager.

To configure and test Microsoft Entra SSO with Keeper Password Manager:

1. [Configure Microsoft Entra SSO](#configure-azure-ad-sso) to enable your users to use this feature.

    1. [Create a Microsoft Entra test user](#create-an-azure-ad-test-user) to test Microsoft Entra single sign-on with Britta Simon.
    1. [Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user) to enable Britta Simon to use Microsoft Entra single sign-on.

1. [Configure Keeper Password Manager SSO](#configure-keeper-password-manager-sso) to configure the SSO settings on the application side.
    1. [Create a Keeper Password Manager test user](#create-a-keeper-password-manager-test-user) to have a counterpart of Britta Simon in Keeper Password Manager linked to the Microsoft Entra representation of the user.
1. [Test SSO](#test-sso) to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Keeper Password Manager** application integration page, find the **Manage** section. Select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot of Set up Single Sign-On with SAML, with pencil icon highlighted.](common/edit-urls.png)

4. In the **Basic SAML Configuration** section, perform the following steps:

    a. For **Identifier (Entity ID)**, type a URL using one of the following patterns:
    * For cloud SSO: `https://keepersecurity.com/api/rest/sso/saml/<CLOUD_INSTANCE_ID>`
    * For on-premises SSO: `https://<KEEPER_FQDN>/sso-connect`

    b. For **Reply URL**, type a URL using one of the following patterns:
    * For cloud SSO: `https://keepersecurity.com/api/rest/sso/saml/sso/<CLOUD_INSTANCE_ID>`
    * For on-premises SSO: `https://<KEEPER_FQDN>/sso-connect/saml/sso`

    c. For **Sign on URL**, type a URL using one of the following patterns:
    * For cloud SSO: `https://keepersecurity.com/api/rest/sso/ext_login/<CLOUD_INSTANCE_ID>`
    * For on-premises SSO: `https://<KEEPER_FQDN>/sso-connect/saml/login`

    d. For **Sign out URL**, type a URL using one of the following patterns:
    * For cloud SSO: `https://keepersecurity.com/api/rest/sso/saml/slo/<CLOUD_INSTANCE_ID>`
    * There is no configuration for on-premises SSO.

	> [!NOTE]
	> These values aren't real. Update these values with the actual Identifier,Reply URL and Sign on URL. To get these values, contact the [Keeper Password Manager Client support team](https://keepersecurity.com/contact.html). You can also refer to the patterns shown in the **Basic SAML Configuration** section.

1. The Keeper Password Manager application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

	![Screenshot of User Attributes & Claims.](common/default-attributes.png)

1. In addition, the Keeper Password Manager application expects a few more attributes to be passed back in SAML response. These are shown in the following table. These attributes are also pre-populated, but you can review them per your requirements.

	| Name | Source attribute|
	| ------------| --------- |
	| First | user.givenname |
	| Last | user.surname |
    | Email | user.mail |

1. On **Set up Single Sign-On with SAML**, in the **SAML Signing Certificate** section, select **Download**. This downloads **Federation Metadata XML** from the options per your requirement, and saves it on your computer.

	![Screenshot of SAML Signing Certificate with Download highlighted.](common/metadataxml.png)

1. On **Set up Keeper Password Manager**, copy the appropriate URLs, per your requirement.

	![Screenshot of Set up Keeper Password Manager with URLs highlighted.](common/copy-configuration-urls.png)

<a name='create-an-azure-ad-test-user'></a>

### Create a Microsoft Entra test user 

In this section, you create a test user in the Azure portal called `B.Simon`.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [User Administrator](../roles/permissions-reference.md#user-administrator).
1. Browse to **Identity** > **Users** > **All users**.
1. Select **New user** > **Create new user**, at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Display name** field, enter `B.Simon`.  
   1. In the **User principal name** field, enter the username@companydomain.extension. For example, `B.Simon@contoso.com`.
   1. Select the **Show password** check box, and then write down the value that's displayed in the **Password** box.
   1. Select **Review + create**.
1. Select **Create**.

<a name='assign-the-azure-ad-test-user'></a>

### Assign the Microsoft Entra test user

In this section, you enable B.Simon to use Azure single sign-on by granting access to Keeper Password Manager.

1. Browse to **Identity** > **Applications** > **Enterprise applications**.
1. In the applications list, select **Keeper Password Manager**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**. In **Add Assignment**, select **Users and groups**.
1. In **Users and groups**, select **B.Simon** from the list of users. Then choose **Select** at the bottom of the screen.
1. If you're expecting a role to be assigned to the users, you can select it from the **Select a role** list. If no role has been set up for this app, the **Default Access** role is selected.
1. In **Add Assignment**, select **Assign**.

## Configure Keeper Password Manager SSO

To configure SSO for the app, see the guidelines in the [Keeper support guide](https://docs.keeper.io/sso-connect-guide/).

### Create a Keeper Password Manager test user

To enable Microsoft Entra users to sign in to Keeper Password Manager, you must provision them. The application supports just-in-time user provisioning, and after authentication users are created in the application automatically. If you want to set up users manually, contact [Keeper support](https://keepersecurity.com/contact.html).

> [!NOTE]
> Keeper Password Manager also supports automatic user provisioning, you can find more details [here](./keeper-password-manager-digitalvault-provisioning-tutorial.md) on how to configure automatic user provisioning.

## Test SSO

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

* Click on **Test this application**, this will redirect to Keeper Password Manager Sign-on URL where you can initiate the login flow. 

* Go to Keeper Password Manager Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Keeper Password Manager tile in the My Apps, this will redirect to Keeper Password Manager Sign-on URL. For more information, see [Microsoft Entra My Apps](/azure/active-directory/manage-apps/end-user-experiences#azure-ad-my-apps).

## Next steps

After you configure Keeper Password Manager, you can enforce session control. This protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. For more information, see [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).

---
title: Microsoft Entra SSO integration with Splashtop Secure Workspace
description: Learn how to configure single sign-on between Microsoft Entra ID and Splashtop Secure Workspace.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: how-to
ms.date: 09/28/2023
ms.author: jeedes

---

# Microsoft Entra SSO integration with Splashtop Secure Workspace

In this tutorial, you'll learn how to integrate Splashtop Secure Workspace with Microsoft Entra ID. When you integrate Splashtop Secure Workspace with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to Splashtop Secure Workspace.
* Enable your users to be automatically signed-in to Splashtop Secure Workspace with their Microsoft Entra accounts.
* Manage your accounts in one central location.

## Prerequisites

To integrate Microsoft Entra ID with Splashtop Secure Workspace, you need:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Splashtop Secure Workspace single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Microsoft Entra SSO in a test environment.

* Splashtop Secure Workspace supports **SP** initiated SSO.
* Splashtop Secure Workspace supports **Just In Time** user provisioning.

## Add Splashtop Secure Workspace from the gallery

To configure the integration of Splashtop Secure Workspace into Microsoft Entra ID, you need to add Splashtop Secure Workspace from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **Splashtop Secure Workspace** in the search box.
1. Select **Splashtop Secure Workspace** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, and walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Microsoft Entra SSO for Splashtop Secure Workspace

Configure and test Microsoft Entra SSO with Splashtop Secure Workspace using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in Splashtop Secure Workspace.

To configure and test Microsoft Entra SSO with Splashtop Secure Workspace, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-microsoft-entra-sso)** - to enable your users to use this feature.
    1. **[Create a Microsoft Entra ID test user](#create-a-microsoft-entra-id-test-user)** - to test Microsoft Entra single sign-on with B.Simon.
    1. **[Assign the Microsoft Entra ID test user](#assign-the-microsoft-entra-id-test-user)** - to enable B.Simon to use Microsoft Entra single sign-on.
1. **[Configure Splashtop Secure Workspace SSO](#configure-splashtop-secure-workspace-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Splashtop Secure Workspace test user](#create-splashtop-secure-workspace-test-user)** - to have a counterpart of B.Simon in Splashtop Secure Workspace that is linked to the Microsoft Entra ID representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO in the Microsoft Entra admin center.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Splashtop Secure Workspace** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot shows how to edit Basic SAML Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:
    `https://<ORG.ORG_NAME>.us.ssw.splashtop.com/realms/<ORG.ENTITY_ID>`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://<ORG.ORG_NAME>.us.ssw.splashtop.com/realms/<ORG.ORG_NAME>/broker/<ORG.ENTITY_ID>/endpoint`

    c. In the **Sign on URL** text box, type a URL using the following pattern:
    `https://<ORG.ORG_NAME>.us.ssw.splashtop.com`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier, Reply URL and Sign on URL. Contact [Splashtop Secure Workspace support team](mailto:support-ssw@splashtop.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Microsoft Entra admin center.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

	![Screenshot shows the Certificate download link](common/metadataxml.png "Certificate")

1. On the **Set up Splashtop Secure Workspace** section, copy the appropriate URL(s) based on your requirement.

	![Screenshot shows to copy configuration URLs.](common/copy-configuration-urls.png "Metadata")
    
### Create a Microsoft Entra ID test user

In this section, you'll create a test user in the Microsoft Entra admin center called B.Simon.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [User Administrator](../roles/permissions-reference.md#user-administrator).
1. Browse to **Identity** > **Users** > **All users**.
1. Select **New user** > **Create new user**, at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Display name** field, enter `B.Simon`.  
   1. In the **User principal name** field, enter the username@companydomain.extension. For example, `B.Simon@contoso.com`.
   1. Select the **Show password** check box, and then write down the value that's displayed in the **Password** box.
   1. Select **Review + create**.
1. Select **Create**.

### Assign the Microsoft Entra ID test user

In this section, you'll enable B.Simon to use Microsoft Entra single sign-on by granting access to Splashtop Secure Workspace.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Splashtop Secure Workspace**.
1. In the app's overview page, select **Users and groups**.
1. Select **Add user/group**, then select **Users and groups** in the **Add Assignment** dialog.
   1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
   1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
   1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Splashtop Secure Workspace SSO

To configure single sign-on on **Splashtop Secure Workspace** side, you need to send the downloaded **Federation Metadata XML** and appropriate copied URLs from Microsoft Entra admin center to [Splashtop Secure Workspace support team](mailto:support-ssw@splashtop.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Splashtop Secure Workspace test user

In this section, a user called B.Simon is created in Splashtop Secure Workspace. Splashtop Secure Workspace supports just-in-time provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in Splashtop Secure Workspace, a new one is created when you attempt to access Splashtop Secure Workspace.

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options.
 
* Click on **Test this application** in Microsoft Entra admin center. This will redirect to Splashtop Secure Workspace Sign-on URL where you can initiate the login flow.
 
* Go to Splashtop Secure Workspace Sign-on URL directly and initiate the login flow from there.
 
* You can use Microsoft My Apps. When you click the Splashtop Secure Workspace tile in the My Apps, this will redirect to Splashtop Secure Workspace Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure Splashtop Secure Workspace you can enforce session control, which protects exfiltration and infiltration of your organization's sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-any-app).
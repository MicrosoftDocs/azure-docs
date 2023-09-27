---
title: 'Tutorial: Microsoft Entra single sign-on (SSO) integration with Bizagi for Digital Process Automation'
description: Learn how to configure single sign-on between Microsoft Entra ID and Bizagi for Digital Process Automation.
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

# Tutorial: Microsoft Entra single sign-on (SSO) integration with Bizagi for Digital Process Automation

In this tutorial, you'll learn how to integrate Bizagi for Digital Process Automation Services or Server with Microsoft Entra ID. When you integrate Bizagi for Digital Process Automation with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to a Bizagi project for Digital Process Automation Services or Server.
* Enable your users to be automatically signed-in to a project of Bizagi for Digital Process AutomationServices or Server with their Microsoft Entra accounts.
* Manage your accounts in one central location.

## Prerequisites

To get started, you need the following items:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* A Bizagi project using Automation Services or Server. 
* Have your own certificates for SAML assertion signatures. This certificates must be generate in p12 or pfx format.
* Have a metadata file in XML format generated from the Bizagi project. 

## Scenario description

In this tutorial, you configure and test Microsoft Entra SSO in a Bizagi project using Automation services or server.

* Bizagi for Digital Process Automation supports **SP** initiated SSO.
* Bizagi for Digital Process Automation supports [Automated user provisioning](bizagi-studio-for-digital-process-automation-provisioning-tutorial.md).

## Add Bizagi for Digital Process Automation from the gallery

To configure the integration of Bizagi for Digital Process Automation into Microsoft Entra ID, you need to add Bizagi for Digital Process Automation from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **Bizagi for Digital Process Automation** in the search box.
1. Select **Bizagi for Digital Process Automation** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-sso-for-bizagi-for-digital-process-automation'></a>

## Configure and test Microsoft Entra SSO for Bizagi for Digital Process Automation

Configure and test Microsoft Entra SSO with Bizagi for Digital Process Automation using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in the Bizagi project.

To configure and test Microsoft Entra SSO with Bizagi for Digital Process Automation, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test)** - to test Microsoft Entra single sign-on with B.Simon.
    1. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Microsoft Entra single sign-on.
1. **[Configure Bizagi for Digital Process Automation SSO](#configure-bizagi-for-digital-process-automation-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Bizagi for Digital Process Automation test user](#create-bizagi-for-digital-process-automation-test-user)** - to have a counterpart of B.Simon in Bizagi for Digital Process Automation that is linked to the Microsoft Entra representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Bizagi for Digital Process Automation** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:
    `https://<COMPANY_NAME>.bizagi.com/<PROJECT_NAME>`

	b. In the **Sign on URL** text box, type a URL using the following pattern:
    `https://<COMPANY_NAME>.bizagi.com/<PROJECT_NAME>`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier and Sign on URL. Contact [Bizagi for Digital Process Automation support team](mailto:jarvein.rivera@bizagi.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section.

1. On the **Set up single sign-on with SAML** page, In the **SAML Signing Certificate** section, click copy button to copy **App Federation Metadata Url** and save it on your computer.

	![The Certificate download link](common/copy-metadataurl.png)
	
	This metadata URL must be registered in the authentication options of your Bizagi project.
	
1. On the **Set up single sign-on with SAML**page, click the pencil icon for **User Attributes & Claims** to edit the Unique User Identifier.
	
	Set the Unique User Identifier as the user.mail.

<a name='create-an-azure-ad-test'></a>

### Create a Microsoft Entra ID test 

In this section, you'll create a test user called B.Simon.

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

In this section, you'll enable B.Simon to use single sign-on by granting access to Bizagi for Digital Process Automation.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Bizagi for Digital Process Automation**.
1. In the app's overview page, select **Users and groups**.
1. Select **Add user/group**, then select **Users and groups** in the **Add Assignment** dialog.
   1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
   1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
   1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Bizagi for Digital Process Automation SSO

To configure single sign-on on **Bizagi for Digital Process Automation** side, you need to send the **App Federation Metadata Url** to [Bizagi for Digital Process Automation support team](mailto:jarvein.rivera@bizagi.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Bizagi for Digital Process Automation test user

In this section, you create a user called Britta Simon in Bizagi for Digital Process Automation. Work with [Bizagi for Digital Process Automation support team](mailto:jarvein.rivera@bizagi.com) to add the users in the Bizagi for Digital Process Automation platform. Users must be created and activated before you use single sign-on.

Bizagi for Digital Process Automation also supports automatic user provisioning, you can find more details [here](./bizagi-studio-for-digital-process-automation-provisioning-tutorial.md) on how to configure automatic user provisioning.

## Test SSO

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

* Click on **Test this application**, this will redirect to Bizagi for Digital Process Automation Sign-on URL where you can initiate the login flow. 

* Go to Bizagi for Digital Process Automation Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Bizagi for Digital Process Automation tile in the My Apps, this will redirect to Bizagi for Digital Process Automation Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

Once you configure Bizagi for Digital Process Automation you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).

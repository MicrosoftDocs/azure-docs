---
title: 'Tutorial: Integrate Microsoft Entra single sign-on (SSO) with Splan Visitor'
description: Learn how to configure single sign-on between Microsoft Entra ID and Splan Visitor.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 11/21/2022
ms.author: jeedes

---

# Tutorial: Integrate Microsoft Entra single sign-on (SSO) with Splan Visitor

In this tutorial, you'll learn how to integrate Splan Visitor with Microsoft Entra ID. When you integrate Splan Visitor with Microsoft Entra ID, you can:

* Use Microsoft Entra ID to control who has access to Splan Visitor.
* Enable users to be automatically signed in to Splan Visitor with their Microsoft Entra accounts.
* Manage your accounts in one central location, the Azure portal.

## Prerequisites

To get started, you need:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* A Splan Visitor single sign-on (SSO) enabled subscription.

> [!NOTE]
> This integration is also available to use from Microsoft Entra US Government Cloud environment. You can find this application in the Microsoft Entra US Government Cloud Application Gallery and configure it in the same way as you do from public cloud.

## Scenario description

In this tutorial, you'll configure and test Microsoft Entra SSO in a test environment.

* Splan Visitor supports IdP-initiated SSO.

## Add Splan Visitor from the gallery

To configure the integration of Splan Visitor into Microsoft Entra ID, add Splan Visitor from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, enter **Splan Visitor** in the search box.
1. Select **Splan Visitor** from the results panel, and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-sso-for-splan-visitor'></a>

## Configure and test Microsoft Entra SSO for Splan Visitor

Configure and test Microsoft Entra SSO with Splan Visitor by using a test user named **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in Splan Visitor.

To configure and test Microsoft Entra SSO with Splan Visitor, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** to enable your users to use this feature.
    1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** to test Microsoft Entra single sign-on with test user B.Simon.
    1. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** to enable B.Simon to use Microsoft Entra single sign-on.
1. **[Configure Splan Visitor SSO](#configure-splan-visitor-sso)** to configure the single sign-on settings with Splan Visitor.
    1. **[Create a Splan Visitor test user](#create-a-splan-visitor-test-user)** to have a counterpart of B.Simon in Splan Visitor that is linked to the Microsoft Entra representation of user.
1. **[Test SSO](#test-sso)** to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO in the Azure portal:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Splan Visitor** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up Single Sign-On with SAML** page, select the **pencil** icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot highlighting the edit/pen icon for Basic SAML Configuration.](common/edit-urls.png)

1. In the **Basic SAML Configuration** section, the application is preconfigured and the necessary URLs are prepopulated with Azure. Select the **Save** button to save the configuration.

1. On the **Set up Single Sign-on with SAML** page, in the **SAML Signing Certificate** section, find **Federation Metadata XML**. Select **Download** to download the certificate and save it to your computer.

	![Screenshot highlighting the Federation Metadata XML download link.](common/metadataxml.png)

1. On the **Set up Splan Visitor** section, copy the appropriate URL or URLs based on your requirement.

	![Screenshot highlighting the configuration URLs section.](common/copy-configuration-urls.png)

<a name='create-an-azure-ad-test-user'></a>

### Create a Microsoft Entra test user

In this section, you'll create a test user named B.Simon.

1. In the Microsoft Entra admin center, navigate to **Identity** > **Users** > **All users**.
1. Select **New user** at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Name** field, enter **B.Simon**.  
   1. In the **User name** field, enter your username in _username@companydomain.extension_ format. For example, enter **B.Simon@contoso.com**.
   1. Select the **Show password** check box, and then write down the value that's displayed in the **Password** box.
   1. Select **Create**.

<a name='assign-the-azure-ad-test-user'></a>

### Assign the Microsoft Entra test user

In this section, you'll enable B.Simon to use single sign-on by granting access to Splan Visitor.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Splan Visitor** to open the app overview.
1. Find the **Manage** section, and then select **Users and groups**.
1. Select **Add user**, and then select **Users and groups** in the **Add Assignment** dialog box.
1. In the **Users and groups** dialog box, select **B.Simon** from the **Users** list, and then click **Select** at the bottom of the screen.
1. If the user will be assigned a role, select it from the **Select a role** drop-down menu. If no role has been set up for this app, leave the **Default Access** role selected.
1. In the **Add Assignment** dialog box, select **Assign**.

## Configure Splan Visitor SSO

To configure single sign-on with Splan Visitor, send the **Federation Metadata XML** that you downloaded and appropriate copied URLs to the [Splan Visitor support team](mailto:support@splan.com). This ensures that the SAML SSO connection is set properly on both sides.

### Create a Splan Visitor test user

Create a test user named **Britta Simon** in Splan Visitor. Work with the [Splan Visitor support team](mailto:support@splan.com) to add the user to Splan Visitor. You must create and activate the user before you use single sign-on.

## Test SSO

Test your Microsoft Entra single sign-on configuration with one of the following options:

* **Azure portal**: Select **Test this application** to automatically sign in to the Splan Visitor for which you set up SSO.
* **Microsoft My Apps portal**: Select the **Splan Visitor** tile to automatically sign in to the Splan Visitor for which you set up SSO. For more information about the My Apps portal, see [Sign in and start apps from the My Apps portal](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

After you configure Splan Visitor, you can [learn how to enforce session controls in Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-any-app). Session controls help protect exfiltration and infiltration of your organization's sensitive data in real time. Session controls extend from Conditional Access.

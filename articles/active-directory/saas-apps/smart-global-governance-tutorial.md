---
title: 'Tutorial: Microsoft Entra SSO integration with Smart Global Governance'
description: Learn how to configure single sign-on between Microsoft Entra ID and Smart Global Governance.
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

# Tutorial: Microsoft Entra single sign-on (SSO) integration with Smart Global Governance

In this tutorial, you'll learn how to integrate Smart Global Governance with Microsoft Entra ID. When you integrate Smart Global Governance with Microsoft Entra ID, you can:

* Use Microsoft Entra ID to control who can access Smart Global Governance.
* Enable your users to be automatically signed in to Smart Global Governance with their Microsoft Entra accounts.
* Manage your accounts in one central location: the Azure portal.

To learn more about SaaS app integration with Microsoft Entra ID, see [Single sign-on to applications in Microsoft Entra ID](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To get started, you need the following items:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* A Smart Global Governance subscription with single sign-on (SSO) enabled.

## Tutorial description

In this tutorial, you'll configure and test Microsoft Entra SSO in a test environment.

Smart Global Governance supports SP-initiated and IDP-initiated SSO.

After you configure Smart Global Governance, you can enforce session control, which protects exfiltration and infiltration of your organization's sensitive data in real time. Session controls extend from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-any-app).

## Add Smart Global Governance from the gallery

To configure the integration of Smart Global Governance into Microsoft Entra ID, you need to add Smart Global Governance from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, enter **Smart Global Governance** in the search box.
1. Select **Smart Global Governance** in the results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-sso-for-smart-global-governance'></a>

## Configure and test Microsoft Entra SSO for Smart Global Governance

You'll configure and test Microsoft Entra SSO with Smart Global Governance by using a test user named B.Simon. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the corresponding user in Smart Global Governance.

To configure and test Microsoft Entra SSO with Smart Global Governance, you'll take these high-level steps:

1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** to enable your users to use the feature.
    1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** to test Microsoft Entra single sign-on.
    1. **[Grant access to the test user](#grant-access-to-the-test-user)** to enable the user to use Microsoft Entra single sign-on.
1. **[Configure Smart Global Governance SSO](#configure-smart-global-governance-sso)** on the application side.
    1. **[Create a Smart Global Governance test user](#create-a-smart-global-governance-test-user)** as a counterpart to the Microsoft Entra representation of the user.
1. **[Test SSO](#test-sso)** to verify that the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO in the Azure portal:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Smart Global Governance** application integration page, in the **Manage** section, select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up Single Sign-On with SAML** page, select the pencil button for **Basic SAML Configuration** to edit the settings:

   ![Pencil button for Basic SAML Configuration](common/edit-urls.png)

1. In the **Basic SAML Configuration** section, if you want to configure the application in IDP-initiated mode, take the following steps.

    a. In the **Identifier** box, enter one of these URLs:

    - `https://eu-fr-south.console.smartglobalprivacy.com/platform/authentication-saml2/metadata`
    - `https://eu-fr-south.console.smartglobalprivacy.com/dpo/authentication-saml2/metadata`

    b. In the **Reply URL** box, enter one of these URLs:

    - `https://eu-fr-south.console.smartglobalprivacy.com/platform/authentication-saml2/acs`
    - `https://eu-fr-south.console.smartglobalprivacy.com/dpo/authentication-saml2/acs`

1. If you want to configure the application in SP-initiated mode, select **Set additional URLs** and complete the following step.

   - In the **Sign-on URL** box, enter one of these URLs:

    - `https://eu-fr-south.console.smartglobalprivacy.com/dpo`
    - `https://eu-fr-south.console.smartglobalprivacy.com/platform`

1. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, select the **Download** link for **Certificate (Raw)** to download the certificate and save it on your computer:

	![Certificate download link](common/certificateraw.png)

1. In the **Set up Smart Global Governance** section, copy the appropriate URL or URLs, based on your requirements:

	![Copy configuration URLs](common/copy-configuration-urls.png)

<a name='create-an-azure-ad-test-user'></a>

### Create a Microsoft Entra test user

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

### Grant access to the test user

In this section, you'll enable B.Simon to use single sign-on by granting that user access to Smart Global Governance.

1. Browse to **Identity** > **Applications** > **Enterprise applications**.
1. In the applications list, select **Smart Global Governance**.
1. In the app's overview page, in the **Manage** section, select **Users and groups**:

   ![Select Users and groups](common/users-groups-blade.png)

1. Select **Add user**, and then select **Users and groups** in the **Add Assignment** dialog box:

	![Select Add user](common/add-assign-user.png)

1. In the **Users and groups** dialog box, select **B.Simon** in the **Users** list, and then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog box, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog box, select **Assign**.

## Configure Smart Global Governance SSO

To configure single sign-on on the Smart Global Governance side, you need to send the downloaded raw certificate and the appropriate URLs that you copied from Azure portal to the [Smart Global Governance support team](mailto:support.tech@smartglobal.com). They configure the SAML SSO connection to be correct on both sides.

### Create a Smart Global Governance test user

Work with the [Smart Global Governance support team](mailto:support.tech@smartglobal.com) to add a user named B.Simon in Smart Global Governance. Users must be created and activated before you use single sign-on.

## Test SSO 

In this section, you'll test your Microsoft Entra SSO configuration by using Access Panel.

When you select the Smart Global Governance tile in Access Panel, you should be automatically signed in to the Smart Global Governance instance for which you set up SSO. For more information about Access Panel, see [Introduction to Access Panel](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Additional resources

- [Tutorials on how to integrate SaaS apps with Microsoft Entra ID](./tutorial-list.md)

- [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

- [What is Conditional Access in Microsoft Entra ID?](../conditional-access/overview.md)

- [What is session control in Microsoft Defender for Cloud Apps?](/cloud-app-security/proxy-intro-aad)

- [How to protect Smart Global Governance with advanced visibility and controls](/cloud-app-security/proxy-intro-aad)

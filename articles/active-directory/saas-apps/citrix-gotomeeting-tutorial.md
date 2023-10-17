---
title: 'Tutorial: Microsoft Entra integration with GoToMeeting'
description: Learn the steps you need to perform to integrate GoToMeeting with Microsoft Entra ID.
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
# Tutorial: Microsoft Entra single sign-on (SSO) integration with GoToMeeting

In this tutorial, you'll learn how to integrate GoToMeeting with Microsoft Entra ID. When you integrate GoToMeeting with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to GoToMeeting.
* Enable your users to be automatically signed-in to GoToMeeting with their Microsoft Entra accounts.
* Manage your accounts in one central location.

## Prerequisites

To get started, you need the following items:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* GoToMeeting single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Microsoft Entra SSO in a test environment.

* GoToMeeting supports **IDP** initiated SSO.
* GoToMeeting supports [Automated user provisioning](citrixgotomeeting-provisioning-tutorial.md).

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Add GoToMeeting from the gallery

To configure the integration of GoToMeeting into Microsoft Entra ID, you need to add GoToMeeting from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **GoToMeeting** in the search box.
1. Select **GoToMeeting** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-sso-for-gotomeeting'></a>

## Configure and test Microsoft Entra SSO for GoToMeeting

Configure and test Microsoft Entra SSO with GoToMeeting using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in GoToMeeting.

To configure and test Microsoft Entra SSO with GoToMeeting, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - to test Microsoft Entra single sign-on with B.Simon.
    1. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Microsoft Entra single sign-on.
1. **[Configure GoToMeeting SSO](#configure-gotomeeting-sso)** - to configure the single sign-on settings on application side.
    1. **[Create GoToMeeting test user](#create-gotomeeting-test-user)** - to have a counterpart of B.Simon in GoToMeeting that is linked to the Microsoft Entra representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **GoToMeeting** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier** text box, type the URL:
    `https://authentication.logmeininc.com/saml/sp`

    b. In the **Reply URL** text box, type the URL:
    `https://authentication.logmeininc.com/saml/acs`

    c. Click **set additional URLs** and configure the below URLs

    d. **Sign on URL** (keep this blank)

    e. In the **RelayState** text box, type one of the following URLs:

   - For GoToMeeting App, use `https://global.gotomeeting.com`

   - For GoToTraining, use `https://global.gototraining.com`

   - For GoToWebinar, use `https://global.gotowebinar.com` 

   - For GoToAssist, use `https://app.gotoassist.com`

1. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Base64)** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. On the **Set up GoToMeeting** section, copy the appropriate URL(s) as per your requirement.

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

<a name='assign-the-azure-ad-test-user'></a>

### Assign the Microsoft Entra test user

In this section, you'll enable B.Simon to use single sign-on by granting access to GoToMeeting.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **GoToMeeting**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure GoToMeeting SSO

1. In a different browser window, log in to your [GoToMeeting Organization Center](https://organization.logmeininc.com/). You will be prompted to confirm that the IdP has been updated.

2. Enable the "My Identity Provider has been updated with the new domain" checkbox. Click **Done** when finished.

### Create GoToMeeting test user

In this section, a user called Britta Simon is created in GoToMeeting. GoToMeeting supports just-in-time provisioning, which is enabled by default.

There is no action item for you in this section. If a user doesn't already exist in GoToMeeting, a new one is created when you attempt to access GoToMeeting.

> [!NOTE]
> If you need to create a user manually, Contact [GoToMeeting support team](https://support.logmeininc.com/gotomeeting).

> [!NOTE]
>GoToMeeting also supports automatic user provisioning, you can find more details [here](./citrixgotomeeting-provisioning-tutorial.md) on how to configure automatic user provisioning.

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options.

* Click on **Test this application**, and you should be automatically signed in to the GoToMeeting for which you set up the SSO.

* You can use Microsoft My Apps. When you click the GoToMeeting tile in the My Apps, you should be automatically signed in to the GoToMeeting for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

Once you configure GoToMeeting you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).

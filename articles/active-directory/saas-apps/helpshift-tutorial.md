---
title: 'Tutorial: Microsoft Entra single sign-on (SSO) integration with Helpshift'
description: Learn how to configure single sign-on between Microsoft Entra ID and Helpshift.
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

# Tutorial: Microsoft Entra single sign-on (SSO) integration with Helpshift

In this tutorial, you'll learn how to integrate Helpshift with Microsoft Entra ID. When you integrate Helpshift with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to Helpshift.
* Enable your users to be automatically signed-in to Helpshift with their Microsoft Entra accounts.
* Manage your accounts in one central location.

## Prerequisites

To get started, you need the following items:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Helpshift single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Microsoft Entra SSO in a test environment.

* Helpshift supports **SP and IDP** initiated SSO.

## Add Helpshift from the gallery

To configure the integration of Helpshift into Microsoft Entra ID, you need to add Helpshift from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **Helpshift** in the search box.
1. Select **Helpshift** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-sso-for-helpshift'></a>

## Configure and test Microsoft Entra SSO for Helpshift

Configure and test Microsoft Entra SSO with Helpshift using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in Helpshift.

To configure and test Microsoft Entra SSO with Helpshift, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - to test Microsoft Entra single sign-on with B.Simon.
    1. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Microsoft Entra single sign-on.
1. **[Configure Helpshift SSO](#configure-helpshift-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Helpshift test user](#create-helpshift-test-user)** - to have a counterpart of B.Simon in Helpshift that is linked to the Microsoft Entra representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Helpshift** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, perform the following steps:

    a. In the **Identifier** text box, type a URL using the following pattern:
    `https://<YOUR_DOMAIN>.helpshift.com/`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://<YOUR_DOMAIN>.helpshift.com/login/saml/acs/`

1. Click **Set additional URLs** and perform the following steps if you wish to configure the application in **SP** initiated mode:

    a. In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://<YOUR_DOMAIN>.helpshift.com/login/saml/idp-login/`

    b. In the **Relay State** text box, type a URL using the following pattern:
    `https://<YOUR_DOMAIN>.helpshift.com/`

    > [!NOTE]
    > These values are not real. Update these values with the actual Identifier, Reply URL, Sign-on URL and Relay State. Contact [Helpshift Client support team](mailto:support@helpshift.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. On the **Set up Helpshift** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use single sign-on by granting access to Helpshift.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Helpshift**.
1. In the app's overview page, select **Users and groups**.
1. Select **Add user/group**, then select **Users and groups** in the **Add Assignment** dialog.
   1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
   1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
   1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Helpshift SSO

1. In a different web browser, Sign in to your Helpshift application as an administrator.

1. Open the Helpshift **Dashboard** and click on **Settings icon**.

	![Screenshot shows the Helpshift Settings icon.](./media/helpshift-tutorial/dashboard.png)

1. Click **Integrations** tab and perform the following steps:

	![Screenshot shows the Integration tab where you can perform steps described.](./media/helpshift-tutorial/configuration.png)

    a. Turn on the **Single Sign-On(SAML – SSO)**.

    b. Select **Identity Provider(IDP)** as **Microsoft Entra ID**.

    c. In the **SAML 2.0 Endpoint URL** textbox, paste the **Login URL** value, which you copied previously.

    d. Open downloaded **Certificate (Base64)** file into Notepad, copy the content of the file (without using the ‘—–BEGIN CERTIFICATE—–‘ and ‘—–END CERTIFICATE—–‘ lines) and paste it into **X.509 Certificate** textbox.

    e. In the **Issuer URL** textbox, paste the **Microsoft Entra Identifier** value, which you copied previously.

    f. Click on **APPLY CHANGES**.

### Create Helpshift test user

In this section, you create a user called B.Simon in Helpshift. Work with [Helpshift Client support team](mailto:support@helpshift.com) to add the users in the Helpshift platform. Users must be created and activated before you use single sign-on.

## Test SSO

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application**, this will redirect to Helpshift Sign on URL where you can initiate the login flow.  

* Go to Helpshift Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application**, and you should be automatically signed in to the Helpshift for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the Helpshift tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the Helpshift for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

Once you configure Helpshift you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).

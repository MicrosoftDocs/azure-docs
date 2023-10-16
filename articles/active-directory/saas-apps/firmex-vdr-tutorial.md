---
title: 'Tutorial: Microsoft Entra SSO integration with Firmex VDR'
description: Learn how to configure single sign-on between Microsoft Entra ID and Firmex VDR.
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

# Tutorial: Microsoft Entra SSO integration with Firmex VDR

In this tutorial, you'll learn how to integrate Firmex VDR with Microsoft Entra ID. When you integrate Firmex VDR with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to Firmex VDR.
* Enable your users to be automatically signed-in to Firmex VDR with their Microsoft Entra accounts.
* Manage your accounts in one central location.

## Prerequisites

To get started, you need the following items:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Firmex VDR single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Microsoft Entra SSO in a test environment.

* Firmex VDR supports **SP and IDP** initiated SSO.

## Add Firmex VDR from the gallery

To configure the integration of Firmex VDR into Microsoft Entra ID, you need to add Firmex VDR from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **Firmex VDR** in the search box.
1. Select **Firmex VDR** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-sso-for-firmex-vdr'></a>

## Configure and test Microsoft Entra SSO for Firmex VDR

Configure and test Microsoft Entra SSO with Firmex VDR using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in Firmex VDR.

To configure and test Microsoft Entra SSO with Firmex VDR, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - to test Microsoft Entra single sign-on with B.Simon.
    1. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Microsoft Entra single sign-on.
1. **[Configure Firmex VDR SSO](#configure-firmex-vdr-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Firmex VDR test user](#create-firmex-vdr-test-user)** - to have a counterpart of B.Simon in Firmex VDR that is linked to the Microsoft Entra representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Firmex VDR** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set-up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, the user does not have to perform any step as the app is already pre-integrated with Azure.

1. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type the URL:
    `https://login.firmex.com`

1. Click **Save**.

1. Firmex VDR application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

	![image](common/default-attributes.png)

1. In addition to above, Firmex VDR application expects few more attributes to be passed back in SAML response which are shown below. These attributes are also pre populated but you can review them as per your requirements.

	| Name | Source Attribute|
	| ------------ | --------- |
	| email | user.mail |

1. On the **Set-up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

1. On the **Set-up Firmex VDR** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use single sign-on by granting access to Firmex VDR.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Firmex VDR**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Firmex VDR SSO

### Before you get started

#### What you’ll need

-   An active Firmex subscription.
-   Microsoft Entra ID as your SSO service.
-   Your IT administrator to configure SSO.
-   Once SSO is enabled, all of your company’s users must log in to Firmex using SSO, and not using a login/password.

#### How long will this take?

Implementing SSO takes a few minutes. There is virtually no downtime between Firmex Support enabling SSO for your site, and your company’s users authenticating using SSO. Just follow the steps below.

### Step 1 - Identify your company’s domains

Identify the domains with which your company’s users are logging in.

For example:

- @firmex.com.
- @firmex.ca.

### Step 2 - Contact Firmex Support with your domains

Email [Firmex Support Team](mailto:support@firmex.com) or call 1888 688 4042 x.11 to speak to Firmex Support. Pass along your domain information. Firmex Support will add the domains to your VDR as **claimed domains**. Your admin must now configure SSO.

Warning: Until your site admin configures the claimed domains, your company’s users will not be able to log in to the VDR. Non-company users (that is, guest users) can still log in using their email/password. Configuration should take a few minutes.

### Step 3 - Configure the claimed domains

1. Log in to Firmex as a Site Administrator.
1. From the top-left corner, click your company logo.
1. Select the  **SSO**  tab. Then select  **SSO Configuration**. Click the domain you want to configure.

    ![Claimed Domains](./media/firmex-vdr-tutorial/domain.png)  

1. Have your IT Administrator fill in the following fields. The fields should be taken from your identity provider:  

    ![SSO Configuration](./media/firmex-vdr-tutorial/admin.png)

    a. In the **Entity ID** textbox, paste the **Microsoft Entra Identifier** value, which you copied previously.

    b. In the **Identity Provider URL** textbox, paste the **Login URL** value, which you copied previously.

    c. **Public Key Certificate**  - For authentication purposes, a SAML message may be digitally signed by the issuer. To verify the signature on the message, the message receiver uses a public key known to belong to the issuer. Similarly, to encrypt a message, a public encryption key belonging to the ultimate receiver must be known to the issuer. In both situations—signing and encryption—trusted public keys must be shared in advance.  This is the **X509Certificate** from **Federation Metadata XML**

    d. Click **Save** to complete the SSO configuration. Changes take effect immediately.

1. At this time, SSO is enabled for your site.

### Create Firmex VDR test user

In this section, you create a user called B.Simon in Firmex. Work with [Firmex Support Team](mailto:support@firmex.com) to add the users in the Firmex platform. Users must be created and activated before you use single sign-on.

## Test SSO

In this section, you test your Microsoft Entra single sign-on configuration with the following options. 

#### SP initiated:

* Click on **Test this application**, this will redirect to Firmex VDR Sign on URL where you can initiate the login flow.  

* Go to Firmex VDR Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application**, and you should be automatically signed in to the Firmex VDR for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the Firmex VDR tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the Firmex VDR for which you set up the SSO. For more information, see [Microsoft Entra My Apps](/azure/active-directory/manage-apps/end-user-experiences#azure-ad-my-apps).

## Next steps

Once you configure Firmex VDR you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).

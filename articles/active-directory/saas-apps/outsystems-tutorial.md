---
title: 'Tutorial: Microsoft Entra integration with OutSystems Microsoft Entra ID'
description: Learn how to configure single sign-on between Microsoft Entra ID and OutSystems Microsoft Entra ID.
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

# Tutorial: Integrate OutSystems Microsoft Entra ID with Microsoft Entra ID

In this tutorial, you'll learn how to integrate OutSystems Microsoft Entra ID with Microsoft Entra ID. When you integrate OutSystems Microsoft Entra ID with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to OutSystems Microsoft Entra ID.
* Enable your users to be automatically signed-in to OutSystems Microsoft Entra ID with their Microsoft Entra accounts.
* Manage your accounts in one central location.

## Prerequisites

To get started, you need the following items:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* OutSystems Microsoft Entra single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Microsoft Entra SSO in a test environment.

* OutSystems Microsoft Entra ID supports **SP and IDP** initiated SSO and supports **Just In Time** user provisioning.

<a name='add-outsystems-azure-ad-from-the-gallery'></a>

## Add OutSystems Microsoft Entra ID from the gallery

To configure the integration of OutSystems Microsoft Entra ID into Microsoft Entra ID, you need to add OutSystems Microsoft Entra ID from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **OutSystems Microsoft Entra ID** in the search box.
1. Select **OutSystems Microsoft Entra ID** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-sso-for-outsystems-azure-ad'></a>

## Configure and test Microsoft Entra SSO for OutSystems Microsoft Entra ID

Configure and test Microsoft Entra SSO with OutSystems Microsoft Entra ID using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in OutSystems Microsoft Entra ID.

To configure and test Microsoft Entra SSO with OutSystems Microsoft Entra ID, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - to test Microsoft Entra single sign-on with B.Simon.
    1. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Microsoft Entra single sign-on.
1. **[Configure OutSystems Microsoft Entra SSO](#configure-outsystems-azure-ad-sso)** - to configure the single sign-on settings on application side.
    1. **[Create OutSystems Microsoft Entra test user](#create-outsystems-azure-ad-test-user)** - to have a counterpart of B.Simon in OutSystems Microsoft Entra ID that is linked to the Microsoft Entra representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **OutSystems Microsoft Entra ID** application integration page, find the **Manage** section and select **Single sign-on**.
1. On the **Select a Single sign-on method** page, select **SAML**.
1. On the **Set up Single Sign-On with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, perform the following steps:

    a. In the **Identifier** text box, type a URL using the following pattern:
    `http://<YOURBASEURL>/IdP`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://<YOURBASEURL>/IdP/SSO.aspx`

1. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://<YOURBASEURL>`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier, Reply URL and Sign-on URL. Contact [OutSystems Client support team](mailto:support@outsystems.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section.

1. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

   ![The Certificate download link](common/metadataxml.png)

1. On the **Set up OutSystems Microsoft Entra ID** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use single sign-on by granting access to OutSystems Microsoft Entra ID.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **OutSystems Microsoft Entra ID**.
1. In the app's overview page, select **Users and groups**.
1. Select **Add user/group**, then select **Users and groups** in the **Add Assignment** dialog.
   1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
   1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
   1. In the **Add Assignment** dialog, click the **Assign** button.

<a name='configure-outsystems-azure-ad-sso'></a>

## Configure OutSystems Microsoft Entra SSO

To configure single sign-on on OutSystems side, you need to download the [IdP forge](https://www.outsystems.com/forge/component-overview/599/idp) component, configure it as mentioned in the [instructions](https://success.outsystems.com/Documentation/Development_FAQs/How_to_configure_OutSystems_to_use_identity_providers_using_SAML#Configure_your_application_to_use_IdP_connector). After installing the component and do the necessary code changes, configure Microsoft Entra ID by downloading Federation Metadata XML from Azure portal and upload on OutSystems IdP component, according to the following [instructions](https://success.outsystems.com/Documentation/Development_FAQs/How_to_configure_OutSystems_to_use_identity_providers_using_SAML#Azure_AD_.2F_ADFS).

<a name='create-outsystems-azure-ad-test-user'></a>

### Create OutSystems Microsoft Entra test user

In this section, a user called B.Simon is created in OutSystems. OutSystems supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in OutSystems, a new one is created after authentication.

## Test SSO

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application**, this will redirect to OutSystems Microsoft Entra ID Sign on URL where you can initiate the login flow.  

* Go to OutSystems Microsoft Entra Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application**, and you should be automatically signed in to the OutSystems Microsoft Entra ID for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the OutSystems Microsoft Entra ID tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the OutSystems Microsoft Entra ID for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

Once you configure OutSystems Microsoft Entra ID you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-any-app).

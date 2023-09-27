---
title: Microsoft Entra SSO integration with Serenity Connect.
description: Learn how to configure single sign-on between Microsoft Entra ID and Serenity Connect.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: how-to
ms.date: 09/25/2023
ms.author: jeedes

---

# Microsoft Entra SSO integration with Serenity Connect

In this tutorial, you learn how to integrate Serenity Connect with Microsoft Entra ID. When you integrate Serenity Connect with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to Serenity Connect.
* Enable your users to be automatically signed-in to Serenity Connect with their Microsoft Entra accounts.
* Manage your accounts in one central location.

## Prerequisites

To integrate Microsoft Entra ID with Serenity Connect, you need:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Serenity Connect single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Microsoft Entra SSO in a test environment.

* Serenity Connect supports **SP** initiated SSO.

## Adding Serenity Connect from the gallery

To configure the integration of Serenity Connect into Microsoft Entra ID, you need to add Serenity Connect from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **Serenity Connect** in the search box.
1. Select **Serenity Connect** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, and walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Microsoft Entra SSO for Serenity Connect

Configure and test Microsoft Entra SSO with Serenity Connect using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in Serenity Connect.

To configure and test Microsoft Entra SSO with Serenity Connect, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-microsoft-entra-sso)** - to enable your users to use this feature.
    1. **[Create a Microsoft Entra ID test user](#create-a-microsoft-entra-id-test-user)** - to test Microsoft Entra single sign-on with B.Simon.
    1. **[Assign the Microsoft Entra ID test user](#assign-the-microsoft-entra-id-test-user)** - to enable B.Simon to use Microsoft Entra single sign-on.
1. **[Configure Serenity Connect SSO](#configure-serenity-connect-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Serenity Connect test user](#create-serenity-connect-test-user)** - to have a counterpart of B.Simon in Serenity Connect that is linked to the Microsoft Entra ID representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO in the Microsoft Entra admin center.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Serenity Connect** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   [ ![Screenshot shows how to edit Basic SAML Configuration.](common/edit-urls.png "Basic Configuration") ](common/edit-urls.png#lightbox)

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier** textbox, type a value using the following pattern:
    `urn:amazon:cognito:sp:us-east-2_<SerenityUniqueID>`

    b. In the **Reply URL** textbox, type the URL:
    `https://serenityconnect.auth.us-east-2.amazoncognito.com/saml2/idpresponse`

    c. In the **Sign on URL** textbox, type the URL:
	`https://app.serenityconnect.com/sso-sign-in`

	> [!NOTE]
    > This value is not real. Update this value with the actual Identifier. Contact [Serenity Connect support team](mailto:hello@serenityconnect.com) to get the value. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Microsoft Entra admin center.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section, click copy button to copy **App Federation Metadata Url** and save it on your computer.

	[ ![Screenshot shows the Certificate download link.](common/copy-metadataurl.png "Certificate") ](common/copy-metadataurl.png#lightbox)

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

In this section, you enable B.Simon to use Microsoft Entra single sign-on by granting access to Serenity Connect.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Serenity Connect**.
1. In the app's overview page, select **Users and groups**.
1. Select **Add user/group**, then select **Users and groups** in the **Add Assignment** dialog.
   1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
   1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
   1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Serenity Connect SSO

To configure single sign-on on **Serenity Connect** side, you need to send the **App Federation Metadata Url** to [Serenity Connect support team](mailto:hello@serenityconnect.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Serenity Connect test user

In this section, you create a user called B.Simon in Serenity Connect. Work with [Serenity Connect support team](mailto:hello@serenityconnect.com) to add the users in the Serenity Connect platform. Users must be created and activated before you use single sign-on.

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options.
 
* Click on **Test this application** in Microsoft Entra admin center. This will redirect to Serenity Connect Sign-on URL where you can initiate the login flow.
 
* Go to Serenity Connect Sign-on URL directly and initiate the login flow from there.
 
* You can use Microsoft My Apps. When you click the Serenity Connect tile in the My Apps, this will redirect to Serenity Connect Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next Steps

Once you configure Serenity Connect you can enforce session control, which protects exfiltration and infiltration of your organization's sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-any-app)

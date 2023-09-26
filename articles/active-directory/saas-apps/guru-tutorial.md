---
title: Microsoft Entra SSO integration with Guru
description: Learn how to configure single sign-on between Microsoft Entra ID and Guru.
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

# Microsoft Entra SSO integration with Guru

In this tutorial, you learn how to integrate Guru with Microsoft Entra ID. When you integrate Guru with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to Guru.
* Enable your users to be automatically signed-in to Guru with their Microsoft Entra accounts.
* Manage your accounts in one central location.

## Prerequisites

To integrate Microsoft Entra ID with Guru, you need:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Guru single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Microsoft Entra SSO in a test environment.

* Guru supports **IDP** initiated SSO.
* Guru supports **Just In Time** user provisioning.

## Adding Guru from the gallery

To configure the integration of Guru into Microsoft Entra ID, you need to add Guru from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **Guru** in the search box.
1. Select **Guru** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, and walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides).

## Configure and test Microsoft Entra SSO for Guru

Configure and test Microsoft Entra SSO with Guru using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in Guru.

To configure and test Microsoft Entra SSO with Guru, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-microsoft-entra-sso)** - to enable your users to use this feature.
    1. **[Create a Microsoft Entra ID test user](#create-a-microsoft-entra-id-test-user)** - to test Microsoft Entra single sign-on with B.Simon.
    1. **[Assign the Microsoft Entra ID test user](#assign-the-microsoft-entra-id-test-user)** - to enable B.Simon to use Microsoft Entra single sign-on.
1. **[Configure Guru SSO](#configure-guru-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Guru test user](#create-guru-test-user)** - to have a counterpart of B.Simon in Guru that is linked to the Microsoft Entra ID representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO in the Microsoft Entra admin center.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Guru** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot shows how to edit Basic SAML Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier** textbox, type a value using the following pattern:
    `getguru.com/<TeamID>`

    b. In the **Reply URL** textbox, type a URL using the following pattern:
    `https://api.getguru.com/samlsso/<TeamID>`

    > [!NOTE]
    > These values are not real. Update these values with the actual Identifier and Reply URL. You can get `TeamID` from **[Configure Guru SSO](#configure-guru-sso)** section. If you have any queries, please contact [Guru support team](mailto:support@getguru.com). You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Microsoft Entra admin center.

1. Guru application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

	![Screenshot shows the image of attributes configuration.](common/default-attributes.png "Image")

1. In addition to above, Guru application expects few more attributes to be passed back in SAML response which are shown below. These attributes are also pre populated but you can review them as per your requirements.
	
	| Name |  Source Attribute|
	| ---------------|  --------- |
	| firstName | user.givenname |
	| lastName | user.surname |

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section, find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![Screenshot shows the Certificate download link.](common/certificatebase64.png "Certificate")

1. On the **Set up Guru** section, copy the appropriate URL(s) based on your requirement.

	![Screenshot shows to copy configuration URLs.](common/copy-configuration-urls.png "Metadata")

### Create a Microsoft Entra ID test user

In this section, you create a test user in the Microsoft Entra admin center called B.Simon.

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

In this section, you enable B.Simon to use Microsoft Entra single sign-on by granting access to Guru.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Guru**.
1. In the app's overview page, select **Users and groups**.
1. Select **Add user/group**, then select **Users and groups** in the **Add Assignment** dialog.
   1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
   1. If you're expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
   1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Guru SSO

1. Log in to your Guru company site as an administrator.

1. Go to **Settings** > **Apps and Integrations** and click **SSO/SCIM**.

1. In the **SSO/SCIM** section, perform the following steps:

    ![Screenshot shows the administration portal.](media/guru-tutorial/manage.png "Admin")

    1. Copy **Team ID** and save it to your computer.

    1. Copy **Single Sign On Url**, paste this value into the **Reply URL** text box in the **Basic SAML Configuration** section in the Microsoft Entra admin center.

    1. Copy **Audience URI**, paste this value into the **Identifier** text box in the **Basic SAML Configuration** section in the Microsoft Entra admin center.

    1. In the **Identity Provider Single Sign-On Url** textbox, paste the **Login URL** value, which you have copied from the Microsoft Entra admin center.

    1. In the **Identity Provider Issuer** textbox, paste the **Microsoft Entra ID Identifier** value, which you have copied from the Microsoft Entra admin center.

    1. Open the downloaded **Certificate (Base64)** from the Microsoft Entra admin center into Notepad and paste the content into the  **X.509 Certificate** textbox.

    1. Click **Enable SSO**.

### Create Guru test user

In this section, a user called B.Simon is created in Guru. Guru supports just-in-time provisioning, which is enabled by default. There's no action item for you in this section. If a user doesn't already exist in Guru, a new one is created when you attempt to access Guru.

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options.
 
* Click on Test this application in Microsoft Entra admin center and you should be automatically signed in to the Guru for which you set up the SSO.
 
* You can use Microsoft My Apps. When you click the Guru tile in the My Apps, you should be automatically signed in to the Guru for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next Steps

Once you configure Guru you can enforce session control, which protects exfiltration and infiltration of your organization's sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-any-app).
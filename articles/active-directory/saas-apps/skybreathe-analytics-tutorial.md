---
title: 'Tutorial: Microsoft Entra SSO integration with Skybreathe® Analytics'
description: Learn how to configure single sign-on between Microsoft Entra ID and Skybreathe® Analytics.
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

# Tutorial: Microsoft Entra SSO integration with Skybreathe® Analytics

In this tutorial, you'll learn how to integrate Skybreathe® Analytics with Microsoft Entra ID. When you integrate Skybreathe® Analytics with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to Skybreathe® Analytics.
* Enable your users to be automatically signed-in to Skybreathe® Analytics with their Microsoft Entra accounts.
* Manage your accounts in one central location.

## Prerequisites

To get started, you need the following items:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Skybreathe® Analytics single sign-on (SSO) enabled subscription.
* Along with Cloud Application Administrator, Application Administrator can also add or manage applications in Microsoft Entra ID.
For more information, see [Azure built-in roles](../roles/permissions-reference.md).

## Scenario description

In this tutorial, you configure and test Microsoft Entra SSO in a test environment.

* Skybreathe® Analytics supports **SP** and **IDP** initiated SSO.

## Add Skybreathe® Analytics from the gallery

To configure the integration of Skybreathe® Analytics into Microsoft Entra ID, you need to add Skybreathe® Analytics from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **Skybreathe® Analytics** in the search box.
1. Select **Skybreathe® Analytics** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-sso-for-skybreathe-analytics'></a>

## Configure and test Microsoft Entra SSO for Skybreathe® Analytics

Configure and test Microsoft Entra SSO with Skybreathe® Analytics using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in Skybreathe® Analytics.

To configure and test Microsoft Entra SSO with Skybreathe® Analytics, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
   1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - to test Microsoft Entra single sign-on with B.Simon.
   1. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Microsoft Entra single sign-on.
1. **[Configure Skybreathe Analytics SSO](#configure-skybreathe-analytics-sso)** - to configure the single sign-on settings on application side.
   1. **[Create Skybreathe Analytics test user](#create-skybreathe-analytics-test-user)** - to have a counterpart of B.Simon in Skybreathe® Analytics that is linked to the Microsoft Entra representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Skybreathe® Analytics** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot shows to edit Basic S A M L Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, perform the following steps:

   1. In the **Identifier** text box, type a URL using the following pattern: 
   `https://auth.skybreathe.com/auth/realms/<ICAO>`
`
   1. In the **Reply URL** text box, type a URL using the following pattern: 
   `https://auth.skybreathe.com/auth/realms/<ICAO>/broker/sbfe-<icao>-idp/endpoint/client/sso`

1. Click **Set additional URLs** and perform the following steps if you wish to configure the application in SP initiated mode:

   1. In the **Reply URL** text box, type a URL using the following pattern: 
   `https://auth.skybreathe.com/auth/realms/<ICAO>/broker/sbfe-<icao>-idp/endpoint`

   1. In the **Sign-on URL** text box, type a URL using the following pattern: 
   `https://<domain>.skybreathe.com/saml/login`
   
   > [!NOTE]
   > These values are not real. Update these values with the actual Identifier, Reply URL and Sign-on URL. Contact [Skybreathe® Analytics Client support team](mailto:support@openairlines.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section.

1. Skybreathe® Analytics application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

   ![Screenshot shows the image of attribute mappings.](common/default-attributes.png "Attributes")

1. In addition to above, Skybreathe® Analytics application expects few more attributes to be passed back in SAML response, which are shown below. These attributes are also pre populated but you can review them as per your requirements.

   | Name | Source Attribute|
   | ------------ | --------- |
   | firstname | user.givenname |
   | initials | user.employeeid |
   | lastname | user.surname |
   | groups | user.groups |

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section, click copy button to copy **App Federation Metadata Url** and save it on your computer.

	![Screenshot shows the Certificate download link.](common/copy-metadataurl.png "Certificate")

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

In this section, you'll enable B.Simon to use single sign-on by granting access to Skybreathe® Analytics.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Skybreathe® Analytics**.
1. In the app's overview page, select **Users and groups**.
1. Select **Add user/group**, then select **Users and groups** in the **Add Assignment** dialog.
   1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
   1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
   1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Skybreathe Analytics SSO

To configure single sign-on on **Skybreathe® Analytics** side, you need to send the **App Federation Metadata Url** to [Skybreathe® Analytics support team](mailto:support@openairlines.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Skybreathe Analytics test user

In this section, you create a user called Britta Simon in Skybreathe® Analytics. Work with [Skybreathe® Analytics support team](mailto:support@openairlines.com) to add the users in the Skybreathe® Analytics platform. Users must be created and activated before you use single sign-on.

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application**, this will redirect to Skybreathe® Analytics Sign-on URL where you can initiate the login flow.  

* Go to Skybreathe® Analytics Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application**, and you should be automatically signed in to the Skybreathe® Analytics for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the Skybreathe® Analytics tile in the My Apps, if configured in SP mode you would be redirected to the application sign-on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the Skybreathe® Analytics for which you set up the SSO. For more information, see [Microsoft Entra My Apps](/azure/active-directory/manage-apps/end-user-experiences#azure-ad-my-apps).

## Next steps

Once you configure Skybreathe® Analytics you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-any-app).

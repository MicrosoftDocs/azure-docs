---
title: 'Tutorial: Microsoft Entra SSO integration with Insignia SAML SSO'
description: Learn how to configure single sign-on between Microsoft Entra ID and Insignia SAML SSO.
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
# Tutorial: Microsoft Entra SSO integration with Insignia SAML SSO

In this tutorial, you'll learn how to integrate Insignia SAML SSO with Microsoft Entra ID. When you integrate Insignia SAML SSO with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to Insignia SAML SSO.
* Enable your users to be automatically signed-in to Insignia SAML SSO with their Microsoft Entra accounts.
* Manage your accounts in one central location.


## Prerequisites

To configure Microsoft Entra integration with Insignia SAML SSO, you need the following items:

* A Microsoft Entra subscription. If you don't have a Microsoft Entra environment, you can get a [free account](https://azure.microsoft.com/free/).
* Insignia SAML SSO single sign-on enabled subscription.

## Scenario description

In this tutorial, you configure and test Microsoft Entra single sign-on in a test environment.

* Insignia SAML SSO supports **SP** initiated SSO.

## Add Insignia SAML SSO from the gallery

To configure the integration of Insignia SAML SSO into Microsoft Entra ID, you need to add Insignia SAML SSO from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **Insignia SAML SSO** in the search box.
1. Select **Insignia SAML SSO** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-sso-for-insignia-saml-sso'></a>

## Configure and test Microsoft Entra SSO for Insignia SAML SSO

Configure and test Microsoft Entra SSO with Insignia SAML SSO using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in Insignia SAML SSO.

To configure and test Microsoft Entra SSO with Insignia SAML SSO, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - to test Microsoft Entra single sign-on with B.Simon.
    2. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Microsoft Entra single sign-on.
2. **[Configure Insignia SAML SSO](#configure-insignia-saml-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Insignia SAML SSO test user](#create-insignia-saml-sso-test-user)** - to have a counterpart of B.Simon in Insignia SAML SSO that is linked to the Microsoft Entra representation of user.
3. **[Test SSO](#test-sso)** - to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Insignia SAML SSO** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot showing the edit Basic SAML Configuration screen.](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, perform the following steps:

	a. In the **Sign on URL** text box, type a URL using one of the following patterns:
	
   | Sign on URL|
   |------------|
   | `https://<customername>.insigniails.com/ils` |
   | `https://<customername>.insigniails.com/` |
   | `https://<customername>.insigniailsusa.com/` |
   |
	
	b. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:
    `https://<customername>.insigniailsusa.com/<uniqueid>`

	> [!NOTE]
	> These values are not real. Update these values with the actual Sign on URL and Identifier. Contact [Insignia SAML SSO Client support team](http://www.insigniasoftware.com/insignia/Techsupport.aspx) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section.

1. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Base64)** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. On the **Set up Insignia SAML SSO** section, copy the appropriate URL(s) as per your requirement.

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

In this section, you'll enable B.Simon to use single sign-on by granting access to Insignia SAML SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Insignia SAML SSO**.
3. In the app's overview page, find the **Manage** section and select **Users and groups**.
4. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
5. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
6. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
7. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Insignia SAML SSO

To configure single sign-on on **Insignia SAML SSO** side, you need to send the downloaded **Certificate (Base64)** and appropriate copied URLs from the application configuration to [Insignia SAML SSO support team](http://www.insigniasoftware.com/insignia/Techsupport.aspx). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Insignia SAML SSO test user

In this section, you create a user called Britta Simon in Insignia SAML SSO. Work with [Insignia SAML SSO support team](http://www.insigniasoftware.com/insignia/Techsupport.aspx) to add the users in the Insignia SAML SSO platform. Users must be created and activated before you use single sign-on.

## Test SSO

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

* Click on **Test this application**, this will redirect to Insignia SAML SSO Sign-on URL where you can initiate the login flow. 

* Go to Insignia SAML SSO Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Insignia SAML SSO tile in the My Apps, this will redirect to Insignia SAML SSO Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

Once you configure Insignia SAML SSO you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).

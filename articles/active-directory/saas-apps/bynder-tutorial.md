---
title: Microsoft Entra SSO integration with Bynder.
description: Learn how to configure single sign-on between Microsoft Entra ID and Bynder.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 09/28/2023
ms.author: jeedes
---

# Tutorial: Integrate Bynder with Microsoft Entra ID

In this tutorial, you'll learn how to integrate Bynder with Microsoft Entra ID. When you integrate Bynder with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to Bynder.
* Enable your users to be automatically signed-in to Bynder with their Microsoft Entra accounts.
* Manage your accounts in one central location.

## Prerequisites

To get started, you need the following items:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Bynder single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Microsoft Entra SSO in a test environment.

* Bynder supports **SP and IDP** initiated SSO.
* Bynder supports **Just In Time** user provisioning.

## Add Bynder from the gallery

To configure the integration of Bynder into Microsoft Entra ID, you need to add Bynder from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **Bynder** in the search box.
1. Select **Bynder** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-sso'></a>

## Configure and test Microsoft Entra SSO

Configure and test Microsoft Entra SSO with Bynder using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in Bynder.

To configure and test Microsoft Entra SSO with Bynder, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-microsoft-entra-sso)** - to enable your users to use this feature.
   1. **[Create a Microsoft Entra test user](#create-a-microsoft-entra-test-user)** - to test Microsoft Entra single sign-on with Britta Simon.
   1. **[Assign the Microsoft Entra test user](#assign-the-microsoft-entra-test-user)** - to enable Britta Simon to use Microsoft Entra single sign-on.
1. **[Configure Bynder SSO](#configure-bynder-sso)** - to configure the single sign-on settings on application side.
   1. **[Create Bynder test user](#create-bynder-test-user)** - to have a counterpart of Britta Simon in Bynder that is linked to the Microsoft Entra representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Сreate New Bynder Configuration

First you need to log in to your Bynder account and follow [these](https://support.bynder.com/hc/articles/6614562131474#UUID-4f8db699-3079-496d-d29e-706b28e4631a_section-idm4615912229660833479548407237) steps to create a new login configuration in your portal. This way you will generate all identifiers necessary to set up your connection with Microsoft Entra. Save the new configuration's identifier, you will need it to set up Microsoft Entra SAML SSO.

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Bynder** application integration page, find the **Manage** section and select **Single sign-on**.
1. On the **Select a Single sign-on method** page, select **SAML**.
1. On the **Set up Single Sign-On with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot shows to Edit Basic SAML Configuration.](common/edit-urls.png)

   > [!NOTE]
	> For BYNDER_CONFIG_ID use an identifier value you got from **Сreate New Bynder Configuration** section.

1. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, enter the values for the following fields:

   a. In the **Identifier** text box, type a URL using the following pattern:
    
   For a Default Domain: 
   `https://<COMPANY_NAME>.bynder.com/v7/idp/sso/saml/<BYNDER_CONFIG_ID>/metadata`
    
   For a Custom Domain: 
   `https://<SUBDOMAIN>.<DOMAIN>.com/v7/idp/sso/saml/<BYNDER_CONFIG_ID>/metadata`

   b. In the **Reply URL** text box, type a URL using the following pattern:
    
   For a Default Domain: 
   `https://<COMPANY_NAME>.bynder.com/v7/idp/sso/saml/<BYNDER_CONFIG_ID>/acs`
    
   For a Custom Domain: 
   `https://<SUBDOMAIN>.<DOMAIN>.com/v7/idp/sso/saml/<BYNDER_CONFIG_ID>/acs`

1. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

   In the **Sign-on URL** text box, type a URL using the following pattern:
    
   For a Default Domain: 
   `https://<COMPANY_NAME>.bynder.com/v7/idp/sso/saml/<BYNDER_CONFIG_ID>/acs`
    
   For a Custom Domain: 
   `https://<SUBDOMAIN>.<DOMAIN>.com/v7/idp/sso/saml/<BYNDER_CONFIG_ID>/acs`

1. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section,  find **Metadata XML** and select **Download** to download the certificate and save it on your computer.

	![Screenshot shows the Certificate download link.](common/metadataxml.png "Certificate")

1. On the **Set up Bynder** section, copy the appropriate URL(s) based on your requirement.

	![Screenshot shows to copy configuration URLs.](common/copy-configuration-urls.png "Metadata")

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

In this section, you'll enable B.Simon to use single sign-on by granting access to Bynder.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Bynder**.
1. In the app's overview page, select **Users and groups**.
1. Select **Add user/group**, then select **Users and groups** in the **Add Assignment** dialog.
   1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
   1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
   1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Bynder SSO

You may configure SSO on **Bynder** side by following this documentation [Configure SAML SSO](https://support.bynder.com/hc/articles/6614562131474#UUID-4f8db699-3079-496d-d29e-706b28e4631a_section-idm4615912229660833479548407237)

### Create Bynder test user

In this section, a user called Britta Simon is created in Bynder. Bynder supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in Bynder, a new one is created after authentication.

> [!NOTE]
> If you need to create a user manually, you need to contact the [Bynder support team](https://www.bynder.com/en/support/).

### Test SSO

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application**, this will redirect to Bynder Sign on URL where you can initiate the login flow.  

* Go to Bynder Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application**, and you should be automatically signed in to the Bynder for which you set up the SSO 

You can also use Microsoft My Apps to test the application in any mode. When you click the Bynder tile in the My Apps, if configured in SP mode you would be redirected to the application sign-on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the Bynder for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

Once you configure Bynder you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-any-app).

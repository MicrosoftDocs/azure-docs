---
title: 'Tutorial: Microsoft Entra single sign-on (SSO) integration with Darwinbox'
description: Learn how to configure single sign-on between Microsoft Entra ID and Darwinbox.
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

# Tutorial: Microsoft Entra single sign-on (SSO) integration with Darwinbox

In this tutorial, you'll learn how to integrate Darwinbox with Microsoft Entra ID. When you integrate Darwinbox with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to Darwinbox.
* Enable your users to be automatically signed-in to Darwinbox with their Microsoft Entra accounts.
* Manage your accounts in one central location.

## Prerequisites

To get started, you need the following items:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Darwinbox single sign-on (SSO) enabled subscription.
> [!NOTE]
> This integration is also available to use from Microsoft Entra US Government Cloud environment. You can find this application in the Microsoft Entra US Government Cloud Application Gallery and configure it in the same way as you do from public cloud.

## Scenario description

In this tutorial, you configure and test Microsoft Entra SSO in a test environment.

* Darwinbox supports **SP** initiated SSO.

## Add Darwinbox from the gallery

To configure the integration of Darwinbox into Microsoft Entra ID, you need to add Darwinbox from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **Darwinbox** in the search box.
1. Select **Darwinbox** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-sso-for-darwinbox'></a>

## Configure and test Microsoft Entra SSO for Darwinbox

Configure and test Microsoft Entra SSO with Darwinbox using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in Darwinbox.

To configure and test Microsoft Entra SSO with Darwinbox, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - to test Microsoft Entra single sign-on with B.Simon.
    1. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Microsoft Entra single sign-on.
1. **[Configure Darwinbox SSO](#configure-darwinbox-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Darwinbox test user](#create-darwinbox-test-user)** - to have a counterpart of B.Simon in Darwinbox that is linked to the Microsoft Entra representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Darwinbox** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, perform the following steps:

   1. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:
      `https://<SUBDOMAIN>.darwinbox.in/adfs/module.php/saml/sp/metadata.php/<CUSTOM_ID>`

    1. In the **Sign on URL** text box, type a URL using the following pattern:
      `https://<SUBDOMAIN>.darwinbox.in/`

      > [!NOTE]
      > These values are not real. Update these values with the actual Identifier and Sign on URL. Contact [Darwinbox Client support team](https://darwinbox.com/contact-us.php) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

1. On the **Set up Darwinbox** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use single sign-on by granting access to Darwinbox.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Darwinbox**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Darwinbox SSO

To configure single sign-on on **Darwinbox** side, you need to send the downloaded **Federation Metadata XML** and appropriate copied URLs from the application configuration to [Darwinbox support team](https://darwinbox.com/contact-us.php). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Darwinbox test user

In this section, you create a user called B.Simon in Darwinbox. Work with [Darwinbox support team](https://darwinbox.com/contact-us.php) to add the users in the Darwinbox platform. Users must be created and activated before you use single sign-on.

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

* Click on **Test this application**, this will redirect to Darwinbox Sign-on URL where you can initiate the login flow. 

* Go to Darwinbox Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Darwinbox tile in the My Apps, this will redirect to Darwinbox Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Test SSO for Darwinbox (Mobile)

1. Open Darwinbox mobile application. Click on **Enter Organization URL** now enter your organization URL in the textbox and click on Arrow button.

    ![Screenshot that shows the "Darwinbox" mobile app with the "Enter Organization U R L" selected, and an example organization and "Arrow" button highlighted.](media/darwinbox-tutorial/login.png)

1. If you have multiple domain, then click on your domain.

    ![Screenshot that shows the "Choose your domain" screen with an example domain selected.](media/darwinbox-tutorial/domain.png)

1. Enter your Microsoft Entra ID email into the Darwinbox application and click **Next**.

    ![Screenshot that shows the "Sign in" screen with the "Next" button highlighted.](media/darwinbox-tutorial/email.png)

1. Enter your Microsoft Entra password into the Darwinbox application and click **Sign in**.

    ![Screenshot that shows the "Sign into options" screen with the "Next" button highlighted.](media/darwinbox-tutorial/account.png)

1. Finally after successful sign in, the application homepage will be displayed.

    ![Darwinbox mobile app](media/darwinbox-tutorial/application.png)

## Next steps

Once you configure Darwinbox you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).

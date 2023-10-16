---
title: 'Tutorial: Microsoft Entra SSO integration with Cyara CX Assurance Platform'
description: Learn how to configure single sign-on between Microsoft Entra ID and Cyara CX Assurance Platform.
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

# Tutorial: Microsoft Entra SSO integration with Cyara CX Assurance Platform

In this tutorial, you'll learn how to integrate Cyara CX Assurance Platform with Microsoft Entra ID. When you integrate Cyara CX Assurance Platform with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to Cyara CX Assurance Platform.
* Enable your users to be automatically signed-in to Cyara CX Assurance Platform with their Microsoft Entra accounts.
* Manage your accounts in one central location.

## Prerequisites

To get started, you need the following items:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Cyara CX Assurance Platform single sign-on (SSO) enabled subscription.
* Along with Cloud Application Administrator, Application Administrator can also add or manage applications in Microsoft Entra ID.
For more information, see [Azure built-in roles](../roles/permissions-reference.md).

## Scenario description

In this tutorial, you configure and test Microsoft Entra SSO in a test environment.

* Cyara CX Assurance Platform supports **IDP** initiated SSO.

## Add Cyara CX Assurance Platform from the gallery

To configure the integration of Cyara CX Assurance Platform into Microsoft Entra ID, you need to add Cyara CX Assurance Platform from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **Cyara CX Assurance Platform** in the search box.
1. Select **Cyara CX Assurance Platform** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-sso-for-cyara-cx-assurance-platform'></a>

## Configure and test Microsoft Entra SSO for Cyara CX Assurance Platform

Configure and test Microsoft Entra SSO with Cyara CX Assurance Platform using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in Cyara CX Assurance Platform.

To configure and test Microsoft Entra SSO with Cyara CX Assurance Platform, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - to test Microsoft Entra single sign-on with B.Simon.
    1. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Microsoft Entra single sign-on.
1. **[Configure Cyara CX Assurance Platform SSO](#configure-cyara-cx-assurance-platform-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Cyara CX Assurance Platform test user](#create-cyara-cx-assurance-platform-test-user)** - to have a counterpart of B.Simon in Cyara CX Assurance Platform that is linked to the Microsoft Entra representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Cyara CX Assurance Platform** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot shows to edit Basic S A M L Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier** text box, type a URL using the following pattern:
    `https://www.cyaraportal.us/cyarawebidentity/identity/<provider>`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://www.cyaraportal.us/cyarawebidentity/identity/<provider>/Acs`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier and Reply URL. Contact [Cyara CX Assurance Platform Client support team](mailto:support@cyara.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section.

1. In the **SAML Signing Certificate** section, click **Edit** button to open **SAML Signing Certificate** dialog.

	![Screenshot shows to Edit SAML Signing Certificate.](common/edit-certificate.png "Certificate")

1. In the **SAML Signing Certificate** section, copy the **Thumbprint Value** and save it on your computer.

    ![Screenshot shows to Copy Thumbprint value.](common/copy-thumbprint.png "Thumbprint")

1. On the **Set up Cyara CX Assurance Platform** section, copy the appropriate URL(s) based on your requirement.

	![Screenshot shows to copy configuration appropriate U R L.](common/copy-configuration-urls.png "Metadata")

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

In this section, you'll enable B.Simon to use single sign-on by granting access to Cyara CX Assurance Platform.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Cyara CX Assurance Platform**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Cyara CX Assurance Platform SSO

To configure single sign-on on **Cyara CX Assurance Platform** side, you need to send the **Thumbprint Value** and appropriate copied URLs from the application configuration to [Cyara CX Assurance Platform support team](mailto:support@cyara.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Cyara CX Assurance Platform test user

In this section, you create a user called Britta Simon in Cyara CX Assurance Platform. Work with [Cyara CX Assurance Platform support team](mailto:support@cyara.com) to add the users in the Cyara CX Assurance Platform platform. Users must be created and activated before you use single sign-on.

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options.

* Click on **Test this application**, and you should be automatically signed in to the Cyara CX Assurance Platform for which you set up the SSO.

* You can use Microsoft My Apps. When you click the Cyara CX Assurance Platform tile in the My Apps, you should be automatically signed in to the Cyara CX Assurance Platform for which you set up the SSO. For more information, see [Microsoft Entra My Apps](/azure/active-directory/manage-apps/end-user-experiences#azure-ad-my-apps).

## Next steps

Once you configure Cyara CX Assurance Platform you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).

---
title: 'Tutorial: Microsoft Entra SSO integration with SECURE DELIVER'
description: Learn how to configure single sign-on between Microsoft Entra ID and SECURE DELIVER.
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

# Tutorial: Microsoft Entra SSO integration with SECURE DELIVER

In this tutorial, you'll learn how to integrate SECURE DELIVER with Microsoft Entra ID. When you integrate SECURE DELIVER with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to SECURE DELIVER.
* Enable your users to be automatically signed-in to SECURE DELIVER with their Microsoft Entra accounts.
* Manage your accounts in one central location.

## Prerequisites

To configure Microsoft Entra integration with SECURE DELIVER, you need the following items:

* A Microsoft Entra subscription. If you don't have a Microsoft Entra environment, you can get a [free account](https://azure.microsoft.com/free/).
* SECURE DELIVER single sign-on enabled subscription.
* Along with Cloud Application Administrator, Application Administrator can also add or manage applications in Microsoft Entra ID.
For more information, see [Azure built-in roles](../roles/permissions-reference.md).

## Scenario description

In this tutorial, you configure and test Microsoft Entra single sign-on in a test environment.

* SECURE DELIVER supports **SP** initiated SSO.

* SECURE DELIVER supports [Automated user provisioning](secure-deliver-provisioning-tutorial.md).

## Add SECURE DELIVER from the gallery

To configure the integration of SECURE DELIVER into Microsoft Entra ID, you need to add SECURE DELIVER from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **SECURE DELIVER** in the search box.
1. Select **SECURE DELIVER** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-sso-for-secure-deliver'></a>

## Configure and test Microsoft Entra SSO for SECURE DELIVER

Configure and test Microsoft Entra SSO with SECURE DELIVER using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in SECURE DELIVER.

To configure and test Microsoft Entra SSO with SECURE DELIVER, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - to test Microsoft Entra single sign-on with B.Simon.
    1. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Microsoft Entra single sign-on.
1. **[Configure SECURE DELIVER SSO](#configure-secure-deliver-sso)** - to configure the single sign-on settings on application side.
    1. **[Create SECURE DELIVER test user](#create-secure-deliver-test-user)** - to have a counterpart of B.Simon in SECURE DELIVER that is linked to the Microsoft Entra representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **SECURE DELIVER** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:
    `https://<companyname>.i-securedeliver.jp/sd/<tenantname>/postResponse`

	b. In the **Sign on URL** text box, type a URL using the following pattern:
    `https://<companyname>.i-securedeliver.jp/sd/<tenantname>/jsf/login/sso`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier and Sign on URL. Contact [SECURE DELIVER Client support team](mailto:iw-sd-support@fujifilm.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section.

1. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

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

In this section, you'll enable B.Simon to use single sign-on by granting access to SECURE DELIVER.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **SECURE DELIVER**.
1. In the app's overview page, select **Users and groups**.
1. Select **Add user/group**, then select **Users and groups** in the **Add Assignment** dialog.
   1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
   1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
   1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure SECURE DELIVER SSO

To configure single sign-on on **SECURE DELIVER** side, you need to send the downloaded **Federation Metadata XML** and appropriate copied URLs from the application configuration to [SECURE DELIVER support team](mailto:iw-sd-support@fujifilm.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create SECURE DELIVER test user

In this section, you create a user called Britta Simon in SECURE DELIVER. Work with [SECURE DELIVER support team](mailto:iw-sd-support@fujifilm.com) to add the users in the SECURE DELIVER platform. Users must be created and activated before you use single sign-on.

SECURE DELIVER also supports automatic user provisioning, you can find more details [here](./secure-deliver-provisioning-tutorial.md) on how to configure automatic user provisioning.

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

* Click on **Test this application**, this will redirect to SECURE DELIVER Sign-on URL where you can initiate the login flow. 

* Go to SECURE DELIVER Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the SECURE DELIVER tile in the My Apps, this will redirect to SECURE DELIVER Sign-on URL. For more information, see [Microsoft Entra My Apps](/azure/active-directory/manage-apps/end-user-experiences#azure-ad-my-apps).

## Next steps

Once you configure SECURE DELIVER you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).

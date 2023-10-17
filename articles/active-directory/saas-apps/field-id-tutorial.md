---
title: 'Tutorial: Microsoft Entra SSO integration with Field iD'
description: Learn how to configure single sign-on between Microsoft Entra ID and Field iD.
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

# Tutorial: Microsoft Entra SSO integration with Field iD

In this tutorial, you'll learn how to integrate Field iD with Microsoft Entra ID. When you integrate Field iD with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to Field iD.
* Enable your users to be automatically signed in to Field iD with their Microsoft Entra accounts.
* Manage your accounts in one central location: the Azure portal.

## Prerequisites

To get started, you need:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* A Field iD single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Microsoft Entra SSO in a test environment.

* Field iD supports IDP initiated SSO.

## Add Field iD from the gallery

To configure the integration of Field iD into Microsoft Entra ID, you need to add Field iD from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **Field iD** in the search box.
1. Select **Field iD** from results panel, and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-sso-for-field-id'></a>

## Configure and test Microsoft Entra SSO for Field iD

Configure and test Microsoft Entra SSO with Field iD by using a test user called **B.Simon**. For SSO to work, you need to establish a linked relationship between a Microsoft Entra user and the related user in Field iD.

To configure and test Microsoft Entra SSO with Field iD, complete the following steps:

1. [Configure Microsoft Entra SSO](#configure-azure-ad-sso) to enable your users to use this feature.
   1. [Create a Microsoft Entra test user](#create-an-azure-ad-test-user) to test Microsoft Entra single sign-on with B.Simon.
   1. [Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user) to enable B.Simon to use Microsoft Entra single sign-on.
1. [Configure Field iD SSO](#configure-field-id-sso) to configure the single sign-on settings on the application side.
   1. [Create a Field iD test user](#create-a-field-id-test-user) to have a counterpart of B.Simon in Field iD, linked to the Microsoft Entra representation of the user.
1. [Test SSO](#test-sso) to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Field iD** application integration page, find the **Manage** section. Then select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot of Set up Single Sign-On with SAML page, with the pencil icon highlighted](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, perform the following steps:

   a. In the **Identifier** text box, type a URL that uses the following pattern:
    `https://<tenantname>.fieldid.com/fieldid`

   b. In the **Reply URL** text box, type a URL that uses the following pattern:
    `https://<tenantname>.fieldid.com/fieldid/saml/SSO/alias/<Tenant Name>`

	> [!NOTE]
	> These values aren't real. Update these values with the actual Identifier and Reply URL. Contact the [Field iD support team](mailto:support@ecompliance.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section, select the copy icon to copy **App Federation Metadata Url**. Save it on your computer.

	![Screenshot of SAML Signing Certificate, with copy icon highlighted](common/copy-metadataurl.png)

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

In this section, you'll enable B.Simon to use single sign-on by granting access to Field iD.

1. Browse to **Identity** > **Applications** > **Enterprise applications**.
1. In the applications list, select **Field iD**.
1. In the app's overview page, find the **Manage** section, and select **Users and groups**.
1. Select **Add user**, and then select **Users and groups** in the **Add Assignment** dialog box.
1. In the **Users and groups** dialog box, select **B.Simon** from the **Users** list, and then choose **Select** at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog box, select the appropriate role for the user from the list. Then choose **Select** at the bottom of the screen.
1. In the **Add Assignment** dialog box, select **Assign**.

## Configure Field iD SSO

To configure single sign-on on Field iD side, send the **App Federation Metadata Url** to the [Field iD support team](mailto:support@ecompliance.com). They ensure that the SAML SSO connection is set properly on both sides.

### Create a Field iD test user

In this section, you create a user called Britta Simon in Field iD. Work with the [Field iD support team](mailto:support@ecompliance.com) to add the users in the Field iD platform. Users must be created and activated before you use single sign-on.

## Test SSO

In this section, you test your Microsoft Entra single sign-on configuration with following options.

* Click on **Test this application**, and you should be automatically signed in to the Field iD for which you set up the SSO.

* You can use Microsoft My Apps. When you click the Field iD tile in the My Apps, you should be automatically signed in to the Field iD for which you set up the SSO. For more information, see [Microsoft Entra My Apps](/azure/active-directory/manage-apps/end-user-experiences#azure-ad-my-apps).

## Next steps

Once you configure Field iD you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).

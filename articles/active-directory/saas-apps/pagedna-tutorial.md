---
title: 'Tutorial: Microsoft Entra SSO integration with PageDNA'
description: Learn how to configure single sign-on between Microsoft Entra ID and PageDNA.
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

# Tutorial: Microsoft Entra SSO integration with PageDNA

In this tutorial, you'll learn how to integrate PageDNA with Microsoft Entra ID. When you integrate PageDNA with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to PageDNA.
* Enable your users to be automatically signed-in to PageDNA with their Microsoft Entra accounts.
* Manage your accounts in one central location.

## Prerequisites

To configure Microsoft Entra integration with PageDNA, you need the following items:

* A Microsoft Entra subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.
* A PageDNA subscription with single sign-on enabled.
* Along with Cloud Application Administrator, Application Administrator can also add or manage applications in Microsoft Entra ID. For more information, see [Azure built-in roles](../roles/permissions-reference.md).

## Scenario description

In this tutorial, you configure and test Microsoft Entra single sign-on in a test environment and integrate PageDNA with Microsoft Entra ID.

PageDNA supports the following features:

* SP-initiated single sign-on (SSO).

* Just-in-time user provisioning.

## Add PageDNA from the Azure Marketplace

To configure the integration of PageDNA into Microsoft Entra ID, you need to add PageDNA from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **PageDNA** in the search box.
1. Select **PageDNA** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-sso-for-pagedna'></a>

## Configure and test Microsoft Entra SSO for PageDNA

Configure and test Microsoft Entra SSO with PageDNA using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in PageDNA.

To configure and test Microsoft Entra SSO with PageDNA, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - to test Microsoft Entra single sign-on with B.Simon.
    1. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Microsoft Entra single sign-on.
1. **[Configure PageDNA SSO](#configure-pagedna-sso)** - to configure the single sign-on settings on application side.
    1. **[Create PageDNA test user](#create-pagedna-test-user)** - to have a counterpart of B.Simon in PageDNA that is linked to the Microsoft Entra representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **PageDNA** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

    ![Screenshot shows to edit Basic S A M L Configuration.](common/edit-urls.png "Basic Configuration")

1. In the **Basic SAML Configuration** section, perform the following steps:

    1. In the **Identifier (Entity ID)** box, type a URL by using one of the following patterns:

        | **Identifier** |
        |------|
        |`https://stores.pagedna.com/<your site>/saml2ep.cgi`|
        |`https://www.nationsprint.com/<your site>/saml2ep.cgi`|

    1. In the **Sign on URL** box, type a URL by using one of the following patterns:

        | **Sign on URL** |
        |---------|
        |`https://stores.pagedna.com/<your site>`|
        |`https://<your domain>`|
        |`https://<your domain>/<your site>` |
        |`https://www.nationsprint.com/<your site>`|

    > [!NOTE]
    > These values aren't real. Update these values with the actual Identifier and Sign on URL. To get these values, contact the [PageDNA support team](mailto:success@pagedna.com). You can also refer to the patterns shown in the **Basic SAML Configuration** pane.

1. In the **Set up Single Sign-On with SAML** pane, in the **SAML Signing Certificate** section, select **Download** to download **Certificate (Raw)** from the given options and save it on your computer.

    ![Screenshot shows the Certificate (Raw) download option.](common/certificateraw.png "Certificate")

1. In the **Set up PageDNA** section, copy the URL or URLs that you need:

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

In this section, you'll enable B.Simon to use single sign-on by granting access to PageDNA.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **PageDNA**.
1. In the app's overview page, select **Users and groups**.
1. Select **Add user/group**, then select **Users and groups** in the **Add Assignment** dialog.
   1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
   1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
   1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure PageDNA SSO

To configure single sign-on on the PageDNA side, send the downloaded Certificate (Raw) and the appropriate copied URLs to the [PageDNA support team](mailto:success@pagedna.com). The PageDNA team will make sure the SAML SSO connection is set properly on both sides.

### Create PageDNA test user

A user named Britta Simon is now created in PageDNA. You don't have to do anything to create this user. PageDNA supports just-in-time user provisioning, which is enabled by default. If a user named Britta Simon doesn't already exist in PageDNA, a new one is created after authentication.

## Test SSO

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

* Click on **Test this application**, this will redirect to PageDNA Sign-on URL where you can initiate the login flow. 

* Go to PageDNA Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the PageDNA tile in the My Apps, this will redirect to PageDNA Sign-on URL. For more information, see [Microsoft Entra My Apps](/azure/active-directory/manage-apps/end-user-experiences#azure-ad-my-apps).

## Next steps

Once you configure PageDNA you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).

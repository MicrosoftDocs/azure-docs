---
title: 'Tutorial: Microsoft Entra single sign-on (SSO) integration with ReadCube Papers'
description: Learn how to configure single sign-on between Microsoft Entra ID and ReadCube Papers.
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

# Tutorial: Microsoft Entra single sign-on (SSO) integration with ReadCube Papers

In this tutorial, you'll learn how to integrate ReadCube Papers with Microsoft Entra ID. When you integrate ReadCube Papers with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to ReadCube Papers.
* Enable your users to be automatically signed-in to ReadCube Papers with their Microsoft Entra accounts.
* Manage your accounts in one central location.

## Prerequisites

To get started, you need the following items:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* ReadCube Papers single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Microsoft Entra SSO in a test environment.

* ReadCube Papers supports **SP** initiated SSO.
* ReadCube Papers supports **Just In Time** user provisioning.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Add ReadCube Papers from the gallery

To configure the integration of ReadCube Papers into Microsoft Entra ID, you need to add ReadCube Papers from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **ReadCube Papers** in the search box.
1. Select **ReadCube Papers** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-sso-for-readcube-papers'></a>

## Configure and test Microsoft Entra SSO for ReadCube Papers

Configure and test Microsoft Entra SSO with ReadCube Papers using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in ReadCube Papers.

To configure and test Microsoft Entra SSO with ReadCube Papers, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - to test Microsoft Entra single sign-on with B.Simon.
    1. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Microsoft Entra single sign-on.
1. **[Configure ReadCube Papers SSO](#configure-readcube-papers-sso)** - to configure the single sign-on settings on application side.
    1. **[Create ReadCube Papers test user](#create-readcube-papers-test-user)** - to have a counterpart of B.Simon in ReadCube Papers that is linked to the Microsoft Entra representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **ReadCube Papers** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, perform the following step:
	1. In the **Reply URL (ACS URL)** text box, type the URL: `https://connect.liblynx.com/saml/module.php/saml/sp/saml2-acs.php/dsrsi`
	2. In the **Sign on URL** text box, type the URL: `https://app.readcube.com`

	    ![Screenshot that shows example settings in the SAML Configuration pane.](./media/readcube-papers-tutorial/configure-saml.png)

    	 
1. On the **Set up single sign-on with SAML** page, In the **SAML Signing Certificate** section, click copy button to copy **App Federation Metadata Url** and save it on your computer.

	![The Certificate download link](common/copy-metadataurl.png)

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

In this section, you'll enable B.Simon to use single sign-on by granting access to ReadCube Papers.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **ReadCube Papers**.
1. In the app's overview page, select **Users and groups**.
1. Select **Add user/group**, then select **Users and groups** in the **Add Assignment** dialog.
   1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
   1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
   1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure ReadCube Papers SSO

To configure single sign-on on the **ReadCube Papers** side, you need to send the **App Federation Metadata URL** to the [ReadCube Papers support team](mailto:sso-support@readcube.com). They change this setting so that the SAML SSO connection works properly on both sides.

### Create ReadCube Papers test user

In this section, a user called B.Simon is created in ReadCube Papers. ReadCube Papers supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in ReadCube Papers, a new one is created after authentication.

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

> [!NOTE]
> Before testing, please confirm with the [ReadCube Papers support team](mailto:sso-support@readcube.com) that SSO is set up on the ReadCube side.

* Click on **Test this application**, this will redirect to ReadCube Papers Sign-on URL where you can initiate the login flow. 

* Go to ReadCube Papers Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the ReadCube Papers tile in the My Apps portal, this will redirect to ReadCube Papers Sign-on URL. For more information about the My Apps portal, see [Introduction to My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

After you configure ReadCube Papers, you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).

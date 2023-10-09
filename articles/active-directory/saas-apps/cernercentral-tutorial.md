---
title: 'Tutorial: Microsoft Entra SSO integration with Cerner Central'
description: Learn how to configure single sign-on between Microsoft Entra ID and Cerner Central.
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
# Tutorial: Microsoft Entra SSO integration with Cerner Central

In this tutorial, you'll learn how to integrate Cerner Central with Microsoft Entra ID. When you integrate Cerner Central with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to Cerner Central.
* Enable your users to be automatically signed-in to Cerner Central with their Microsoft Entra accounts.
* Manage your accounts in one central location.

## Prerequisites

To configure Microsoft Entra integration with Cerner Central, you need the following items:

* A Microsoft Entra subscription. If you don't have a Microsoft Entra environment, you can get a [free account](https://azure.microsoft.com/free/).
* Cerner Central single sign-on enabled subscription.

## Scenario description

In this tutorial, you configure and test Microsoft Entra single sign-on in a test environment.

* Cerner Central supports **IDP** initiated SSO.
* Cerner Central supports [**Automated** user provisioning](cernercentral-provisioning-tutorial.md).

## Add Cerner Central from the gallery

To configure the integration of Cerner Central into Microsoft Entra ID, you need to add Cerner Central from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **Cerner Central** in the search box.
1. Select **Cerner Central** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-sso-for-cerner-central'></a>

## Configure and test Microsoft Entra SSO for Cerner Central

Configure and test Microsoft Entra SSO with Cerner Central using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in Cerner Central.

To configure and test Microsoft Entra SSO with Cerner Central, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - to test Microsoft Entra single sign-on with B.Simon.
    1. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Microsoft Entra single sign-on.
1. **[Configure Cerner Central SSO](#configure-cerner-central-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Cerner Central test user](#create-cerner-central-test-user)** - to have a counterpart of B.Simon in Cerner Central that is linked to the Microsoft Entra representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Cerner Central** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier** text box, type a URL using one of the following patterns:

    | **Identifier** |
    |-----|
    | `https://<instancename>.cernercentral.com/session-api/protocol/saml2/metadata` |
    | `https://<instancename>.sandboxcernercentral.com/session-api/protocol/saml2/metadata` |

    b. In the **Reply URL** text box, type a URL using one of the following patterns:

    | **Reply URL** |
    |------|
    | `https://<instancename>.cernercentral.com/session-api/protocol/saml2/sso` |
    | `https://<instancename>.sandboxcernercentral.com/session-api/protocol/saml2/sso` |

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier and Reply URL. Contact [Cerner Central Client support team](mailto:SISupport@cbre.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section.

1. On the **Set up Single Sign-On with SAML** page, In the **SAML Signing Certificate** section, click copy button to copy **App Federation Metadata Url** and save it on your computer.

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

In this section, you'll enable B.Simon to use single sign-on by granting access to Cerner Central.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Cerner Central**.
1. In the app's overview page, select **Users and groups**.
1. Select **Add user/group**, then select **Users and groups** in the **Add Assignment** dialog.
   1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
   1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
   1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Cerner Central SSO

To configure single sign-on on **Cerner Central** side, you need to send the **App Federation Metadata Url** to [Cerner Central support team](mailto:SISupport@cbre.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Cerner Central test user

**Cerner Central** application allows authentication from any federated identity provider. If a user is able to sign in to the application home page, they are federated and have no need for any manual provisioning. You can find more details [here](cernercentral-provisioning-tutorial.md) on how to configure automatic user provisioning.

## Test SSO

In this section, you test your Microsoft Entra single sign-on configuration with following options.

* Click on **Test this application**, and you should be automatically signed in to the Cerner Central for which you set up the SSO.

* You can use Microsoft My Apps. When you click the Cerner Central tile in the My Apps, you should be automatically signed in to the Cerner Central for which you set up the SSO. For more information, see [Microsoft Entra My Apps](/azure/active-directory/manage-apps/end-user-experiences#azure-ad-my-apps).

## Next steps

Once you configure Cerner Central you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).

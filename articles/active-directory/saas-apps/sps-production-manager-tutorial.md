---
title: Microsoft Entra SSO integration with SPS|Production Manager.
description: Learn how to configure single sign-on between Microsoft Entra ID and SPS|Production Manager.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: how-to
ms.date: 09/25/2023
ms.author: jeedes

---

# Microsoft Entra SSO integration with SPS|Production Manager

In this tutorial, you'll learn how to integrate SPS|Production Manager with Microsoft Entra ID. When you integrate SPS|Production Manager with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to SPS|Production Manager.
* Enable your users to be automatically signed-in to SPS|Production Manager with their Microsoft Entra accounts.
* Manage your accounts in one central location.

## Prerequisites

To integrate Microsoft Entra ID with SPS|Production Manager, you need:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* SPS|Production Manager single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Microsoft Entra SSO in a test environment.

* SPS|Production Manager supports **IDP** initiated SSO.

## Adding SPS|Production Manager from the gallery

To configure the integration of SPS|Production Manager into Microsoft Entra ID, you need to add SPS|Production Manager from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **SPS|Production Manager** in the search box.
1. Select **SPS|Production Manager** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, and walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Microsoft Entra SSO for SPS|Production Manager

Configure and test Microsoft Entra SSO with SPS|Production Manager using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in SPS|Production Manager.

To configure and test Microsoft Entra SSO with SPS|Production Manager, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-microsoft-entra-sso)** - to enable your users to use this feature.
    1. **[Create a Microsoft Entra ID test user](#create-a-microsoft-entra-id-test-user)** - to test Microsoft Entra single sign-on with B.Simon.
    1. **[Assign the Microsoft Entra ID test user](#assign-the-microsoft-entra-id-test-user)** - to enable B.Simon to use Microsoft Entra single sign-on.
1. **[Configure SPS|Production Manager SSO](#configure-spsproduction-manager-sso)** - to configure the single sign-on settings on application side.
    1. **[Create SPS|Production Manager test user](#create-spsproduction-manager-test-user)** - to have a counterpart of B.Simon in SPS|Production Manager that is linked to the Microsoft Entra ID representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO in the Microsoft Entra admin center.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **SPS|Production Manager** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot shows how to edit Basic SAML Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier** textbox, type one of the following URLs:

    | Environment | URL |
    |----|----|
    | Production| `https://microsoft-v20.spsinc.net/microsoft-v20` |
    | Staging | `https://microsoft-v20.spsinc.net/microsoft-staging1-v20` |

    b. In the **Reply URL** textbox, type one of the following URLs:
    
    | Environment | URL |
    |----|----|
    | Production| `https://microsoft-v20.spsinc.net/microsoft-v20/saml-auth/AssertionConsumerService` |
    | Staging | `https://microsoft-v20.spsinc.net/microsoft-staging1-v20/saml-auth/AssertionConsumerService` |

1. In the **SAML Signing Certificate** section, click **Edit** button to open **SAML Signing Certificate** dialog.

	![Screenshot shows to Edit SAML Signing Certificate.](common/edit-certificate.png "Certificate")

1. In the **SAML Signing Certificate** section, copy the **Thumbprint Value** and save it on your computer.

    ![Screenshot shows to Copy Thumbprint value.](common/copy-thumbprint.png "Thumbprint")

1. On the **Set up Insightsfirst** section, copy the appropriate URL(s) based on your requirement.

	![Screenshot shows to copy configuration appropriate URL.](common/copy-configuration-urls.png "Metadata")

### Create a Microsoft Entra ID test user

In this section, you'll create a test user in the Microsoft Entra admin center called B.Simon.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [User Administrator](../roles/permissions-reference.md#user-administrator).
1. Browse to **Identity** > **Users** > **All users**.
1. Select **New user** > **Create new user**, at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Display name** field, enter `B.Simon`.  
   1. In the **User principal name** field, enter the username@companydomain.extension. For example, `B.Simon@contoso.com`.
   1. Select the **Show password** check box, and then write down the value that's displayed in the **Password** box.
   1. Select **Review + create**.
1. Select **Create**.

### Assign the Microsoft Entra ID test user

In this section, you enable B.Simon to use Microsoft Entra single sign-on by granting access to SPS|Production Manager.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **SPS|Production Manager**.
1. In the app's overview page, select **Users and groups**.
1. Select **Add user/group**, then select **Users and groups** in the **Add Assignment** dialog.
   1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
   1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
   1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure SPS|Production Manager SSO

To configure single sign-on on **SPS|Production Manager** side, you need to send the **Thumbprint Value** and appropriate copied URLs from Microsoft Entra admin center to [SPS|Production Manager support team](mailto:support@spsinc.net). They set this setting to have the SAML SSO connection set properly on both sides.

### Create SPS|Production Manager test user

In this section, you create a user called B.Simon in SPS|Production Manager. Work with [SPS|Production Manager support team](mailto:support@spsinc.net) to add the users in the SPS|Production Manager platform. Users must be created and activated before you use single sign-on.

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options.
 
* Click on Test this application in Microsoft Entra admin center and you should be automatically signed in to the SPS|Production Manager for which you set up the SSO.
 
* You can use Microsoft My Apps. When you click the SPS|Production Manager tile in the My Apps, you should be automatically signed in to the SPS|Production Manager for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next Steps

Once you configure SPS|Production Manager you can enforce session control, which protects exfiltration and infiltration of your organization's sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-any-app).
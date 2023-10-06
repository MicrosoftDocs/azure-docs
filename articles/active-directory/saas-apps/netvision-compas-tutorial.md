---
title: 'Tutorial: Microsoft Entra single sign-on (SSO) integration with Netvision Compas'
description: Learn how to configure single sign-on between Microsoft Entra ID and Netvision Compas.
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

# Tutorial: Microsoft Entra single sign-on (SSO) integration with Netvision Compas

In this tutorial, you'll learn how to integrate Netvision Compas with Microsoft Entra ID. When you integrate Netvision Compas with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to Netvision Compas.
* Enable your users to be automatically signed-in to Netvision Compas with their Microsoft Entra accounts.
* Manage your accounts in one central location.

To learn more about SaaS app integration with Microsoft Entra ID, see [What is application access and single sign-on with Microsoft Entra ID](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To get started, you need the following items:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Netvision Compas single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Microsoft Entra SSO in a test environment.

* Netvision Compas supports **SP and IDP** initiated SSO
* Once you configure Netvision Compas you can enforce Session Control, which protects exfiltration and infiltration of your organization's sensitive data in real time. Session Control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).


## Adding Netvision Compas from the gallery

To configure the integration of Netvision Compas into Microsoft Entra ID, you need to add Netvision Compas from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **Netvision Compas** in the search box.
1. Select **Netvision Compas** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)


<a name='configure-and-test-azure-ad-single-sign-on-for-netvision-compas'></a>

## Configure and test Microsoft Entra single sign-on for Netvision Compas

Configure and test Microsoft Entra SSO with Netvision Compas using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in Netvision Compas.

To configure and test Microsoft Entra SSO with Netvision Compas, complete the following building blocks:

1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - to test Microsoft Entra single sign-on with B.Simon.
    1. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Microsoft Entra single sign-on.
1. **[Configure Netvision Compas SSO](#configure-netvision-compas-sso)** - to configure the single sign-on settings on application side.
    1. **[Configure Netvision Compas test user](#configure-netvision-compas-test-user)** - to have a counterpart of B.Simon in Netvision Compas that is linked to the Microsoft Entra representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Netvision Compas** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, enter the values for the following fields:

    a. In the **Identifier** text box, type a URL using the following pattern:
    `https://<TENANT>.compas.cloud/Identity/Saml20`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://<TENANT>.compas.cloud/Identity/Auth/AssertionConsumerService`

1. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://<TENANT>.compas.cloud/Identity/Auth/AssertionConsumerService`

    > [!NOTE]
    > These values are not real. Update these values with the actual Identifier, Reply URL and Sign-on URL. Contact [Netvision Compas Client support team](mailto:contact@net.vision) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Federation Metadata XML** and select **Download** to download the metadata file and save it on your computer.

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

In this section, you'll enable B.Simon to use single sign-on by granting access to Netvision Compas.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Netvision Compas**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Netvision Compas SSO

In this section you enable SAML SSO in **Netvision Compas**.
1. Log into **Netvision Compas** using an administrative account and access the administration area.

    ![Admin area](media/netvision-compas-tutorial/admin.png)

1. Locate the **System** area and select **Identity Providers**.

    ![Admin IDPs](media/netvision-compas-tutorial/admin-idps.png)

1. Select the **Add** action to register Microsoft Entra ID as a new IDP.

    ![Add IDP](media/netvision-compas-tutorial/idps-add.png)

1. Select **SAML** for the **Provider type**.
1. Enter meaningful values for the **Display name** and **Description** fields.
1. Assign **Netvision Compas** users to the IDP by selecting from the **Available users** list and then selecting the **Add selected** button. Users can also be assigned to the IDP while following the provisioning procedure.
1. For the **Metadata** SAML option click the **Choose File** button and select the metadata file previously saved on your computer.
1. Click **Save**.

    ![Edit IDP](media/netvision-compas-tutorial/idp-edit.png)


### Configure Netvision Compas test user

In this section, you configure an existing user in **Netvision Compas** to use Microsoft Entra ID for SSO.
1. Follow the **Netvision Compas** user provisioning procedure, as defined by your company or edit an existing user account.
1. While defining the user's profile, make sure that the user's **Email (Personal)** address matches the Microsoft Entra username: username@companydomain.extension. For example, `B.Simon@contoso.com`.

    ![Edit user](media/netvision-compas-tutorial/user-config.png)

Users must be created and activated before you use single sign-on.

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration.

### Using the Access Panel (IDP initiated).

When you click the Netvision Compas tile in the Access Panel, you should be automatically signed in to the Netvision Compas for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

### Directly accessing Netvision Compas (SP initiated).

1. Access the **Netvision Compas** URL. For example, `https://tenant.compas.cloud`.
1. Enter the **Netvision Compas** username and select **Next**.

    ![Login user](media/netvision-compas-tutorial/login-user.png)

1. **(optional)** If the user is assigned multiple IDPs within **Netvision Compas**, a list of available IDPs is presented. Select the Microsoft Entra IDP configured previously in **Netvision Compas**.

    ![Login choose](media/netvision-compas-tutorial/login-choose.png)

1. You are redirected to Microsoft Entra ID to perform the authentication. Once you are successfully authenticated, you should be automatically signed in to **Netvision Compas** for which you set up SSO.

## Additional resources

- [List of Tutorials on How to Integrate SaaS Apps with Microsoft Entra ID](./tutorial-list.md)

- [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

- [What is Conditional Access in Microsoft Entra ID?](../conditional-access/overview.md)

- [What is session control in Microsoft Defender for Cloud Apps?](/cloud-app-security/proxy-intro-aad)

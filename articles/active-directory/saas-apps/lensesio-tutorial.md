---
title: 'Tutorial: Microsoft Entra single sign-on (SSO) integration with Lenses.io'
description: In this tutorial, you'll learn how to configure single sign-on between Microsoft Entra ID and Lenses.io.
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

# Tutorial: Microsoft Entra single sign-on (SSO) integration with the Lenses.io DataOps portal

In this tutorial, you'll learn how to integrate the [Lenses.io](https://lenses.io/) DataOps portal with Microsoft Entra ID. After you integrate Lenses.io with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to the Lenses.io portal.
* Enable your users to be automatically signed-in to Lenses with their Microsoft Entra accounts.
* Manage your accounts in one central location: the Azure portal.

## Prerequisites

To get started, you need the following items:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* An instance of a Lenses portal. You can choose from a number of [deployment options](https://lenses.io/product/deployment/).
* A Lenses.io [license](https://lenses.io/product/pricing/) that supports single sign-on (SSO).

> [!NOTE]
> This integration is also available to use from Microsoft Entra US Government Cloud environment. You can find this application in the Microsoft Entra US Government Cloud Application Gallery and configure it in the same way as you do from public cloud.

## Scenario description

In this tutorial, you'll configure and test Microsoft Entra SSO in a test environment.

* Lenses.io supports service provider (SP) initiated SSO.

## Add Lenses.io from the gallery

To configure the integration of Lenses.io into Microsoft Entra ID, add Lenses.io to your list of managed SaaS apps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, enter **Lenses.io** in the search box.
1. From results panel, select **Lenses.io**,  and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-sso-for-lensesio'></a>

## Configure and test Microsoft Entra SSO for Lenses.io

You'll create a test user called *B.Simon* to configure and test Microsoft Entra SSO with your Lenses.io portal. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in Lenses.io.

Perform the following steps:

1. [Configure Microsoft Entra SSO](#configure-azure-ad-sso) to enable your users to use this feature.
    1. [Create a Microsoft Entra test user and group](#create-an-azure-ad-test-user-and-group) to test Microsoft Entra SSO with B.Simon.
    1. [Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user) to enable B.Simon to use Microsoft Entra SSO.
1. [Configure Lenses.io SSO](#configure-lensesio-sso) to configure the SSO settings on the application side.
    1. [Create Lenses.io test group permissions](#create-lensesio-test-group-permissions) to control what B.Simon can access in Lenses.io (authorization).
1. [Test SSO](#test-sso) to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO in the Azure portal:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Lenses.io** application integration page, find the **Manage** section, and then select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot that shows the icon for editing basic SAML configuration.](common/edit-urls.png)

1. In the **Basic SAML Configuration** section, perform the following steps:

    a. **Identifier (Entity ID)**: Enter a URL that has the following pattern: `https://<CUSTOMER_LENSES_BASE_URL>`. An example is `https://lenses.my.company.com`.

    b. **Reply URL**: Enter a URL that has the following pattern: `https://<CUSTOMER_LENSES_BASE_URL>/api/v2/auth/saml/callback?client_name=SAML2Client`. An example is `https://lenses.my.company.com/api/v2/auth/saml/callback?client_name=SAML2Client`.

    c. **Sign on URL**: Enter a URL that has the following pattern: `https://<CUSTOMER_LENSES_BASE_URL>`. An example is `https://lenses.my.company.com`.

    > [!NOTE]
    > These values are not real. Update them with the actual Identifier,Reply URL and Sign on URL of the base URL of your Lenses portal instance. See the [Lenses.io SSO documentation](https://docs.lenses.io/install_setup/configuration/security.html#single-sign-on-sso-saml-2-0) for more information.

1. On the **Set up single sign-on with SAML** page, go to the **SAML Signing Certificate** section. Find **Federation Metadata XML**, and then select **Download** to download and save the certificate on your computer.

    ![Screenshot that shows the Certificate download link.](common/metadataxml.png)

1. In the **Set up Lenses.io** section, use the XML file that you downloaded to configure Lenses against your Azure SSO.

<a name='create-an-azure-ad-test-user-and-group'></a>

### Create a Microsoft Entra test user and group

In the Azure portal, you'll create a test user called B.Simon. Then you'll create a test group that controls the access B.Simon has in Lenses.

You can find out how Lenses uses group membership mapping for authorization in the [Lenses SSO documentation](https://docs.lenses.io/install_setup/configuration/security.html#id3).

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [User Administrator](../roles/permissions-reference.md#user-administrator).
1. Browse to **Identity** > **Users** > **All users**.
1. Select **New user** > **Create new user**, at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Display name** field, enter `B.Simon`.  
   1. In the **User principal name** field, enter the username@companydomain.extension. For example, `B.Simon@contoso.com`.
   1. Select the **Show password** check box, and then write down the value that's displayed in the **Password** box.
   1. Select **Review + create**.
1. Select **Create**.

**To create the group:**

1. Go to **Microsoft Entra ID**, and then select **Groups**.
1. At the top of the screen, select **New group**.
1. In the **Group properties**, follow these steps:
   1. In the **Group type** box, select **Security**.
   1. In the **Group Name** box, enter **LensesUsers**.
   1. Select **Create**.
1. Select the group **LensesUsers** and copy the **Object ID** (for example, f8b5c1ec-45de-4abd-af5c-e874091fb5f7). You'll use this ID in Lenses to map users of the group to the [correct permissions](https://docs.lenses.io/install_setup/configuration/security.html#id3).  

**To assign the group to the test user:**

1. Go to **Microsoft Entra ID**, and then select **Users**.
1. Select the test user **B.Simon**.
1. Select **Groups**.
1. At the top of the screen, select **Add memberships**.
1. Search for and select **LensesUsers**.
1. Click **Select**.

<a name='assign-the-azure-ad-test-user'></a>

### Assign the Microsoft Entra test user

In this section, you'll enable B.Simon to use single sign-on by granting access to Lenses.io.

1. Browse to **Identity** > **Applications** > **Enterprise applications**.
1. On the applications list, select **Lenses.io**.
1. On the app overview page, in the **Manage** section, select **Users and groups**.
1. Select **Add user**.
1. In the **Add Assignment** dialog box, select **Users and groups**.
1. In the **Users and groups** dialog box, select **B.Simon** from the Users list. Then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog box, choose the appropriate role for the user from the list. Then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog box, select the **Assign** button.

## Configure Lenses.io SSO

To configure SSO on the **Lenses.io** portal, install the downloaded **Federation Metadata XML** on your Lenses instance and [configure Lenses to enable SSO](https://docs.lenses.io/install_setup/configuration/security.html#configure-lenses).

### Create Lenses.io test group permissions

1. To create a group in Lenses, use the **Object ID** of the **LensesUsers** group. This is the ID that you copied in the user [creation section](#create-an-azure-ad-test-user-and-group).
1. Assign the desired permissions for B.Simon.

For more information, see [Azure - Lenses group mapping](https://docs.lenses.io/install_setup/configuration/security.html#azure-groups).

## Test SSO

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

* Click on **Test this application**, this will redirect to Lenses.io Sign-on URL where you can initiate the login flow. 

* Go to Lenses.io Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Lenses.io tile in the My Apps, this will redirect to Lenses.io Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

Once you configure Lenses.io you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).

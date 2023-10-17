---
title: 'Tutorial: Microsoft Entra single sign-on (SSO) integration with Springer Link'
description: Learn how to configure single sign-on between Microsoft Entra ID and Springer Link.
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
# Tutorial: Microsoft Entra single sign-on (SSO) integration with Springer Link

In this tutorial, you'll learn how to integrate Springer Link with Microsoft Entra ID. When you integrate Springer Link with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to Springer Link.
* Enable your users to be automatically signed-in to Springer Link with their Microsoft Entra accounts.
* Manage your accounts in one central location.

## Prerequisites

To get started, you need the following items:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Springer Link single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Microsoft Entra SSO in a test environment.

* Springer Link supports **SP and IDP** initiated SSO

## Adding Springer Link from the gallery

To configure the integration of Springer Link into Microsoft Entra ID, you need to add Springer Link from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **Springer Link** in the search box.
1. Select **Springer Link** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-sso'></a>

## Configure and test Microsoft Entra SSO

Configure and test Microsoft Entra SSO with Springer Link using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in Springer Link.

To configure and test Microsoft Entra SSO with Springer Link, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    * **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - to test Microsoft Entra single sign-on with Britta Simon.
    * **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Microsoft Entra single sign-on.
2. **[Configure Springer Link SSO](#configure-springer-link-sso)** - to configure the Single Sign-On settings on application side.
3. **[Test SSO](#test-sso)** - to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Springer Link** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, enter the values for the following fields:

    a. In the **Identifier** text box, type the URL:
    `https://fsso.springer.com`

    b. In the **Reply URL** text box, type the URL:
    `https://fsso.springer.com/federation/Consumer/metaAlias/SpringerServiceProvider`

	c. Click **Set additional URLs**.

	d. In the **Relay State** text box, type the URL:
    `https://link.springer.com`

5. If you wish to configure the application in **SP** initiated mode, perform the following step:

    In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://fsso.springer.com/saml/login?idp=<entityID>&targetUrl=https://link.springer.com`

    > [!NOTE]
    > The Sign-on URL value is not real. Update the value with the actual Sign-On URL. `<entityID>` is the Microsoft Entra Identifier copied from the **Set up Springer Link** section, described later in tutorial. You can also refer to the patterns shown in the **Basic SAML Configuration** section.

6. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click the copy icon to copy **App Federation Metadata Url** and save it on your computer.

	![The metadata download link](common/copy_metadataurl.png)

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

In this section, you'll enable B.Simon to use single sign-on by granting access to Springer Link.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Springer Link**.
1. In the app's overview page, select **Users and groups**.
1. Select **Add user/group**, then select **Users and groups** in the **Add Assignment** dialog.
   1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
   1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
   1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Springer Link SSO

To configure single sign-on on the **Springer Link** side, you need to send the copied **App Federation Metadata Url** to the [Springer Link support team](mailto:onlineservice@springernature.com). The Springer link support team uses this URL to set up the SAML SSO connection properly on both sides.

### Create Springer Link test user

In this section, you create a user called Britta Simon in Springer Link. Work with [Springer Link support team](mailto:onlineservice@springernature.com) to add the users in the Springer Link platform. Users must be created and activated before you use single sign-on.

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application**, this will redirect to Springer Link Sign on URL where you can initiate the login flow.  

* Go to Springer Link Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application**, and you should be automatically signed in to the Springer Link for which you set up the SSO 

You can also use Microsoft Access Panel to test the application in any mode. When you click the Springer Link tile in the Access Panel, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the Springer Link for which you set up the SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next Steps

Once you configure Springer Link you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-any-app).


- [What is Conditional Access in Microsoft Entra ID?](../conditional-access/overview.md)

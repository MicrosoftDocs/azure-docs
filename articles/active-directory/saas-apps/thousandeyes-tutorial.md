---
title: 'Tutorial: Microsoft Entra single sign-on (SSO) integration with ThousandEyes'
description: Learn how to configure single sign-on between Microsoft Entra ID and ThousandEyes.
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

# Tutorial: Microsoft Entra single sign-on (SSO) integration with ThousandEyes

In this tutorial, you'll learn how to integrate ThousandEyes with Microsoft Entra ID. When you integrate ThousandEyes with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to ThousandEyes.
* Enable your users to be automatically signed-in to ThousandEyes with their Microsoft Entra accounts.
* Manage your accounts in one central location.

## Prerequisites

To get started, you need the following items:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* ThousandEyes single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Microsoft Entra SSO in a test environment.

* ThousandEyes supports **SP and IDP** initiated SSO.
* ThousandEyes supports [**Automated** user provisioning](./thousandeyes-provisioning-tutorial.md).

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Add ThousandEyes from the gallery

To configure the integration of ThousandEyes into Microsoft Entra ID, you need to add ThousandEyes from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **ThousandEyes** in the search box.
1. Select **ThousandEyes** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-sso-for-thousandeyes'></a>

## Configure and test Microsoft Entra SSO for ThousandEyes

Configure and test Microsoft Entra SSO with ThousandEyes using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in ThousandEyes.

To configure and test Microsoft Entra SSO with ThousandEyes, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - to test Microsoft Entra single sign-on with B.Simon.
    1. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Microsoft Entra single sign-on.
1. **[Configure ThousandEyes SSO](#configure-thousandeyes-sso)** - to configure the single sign-on settings on application side.
    1. **[Create ThousandEyes test user](#create-thousandeyes-test-user)** - to have a counterpart of B.Simon in ThousandEyes that is linked to the Microsoft Entra representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **ThousandEyes** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, the application is pre-configured and the necessary URLs are already pre-populated with Azure. The user needs to save the configuration by clicking the **Save** button.

1. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type the URL:
    `https://app.thousandeyes.com/login/sso`

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. On the **Set up ThousandEyes** section, copy the appropriate URL(s) based on your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

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

In this section, you'll enable B.Simon to use single sign-on by granting access to ThousandEyes.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **ThousandEyes**.
1. In the app's overview page, select **Users and groups**.
1. Select **Add user/group**, then select **Users and groups** in the **Add Assignment** dialog.
   1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
   1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
   1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure ThousandEyes SSO

1. In a different web browser window, sign on to your **ThousandEyes** company site as an administrator.

2. In the menu on the top, click **Settings**.

    ![Screenshot shows the ThousandEyes site with Settings selected.](./media/thousandeyes-tutorial/settings-tab.png "Settings")

3. Click **Account**

    ![Screenshot shows Account selected from the Settings menu.](./media/thousandeyes-tutorial/menu.png "Account")

4. Click the **Security & Authentication** tab.

    ![Security & Authentication](./media/thousandeyes-tutorial/security.png "Security & Authentication")

5. In the **Setup Single Sign-On** section, perform the following steps:

    ![Setup Single Sign-On](./media/thousandeyes-tutorial/configuration.png "Setup Single Sign-On")

    a. Select **Enable Single Sign-On**.

    b. In **Login Page URL** textbox, paste **Login URL**.

    c. In **Logout Page URL** textbox, paste **Logout URL**.

    d. **Identity Provider Issuer** textbox, paste **Microsoft Entra Identifier**.

    e. In **Verification Certificate**, click **Choose file**, and then upload the certificate you have downloaded previously.

    f. Click **Save**.

### Create ThousandEyes test user

The objective of this section is to create a user called Britta Simon in ThousandEyes. ThousandEyes supports automatic user provisioning, which is by default enabled. You can find more details [here](thousandeyes-provisioning-tutorial.md) on how to configure automatic user provisioning.

**If you need to create user manually, perform following steps:**

1. Sign in to your ThousandEyes company site as an administrator.

2. Click **Settings**.

    ![Screenshot shows the ThousandEyes site with Settings selected.](./media/thousandeyes-tutorial/settings-tab.png "Settings")

3. Click **Account**.

    ![Screenshot shows Account selected from the Settings menu.](./media/thousandeyes-tutorial/menu.png "Account")

4. Click the **Accounts & Users** tab.

    ![Accounts & Users](./media/thousandeyes-tutorial/user.png "Accounts & Users")

5. In the **Add Users & Accounts** section, perform the following steps:

    ![Add User Accounts](./media/thousandeyes-tutorial/add-user.png "Add User Accounts")

    a. In **Name** textbox, type the name of user like **B.Simon**.

    b. In **Email** textbox, type the email of user like b.simon@contoso.com.

    b. Click **Add New User to Account**.

    > [!NOTE]
    > The Microsoft Entra account holder will get an email including a link to confirm and activate the account.

> [!NOTE]
> You can use any other ThousandEyes user account creation tools or APIs provided by ThousandEyes to provision Microsoft Entra user accounts.


## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application**, this will redirect to ThousandEyes Sign on URL where you can initiate the login flow.  

* Go to ThousandEyes Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application**, and you should be automatically signed in to the ThousandEyes for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the ThousandEyes tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the ThousandEyes for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

Once you configure ThousandEyes you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).

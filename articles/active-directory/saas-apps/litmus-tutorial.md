---
title: 'Tutorial: Microsoft Entra single sign-on (SSO) integration with Litmus'
description: Learn how to configure single sign-on between Microsoft Entra ID and Litmus.
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

# Tutorial: Microsoft Entra single sign-on (SSO) integration with Litmus

In this tutorial, you'll learn how to integrate Litmus with Microsoft Entra ID. When you integrate Litmus with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to Litmus.
* Enable your users to be automatically signed-in to Litmus with their Microsoft Entra accounts.
* Manage your accounts in one central location.

## Prerequisites

To get started, you need the following items:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Litmus single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Microsoft Entra SSO in a test environment.

* Litmus supports **SP and IDP** initiated SSO

## Adding Litmus from the gallery

To configure the integration of Litmus into Microsoft Entra ID, you need to add Litmus from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **Litmus** in the search box.
1. Select **Litmus** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)


<a name='configure-and-test-azure-ad-sso-for-litmus'></a>

## Configure and test Microsoft Entra SSO for Litmus

Configure and test Microsoft Entra SSO with Litmus using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in Litmus.

To configure and test Microsoft Entra SSO with Litmus, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - to test Microsoft Entra single sign-on with B.Simon.
    1. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Microsoft Entra single sign-on.
1. **[Configure Litmus SSO](#configure-litmus-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Litmus test user](#create-litmus-test-user)** - to have a counterpart of B.Simon in Litmus that is linked to the Microsoft Entra representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Litmus** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, the user does not have to perform any step as the app is already pre-integrated with Azure.

1. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type the URL:
    `https://litmus.com/sessions/new`

1. Click **Save**.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Raw)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificateraw.png)

1. On the **Set up Litmus** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use single sign-on by granting access to Litmus.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Litmus**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Litmus SSO




1. In a different web browser window, sign in to your Litmus company site as an administrator

1. Click on the **Security** from the left navigation panel.

    ![Screenshot shows the Security item selected.](./media/litmus-tutorial/security-img.png)

1. On the **Configure SAML Authentication** section, perform the following steps:

    ![Screenshot shows the Configure SAML Authentication section where you can enter the values described.](./media/litmus-tutorial/configure1.png)

    a. Switch on the **Enable SAML** toggle.

    b. Select **Generic** for the provider.

    c. Enter the name of **Identity Provider Name**. for ex. `Azure AD`

1. Perform the following steps:

	![Screenshot shows the section where you can enter the values described.](./media/litmus-tutorial/configure3.png)

    a. In the **SAML 2.0 Endpoint(HTTP)** textbox, paste the **Login URL** value, which you copied previously.

    b. Open downloaded **Certificate** file from Azure portal into Notepad and paste the content into **X.509 Certificate** textbox.

    c. Click **Save SAML settings**.

### Create Litmus test user

1. In a different web browser window, sign into Litmus application as an administrator.

1. Click on the **Accounts** from the left navigation panel.

    ![Screenshot shows the Accounts item selected.](./media/litmus-tutorial/accounts-img.png)

1. Click **Add New User** tab.

    ![Screenshot shows the Add New User item selected.](./media/litmus-tutorial/add-new-user.png)

1. On the **Add User** section, perform the following steps:

    ![Screenshot shows the Add User section where you can enter the values described.](./media/litmus-tutorial/user-profile.png)

    a. In the **Email** textbox, enter the email address of the user like **B.Simon\@contoso.com**

    b. In the **First Name** textbox, enter the first name of the user like **B**.

    c. In the **Last Name** textbox, enter the last name of the user like **Simon**.

    d. Click **Create User**.

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options.

#### SP initiated:

* Click on **Test this application**, this will redirect to Litmus Sign on URL where you can initiate the login flow.

* Go to Litmus Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application**, and you should be automatically signed in to the Litmus for which you set up the SSO

You can also use Microsoft My Apps to test the application in any mode. When you click the Litmus tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the Litmus for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

Once you configure Litmus you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-any-app).

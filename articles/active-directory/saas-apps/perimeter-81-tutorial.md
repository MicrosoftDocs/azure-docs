---
title: 'Tutorial: Microsoft Entra single sign-on (SSO) integration with Perimeter 81'
description: Learn how to configure single sign-on between Microsoft Entra ID and Perimeter 81.
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

# Tutorial: Microsoft Entra single sign-on (SSO) integration with Perimeter 81

In this tutorial, you'll learn how to integrate Perimeter 81 with Microsoft Entra ID. When you integrate Perimeter 81 with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to Perimeter 81.
* Enable your users to be automatically signed-in to Perimeter 81 with their Microsoft Entra accounts.
* Manage your accounts in one central location.

## Prerequisites

To get started, you need the following items:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Perimeter 81 single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Microsoft Entra SSO in a test environment.

* Perimeter 81 supports **SP and IDP** initiated SSO
* Perimeter 81 supports **Just In Time** user provisioning

## Adding Perimeter 81 from the gallery

To configure the integration of Perimeter 81 into Microsoft Entra ID, you need to add Perimeter 81 from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **Perimeter 81** in the search box.
1. Select **Perimeter 81** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)


<a name='configure-and-test-azure-ad-sso-for-perimeter-81'></a>

## Configure and test Microsoft Entra SSO for Perimeter 81

Configure and test Microsoft Entra SSO with Perimeter 81 using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in Perimeter 81.

To configure and test Microsoft Entra SSO with Perimeter 81, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - to test Microsoft Entra single sign-on with B.Simon.
    1. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Microsoft Entra single sign-on.
1. **[Configure Perimeter 81 SSO](#configure-perimeter-81-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Perimeter 81 test user](#create-perimeter-81-test-user)** - to have a counterpart of B.Simon in Perimeter 81 that is linked to the Microsoft Entra representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Perimeter 81** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, enter the values for the following fields:

    a. In the **Identifier** text box, type a value using the following pattern:
    `urn:auth0:perimeter81:<SUBDOMAIN>`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://auth.perimeter81.com/login/callback?connection=<SUBDOMAIN>`

1. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://<SUBDOMAIN>.perimeter81.com`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier, Reply URL and Sign-on URL. Contact [Perimeter 81 Client support team](mailto:support@perimeter81.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. On the **Set up Perimeter 81** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use single sign-on by granting access to Perimeter 81.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Perimeter 81**.
1. In the app's overview page, select **Users and groups**.
1. Select **Add user/group**, then select **Users and groups** in the **Add Assignment** dialog.
   1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
   1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
   1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Perimeter 81 SSO




1. In a different web browser window, sign in to your Perimeter 81 company site as an administrator

4. Go to **Settings** and click on **Identity Providers**.

    ![Perimeter 81 settings](./media/perimeter-81-tutorial/settings.png)

5. Click on **Add Provider** button.

    ![Perimeter 81 add provider](./media/perimeter-81-tutorial/add-provider.png)

6. Select **SAML 2.0 Identity Providers** and click on **Continue** button.

    ![Perimeter 81 add identity provider](./media/perimeter-81-tutorial/add-identity-provider.png)

7. In the **SAML 2.0 Identity Providers** section, perform the following steps:

    ![Perimeter 81 setting up saml](./media/perimeter-81-tutorial/setting-up-saml.png)

    a. In the **Sign In URL** text box, paste the value of **Login URL**.

    b. In the **Domain Aliases** text box, enter your domain alias value.

    c. Open the downloaded **Certificate (Base64)** into Notepad and paste the content into the **X509 Signing Certificate** textbox.

    > [!NOTE]
    > Alternatively you can click on **Upload PEM/CERT File** to upload the **Certificate (Base64)** which you downloaded previously.
    
    d. Click **Done**.

### Create Perimeter 81 test user

In this section, a user called Britta Simon is created in Perimeter 81. Perimeter 81 supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in Perimeter 81, a new one is created after authentication.

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application**, this will redirect to Perimeter 81 Sign on URL where you can initiate the login flow.  

* Go to Perimeter 81 Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application**, and you should be automatically signed in to the Perimeter 81 for which you set up the SSO.

You can also use Microsoft My Apps to test the application in any mode. When you click the Perimeter 81 tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the Perimeter 81 for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

Once you configure Perimeter 81 you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-any-app).

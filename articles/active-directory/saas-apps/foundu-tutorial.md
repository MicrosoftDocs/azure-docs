---
title: 'Tutorial: Microsoft Entra single sign-on (SSO) integration with foundU'
description: Learn how to configure single sign-on between Microsoft Entra ID and foundU.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 09/20/2023
ms.author: jeedes

---

# Tutorial: Microsoft Entra single sign-on (SSO) integration with foundU

In this tutorial, you'll learn how to integrate foundU with Microsoft Entra ID. When you integrate foundU with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to foundU.
* Enable your users to be automatically signed-in to foundU with their Microsoft Entra accounts.
* Manage your accounts in one central location.

## Prerequisites

To get started, you need the following items:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* foundU single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Microsoft Entra SSO in a test environment.

* foundU supports **SP and IDP** initiated SSO.

## Adding foundU from the gallery

To configure the integration of foundU into Microsoft Entra ID, you need to add foundU from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **foundU** in the search box.
1. Select **foundU** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)


<a name='configure-and-test-azure-ad-sso-for-foundu'></a>

## Configure and test Microsoft Entra SSO for foundU

Configure and test Microsoft Entra SSO with foundU using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in foundU.

To configure and test Microsoft Entra SSO with foundU, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - to test Microsoft Entra single sign-on with B.Simon.
    1. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Microsoft Entra single sign-on.
1. **[Configure foundU SSO](#configure-foundu-sso)** - to configure the single sign-on settings on application side.
    1. **[Create foundU test user](#create-foundu-test-user)** - to have a counterpart of B.Simon in foundU that is linked to the Microsoft Entra representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **foundU** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, enter the values for the following fields:

    a. In the **Identifier** text box, type a URL using the following pattern:
    `https://<CUSTOMER_NAME>.foundu.com.au/saml`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://<CUSTOMER_NAME>.foundu.com.au/saml/consume`

    c. In the **Logout URL** text box, type a URL using the following pattern:
    `https://<CUSTOMER_NAME>.foundu.com.au/saml/logout`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier, Reply URL and Logout URL. Contact [foundU Client support team](mailto:help@foundu.com.au) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. On the **Set up foundU** section, copy the appropriate URL(s) based on your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

<a name='create-an-azure-ad-test-user'></a>

### Create a Microsoft Entra test user

In this section, you'll create a test user in the Azure portal called B.Simon.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to foundU.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **foundU**.
1. In the app's overview page, select **Users and groups**.
1. Select **Add user/group**, then select **Users and groups** in the **Add Assignment** dialog.
   1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
   1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
   1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure foundU SSO

1. Log in to foundU website as an administrator.

1. Click Menu icon and in the **Platform Settings** select **Single Sign-on**.

    ![Screenshot for foundU single sign on](./media/foundu-tutorial/single-sign-on.png)

1. Perform the following steps in the **Single Sign-on Settings** page.

    ![Screenshot for foundU sso configuration](./media/foundu-tutorial/configuration-1.png)

    a. Copy **Identifier(Entity ID)** value, paste this value into the **Identifier** text box in the **Basic SAML Configuration section** in the Azure portal.

    b. Copy **Reply URL (Assertion Consumer Service URL)** value, paste this value into the **Reply URL** text box in the **Basic SAML Configuration section** in the Azure portal.

    c. Copy **Logout URL** value, paste this value into the **Logout URL** text box in the **Basic SAML Configuration section** in the Azure portal.

    d. In the **Entity ID** textbox, paste the **Identifier** value, which you have copied from the Azure portal.

    e. In the **Single Sign-on Service URL** textbox, paste the **Login URL** value, which you have copied from the Azure portal.

    f. In the **Single Logout Service URL** textbox, paste the **Logout URL** value, which you have copied from the Azure portal.

    g. Click **Choose File** to upload the downloaded **Certificate (Base64)** file from Azure portal.

    h. Click **Save Settings**.

### Create foundU test user

In this section, you create a user called Britta Simon in foundU. Work with [foundU support team](mailto:help@foundu.com.au) to add the users in the foundU platform. Users must be created and activated before you use single sign-on.

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application** in Azure portal. This will redirect to foundU Sign on URL where you can initiate the login flow.  

* Go to foundU Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application** in Azure portal and you should be automatically signed in to the foundU for which you set up the SSO 

You can also use Microsoft My Apps to test the application in any mode. When you click the foundU tile in the My Apps, if configured in SP mode you would be redirected to the application sign-on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the foundU for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).


## Next steps

Once you configure foundU you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-any-app).

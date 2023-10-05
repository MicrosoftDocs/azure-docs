---
title: 'Tutorial: Microsoft Entra SSO integration with SkyDesk Email'
description: Learn how to configure single sign-on between Microsoft Entra ID and SkyDesk Email.
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
# Tutorial: Microsoft Entra SSO integration with SkyDesk Email

In this tutorial, you'll learn how to integrate SkyDesk Email with Microsoft Entra ID. When you integrate SkyDesk Email with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to SkyDesk Email.
* Enable your users to be automatically signed-in to SkyDesk Email with their Microsoft Entra accounts.
* Manage your accounts in one central location.

## Prerequisites

To get started, you need the following items:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* SkyDesk Email single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Microsoft Entra single sign-on in a test environment.

* SkyDesk Email supports **SP** initiated SSO.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Add SkyDesk Email from the gallery

To configure the integration of SkyDesk Email into Microsoft Entra ID, you need to add SkyDesk Email from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **SkyDesk Email** in the search box.
1. Select **SkyDesk Email** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-sso-for-skydesk-email'></a>

## Configure and test Microsoft Entra SSO for SkyDesk Email

Configure and test Microsoft Entra SSO with SkyDesk Email using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in SkyDesk Email.

To configure and test Microsoft Entra SSO with SkyDesk Email, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - to test Microsoft Entra single sign-on with B.Simon.
    1. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Microsoft Entra single sign-on.
1. **[Configure SkyDesk Email SSO](#configure-skydesk-email-sso)** - to configure the single sign-on settings on application side.
    1. **[Create SkyDesk Email test user](#create-skydesk-email-test-user)** - to have a counterpart of B.Simon in SkyDesk Email that is linked to the Microsoft Entra representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **SkyDesk Email** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, perform the following step:

    In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://mail.skydesk.jp/portal/<companyname>`

1. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Base64)** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. On the **Set up SkyDesk Email** section, copy the appropriate URL(s) as per your requirement.

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

In this section, you'll enable B.Simon to use single sign-on by granting access to SkyDesk Email.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **SkyDesk Email**.
1. In the app's overview page, select **Users and groups**.
1. Select **Add user/group**, then select **Users and groups** in the **Add Assignment** dialog.
   1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
   1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
   1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure SkyDesk Email SSO

1. In a different web browser, sign-on to your SkyDesk Email account as administrator.

1. In the menu on the top, click **Setup**, and select **Org**.

    ![Screenshot shows Org selected from the Setup menu.](./media/skydeskemail-tutorial/menu.png)
  
1. Click on **Domains** from the left panel.

    ![Screenshot shows Domains selected from Control Panel.](./media/skydeskemail-tutorial/domain.png)

1. Click on **Add Domain**.

    ![Screenshot shows Add Domain selected.](./media/skydeskemail-tutorial/user.png)

1. Enter your Domain name, and then verify the Domain.

    ![Screenshot shows the Add Domain tab where you can enter your domain.](./media/skydeskemail-tutorial/details.png)

1. Click on **SAML Authentication** from the left panel.

    ![Screenshot shows SAML Authentication selected from Control Panel.](./media/skydeskemail-tutorial/authentication.png)

1. On the **SAML Authentication** dialog page, perform the following steps:

    ![Screenshot shows the SAML Authentication Details dialog box where you can enter the values described.](./media/skydeskemail-tutorial/portal.png)

    > [!NOTE]
    > To use SAML based authentication, you should either have **verified domain** or **portal URL** setup. You can set the portal URL with the unique name.

    ![Screenshot shows the Portal U R L where you enter the name.](./media/skydeskemail-tutorial/file.png)

    a. In the **Login URL** textbox, paste the value of **Login URL**.

    b. In the **Logout** URL textbox, paste the value of **Logout URL**.

    c. **Change Password URL** is optional so leave it blank.

    d. Click on **Get Key From File** to select your downloaded certificate from Azure portal, and then click **Open** to upload the certificate.

    e. As **Algorithm**, select **RSA**.

    f. Click **Ok** to save the changes.

### Create SkyDesk Email test user

In this section, you create a user called Britta Simon in SkyDesk Email.

Click on **User Access** from the left panel in SkyDesk Email and then enter your username.

![Screenshot shows User Access selected from Control Panel.](./media/skydeskemail-tutorial/create-users.png)

## Test SSO

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

* Click on **Test this application**, this will redirect to SkyDesk Email Sign-on URL where you can initiate the login flow. 

* Go to SkyDesk Email Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the SkyDesk Email tile in the My Apps, this will redirect to SkyDesk Email Sign-on URL. For more information, see [Microsoft Entra My Apps](/azure/active-directory/manage-apps/end-user-experiences#azure-ad-my-apps).

## Next steps

Once you configure SkyDesk Email you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).

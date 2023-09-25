---
title: 'Tutorial: Microsoft Entra SSO integration with ITRP'
description: In this tutorial, you'll learn how to configure single sign-on between Microsoft Entra ID and ITRP.
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
# Tutorial: Microsoft Entra SSO integration with ITRP

In this tutorial, you'll learn how to integrate ITRP with Microsoft Entra ID. When you integrate ITRP with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to ITRP.
* Enable your users to be automatically signed-in to ITRP with their Microsoft Entra accounts.
* Manage your accounts in one central location.

## Prerequisites

To configure Microsoft Entra integration with ITRP, you need to have:

* A Microsoft Entra subscription. If you don't have a Microsoft Entra environment, you can get a [free account](https://azure.microsoft.com/free/).
* An ITRP subscription that has single sign-on enabled.

## Scenario description

In this tutorial, you'll configure and test Microsoft Entra single sign-on in a test environment.

* ITRP supports SP-initiated SSO.

## Add ITRP from the gallery

To configure the integration of ITRP into Microsoft Entra ID, you need to add ITRP from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **ITRP** in the search box.
1. Select **ITRP** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-sso-for-itrp'></a>

## Configure and test Microsoft Entra SSO for ITRP

Configure and test Microsoft Entra SSO with ITRP using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in ITRP.

To configure and test Microsoft Entra SSO with ITRP, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - to test Microsoft Entra single sign-on with B.Simon.
    1. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Microsoft Entra single sign-on.
1. **[Configure ITRP SSO](#configure-itrp-sso)** - to configure the single sign-on settings on application side.
    1. **[Create an ITRP test user](#create-an-itrp-test-user)** - to have a counterpart of B.Simon in ITRP that is linked to the Microsoft Entra representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **ITRP** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

4. In the **Basic SAML Configuration** dialog box, perform the following steps.

    1. In the **Identifier (Entity ID)** textbox, type a URL using the following pattern:

       `https://<tenant-name>.itrp.com`

    1. In the **Sign on URL** textbox, type a URL using the following pattern:
    
       `https://<tenant-name>.itrp.com`   

	> [!NOTE]
	> These values are placeholders. You need to use the actual Identifier and Sign on URL. Contact the [ITRP support team](https://www.4me.com/support/) to get the values. You can also refer to the patterns shown in the **Basic SAML Configuration** dialog box.

5. In the **SAML Signing Certificate** section, select the **Edit** icon to open the **SAML Signing Certificate** dialog box:

	![Screenshot shows the SAML Signing Certificate page with the edit icon selected.](common/edit-certificate.png)

6. In the **SAML Signing Certificate** dialog box, copy the **Thumbprint** value and save it:

    ![Copy the Thumbprint value](common/copy-thumbprint.png)

7. In the **Set up ITRP** section, copy the appropriate URLs, based on your requirements:

	![Copy the configuration URLs](common/copy-configuration-urls.png)

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

In this section, you'll enable B.Simon to use single sign-on by granting access to ITRP.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **ITRP**.
1. In the app's overview page, select **Users and groups**.
1. Select **Add user/group**, then select **Users and groups** in the **Add Assignment** dialog.
   1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
   1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
   1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure ITRP SSO

1. In a new web browser window, sign in to your ITRP company site as an admin.

1. At the top of the window, select the **Settings** icon:

    ![Settings icon](./media/itrp-tutorial/profile.png "Settings icon")

1. In the left pane, select **Single Sign-On**:

    ![Select Single Sign-On](./media/itrp-tutorial/setting.png "Select Single Sign-On")

1. In the **Single Sign-On** configuration section, take the following steps.

    ![Screenshot shows the Single Sign-On section with Enabled selected.](./media/itrp-tutorial/configuration.png "Single Sign-On section")

    ![Screenshot shows the Single Sign-On section where you can add the information described in this step.](./media/itrp-tutorial/certificate.png "Single Sign-On section")

	1. Select **Enabled**.

	1. In the **Remote logout URL** box, paste the **Logout URL** value that you copied.

	1. In the **SAML SSO URL** box, paste the **Login URL** value that you copied.

	1. In the **Certificate fingerprint** box, paste the **Thumbprint** value of the certificate, which you copied.

    1. Select **Save**.

### Create an ITRP test user

To enable Microsoft Entra users to sign in to ITRP, you need to add them to ITRP. You need to add them manually.

To create a user account, take these steps:

1. Sign in to your ITRP tenant.

1. At the top of the window, select the **Records** icon:

    ![Records icon](./media/itrp-tutorial/account.png "Records icon")

1. In the menu, select **People**:

    ![Select People](./media/itrp-tutorial/user.png "Select People")

1. Select the plus sign (**+**) to add a new person:

    ![Select the plus sign](./media/itrp-tutorial/people.png "Select the plus sign")

1. In the **Add New Person** dialog box, take the following steps.

    ![Add New Person dialog box](./media/itrp-tutorial/details.png "Add New Person dialog box")

    1. Enter the name and email address of a valid Microsoft Entra account that you want to add.

    1. Select **Save**.

> [!NOTE]
> You can use any user account creation tool or API provided by ITRP to provision Microsoft Entra user accounts.

## Test SSO

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

* Click on **Test this application**, this will redirect to ITRP Sign-on URL where you can initiate the login flow. 

* Go to ITRP Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the ITRP tile in the My Apps, this will redirect to ITRP Sign-on URL. For more information, see [Microsoft Entra My Apps](/azure/active-directory/manage-apps/end-user-experiences#azure-ad-my-apps).

## Next steps

Once you configure ITRP you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).

---
title: 'Tutorial: Microsoft Entra single sign-on (SSO) integration with Zoom'
description: Learn how to configure single sign-on between Microsoft Entra ID and Zoom.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 09/13/2023
ms.author: jeedes
---

# Tutorial: Microsoft Entra single sign-on (SSO) integration with Zoom

In this tutorial, you'll learn how to integrate Zoom with Microsoft Entra ID. When you integrate Zoom with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to Zoom.
* Enable your users to be automatically signed-in to Zoom with their Microsoft Entra accounts.
* Manage your accounts in one central location.

## Prerequisites

To get started, you need the following items:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Zoom single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Microsoft Entra SSO in a test environment.

* Zoom supports **SP** initiated SSO and 
* Zoom supports [**Automated** user provisioning](./zoom-provisioning-tutorial.md).

## Adding Zoom from the gallery

To configure the integration of Zoom into Microsoft Entra ID, you need to add Zoom from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **Zoom** in the search box.
1. Select **Zoom** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-sso-for-zoom'></a>

## Configure and test Microsoft Entra SSO for Zoom

Configure and test Microsoft Entra SSO with Zoom using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in Zoom.

To configure and test Microsoft Entra SSO with Zoom, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
	1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - to test Microsoft Entra single sign-on with B.Simon.
	1. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Microsoft Entra single sign-on.
2. **[Configure Zoom SSO](#configure-zoom-sso)** - to configure the Single Sign-On settings on application side.
	1. **[Create Zoom test user](#create-zoom-test-user)** - to have a counterpart of B.Simon in Zoom that is linked to the Microsoft Entra representation of user.
3. **[Test SSO](#test-sso)** - to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Zoom** application integration page, find the **Manage** section and select **Single sign-on**.
1. On the **Select a Single sign-on method** page, select **SAML**.
1. On the **Set up Single Sign-On with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot of Edit Basic SAML Configuration.](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:
    `<companyname>.zoom.us`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://<companyname>.zoom.us/saml/SSO`

    c. In the **Sign on URL** text box, type a URL using the following pattern:
    `https://<companyname>.zoom.us`

	> [!NOTE]
	> These values are not real. Update these values with the actual Sign on URL and Identifier. Contact [Zoom Client support team](https://support.zoom.us/hc/) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section.

1. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![Screenshot of The Certificate download link.](common/certificatebase64.png)

1. On the **Set up Zoom** section, copy the appropriate URL(s) based on your requirement.

	![Screenshot of Copy configuration URLs.](common/copy-configuration-urls.png)

> [!NOTE]
> To learn how to configure Role in Microsoft Entra ID, see [Configure the role claim issued in the SAML token for enterprise applications](../develop/active-directory-enterprise-app-role-management.md).

> [!NOTE]
> Zoom might expect a group claim in the SAML payload. If you have created any groups, contact the [Zoom Client support team](https://support.zoom.us/hc/) with the group information so they can configure the group information on their end. You also need to provide the Object ID to [Zoom Client support team](https://support.zoom.us/hc/) so they can configure the Object ID on their end. To get the Object ID, see [Configuring Zoom with Azure](https://support.zoom.us/hc/articles/115005887566).

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

In this section, you'll enable B.Simon to use single sign-on by granting access to Zoom.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Zoom**.
1. In the app's overview page, select **Users and groups**.
1. Select **Add user/group**, then select **Users and groups** in the **Add Assignment** dialog.
   1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
   1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
   1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Zoom SSO

1. To automate the configuration within Zoom, you need to install **My Apps Secure Sign-in browser extension** by clicking **Install the extension**.

	![Screenshot of My apps extension.](common/install-myappssecure-extension.png)

2. After adding extension to the browser, click on **Set up Zoom** will direct you to the Zoom application. From there, provide the admin credentials to sign into Zoom. The browser extension will automatically configure the application for you and automate steps 3-6.

	![Screenshot of Setup configuration.](common/setup-sso.png)

3. If you want to set up Zoom manually, in a different web browser window, sign in to your Zoom company site as an administrator.

2. Click the **Single Sign-On** tab.

    ![Screenshot of Single sign-on tab.](./media/zoom-tutorial/single-sign-on.png "Single sign-on")

3. Click the **Security Control** tab, and then go to the **Single Sign-On** settings.

4. In the Single Sign-On section, perform the following steps:

    ![Screenshot of Single sign-on section.](./media/zoom-tutorial/configuration.png "Single sign-on")

    a. In the **Sign-in page URL** textbox, paste the value of **Login URL**..

    b. For **Sign-out page URL** value, in the Microsoft Entra admin center, navigate to **Identity** > **App registrations**> **Endpoints**.

	![Screenshot of The Endpoints button.](./media/zoom-tutorial/endpoint.png)

	d. Copy the **SAML-P SIGN-OUT ENDPOINT** and paste it into **Sign-out page URL** textbox.

	![Screenshot of The Copy End point button.](./media/zoom-tutorial/sign-out-endpoint.png)

    e. Open your base-64 encoded certificate in notepad, copy the content of it into your clipboard, and then paste it to the **Identity provider certificate** textbox.

    f. In the **Issuer** textbox, paste the value of **Microsoft Entra Identifier**..

	g. Select **HTTP-Redirect** as **Binding** and **SHA-256** as **Signature Hash Algorithm**.

    h. Click **Save Changes**.

    > [!NOTE]
	> For more information, visit the zoom [documentation](https://zoomus.zendesk.com/hc/articles/115005887566).

### Create Zoom test user

The objective of this section is to create a user called B.Simon in Zoom. Zoom supports automatic user provisioning, which is by default enabled. You can find more details [here](./zoom-provisioning-tutorial.md) on how to configure automatic user provisioning.

> [!NOTE]
> If you need to create a user manually, you need to contact [Zoom Client support team](https://support.zoom.us/hc/)

## Test SSO 

In this section, you test your Microsoft Entra single sign-on configuration with following options.

* Click on **Test this application**, this will redirect to Zoom Sign-on URL where you can initiate the login flow.

* Go to Zoom Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Zoom tile in the My Apps, this will redirect to Zoom Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

Once you configure Microsoft Entra Zoom you can enforce Session Control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session Control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).

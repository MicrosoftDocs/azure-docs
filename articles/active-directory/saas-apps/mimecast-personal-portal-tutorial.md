---
title: 'Tutorial: Microsoft Entra SSO integration with Mimecast'
description: Learn how to configure single sign-on between Microsoft Entra ID and Mimecast.
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

# Tutorial: Microsoft Entra SSO integration with Mimecast

In this tutorial, you'll learn how to integrate Mimecast with Microsoft Entra ID. When you integrate Mimecast with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to Mimecast.
* Enable your users to be automatically signed-in to Mimecast with their Microsoft Entra accounts.
* Manage your accounts in one central location.

## Prerequisites

To get started, you need the following items:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Mimecast single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Microsoft Entra SSO in a test environment.

* Mimecast supports **SP and IDP** initiated SSO.
 
## Add Mimecast from the gallery

To configure the integration of Mimecast into Microsoft Entra ID, you need to add Mimecast from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **Mimecast** in the search box.
1. Select **Mimecast** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-azure-ad-sso-for-mimecast'></a>

## Configure and test Microsoft Entra SSO for Mimecast

Configure and test Microsoft Entra SSO with Mimecast using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in Mimecast.

To configure and test Microsoft Entra SSO with Mimecast, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - to test Microsoft Entra single sign-on with B.Simon.
    1. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Microsoft Entra single sign-on.
1. **[Configure Mimecast SSO](#configure-mimecast-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Mimecast test user](#create-mimecast-test-user)** - to have a counterpart of B.Simon in Mimecast that is linked to the Microsoft Entra representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Mimecast** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section,  if you wish to configure the application in IDP initiated mode, perform the following steps:

	a. In the **Identifier** textbox, type a URL using one of the following patterns:

    | Region  |  Value | 
	| --------------- | --------------- |
	| Europe          | `https://eu-api.mimecast.com/sso/<accountcode>`|
	| United States   | `https://us-api.mimecast.com/sso/<accountcode>`|
	| South Africa    | `https://za-api.mimecast.com/sso/<accountcode>`|
	| Australia       | `https://au-api.mimecast.com/sso/<accountcode>`|
	| Offshore        | `https://jer-api.mimecast.com/sso/<accountcode>`|

	> [!NOTE]
	> You will find the `accountcode` value in the Mimecast under **Account** > **Settings** > **Account Code**. Append the `accountcode` to the Identifier.

	b. In the **Reply URL** textbox, type one of the following URLs:

	| Region  |  Value |
	| --------------- | --------------- |
	| Europe          | `https://eu-api.mimecast.com/login/saml`|
	| United States   | `https://us-api.mimecast.com/login/saml`|
	| South Africa    | `https://za-api.mimecast.com/login/saml`|
	| Australia       | `https://au-api.mimecast.com/login/saml`|
	| Offshore        | `https://jer-api.mimecast.com/login/saml`|

1. If you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** textbox, type one of the following URLs:

	| Region  |  Value |
	| --------------- | --------------- |
	| Europe          | `https://eu-api.mimecast.com/login/saml`|
	| United States   | `https://us-api.mimecast.com/login/saml`|
	| South Africa    | `https://za-api.mimecast.com/login/saml`|
	| Australia       | `https://au-api.mimecast.com/login/saml`|
	| Offshore        | `https://jer-api.mimecast.com/login/saml`|

1. Click **Save**.

1. On the **Set up single sign-on with SAML** page, In the **SAML Signing Certificate** section, click copy button to copy **App Federation Metadata Url** and save it on your computer.

	![The Certificate download link](common/copy-metadataurl.png)

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

In this section, you'll enable B.Simon to use single sign-on by granting access to Mimecast .

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Mimecast**.
1. In the app's overview page, select **Users and groups**.
1. Select **Add user/group**, then select **Users and groups** in the **Add Assignment** dialog.
   1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
   1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
   1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Mimecast SSO

1. In a different web browser window, sign into Mimecast Administration Console.

1. Navigate to **Administration** > **Services** > **Applications**.

    ![Screenshot shows Mimecast window with Applications selected.](./media/mimecast-personal-portal-tutorial/services.png)

1. Click **Authentication Profiles** tab.
    
    ![Screenshot shows the Application tab with Authentication Profiles selected.](./media/mimecast-personal-portal-tutorial/authentication-profiles.png)

1. Click **New Authentication Profile** tab.

	![Screenshot shows new Authentication Profile selected.](./media/mimecast-personal-portal-tutorial/new-authenticatio-profile.png)

1. Provide a valid description in the **Description** textbox and select **Enforce SAML Authentication for Mimecast** checkbox.

    ![Screenshot shows New Authentication Profile selected.](./media/mimecast-personal-portal-tutorial/selecting-personal-portal.png)

1. On the **SAML Configuration for Mimecast** page, perform the following steps:

    ![Screenshot shows where to select Enforce SAML Authentication for Administration Console.](./media/mimecast-personal-portal-tutorial/sso-settings.png)

	a. For **Provider**, select **Microsoft Entra ID** from the Dropdown.

	b. In the **Metadata URL** textbox, paste the **App Federation Metadata URL** value, which you copied previously.

	c. Click **Import**. After importing the Metadata URL, the fields will be populated automatically, no need to perform any action on these fields.

	d. Make sure you uncheck **Use Password protected Context** and **Use Integrated Authentication Context** checkboxes.

	e. Click **Save**.

### Create Mimecast test user

1. In a different web browser window, sign into Mimecast Administration Console.

1. Navigate to **Administration** > **Directories** > **Internal Directories**.

    ![Screenshot shows the SAML Configuration for Mimecast where you can enter the values described.](./media/mimecast-personal-portal-tutorial/internal-directories.png)

1. Select on your domain, if the domain is mentioned below, otherwise please create a new domain by clicking on the **New Domain**.

    ![Screenshot shows Mimecast window with Internal Directories selected.](./media/mimecast-personal-portal-tutorial/domain-name.png)

1. Click **New Address** tab.

    ![Screenshot shows the domain selected.](./media/mimecast-personal-portal-tutorial/new-address.png)

1. Provide the required user information on the following page:

    ![Screenshot shows the page where you can enter the values described.](./media/mimecast-personal-portal-tutorial/user-information.png)

	a. In the **Email Address** textbox, enter the email address of the user like `B.Simon@yourdomainname.com`.

	b. In the **Global Name** textbox, enter the **Full name** of the user.

	c. In the **Password** and **Confirm Password** textboxes, enter the password of the user.

	d. Select **Force Change at Login** checkbox.

	e. Click **Save**.

	f. To assign roles to the user, click on **Role Edit** and assign the required role to user as per your organization requirement.

    ![Screenshot shows Address Settings where you can select Role Edit.](./media/mimecast-personal-portal-tutorial/assign-role.png)


## Test SSO 
In this section, you test your Microsoft Entra single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application**, this will redirect to Mimecast  Sign on URL where you can initiate the login flow.  

* Go to Mimecast  Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application**, and you should be automatically signed in to the Mimecast  for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the Mimecast  tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the Mimecast  for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

Once you configure Mimecast you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-any-app).

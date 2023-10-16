---
title: 'Tutorial: Microsoft Entra single sign-on (SSO) integration with Jamf Pro'
description: Learn how to configure single sign-on between Microsoft Entra ID and Jamf Pro.
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

# Tutorial: Microsoft Entra SSO integration with Jamf Pro

In this tutorial, you'll learn how to integrate Jamf Pro with Microsoft Entra ID. When you integrate Jamf Pro with Microsoft Entra ID, you can:

* Use Microsoft Entra ID to control who has access to Jamf Pro.
* Automatically sign in your users to Jamf Pro with their Microsoft Entra accounts.
* Manage your accounts in one central location: the Azure portal.


## Prerequisites

To get started, you need the following items:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* A Jamf Pro subscription that's single sign-on (SSO) enabled.

## Scenario description

In this tutorial, you configure and test Microsoft Entra SSO in a test environment. 

* Jamf Pro supports **SP-initiated** and **IdP-initiated** SSO.

## Add Jamf Pro from the gallery

To configure the integration of Jamf Pro into Microsoft Entra ID, you need to add Jamf Pro from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, enter *Jamf Pro* in the search box.
1. Select **Jamf Pro** from results panel, and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

<a name='configure-and-test-sso-in-azure-ad-for-jamf-pro'></a>

## Configure and test SSO in Microsoft Entra ID for Jamf Pro

Configure and test Microsoft Entra SSO with Jamf Pro by using a test user called B.Simon. For SSO to work, you need to establish a link relationship between a Microsoft Entra user and the related user in Jamf Pro.

In this section, you configure and test Microsoft Entra SSO with Jamf Pro.

1. [Configure SSO in Microsoft Entra ID](#configure-sso-in-azure-ad) so that your users can use this feature.
    1. [Create a Microsoft Entra test user](#create-an-azure-ad-test-user) to test Microsoft Entra SSO with the B.Simon account.
    1. [Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user) so that B.Simon can use SSO in Microsoft Entra ID.
1. [Configure SSO in Jamf Pro](#configure-sso-in-jamf-pro) to configure the SSO settings on the application side.
    1. [Create a Jamf Pro test user](#create-a-jamf-pro-test-user) to have a counterpart of B.Simon in Jamf Pro that's linked to the Microsoft Entra representation of the user.
1. [Test the SSO configuration](#test-the-sso-configuration) to verify that the configuration works.

<a name='configure-sso-in-azure-ad'></a>

## Configure SSO in Microsoft Entra ID

In this section, you enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Jamf Pro** application integration page, find the **Manage** section and select **Single Sign-On**.
1. On the **Select a Single Sign-On Method** page, select **SAML**.
1. On the **Set up Single Sign-On with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit the Basic SAML Configuration page.](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, if you want to configure the application in **IdP-initiated** mode, enter the values for the following fields:

    a. In the **Identifier** text box, enter a URL that uses the following formula:
    `https://<subdomain>.jamfcloud.com/saml/metadata`

    b. In the **Reply URL** text box, enter a URL that uses the following formula:
    `https://<subdomain>.jamfcloud.com/saml/SSO`

1. Select **Set additional URLs**. If you want to configure the application in **SP-initiated** mode, in the **Sign-on URL** text box, enter a URL that uses the following formula:
    `https://<subdomain>.jamfcloud.com`

	> [!NOTE]
	> These values aren't real. Update these values with the actual identifier, reply URL, and sign-on URL. You'll get the actual identifier value from the **Single Sign-On** section in Jamf Pro portal, which is explained later in the tutorial. You can extract the actual subdomain value from the identifier value and use that subdomain information as your sign-on URL and reply URL. You can also refer to the formulas shown in the **Basic SAML Configuration** section.

1. On the **Set up Single Sign-On with SAML** page, go to the **SAML Signing Certificate** section, select the **copy** button to copy **App Federation Metadata URL**, and then save it to your computer.

	![The SAML Signing Certificate download link](common/copy-metadataurl.png)

<a name='create-an-azure-ad-test-user'></a>

### Create a Microsoft Entra test user

In this section, you create a test user called B.Simon.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Users** > **All users**.
1. Select **New user** at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Name** field, enter `B.Simon`.
   1. In the **User name** field, enter [name]@[companydomain].[extension]. For example, `B.Simon@contoso.com`.
   1. Select the **Show password** check box, and then write down the value that's displayed in the **Password** box.
   1. Select **Create**.

<a name='assign-the-azure-ad-test-user'></a>

### Assign the Microsoft Entra test user

In this section, you grant B.Simon access to Jamf Pro.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Jamf Pro**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog box.
1. In the **Users and groups** dialog box, select **B.Simon** from the Users list, and then select the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog box, select the **Assign** button.

## Configure SSO in Jamf Pro

1. To automate the configuration within Jamf Pro, install the **My Apps Secure Sign-in browser extension** by selecting **Install the extension**.

	![My Apps Secure Sign-in browser extension page](common/install-myappssecure-extension.png)

2. After adding the extension to the browser, select **Set up Jamf Pro**. When the Jamf Pro application opens, provide the administrator credentials to sign in. The browser extension will automatically configure the application and automate steps 3 through 7.

	![Setup configuration page in Jamf Pro](common/setup-sso.png)

3. To set up Jamf Pro manually, open a new web browser window and sign in to your Jamf Pro company site as an administrator. Then, take the following steps.

4. Select the **Settings icon** from the upper-right corner of the page.

	![Select the settings icon in Jamf Pro](./media/jamfprosamlconnector-tutorial/configure1.png)

5. Select **Single Sign-On**.

	![Select Single Sign-On in Jamf Pro](./media/jamfprosamlconnector-tutorial/configure2.png)

6. On the **Single Sign-On** page, take the following steps.

	![The Single Sign-On page in Jamf Pro](./media/jamfprosamlconnector-tutorial/configure3.png)

	a. Select **Edit**.

	b. Select the **Enable Single Sign-On Authentication** check box.

	c. Select **Azure** as an option from the **Identity Provider** drop-down menu.

	d. Copy the **ENTITY ID** value and paste it into the **Identifier (Entity ID)** field in the **Basic SAML Configuration** section.

	> [!NOTE]
	> Use the value in the `<SUBDOMAIN>` field to complete the sign-on URL and reply URL in the **Basic SAML Configuration** section.

	e. Select **Metadata URL** from the **Identity Provider Metadata Source** drop-down menu. In the field that appears, paste the **App Federation Metadata Url** value that you've copied.

	f. (Optional) Edit the token expiration value or select "Disable SAML token expiration".

7. On the same page, scroll down to the **User Mapping** section. Then, take the following steps.

	![The User Mapping section of the Single Sign-On page in Jamf Pro.](./media/jamfprosamlconnector-tutorial/tutorial-jamfprosamlconnector-single.png)

	a. Select the **NameID** option for **Identity Provider User Mapping**. By default, this option is set to **NameID**, but you can define a custom attribute.

	b. Select **Email** for **Jamf Pro User Mapping**. Jamf Pro maps SAML attributes sent by the IdP first by users and then by groups. When a user tries to access Jamf Pro, Jamf Pro gets information about the user from the Identity Provider and matches it against all Jamf Pro user accounts. If the incoming user account isn't found, then Jamf Pro attempts to match it by group name.

	c. Paste the value `http://schemas.microsoft.com/ws/2008/06/identity/claims/groups` in the **IDENTITY PROVIDER GROUP ATTRIBUTE NAME** field.

	d. On the same page, scroll down to the **Security** section and select **Allow users to bypass the Single Sign-On authentication**. As a result, users won't be redirected to the Identity Provider sign-in page for authentication and can sign in to Jamf Pro directly instead. When a user tries to access Jamf Pro via the Identity Provider, IdP-initiated SSO authentication and authorization occurs.

	e. Select **Save**.

### Create a Jamf Pro test user

In order for Microsoft Entra users to sign in to Jamf Pro, they must be provisioned in to Jamf Pro. Provisioning in Jamf Pro is a manual task.

To provision a user account, take the following steps:

1. Sign in to your Jamf Pro company site as an administrator.

2. Select the **Settings** icon in the upper-right corner of the page.

	![The settings icon in Jamf Pro](./media/jamfprosamlconnector-tutorial/configure1.png)

3. Select **Jamf Pro User Accounts & Groups**.

	![The Jamf Pro User Accounts & Groups icon in Jamf Pro settings](./media/jamfprosamlconnector-tutorial/user1.png)

4. Select **New**.

	![Jamf Pro User Accounts & Groups system settings page](./media/jamfprosamlconnector-tutorial/user2.png)

5. Select **Create Standard Account**.

	![The Create Standard Account option in the Jamf Pro User Accounts & Groups page](./media/jamfprosamlconnector-tutorial/user3.png)

6. On the **New Account** dialog box, perform the following steps:

	![New account setup options in Jamf Pro system settings](./media/jamfprosamlconnector-tutorial/user4.png)

	a. In the **USERNAME** field, enter `Britta Simon`, the full name of the test user.

	b. Select the options for **ACCESS LEVEL**, **PRIVILEGE SET**, and **ACCESS STATUS** that are in accordance with your organization.

	c. In the **FULL NAME** field, enter `Britta Simon`.

	d. In the **EMAIL ADDRESS** field, enter the email address of Britta Simon's account.

	e. In the **PASSWORD** field, enter the user's password.

	f. In the **VERIFY PASSWORD** field, enter the user's password again.

	g. Select **Save**.

## Test the SSO configuration

In this section, you test your Microsoft Entra single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application**, this will redirect to Jamf Pro Sign on URL where you can initiate the login flow.  

* Go to Jamf Pro Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application**, and you should be automatically signed in to the Jamf Pro for which you set up the SSO 

You can also use Microsoft My Apps to test the application in any mode. When you click the Jamf Pro tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the Jamf Pro for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).


## Next steps

Once you configure Jamf Pro you can enforce Session Control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session Control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).

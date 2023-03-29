---
title: 'Tutorial: Azure AD SSO integration with Slack'
description: Learn how to configure single sign-on between Azure Active Directory and Slack.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 01/25/2023
ms.author: jeedes
---

# Tutorial: Azure AD SSO integration with Slack

In this tutorial, you'll learn how to integrate Slack with Azure Active Directory (Azure AD). When you integrate Slack with Azure AD, you can:

* Control in Azure AD who has access to Slack.
* Enable your users to be automatically signed-in to Slack with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Slack single sign-on (SSO) enabled subscription.

> [!NOTE]
> If you need to integrate with more than one Slack instance in one tenant, the identifier for each application can be a variable.

> [!NOTE]
> This integration is also available to use from Azure AD US Government Cloud environment. You can find this application in the Azure AD US Government Cloud Application Gallery and configure it in the same way as you do from public cloud.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Slack supports **SP (service provider)** initiated SSO.
* Slack supports **Just In Time** user provisioning.
* Slack supports [**Automated** user provisioning](./slack-provisioning-tutorial.md).

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Adding Slack from the gallery

To configure the integration of Slack into Azure AD, you need to add Slack from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Slack** in the search box.
1. Select **Slack** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. You can learn more about O365 wizards [here](/microsoft-365/admin/misc/azure-ad-setup-guides?view=o365-worldwide&preserve-view=true).

## Configure and test Azure AD SSO for Slack

Configure and test Azure AD SSO with Slack using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Slack.

To configure and test Azure AD SSO with Slack, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
	1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
	1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Slack SSO](#configure-slack-sso)** - to configure the single sign-on settings on application side.
	1. **[Create Slack test user](#create-slack-test-user)** - to have a counterpart of B.Simon in Slack that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

### Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Slack** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, enter the values for the following fields:

    a. In the **Sign on URL** text box, type a URL using the following pattern:
    `https://<DOMAIN NAME>.slack.com/sso/saml/start`

    b. In the **Identifier (Entity ID)** text box, type the URL:
    `https://slack.com`
	
    c. For **Reply URL**, enter one of the following URL patterns:
    
	| Reply URL|
	|----------|
	| `https://<DOMAIN NAME>.slack.com/sso/saml` |
	| `https://<DOMAIN NAME>.enterprise.slack.com/sso/saml` |

	> [!NOTE]
	> These values aren't real. You need to update these values with the actual Sign-on URL and Reply URL. Contact [Slack Client support team](https://slack.com/help/contact) to get the value. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

	> [!NOTE]
	> The value for **Identifier (Entity ID)** can be a variable if you have more than one Slack instance that you need to integrate with the tenant. Use the pattern `https://<DOMAIN NAME>.slack.com`. In this scenario, you also must pair with another setting in Slack by using the same value.

1. Slack application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

	![image](common/edit-attribute.png)

1. In addition to above, Slack application expects few more attributes to be passed back in SAML response which are shown below. These attributes are also pre populated but you can review them as per your requirements. You also must add the `email` attribute. If the user does not have an email address, map **emailaddress** to **user.userprincipalname** and map **email** to **user.userprincipalname**.

    | Name | Source Attribute |
    | -----|---------|
    | emailaddress | user.userprincipalname |
    | email | user.userprincipalname |

   > [!NOTE]
   > In order to set up the service provider (SP) configuration, you must click on **Expand** next to **Advanced Options** in the SAML configuration page. In the **Service Provider Issuer** box, enter the workspace URL. The default is slack.com. 

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. On the **Set up Slack** section, copy the appropriate URL(s) based on your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

### Create an Azure AD test user

In this section, you'll create a test user in the Azure portal called B.Simon.

1. From the left pane in the Azure portal, select **Azure Active Directory**, select **Users**, and then select **All users**.
1. Select **New user** at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Name** field, enter `B.Simon`.  
   1. In the **User name** field, enter the username@companydomain.extension. For example, `B.Simon@contoso.com`.
   1. Select the **Show password** check box, and then write down the value that's displayed in the **Password** box.
   1. Click **Create**.

### Assign the Azure AD test user

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Slack.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Slack**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Slack SSO

1. To automate the configuration within Slack, you need to install **My Apps Secure Sign-in browser extension** by clicking **Install the extension**.

	![My apps extension](common/install-myappssecure-extension.png)

2. After adding extension to the browser, click on **Set up Slack** will direct you to the Slack application. From there, provide the admin credentials to sign into Slack. The browser extension will automatically configure the application for you and automate steps 3-6.

	![Setup configuration](common/setup-sso.png)

3. If you want to set up Slack manually, in a different web browser window, sign in to your Slack company site as an administrator.

2. click on your workspace name in the top left, then go to **Settings & administration** -> **Workspace settings**.

     ![Screenshot of Configure single sign-on On Microsoft Azure AD.](./media/slack-tutorial/tutorial-slack-team-settings.png)

3. In the **Settings & permissions** section, click the **Authentication** tab, and then click **Configure** button at SAML authentication method.

    ![Screenshot of Configure single sign-on On Team Settings.](./media/slack-tutorial/tutorial-slack-authentication.png)

4. On the **Configure SAML authentication for Azure** dialog, perform the below steps:

    ![Screenshot of Configure single sign-on On SAML Authentication Settings.](./media/slack-tutorial/tutorial-slack-save-authentication.png)

    a. In the top right, toggle **Test** mode on.
    
    b.  In the **SAML SSO URL** textbox, paste the value of **Login URL**, which you have copied from Azure portal.

    c.  In the **Identity provider issuer** textbox, paste the value of **Azure Ad Identifier**, which you have copied from Azure portal.

    d.  Open your downloaded certificate file in Notepad, copy the content of it into your clipboard, and then paste it to the **Public Certificate** textbox.

1. Expand the **Advanced options** and perform the below steps:

    ![Screenshot of Configure Advanced options single sign-on On App Side.](./media/slack-tutorial/advanced-settings.png)

    a. If you need an end-to-end encryption key, tick the box **Sign AuthnRequest** to show the certificate.

    b. Enter `https://slack.com` in the **Service provider issuer** textbox.

    c. Choose how the SAML response from your IDP is signed from the two options.

1. Under **Settings**, decide if members can edit their profile information (like their email or display name) after SSO is enabled. You can also choose whether SSO is required, partially required or optional.

   ![Screenshot of Configure Save configuration single sign-on On App Side.](./media/slack-tutorial/save-configuration-button.png) 

1. Click **Save Configuration**.
    
    > [!NOTE]
    > If you have more than one Slack instance that you need to integrate with Azure AD, set `https://<DOMAIN NAME>.slack.com` to **Service provider issuer** so that it can pair with the Azure application **Identifier** setting.

### Create Slack test user

The objective of this section is to create a user called B.Simon in Slack. Slack supports just-in-time provisioning, which is by default enabled. There is no action item for you in this section. A new user is created during an attempt to access Slack if it doesn't exist yet. Slack also supports automatic user provisioning, you can find more details [here](slack-provisioning-tutorial.md) on how to configure automatic user provisioning.

> [!NOTE]
> If you need to create a user manually, you need to contact [Slack support team](https://slack.com/help/contact).

> [!NOTE]
> Azure AD Connect is the synchronization tool which can sync on premises Active Directory Identities to Azure AD and then these synced users can also use the applications as like other cloud users.

## Test SSO

In this section, you test your Azure AD single sign-on configuration with following options.

* Click on **Test this application** in Azure portal. This will redirect to Slack Sign-on URL where you can initiate the login flow.

* Go to Slack Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Slack tile in the My Apps, this will redirect to Slack Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

Once you configure Slack you can enforce Session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).

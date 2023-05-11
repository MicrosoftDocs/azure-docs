---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with Foodee'
description: Learn how to configure single sign-on between Azure Active Directory and Foodee.
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

# Tutorial: Azure Active Directory single sign-on (SSO) integration with Foodee

In this tutorial, you'll learn how to integrate Foodee with Azure Active Directory (Azure AD). When you integrate Foodee with Azure AD, you can:

* Control in Azure AD who has access to Foodee.
* Enable your users to be automatically signed-in to Foodee with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Foodee single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Foodee supports **SP and IDP** initiated SSO.
* Foodee supports **Just In Time** user provisioning.
* Foodee supports [Automated user provisioning](foodee-provisioning-tutorial.md).

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Adding Foodee from the gallery

To configure the integration of Foodee into Azure AD, you need to add Foodee from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Foodee** in the search box.
1. Select **Foodee** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for Foodee

Configure and test Azure AD SSO with Foodee using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Foodee.

To configure and test Azure AD SSO with Foodee, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Foodee SSO](#configure-foodee-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Foodee test user](#create-foodee-test-user)** - to have a counterpart of B.Simon in Foodee that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Foodee** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, enter the values for the following fields:

    In the **Reply URL** text box, type a URL using the following pattern:
    `https://concierge.food.ee/sso/saml/<INSTANCENAME>/consume`

1. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://concierge.food.ee/sso/saml/<INSTANCENAME>`

	> [!NOTE]
	> These values are not real. Update these values with the actual Reply URL and Sign-On URL. Contact [Foodee Client support team](mailto:dev@food.ee) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

1. On the **Set up Foodee** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Foodee.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Foodee**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

### Configure Foodee SSO

1. To automate the configuration within Foodee, you need to install **My Apps Secure Sign-in browser extension** by clicking **Install the extension**.

	![My apps extension](common/install-myappssecure-extension.png)

2. After adding extension to the browser, click on **Set up Foodee** will direct you to the Foodee application. From there, provide the admin credentials to sign into Foodee. The browser extension will automatically configure the application for you and automate steps 3-4.

	![Setup configuration](common/setup-sso.png)

3. If you want to setup Foodee manually, open a new web browser window and sign into your Foodee company site as an administrator and perform the following steps:

4. Click on **profile logo** on the top right corner of the page then navigate to **Single Sign On** and perform the following steps:

   ![Foodee configuration](./media/foodee-tutorial/profile-logo.png)

   1. In the **IDP NAME** text box, type the name like ex:Azure.
   1. Open the Federation Metadata XML in Notepad, copy its content and paste it in the **IDP METADATA XML** text box.
   1. Click **Save**.

### Create Foodee test user

In this section, a user called B.Simon is created in Foodee. Foodee supports just-in-time provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in Foodee, a new one is created when you attempt to access Foodee.

Foodee also supports automatic user provisioning, you can find more details [here](./foodee-provisioning-tutorial.md) on how to configure automatic user provisioning.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options.

SP initiated:

* Click on Test this application in Azure portal. This will redirect to Foodee Sign on URL where you can initiate the login flow.

* Go to Foodee Sign-on URL directly and initiate the login flow from there.

IDP initiated:

* Click on Test this application in Azure portal and you should be automatically signed in to the Foodee for which you set up the SSO

You can also use Microsoft My Apps to test the application in any mode. When you click the Foodee tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the Foodee for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).


## Next steps

Once you configure Foodee you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-any-app).

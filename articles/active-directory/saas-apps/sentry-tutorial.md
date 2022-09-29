---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with Sentry | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Sentry.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 10/23/2020
ms.author: jeedes

---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with Sentry

In this tutorial, you'll learn how to integrate Sentry with Azure Active Directory (Azure AD). When you integrate Sentry with Azure AD, you can:

* Control in Azure AD who has access to Sentry.
* Enable your users to be automatically signed-in to Sentry with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Sentry single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Sentry supports **SP and IDP** initiated SSO
* Sentry supports **Just In Time** user provisioning

## Adding Sentry from the gallery

To configure the integration of Sentry into Azure AD, you need to add Sentry from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Sentry** in the search box.
1. Select **Sentry** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)


## Configure and test Azure AD SSO for Sentry

Configure and test Azure AD SSO with Sentry using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Sentry.

To configure and test Azure AD SSO with Sentry, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    * **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    * **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Sentry SSO](#configure-sentry-sso)** - to configure the single sign-on settings on application side.
    * **[Create Sentry test user](#create-sentry-test-user)** - to have a counterpart of B.Simon in Sentry that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Sentry** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, enter the values for the following fields:

    a. In the **Identifier** text box, type a URL using the following pattern:
    `https://sentry.io/saml/metadata/<ORGANIZATION_SLUG>/`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://sentry.io/saml/acs/<ORGANIZATION_SLUG>/`

1. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://sentry.io/organizations/<ORGANIZATION_SLUG>/`

	> [!NOTE]
	> These values are not real. Update these values with the actual values Identifier, Reply URL, and Sign-on URL. For more information about finding these values, see the [Sentry documentation](https://docs.sentry.io/product/accounts/sso/azure-sso/#installation). You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section, click the copy icon to copy the **App Metadata URL** value, and then save it on your computer.

   ![The Certificate download link](common/copy-metadataurl.png)
	
### Create an Azure AD test user

In this section, you'll create a test user called B.Simon in the Azure portal.

1. From the left pane in the Azure portal, select **Azure Active Directory**, select **Users**, and then select **All users**.
1. Select **New user** at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Name** field, enter `B.Simon`.  
   1. In the **User name** field, enter the username@companydomain.extension. For example, `B.Simon@contoso.com`.
   1. Select the **Show password** check box, and then write down the value that's displayed in the **Password** box.
   1. Click **Create**.

### Assign the Azure AD test user

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Sentry.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Sentry**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Sentry SSO

To configure single sign-on on the **Sentry** side, go to **Org Settings** > **Auth** (or go to `https://sentry.io/settings/<YOUR_ORG_SLUG>/auth/`) and select **Configure** for Active Directory. Paste the App Federation Metadata URL from your Azure SAML configuration.

### Create Sentry test user

In this section, a user called B.Simon is created in Sentry. Sentry supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in Sentry, a new one is created after authentication.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

#### SP initiated:

1. In the Azure portal, select **Test this application**. You're redirected to the Sentry sign-on URL, where you can initiate the sign-in flow.  

1. Go to Sentry sign-on URL directly and initiate the sign-in flow from there.

#### IDP initiated:

* In the Azure portal, select **Test this application**. You should be automatically signed in to the Sentry application for which you set up the SSO. 

#### Either mode:

You can use the My Apps portal to test the application in any mode. When you click the Sentry tile in the My Apps portal, if configured in SP mode, you are redirected to the application sign-on page to initiate the sign-in flow. If configured in IDP mode, you should be automatically signed in to the Sentry application for which you set up the SSO. For more information about the My Apps portal, see [Sign in and start apps from the My Apps portal](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

Once you configure Sentry you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-any-app).

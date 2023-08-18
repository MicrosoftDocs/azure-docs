---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with Michigan Data Hub Single Sign-On'
description: Learn how to configure single sign-on between Azure Active Directory and Michigan Data Hub Single Sign-On.
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

# Tutorial: Azure Active Directory single sign-on (SSO) integration with Michigan Data Hub Single Sign-On

In this tutorial, you'll learn how to integrate Michigan Data Hub Single Sign-On with Azure Active Directory (Azure AD). When you integrate Michigan Data Hub Single Sign-On with Azure AD, you can:

* Control in Azure AD who has access to Michigan Data Hub Single Sign-On.
* Enable your users to be automatically signed-in to Michigan Data Hub Single Sign-On with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Michigan Data Hub Single Sign-On single sign-on (SSO) enabled subscription.

> [!NOTE]
> This integration is also available to use from Azure AD US Government Cloud environment. You can find this application in the Azure AD US Government Cloud Application Gallery and configure it in the same way as you do from public cloud.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Michigan Data Hub Single Sign-On supports **SP** initiated SSO.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Add Michigan Data Hub Single Sign-On from the gallery

To configure the integration of Michigan Data Hub Single Sign-On into Azure AD, you need to add Michigan Data Hub Single Sign-On from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Michigan Data Hub Single Sign-On** in the search box.
1. Select **Michigan Data Hub Single Sign-On** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for Michigan Data Hub Single Sign-On

Configure and test Azure AD SSO with Michigan Data Hub Single Sign-On using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Michigan Data Hub Single Sign-On.

To configure and test Azure AD SSO with Michigan Data Hub Single Sign-On, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Michigan Data Hub Single Sign-On SSO](#configure-michigan-data-hub-single-sign-on-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Michigan Data Hub Single Sign-On test user](#create-michigan-data-hub-single-sign-on-test-user)** - to have a counterpart of B.Simon in Michigan Data Hub Single Sign-On that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Michigan Data Hub Single Sign-On** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, perform the following step:

    In the **Sign-on URL** text box, type the URL:
    `https://launchpad.midatahub.org`

1. On the **Set up single sign-on with SAML** page, In the **SAML Signing Certificate** section, click copy button to copy **App Federation Metadata Url** and save it on your computer.

	![The Certificate download link](common/copy-metadataurl.png)

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Michigan Data Hub Single Sign-On.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Michigan Data Hub Single Sign-On**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Michigan Data Hub Single Sign-On SSO

To configure single sign-on on **Michigan Data Hub Single Sign-On** side, you need to send the **App Federation Metadata Url** to [Michigan Data Hub Single Sign-On support team](mailto:support@midatahub.org). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Michigan Data Hub Single Sign-On test user

In this section, you create a user called B.Simon in Michigan Data Hub Single Sign-On. Work with [Michigan Data Hub Single Sign-On support team](mailto:support@midatahub.org) to add the users in the Michigan Data Hub Single Sign-On platform. Users must be created and activated before you use single sign-on.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

* Click on **Test this application** in Azure portal. This will redirect to Michigan Data Hub Single Sign-On Sign-on URL where you can initiate the login flow. 

* Go to Michigan Data Hub Single Sign-On Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Michigan Data Hub Single Sign-On tile in the My Apps, this will redirect to Michigan Data Hub Single Sign-On Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

Once you configure Michigan Data Hub Single Sign-On you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).

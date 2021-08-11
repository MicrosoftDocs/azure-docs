---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with TravelPerk | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and TravelPerk.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 08/11/2021
ms.author: jeedes

---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with TravelPerk

In this tutorial, you'll learn how to integrate TravelPerk with Azure Active Directory (Azure AD). When you integrate TravelPerk with Azure AD, you can:

* Control in Azure AD who has access to TravelPerk.
* Enable your users to be automatically signed-in to TravelPerk with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* A TravelPerk account with Premium subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* TravelPerk supports **SP** initiated SSO.

* TravelPerk supports **Just In Time** user provisioning.

## Add TravelPerk from the gallery

To configure the integration of TravelPerk into Azure AD, you need to add TravelPerk from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **TravelPerk** in the search box.
1. Select **TravelPerk** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD SSO for TravelPerk

Configure and test Azure AD SSO with TravelPerk using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in TravelPerk.

To configure and test Azure AD SSO with TravelPerk, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure TravelPerk SSO](#configure-travelperk-sso)** - to configure the single sign-on settings on application side.
    1. **[Create TravelPerk test user](#create-travelperk-test-user)** - to have a counterpart of B.Simon in TravelPerk that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **TravelPerk** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:
    `https://<COMPANY>.travelperk.com/accounts/saml2/metadata/<APPLICATION_ID>`

	b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://<COMPANY>.travelperk.com/accounts/saml2/callback/<APPLICATION_ID>/?acs`

    c. In the **Sign on URL** text box, type a URL using the following pattern:
    `https://<COMPANY>.travelperk.com/`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier,Reply URL and Sign on URL. The values can be found inside your TravelPerk account: go to **Company Settings** > **Integrations** > **Single Sign On**. For assistance, visit the [TravelPerk helpcenter](https://support.travelperk.com/hc/en-us/articles/360052450271-How-can-I-setup-SSO-for-Azure-SAML).

1. Your TravelPerk application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes. In the default mapping, **emailaddress** is mapped with **user.mail**. However, the TravelPerk application expects **emailaddress** to be mapped with **user.userprincipalname**. For TravelPerk, you must edit the attribute mapping: click the **Edit** icon, and then change the attribute mapping. To edit an attribute, just click the attribute to open edit mode.

	![image](common/default-attributes.png)

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

1. On the **Set up TravelPerk** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to TravelPerk.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **TravelPerk**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure TravelPerk SSO

To configure single sign-on on **TravelPerk** side, you need to send the downloaded **Federation Metadata XML** and appropriate copied URLs from Azure portal to [TravelPerk support team](mailto:trex@travelperk.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create TravelPerk test user

In this section, a user called B.Simon is created in TravelPerk. TravelPerk supports just-in-time provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in TravelPerk, a new one is created when you attempt to access TravelPerk.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

* Click on **Test this application** in Azure portal. This will redirect to TravelPerk Sign-on URL where you can initiate the login flow. 

* Go to TravelPerk Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the TravelPerk tile in the My Apps, this will redirect to TravelPerk Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure TravelPerk you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-any-app).
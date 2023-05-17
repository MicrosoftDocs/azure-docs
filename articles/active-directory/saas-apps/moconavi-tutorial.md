---
title: 'Tutorial: Azure AD SSO integration with moconavi'
description: Learn how to configure single sign-on between Azure Active Directory and moconavi.
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
# Tutorial: Azure AD SSO integration with moconavi

In this tutorial, you'll learn how to integrate moconavi with Azure Active Directory (Azure AD). When you integrate moconavi with Azure AD, you can:

* Control in Azure AD who has access to moconavi.
* Enable your users to be automatically signed-in to moconavi with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* moconavi single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* moconavi supports **SP** initiated SSO.

## Add moconavi from the gallery

To configure the integration of moconavi into Azure AD, you need to add moconavi from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **moconavi** in the search box.
1. Select **moconavi** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for moconavi

Configure and test Azure AD SSO with moconavi using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in moconavi.

To configure and test Azure AD SSO with moconavi, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure moconavi SSO](#configure-moconavi-sso)** - to configure the single sign-on settings on application side.
    1. **[Create moconavi test user](#create-moconavi-test-user)** - to have a counterpart of B.Simon in moconavi that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **moconavi** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier** box, type a URL using the following pattern:
    `https://<yourserverurl>/moconavi-saml2`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://<yourserverurl>/moconavi-saml2/saml/SSO`

	c. In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://<yourserverurl>/moconavi-saml2/saml/login`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier, Reply URL and Sign on URL. Contact [moconavi Client support team](mailto:support@recomot.co.jp) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

5. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

6. On the **Set up moconavi** section, copy the appropriate URL(s) as per your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to moconavi.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **moconavi**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure moconavi SSO

To configure single sign-on on **moconavi** side, you need to send the downloaded **Federation Metadata XML** and appropriate copied URLs from Azure portal to [moconavi support team](mailto:support@recomot.co.jp). They set this setting to have the SAML SSO connection set properly on both sides.

### Create moconavi test user

In this section, you create a user called Britta Simon in moconavi. Work with [moconavi support team](mailto:support@recomot.co.jp) to add the users in the moconavi platform. Users must be created and activated before you use single sign-on.

## Test SSO

1. Install moconavi from Microsoft store.

2. Start moconavi.

3. Click **Connect setting** button.

	![Screenshot shows moconavi with the Connection setting button.](./media/moconavi-tutorial/settings.png)

4. Enter `https://mcs-admin.moconavi.biz/gateway` into **Connect to URL** textbox and then click **Done** button.

	![Screenshot shows the Connect to U R L box and Done button.](./media/moconavi-tutorial/testing.png)

5. On the following screenshot, perform the following steps:

	![Screenshot shows the moconavi page where you can enter the values described.](./media/moconavi-tutorial/values.png)

	a. Enter **Input Authentication Key**:`azureAD` into **Input Authentication Key** textbox.

	b. Enter **Input User ID**: `your ad account` into **Input User ID** textbox.

	c. Click **LOGIN**.

6. Input your Azure AD password to **Password** textbox and then click **Login** button.

	![Screenshot shows where to enter your Azure A D password.](./media/moconavi-tutorial/input.png)

7. Azure AD authentication is successful when the menu is displayed.

	![Screenshot shows the Telephone icon in moconavi.](./media/moconavi-tutorial/authentication.png)

## Next steps

Once you configure moconavi you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).

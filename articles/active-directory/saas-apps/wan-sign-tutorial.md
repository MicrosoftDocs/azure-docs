---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with WAN-Sign | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and WAN-Sign.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 06/09/2021
ms.author: jeedes

---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with WAN-Sign

In this tutorial, you'll learn how to integrate WAN-Sign with Azure Active Directory (Azure AD). When you integrate WAN-Sign with Azure AD, you can:

* Control in Azure AD who has access to WAN-Sign.
* Enable your users to be automatically signed-in to WAN-Sign with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* WAN-Sign single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.


* WAN-Sign supports **IDP** initiated SSO.

## Adding WAN-Sign from the gallery

To configure the integration of WAN-Sign into Azure AD, you need to add WAN-Sign from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **WAN-Sign** in the search box.
1. Select **WAN-Sign** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.


## Configure and test Azure AD SSO for WAN-Sign

Configure and test Azure AD SSO with WAN-Sign using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in WAN-Sign.

To configure and test Azure AD SSO with WAN-Sign, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure WAN-Sign SSO](#configure-wan-sign-sso)** - to configure the single sign-on settings on application side.
    1. **[Create WAN-Sign test user](#create-wan-sign-test-user)** - to have a counterpart of B.Simon in WAN-Sign that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **WAN-Sign** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Set up single sign-on with SAML** page, enter the values for the following fields:

    a. In the **Identifier** text box, type a URL using the following pattern:
    `https://service10.wanbishi.ne.jp/saml/metadata/azuread/<CUSTOMER_ID>`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://service10.wanbishi.ne.jp/saml/azuread/<CUSTOMER_ID>`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier and Reply URL. Contact [WAN-Sign Client support team](mailto:wansign-help@wanbishi.ne.jp) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. On the **Set up WAN-Sign** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to WAN-Sign.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **WAN-Sign**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure WAN-Sign SSO

To configure single sign-on on **WAN-Sign** side, you need to send the downloaded **Certificate (Base64)** and appropriate copied URLs from Azure portal to [WAN-Sign support team](mailto:wansign-help@wanbishi.ne.jp). They set this setting to have the SAML SSO connection set properly on both sides.

### Create WAN-Sign test user

In this section, you create a user called Britta Simon in WAN-Sign. Work with [WAN-Sign support team](mailto:wansign-help@wanbishi.ne.jp) to add the users in the WAN-Sign platform. Users must be created and activated before you use single sign-on.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options.

* Click on Test this application in Azure portal and you should be automatically signed in to the WAN-Sign for which you set up the SSO

* You can use Microsoft My Apps. When you click the WAN-Sign tile in the My Apps, you should be automatically signed in to the WAN-Sign for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).


## Next steps

Once you configure WAN-Sign you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-any-app).



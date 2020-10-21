---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with Hoxhunt | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Hoxhunt.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 09/15/2020
ms.author: jeedes

---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with Hoxhunt

In this tutorial, you'll learn how to integrate Hoxhunt with Azure Active Directory (Azure AD). When you integrate Hoxhunt with Azure AD, you can:

* Control in Azure AD who has access to Hoxhunt.
* Enable your users to be automatically signed-in to Hoxhunt with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Hoxhunt single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Hoxhunt supports **SP** initiated SSO

## Adding Hoxhunt from the gallery

To configure the integration of Hoxhunt into Azure AD, you need to add Hoxhunt from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Hoxhunt** in the search box.
1. Select **Hoxhunt** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.


## Configure and test Azure AD SSO for Hoxhunt

Configure and test Azure AD SSO with Hoxhunt using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Hoxhunt.

To configure and test Azure AD SSO with Hoxhunt, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Hoxhunt SSO](#configure-hoxhunt-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Hoxhunt test user](#create-hoxhunt-test-user)** - to have a counterpart of B.Simon in Hoxhunt that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Hoxhunt** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, enter the values for the following fields:

	a. In the **Sign on URL** text box, type the URL:
    `https://app.hoxhunt.com/`

    b. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:
    `https://app.hoxhunt.com/saml/consume/<ID>`

    c. In the **Reply URL** text box, type a URL using the following pattern:
    `https://app.hoxhunt.com/saml/consume/<ID>`

	> [!NOTE]
	> These values are not real. Update these values with the actual Reply URL and Identifier. Contact [Hoxhunt Client support team](mailto:support@hoxhunt.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. On the **Set up Hoxhunt** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Hoxhunt.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Hoxhunt**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Hoxhunt SSO

To configure single sign-on on **Hoxhunt** side, you need to send the downloaded **Certificate (Base64)** and appropriate copied URLs from Azure portal to [Hoxhunt support team](mailto:support@hoxhunt.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Hoxhunt test user

In this section, you create a user called Britta Simon in Hoxhunt. Work with [Hoxhunt support team](mailto:support@hoxhunt.com) to add the users in the Hoxhunt platform. Users must be created and activated before you use single sign-on.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

1. Click on **Test this application** in Azure portal. This will redirect to Hoxhunt Sign-on URL where you can initiate the login flow. 

2. Go to Hoxhunt Sign-on URL directly and initiate the login flow from there.

3. You can use Microsoft Access Panel. When you click the Hoxhunt tile in the Access Panel, this will redirect to Hoxhunt Sign-on URL. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Next steps

Once you configure Hoxhunt you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/proxy-deployment-any-app).



---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with Beautiful.ai | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Beautiful.ai.
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

# Tutorial: Azure Active Directory single sign-on (SSO) integration with Beautiful.ai

In this tutorial, you'll learn how to integrate Beautiful.ai with Azure Active Directory (Azure AD). When you integrate Beautiful.ai with Azure AD, you can:

* Control in Azure AD who has access to Beautiful.ai.
* Enable your users to be automatically signed-in to Beautiful.ai with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Beautiful.ai single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Beautiful.ai supports **SP and IDP** initiated SSO
* Beautiful.ai supports **Just In Time** user provisioning

## Adding Beautiful.ai from the gallery

To configure the integration of Beautiful.ai into Azure AD, you need to add Beautiful.ai from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Beautiful.ai** in the search box.
1. Select **Beautiful.ai** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD SSO for Beautiful.ai

Configure and test Azure AD SSO with Beautiful.ai using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Beautiful.ai.

To configure and test Azure AD SSO with Beautiful.ai, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Beautiful.ai SSO](#configure-beautifulai-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Beautiful.ai test user](#create-beautifulai-test-user)** - to have a counterpart of B.Simon in Beautiful.ai that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Beautiful.ai** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, the user does not have to perform any step as the app is already pre-integrated with Azure.

1. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://www.beautiful.ai/login`

1. Click **Save**.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Beautiful.ai.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Beautiful.ai**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Beautiful.ai SSO

To configure single sign-on on **Beautiful.ai** side, you need to send the **App Federation Metadata Url** to [Beautiful.ai support team](mailto:support@beautiful.ai). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Beautiful.ai test user

In this section, a user called Britta Simon is created in Beautiful.ai. Beautiful.ai supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in Beautiful.ai, a new one is created after authentication.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application** in Azure portal. This will redirect to Beautiful.ai Sign on URL where you can initiate the login flow.  

* Go to Beautiful.ai Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application** in Azure portal and you should be automatically signed in to the Beautiful.ai for which you set up the SSO 

You can also use Microsoft Access Panel to test the application in any mode. When you click the Beautiful.ai tile in the Access Panel, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the Beautiful.ai for which you set up the SSO. For more information about the Access Panel, see [Introduction to the Access Panel](../user-help/my-apps-portal-end-user-access.md).


## Next steps

Once you configure Beautiful.ai you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-any-app).
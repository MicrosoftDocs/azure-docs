---
title: 'Tutorial: Azure Active Directory integration with Miro | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Miro.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 05/26/2021
ms.author: jeedes
---

# Tutorial: Integrate Miro with Azure Active Directory

In this tutorial, you'll learn how to integrate Miro with Azure Active Directory (Azure AD). Another version of this tutorial can be found at help.miro.com. When you integrate Miro with Azure AD, you can:

* Control in Azure AD who has access to Miro.
* Enable your users to be automatically signed-in to Miro with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Miro single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment. 
* Miro supports **SP and IDP** initiated SSO and supports **Just In Time** user provisioning.
* Miro supports [**Automated** user provisioning and deprovisioning](miro-provisioning-tutorial.md) (recommended).

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Add Miro from the gallery

To configure the integration of Miro into Azure AD, you need to add Miro from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Miro** in the search box.
1. Select **Miro** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD SSO for Miro

Configure and test Azure AD SSO with Miro using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Miro.

To configure and test Azure AD SSO with Miro, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Miro SSO](#configure-miro-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Miro test user](#create-miro-test-user)** - to have a counterpart of B.Simon in Miro that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Miro** application integration page, find the **Manage** section and select **Single sign-on**.
1. On the **Select a Single sign-on method** page, select **SAML**.
1. On the **Set up Single Sign-On with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, perform the following step:

    In the **Identifier** text box, type the URL:
    `https://miro.com/`

5. If you wish to configure the application in **SP** initiated mode then in the **Sign-on URL** text box, type the URL:
    `https://miro.com/sso/login/`

1. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer. You will need it to configure SSO on the Miro side.

   ![The Certificate download link](common/certificatebase64.png "The Certificate download link")

1. On the **Set up Miro** section, copy the the Login URL. You will need it to configure SSO on the Miro side.

   ![Copy Login URL](./media/miro-tutorial/login.png "Copy Login URL")

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Miro.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Miro**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

* Alternatively go to the application's **Properties** and toggle off **User assignment required**
![Disable assignment requirement](./media/miro-tutorial/properties.png "Disable assignment requirement")

## Configure Miro SSO

To configure single sign-on on Miro side, use the certificate you previously downloaded and the Login URL you previously copied. In the Miro account settings go to the **Security** section and toggle on **Enable SSO/SAML**. 

1. Paste the Login URL in the **SAML Sign-in URL** field.
1. Open the certificate file with a text editor and copy the certificate sequence. Paste the sequence in the **Key x509 Certificate** field.
![Miro settings](./media/miro-tutorial/security.png "Miro settings")

1. In the **Domains** field type in your domain address, click **Add** and follow the verification procedure. Repeat for your other domain addresses if you have any. The Miro SSO feature will be working for the end users which domains are on the list. 
![Domain](./media/miro-tutorial/add-domain.png "Domain")

1. Decide if you will be using Just in Time provisioning (pulling your users into your subscription during their registration in Miro) and click **Save** to complete the SSO configuration on the Miro side.
![Just in Time Provisioning](./media/miro-tutorial/save-configuration.png "Just in Time Provisioning") 

### Create Miro test user

In this section, a user called B.Simon is created in Miro. Miro supports just-in-time user provisioning, which is enabled by default. There's no action item for you in this section. If a user doesn't already exist in Miro, a new one is created after authentication.

## Test SSO

In this section, you test your Azure AD single sign-on configuration with following options using the test user B.Simon. 

#### SP initiated:

* Go to Miro Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application** in Azure portal and choose to log in as B.Simon. You should be automatically signed in to the Miro subscription for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the Miro tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the Miro for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

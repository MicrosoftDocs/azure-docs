---
title: 'Tutorial: Azure Active Directory integration with Bambu by Sprout Social | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Bambu by Sprout Social.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 08/12/2021
ms.author: jeedes
---
# Tutorial: Azure Active Directory integration with Bambu by Sprout Social

In this tutorial, you'll learn how to integrate Bambu by Sprout Social with Azure Active Directory (Azure AD). When you integrate Bambu by Sprout Social with Azure AD, you can:

* Control in Azure AD who has access to Bambu by Sprout Social.
* Enable your users to be automatically signed-in to Bambu by Sprout Social with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Bambu by Sprout Social single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Bambu by Sprout Social supports **IDP** initiated SSO.
* Bambu by Sprout Social supports **Just In Time** user provisioning.

## Add Bambu by Sprout Social from the gallery

To configure the integration of Bambu by Sprout Social into Azure AD, you need to add Bambu by Sprout Social from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Bambu by Sprout Social** in the search box.
1. Select **Bambu by Sprout Social** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD SSO for Bambu by Sprout Social

Configure and test Azure AD SSO with Bambu by Sprout Social using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Bambu by Sprout Social.

To configure and test Azure AD SSO with Bambu by Sprout Social, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Bambu by Sprout Social SSO](#configure-bambu-by-sprout-social-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Bambu by Sprout Social test user](#create-bambu-by-sprout-social-test-user)** - to have a counterpart of B.Simon in Bambu by Sprout Social that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Bambu by Sprout Social** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, the user does not have to perform any step as the app is already pre-integrated with Azure.

5. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

    ![The Certificate download link](common/metadataxml.png)

6. On the **Set up Bambu by Sprout Social** section, copy the appropriate URL(s) as per your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Bambu by Sprout Social.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Bambu by Sprout Social**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Bambu by Sprout Social SSO

To configure single sign-on on **Bambu by Sprout Social** side, you need to send the downloaded **Federation Metadata XML** and appropriate copied URLs from Azure portal to [Bambu by Sprout Social support team](mailto:support@getbambu.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Bambu by Sprout Social test user

In this section, a user called Britta Simon is created in Bambu by Sprout Social. Bambu by Sprout Social supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in Bambu by Sprout Social, a new one is created after authentication.

## Test SSO

In this section, you test your Azure AD single sign-on configuration with following options.

* Click on Test this application in Azure portal and you should be automatically signed in to the Bambu by Sprout Social for which you set up the SSO.

* You can use Microsoft My Apps. When you click the Bambu by Sprout Social tile in the My Apps, you should be automatically signed in to the Bambu by Sprout Social for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure Bambu by Sprout Social you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).
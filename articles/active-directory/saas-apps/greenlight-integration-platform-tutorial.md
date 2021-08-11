---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with Greenlight Integration Platform | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Greenlight Integration Platform.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 08/11/2021
ms.author: jeedes
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with Greenlight Integration Platform

In this tutorial, you'll learn how to integrate Greenlight Integration Platform with Azure Active Directory (Azure AD). When you integrate Greenlight Integration Platform with Azure AD, you can:

* Control in Azure AD who has access to Greenlight Integration Platform.
* Enable your users to be automatically signed-in to Greenlight Integration Platform with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Greenlight Integration Platform single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Greenlight Integration Platform supports **SP and IDP** initiated SSO.

## Add Greenlight Integration Platform from the gallery

To configure the integration of Greenlight Integration Platform into Azure AD, you need to add Greenlight Integration Platform from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Greenlight Integration Platform** in the search box.
1. Select **Greenlight Integration Platform** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD SSO for Greenlight Integration Platform

Configure and test Azure AD SSO with Greenlight Integration Platform using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Greenlight Integration Platform.

To configure and test Azure AD SSO with Greenlight Integration Platform, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Greenlight Integration Platform SSO](#configure-greenlight-integration-platform-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Greenlight Integration Platform test user](#create-greenlight-integration-platform-test-user)** - to have a counterpart of B.Simon in Greenlight Integration Platform that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Greenlight Integration Platform** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, perform the following steps:

    a. In the **Identifier** text box, type a URL using the following pattern:
    `https://<CUSTOMER>.greenlightcorp.com/ebcprtads/checkLoginSAML.do`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://<CUSTOMER>.greenlightcorp.com/ebcprtads/checkLoginSAML.do`

1. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://<CUSTOMER>.greenlightcorp.com/ebcprtads/checkLoginSAML.do`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier, Reply URL and Sign-on URL. Contact [Greenlight Integration Platform Client support team](mailto:support@greenlightcorp.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

1. On the **Set up Greenlight Integration Platform** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Greenlight Integration Platform.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Greenlight Integration Platform**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Greenlight Integration Platform SSO

To configure single sign-on on **Greenlight Integration Platform** side, you need to send the downloaded **Federation Metadata XML** and appropriate copied URLs from Azure portal to [Greenlight Integration Platform support team](mailto:support@greenlightcorp.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Greenlight Integration Platform test user

In this section, you create a user called B.Simon in Greenlight Integration Platform. Work with [Greenlight Integration Platform support team](mailto:support@greenlightcorp.com) to add the users in the Greenlight Integration Platform platform. Users must be created and activated before you use single sign-on.

## Test SSO

In this section, you test your Azure AD single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application** in Azure portal. This will redirect to Greenlight Integration Platform Sign on URL where you can initiate the login flow.  

* Go to Greenlight Integration Platform Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application** in Azure portal and you should be automatically signed in to the Greenlight Integration Platform for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the Greenlight Integration Platform tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the Greenlight Integration Platform for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure Greenlight Integration Platform you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).
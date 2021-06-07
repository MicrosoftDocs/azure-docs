---
title: 'Tutorial: Azure Active Directory integration with SecureW2 JoinNow Connector | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and SecureW2 JoinNow Connector.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 05/10/2021
ms.author: jeedes
---

# Tutorial: Integrate SecureW2 JoinNow Connector with Azure Active Directory

In this tutorial, you'll learn how to integrate SecureW2 JoinNow Connector with Azure Active Directory (Azure AD). When you integrate SecureW2 JoinNow Connector with Azure AD, you can:

* Control in Azure AD who has access to SecureW2 JoinNow Connector.
* Enable your users to be automatically signed-in to SecureW2 JoinNow Connector with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* SecureW2 JoinNow Connector single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* SecureW2 JoinNow Connector supports **SP** initiated SSO.

## Add SecureW2 JoinNow Connector from the gallery

To configure the integration of SecureW2 JoinNow Connector into Azure AD, you need to add SecureW2 JoinNow Connector from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **SecureW2 JoinNow Connector** in the search box.
1. Select **SecureW2 JoinNow Connector** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD SSO for SecureW2 JoinNow Connector

Configure and test Azure AD SSO with SecureW2 JoinNow Connector using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in SecureW2 JoinNow Connector.

To configure and test Azure AD SSO with SecureW2 JoinNow Connector, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure SecureW2 JoinNow Connector SSO](#configure-securew2-joinnow-connector-sso)** - to configure the single sign-on settings on application side.
    1. **[Create SecureW2 JoinNow Connector test user](#create-securew2-joinnow-connector-test-user)** - to have a counterpart of B.Simon in SecureW2 JoinNow Connector that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **SecureW2 JoinNow Connector** application integration page, find the **Manage** section and select **Single sign-on**.
1. On the **Select a Single sign-on method** page, select **SAML**.
1. On the **Set up Single Sign-On with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, perform the following steps:

	a. In the **Sign on URL** text box, type a URL using the following pattern:
    `https://<organization-identifier>-auth.securew2.com/auth/saml/SSO`

    b. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:
    `https://<organization-identifier>-auth.securew2.com/auth/saml`

	> [!NOTE]
	> These values are not real. Update these values with the actual Sign on URL and Identifier. Contact [SecureW2 JoinNow Connector Client support team](mailto:support@securew2.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section,  find **Metadata XML** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

1. On the **Set up SecureW2 JoinNow Connector** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to SecureW2 JoinNow Connector.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **SecureW2 JoinNow Connector**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure SecureW2 JoinNow Connector SSO

To configure single sign-on on **SecureW2 JoinNow Connector** side, you need to send the downloaded **Metadata XML** and appropriate copied URLs from Azure portal to [SecureW2 JoinNow Connector support team](mailto:support@securew2.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create SecureW2 JoinNow Connector test user

In this section, you create a user called Britta Simon in SecureW2 JoinNow Connector. Work with [SecureW2 JoinNow Connector support team](mailto:support@securew2.com) to add the users in the SecureW2 JoinNow Connector platform. Users must be created and activated before you use single sign-on.

## Test SSO

In this section, you test your Azure AD single sign-on configuration with following options. 

* Click on **Test this application** in Azure portal. This will redirect to SecureW2 JoinNow Connector Sign-on URL where you can initiate the login flow. 

* Go to SecureW2 JoinNow Connector Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the SecureW2 JoinNow Connector tile in the My Apps, this will redirect to SecureW2 JoinNow Connector Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure SecureW2 JoinNow Connector you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-any-app).
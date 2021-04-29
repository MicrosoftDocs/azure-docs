---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with EAB Implementation | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and EAB Implementation.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 03/26/2021
ms.author: jeedes
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with EAB Implementation

In this tutorial, you'll learn how to integrate EAB Implementation with Azure Active Directory (Azure AD). When you integrate EAB Implementation with Azure AD, you can:

* Control in Azure AD who has access to EAB Implementation.
* Enable your users to be automatically signed-in to EAB Implementation with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.


## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* EAB Implementation single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* EAB Implementation supports **SP** initiated SSO.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Adding EAB Implementation from the gallery

To configure the integration of EAB Implementation into Azure AD, you need to add EAB Implementation from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **EAB Implementation** in the search box.
1. Select **EAB Implementation** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD SSO for EAB Implementation

Configure and test Azure AD SSO with EAB Implementation using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in EAB Implementation.

To configure and test Azure AD SSO with EAB Implementation, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure EAB Implementation SSO](#configure-eab-implementation-sso)** - to configure the single sign-on settings on application side.
    1. **[Create EAB Implementation test user](#create-eab-implementation-test-user)** - to have a counterpart of B.Simon in EAB Implementation that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **EAB Implementation** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, enter the values for the following fields:

    a. In the **Identifier (Entity ID)** text box, enter exactly the following value:
    `https://impl.bouncer.eab.com`
    
    b. In the **Reply URL (Assertion Consumer Service URL)** text box, enter both the following values as separate rows:
    
    | Reply URL|
    | -------------- |
    | `https://impl.bouncer.eab.com/sso/saml2/acs` |
    | `https://impl.bouncer.eab.com/sso/saml2/acs/` |
    |
    
    c. In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://<SUBDOMAIN>.navigate.impl.eab.com/`

	> [!NOTE]
	> The value is not real. Update the value with the actual Sign-On URL. Contact [EAB Implementation Client support team](mailto:EABTechSupport@eab.com) to get the value. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to EAB Implementation.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **EAB Implementation**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure EAB Implementation SSO

To configure single sign-on on **EAB Implementation** side, you need to send the **App Federation Metadata Url** to [EAB Implementation support team](mailto:EABTechSupport@eab.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create EAB Implementation test user

In this section, you create a user called B.Simon in EAB Implementation. Work with [EAB Implementation support team](mailto:EABTechSupport@eab.com) to add the users in the EAB Implementation platform. Users must be created and activated before you use single sign-on.

## Test SSO

In this section, you test your Azure AD single sign-on configuration with following options. 

* Click on **Test this application** in Azure portal. This will redirect to EAB Implementation Sign-on URL where you can initiate the login flow. 

* Go to EAB Implementation Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the EAB Implementation tile in the My Apps, this will redirect to EAB Implementation Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).


## Next steps

Once you configure EAB Implementation you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-any-app).
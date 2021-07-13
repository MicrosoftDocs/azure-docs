---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with Holmes | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Holmes.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 04/06/2021
ms.author: jeedes

---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with Holmes

In this tutorial, you'll learn how to integrate Holmes with Azure Active Directory (Azure AD). When you integrate Holmes with Azure AD, you can:

* Control in Azure AD who has access to Holmes.
* Enable your users to be automatically signed-in to Holmes with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Holmes single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

## Adding Holmes from the gallery

To configure the integration of Holmes into Azure AD, you need to add Holmes from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Holmes** in the search box.
1. Select **Holmes** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.


## Configure and test Azure AD SSO for Holmes

Configure and test Azure AD SSO with Holmes using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Holmes.

To configure and test Azure AD SSO with Holmes, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Holmes SSO](#configure-holmes-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Holmes test user](#create-holmes-test-user)** - to have a counterpart of B.Simon in Holmes that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Holmes** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

2. On the **Basic SAML Configuration** section, enter the values for the following fields:

   1. In the **Identifier** text box, type a URL using the following pattern:

      `https://<WorkspaceID>.holmescloud.com`
      
   1. In the **Reply URL (Assertion Consumer Service URL)** text box, enter `https://holmescloud.com/sso/acs`.
   
   1. In the **Logout Url** text box, enter `https://holmescloud.com/sso/logout`.

	> [!NOTE]
	> Update the value with the actual Identifier, which refers to the Holmes Admin page. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

3. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section, find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. On the **Set up Holmes** section, copy the appropriate URL(s) based on your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

### Create an Azure AD test user

In this section, you'll create a test user in the Azure portal called B.Simon.

1. From the left pane in the Azure portal, select **Azure Active Directory**, select **Users**, and then select **All users**.
1. Select **New user** at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Name** field, enter `B.Simon`.  
   1. In the **User name** field, enter the username@companydomain.extension. For example, `B.Simon@contoso.com`.
   1. Select the **Show password** check box, and then write down the value that's displayed in the **Password** box.
   1. Select **Create**.

### Assign the Azure AD test user

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Holmes.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Holmes**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, select the **Assign** button.

## Configure Holmes SSO

To configure single sign-on on the **Holmes** side, you need to register the downloaded **Certificate (Base64)** and the appropriate copied URLs from the Azure portal on the Holmes Admin page. 

### Create Holmes test user

In this section, you create a user called B.Simon in Holmes. You can create/invite a user on the Holmes Member Management page. Users must be created and activated before you use single sign-on.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application** in Azure portal. This will redirect to Holmes Sign on URL where you can initiate the login flow.  

* Go to Holmes Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application** in Azure portal and you should be automatically signed in to the Holmes for which you set up the SSO 

You can also use Microsoft My Apps to test the application in any mode. When you click the Holmes tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the Holmes for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).


## Next steps

Once you configure Holmes you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-any-app).
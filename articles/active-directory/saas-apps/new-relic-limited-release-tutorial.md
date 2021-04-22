---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with New Relic | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and New Relic.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 04/13/2021
ms.author: jeedes
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with New Relic

In this tutorial, you'll learn how to integrate New Relic with Azure Active Directory (Azure AD). When you integrate New Relic with Azure AD, you can:

* Control in Azure AD who has access to New Relic.
* Enable your users to be automatically signed-in to New Relic with their Azure AD accounts.
* Manage your accounts in one central location: the Azure portal.

## Prerequisites

To get started, you need:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* A New Relic subscription that's enabled for single sign-on (SSO).

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* New Relic supports SSO that's initiated by either the service provider or the identity provider.

## Add New Relic from the gallery

To configure the integration of New Relic into Azure AD, you need to add **New Relic (By Organization)** from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal by using either a work or school account, or a personal Microsoft account.
1. Select the **Azure Active Directory** service.
1. Select **Enterprise applications** > **New application**.
1. On the **Browse Azure AD Gallery** page, type **New Relic (By Organization)** in the search box.
1. Select **New Relic (By Organization)** from the results, and then select **Create**. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD SSO for New Relic

Configure and test Azure AD SSO with New Relic by using a test user called **B.Simon**. For SSO to work, you need to establish a linked relationship between an Azure AD user and the related user in New Relic.

To configure and test Azure AD SSO with New Relic:

1. [Configure Azure AD SSO](#configure-azure-ad-sso) to enable your users to use this feature.
   1. [Create an Azure AD test user](#create-an-azure-ad-test-user) to test Azure AD single sign-on with B.Simon.
   1. [Assign the Azure AD test user](#assign-the-azure-ad-test-user) to enable B.Simon to use Azure AD single sign-on.
1. [Configure New Relic SSO](#configure-new-relic-sso) to configure the single sign-on settings on the New Relic side.
   1. [Create a New Relic test user](#create-a-new-relic-test-user) to have a counterpart for B.Simon in New Relic linked to the Azure AD user.
1. [Test SSO](#test-sso) to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal on the **New Relic by Organization** application integration page, find the **Manage** section. Then select **Single sign-on**.

1. On the **Select a single sign-on method** page, select **SAML**.

1. On the **Set up Single Sign-On with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot of Set up Single Sign-On with SAML, with pencil icon highlighted.](common/edit-urls.png)

1. In the **Basic SAML Configuration** section, fill in values for **Identifier** and **Reply URL**.

   * Retrieve these values by using the New Relic **My Organization** application. To use this application:
      1. [Sign in](https://login.newrelic.com/) to New Relic.
      1. On the top menu, select **Apps**.
      1. In the **Your apps** section, select **My Organization** > **Authentication domains**.
      1. Choose the authentication domain to which you want Azure AD SSO to connect (if you have more than one authentication domain). Most companies only have one authentication domain called **Default**. If there's only one authentication domain, you don't need to select anything.
      1. In the **Authentication** section, **Assertion consumer URL** contains the value to use for **Reply URL**.
      1. In the **Authentication** section, **Our entity ID** contains the value to use for **Identifier**.

1. In the **User Attributes & Claims** section, make sure **Unique User Identifier** is mapped to a field that contains the email address being used at New Relic.

   * The default field **user.userprincipalname** will work for you if its values are the same as the New Relic email addresses.
   * The field  **user.mail** might work better for you if **user.userprincipalname** isn't the New Relic email address.

1. In the **SAML Signing Certificate** section, copy **App Federation Metadata Url** and save its value for later use.

1. In the **Set up New Relic by Organization** section, copy **Login URL** and save its value for later use.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to New Relic.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **New Relic**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure New Relic SSO

Follow these steps to configure SSO at New Relic.

1. [Sign in](https://login.newrelic.com/) to New Relic.

1. On the top menu, select **Apps**.

1. In the **Your apps** section, select **My Organization** > **Authentication domains**.

1. Choose the authentication domain to which you want Azure AD SSO to connect (if you have more than one authentication domain). Most companies only have one authentication domain called **Default**. If there's only one authentication domain, you don't need to select anything.

1. In the **Authentication** section, select **Configure**.

   1. For **Source of SAML metadata**, enter the value you previously saved from the Azure AD **App Federation Metadata Url** field.

   1. For **SSO target URL**, enter the value you previously saved from the Azure AD **Login URL** field.

   1. After verifying that settings look good on both the Azure AD and New Relic sides, select **Save**. If both sides are not properly configured, your users won't be able to sign in to New Relic.

### Create a New Relic test user

In this section, you create a user called B.Simon in New Relic.

1. [Sign in](https://login.newrelic.com/) to New Relic.

1. On the top menu, select **Apps**.

1. In the **Your apps** section, select **User Management**.

1. Select **Add user**.

   1. For **Name**, enter **B.Simon**.
   
   1. For **Email**, enter the value that will be sent by Azure AD SSO.
   
   1. Choose a user **Type** and a user **Group** for the user. For a test user, **Basic User** for Type and **User** for Group are reasonable choices.
   
   1. To save the user, select **Add User**.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application** in Azure portal. This will redirect to New Relic Sign on URL where you can initiate the login flow.  

* Go to New Relic Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application** in Azure portal and you should be automatically signed in to the New Relic for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the New Relic tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the New Relic for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Next steps

Once you configure New Relic you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/proxy-deployment-any-app).

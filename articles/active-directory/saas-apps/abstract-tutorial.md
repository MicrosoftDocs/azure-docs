---
title: 'Tutorial: Azure Active Directory integration with Abstract'
description: Learn how to configure single sign-on between Azure Active Directory and Abstract.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 11/21/2022
ms.author: jeedes
---

# Tutorial: Integrate Abstract with Azure Active Directory

In this tutorial, you'll learn how to integrate Abstract with Azure Active Directory (Azure AD). When you integrate Abstract with Azure AD, you can:

* Control in Azure AD who has access to Abstract.
* Enable your users to be automatically signed-in to Abstract with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Abstract single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Abstract supports **SP and IDP** initiated SSO.

## Add Abstract from the gallery

To configure the integration of Abstract into Azure AD, you need to add Abstract from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Abstract** in the search box.
1. Select **Abstract** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for Abstract

Configure and test Azure AD SSO with Abstract using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Abstract.

To configure and test Azure AD SSO with Abstract, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Abstract SSO](#configure-abstract-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Abstract test user](#create-abstract-test-user)** - to have a counterpart of B.Simon in Abstract that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Abstract** application integration page, find the **Manage** section and select **Single sign-on**.
1. On the **Select a Single sign-on method** page, select **SAML**.
1. On the **Set up Single Sign-On with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section the application is pre-configured in **IDP** initiated mode and the necessary URLs are already pre-populated with Azure. The user needs to save the configuration by clicking the **Save** button.

1. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type the URL:
    `https://app.abstract.com/signin`

4. On the **Set up Single Sign-On with SAML** page, In the **SAML Signing Certificate** section, click copy button to copy **App Federation Metadata Url** and save it on your computer.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Abstract.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Abstract**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Abstract SSO

Make sure to retrieve your `App Federation Metadata Url` and the `Azure AD Identifier` from the Azure portal, as you will need those to configure SSO on Abstract.

You will find those information on the **Set up Single Sign-On with SAML** page:

* The `App Federation Metadata Url` is located in the **SAML Signing Certificate** section.
* The `Azure AD Identifier` is located in the **Set up Abstract** section.

You are now ready to configure SSO on Abstract:

>[!Note]
>You will need to authenticate with an organization Admin account to access the SSO settings on Abstract.

1. Open the [Abstract web app](https://app.abstract.com/).
2. Go to the **Permissions** page in the left side bar.
3. In the **Configure SSO** section, enter your **Metadata URL** and **Entity ID**.
4. Enter any manual exceptions you might have. Emails listed in the manual exceptions section will bypass SSO and be able to log in with email and password. 
5. Click **Save Changes**.

>[!Note] 
>You’ll need to use primary email addresses in the manual exceptions list. SSO activation will fail if the email you list is a user’s secondary email. If that happens, you’ll see an error message with the primary email for the failing account. Add that primary email to the manual exceptions list after you’ve verified you know the user.

### Create Abstract test user

To test SSO on Abstract:

1. Open the [Abstract web app](https://app.abstract.com/).
2. Go to the **Permissions** page in the left side bar.
3. Click **Test with my Account**. If the test fails, please [contact our support team](https://help.abstract.com/hc/).

>[!Note]
>You will need to authenticate with an organization Admin account to access the SSO settings on Abstract.
This organization Admin account will need to be assigned to Abstract on the Azure portal.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application** in Azure portal. This will redirect to Abstract Sign on URL where you can initiate the login flow.  

* Go to Abstract Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application** in Azure portal and you should be automatically signed in to the Abstract for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the Abstract tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the Abstract for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

Once you configure Abstract you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).

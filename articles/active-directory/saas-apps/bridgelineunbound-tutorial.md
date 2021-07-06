---
title: 'Tutorial: Azure Active Directory integration with Bridgeline Unbound | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Bridgeline Unbound.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 12/16/2020
ms.author: jeedes
---
# Tutorial: Azure Active Directory integration with Bridgeline Unbound

In this tutorial, you'll learn how to integrate Bridgeline Unbound with Azure Active Directory (Azure AD). When you integrate Bridgeline Unbound with Azure AD, you can:

* Control in Azure AD who has access to Bridgeline Unbound.
* Enable your users to be automatically signed-in to Bridgeline Unbound with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To configure Azure AD integration with Bridgeline Unbound, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get one-month trial [here](https://azure.microsoft.com/pricing/free-trial/)
* Bridgeline Unbound single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Bridgeline supports **SP and IDP** initiated SSO
* Bridgeline Unbound supports **Just In Time** user provisioning

## Adding Bridgeline Unbound from the gallery

To configure the integration of Bridgeline Unbound into Azure AD, you need to add Bridgeline Unbound from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Bridgeline Unbound** in the search box.
1. Select **Bridgeline Unbound** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.


## Configure and test Azure AD SSO for Bridgeline Unbound

Configure and test Azure AD SSO with Bridgeline Unbound using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Bridgeline Unbound.

To configure and test Azure AD SSO with Bridgeline Unbound, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
2. **[Configure Bridgeline Unbound SSO](#configure-bridgeline-unbound-sso)** - to configure the Single Sign-On settings on application side.
    1. **[Create Bridgeline Unbound test user](#create-bridgeline-unbound-test-user)** - to have a counterpart of Britta Simon in Bridgeline Unbound that is linked to the Azure AD representation of user.
6. **[Test SSO](#test-sso)** - to verify whether the configuration works.

### Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Bridgeline Unbound** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)
4. On the **Basic SAML Configuration** section, If you wish to configure the application in **IDP** initiated mode, perform the following steps:

    a. In the **Identifier** text box, type a URL using the following pattern:
    `iApps_UPSTT_<ENVIRONMENTNAME>`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://<SUBDOMAIN>.iapps.com/SAMLAssertionService.aspx`

5. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://<SUBDOMAIN>.iapps.com/CommonLogin/login?<INSTANCENAME>`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier, Reply URL and Sign-on URL. Contact [Bridgeline Unbound Client support team](mailto:support@iapps.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

6. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Base64)** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

7. On the **Set up Bridgeline Unbound** section, copy the appropriate URL(s) as per your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Bridgeline Unbound.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Bridgeline Unbound**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.


## Configure Bridgeline Unbound SSO

To configure single sign-on on **Bridgeline Unbound** side, you need to send the downloaded **Certificate (Base64)** and appropriate copied URLs from Azure portal to [Bridgeline Unbound support team](mailto:support@iapps.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Bridgeline Unbound test user

In this section, a user called Britta Simon is created in Bridgeline Unbound. Bridgeline Unbound supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in Bridgeline Unbound, a new one is created after authentication.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application** in Azure portal. This will redirect to Bridgeline Unbound Sign on URL where you can initiate the login flow.  

* Go to Bridgeline Unbound Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application** in Azure portal and you should be automatically signed in to the Bridgeline Unbound for which you set up the SSO 

You can also use Microsoft My Apps to test the application in any mode. When you click the Bridgeline Unbound tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the Bridgeline Unbound for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).


## Next steps

Once you configure Bridgeline Unbound you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-any-app).
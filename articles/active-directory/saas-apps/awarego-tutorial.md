---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with AwareGo'
description: Learn how to configure single sign-on between Azure Active Directory and AwareGo.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 11/21/2022
ms.author: jeedes

---

# Tutorial: Azure Active Directory single sign-on integration with AwareGo

In this tutorial, you'll learn how to integrate AwareGo with Azure Active Directory (Azure AD). When you integrate AwareGo with Azure AD, you can:

* Control in Azure AD who has access to AwareGo.
* Enable your users to be automatically signed in to AwareGo with their Azure AD accounts.
* Manage your accounts in one central location, the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* An AwareGo single sign-on (SSO)-enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment. AwareGo supports a service provider (SP)-initiated SSO.


## Adding AwareGo from the gallery

To configure the integration of AwareGo into Azure AD, you need to add AwareGo from the gallery to your list of managed software as a service (SaaS) apps.

1. Sign in to the Azure portal by using a work account, a school account, or a personal Microsoft account.
1. On the left pane, select the **Azure Active Directory** service.
1. Select **Enterprise Applications** > **All Applications**.
1. To add a new application, select **New application**.
1. In the **Add from the gallery** section, type **AwareGo** in the search box.
1. In the results pane, select **AwareGo**, and then add the app. In a few seconds, the app is added to your tenant.


## Configure and test Azure AD SSO for AwareGo

Configure and test Azure AD SSO with AwareGo by using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in AwareGo.

To configure and test Azure AD SSO with AwareGo, do the following:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** to enable your users to use this feature.  

    a. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** to test Azure AD single sign-on with user B.Simon.  
    b. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** to enable user B.Simon to use Azure AD single sign-on.  

1. **[Configure AwareGo SSO](#configure-awarego-sso)** to configure the single sign-on settings on the application side.

    a. **[Create an AwareGo test user](#create-an-awarego-test-user)** to have a counterpart of B.Simon in AwareGo that's linked to the Azure AD representation of the user.  
    b. **[Test SSO](#test-sso)** to verify that the configuration works.

## Configure Azure AD SSO

To enable Azure AD SSO in the Azure portal, do the following:

1. In the Azure portal, on the **AwareGo** application integration page, under **Manage**, select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. To edit the settings, on the **Set up Single Sign-On with SAML** pane, select the **Edit** button.

   ![Screenshot of the Edit button for Basic SAML Configuration.](common/edit-urls.png)

1. On the edit pane, under **Basic SAML Configuration**, do the following:

    a. In the **Sign on URL** box, enter either of the following URLs:

    * `https://lms.awarego.com/auth/signin/` 
    * `https://my.awarego.com/auth/signin/`

    b. In the **Identifier (Entity ID)** box, enter a URL in the following format: `https://<SUBDOMAIN>.awarego.com`

    c. In the **Reply URL** box, enter a URL in the following format: `https://<SUBDOMAIN>.awarego.com/auth/sso/callback`

	> [!NOTE]
	> The preceding values are not real. Update them with the actual identifier and reply URLs. To obtain the values, contact the [AwareGo client support team](mailto:support@awarego.com). You can also refer to the examples in the **Basic SAML Configuration** section in the Azure portal.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section, next to **Certificate (Base64)**, select **Download** to download the certificate and save it to your computer.

	![Screenshot of the certificate "Download" link on the SAML Signing Certificate pane.](common/certificatebase64.png)

1. In the **Set up AwareGo** section, copy one or more URLs, depending on your requirements.

	![Screenshot of the "Set up AwareGo" pane for copying configuration URLs.](common/copy-configuration-urls.png)

### Create an Azure AD test user

In this section, you create a test user in the Azure portal called B.Simon.

1. In the left pane of the Azure portal, select **Azure Active Directory**, and then select **Users** > **All users**.
1. Select **New user** at the top of the screen.
1. On the **User** properties pane, do the following:

   a. In the **Name** box, enter **B.Simon**.  
   b. In the **User name** box, enter the username in the following format: `<username>@<companydomain>.<extension>` (for example, B.Simon@contoso.com).  
   c. Select the **Show password** check box, and then note the value that's displayed in the **Password** box for later use.  
   d. Select **Create**.

### Assign the Azure AD test user

In this section, you enable user B.Simon to use Azure SSO by granting access to AwareGo.

1. In the Azure portal, select **Enterprise Applications** > **All applications**.
1. In the **Applications** list, select **AwareGo**.
1. On the app overview page, in the **Manage** section, select **Users and groups**.
1. Select **Add user** and then, on the **Add Assignment** pane, select **Users and groups**.
1. On the **Users and groups** pane, in the **Users** list, select **B.Simon**, and then select the **Select** button.
1. If you're expecting to assign a role to the users, you can select it in the **Select a role** drop-down list. If no role has been set up for this app, the *Default Access* role is selected.
1. On the **Add Assignment** pane, select the **Assign** button.

## Configure AwareGo SSO

To configure single sign-on on the **AwareGo** side, send the **Certificate (Base64)** certificate you downloaded earlier and the URLs you copied earlier from the Azure portal to the [AwareGo support team](mailto:support@awarego.com). The support team creates this setting to establish the SAML SSO connection properly on both sides.

### Create an AwareGo test user

In this section, you create a user called Britta Simon in AwareGo. Work with the [AwareGo support team](mailto:support@awarego.com) to add the users in the AwareGo platform. You must create and activate the users before you can use single sign-on.

## Test SSO 

In this section, you can test your Azure AD single sign-on configuration by doing any of the following: 

* In the Azure portal, select **Test this application**. This redirects you to the AwareGo sign-in page, where you can initiate the sign-in flow. 

* Go to the AwareGo sign-in page directly, and initiate the sign-in flow from there.

* Go to Microsoft My Apps. When you select the **AwareGo** tile in My Apps, you're redirected to the AwareGo sign-in page. For more information, see [Sign in and start apps from the My Apps portal](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).


## Next steps

After you've configured AwareGo, you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access App Control. For more information, see [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-any-app).

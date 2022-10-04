---
title: 'Tutorial: Azure AD SSO integration with UserTesting'
description: Learn how to configure single sign-on between Azure Active Directory and UserTesting.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 11/01/2021
ms.author: jeedes

---

# Tutorial: Azure AD SSO integration with UserTesting

In this tutorial, you'll learn how to integrate UserTesting with Azure Active Directory (Azure AD). When you integrate UserTesting with Azure AD, you can:

* Control in Azure AD who has access to UserTesting.
* Enable your users to be automatically signed-in to UserTesting with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* UserTesting single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* UserTesting supports **SP and IDP** initiated SSO.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Add UserTesting from the gallery

To configure the integration of UserTesting into Azure AD, you need to add UserTesting from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **UserTesting** in the search UserTesting.
1. Select **UserTesting** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for UserTesting

Configure and test Azure AD SSO with UserTesting using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in UserTesting.

To configure and test Azure AD SSO with UserTesting, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure UserTesting SSO](#configure-usertesting-sso)** - to configure the single sign-on settings on application side.
    1. **[Create UserTesting test user](#create-usertesting-test-user)** - to have a counterpart of B.Simon in UserTesting that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **UserTesting** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, the user does not have to perform any step as the app is already pre-integrated with Azure.

1. On the **Basic SAML Configuration** section, if you wish to configure the application in **SP** initiated mode, perform the following steps:

	a. In the **Identifier** textbox, type the URL:
	`https://www.okta.com/saml2/service-provider/sposbpqioaxlalylvzsc`

	b. In the **Reply URL** textbox, type the URL:
	`https://auth.usertesting.com/sso/saml2/0oa1mi3sggbs692Nc0h8`

	c. In the **Sign on URL** textbox, type the URL:
    `https://app.usertesting.com/users/sso_sign_in`

	d. In the **Relay State** textbox, type the URL:
	`https://app.usertesting.com/sessions/from_idp`

1. Your UserTesting application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows an example for this. The default value of **Unique User Identifier** is **user.userprincipalname** but UserTesting expects this to be mapped with the user's email address. For that you can use **user.mail** attribute from the list or use the appropriate attribute value based on your organization configuration.

	![image](common/default-attributes.png)

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

1. On the **Set up UserTesting** section, copy the appropriate URL(s) based on your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

### Create an Azure AD test user

In this section, you'll create a test user in the Azure portal called B.Simon.

1. From the left pane in the Azure portal, select **Azure Active Directory**, select **Users**, and then select **All users**.
1. Select **New user** at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Name** field, enter `B.Simon`.  
   1. In the **User name** field, enter the username@companydomain.extension. For example, `B.Simon@contoso.com`.
   1. Select the **Show password** check UserTesting, and then write down the value that's displayed in the **Password** UserTesting.
   1. Click **Create**.

### Assign the Azure AD test user

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to UserTesting.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **UserTesting**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure UserTesting SSO

To configure single sign-on on **UserTesting** side, you need to send the downloaded **Federation Metadata XML** and appropriate copied URLs from Azure portal to [UserTesting support team](mailto:support@usertesting.com). They set this setting to have the SAML SSO connection set properly on both sides. [Learn how](https://help.usertesting.com/hc/en-us/articles/360001764852-Single-Sign-On-SSO-Setup-Instructions).

### Create UserTesting test user

In this section, you create a user called Britta Simon in UserTesting. Work with [UserTesting support team](mailto:support@usertesting.com) to add the users in the UserTesting platform. Users must be created and activated before you use single sign-on.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application** in Azure portal. This will redirect to UserTesting Sign on URL where you can initiate the login flow.  

* Go to UserTesting Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application** in Azure portal and you should be automatically signed in to the UserTesting for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the UserTesting tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the UserTesting for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure UserTesting you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).

---
title: 'Tutorial: Azure Active Directory integration with IMPAC Risk Manager | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and IMPAC Risk Manager.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 08/04/2021
ms.author: jeedes
---
# Tutorial: Azure Active Directory integration with IMPAC Risk Manager

In this tutorial, you'll learn how to integrate IMPAC Risk Manager with Azure Active Directory (Azure AD). When you integrate IMPAC Risk Manager with Azure AD, you can:

* Control in Azure AD who has access to IMPAC Risk Manager.
* Enable your users to be automatically signed-in to IMPAC Risk Manager with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* IMPAC Risk Manager single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* IMPAC Risk Manager supports **SP and IDP** initiated SSO.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Add IMPAC Risk Manager from the gallery

To configure the integration of IMPAC Risk Manager into Azure AD, you need to add IMPAC Risk Manager from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **IMPAC Risk Manager** in the search box.
1. Select **IMPAC Risk Manager** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD SSO for IMPAC Risk Manager

Configure and test Azure AD SSO with IMPAC Risk Manager using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in IMPAC Risk Manager.

To configure and test Azure AD SSO with IMPAC Risk Manager, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure IMPAC Risk Manager SSO](#configure-impac-risk-manager-sso)** - to configure the single sign-on settings on application side.
    1. **[Create IMPAC Risk Manager test user](#create-impac-risk-manager-test-user)** - to have a counterpart of B.Simon in IMPAC Risk Manager that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **IMPAC Risk Manager** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, perform the following steps:

    a. In the **Identifier** text box, type a value provided by IMPAC.

    b. In the **Reply URL** text box, type a URL using one of the following patterns:

	| Environment | URL Pattern |
	| ---------------|--------------- |
	| For Production |`https://www.riskmanager.co.nz/DotNet/SSOv2/AssertionConsumerService.aspx?client=<ClientSuffix>`|
	| For Staging and Training  |`https://staging.riskmanager.co.nz/DotNet/SSOv2/AssertionConsumerService.aspx?client=<ClientSuffix>`|
	| For Development  |`https://dev.riskmanager.co.nz/DotNet/SSOv2/AssertionConsumerService.aspx?client=<ClientSuffix>`|
	| For QA |`https://QA.riskmanager.co.nz/DotNet/SSOv2/AssertionConsumerService.aspx?client=<ClientSuffix>`|
	| For Test |`https://test.riskmanager.co.nz/DotNet/SSOv2/AssertionConsumerService.aspx?client=<ClientSuffix>`|
    | | |

5. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type a URL using one of the following patterns:

	| Environment | URL Pattern |
    | ---------------|--------------- |
	| For Production |`https://www.riskmanager.co.nz/SSOv2/<ClientSuffix>`|
	| For Staging and Training  |`https://staging.riskmanager.co.nz/SSOv2/<ClientSuffix>`|
	| For Development  |`https://dev.riskmanager.co.nz/SSOv2/<ClientSuffix>`|
	| For QA |`https://QA.riskmanager.co.nz/SSOv2/<ClientSuffix>`|
	| For Test |`https://test.riskmanager.co.nz/SSOv2/<ClientSuffix>`|
    | | |

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier, Reply URL and Sign-on URL. Contact [IMPAC Risk Manager Client support team](mailto:rmsupport@Impac.co.nz) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

6. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Base64)** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

7. On the **Set up IMPAC Risk Manager** section, copy the appropriate URL(s) as per your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to IMPAC Risk Manager.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **IMPAC Risk Manager**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure IMPAC Risk Manager SSO

To configure single sign-on on **IMPAC Risk Manager** side, you need to send the downloaded **Certificate (Base64)** and appropriate copied URLs from Azure portal to [IMPAC Risk Manager support team](mailto:rmsupport@Impac.co.nz). They set this setting to have the SAML SSO connection set properly on both sides.

### Create IMPAC Risk Manager test user

In this section, you create a user called Britta Simon in IMPAC Risk Manager. Work with [IMPAC Risk Manager support team](mailto:rmsupport@Impac.co.nz) to add the users in the IMPAC Risk Manager platform. Users must be created and activated before you use single sign-on.

## Test SSO

In this section, you test your Azure AD single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application** in Azure portal. This will redirect to IMPAC Risk Manager Sign on URL where you can initiate the login flow.  

* Go to IMPAC Risk Manager Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application** in Azure portal and you should be automatically signed in to the IMPAC Risk Manager for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the IMPAC Risk Manager tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the IMPAC Risk Manager for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure IMPAC Risk Manager you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).
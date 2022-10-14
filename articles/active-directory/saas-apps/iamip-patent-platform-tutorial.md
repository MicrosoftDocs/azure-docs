---
title: 'Tutorial: Azure AD SSO integration with IamIP Platform'
description: Learn how to configure single sign-on between Azure Active Directory and IamIP Platform.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 10/21/2021
ms.author: jeedes
---

# Tutorial: Azure AD SSO integration with IamIP Platform

In this tutorial, you'll learn how to integrate IamIP Platform with Azure Active Directory (Azure AD). When you integrate IamIP Platform with Azure AD, you can:

* Control in Azure AD who has access to IamIP Platform.
* Enable your users to be automatically signed-in to IamIP Platform with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* An IamIP Platform subscription with single sign-on (SSO) enabled.

## Scenario description

In this tutorial, you'll configure and test Azure AD SSO in a test environment.

* IamIP Platform supports SP-initiated and IDP-initiated SSO.
* IamIP Platform supports **Just In Time** user provisioning.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Add IamIP Platform from the gallery

To configure the integration of IamIP Platform into Azure AD, you need to add IamIP Platform from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal with a work or school account or with a personal Microsoft account.
1. In the left pane, select **Azure Active Directory**.
1. Go to **Enterprise applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **IamIP Platform** in the search box.
1. Select **IamIP Platform** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for IamIP Platform

Configure and test Azure AD SSO with IamIP Platform using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in IamIP Platform.

To configure and test Azure AD SSO with IamIP Platform, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure IamIP Platform SSO](#configure-iamip-platform-sso)** - to configure the single sign-on settings on application side.
    1. **[Create IamIP Platform test user](#create-iamip-platform-test-user)** - to have a counterpart of B.Simon in IamIP Platform that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **IamIP Platform** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, the user does not have to perform any step as the app is already pre-integrated with Azure.

1. On the **Basic SAML Configuration** section, if you wish to configure the application in **SP** initiated mode, perform the following steps:

    a. In the **Identifier** textbox, type the URL:
    `https://accounts.iamip.com/`
    
    b. In the **Reply URL** text box, type one of the following URLs:

    | **Reply URL** |
    |---------|
    | `https://accounts.iamip.com/sso-callback` |
    | `https://accounts.iamip.com/sso-login` |
    | `https://accounts.iamip.com/sso-logout` |

    c. In the **Sign-on URL** text box, type one of the following URLs:

    | **Sign-on URL** |
    |------|
    | `https://accounts.iamip.com/login` |
    | `https://patents.iamip.com/login-user` |

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. On the **Set up IamIP Platform** section, copy the appropriate URL(s) based on your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

### Create an Azure AD test user

In this section, you'll create a test user named B.Simon in the Azure portal.

1. In the left pane of the Azure portal, select **Azure Active Directory**. Select **Users**, and then select **All users**.
1. Select **New user** at the top of the screen.
1. In the **User** properties, complete these steps:
   1. In the **Name** box, enter **B.Simon**.  
   1. In the **User name** box, enter \<username>@\<companydomain>.\<extension>. For example, `B.Simon@contoso.com`.
   1. Select **Show password**, and then write down the value that's displayed in the **Password** box.
   1. Select **Create**.

### Assign the Azure AD test user

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to IamIP Platform.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **IamIP Platform**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure IamIP Platform SSO

To configure single sign-on on **IamIP Platform** side, you need to send the downloaded **Certificate (Base64)** and appropriate copied URLs from Azure portal to [IamIP Platform support team](mailto:info@iamip.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create IamIP Platform test user

In this section, a user called Britta Simon is created in IamIP Platform. IamIP Platform supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in IamIP Platform, a new one is created after authentication.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application** in Azure portal. This will redirect to IamIP Platform Sign on URL where you can initiate the login flow.  

* Go to IamIP Platform Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application** in Azure portal and you should be automatically signed in to the IamIP Platform for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the IamIP Platform tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the IamIP Platform for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure IamIP Platform you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).

---
title: 'Tutorial: Azure AD SSO integration with Pavaso Digital Close'
description: Learn how to configure single sign-on between Azure Active Directory and Pavaso Digital Close.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 10/05/2021
ms.author: jeedes
---
# Tutorial: Azure AD SSO integration with Pavaso Digital Close

In this tutorial, you'll learn how to integrate Pavaso Digital Close with Azure Active Directory (Azure AD). When you integrate Pavaso Digital Close with Azure AD, you can:

* Control in Azure AD who has access to Pavaso Digital Close.
* Enable your users to be automatically signed-in to Pavaso Digital Close with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Pavaso Digital Close single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Pavaso Digital Close supports **SP and IDP** initiated SSO.

## Add Pavaso Digital Close from the gallery

To configure the integration of Pavaso Digital Close into Azure AD, you need to add Pavaso Digital Close from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Pavaso Digital Close** in the search box.
1. Select **Pavaso Digital Close** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for Pavaso Digital Close

Configure and test Azure AD SSO with Pavaso Digital Close using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Pavaso Digital Close.

To configure and test Azure AD SSO with Pavaso Digital Close, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Pavaso Digital Close SSO](#configure-pavaso-digital-close-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Pavaso Digital Close test user](#create-pavaso-digital-close-test-user)** - to have a counterpart of B.Simon in Pavaso Digital Close that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Pavaso Digital Close** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, If you wish to configure the application in **IDP** initiated mode, perform the following steps:

    a. In the **Identifier** text box, type a URL using the following pattern:
    `https://<SUBDOMAIN>.pavaso.com/AuthServices`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://<SUBDOMAIN>.pavaso.com/AuthServices/Acs`

5. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://<SUBDOMAIN>.pavaso.com`.

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier, Reply URL and Sign-on URL. Contact [Pavaso Digital Close Client support team](mailto:support@pavaso.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

6. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

7. On the **Set up Pavaso Digital Close** section, copy the appropriate URL(s) as per your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Pavaso Digital Close.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Pavaso Digital Close**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Pavaso Digital Close SSO

To configure single sign-on on **Pavaso Digital Close** side, you need to send the downloaded **Federation Metadata XML** and appropriate copied URLs from Azure portal to [Pavaso Digital Close support team](mailto:support@pavaso.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Pavaso Digital Close test user

In this section, you create a user called Britta Simon in Pavaso Digital Close. Work with [Pavaso Digital Close support team](mailto:support@pavaso.com) to add the users in the Pavaso Digital Close platform. Users must be created and activated before you use single sign-on.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application** in Azure portal. This will redirect to Pavaso Digital Close Sign on URL where you can initiate the login flow.  

* Go to Pavaso Digital Close Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application** in Azure portal and you should be automatically signed in to the Pavaso Digital Close for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the Pavaso Digital Close tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the Pavaso Digital Close for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure Pavaso Digital Close you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).

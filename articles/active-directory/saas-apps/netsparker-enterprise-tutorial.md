---
title: 'Tutorial: Azure AD SSO integration with Invicti'
description: Learn how to configure single sign-on between Azure Active Directory and Invicti.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 03/28/2022
ms.author: jeedes

---

# Tutorial: Azure AD SSO integration with Invicti

In this tutorial, you'll learn how to integrate Invicti with Azure Active Directory (Azure AD). When you integrate Invicti with Azure AD, you can:

* Control in Azure AD who has access to Invicti.
* Enable your users to be automatically signed-in to Invicti with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Invicti single sign-on (SSO) enabled subscription.
* Along with Cloud Application Administrator, Application Administrator can also add or manage applications in Azure AD.
For more information, see [Azure built-in roles](../roles/permissions-reference.md).

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Invicti supports **SP and IDP** initiated SSO.
* Invicti supports **Just In Time** user provisioning.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Add Invicti from the gallery

To configure the integration of Invicti into Azure AD, you need to add Invicti from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Invicti** in the search box.
1. Select **Invicti** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for Invicti

Configure and test Azure AD SSO with Invicti using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Invicti.

To configure and test Azure AD SSO with Invicti, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Invicti SSO](#configure-invicti-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Invicti test user](#create-invicti-test-user)** - to have a counterpart of B.Simon in Invicti that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Invicti** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, perform the following steps: 

    In the **Reply URL** text box, type a URL using the following pattern:
    `https://www.netsparkercloud.com/account/assertionconsumerservice/?spId=<SPID>`

1. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type the URL:
    `https://www.netsparkercloud.com/account/ssosignin/`

	> [!NOTE]
	> The Reply URL value is not real. Update the value with the actual Reply URL. Contact [Invicti Client support team](mailto:support@netsparker.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal. 

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. On the **Set up Invicti** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Invicti.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Invicti**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Invicti SSO

1.  Log in to Invicti as an Administrator.

1. Go to the **Settings > Single Sign-On**.

1. In the **Single Sign-On** window, select the **Azure Active Directory** tab. 

1. Perform the following steps in the following page.

    ![Azure Active Directory tab](./media/netsparker-enterprise-tutorial/configure-sso.png)

    a. Copy the **Identifier** value, paste this value into the **Identifier** text box in the **Basic SAML Configuration** section in the Azure portal.

    b. Copy the **SAML 2.0 Service URL** value, paste this value into the **Reply URL** text box in the **Basic SAML Configuration** section in the Azure portal.

    c. Paste the **Identifier** value, which you have copied from the Azure portal into the **IdP Identifier** field.

    d. Paste the **Reply URL** value, which you have copied from the Azure portal into the **SAML 2.0 Endpoint** field.

    e. Open the downloaded **Certificate (Base64)** from the Azure portal into Notepad and paste the content into the **x.509 Certificate** textbox.

    f. Check **Enable Auto Provisioning** and **Require SAML assertions to be encrypted** as required.

    g. Click **Save Changes**.

### Create Invicti test user

In this section, a user called Britta Simon is created in Invicti. Invicti supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in Invicti, a new one is created after authentication.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application** in Azure portal. This will redirect to Invicti Sign-on URL where you can initiate the login flow.  

* Go to Invicti Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application** in Azure portal and you should be automatically signed in to the Invicti for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the Invicti tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the Invicti for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure Invicti you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).
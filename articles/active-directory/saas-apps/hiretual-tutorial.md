---
title: 'Tutorial: Azure AD SSO integration with hireEZ-SSO'
description: Learn how to configure single sign-on between Azure Active Directory and hireEZ-SSO.
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

# Tutorial: Azure AD SSO integration with hireEZ-SSO

In this tutorial, you'll learn how to integrate hireEZ-SSO with Azure Active Directory (Azure AD). When you integrate hireEZ-SSO with Azure AD, you can:

* Control in Azure AD who has access to hireEZ-SSO.
* Enable your users to be automatically signed-in to hireEZ-SSO with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* hireEZ-SSO single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* hireEZ-SSO supports **SP and IDP** initiated SSO.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Add hireEZ-SSO from the gallery

To configure the integration of hireEZ-SSO into Azure AD, you need to add hireEZ-SSO from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **hireEZ-SSO** in the search box.
1. Select **hireEZ-SSO** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for hireEZ-SSO

Configure and test Azure AD SSO with hireEZ-SSO using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in hireEZ-SSO.

To configure and test Azure AD SSO with hireEZ-SSO, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure hireEZ-SSO](#configure-hireez-sso)** - to configure the single sign-on settings on application side.
    1. **[Create hireEZ-SSO test user](#create-hireez-sso-test-user)** - to have a counterpart of B.Simon in hireEZ-SSO that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **hireEZ-SSO** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, perform the following step:

    a. In the **Identifier** text box, type the URL:
    `https://app.hireez.com/`
    
    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://api.hireez.com/v1/users/saml/login/<teamId>`

	> [!NOTE]
	> The Reply URL value is not real. Update this value with the actual Reply URL. Contact [hireEZ-SSO Client support team](mailto:support@hiretual.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. Click the **Properties** tab on the left menu bar, copy the value of **User access URL**,and save it on your computer.

    ![Screenshot shows the User access URL.](./media/hiretual-tutorial/access-url.png "SSO Configuration")

1. On the **Set up single sign-on with SAML** page, In the **SAML Signing Certificate** section, click copy button to copy **App Federation Metadata Url** and save it on your computer.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to hireEZ-SSO.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **hireEZ-SSO**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure hireEZ-SSO

1. Log in to your hireEZ-SSO company site as an administrator.

1. Go to **Security & Compliance** > **Single Sign-On**.

1. In the **SAML2.0 Authentication** page, perform the following steps:

    ![Screenshot shows the SSO Configuration.](./media/hiretual-tutorial/configuration.png "SSO Configuration")

    1. In the **SAML2.O SSO URL** textbox, paste the **User access URL** which you have copied from the Azure portal.

    1. Copy **Entity ID** value from the metadata file and paste in the **Identity Provider Issuer** textbox.

    1. Copy **X509 Certificate** from the metadata file and paste the content in the **Certificate** textbox.

    1. Enable **Single Sign-On Connection Status** button.

    1. Test your Single Sign-On integration first and then enable **Admin SP-Initiated Single Sign-On** button. 

    > [!NOTE]
    > If your Single Sign-On configuration has any errors or you have trouble to login to hireEZ-SSO Web App/Extension after you connected Admin SP-Initiated Single Sign-On, please contact [hireEZ-SSO support team](mailto:support@hiretual.com).
    
### Create hireEZ-SSO test user

In this section, you create a user called Britta Simon in hireEZ-SSO. Work with [hireEZ-SSO support team](mailto:support@hiretual.com) to add the users in the hireEZ-SSO platform. Users must be created and activated before you use single sign-on.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application** in Azure portal. This will redirect to hireEZ-SSO Sign on URL where you can initiate the login flow.  

* Go to hireEZ-SSO Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application** in Azure portal and you should be automatically signed in to the hireEZ-SSO for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the hireEZ-SSO tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the hireEZ-SSO for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure hireEZ-SSO you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).

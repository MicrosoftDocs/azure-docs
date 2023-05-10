---
title: 'Tutorial: Azure Active Directory integration with LogMeIn'
description: Learn how to configure single sign-on between Azure Active Directory and LogMeIn.
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
# Tutorial: Azure Active Directory single sign-on (SSO) integration with LogMeIn

In this tutorial, you'll learn how to integrate LogMeIn with Azure Active Directory (Azure AD). When you integrate LogMeIn with Azure AD, you can:

* Control in Azure AD who has access to LogMeIn.
* Enable your users to be automatically signed-in to LogMeIn with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* LogMeIn single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* LogMeIn supports **SP and IDP** initiated SSO.
* LogMeIn supports [Automated user provisioning](logmein-provisioning-tutorial.md).

## Adding LogMeIn from the gallery

To configure the integration of LogMeIn into Azure AD, you need to add LogMeIn from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **LogMeIn** in the search box.
1. Select **LogMeIn** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for LogMeIn

Configure and test Azure AD SSO with LogMeIn using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in LogMeIn.

To configure and test Azure AD SSO with LogMeIn, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    * **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    * **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure LogMeIn SSO](#configure-logmein-sso)** - to configure the single sign-on settings on application side.
    * **[Create LogMeIn test user](#create-logmein-test-user)** - to have a counterpart of B.Simon in LogMeIn that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **LogMeIn** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, the user does not have to perform any steps as the app is already pre-integrated with Azure.

1. Click **Set additional URLs** and perform the following steps if you wish to configure the application in **SP** initiated mode:

	a. In the **Sign-on URL** text box, type the URL:
    `https://authentication.logmeininc.com/login?service=https%3A%2F%2Fmyaccount.logmeininc.com`

1. Your LogMeIn application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes, where as **Unique User Identifier** is mapped with **user.userprincipalname**. LogMeIn application expects **Unique User Identifier** to be mapped with **user.mail**, so you need to edit the attribute mapping by clicking on **Edit** icon and change the attribute mapping.

	![image](common/default-attributes.png)

1. On the **Set up single sign-on with SAML** page, In the **SAML Signing Certificate** section, click copy button to copy **App Federation Metadata Url** and save it on your computer.

	![The Certificate download link](common/copy-metadataurl.png)

6. On the **Set up LogMeIn** section, copy the appropriate URL(s) as per your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to LogMeIn.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **LogMeIn**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure LogMeIn SSO

1. To automate the configuration within LogMeIn, you need to install **My Apps Secure Sign-in browser extension** by clicking **Install the extension**.

	![My apps extension](common/install-myappssecure-extension.png)

1. After adding extension to the browser, click on **Set up LogMeIn** will direct you to the LogMeIn application. From there, provide the admin credentials to sign into LogMeIn. The browser extension will automatically configure the application for you and automate steps 3-5.

	![Setup configuration](common/setup-sso.png)

1. If you want to setup LogMeIn manually, in a different web browser window, sign in to your LogMeIn company site as an administrator.

1. Go to the **Identity Provider** tab and in the **Metadata url** textbox, paste the **Federation Metadata URL**, which you have copied from the Azure portal.

    ![Screenshot for Federation Metadata URL. ](./media/logmein-tutorial/configuration.png)

1. Click **Save**.

### Create LogMeIn test user

1. In a different browser window, log in to your LogMeIn website as an administrator.

1. Go to the **Users** tab and click **Add a user**.

    ![Screenshot for Add a user button.](./media/logmein-tutorial/add-user.png)

1. Fill the required fields in the following page and click **Save**.

    ![Screenshot for user fields.](./media/logmein-tutorial/create-user.png)

> [!NOTE]
> LogMeIn also supports automatic user provisioning, you can find more details [here](./logmein-provisioning-tutorial.md) on how to configure automatic user provisioning.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application** in Azure portal. This will redirect to LogMeIn Sign on URL where you can initiate the login flow.  

* Go to LogMeIn Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application** in Azure portal and you should be automatically signed in to the LogMeIn for which you set up the SSO 

You can also use Microsoft My Apps to test the application in any mode. When you click the LogMeIn tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the LogMeIn for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

Once you configure the LogMeIn you can enforce session controls, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session controls extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).

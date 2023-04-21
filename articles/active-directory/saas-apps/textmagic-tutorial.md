---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with TextMagic'
description: Learn how to configure single sign-on between Azure Active Directory and TextMagic.
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

# Tutorial: Azure Active Directory single sign-on (SSO) integration with TextMagic

In this tutorial, you'll learn how to integrate TextMagic with Azure Active Directory (Azure AD). When you integrate TextMagic with Azure AD, you can:

* Control in Azure AD who has access to TextMagic.
* Enable your users to be automatically signed-in to TextMagic with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* TextMagic single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* TextMagic supports **IDP** initiated SSO.

* TextMagic supports **Just In Time** user provisioning.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Add TextMagic from the gallery

To configure the integration of TextMagic into Azure AD, you need to add TextMagic from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **TextMagic** in the search box.
1. Select **TextMagic** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for TextMagic

Configure and test Azure AD SSO with TextMagic using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in TextMagic.

To configure and test Azure AD SSO with TextMagic, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure TextMagic SSO](#configure-textmagic-sso)** - to configure the single sign-on settings on application side.
    1. **[Create TextMagic test user](#create-textmagic-test-user)** - to have a counterpart of B.Simon in TextMagic that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **TextMagic** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, perform the following step:

    In the **Identifier** text box, type the URL:
    `https://my.textmagic.com/saml/metadata`

5. TextMagic application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes, where as **nameidentifier** is mapped with **user.userprincipalname**. TextMagic application expects **nameidentifier** to be mapped with **user.mail**, so you need to edit the attribute mapping by clicking on **Edit** icon and change the attribute mapping.

	![image](common/edit-attribute.png)

1. In addition to above, TextMagic application expects few more attributes to be passed back in SAML response which are shown below. These attributes are also pre populated but you can review them as per your requirement.

	| Name |   Source Attribute| Namespace  |
	| --------------- | --------------- | --------------- |
	| company | user.companyname | https://schemas.xmlsoap.org/ws/2005/05/identity/claims |
	| firstName | user.givenname |  https://schemas.xmlsoap.org/ws/2005/05/identity/claims |
	| lastName | user.surname |  https://schemas.xmlsoap.org/ws/2005/05/identity/claims |
	| phone | user.telephonenumber |  https://schemas.xmlsoap.org/ws/2005/05/identity/claims |

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. On the **Set up TextMagic** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to TextMagic.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **TextMagic**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure TextMagic SSO

1. To automate the configuration within TextMagic, you need to install **My Apps Secure Sign-in browser extension** by clicking **Install the extension**.

	![My apps extension](common/install-myappssecure-extension.png)

2. After adding extension to the browser, click on **Setup TextMagic** will direct you to the TextMagic application. From there, provide the admin credentials to sign into TextMagic. The browser extension will automatically configure the application for you and automate steps 3-5.

	![Setup configuration](common/setup-sso.png)

3. If you want to setup TextMagic manually, open a new web browser window and sign into your TextMagic company site as an administrator and perform the following steps:

4. Select **Account settings** under the username.

	![Screenshot shows Account settings selected from the user.](./media/textmagic-tutorial/account.png)

5. Click on the **Single Sign-On (SSO)** tab and fill in the following fields:  

	![Screenshot shows the Single Sign-On tab where you can enter the values described.](./media/textmagic-tutorial/settings.png)

	a. In **Identity provider Entity ID:** textbox, paste the value of **Azure AD Identifier**, which you have copied from Azure portal.

	b. In **Identity provider SSO URL:** textbox, paste the value of **Login URL**, which you have copied from Azure portal.

	c. In **Identity provider SLO URL:** textbox, paste the value of **Logout URL**, which you have copied from Azure portal.

	d. Open your **base-64 encoded certificate** in notepad downloaded from Azure portal, copy the content of it into your clipboard, and then paste it to the **Public x509 certificate:** textbox.

	e. Click **Save**.

### Create TextMagic test user

In this section, a user called B.Simon is created in TextMagic. TextMagic supports just-in-time user provisioning, which is enabled by default. There's no action item for you in this section. If a user doesn't already exist in TextMagic, a new one is created after authentication.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options.

* Click on Test this application in Azure portal and you should be automatically signed in to the TextMagic for which you set up the SSO.

* You can use Microsoft My Apps. When you click the TextMagic tile in the My Apps, you should be automatically signed in to the TextMagic for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

Once you configure TextMagic you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).

---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with SmartDraw | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and SmartDraw.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 6f8fbbe8-c771-4fa1-9326-5a9dac991ace
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: tutorial
ms.date: 01/02/2020
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with SmartDraw

In this tutorial, you'll learn how to integrate SmartDraw with Azure Active Directory (Azure AD). When you integrate SmartDraw with Azure AD, you can:

* Control in Azure AD who has access to SmartDraw.
* Enable your users to be automatically signed-in to SmartDraw with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* SmartDraw single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* SmartDraw supports **SP and IDP** initiated SSO
* SmartDraw supports **Just In Time** user provisioning

## Adding SmartDraw from the gallery

To configure the integration of SmartDraw into Azure AD, you need to add SmartDraw from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **SmartDraw** in the search box.
1. Select **SmartDraw** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD single sign-on for SmartDraw

Configure and test Azure AD SSO with SmartDraw using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in SmartDraw.

To configure and test Azure AD SSO with SmartDraw, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    * **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    * **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure SmartDraw SSO](#configure-smartdraw-sso)** - to configure the single sign-on settings on application side.
    * **[Create SmartDraw test user](#create-smartdraw-test-user)** - to have a counterpart of B.Simon in SmartDraw that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **SmartDraw** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, the user does not have to perform any step as the app is already pre-integrated with Azure.

1. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://cloud.smartdraw.com/sso/saml/login/<domain>`

    > [!NOTE]
	> The Sign-on URL value is not real. You will update the Sign-on URL value with the actual Sign-on URL, which is explained later in the tutorial. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. Click **Save**.

1. SmartDraw application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

	![image](common/default-attributes.png)

1. In addition to above, SmartDraw application expects few more attributes to be passed back in SAML response which are shown below. These attributes are also pre populated but you can review them as per your requirements.

	| Name | Source Attribute|
	| ---------------| --------------- |
	| FirstName | user.givenname |
	| LastName | user.surname |
	| Email | user.mail |
	| Groups | user.groups |

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

1. On the **Set up SmartDraw** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to SmartDraw.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **SmartDraw**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure SmartDraw SSO

1. To automate the configuration within SmartDraw, you need to install **My Apps Secure Sign-in browser extension** by clicking **Install the extension**.

	![My apps extension](common/install-myappssecure-extension.png)

1. After adding extension to the browser, click on **Set up SmartDraw** will direct you to the SmartDraw application. From there, provide the admin credentials to sign into SmartDraw. The browser extension will automatically configure the application for you and automate steps 3-5.

	![Setup configuration](common/setup-sso.png)

1. If you want to setup SmartDraw manually, open a new web browser window and sign into your SmartDraw company site as an administrator and perform the following steps:

1. Click on **Single Sign-On** under Manage your SmartDraw License.

	![SmartDraw Configuration](./media/smartdraw-tutorial/configure01.png)

1. On the Configuration page, perform the following steps:

	![SmartDraw Configuration](./media/smartdraw-tutorial/configure02.png)

	a. In the **Your Domain (like acme.com)** textbox, type your domain.

	b. Copy the **Your SP Initiated Login Url will be** for your instance and paste it in Sign-on URL textbox in **Basic SAML Configuration** on Azure portal.

	c. In the **Security Groups to Allow SmartDraw Access** textbox, type **Everyone**.

	d. In the **Your SAML Issuer Url** textbox, paste the value of **Azure AD Identifier** which you have copied from the Azure portal.

	e. In Notepad, open the Metadata XML file that you downloaded from the Azure portal, copy its content, and then paste it into the **Your SAML MetaData** box.

	f. Click **Save Configuration**	

### Create SmartDraw test user

In this section, a user called B.Simon is created in SmartDraw. SmartDraw supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in SmartDraw, a new one is created after authentication.

## Test SSO

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the SmartDraw tile in the Access Panel, you should be automatically signed in to the SmartDraw for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [ List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory ](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory? ](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [Try SmartDraw with Azure AD](https://aad.portal.azure.com/)
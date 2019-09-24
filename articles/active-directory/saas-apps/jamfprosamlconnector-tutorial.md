---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with Jamf Pro | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Jamf Pro.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 35e86d08-c29e-49ca-8545-b0ff559c5faf
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 08/28/2019
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with Jamf Pro

In this tutorial, you'll learn how to integrate Jamf Pro with Azure Active Directory (Azure AD). When you integrate Jamf Pro with Azure AD, you can:

* Control in Azure AD who has access to Jamf Pro.
* Enable your users to be automatically signed-in to Jamf Pro with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Jamf Pro single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Jamf Pro supports **SP and IDP** initiated SSO

## Adding Jamf Pro from the gallery

To configure the integration of Jamf Pro into Azure AD, you need to add Jamf Pro from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Jamf Pro** in the search box.
1. Select **Jamf Pro** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD single sign-on for Jamf Pro

Configure and test Azure AD SSO with Jamf Pro using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Jamf Pro.

To configure and test Azure AD SSO with Jamf Pro, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Jamf Pro SSO](#configure-jamf-pro-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Jamf Pro test user](#create-jamf-pro-test-user)** - to have a counterpart of B.Simon in Jamf Pro that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **Jamf Pro** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, enter the values for the following fields:

    a. In the **Identifier** text box, type a URL using the following pattern:
    `https://<subdomain>.jamfcloud.com/saml/metadata`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://<subdomain>.jamfcloud.com/saml/SSO`

1. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://<subdomain>.jamfcloud.com`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier, Reply URL, and Sign-On URL. You will get the actual Identifier value from **Single Sign-On** section in Jamf Pro portal, which is explained later in the tutorial. You can extract the actual **subdomain** value from the identifier value and use that **subdomain** information in Sign-on URL and Reply URL. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Jamf Pro.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Jamf Pro**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Jamf Pro SSO

1. To automate the configuration within Jamf Pro, you need to install **My Apps Secure Sign-in browser extension** by clicking **Install the extension**.

	![My apps extension](common/install-myappssecure-extension.png)

2. After adding extension to the browser, click on **setup Jamf Pro** will direct you to the Jamf Pro application. From there, provide the admin credentials to sign into Jamf Pro. The browser extension will automatically configure the application for you and automate steps 3-7.

	![Setup configuration](common/setup-sso.png)

3. If you want to setup Jamf Pro manually, open a new web browser window and sign into your Jamf Pro company site as an administrator and perform the following steps:

4. Click on the **Settings icon** from the top right corner of the page.

	![Jamf Pro Configuration](./media/jamfprosamlconnector-tutorial/configure1.png)

5. Click on **Single Sign On**.

	![Jamf Pro Configuration](./media/jamfprosamlconnector-tutorial/configure2.png)

6. On the **Single Sign-On** page perform the following steps:

	![Jamf Pro Configuration](./media/jamfprosamlconnector-tutorial/configure3.png)

	a. Check the **Enable Single Sign-On Authentication**.

	b. Select **Other** as an option from the **IDENTITY PROVIDER** dropdown.

	c. In the **OTHER PROVIDER** textbox, enter **Azure AD**.

	d. Copy the **ENTITY ID** value and paste it into the **Identifier (Entity ID)** textbox in **Basic SAML Configuration** section on Azure portal.

	> [!NOTE]
	> Here `<SUBDOMAIN>` part, you need to use this value to complete the Sign-on URL and Reply URL in the **Basic SAML Configuration** section on Azure portal.

	e. Select **Metadata URL** as an option from the **IDENTITY PROVIDER METADATA SOURCE** dropdown and in the following textbox, paste the **App Federation Metadata Url** value which you have copied from the Azure portal.

7. On the same page scroll down up to **User Mapping** section and perform the following steps:	

	![Jamf Pro single](./media/jamfprosamlconnector-tutorial/tutorial_jamfprosamlconnector_single.png)

	a. Select the **NameID** option for **IDENTITY PROVIDER USER MAPPING**. By default, this setting is set to **NameID** but you may define a custom attribute.

	b. Select **Email** for **JAMF PRO USER MAPPING**. Jamf Pro maps SAML attributes sent by the IdP in the following ways: by users and by groups. When a user tries to access Jamf Pro, by default Jamf Pro gets information about the user from the Identity Provider and matches it against Jamf Pro user accounts. If the incoming user account does not exist in Jamf Pro, then group name matching occurs.

	c. Paste the value `http://schemas.microsoft.com/ws/2008/06/identity/claims/groups` in the **IDENTITY PROVIDER GROUP ATTRIBUTE NAME** textbox.

	d. By selecting **Allow users to bypass the Single Sign-On authentication** users will not be redirected to the Identity Provider sign page for authentication, but can sign in to Jamf Pro directly instead. When a user tries to access Jamf Pro via the Identity Provider, IdP-initiated SSO authentication and authorization occurs.

	e. Click **Save**.

### Create Jamf Pro test user

To enable Azure AD users to sign in to Jamf Pro, they must be provisioned into Jamf Pro. In the case of Jamf Pro, provisioning is a manual task.

**To provision a user account, perform the following steps:**

1. Sign in to your Jamf Pro company site as an administrator.

2. Click on the **Settings icon** from the top right corner of the page.

	![Add Employee](./media/jamfprosamlconnector-tutorial/configure1.png)

3. Click on **Jamf Pro User Accounts & Groups**.

	![Add Employee](./media/jamfprosamlconnector-tutorial/user1.png)

4. Click **New**.

	![Add Employee](./media/jamfprosamlconnector-tutorial/user2.png)

5. Select **Create Standard Account**.

	![Add Employee](./media/jamfprosamlconnector-tutorial/user3.png)

6. On the **New Account** dailog, perform the following steps:

	![Add Employee](./media/jamfprosamlconnector-tutorial/user4.png)

	a. In the **USERNAME** textbox, type the full name of BrittaSimon.

	b. Select appropriate options as per your organization for **ACCESS LEVEL**, **PRIVILEGE SET**, and for **ACCESS STATUS**.

	c. In the **FULL NAME** textbox, type the full name of Britta Simon.

	d. In the **EMAIL ADDRESS** textbox, type the email address of Britta Simon account.

	e. In the **PASSWORD** textbox, type the password of the user.

	f. In the **VERIFY PASSWORD** textbox, type the password of the user.

	g. Click **Save**.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Jamf Pro tile in the Access Panel, you should be automatically signed in to the Jamf Pro for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [ List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory ](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory? ](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [Try Jamf Pro with Azure AD](https://aad.portal.azure.com/)


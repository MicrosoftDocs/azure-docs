---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with Evernote | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Evernote.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 09/17/2019
ms.author: jeedes
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with Evernote

In this tutorial, you'll learn how to integrate Evernote with Azure Active Directory (Azure AD). When you integrate Evernote with Azure AD, you can:

* Control in Azure AD who has access to Evernote.
* Enable your users to be automatically signed-in to Evernote with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Evernote single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Evernote supports **SP and IDP** initiated SSO

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Adding Evernote from the gallery

To configure the integration of Evernote into Azure AD, you need to add Evernote from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Evernote** in the search box.
1. Select **Evernote** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD single sign-on for Evernote

Configure and test Azure AD SSO with Evernote using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Evernote.

To configure and test Azure AD SSO with Evernote, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Evernote SSO](#configure-evernote-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Evernote test user](#create-evernote-test-user)** - to have a counterpart of B.Simon in Evernote that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **Evernote** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, enter the values for the following fields:

    In the **Identifier** text box, type a URL:
    `https://www.evernote.com/saml2`

1. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type a URL:
    `https://www.evernote.com/Login.action`

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

7. To modify the **Signing** options, click the **Edit** button to open the **SAML Signing Certificate** dialog.

	![Screenshot that shows the "S A M L Signing Certificate" dialog with the "Edit" button selected.](common/edit-certificate.png) 

	![image](./media/evernote-tutorial/samlassertion.png)

	a. Select the **Sign SAML response and assertion** option for **Signing Option**.

	b. Click **Save**

1. On the **Set up Evernote** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Evernote.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Evernote**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Evernote SSO

1. To automate the configuration within Evernote, you need to install **My Apps Secure Sign-in browser extension** by clicking **Install the extension**.

	![My apps extension](common/install-myappssecure-extension.png)

2. After adding extension to the browser, click on **setup Evernote** will direct you to the Evernote application. From there, provide the admin credentials to sign into Evernote. The browser extension will automatically configure the application for you and automate steps 3-6.

	![Setup configuration](common/setup-sso.png)

3. If you want to setup Evernote manually, open a new web browser window and sign into your Evernote company site as an administrator and perform the following steps:

4. Go to **'Admin Console'**

	![Admin-Console](./media/evernote-tutorial/tutorial_evernote_adminconsole.png)

5. From the **'Admin Console'**, go to **‘Security’** and select **‘Single Sign-On’**

	![SSO-Setting](./media/evernote-tutorial/tutorial_evernote_sso.png)

6. Configure the following values:

	![Certificate-Setting](./media/evernote-tutorial/tutorial_evernote_certx.png)
	
	a.  **Enable SSO:** SSO is enabled by default (Click **Disable Single Sign-on** to remove the SSO requirement)

	b. Paste **Login URL** value, which you have copied from the Azure portal into the **SAML HTTP Request URL** textbox.

	c. Open the downloaded certificate from Azure AD in a notepad and copy the content including "BEGIN CERTIFICATE" and "END CERTIFICATE" and paste it into the **X.509 Certificate** textbox. 

	d.Click **Save Changes**

### Create Evernote test user

In order to enable Azure AD users to sign into Evernote, they must be provisioned into Evernote.  
In the case of Evernote, provisioning is a manual task.

**To provision a user accounts, perform the following steps:**

1. Sign in to your Evernote company site as an administrator.

2. Click the **'Admin Console'**.

	![Admin-Console](./media/evernote-tutorial/tutorial_evernote_adminconsole.png)

3. From the **'Admin Console'**, go to **‘Add users’**.

	![Screenshot that shows the "Users" menu with "Add Users" selected.](./media/evernote-tutorial/create_aaduser_0001.png)

4. **Add team members** in the **Email** textbox, type the email address of user account and click **Invite.**

	![Add-testUser](./media/evernote-tutorial/create_aaduser_0002.png)
	
5. After invitation is sent, the Azure Active Directory account holder will receive an email to accept the invitation.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Evernote tile in the Access Panel, you should be automatically signed in to the Evernote for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [ List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory ](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory? ](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [Try Evernote with Azure AD](https://aad.portal.azure.com/)


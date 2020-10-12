---
title: 'Tutorial: Azure Active Directory integration with Help Scout | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Help Scout.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 10/24/2019
ms.author: jeedes
---
# Tutorial: Azure Active Directory integration with Help Scout

In this tutorial, you learn how to integrate Help Scout with Azure Active Directory (Azure AD).
Integrating Help Scout with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to Help Scout.
* You can enable your users to be automatically signed-in to Help Scout (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with Help Scout, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Help Scout single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Help Scout supports **SP and IDP** initiated SSO
* Help Scout supports **Just In Time** user provisioning

## Adding Help Scout from the gallery

To configure the integration of Help Scout into Azure AD, you need to add Help Scout from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Help Scout** in the search box.
1. Select **Help Scout** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Help Scout based on a test user called **B.Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in Help Scout needs to be established.

To configure and test Azure AD single sign-on with Help Scout, you need to complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    * **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    * **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Help Scout SSO](#configure-help-scout-sso)** - to configure the single sign-on settings on application side.
    * **[Create Help Scout test user](#create-help-scout-test-user)** - to have a counterpart of B.Simon in Help Scout that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

### Configure Azure AD SSO

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with Help Scout, perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **Help Scout** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

1. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

1. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, If you wish to configure the application in **IDP** initiated mode, perform the following steps:

    ![Screenshot shows the Basic SAML Configuration, where you can enter Identifier, Reply U R L, and select Save.](common/idp-intiated.png)

    a. **Identifier** is the **Audience URI (Service Provider Entity ID)** from Help Scout, starts with `urn:`

	b. **Reply URL** is the **Post-back URL (Assertion Consumer Service URL)** from Help Scout, starts with `https://` 

	> [!NOTE]
	> The values in these URLs are for demonstration only. You need to update these values from actual Reply URL and Identifier. You get these values from the **Single Sign-On** tab under Authentication section, which is explained later in the tutorial.

1. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    ![Screenshot shows Set additional U R Ls where you can enter a Sign on U R L.](common/metadata-upload-additional-signon.png)

    In the **Sign-on URL** textbox, type a URL as: `https://secure.helpscout.net/members/login/`

1. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Base64)** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. On the **Set up Help Scout** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Azure Ad Identifier

	c. Logout URL

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called B.Simon.

1. In the Azure portal, in the left pane, select **Azure Active Directory**, select **Users**, and then select **All users**.

    ![The "Users and groups" and "All users" links](common/users.png)

2. Select **New user** at the top of the screen.

    ![New user Button](common/new-user.png)

3. In the User properties, perform the following steps.

    ![The User dialog box](common/user-properties.png)

    a. In the **Name** field enter **B.Simon**.
  
    b. In the **User name** field type **B.Simon\@yourcompanydomain.extension**  
    For example, B.Simon@contoso.com

    c. Select **Show password** check box, and then write down the value that's displayed in the Password box.

    d. Click **Create**.

### Assign the Azure AD test user

In this section, you enable B.Simon to use Azure single sign-on by granting access to Help Scout.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **Help Scout**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **Help Scout**.

	![The Help Scout link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog select **B.Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog click the **Assign** button.

## Configure Help Scout SSO

1. To automate the configuration within Help Scout, you need to install **My Apps Secure Sign-in browser extension** by clicking **Install the extension**.

	![My apps extension](common/install-myappssecure-extension.png)

1. After adding extension to the browser, click on **Set up Help Scout** will direct you to the Help Scout application. From there, provide the admin credentials to sign into Help Scout. The browser extension will automatically configure the application for you and automate steps 3-7.

	![Setup configuration](common/setup-sso.png)

1. If you want to setup Help Scout manually, open a new web browser window and sign into your Help Scout company site as an administrator and perform the following steps:

1. Click on **Manage** from the top menu and then select **Company** from the dropdown menu.

	![Screenshot shows the Manage menu with Company selected.](./media/helpscout-tutorial/settings1.png)

1. Select **Authentication** from the left navigation pane.

	![Screenshot shows Authentication selected.](./media/helpscout-tutorial/settings2.png)

1. This takes you to the SAML settings section and perform the following steps:

	![Screenshot shows the Single Sign-On tab where you enter the specified information.](./media/helpscout-tutorial/settings3.png)

	a. Copy the **Post-back URL (Assertion Consumer Service URL)** value and paste the value in the **Reply URL** text box in the **Basic SAML Configuration** section in the Azure portal.

	b. Copy the **Audience URI (Service Provider Entity ID)** value and paste the value in the **Identifier** text box in the **Basic SAML Configuration** section in the Azure portal.

1. Toggle **Enable SAML** on and perform the following steps:

	![Screenshot shows the Single Sign-On tab where you enable SAML and add other information.](./media/helpscout-tutorial/settings4.png)

	a. In **Single Sign-On URL** textbox, paste the value of **Login URL**, which you have copied from Azure portal.

	b. Click **Upload Certificate** to upload the **Certificate(Base64)** downloaded from Azure portal.

	c. Enter your organization's email domain(s) e.x.- `contoso.com` in the **Email Domains** textbox. You can separate multiple domains with a comma. Anytime a Help Scout User or Administrator who enters that specific domain on the [Help Scout log-in page](https://secure.helpscout.net/members/login/) will be routed to Identity Provider to authenticate with their credentials.

	d. Lastly, you can toggle **Force SAML Sign-on** if you want Users to only log in to Help Scout via through this method. If you'd still like to leave the option for them to sign in with their Help Scout credentials, you can leave it toggled off. Even if this is enabled, an Account Owner will always be able to log in to Help Scout with their account password.

	e. Click **Save**.

### Create Help Scout test user

In this section, a user called B.Simon is created in Help Scout. Help Scout supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in Help Scout, a new one is created after authentication.

### Test SSO

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Help Scout tile in the Access Panel, you should be automatically signed in to the Help Scout for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [Try Help Scout with Azure AD](https://aad.portal.azure.com/)
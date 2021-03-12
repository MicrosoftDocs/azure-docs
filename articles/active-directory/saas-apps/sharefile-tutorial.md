---
title: 'Tutorial: Azure Active Directory integration with Citrix ShareFile | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Citrix ShareFile.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 01/18/2021
ms.author: jeedes
---
# Tutorial: Azure Active Directory integration with Citrix ShareFile

In this tutorial, you learn how to integrate Citrix ShareFile with Azure Active Directory (Azure AD).
Integrating Citrix ShareFile with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to Citrix ShareFile.
* You can enable your users to be automatically signed-in to Citrix ShareFile (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

## Prerequisites

To configure Azure AD integration with Citrix ShareFile, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get one-month trial [here](https://azure.microsoft.com/pricing/free-trial/).
* Citrix ShareFile single sign-on enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Citrix ShareFile supports **SP** initiated SSO

## Adding Citrix ShareFile from the gallery

To configure the integration of Citrix ShareFile into Azure AD, you need to add Citrix ShareFile from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Citrix ShareFile** in the search box.
1. Select **Citrix ShareFile** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD SSO for Citrix ShareFile

In this section, you configure and test Azure AD single sign-on with Citrix ShareFile based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in Citrix ShareFile needs to be established.

To configure and test Azure AD single sign-on with Citrix ShareFile, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
	
	1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
	1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
2. **[Configure Citrix ShareFile SSO](#configure-citrix-sharefile-sso)** - to configure the Single Sign-On settings on application side.
	1. **[Create Citrix ShareFile test user](#create-citrix-sharefile-test-user)** - to have a counterpart of Britta Simon in Citrix ShareFile that is linked to the Azure AD representation of user.
3. **[Test SSO](#test-sso)** - to verify whether the configuration works.

### Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Citrix ShareFile** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, enter the values for the following fields:

    a. In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://<tenant-name>.sharefile.com/saml/login`

    b. In the **Identifier (Entity ID)** textbox, type a URL using the following pattern:

    - `https://<tenant-name>.sharefile.com`
	- `https://<tenant-name>.sharefile.com/saml/info`
	- `https://<tenant-name>.sharefile1.com/saml/info`
	- `https://<tenant-name>.sharefile1.eu/saml/info`
	- `https://<tenant-name>.sharefile.eu/saml/info`

	c. In the **Reply URL** textbox, type a URL using the following pattern:
	
	- `https://<tenant-name>.sharefile.com/saml/acs`
	- `https://<tenant-name>.sharefile.eu/saml/<URL path>`
	- `https://<tenant-name>.sharefile.com/saml/<URL path>`

	> [!NOTE]
	> These values are not real. Update these values with the actual Sign-On URL, Identifier and Reply URL. Contact [Citrix ShareFile Client support team](https://www.citrix.co.in/products/citrix-content-collaboration/support.html) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

4. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Base64)** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

6. On the **Set up Citrix ShareFile** section, copy the appropriate URL(s) as per your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Citrix ShareFile.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Citrix ShareFile**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Citrix ShareFile SSO

1. To automate the configuration within **Citrix ShareFile**, you need to install **My Apps Secure Sign-in browser extension** by clicking **Install the extension**.

	![My apps extension](common/install-myappssecure-extension.png)

2. After adding extension to the browser, click on **Set up Citrix ShareFile** will direct you to the Citrix ShareFile application. From there, provide the admin credentials to sign into Citrix ShareFile. The browser extension will automatically configure the application for you and automate steps 3-7.

	![Setup configuration](common/setup-sso.png)

3. If you want to setup Citrix ShareFile manually, in a different web browser window, sign in to your Citrix ShareFile company site as an administrator.

1. In the **Dashboard**, click on **Settings** and select **Admin Settings**.

	![Administration](./media/sharefile-tutorial/settings.png)

1. In the Admin Settings, go to the **Security** -> **Login & Security Policy**.
   
    ![Account Administration](./media/sharefile-tutorial/settings-security.png "Account Administration")

1. On the **Single Sign-On/ SAML 2.0 Configuration** dialog page under **Basic Settings**, perform the following steps:
   
    ![Single sign-on](./media/sharefile-tutorial/saml-configuration.png "Single sign-on")
   
	a. Select **YES** in the **Enable SAML**.

	b. Copy the **ShareFile Issuer/ Entity ID** value and paste it into the **Identifier URL** box in the **Basic SAML Configuration** dialog box in the Azure portal.
	
	c. In **Your IDP Issuer/ Entity ID** textbox, paste the value of **Azure Ad Identifier** which you have copied from Azure portal.

	d. Click **Change** next to the **X.509 Certificate** field and then upload the certificate you downloaded from the Azure portal.
	
	e. In **Login URL** textbox, paste the value of **Login URL** which you have copied from Azure portal.
	
	f. In **Logout URL** textbox, paste the value of **Logout URL** which you have copied from Azure portal.

	g. In the **Optional Settings**, choose **SP-Initiated Auth Context** as **User Name and Password** and **Exact**.

5. Click **Save**.

## Create Citrix ShareFile test user

1. Log in to your **Citrix ShareFile** tenant.

2. Click **People** -> **Manage Users Home** -> **Create New Users** -> **Create Employee**.
   
	![Create Employee](./media/sharefile-tutorial/create-user.png "Create Employee")

3. On the **Basic Information** section, perform below steps:
   
	![Basic Information](./media/sharefile-tutorial/user-form.png "Basic Information")
   
	a. In the **First Name** textbox, type **first name** of user as **Britta**.
   
	b.  In the **Last Name** textbox, type **last name** of user as **Simon**.
   
	c. In the **Email Address** textbox, type the email address of Britta Simon as **brittasimon\@contoso.com**.

4. Click **Add User**.
  
	>[!NOTE]
	>The Azure AD account holder will receive an email and follow a link to confirm their account before it becomes active.You can use any other Citrix ShareFile user account creation tools or APIs provided by Citrix ShareFile to provision Azure AD user accounts.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options.

* Click on **Test this application** in Azure portal. This will redirect to Citrix ShareFile Sign-on URL where you can initiate the login flow.

* Go to Citrix ShareFile Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Citrix ShareFile tile in the My Apps, this will redirect to Citrix ShareFile Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).


## Next steps

Once you configure Citrix ShareFile you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-any-app).
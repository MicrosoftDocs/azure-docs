---
title: 'Tutorial: Azure AD SSO integration with Chargebee'
description: Learn how to configure single sign-on between Azure Active Directory and Chargebee.
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

# Tutorial: Azure AD SSO integration with Chargebee

In this tutorial, you'll learn how to integrate Chargebee with Azure Active Directory (Azure AD). When you integrate Chargebee with Azure AD, you can:

* Control in Azure AD who has access to Chargebee.
* Enable your users to be automatically signed-in to Chargebee with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Chargebee single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Chargebee supports **SP and IDP** initiated SSO.

## Add Chargebee from the gallery

To configure the integration of Chargebee into Azure AD, you need to add Chargebee from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Chargebee** in the search box.
1. Select **Chargebee** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for Chargebee

Configure and test Azure AD SSO with Chargebee using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Chargebee.

To configure and test Azure AD SSO with Chargebee, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
2. **[Configure Chargebee SSO](#configure-chargebee-sso)** - to configure the Single Sign-On settings on application side.
    1. **[Create Chargebee test user](#create-chargebee-test-user)** - to have a counterpart of B.Simon in Chargebee that is linked to the Azure AD representation of user.
3. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Chargebee** application integration page, find the **Manage** section and select **Single sign-on**.
1. On the **Select a Single sign-on method** page, select **SAML**.
1. On the **Set up Single Sign-On with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, perform the following steps:

    a. In the **Identifier** text box, type a URL using the following pattern:
    `https://<domainname>.chargebee.com`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://app.chargebee.com/saml/<domainname>/acs`

1. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://<domainname>.chargebee.com`

	> [!NOTE]
	> `<domainname>` is the name of the domain that the user creates after claiming the account. In case of any other information, contact [Chargebee Client support team](mailto:support@chargebee.com). You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

4. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

6. On the **Set up Chargebee** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Chargebee.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Chargebee**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Chargebee SSO

1. Open a new web browser window and sign into your Chargebee company site as an administrator.

4. From the left side of menu, click on **Settings** > **Security** > **Manage**.

	![Screenshot shows the Chargebee company site with Settings, Security, and Manage selected.](./media/chargebee-tutorial/security.png)

5. On the **Single Sign-On** pop-up, perform the following steps:

	![Screenshot shows the Single Sign-On dialog box with SAML selected and the option to confirm.](./media/chargebee-tutorial/settings.png)

	a. Select **SAML**.

	b. In the **Login URL** text box, Paste the **Login URL** value, which you have copied from the Azure portal.

	c. Open the Base64 encoded certificate in notepad, copy its content and paste it into the **SAML Certificate** text box.

	d. Click **Confirm**.

### Create Chargebee test user

To enable Azure AD users, sign in to Chargebee, they must be provisioned into Chargebee. In Chargebee, provisioning is a manual task.

**To provision a user account, perform the following steps:**

1. In a different web browser window, sign in to Chargebee as a Security Administrator.

2. From the left side of menu,, click on **Customers** and then navigate to **Create a New Customer**.

	![Screenshot shows Chargebee site with Customers and Create a New Customer selected.](./media/chargebee-tutorial/menu.png)

3. On the **New Customer** page, fill the respective fields shown below and click **Create Customer** for user creation.

	![Screenshot shows the New Customer page where you can enter customer information.](./media/chargebee-tutorial/customers.png)

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application** in Azure portal. This will redirect to Chargebee Sign on URL where you can initiate the login flow.  

* Go to Chargebee Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application** in Azure portal and you should be automatically signed in to the Chargebee for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the Chargebee tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the Chargebee for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure Chargebee you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).

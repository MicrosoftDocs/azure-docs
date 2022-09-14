---
title: 'Tutorial: Azure AD SSO integration with Fresh Relevance'
description: Learn how to configure single sign-on between Azure Active Directory and Fresh Relevance.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 05/23/2022
ms.author: jeedes

---

# Tutorial: Azure AD SSO integration with Fresh Relevance

In this tutorial, you'll learn how to integrate Fresh Relevance with Azure Active Directory (Azure AD). When you integrate Fresh Relevance with Azure AD, you can:

* Control in Azure AD who has access to Fresh Relevance.
* Enable your users to be automatically signed-in to Fresh Relevance with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Fresh Relevance single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Fresh Relevance supports **IDP** initiated SSO.

* Fresh Relevance supports **Just In Time** user provisioning.

## Add Fresh Relevance from the gallery

To configure the integration of Fresh Relevance into Azure AD, you need to add Fresh Relevance from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Fresh Relevance** in the search box.
1. Select **Fresh Relevance** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for Fresh Relevance

Configure and test Azure AD SSO with Fresh Relevance using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Fresh Relevance.

To configure and test Azure AD SSO with Fresh Relevance, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Fresh Relevance SSO](#configure-fresh-relevance-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Fresh Relevance test user](#create-fresh-relevance-test-user)** - to have a counterpart of B.Simon in Fresh Relevance that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Fresh Relevance** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, if you have **Service Provider metadata file**, perform the following steps:

	a. Click **Upload metadata file**.

    ![Metadata file](common/upload-metadata.png)

	b. Click on **folder logo** to select the metadata file and click **Upload**.

	![image](common/browse-upload-metadata.png)

	c. Once the metadata file is successfully uploaded, the **Identifier** and **Reply URL** values get auto populated in Basic SAML Configuration section:

	> [!Note]
	> If the **Identifier** and **Reply URL** values are not getting auto populated, then fill in the values manually according to your requirement.

    d. In the **Relay State** textbox, type a value using the following pattern:
    `<ID>`

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Fresh Relevance.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Fresh Relevance**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Fresh Relevance SSO

1. To automate the configuration within Fresh Relevance, you need to install **My Apps Secure Sign-in browser extension** by clicking **Install the extension**.

	![My apps extension](common/install-myappssecure-extension.png)

2. After adding extension to the browser, click on **Set up Fresh Relevance** will direct you to the Fresh Relevance application. From there, provide the admin credentials to sign into Fresh Relevance. The browser extension will automatically configure the application for you and automate steps 3-10.

	![Setup configuration](common/setup-sso.png)

3. If you want to setup Fresh Relevance manually, in a different web browser window, sign in to your Fresh Relevance company site as an administrator.

1. Go to **Settings** > **All Settings** > **Security and Privacy** and click **SAML/Azure AD Single Sign-On**.

    ![Screenshot shows settings of SAML account.](./media/fresh-relevance-tutorial/settings.png "Account")

1. In the **SAML/Single Sign-On Configuration** page, **Enable SAML SSO for this account** checkbox and click **Create new IdP Configuration** button. 

    ![Screenshot shows to create new IdP Configuration.](./media/fresh-relevance-tutorial/configuration.png "Configuration")

1. In the **SAML IdP Configuration** page, perform the following steps:

    ![Screenshot shows SAML IdP Configuration Page.](./media/fresh-relevance-tutorial/metadata.png "SAML Configuration")

    ![Screenshot shows the IdP Metadata XML.](./media/fresh-relevance-tutorial/mapping.png "Metadata XML")

    a. Copy **Entity ID** value, paste this value into the **Identifier (Entity ID)** text box in the **Basic SAML Configuration** section in the Azure portal.

    b. Copy **Assertion Consumer Service(ACS) URL** value, paste this value into the **Reply URL** text box in the **Basic SAML Configuration** section in the Azure portal.

    c. Copy **RelayState Value** and paste this value into the **Relay State** text box in the **Basic SAML Configuration** section in the Azure portal.

    d. Click **Download SP Metadata XML** and upload the metadata file in the **Basic SAML Configuration** section in the Azure portal.

    e. Copy **App Federation Metadata Url** from the Azure portal into Notepad and paste the content into the **IdP Metadata XML** textbox and click **Save** button.

    f. If successful, information such as the **Entity ID** of your IdP will be displayed in the **IdP Entity ID** textbox.

    g. In the **Attribute Mapping** section, fill the required fields manually which you have copied from the Azure portal.

    h. In the **General Configuration** section, enable **Allow Just In Time(JIT)Account Creation** and click **Save**.

    > [!NOTE]
    > If these parameters are not correctly mapped, login/account creation will not be successful and an error will be shown. To temporarily show enhanced attribute debugging information on sign-on failure, enable **Show Debugging Information** checkbox.

### Create Fresh Relevance test user

In this section, a user called Britta Simon is created in Fresh Relevance. Fresh Relevance supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in Fresh Relevance, a new one is created after authentication.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options.

* Click on Test this application in Azure portal and you should be automatically signed in to the Fresh Relevance for which you set up the SSO.

* You can use Microsoft My Apps. When you click the Fresh Relevance tile in the My Apps, you should be automatically signed in to the Fresh Relevance for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

Once you configure Fresh Relevance you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).

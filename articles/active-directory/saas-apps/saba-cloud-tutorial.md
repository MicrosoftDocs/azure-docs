---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with Saba Cloud | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Saba Cloud.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 06/18/2021
ms.author: jeedes

---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with Saba Cloud

In this tutorial, you'll learn how to integrate Saba Cloud with Azure Active Directory (Azure AD). When you integrate Saba Cloud with Azure AD, you can:

* Control in Azure AD who has access to Saba Cloud.
* Enable your users to be automatically signed-in to Saba Cloud with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Saba Cloud single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Saba Cloud supports **SP and IDP** initiated SSO.
* Saba Cloud supports **Just In Time** user provisioning.
* Saba Cloud Mobile application can now be configured with Azure AD for enabling SSO. In this tutorial, you configure and test Azure AD SSO in a test environment.

## Adding Saba Cloud from the gallery

To configure the integration of Saba Cloud into Azure AD, you need to add Saba Cloud from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Saba Cloud** in the search box.
1. Select **Saba Cloud** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD SSO for Saba Cloud

Configure and test Azure AD SSO with Saba Cloud using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Saba Cloud.

To configure and test Azure AD SSO with Saba Cloud, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Saba Cloud SSO](#configure-saba-cloud-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Saba Cloud test user](#create-saba-cloud-test-user)** - to have a counterpart of B.Simon in Saba Cloud that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.
1. **[Test SSO for Saba Cloud (mobile)](#test-sso-for-saba-cloud-mobile)** to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Saba Cloud** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, enter the values for the following fields:

    a. In the **Identifier** text box, type a URL using the following pattern (you'll get this value in the Configure Saba Cloud SSO section on step 6, but it usually is in the format of `<CUSTOMER_NAME>_sp`):
    `<CUSTOMER_NAME>_sp`

    b. In the **Reply URL** text box, type a URL using the following pattern (ENTITY_ID refers to the previous step, usually `<CUSTOMER_NAME>_sp`):
    `https://<CUSTOMER_NAME>.sabacloud.com/Saba/saml/SSO/alias/<ENTITY_ID>`
    
    > [!NOTE]
    > If you specify the reply URL incorrectly, you might have to adjust it in the **App Registration** section of Azure AD, not in the **Enterprise Application** section. Making changes to the **Basic SAML Configuration** section doesn't always update the Reply URL.

1. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    a. In the **Sign-on URL** text box, type a URL using the following pattern:
       `https://<CUSTOMER_NAME>.sabacloud.com`

    b. In the **Relay State** text box, type a URL using the following pattern: `IDP_INIT---SAML_SSO_SITE=<SITE_ID> `or in case SAML is configured for a microsite, type a URL using the following pattern:
       `IDP_INIT---SAML_SSO_SITE=<SITE_ID>---SAML_SSO_MICRO_SITE=<MicroSiteId>`

    > [!NOTE]
    > These values are not real. Update these values with the actual Identifier, Reply URL, Sign-on URL and Relay State. Contact [Saba Cloud Client support team](mailto:support@saba.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.
    > 
    > For more information about configuring the RelayState, see [IdP and SP initiated SSO for a microsite](https://help.sabacloud.com/sabacloud/help-system/topics/help-system-idp-and-sp-initiated-sso-for-a-microsite.html).

1. In the **User Attributes & Claims** section, adjust the Unique User Identifier to whatever you organization intends to use as the primary username for Saba users.

   This step is required only if you're attempting to convert from username/password to SSO. If this is a new Saba Cloud deployment that doesn't have existing users, you can skip this step.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

1. On the **Set up Saba Cloud** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Saba Cloud.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Saba Cloud**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Saba Cloud SSO

1. To automate the configuration within Saba Cloud, you need to install **My Apps Secure Sign-in browser extension** by clicking **Install the extension**.

	![My apps extension](common/install-myappssecure-extension.png)

1. After adding extension to the browser, click on **Set up Saba Cloud** will direct you to the Saba Cloud application. From there, provide the admin credentials to sign into Saba Cloud. The browser extension will automatically configure the application for you and automate steps 3-9.

	![Setup configuration](common/setup-sso.png)

1. If you want to setup Saba Cloud manually, in a different web browser window, sign in to your Saba Cloud company site as an administrator.

1. Click on **Menu** icon and click **Admin**, then select **System Admin** tab.

    ![screenshot for system admin](./media/saba-cloud-tutorial/system.png)

1. In **Configure System**, select **SAML SSO Setup** and click on **SETUP SAML SSO** button. 

    ![screenshot for configuration](./media/saba-cloud-tutorial/configure.png)

1. In the pop up window, select **Microsite** from the dropdown and click **ADD AND CONFIGURE**.

    ![screenshot for add site/microsite](./media/saba-cloud-tutorial/microsite.png)

1. In the **Configure IDP** section, click on **BROWSE** to upload the **Federation Metadata XML** file, which you have downloaded from the Azure portal. Enable the **Site Specific IDP** checkbox and click **IMPORT**.

    ![screenshot for Certificate import](./media/saba-cloud-tutorial/certificate.png) 

1. In the **Configure SP** section, copy the **Entity Alias** value and paste this value into the **Identifier (Entity ID)** text box in the **Basic SAML Configuration** section in the Azure portal. Click **GENERATE**.

    ![screenshot for Configure SP](./media/saba-cloud-tutorial/generate-metadata.png) 

1. In the **Configure Properties** section, verify the populated fields and click **SAVE**. 

    ![screenshot for Configure Properties](./media/saba-cloud-tutorial/configure-properties.png) 
    
    You might need to set **Max Authentication Age (in seconds)** to **7776000** (90 days) to match the default max rolling age Azure AD allows for a login. Failure to do so could result in the error `(109) Login failed. Please contact system administrator.`

### Create Saba Cloud test user

In this section, a user called Britta Simon is created in Saba Cloud. Saba Cloud supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in Saba Cloud, a new one is created after authentication.

> [!NOTE]
> For enabling SAML just in time user provisioning with Saba cloud, please refer to [this](https://help.sabacloud.com/sabacloud/help-system/topics/help-system-user-provisioning-with-saml.html) documentation.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application** in Azure portal. This will redirect to Saba Cloud Sign on URL where you can initiate the login flow.  

* Go to Saba Cloud Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application** in Azure portal and you should be automatically signed in to the Saba Cloud for which you set up the SSO 

You can also use Microsoft My Apps to test the application in any mode. When you click the Saba Cloud tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the Saba Cloud for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

> [!NOTE]
> If the sign-on URL is not populated in Azure AD then the application is treated as IDP initiated mode and if the sign-on URL is populated then Azure AD will always redirect the user to the Saba Cloud application for service provider initiated flow.

## Test SSO for Saba Cloud (mobile)

1. Open Saba Cloud Mobile application, give the **Site Name** in the textbox and click **Enter**.

    ![Screenshot for Site name.](./media/saba-cloud-tutorial/site-name.png)

1. Enter your **email address** and click **Next**.

    ![Screenshot for email address.](./media/saba-cloud-tutorial/email-address.png)

1. Finally after successful sign in, the application page will be displayed.

    ![Screenshot for successful sign in.](./media/saba-cloud-tutorial/dashboard.png)

## Next steps

Once you configure Saba Cloud you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-any-app).
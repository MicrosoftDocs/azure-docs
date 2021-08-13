---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with Adobe Identity Management | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Adobe Identity Management.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 01/15/2021
ms.author: jeedes

---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with Adobe Identity Management

In this tutorial, you'll learn how to integrate Adobe Identity Management with Azure Active Directory (Azure AD). When you integrate Adobe Identity Management with Azure AD, you can:

* Control in Azure AD who has access to Adobe Identity Management.
* Enable your users to be automatically signed-in to Adobe Identity Management with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Adobe Identity Management single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Adobe Identity Management supports **SP** initiated SSO
* Adobe Identity Management supports [**Automated** user provisioning and deprovisioning](adobe-provisioning-tutorial.md) (recommended).

## Adding Adobe Identity Management from the gallery

To configure the integration of Adobe Identity Management into Azure AD, you need to add Adobe Identity Management from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Adobe Identity Management** in the search box.
1. Select **Adobe Identity Management** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD SSO for Adobe Identity Management

Configure and test Azure AD SSO with Adobe Identity Management using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Adobe Identity Management.

To configure and test Azure AD SSO with Adobe Identity Management, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Adobe Identity Management SSO](#configure-adobe-identity-management-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Adobe Identity Management test user](#create-adobe-identity-management-test-user)** - to have a counterpart of B.Simon in Adobe Identity Management that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Adobe Identity Management** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, enter the values for the following fields:

	a. In the **Sign on URL** text box, type the URL:
    `https://adobe.com`

    b. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:
    `https://federatedid-na1.services.adobe.com/federated/saml/metadata/alias/<CUSTOM_ID>`

	> [!NOTE]
	> The Identifier value is not real. Update the value with the actual Identifier. Contact [Adobe Identity Management Client support team](mailto:identity@adobe.com) to get the value. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

1. On the **Set up Adobe Identity Management** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Adobe Identity Management.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Adobe Identity Management**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Adobe Identity Management SSO

1. To automate the configuration within Adobe Identity Management, you need to install **My Apps Secure Sign-in browser extension** by clicking **Install the extension**.

	![My apps extension](common/install-myappssecure-extension.png)

2. After adding extension to the browser, click on **Set up Adobe Identity Management** will direct you to the Adobe Identity Management application. From there, provide the admin credentials to sign into Adobe Identity Management. The browser extension will automatically configure the application for you and automate steps 3-8.

	![Setup configuration](common/setup-sso.png)

3. If you want to setup Adobe Identity Management manually, in a different web browser window, sign in to your Adobe Identity Management company site as an administrator.

4. Go to the **Settings** tab and click on **Create Directory**.

    ![Adobe Identity Management settings](./media/adobe-identity-management-tutorial/settings.png)

5. Give the directory name in the text box and select **Federated ID**, click on **Next**.

    ![Adobe Identity Management create directory](./media/adobe-identity-management-tutorial/create-directory.png)

6. Select the **Other SAML Providers** and click on **Next**.
 
    ![Adobe Identity Management saml providers](./media/adobe-identity-management-tutorial/saml-providers.png)

7. Click on **select** to upload the **Metadata XML** file which you have downloaded from the Azure portal.

    ![Adobe Identity Management saml configuration](./media/adobe-identity-management-tutorial/saml-configuration.png)

8. Click on **Done**.

### Create Adobe Identity Management test user

1. Go to the **Users** tab and click on **Add User**.

    ![Adobe Identity Management add user](./media/adobe-identity-management-tutorial/add-user.png)

2. In the **Enter user’s email address** textbox, give the **email address**.

    ![Adobe Identity Management save user](./media/adobe-identity-management-tutorial/save-user.png)

3. Click **Save**.

## Test SSO

In this section, you test your Azure AD single sign-on configuration with following options.

* Click on **Test this application** in Azure portal. This will redirect to Adobe Identity Management Sign-on URL where you can initiate the login flow.

* Go to Adobe Identity Management Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Adobe Identity Management tile in the My Apps, this will redirect to Adobe Identity Management Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure Adobe Identity Management you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-any-app).
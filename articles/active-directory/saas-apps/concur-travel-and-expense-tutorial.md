---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with Concur Travel and Expense | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Concur Travel and Expense.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 12/21/2020
ms.author: jeedes
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with Concur Travel and Expense

In this tutorial, you'll learn how to integrate Concur Travel and Expense with Azure Active Directory (Azure AD). When you integrate Concur Travel and Expense with Azure AD, you can:

* Control in Azure AD who has access to Concur Travel and Expense.
* Enable your users to be automatically signed-in to Concur Travel and Expense with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Concur Travel and Expense subscription.
* A "Company Administrator" role under your Concur user account. You can test if you have the right access by going to [Concur SSO Self-Service Tool](https://www.concursolutions.com/nui/authadmin/ssoadmin). If you do not have the access, please contact Concur support or implementation project manager. 

## Scenario description

In this tutorial, you configure and test Azure AD SSO.

* Concur Travel and Expense supports **IDP** and **SP** initiated SSO
* Concur Travel and Expense supports testing SSO in both production and implementation environment 

> [!NOTE]
> Identifier of this application is a fixed string value for each of the three regions: US, EMEA, and China. So only one instance can be configured for each region in one tenant. 

## Adding Concur Travel and Expense from the gallery

To configure the integration of Concur Travel and Expense into Azure AD, you need to add Concur Travel and Expense from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Concur Travel and Expense** in the search box.
1. Select **Concur Travel and Expense** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD SSO for Concur Travel and Expense

Configure and test Azure AD SSO with Concur Travel and Expense using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Concur Travel and Expense.

To configure and test Azure AD SSO with Concur Travel and Expense, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Concur Travel and Expense SSO](#configure-concur-travel-and-expense-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Concur Travel and Expense test user](#create-concur-travel-and-expense-test-user)** - to have a counterpart of B.Simon in Concur Travel and Expense that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Concur Travel and Expense** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section the application is pre-configured in **IDP** initiated mode and the necessary URLs are already pre-populated with Azure. The user needs to save the configuration by clicking the **Save** button.

    > [!NOTE]
    > Identifier (Entity ID) and Reply URL (Assertion Consumer Service URL) are region specific. Please select based on the datacenter of your Concur entity. If you do not know the datacenter of your Concur entity, please contact Concur support. 

5. On the **Set up Single Sign-On with SAML** page, click the edit/pen icon for **User Attribute** to edit the settings. The Unique User Identifier needs to match Concur user login_id. Usually, you should change **user.userprincipalname** to **user.mail**.

    ![Edit User Attribute](common/edit-attribute.png)

6. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Federation Metadata XML** and select **Download** to download the metadata and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Concur Travel and Expense.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Concur Travel and Expense**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Concur Travel and Expense SSO

1. To automate the configuration within Concur Travel and Expense, you need to install **My Apps Secure Sign-in browser extension** by clicking **Install the extension**.

	![My apps extension](common/install-myappssecure-extension.png)

2. After adding extension to the browser, click on **Set up Concur Travel and Expense** will direct you to the Concur Travel and Expense application. From there, provide the admin credentials to sign into Concur Travel and Expense. The browser extension will automatically configure the application for you and automate steps 3-7.

	![Setup configuration](common/setup-sso.png)

3. If you want to setup Concur Travel and Expense manually, in a different web browser window, you need to upload the downloaded **Federation Metadata XML** to [Concur SSO Self-Service Tool](https://www.concursolutions.com/nui/authadmin/ssoadmin) and sign in to your Concur Travel and Expense company site as an administrator.

1. Click **Add**.
1. Enter a custom name for your IdP, for example "Azure AD (US)". 
1. Click **Upload XML File** and attach **Federation Metadata XML** you downloaded previously.
1. Click **Add Metadata** to save the change.

    ![Concur SSO self-service tool screenshot](./media/concur-travel-and-expense-tutorial/add-metadata-concur-self-service-tool.png)

### Create Concur Travel and Expense test user

In this section, you create a user called B.Simon in Concur Travel and Expense. Work with Concur support team to add the users in the Concur Travel and Expense platform. Users must be created and activated before you use single sign-on. 

> [!NOTE]
> B.Simon's Concur login id needs to match B.Simon's unique identifier at Azure AD. For example, if B.Simon's Azure AD unique identifer is `B.Simon@contoso.com`. B.Simon's Concur login id needs to be `B.Simon@contoso.com` as well. 

## Configure Concur Mobile SSO
To enable Concur mobile SSO, you need to give Concur support team **User access URL**. Follow steps below to get **User access URL** from Azure AD:
1. Go to **Enterprise applications**
1. Click **Concur Travel and Expense**
1. Click **Properties**
1. Copy **User access URL** and give this URL to Concur support

> [!NOTE]
> Self-Service option to configure SSO is not available so work with Concur support team to enable mobile SSO. 

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options.

#### SP initiated:

* Click on **Test this application** in Azure portal. This will redirect to Concur Travel and Expense Sign on URL where you can initiate the login flow.

* Go to Concur Travel and Expense Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application** in Azure portal and you should be automatically signed in to the Concur Travel and Expense for which you set up the SSO

You can also use Microsoft My Apps to test the application in any mode. When you click the Concur Travel and Expense tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the Concur Travel and Expense for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure Concur Travel and Expense you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-any-app).
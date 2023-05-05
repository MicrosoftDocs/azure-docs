---
title: 'Tutorial: Azure Active Directory integration with Zscaler Private Access (ZPA)'
description: Learn how to configure single sign-on between Azure Active Directory and Zscaler Private Access (ZPA).
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

# Tutorial: Integrate Zscaler Private Access (ZPA) with Azure Active Directory

In this tutorial, you'll learn how to integrate Zscaler Private Access (ZPA) with Azure Active Directory (Azure AD). When you integrate Zscaler Private Access (ZPA) with Azure AD, you can:

* Control in Azure AD who has access to Zscaler Private Access (ZPA).
* Enable your users to be automatically signed-in to Zscaler Private Access (ZPA) with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Zscaler Private Access (ZPA) single sign-on (SSO) enabled subscription.

> [!NOTE]
> This integration is also available to use from Azure AD US Government Cloud environment. You can find this application in the Azure AD US Government Cloud Application Gallery and configure it in the same way as you do from public cloud.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment. 

* Zscaler Private Access (ZPA) supports **SP** initiated SSO.
* Zscaler Private Access (ZPA) supports [**Automated** user provisioning](zscaler-private-access-provisioning-tutorial.md).
> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Add Zscaler Private Access (ZPA) from the gallery

To configure the integration of Zscaler Private Access (ZPA) into Azure AD, you need to add Zscaler Private Access (ZPA) from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Zscaler Private Access (ZPA)** in the search box.
1. Select **Zscaler Private Access (ZPA)** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for Zscaler Private Access (ZPA)

Configure and test Azure AD SSO with Zscaler Private Access (ZPA) using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Zscaler Private Access (ZPA).

To configure and test Azure AD SSO with Zscaler Private Access (ZPA), perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Zscaler Private Access (ZPA) SSO](#configure-zscaler-private-access-zpa-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Zscaler Private Access (ZPA) test user](#create-zscaler-private-access-zpa-test-user)** - to have a counterpart of B.Simon in Zscaler Private Access (ZPA) that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Zscaler Private Access (ZPA)** application integration page, find the **Manage** section and select **Single sign-on**.
1. On the **Select a Single sign-on method** page, select **SAML**.
1. On the **Set up Single Sign-On with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** page, perform the following steps:

    1. In the **Identifier (Entity ID)** text box, type the URL:
    `https://samlsp.private.zscaler.com/auth/metadata`

    1. In the **Sign on URL** text box, type a URL using the following pattern:
    `https://samlsp.private.zscaler.com/auth/login?domain=<DOMAIN_NAME>`

	> [!NOTE]
	> The **Sign on URL** value is not real. Update the value with the actual Sign on URL. Contact [Zscaler Private Access (ZPA) Client support team](https://help.zscaler.com/zpa-submit-ticket) to get the value. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

   ![The Certificate download link](common/metadataxml.png)

1. On the **Set up Zscaler Private Access (ZPA)** section, copy the appropriate URL(s) based on your requirement.

   ![Copy configuration URLs](common/copy-configuration-urls.png)

### Create an Azure AD test user

In this section, you'll create a test user in the Azure portal called Britta Simon.

1. From the left pane in the Azure portal, select **Azure Active Directory**, select **Users**, and then select **All users**.
1. Select **New user** at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Name** field, enter `Britta Simon`.  
   1. In the **User name** field, enter the username@companydomain.extension. For example, `BrittaSimon@contoso.com`.
   1. Select the **Show password** check box, and then write down the value that's displayed in the **Password** box.
   1. Click **Create**.

### Assign the Azure AD test user

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Zscaler Private Access (ZPA).

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Zscaler Private Access (ZPA)**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Zscaler Private Access (ZPA) SSO

1. To automate the configuration within Zscaler Private Access (ZPA), you need to install **My Apps Secure Sign-in browser extension** by clicking **Install the extension**.

	![My apps extension](common/install-myappssecure-extension.png)

2. After adding extension to the browser, click on **Setup Zscaler Private Access (ZPA)** will direct you to the Zscaler Private Access (ZPA) application. From there, provide the admin credentials to sign into Zscaler Private Access (ZPA). The browser extension will automatically configure the application for you and automate steps 3-6.

	![Setup configuration](common/setup-sso.png)

3. If you want to setup Zscaler Private Access (ZPA) manually, open a new web browser window and sign into your Zscaler Private Access (ZPA) company site as an administrator and perform the following steps:

4. From the left side of menu, click **Administration** and navigate to **AUTHENTICATION** section click **IdP Configuration**.

	![Zscaler Private Access Administrator administration](./media/zscalerprivateaccess-tutorial/administration.png)

5. In the top right corner, click **Add IdP Configuration**. 

	![Zscaler Private Access Administrator idp](./media/zscalerprivateaccess-tutorial/metadata.png)

6. On the **Add IdP Configuration** page perform the following steps:
 
	![Zscaler Private Access Administrator select](./media/zscalerprivateaccess-tutorial/select.png)

	a. Click **Select File** to upload the downloaded Metadata file from Azure AD in the **IdP Metadata File Upload** field.

	b. It reads the **IdP metadata** from Azure AD and populates all the fields information as shown below.

	![Zscaler Private Access Administrator config](./media/zscalerprivateaccess-tutorial/configure.png)

	c. Select your domain from **Domains** field.
	
	d. Click **Save**.

### Create Zscaler Private Access (ZPA) test user

In this section, you create a user called Britta Simon in Zscaler Private Access (ZPA). Please work with [Zscaler Private Access (ZPA) support team](https://help.zscaler.com/zpa-submit-ticket) to add the users in the Zscaler Private Access (ZPA) platform.

Zscaler Private Access (ZPA) also supports automatic user provisioning, you can find more details [here](zscaler-private-access-provisioning-tutorial.md) on how to configure automatic user provisioning.

## Test SSO

In this section, you test your Azure AD single sign-on configuration with following options. 

* Click on **Test this application** in Azure portal. This will redirect to Zscaler Private Access (ZPA) Sign-on URL where you can initiate the login flow. 

* Go to Zscaler Private Access (ZPA) Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Zscaler Private Access (ZPA) tile in the My Apps, this will redirect to Zscaler Private Access (ZPA) Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

Once you configure Zscaler Private Access (ZPA) you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-any-app).

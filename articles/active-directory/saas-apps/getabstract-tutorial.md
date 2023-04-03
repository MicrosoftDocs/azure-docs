---
title: 'Tutorial: Azure Active Directory integration with Getabstract'
description: Learn how to configure single sign-on between Azure Active Directory and Getabstract.
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
# Tutorial: Azure Active Directory integration with Getabstract

In this tutorial, you'll learn how to integrate Getabstract with Azure Active Directory (Azure AD). When you integrate Getabstract with Azure AD, you can:

* Control in Azure AD who has access to Getabstract.
* Enable your users to be automatically signed-in to Getabstract with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Getabstract single sign-on (SSO) enabled subscription.

> [!NOTE]
> This integration is also available to use from Azure AD US Government Cloud environment. You can find this application in the Azure AD US Government Cloud Application Gallery and configure it in the same way as you do from public cloud.

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Getabstract supports **SP and IDP** initiated SSO.

* Getabstract supports **Just In Time** user provisioning.

* Getabstract supports [Automated user provisioning](getabstract-provisioning-tutorial.md).

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Add Getabstract from the gallery

To configure the integration of Getabstract into Azure AD, you need to add Getabstract from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Getabstract** in the search box.
1. Select **Getabstract** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for Getabstract

Configure and test Azure AD SSO with Getabstract using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Getabstract.

To configure and test Azure AD SSO with Getabstract, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
	1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
	1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
2. **[Configure Getabstract SSO](#configure-getabstract-sso)** - to configure the Single Sign-On settings on application side.
	1. **[Create Getabstract test user](#create-getabstract-test-user)** - to have a counterpart of Britta Simon in Getabstract that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Getabstract** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, If you wish to configure the application in **IDP** initiated mode, perform the following steps:

    a. In the **Identifier** text box, type the URL:

    For Stage/pre_production: `https://int.getabstract.com`

	For Production: `https://www.getabstract.com`

	b. In the **Reply URL** textbox, type the URL:
	
	For Stage/pre_production: `https://int.getabstract.com/ACS.do`
	
	For Production: `https://www.getabstract.com/ACS.do`

5. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:
    
    In the **Sign-on URL** textbox, type a URL using the following pattern:

    For Stage/pre_production: `https://int.getabstract.com/portal/<org_username>`
	
	For Production: `https://www.getabstract.com/portal/<org_username>`

	> [!NOTE] 
	> This value is not real. Update this value with the actual Sign-On URL. Contact [Getabstract Client support team](https://www.getabstract.com/en/contact) to get this value. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

4. On the **Set-up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

6. On the **Set up Getabstract** section, copy the appropriate URL(s) as per your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Getabstract.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Getabstract**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Getabstract SSO

To configure single sign-on on **Getabstract** side, you need to send the downloaded **Federation Metadata XML** and appropriate copied URLs from Azure portal to [Getabstract support team](https://www.getabstract.com/en/contact). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Getabstract test user

In this section, a user called Britta Simon is created in Getabstract. Getabstract supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in Getabstract, a new one is created after authentication.

>[!Note]
>Getabstract also supports automatic user provisioning, you can find more details [here](./getabstract-provisioning-tutorial.md) on how to configure automatic user provisioning.

### Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options.

#### SP initiated:

* Click on Test this application in Azure portal. This will redirect to Getabstract Sign on URL where you can initiate the login flow.

* Go to Getabstract Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on Test this application in Azure portal and you should be automatically signed in to the Getabstract for which you set up the SSO

You can also use Microsoft My Apps to test the application in any mode. When you click the Getabstract tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the Getabstract for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).


## Next steps

Once you configure Getabstract you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).

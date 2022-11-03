---
title: 'Tutorial: Azure AD SSO integration with Virtual Risk Manager - USA'
description: Learn how to configure single sign-on between Azure Active Directory and Virtual Risk Manager - USA.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 11/15/2021
ms.author: jeedes

---

# Tutorial: Azure AD SSO integration with Virtual Risk Manager - USA

In this tutorial, you'll learn how to integrate Virtual Risk Manager - USA with Azure Active Directory (Azure AD). When you integrate Virtual Risk Manager - USA with Azure AD, you can:

* Control in Azure AD who has access to Virtual Risk Manager - USA.
* Enable your users to be automatically signed-in to Virtual Risk Manager - USA with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Virtual Risk Manager - USA single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Virtual Risk Manager - USA supports **IDP** initiated SSO.

* Virtual Risk Manager - USA supports **Just In Time** user provisioning.

## Add Virtual Risk Manager - USA from the gallery

To configure the integration of Virtual Risk Manager - USA into Azure AD, you need to add Virtual Risk Manager - USA from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Virtual Risk Manager - USA** in the search box.
1. Select **Virtual Risk Manager - USA** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for Virtual Risk Manager - USA

Configure and test Azure AD SSO with Virtual Risk Manager - USA using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Virtual Risk Manager - USA.

To configure and test Azure AD SSO with Virtual Risk Manager - USA, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Virtual Risk Manager - USA SSO](#configure-virtual-risk-manager---usa-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Virtual Risk Manager - USA test user](#create-virtual-risk-manager---usa-test-user)** - to have a counterpart of B.Simon in Virtual Risk Manager - USA that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Virtual Risk Manager - USA** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section the application is pre-configured in **IDP** initiated mode and the necessary URLs are already pre-populated with Azure. The user needs to save the configuration by clicking the **Save** button.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Virtual Risk Manager - USA.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Virtual Risk Manager - USA**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Virtual Risk Manager - USA SSO

To configure single sign-on on **Virtual Risk Manager - USA** side, you need to send the **App Federation Metadata Url** to [Virtual Risk Manager - USA support team](mailto:globalsupport@edriving.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Virtual Risk Manager - USA test user

In this section, a user called Britta Simon is created in Virtual Risk Manager - USA. Virtual Risk Manager - USA supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in Virtual Risk Manager - USA, a new one is created after authentication.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options.

* Click on Test this application in Azure portal and you should be automatically signed in to the Virtual Risk Manager - USA for which you set up the SSO.

* You can use Microsoft My Apps. When you click the Virtual Risk Manager - USA tile in the My Apps, you should be automatically signed in to the Virtual Risk Manager - USA for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure Virtual Risk Manager - USA you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).
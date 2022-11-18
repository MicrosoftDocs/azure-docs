---
title: 'Tutorial: Azure AD SSO integration with EAComposer'
description: Learn how to configure single sign-on between Azure Active Directory and EAComposer.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 11/18/2021
ms.author: jeedes

---

# Tutorial: Azure AD SSO integration with EAComposer

In this tutorial, you'll learn how to integrate EAComposer with Azure Active Directory (Azure AD). When you integrate EAComposer with Azure AD, you can:

* Control in Azure AD who has access to EAComposer.
* Enable your users to be automatically signed-in to EAComposer with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* EAComposer single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* EAComposer supports **SP** initiated SSO.
* EAComposer supports **Just In Time** user provisioning.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Add EAComposer from the gallery

To configure the integration of EAComposer into Azure AD, you need to add EAComposer from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **EAComposer** in the search box.
1. Select **EAComposer** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for EAComposer

Configure and test Azure AD SSO with EAComposer using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in EAComposer.

To configure and test Azure AD SSO with EAComposer, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure EAComposer SSO](#configure-eacomposer-sso)** - to configure the single sign-on settings on application side.
    1. **[Create EAComposer test user](#create-eacomposer-test-user)** - to have a counterpart of B.Simon in EAComposer that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **EAComposer** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, perform the following step:

    In the **Sign-on URL** text box, type the URL:
    `https://www.eacomposer.com/solution/login.aspx`

1. In the **SAML Signing Certificate** section, click **Edit** button to open **SAML Signing Certificate** dialog.

	![Edit SAML Signing Certificate](common/edit-certificate.png)

1. In the **SAML Signing Certificate** section, copy the **Thumbprint Value** and save it on your computer.

    ![Copy Thumbprint value](common/copy-thumbprint.png)

1. On the **Set up EAComposer** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to EAComposer.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **EAComposer**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure EAComposer SSO

To configure single sign-on on **EAComposer** side, you need to send the **Thumbprint Value** and appropriate copied URLs from Azure portal to [EAComposer support team](mailto:support@eacomposer.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create EAComposer test user

In this section, a user called Britta Simon is created in EAComposer. EAComposer supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in EAComposer, a new one is created after authentication.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

* Click on **Test this application** in Azure portal. This will redirect to EAComposer Sign-on URL where you can initiate the login flow. 

* Go to EAComposer Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the EAComposer tile in the My Apps, this will redirect to EAComposer Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure EAComposer you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).
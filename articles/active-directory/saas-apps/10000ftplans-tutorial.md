---
title: 'Tutorial: Azure AD SSO integration with 10,000ft Plans'
description: Learn how to configure single sign-on between Azure Active Directory and 10,000ft Plans.
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
# Tutorial: Azure AD SSO integration with 10,000ft Plans

In this tutorial, you'll learn how to integrate 10,000ft Plans with Azure Active Directory (Azure AD). When you integrate 10,000ft Plans with Azure AD, you can:

* Control in Azure AD who has access to 10,000ft Plans.
* Enable your users to be automatically signed-in to 10,000ft Plans with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To configure Azure AD integration with 10,000ft Plans, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get a [free account](https://azure.microsoft.com/free/).
* 10,000ft Plans single sign-on enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* 10,000ft Plans support **SP** initiated SSO.
* 10,000ft Plans support **Just In Time** user provisioning.

## Add 10,000ft Plans from the gallery

To configure the integration of 10,000ft Plans into Azure AD, you need to add 10,000ft Plans from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **10,000ft Plans** in the search box.
1. Select **10,000ft Plans** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for 10,000ft Plans

Configure and test Azure AD SSO with 10,000ft Plans using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in 10,000ft Plans.

To configure and test Azure AD SSO with 10,000ft Plans, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure 10,000ft Plans SSO](#configure-10000ft-plans-sso)** - to configure the single sign-on settings on application side.
    1. **[Create 10,000ft Plans test user](#create-10000ft-plans-test-user)** - to have a counterpart of B.Simon in 10,000ft Plans that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **10,000ft Plans** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, perform the following steps:

	a. In the **Identifier (Entity ID)** text box, type the URL:
    `https://rm.smartsheet.com/saml/metadata`

    b. In the **Reply URL** text box, type the URL:
    `https://rm.smartsheet.com/saml/acs`
    
    c. In the **Sign-on URL** text box, type the URL:
    ` https://rm.smartsheet.com`

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section, select the copy icon to copy **App Federation Metadata Url**. Save it on your computer.

	![Screenshot of SAML Signing Certificate, with copy icon highlighted](common/copy-metadataurl.png)

### Create an Azure AD test user

In this section, you'll create a test user in the Azure portal called B.Simon.

1.In the Azure portal, in the **Azure services** pane, select **Users**, and then select **All users**.
1. Select **New user** at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Name** field, enter `B.Simon`.  
   1. In the **User name** field, enter the username@companydomain.extension. For example, `B.Simon@contoso.com`.
   1. Select the **Show password** check box, and then write down the value that's displayed in the **Password** box.
   1. Click **Create**.

### Assign the Azure AD test user

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to 10,000ft Plans.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **10,000ft Plans**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user/group**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure 10000ft Plans SSO

1. Sign in to your 10000ft Plans website as an administrator.

1. Click **Settings** and select **Account Settings** from the dropdown.

    ![Screenshot for Settings icon.](./media/10000ftplans-tutorial/settings.png)

1. Click **SSO** at the left menu and perform the following steps:

    ![Screenshot for Settings SSO page.](./media/10000ftplans-tutorial/setup-sso.png)

    a. Select **Automatic Configuration** in the Setup SSO section.

    b. In the **IdP Metadata URL** text box, enter the **App Federation Metadata Url** value which you have copied from the Azure portal.

    c. Enable the **Auto-provision authenticated users not in account** checkbox.

    d. Click **Save**.

### Create 10000ft Plans test user

In this section, a user called Britta Simon is created in 10,000ft Plans. 10,000ft Plans supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in 10,000ft Plans, a new one is created after authentication.

## Test SSO

In this section, you test your Azure AD single sign-on configuration with following options. 

* Click on **Test this application** in Azure portal. This will redirect to 10,000ft Plans Sign on URL where you can initiate the login flow. 

* Go to 10,000ft Plans Sign on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the 10,000ft Plans tile in the My Apps, this will redirect to 10,000ft Plans Sign on URL. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

Once you configure 10,000ft Plans you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-any-app).

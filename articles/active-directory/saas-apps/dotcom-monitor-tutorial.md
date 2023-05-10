---
title: "Tutorial: Azure Active Directory single sign-on (SSO) integration with Dotcom-Monitor"
description: Learn how to configure single sign-on between Azure Active Directory and Dotcom-Monitor.
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

# Tutorial: Azure Active Directory single sign-on (SSO) integration with Dotcom-Monitor

In this tutorial, you'll learn how to integrate Dotcom-Monitor with Azure Active Directory (Azure AD). When you integrate Dotcom-Monitor with Azure AD, you can:

- Control in Azure AD who has access to Dotcom-Monitor.
- Enable your users to be automatically signed-in to Dotcom-Monitor with their Azure AD accounts.
- Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

- An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
- Dotcom-Monitor single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

- Dotcom-Monitor supports **SP** initiated SSO

- Dotcom-Monitor supports **Just In Time** user provisioning

## Adding Dotcom-Monitor from the gallery

To configure the integration of Dotcom-Monitor into Azure AD, you need to add Dotcom-Monitor from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Dotcom-Monitor** in the search box.
1. Select **Dotcom-Monitor** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for Dotcom-Monitor

Configure and test Azure AD SSO with Dotcom-Monitor using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Dotcom-Monitor.

To configure and test Azure AD SSO with Dotcom-Monitor, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
   1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
   1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Dotcom Monitor SSO](#configure-dotcom-monitor-sso)** - to configure the single sign-on settings on application side.
   1. **[Create Dotcom Monitor test user](#create-dotcom-monitor-test-user)** - to have a counterpart of B.Simon in Dotcom-Monitor that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Dotcom-Monitor** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, enter the values for the following fields:

   In the **Sign-on URL** text box, type a URL using the following pattern:
   `https://userauth.dotcom-monitor.com/Login.ashx?cidp=<CUSTOM_GUID>`

   > [!NOTE]
   > The value is not real. Update the value with the actual Sign-On URL. Contact [Dotcom-Monitor Client support team](mailto:vadimm@dana-net.com) to get the value. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. Dotcom-Monitor application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

   ![image](common/default-attributes.png)

1. In addition to above, Dotcom-Monitor application expects few more attributes to be passed back in SAML response which are shown below. These attributes are also pre populated but you can review them as per your requirements.

   | Name  | Source Attribute   |
   | ----- | ------------------ |
   | Roles | user.assignedroles |

   > [!NOTE]
   > You can find more guidance [here](../develop/howto-add-app-roles-in-azure-ad-apps.md#app-roles-ui) on how to create custom roles in Azure AD.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section, find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

   ![The Certificate download link](common/metadataxml.png)

1. On the **Set up Dotcom-Monitor** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Dotcom-Monitor.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Dotcom-Monitor**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you have setup the roles as explained in the above, you can select it from the **Select a role** dropdown.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Dotcom-Monitor SSO

To configure single sign-on on **Dotcom-Monitor** side, you need to send the downloaded **Federation Metadata XML** and appropriate copied URLs from Azure portal to [Dotcom-Monitor support team](mailto:vadimm@dana-net.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Dotcom-Monitor test user

In this section, a user called B.Simon is created in Dotcom-Monitor. Dotcom-Monitor supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in Dotcom-Monitor, a new one is created after authentication.

## Test SSO

In this section, you test your Azure AD single sign-on configuration with following options.

- Click on **Test this application** in Azure portal. This will redirect to Dotcom-Monitor Sign-on URL where you can initiate the login flow.

- Go to Dotcom-Monitor Sign-on URL directly and initiate the login flow from there.

- You can use Microsoft My Apps. When you click the Dotcom-Monitor tile in the My Apps, this will redirect to Dotcom-Monitor Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

Once you configure Dotcom-Monitor you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-any-app).

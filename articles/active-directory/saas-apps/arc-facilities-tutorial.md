---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with ARC Facilities'
description: Learn how to configure single sign-on between Azure Active Directory and ARC Facilities.
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

# Tutorial: Azure Active Directory single sign-on (SSO) integration with ARC Facilities

In this tutorial, you'll learn how to integrate ARC Facilities with Azure Active Directory (Azure AD). When you integrate ARC Facilities with Azure AD, you can:

* Control in Azure AD who has access to ARC Facilities.
* Enable your users to be automatically signed-in to ARC Facilities with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.


## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* ARC Facilities single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* ARC Facilities supports **IDP** initiated SSO

* ARC Facilities supports **Just In Time** user provisioning

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Adding ARC Facilities from the gallery

To configure the integration of ARC Facilities into Azure AD, you need to add ARC Facilities from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **ARC Facilities** in the search box.
1. Select **ARC Facilities** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD single sign-on for ARC Facilities

Configure and test Azure AD SSO with ARC Facilities using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in ARC Facilities.

To configure and test Azure AD SSO with ARC Facilities, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure ARC Facilities SSO](#configure-arc-facilities-sso)** - to configure the single sign-on settings on application side.
    1. **[Create ARC Facilities test user](#create-arc-facilities-test-user)** - to have a counterpart of B.Simon in ARC Facilities that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **ARC Facilities** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, the application is pre-configured and the necessary URLs are already pre-populated with Azure. The user needs to save the configuration by clicking the **Save** button.

1. ARC Facilities application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes. Click **Edit** icon to open User Attributes dialog.

	![Screenshot shows the User Attributes dialog box with the Edit icon called out.](common/edit-attribute.png)

1. In addition to above, ARC Facilities application expects few more attributes to be passed back in SAML response. In the **User Attributes & Claims** section on the **Group Claims (Preview)** dialog, perform the following steps:

	a. Click the **pen** next to **Groups returned in claim**.

	![Screenshot shows User Attributes & Claims with the pen next to Groups returned in claim called out.](./media/arc-facilities-tutorial/config01.png)

	![Screenshot shows Group Claims with All groups and Group I D selected and the Save button called out.](./media/arc-facilities-tutorial/config02.png)

	b. Select **All Groups** from the radio list.

	c. Select **Source Attribute** of **Group ID**.

	d. Click **Save**.

    > [!NOTE]
    > ARC Facilities expects roles for users assigned to the application. Please set up these roles in Azure AD so that users can be assigned the appropriate roles. To understand how to configure roles in Azure AD, see [here](../develop/howto-add-app-roles-in-azure-ad-apps.md#app-roles-ui).

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. On the **Set up ARC Facilities** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to ARC Facilities.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **ARC Facilities**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure ARC Facilities SSO

To configure single sign-on on **ARC Facilities** side, you need to send the downloaded **Certificate (Base64)** and appropriate copied URLs from Azure portal to [ARC Facilities support team](mailto:support@arcfacilities.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create ARC Facilities test user

In this section, a user called Britta Simon is created in ARC Facilities. ARC Facilities supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in ARC Facilities, a new one is created after authentication.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options.

* Click on Test this application in Azure portal and you should be automatically signed in to the ARC Facilities for which you set up the SSO

* You can use Microsoft My Apps. When you click the ARC Facilities tile in the My Apps, you should be automatically signed in to the ARC Facilities for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).


## Next steps

Once you configure ARC Facilities you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-any-app).

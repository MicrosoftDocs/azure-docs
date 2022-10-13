---
title: 'Tutorial: Azure AD SSO integration with Blue Ocean Brain'
description: Learn how to configure single sign-on between Azure Active Directory and Blue Ocean Brain.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 12/30/2021
ms.author: jeedes

---

# Tutorial: Azure AD SSO integration with Blue Ocean Brain

In this tutorial, you'll learn how to integrate Blue Ocean Brain with Azure Active Directory (Azure AD). When you integrate Blue Ocean Brain with Azure AD, you can:

* Control in Azure AD who has access to Blue Ocean Brain.
* Enable your users to be automatically signed-in to Blue Ocean Brain with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Blue Ocean Brain single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Blue Ocean Brain supports **SP and IDP** initiated SSO.
* Blue Ocean Brain supports **Just In Time** user provisioning.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Add Blue Ocean Brain from the gallery

To configure the integration of Blue Ocean Brain into Azure AD, you need to add Blue Ocean Brain from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Blue Ocean Brain** in the search box.
1. Select **Blue Ocean Brain** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for Blue Ocean Brain

Configure and test Azure AD SSO with Blue Ocean Brain using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Blue Ocean Brain.

To configure and test Azure AD SSO with Blue Ocean Brain, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Blue Ocean Brain SSO](#configure-blue-ocean-brain-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Blue Ocean Brain test user](#create-blue-ocean-brain-test-user)** - to have a counterpart of B.Simon in Blue Ocean Brain that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Blue Ocean Brain** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier** text box, type the URL:
    `https://www3.blueoceanbrain.com`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://www3.blueoceanbrain.com/c/<friendly id>/saml/acs`

    c. In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://www3.blueoceanbrain.com/c/<friendly id>/login`

	> [!NOTE]
	> These values are not real. Update these values with the actual Reply URL and Sign-on URL. Contact [Blue Ocean Brain Client support team](mailto:support@blueoceanbrain.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. Blue Ocean Brain application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

	![image](common/default-attributes.png)

1. In addition to above, Blue Ocean Brain application expects few more attributes to be passed back in SAML response which are shown below. These attributes are also pre populated but you can review them as per your requirements.
	
	| Name | Source Attribute |
	| ----------| --------- |
	| FirstName | user.givenname |
    | LastName | user.surname |
    | Email | user.mail |

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Blue Ocean Brain.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Blue Ocean Brain**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Blue Ocean Brain SSO

To configure single sign-on on **Blue Ocean Brain** side, you need to send the **App Federation Metadata Url** to [Blue Ocean Brain support team](mailto:support@blueoceanbrain.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Blue Ocean Brain test user

In this section, a user called Britta Simon is created in Blue Ocean Brain. Blue Ocean Brain supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in Blue Ocean Brain, a new one is created after authentication.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

#### SP initiated:

* Click on **Test this application** in Azure portal. This will redirect to Blue Ocean Brain Sign on URL where you can initiate the login flow.  

* Go to Blue Ocean Brain Sign-on URL directly and initiate the login flow from there.

#### IDP initiated:

* Click on **Test this application** in Azure portal and you should be automatically signed in to the Blue Ocean Brain for which you set up the SSO. 

You can also use Microsoft My Apps to test the application in any mode. When you click the Blue Ocean Brain tile in the My Apps, if configured in SP mode you would be redirected to the application sign on page for initiating the login flow and if configured in IDP mode, you should be automatically signed in to the Blue Ocean Brain for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure Blue Ocean Brain you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).
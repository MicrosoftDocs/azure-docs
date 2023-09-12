---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with Collaborative Innovation'
description: Learn how to configure single sign-on between Azure Active Directory and Collaborative Innovation.
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

# Tutorial: Azure Active Directory single sign-on (SSO) integration with Collaborative Innovation

In this tutorial, you'll learn how to integrate Collaborative Innovation with Azure Active Directory (Azure AD). When you integrate Collaborative Innovation with Azure AD, you can:

* Control in Azure AD who has access to Collaborative Innovation.
* Enable your users to be automatically signed-in to Collaborative Innovation with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Collaborative Innovation single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Collaborative Innovation supports **SP** initiated SSO


* Collaborative Innovation supports **Just In Time** user provisioning

## Adding Collaborative Innovation from the gallery

To configure the integration of Collaborative Innovation into Azure AD, you need to add Collaborative Innovation from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Collaborative Innovation** in the search box.
1. Select **Collaborative Innovation** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)


## Configure and test Azure AD single sign-on for Collaborative Innovation

Configure and test Azure AD SSO with Collaborative Innovation using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Collaborative Innovation.

To configure and test Azure AD SSO with Collaborative Innovation, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Collaborative Innovation SSO](#configure-collaborative-innovation-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Collaborative Innovation test user](#create-collaborative-innovation-test-user)** - to have a counterpart of B.Simon in Collaborative Innovation that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **Collaborative Innovation** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, enter the values for the following fields:

	a. In the **Sign on URL** text box, type a URL using the following pattern:
    `https://<instancename>.foundry.<companyname>.com/`

    b. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:
    `https://<instancename>.foundry.<companyname>.com`

	> [!NOTE]
	> These values are not real. Update these values with the actual Sign on URL and Identifier. Contact [Collaborative Innovation Client support team](https://www.unilever.com/contact/) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. Collaborative Innovation application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

	![image](common/edit-attribute.png)

1. In addition to above, Collaborative Innovation application expects few more attributes to be passed back in SAML response which are shown below. These attributes are also pre populated but you can review them as per your requirement.

	| Name | Source Attribute|
	| ---------------| --------------- |
	| givenname | user.givenname |
	| surname | user.surname |
	| emailaddress | user.userprincipalname |
	| name | user.userprincipalname |

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

1. On the **Set up Collaborative Innovation** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Collaborative Innovation.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Collaborative Innovation**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Collaborative Innovation SSO

To configure single sign-on on **Collaborative Innovation** side, you need to send the downloaded **Federation Metadata XML** and appropriate copied URLs from Azure portal to [Collaborative Innovation support team](https://www.unilever.com/contact/). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Collaborative Innovation test user

In this section, a user called B.Simon is created in Collaborative Innovation. Collaborative Innovation supports just-in-time provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in Collaborative Innovation, a new one is created when you attempt to access Collaborative Innovation.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Collaborative Innovation tile in the Access Panel, you should be automatically signed in to the Collaborative Innovation for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Additional resources

- [ List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory ](./tutorial-list.md)

- [What is application access and single sign-on with Azure Active Directory? ](../manage-apps/what-is-single-sign-on.md)

- [What is Conditional Access in Azure Active Directory?](../conditional-access/overview.md)


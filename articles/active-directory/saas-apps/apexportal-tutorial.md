---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with Apex Portal | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Apex Portal.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: db204a46-6460-4ace-bdbb-4353846723ad
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: tutorial
ms.date: 01/03/2020
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with Apex Portal

In this tutorial, you'll learn how to integrate Apex Portal with Azure Active Directory (Azure AD). When you integrate Apex Portal with Azure AD, you can:

* Control in Azure AD who has access to Apex Portal.
* Enable your users to be automatically signed-in to Apex Portal with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Apex Portal single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Apex Portal supports **IDP** initiated SSO
* Apex Portal supports **Just In Time** user provisioning

## Adding Apex Portal from the gallery

To configure the integration of Apex Portal into Azure AD, you need to add Apex Portal from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Apex Portal** in the search box.
1. Select **Apex Portal** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD single sign-on for Apex Portal

Configure and test Azure AD SSO with Apex Portal using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Apex Portal.

To configure and test Azure AD SSO with Apex Portal, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    * **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    * **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Apex Portal SSO](#configure-apex-portal-sso)** - to configure the single sign-on settings on application side.
    * **[Create Apex Portal test user](#create-apex-portal-test-user)** - to have a counterpart of B.Simon in Apex Portal that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **Apex Portal** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Set up single sign-on with SAML** page, enter the values for the following fields:

    a. In the **Identifier** text box, type a URL using the following pattern:
    `https://<customer name>.apexanalytix.com/saml/sso.aspx`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://<customer name>.apexanalytix.com/saml/sso.aspx`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier and Reply URL. Contact [Apex Portal Client support team](mailto:support@apexanalytix.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. Apex Portal application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

	![image](common/default-attributes.png)

1. In addition to above, Apex Portal application expects few more attributes to be passed back in SAML response which are shown below. These attributes are also pre populated but you can review them as per your requirements.

	| Name | Source Attribute|
	| -------- | --------- |
	| FIRSTNAME | user.givenname |
	| LASTNAME | user.surname |
	| MAIL | user.mail |
	| | |

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

1. On the **Set up Apex Portal** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Apex Portal.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Apex Portal**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Apex Portal SSO

To configure single sign-on on **Apex Portal** side, you need to send the downloaded **Federation Metadata XML** and appropriate copied URLs from Azure portal to [Apex Portal support team](mailto:support@apexanalytix.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Apex Portal test user

In this section, a user called Britta Simon is created in Apex Portal. Apex Portal supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in Apex Portal, a new one is created after authentication.

> [!NOTE]
> If you need to create a user manually, you need to contact the [Apex Portal support team](mailto:support@apexanalytix.com).

## Test SSO 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Apex Portal tile in the Access Panel, you should be automatically signed in to the Apex Portal for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [ List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory ](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory? ](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [Try Apex Portal with Azure AD](https://aad.portal.azure.com/)


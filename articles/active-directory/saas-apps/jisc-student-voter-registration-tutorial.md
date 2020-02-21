---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with Jisc Student Voter Registration | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Jisc Student Voter Registration.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: a95d016d-ec53-4b3c-9a51-e0cac0791e49
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 11/26/2019
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with Jisc Student Voter Registration

In this tutorial, you'll learn how to integrate Jisc Student Voter Registration with Azure Active Directory (Azure AD). When you integrate Jisc Student Voter Registration with Azure AD, you can:

* Control in Azure AD who has access to Jisc Student Voter Registration.
* Enable your users to be automatically signed-in to Jisc Student Voter Registration with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Jisc Student Voter Registration single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Jisc Student Voter Registration supports **SP** initiated SSO
* Jisc Student Voter Registration supports **Just In Time** user provisioning

## Adding Jisc Student Voter Registration from the gallery

To configure the integration of Jisc Student Voter Registration into Azure AD, you need to add Jisc Student Voter Registration from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Jisc Student Voter Registration** in the search box.
1. Select **Jisc Student Voter Registration** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD single sign-on for Jisc Student Voter Registration

Configure and test Azure AD SSO with Jisc Student Voter Registration using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Jisc Student Voter Registration.

To configure and test Azure AD SSO with Jisc Student Voter Registration, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    * **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    * **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Jisc Student Voter Registration SSO](#configure-jisc-student-voter-registration-sso)** - to configure the single sign-on settings on application side.
    * **[Create Jisc Student Voter Registration test user](#create-jisc-student-voter-registration-test-user)** - to have a counterpart of B.Simon in Jisc Student Voter Registration that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **Jisc Student Voter Registration** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, enter the values for the following field:

    In the **Sign-on URL** text box, type a URL:
    `https://www.studentvoterregistration.ac.uk/consent`

1. Jisc Student Voter Registration application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes.

	![image](common/default-attributes.png)

1. In addition to above, Jisc Student Voter Registration application expects few more attributes to be passed back in SAML response which are shown below. These attributes are also pre populated but you can review them as per your requirements.

	| Name |  Source Attribute|
	| ---------|  --------- |
	| postalcode | user.postalcode |
	| Unique User Identifier | user.objectid |

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

1. On the **Set up Jisc Student Voter Registration** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Jisc Student Voter Registration.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Jisc Student Voter Registration**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Jisc Student Voter Registration SSO

To configure single sign-on on **Jisc Student Voter Registration** side, you need to send the downloaded **Federation Metadata XML** and appropriate copied URLs from Azure portal to [Jisc Student Voter Registration support team](mailto:studentvote@jisc.ac.uk). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Jisc Student Voter Registration test user

In this section, a user called B.Simon is created in Jisc Student Voter Registration. Jisc Student Voter Registration supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in Jisc Student Voter Registration, a new one is created after authentication.

## Test SSO

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Jisc Student Voter Registration tile in the Access Panel, you should be automatically signed in to the Jisc Student Voter Registration for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [ List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory ](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory? ](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [Try Jisc Student Voter Registration with Azure AD](https://aad.portal.azure.com/)
---
title: 'Tutorial: Azure Active Directory integration with Otsuka Shokai | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Otsuka Shokai.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: celested

ms.assetid: c04bb636-a3c7-4940-9b36-810425b855d1
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 06/14/2019
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Integrate Otsuka Shokai with Azure Active Directory

In this tutorial, you'll learn how to integrate Otsuka Shokai with Azure Active Directory (Azure AD). When you integrate Otsuka Shokai with Azure AD, you can:

* Control in Azure AD who has access to Otsuka Shokai.
* Enable your users to be automatically signed-in to Otsuka Shokai with their Azure AD accounts.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Otsuka Shokai single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment. Otsuka Shokai supports **IDP** initiated SSO.

## Adding Otsuka Shokai from the gallery

To configure the integration of Otsuka Shokai into Azure AD, you need to add Otsuka Shokai from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Otsuka Shokai** in the search box.
1. Select **Otsuka Shokai** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.
1. Click on **Properties** tab, copy the **Application ID** and save it on your computer for subsequent use.

## Configure and test Azure AD single sign-on

Configure and test Azure AD SSO with Otsuka Shokai using a test user called **B. Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Otsuka Shokai.

To configure and test Azure AD SSO with Otsuka Shokai, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** to enable your users to use this feature.
2. **[Configure Otsuka Shokai](#configure-otsuka-shokai)** to configure the SSO settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** to test Azure AD single sign-on with B. Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** to enable B. Simon to use Azure AD single sign-on.
5. **[Create Otsuka Shokai test user](#create-otsuka-shokai-test-user)** to have a counterpart of B. Simon in Otsuka Shokai that is linked to the Azure AD representation of user.
6. **[Test SSO](#test-sso)** to verify whether the configuration works.

### Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **Otsuka Shokai** application integration page, find the **Manage** section and select **Single sign-on**.
1. On the **Select a Single sign-on method** page, select **SAML**.
1. On the **Set up Single Sign-On with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Set up Single Sign-On with SAML** page, the application is pre-configured and the necessary URLs are already pre-populated with Azure. The user needs to save the configuration by clicking the **Save** button.

1. Otsuka Shokai application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes, where as **nameidentifier** is mapped with **user.userprincipalname**. Otsuka Shokai application expects **nameidentifier** to be mapped with **user.objectid**, so you need to edit the attribute mapping by clicking on **Edit** icon and change the attribute mapping.

	![image](common/edit-attribute.png)

1. In addition to above, Otsuka Shokai application expects few more attributes to be passed back in SAML response. In the **User Claims** section on the **User Attributes** dialog, perform the following steps to add SAML token attribute as shown in the below table:

	| Name | Source Attribute|
	| ---------------| --------------- |
	| Appid | `<Application ID>` |

	>[!NOTE]
	>`<Application ID>` is the value which you have copied from the **Properties** tab of Azure portal.

	a. Click **Add new claim** to open the **Manage user claims** dialog.

	![image](common/new-save-attribute.png)

	![image](common/new-attribute-details.png)

	b. In the **Name** textbox, type the attribute name shown for that row.

	c. Leave the **Namespace** blank.

	d. Select Source as **Attribute**.

	e. From the **Source attribute** list, type the attribute value shown for that row.

	f. Click **Ok**

	g. Click **Save**.

### Configure Otsuka Shokai

1. When you connect to Customer's My Page from SSO app, the wizard of SSO setting starts.

2. If Otsuka ID is not registered, proceed to Otsuka-ID new registration.   If you have registered Otsuka-ID, proceed to the linkage setting.

3. Proceed to the end and when the top screen is displayed after logging in to Customer's My Page, the SSO settings are complete.

4. The next time you connect to Customer's My Page from the SSO app, after the guidance screen opens, the top screen is displayed after logging in to Customer's My Page.

### Create an Azure AD test user

In this section, you'll create a test user in the Azure portal called B. Simon.

1. From the left pane in the Azure portal, select **Azure Active Directory**, select **Users**, and then select **All users**.
1. Select **New user** at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Name** field, enter `B. Simon`.  
   1. In the **User name** field, enter the username@companydomain.extension. For example, `B.Simon@contoso.com`.
   1. Select the **Show password** check box, and then write down the value that's displayed in the **Password** box.
   1. Click **Create**.

### Assign the Azure AD test user

In this section, you'll enable B. Simon to use Azure single sign-on by granting access to Otsuka Shokai.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Otsuka Shokai**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B. Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

### Create Otsuka Shokai test user

New registration of SaaS account will be performed at the first access to Otsuka Shokai. In addition, we will also associate Azure AD account and SaaS account at the time of new creation.

### Test SSO

When you select the Otsuka Shokai tile in the Access Panel, you should be automatically signed in to the Otsuka Shokai for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

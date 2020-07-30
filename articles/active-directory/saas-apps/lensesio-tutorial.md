---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with Lenses.io | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Lenses.io.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 2a0d4a7c-a171-48c6-b1c1-f2bd728fb37f
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: tutorial
ms.date: 07/02/2020
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with the Lenses.io DataOps portal.

In this tutorial, you'll learn how to integrate the [Lenses.io](https://lenses.io/) DataOps portal with Azure Active Directory (Azure AD). When you integrate Lenses.io with Azure AD, you can:

* Control in Azure AD who has access to the Lenses.io portal.
* Enable your users to be automatically signed-in to Lenses with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* An instance of a Lenses portal. You can deploy a Lenses portal in [various ways](https://lenses.io/product/deployment/).
* A Lenses.io [licence](https://lenses.io/product/pricing/) that supports single sign-on (SSO).

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Lenses.io supports **SP** initiated SSO

* Once you configure Lenses.io you can enforce session control, which protect exfiltration and infiltration of your organization’s sensitive data in real-time. Session control extend from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/proxy-deployment-any-app).

## Adding Lenses.io from the gallery

To configure the integration of Lenses.io into Azure AD, you need to add Lenses.io from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Lenses.io** in the search box.
1. Select **Lenses.io** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.


## Configure and test Azure AD SSO for Lenses.io

Configure and test Azure AD SSO with your Lenses.io portal using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Lenses.io.

To configure and test Azure AD SSO with Lenses.io, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user and group](#create-an-azure-ad-test-user-and-group)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Lenses.io SSO](#configure-lensesio-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Lenses.io test group permissions](#create-lensesio-test-group-permissions)** - to control what B.Simon should access in Lenses.io (authorization).
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **Lenses.io** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, enter the values for the following fields:

	a. In the **Sign on URL** text box, type a URL using the following pattern:
    `https://<CUSTOMER_LENSES_BASE_URL>` e.g. `https://lenses.my.company.com`

    b. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:
    `https://<CUSTOMER_LENSES_BASE_URL>` e.g. `https://lenses.my.company.com`

	c. In the **Reply URL** text box, type a URL using the following pattern:
    `https://<CUSTOMER_LENSES_BASE_URL>/api/v2/auth/saml/callback?client_name=SAML2Client`
    e.g. `https://lenses.my.company.com/api/v2/auth/saml/callback?client_name=SAML2Client`

	> [!NOTE]
	> These values are not real. Update these values with the actual Sign on URL, Reply URL and Identifier, based on the base URL of your Lenses portal instance. You can find more information in the [Lenses.io SSO documentation](https://docs.lenses.io/install_setup/configuration/security.html#single-sign-on-sso-saml-2-0).

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

1. On the **Set up Lenses.io** section, use the XML file above to configure Lenses against your Azure SSO.

### Create an Azure AD test user and group

In this section, you'll create a test user in the Azure portal called B.Simon. You will also create a test group for B.Simon which will be used to control what access B.Simon has in Lenses.
You can find out how Lenses uses group membership mapping for authorization in the [Lenses SSO documentation](https://docs.lenses.io/install_setup/configuration/security.html#id3)

1. From the left pane in the Azure portal, select **Azure Active Directory**, select **Users**, and then select **All users**.
1. Select **New user** at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Name** field, enter `B.Simon`.  
   1. In the **User name** field, enter the username@companydomain.extension. For example, `B.Simon@contoso.com`.
   1. Select the **Show password** check box, and then write down the value that's displayed in the **Password** box.
   1. Click **Create**.

To create the group:
1. Head back to **Azure Active Directory**, select **Groups**
1. Select **New group** at the top of the screen.
1. In the **Group properties**, follow these steps:
   1. In the **Group type** field, select `Security`.
   1. In the **Group Name** field, enter `LensesUsers`
   1. Click **Create**.
1. Select the group `LensesUsers` and take note of the **Object Id** (e.g. `f8b5c1ec-45de-4abd-af5c-e874091fb5f7`). This ID will be used in Lenses to map users of that group to the [correct permissions](https://docs.lenses.io/install_setup/configuration/security.html#id3).  
   
To assign the group to the test user: 
1. Head back to **Azure Active Directory**, select **Users**.
1. Select the test user `B.Simon`.
1. Select **Groups**.
1. Select **Add memberships** at the top of the screen.
1. Search for `LensesUsers` and select it.
1. Click **Select**.

### Assign the Azure AD test user

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Lenses.io.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Lenses.io**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Lenses.io SSO

To configure single sign-on on the **Lenses.io** portal, you install the downloaded **Federation Metadata XML** on your Lenses instance and [configure Lenses to enable SSO](https://docs.lenses.io/install_setup/configuration/security.html#configure-lenses). 

### Create Lenses.io test group permissions

In this section, you create a group in Lenses using the **Object Id** of the `LensesUsers` group we noted in the user [creation section](#create-an-azure-ad-test-user-and-group).
You assign the desired permissions that `B.Simon` should have in Lenses.
You can find more information on the [Azure - Lenses group mapping](https://docs.lenses.io/install_setup/configuration/security.html#azure-groups).

## Test SSO 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Lenses.io tile in the Access Panel, you should be automatically signed in to your Lenses.io portal for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [ Setup SSO in your Lenses.io instance ](https://docs.lenses.io/install_setup/configuration/security.html#single-sign-on-sso-saml-2-0)

- [ List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory ](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory? ](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [Try Lenses.io with Azure AD](https://aad.portal.azure.com/)

- [What is session control in Microsoft Cloud App Security?](https://docs.microsoft.com/cloud-app-security/proxy-intro-aad)

- [How to protect Lenses.io with advanced visibility and controls](https://docs.microsoft.com/cloud-app-security/proxy-intro-aad)

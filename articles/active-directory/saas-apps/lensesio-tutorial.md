---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with Lenses.io | Microsoft Docs'
description: In this tutorial, you learn how to configure single sign-on between Azure Active Directory and Lenses.io.
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

# Tutorial: Azure Active Directory single sign-on (SSO) integration with the Lenses.io DataOps portal

In this tutorial, you'll learn how to integrate the [Lenses.io](https://lenses.io/) DataOps portal with Azure Active Directory (Azure AD). After you integrate Lenses.io with Azure AD, you can:

* Control in Azure AD who has access to the Lenses.io portal.
* Enable your users to be automatically signed-in to Lenses with their Azure AD accounts.
* Manage your accounts in one central location—the Azure portal.

To learn more about software as a service (SaaS) app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* An instance of a Lenses portal. You can choose from a number of [Deployment Options](https://lenses.io/product/deployment/).
* A Lenses.io [license](https://lenses.io/product/pricing/) that supports single sign-on (SSO).

## Scenario description

In this tutorial, you'll configure and test Azure AD SSO in a test environment.

* Lenses.io supports service provider (SP) initiated SSO.

* You can enforce session control after you configure Lenses.io. Session control protects exfiltration and infiltration of your organization’s sensitive data in real-time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/proxy-deployment-any-app).

## Add Lenses.io from the gallery

To configure the integration of Lenses.io into Azure AD, add Lenses.io to your list of managed SaaS apps:

1. Sign in to the [Azure portal](https://portal.azure.com) by using a work or school account, or a personal Microsoft account.
1. On the left pane, select the **Azure Active Directory** service.
1. Go to **Enterprise Applications** and then select **All Applications**.
1. Select **New application**.
1. On the **Add from the gallery** section, enter **Lenses.io** in the search box.
1. From results panel, select **Lenses.io**,  and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD SSO for Lenses.io

Configure and test Azure AD SSO with your Lenses.io portal by using a test user called *B.Simon*. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Lenses.io.

Complete the following steps:

1. [Configure Azure AD SSO](#configure-azure-ad-sso) to enable your users to use this feature.
    1. [Create an Azure AD test user and group](#create-an-azure-ad-test-user-and-group) to test Azure AD SSO with B.Simon.
    1. [Assign the Azure AD test user](#assign-the-azure-ad-test-user) to enable B.Simon to use Azure AD SSO.
1. [Configure Lenses.io SSO](#configure-lensesio-sso) to configure the SSO settings on the application side.
    1. [Create Lenses.io test group permissions](#create-lensesio-test-group-permissions) to control what B.Simon can access in Lenses.io (authorization).
1. [Test SSO](#test-sso) to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal:

1. In the [Azure portal](https://portal.azure.com/), on the **Lenses.io** application integration page, find the **Manage** section, and then select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, select the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, enter these values in the following text-entry boxes:

	a. **Sign on URL**: Enter a URL that has the following pattern:
    - `https://<CUSTOMER_LENSES_BASE_URL>`
       - Example: `https://lenses.my.company.com`

    b. **Identifier (Entity ID)**: Enter a URL that has the following pattern:
    - `https://<CUSTOMER_LENSES_BASE_URL>`
      - Example: `https://lenses.my.company.com`

	c. **Reply URL**: Enter a URL that has the following pattern:
    - `https://<CUSTOMER_LENSES_BASE_URL>/api/v2/auth/saml/callback?client_name=SAML2Client`
      - Example: `https://lenses.my.company.com/api/v2/auth/saml/callback?client_name=SAML2Client`

	> [!NOTE]
	> These values are not real. Update them with the actual Sign on URL, Reply URL, and Identifier of the base URL of your Lenses portal instance. See the [Lenses.io SSO documentation](https://docs.lenses.io/install_setup/configuration/security.html#single-sign-on-sso-saml-2-0) for more information.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section, find **Federation Metadata XML** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

1. In the **Set up Lenses.io** section, use the XML file that you downloaded to configure Lenses against your Azure SSO.

### Create an Azure AD test user and group

Create the test user, B.Simon, in the Azure portal. Then create a test group that controls what access B.Simon has in Lenses.

You can find out how Lenses uses group membership mapping for authorization in the [Lenses SSO documentation](https://docs.lenses.io/install_setup/configuration/security.html#id3).

1. On the left pane of the Azure portal, select **Azure Active Directory**, select **Users**, and then select **All users**.
1. At the top of the screen, select **New user**.
1. On **User** properties:
   1. In the **Name** box, enter **B.Simon**.  
   1. In the **User name** box, enter the username@companydomain.extension. For example, **B.Simon@contoso.com**.
   1. Select the **Show password** check box. Then write down the password that shows in the **Password** box.
   1. Select **Create**.

Create the group:

1. Go to **Azure Active Directory**, and then select **Groups**.
1. At the top of the screen, select **New group**.
1. On **Group properties**:
   1. In the **Group type** box, select **Security**.
   1. In the **Group Name** box, enter **LensesUsers**.
   1. Select **Create**.
1. Select the group **LensesUsers** and copy the **Object ID** (For example: f8b5c1ec-45de-4abd-af5c-e874091fb5f7). You'll use this ID in Lenses to map users of the group to the [correct permissions](https://docs.lenses.io/install_setup/configuration/security.html#id3).  

Assign the group to the test user:

1. Go to **Azure Active Directory**, and then select **Users**.
1. Select the test user **B.Simon**.
1. Select **Groups**.
1. At the top of the screen, select **Add memberships**.
1. Search for and select **LensesUsers**.
1. Click **Select**.

### Assign the Azure AD test user

Grant access to Lenses.io to enable B.Simon to use Azure SSO.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. On the applications list, select **Lenses.io**.
1. On the app overview page, in the **Manage** section, select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**.

	![The Add User link](common/add-assign-user.png)

1. In the **Add Assignment** dialog box, select **Users and groups**.
1. In the **Users and groups** dialog box, select **B.Simon** from the Users list. Then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog box, choose the appropriate role for the user from the list. Then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog box, select the **Assign** button.

## Configure Lenses.io SSO

To configure SSO on the **Lenses.io** portal, install the downloaded **Federation Metadata XML** on your Lenses instance and [configure Lenses to enable SSO](https://docs.lenses.io/install_setup/configuration/security.html#configure-lenses).

### Create Lenses.io test group permissions

1. Create a group in Lenses by using the **Object ID** of the **LensesUsers** group that you copied in the user [creation section](#create-an-azure-ad-test-user-and-group).
1. Assign the desired permissions for B.Simon.

For more information, see [Azure - Lenses group mapping](https://docs.lenses.io/install_setup/configuration/security.html#azure-groups).

## Test SSO

Test your Azure AD SSO configuration by using the Access Panel.

When you select the Lenses.io tile on the Access Panel, you should be automatically signed in to your Lenses.io portal. For more information, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [Setup SSO in your Lenses.io instance](https://docs.lenses.io/install_setup/configuration/security.html#single-sign-on-sso-saml-2-0).

- [List of Tutorials on how to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list).

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [Try Lenses.io with Azure AD](https://aad.portal.azure.com/).

- [What is session control in Microsoft Cloud App Security?](https://docs.microsoft.com/cloud-app-security/proxy-intro-aad)

- [How to protect Lenses.io with advanced visibility and controls](https://docs.microsoft.com/cloud-app-security/proxy-intro-aad).

---
title: 'Tutorial: Azure Active Directory integration with Dow Jones Factiva'
description: Learn how to configure single sign-on between Azure Active Directory and Dow Jones Factiva.
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
# Tutorial: Azure Active Directory integration with Dow Jones Factiva

In this tutorial, you learn how to integrate Dow Jones Factiva with Azure Active Directory (Azure AD).
Integrating Dow Jones Factiva with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to Dow Jones Factiva.
* You can enable your users to be automatically signed-in to Dow Jones Factiva (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with Dow Jones Factiva, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get one-month trial [here](https://azure.microsoft.com/pricing/free-trial/)
* Dow Jones Factiva single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Dow Jones Factiva supports **IDP** initiated SSO

## Adding Dow Jones Factiva from the gallery

To configure the integration of Dow Jones Factiva into Azure AD, you need to add Dow Jones Factiva from the gallery to your list of managed SaaS apps.

**To add Dow Jones Factiva from the gallery, perform the following steps:**

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the search box, type **Dow Jones Factiva**, select **Dow Jones Factiva** from result panel then click **Add** button to add the application.

	 ![Dow Jones Factiva in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Dow Jones Factiva based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in Dow Jones Factiva needs to be established.

To configure and test Azure AD single sign-on with Dow Jones Factiva, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure Dow Jones Factiva Single Sign-On](#configure-dow-jones-factiva-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Create Dow Jones Factiva test user](#create-dow-jones-factiva-test-user)** - to have a counterpart of Britta Simon in Dow Jones Factiva that is linked to the Azure AD representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on.

To configure Azure AD single sign-on with Dow Jones Factiva, perform the following steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Dow Jones Factiva** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

1. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

1. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, the user does not have to perform any step as the app is already pre-integrated with Azure.

    ![Dow Jones Factiva Domain and URLs single sign-on information](common/preintegrated.png)

1. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

6. On the **Set up Dow Jones Factiva** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Azure Ad Identifier

	c. Logout URL

### Configure Dow Jones Factiva Single Sign-On

To configure single sign-on on **Dow Jones Factiva** side, you need to send the downloaded **Federation Metadata XML** and appropriate copied URLs from the application configuration to [Dow Jones Factiva support team](https://www.dowjones.com/contact/). They set this setting to have the SAML SSO connection set properly on both sides.

### Create an Azure AD test user 

The objective of this section is to create a test user called Britta Simon.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [User Administrator](../roles/permissions-reference.md#user-administrator).
1. Browse to **Identity** > **Users** > **All users**.
1. Select **New user** > **Create new user**, at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Display name** field, enter `B.Simon`.  
   1. In the **User principal name** field, enter the username@companydomain.extension. For example, `B.Simon@contoso.com`.
   1. Select the **Show password** check box, and then write down the value that's displayed in the **Password** box.
   1. Select **Review + create**.
1. Select **Create**.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Dow Jones Factiva.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Dow Jones Factiva**.

	![Enterprise applications blade](common/enterprise-applications.png)

1. In the applications list, select **Dow Jones Factiva**.

	![The Dow Jones Factiva link in the Applications list](common/all-applications.png)

1. In the app's overview page, select **Users and groups**.
1. Select **Add user/group**, then select **Users and groups** in the **Add Assignment** dialog.
   1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
   1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
   1. In the **Add Assignment** dialog, click the **Assign** button.

### Create Dow Jones Factiva test user

In this section, you create a user called Britta Simon in Dow Jones Factiva. Work with [Dow Jones Factiva support team](https://www.dowjones.com/contact/) to add the users in the Dow Jones Factiva platform. Users must be created and activated before you use single sign-on.

### Test single sign-on 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Dow Jones Factiva tile in the Access Panel, you should be automatically signed in to the Dow Jones Factiva for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](./tutorial-list.md)

- [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

- [What is Conditional Access in Azure Active Directory?](../conditional-access/overview.md)
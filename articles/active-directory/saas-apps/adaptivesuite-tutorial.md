---
title: 'Tutorial: Azure Active Directory integration with Adaptive Insights | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Adaptive Insights.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 13af9d00-116a-41b8-8ca0-4870b31e224c
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 07/19/2019
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Integrate Adaptive Insights with Azure Active Directory

In this tutorial, you'll learn how to integrate Adaptive Insights with Azure Active Directory (Azure AD). When you integrate Adaptive Insights with Azure AD, you can:

* Control in Azure AD who has access to Adaptive Insights.
* Enable your users to be automatically signed-in to Adaptive Insights with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Adaptive Insights single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Adaptive Insights supports **IDP** initiated SSO

## Adding Adaptive Insights from the gallery

To configure the integration of Adaptive Insights into Azure AD, you need to add Adaptive Insights from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Adaptive Insights** in the search box.
1. Select **Adaptive Insights** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.


## Configure and test Azure AD single sign-on

Configure and test Azure AD SSO with Adaptive Insights using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Adaptive Insights.

To configure and test Azure AD SSO with Adaptive Insights, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
2. **[Configure Adaptive Insights SSO](#configure-adaptive-insights-sso)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
5. **[Create Adaptive Insights test user](#create-adaptive-insights-test-user)** - to have a counterpart of B.Simon in Adaptive Insights that is linked to the Azure AD representation of user.
6. **[Test SSO](#test-sso)** - to verify whether the configuration works.

### Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **Adaptive Insights** application integration page, find the **Manage** section and select **Single sign-on**.
1. On the **Select a Single sign-on method** page, select **SAML**.
1. On the **Set up Single Sign-On with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier** text box, type a URL using the following pattern:
    `https://login.adaptiveinsights.com:443/samlsso/<unique-id>`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://login.adaptiveinsights.com:443/samlsso/<unique-id>`

	> [!NOTE]
	> You can get Identifier(Entity ID) and Reply URL values from the Adaptive Insights’s **SAML SSO Settings** page.

4. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

6. On the **Set up Adaptive Insights** section, copy the appropriate URL(s) based on your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

### Configure Adaptive Insights SSO

1. In a different web browser window, sign in to your Adaptive Insights company site as an administrator.

2. Go to **Administration**.

	![Admin](./media/adaptivesuite-tutorial/ic805644.png "Admin")

3. In the **Users and Roles** section, click **SAML SSO Settings**.

	![Manage SAML SSO Settings](./media/adaptivesuite-tutorial/ic805645.png "Manage SAML SSO Settings")

4. On the **SAML SSO Settings** page, perform the following steps:

	![SAML SSO Settings](./media/adaptivesuite-tutorial/ic805646.png "SAML SSO Settings")

	a. In the **Identity provider name** textbox, type a name for your configuration.

	b. Paste the **Azure AD Identifier** value copied from Azure portal into the **Identity provider Entity ID** textbox.

	c. Paste the **Login URL** value copied from Azure portal into the **Identity provider SSO URL** textbox.

	d. Paste the **Logout URL** value copied from Azure portal into the **Custom logout URL** textbox.

	e. To upload your downloaded certificate, click **Choose file**.

	f. Select the following, for:

     * **SAML user id**, select **User’s Adaptive Insights user name**.

     * **SAML user id location**, select **User id in NameID of Subject**.

     * **SAML NameID format**, select **Email address**.

     * **Enable SAML**, select **Allow SAML SSO and direct Adaptive Insights login**.

	g. Copy **Adaptive Insights SSO URL** and paste into the **Identifier(Entity ID)** and **Reply URL** textboxes in the **Basic SAML Configuration** section in the Azure portal.

	h. Click **Save**.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Adaptive Insights.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Adaptive Insights**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

### Create Adaptive Insights test user

To enable Azure AD users to sign in to Adaptive Insights, they must be provisioned into Adaptive Insights. In the case of Adaptive Insights, provisioning is a manual task.

**To configure user provisioning, perform the following steps:**

1. Sign in to your **Adaptive Insights** company site as an administrator.

2. Go to **Administration**.

   ![Admin](./media/adaptivesuite-tutorial/IC805644.png "Admin")

3. In the **Users and Roles** section, click **Users**.

   ![Add User](./media/adaptivesuite-tutorial/IC805648.png "Add User")

4. In the **New User** section, perform the following steps:

   ![Submit](./media/adaptivesuite-tutorial/IC805649.png "Submit")

   a. Type the **Name**, **Username**, **Email**, **Password** of a valid Azure Active Directory user you want to provision into the related textboxes.

   b. Select a **Role**.

   c. Click **Submit**.

> [!NOTE]
> You can use any other Adaptive Insights user account creation tools or APIs provided by Adaptive Insights to provision Azure AD user accounts.

### Test SSO 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Adaptive Insights tile in the Access Panel, you should be automatically signed in to the Adaptive Insights for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [ List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory ](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory? ](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)


---
title: 'Tutorial: Microsoft Entra integration with Trisotech Digital Enterprise Server'
description: Learn how to configure single sign-on between Microsoft Entra ID and Trisotech Digital Enterprise Server.
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
# Tutorial: Microsoft Entra integration with Trisotech Digital Enterprise Server

In this tutorial, you learn how to integrate Trisotech Digital Enterprise Server with Microsoft Entra ID.
Integrating Trisotech Digital Enterprise Server with Microsoft Entra ID provides you with the following benefits:

* You can control in Microsoft Entra ID who has access to Trisotech Digital Enterprise Server.
* You can enable your users to be automatically signed-in to Trisotech Digital Enterprise Server (Single Sign-On) with their Microsoft Entra accounts.
* You can manage your accounts in one central location.

If you want to know more details about SaaS app integration with Microsoft Entra ID, see [What is application access and single sign-on with Microsoft Entra ID](../manage-apps/what-is-single-sign-on.md).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Microsoft Entra integration with Trisotech Digital Enterprise Server, you need the following items:

* A Microsoft Entra subscription. If you don't have a Microsoft Entra environment, you can get one-month trial [here](https://azure.microsoft.com/pricing/free-trial/)
* Trisotech Digital Enterprise Server single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Microsoft Entra single sign-on in a test environment.

* Trisotech Digital Enterprise Server supports **SP** initiated SSO

* Trisotech Digital Enterprise Server supports **Just In Time** user provisioning

## Adding Trisotech Digital Enterprise Server from the gallery

To configure the integration of Trisotech Digital Enterprise Server into Microsoft Entra ID, you need to add Trisotech Digital Enterprise Server from the gallery to your list of managed SaaS apps.

**To add Trisotech Digital Enterprise Server from the gallery, perform the following steps:**

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the search box, type **Trisotech Digital Enterprise Server**, select **Trisotech Digital Enterprise Server** from result panel then click **Add** button to add the application.

	 ![Trisotech Digital Enterprise Server in the results list](common/search-new-app.png)

<a name='configure-and-test-azure-ad-single-sign-on'></a>

## Configure and test Microsoft Entra single sign-on

In this section, you configure and test Microsoft Entra single sign-on with Trisotech Digital Enterprise Server based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between a Microsoft Entra user and the related user in Trisotech Digital Enterprise Server needs to be established.

To configure and test Microsoft Entra single sign-on with Trisotech Digital Enterprise Server, you need to complete the following building blocks:

1. **[Configure Microsoft Entra Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure Trisotech Digital Enterprise Server Single Sign-On](#configure-trisotech-digital-enterprise-server-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** - to test Microsoft Entra single sign-on with Britta Simon.
4. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Microsoft Entra single sign-on.
5. **[Create Trisotech Digital Enterprise Server test user](#create-trisotech-digital-enterprise-server-test-user)** - to have a counterpart of Britta Simon in Trisotech Digital Enterprise Server that is linked to the Microsoft Entra representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

<a name='configure-azure-ad-single-sign-on'></a>

### Configure Microsoft Entra single sign-on

In this section, you enable Microsoft Entra single sign-on.

To configure Microsoft Entra single sign-on with Trisotech Digital Enterprise Server, perform the following steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Trisotech Digital Enterprise Server** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

1. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

1. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, perform the following steps:

    ![Trisotech Digital Enterprise Server Domain and URLs single sign-on information](common/sp-identifier.png)

	a. In the **Sign on URL** text box, type a URL using the following pattern:
    `https://<companyname>.trisotech.com`

    b. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:
    `https://<companyname>.trisotech.com`

	> [!NOTE]
	> These values are not real. Update these values with the actual Sign on URL and Identifier. Contact [Trisotech Digital Enterprise Server Client support team](mailto:support@trisotech.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section.

4. On the **Set up Single Sign-On with SAML** page, In the **SAML Signing Certificate** section, click copy button to copy **App Federation Metadata Url** and save it on your computer.

	![The Certificate download link](common/copy-metadataurl.png)

### Configure Trisotech Digital Enterprise Server Single Sign-On

1. In a different web browser window, sign in to your Trisotech Digital Enterprise Server Configuration company site as an administrator.

2. Click on the **Menu icon** and then select **Administration**.

	![Screenshot shows the Administration icon in Microsoft Digital Enterprise Server.](./media/trisotechdigitalenterpriseserver-tutorial/user1.png)

3. Select **User Provider**.

	![Screenshot shows User Provider selected from the menu.](./media/trisotechdigitalenterpriseserver-tutorial/user2.png)

4. In the **User Provider Configurations** section, perform the following steps:

	![Screenshot shows the User Provider Configurations where you can enter the values described.](./media/trisotechdigitalenterpriseserver-tutorial/user3.png)

	a. Select **Secured Assertion Markup Language 2 (SAML 2)** from the dropdown in the **Authentication Method**.

	b. In the **Metadata URL** textbox, paste the **App Federation Metadata Url** value, which you have copied form the Azure portal.

	c. In the **Application ID** textbox, enter the URL using the following pattern: `https://<companyname>.trisotech.com`.

	d. Click **Save**

	e. Enter the domain name in the **Allowed Domains (empty means everyone)** textbox, it automatically assigns licenses for users matching the Allowed Domains

	f. Click **Save**

<a name='create-an-azure-ad-test-user'></a>

### Create a Microsoft Entra test user 

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

<a name='assign-the-azure-ad-test-user'></a>

### Assign the Microsoft Entra test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Trisotech Digital Enterprise Server.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Trisotech Digital Enterprise Server**.

	![Enterprise applications blade](common/enterprise-applications.png)

1. In the applications list, select **Trisotech Digital Enterprise Server**.

	![The Trisotech Digital Enterprise Server link in the Applications list](common/all-applications.png)

1. In the app's overview page, select **Users and groups**.
1. Select **Add user/group**, then select **Users and groups** in the **Add Assignment** dialog.
   1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
   1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
   1. In the **Add Assignment** dialog, click the **Assign** button.

### Create Trisotech Digital Enterprise Server test user

In this section, a user called Britta Simon is created in Trisotech Digital Enterprise Server. Trisotech Digital Enterprise Server supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in Trisotech Digital Enterprise Server, a new one is created after authentication.

>[!Note]
>If you need to create a user manually, contact [Trisotech Digital Enterprise Server support team](mailto:support@trisotech.com).

### Test single sign-on 

In this section, you test your Microsoft Entra single sign-on configuration using the Access Panel.

When you click the Trisotech Digital Enterprise Server tile in the Access Panel, you should be automatically signed in to the Trisotech Digital Enterprise Server for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Microsoft Entra ID](./tutorial-list.md)

- [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

- [What is Conditional Access in Microsoft Entra ID?](../conditional-access/overview.md)

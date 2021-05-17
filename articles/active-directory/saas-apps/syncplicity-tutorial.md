---
title: 'Tutorial: Azure Active Directory integration with Syncplicity | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Syncplicity.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 06/10/2019
ms.author: jeedes
---

# Tutorial: Integrate Syncplicity with Azure Active Directory

In this tutorial, you'll learn how to integrate Syncplicity with Azure Active Directory (Azure AD). When you integrate Syncplicity with Azure AD, you can:

* Control in Azure AD who has access to Syncplicity.
* Enable your users to be automatically signed-in to Syncplicity with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a 12-month free trial [here](https://azure.microsoft.com/free/).
* Syncplicity single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment. Syncplicity supports **SP** initiated SSO.

## Adding Syncplicity from the gallery

To configure the integration of Syncplicity into Azure AD, you need to add Syncplicity from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Under **Create**, click **Enterprise Application**.
1. In the **Browse Azure AD gallery** section, type **Syncplicity** in the search box.
1. Select **Syncplicity** from results panel and then click **Create** to add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD SSO

Configure and test Azure AD SSO with Syncplicity using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Syncplicity.

To configure and test Azure AD SSO with Syncplicity, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
2. **[Configure Syncplicity SSO](#configure-syncplicity-sso)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
5. **[Create Syncplicity test user](#create-syncplicity-test-user)** - to have a counterpart of B.Simon in Syncplicity that is linked to the Azure AD representation of user.
6. **[Test SSO](#test-sso)** - to verify whether the configuration works.
7. **[Update SSO](#update-sso)**) - to make the necessary changes in Syncplicity if you have changed the SSO settings in Azure AD.

### Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **Syncplicity** application integration page, find the **Getting Started** section and select **Set up single sign-on**.
2. On the **Select a Single sign-on method** page, select **SAML**.
3. On the **Set up Single Sign-On with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

4. In the **Basic SAML Configuration** section, enter the values for the following fields:

    a. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:
    `https://<companyname>.syncplicity.com/sp`

    b. In the **Sign on URL** text box, type a URL using the following pattern:
    `https://<companyname>.syncplicity.com`
    
    c. In the **Reply URL (Assertion Consumer Service URL)** text box, type a URL using the following pattern:
    `https://<companyname>.syncplicity.com/Auth/AssertionConsumerService.aspx`

	> [!NOTE]
	> These values are not real. Update these values with the actual Sign on URL and Identifier. Contact [Syncplicity Client support team](https://www.syncplicity.com/contact-us) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

5. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Edit**. Then in the dialog click the ellipsis button next to your active certificate and select **PEM certificate download**.

   ![The Certificate download link](common/certificatebase64.png)

    > [!NOTE]
    > You need the PEM certificate, as Syncplicity does not accept certificates in CER format.

6. On the **Set up Syncplicity** section, copy the appropriate URL(s) based on your requirement.

   ![Copy configuration URLs](common/copy-configuration-urls.png)

### Configure Syncplicity SSO

1. Sign in to your **Syncplicity** tenant.

1. In the menu on the top, click **Admin**, select **Settings**, and then click **Custom domain and single sign-on**.

    ![Syncplicity](./media/syncplicity-tutorial/ic769545.png "Syncplicity")

1. On the **Single Sign-On (SSO)** dialog page, perform the following steps:

    ![Single Sign-On \(SSO\)](./media/syncplicity-tutorial/ic769550.png "Single Sign-On \\\(SSO\\\)")

    a. In the **Custom Domain** textbox, type the name of your domain.
  
    b. Select **Enabled** as **Single Sign-On Status**.

    c. In the **Entity Id** textbox, Paste the **Identifier (Entity ID)** value, which you have used in the **Basic SAML Configuration** in the Azure portal.

    d. In the **Sign-in page URL** textbox, Paste the **Sign on URL** which you have copied from the Azure portal.

    e. In the **Logout page URL** textbox, Paste the **Logout URL** which you have copied from the Azure portal.

    f. In **Identity Provider Certificate**, click **Choose file**, and then upload the certificate which you have downloaded from the Azure portal.

    g. Click **SAVE CHANGES**.

### Create an Azure AD test user

In this section, you'll create a test user in the Azure portal called B.Simon.

1. From the left pane in the Azure portal, select **Azure Active Directory**, select **Users**, and then select **All users**.
2. Select **New user** at the top of the screen.
3. In the **User** properties, follow these steps:

   a. In the **User name** field, enter the username@companydomain.extension. For example, `B.Simon@contoso.com`.

   b. In the **Name** field, enter `B.Simon`.  
   
   c. Select the **Show password** check box, and then write down the value that's displayed in the **Password** box.
   
   d. Click **Create**.

### Assign the Azure AD test user

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Syncplicity.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Syncplicity**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user/group**.

	![The Add User link](common/add-assign-user.png)
1. In the **Add Assignment** page select **Users**. 
1. In the **Users** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** page, click the **Assign** button.

### Create Syncplicity test user

For Azure AD users to be able to sign in, they must be provisioned to Syncplicity application. This section describes how to create Azure AD user accounts in Syncplicity.

**To provision a user account to Syncplicity, perform the following steps:**

1. Sign in to your **Syncplicity** tenant (for example: `https://company.Syncplicity.com`).

1. Click **Admin** and select **User Accounts**, then click **Add a User**.

    ![Manage Users](./media/syncplicity-tutorial/ic769764.png "Manage Users")

1. Type the **Email addresses** of an Azure AD account you want to provision, select **User** as **Role**, and then click **Next**.

    ![Account Information](./media/syncplicity-tutorial/ic769765.png "Account Information")

    > [!NOTE]
    > The Azure AD account holder gets an email including a link to confirm and activate the account.

1. Select a group in your company that your new user should become a member of, and then click **Next**.

    ![Group Membership](./media/syncplicity-tutorial/ic769772.png "Group Membership")

    > [!NOTE]
    > If there are no groups listed, click **Next**.

1. Select the folders you would like to place under Syncplicity’s control on the user’s computer, and then click **Next**.

    ![Syncplicity Folders](./media/syncplicity-tutorial/ic769773.png "Syncplicity Folders")

> [!NOTE]
> You can use any other Syncplicity user account creation tools or APIs provided by Syncplicity to provision Azure AD user accounts.

### Test SSO

When you select the Syncplicity tile in the Access Panel, you should be automatically signed in to the Syncplicity for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](../user-help/my-apps-portal-end-user-access.md).

### Update SSO

Whenever you need to make changes to the SSO, you need to check the **SAML Signing Certificate** being used. If the certificate has changed, make sure to upload the new one to Syncplicity as described in **[Configure Syncplicity SSO](#configure-syncplicity-sso)**.

If you are using the Syncplicity Mobile app, please contact the Syncplicity Customer Support (support@syncplicity.com) for assistance.

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](./tutorial-list.md)

- [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

- [What is Conditional Access in Azure Active Directory?](../conditional-access/overview.md)

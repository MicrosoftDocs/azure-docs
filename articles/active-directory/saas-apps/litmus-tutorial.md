---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with Litmus | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Litmus.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 3b570512-f5b2-490e-8e72-b530c0b53956
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: tutorial
ms.date: 04/06/2020
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with Litmus

In this tutorial, you'll learn how to integrate Litmus with Azure Active Directory (Azure AD). When you integrate Litmus with Azure AD, you can:

* Control in Azure AD who has access to Litmus.
* Enable your users to be automatically signed-in to Litmus with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Litmus single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Litmus supports **SP and IDP** initiated SSO
* Once you configure Litmus you can enforce session control, which protect exfiltration and infiltration of your organization’s sensitive data in real-time. Session control extend from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/proxy-deployment-any-app).

## Adding Litmus from the gallery

To configure the integration of Litmus into Azure AD, you need to add Litmus from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Litmus** in the search box.
1. Select **Litmus** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.


## Configure and test Azure AD single sign-on for Litmus

Configure and test Azure AD SSO with Litmus using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Litmus.

To configure and test Azure AD SSO with Litmus, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Litmus SSO](#configure-litmus-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Litmus test user](#create-litmus-test-user)** - to have a counterpart of B.Simon in Litmus that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **Litmus** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, the user does not have to perform any step as the app is already pre-integrated with Azure.

1. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type the URL:
    `https://litmus.com/sessions/new`

1. Click **Save**.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Raw)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificateraw.png)

1. On the **Set up Litmus** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Litmus.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Litmus**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Litmus SSO

1. In a different web browser window, sign into Litmus application as an administrator.

1. Click on the **Security** from the left navigation panel.

    ![Litmus Configuration](./media/litmus-tutorial/security-img.png)

1. On the **Configure SAML Authentication** section, perform the following steps:

    ![Litmus Configuration](./media/litmus-tutorial/configure1.png)

    a. Switch on the **Enable SAML** toggle.

    b. Select **Generic** for the provider.

    c. Enter the name of **Identity Provider Name**. for ex. `Azure AD`

1. Perform the following steps:

	![Litmus Configuration](./media/litmus-tutorial/configure3.png)

    a. In the **SAML 2.0 Endpoint(HTTP)** textbox, paste the **Login URL** value, which you have copied from the Azure portal.

    b. Open downloaded **Certificate** file from Azure portal into Notepad and paste the content into **X.509 Certificate** textbox.

    c. Click **Save SAML settings**.

### Create Litmus test user

1. In a different web browser window, sign into Litmus application as an administrator.

1. Click on the **Accounts** from the left navigation panel.

    ![Litmus Configuration](./media/litmus-tutorial/accounts-img.png)

1. Click **Add New User** tab.

    ![Litmus Configuration](./media/litmus-tutorial/add-new-user.png)

1. On the **Add User** section, perform the following steps:

    ![Litmus Configuration](./media/litmus-tutorial/user-profile.png)

    a. In the **Email** textbox, enter the email address of the user like **B.Simon@contoso.com**

    b. In the **First Name** textbox, enter the first name of the user like **B**.

    c. In the **Last Name** textbox, enter the last name of the user like **Simon**.

    d. Click **Create User**.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Litmus tile in the Access Panel, you should be automatically signed in to the Litmus for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [ List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory ](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory? ](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [Try Litmus with Azure AD](https://aad.portal.azure.com/)

- [What is session control in Microsoft Cloud App Security?](https://docs.microsoft.com/cloud-app-security/proxy-intro-aad)

- [How to protect Litmus with advanced visibility and controls](https://docs.microsoft.com/cloud-app-security/proxy-intro-aad)

---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with Veracode | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Veracode.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 4fe78050-cb6d-4db9-96ec-58cc0779167f
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 09/10/2019
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with Veracode

In this tutorial, you'll learn how to integrate Veracode with Azure Active Directory (Azure AD). When you integrate Veracode with Azure AD, you can:

* Control in Azure AD who has access to Veracode.
* Enable your users to be automatically signed-in to Veracode with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Veracode single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Veracode supports **IDP** initiated SSO
* Veracode supports **Just In Time** user provisioning

## Adding Veracode from the gallery

To configure the integration of Veracode into Azure AD, you need to add Veracode from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Veracode** in the search box.
1. Select **Veracode** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD single sign-on for Veracode

Configure and test Azure AD SSO with Veracode using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Veracode.

To configure and test Azure AD SSO with Veracode, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Veracode SSO](#configure-veracode-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Veracode test user](#create-veracode-test-user)** - to have a counterpart of B.Simon in Veracode that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **Veracode** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, the application is pre-configured and the necessary URLs are already pre-populated with Azure. The user needs to save the configuration by clicking the **Save** button.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. On the **Set up Veracode** section, copy the appropriate URL(s) based on your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

## Configure Veracode SSO

1. In a different web browser window, sign into your Veracode company site as an administrator.

1. In the menu on the top, click **Settings**, and then click **Admin**.
   
    ![Administration](./media/veracode-tutorial/ic802911.png "Administration")

1. Click the **SAML** tab.

1. In the **Organization SAML Settings** section, perform the following steps:

    ![Administration](./media/veracode-tutorial/ic802912.png "Administration")

    a.  In  **Issuer** textbox, paste the value of  **Azure AD Identifier** which you have copied from Azure portal.

    b. To upload your downloaded certificate from Azure portal, click **Choose File**.

    c. Select **Enable Self Registration**.

1. In the **Self Registration Settings** section, perform the following steps, and then click **Save**:

    ![Administration](./media/veracode-tutorial/ic802913.png "Administration")

    a. As **New User Activation**, select **No Activation Required**.

    b. As **User Data Updates**, select **Preference Veracode User Data**.

    c. For **SAML Attribute Details**, select the following:
      * **User Roles**
      * **Policy Administrator**
      * **Reviewer**
      * **Security Lead**
      * **Executive**
      * **Submitter**
      * **Creator**
      * **All Scan Types**
      * **Team Memberships**
      * **Default Team**

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Veracode.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Veracode**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

### Create Veracode test user

In order to enable Azure AD users to log into Veracode, they must be provisioned into Veracode. In the case of Veracode, provisioning is an automated task. There is no action item for you. Users are automatically created if necessary during the first single sign-on attempt.

> [!NOTE]
> You can use any other Veracode user account creation tools or APIs provided by Veracode to provision Azure AD user accounts.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Veracode tile in the Access Panel, you should be automatically signed in to the Veracode for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [ List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory ](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory? ](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [Try Veracode with Azure AD](https://aad.portal.azure.com/)
---
title: 'Tutorial: Azure Active Directory integration with Projectplace | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Projectplace.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: celested

ms.assetid: 298059ca-b652-4577-916a-c31393d53d7a
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 05/29/2019
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Integrate Projectplace with Azure Active Directory

In this tutorial, you'll learn how to integrate Projectplace with Azure Active Directory (Azure AD). When you integrate Projectplace with Azure AD, you can:

* Control in Azure AD who has access to Projectplace.
* Enable your users to be automatically signed-in to Projectplace with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.
* Users can be provisioned in Projectplace automatically.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Projectplace single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment. Projectplace supports **SP and IDP** initiated SSO and supports **Just In Time** user provisioning.

## Adding Projectplace from the gallery

To configure the integration of Projectplace into Azure AD, you need to add Projectplace from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Projectplace** in the search box.
1. Select **Projectplace** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD single sign-on

Configure and test Azure AD SSO with Projectplace using a test user called **B. Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Projectplace.

To configure and test Azure AD SSO with Projectplace, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** to enable your users to use this feature.
2. **[Configure Projectplace](#configure-projectplace)** to configure the SSO settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** to test Azure AD single sign-on with B. Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** to enable B. Simon to use Azure AD single sign-on.
5. **[Create Projectplace test user](#create-projectplace-test-user)** to have a counterpart of B. Simon in Projectplace that is linked to the Azure AD representation of user.
6. **[Test SSO](#test-sso)** to verify whether the configuration works.

### Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **Projectplace** application integration page, find the **Manage** section and select **Single sign-on**.
1. On the **Select a Single sign-on method** page, select **SAML**.
1. On the **Set up Single Sign-On with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, the application is pre-configured and the necessary URLs are already pre-populated with Azure. The user needs to save the configuration by clicking the **Save** button.

1. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type a URL:
    `https://service.projectplace.com`

1. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click copy **icon** to copy the **App Federation Metadata Url**, as per your requirement and save it in Notepad.

   ![The Certificate download link](common/copy-metadataurl.png)

1. On the **Set up Projectplace** section, copy the appropriate URL(s) based on your requirement.

   ![Copy configuration URLs](common/copy-configuration-urls.png)

### Configure Projectplace

To configure single sign-on on the **Projectplace** side, you need to send the copied **App Federation Metadata Url** from the Azure portal to the [Projectplace support team](https://success.planview.com/Projectplace/Support). This team ensures the SAML SSO connection is set properly on both sides.

>[!NOTE]
>The single sign-on configuration has to be performed by the [Projectplace support team](https://success.planview.com/Projectplace/Support). You'll get a notification as soon as the configuration is complete. 

### Create an Azure AD test user

In this section, you'll create a test user in the Azure portal called B. Simon.

1. From the left pane in the Azure portal, select **Azure Active Directory**, select **Users**, and then select **All users**.
1. Select **New user** at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Name** field, enter `B. Simon`.  
   1. In the **User name** field, enter the username@companydomain.extension. For example, `BrittaSimon@contoso.com`.
   1. Select the **Show password** check box, and then write down the value that's displayed in the **Password** box.
   1. Click **Create**.

### Assign the Azure AD test user

In this section, you'll enable B. Simon to use Azure single sign-on by granting access to Projectplace.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Projectplace**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B. Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

### Create Projectplace test user

>[!NOTE]
>You can skip this step if you have provisioning enabled in Projectplace. You can ask the [Projectplace support team](https://success.planview.com/Projectplace/Support) to enable provisoning, once done users will be created in Projectplace during the first login.

To enable Azure AD users to sign in to Projectplace, you need to add them to Projectplace. You need to add them manually.

**To create a user account, take these steps:**

1. Sign in to your **Projectplace** company site as an admin.

2. Go to **People**, and then select **Members**:
   
    ![Go to People, and then select Members](./media/projectplace-tutorial/ic790228.png "People")

3. Select **Add Member**:
   
    ![Select Add Member](./media/projectplace-tutorial/ic790232.png "Add Members")

4. In the **Add Member** section, take the following steps.
   
    ![Add Member section](./media/projectplace-tutorial/ic790233.png "New Members")
   
    1. In the **New Members** box, enter the email address of a valid Azure AD account that you want to add.
   
    1. Select **Send**.

   An email containing a link to confirm the account before it becomes active is sent to the Azure AD account holder.

>[!NOTE]
>You can also use any other user-account creation tool or API provided by Projectplace to add Azure AD user accounts.


### Test SSO

When you select the Projectplace tile in the Access Panel, you should be automatically signed in to the Projectplace for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)
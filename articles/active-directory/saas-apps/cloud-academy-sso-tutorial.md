---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with Cloud Academy - SSO | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Cloud Academy - SSO.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 560c86fb-e25c-4428-a1dd-a5711cfece5c
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: tutorial
ms.date: 07/16/2020
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with Cloud Academy - SSO

In this tutorial, you'll learn how to integrate Cloud Academy - SSO with Azure Active Directory (Azure AD). When you integrate Cloud Academy - SSO with Azure AD, you can:

* Control in Azure AD who has access to Cloud Academy - SSO.
* Enable your users to be automatically signed-in to Cloud Academy - SSO with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Cloud Academy - SSO single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Cloud Academy - SSO supports **SP** initiated SSO

* Once you configure Cloud Academy - SSO you can enforce session control, which protect exfiltration and infiltration of your organization’s sensitive data in real-time. Session control extend from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/proxy-deployment-any-app).

## Adding Cloud Academy - SSO from the gallery

To configure the integration of Cloud Academy - SSO into Azure AD, you need to add Cloud Academy - SSO from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Cloud Academy - SSO** in the search box.
1. Select **Cloud Academy - SSO** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.


## Configure and test Azure AD SSO for Cloud Academy - SSO

Configure and test Azure AD SSO with Cloud Academy - SSO using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Cloud Academy - SSO.

To configure and test Azure AD SSO with Cloud Academy - SSO, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Cloud Academy-SSO SSO](#configure-cloud-academy-sso-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Cloud Academy-SSO test user](#create-cloud-academy-sso-test-user)** - to have a counterpart of B.Simon in Cloud Academy - SSO that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **Cloud Academy - SSO** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, enter the values for the following fields:

    In the **Sign-on URL** text box, type the URL:
    `https://cloudacademy.com/login/enterprise/`

1. On the **Set up single sign-on with SAML** page, In the **SAML Signing Certificate** section, click copy button to copy **App Federation Metadata Url** and save it on your computer.

	![The Certificate download link](common/copy-metadataurl.png)

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Cloud Academy - SSO.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Cloud Academy - SSO**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Cloud Academy-SSO SSO

1. In a different browser window, sign on to your Cloud Academy - SSO company site as administrator.

1. Click on the company's name and select **Settings & Integrations** from the menu.

    ![Configuration ](./media/cloud-academy-sso-tutorial/config-1.PNG)

1. In the **Settings & Integrations** page, go to the **Integrations** tab and click on **SSO** card.

    ![Configuration ](./media/cloud-academy-sso-tutorial/config-2.PNG)

1. Perform the following steps in the following page:

    ![Configuration ](./media/cloud-academy-sso-tutorial/config-3.PNG)

    a. In the **Entity ID URL** textbox, paste the **Entity ID** value which you have copied from the Azure portal.

    b. In the **SSO URL** textbox, paste the **Login URL** value which you have copied from the Azure portal.

    c. Open the downloaded **Certificate (Base64)** from the Azure portal into Notepad and paste the content into the **Certificate** textbox.

    d. In the **Name ID Format** textbox, The default value, `urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified`

1. Click on **Save** button.

    > [!NOTE]
	> For more information on how to configure the Cloud Academy - SSO, please refer [Support article](https://support.cloudacademy.com/hc/articles/360043908452-Setting-Up-Single-Sign-On).

### Create Cloud Academy-SSO test user

1. Login to the **Cloud Academy - SSO** .

1. Click on the company's name and select **Members** from the menu.

    ![ Create test user ](./media/cloud-academy-sso-tutorial/create-user.PNG)

1. Click on **Invite Members** and select **Invite a Single Member**.

    ![ Create test user ](./media/cloud-academy-sso-tutorial/create-user-1.PNG)

1. Enter the required fields and click on **Invite**.

    ![ Create test user ](./media/cloud-academy-sso-tutorial/create-user-2.PNG)

## Test SSO 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Cloud Academy - SSO tile in the Access Panel, you should be automatically signed in to the Cloud Academy - SSO for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [ List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory ](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory? ](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [Try Cloud Academy - SSO with Azure AD](https://aad.portal.azure.com/)

- [What is session control in Microsoft Cloud App Security?](https://docs.microsoft.com/cloud-app-security/proxy-intro-aad)

- [How to protect Cloud Academy - SSO with advanced visibility and controls](https://docs.microsoft.com/cloud-app-security/proxy-intro-aad)
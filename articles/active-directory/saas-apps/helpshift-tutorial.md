---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with Helpshift | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Helpshift.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 114de95d-e9a7-4f87-b14d-54b91a63ce49
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: tutorial
ms.date: 12/20/2019
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with Helpshift

In this tutorial, you'll learn how to integrate Helpshift with Azure Active Directory (Azure AD). When you integrate Helpshift with Azure AD, you can:

* Control in Azure AD who has access to Helpshift.
* Enable your users to be automatically signed-in to Helpshift with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Helpshift single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Helpshift supports **SP and IDP** initiated SSO

## Adding Helpshift from the gallery

To configure the integration of Helpshift into Azure AD, you need to add Helpshift from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Helpshift** in the search box.
1. Select **Helpshift** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD single sign-on for Helpshift

Configure and test Azure AD SSO with Helpshift using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Helpshift.

To configure and test Azure AD SSO with Helpshift, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    * **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    * **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Helpshift SSO](#configure-helpshift-sso)** - to configure the single sign-on settings on application side.
    * **[Create Helpshift test user](#create-helpshift-test-user)** - to have a counterpart of B.Simon in Helpshift that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **Helpshift** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, enter the values for the following fields:

    a. In the **Identifier** text box, type a URL using the following pattern:
    `https://<YourDOMAIN>.helpshift.com/`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://<YourDOMAIN>.helpshift.com/login/saml/acs/`

1. Click **Set additional URLs** and perform the following steps if you wish to configure the application in **SP** initiated mode:

    d. In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://<YourDOMAIN>.helpshift.com/login/saml/idp-login/`

    e. In the **Relay State** text box, type a URL using the following pattern:
    `https://<YourDOMAIN>.helpshift.com/`

    > [!NOTE]
    > These values are not real. Update these values with the actual Identifier, Reply URL, Sign-on URL and Relay State. Contact [Helpshift Client support team](mailto:support@helpshift.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. On the **Set up Helpshift** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Helpshift.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Helpshift**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Helpshift SSO

1. In a different web browser, Sign in to your Helpshift application as an administrator.

1. Open the Helpshift **Dashboard** and click on **Settings icon**.

	![The Helpshift Configuration](./media/helpshift-tutorial/configuration01.png)

1. Click **Integrations** tab and perform the following steps:

	![The Helpshift Configuration](./media/helpshift-tutorial/configuration02.png)

    a. Turn on the **Single Sign-On(SAML – SSO)**.

    b. Select **Identity Provider(IDP)** as **Azure Active Directory**.

    c. In the **SAML 2.0 Endpoint URL** textbox, paste the **Login URL** value, which you have copied from the Azure portal.

    d. Open downloaded **Certificate (Base64)** file into Notepad, copy the content of the file (without using the ‘—–BEGIN CERTIFICATE—–‘ and ‘—–END CERTIFICATE—–‘ lines) and paste it into **X.509 Certificate** textbox.

    e. In the **Issuer URL** textbox, paste the **Azure AD Identifier** value, which you have copied from the Azure portal.

    f. Click on **APPLY CHANGES**.

### Create Helpshift test user

In this section, you create a user called B.Simon in Helpshift. Work with [Helpshift Client support team](mailto:support@helpshift.com) to add the users in the Helpshift platform. Users must be created and activated before you use single sign-on.

## Test SSO

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Helpshift tile in the Access Panel, you should be automatically signed in to the Helpshift for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [ List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory ](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory? ](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [Try Helpshift with Azure AD](https://aad.portal.azure.com/)
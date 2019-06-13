---
title: 'Tutorial: Azure Active Directory integration with TigerText Secure Messenger | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and TigerText Secure Messenger.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 03f1e128-5bcb-4e49-b6a3-fe22eedc6d5e
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 03/29/2019
ms.author: jeedes

---

# Tutorial: Azure Active Directory integration with TigerText Secure Messenger

In this tutorial, you learn how to integrate TigerText Secure Messenger with Azure Active Directory (Azure AD).

Integrating TigerText Secure Messenger with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to TigerText Secure Messenger.
* You can enable your users to be automatically signed in to TigerText Secure Messenger (single sign-on) with their Azure AD accounts.
* You can manage your accounts in one central location: the Azure portal.

For details about software as a service (SaaS) app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).

## Prerequisites

To configure Azure AD integration with TigerText Secure Messenger, you need the following items:

* An Azure AD subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.
* A TigerText Secure Messenger subscription with single sign-on enabled.

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment and integrate TigerText Secure Messenger with Azure AD.

TigerText Secure Messenger supports SP-initiated single sign-on (SSO).

## Add TigerText Secure Messenger from the Azure Marketplace

To configure the integration of TigerText Secure Messenger into Azure AD, you need to add TigerText Secure Messenger from the Azure Marketplace to your list of managed SaaS apps:

1. Sign in to the [Azure portal](https://portal.azure.com?azure-portal=true).
1. In the left pane, select **Azure Active Directory**.

    ![The Azure Active Directory option](common/select-azuread.png)

1. Go to **Enterprise Applications**, and then select **All Applications**.

    ![The Enterprise applications pane](common/enterprise-applications.png)

1. To add a new application, select **+ New application** at the top of the pane.

    ![The New application option](common/add-new-app.png)

1. In the search box, enter **TigerText Secure Messenger**. In the search results, select **TigerText Secure Messenger**, and then select **Add** to add the application.

    ![TigerText Secure Messenger in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with TigerText Secure Messenger based on a test user named **Britta Simon**. For single sign-on to work, you must establish a link between an Azure AD user and the related user in TigerText Secure Messenger.

To configure and test Azure AD single sign-on with TigerText Secure Messenger, you need to complete the following building blocks:

1. **[Configure Azure AD single sign-on](#configure-azure-ad-single-sign-on)** to enable your users to use this feature.
1. **[Configure TigerText Secure Messenger single sign-on](#configure-tigertext-secure-messenger-single-sign-on)** to configure the single sign-on settings on the application side.
1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** to test Azure AD single sign-on with Britta Simon.
1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** to enable Britta Simon to use Azure AD single sign-on.
1. **[Create a TigerText Secure Messenger test user](#create-a-tigertext-secure-messenger-test-user)** so that there's a user named Britta Simon in TigerText Secure Messenger who's linked to the Azure AD user named Britta Simon.
1. **[Test single sign-on](#test-single-sign-on)** to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with TigerText Secure Messenger, take the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **TigerText Secure Messenger** application integration page, select **Single sign-on**.

    ![Configure single sign-on option](common/select-sso.png)

1. On the **Select a single sign-on method** pane, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

1. On the **Set up Single Sign-On with SAML** pane, select **Edit** (the pencil icon) to open the **Basic SAML Configuration** pane.

    ![Edit Basic SAML Configuration](common/edit-urls.png)

1. In the **Basic SAML Configuration** pane, take the following steps:

    ![TigerText Secure Messenger domain and URLs single sign-on information](common/sp-identifier.png)

    1. In the **Sign on URL** box, enter a URL:

       `https://home.tigertext.com`

    1. In the **Identifier (Entity ID)** box, type a URL by using the following pattern:

       `https://saml-lb.tigertext.me/v1/organization/<instance ID>`

    > [!NOTE]
    > The **Identifier (Entity ID)** value isn't real. Update this value with the actual identifier. To get the value, contact the [TigerText Secure Messenger support team](mailto:prosupport@tigertext.com). You can also refer to the patterns shown in the **Basic SAML Configuration** pane in the Azure portal.

1. On the **Set up Single Sign-On with SAML** pane, in the **SAML Signing Certificate** section, select **Download** to download the **Federation Metadata XML** from the given options and save it on your computer.

    ![The Federation Metadata XML download option](common/metadataxml.png)

1. In the **Set up TigerText Secure Messenger** section, copy the URL or URLs that you need:

   * **Login URL**
   * **Azure AD Identifier**
   * **Logout URL**

    ![Copy configuration URLs](common/copy-configuration-urls.png)

### Configure TigerText Secure Messenger single sign-on

To configure single sign-on on the TigerText Secure Messenger side, you need to send the downloaded Federation Metadata XML and the appropriate copied URLs from the Azure portal to the [TigerText Secure Messenger support team](mailto:prosupport@tigertext.com). The TigerText Secure Messenger team will make sure the SAML SSO connection is set properly on both sides.

### Create an Azure AD test user

In this section, you create a test user named Britta Simon in the Azure portal.

1. In the Azure portal, in the left pane, select **Azure Active Directory**   > **Users** > **All users**.

    ![The Users and "All users" options](common/users.png)

1. At the top of the screen, select **+ New user**.

    ![New user option](common/new-user.png)

1. In the **User** pane, do the following steps:

    ![The User pane](common/user-properties.png)

    1. In the **Name** box, enter **BrittaSimon**.
  
    1. In the **User name** box, enter **BrittaSimon\@\<yourcompanydomain>.\<extension>**. For example, **BrittaSimon\@contoso.com**.

    1. Select the **Show password** check box, and then write down the value that's displayed in the **Password** box.

    1. Select **Create**.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting them access to TigerText Secure Messenger.

1. In the Azure portal, select **Enterprise applications** > **All applications** > **TigerText Secure Messenger**.

    ![Enterprise applications pane](common/enterprise-applications.png)

1. In the applications list, select **TigerText Secure Messenger**.

    ![TigerText Secure Messenger in the applications list](common/all-applications.png)

1. In the left pane, under **MANAGE**, select **Users and groups**.

    ![The "Users and groups" option](common/users-groups-blade.png)

1. Select **+ Add user**, and then select **Users and groups** in the **Add Assignment** pane.

    ![The Add Assignment pane](common/add-assign-user.png)

1. In the **Users and groups** pane, select **Britta Simon** in the **Users** list, and then choose **Select** at the bottom of the pane.

1. If you're expecting a role value in the SAML assertion, then in the **Select Role** pane, select the appropriate role for the user from the list. At the bottom of the pane, choose **Select**.

1. In the **Add Assignment** pane, select **Assign**.

### Create a TigerText Secure Messenger test user

In this section, you create a user called Britta Simon in TigerText Secure Messenger. Work with the [TigerText Secure Messenger support team](mailto:prosupport@tigertext.com) to add Britta Simon as a user in TigerText Secure Messenger. Users must be created and activated before you use single sign-on.

### Test single sign-on

In this section, you test your Azure AD single sign-on configuration by using the My Apps portal.

When you select **TigerText Secure Messenger** in the My Apps portal, you should be automatically signed in to the TigerText Secure Messenger subscription for which you set up single sign-on. For more information about the My Apps portal, see [Access and use apps on the My Apps portal](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

* [List of tutorials for integrating SaaS apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

* [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

* [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

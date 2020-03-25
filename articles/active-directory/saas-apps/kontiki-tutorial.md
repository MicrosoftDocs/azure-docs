---
title: 'Tutorial: Azure Active Directory integration with Kontiki | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Kontiki.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 8d5e5413-da4c-40d8-b1d0-f03ecfef030b
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 04/14/2019
ms.author: jeedes

ms.collection: M365-identity-device-management
---
# Tutorial: Azure Active Directory integration with Kontiki

In this tutorial, you learn how to integrate Kontiki with Azure Active Directory (Azure AD).

Integrating Kontiki with Azure AD gives you the following benefits:

* You can use Azure AD to control who has access to Kontiki.
* Users can be automatically signed in to Kontiki with their Azure AD accounts (single sign-on).
* You can manage your accounts in one central location, the Azure portal.

For more information about software as a service (SaaS) app integration with Azure AD, see [Single sign-on to applications in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).

## Prerequisites

To configure Azure AD integration with Kontiki, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
* A Kontiki subscription with single sign-on enabled.

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment and integrate Kontiki with Azure AD.

Kontiki supports the following features:

* **SP-initiated single sign-on**
* **Just-in-time user provisioning**

## Add Kontiki in the Azure portal

To integrate Kontiki with Azure AD, you must add Kontiki to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the left menu, select **Azure Active Directory**.

	![The Azure Active Directory option](common/select-azuread.png)

1. Select **Enterprise applications** > **All applications**.

	![The Enterprise applications pane](common/enterprise-applications.png)

1. To add an application, select **New application**.

	![The New application option](common/add-new-app.png)

1. In the search box, enter **Kontiki**. In the search results, select **Kontiki**, and then select **Add**.

	![Kontiki in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Kontiki based on a test user named **Britta Simon**. For single sign-on to work, you must establish a linked relationship between an Azure AD user and the related user in Kontiki.

To configure and test Azure AD single sign-on with Kontiki, you must complete the following building blocks:

| Task | Description |
| --- | --- |
| **[Configure Azure AD single sign-on](#configure-azure-ad-single-sign-on)** | Enables your users to use this feature. |
| **[Configure Kontiki single sign-on](#configure-kontiki-single-sign-on)** | Configures the single sign-on settings in the application. |
| **[Create an Azure AD test user](#create-an-azure-ad-test-user)** | Tests Azure AD single sign-on for a user named Britta Simon. |
| **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** | Enables Britta Simon to use Azure AD single sign-on. |
| **[Create a Kontiki test user](#create-a-kontiki-test-user)** | Creates a counterpart of Britta Simon in Kontiki that is linked to the Azure AD representation of the user. |
| **[Test single sign-on](#test-single-sign-on)** | Verifies that the configuration works. |

### Configure Azure AD single sign-on

In this section, you configure Azure AD single sign-on with Kontiki in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), in the **Kontiki** application integration pane, select **Single sign-on**.

    ![Configure single sign-on option](common/select-sso.png)

1. In the **Select a single sign-on method** pane, select **SAML** or **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

1. In the **Set up Single Sign-On with SAML** pane, select **Edit** (the pencil icon) to open the **Basic SAML Configuration** pane.

	![Edit Basic SAML Configuration](common/edit-urls.png)

1. In the **Basic SAML Configuration** pane, in the **Sign on URL** text box, enter a URL that has the following pattern: `https://<companyname>.mc.eval.kontiki.com`

    ![Kontiki Domain and URLs single sign-on information](common/sp-signonurl.png)

   	> [!NOTE]
	> Contact the [Kontiki Client support team](https://customersupport.kontiki.com/enterprise/contactsupport.html) to get the correct value to use. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. In the **Set up Single Sign-On with SAML** pane, in the **SAML Signing Certificate** section, select **Download** next to **Federation Metadata XML**. Select a download option based on your requirements. Save the certificate on your computer.

	![The Federation Metadata XML certificate download option](common/metadataxml.png)

1. In the **Set up Kontiki** section, copy the following URLs based on your requirements:

	* Login URL
	* Azure AD Identifier
	* Logout URL

	![Copy configuration URLs](common/copy-configuration-urls.png)

### Configure Kontiki single sign-on

To configure single sign-on on the Kontiki side, send the downloaded Federation Metadata XML file and the relevant URLs that you copied from the Azure portal to the [Kontiki support team](https://customersupport.kontiki.com/enterprise/contactsupport.html). The Kontiki support team uses the information you send them to ensure that the SAML single sign-on connection is set properly on both sides.

### Create an Azure AD test user 

In this section, you create a test user named Britta Simon in the Azure portal.

1. In the Azure portal, select **Azure Active Directory** > **Users** > **All users**.

    ![The Users and All users options](common/users.png)

1. Select **New user**.

    ![The New user option](common/new-user.png)

1. In the **User** pane, complete the following steps:

    1. In the **Name** box, enter **BrittaSimon**.
  
    1. In the **User name** box, enter **brittasimon\@\<your-company-domain>.\<extension>**. For example, **brittasimon\@contoso.com**.

    1. Select the **Show password** check box. Write down the value that's displayed in the **Password** box.

    1. Select **Create**.

	![The User pane](common/user-properties.png)

### Assign the Azure AD test user

In this section, you grant Britta Simon access to Kontiki so she can use Azure single sign-on.

1. In the Azure portal, select **Enterprise applications** > **All applications** > **Kontiki**.

	![The Enterprise applications pane](common/enterprise-applications.png)

1. In the applications list, select **Kontiki**.

	![Kontiki in the applications list](common/all-applications.png)

1. In the menu, select **Users and groups**.

    ![The Users and groups option](common/users-groups-blade.png)

1. Select **Add user**. Then, in the **Add assignment** pane, select **Users and groups**.

    ![The Add assignment pane](common/add-assign-user.png)

1. In the **Users and groups** pane, select **Britta Simon** in the list of users. Choose **Select**.

1. If you are expecting a role value in the SAML assertion, in the **Select role** pane, select the relevant role for the user from the list. Choose **Select**.

1. In the **Add Assignment** pane, select **Assign**.

### Create a Kontiki test user

There's no action item for you to configure user provisioning in Kontiki. When an assigned user tries to sign in to Kontiki by using the My Apps portal, Kontiki checks whether the user exists. If no user account is found, Kontiki automatically creates the user account.

### Test single sign-on

In this section, you test your Azure AD single sign-on configuration by using the My Apps portal.

After you set up single sign-on, when you select **Kontiki** in the My Apps portal, you are automatically signed in to Kontiki. For more information about the My Apps portal, see [Access and use apps in the My Apps portal](../user-help/my-apps-portal-end-user-access.md).

## Next steps

To learn more, review these articles:

- [List of tutorials for integrating SaaS apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)
- [Single sign-on to applications in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)
- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

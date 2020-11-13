---
title: 'Tutorial: Azure Active Directory integration with Sectigo Certificate Manager | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Sectigo Certificate Manager.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 04/15/2019
ms.author: jeedes
---
# Tutorial: Azure Active Directory integration with Sectigo Certificate Manager

In this tutorial, you learn how to integrate Sectigo Certificate Manager (also called SCM) with Azure Active Directory (Azure AD).

Integrating Sectigo Certificate Manager with Azure AD gives you the following benefits:

* You can use Azure AD to control who has access to Sectigo Certificate Manager.
* Users can be automatically signed in to Sectigo Certificate Manager with their Azure AD accounts (single sign-on).
* You can manage your accounts in one central location, the Azure portal.

For more information about software as a service (SaaS) app integration with Azure AD, see [Single sign-on to applications in Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Azure AD integration with Sectigo Certificate Manager, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
* Sectigo Certificate Manager account.

> [!NOTE]
> Sectigo runs multiple instances of Sectigo Certificate Manager. The main instance of Sectigo Certificate Manager is  **https:\//cert-manager.com**, and this URL is used in this tutorial.  If your account is on a different instance, you must adjust the URLs accordingly.

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment and integrate Sectigo Certificate Manager with Azure AD.

Sectigo Certificate Manager supports the following features:

* **SP-initiated single sign-on**
* **IDP-initiated single sign-on**

## Add Sectigo Certificate Manager in the Azure portal

To integrate Sectigo Certificate Manager with Azure AD, you must add Sectigo Certificate Manager to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the left menu, select **Azure Active Directory**.

	![The Azure Active Directory option](common/select-azuread.png)

1. Select **Enterprise applications** > **All applications**.

	![The Enterprise applications pane](common/enterprise-applications.png)

1. To add an application, select **New application**.

	![The New application option](common/add-new-app.png)

1. In the search box, enter **Sectigo Certificate Manager**. In the search results, select **Sectigo Certificate Manager**, and then select **Add**.

	![Sectigo Certificate Manager in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Sectigo Certificate Manager based on a test user named **Britta Simon**. For single sign-on to work, you must establish a linked relationship between an Azure AD user and the related user in Sectigo Certificate Manager.

To configure and test Azure AD single sign-on with Sectigo Certificate Manager, you must complete the following building blocks:

| Task | Description |
| --- | --- |
| **[Configure Azure AD single sign-on](#configure-azure-ad-single-sign-on)** | Enables your users to use this feature. |
| **[Configure Sectigo Certificate Manager single sign-on](#configure-sectigo-certificate-manager-single-sign-on)** | Configures the single sign-on settings in the application. |
| **[Create an Azure AD test user](#create-an-azure-ad-test-user)** | Tests Azure AD single sign-on for a user named Britta Simon. |
| **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** | Enables Britta Simon to use Azure AD single sign-on. |
| **[Create a Sectigo Certificate Manager test user](#create-a-sectigo-certificate-manager-test-user)** | Creates a counterpart of Britta Simon in Sectigo Certificate Manager that is linked to the Azure AD representation of the user. |
| **[Test single sign-on](#test-single-sign-on)** | Verifies that the configuration works. |

### Configure Azure AD single sign-on

In this section, you configure Azure AD single sign-on with Sectigo Certificate Manager in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), in the **Sectigo Certificate Manager** application integration pane, select **Single sign-on**.

    ![Configure single sign-on option](common/select-sso.png)

1. In the **Select a single sign-on method** pane, select **SAML** or **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

1. In the **Set up Single Sign-On with SAML** pane, select **Edit** (the pencil icon) to open the **Basic SAML Configuration** pane.

	![Edit Basic SAML Configuration](common/edit-urls.png)

1. In the **Basic SAML Configuration** section complete the following steps:

    1. In the **Identifier (Entity ID)** box, for the main Sectigo Certificate Manager instance, enter **https:\//cert-manager.com/shibboleth**.

    1. In the **Reply URL** box, for the main Sectigo Certificate Manager instance, enter **https:\//cert-manager.com/Shibboleth.sso/SAML2/POST**.
        
    > [!NOTE]
    > Although in general, the **Sign-on URL** is mandatory for *SP-initiated mode*, it isn't needed to log in from Sectigo Certificate Manager.        

1. Optionally, in the **Basic SAML Configuration** section, to configure *IDP-initiated mode* and to allow **Test** to work, complete the following steps:

	1. Select **Set additional URLs**.

	1. In the **Relay State** box, enter your Sectigo Certificate Manager customer-specific URL. For the main Sectigo Certificate Manager instance, enter **https:\//cert-manager.com/customer/\<customerURI\>/idp**.

    ![Sectigo Certificate Manager domain and URLs single sign-on information](common/idp-relay.png)

1. In the **User Attributes & Claims** section, complete the following steps:

	1. Delete all **Additional claims**.
	
	1. Select **Add new claim** and add the following four claims:
	
        | Name | Namespace | Source | Source attribute | Description |
        | --- | --- | --- | --- | --- |
        | eduPersonPrincipalName | empty | Attribute | user.userprincipalname | Must match the **IdP Person ID** field in Sectigo Certificate Manager for Admins. |
        | mail | empty | Attribute | user.mail | Required |
        | givenName | empty | Attribute | user.givenname | Optional |
        | sn | empty | Attribute | user.surname | Optional |

       ![Sectigo Certificate Manager - Add four new claims](media/sectigo-certificate-manager-tutorial/additional-claims.png)

1. In the **SAML Signing Certificate** section, select **Download** next to **Federation Metadata XML**. Save the XML file on your computer.

	![The Federation Metadata XML download option](common/metadataxml.png)

### Configure Sectigo Certificate Manager single sign-on

To configure single sign-on on the Sectigo Certificate Manager side, send the downloaded Federation Metadata XML file to the [Sectigo Certificate Manager support team](https://sectigo.com/support). The Sectigo Certificate Manager support team uses the information you send them to ensure that the SAML single sign-on connection is set properly on both sides.

### Create an Azure AD test user 

In this section, you create a test user named Britta Simon in the Azure portal.

1. In the Azure portal, select **Azure Active Directory** > **Users** > **All users**.

    ![The Users and All users options](common/users.png)

1. Select **New user**.

    ![The New user option](common/new-user.png)

1. In the **User** pane, complete the following steps:

    1. In the **Name** box, enter **BrittaSimon**.
  
    1. In the **User name** box, enter **brittasimon\@\<your-company-domain>.\<extension\>**. For example, **brittasimon\@contoso.com**.

    1. Select the **Show password** check box. Record the value that's displayed in the **Password** box.

    1. Select **Create**.

	![The User pane](common/user-properties.png)

### Assign the Azure AD test user

In this section, you grant Britta Simon access to Sectigo Certificate Manager so that the user can use Azure single sign-on.

1. In the Azure portal, select **Enterprise applications** > **All applications** > **Sectigo Certificate Manager**.

	![The Enterprise applications pane](common/enterprise-applications.png)

1. In the applications list, select **Sectigo Certificate Manager**.

	![Sectigo Certificate Manager in the applications list](common/all-applications.png)

1. In the menu, select **Users and groups**.

    ![The Users and groups option](common/users-groups-blade.png)

1. Select **Add user**. Then, in the **Add assignment** pane, select **Users and groups**.

    ![The Add assignment pane](common/add-assign-user.png)

1. In the **Users and groups** pane, select **Britta Simon** in the list of users. Choose **Select**.

1. If you are expecting a role value in the SAML assertion, in the **Select role** pane, select the relevant role for the user from the list. Choose **Select**.

1. In the **Add Assignment** pane, select **Assign**.

### Create a Sectigo Certificate Manager test user

In this section, you create a user named Britta Simon in Sectigo Certificate Manager. Work with the [Sectigo Certificate Manager support team](https://sectigo.com/support) to add the user in the Sectigo Certificate Manager platform. Users must be created and activated before you use single sign-on.

### Test single sign-on

In this section, you test your Azure AD single sign-on configuration.

#### Test from Sectigo Certificate Manager (SP-initiated single sign-on)

Browse to your customer-specific URL (for the main Sectigo Certificate Manager instance, https:\//cert-manager.com/customer/\<customerURI\>/, and select the button below **Or Sign In With**.  If configured correctly, you will be automatically signed in to Sectigo Certificate Manager.

#### Test from Azure single sign-on configuration (IDP-initiated single sign-on)

In the **Sectigo Certificate Manager** application integration pane, select **Single sign-on** and select the **Test** button.  If configured correctly, you will be automatically signed in to Sectigo Certificate Manager.

#### Test by using the My Apps portal (IDP-initiated single sign-on)

Select **Sectigo Certificate Manager** in the My Apps portal.  If configured correctly you will be automatically signed in to Sectigo Certificate Manager. For more information about the My Apps portal, see [Access and use apps in the My Apps portal](../user-help/my-apps-portal-end-user-access.md).

## Next steps

To learn more, review these articles:

- [List of tutorials for integrating SaaS apps with Azure Active Directory](./tutorial-list.md)
- [Single sign-on to applications in Azure Active Directory](../manage-apps/what-is-single-sign-on.md)
- [What is Conditional Access in Azure Active Directory?](../conditional-access/overview.md)
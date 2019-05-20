---
title: 'Tutorial: Azure Active Directory integration with monday.com | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and monday.com.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 9e8ad807-0664-4e31-91de-731097c768e2
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 04/15/2019
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Azure Active Directory integration with monday.com

In this tutorial, you learn how to integrate monday.com with Azure Active Directory (Azure AD).

Integrating monday.com with Azure AD gives you the following benefits:

* You can use Azure AD to control who has access to monday.com.
* Users can be automatically signed in to monday.com with their Azure AD accounts (single sign-on).
* You can manage your accounts in one central location, the Azure portal.

For more information about software as a service (SaaS) app integration with Azure AD, see [Single sign-on to applications in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).

## Prerequisites

To configure Azure AD integration with monday.com, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.
* A monday.com subscription with single sign-on enabled.

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment and integrate monday.com with Azure AD.

monday.com supports the following features:

* **SP-initiated single sign-on**
* **IDP-initiated single sign-on**
* **Just-in-time user provisioning**

## Add monday.com in the Azure portal

To integrate monday.com with Azure AD, you must add monday.com to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the left menu, select **Azure Active Directory**.

	![The Azure Active Directory option](common/select-azuread.png)

1. Select **Enterprise applications** > **All applications**.

	![The Enterprise applications pane](common/enterprise-applications.png)

1. To add an application, select **New application**.

	![The New application option](common/add-new-app.png)

1. In the search box, enter **monday.com**. In the search results, select **monday.com**, and then select **Add**.

	![monday.com in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with monday.com based on a test user named **Britta Simon**. For single sign-on to work, you must establish a linked relationship between an Azure AD user and the related user in monday.com.

To configure and test Azure AD single sign-on with monday.com, you must complete the following building blocks:

| Task | Description |
| --- | --- |
| **[Configure Azure AD single sign-on](#configure-azure-ad-single-sign-on)** | Enables your users to use this feature. |
| **[Configure monday.com single sign-on](#configure-mondaycom-single-sign-on)** | Configures the single sign-on settings in the application. |
| **[Create an Azure AD test user](#create-an-azure-ad-test-user)** | Tests Azure AD single sign-on for a user named Britta Simon. |
| **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** | Enables Britta Simon to use Azure AD single sign-on. |
| **[Create a monday.com test user](#create-a-mondaycom-test-user)** | Creates a counterpart of Britta Simon in monday.com that is linked to the Azure AD representation of the user. |
| **[Test single sign-on](#test-single-sign-on)** | Verifies that the configuration works. |

### Configure Azure AD single sign-on

In this section, you configure Azure AD single sign-on with monday.com in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), in the **monday.com** application integration pane, select **Single sign-on**.

    ![Configure single sign-on option](common/select-sso.png)

1. In the **Select a single sign-on method** pane, select **SAML** or **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

1. In the **Set up Single Sign-On with SAML** pane, select **Edit** (the pencil icon) to open the **Basic SAML Configuration** pane.

	![Edit Basic SAML Configuration](common/edit-urls.png)

1. In the **Basic SAML Configuration** pane, if you have a service provider metadata file and you want to configure *IDP-initiated mode*, complete the following steps:

	1. Select **Upload metadata file**.

       ![The Upload metadata file option](common/upload-metadata.png)

	1. To select the metadata file, select the folder icon, and then select **Upload**.

	   ![Select the metadata file and then select the Upload button](common/browse-upload-metadata.png)

	1. After the metadata file is successfully uploaded, the **Identifier** and **Reply URL** values are automatically populated in the **Basic SAML Configuration** pane:

	   ![The IDP values in the Basic SAML Configuration pane](common/idp-intiated.png)

	   > [!Note]
	   > If the **Identifier** and **Reply URL** values aren't automatically populated, enter the values manually.

1. To configure the application in *SP-initiated mode*:

    1. Select **Set additional URLs**.
	
	1. In the **Sign on URL** box, enter a URL that has the following pattern: https:\//\<your-domain>.monday.com. Contact the [monday.com client support team](mailto:support@monday.com) to get the sign-on URL.

		![The Set additional URLs option](common/metadata-upload-additional-signon.png)

1. The monday.com application expects the SAML assertions to be in a specific format. Configure the following claims for this application. To manage these attribute values, in the **Set up Single Sign-On with SAML** pane, select **Edit** to open the **User Attributes** pane.

	![The User attributes pane](common/edit-attribute.png)

1. Under **User claims**, select **Edit** to edit the claims. To add a claim, select **Add new claim**, and then configure the SAML token attribute as shown in the preceding image. Then, complete the following steps: 

	1. Select **Add new claim**.

	    ![The Add new claim option in the User claims pane](common/new-save-attribute.png)

	1. In the **Manage user claims** pane, set the following values:
		
	   1. In the **Name** box, enter the attribute name shown for the user claim row.

       1. Leave **Namespace** blank.

	   1. For **Source**, select **Attribute**.

	   1. In the **Source attribute** list, select the attribute value shown for the user claim row.

	   1. Select **OK**, and then select **Save**.

       ![The Manage user claims](common/new-attribute-details.png)

1. In the **Set up Single Sign-On with SAML** pane, under **SAML Signing Certificate**, select **Download** next to **Certificate (Base64)**. Select a download option based on your requirements. Save the certificate on your computer.

	![The Certificate (Base64) download option](common/certificatebase64.png)

1. In the **Set up monday.com** section, copy the following URLs based on your requirements:

	* Login URL
	* Azure AD Identifier
	* Logout URL

	![Copy configuration URLs](common/copy-configuration-urls.png)

### Configure monday.com single sign-on

To configure single sign-on on the monday.com side, send the downloaded Certificate (Base64) file and the relevant URLs that you copied from the Azure portal to the [monday.com support team](mailto:support@monday.com). The monday.com support team uses the information you send them to ensure that the SAML single sign-on connection is set properly on both sides.

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

In this section, you grant Britta Simon access to monday.com so she can use Azure single sign-on.

1. In the Azure portal, select **Enterprise applications** > **All applications** > **monday.com**.

	![The Enterprise applications pane](common/enterprise-applications.png)

1. In the applications list, select **monday.com**.

	![monday.com in the applications list](common/all-applications.png)

1. In the menu, select **Users and groups**.

    ![The Users and groups option](common/users-groups-blade.png)

1. Select **Add user**. Then, in the **Add assignment** pane, select **Users and groups**.

    ![The Add assignment pane](common/add-assign-user.png)

1. In the **Users and groups** pane, select **Britta Simon** in the list of users. Choose **Select**.

1. If you are expecting a role value in the SAML assertion, in the **Select role** pane, select the relevant role for the user from the list. Choose **Select**.

1. In the **Add Assignment** pane, select **Assign**.

### Create a monday.com test user

In this section, a user named Britta Simon is created in the monday.com application. monday.com supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in monday.com, a new one is created after authentication.

### Test single sign-on

In this section, you test your Azure AD single sign-on configuration by using the My Apps portal.

After you set up single sign-on, when you select **monday.com** in the My Apps portal, you are automatically signed in to monday.com. For more information about the My Apps portal, see [Access and use apps in the My Apps portal](../user-help/my-apps-portal-end-user-access.md).

## Next steps

To learn more, review these articles:

- [List of tutorials for integrating SaaS apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)
- [Single sign-on to applications in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)
- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

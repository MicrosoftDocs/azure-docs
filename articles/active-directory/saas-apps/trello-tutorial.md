---
title: 'Tutorial: Azure Active Directory integration with Trello | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Trello.
services: active-directory
documentationCenter: na
author: jeevansd
manager: daveba
ms.reviewer: barbkess

ms.assetid: cd5ae365-9ed6-43a6-920b-f7814b993949
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 01/02/2019
ms.author: jeedes

ms.collection: M365-identity-device-management
---
# Tutorial: Azure Active Directory integration with Trello

In this tutorial, you learn how to integrate Trello with Azure Active Directory (Azure AD).
Integrating Trello with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to Trello.
* You can enable your users to be automatically signed-in to Trello (single sign-on) with their Azure AD accounts.
* You can manage your accounts in one central location: the Azure portal.

For more information about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with Trello, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get a [one-month trial](https://azure.microsoft.com/pricing/free-trial/).
* A Trello single-sign-on-enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Trello supports SP- and IDP-initiated SSO

* Trello supports Just In Time user provisioning

## Add Trello from the gallery

To configure the integration of Trello into Azure AD, first add Trello from the gallery to your list of managed SaaS apps.

To add Trello from the gallery, take the following steps:

1. In the [Azure portal](https://portal.azure.com), in the left pane, select the **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Select **Enterprise Applications**, and then select **All Applications**.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add a new application, select the **New application** button at the top of the dialog box.

	![The New application button](common/add-new-app.png)

4. In the search box, enter **Trello**, and then select **Trello** from the results pane.

5. Select the **Add** button to add the application.

	 ![Trello in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Trello based on a test user called **Britta Simon**.

For single sign-on to work, you need to establish a link  between an Azure AD user and the related user in Trello.

To configure and test Azure AD single sign-on with Trello, you need to complete the following building blocks:

1. [Configure Azure AD single sign-on](#configure-azure-ad-single-sign-on) to enable your users to use this feature.
2. [Configure Trello single sign-on](#configure-trello-single-sign-on) to configure the single sign-on settings on the application side.
3. [Create an Azure AD test user](#create-an-azure-ad-test-user) to test Azure AD single sign-on with Britta Simon.
4. [Assign the Azure AD test user](#assign-the-azure-ad-test-user) to enable Britta Simon to use Azure AD single sign-on.
5. [Create a Trello test user](#create-a-trello-test-user) to have a counterpart of Britta Simon in Trello that is linked to the Azure AD representation of the user.
6. [Test single sign-on](#test-single-sign-on) to verify that the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

> [!NOTE]
> You should get the **\<enterprise\>** slug from Trello. If you don't have the slug value, contact the [Trello support team](mailto:support@trello.com) to get the slug for your enterprise.

To configure Azure AD single sign-on with Trello, take the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **Trello** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. In the **Select a Single sign-on method** dialog box, select **SAML** to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-on with SAML** page, select the **Edit** icon to open the **Basic SAML Configuration** dialog box.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4. In the **Basic SAML Configuration** section, if you want to configure the application in IDP-initiated mode, take the following steps:

    ![Trello domain and URLs single sign-on information](common/idp-intiated.png)

    a. In the **Identifier** box, enter a URL by using the following pattern:
    `https://trello.com/auth/saml/metadata`

    b. In the **Reply URL** box, enter a URL by using the following pattern:
    `https://trello.com/auth/saml/consume/<enterprise>`

5. Select **Set additional URLs**, and then take the following steps if you want to configure the application in SP-initiated mode:

    ![Trello domain and URLs single sign-on information](common/metadata-upload-additional-signon.png)

	In the **Sign-on URL** box, enter a URL by using the following pattern:
    `https://trello.com/auth/saml/login/<enterprise>`

	> [!NOTE]
	> These values are not real. Update these values with the actual identifier, reply URL, and sign-on URL. Contact the [Trello Client support team](mailto:support@trello.com) to get these values. You can also refer to the patterns in the **Basic SAML Configuration** section in the Azure portal.

6. The Trello application expects the SAML assertions in a specific format. Configure the following claims for this application. You can manage the values of these attributes from the **User Attributes** section on the application integration page. On the **Set up Single Sign-On with SAML** page, select the **Edit** button to open the **User Attributes** dialog box.

	![User Attributes dialog box](common/edit-attribute.png)

7. In the **User Claims** section in the **User Attributes** dialog box, configure the SAML token attribute as shown in the previous image. Then take the following steps:

	| Name |  Source Attribute|
    | --- | --- |
	| User.Email | user.mail |
	| User.FirstName | user.givenname |
	| User.LastName | user.surname |

	a. Select **Add new claim** to open the **Manage user claims** dialog box.

	![User claims dialog box](common/new-save-attribute.png)

	![Manage user claims](common/new-attribute-details.png)

	b. In the **Name** box, enter the attribute name that's shown for that row.

	c. Leave **Namespace** blank.

	d. For **Source**, select **Attribute**.

	e. In the **Source attribute** list, enter the attribute value that's shown for that row.

	f. Select **Ok**.

	g. Select **Save**.

8. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, select **Download** to download the **Certificate (Base64)** from the given options as per your requirements. Then save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

9. On the **Set up Trello** section, copy the appropriate URL(s) according to your requirements.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Azure AD identifier

	c. Logout URL

### Configure Trello single sign-on

To configure single sign-on on the Trello side, first send the downloaded **Certificate (Base64)** and copied URLs from the Azure portal to the [Trello support team](mailto:support@trello.com). They ensure that the SAML SSO connection is set properly on both sides.

### Create an Azure AD test user 

The objective of this section is to create a test user in the Azure portal called Britta Simon.

1. In the Azure portal, in the left pane, select **Azure Active Directory**, select **Users**, and then select **All users**.

    ![The "Users and groups" and "All users" links](common/users.png)

2. Select **New user** at the top of the screen.

    ![New user button](common/new-user.png)

3. In the **User** dialog box, take the following steps.

    ![The User dialog box](common/user-properties.png)

    a. In the **Name** field, enter **BrittaSimon**.
  
    b. In the **User name** field, enter "brittasimon@yourcompanydomain.extension". For example, in this case, you might enter "BrittaSimon@contoso.com".

    c. Select the **Show password** check box, and then note the value that's displayed in the **Password** box.

    d. Select **Create**.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Trello.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, and then select **Trello**.

	![Enterprise Applications blade](common/enterprise-applications.png)

2. In the applications list, select **Trello**.

	![The Trello link in the applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Select the **Add user** button. Then, in the **Add Assignment** dialog box, select **Users and groups**.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog box, select **Britta Simon** in the users list. Then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion, then, in the **Select Role** dialog box, select the appropriate role for the user from the list. Then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog box, select  the **Assign** button.

### Create a Trello test user

In this section, you create a user called Britta Simon in Trello. Trello supports Just in Time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in Trello, a new one is created after authentication.

> [!NOTE]
> If you need to create a user manually, contact the [Trello support team](mailto:support@trello.com).

### Test single sign-on 

In this section, you test your Azure AD single sign-on configuration by using the MyApps portal.

When you select the Trello tile in the MyApps portal, you should be automatically signed in to Trello. For more information about the My Apps portal, see [What is the MyApps portal?](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [List of tutorials on how to integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)


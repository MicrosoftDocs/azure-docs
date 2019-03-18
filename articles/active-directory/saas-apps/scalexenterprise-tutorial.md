---
title: 'Tutorial: Azure Active Directory integration with ScaleX Enterprise | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and ScaleX Enterprise.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: c2379a8d-a659-45f1-87db-9ba156d83183
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 03/15/2019
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with ScaleX Enterprise

In this tutorial, you learn how to integrate ScaleX Enterprise with Azure Active Directory (Azure AD).
Integrating ScaleX Enterprise with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to ScaleX Enterprise.
* You can enable your users to be automatically signed-in to ScaleX Enterprise (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with ScaleX Enterprise, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get one-month trial [here](https://azure.microsoft.com/pricing/free-trial/)
* ScaleX Enterprise single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* ScaleX Enterprise supports **SP and IDP** initiated SSO

## Adding ScaleX Enterprise from the gallery

To configure the integration of ScaleX Enterprise into Azure AD, you need to add ScaleX Enterprise from the gallery to your list of managed SaaS apps.

**To add ScaleX Enterprise from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Navigate to **Enterprise Applications** and then select the **All Applications** option.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add new application, click **New application** button on the top of dialog.

	![The New application button](common/add-new-app.png)

4. In the search box, type **ScaleX Enterprise**, select **ScaleX Enterprise** from result panel then click **Add** button to add the application.

	 ![ScaleX Enterprise in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with ScaleX Enterprise based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in ScaleX Enterprise needs to be established.

To configure and test Azure AD single sign-on with ScaleX Enterprise, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure ScaleX Enterprise Single Sign-On](#configure-scalex-enterprise-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Create ScaleX Enterprise test user](#create-scalex-enterprise-test-user)** - to have a counterpart of Britta Simon in ScaleX Enterprise that is linked to the Azure AD representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with ScaleX Enterprise, perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **ScaleX Enterprise** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, If you wish to configure the application in **IDP** initiated mode, perform the following steps:

    ![ScaleX Enterprise Domain and URLs single sign-on information](common/idp-intiated.png)

    a. In the **Identifier** text box, type a URL using the following pattern:
    `https://platform.rescale.com/saml2/<company id>/`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://platform.rescale.com/saml2/<company id>/acs/`

5. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    ![ScaleX Enterprise Domain and URLs single sign-on information](common/metadata-upload-additional-signon.png)

    In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://platform.rescale.com/saml2/<company id>/sso/`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier, Reply URL and Sign-on URL. Contact [ScaleX Enterprise Client support team](https://info.rescale.com/contact_sales) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

6. Your ScaleX Enterprise application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes, where as **emailaddress** is mapped with **user.mail**. ScaleX Enterprise application expects **emailaddress** to be mapped with **user.userprincipalname**, so you need to edit the attribute mapping by clicking on **Edit** icon and change the attribute mapping.

	![image](common/edit-attribute.png)

7. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Base64)** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

8. On the **Set up ScaleX Enterprise** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Azure AD Identifier

	c. Logout URL

### Configure ScaleX Enterprise Single Sign-On

1. To configure single sign-on on **ScaleX Enterprise** side, login to the ScaleX Enterprise company website as an administrator.

1. Click the menu in the upper right and select **Contoso Administration**.

	> [!NOTE]
	> Contoso is just an example. This should be your actual Company Name.

	![Configure Single Sign-On](./media/scalexenterprise-tutorial/Test_Admin.png)

1. Select **Integrations** from the top menu and select **Single Sign-On**.

	![Configure Single Sign-On](./media/scalexenterprise-tutorial/admin_sso.png) 

1. Complete the form as follows:

	![Configure Single Sign-On](./media/scalexenterprise-tutorial/scalex_admin_save.png)

	a. Select **Create any user who can authenticate with SSO**

	b. **Service Provider saml**: Paste the value ***urn:oasis:names:tc:SAML:2.0:nameid-format:persistent***

	c. **Name of Identity Provider email field in ACS response**: Paste the value `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress`

	d. **Identity Provider EntityDescriptor Entity ID:** Paste the **Azure AD Identifier** value copied from the Azure portal.

	e. **Identity Provider SingleSignOnService URL:** Paste the **Login URL** from the Azure portal.

	f. **Identity Provider public X509 certificate:** Open the X509 certificate downloaded from the Azure in notepad and paste the contents in this box. Ensure there are no line breaks in the middle of the certificate contents.

	g. Check the following checkboxes: **Enabled, Encrypt NameID and Sign AuthnRequests.**

	h. Click **Update SSO Settings** to save the settings.

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

1. In the Azure portal, in the left pane, select **Azure Active Directory**, select **Users**, and then select **All users**.

    ![The "Users and groups" and "All users" links](common/users.png)

2. Select **New user** at the top of the screen.

    ![New user Button](common/new-user.png)

3. In the User properties, perform the following steps.

    ![The User dialog box](common/user-properties.png)

    a. In the **Name** field enter **BrittaSimon**.
  
    b. In the **User name** field type **brittasimon@yourcompanydomain.extension**  
    For example, BrittaSimon@contoso.com

    c. Select **Show password** check box, and then write down the value that's displayed in the Password box.

    d. Click **Create**.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to ScaleX Enterprise.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **ScaleX Enterprise**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **ScaleX Enterprise**.

	![The ScaleX Enterprise link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog click the **Assign** button.

### Create ScaleX Enterprise test user

To enable Azure AD users to log in to ScaleX Enterprise, they must be provisioned in to ScaleX Enterprise. In the case of ScaleX Enterprise, provisioning is an automatic task and no manual steps are required. Any user who can successfully authenticate with SSO credentials will be automatically provisioned on the ScaleX side.

### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the ScaleX Enterprise tile in the Access Panel, you should be automatically signed in to the ScaleX Enterprise for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [ List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory ](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory? ](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)
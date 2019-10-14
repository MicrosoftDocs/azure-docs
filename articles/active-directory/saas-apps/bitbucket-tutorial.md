---
title: 'Tutorial: Azure Active Directory integration with SAML SSO for Bitbucket by resolution GmbH | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and SAML SSO for Bitbucket by resolution GmbH.
services: active-directory
documentationCenter: na
author: jeevansd
manager: daveba
ms.reviewer: barbkess

ms.assetid: fc947df1-f24e-43ae-9a34-518293583d69
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 12/27/2018
ms.author: jeedes

ms.collection: M365-identity-device-management
---
# Tutorial: Azure Active Directory integration with SAML SSO for Bitbucket by resolution GmbH

In this tutorial, you learn how to integrate SAML SSO for Bitbucket by resolution GmbH with Azure Active Directory (Azure AD).
Integrating SAML SSO for Bitbucket by resolution GmbH with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to SAML SSO for Bitbucket by resolution GmbH.
* You can enable your users to be automatically signed-in to SAML SSO for Bitbucket by resolution GmbH (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with SAML SSO for Bitbucket by resolution GmbH, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get one-month trial [here](https://azure.microsoft.com/pricing/free-trial/)
* SAML SSO for Bitbucket by resolution GmbH single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* SAML SSO for Bitbucket by resolution GmbH supports **SP and IDP** initiated SSO
* SAML SSO for Bitbucket by resolution GmbH supports **Just In Time** user provisioning


## Adding SAML SSO for Bitbucket by resolution GmbH from the gallery

To configure the integration of SAML SSO for Bitbucket by resolution GmbH into Azure AD, you need to add SAML SSO for Bitbucket by resolution GmbH from the gallery to your list of managed SaaS apps.

**To add SAML SSO for Bitbucket by resolution GmbH from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Navigate to **Enterprise Applications** and then select the **All Applications** option.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add new application, click **New application** button on the top of dialog.

	![The New application button](common/add-new-app.png)

4. In the search box, type **SAML SSO for Bitbucket by resolution GmbH**, select **SAML SSO for Bitbucket by resolution GmbH** from result panel then click **Add** button to add the application.

	 ![SAML SSO for Bitbucket by resolution GmbH in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with SAML SSO for Bitbucket by resolution GmbH based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in SAML SSO for Bitbucket by resolution GmbH needs to be established.

To configure and test Azure AD single sign-on with SAML SSO for Bitbucket by resolution GmbH, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure SAML SSO for Bitbucket by resolution GmbH Single Sign-On](#configure-saml-sso-for-bitbucket-by-resolution-gmbh-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Create SAML SSO for Bitbucket by resolution GmbH test user](#create-saml-sso-for-bitbucket-by-resolution-gmbh-test-user)** - to have a counterpart of Britta Simon in SAML SSO for Bitbucket by resolution GmbH that is linked to the Azure AD representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with SAML SSO for Bitbucket by resolution GmbH, perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **SAML SSO for Bitbucket by resolution GmbH** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, perform the following steps if you wish to configure the application in **IDP** initiated mode:

    ![SAML SSO for Bitbucket by resolution GmbH Domain and URLs single sign-on information](common/idp-intiated.png)

    a. In the **Identifier** text box, type a URL using the following pattern:
    `https://<server-base-url>/plugins/servlet/samlsso`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://<server-base-url>/plugins/servlet/samlsso`

    c. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    ![SAML SSO for Bitbucket by resolution GmbH Domain and URLs single sign-on information](common/metadata-upload-additional-signon.png)

	In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://<server-base-url>/plugins/servlet/samlsso`

    > [!NOTE]
	> These values are not real. Update these values with the actual Identifier, Reply URL and Sign-on URL. Contact [SAML SSO for Bitbucket by resolution GmbH Client support team](https://marketplace.atlassian.com/apps/1217045/saml-single-sign-on-sso-bitbucket?hosting=server&tab=support) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

5. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

### Configure SAML SSO for Bitbucket by resolution GmbH Single Sign-On

1. Sign-on to your SAML SSO for Bitbucket by resolution GmbH company site as administrator.

2. On the right side of the main toolbar, click **Settings**.

3. Go to ACCOUNTS section, click on **SAML SingleSignOn** on the Menubar.

	![The Samlsingle](./media/bitbucket-tutorial/tutorial_bitbucket_samlsingle.png)

4. On the **SAML SIngleSignOn Plugin Configuration page**, click **Add idp**. 

	![The Add idp](./media/bitbucket-tutorial/tutorial_bitbucket_addidp.png)

5. On the **Choose your SAML Identity Provider** Page, perform the following steps:

	![The identity provider](./media/bitbucket-tutorial/tutorial_bitbucket_identityprovider.png)

	a. Select **Idp Type** as **AZURE AD**.

	b. In the **Name** textbox, type the name.

	c. In the **Description** textbox, type the description.

	d. Click **Next**.

6. On the **Identity provider configuration page**, click **Next**.

	![The identity config](./media/bitbucket-tutorial/tutorial_bitbucket_identityconfig.png)

7.  On the **Import SAML Idp Metadata** Page, click **Load File** to upload the **METADATA XML** file which you have downloaded from Azure portal.

	![The idpmetadata](./media/bitbucket-tutorial/tutorial_bitbucket_idpmetadata.png)
	
8. Click **Next**.

9. Click **Save settings**.

	![The save](./media/bitbucket-tutorial/tutorial_bitbucket_save.png)

### Create an Azure AD test user 

The objective of this section is to create a test user in the Azure portal called Britta Simon.

1. In the Azure portal, in the left pane, select **Azure Active Directory**, select **Users**, and then select **All users**.

    ![The "Users and groups" and "All users" links](common/users.png)

2. Select **New user** at the top of the screen.

    ![New user Button](common/new-user.png)

3. In the User properties, perform the following steps.

    ![The User dialog box](common/user-properties.png)

    a. In the **Name** field enter **BrittaSimon**.
  
    b. In the **User name** field type **brittasimon\@yourcompanydomain.extension**  
    For example, BrittaSimon@contoso.com

    c. Select **Show password** check box, and then write down the value that's displayed in the Password box.

    d. Click **Create**.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to SAML SSO for Bitbucket by resolution GmbH.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **SAML SSO for Bitbucket by resolution GmbH**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, type and select **SAML SSO for Bitbucket by resolution GmbH**.

	![The SAML SSO for Bitbucket by resolution GmbH link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog click the **Assign** button.

### Create SAML SSO for Bitbucket by resolution GmbH test user

The objective of this section is to create a user called Britta Simon in SAML SSO for Bitbucket by resolution GmbH. SAML SSO for Bitbucket by resolution GmbH supports just-in-time provisioning and also users can be created manually, contact [SAML SSO for Bitbucket by resolution GmbH Client support team](https://marketplace.atlassian.com/plugins/com.resolution.atlasplugins.samlsso-bitbucket/server/support) as per your requirement.

### Test single sign-on 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the SAML SSO for Bitbucket by resolution GmbH tile in the Access Panel, you should be automatically signed in to the SAML SSO for Bitbucket by resolution GmbH for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)


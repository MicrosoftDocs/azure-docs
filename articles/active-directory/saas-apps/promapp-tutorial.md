---
title: 'Tutorial: Azure Active Directory integration with Promapp | Microsoft Docs'
description: In this tutorial, you'll learn how to configure single sign-on between Azure Active Directory and Promapp.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 418d0601-6e7a-4997-a683-73fa30a2cfb5
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 03/27/2019
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Promapp

In this tutorial, you'll learn how to integrate Promapp with Azure Active Directory (Azure AD).
This integration provides these benefits:

* You can use Azure AD to control who has access to Promapp.
* You can enable your users to be automatically signed in to Promapp (single sign-on) with their Azure AD accounts.
* You can manage your accounts in one central location: the Azure portal.

To learn more about SaaS app integration with Azure AD, see [Single sign-on to applications in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with Promapp, you need to have:

* An Azure AD subscription. If you don't have an Azure AD environment, you can sign up for a [one-month trial](https://azure.microsoft.com/pricing/free-trial/).
* A Promapp subscription that has single sign-on enabled.

## Scenario description

In this tutorial, you'll configure and test Azure AD single sign-on in a test environment.

* Promapp supports SP-initiated and IdP-initiated SSO.

* Promapp supports just-in-time user provisioning.

## Add Promapp from the gallery

To set up the integration of Promapp into Azure AD, you need to add Promapp from the gallery to your list of managed SaaS apps.

1. In the [Azure portal](https://portal.azure.com), in the left pane, select **Azure Active Directory**:

	![Select Azure Active Directory](common/select-azuread.png)

2. Go to **Enterprise applications** > **All applications**:

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add an application, select **New application** at the top of the window:

	![Select New application](common/add-new-app.png)

4. In the search box, enter **Promapp**. Select **Promapp** in the search results and then select **Add**.

	 ![Search results](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you'll configure and test Azure AD single sign-on with Promapp by using a test user named Britta Simon.
To enable single sign-on, you need to establish relationship between an Azure AD user and the corresponding user in Promapp.

To configure and test Azure AD single sign-on with Promapp, you need to complete these steps:

1. **[Configure Azure AD single sign-on](#configure-azure-ad-single-sign-on)** to enable the feature for your users.
2. **[Configure Promapp single sign-on](#configure-promapp-single-sign-on)** on the application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** to test Azure AD single sign-on.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** to enable Azure AD single sign-on for the user.
5. **[Create a Promapp test user](#create-a-promapp-test-user)** that's linked to the Azure AD representation of the user.
6. **[Test single sign-on](#test-single-sign-on)** to verify that the configuration works.

### Configure Azure AD single sign-on

In this section, you'll enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with Promapp, take these steps:

1. In the [Azure portal](https://portal.azure.com/), on the **Promapp** application integration page, select **Single sign-on**:

    ![Select single sign-on](common/select-sso.png)

2. In the **Select a single sign-on method** dialog box, select **SAML/WS-Fed** mode to enable single sign-on:

    ![Select a single sign-on method](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, select the **Edit** icon to open the **Basic SAML Configuration** dialog box:

	![Edit icon](common/edit-urls.png)

4. In the **Basic SAML Configuration** dialog box, if you want to configure the application in IdP-initiated mode, complete the following steps.

    ![Basic SAML Configuration dialog box](common/idp-intiated.png)

    1. In the **Identifier** box, enter a URL in this pattern:

       | |
    	|--|
	    | `https://go.promapp.com/TENANTNAME/`|
	    | `https://au.promapp.com/TENANTNAME/`|
	    | `https://us.promapp.com/TENANTNAME/`|
	    | `https://eu.promapp.com/TENANTNAME/`|
	    | `https://ca.promapp.com/TENANTNAME/`|
	    |   |

	> [!NOTE] 
	> Presently Azure AD integration with Promapp has only been configured for service initiated authentication e.g. going to a Promapp URL initiates the authentication process. However the Reply URL is a required field.

    1. In the **Reply URL** text box, type a URL using the following pattern:
    `https://<DOMAINNAME>.promapp.com/TENANTNAME/saml/authenticate.aspx`

5. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    ![Promapp Domain and URLs single sign-on information](common/metadata-upload-additional-signon.png)

    In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://<DOMAINNAME>.promapp.com/TENANTNAME/saml/authenticate`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier, Reply URL and Sign-on URL. Contact [Promapp Client support team](https://www.promapp.com/about-us/contact-us/) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

6. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Base64)** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

7. On the **Set up Promapp** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Azure AD Identifier

	c. Logout URL

### Configure Promapp Single Sign-On

1. Sign in to your Promapp company site as administrator. 

2. In the menu on the top, click **Admin**. 
   
    ![Azure AD Single Sign-On][12]

3. Click **Configure**. 
   
    ![Azure AD Single Sign-On][13]

4. On the **Security** dialog, perform the following steps:
   
    ![Azure AD Single Sign-On][14]
	
	a. Paste **Login URL**, which you have copied from the Azure portal into the **SSO-Login URL** textbox.
	
	b. As **SSO - Single Sign-on Mode**, select **Optional**, and then click **Save**.

	> [!NOTE]
	> **Optional** mode is for testing only. Once you are happy with the configuration, Select **Required** mode to enforce all users to authenticate using Azure AD.

	c. Open the downloaded certificate in notepad, copy the certificate content without the first line (-----**BEGIN CERTIFICATE**-----) and the last line (-----**END CERTIFICATE**-----), paste it into the **SSO-x.509 Certificate** textbox, and then click **Save**.

### Create an Azure AD test user 

The objective of this section is to create a test user in the Azure portal called Britta Simon.

1. In the Azure portal, in the left pane, select **Azure Active Directory**, select **Users**, and then select **All users**.

    ![The "Users and groups" and "All users" links](common/users.png)

2. Select **New user** at the top of the screen.

    ![New user Button](common/new-user.png)

3. In the User properties, perform the following steps.

    ![The User dialog box](common/user-properties.png)

    a. In the **Name** field enter **BrittaSimon**.
  
    b. In the **User name** field type brittasimon@yourcompanydomain.extension. For example, BrittaSimon@contoso.com

    c. Select **Show password** check box, and then write down the value that's displayed in the Password box.

    d. Click **Create**.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Promapp.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **Promapp**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **Promapp**.

	![The Promapp link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog click the **Assign** button.

### Create Promapp test user

In this section, a user called Britta Simon is created in Promapp. Promapp supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in Promapp, a new one is created after authentication.

### Test single sign-on 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Promapp tile in the Access Panel, you should be automatically signed in to the Promapp for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

<!--Image references-->

[12]: ./media/promapp-tutorial/tutorial_promapp_05.png
[13]: ./media/promapp-tutorial/tutorial_promapp_06.png
[14]: ./media/promapp-tutorial/tutorial_promapp_07.png

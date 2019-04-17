---
title: 'Tutorial: Azure Active Directory integration with RingCentral | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and RingCentral.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 5848c875-5185-4f91-8279-1a030e67c510
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 04/17/2019
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with RingCentral

In this tutorial, you learn how to integrate RingCentral with Azure Active Directory (Azure AD).
Integrating RingCentral with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to RingCentral.
* You can enable your users to be automatically signed-in to RingCentral (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with RingCentral, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get a [free account](https://azure.microsoft.com/free/)
* RingCentral single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* RingCentral supports **SP** initiated SSO

## Adding RingCentral from the gallery

To configure the integration of RingCentral into Azure AD, you need to add RingCentral from the gallery to your list of managed SaaS apps.

**To add RingCentral from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Navigate to **Enterprise Applications** and then select the **All Applications** option.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add new application, click **New application** button on the top of dialog.

	![The New application button](common/add-new-app.png)

4. In the search box, type **RingCentral**, select **RingCentral** from result panel then click **Add** button to add the application.

	![RingCentral in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with RingCentral based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in RingCentral needs to be established.

To configure and test Azure AD single sign-on with RingCentral, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure RingCentral Single Sign-On](#configure-ringcentral-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Create RingCentral test user](#create-ringcentral-test-user)** - to have a counterpart of Britta Simon in RingCentral that is linked to the Azure AD representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with RingCentral, perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **RingCentral** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, if you have **Service Provider metadata file**, perform the following steps:

	a. Click **Upload metadata file**.

    ![Upload metadata file](common/upload-metadata.png)

	b. Click on **folder logo** to select the metadata file and click **Upload**.

	![choose metadata file](common/browse-upload-metadata.png)

	c. After the metadata file is successfully uploaded, the **Identifier** and **Reply URL** values get auto populated in **Basic SAML Configuration** section.

	![RingCentral Domain and URLs single sign-on information](common/sp-identifier-reply.png)

	In the **Sign-on URL** text box, type a URL:
	
	| |
	|--|
	| `https://service.ringcentral.com`|
	| `https://service.ringcentral.com.au`|
	| `https://service.ringcentral.co.uk`|
	| `https://service.ringcentral.eu`|

	> [!Note]
	> You get the **Service Provider metadata file** on the RingCentral SSO Configuration page which is explained later in the tutorial.

5. If you don't have **Service Provider metadata file**, perform the following steps:

	a. In the **Sign on URL** textbox, type a URL:

	| |
	|--|
	| `https://service.ringcentral.com` |
	| `https://service.ringcentral.com.au` |
	| `https://service.ringcentral.co.uk` |
	| `https://service.ringcentral.eu` |

	b. In the **Identifier** textbox, type a URL:

	| |
	|--|
	|  `https://sso.ringcentral.com` |
	| `https://ssoeuro.ringcentral.com` |

	c. In the **Reply URL** textbox, type a URL:

	| |
	|--|
	| `https://sso.ringcentral.com/sp/ACS.saml2` |
	| `https://ssoeuro.ringcentral.com/sp/ACS.saml2` |

	![RingCentral Domain and URLs single sign-on information](common/sp-identifier-reply.png)

6. On the **Set up Single Sign-On with SAML** page, In the **SAML Signing Certificate** section, click copy button to copy **App Federation Metadata Url** and save it on your computer.

	![The Certificate download link](common/copy-metadataurl.png)

### Configure RingCentral Single Sign-On

1. In a different web browser window, sign in to RingCentral as a Security Administrator.

1. On the top, click on **Tools**.

	![image](./media/ringcentral-tutorial/ringcentral1.png)

1. Navigate to **Single Sign-on**.

	![image](./media/ringcentral-tutorial/ringcentral2.png)

1. On the **Single Sign-on** page, under **SSO Configuration** section, from **Step 1** click **Edit** and perform the following steps:

	![image](./media/ringcentral-tutorial/ringcentral3.png)

1. On the **Set up Single Sign-on** page, perform the following steps:

	![image](./media/ringcentral-tutorial/ringcentral4.png)

	a. Click **Browse** to upload the metadata file which you have downloaded from Azure portal.

	b. After uploading metadata the values get auto-populated in **SSO General Information** section.

	c. Under **Attribute Mapping** section, select **Map Email Attribute to** as `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress`

	d. Click **Save**.

	e. From **Step 2** click **Download** to download the **Service Provider metadata file** and upload it in **Basic SAML Configuration** section to auto-populate the **Identifier** and **Reply URL** values in Azure portal.

	![image](./media/ringcentral-tutorial/ringcentral6.png) 

	f. On the same page, navigate to **Enable SSO** section and perform the following steps:

	![image](./media/ringcentral-tutorial/ringcentral5.png)

	* Select **Enable SSO Service**.

	* Select **Allow users to log in with SSO or RingCentral credential**.

	* Click **Save**.

### Create an Azure AD test user 

The objective of this section is to create a test user in the Azure portal called Britta Simon.

1. In the Azure portal, in the left pane, select **Azure Active Directory**, select **Users**, and then select **All users**.

    ![The "Users and groups" and "All users" links](common/users.png)

2. Select **New user** at the top of the screen.

    ![New user Button](common/new-user.png)

3. In the User properties, perform the following steps.

    ![The User dialog box](common/user-properties.png)

    a. In the **Name** field enter **BrittaSimon**.
  
    b. In the **User name** field type `brittasimon@yourcompanydomain.extension`  
    For example, BrittaSimon@contoso.com

    c. Select **Show password** check box, and then write down the value that's displayed in the Password box.

    d. Click **Create**.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to RingCentral.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **RingCentral**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **RingCentral**.

	![The RingCentral link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog click the **Assign** button.

### Create RingCentral test user

In this section, you create a user called Britta Simon in RingCentral. Work with [RingCentral Client support team](https://success.ringcentral.com/RCContactSupp) to add the users in the RingCentral platform. Users must be created and activated before you use single sign-on.

### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the RingCentral tile in the Access Panel, you should be automatically signed in to the RingCentral for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [ List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory ](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory? ](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

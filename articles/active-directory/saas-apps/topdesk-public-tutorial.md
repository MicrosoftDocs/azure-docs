---
title: 'Tutorial: Azure Active Directory integration with TOPdesk - Public | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and TOPdesk - Public.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 0873299f-ce70-457b-addc-e57c5801275f
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 05/02/2019
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with TOPdesk - Public

In this tutorial, you learn how to integrate TOPdesk - Public with Azure Active Directory (Azure AD).
Integrating TOPdesk - Public with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to TOPdesk - Public.
* You can enable your users to be automatically signed-in to TOPdesk - Public (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with TOPdesk - Public, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get one-month trial [here](https://azure.microsoft.com/pricing/free-trial/)
* TOPdesk - Public single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* TOPdesk - Public supports **SP** initiated SSO

## Adding TOPdesk - Public from the gallery

To configure the integration of TOPdesk - Public into Azure AD, you need to add TOPdesk - Public from the gallery to your list of managed SaaS apps.

**To add TOPdesk - Public from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Navigate to **Enterprise Applications** and then select the **All Applications** option.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add new application, click **New application** button on the top of dialog.

	![The New application button](common/add-new-app.png)

4. In the search box, type **TOPdesk - Public**, select **TOPdesk - Public** from result panel then click **Add** button to add the application.

	 ![TOPdesk - Public in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with TOPdesk - Public based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in TOPdesk - Public needs to be established.

To configure and test Azure AD single sign-on with TOPdesk - Public, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure TOPdesk - Public Single Sign-On](#configure-topdesk---public-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Create TOPdesk - Public test user](#create-topdesk---public-test-user)** - to have a counterpart of Britta Simon in TOPdesk - Public that is linked to the Azure AD representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with TOPdesk - Public, perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **TOPdesk - Public** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4.	On the **Basic SAML Configuration** section, if you have **Service Provider metadata file**, perform the following steps:

	>[!NOTE]
	>You will get the **Service Provider metadata file** from the **Configure TOPdesk - Public Single Sign-On** section which is explained later in the tutorial.

	a. Click **Upload metadata file**.
	
	![Upload metadata file](common/upload-metadata.png)

	b. Click on **folder logo** to select the metadata file and click **Upload**.

	![choose metadata file](common/browse-upload-metadata.png)

	c. After the metadata file is successfully uploaded, the **Identifier** and **Reply URL** values get auto populated in Basic SAML Configuration section.

    ![TOPdesk - Public Domain and URLs single sign-on information](common/sp-identifier-reply.png)

    d. In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://<companyname>.topdesk.net`

	e. In the **Identifier** textbox, type a URL using the following pattern: `https://<companyname>.topdesk.net/tas/public/login/verify`

	> [!NOTE] 
	> If the **Identifier** and **Reply URL** values do not get auto populated, you need to enter them manually. For Identifier, follow the pattern as mentioned above and you get Reply URL value from the **Configure TOPdesk - Public Single Sign-On** section which is explained later in the tutorial. The **Sign-on URL** value is not real, so you need to update the value with the actual Sign-On URL. Contact [TOPdesk - Public Client support team](https://help.topdesk.com/saas/enterprise/user/) to get the value. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

5. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

6. On the **Set up TOPdesk - Public** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Azure AD Identifier

	c. Logout URL

### Configure TOPdesk - Public Single Sign-On

1. Sign on to your **TOPdesk - Public** company site as an administrator.

2. In the **TOPdesk** menu, click **Settings**.
   
    ![Settings](./media/topdesk-public-tutorial/ic790598.png "Settings")

3. Click **Login Settings**.
   
    ![Login Settings](./media/topdesk-public-tutorial/ic790599.png "Login Settings")

4. Expand the **Login Settings** menu, and then click **General**.
   
    ![General](./media/topdesk-public-tutorial/ic790600.png "General")

5. In the **Public** section of the **SAML login** configuration section, perform the following steps:
   
    ![Technical Settings](./media/topdesk-public-tutorial/ic790601.png "Technical Settings")
   
    a. Click **Download** to download the public metadata file, and then save it locally on your computer.
   
    b. Open the downloaded metadata file, and then locate the **AssertionConsumerService** node.

    ![AssertionConsumerService](./media/topdesk-public-tutorial/ic790619.png "AssertionConsumerService")
   
    c. Copy the **AssertionConsumerService** value, paste this value in the **Reply URL** textbox in **Basic SAML Configuration** section.      
   
6. To create a certificate file, perform the following steps:
    
    ![Certificate](./media/topdesk-public-tutorial/ic790606.png "Certificate")
    
    a. Open the downloaded metadata file from Azure portal.
    
    b. Expand the **RoleDescriptor** node that has a **xsi:type** of **fed:ApplicationServiceType**.
    
    c. Copy the value of the **X509Certificate** node.
    
    d. Save the copied **X509Certificate** value locally on your computer in a file.

7. In the **Public** section, click **Add**.
    
    ![SAML Login](./media/topdesk-public-tutorial/ic790625.png "SAML Login")

8. On the **SAML configuration assistant** dialog page, perform the following steps:
    
    ![SAML Configuration Assistant](./media/topdesk-public-tutorial/ic790608.png "SAML Configuration Assistant")
    
    a. To upload your downloaded metadata file from Azure portal, under **Federation Metadata**, click **Browse**.

    b. To upload your certificate file, under **Certificate (RSA)**, click **Browse**.

    c. To upload the logo file you got from the TOPdesk support team, under **Logo icon**, click **Browse**.

    d. In the **User name attribute** textbox, type `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress`.

    e. In the **Display name** textbox, type a name for your configuration.

    f. Click **Save**.

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

In this section, you enable Britta Simon to use Azure single sign-on by granting access to TOPdesk - Public.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **TOPdesk - Public**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **TOPdesk - Public**.

	![The TOPdesk - Public link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog click the **Assign** button.

### Create TOPdesk - Public test user

In order to enable Azure AD users to sign into TOPdesk - Public, they must be provisioned into TOPdesk - Public. In the case of TOPdesk - Public, provisioning is a manual task.

### To configure user provisioning, perform the following steps:

1. Sign on to your **TOPdesk - Public** company site as administrator.

2. In the menu on the top, click **TOPdesk \> New \> Support Files \> Person**.
   
    ![Person](./media/topdesk-public-tutorial/ic790628.png "Person")

3. On the New Person dialog, perform the following steps:
   
    ![New Person](./media/topdesk-public-tutorial/ic790629.png "New Person")
   
    a. Click the General tab.

    b. In the **Surname** textbox, type Surname of the user like Simon
 
    c. Select a **Site** for the account.
 
    d. Click **Save**.

> [!NOTE]
> You can use any other TOPdesk - Public user account creation tools or APIs provided by TOPdesk - Public to provision Azure AD user accounts.

### Test single sign-on 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the TOPdesk - Public tile in the Access Panel, you should be automatically signed in to the TOPdesk - Public for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

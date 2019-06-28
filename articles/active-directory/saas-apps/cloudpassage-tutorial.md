---
title: 'Tutorial: Azure Active Directory integration with CloudPassage | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and CloudPassage.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: bfe1f14e-74e4-4680-ac9e-f7355e1c94cc
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 01/23/2019
ms.author: jeedes

ms.collection: M365-identity-device-management
---
# Tutorial: Azure Active Directory integration with CloudPassage

In this tutorial, you learn how to integrate CloudPassage with Azure Active Directory (Azure AD).
Integrating CloudPassage with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to CloudPassage.
* You can enable your users to be automatically signed-in to CloudPassage (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with CloudPassage, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get one-month trial [here](https://azure.microsoft.com/pricing/free-trial/)
* CloudPassage single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* CloudPassage supports **SP** initiated SSO

## Adding CloudPassage from the gallery

To configure the integration of CloudPassage into Azure AD, you need to add CloudPassage from the gallery to your list of managed SaaS apps.

**To add CloudPassage from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Navigate to **Enterprise Applications** and then select the **All Applications** option.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add new application, click **New application** button on the top of dialog.

	![The New application button](common/add-new-app.png)

4. In the search box, type **CloudPassage**, select **CloudPassage** from result panel then click **Add** button to add the application.

	 ![CloudPassage in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with CloudPassage based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in CloudPassage needs to be established.

To configure and test Azure AD single sign-on with CloudPassage, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure CloudPassage Single Sign-On](#configure-cloudpassage-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Create CloudPassage test user](#create-cloudpassage-test-user)** - to have a counterpart of Britta Simon in CloudPassage that is linked to the Azure AD representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with CloudPassage, perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **CloudPassage** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, perform the following steps:

    ![CloudPassage Domain and URLs single sign-on information](common/sp-reply.png)

    a. In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://portal.cloudpassage.com/saml/init/accountid`

	b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://portal.cloudpassage.com/saml/consume/accountid`. You can get your value for this attribute by clicking **SSO Setup documentation** in the **Single Sign-on Settings** section of your CloudPassage portal.

	![Configure Single Sign-On](./media/cloudpassage-tutorial/tutorial_cloudpassage_05.png)

	> [!NOTE]
	> These values are not real. Update these values with the actual Sign-On URL and Reply URL. Contact [CloudPassage Client support team](https://www.cloudpassage.com/company/contact/) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

5. CloudPassage application expects the SAML assertions in a specific format. Configure the following claims for this application. You can manage the values of these attributes from the **User Attributes** section on application integration page. On the **Set up Single Sign-On with SAML** page, click **Edit** button to open **User Attributes** dialog.

	![image](common/edit-attribute.png)

6. In the **User Claims** section on the **User Attributes** dialog, edit the claims by using **Edit icon** or add the claims by using **Add new claim** to configure SAML token attribute as shown in the image above and perform the following steps: 

	| Name | Source Attribute|
	| ---------------| --------------- |
	| firstname |user.givenname |
	| lastname |user.surname |
	| email |user.mail |

	a. Click **Add new claim** to open the **Manage user claims** dialog.

	![image](common/new-save-attribute.png)

	![image](common/new-attribute-details.png)

	b. In the **Name** textbox, type the attribute name shown for that row.

	c. Leave the **Namespace** blank.

	d. Select Source as **Attribute**.

	e. From the **Source attribute** list, type the attribute value shown for that row.

	f. Click **Ok**

	g. Click **Save**.

7. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Base64)** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

8. On the **Set up CloudPassage** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Azure Ad Identifier

	c. Logout URL

### Configure CloudPassage Single Sign-On

1. In a different browser window, sign-on to your CloudPassage company site as administrator.

1. In the menu on the top, click **Settings**, and then click **Site Administration**. 
   
    ![Configure Single Sign-On][12]

1. Click the **Authentication Settings** tab. 
   
    ![Configure Single Sign-On][13]

1. In the **Single Sign-on Settings** section, perform the following steps: 
   
    ![Configure Single Sign-On][14]

	a. Select **Enable Single sign-on(SSO)(SSO Setup Documentation)** checkbox.
	
	b. Paste **Azure Ad Identifier** into the **SAML issuer URL** textbox.
  
    c. Paste **Login URL** into the **SAML endpoint URL** textbox.
  
    d. Paste **Logout URL** into the **Logout landing page** textbox.
  
    e. Open your downloaded certificate in notepad, copy the content of downloaded certificate into your clipboard, and then paste it into the **x 509 certificate** textbox.
  
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
  
    b. In the **User name** field type **brittasimon\@yourcompanydomain.extension**  
    For example, BrittaSimon@contoso.com

    c. Select **Show password** check box, and then write down the value that's displayed in the Password box.

    d. Click **Create**.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to CloudPassage.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **CloudPassage**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **CloudPassage**.

	![The CloudPassage link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog click the **Assign** button.

### Create CloudPassage test user

The objective of this section is to create a user called Britta Simon in CloudPassage.

**To create a user called Britta Simon in CloudPassage, perform the following steps:**

1. Sign-on to your **CloudPassage** company site as an administrator. 

1. In the toolbar on the top, click **Settings**, and then click **Site Administration**. 
   
	![Creating a CloudPassage test user][22] 

1. Click the **Users** tab, and then click **Add New User**. 
   
	![Creating a CloudPassage test user][23]

1. In the **Add New User** section, perform the following steps: 
   
	![Creating a CloudPassage test user][24]
	
	a. In the **First Name** textbox, type Britta. 
  
    b. In the **Last Name** textbox, type Simon.
  
    c. In the **Username** textbox, the **Email** textbox and the **Retype Email** textbox, type Britta's user name in Azure AD.
  
    d. As **Access Type**, select **Enable Halo Portal Access**.
  
    e. Click **Add**.

### Test single sign-on 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the CloudPassage tile in the Access Panel, you should be automatically signed in to the CloudPassage for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

<!--Image references-->

[12]: ./media/cloudpassage-tutorial/tutorial_cloudpassage_07.png
[13]: ./media/cloudpassage-tutorial/tutorial_cloudpassage_08.png
[14]: ./media/cloudpassage-tutorial/tutorial_cloudpassage_09.png
[15]: ./media/cloudpassage-tutorial/tutorial_cloudpassage_10.png
[22]: ./media/cloudpassage-tutorial/tutorial_cloudpassage_15.png
[23]: ./media/cloudpassage-tutorial/tutorial_cloudpassage_16.png
[24]: ./media/cloudpassage-tutorial/tutorial_cloudpassage_17.png


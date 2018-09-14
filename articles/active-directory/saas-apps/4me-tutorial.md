---
title: 'Tutorial: Azure Active Directory integration with 4me | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and 4me.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila
ms.reviewer: joflore

ms.assetid: 983eecc6-41f8-49b7-b7f6-dcf833dde121
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/03/2018
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with 4me

In this tutorial, you learn how to integrate 4me with Azure Active Directory (Azure AD).

Integrating 4me with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to 4me.
- You can enable your users to automatically get signed-on to 4me (Single Sign-On) with their Azure AD accounts.
- You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Azure AD integration with 4me, you need the following items:

- An Azure AD subscription
- A 4me single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding 4me from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding 4me from the gallery
To configure the integration of 4me into Azure AD, you need to add 4me from the gallery to your list of managed SaaS apps.

**To add 4me from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![The Azure Active Directory button][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![The Enterprise applications blade][2]
	
3. To add new application, click **New application** button on the top of dialog.

	![The New application button][3]

4. In the search box, type **4me**, select **4me** from result panel then click **Add** button to add the application.

	![4me in the results list](./media/4me-tutorial/tutorial_4me_addfromgallery.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with 4me based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in 4me is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in 4me needs to be established.

To configure and test Azure AD single sign-on with 4me, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Create a 4me test user](#create-a-4me-test-user)** - to have a counterpart of Britta Simon in 4me that is linked to the Azure AD representation of user.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your 4me application.

**To configure Azure AD single sign-on with 4me, perform the following steps:**

1. In the Azure portal, on the **4me** application integration page, click **Single sign-on**.

	![Configure single sign-on link][4]

2. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Single sign-on dialog box](./media/4me-tutorial/tutorial_4me_samlbase.png)

3. On the **4me Domain and URLs** section, perform the following steps:

	![4me Domain and URLs single sign-on information](./media/4me-tutorial/tutorial_4me_url.png)

	a. In the **Sign-on URL** textbox, type a URL using the following pattern:

	| Environment| URL|
	|---|---|
	| PRODUCTION | `https://<SUBDOMAIN>.4me.com`|
	| QA| `https://<SUBDOMAIN>.4me.qa`|
  
	b. In the **Identifier** textbox, type a URL using the following pattern:
	
	| Environment| URL|
	|---|---|
	| PRODUCTION | `https://<SUBDOMAIN>.4me.com`|
	| QA| `https://<SUBDOMAIN>.4me.qa`|

	> [!NOTE] 
	> These values are not real. Update these values with the actual Sign-On URL and Identifier. Contact [4me Client support team](mailto:support@4me.com) to get these values. 
 
4. 4me application expects the SAML assertions in a specific format. Configure the following claims for this application. You can manage the values of these attributes from the **User Attributes** section on application integration page. The following screenshot shows an example for this.
	
	![Configure Single Sign-On](./media/4me-tutorial/tutorial_4me_attribute.png)

5. In the **User Attributes** section on the **Single sign-on** dialog, configure SAML token attribute as shown in the image above and perform the following steps:
    
	| Attribute Name | Attribute Value |
	| ---------------| --------------- |    
	| first_name | user.givenname |
	| last_name | user.surname |

	a. Click **Add attribute** to open the **Add Attribute** dialog.

	![Configure Single Sign-On](./media/4me-tutorial/tutorial_attribute_04.png)

	![Configure Single Sign-On](./media/4me-tutorial/tutorial_attribute_05.png)
	
	b. In the **Name** textbox, type the attribute name shown for that row.
	
	c. From the **Value** list, type the attribute value shown for that row.

	d. Leave the **Namespace** blank.
	
	d. Click **Ok**

6. On the **SAML Signing Certificate** section, copy the **THUMBPRINT** value on your computer.

	![The Certificate download link](./media/4me-tutorial/tutorial_4me_certificate.png) 

7. Click **Save** button.

	![Configure Single Sign-On Save button](./media/4me-tutorial/tutorial_general_400.png)

8. On the **4me Configuration** section, click **Configure 4me** to open **Configure sign-on** window. Copy the **Sign-Out URL and SAML Single Sign-On Service URL** from the **Quick Reference section.**

	![4me Configuration](./media/4me-tutorial/tutorial_4me_configure.png) 

9. In a different web browser window, login to 4me as an Administrator.

10. On the top left, click on **Settings** logo and on the left side bar click **Single Sign-On**.

    ![4me settings](./media/4me-tutorial/tutorial_4me_settings.png)

11. On the **Single Sign-On** page, perform the following steps:

	![4me singleasignon](./media/4me-tutorial/tutorial_4me_singlesignon.png)

	a. Select the **Enabled** option.

	b. In the **Remote logout URL** textbox, paste the value of **Sign-Out URL**, which you have copied from the Azure portal.

	c. Under **SAML** section, in the **SAML SSO URL** textbox, paste the value of **SAML Single Sign-On Service URL**, which you have copied from the Azure portal.

	d. In the **Certificate fingerprint** textbox, paste the **THUMBPRINT** value seperated by a colon in duplets order (AA:BB:CC:DD:EE:FF:GG:HH:II), which you have copied from the Azure portal.

	e. Click **Save**.

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

   ![Create an Azure AD test user][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the Azure portal, in the left pane, click the **Azure Active Directory** button.

    ![The Azure Active Directory button](./media/4me-tutorial/create_aaduser_01.png)

2. To display the list of users, go to **Users and groups**, and then click **All users**.

    ![The "Users and groups" and "All users" links](./media/4me-tutorial/create_aaduser_02.png)

3. To open the **User** dialog box, click **Add** at the top of the **All Users** dialog box.

    ![The Add button](./media/4me-tutorial/create_aaduser_03.png)

4. In the **User** dialog box, perform the following steps:

    ![The User dialog box](./media/4me-tutorial/create_aaduser_04.png)

    a. In the **Name** box, type **BrittaSimon**.

    b. In the **User name** box, type the email address of user Britta Simon.

    c. Select the **Show Password** check box, and then write down the value that's displayed in the **Password** box.

    d. Click **Create**.
 
### Create a 4me test user

The objective of this section is to create a user called Britta Simon in 4me. 4me supports just-in-time provisioning, which is by default enabled. There is no action item for you in this section. A new user is created during an attempt to access 4me if it doesn't exist yet.

>[!Note]
>If you need to create a user manually, contact [4me support team](mailto:support@4me.com).

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to 4me.

![Assign the user role][200] 

**To assign Britta Simon to 4me, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

2. In the applications list, select **4me**.

	![The 4me link in the Applications list](./media/4me-tutorial/tutorial_4me_app.png)  

3. In the menu on the left, click **Users and groups**.

	![The "Users and groups" link][202]

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![The Add Assignment pane][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.
	
### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the 4me tile in the Access Panel, you should get automatically signed-on to your 4me application.
For more information about the Access Panel, see [Introduction to the Access Panel](../active-directory-saas-access-panel-introduction.md). 

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)



<!--Image references-->

[1]: ./media/4me-tutorial/tutorial_general_01.png
[2]: ./media/4me-tutorial/tutorial_general_02.png
[3]: ./media/4me-tutorial/tutorial_general_03.png
[4]: ./media/4me-tutorial/tutorial_general_04.png

[100]: ./media/4me-tutorial/tutorial_general_100.png

[200]: ./media/4me-tutorial/tutorial_general_200.png
[201]: ./media/4me-tutorial/tutorial_general_201.png
[202]: ./media/4me-tutorial/tutorial_general_202.png
[203]: ./media/4me-tutorial/tutorial_general_203.png


---
title: 'Tutorial: Azure Active Directory integration with Brightspace by Desire2Learn | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Brightspace by Desire2Learn.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila

ms.assetid: e2d3065b-1f6c-4c45-af78-0d5da3266999
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/17/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Brightspace by Desire2Learn

In this tutorial, you learn how to integrate Brightspace by Desire2Learn with Azure Active Directory (Azure AD).

Integrating Brightspace by Desire2Learn with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Brightspace by Desire2Learn
- You can enable your users to automatically get signed-on to Brightspace by Desire2Learn (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure portal

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites

To configure Azure AD integration with Brightspace by Desire2Learn, you need the following items:

- An Azure AD subscription
- A Brightspace by Desire2Learn single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can get a one-month trial [here](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Brightspace by Desire2Learn from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding Brightspace by Desire2Learn from the gallery
To configure the integration of Brightspace by Desire2Learn into Azure AD, you need to add Brightspace by Desire2Learn from the gallery to your list of managed SaaS apps.

**To add Brightspace by Desire2Learn from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![Active Directory][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![Applications][2]
	
3. To add new application, click **New application** button on the top of dialog.

	![Applications][3]

4. In the search box, type **Brightspace by Desire2Learn**.

	![Creating an Azure AD test user](./media/active-directory-saas-brightspace-desire2learn-tutorial/tutorial_brightspacebydesire2learn_search.png)

5. In the results panel, select **Brightspace by Desire2Learn**, and then click **Add** button to add the application.

	![Creating an Azure AD test user](./media/active-directory-saas-brightspace-desire2learn-tutorial/tutorial_brightspacebydesire2learn_addfromgallery.png)

##  Configuring and testing Azure AD single sign-on
In this section, you configure and test Azure AD single sign-on with Brightspace by Desire2Learn based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Brightspace by Desire2Learn is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Brightspace by Desire2Learn needs to be established.

In Brightspace by Desire2Learn, assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with Brightspace by Desire2Learn, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Creating a Brightspace by Desire2Learn test user](#creating-a-brightspace-by-desire2learn-test-user)** - to have a counterpart of Britta Simon in Brightspace by Desire2Learn that is linked to the Azure AD representation of user.
4. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Brightspace by Desire2Learn application.

**To configure Azure AD single sign-on with Brightspace by Desire2Learn, perform the following steps:**

1. In the Azure portal, on the **Brightspace by Desire2Learn** application integration page, click **Single sign-on**.

	![Configure Single Sign-On][4]

2. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Configure Single Sign-On](./media/active-directory-saas-brightspace-desire2learn-tutorial/tutorial_brightspacebydesire2learn_samlbase.png)

3. On the **Brightspace by Desire2Learn Domain and URLs** section, perform the following steps:

	![Configure Single Sign-On](./media/active-directory-saas-brightspace-desire2learn-tutorial/tutorial_brightspacebydesire2learn_url.png)

    a. In the **Identifier** textbox, type a URL using the following pattern:
	| |
	|--|
	| `https://<companyname>.tenants.brightspace.com/samlLogin`|
	| `https://<companyname>.desire2learn.com/shibboleth-sp`|

	b. In the **Reply URL** textbox, type a URL using the following pattern:
	`https://<companyname>.desire2learn.com/d2l/lp/auth/login/samlLogin.d2l`

	> [!NOTE] 
	> These values are not real. Update these values with the actual Identifier and Reply URL. Contact [Brightspace by Desire2Learn support team](https://www.d2l.com/en-apac/contact/) to get these values.
 


4. On the **SAML Signing Certificate** section, click **Metadata XML** and then save the metadata file on your computer.

	![Configure Single Sign-On](./media/active-directory-saas-brightspace-desire2learn-tutorial/tutorial_brightspacebydesire2learn_certificate.png) 

5. Click **Save** button.

	![Configure Single Sign-On](./media/active-directory-saas-brightspace-desire2learn-tutorial/tutorial_general_400.png)

6. To configure single sign-on on **Brightspace by Desire2Learn** side, you need to send the downloaded **Metadata XML** to [Brightspace by Desire2Learn support team](https://www.d2l.com/en-apac/contact/).

> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)
> 

### Creating an Azure AD test user
The objective of this section is to create a test user in the Azure portal called Britta Simon.

![Create Azure AD User][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure portal**, on the left navigation pane, click **Azure Active Directory** icon.

	![Creating an Azure AD test user](./media/active-directory-saas-brightspace-desire2learn-tutorial/create_aaduser_01.png) 

2. To display the list of users, go to **Users and groups** and click **All users**.
	
	![Creating an Azure AD test user](./media/active-directory-saas-brightspace-desire2learn-tutorial/create_aaduser_02.png) 

3. To open the **User** dialog, click **Add** on the top of the dialog.
 
	![Creating an Azure AD test user](./media/active-directory-saas-brightspace-desire2learn-tutorial/create_aaduser_03.png) 

4. On the **User** dialog page, perform the following steps:
 
	![Creating an Azure AD test user](./media/active-directory-saas-brightspace-desire2learn-tutorial/create_aaduser_04.png) 

    a. In the **Name** textbox, type **BrittaSimon**.

    b. In the **User name** textbox, type the **email address** of BrittaSimon.

	c. Select **Show Password** and write down the value of the **Password**.

    d. Click **Create**.
 
### Creating a Brightspace by Desire2Learn test user

In order to enable Azure AD users to log into Brightspace by Desire2Learn, they must be provisioned into Brightspace by Desire2Learn.  

In the case of Brightspace by Desire2Learn, the user accounts need to be created by your [Brightspace by Desire2Learn support team](https://www.d2l.com/en-apac/contact/).

>[!NOTE]
>You can use any other Brightspace by Desire2Learn user account creation tools or APIs provided by Brightspace by Desire2Learn to provision Azure Active Directory user accounts. 

### Assigning the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Brightspace by Desire2Learn.

![Assign User][200] 

**To assign Britta Simon to Brightspace by Desire2Learn, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

2. In the applications list, select **Brightspace by Desire2Learn**.

	![Configure Single Sign-On](./media/active-directory-saas-brightspace-desire2learn-tutorial/tutorial_brightspacebydesire2learn_app.png) 

3. In the menu on the left, click **Users and groups**.

	![Assign User][202] 

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![Assign User][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.
	
### Testing single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Brightspace by Desire2Learn tile in the Access Panel, you should get automatically signed-on to your Brightspace by Desire2Learn application.
For more information about the Access Panel, see [Introduction to the Access Panel](active-directory-saas-access-panel-introduction.md).

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)

<!--Image references-->

[1]: ./media/active-directory-saas-brightspace-desire2learn-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-brightspace-desire2learn-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-brightspace-desire2learn-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-brightspace-desire2learn-tutorial/tutorial_general_04.png

[100]: ./media/active-directory-saas-brightspace-desire2learn-tutorial/tutorial_general_100.png

[200]: ./media/active-directory-saas-brightspace-desire2learn-tutorial/tutorial_general_200.png
[201]: ./media/active-directory-saas-brightspace-desire2learn-tutorial/tutorial_general_201.png
[202]: ./media/active-directory-saas-brightspace-desire2learn-tutorial/tutorial_general_202.png
[203]: ./media/active-directory-saas-brightspace-desire2learn-tutorial/tutorial_general_203.png


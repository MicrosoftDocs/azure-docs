---
title: 'Tutorial: Azure Active Directory integration with UserEcho | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and UserEcho.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman

ms.assetid: bedd916b-8f69-4b50-9b8d-56f4ee3bd3ed
ms.service: active-directory
ms.component: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/12/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with UserEcho

In this tutorial, you learn how to integrate UserEcho with Azure Active Directory (Azure AD).

Integrating UserEcho with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to UserEcho
- You can enable your users to automatically get signed-on to UserEcho (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure portal

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Azure AD integration with UserEcho, you need the following items:

- An Azure AD subscription
- A UserEcho single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can get a one-month trial here: [Trial offer](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding UserEcho from the gallery
1. Configuring and testing Azure AD single sign-on

## Adding UserEcho from the gallery
To configure the integration of UserEcho into Azure AD, you need to add UserEcho from the gallery to your list of managed SaaS apps.

**To add UserEcho from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![Active Directory][1]

1. Navigate to **Enterprise applications**. Then go to **All applications**.

	![Applications][2]
	
1. To add new application, click **New application** button on the top of dialog.

	![Applications][3]

1. In the search box, type **UserEcho**.

	![Creating an Azure AD test user](./media/userecho-tutorial/tutorial_userecho_search.png)

1. In the results panel, select **UserEcho**, and then click **Add** button to add the application.

	![Creating an Azure AD test user](./media/userecho-tutorial/tutorial_userecho_addfromgallery.png)

##  Configuring and testing Azure AD single sign-on
In this section, you configure and test Azure AD single sign-on with UserEcho based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in UserEcho is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in UserEcho needs to be established.

In UserEcho, assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with UserEcho, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on)** - to enable your users to use this feature.
1. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
1. **[Creating a UserEcho test user](#creating-a-userecho-test-user)** - to have a counterpart of Britta Simon in UserEcho that is linked to the Azure AD representation of user.
1. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
1. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your UserEcho application.

**To configure Azure AD single sign-on with UserEcho, perform the following steps:**

1. In the Azure portal, on the **UserEcho** application integration page, click **Single sign-on**.

	![Configure Single Sign-On][4]

1. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Configure Single Sign-On](./media/userecho-tutorial/tutorial_userecho_samlbase.png)

1. On the **UserEcho Domain and URLs** section, perform the following steps:

	![Configure Single Sign-On](./media/userecho-tutorial/tutorial_userecho_url.png)

    a. In the **Sign-on URL** textbox, type a URL using the following pattern: `https://<companyname>.userecho.com/`

	b. In the **Identifier** textbox, type a URL using the following pattern: `https://<companyname>.userecho.com/saml/metadata/`

	> [!NOTE] 
	> These values are not real. Update these values with the actual Sign-On URL and Identifier. Contact [UserEcho Client support team](https://feedback.userecho.com/) to get these values. 

1. On the **SAML Signing Certificate** section, click **Certificate(Base64)** and then save the certificate file on your computer.

	![Configure Single Sign-On](./media/userecho-tutorial/tutorial_userecho_certificate.png) 

1. Click **Save** button.

	![Configure Single Sign-On](./media/userecho-tutorial/tutorial_general_400.png)

1. On the **UserEcho Configuration** section, click **Configure UserEcho** to open **Configure sign-on** window. Copy the **Sign-Out URL and SAML Single Sign-On Service URL** from the **Quick Reference section.**

	![Configure Single Sign-On](./media/userecho-tutorial/tutorial_userecho_configure.png) 

1. In another browser window, sign on to your UserEcho company site as an administrator.

1. In the toolbar on the top, click your user name to expand the menu, and then click **Setup**.
   
    ![Configure Single Sign-On](./media/userecho-tutorial/tutorial_userecho_06.png) 

1. Click **Integrations**.
   
    ![Configure Single Sign-On](./media/userecho-tutorial/tutorial_userecho_07.png) 

1. Click **Website**, and then click **Single sign-on (SAML2)**.
   
    ![Configure Single Sign-On](./media/userecho-tutorial/tutorial_userecho_08.png) 

1. On the **Single sign-on (SAML)** page, perform the following steps:
   
    ![Configure Single Sign-On](./media/userecho-tutorial/tutorial_userecho_09.png)
	
	a. As **SAML-enabled**, select **Yes**.
	
	b. Paste **SAML Single Sign-On Service URL**, which you have copied from the Azure portal into the **SAML SSO URL** textbox.
	
	c. Paste **Sign-Out URL**, which you have copied from the Azure portal into the **Remote logoout URL** textbox.
	
	d. Open your downloaded certificate in Notepad, copy the content, and then paste it into the **X.509 Certificate** textbox.
	
	e. Click **Save**.

> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)
> 

### Creating an Azure AD test user
The objective of this section is to create a test user in the Azure portal called Britta Simon.

![Create Azure AD User][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure portal**, on the left navigation pane, click **Azure Active Directory** icon.

	![Creating an Azure AD test user](./media/userecho-tutorial/create_aaduser_01.png) 

1. To display the list of users, go to **Users and groups** and click **All users**.
	
	![Creating an Azure AD test user](./media/userecho-tutorial/create_aaduser_02.png) 

1. To open the **User** dialog, click **Add** on the top of the dialog.
 
	![Creating an Azure AD test user](./media/userecho-tutorial/create_aaduser_03.png) 

1. On the **User** dialog page, perform the following steps:
 
	![Creating an Azure AD test user](./media/userecho-tutorial/create_aaduser_04.png) 

    a. In the **Name** textbox, type **BrittaSimon**.

    b. In the **User name** textbox, type the **email address** of BrittaSimon.

	c. Select **Show Password** and write down the value of the **Password**.

    d. Click **Create**.
 
### Creating a UserEcho test user

The objective of this section is to create a user called Britta Simon in UserEcho.

**To create a user called Britta Simon in UserEcho, perform the following steps:**

1. Sign-on to your UserEcho company site as an administrator.

1. In the toolbar on the top, click your user name to expand the menu, and then click **Setup**.
   
    ![Configure Single Sign-On](./media/userecho-tutorial/tutorial_userecho_06.png)

1. Click **Users**, to expand the **Users** section.
   
    ![Configure Single Sign-On](./media/userecho-tutorial/tutorial_userecho_10.png)

1. Click **Users**.
   
    ![Configure Single Sign-On](./media/userecho-tutorial/tutorial_userecho_11.png)

1. Click **Invite a new user**.
   
    ![Configure Single Sign-On](./media/userecho-tutorial/tutorial_userecho_12.png)

1. On the **Invite a new user** dialog, perform the following steps:
   
    ![Configure Single Sign-On](./media/userecho-tutorial/tutorial_userecho_13.png)

	a. In the **Name** textbox, type name of the user like Britta Simon.
	
	b.  In the **Email** textbox, type the email address of user like Brittasimon@contoso.com.
	
	c. Click **Invite**.

An invitation is sent to Britta, which enables her to start using UserEcho. 

### Assigning the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to UserEcho.

![Assign User][200] 

**To assign Britta Simon to UserEcho, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

1. In the applications list, select **UserEcho**.

	![Configure Single Sign-On](./media/userecho-tutorial/tutorial_userecho_app.png) 

1. In the menu on the left, click **Users and groups**.

	![Assign User][202] 

1. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![Assign User][203]

1. On **Users and groups** dialog, select **Britta Simon** in the Users list.

1. Click **Select** button on **Users and groups** dialog.

1. Click **Assign** button on **Add Assignment** dialog.
	
### Testing single sign-on

The objective of this section is to test your Azure AD SSO configuration using the Access Panel.  

When you click the UserEcho tile in the Access Panel, you should get automatically signed-on to your UserEcho application.

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

<!--Image references-->

[1]: ./media/userecho-tutorial/tutorial_general_01.png
[2]: ./media/userecho-tutorial/tutorial_general_02.png
[3]: ./media/userecho-tutorial/tutorial_general_03.png
[4]: ./media/userecho-tutorial/tutorial_general_04.png

[100]: ./media/userecho-tutorial/tutorial_general_100.png

[200]: ./media/userecho-tutorial/tutorial_general_200.png
[201]: ./media/userecho-tutorial/tutorial_general_201.png
[202]: ./media/userecho-tutorial/tutorial_general_202.png
[203]: ./media/userecho-tutorial/tutorial_general_203.png


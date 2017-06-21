---
title: 'Tutorial: Azure Active Directory integration with Clever | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Clever.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila

ms.assetid: 069ff13a-310e-4366-a147-d6ec5cca12a5
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/22/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Clever

In this tutorial, you learn how to integrate Clever with Azure Active Directory (Azure AD).

Integrating Clever with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Clever
- You can enable your users to automatically get signed-on to Clever (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure portal

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites

To configure Azure AD integration with Clever, you need the following items:

- An Azure AD subscription
- A Clever single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can get a one-month trial [here](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Clever from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding Clever from the gallery
To configure the integration of Clever into Azure AD, you need to add Clever from the gallery to your list of managed SaaS apps.

**To add Clever from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![Active Directory][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![Applications][2]
	
3. To add new application, click **New application** button on the top of dialog.

	![Applications][3]

4. In the search box, type **Clever**.

	![Creating an Azure AD test user](./media/active-directory-saas-clever-tutorial/tutorial_clever_search.png)

5. In the results panel, select **Clever**, and then click **Add** button to add the application.

	![Creating an Azure AD test user](./media/active-directory-saas-clever-tutorial/tutorial_clever_addfromgallery.png)

##  Configuring and testing Azure AD single sign-on
In this section, you configure and test Azure AD single sign-on with Clever based on a test user called "Britta Simon."

For single sign-on to work, Azure AD needs to know what the counterpart user in Clever is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Clever needs to be established.

In Clever, assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with Clever, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Creating a Clever test user](#creating-a-clever-test-user)** - to have a counterpart of Britta Simon in Clever that is linked to the Azure AD representation of user.
4. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Clever application.

**To configure Azure AD single sign-on with Clever, perform the following steps:**

1. In the Azure portal, on the **Clever** application integration page, click **Single sign-on**.

	![Configure Single Sign-On][4]

2. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Configure Single Sign-On](./media/active-directory-saas-clever-tutorial/tutorial_clever_samlbase.png)

3. On the **Clever Domain and URLs** section, perform the following steps:

	![Configure Single Sign-On](./media/active-directory-saas-clever-tutorial/tutorial_clever_url.png)

    a. In the **Sign-on URL** textbox, type a URL using the following pattern: `https://clever.com/in/<companyname>`

	b. In the **Identifier** textbox, type a URL using the following pattern: `https://clever.com/<companyname>`

	> [!NOTE] 
	> These values are not real. Update these values with the actual Sign-On URL and Identifier. Contact [Clever Client support team](https://clever.com/about/contact/) to get these values. 
 
4. On the **SAML Signing Certificate** section, click **Metadata XML** and then save the metadata file on your computer.

	![Configure Single Sign-On](./media/active-directory-saas-clever-tutorial/tutorial_clever_certificate.png) 

5. The Clever application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your **SAML Token Attributes** configuration.

	The following screenshot shows an example for this.

	![Configure Single Sign-On](./media/active-directory-saas-clever-tutorial/tutorial_clever_07.png) 

6. In the **User Attributes** section on the **Single sign-on** dialog, configure SAML token attribute as shown in the image above and perform the following steps:
	
	| Attribute Name  | Attribute Value |
	| --------------- | -------------------- |    
	| clever.student.credentials.district\_username  | user.userprincipalname |	

	a. Click **Add attribute** to open the **Add Attribute** dialog.

	![Configure Single Sign-On](./media/active-directory-saas-clever-tutorial/tutorial_attribute_04.png)
	
	![Configure Single Sign-On](./media/active-directory-saas-clever-tutorial/tutorial_attribute_05.png)
	
	b. In the **Name** textbox, type the attribute name shown for that row.

	c. From the **Value** list, type the attribute value shown for that row.
	
	d. Click **Ok**.

7. Click **Save** button.

	![Configure Single Sign-On](./media/active-directory-saas-clever-tutorial/tutorial_general_400.png)

8. In a different web browser window, log in to your Clever company site as an administrator.

9. In the toolbar, click **Instant Login**.
   
   ![Instant Login](./media/active-directory-saas-clever-tutorial/IC798984.png "Instant Login")

10. On the **Instant Login** page, perform the following steps:
      
	  ![Instant Login](./media/active-directory-saas-clever-tutorial/IC798985.png "Instant Login")
	  
	  a. Type the **Login URL**.
	  
	  >[!NOTE]
	  >The **Login URL** is a custom value. Contact [Clever Client support team](https://clever.com/about/contact/) to get this value.
	  
	  b. As **Identity System**, select **ADFS**.

	  c. Type the **Metadata URL** in the **Metadata URL** textbox.
	  
	  d. Click **Save**.

> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)
> 

### Creating an Azure AD test user
The objective of this section is to create a test user in the Azure portal called Britta Simon.

![Create Azure AD User][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure portal**, on the left navigation pane, click **Azure Active Directory** icon.

	![Creating an Azure AD test user](./media/active-directory-saas-clever-tutorial/create_aaduser_01.png) 

2. To display the list of users, go to **Users and groups** and click **All users**.
	
	![Creating an Azure AD test user](./media/active-directory-saas-clever-tutorial/create_aaduser_02.png) 

3. To open the **User** dialog, click **Add** on the top of the dialog.
 
	![Creating an Azure AD test user](./media/active-directory-saas-clever-tutorial/create_aaduser_03.png) 

4. On the **User** dialog page, perform the following steps:
 
	![Creating an Azure AD test user](./media/active-directory-saas-clever-tutorial/create_aaduser_04.png) 

    a. In the **Name** textbox, type **BrittaSimon**.

    b. In the **User name** textbox, type the **email address** of BrittaSimon.

	c. Select **Show Password** and write down the value of the **Password**.

    d. Click **Create**.
 
### Creating a Clever test user

To enable Azure AD users to log in to Clever, they must be provisioned into Clever.

In case of Clever, Work with [Clever Client support team](https://clever.com/about/contact/) to add the users in the Clever platform. Users must be created and activated before you use single sign-on. 

>[!NOTE]
>You can use any other Clever user account creation tools or APIs provided by Clever to provision AAD user accounts.

### Assigning the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Clever.

![Assign User][200] 

**To assign Britta Simon to Clever, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

2. In the applications list, select **Clever**.

	![Configure Single Sign-On](./media/active-directory-saas-clever-tutorial/tutorial_clever_app.png) 

3. In the menu on the left, click **Users and groups**.

	![Assign User][202] 

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![Assign User][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.
	
### Testing single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.
 
When you click the Clever tile in the Access Panel, you should get automatically signed-on to your Clever application.

For more information about the Access Panel, see [Introduction to the Access Panel](active-directory-saas-access-panel-introduction.md). 

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)



<!--Image references-->

[1]: ./media/active-directory-saas-clever-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-clever-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-clever-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-clever-tutorial/tutorial_general_04.png

[100]: ./media/active-directory-saas-clever-tutorial/tutorial_general_100.png

[200]: ./media/active-directory-saas-clever-tutorial/tutorial_general_200.png
[201]: ./media/active-directory-saas-clever-tutorial/tutorial_general_201.png
[202]: ./media/active-directory-saas-clever-tutorial/tutorial_general_202.png
[203]: ./media/active-directory-saas-clever-tutorial/tutorial_general_203.png


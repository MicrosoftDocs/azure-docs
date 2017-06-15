---
title: 'Tutorial: Azure Active Directory integration with Halosys | Microsoft Docs'
description: Learn how to use Halosys with Azure Active Directory to enable single sign-on, automated provisioning, and more!
services: active-directory
author: jeevansd
documentationcenter: na
manager: femila

ms.assetid: 42a0eb7c-5cb7-44a9-b00b-b0e7df4b63e8
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 02/22/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Halosys

In this tutorial, you learn how to integrate Halosys with Azure Active Directory (Azure AD).

Integrating Halosys with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Halosys
- You can enable your users to automatically get signed-on to Halosys (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure classic portal

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites

To configure Azure AD integration with Halosys, you need the following items:

- An Azure AD subscription
- A Halosys single-sign on enabled subscription


> [!NOTE] 
> To test the steps in this tutorial, we do not recommend using a production environment.


To test the steps in this tutorial, you should follow these recommendations:

- You should not use your production environment, unless this is necessary.
- If you don't have an Azure AD trial environment, you can get a one-month trial [here](https://azure.microsoft.com/pricing/free-trial/).


## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment.

The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Halosys from the gallery
2. Configuring and testing Azure AD single sign-on


## Adding Halosys from the gallery
To configure the integration of Halosys into Azure AD, you need to add Halosys from the gallery to your list of managed SaaS apps.

**To add Halosys from the gallery, perform the following steps:**

1. In the **Azure classic portal**, on the left navigation pane, click **Active Directory**.

	![Active Directory][1]
2. From the **Directory** list, select the directory for which you want to enable directory integration.

3. To open the applications view, in the directory view, click **Applications** in the top menu.

	![Applications][2]

4. Click **Add** at the bottom of the page.

	![Applications][3]

5. On the **What do you want to do** dialog, click **Add an application from the gallery**.

	![Applications][4]

6. In the search box, type **Halosys**.

	![Creating an Azure AD test user](./media/active-directory-saas-Halosys-tutorial/tutorial_Halosys_01.png)
	
7. In the results pane, select **Halosys**, and then click **Complete** to add the application.

	![Creating an Azure AD test user](./media/active-directory-saas-Halosys-tutorial/tutorial_Halosys_011.png)

##  Configuring and testing Azure AD single sign-on
In this section, you configure and test Azure AD single sign-on with Halosys based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Halosys is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Halosys needs to be established.

This link relationship is established by assigning the value of the **user name** in Azure AD as the value of the **Username** in Halosys.

To configure and test Azure AD single sign-on with Halosys, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Creating a Halosys test user](#creating-a-halosys-test-user)** - to have a counterpart of Britta Simon in Halosys that is linked to the Azure AD representation of her.
4. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the classic portal and configure single sign-on in your Halosys application.


**To configure Azure AD single sign-on with Halosys, perform the following steps:**

1. In the classic portal, on the **Halosys** application integration page, click **Configure single sign-on** to open the **Configure Single Sign-On**  dialog.
	 
	![Configure Single Sign-On][6] 

2. On the **How would you like users to sign on to Halosys** page, select **Azure AD Single Sign-On**, and then click **Next**.

	![Configure Single Sign-On](./media/active-directory-saas-Halosys-tutorial/tutorial_Halosys_03.png) 

3. On the **Configure App Settings** dialog page, perform the following steps:

	![Configure Single Sign-On](./media/active-directory-saas-Halosys-tutorial/tutorial_Halosys_04.png) 

    a. In the **Sign On URL** textbox, type the URL used by your users to sign-on to your Halosys application using the following pattern: `https://<company-name>.Halosys.com/client-api/api`.

	b.In the **Identifier URL** textbox, type the URL in the following pattern: `https://<company-name>.Halosys.com`.	
		 
4. On the **Configure single sign-on at Halosys** page, click **Download metadata**, and then save the file on your computer:

	![Configure Single Sign-On](./media/active-directory-saas-Halosys-tutorial/tutorial_Halosys_05.png)
   
5. To get SSO configured for your application, contact Halosys support team and provide them with the following:

	• The downloaded **metadata file**
	
	• The **SAML SSO URL**
	

6. In the classic portal, select the single sign-on configuration confirmation, and then click **Next**.
	
	![Azure AD Single Sign-On][10]

7. On the **Single sign-on confirmation** page, click **Complete**.  
 
	![Azure AD Single Sign-On][11]


### Creating an Azure AD test user
In this section, you create a test user in the classic portal called Britta Simon.


![Create Azure AD User][20]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure classic portal**, on the left navigation pane, click **Active Directory**.

	![Creating an Azure AD test user](./media/active-directory-saas-Halosys-tutorial/create_aaduser_09.png) 

2. From the **Directory** list, select the directory for which you want to enable directory integration.

3. To display the list of users, in the menu on the top, click **Users**.

	![Creating an Azure AD test user](./media/active-directory-saas-Halosys-tutorial/create_aaduser_03.png) 

4. To open the **Add User** dialog, in the toolbar on the bottom, click **Add User**.

	![Creating an Azure AD test user](./media/active-directory-saas-Halosys-tutorial/create_aaduser_04.png) 

5. On the **Tell us about this user** dialog page, perform the following steps:
	![Creating an Azure AD test user](./media/active-directory-saas-Halosys-tutorial/create_aaduser_05.png) 

    a. As Type Of User, select New user in your organization.

    b. In the User Name **textbox**, type **BrittaSimon**.

    c. Click **Next**.

6.  On the **User Profile** dialog page, perform the following steps:
	![Creating an Azure AD test user](./media/active-directory-saas-Halosys-tutorial/create_aaduser_06.png) 

    a. In the **First Name** textbox, type **Britta**.  

    b. In the **Last Name** textbox, type, **Simon**.

    c. In the **Display Name** textbox, type **Britta Simon**.

    d. In the **Role** list, select **User**.

    e. Click **Next**.

7. On the **Get temporary password** dialog page, click **create**.

	![Creating an Azure AD test user](./media/active-directory-saas-Halosys-tutorial/create_aaduser_07.png) 

8. On the **Get temporary password** dialog page, perform the following steps:

	![Creating an Azure AD test user](./media/active-directory-saas-Halosys-tutorial/create_aaduser_08.png) 

    a. Write down the value of the **New Password**.

    b. Click **Complete**.   



### Creating a Halosys test user

In this section, you create a user called Britta Simon in Halosys. Please work with Halosys support team to add the users in the Halosys platform.


### Assigning the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting her access to Halosys.

![Assign User][200] 

**To assign Britta Simon to Halosys, perform the following steps:**

1. On the classic portal, to open the applications view, in the directory view, click **Applications** in the top menu.

	![Assign User][201] 

2. In the applications list, select **Halosys**.

	![Configure Single Sign-On](./media/active-directory-saas-Halosys-tutorial/tutorial_Halosys_50.png) 

3. In the menu on the top, click **Users**.

	![Assign User][203]

4. In the Users list, select **Britta Simon**.

5. In the toolbar on the bottom, click **Assign**.

	![Assign User][205]


### Testing single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Halosys tile in the Access Panel, you should get automatically signed-on to your Halosys application.


## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)


<!--Image references-->

[1]: ./media/active-directory-saas-Halosys-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-Halosys-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-Halosys-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-Halosys-tutorial/tutorial_general_04.png

[6]: ./media/active-directory-saas-Halosys-tutorial/tutorial_general_05.png
[10]: ./media/active-directory-saas-Halosys-tutorial/tutorial_general_06.png
[11]: ./media/active-directory-saas-Halosys-tutorial/tutorial_general_07.png
[20]: ./media/active-directory-saas-Halosys-tutorial/tutorial_general_100.png

[200]: ./media/active-directory-saas-Halosys-tutorial/tutorial_general_200.png
[201]: ./media/active-directory-saas-Halosys-tutorial/tutorial_general_201.png
[203]: ./media/active-directory-saas-Halosys-tutorial/tutorial_general_203.png
[204]: ./media/active-directory-saas-Halosys-tutorial/tutorial_general_204.png
[205]: ./media/active-directory-saas-Halosys-tutorial/tutorial_general_205.png

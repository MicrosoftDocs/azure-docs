<properties
	pageTitle="Tutorial: Azure Active Directory integration with Alcumus Info Exchange"
	description="Learn how to configure single sign-on between Azure Active Directory and Alcumus Info Exchange."
	services="active-directory"
	documentationCenter=""
	authors="markusvi"
	manager="stevenpo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="10/01/2015"
	ms.author="markusvi"/>


# Tutorial: Azure Active Directory integration with Alcumus Info Exchange

The objective of this tutorial is to show you how to integrate Alcumus Info Exchange with Azure Active Directory (Azure AD).<br>Integrating Alcumus Info Exchange with Azure AD provides you with the following benefits: 

- You can control in Azure AD who has access to Alcumus Info Exchange 
- You can enable your users to automatically get signed-on to Alcumus Info Exchange (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure Active Directory Portal

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites 

To configure Azure AD integration with Alcumus Info Exchange, you need the following items:

- An [Azure AD](http://azure.microsoft.com/) subscription
- An [Alcumus Info Exchange](http://www.alcumusgroup.com/) single-sign on enabled subscription


> [AZURE.NOTE] To test the steps in this tutorial, we do not recommend using a production environment.


To test the steps in this tutorial, you should follow these recommendations:

- You should not use your production environment, unless this is necessary.
- If you don't have an Azure AD trial environment, you can get a one-month trial [here](https://azure.microsoft.com/pricing/free-trial/). 

 
## Scenario Description
The objective of this tutorial is to enable you to test Azure AD single sign-on in a test environment. <br>
The scenario outlined in this tutorial consists of three main building blocks:

1. Adding Alcumus Info Exchange from the gallery 
2. Configuring and testing Azure AD single sign-on


## Adding Alcumus Info Exchange from the gallery
To configure the integration of Alcumus Info Exchange into Azure AD, you need to add Alcumus Info Exchange from the gallery to your list of managed SaaS apps.

**To add Alcumus Info Exchange from the gallery, perform the following steps:**

1. In the **Azure Management Portal**, on the left navigation pane, click **Active Directory**. <br><br>
![Active Directory][1]

2. From the **Directory** list, select the directory for which you want to enable directory integration.

3. To open the applications view, in the directory view, click **Applications** in the top menu.<br><br>
![Applications][2]
4. Click **Add** at the bottom of the page.<br><br>
![Applications][3]
5. On the **What do you want to do** dialog, click **Add an application from the gallery**.<br><br>
![Applications][4]
6. In the search box, type **Alcumus Info Exchange**.<br>
![Applications][5]
7. In the results pane, select **Alcumus Info Exchange**, and then click **Complete** to add the application.<br>



##  Configuring and testing Azure AD single sign-on
The objective of this section is to show you how to configure and test Azure AD single sign-on with Alcumus Info Exchange based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Alcumus Info Exchange to an user in Azure AD is. In other words, a link relationship between an Azure AD user and the related user in Alcumus Info Exchange needs to be established.<br>
This link relationship is established by assigning the value of the **user name** in Azure AD as the value of the **Username** in Alcumus Info Exchange.
 
To configure and test Azure AD single sign-on with Alcumus Info Exchange, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Single Sign-On](#configuring-azure-ad-single-single-sign-on)** - to enable your users to use this feature.
2. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Creating a Alcumus Info Exchange test user](#creating-a-halogen-software-test-user)** - to have a counterpart of Britta Simon in Alcumus Info Exchange that is linked to the Azure AD representation of her.
5. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD Single Single Sign-On

The objective of this section is to enable Azure AD single sign-on in the Azure AD portal and to configure single sign-on in your Alcumus Info Exchange application.<br>

**To configure Azure AD single sign-on with Alcumus Info Exchange, perform the following steps:**

1. In the Azure AD portal, on the **Alcumus Info Exchange** application integration page, click **Configure single sign-on** to open the **Configure Single Sign-On**  dialog.<br><br>
![Configure Single Sign-On][6]

2. On the **How would you like users to sign on to Alcumus Info Exchange** page, select **Azure AD Single Sign-On**, and then click **Next**.<br><br>
![Azure AD Single Sign-On][7]

3. On the **Configure App Settings** dialog page, perform the following steps: 
<br><br>![Azure AD Single Sign-On][8]<br>
 
     3.1 in the **Reply URL** textbox, type your URL used by your users to sign on to your Alcumus Info Exchange application.

     > [AZURE.NOTE] If you don't know what the right value is, contact the Alcumus Info Exchange support team via [helpdesk@alcumusgroup.com](mailto:helpdesk@alcumusgroup.com).

     3.2. Click **Next**.
 
4. On the **Configure single sign-on at Alcumus Info Exchange** page, click **Download metadata**, and then save the metadata file locally on your computer.<br><br>![What is Azure AD Connect][9]

5. Contact the Alcumus Info Exchange support team via [helpdesk@alcumusgroup.com](mailto:helpdesk@alcumusgroup.com), provide them with the metadata file, and them let them know that they should enable SSO for you.


6. On the Azure AD portal, select the single sign-on configuration confirmation, and then click **Next**. <br><br>![What is Azure AD Connect][10]

7. On the **Single sign-on confirmation** page, click **Complete**.  <br><br>![What is Azure AD Connect][11]




### Creating an Azure AD test user
The objective of this section is to create a test user in the Azure portal called Britta Simon.<br>
In the Users list, select **Britta Simon**.<br><br>![Create Azure AD User][20]<br>

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure Management Portal**, on the left navigation pane, click **Active Directory**.<br>
![Creating an Azure AD test user](./media/active-directory-saas-alcumus-info-tutorial/create_aaduser_02.png) 

2. From the **Directory** list, select the directory for which you want to enable directory integration.

3. To display the list of users, in the menu on the top, click **Users**.<br>![Creating an Azure AD test user](./media/active-directory-saas-alcumus-info-tutorial/create_aaduser_03.png) 
 
4. To open the **Add User** dialog, in the toolbar on the bottom, click **Add User**. <br>![Creating an Azure AD test user](./media/active-directory-saas-alcumus-info-tutorial/create_aaduser_04.png) 

5. On the **Tell us about this user** dialog page, perform the following steps: <br>![Creating an Azure AD test user](./media/active-directory-saas-alcumus-info-tutorial/create_aaduser_05.png) 
  1. As Type Of User, select New user in your organization.
  2. In the User Name **textbox**, type **BrittaSimon**.
  3. Click Next.

6.  On the **User Profile** dialog page, perform the following steps: <br>![Creating an Azure AD test user](./media/active-directory-saas-alcumus-info-tutorial/create_aaduser_06.png) 
  1. In the **First Name** textbox, type **Britta**.  
  2. In the **Last Name** txtbox, type, **Simon**.
  3. In the **Display Name** textbox, type **Britta Simon**.
  4. In the **Role** list, select **User**.
  5. Click **Next**.

7. On the **Get temporary password** dialog page, click **create**.<br>![Creating an Azure AD test user](./media/active-directory-saas-alcumus-info-tutorial/create_aaduser_07.png) 
 
8. On the **Get temporary password** dialog page, perform the following steps:<br>![Creating an Azure AD test user](./media/active-directory-saas-alcumus-info-tutorial/create_aaduser_08.png) 
  1. Write down the value of the **New Password**.
  2. Click **Complete**.   

  
 
### Creating a Alcumus Info Exchange test user

The objective of this section is to create a user called Britta Simon in Alcumus Info Exchange.

**To create a user called Britta Simon in Alcumus Info Exchange, perform the following steps:**

1. Contact the Alcumus Info Exchange support team via [helpdesk@alcumusgroup.com](mailto:helpdesk@alcumusgroup.com),


### Assigning the Azure AD test user

The objective of this section is to enabling Britta Simon to use Azure single sign-on by granting her access to Alcumus Info Exchange.
<br><br>![Assign User][200]

**To assign Britta Simon to Alcumus Info Exchange, perform the following steps:**

1. On the Azure portal, to open the applications view, in the directory view, click **Applications** in the top menu.<br>
<br><br>![Assign User][201]
2. In the applications list, select **Alcumus Info Exchange**.
<br><br>![Assign User][202]
1. In the menu on the top, click **Users**.<br>
<br><br>![Assign User][203]
1. In the Users list, select **Britta Simon**.

2. In the toolbar on the bottom, click **Assign**.
<br><br>![Assign User][205]



### Testing Single Sign-On

The objective of this section is to test your Azure AD single sign-on configuration using the Access Panel.<br>
When you click the Alcumus Info Exchange tile in the Access Panel, you should get automatically signed-on to your Alcumus Info Exchange application.


## Additional Resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)

<!--Image references-->
[1]: ./media/active-directory-saas-alcumus-info-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-alcumus-info-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-alcumus-info-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-alcumus-info-tutorial/tutorial_general_04.png
[5]: ./media/active-directory-saas-alcumus-info-tutorial/tutorial_alcumus_01.png
[6]: ./media/active-directory-saas-alcumus-info-tutorial/tutorial_alcumus_02.png
[7]: ./media/active-directory-saas-alcumus-info-tutorial/tutorial_alcumus_03.png
[8]: ./media/active-directory-saas-alcumus-info-tutorial/tutorial_alcumus_04.png
[9]: ./media/active-directory-saas-alcumus-info-tutorial/tutorial_alcumus_05.png
[10]: ./media/active-directory-saas-alcumus-info-tutorial/tutorial_alcumus_06.png
[11]: ./media/active-directory-saas-alcumus-info-tutorial/tutorial_alcumus_07.png
[20]: ./media/active-directory-saas-alcumus-info-tutorial/tutorial_general_100.png

[200]: ./media/active-directory-saas-alcumus-info-tutorial/tutorial_general_200.png
[201]: ./media/active-directory-saas-alcumus-info-tutorial/tutorial_general_201.png
[202]: ./media/active-directory-saas-alcumus-info-tutorial/tutorial_alcumus_08.png
[203]: ./media/active-directory-saas-alcumus-info-tutorial/tutorial_general_203.png
[204]: ./media/active-directory-saas-alcumus-info-tutorial/tutorial_general_204.png
[205]: ./media/active-directory-saas-alcumus-info-tutorial/tutorial_general_205.png
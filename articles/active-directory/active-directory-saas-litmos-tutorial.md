<properties
	pageTitle="Tutorial: Azure Active Directory integration with Litmos | Microsoft Azure"
	description="Learn how to configure single sign-on between Azure Active Directory and Litmos."
	services="active-directory"
	documentationCenter=""
	authors="jeevansd"
	manager="femila"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/08/2016"
	ms.author="jeedes"/>


# Tutorial: Azure Active Directory integration with Litmos

The objective of this tutorial is to show you how to integrate Litmos with Azure Active Directory (Azure AD).  
Integrating Litmos with Azure AD provides you with the following benefits: 

- You can control in Azure AD who has access to Litmos 
- You can enable your users to automatically get signed-on to Litmos (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure Active Directory 

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites 

To configure Azure AD integration with Litmos, you need the following items:

- An Azure AD subscription
- A Litmos single-sign on enabled subscription


> [AZURE.NOTE] To test the steps in this tutorial, we do not recommend using a production environment.


To test the steps in this tutorial, you should follow these recommendations:

- You should not use your production environment, unless this is necessary.
- If you don't have an Azure AD trial environment, you can get a one-month trial [here](https://azure.microsoft.com/pricing/free-trial/). 

 
## Scenario Description
The objective of this tutorial is to enable you to test Azure AD single sign-on in a test environment.  
The scenario outlined in this tutorial consists of three main building blocks:

1. Adding Litmos from the gallery 
2. Configuring and testing Azure AD single sign-on


## Adding Litmos from the gallery
To configure the integration of Litmos into Azure AD, you need to add Litmos from the gallery to your list of managed SaaS apps.

**To add Litmos from the gallery, perform the following steps:**

1. In the **Azure classic portal**, on the left navigation pane, click **Active Directory**. 

	![Active Directory][1]

2. From the **Directory** list, select the directory for which you want to enable directory integration.

3. To open the applications view, in the directory view, click **Applications** in the top menu.

	![Applications][2]

4. Click **Add** at the bottom of the page.

	![Applications][3]

5. On the **What do you want to do** dialog, click **Add an application from the gallery**.

	![Applications][4]

6. In the search box, type **Litmos**.

	![Applications][5]

7. In the results pane, select **Litmos**, and then click **Complete** to add the application.

	![Applications][500]


##  Configuring and testing Azure AD single sign-on
The objective of this section is to show you how to configure and test Azure AD single sign-on with Litmos based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Litmos to an user in Azure AD is. In other words, a link relationship between an Azure AD user and the related user in Litmos needs to be established.  
This link relationship is established by assigning the value of the **user name** in Azure AD as the value of the **Username** in Litmos.
 
To configure and test Azure AD single sign-on with Litmos, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-single-sign-on)** - to enable your users to use this feature.
2. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Creating a Litmos test user](#creating-a-halogen-software-test-user)** - to have a counterpart of Britta Simon in Litmos that is linked to the Azure AD representation of her.
5. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD Single Sign-On

The objective of this section is to enable Azure AD single sign-on in the Azure AD classic portal and to configure single sign-on in your Litmos application.  
As part of this procedure, you are required to create a base-64 encoded certificate file.  
If you are not familiar with this procedure, see [How to convert a binary certificate into a text file](http://youtu.be/PlgrzUZ-Y1o).

As part of the configuration, you need to customize the **SAML Token Attributes** for your Litmos application.  

![Azure AD Single Sign-On][17] 

**To configure Azure AD single sign-on with Litmos, perform the following steps:**

1. In the Azure AD classic portal, on the **Litmos** application integration page, click **Configure single sign-on** to open the **Configure Single Sign-On**  dialog.

	![Configure Single Sign-On][6] 

2. On the **How would you like users to sign on to Litmos** page, select **Azure AD Single Sign-On**, and then click **Next**.
 
	![Azure AD Single Sign-On][7] 


1. Sign-on to your Litmos company site (e.g.: *https://azureapptest.litmos.com/account/Login*) as an administrator.

	![Azure AD Single Sign-On][21] 


1. In the navigation bar on the left side, click **Accounts**.

	![Azure AD Single Sign-On][22] 


1. Click the **Integrations** tab.

	![Azure AD Single Sign-On][23] 


1. On the **Integrations** tab, scroll down to **3rd Party Integrations**, and then click **SAML 2.0** tab.

	![Azure AD Single Sign-On][24] 

1. Copy the value under **The SAML endoiint for litmos is:**.

	![Azure AD Single Sign-On][26] 


3. In the Azure classic portal, on the **Configure App Settings** dialog page, perform the following steps:

	![Azure AD Single Sign-On][8] 
 
    a. In the **Identifier** textbox, type the URL used by your users to sign-on to your Litmos application (e.g.: *https://azureapptest.litmos.com/account/Login*).
     
    b. In the **Reply URL** textbox, paste the value you have copied from the Litmos application in the previous step.

    c. Click **Next**.
 
4. On the **Configure single sign-on at Litmos** page, perform the following steps:

	![Azure AD Single Sign-On][2] 

    a. Click Download certificate, and then save the file on your computer.


1. In your **Litmos** application, perform the following steps:

	![Azure AD Single Sign-On][25] 

    a. Click **Enable SAML**.

    b. Create a **base-64 encoded** file from your downloaded certificate.  

    >[AZURE.TIP] For more details, see [How to convert a binary certificate into a text file](http://youtu.be/PlgrzUZ-Y1o)

    c. Open your base-64 encoded certificate in notepad, copy the content of it into your clipboard, and then paste it to the **SAML X.509 Certificate** textbox.

    d. Click **Save Changes**.


6. On the Azure AD classic portal, select the single sign-on configuration confirmation, and then click **Next**. 

	![Azure AD Single Sign-On][10]

7. On the **Single sign-on confirmation** page, click **Complete**.  
  
	![Azure AD Single Sign-On][11]


20. In the menu on the top, click **Attributes** to open the **SAML Token Attributes** dialog. 

	![Configure Single Sign-On][12]


24. On the **Add User Attribute** dialog, perform the following steps: 

	![Configure Single Sign-On][14]

    | Attribute Name | Attribute Value |
    | ---            | ---             |
    | Email          | user.mail       |
    | FirstName      | user.givenname  |
    | Lastname       | user.surname    |

    For each data row in the table above, perform the following steps:
   
    a. Click **add user attribute**. 

	![Configure Single Sign-On][15]


    a. In the **Attribute Name** textbox, type the **Attribute Name** shown for that row.

    b. Select the **Attribute Value** shown for that row.

    c. Click **Complete** to close the **Add User Attribute** dialog.


25. Click **Apply Changes**. 

	![Configure Single Sign-On][16]




### Creating an Azure AD test user
The objective of this section is to create a test user in the Azure classic portal called Britta Simon.  

![Create Azure AD User][20]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure clasic portal**, on the left navigation pane, click **Active Directory**.

	![Creating an Azure AD test user](./media/active-directory-saas-litmos-tutorial/create_aaduser_09.png)  

2. From the **Directory** list, select the directory for which you want to enable directory integration.

3. To display the list of users, in the menu on the top, click **Users**.

	![Creating an Azure AD test user](./media/active-directory-saas-litmos-tutorial/create_aaduser_03.png) 
 
4. To open the **Add User** dialog, in the toolbar on the bottom, click **Add User**. 

	![Creating an Azure AD test user](./media/active-directory-saas-litmos-tutorial/create_aaduser_04.png) 

5. On the **Tell us about this user** dialog page, perform the following steps: 

	![Creating an Azure AD test user](./media/active-directory-saas-litmos-tutorial/create_aaduser_05.png)  

    a. As **Type Of User**, select **New user in your organization**.

    b. In the User Name **textbox**, type **BrittaSimon**.

    c. Click **Next**.

6.  On the **User Profile** dialog page, perform the following steps: 

	![Creating an Azure AD test user](./media/active-directory-saas-litmos-tutorial/create_aaduser_06.png) 
 
    a. In the **First Name** textbox, type **Britta**.  

    b. In the **Last Name** textbox, type, **Simon**.

    c. In the **Display Name** textbox, type **Britta Simon**.

    d. In the **Role** list, select **User**.
    e. Click **Next**.

7. On the **Get temporary password** dialog page, click **create**.

	![Creating an Azure AD test user](./media/active-directory-saas-litmos-tutorial/create_aaduser_07.png) 
 
8. On the **Get temporary password** dialog page, perform the following steps:

	![Creating an Azure AD test user](./media/active-directory-saas-litmos-tutorial/create_aaduser_08.png) 
  
    a. Write down the value of the **New Password**.

    b. Click **Complete**.   

  
 
### Creating a Litmos test user

The objective of this section is to create a user called Britta Simon in Litmos.  
The Litmos application supports Just-in-Time provisioning. This means, a user account is automatically created if necessary during an attempt to access the application using the Access Panel.

**To create a user called Britta Simon in Litmos, perform the following steps:**


1. Sign-on to your Litmos company site (e.g.: *https://azureapptest.litmos.com/account/Login*) as an administrator.

	![Azure AD Single Sign-On][21] 


1. In the navigation bar on the left side, click **Accounts**.

	![Azure AD Single Sign-On][22] 


1. Click the **Integrations** tab.

	![Azure AD Single Sign-On][23] 


1. On the **Integrations** tab, scroll down to **3rd Party Integrations**, and then click **SAML 2.0** tab.

	![Azure AD Single Sign-On][24] 

1. Select **Autogenerate Users:**.

	![Azure AD Single Sign-On][27] 


### Assigning the Azure AD test user

The objective of this section is to enabling Britta Simon to use Azure single sign-on by granting her access to Litmos.

![Assign User][200] 

**To assign Britta Simon to Litmos, perform the following steps:**

1. On the Azure classic portal, to open the applications view, in the directory view, click **Applications** in the top menu.

	![Assign User][201] 

2. In the applications list, select **Litmos**.

	![Assign User][202] 

1. In the menu on the top, click **Users**.

	![Assign User][203] 

1. In the Users list, select **Britta Simon**.

2. In the toolbar on the bottom, click **Assign**.

	![Assign User][205]



### Testing Single Sign-On

The objective of this section is to test your Azure AD single sign-on configuration using the Access Panel.  
When you click the Litmos tile in the Access Panel, you should get automatically signed-on to your Litmos application.


## Additional Resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)

<!--Image references-->

[1]: ./media/active-directory-saas-litmos-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-litmos-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-litmos-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-litmos-tutorial/tutorial_general_04.png
[5]: ./media/active-directory-saas-litmos-tutorial/tutorial_litmos_01.png
[500]: ./media/active-directory-saas-litmos-tutorial/tutorial_litmos_02.png

[6]: ./media/active-directory-saas-litmos-tutorial/tutorial_general_05.png
[7]: ./media/active-directory-saas-litmos-tutorial/tutorial_litmos_03.png
[8]: ./media/active-directory-saas-litmos-tutorial/tutorial_litmos_04.png
[9]: ./media/active-directory-saas-litmos-tutorial/tutorial_litmos_05.png
[10]: ./media/active-directory-saas-litmos-tutorial/tutorial_general_06.png
[11]: ./media/active-directory-saas-litmos-tutorial/tutorial_general_07.png
[12]: ./media/active-directory-saas-litmos-tutorial/tutorial_general_80.png
[13]: ./media/active-directory-saas-litmos-tutorial/tutorial_general_81.png
[14]: ./media/active-directory-saas-litmos-tutorial/tutorial_general_82.png
[15]: ./media/active-directory-saas-litmos-tutorial/tutorial_general_81.png
[16]: ./media/active-directory-saas-litmos-tutorial/tutorial_general_19.png
[17]: ./media/active-directory-saas-litmos-tutorial/tutorial_litmos_67.png


[20]: ./media/active-directory-saas-litmos-tutorial/tutorial_general_100.png
[21]: ./media/active-directory-saas-litmos-tutorial/tutorial_litmos_60.png
[22]: ./media/active-directory-saas-litmos-tutorial/tutorial_litmos_61.png
[23]: ./media/active-directory-saas-litmos-tutorial/tutorial_litmos_62.png
[24]: ./media/active-directory-saas-litmos-tutorial/tutorial_litmos_63.png
[25]: ./media/active-directory-saas-litmos-tutorial/tutorial_litmos_64.png
[26]: ./media/active-directory-saas-litmos-tutorial/tutorial_litmos_65.png
[27]: ./media/active-directory-saas-litmos-tutorial/tutorial_litmos_66.png

[200]: ./media/active-directory-saas-litmos-tutorial/tutorial_general_200.png
[201]: ./media/active-directory-saas-litmos-tutorial/tutorial_general_201.png
[202]: ./media/active-directory-saas-litmos-tutorial/tutorial_litmos_68.png
[203]: ./media/active-directory-saas-litmos-tutorial/tutorial_general_203.png
[204]: ./media/active-directory-saas-litmos-tutorial/tutorial_general_204.png
[205]: ./media/active-directory-saas-litmos-tutorial/tutorial_general_205.png


[400]: ./media/active-directory-saas-litmos-tutorial/tutorial_litmos_400.png
[401]: ./media/active-directory-saas-litmos-tutorial/tutorial_litmos_401.png
[402]: ./media/active-directory-saas-litmos-tutorial/tutorial_litmos_402.png






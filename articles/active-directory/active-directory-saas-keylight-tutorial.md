<properties
	pageTitle="Tutorial: Azure Active Directory integration with Keylight | Microsoft Azure"
	description="Learn how to configure single sign-on between Azure Active Directory and Keylight."
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
	ms.date="07/11/2016"
	ms.author="jeedes"/>


# Tutorial: Azure Active Directory integration with Keylight

In this tutorial, you learn how to integrate Keylight with Azure Active Directory (Azure AD).

Integrating Keylight with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Keylight
- You can enable your users to automatically get signed-on to Keylight (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure classic portal

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites

To configure Azure AD integration with Keylight, you need the following items:

- An Azure subscription
- A Keylight single-sign on enabled subscription


> [AZURE.NOTE] To test the steps in this tutorial, we do not recommend using a production environment.


To test the steps in this tutorial, you should follow these recommendations:

- You should not use your production environment, unless this is necessary.
- If you don't have an Azure AD trial environment, you can get a one-month trial [here](https://azure.microsoft.com/pricing/free-trial/).


## Scenario Description
In this tutorial, you test Azure AD single sign-on in a test environment. 

The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Keylight from the gallery
2. Configuring and testing Azure AD single sign-on


## Adding Keylight from the gallery
To configure the integration of Keylight into Azure AD, you need to add Keylight from the gallery to your list of managed SaaS apps.

**To add Keylight from the gallery, perform the following steps:**

1. In the **Azure classic portal**, on the left navigation pane, click **Active Directory**. 

	![Active Directory][1]

2. From the **Directory** list, select the directory for which you want to enable directory integration.

3. To open the applications view, in the directory view, click **Applications** in the top menu.

	![Applications][2]

4. Click **Add** at the bottom of the page.

	![Applications][3]

5. On the **What do you want to do** dialog, click **Add an application from the gallery**.

	![Applications][4]

6. In the search box, type **Keylight**.

	![Creating an Azure AD test user](./media/active-directory-saas-keylight-tutorial/tutorial_keylight_01.png)

7. In the results pane, select **Keylight**, and then click **Complete** to add the application.

	![Creating an Azure AD test user](./media/active-directory-saas-keylight-tutorial/tutorial_keylight_02.png)

##  Configuring and testing Azure AD single sign-on
In this section, you configure and test Azure AD single sign-on with Keylight based on a test user called "Britta Simon".

To configure and test Azure AD single sign-on with Keylight, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-single-sign-on)** - to enable your users to use this feature.
2. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Creating a Keylight test user](#creating-a-keylight-test-user)** - to have a counterpart of Britta Simon in Keylight that is linked to the Azure AD representation of her.
5. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD Single Sign-On

In this section, you enable Azure AD single sign-on in the Azure classic portal and configure single sign-on in your Keylight application.


**To configure Azure AD single sign-on with Keylight, perform the following steps:**

1. In the Azure classic portal, on the **Keylight** application integration page, click **Configure single sign-on** to open the **Configure Single Sign-On**  dialog.

	![Configure Single Sign-On][6] 


2. On the **How would you like users to sign on to Keylight** page, select **Azure AD Single Sign-On**, and then click **Next**.

	![Configure Single Sign-On](./media/active-directory-saas-keylight-tutorial/tutorial_keylight_03.png) 

3. On the **Configure App Settings** dialog page, perform the following steps:
 
	![Configure Single Sign-On](./media/active-directory-saas-keylight-tutorial/tutorial_keylight_04.png) 


    a. In the Sign On URL textbox, type the URL used by your users to sign-on to your Keylight application using the following pattern: **“https://\<company name\>.keylightgrc.com/Login.aspx?saml=1”**.


4. On the **Configure single sign-on at Keylight** page, perform the following steps:
 
	![Configure Single Sign-On](./media/active-directory-saas-keylight-tutorial/tutorial_keylight_05.png) 

    a. Click **Download certificate**, and then save the file on your computer.

    b. Click **Next**.


5. To enable SSO in Keylight, perform the following steps:
 
    a. Sign-on to your Keylight account as administrator.

    b. In the menu on the top, click **Person**, and select **Keylight Setup**.
       
	![Configure Single Sign-On](./media/active-directory-saas-keylight-tutorial/401.png) 

    c. In the treeview on the left, click **SAML**.

	![Configure Single Sign-On](./media/active-directory-saas-keylight-tutorial/402.png) 

    d. On the **SAML Settings** dialog, click **Edit**.

	![Configure Single Sign-On](./media/active-directory-saas-keylight-tutorial/404.png) 
  

5. On the **Edit SAML Settings** dialog page, perform the following steps:

	![Configure Single Sign-On](./media/active-directory-saas-keylight-tutorial/405.png) 

    a. Set **SAML authentication** to **Active**.


    b. In Azure AD classic portal, copy the **SAML SSO URL** value, and then paste it into the **Identity Provider Login URL** textbox.

    c. In Azure AD classic portal, copy the **Single Sign-Out Service URL** value, and then paste it into the **Identity Provider Logout URL** textbox.

    d. Click **Choose File** to select your downloaded Keylight certificate, and then click **Open** to upload the certificate.


    e. Set **SAML User Id location** to **NameIdentifier element of the subject statement**.
   
    f. Provide the **Keylight Service Provider using the following pattern: **https://&lt;Company Name&gt;.keylightgrc.com**.

    g. Set **Auto-provision users** to **Active**.

    h. Set **Auto-provision account type** to **Full User**.

    i. As **Auto-provision security role**, select **Standard User with SAML**.
   
    j. As **Auto-provision security config**, select **Standard User Configuration**.
   
    k. In the Email attribute textbox, type **http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress**.

    l. In the **First name attribute** textbox, type **http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname**.

    m. In the **Last name attribute** textbox, type **http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname**.

    n. Click **Save**.
   
  
   
  
6. In the Azure classic portal, select the single sign-on configuration confirmation, and then click **Next**.

	![Azure AD Single Sign-On][10]

7. On the **Single sign-on confirmation** page, click **Complete**.  

	![Azure AD Single Sign-On][11]




### Creating an Azure AD test user
In this section, you create a test user in the Azure classic portal called Britta Simon.

In the Users list, select **Britta Simon**.

![Create Azure AD User][20]



**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure classic Portal**, on the left navigation pane, click **Active Directory**.

	![Creating an Azure AD test user](./media/active-directory-saas-keylight-tutorial/create_aaduser_09.png) 


2. From the **Directory** list, select the directory for which you want to enable directory integration.

3. To display the list of users, in the menu on the top, click **Users**.

	![Creating an Azure AD test user](./media/active-directory-saas-keylight-tutorial/create_aaduser_03.png) 


4. To open the **Add User** dialog, in the toolbar on the bottom, click **Add User**.

	![Creating an Azure AD test user](./media/active-directory-saas-keylight-tutorial/create_aaduser_04.png) 

5. On the **Tell us about this user** dialog page, perform the following steps:

	![Creating an Azure AD test user](./media/active-directory-saas-keylight-tutorial/create_aaduser_05.png) 

    a. As Type Of User, select New user in your organization.

    b. In the User Name **textbox**, type **BrittaSimon**.

    c. Click **Next**.

6.  On the **User Profile** dialog page, perform the following steps:

	![Creating an Azure AD test user](./media/active-directory-saas-keylight-tutorial/create_aaduser_06.png) 

    a. In the **First Name** textbox, type **Britta**.  

    b. In the **Last Name** textbox, type, **Simon**.

    c. In the **Display Name** textbox, type **Britta Simon**.

    d. In the **Role** list, select **User**.

    e. Click **Next**.

7. On the **Get temporary password** dialog page, click **create**.

	![Creating an Azure AD test user](./media/active-directory-saas-keylight-tutorial/create_aaduser_07.png) 

8. On the **Get temporary password** dialog page, perform the following steps:

	![Creating an Azure AD test user](./media/active-directory-saas-keylight-tutorial/create_aaduser_08.png) 

    a. Write down the value of the **New Password**.

    b. Click **Complete**.   



### Creating a Keylight test user

In this section, you create a user called Britta Simon in Keylight. Keylight supports just-in-time provisioning, which is enabled by default.

There is no action item for you in this section. A new user is created when accessing Keylight if the user doesn't exist yet. 

> [AZURE.NOTE] If you need to create a user manually, you need to contact the Keylight support team.


### Assigning the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting her access to Keylight.

![Assign User][200] 

**To assign Britta Simon to Keylight, perform the following steps:**

1. On the Azure classic portal, to open the applications view, in the directory view, click **Applications** in the top menu.

	![Assign User][201] 

2. In the applications list, select **Keylight**.

	![Configure Single Sign-On](./media/active-directory-saas-keylight-tutorial/tutorial_keylight_50.png) 

1. In the menu on the top, click **Users**.

	![Assign User][203] 

1. In the Users list, select **Britta Simon**.

2. In the toolbar on the bottom, click **Assign**.

	![Assign User][205]



### Testing Single Sign-On

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Keylight tile in the Access Panel, you should get automatically signed-on to your Keylight application.


## Additional Resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)



<!--Image references-->

[1]: ./media/active-directory-saas-keylight-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-keylight-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-keylight-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-keylight-tutorial/tutorial_general_04.png

[6]: ./media/active-directory-saas-keylight-tutorial/tutorial_general_05.png
[10]: ./media/active-directory-saas-keylight-tutorial/tutorial_general_06.png
[11]: ./media/active-directory-saas-keylight-tutorial/tutorial_general_07.png
[20]: ./media/active-directory-saas-keylight-tutorial/tutorial_general_100.png

[200]: ./media/active-directory-saas-keylight-tutorial/tutorial_general_200.png
[201]: ./media/active-directory-saas-keylight-tutorial/tutorial_general_201.png
[203]: ./media/active-directory-saas-keylight-tutorial/tutorial_general_203.png
[204]: ./media/active-directory-saas-keylight-tutorial/tutorial_general_204.png
[205]: ./media/active-directory-saas-keylight-tutorial/tutorial_general_205.png

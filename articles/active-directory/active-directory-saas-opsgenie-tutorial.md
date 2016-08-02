<properties
	pageTitle="Tutorial: Azure Active Directory integration with OpsGenie | Microsoft Azure"
	description="Learn how to configure single sign-on between Azure Active Directory and OpsGenie."
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
	ms.date="07/14/2016"
	ms.author="jeedes"/>


# Tutorial: Azure Active Directory integration with OpsGenie

The objective of this tutorial is to show you how to integrate OpsGenie with Azure Active Directory (Azure AD).

Integrating OpsGenie with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to OpsGenie
- You can enable your users to automatically get signed-on to OpsGenie (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure classic portal

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites

To configure Azure AD integration with OpsGenie, you need the following items:

- An Azure AD subscription
- An OpsGenie single sign-on enabled subscription


> [AZURE.NOTE] To test the steps in this tutorial, we do not recommend using a production environment.


To test the steps in this tutorial, you should follow these recommendations:

- You should not use your production environment, unless this is necessary.
- If you don't have an Azure AD trial environment, you can get a one-month trial [here](https://azure.microsoft.com/pricing/free-trial/).


## Scenario description
The objective of this tutorial is to enable you to test Azure AD single sign-on in a test environment. 

The scenario outlined in this tutorial consists of two main building blocks:

1. Adding OpsGenie from the gallery
2. Configuring and testing Azure AD single sign-on


## Adding OpsGenie from the gallery
To configure the integration of OpsGenie into Azure AD, you need to add OpsGenie from the gallery to your list of managed SaaS apps.

**To add OpsGenie from the gallery, perform the following steps:**

1. In the **Azure classic portal**, on the left navigation pane, click **Active Directory**. 

	![Active Directory][1]

2. From the **Directory** list, select the directory for which you want to enable directory integration.

3. To open the applications view, in the directory view, click **Applications** in the top menu.

	![Applications][2]

4. Click **Add** at the bottom of the page.

	![Applications][3]

5. On the **What do you want to do** dialog, click **Add an application from the gallery**.

	![Applications][4]

6. In the search box, type **OpsGenie**.

	![Creating an Azure AD test user](./media/active-directory-saas-opsgenie-tutorial/tutorial_opsgenie_01.png)

7. In the results pane, select **OpsGenie**, and then click **Complete** to add the application.

	![Creating an Azure AD test user](./media/active-directory-saas-opsgenie-tutorial/tutorial_opsgenie_02.png)


##  Configuring and testing Azure AD single sign-on
The objective of this section is to show you how to configure and test Azure AD single sign-on with OpsGenie based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know the counterpart user in OpsGenie to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in OpsGenie needs to be established.

This link relationship is established by assigning the value of the **user name** in Azure AD as the value of the **Username** in OpsGenie.

To configure and test Azure AD single sign-on with OpsGenie, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-single-sign-on)** - to enable your users to use this feature.
2. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Creating a OpsGenie test user](#creating-a-opsgenie-test-user)** - to have a counterpart of Britta Simon in OpsGenie that is linked to the Azure AD representation of her.
5. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD single sign-on

The objective of this section is to enable Azure AD single sign-on in the Azure Classic portal and to configure single sign-on in your OpsGenie application.



**To configure Azure AD single sign-on with OpsGenie, perform the following steps:**

1. In the Azure classic portal, on the **OpsGenie** application integration page, click **Configure single sign-on** to open the **Configure Single Sign-On**  dialog.

	![Configure Single Sign-On][6] 

2. On the **How would you like users to sign on to OpsGenie** page, select **Azure AD Single Sign-On**, and then click **Next**.

	![Configure Single Sign-On](./media/active-directory-saas-opsgenie-tutorial/tutorial_opsgenie_03.png) 

3. On the **Configure App Settings** dialog page, perform the following steps:

	![Configure Single Sign-On](./media/active-directory-saas-opsgenie-tutorial/tutorial_opsgenie_04.png) 


    a. In the Sign On URL textbox, type the URL used by your users to sign-on to your OpsGenie application using the following pattern: **“https://app.opsgenie.com/auth/login”**.

    > [AZURE.NOTE] Please contact your [OpsGenie support team](mailto:support@opsgenie.com) if you need your Sign On URL.

    b. Click **Next**.


4. On the **Configure single sign-on at OpsGenie** page, perform the following steps:

	![Configure Single Sign-On](./media/active-directory-saas-opsgenie-tutorial/tutorial_opsgenie_05.png) 

    a. Click **Download Certificate**, and then save the file on your computer. We will need this certificate and Metadata URLs (Entity ID, SSO Sign In URL and Sign Out URL) to set up SSO on OpsGenie side.

    b. Click **Next**.


5. Open another browser instance, and then log-in to OpsGenie as an administrator.

6. Click **Settings**, and then click the **Single Sign On** tab.
 
	![OpsGenie Single Sign-On](./media/active-directory-saas-opsgenie-tutorial/tutorial_opsgenie_06.png) 

7. To enable SSO, select **Enabled**.

	![OpsGenie Settings](./media/active-directory-saas-opsgenie-tutorial/tutorial_opsgenie_07.png) 
   
8. In the **Provider** section, click the **Azure Active Directory** tab.

	![OpsGenie Settings](./media/active-directory-saas-opsgenie-tutorial/tutorial_opsgenie_08.png) 
    
9. On the Azure Active Directory dialog page, perform the following steps:
 
	![OpsGenie Settings](./media/active-directory-saas-opsgenie-tutorial/tutorial_opsgenie_09.png) 

    a. In the Azure classic portal, on the **Configure single sign-on at OpsGenie** dialog page, copy the **Single Sign On Service URL** value, and then paste it into the **SAML 2.0 Endpoint** textbox.

    b. Create a base-64 encoded file from your downloaded certificate.      
    
    > [AZURE.NOTE] For more details, see [How to convert a binary certificate into a text file](https://www.youtube.com/watch?v=PlgrzUZ-Y1o&feature=youtu.be).

    c. Open your base-64 encoded certificate in notepad, copy the content of it into your clipboard, and then paste it into the **X.500 Certificate** textbox.

    d. Click **Save Changes**.


6. In the Azure classic portal, select the single sign-on configuration confirmation, and then click **Next**.

	![Azure AD Single Sign-On][10]

7. On the **Single sign-on confirmation** page, click **Complete**.  

	![Azure AD Single Sign-On][11]




### Creating an Azure AD test user
The objective of this section is to create a test user in the Azure classic portal called Britta Simon.



![Create Azure AD User][20]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure classic Portal**, on the left navigation pane, click **Active Directory**.

	![Creating an Azure AD test user](./media/active-directory-saas-opsgenie-tutorial/create_aaduser_09.png) 

2. From the **Directory** list, select the directory for which you want to enable directory integration.

3. To display the list of users, in the menu on the top, click **Users**.

	![Creating an Azure AD test user](./media/active-directory-saas-opsgenie-tutorial/create_aaduser_03.png) 

4. To open the **Add User** dialog, in the toolbar on the bottom, click **Add User**.

	![Creating an Azure AD test user](./media/active-directory-saas-opsgenie-tutorial/create_aaduser_04.png) 

5. On the **Tell us about this user** dialog page, perform the following steps:

	![Creating an Azure AD test user](./media/active-directory-saas-opsgenie-tutorial/create_aaduser_05.png) 

    a. As Type Of User, select New user in your organization.

    b. In the User Name **textbox**, type **BrittaSimon**.

    c. Click **Next**.

6.  On the **User Profile** dialog page, perform the following steps:

	![Creating an Azure AD test user](./media/active-directory-saas-opsgenie-tutorial/create_aaduser_06.png) 

    a. In the **First Name** textbox, type **Britta**.  

    b. In the **Last Name** textbox, type, **Simon**.

    c. In the **Display Name** textbox, type **Britta Simon**.

    d. In the **Role** list, select **User**.

    e. Click **Next**.

7. On the **Get temporary password** dialog page, click **create**.

	![Creating an Azure AD test user](./media/active-directory-saas-opsgenie-tutorial/create_aaduser_07.png) 

8. On the **Get temporary password** dialog page, perform the following steps:

	![Creating an Azure AD test user](./media/active-directory-saas-opsgenie-tutorial/create_aaduser_08.png) 

    a. Write down the value of the **New Password**.

    b. Click **Complete**.   



### Creating a OpsGenie test user

The objective of this section is to create a user called Britta Simon in OpsGenie. 

1.	In a web browser window, log into your OpsGenie tenant as an administrator.

2.	Navigate to Users list by clicking **User** in left panel.
   
	![OpsGenie Settings](./media/active-directory-saas-opsgenie-tutorial/tutorial_opsgenie_10.png) 

3.	Click "**Add User**".

3.	On the **Add User** dialog, perform the following steps:

	![OpsGenie Settings](./media/active-directory-saas-opsgenie-tutorial/tutorial_opsgenie_11.png) 

    a. In the **Email** textbox, type Britta's email address in Azure Active Directory.

    b. In the **Full Name** textbox, type **Britta Simon**.

    c. Click **Save**. 

Britta will get an email with instructions for setting up her profile.


### Assigning the Azure AD test user

The objective of this section is to enabling Britta Simon to use Azure single sign-on by granting her access to OpsGenie.

![Assign User][200] 

**To assign Britta Simon to OpsGenie, perform the following steps:**

1. On the Azure classic portal, to open the applications view, in the directory view, click **Applications** in the top menu.
 
	![Assign User][201] 

2. In the applications list, select **OpsGenie**.

	![Configure Single Sign-On](./media/active-directory-saas-opsgenie-tutorial/tutorial_opsgenie_50.png) 

1. In the menu on the top, click **Users**.

	![Assign User][203] 

1. In the Users list, select **Britta Simon**.

2. In the toolbar on the bottom, click **Assign**.

	![Assign User][205]



### Testing single sign-on

The objective of this section is to test your Azure AD single sign-on configuration using the Access Panel.

When you click the OpsGenie tile in the Access Panel, you should get automatically signed-on to your OpsGenie application.


## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)


<!--Image references-->

[1]: ./media/active-directory-saas-opsgenie-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-opsgenie-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-opsgenie-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-opsgenie-tutorial/tutorial_general_04.png

[6]: ./media/active-directory-saas-opsgenie-tutorial/tutorial_general_05.png
[10]: ./media/active-directory-saas-opsgenie-tutorial/tutorial_general_06.png
[11]: ./media/active-directory-saas-opsgenie-tutorial/tutorial_general_07.png
[20]: ./media/active-directory-saas-opsgenie-tutorial/tutorial_general_100.png

[200]: ./media/active-directory-saas-opsgenie-tutorial/tutorial_general_200.png
[201]: ./media/active-directory-saas-opsgenie-tutorial/tutorial_general_201.png
[203]: ./media/active-directory-saas-opsgenie-tutorial/tutorial_general_203.png
[204]: ./media/active-directory-saas-opsgenie-tutorial/tutorial_general_204.png
[205]: ./media/active-directory-saas-opsgenie-tutorial/tutorial_general_205.png

<properties
	pageTitle="Tutorial: Azure Active Directory integration with Jive | Microsoft Azure"
	description="Learn how to configure single sign-on between Azure Active Directory and Jive."
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
	ms.date="06/07/2016"
	ms.author="jeedes"/>


# Tutorial: Azure Active Directory integration with Jive

In this tutorial, you learn how to integrate Jive with Azure Active Directory (Azure AD).

Integrating Jive with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Jive
- You can enable your users to automatically get signed-on to Jive (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure classic portal

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites

To configure Azure AD integration with Jive, you need the following items:

- An Azure AD subscription
- A Jive single-sign on enabled subscription


> [AZURE.NOTE] To test the steps in this tutorial, we do not recommend using a production environment.


To test the steps in this tutorial, you should follow these recommendations:

- You should not use your production environment, unless this is necessary.
- If you don't have an Azure AD trial environment, you can get a one-month trial [here](https://azure.microsoft.com/pricing/free-trial/).


## Scenario Description
In this tutorial, you test Azure AD single sign-on in a test environment.

The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Jive from the gallery
2. Configuring and testing Azure AD single sign-on


## Adding Jive from the gallery
To configure the integration of Jive into Azure AD, you need to add Jive from the gallery to your list of managed SaaS apps.

**To add Jive from the gallery, perform the following steps:**

1. In the **Azure classic portal**, on the left navigation pane, click **Active Directory**.

	![Active Directory][1]
2. From the **Directory** list, select the directory for which you want to enable directory integration.

3. To open the applications view, in the directory view, click **Applications** in the top menu.

	![Applications][2]

4. Click **Add** at the bottom of the page.

	![Applications][3]

5. On the **What do you want to do** dialog, click **Add an application from the gallery**.

	![Applications][4]

6. In the search box, type **Jive**.

	![Creating an Azure AD test user](./media/active-directory-saas-jive-tutorial/tutorial_jive_01.png)
7. In the results pane, select **Jive**, and then click **Complete** to add the application.

	![Creating an Azure AD test user](./media/active-directory-saas-jive-tutorial/tutorial_jive_02.png)


##  Configuring and testing Azure AD single sign-on
In this section, you configure and test Azure AD single sign-on with Jive based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Jive is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Jive needs to be established.

This link relationship is established by assigning the value of the **user name** in Azure AD as the value of the **Username** in Jive.

To configure and test Azure AD single sign-on with Jive, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Creating a Jive test user](#creating-a-jive-test-user)** - to have a counterpart of Britta Simon in Jive that is linked to the Azure AD representation of her.
4. **[Configuring user provisioning](#configuring-user-provisioning)** - to outline how to enable user provisioning of Active Directory user accounts to Jive.
5. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
6. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD Single Sign-On

The objective of this section is to enable Azure AD single sign-on in the Azure classic portal and to configure single sign-on in your Jive application.

**To configure Azure AD single sign-on with Jive, perform the following steps:**

1. In the classic portal, on the **Jive** application integration page, click **Configure single sign-on** to open the **Configure Single Sign-On**  dialog.
	 
	![Configure Single Sign-On][6] 

2. On the **How would you like users to sign on to Jive** page, select **Azure AD Single Sign-On**, and then click **Next**.

	![Configure Single Sign-On](./media/active-directory-saas-jive-tutorial/tutorial_jive_03.png) 

3. On the **Configure App Settings** dialog page, perform the following steps:

	![Configure Single Sign-On](./media/active-directory-saas-jive-tutorial/tutorial_jive_04.png) 

    a. In the **Sign On URL** textbox, type the URL used by your users to sign-on to your Jive application using the following pattern: **https://\<customer name\>.jivecustom.com**.
	
	b. click **Next**
 
4. On the **Configure single sign-on at Jive** page, perform the following steps:

	![Configure Single Sign-On](./media/active-directory-saas-jive-tutorial/tutorial_jive_05.png)

    a. Click **Download certificate**, and then save the file on your computer.

    b. Click **Next**.


5. Sign-on to your Jive tenant as an administrator.

6. In the menu on the top, Click "**Saml**".

	![Configure Single Sign-On On App Side](./media/active-directory-saas-jive-tutorial/tutorial_jive_002.png)

	a. Select **Enabled** under the **Genaral** tab.

	b. Click the "**Save all saml settings**" button.

7. Navigate to the "**Idp Metadata**" tab.

	![Configure Single Sign-On On App Side](./media/active-directory-saas-jive-tutorial/tutorial_jive_003.png)

	a. Copy the content of the downloaded metadata XML file, and then paste it into the **Identity Provider (IDP) Metadata** textbox.

	b. Click the "**Save all saml settings**" button. 

8. Go to the "**User Attribute Mapping**" tab.

	![Configure Single Sign-On On App Side](./media/active-directory-saas-jive-tutorial/tutorial_jive_004.png)

	a. In the **Email** textbox, copy and paste the attribute name of **mail** value.

	b. In the **First Name** textbox, copy and paste the attribute name of **givenname** value.

	c. In the **Last Name** textbox, copy and paste the attribute name of **surname** value.
	
9. In the Azure AD portal, select the single sign-on configuration confirmation, and then click **Next**.
![Azure AD Single Sign-On][10]

10. On the **Single sign-on confirmation** page, click **Complete**.  
  ![Azure AD Single Sign-On][11]


### Creating an Azure AD test user
In this section, you create a test user in the classic portal called Britta Simon.


![Create Azure AD User][20]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure classic portal**, on the left navigation pane, click **Active Directory**.

	![Creating an Azure AD test user](./media/active-directory-saas-jive-tutorial/create_aaduser_09.png) 

2. From the **Directory** list, select the directory for which you want to enable directory integration.

3. To display the list of users, in the menu on the top, click **Users**.

	![Creating an Azure AD test user](./media/active-directory-saas-jive-tutorial/create_aaduser_03.png) 

4. To open the **Add User** dialog, in the toolbar on the bottom, click **Add User**.

	![Creating an Azure AD test user](./media/active-directory-saas-jive-tutorial/create_aaduser_04.png) 

5. On the **Tell us about this user** dialog page, perform the following steps:
	![Creating an Azure AD test user](./media/active-directory-saas-jive-tutorial/create_aaduser_05.png) 

    a. As Type Of User, select New user in your organization.

    b. In the User Name **textbox**, type **BrittaSimon**.

    c. Click **Next**.

6.  On the **User Profile** dialog page, perform the following steps:
	![Creating an Azure AD test user](./media/active-directory-saas-jive-tutorial/create_aaduser_06.png) 

    a. In the **First Name** textbox, type **Britta**.  

    b. In the **Last Name** textbox, type, **Simon**.

    c. In the **Display Name** textbox, type **Britta Simon**.

    d. In the **Role** list, select **User**.

    e. Click **Next**.

7. On the **Get temporary password** dialog page, click **create**.

	![Creating an Azure AD test user](./media/active-directory-saas-jive-tutorial/create_aaduser_07.png) 

8. On the **Get temporary password** dialog page, perform the following steps:

	![Creating an Azure AD test user](./media/active-directory-saas-jive-tutorial/create_aaduser_08.png) 

    a. Write down the value of the **New Password**.

    b. Click **Complete**.   



###Creating a Jive test user

In this section, you create a user called Britta Simon in Jive. Please work with Jive support team to add the users in the Jive platform.


###Configuring user provisioning
  
The objective of this section is to outline how to enable user provisioning of Active Directory user accounts to Jive.  
As part of this procedure, you are required to provide a user security token you need to request from Jive.com.
  
The following screenshot shows an example of the related dialog in Azure AD:

![Configure User Provisioning](./media/active-directory-saas-jive-tutorial/IC698794.png "Configure User Provisioning")

####To configure user provisioning, perform the following steps:

1.  In the Azure Management Portal, on the **Jive** application integration page, click **Configure user provisioning** to open the **Configure User Provisioning** dialog.

2.  On the **Enter your Jive credentials to enable automatic user provisioning** page, provide the following configuration settings:

    1.  In the **Jive Admin User Name** textbox, type a Jive account name that has the **System Administrator** profile in Jive.com assigned.

    2.  In the **Jive Admin Password** textbox, type the password for this account.

    3.  In the **Jive Tenant URL** textbox, type the Jive tenant URL.

        >[AZURE.NOTE] The Jive tenant URL is URL that is used by your organization to log into Jive.  
        Typically, the URL has the following format: **www.\<organization\>.jive.com**.

    4.  Click **validate** to verify your configuration.

    5.  Click the **Next** button to open the **Confirmation** page.

3.  On the **Confirmation** page, click the checkmark to save your configuration.
  
You can now create a test account, wait for 10 minutes and verify that the account has been synchronized to Jive.com.




### Assigning the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting her access to Jive.

![Assign User][200] 

**To assign Britta Simon to Jive, perform the following steps:**

1. On the classic portal, to open the applications view, in the directory view, click **Applications** in the top menu.

	![Assign User][201] 

2. In the applications list, select **Jive**.

	![Configure Single Sign-On](./media/active-directory-saas-jive-tutorial/tutorial_jive_50.png) 

3. In the menu on the top, click **Users**.

	![Assign User][203]

4. In the Users list, select **Britta Simon**.

5. In the toolbar on the bottom, click **Assign**.

	![Assign User][205]


### Testing Single Sign-On

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Jive tile in the Access Panel, you should get automatically signed-on to your Jive application.


## Additional Resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)


<!--Image references-->

[1]: ./media/active-directory-saas-jive-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-jive-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-jive-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-jive-tutorial/tutorial_general_04.png

[6]: ./media/active-directory-saas-jive-tutorial/tutorial_general_05.png
[10]: ./media/active-directory-saas-jive-tutorial/tutorial_general_06.png
[11]: ./media/active-directory-saas-jive-tutorial/tutorial_general_07.png
[20]: ./media/active-directory-saas-jive-tutorial/tutorial_general_100.png

[200]: ./media/active-directory-saas-jive-tutorial/tutorial_general_200.png
[201]: ./media/active-directory-saas-jive-tutorial/tutorial_general_201.png
[203]: ./media/active-directory-saas-jive-tutorial/tutorial_general_203.png
[204]: ./media/active-directory-saas-jive-tutorial/tutorial_general_204.png
[205]: ./media/active-directory-saas-jive-tutorial/tutorial_general_205.png

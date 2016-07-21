<properties
	pageTitle="Tutorial: Azure Active Directory integration with eDigitalResearch | Microsoft Azure"
	description="Learn how to configure single sign-on between Azure Active Directory and eDigitalResearch."
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
	ms.date="07/21/2016"
	ms.author="jeedes"/>


# Tutorial: Azure Active Directory integration with eDigitalResearch

The objective of this tutorial is to show you how to integrate eDigitalResearch with Azure Active Directory (Azure AD).

Integrating eDigitalResearch with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to eDigitalResearch
- You can enable your users to automatically get signed-on to eDigitalResearch (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure classic portal

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites

To configure Azure AD integration with eDigitalResearch, you need the following items:

- An Azure AD subscription
- A eDigitalResearch single-sign on enabled subscription


> [AZURE.NOTE] To test the steps in this tutorial, we do not recommend using a production environment.


To test the steps in this tutorial, you should follow these recommendations:

- You should not use your production environment, unless this is necessary.
- If you don't have an Azure AD trial environment, you can get a one-month trial [here](https://azure.microsoft.com/pricing/free-trial/).


## Scenario Description
The objective of this tutorial is to enable you to test Azure AD single sign-on in a test environment.

The scenario outlined in this tutorial consists of two main building blocks:

1. Adding eDigitalResearch from the gallery
2. Configuring and testing Azure AD single sign-on


## Adding eDigitalResearch from the gallery
To configure the integration of eDigitalResearch into Azure AD, you need to add eDigitalResearch from the gallery to your list of managed SaaS apps.

**To add eDigitalResearch from the gallery, perform the following steps:**

1. In the **Azure classic Portal**, on the left navigation pane, click **Active Directory**.

	![Active Directory][1]

2. From the **Directory** list, select the directory for which you want to enable directory integration.

3. To open the applications view, in the directory view, click **Applications** in the top menu.
	
	![Applications][2]

4. Click **Add** at the bottom of the page.

	![Applications][3]

5. On the **What do you want to do** dialog, click **Add an application from the gallery**.

	![Applications][4]

6. In the search box, type **eDigitalResearch**.

	![Creating an Azure AD test user](./media/active-directory-saas-edigitalresearch-tutorial/tutorial_edigitalresearch_01.png)
7. In the results pane, select **eDigitalResearch**, and then click **Complete** to add the application.

	![Selecting the app in the gallery](./media/active-directory-saas-edigitalresearch-tutorial/tutorial_edigitalresearch_0001.png)


##  Configuring and testing Azure AD single sign-on
The objective of this section is to show you how to configure and test Azure AD single sign-on with eDigitalResearch based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in eDigitalResearch to an user in Azure AD is. In other words, a link relationship between an Azure AD user and the related user in eDigitalResearch needs to be established.

This link relationship is established by assigning the value of the **user name** in Azure AD as the value of the **Username** in eDigitalResearch.

To configure and test Azure AD single sign-on with eDigitalResearch, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-single-sign-on)** - to enable your users to use this feature.
2. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Creating a eDigitalResearch test user](#creating-a-edigitalresearch-test-user)** - to have a counterpart of Britta Simon in eDigitalResearch that is linked to the Azure AD representation of her.
4. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD Single Sign-On

In this section, you enable Azure AD single sign-on in the classic portal and configure single sign-on in your eDigitalResearch application.

**To configure Azure AD single sign-on with eDigitalResearch, perform the following steps:**

1. In the classic portal, on the **eDigitalResearch** application integration page, click **Configure single sign-on** to open the **Configure Single Sign-On**  dialog.
	 
	![Configure Single Sign-On][6] 

2. On the **How would you like users to sign on to eDigitalResearch** page, select **Azure AD Single Sign-On**, and then click **Next**.

	![Configure Single Sign-On](./media/active-directory-saas-edigitalresearch-tutorial/tutorial_edigitalresearch_03.png) 

3. On the **Configure App Settings** dialog page, perform the following steps and click **Next**:

	![Configure Single Sign-On](./media/active-directory-saas-edigitalresearch-tutorial/tutorial_edigitalresearch_04.png)

    a. In the **Reply URL** textbox, type a URL using the following pattern:

	`https://<company name>.edigitalresearch.com/login/consume`

	b. Click **Next**

	> [AZURE.NOTE] Please note that these are not the real value. You have to update the values with the actual Reply URL. To get these values, contact eDigitalResearch.

4. On the **Configure single sign-on at eDigitalResearch** page, perform the following steps and click **Next**:

	![Configure Single Sign-On](./media/active-directory-saas-edigitalresearch-tutorial/tutorial_edigitalresearch_05.png)

    a. Click **Download certificate**, and then save the file on your computer.

    b. Click **Next**.

5. To get SSO configured for your application, contact your eDigitalResearch support team and provide them with the following: 

	  - The **Downloaded certificate** file
	
	  - The **Entity ID**
	
	  - The **Single Sign-Out Service URL**

6. In the classic portal, select the single sign-on configuration confirmation, and then click **Next**.

	![Azure AD Single Sign-On][10]

7. On the **Single sign-on confirmation** page, click **Complete**.  

	![Azure AD Single Sign-On][11]



### Creating an Azure AD test user
The objective of this section is to create a test user in the classic portal called Britta Simon.
	
![Create Azure AD User][20]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure classic Portal**, on the left navigation pane, click **Active Directory**.

	![Creating an Azure AD test user](./media/active-directory-saas-edigitalresearch-tutorial/create_aaduser_09.png)

2. From the **Directory** list, select the directory for which you want to enable directory integration.

3. To display the list of users, in the menu on the top, click **Users**.
	
	![Creating an Azure AD test user](./media/active-directory-saas-edigitalresearch-tutorial/create_aaduser_03.png)

4. To open the **Add User** dialog, in the toolbar on the bottom, click **Add User**.
	
	![Creating an Azure AD test user](./media/active-directory-saas-edigitalresearch-tutorial/create_aaduser_04.png)

5. On the **Tell us about this user** dialog page, perform the following steps:

	![Creating an Azure AD test user](./media/active-directory-saas-edigitalresearch-tutorial/create_aaduser_05.png)

    a. As Type Of User, select New user in your organization.

    b. In the User Name **textbox**, type **BrittaSimon**.

    c. Click **Next**.

6.  On the **User Profile** dialog page, perform the following steps:
	
	![Creating an Azure AD test user](./media/active-directory-saas-edigitalresearch-tutorial/create_aaduser_06.png)

    a. In the **First Name** textbox, type **Britta**.  

    b. In the **Last Name** textbox, type, **Simon**.

    c. In the **Display Name** textbox, type **Britta Simon**.

    d. In the **Role** list, select **User**.

    e. Click **Next**.

7. On the **Get temporary password** dialog page, click **create**.
	
	![Creating an Azure AD test user](./media/active-directory-saas-edigitalresearch-tutorial/create_aaduser_07.png)

8. On the **Get temporary password** dialog page, perform the following steps:
	
	![Creating an Azure AD test user](./media/active-directory-saas-edigitalresearch-tutorial/create_aaduser_08.png)

    a. Write down the value of the **New Password**.

    b. Click **Complete**.   



### Creating a eDigitalResearch test user

The objective of this section is to create a user called Britta Simon in eDigitalResearch. eDigitalResearch supports just-in-time provisioning, which is by default enabled.

There is no action item for you in this section. A new user will be created during an attempt to access eDigitalResearch if it doesn't exist yet. 

> [AZURE.NOTE] If you need to create an user manually, you need to contact the eDigitalResearch support team.


### Assigning the Azure AD test user

The objective of this section is to enabling Britta Simon to use Azure single sign-on by granting her access to eDigitalResearch.
	
![Assign User][200]

**To assign Britta Simon to eDigitalResearch, perform the following steps:**

1. On the classic portal, to open the applications view, in the directory view, click **Applications** in the top menu.

	![Assign User][201]

2. In the applications list, select **eDigitalResearch**.

	![Configure Single Sign-On](./media/active-directory-saas-edigitalresearch-tutorial/tutorial_edigitalresearch_50.png)

3. In the menu on the top, click **Users**.
	
	![Assign User][203]

4. In the Users list, select **Britta Simon**.

5. In the toolbar on the bottom, click **Assign**.

	![Assign User][205]



### Testing Single Sign-On

The objective of this section is to test your Azure AD single sign-on configuration using the Access Panel.

When you click the eDigitalResearch tile in the Access Panel, you should get automatically signed-on to your eDigitalResearch application.


## Additional Resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)



<!--Image references-->

[1]: ./media/active-directory-saas-edigitalresearch-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-edigitalresearch-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-edigitalresearch-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-edigitalresearch-tutorial/tutorial_general_04.png

[6]: ./media/active-directory-saas-edigitalresearch-tutorial/tutorial_general_05.png
[10]: ./media/active-directory-saas-edigitalresearch-tutorial/tutorial_general_06.png
[11]: ./media/active-directory-saas-edigitalresearch-tutorial/tutorial_general_07.png
[20]: ./media/active-directory-saas-edigitalresearch-tutorial/tutorial_general_100.png

[200]: ./media/active-directory-saas-edigitalresearch-tutorial/tutorial_general_200.png
[201]: ./media/active-directory-saas-edigitalresearch-tutorial/tutorial_general_201.png
[203]: ./media/active-directory-saas-edigitalresearch-tutorial/tutorial_general_203.png
[204]: ./media/active-directory-saas-edigitalresearch-tutorial/tutorial_general_204.png
[205]: ./media/active-directory-saas-edigitalresearch-tutorial/tutorial_general_205.png

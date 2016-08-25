<properties
	pageTitle="Tutorial: Azure Active Directory integration with Blackboard Learn | Microsoft Azure"
	description="Learn how to configure single sign-on between Azure Active Directory and Blackboard Learn."
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


# Tutorial: Azure Active Directory integration with Blackboard Learn

In this tutorial, you learn how to integrate Blackboard Learn with Azure Active Directory (Azure AD).

Integrating Blackboard Learn with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Blackboard Learn
- You can enable your users to automatically get signed-on to Blackboard Learn (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure classic portal

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites

To configure Azure AD integration with Blackboard Learn, you need the following items:

- An Azure AD subscription
- A Blackboard Learn Cloud Platform single-sign on enabled subscription


> [AZURE.NOTE] To test the steps in this tutorial, we do not recommend using a production environment.


To test the steps in this tutorial, you should follow these recommendations:

- You should not use your production environment, unless this is necessary.
- If you don't have an Azure AD trial environment, you can get a one-month trial [here](https://azure.microsoft.com/pricing/free-trial/).


## Scenario Description
In this tutorial, you test Azure AD single sign-on in a test environment.

The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Blackboard Learn from the gallery
2. Configuring and testing Azure AD single sign-on


## Adding Blackboard Learn from the gallery
To configure the integration of Blackboard Learn into Azure AD, you need to add Blackboard Learn from the gallery to your list of managed SaaS apps.

**To add Blackboard Learn from the gallery, perform the following steps:**

1. In the **Azure classic portal**, on the left navigation pane, click **Active Directory**.

	![Active Directory][1]
2. From the **Directory** list, select the directory for which you want to enable directory integration.

3. To open the applications view, in the directory view, click **Applications** in the top menu.

	![Applications][2]

4. Click **Add** at the bottom of the page.

	![Applications][3]

5. On the **What do you want to do** dialog, click **Add an application from the gallery**.

	![Applications][4]

6. In the search box, type **Blackboard Learn**.

	![Creating an Azure AD test user](./media/active-directory-saas-blackboard-learn-tutorial/tutorial_blackboardlearn_01.png)

7. In the results pane, select **Blackboard Learn**, and then click **Complete** to add the application.
	
	![Creating an Azure AD test user](./media/active-directory-saas-blackboard-learn-tutorial/tutorial_blackboardlearn_06.png)


##  Configuring and testing Azure AD single sign-on
In this section, you configure and test Azure AD single sign-on with Blackboard Learn based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Blackboard Learn is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Blackboard Learn needs to be established.

This link relationship is established by assigning the value of the **user name** in Azure AD as the value of the **Username** in Blackboard Learn.

To configure and test Azure AD single sign-on with Blackboard Learn, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Creating a Blackboard Learn test user](#creating-a-blackboard-learn-test-user)** - to have a counterpart of Britta Simon in Blackboard Learn that is linked to the Azure AD representation of her.
4. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD Single Sign-On

In this section, you enable Azure AD single sign-on in the classic portal and configure single sign-on in your Blackboard Learn application.

Blackboard Learn application expects the SAML assertions in a specific format. Please configure the following claims for this application. You can manage the values of these attributes from the **"Atrribute"** tab of the application. The following screenshot shows an example for this. 

![Configure Single Sign-On](./media/active-directory-saas-blackboard-learn-tutorial/tutorial_blackboardlearn_51.png) 

**To configure Azure AD single sign-on with Blackboard Learn, perform the following steps:**


1. In the Azure classic portal, on the **Blackboard Learn** application integration page, in the menu on the top, click **Attributes**.

	![Configure Single Sign-On](./media/active-directory-saas-blackboard-learn-tutorial/tutorial_general_80.png) 


1. On the **SAML token attributes** dialog, for each row shown in the table below, perform the following steps: We have map the Userprincipalname as the unique user attribute here but you can map it to the appropriate value which uniquely distinguish the user in the organization and that maps to Blackboard learn username field.

	| Attribute Name | Attribute Value |
	| --- | --- |    
	| urn:oid:1.3.6.1.4.1.5923.1.1.1.6	| user.userprincipalname |
   
 
	a. Click **add user attribute** to open the **Add User Attribure** dialog.

	![Configure Single Sign-On](./media/active-directory-saas-blackboard-learn-tutorial/tutorial_general_81.png) 


	b. In the **Attrubute Name** textbox, type the attribute name shown for that row.

    c. From the **Attribute Value** list, selsect the attribute value shown for that row.

    d. Click **Complete**.	

2. In the classic portal, on the **Blackboard Learn** application integration page, click **Configure single sign-on** to open the **Configure Single Sign-On**  dialog.
	 
	![Configure Single Sign-On][6] 

3. On the **How would you like users to sign on to Blackboard Learn** page, select **Azure AD Single Sign-On**, and then click **Next**.

	![Configure Single Sign-On](./media/active-directory-saas-blackboard-learn-tutorial/tutorial_blackboardlearn_03.png) 

4. On the **Configure App Settings** dialog page, perform the following steps:

	![Configure Single Sign-On](./media/active-directory-saas-blackboard-learn-tutorial/tutorial_blackboardlearn_04.png) 

    a. In the **Sign On URL** textbox, type the URL used by your users to sign-on to your Blackboard Learn application using the following pattern: **https://\<company name-pricing\>.blackboard.com/**
	
	b. click **Next**
 
5. On the **Configure single sign-on at Blackboard Learn** page, perform the following steps:

	![Configure Single Sign-On](./media/active-directory-saas-blackboard-learn-tutorial/tutorial_blackboardlearn_05.png)

    a. Click **Download metadata**, and then save the file on your computer.

    b. Click **Next**.


6. To get SSO configured for your application, contact Blackboard Learn support team and provide them with the following:

	• The downloaded metadata


7. In the classic portal, select the single sign-on configuration confirmation, and then click **Next**.
	
	![Azure AD Single Sign-On][10]

8. On the **Single sign-on confirmation** page, click **Complete**.  
 
	![Azure AD Single Sign-On][11]


### Creating an Azure AD test user
In this section, you create a test user in the classic portal called Britta Simon.


![Create Azure AD User][20]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure classic portal**, on the left navigation pane, click **Active Directory**.

	![Creating an Azure AD test user](./media/active-directory-saas-blackboard-learn-tutorial/create_aaduser_09.png) 

2. From the **Directory** list, select the directory for which you want to enable directory integration.

3. To display the list of users, in the menu on the top, click **Users**.

	![Creating an Azure AD test user](./media/active-directory-saas-blackboard-learn-tutorial/create_aaduser_03.png) 

4. To open the **Add User** dialog, in the toolbar on the bottom, click **Add User**.

	![Creating an Azure AD test user](./media/active-directory-saas-blackboard-learn-tutorial/create_aaduser_04.png) 

5. On the **Tell us about this user** dialog page, perform the following steps:
	![Creating an Azure AD test user](./media/active-directory-saas-blackboard-learn-tutorial/create_aaduser_05.png) 

    a. As Type Of User, select New user in your organization.

    b. In the User Name **textbox**, type **BrittaSimon**.

    c. Click **Next**.

6.  On the **User Profile** dialog page, perform the following steps:
	![Creating an Azure AD test user](./media/active-directory-saas-blackboard-learn-tutorial/create_aaduser_06.png) 

    a. In the **First Name** textbox, type **Britta**.  

    b. In the **Last Name** textbox, type, **Simon**.

    c. In the **Display Name** textbox, type **Britta Simon**.

    d. In the **Role** list, select **User**.

    e. Click **Next**.

7. On the **Get temporary password** dialog page, click **create**.

	![Creating an Azure AD test user](./media/active-directory-saas-blackboard-learn-tutorial/create_aaduser_07.png) 

8. On the **Get temporary password** dialog page, perform the following steps:

	![Creating an Azure AD test user](./media/active-directory-saas-blackboard-learn-tutorial/create_aaduser_08.png) 

    a. Write down the value of the **New Password**.

    b. Click **Complete**.   



### Creating an Blackboard Learn test user

In this section, you create a user called Britta Simon in Blackboard Learn. 

Blackboard Learn application support  just in time user provisioning. Please make sure that you have configured the claims as described in the section **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on)**

### Assigning the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting her access to Blackboard Learn.

![Assign User][200] 

**To assign Britta Simon to Blackboard Learn, perform the following steps:**

1. On the classic portal, to open the applications view, in the directory view, click **Applications** in the top menu.

	![Assign User][201] 

2. In the applications list, select **Blackboard Learn**.

	![Configure Single Sign-On](./media/active-directory-saas-blackboard-learn-tutorial/tutorial_blackboardlearn_50.png) 

3. In the menu on the top, click **Users**.

	![Assign User][203]

4. In the Users list, select **Britta Simon**.

5. In the toolbar on the bottom, click **Assign**.

	![Assign User][205]


### Testing Single Sign-On

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

Blackboard Learn application support When you click the Blackboard Learn tile in the Access Panel, you should get automatically signed-on to your Blackboard Learn application.


## Additional Resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)


<!--Image references-->

[1]: ./media/active-directory-saas-blackboard-learn-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-blackboard-learn-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-blackboard-learn-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-blackboard-learn-tutorial/tutorial_general_04.png

[6]: ./media/active-directory-saas-blackboard-learn-tutorial/tutorial_general_05.png
[10]: ./media/active-directory-saas-blackboard-learn-tutorial/tutorial_general_06.png
[11]: ./media/active-directory-saas-blackboard-learn-tutorial/tutorial_general_07.png
[20]: ./media/active-directory-saas-blackboard-learn-tutorial/tutorial_general_100.png

[200]: ./media/active-directory-saas-blackboard-learn-tutorial/tutorial_general_200.png
[201]: ./media/active-directory-saas-blackboard-learn-tutorial/tutorial_general_201.png
[203]: ./media/active-directory-saas-blackboard-learn-tutorial/tutorial_general_203.png
[204]: ./media/active-directory-saas-blackboard-learn-tutorial/tutorial_general_204.png
[205]: ./media/active-directory-saas-blackboard-learn-tutorial/tutorial_general_205.png

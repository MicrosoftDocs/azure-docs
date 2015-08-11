<properties
	pageTitle="Tutorial: Azure Active Directory integration with SciQuest Spend Director"
	description="Learn how to configure single sign-on between Azure Active Directory and SciQuest Spend Director."
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
	ms.date="07/30/2015"
	ms.author="markusvi"/>


# Tutorial: Azure Active Directory integration with SciQuest Spend Director

The objective of this tutorial is to show you how to integrate SciQuest Spend Director with Azure Active Directory (Azure AD).<br>Integrating SciQuest Spend Director with Azure AD provides you with the following benefits: 

- You can control in Azure AD who has access to SciQuest Spend Director 
- You can enable your users to automatically get signed-on to SciQuest Spend Director (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure Active Directory Portal

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites 

To configure Azure AD integration with SciQuest Spend Director, you need the following items:

- An Azure AD subscription
- A SciQuest Spend Director single-sign on enabled subscription


> [AZURE.NOTE] To test the steps in this tutorial, we do not recommend using a production environment.


To test the steps in this tutorial, you should follow these recommendations:

- You should not use your production environment, unless this is necessary.
- If you don't have an Azure AD trial environment, you can get a one-month trial [here](https://azure.microsoft.com/pricing/free-trial/). 

 
## Scenario Description
The objective of this tutorial is to enable you to test Azure AD single sign-on in a test environment. <br>
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding SciQuest Spend Director from the gallery 
2. Configuring and testing Azure AD single sign-on


## Adding SciQuest Spend Director from the gallery
To configure the integration of SciQuest Spend Director into Azure AD, you need to add SciQuest Spend Director from the gallery to your list of managed SaaS apps.

**To add SciQuest Spend Director from the gallery, perform the following steps:**

1. In the **Azure Management Portal**, on the left navigation pane, click **Active Directory**. <br><br>
![Active Directory][1]

2. From the **Directory** list, select the directory for which you want to enable directory integration.

3. To open the applications view, in the directory view, click **Applications** in the top menu.<br><br>
![Applications][2]
4. Click **Add** at the bottom of the page.<br><br>
![Applications][3]
5. On the **What do you want to do** dialog, click **Add an application from the gallery**.<br><br>
![Applications][4]
6. In the search box, type **sciQuest spend director**.<br>
![Applications][5]
7. In the results pane, select **SciQuest Spend Director**, and then click **Complete** to add the application.<br>
![Applications][6]


##  Configuring and testing Azure AD single sign-on
The objective of this section is to show you how to configure and test Azure AD single sign-on with SciQuest Spend Director based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in SciQuest Spend Director to an user in Azure AD is. In other words, a link relationship between an Azure AD user and the related user in SciQuest Spend Director needs to be established.<br>
This link relationship is established by assigning the value of the **user name** in Azure AD as the value of the **Username** in SciQuest Spend Director.
 
To configure and test Azure AD single sign-on with SciQuest Spend Director, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Single Sign-On](#configuring-azure-ad-single-single-sign-on)** - to enable your users to use this feature.
2. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Creating a SciQuest Spend Director test user](#creating-a-halogen-software-test-user)** - to have a counterpart of Britta Simon in SciQuest Spend Director that is linked to the Azure AD representation of her.
5. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD Single Single Sign-On

The objective of this section is to enable Azure AD single sign-on in the Azure AD portal and to configure single sign-on in your SciQuest Spend Director application.<br>

**To configure Azure AD single sign-on with SciQuest Spend Director, perform the following steps:**

1. In the Azure AD portal, on the **SciQuest Spend Director** application integration page, click **Configure single sign-on** to open the **Configure Single Sign-On**  dialog.<br><br>
![Configure Single Sign-On][8]

2. On the **How would you like users to sign on to SciQuest Spend Director** page, select **Azure AD Single Sign-On**, and then click **Next**.<br><br>
![Azure AD Single Sign-On][9]

3. On the **Configure App Settings** dialog page, perform the following steps: <br><br>![Configure App Settings][10]
 
     3.1. In the **Sign On URL** textbox, type your URL used by your users to sign on to your SciQuest Spend Director application using the following pattern: *https://.*sciquest.com/.**

     3.2. In the **Reply URL** textbox, type the same value you have typed into the **Sign On URL** textbox. 

     3.3. Click **Next**.
 
4. On the **Configure single sign-on at SciQuest Spend Director** page, click **Download metadata**, and then save the metadata file locally on your computer.<br><br>![What is Azure AD Connect][11]

5. Contact SciQuest support to enable this authentication method using the above downloaded metadata.

6. On the Azure AD portal, select the single sign-on configuration confirmation, and then click **Complete** to close the **Configure Single Sign On** dialog. <br><br>![What is Azure AD Connect][15]
10. On the **Single sign-on confirmation** page, click **Complete**.  <br><br>![What is Azure AD Connect][16]




### Creating an Azure AD test user
The objective of this section is to create a test user in the Azure portal called Britta Simon.

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure Management Portal**, on the left navigation pane, click **Active Directory**.
<br><br>![What is Azure AD Connect][100] 
2. From the **Directory** list, select the directory for which you want to enable directory integration.
3. To display the list of users, in the menu on the top, click **Users**.
<br><br>![What is Azure AD Connect][101] 
4. To open the **Add User** dialog, in the toolbar on the bottom, click **Add User**. 
<br><br>![What is Azure AD Connect][102] 
5. On the **Tell us about this user** dialog page, perform the following steps:
<br><br>![What is Azure AD Connect][103] 
  1. As **Type Of User**, select **New user in your organization**.
  2. In the User Name **textbox**, type **BrittaSimon**.
  3. Click Next.
6.  On the **User Profile** dialog page, perform the following steps: 
<br><br>![What is Azure AD Connect][104] 
  1. In the **First Name** textbox, type **Britta**.  
  2. In the **Last Name** txtbox, type, **Simon**.
  3. In the **Display Name** textbox, type **Britta Simon**.
  4. In the **Role** list, select **User**.
  5. Click **Next**.
7. On the **Get temporary password** dialog page, click **create**.
<br><br>![What is Azure AD Connect][105]  
8. On the **Get temporary password** dialog page, perform the following steps:
<br><br>![What is Azure AD Connect][106]   
  1. Write down the value of the **New Password**.
  2. Click **Complete**.   
  
 
### Creating a SciQuest Spend Director test user

The objective of this section is to create a user called Britta Simon in SciQuest Spend Director.

You need to contact your SciQuest Spend Director support team and provide them with the details about your test account to get it created.

Alternatively, you can also leverage just-in-time provisioning, a single sign-on feature that is supported by SciQuest Spend Director. <br>
If just-in-time provisioning is enabled, users are automatically created by SciQuest Spend Director during a single sign-on attempt if they don't exist. This feature eliminates the need to manually create single sign-on counterpart users.

To get just-in-time provisioning enabled, you need to contact your your SciQuest Spend Director support team.
  

### Assigning the Azure AD test user

The objective of this section is to enabling Britta Simon to use Azure single sign-on by granting her access to SciQuest Spend Director.
<br><br>![What is Azure AD Connect][200]

**To assign Britta Simon to SciQuest Spend Director, perform the following steps:**

1. On the Azure portal, to open the applications view, in the directory view, click **Applications** in the top menu.<br>
<br><br>![What is Azure AD Connect][201]
2. In the applications list, select **SciQuest Spend Director**.
<br><br>![What is Azure AD Connect][202]
1. In the menu on the top, click **Users**.<br>
<br><br>![What is Azure AD Connect][203]
1. In the Users list, select **Britta Simon**.
<br><br>![What is Azure AD Connect][204]
2. In the toolbar on the bottom, click **Assign**.
<br><br>![What is Azure AD Connect][205]



### Testing Single Sign-On

The objective of this section is to test your Azure AD single sign-on configuration using the Access Panel.<br>
When you click the SciQuest Spend Director tile in the Access Panel, you should get automatically signed-on to your SciQuest Spend Director application.


## Additional Resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)

<!--Image references-->
[1]: ./media/active-directory-saas-sciquest-spend-director/tutorial_general_01.png
[2]: ./media/active-directory-saas-sciquest-spend-director/tutorial_general_02.png
[3]: ./media/active-directory-saas-sciquest-spend-director/tutorial_general_03.png
[4]: ./media/active-directory-saas-sciquest-spend-director/tutorial_general_04.png
[5]: ./media/active-directory-saas-sciquest-spend-director/tutorial_sciquest_spend_director_01.png
[6]: ./media/active-directory-saas-sciquest-spend-director/tutorial_sciquest_spend_director_05.png
[8]: ./media/active-directory-saas-sciquest-spend-director/tutorial_general_06.png
[9]: ./media/active-directory-saas-sciquest-spend-director/tutorial_general_07.png
[10]: ./media/active-directory-saas-sciquest-spend-director/tutorial_general_08.png
[11]: ./media/active-directory-saas-sciquest-spend-director/tutorial_sciquest_spend_director_03.png
[15]: ./media/active-directory-saas-sciquest-spend-director/tutorial_sciquest_spend_director_04.png

[100]: ./media/active-directory-saas-sciquest-spend-director/tutorial_general_09.png 
[101]: ./media/active-directory-saas-sciquest-spend-director/tutorial_general_10.png 
[102]: ./media/active-directory-saas-sciquest-spend-director/tutorial_general_11.png 
[103]: ./media/active-directory-saas-sciquest-spend-director/tutorial_general_12.png 
[104]: ./media/active-directory-saas-sciquest-spend-director/tutorial_general_13.png 
[105]: ./media/active-directory-saas-sciquest-spend-director/tutorial_general_14.png 
[106]: ./media/active-directory-saas-sciquest-spend-director/tutorial_general_15.png 
[200]: ./media/active-directory-saas-sciquest-spend-director/tutorial_general_16.png 
[201]: ./media/active-directory-saas-sciquest-spend-director/tutorial_general_17.png 
[202]: ./media/active-directory-saas-sciquest-spend-director/tutorial_sciquest_spend_director_06.png
[203]: ./media/active-directory-saas-sciquest-spend-director/tutorial_general_18.png
[204]: ./media/active-directory-saas-sciquest-spend-director/tutorial_general_19.png
[205]: ./media/active-directory-saas-sciquest-spend-director/tutorial_general_20.png


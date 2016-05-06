<properties
	pageTitle="Tutorial: Azure Active Directory integration with Amazon Web Service (AWS) | Microsoft Azure"
	description="Learn how to use Amazon Web Services (AWS) with Azure Active Directory to enable single sign-on, automated provisioning, and more!"
	services="active-directory"
	documentationCenter=""
	authors="jeevansd"
	manager="stevenpo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="03/08/2016"
	ms.author="jeedes"/>


# Tutorial: Azure Active Directory integration with Amazon Web Service (AWS)

The objective of this tutorial is to show you how to integrate Amazon Web Service (AWS) with Azure Active Directory (Azure AD).<br>Integrating Amazon Web Service (AWS) with Azure AD provides you with the following benefits: 

- You can control in Azure AD who has access to Amazon Web Service (AWS) 
- You can enable your users to automatically get signed-on to Amazon Web Service (AWS) (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure classic portal

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites 

To configure Azure AD integration with Amazon Web Service (AWS), you need the following items:

- An Azure AD subscription
- An Amazon Web Service (AWS) single-sign on enabled subscription


> [AZURE.NOTE] To test the steps in this tutorial, we do not recommend using a production environment.


To test the steps in this tutorial, you should follow these recommendations:

- You should not use your production environment, unless this is necessary.
- If you don't have an Azure AD trial environment, you can get a one-month trial [here](https://azure.microsoft.com/pricing/free-trial/). 

 
## Scenario Description
The objective of this tutorial is to enable you to test Azure AD single sign-on in a test environment. <br>
The scenario outlined in this tutorial consists of three main building blocks:

1. Adding Amazon Web Service (AWS) from the gallery 
2. Configuring and testing Azure AD single sign-on


## Adding Amazon Web Service (AWS) from the gallery
To configure the integration of Amazon Web Service (AWS) into Azure AD, you need to add Amazon Web Service (AWS) from the gallery to your list of managed SaaS apps.

### To add Amazon Web Service (AWS) from the gallery, perform the following steps:

1. In the **Azure classic portal**, on the left navigation pane, click **Active Directory**. 
   <br><br>![Active Directory][1]<br> 

2. From the **Directory** list, select the directory for which you want to enable directory integration.

3. To open the applications view, in the directory view, click **Applications** in the top menu. 
   <br><br>![Applications][2]<br>

4. Click **Add** at the bottom of the page. 
   <br><br>![Applications][3]<br>

5. On the **What do you want to do** dialog, click **Add an application from the gallery**. 
   <br><br>![Applications][4]<br>

6. In the search box, type **Amazon Web Service (AWS)**.
   <br><br>![Applications][5]<br>

7. In the results pane, select **Amazon Web Service (AWS)**, and then click **Complete** to add the application.
   <br><br>![Applications][6]<br>



##  Configuring and testing Azure AD single sign-on
The objective of this section is to show you how to configure and test Azure AD single sign-on with Amazon Web Service (AWS) based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Amazon Web Service (AWS) to an user in Azure AD is. In other words, a link relationship between an Azure AD user and the related user in Amazon Web Service (AWS) needs to be established.<br>
This link relationship is established by assigning the value of the **user name** in Azure AD as the value of the **Username** in Amazon Web Service (AWS).
 
To configure and test Azure AD single sign-on with Amazon Web Service (AWS), you need to complete the following building blocks:

1. **[Configuring Azure AD Single Single Sign-On](#configuring-azure-ad-single-single-sign-on)** - to enable your users to use this feature.
2. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Creating a Amazon Web Service (AWS) test user](#creating-a-halogen-software-test-user)** - to have a counterpart of Britta Simon in Amazon Web Service (AWS) that is linked to the Azure AD representation of her.
5. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD Single Single Sign-On

The objective of this section is to enable Azure AD single sign-on in the Azure classic portal and to configure single sign-on in your Amazon Web Service (AWS) application.<br>
Your Amazon Web Service (AWS) application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your **saml token attributes** configuration. 
The following screenshot shows an example for this.


<br><br>![Configure Single Sign-On][27]<br>

**To configure Azure AD single sign-on with Amazon Web Service (AWS), perform the following steps:**

1. In the Azure classic portal, on the **Amazon Web Service (AWS)** application integration page, click **Configure single sign-on** to open the **Configure Single Sign-On**  dialog.
<br><br>![Configure Single Sign-On][7]<br>

2. On the **How would you like users to sign on to Amazon Web Service (AWS)** page, select **Azure AD Single Sign-On**, and then click **Next**.
<br><br>![Configure Single Sign-On][8]<br>

3. On the **Configure App Settings** dialog page, click Next. 
<br><br>![Configure App Settings][9]<br>
 
4. On the **Configure single sign-on at Amazon Web Service (AWS)** page, click **Download metadata**, and then save the metadata file locally on your computer.
<br><br>![Configure Single Sign-On][10]<br>

5. In a different browser window, sign-on to your Amazon Web Service (AWS) company site as administrator.

6. Click **Console Home**.
<br><br>![Configure Single Sign-On][11]<br>

7. Click **Identity and Access Management**. 
<br><br>![Configure Single Sign-On][12]<br>

8. Click **Identity Providers**, and then click **Create Provider**. 
<br><br>![Configure Single Sign-On][13]<br>

9. On the **Configure Provider** dialog page, perform the following steps: 
<br><br>![Configure Single Sign-On][14]<br>

     a. As **Provider Type**, select **SAML**.

     b. In the **Provider Name** textbox, type a provider name (e.g.: *WAAD*).

     c. To upload your downloaded metadata file, click **Choose File**.

     d. Click **Next Step**.


10. On the **Verify Provider Information** dialog page, click **Create**. 
<br><br>![Configure Single Sign-On][15]<br>

11. Click **Roles**, and then click **Create New Role**. 
<br><br>![Configure Single Sign-On][16]<br>

12. On the **Set Role Name** dialog, perform the following steps: 
<br><br>![Configure Single Sign-On][17]<br>

     a. In the **Role Name** textbox, type a role name (e.g.: *TestUser*).

     b. Click **Next Step**.

13. On the **Select Role Type** dialog, perform the following steps: 
<br><br>![Configure Single Sign-On][18]<br>

     a. Select **Role For Identity Provider Access**.

     b. In the **Grant Web Single Sign-On (WebSSO) access to SAML providers** section, click **Select**.


14. On the **Establish Trust** dialog, perform the following steps:  
<br><br>![Configure Single Sign-On][19]<br>
     
     a. As SAML provider, select the SAML provider you have created previousley (e.g.: *WAAD*) 

     b. Click **Next Step**.


15. On the **Verify Role Trust** dialog, click **Next Step**. 
<br><br>![Configure Single Sign-On][32]<br>


16. On the **Attach Policy** dialog, click **Next Step**.  
<br><br>![Configure Single Sign-On][33]<br>


17. On the **Review** dialog, perform the following steps:   
<br><br>![Configure Single Sign-On][34]<br>

     a. Copy the **Role ARN** value.

     b. Copy the **Trusted Entities** ARN value.

     c. Click **Create Role**. 

18. On the Azure classic portal, select the single sign-on configuration confirmation, and then click **Next**.
<br><br>![What is Azure AD Connect][20]<br>

19. On the **Single sign-on confirmation** page, click **Complete** to close the **Configure single sign-on** dialog.
<br><br>![What is Azure AD Connect][22]<br>


20. In the menu on the top, click **Attributes** to open the **SAML Token Attributes** dialog. 
<br><br>![Configure Single Sign-On][21]<br>

21. Click **add user attribute**. 
<br><br>![Configure Single Sign-On][23]<br>

22. On the Add User Attribute dialog, perform the following steps. 
<br><br>![Configure Single Sign-On][24]<br> 

     a. In the **Attribute Name** textbox, type **https://aws.amazon.com/SAML/Attributes/Role**.

     b. In the **Attribute Value** textbox, type **[the Role ARN value],[the Trusted Entity ARN value]**.

     >[AZURE.TIP] These are the values you have copied from the Review dialog when you have created your role. 

     c. Click **Complete** to close the **Add User Attribute** dialog.

23. Click **add user attribute**. 
<br><br>![Configure Single Sign-On][23]<br>


24. On the Add User Attribute dialog, perform the following steps. 
<br><br>![Configure Single Sign-On][25]<br>


     a. In the **Attribute Name** textbox, type **https://aws.amazon.com/SAML/Attributes/RoleSessionName**.

     b. In the **Attribute Value** textbox, type **userprincipalname**.

     c. Click **Complete** to close the **Add User Attribute** dialog.


25. Click **Apply Changes**. 
<br><br>![Configure Single Sign-On][26]<br>





### Creating an Azure AD test user

The objective of this section is to create a test user in the Azure classic portal called Britta Simon.<br>
In the Users list, select **Britta Simon**.<br><br>![Creating an Azure AD test user](./media/active-directory-saas-amazon-web-service/create_aaduser_01.png)<br>

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure classic portal**, on the left navigation pane, click **Active Directory**.
<br><br>![Creating an Azure AD test user](./media/active-directory-saas-amazon-web-service/create_aaduser_02.png)<br> 

2. From the **Directory** list, select the directory for which you want to enable directory integration.

3. To display the list of users, in the menu on the top, click **Users**.
<br><br>![Creating an Azure AD test user](./media/active-directory-saas-amazon-web-service/create_aaduser_03.png)<br> 
 
4. To open the **Add User** dialog, in the toolbar on the bottom, click **Add User**. 
<br><br>![Creating an Azure AD test user](./media/active-directory-saas-amazon-web-service/create_aaduser_04.png)<br> 

5. On the **Tell us about this user** dialog page, perform the following steps: 
<br><br>![Creating an Azure AD test user](./media/active-directory-saas-amazon-web-service/create_aaduser_05.png)<br> 

  1. As Type Of User, select New user in your organization.
  2. In the User Name **textbox**, type **BrittaSimon**.
  3. Click Next.

6.  On the **User Profile** dialog page, perform the following steps: 
<br><br>![Creating an Azure AD test user](./media/active-directory-saas-amazon-web-service/create_aaduser_06.png)<br> 

  1. In the **First Name** textbox, type **Britta**.  
  2. In the **Last Name** txtbox, type, **Simon**.
  3. In the **Display Name** textbox, type **Britta Simon**.
  4. In the **Role** list, select **User**.
  5. Click **Next**.

7. On the **Get temporary password** dialog page, click **create**.
<br><br>![Creating an Azure AD test user](./media/active-directory-saas-amazon-web-service/create_aaduser_07.png)<br> 
 
8. On the **Get temporary password** dialog page, perform the following steps:
<br><br>![Creating an Azure AD test user](./media/active-directory-saas-amazon-web-service/create_aaduser_08.png)<br> 

  1. Write down the value of the **New Password**.
  2. Click **Complete**.   
  
 
### Creating a Amazon Web Service (AWS) test user

The objective of this section is to create a user called Britta Simon in Amazon Web Service (AWS).

### To create a user called Britta Simon in Amazon Web Service (AWS), perform the following steps:

1. Log in to your **Amazon Web Service (AWS)** company site as administrator.

2. Click the **Console Home** icon. 
<br><br>![Configure Single Sign-On][11]<br>

3. Click Identity and Access Management. 
<br><br>![Configure Single Sign-On][28]<br>

4. In the Dashboard, click Users, and then click Create New Users. 
<br><br>![Configure Single Sign-On][29]<br>

5. On the Create User dialog, perform the following steps: 
<br><br>![Configure Single Sign-On][30]<br>

     a. In the **Enter User Names** textboxes, type Brita Simon's user name (userprincipalname) in Azure AD.

     b. Click **Create**.




### Assigning the Azure AD test user

The objective of this section is to enabling Britta Simon to use Azure single sign-on by granting her access to Amazon Web Service (AWS).

![Assign User][31]

**To assign Britta Simon to CloudPassage, perform the following steps:**

1. On the Azure classic portal, to open the applications view, in the directory view, click **Applications** in the top menu.
<br><br>![Assign User][26]<br>

2. In the applications list, select **Amazon Web Service (AWS)**.
<br><br>![Assign User][27]<br>

1. In the menu on the top, click **Users**.
<br><br>![Assign User][25]<br>

1. In the Users list, select **Britta Simon**.

2. In the toolbar on the bottom, click **Assign**.
<br><br>![Assign User][29]<br>

### Testing Single Sign-On

The objective of this section is to test your Azure AD single sign-on configuration using the Access Panel.<br>
When you click the Amazon Web Service (AWS) tile in the Access Panel, you should get automatically signed-on to your Amazon Web Service (AWS) application.


## Additional Resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)

<!--Image references-->
[1]: ./media/active-directory-saas-amazon-web-service/tutorial_general_01.png
[2]: ./media/active-directory-saas-amazon-web-service/tutorial_general_02.png
[3]: ./media/active-directory-saas-amazon-web-service/tutorial_general_03.png
[4]: ./media/active-directory-saas-amazon-web-service/tutorial_general_04.png
[5]: ./media/active-directory-saas-amazon-web-service/ic795019.png
[6]: ./media/active-directory-saas-amazon-web-service/ic795020.png
[7]: ./media/active-directory-saas-amazon-web-service/ic795027.png
[8]: ./media/active-directory-saas-amazon-web-service/ic795028.png
[9]: ./media/active-directory-saas-amazon-web-service/capture23.png
[10]: ./media/active-directory-saas-amazon-web-service/capture24.png
[11]: ./media/active-directory-saas-amazon-web-service/ic795031.png
[12]: ./media/active-directory-saas-amazon-web-service/ic795032.png
[13]: ./media/active-directory-saas-amazon-web-service/ic795033.png
[14]: ./media/active-directory-saas-amazon-web-service/ic795034.png
[15]: ./media/active-directory-saas-amazon-web-service/ic795035.png
[16]: ./media/active-directory-saas-amazon-web-service/ic795022.png
[17]: ./media/active-directory-saas-amazon-web-service/ic795023.png
[18]: ./media/active-directory-saas-amazon-web-service/ic795024.png
[19]: ./media/active-directory-saas-amazon-web-service/ic795025.png
[20]: ./media/active-directory-saas-amazon-web-service/ic7950351.png
[21]: ./media/active-directory-saas-amazon-web-service/tutorial_general_80.png
[22]: ./media/active-directory-saas-amazon-web-service/ic7950352.png
[23]: ./media/active-directory-saas-amazon-web-service/tutorial_general_81.png
[24]: ./media/active-directory-saas-amazon-web-service/ic7950353.png
[25]: ./media/active-directory-saas-amazon-web-service/tutorial_general_15.png
[26]: ./media/active-directory-saas-amazon-web-service/tutorial_general_18.png
[27]: ./media/active-directory-saas-amazon-web-service/ic7950357.png
[28]: ./media/active-directory-saas-amazon-web-service/ic7950321.png
[29]: ./media/active-directory-saas-amazon-web-service/tutorial_general_16.png
[30]: ./media/active-directory-saas-amazon-web-service/ic795038.png
[31]: ./media/active-directory-saas-amazon-web-service/tutorial_general_17.png
[32]: ./media/active-directory-saas-amazon-web-service/ic7950251.png
[33]: ./media/active-directory-saas-amazon-web-service/ic7950252.png
[34]: ./media/active-directory-saas-amazon-web-service/ic7950253.png
























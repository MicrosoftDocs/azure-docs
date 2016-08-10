<properties 
    pageTitle="Tutorial: Azure Active Directory integration with SuccessFactors | Microsoft Azure"
    description="Learn how to use SuccessFactors with Azure Active Directory to enable single sign-on, automated provisioning, and more!" 
    services="active-directory" 
    authors="jeevansd"  
    documentationCenter="na" 
    manager="femila"/>
<tags 
    ms.service="active-directory" 
    ms.devlang="na" 
    ms.topic="article" 
    ms.tgt_pltfrm="na" 
    ms.workload="identity" 
    ms.date="08/10/2016" 
    ms.author="jeedes" />


#Tutorial: Azure Active Directory integration with SuccessFactors
  
The objective of this tutorial is to show you how to integrate SuccessFactors with Azure Active Directory (Azure AD).

Integrating SuccessFactors with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to SuccessFactors
- You can enable your users to automatically get signed-on to SuccessFactors (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure classic portal

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites

To configure Azure AD integration with SuccessFactors, you need the following items:

- A valid Azure subscription
- A tenant in SuccessFactors


> [AZURE.NOTE] To test the steps in this tutorial, we do not recommend using a production environment.


To test the steps in this tutorial, you should follow these recommendations:

- You should not use your production environment, unless this is necessary.
- If you don't have an Azure AD trial environment, you can get a one-month trial [here](https://azure.microsoft.com/pricing/free-trial/).


## Scenario description
The objective of this tutorial is to enable you to test Azure AD single sign-on in a test environment.

The scenario outlined in this tutorial consists of two main building blocks:

1. Adding SuccessFactors from the gallery
2. Configuring and testing Azure AD single sign-on


## Adding SuccessFactors from the gallery
To configure the integration of SuccessFactors into Azure AD, you need to add SuccessFactors from the gallery to your list of managed SaaS apps.

**To add SuccessFactors from the gallery, perform the following steps:**

1.  In the Azure classic portal, on the left navigation panel, click **Active Directory**.

	![Configuring single sign-on][1]

2.  From the **Directory** list, select the directory for which you want to enable directory integration.

3.  To open the applications view, in the directory view, click **Applications** in the top menu.

    ![Configuring single sign-on][2]

4.  Click **Add** at the bottom of the page.

    ![Applications][3]

5.  On the **What do you want to do** dialog, click **Add an application from the gallery**.

    ![Configuring single sign-on][4]

6.  In the **search box**, type **SuccessFactors**.

    ![Configuring single sign-on][5]

7.  In the results panel, select **SuccessFactors**, and then click **Complete** to add the application.

    ![Configuring single sign-on][6]


##  Configuring and testing Azure AD single sign-on
The objective of this section is to show you how to configure and test Azure AD single sign-on with SuccessFactors based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in SuccessFactors to an user in Azure AD is. In other words, a link relationship between an Azure AD user and the related user in SuccessFactors needs to be established.

This link relationship is established by assigning the value of the **user name** in Azure AD as the value of the **Username** in SuccessFactors.

To configure and test Azure AD single sign-on with SuccessFactors, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-single-sign-on)** - to enable your users to use this feature.
2. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Creating a SuccessFactors test user](#creating-a-successfactors-test-user)** - to have a counterpart of Britta Simon in SuccessFactors that is linked to the Azure AD representation of her.
4. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD single sign-on
  
In this section, you enable Azure AD single sign-on in the classic portal and configure single sign-on in your SuccessFactors application.

**To configure Azure AD single sign-on with SuccessFactors, perform the following steps:**

1.  In the Azure classic portal, on the **SuccessFactors** application integration page, click **Configure single sign-on** to open the **Configure Single Sign On** dialog.

    ![Configuring single sign-on][7]

2.  On the **How would you like users to sign on to SuccessFactors** page, select **Microsoft Azure AD Single Sign-On**, and then click **Next**.

    ![Configuring single sign-on][8]

3.  On the **Configure App URL** page, perform the following steps, and then click **Next**.

    ![Configuring single sign-on][9]

    a. In the **Sign On URL** textbox, type a URL using the following pattern: `https://<company name>.successfactors.com/<company name>`

	b. In the **Reply URL** textbox, type a URL using the following pattern: `https://<company name>.successfactors.com/<company name>`

	c. Click **Next**. 


    > [AZURE.TIP] Please note that these are not the real values. You have to update these values with the actual Sign On URL and Reply URL. To get these values, contact [SuccessFactors support team](https://www.successfactors.com/en_us/support.html).

4.  On the **Configure single sign-on at SuccessFactors** page, click **Download certificate**, and then save the certificate file locally on your computer.

    ![Configuring single sign-on][10]

5.  In a different web browser window, log into your **SuccessFactors admin portal** as an administrator.

6.  Go to **Application Security -> Single Sign On Feature**. 

7. Place any value in the **Reset Token** and click **Save Token** to enable SAML SSO.

	![Configuring single sign-on on app side][11]

8. In the **For SAML based SSO** page perform the following actions.

	a. Select the **SAML v2 SSO** Radio Button

	b. In the **SAML Issuer** textbox put the value of **Issuer URL** from Azure AD application configuration wizard.

	c. Select **Response(Customer Generated/IdP/AP)** as **Require Mandatory Signature**.

	d. Select **Enabled** as **Enable SAML Flag**.

	e. Select **No** as **Login Request Signature(SF Generated/SP/RP)**.

	f. Select **Browser/Post Profile** as **SAML Profile**.

	g. Select **No** as **Enforce Certificate Valid Period**.

	h. Copy the content of the downloaded certificate file, and then paste it into the **SAML Verifying Certificate** textbox.

	![Configuring single sign-on on app side][12]

9. In the **SAML2 specific settings** page perform the following actions.

	a. Select **Yes** as **Support SP-initiated Global Logout**.

	b. In the **Global Logout Service URL (LogoutRequest destination)** textbox put the value of **Remote Logout URL** from Azure AD application configuration wizard.

	c. Select **No** as **Require sp must encrypt all NameID element**.

	d. Select **unspecified** as **NameID Format**.

	e. Select **Yes** as **Enable sp initiated login (AuthnRequest)**.

	f. In the **Send request as Company-Wide issuer** textbox put the value of **Remote Login URL** from Azure AD application configuration wizard.

	![Configuring single sign-on on app side][13]

10.  On the Azure classic portal, select the single sign-on configuration confirmation, and then click **Complete** to close the **Configure Single Sign On** dialog.

    ![Applications][14]

11. On the **Single sign-on confirmation** page, click **Complete**.

	![Applications][15]



### Creating an Azure AD test user
The objective of this section is to create a test user in the classic portal called Britta Simon.

![Create Azure AD User][16]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure classic Portal**, on the left navigation pane, click **Active Directory**.

    ![Creating an Azure AD test user][17]

2. From the **Directory** list, select the directory for which you want to enable directory integration.

3. To display the list of users, in the menu on the top, click **Users**.
    
	![Creating an Azure AD test user][18]

4. To open the **Add User** dialog, in the toolbar on the bottom, click **Add User**.

    ![Creating an Azure AD test user][19]

5. On the **Tell us about this user** dialog page, perform the following steps:

    ![Creating an Azure AD test user][20]

    a. As Type Of User, select New user in your organization.

    b. In the User Name **textbox**, type **BrittaSimon**.

    c. Click **Next**.

6.  On the **User Profile** dialog page, perform the following steps:
    
	![Creating an Azure AD test user][21]

    a. In the **First Name** textbox, type **Britta**.  

    b. In the **Last Name** textbox, type, **Simon**.

    c. In the **Display Name** textbox, type **Britta Simon**.

    d. In the **Role** list, select **User**.

    e. Click **Next**.

7. On the **Get temporary password** dialog page, click **create**.
    
	![Creating an Azure AD test user][22]

8. On the **Get temporary password** dialog page, perform the following steps:
    
	![Creating an Azure AD test user][23]

    a. Write down the value of the **New Password**.

    b. Click **Complete**.  



### Creating a SuccessFactors test user
  
In order to enable Azure AD users to log into SuccessFactors, they must be provisioned into SuccessFactors.  
In the case of SuccessFactors, provisioning is a manual task.
  
To get users created in SuccessFactors, you need to contact the [SuccessFactors support team](https://www.successfactors.com/en_us/support.html).



### Assigning the Azure AD test user

The objective of this section is to enabling Britta Simon to use Azure single sign-on by granting her access to SuccessFactors.
	
![Assign User][24]

**To assign Britta Simon to SuccessFactors, perform the following steps:**

1. On the classic portal, to open the applications view, in the directory view, click **Applications** in the top menu.
    
	![Assign User][25]

2. In the applications list, select **SuccessFactors**.
    
	![Configure Single Sign-On][26]

1. In the menu on the top, click **Users**.
    
	![Assign User][27]

1. In the Users list, select **Britta Simon**.

2. In the toolbar on the bottom, click **Assign**.
    
	![Assign User][28]



### Testing single sign-on

The objective of this section is to test your Azure AD single sign-on configuration using the Access Panel.
 
When you click the SuccessFactors tile in the Access Panel, you should get automatically signed-on to your SuccessFactors application.


## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)


<!--Image references-->

[0]: ./media/active-directory-saas-successfactors-tutorial/tutorial_successfactors_00.png
[1]: ./media/active-directory-saas-successfactors-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-successfactors-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-successfactors-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-successfactors-tutorial/tutorial_general_04.png
[5]: ./media/active-directory-saas-successfactors-tutorial/tutorial_successfactors_01.png
[6]: ./media/active-directory-saas-successfactors-tutorial/tutorial_successfactors_02.png
[7]: ./media/active-directory-saas-successfactors-tutorial/tutorial_successfactors_03.png
[8]: ./media/active-directory-saas-successfactors-tutorial/tutorial_successfactors_04.png
[9]: ./media/active-directory-saas-successfactors-tutorial/tutorial_successfactors_05.png
[10]: ./media/active-directory-saas-successfactors-tutorial/tutorial_successfactors_06.png

[11]: ./media/active-directory-saas-successfactors-tutorial/tutorial_successfactors_07.png
[12]: ./media/active-directory-saas-successfactors-tutorial/tutorial_successfactors_08.png
[13]: ./media/active-directory-saas-successfactors-tutorial/tutorial_successfactors_09.png
[14]: ./media/active-directory-saas-successfactors-tutorial/tutorial_general_05.png
[15]: ./media/active-directory-saas-successfactors-tutorial/tutorial_general_06.png

[16]: ./media/active-directory-saas-successfactors-tutorial/create_aaduser_00.png
[17]: ./media/active-directory-saas-successfactors-tutorial/create_aaduser_01.png
[18]: ./media/active-directory-saas-successfactors-tutorial/create_aaduser_02.png
[19]: ./media/active-directory-saas-successfactors-tutorial/create_aaduser_03.png
[20]: ./media/active-directory-saas-successfactors-tutorial/create_aaduser_04.png
[21]: ./media/active-directory-saas-successfactors-tutorial/create_aaduser_05.png
[22]: ./media/active-directory-saas-successfactors-tutorial/create_aaduser_06.png
[23]: ./media/active-directory-saas-successfactors-tutorial/create_aaduser_07.png

[24]: ./media/active-directory-saas-successfactors-tutorial/tutorial_general_07.png
[25]: ./media/active-directory-saas-successfactors-tutorial/tutorial_general_08.png
[26]: ./media/active-directory-saas-successfactors-tutorial/tutorial_successfactors_10.png
[27]: ./media/active-directory-saas-successfactors-tutorial/tutorial_general_09.png
[28]: ./media/active-directory-saas-successfactors-tutorial/tutorial_general_10.png

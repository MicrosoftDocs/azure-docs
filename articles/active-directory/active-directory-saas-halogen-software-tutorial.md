<properties
	pageTitle="Tutorial: Azure Active Directory integration with Halogen Software"
	description="Learn how to configure single sign-on between Azure Active Directory and Halogen Software."
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


# Tutorial: Azure Active Directory integration with Halogen Software

The objective of this tutorial is to show you how to integrate Halogen Software with Azure Active Directory (Azure AD).<br>Integrating Halogen Software with Azure AD provides you with the following benefits: 

- You can control in Azure AD who has access to Halogen Software 
- You can enable your users to automatically get signed-on to Halogen Software (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure Active Directory Portal

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites 

To configure Azure AD integration with Halogen Software, you need the following items:

- An Azure AD subscription
- A Halogen Software single-sign on enabled subscription


> [AZURE.NOTE] To test the steps in this tutorial, we do not recommend using a production environment.


To test the steps in this tutorial, you should follow these recommendations:

- You should not use your production environment, unless this is necessary.
- If you don't have an Azure AD trial environment, you can get a one-month trial [here](https://azure.microsoft.com/pricing/free-trial/). 

 
## Scenario Description
The objective of this tutorial is to enable you to test Azure AD single sign-on in a test environment. <br>
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Halogen Software from the gallery 
2. Configuring and testing Azure AD single sign-on


## Adding Halogen Software from the gallery
To configure the integration of Halogen Software into Azure AD, you need to add Halogen Software from the gallery to your list of managed SaaS apps.

**To add Halogen Software from the gallery, perform the following steps:**

1. In the **Azure Management Portal**, on the left navigation pane, click **Active Directory**. <br><br>
![Active Directory][1]

2. From the **Directory** list, select the directory for which you want to enable directory integration.

3. To open the applications view, in the directory view, click **Applications** in the top menu.<br><br>
![Applications][2]
4. Click **Add** at the bottom of the page.<br><br>
![Applications][3]
5. On the **What do you want to do** dialog, click **Add an application from the gallery**.<br><br>
![Applications][4]
6. In the search box, type **halogen software**.<br>
![Applications][5]
7. In the results pane, select **Halogen Software**, and then click **Complete** to add the application.<br>



##  Configuring and testing Azure AD single sign-on
The objective of this section is to show you how to configure and test Azure AD single sign-on with Halogen Software based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Halogen Software to an user in Azure AD is. In other words, a link relationship between an Azure AD user and the related user in Halogen Software needs to be established.<br>
This link relationship is established by assigning the value of the **user name** in Azure AD as the value of the **Username** in Halogen Software.
 
To configure and test Azure AD single sign-on with Halogen Software, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Single Sign-On](#configuring-azure-ad-single-single-sign-on)** - to enable your users to use this feature.
2. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Creating a Halogen Software test user](#creating-a-halogen-software-test-user)** - to have a counterpart of Britta Simon in Halogen Software that is linked to the Azure AD representation of her.
5. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD Single Single Sign-On

The objective of this section is to enable Azure AD single sign-on in the Azure AD portal and to configure single sign-on in your Halogen Software application.<br>

**To configure Azure AD single sign-on with Halogen Software, perform the following steps:**

1. In the Azure AD portal, on the **Halogen Software** application integration page, click **Configure single sign-on** to open the **Configure Single Sign-On**  dialog.<br><br>
![Configure Single Sign-On][8]

2. On the **How would you like users to sign on to Halogen Software** page, select **Azure AD Single Sign-On**, and then click **Next**.<br><br>
![Azure AD Single Sign-On][9]

3. On the **Configure App Settings** dialog page, perform the following steps: <br><br>![Configure App Settings][10]
 
     3.1 in the **Sign On URL** textbox, type your URL used by your users to sign on to your Halogen Software application using the following pattern: *https://global.hgncloud.com/fabrikam/welcome.jsp*

     3.2. Click **Next**.
 
4. On the **Configure single sign-on at Halogen Software** page, click **Download metadata**, and then save the metadata file locally on your computer.<br><br>![What is Azure AD Connect][11]

5. In a different browser window, sign-on to your **Halogen Software** application as an administrator.
6. Click the **Options** tab. <br><br>![What is Azure AD Connect][12]
7. In the left navigation pane, click **SAML Configuration**. <br><br>![What is Azure AD Connect][13]
8. On the **SAML Configuration** page, perform the following steps: <br><br>![What is Azure AD Connect][14]

     8.1. As **Unique Identifier**, select **NameID**.

     8.2. As **Unique Identifier Maps To**, select **Username**.

     8.3. To upload your downloaded metadata file, click **Browse** to select the file, and then **Upload File**.

     8.4. To test the configuration, click **Run Test**. > [AZURE.NOTE] You need to wait for the message "*The SAML test is complete. Please close this window*". Then, close the opened browser window. <br> The **Enable SAML** checkbox is only enabled if the test has been completed.

     8.5. Select **Enable SAML**.
    
     8.6. Click **Save Changes**. 


9. On the Azure AD portal, select the single sign-on configuration confirmation, and then click **Complete** to close the **Configure Single Sign On** dialog. <br><br>![What is Azure AD Connect][15]
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
  
 
### Creating a Halogen Software test user

The objective of this section is to create a user called Britta Simon in Halogen Software.

**To create a user called Britta Simon in Halogen Software, perform the following steps:**

1. Sign on to your **Halogen Software** application as an administrator.
2. Click the **User Center** tab, and then click **Create User**.
<br><br>![What is Azure AD Connect][300]  
3. On the **New User** dialog page, perform the following steps:
<br><br>![What is Azure AD Connect][301]
  1. In the **First Name** textbox, type **Britta**. 
  2. In the **Last Name** textbox, type **Simon**.
  3. In the **Username** textbox, type **Brita Simon's user name in the Azure AD portal**.
  4. In the **Password** textbox, type a password for Britta.
  5. Click **Save**.


### Assigning the Azure AD test user

The objective of this section is to enabling Britta Simon to use Azure single sign-on by granting her access to Halogen Software.
<br><br>![What is Azure AD Connect][200]

**To assign Britta Simon to Halogen Software, perform the following steps:**

1. On the Azure portal, to open the applications view, in the directory view, click **Applications** in the top menu.<br>
<br><br>![What is Azure AD Connect][201]
2. In the applications list, select **Halogen Software**.
<br><br>![What is Azure AD Connect][202]
1. In the menu on the top, click **Users**.<br>
<br><br>![What is Azure AD Connect][203]
1. In the Users list, select **Britta Simon**.
<br><br>![What is Azure AD Connect][204]
2. In the toolbar on the bottom, click **Assign**.
<br><br>![What is Azure AD Connect][205]



### Testing Single Sign-On

The objective of this section is to test your Azure AD single sign-on configuration using the Access Panel.<br>
When you click the Halogen Software tile in the Access Panel, you should get automatically signed-on to your Halogen Software application.


## Additional Resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)

<!--Image references-->
[1]: ./media/active-directory-saas-halogen-software-tutorial/tutorial_halogen_01.png
[2]: ./media/active-directory-saas-halogen-software-tutorial/tutorial_halogen_02.png
[3]: ./media/active-directory-saas-halogen-software-tutorial/tutorial_halogen_03.png
[4]: ./media/active-directory-saas-halogen-software-tutorial/tutorial_halogen_04.png
[5]: ./media/active-directory-saas-halogen-software-tutorial/tutorial_halogen_05.png
[6]: ./media/active-directory-saas-halogen-software-tutorial/tutorial_halogen_06.png
[7]: ./media/active-directory-saas-halogen-software-tutorial/tutorial_halogen_07.png
[8]: ./media/active-directory-saas-halogen-software-tutorial/tutorial_halogen_08.png
[9]: ./media/active-directory-saas-halogen-software-tutorial/tutorial_halogen_09.png
[10]: ./media/active-directory-saas-halogen-software-tutorial/tutorial_halogen_10.png
[11]: ./media/active-directory-saas-halogen-software-tutorial/tutorial_halogen_11.png
[12]: ./media/active-directory-saas-halogen-software-tutorial/tutorial_halogen_12.png
[13]: ./media/active-directory-saas-halogen-software-tutorial/tutorial_halogen_13.png
[14]: ./media/active-directory-saas-halogen-software-tutorial/tutorial_halogen_14.png
[15]: ./media/active-directory-saas-halogen-software-tutorial/tutorial_halogen_15.png
[16]: ./media/active-directory-saas-halogen-software-tutorial/tutorial_halogen_16.png
[100]: ./media/active-directory-saas-halogen-software-tutorial/tutorial_halogen_100.png 
[101]: ./media/active-directory-saas-halogen-software-tutorial/tutorial_halogen_101.png 
[102]: ./media/active-directory-saas-halogen-software-tutorial/tutorial_halogen_102.png 
[103]: ./media/active-directory-saas-halogen-software-tutorial/tutorial_halogen_103.png 
[104]: ./media/active-directory-saas-halogen-software-tutorial/tutorial_halogen_104.png 
[105]: ./media/active-directory-saas-halogen-software-tutorial/tutorial_halogen_105.png 
[106]: ./media/active-directory-saas-halogen-software-tutorial/tutorial_halogen_106.png 
[200]: ./media/active-directory-saas-halogen-software-tutorial/tutorial_halogen_200.png 
[201]: ./media/active-directory-saas-halogen-software-tutorial/tutorial_halogen_201.png 
[202]: ./media/active-directory-saas-halogen-software-tutorial/tutorial_halogen_202.png
[203]: ./media/active-directory-saas-halogen-software-tutorial/tutorial_halogen_203.png
[204]: ./media/active-directory-saas-halogen-software-tutorial/tutorial_halogen_204.png
[205]: ./media/active-directory-saas-halogen-software-tutorial/tutorial_halogen_205.png
[300]: ./media/active-directory-saas-halogen-software-tutorial/tutorial_halogen_300.png
[301]: ./media/active-directory-saas-halogen-software-tutorial/tutorial_halogen_301.png
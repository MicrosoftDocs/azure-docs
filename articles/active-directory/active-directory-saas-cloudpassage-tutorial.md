<properties
	pageTitle="Tutorial: Azure Active Directory integration with CloudPassage | Microsoft Azure"
	description="Learn how to configure single sign-on between Azure Active Directory and CloudPassage."
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
	ms.date="04/06/2016"
	ms.author="jeedes"/>


# Tutorial: Azure Active Directory integration with CloudPassage

The objective of this tutorial is to show you how to integrate CloudPassage with Azure Active Directory (Azure AD).<br>Integrating CloudPassage with Azure AD provides you with the following benefits: 

- You can control in Azure AD who has access to CloudPassage 
- You can enable your users to automatically get signed-on to CloudPassage (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure Active Directory 
- 

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites 

To configure Azure AD integration with CloudPassage, you need the following items:

- An Azure AD subscription
- A CloudPassage single-sign on enabled subscription


> [AZURE.NOTE] To test the steps in this tutorial, we do not recommend using a production environment.


To test the steps in this tutorial, you should follow these recommendations:

- You should not use your production environment, unless this is necessary.
- If you don't have an Azure AD test environment, you can get a free one-month Azure trial subscription [here](https://azure.microsoft.com/pricing/free-trial/). 

 
## Scenario Description
The objective of this tutorial is to enable you to test Azure AD single sign-on in a test environment. <br>
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding CloudPassage from the gallery 
2. Configuring and testing Azure AD single sign-on


## Adding CloudPassage from the gallery
To configure the integration of CloudPassage into Azure AD, you need to add CloudPassage from the gallery to your list of managed SaaS apps.

### To add CloudPassage from the gallery, perform the following steps:

1. In the **Azure classic portal**, on the left navigation pane, click **Active Directory**. <br><br>
![Active Directory][1]

2. From the **Directory** list, select the directory for which you want to enable directory integration.

3. To open the applications view, in the directory view, click **Applications** in the top menu.<br><br>
![Applications][2]
4. Click **Add** at the bottom of the page.<br><br>
![Applications][3]
5. On the **What do you want to do** dialog, click **Add an application from the gallery**.<br><br>
![Applications][4]
6. In the search box, type **CloudPassage**.<br><br>
![Applications][5]
7. In the results pane, select **CloudPassage**, and then click **Complete** to add the application.<br><br>
![Applications][6]



##  Configuring and testing Azure AD single sign-on
The objective of this section is to show you how to configure and test Azure AD single sign-on with CloudPassage based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in CloudPassage to an user in Azure AD is. In other words, a link relationship between an Azure AD user and the related user in CloudPassage needs to be established.<br>
This link relationship is established by assigning the value of the **user name** in Azure AD as the value of the **Username** in CloudPassage.
 
To configure and test Azure AD single sign-on with CloudPassage, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Single Sign-On](#configuring-azure-ad-single-single-sign-on)** - to enable your users to use this feature.
2. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Creating a CloudPassage test user](#creating-a-halogen-software-test-user)** - to have a counterpart of Britta Simon in CloudPassage that is linked to the Azure AD representation of her.
5. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD Single Sign-On

The objective of this section is to enable Azure AD single sign-on in the Azure AD classic portal and to configure single sign-on in your CloudPassage application.<br>
Your CloudPassage application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. 
The following screenshot shows an example for this.
<br><br> ![Configure Single Sign-On][21]

**To configure Azure AD single sign-on with CloudPassage, perform the following steps:**

1. In the Azure AD classic portal, on the **CloudPassage** application integration page, click **Configure single sign-on** to open the **Configure Single Sign-On**  dialog.<br><br>
![Configure Single Sign-On][7]

2. On the **How would you like users to sign on to CloudPassage** page, select **Azure AD Single Sign-On**, and then click **Next**.<br><br>
![Configure Single Sign-On][8]

3. On the **Configure App Settings** dialog page, perform the following steps: <br><br>![Configure App Settings][9]
 
     3.1. In the **Sign On URL** textbox, type the URL used by your users to sign-on to your CloudPassage app (e.g.: *https://portal.cloudpassage.com/saml/init/accountid*). 

     3.2. In the Reply URL textbox, type your AssertionConsumerService URL (e.g.: *https://portal.cloudpassage.com/saml/consume/accountid*). <br> You can get your value for this attribute by clicking **SSO Setup documentation** in the **Single Sign-on Settings** section of your CloudPassage portal. <br><br>![Configure Single Sign-On][10]

     3.3. Click **Next**.



4. On the **Configure single sign-on at CloudPassage** page, click **Download certificate**, and then save the certificate file locally on your computer. <br><br>![Configure Single Sign-On][11]

5. In a different browser window, sign-on to your CloudPassage company site as administrator.

6. In the menu on the top, click **Settings**, and then click **Site Administration**. <br><br> ![Configure Single Sign-On][12]

7. Click the **Authentication Settings** tab. <br><br> ![Configure Single Sign-On][13]


8. In the **Single Sign-on Settings** section, perform the following steps: <br><br> ![Configure Single Sign-On][14]


     8.1. In the Azure classic portal, on the **Configure single sign-on at CloudPassage** dialog page, copy the **Issuer URL** value, and then paste it into the **SAML issuer URL** textbox.

     8.2. In the Azure classic portal, on the **Configure single sign-on at CloudPassage** dialog page, copy the **Service Provider (SP) initiated endpoint** value, and then paste it into the **SAML endpoint URL** textbox.

     8.3. In the Azure classic portal, on the **Configure single sign-on at CloudPassage** dialog page, copy the **Logout URL** value, and then paste it into the **Logout landing page** textbox.

     8.4. Create a **base-64** encoded file from your downloaded certificate. 
          
      >[AZURE.TIP] For more details, see [How to convert a binary certificate into a text file](http://youtu.be/PlgrzUZ-Y1o).

     8.5. Open your base-64 encoded certificate in notepad, copy the content of it into your clipboard, and then paste it into the **x 509 certificate** textbox.

     8.6. Click **Save**.


9. On the Azure AD classic portal, select the single sign-on configuration confirmation, and then click **Next**. <br><br> ![Configure Single Sign-On][15]


10. On the **Single sign-on confirmation** page, click **Complete**. <br><br> ![Configure Single Sign-On][16]



11. In the nu on the top, click **Attributes** to open the **SAML Token Attributes** dialog. <br><br> ![Configure Single Sign-On][17]

12. To add the required user attributes, for each row in the table below, perform the following steps: <br>

| Attribute Name | Attribute Value |
| --- | --- |
| firstname | user.givenname |
| lastname | user.surname |
| email | user.mail |  

     12.1. Click **add user attribute**. <br><br> ![Configure Single Sign-On][18]

     12.2. In the **Attribute Name** textbox, type the attribute name shown for that row and as **Attribure Value**, select the attribute value shown for that row . <br><br> ![Configure Single Sign-On][19]
     
     12.2.3 Click **Complete**.


13. In the tollbar on the bottom, click **Apply Changes**. <br><br> ![Configure Single Sign-On][20]



### Creating an Azure AD test user

The objective of this section is to create a test user in the Azure classic portal called Britta Simon.<br><br>
In the Users list, select **Britta Simon**.<br>![Creating an Azure AD test user](./media/active-directory-saas-cloudpassage-tutorial/create_aaduser_01.png)

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure classic portal**, on the left navigation pane, click **Active Directory**.<br>
![Creating an Azure AD test user](./media/active-directory-saas-cloudpassage-tutorial/create_aaduser_02.png) 

2. From the **Directory** list, select the directory for which you want to enable directory integration.

3. To display the list of users, in the menu on the top, click **Users**.<br>![Creating an Azure AD test user](./media/active-directory-saas-cloudpassage-tutorial/create_aaduser_03.png) 
 
4. To open the **Add User** dialog, in the toolbar on the bottom, click **Add User**. <br>![Creating an Azure AD test user](./media/active-directory-saas-cloudpassage-tutorial/create_aaduser_04.png) 

5. On the **Tell us about this user** dialog page, perform the following steps: <br>![Creating an Azure AD test user](./media/active-directory-saas-cloudpassage-tutorial/create_aaduser_05.png) 
  1. As Type Of User, select New user in your organization.
  2. In the User Name **textbox**, type **BrittaSimon**.
  3. Click Next.

6.  On the **User Profile** dialog page, perform the following steps: <br>![Creating an Azure AD test user](./media/active-directory-saas-cloudpassage-tutorial/create_aaduser_06.png) 
  1. In the **First Name** textbox, type **Britta**.  
  2. In the **Last Name** textbox, type, **Simon**.
  3. In the **Display Name** textbox, type **Britta Simon**.
  4. In the **Role** list, select **User**.
  5. Click **Next**.

7. On the **Get temporary password** dialog page, click **create**.<br>![Creating an Azure AD test user](./media/active-directory-saas-cloudpassage-tutorial/create_aaduser_07.png) 
 
8. On the **Get temporary password** dialog page, perform the following steps:<br>![Creating an Azure AD test user](./media/active-directory-saas-cloudpassage-tutorial/create_aaduser_08.png) 
  1. Write down the value of the **New Password**.
  2. Click **Complete**.   


  
 
### Creating a CloudPassage test user

The objective of this section is to create a user called Britta Simon in CloudPassage.

#### To create a user called Britta Simon in CloudPassage, perform the following steps:

1.	Sign-on to your **CloudPassage** company site as an administrator. 

2.	In the toolbar on the top, click **Settings**, and then click **Site Administration**. <br>![Creating a CloudPassage test user][22] 

3.	Click the **Users** tab, and then click **Add New User**. <br>![Creating a CloudPassage test user][23]
	
4.	In the **Add New User** section, perform the following steps: <br>![Creating a CloudPassage test user][24]

     4.1. In the **First Name** textbox, type Britta.

     4.2. In the **Last Name** textbox, type Simon.

     4.3. In the **Username** textbox, the **Email** textbox and the **Retype Email** textbox, type Britta's user name in Azure AD.

     4.4. As **Access Type**, select **Enable Halo Portal Access**.

     4.5. Click **Add**.










### Assigning the Azure AD test user

The objective of this section is to enable Britta Simon to use Azure single sign-on by granting her access to CloudPassage.
<br><br>![Assign User][30]

**To assign Britta Simon to CloudPassage, perform the following steps:**

1. On the Azure classic portal, to open the applications view, in the directory view, click **Applications** in the top menu.<br>
<br><br>![Assign User][26]
2. In the applications list, select **CloudPassage**.
<br><br>![Assign User][27]
1. In the menu on the top, click **Users**.<br>
<br><br>![Assign User][25]
1. In the Users list, select **Britta Simon**.

2. In the toolbar on the bottom, click **Assign**.
<br><br>![Assign User][29]



### Testing Single Sign-On

The objective of this section is to test your Azure AD single sign-on configuration using the Access Panel.<br>
When you click the CloudPassage tile in the Access Panel, you should get automatically signed-on to your CloudPassage application.


## Additional Resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)

<!--Image references-->
[1]: ./media/active-directory-saas-cloudpassage-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-cloudpassage-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-cloudpassage-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-cloudpassage-tutorial/tutorial_general_04.png
[5]: ./media/active-directory-saas-cloudpassage-tutorial/tutorial_cloudpassage_01.png
[6]: ./media/active-directory-saas-cloudpassage-tutorial/tutorial_cloudpassage_02.png
[7]: ./media/active-directory-saas-cloudpassage-tutorial/tutorial_general_05.png
[8]: ./media/active-directory-saas-cloudpassage-tutorial/tutorial_cloudpassage_03.png
[9]: ./media/active-directory-saas-cloudpassage-tutorial/tutorial_cloudpassage_04.png
[10]: ./media/active-directory-saas-cloudpassage-tutorial/tutorial_cloudpassage_05.png
[11]: ./media/active-directory-saas-cloudpassage-tutorial/tutorial_cloudpassage_06.png
[12]: ./media/active-directory-saas-cloudpassage-tutorial/tutorial_cloudpassage_07.png
[13]: ./media/active-directory-saas-cloudpassage-tutorial/tutorial_cloudpassage_08.png
[14]: ./media/active-directory-saas-cloudpassage-tutorial/tutorial_cloudpassage_09.png
[15]: ./media/active-directory-saas-cloudpassage-tutorial/tutorial_cloudpassage_10.png
[16]: ./media/active-directory-saas-cloudpassage-tutorial/tutorial_cloudpassage_11.png
[17]: ./media/active-directory-saas-cloudpassage-tutorial/tutorial_general_10.png
[18]: ./media/active-directory-saas-cloudpassage-tutorial/tutorial_general_11.png
[19]: ./media/active-directory-saas-cloudpassage-tutorial/tutorial_general_12.png
[20]: ./media/active-directory-saas-cloudpassage-tutorial/tutorial_general_14.png
[21]: ./media/active-directory-saas-cloudpassage-tutorial/tutorial_cloudpassage_14.png
[22]: ./media/active-directory-saas-cloudpassage-tutorial/tutorial_cloudpassage_15.png
[23]: ./media/active-directory-saas-cloudpassage-tutorial/tutorial_cloudpassage_16.png
[24]: ./media/active-directory-saas-cloudpassage-tutorial/tutorial_cloudpassage_17.png
[25]: ./media/active-directory-saas-cloudpassage-tutorial/tutorial_general_15.png
[26]: ./media/active-directory-saas-cloudpassage-tutorial/tutorial_cloudpassage_12.png
[27]: ./media/active-directory-saas-cloudpassage-tutorial/tutorial_cloudpassage_13.png
[28]: ./media/active-directory-saas-cloudpassage-tutorial/tutorial_cloudpassage_15.png
[29]: ./media/active-directory-saas-cloudpassage-tutorial/tutorial_general_16.png
[30]: ./media/active-directory-saas-cloudpassage-tutorial/tutorial_general_17.png






















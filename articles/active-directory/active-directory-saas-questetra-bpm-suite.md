<properties
	pageTitle="Tutorial: Azure Active Directory integration with Questetra BPM Suite | Microsoft Aure"
	description="Learn how to configure single sign-on between Azure Active Directory and Questetra BPM Suite."
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
	ms.date="08/12/2016"
	ms.author="jeedes"/>


# Tutorial: Azure Active Directory integration with Questetra BPM Suite

The objective of this tutorial is to show you how to integrate Questetra BPM Suite with Azure Active Directory (Azure AD).  
Integrating Questetra BPM Suite with Azure AD provides you with the following benefits: 

- You can control in Azure AD who has access to Questetra BPM Suite 
- You can enable your users to automatically get signed-on to Questetra BPM Suite (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure classic portal

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites 

To configure Azure AD integration with Questetra BPM Suite, you need the following items:

- An Azure AD subscription
- An [Questetra BPM Suite](https://senbon-imadegawa-988.questetra.net/) single-sign on enabled subscription


> [AZURE.NOTE] To test the steps in this tutorial, we do not recommend using a production environment.


To test the steps in this tutorial, you should follow these recommendations:

- You should not use your production environment, unless this is necessary.
- If you don't have an Azure AD trial environment, you can get a one-month trial [here](https://azure.microsoft.com/pricing/free-trial/). 

 
## Scenario Description
The objective of this tutorial is to enable you to test Azure AD single sign-on in a test environment.  
The scenario outlined in this tutorial consists of three main building blocks:

1. Adding Questetra BPM Suite from the gallery 
2. Configuring and testing Azure AD single sign-on


## Adding Questetra BPM Suite from the gallery
To configure the integration of Questetra BPM Suite into Azure AD, you need to add Questetra BPM Suite from the gallery to your list of managed SaaS apps.

**To add Questetra BPM Suite from the gallery, perform the following steps:**

1. In the **Azure classic portal**, on the left navigation pane, click **Active Directory**. 

	![Active Directory][1]

2. From the **Directory** list, select the directory for which you want to enable directory integration.

3. To open the applications view, in the directory view, click **Applications** in the top menu.

	![Applications][2]

4. Click **Add** at the bottom of the page.

	![Applications][3]

5. On the **What do you want to do** dialog, click **Add an application from the gallery**.

	![Applications][4]

6. In the search box, type **Questetra BPM Suite**.

	![Applications][5]

7. In the results pane, select **Questetra BPM Suite**, and then click **Complete** to add the application.



##  Configuring and testing Azure AD single sign-on
The objective of this section is to show you how to configure and test Azure AD single sign-on with Questetra BPM Suite based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Questetra BPM Suite to an user in Azure AD is. In other words, a link relationship between an Azure AD user and the related user in Questetra BPM Suite needs to be established.  
This link relationship is established by assigning the value of the **user name** in Azure AD as the value of the **Username** in Questetra BPM Suite.
 
To configure and test Azure AD single sign-on with Questetra BPM Suite, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-single-sign-on)** - to enable your users to use this feature.
2. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Creating a Questetra BPM Suite test user](#creating-a-questetra-bpm-suite-test-user)** - to have a counterpart of Britta Simon in Questetra BPM Suite that is linked to the Azure AD representation of her.
5. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD Single Sign-On

The objective of this section is to enable Azure AD single sign-on in the Azure classic portal and to configure single sign-on in your Questetra BPM Suite application.

**To configure Azure AD single sign-on with Questetra BPM Suite, perform the following steps:**

1. In the Azure classic portal, on the **Questetra BPM Suite** application integration page, click **Configure single sign-on** to open the **Configure Single Sign-On**  dialog.

	![Configure Single Sign-On][8]

2. On the **How would you like users to sign on to Questetra BPM Suite** page, select **Azure AD Single Sign-On**, and then click **Next**.

	![Azure AD Single Sign-On][9]


3. In a different web browser window, log into your **Questetra BPM Suite** company site as an administrator.

4. In the menu on the top, click **System Settings**. 

	![Azure AD Single Sign-On][10]

5. To open the **SingleSignOnSAML** page, click **SSO (SAML)**. 

	![Azure AD Single Sign-On][11]


6. In the Azure classic portal, on the **Configure App Settings** dialog page, perform the following steps: 

	![Configure App Settings][13]
 
    a. On you **Questetra BPM Suite** company site, in the SP Information section, copy the **ACS URL**, and then paste it into the **Sign On URL** textbox.

    b. On you **Questetra BPM Suite** company site, in the SP Information section, copy the **Entity ID**, and then paste it into the **Issuer URL** textbox.

    c. On you **Questetra BPM Suite** company site, in the SP Information section, copy the **ACS URL**, and then paste it into the **Reply URL** textbox.

    d. Click **Next**.

 
7. On the **Configure single sign-on at Questetra BPM Suite** page, click **Download certificate**, and then save the certificate file locally on your computer.

	![Configure Single Sign-On][14]


8. On you **Questetra BPM Suite** company site, perform the following steps: 

	![Configure Single Sign-On][15]

    a. Select **Enable Single Sign-On**.
     
    b. On the Azure classic portal, copy the **Issuer URL** value, and then paste it into the **Entity ID** textbox.

    c. On the Azure classic portal, copy the **Single Sign-On Service URL** value, and then paste it into the **Sign-in page URL** textbox.

    d. On the Azure classic portal, copy the **Single Sign-Out Service URL** value, and then paste it into the **Sign-out page URL** textbox.

    e. In the **NameID format** textbox, type **urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress**.


    f. Create a base-64 encoded file from your downloaded certificate. 

    >[AZURE.TIP] For more details, see [How to convert a binary certificate into a text file](http://youtu.be/PlgrzUZ-Y1o).

    g. Open your base-64 encoded certificate in notepad, copy the content of it into your clipboard, and then paste it into the **Validation certificate** textbox. 

    h. Click **Save**.


9. On the Azure classic portal, select the single sign-on configuration confirmation, and then click **Next**. 

	![What is Azure AD Connect][17]


10. On the **Single sign-on confirmation** page, click **Complete**.  

	![What is Azure AD Connect][18]




### Creating an Azure AD test user
The objective of this section is to create a test user in the Azure classic portal called Britta Simon.

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure classic portal**, on the left navigation pane, click **Active Directory**.

	![Create Azure AD test user][100] 

2. From the **Directory** list, select the directory for which you want to enable directory integration.

3. To display the list of users, in the menu on the top, click **Users**.

	![Create Azure AD test user][101] 

4. To open the **Add User** dialog, in the toolbar on the bottom, click **Add User**. 

	![Create Azure AD test user][102] 

5. On the **Tell us about this user** dialog page, perform the following steps:

	![Create Azure AD test user][103]
 
    a. As **Type Of User**, select **New user in your organization**.
  
    b. In the User Name **textbox**, type **BrittaSimon**.

    c. Click Next.

6.  On the **User Profile** dialog page, perform the following steps: 

	![Create Azure AD test user][104] 
  
    a. In the **First Name** textbox, type **Britta**. 
 
    b. In the **Last Name** textbox, type, **Simon**.

    c. In the **Display Name** textbox, type **Britta Simon**.

    d. In the **Role** list, select **User**.

    e. Click **Next**.

7. On the **Get temporary password** dialog page, click **create**.

	![Create Azure AD test user][105]  

8. On the **Get temporary password** dialog page, perform the following steps:

	![Create Azure AD test user][106]   
  
    a. Write down the value of the **New Password**.
  
    b. Click **Complete**.   
  
 
### Creating a Questetra BPM Suite test user

The objective of this section is to create a user called Britta Simon in Questetra BPM Suite.

**To create a user called Britta Simon in Questetra BPM Suite, perform the following steps:**

1.	Sign-on to your Questetra BPM Suite company site as an administrator.
2.	Go to **System Settings > User List > New User**. 
3.	On the New User dialog, perform the following steps: 

	![Create test user][300] 

    a. In the **Name** textbox, type Britta's user name in Azure AD.

    b. In the **Email** textbox, type Britta's user name in Azure AD.

    c. In the **Password** textbox, type a password.

4.	Click **Add new user**.



### Assigning the Azure AD test user

The objective of this section is to enabling Britta Simon to use Azure single sign-on by granting her access to Questetra BPM Suite.

![What is Azure AD Connect][200]

**To assign Britta Simon to Questetra BPM Suite, perform the following steps:**

1. On the Azure classic portal, to open the applications view, in the directory view, click **Applications** in the top menu.

	![What is Azure AD Connect][201]

2. In the applications list, select **Questetra BPM Suite**.

	![What is Azure AD Connect][205]

1. In the menu on the top, click **Users**.

	![What is Azure AD Connect][202]

1. In the Users list, select **Britta Simon**.

	![What is Azure AD Connect][203]

2. In the toolbar on the bottom, click **Assign**.

	![What is Azure AD Connect][204]



### Testing Single Sign-On

The objective of this section is to test your Azure AD single sign-on configuration using the Access Panel.  
When you click the Questetra BPM Suite tile in the Access Panel, you should get automatically signed-on to your Questetra BPM Suite application.


## Additional Resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)

<!--Image references-->
[1]: ./media/active-directory-saas-questetra-bpm-suite/tutorial_general_01.png
[2]: ./media/active-directory-saas-questetra-bpm-suite/tutorial_general_02.png
[3]: ./media/active-directory-saas-questetra-bpm-suite/tutorial_general_03.png
[4]: ./media/active-directory-saas-questetra-bpm-suite/tutorial_general_04.png
[5]: ./media/active-directory-saas-questetra-bpm-suite/questera_bpm_suite_01.png


[8]: ./media/active-directory-saas-questetra-bpm-suite/tutorial_general_06.png
[9]: ./media/active-directory-saas-questetra-bpm-suite/questera_bpm_suite_02.png
[10]: ./media/active-directory-saas-questetra-bpm-suite/questera_bpm_suite_03.png
[11]: ./media/active-directory-saas-questetra-bpm-suite/questera_bpm_suite_04.png
[12]: ./media/active-directory-saas-questetra-bpm-suite/questera_bpm_suite_05.png
[13]: ./media/active-directory-saas-questetra-bpm-suite/questera_bpm_suite_06.png
[14]: ./media/active-directory-saas-questetra-bpm-suite/questera_bpm_suite_07.png
[15]: ./media/active-directory-saas-questetra-bpm-suite/questera_bpm_suite_08.png
[16]: ./media/active-directory-saas-questetra-bpm-suite/questera_bpm_suite_09.png
[17]: ./media/active-directory-saas-questetra-bpm-suite/questera_bpm_suite_10.png
[18]: ./media/active-directory-saas-questetra-bpm-suite/tutorial_general_08.png


[100]: ./media/active-directory-saas-questetra-bpm-suite/tutorial_general_09.png 
[101]: ./media/active-directory-saas-questetra-bpm-suite/tutorial_general_10.png 
[102]: ./media/active-directory-saas-questetra-bpm-suite/tutorial_general_11.png 
[103]: ./media/active-directory-saas-questetra-bpm-suite/tutorial_general_12.png 
[104]: ./media/active-directory-saas-questetra-bpm-suite/tutorial_general_13.png 
[105]: ./media/active-directory-saas-questetra-bpm-suite/tutorial_general_14.png 
[106]: ./media/active-directory-saas-questetra-bpm-suite/tutorial_general_15.png 


[200]: ./media/active-directory-saas-questetra-bpm-suite/tutorial_general_16.png 
[201]: ./media/active-directory-saas-questetra-bpm-suite/tutorial_general_17.png 
[202]: ./media/active-directory-saas-questetra-bpm-suite/tutorial_general_18.png
[203]: ./media/active-directory-saas-questetra-bpm-suite/tutorial_general_19.png
[204]: ./media/active-directory-saas-questetra-bpm-suite/tutorial_general_20.png
[205]: ./media/active-directory-saas-questetra-bpm-suite/questera_bpm_suite_12.png

[300]: ./media/active-directory-saas-questetra-bpm-suite/questera_bpm_suite_11.png 
---
title: 'Tutorial: Azure Active Directory integration with Novatus | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and LearnUpon.
services: active-directory
documentationcenter: ''
author: jeevansd
manager: femila
editor: ''

ms.assetid: b11c6315-c79d-4f34-9610-bd17070ab7c7
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/24/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with LearnUpon
The objective of this tutorial is to show you how to integrate LearnUpon with Azure Active Directory (Azure AD).

Integrating LearnUpon with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to LearnUpon
* You can enable your users to automatically get signed-on to LearnUpon single sign-on (SSO) with their Azure AD accounts
* You can manage your accounts in one central location - the Azure Active Directory classic 

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites
To configure Azure AD integration with LearnUpon, you need the following items:

* An Azure AD subscription
* A LearnUpon single-sign on (SSO) enabled subscription

>[!NOTE]
>To test the steps in this tutorial, we do not recommend using a production environment. 
> 

To test the steps in this tutorial, you should follow these recommendations:

* You should not use your production environment, unless this is necessary.
* If you don't have an Azure AD trial environment, you can get a [one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario Description
The objective of this tutorial is to enable you to test Azure AD SSO in a test environment. 

The scenario outlined in this tutorial consists of two main building blocks:

1. Adding LearnUpon from the gallery
2. Configuring and testing Azure AD SSO

## Adding LearnUpon from the gallery
To configure the integration of LearnUpon into Azure AD, you need to add LearnUpon from the gallery to your list of managed SaaS apps.

**To add LearnUpon from the gallery, perform the following steps:**

1. In the **Azure classic portal**, on the left navigation pane, click **Active Directory**. 
   
    ![Active Directory][1]
2. From the **Directory** list, select the directory for which you want to enable directory integration.
3. To open the applications view, in the directory view, click **Applications** in the top menu.
   
    ![Applications][2]
4. Click **Add** at the bottom of the page.
   
    ![Applications][3]
5. On the **What do you want to do** dialog, click **Add an application from the gallery**.
   
    ![Applications][4]
6. In the search box, type **LearnUpon**.
   
    ![Creating an Azure AD test user](./media/active-directory-saas-learnupon-tutorial/tutorial_learnupon_01.png)
7. In the results pane, select **LearnUpon**, and then click **Complete** to add the application.
   
    ![Creating an Azure AD test user](./media/active-directory-saas-learnupon-tutorial/tutorial_learnupon_02.png)

## Configure and test Azure AD SSO
The objective of this section is to show you how to configure and test Azure AD SSO with LearnUpon based on a test user called "Britta Simon".

For SSO to work, Azure AD needs to know what the counterpart user in LearnUpon to an user in Azure AD is. In other words, a link relationship between an Azure AD user and the related user in LearnUpon needs to be established.  

This link relationship is established by assigning the value of the **user name** in Azure AD as the value of the **Username** in LearnUpon.

To configure and test Azure AD single sign-on with LearnUpon, you need to complete the following building blocks:

1. **[Configuring Azure AD single sign-on](#configuring-azure-ad-single-single-sign-on)** - to enable your users to use this feature.
2. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Creating a LearnUpon test user](#creating-a-learnupon-test-user)** - to have a counterpart of Britta Simon in LearnUpon that is linked to the Azure AD representation of her.
4. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Testing single sign-on](#testing-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD SSO
The objective of this section is to enable Azure AD SSO in the Azure classic portal and to configure single sign-on in your LearnUpon application.

**To configure Azure AD single sign-on with LearnUpon, perform the following steps:**

1. In the Azure classic portal, on the **LearnUpon** application integration page, click **Configure single sign-on** to open the **Configure Single Sign-On**  dialog.
   
    ![Configure Single Sign-On][6] 
2. On the **How would you like users to sign on to LearnUpon** page, select **Azure AD Single Sign-On**, and then click **Next**.
   
    ![Configure Single Sign-On](./media/active-directory-saas-learnupon-tutorial/tutorial_learnupon_03.png) 
3. On the **Configure App Settings** dialog page, perform the following steps:.
   
    ![Configure Single Sign-On](./media/active-directory-saas-learnupon-tutorial/tutorial_learnupon_04.png) 
  1. In the **Reply URL** textbox, type the Assertion Consumer Service URL using the following pattern: `https://\<companyname\>.learnupon.com/saml/consumer`
  2. Click **Next**. 
4. On the **Configure single sign-on at LearnUpon** page, perform the following steps:
   
    ![Configure Single Sign-On](./media/active-directory-saas-learnupon-tutorial/tutorial_learnupon_05.png)   
  1. Click **Download certificate**, and then save the file on your computer. We will need this certificate and Metadata URLs (Entity ID, SSO Sign In URL and Sign Out URL) to set up SSO on LearnUpon side.
  2. Click **Next**.
5. Open another browser instance and login into LearnUpon with an administrator account. 
6. Click the **settings** tab.
   
    ![Configure Single Sign-On](./media/active-directory-saas-learnupon-tutorial/tutorial_learnupon_06.png) 
7. Click **Single Sign On - SAML**, and then click **General Settings** to configure SAML settings.
   
    ![Configure Single Sign-On](./media/active-directory-saas-learnupon-tutorial/tutorial_learnupon_07.png) 
8. In the **General Settings** section, perform the following steps:
   
    ![Configure Single Sign-On](./media/active-directory-saas-learnupon-tutorial/tutorial_learnupon_08.png)  
  1. Select **Enabled**.
  2. As **Version**, select **2.0**.
  3. As **Skip conditions**, select **No**.
  4. In the **SAML Token Post param name** textbox, type the name of request post parameter to the SAML consumer URL indicated above that contains the SAML Assertion to be verified and authenticated - for example **SAMLResponse**.
  5. In the **Name Identifier Format** textbox, type the value that indicates where in your SAML Assertion the users identifier (Email address) resides - for example **urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress**.
  6. In the **Identify Provider Location** textbox, type the value that indicates where the users are sent to if they click on your uploaded icon from your Azure classic portal login screen.
  7.in the Azure classic portal, copy the **Single Sign-Out Service URL**, and then paste it into the **Sign out URL** textbos.
  8. Click **Manage finger prints**, and then upload the finger print of your downloaded certificate. 
9. Click **User Settings**, and then perform the following steps:
   
    ![Configure Single Sign-On](./media/active-directory-saas-learnupon-tutorial/tutorial_learnupon_11.png)  
  1. In the **First Name Identifier Format** textbox, type the value that tells us where in your SAML Assertion the users firstname resides - for example: http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname. 
  2. In the **Last Name Identifier Format** textbox, type the value that tells us where in your SAML Assertion the users lastname resides - for example: http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname.
7. In the Azure classic portal, select the single sign-on configuration confirmation, and then click **Next**.
   
    ![Azure AD Single Sign-On][10]
8. On the **Single sign-on confirmation** page, click **Complete**.  
   
    ![Azure AD Single Sign-On][11]

### Create an Azure AD test user
The objective of this section is to create a test user in the Azure classic portal called Britta Simon.

![Create Azure AD User][20]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure classic portal**, on the left navigation pane, click **Active Directory**.
   
    ![Creating an Azure AD test user](./media/active-directory-saas-learnupon-tutorial/create_aaduser_09.png) 
2. From the **Directory** list, select the directory for which you want to enable directory integration.
3. To display the list of users, in the menu on the top, click **Users**.
   
    ![Creating an Azure AD test user](./media/active-directory-saas-learnupon-tutorial/create_aaduser_03.png) 
4. To open the **Add User** dialog, in the toolbar on the bottom, click **Add User**.
   
    ![Creating an Azure AD test user](./media/active-directory-saas-learnupon-tutorial/create_aaduser_04.png) 
5. On the **Tell us about this user** dialog page, perform the following steps:
   
    ![Creating an Azure AD test user](./media/active-directory-saas-learnupon-tutorial/create_aaduser_05.png) 
  1. As Type Of User, select New user in your organization.
  2. In the User Name **textbox**, type **BrittaSimon**.
  3. Click **Next**.
6. On the **User Profile** dialog page, perform the following steps:
   
   ![Creating an Azure AD test user](./media/active-directory-saas-learnupon-tutorial/create_aaduser_06.png) 
  1. In the **First Name** textbox, type **Britta**.   
  2. In the **Last Name** textbox, type, **Simon**.
  3. In the **Display Name** textbox, type **Britta Simon**.
  4. In the **Role** list, select **User**.
  5. Click **Next**.
7. On the **Get temporary password** dialog page, click **create**.
   
    ![Creating an Azure AD test user](./media/active-directory-saas-learnupon-tutorial/create_aaduser_07.png) 
8. On the **Get temporary password** dialog page, perform the following steps:
   
    ![Creating an Azure AD test user](./media/active-directory-saas-learnupon-tutorial/create_aaduser_08.png) 
  1. Write down the value of the **New Password**. 
  2. Click **Complete**.   

### Create a LearnUpon test user
The objective of this section is to create a user called Britta Simon in LearnUpon. LearnUpon supports just-in-time provisioning, which is by default enabled.

There is no action item for you in this section. A new user will be created during an attempt to access LearnUpon if it doesn't exist yet. [Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-single-sign-on).

>[!NOTE]
>If you need to create an user manually, you need to contact the LearnUpon support team. 
> 

### Assign the Azure AD test user
The objective of this section is to enabling Britta Simon to use Azure SSO by granting her access to LearnUpon.

![Assign User][200] 

**To assign Britta Simon to LearnUpon, perform the following steps:**

1. On the Azure classic portal, to open the applications view, in the directory view, click **Applications** in the top menu.
   
    ![Assign User][201] 
2. In the applications list, select **LearnUpon**.
   
    ![Configure Single Sign-On](./media/active-directory-saas-learnupon-tutorial/tutorial_learnupon_50.png) 
3. In the menu on the top, click **Users**.
   
    ![Assign User][203] 
4. In the Users list, select **Britta Simon**.
5. In the toolbar on the bottom, click **Assign**.
   
    ![Assign User][205]

### Test single sign-on
The objective of this section is to test your Azure AD SSO configuration using the Access Panel.  

When you click the LearnUpon tile in the Access Panel, you should get automatically signed-on to your LearnUpon application.

## Additional Resources
* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)

<!--Image references-->

[1]: ./media/active-directory-saas-learnupon-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-learnupon-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-learnupon-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-learnupon-tutorial/tutorial_general_04.png

[6]: ./media/active-directory-saas-learnupon-tutorial/tutorial_general_05.png
[10]: ./media/active-directory-saas-learnupon-tutorial/tutorial_general_06.png
[11]: ./media/active-directory-saas-learnupon-tutorial/tutorial_general_07.png
[20]: ./media/active-directory-saas-learnupon-tutorial/tutorial_general_100.png

[200]: ./media/active-directory-saas-learnupon-tutorial/tutorial_general_200.png
[201]: ./media/active-directory-saas-learnupon-tutorial/tutorial_general_201.png
[203]: ./media/active-directory-saas-learnupon-tutorial/tutorial_general_203.png
[204]: ./media/active-directory-saas-learnupon-tutorial/tutorial_general_204.png
[205]: ./media/active-directory-saas-learnupon-tutorial/tutorial_general_205.png

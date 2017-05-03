---
title: 'Tutorial: Azure Active Directory integration with Recognize | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Recognize.
services: active-directory
documentationcenter: ''
author: jeevansd
manager: femila
editor: ''

ms.assetid: cfad939e-c8f4-45a0-bd25-c4eb9701acaa
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/27/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Recognize
The objective of this tutorial is to show you how to integrate Recognize with Azure Active Directory (Azure AD).

Integrating Recognize with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to Recognize
* You can enable your users to automatically get signed-on to Recognize single sign-on) with their Azure AD accounts
* You can manage your accounts in one central location - the Azure classic portal

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites
To configure Azure AD integration with Recognize, you need the following items:

* An Azure AD subscription
* A Recognize single-sign on (SSO) enabled subscription

 >[!NOTE]
 >To test the steps in this tutorial, we do not recommend using a production environment. 
 > 

To test the steps in this tutorial, you should follow these recommendations:

* You should not use your production environment, unless this is necessary.
* If you don't have an Azure AD trial environment, you can get a [one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
The objective of this tutorial is to enable you to test Azure AD SSO in a test environment.

The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Recognize from the gallery
2. Configuring and testing Azure AD SSO

## Adding Recognize from the gallery
To configure the integration of Recognize into Azure AD, you need to add Recognize from the gallery to your list of managed SaaS apps.

**To add Recognize from the gallery, perform the following steps:**

1. In the **Azure classic Portal**, on the left navigation pane, click **Active Directory**. 
   
    ![Active Directory][1]
2. From the **Directory** list, select the directory for which you want to enable directory integration.
3. To open the applications view, in the directory view, click **Applications** in the top menu.
   
    ![Applications][2]
4. Click **Add** at the bottom of the page.
   
    ![Applications][3]
5. On the **What do you want to do** dialog, click **Add an application from the gallery**.
   
    ![Applications][4]
6. In the search box, type **Recognize**.
   
    ![Creating an Azure AD test user](./media/active-directory-saas-recognize-tutorial/tutorial_recognize_01.png)
7. In the results panel, select **Recognize**, and then click **Complete** to add the application.
   
    ![Selecting the app in the gallery](./media/active-directory-saas-recognize-tutorial/tutorial_recognize_0001.png)

## Configure and test Azure AD SSO
The objective of this section is to show you how to configure and test Azure AD SSO with Recognize based on a test user called "Britta Simon".

For SSO to work, Azure AD needs to know what the counterpart user in Recognize to an user in Azure AD is. In other words, a link relationship between an Azure AD user and the related user in Recognize needs to be established.

This link relationship is established by assigning the value of the **user name** in Azure AD as the value of the **Username** in Recognize.

To configure and test Azure AD SSO with Recognize, you need to complete the following building blocks:

1. **[Configuring Azure AD single sign-on](#configuring-azure-ad-single-single-sign-on)** - to enable your users to use this feature.
2. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Creating a Recognize test user](#creating-a-recognize-test-user)** - to have a counterpart of Britta Simon in Recognize that is linked to the Azure AD representation of her.
4. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Testing single sign-on](#testing-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD SSO
In this section, you enable Azure AD SSO in the classic portal and configure SSO in your Recognize application.

**To configure Azure AD SSO with Recognize, perform the following steps:**

1. In the classic portal, on the **Recognize** application integration page, click **Configure single sign-on** to open the **Configure Single Sign-On**  dialog.
   
    ![Configure Single Sign-On][6] 
2. On the **How would you like users to sign on to Recognize** page, select **Azure AD Single Sign-On**, and then click **Next**.
   
    ![Configure Single Sign-On](./media/active-directory-saas-recognize-tutorial/tutorial_recognize_03.png)
3. On the **Configure App Settings** dialog page, perform the following steps and click **Next**:
   
    ![Configure Single Sign-On](./media/active-directory-saas-recognize-tutorial/tutorial_recognize_04.png)
  1. In the **Sign On URL** textbox, type a URL using the following pattern: `https://recognizeapp.com/<your-domain>/saml/sso`. 
  2. In the **Identifier** textbox, type a URL using the following pattern: `https://recognizeapp.com/<your-domain>/saml/metadata`.
  3. Click **Next**.
  
    >[!NOTE]
    >If you don't know about these URLs, type sample URLs with example pattern. To get these values, you can refer step 9 for more details or contact Recognize support team via <mailto:support@recognizeapp.com>.
    >

4. On the **Configure single sign-on at Recognize** page, click **Download certificate** and then save the file on your computer:
   
    ![Configure Single Sign-On](./media/active-directory-saas-recognize-tutorial/tutorial_recognize_05.png)
5. In a different web browser window, sign-on to your Recognize tenant as an administrator.
6. On the upper right corner, click **Menu**. Go to **Company Admin**.
   
    ![Configure Single Sign-On On App side](./media/active-directory-saas-recognize-tutorial/tutorial_recognize_000.png)
7. On the left navigation pane, click **Settings**.
   
    ![Configure Single Sign-On On App side](./media/active-directory-saas-recognize-tutorial/tutorial_recognize_001.png)
8. Perform the following steps on **SSO Settings** section.
   
    ![Configure Single Sign-On On App side](./media/active-directory-saas-recognize-tutorial/tutorial_recognize_002.png)
 1. As **Enable SSO**, select **ON**.
 2. In the **IDP Entity ID** textbox put the value of **Issuer URL** from Azure AD application configuration wizard. 
 3. In the **Sso target url** textbox put the value of **Single Sign-On Service URL** from Azure AD application configuration wizard. 
 4. In the **Slo target url** textbox put the value of **Single Sign-Out Service URL** from Azure AD application configuration wizard. 
 5. Open your downloaded certificate file in notepad, copy the content of it into your clipboard, and then paste it to the **Certificate** textbox.  
 6. Click the **Save settings** button. 
9. Beside the **SSO Settings** section, copy the URL under **Service Provider Metadata url**.
   
    ![Configure Single Sign-On On App side](./media/active-directory-saas-recognize-tutorial/tutorial_recognize_003.png)
10. Open the **Metadata URL link** under a blank browser to download the metadata document. Then use the EntityDescriptor value Recognize provided you for **Identifier** on the **Configure App Settings** dialog.
    
    ![Configure Single Sign-On On App side](./media/active-directory-saas-recognize-tutorial/tutorial_recognize_004.png)
11. In the classic portal, select the single sign-on configuration confirmation, and then click **Next**.
    
    ![Azure AD Single Sign-On][10]
12. On the **Single sign-on confirmation** page, click **Complete**.  
    
    ![Azure AD Single Sign-On][11]

### Create an Azure AD test user
The objective of this section is to create a test user in the classic portal called Britta Simon.

![Create Azure AD User][20]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure classic Portal**, on the left navigation pane, click **Active Directory**.
   
    ![Creating an Azure AD test user](./media/active-directory-saas-recognize-tutorial/create_aaduser_09.png)
2. From the **Directory** list, select the directory for which you want to enable directory integration.
3. To display the list of users, in the menu on the top, click **Users**.
   
    ![Creating an Azure AD test user](./media/active-directory-saas-recognize-tutorial/create_aaduser_03.png)
4. To open the **Add User** dialog, in the toolbar on the bottom, click **Add User**.
   
    ![Creating an Azure AD test user](./media/active-directory-saas-recognize-tutorial/create_aaduser_04.png)
5. On the **Tell us about this user** dialog page, perform the following steps:
   
    ![Creating an Azure AD test user](./media/active-directory-saas-recognize-tutorial/create_aaduser_05.png)
 1. As Type Of User, select New user in your organization.  
 2. In the User Name **textbox**, type **BrittaSimon**. 
 3. Click **Next**.
6. On the **User Profile** dialog page, perform the following steps:
   
   ![Creating an Azure AD test user](./media/active-directory-saas-recognize-tutorial/create_aaduser_06.png) 
 1. In the **First Name** textbox, type **Britta**.   
 2. In the **Last Name** textbox, type **Simon**. 
 3. In the **Display Name** textbox, type **Britta Simon**. 
 4. In the **Role** list, select **User**. 
 5. Click **Next**.
7. On the **Get temporary password** dialog page, click **create**.
   
    ![Creating an Azure AD test user](./media/active-directory-saas-recognize-tutorial/create_aaduser_07.png)
8. On the **Get temporary password** dialog page, perform the following steps:
   
    ![Creating an Azure AD test user](./media/active-directory-saas-recognize-tutorial/create_aaduser_08.png) 
 1. Write down the value of the **New Password**. 
 2. Click **Complete**.   

### Create a Recognize test user
In order to enable Azure AD users to log into Recognize, they must be provisioned into Recognize. In the case of Recognize, provisioning is a manual task.

This app doesn't support SCIM provisioning but has an alternate user sync that provisions users. 

**To provision a user account, perform the following steps:**

1. Log into your Recognize company site as an administrator.
2. On the upper right corner, click **Menu**. Go to **Company Admin**.
3. On the left navigation pane, click **Settings**.
4. Perform the following steps on **User Sync** section.
   
   ![New User](./media/active-directory-saas-recognize-tutorial/tutorial_recognize_005.png "New User")   
 1. As **Sync Enabled**, select **ON**. 
 2. As **Choose sync provider**, select **Microsoft / Office 365**. 
 3. Click **Run User Sync**.

### Assign the Azure AD test user
The objective of this section is to enabling Britta Simon to use Azure single sign-on by granting her access to Recognize.

![Assign User][200]

**To assign Britta Simon to Recognize, perform the following steps:**

1. On the classic portal, to open the applications view, in the directory view, click **Applications** in the top menu.
   
    ![Assign User][201]
2. In the applications list, select **Recognize**.
   
    ![Configure Single Sign-On](./media/active-directory-saas-recognize-tutorial/tutorial_recognize_50.png)
3. In the menu on the top, click **Users**.
   
    ![Assign User][203]
4. In the Users list, select **Britta Simon**.
5. In the toolbar on the bottom, click **Assign**.
   
    ![Assign User][205]

### Test single sign-on
The objective of this section is to test your Azure AD SSO configuration using the Access Panel.

When you click the Recognize tile in the Access Panel, you should get automatically signed-on to your Recognize application.

## Additional resources
* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)

<!--Image references-->

[1]: ./media/active-directory-saas-recognize-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-recognize-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-recognize-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-recognize-tutorial/tutorial_general_04.png

[6]: ./media/active-directory-saas-recognize-tutorial/tutorial_general_05.png
[10]: ./media/active-directory-saas-recognize-tutorial/tutorial_general_06.png
[11]: ./media/active-directory-saas-recognize-tutorial/tutorial_general_07.png
[20]: ./media/active-directory-saas-recognize-tutorial/tutorial_general_100.png

[200]: ./media/active-directory-saas-recognize-tutorial/tutorial_general_200.png
[201]: ./media/active-directory-saas-recognize-tutorial/tutorial_general_201.png
[203]: ./media/active-directory-saas-recognize-tutorial/tutorial_general_203.png
[204]: ./media/active-directory-saas-recognize-tutorial/tutorial_general_204.png
[205]: ./media/active-directory-saas-recognize-tutorial/tutorial_general_205.png

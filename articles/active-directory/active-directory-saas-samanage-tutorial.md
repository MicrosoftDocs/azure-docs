---
title: 'Tutorial: Azure Active Directory Integration with Samanage | Microsoft Docs'
description: Learn how to use Samanage with Azure Active Directory to enable single sign-on, automated provisioning, and more!
services: active-directory
author: jeevansd
documentationcenter: na
manager: femila

ms.assetid: f0db4fb0-7eec-48c2-9c7a-beab1ab49bc2
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 02/24/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Samanage
The objective of this tutorial is to show you how to integrate Samanage with Azure Active Directory (Azure AD).

Integrating Samanage with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to Samanage
* You can enable your users to automatically get signed-on to Samanage single sign-on (SSO) with their Azure AD accounts
* You can manage your accounts in one central location - the Azure classic portal

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites
To configure Azure AD integration with Samanage, you need the following items:

* A valid Azure subscription
* A tenant in Samanage

>[!NOTE]
>To test the steps in this tutorial, we do not recommend using a production environment. 
> 

To test the steps in this tutorial, you should follow these recommendations:

* You should not use your production environment, unless this is necessary.
* If you don't have an Azure AD trial environment, you can get a [one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
The objective of this tutorial is to enable you to test Azure AD SSO in a test environment.

The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Samanage from the gallery
2. Configuring and testing Azure AD SSO

## Adding Samanage from the gallery
To configure the integration of Samanage into Azure AD, you need to add Samanage from the gallery to your list of managed SaaS apps.

**To add Samanage from the gallery, perform the following steps:**

1. In the Azure classic portal, on the left navigation pane, click **Active Directory**.
   
   ![Active Directory](./media/active-directory-saas-samanage-tutorial/tutorial_general_01.png "Active Directory")
2. From the **Directory** list, select the directory for which you want to enable directory integration.
3. To open the applications view, in the directory view, click **Applications** in the top menu.
   
   ![Applications](./media/active-directory-saas-samanage-tutorial/tutorial_general_02.png "Applications")
4. Click **Add** at the bottom of the page.
   
   ![Add application](./media/active-directory-saas-samanage-tutorial/tutorial_general_03.png "Add application")
5. On the **What do you want to do** dialog, click **Add an application from the gallery**.
   
   ![Add an application from gallerry](./media/active-directory-saas-samanage-tutorial/tutorial_general_04.png "Add an application from gallerry")
6. In the **search box**, type **Samanage**.
   
   ![Application gallery](./media/active-directory-saas-samanage-tutorial/tutorial_samanage_01.png "Application gallery")
7. In the results pane, select **Samanage**, and then click **Complete** to add the application.
   
   ![Samanage](./media/active-directory-saas-samanage-tutorial/tutorial_samanage_02.png "Samanage")

## Configure and test Azure AD SSO
The objective of this section is to show you how to configure and test Azure AD SSO with Samanage based on a test user called "Britta Simon".

For SSO to work, Azure AD needs to know what the counterpart user in Samanage to an user in Azure AD is. In other words, a link relationship between an Azure AD user and the related user in Samanage needs to be established.

This link relationship is established by assigning the value of the **user name** in Azure AD as the value of the **Username** in Samanage.

To configure and test Azure AD SSO with Samanage, you need to complete the following building blocks:

1. **[Configuring Azure AD single sign-on](#configuring-azure-ad-single-single-sign-on)** - to enable your users to use this feature.
2. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Creating a Samanage test user](#creating-a-Samanage-test-user)** - to have a counterpart of Britta Simon in Samanage that is linked to the Azure AD representation of her.
4. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Testing single sign-on](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD SSO
In this section, you enable Azure AD single sign-on in the classic portal and configure SSO in your Samanage application.

**To configure Azure AD SSO with Samanage, perform the following steps:**

1. In the Azure classic portal, on the **Samanage** application integration page, click **Configure single sign-on** to open the **Configure Single Sign On** dialog.
   
   ![Configure single sign-on](./media/active-directory-saas-samanage-tutorial/tutorial_general_05.png "Configure single sign-on")
2. On the **How would you like users to sign on to Samanage** page, select **Microsoft Azure AD Single Sign-On**, and then click **Next**.
   
   ![Microsoft Azure AD Single Sign-On](./media/active-directory-saas-samanage-tutorial/tutorial_samanage_03.png "Microsoft Azure AD Single Sign-On")
3. On the Configure App Settings dialog page, perform the following steps:
   
   ![Configure App URL](./media/active-directory-saas-samanage-tutorial/tutorial_samanage_04.png "Configure App URL") 
 1. In the **Sign On URL** textbox, type a URL using the following pattern: `https://<Company Name>.samanage.com/saml_login/<Company Name>`. 
 2. click **Next**.
 
   >[!NOTE]
   >Please note that these are not the real values. You have to update these values with the actual Sign On URL. To get these values, refer step 8.c for more details or contact Samanage.
   > 
 
4. On the **Configure single sign-on at Samanage** page, click **Download certificate**, and then save the certificate file on your computer.
   
   ![Configure Single Sign-On](./media/active-directory-saas-samanage-tutorial/tutorial_samanage_05.png "Configure Single Sign-On")
5. In a different web browser window, log into your Samanage company site as an administrator.
6. Click **Dashboard** and select **Setup** in left navigation pane.
   
   ![Dashboard](./media/active-directory-saas-samanage-tutorial/tutorial_samanage_001.png "Dashboard")
7. Click **Single Sign-On**.
   
   ![Single Sign-On](./media/active-directory-saas-samanage-tutorial/tutorial_samanage_002.png "Single Sign-On")
8. Navigate to **Login using SAML** section, perform the following steps:
   
   ![Login using SAML](./media/active-directory-saas-samanage-tutorial/tutorial_samanage_003.png "Login using SAML")
 1. Click **Enable Single Sign-On with SAML**.  
 2. In the **Identity Provider URL** textbox put the value of **Identity Provider ID** from Azure AD application configuration wizard.    
 3. Confirm the **Login URL** matches the **Sign On URL** in step 3.
 4. In the **Logout URL** textbox put the value of **Remote Logout URL** from Azure AD application configuration wizard.
 5. In the **SAML Issuer** textbox type the app id URI set in your identity provider.
 6. Open your base-64 encoded certificate in notepad, copy the content of it into your clipboard, and then paste it to the **Paste your Identity Provider x.509 Certificate below** textbox.
 7. Click **Create users if they do not exist in Samanage**.
 8. Click **Update**.
9. In the classic portal, select the single sign-on configuration confirmation, and then click **Next**.
   
   ![Configure Single Sign-On](./media/active-directory-saas-samanage-tutorial/tutorial_samanage_06.png "Configure Single Sign-On")
10. On the **Single sign-on confirmation** page, click **Complete**.
    
    ![Configure Single Sign-On](./media/active-directory-saas-samanage-tutorial/tutorial_samanage_07.png "Configure Single Sign-On")

### Create an Azure AD test user
The objective of this section is to create a test user in the classic portal called Britta Simon.

![Creating an Azure AD test user](./media/active-directory-saas-samanage-tutorial/create_aaduser_00.png)

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure classic Portal**, on the left navigation pane, click **Active Directory**.
   
    ![Creating an Azure AD test user](./media/active-directory-saas-samanage-tutorial/create_aaduser_01.png)
2. From the **Directory** list, select the directory for which you want to enable directory integration.
3. To display the list of users, in the menu on the top, click **Users**.
   
    ![Creating an Azure AD test user](./media/active-directory-saas-samanage-tutorial/create_aaduser_02.png)
4. To open the **Add User** dialog, in the toolbar on the bottom, click **Add User**.
   
    ![Creating an Azure AD test user](./media/active-directory-saas-samanage-tutorial/create_aaduser_03.png)
5. On the **Tell us about this user** dialog page, perform the following steps:
   
    ![Creating an Azure AD test user](./media/active-directory-saas-samanage-tutorial/create_aaduser_04.png)
 1. As Type Of User, select New user in your organization. 
 2. In the User Name **textbox**, type **BrittaSimon**. 
 3. Click **Next**.
6. On the **User Profile** dialog page, perform the following steps:
   
   ![Creating an Azure AD test user](./media/active-directory-saas-samanage-tutorial/create_aaduser_05.png) 
 1. In the **First Name** textbox, type **Britta**.   
 2. In the **Last Name** textbox, type, **Simon**. 
 3. In the **Display Name** textbox, type **Britta Simon**. 
 4. In the **Role** list, select **User**. 
 5. Click **Next**.
7. On the **Get temporary password** dialog page, click **create**.
   
    ![Creating an Azure AD test user](./media/active-directory-saas-samanage-tutorial/create_aaduser_06.png)
8. On the **Get temporary password** dialog page, perform the following steps:
   
    ![Creating an Azure AD test user](./media/active-directory-saas-samanage-tutorial/create_aaduser_07.png)  
 1. Write down the value of the **New Password**. 
 2. Click **Complete**.   

### Create a Samanage test user
In order to enable Azure AD users to log into Samanage, they must be provisioned into Samanage.In the case of Samanage, provisioning is a manual task.

**To provision a user account, perform the following steps:**

1. Log into your Samanage company site as an administrator.
2. Click **Dashboard** and select **Setup** in left navigation pan.
   
   ![Setup](./media/active-directory-saas-samanage-tutorial/tutorial_samanage_001.png "Setup")
3. Click the **Users** tab
   
   ![Users](./media/active-directory-saas-samanage-tutorial/tutorial_samanage_006.png "Users")
4. Click **New User**.
   
   ![New User](./media/active-directory-saas-samanage-tutorial/tutorial_samanage_007.png "New User")
5. Type the **Name** and the **Email Address** of an Azure AD account you want to provision and click **Create user**.
   
   ![Creat User](./media/active-directory-saas-samanage-tutorial/tutorial_samanage_008.png "Creat User")
   
   >[!NOTE]
   >The AAD account holder will receive an email and follow a link to confirm their account before it becomes active. You can use any other Samanage user account creation tools or APIs provided by Samanage to provision AAD user accounts.
   >  

### Assign the Azure AD test user
The objective of this section is to enabling Britta Simon to use Azure SSO by granting her access to Samanage.

![Assign users](./media/active-directory-saas-samanage-tutorial/assign_aaduser_00.png "Assign users")

**To assign Britta Simon to Samanage, perform the following steps:**

1. On the classic portal, to open the applications view, in the directory view, click **Applications** in the top menu.
   
    ![Assign users](./media/active-directory-saas-samanage-tutorial/assign_aaduser_01.png "Assign users")
2. In the applications list, select **Samanage**.
   
    ![Configure Single Sign-On](./media/active-directory-saas-samanage-tutorial/tutorial_samanage_08.png)
3. In the menu on the top, click **Users**.
   
    ![Assign users](./media/active-directory-saas-samanage-tutorial/assign_aaduser_02.png "Assign users")
4. In the Users list, select **Britta Simon**.
5. In the toolbar on the bottom, click **Assign**.
   
    ![Assign users](./media/active-directory-saas-samanage-tutorial/assign_aaduser_03.png "Assign users")

### Test single sign-on
The objective of this section is to test your Azure AD SSO configuration using the Access Panel.

When you click the Samanage tile in the Access Panel, you should get automatically signed-on to your Samanage application.

## Additional resources
* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)


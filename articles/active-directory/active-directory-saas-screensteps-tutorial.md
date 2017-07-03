---
title: 'Tutorial: Azure Active Directory integration with ScreenSteps | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and ScreenSteps.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila

ms.assetid: 4563fe94-a88f-4895-a07f-79df44889cf9
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/03/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with ScreenSteps

In this tutorial, you learn how to integrate ScreenSteps with Azure Active Directory (Azure AD).

Integrating ScreenSteps with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to ScreenSteps
- You can enable your users to automatically get signed-on to ScreenSteps (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure portal

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites

To configure Azure AD integration with ScreenSteps, you need the following items:

- An Azure AD subscription
- A ScreenSteps single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can get a one-month trial [here](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding ScreenSteps from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding ScreenSteps from the gallery
To configure the integration of ScreenSteps into Azure AD, you need to add ScreenSteps from the gallery to your list of managed SaaS apps.

**To add ScreenSteps from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![Active Directory][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![Applications][2]
	
3. To add new application, click **New application** button on the top of dialog.

	![Applications][3]

4. In the search box, type **ScreenSteps**.

	![Creating an Azure AD test user](./media/active-directory-saas-screensteps-tutorial/tutorial_screensteps_search.png)

5. In the results panel, select **ScreenSteps**, and then click **Add** button to add the application.

	![Creating an Azure AD test user](./media/active-directory-saas-screensteps-tutorial/tutorial_screensteps_addfromgallery.png)

##  Configuring and testing Azure AD single sign-on
In this section, you configure and test Azure AD single sign-on with ScreenSteps based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in ScreenSteps is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in ScreenSteps needs to be established.

In ScreenSteps, assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with ScreenSteps, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Creating a ScreenSteps test user](#creating-a-screensteps-test-user)** - to have a counterpart of Britta Simon in ScreenSteps that is linked to the Azure AD representation of user.
4. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your ScreenSteps application.

**To configure Azure AD single sign-on with ScreenSteps, perform the following steps:**

1. In the Azure portal, on the **ScreenSteps** application integration page, click **Single sign-on**.

	![Configure Single Sign-On][4]

2. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Configure Single Sign-On](./media/active-directory-saas-screensteps-tutorial/tutorial_screensteps_samlbase.png)

3. On the **ScreenSteps Domain and URLs** section, perform the following steps:

	![Configure Single Sign-On](./media/active-directory-saas-screensteps-tutorial/tutorial_screensteps_url.png)

    In the **Sign-on URL** textbox, type a URL using the following pattern: `https://<tenantname>.ScreenSteps.com`

	> [!NOTE] 
	> The value is not real. Update the value with the actual Sign-On URL. Contact [ScreenSteps Client support team](http://www.screensteps.com/contact) to get the value. 
 
4. On the **SAML Signing Certificate** section, click **Certificate (Base64)** and then save the certificate file on your computer.

	![Configure Single Sign-On](./media/active-directory-saas-screensteps-tutorial/tutorial_screensteps_certificate.png) 

5. Click **Save** button.

	![Configure Single Sign-On](./media/active-directory-saas-screensteps-tutorial/tutorial_general_400.png)

6. On the **ScreenSteps Configuration** section, click **Configure ScreenSteps** to open **Configure sign-on** window. Copy the **Sign-Out URL, and SAML Single Sign-On Service URL** from the **Quick Reference section.**

	![Configure Single Sign-On](./media/active-directory-saas-screensteps-tutorial/tutorial_screensteps_configure.png) 

7. In a different web browser window, log in to your ScreenSteps company site as an administrator.

8. Click **Account Management**.
   
    ![Account management](./media/active-directory-saas-screensteps-tutorial/ic778523.png "Account management")

9. Click **Remote Authentication**.
   
    ![Remote authentication](./media/active-directory-saas-screensteps-tutorial/ic778524.png "Remote authentication")

10. Click **Create authentication endpoint**.
   
    ![Remote authentication](./media/active-directory-saas-screensteps-tutorial/ic778525.png "Remote authentication")

11. In the **Create an Authentication Endpoint** section, perform the following steps:
   
    ![Create an authentication endpoint](./media/active-directory-saas-screensteps-tutorial/ic778526.png "Create an authentication endpoint")
  
    a. In the **Title** textbox, type a title.

    b. From the **Mode** list, select **SAML**.

    c. Click **Create**.

12. In the **Remote Authentication Endpoint** section, perform the following steps:
    
    ![Remote authentication endpoint](./media/active-directory-saas-screensteps-tutorial/ic778527.png "Remote authentication endpoint")
    
    a. In the **Remote Login URL** textbox, paste the value of **SAML Single Sign-On Service URL**, which you have copied from Azure portal.

    b. In the **Log out URL** textbox, paste the value of **Sign-Out URL**, which you have copied from Azure portal.

    c. Click **Choose a file**, and then upload the downloaded certificate.

    d. Click **Update**.

> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)
> 

### Creating an Azure AD test user
The objective of this section is to create a test user in the Azure portal called Britta Simon.

![Create Azure AD User][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure portal**, on the left navigation pane, click **Azure Active Directory** icon.

	![Creating an Azure AD test user](./media/active-directory-saas-screensteps-tutorial/create_aaduser_01.png) 

2. To display the list of users, go to **Users and groups** and click **All users**.
	
	![Creating an Azure AD test user](./media/active-directory-saas-screensteps-tutorial/create_aaduser_02.png) 

3. To open the **User** dialog, click **Add** on the top of the dialog.
 
	![Creating an Azure AD test user](./media/active-directory-saas-screensteps-tutorial/create_aaduser_03.png) 

4. On the **User** dialog page, perform the following steps:
 
	![Creating an Azure AD test user](./media/active-directory-saas-screensteps-tutorial/create_aaduser_04.png) 

    a. In the **Name** textbox, type **BrittaSimon**.

    b. In the **User name** textbox, type the **email address** of BrittaSimon.

	c. Select **Show Password** and write down the value of the **Password**.

    d. Click **Create**.
 
### Creating a ScreenSteps test user

In order to enable Azure AD users to log in to **ScreenSteps**, they must be provisioned into **ScreenSteps**.  

In the case of **ScreenSteps**, provisioning is a manual task.

**To provision a user account to ScreenSteps, perform the following steps:**

1. Log in to your **ScreenSteps** tenant.

2. Click **Account Management**.
   
    ![Account management](./media/active-directory-saas-screensteps-tutorial/ic778523.png "Account management")

3. Click **Users**.
   
    ![Users](./media/active-directory-saas-screensteps-tutorial/ic778544.png "Users")

4. Click **Create a user**.
   
    ![All Users](./media/active-directory-saas-screensteps-tutorial/ic778545.png "All Users")

5. From the **User Role** list, select a role for your user.

6. In the User Role section, Type the “**First name**, **Last name**, **Email**, **Login**, **Password**, and **Password Confirmation**” of a valid AAD account you want to provision into the related textboxes.
   
    ![New user](./media/active-directory-saas-screensteps-tutorial/ic778546.png "New user")

7. In the Groups section, select **Authentication Group (SAML)**, and then click **Create User**.
   
    ![Groups](./media/active-directory-saas-screensteps-tutorial/ic778547.png "Groups")

>[!NOTE]
>You can use any other ScreenSteps user account creation tools or APIs provided by ScreenSteps to provision AAD user accounts.


### Assigning the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to ScreenSteps.

![Assign User][200] 

**To assign Britta Simon to ScreenSteps, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

2. In the applications list, select **ScreenSteps**.

	![Configure Single Sign-On](./media/active-directory-saas-screensteps-tutorial/tutorial_screensteps_app.png) 

3. In the menu on the left, click **Users and groups**.

	![Assign User][202] 

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![Assign User][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.
	
### Testing single sign-on


The objective of this section is to test your Azure AD single sign-on configuration using the Access Panel.

When you click the ScreenSteps tile in the Access Panel, you should get automatically signed-on to your ScreenSteps application.

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)



<!--Image references-->

[1]: ./media/active-directory-saas-screensteps-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-screensteps-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-screensteps-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-screensteps-tutorial/tutorial_general_04.png

[100]: ./media/active-directory-saas-screensteps-tutorial/tutorial_general_100.png

[200]: ./media/active-directory-saas-screensteps-tutorial/tutorial_general_200.png
[201]: ./media/active-directory-saas-screensteps-tutorial/tutorial_general_201.png
[202]: ./media/active-directory-saas-screensteps-tutorial/tutorial_general_202.png
[203]: ./media/active-directory-saas-screensteps-tutorial/tutorial_general_203.png


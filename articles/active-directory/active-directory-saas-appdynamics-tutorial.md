---
title: 'Tutorial: Azure Active Directory integration with AppDynamics | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and AppDynamics.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila

ms.assetid: 25fd1df0-411c-4f55-8be3-4273b543100f
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/16/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with AppDynamics

In this tutorial, you learn how to integrate AppDynamics with Azure Active Directory (Azure AD).

Integrating AppDynamics with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to AppDynamics
- You can enable your users to automatically get signed-on to AppDynamics (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure portal

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites

To configure Azure AD integration with AppDynamics, you need the following items:

- An Azure AD subscription
- An AppDynamics single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can get a one-month trial [here](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding AppDynamics from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding AppDynamics from the gallery
To configure the integration of AppDynamics into Azure AD, you need to add AppDynamics from the gallery to your list of managed SaaS apps.

**To add AppDynamics from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![Active Directory][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![Applications][2]
	
3. To add new application, click **New application** button on the top of dialog.

	![Applications][3]

4. In the search box, type **AppDynamics**.

	![Creating an Azure AD test user](./media/active-directory-saas-appdynamics-tutorial/tutorial_appdynamics_search.png)

5. In the results panel, select **AppDynamics**, and then click **Add** button to add the application.

	![Creating an Azure AD test user](./media/active-directory-saas-appdynamics-tutorial/tutorial_appdynamics_addfromgallery.png)

##  Configuring and testing Azure AD single sign-on
In this section, you configure and test Azure AD single sign-on with AppDynamics based on a test user called "Britta Simon."

For single sign-on to work, Azure AD needs to know what the counterpart user in AppDynamics is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in AppDynamics needs to be established.

In AppDynamics, assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with AppDynamics, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Creating an AppDynamics test user](#creating-an-appdynamics-test-user)** - to have a counterpart of Britta Simon in AppDynamics that is linked to the Azure AD representation of user.
4. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your AppDynamics application.

**To configure Azure AD single sign-on with AppDynamics, perform the following steps:**

1. In the Azure portal, on the **AppDynamics** application integration page, click **Single sign-on**.

	![Configure Single Sign-On][4]

2. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Configure Single Sign-On](./media/active-directory-saas-appdynamics-tutorial/tutorial_appdynamics_samlbase.png)

3. On the **AppDynamics Domain and URLs** section, perform the following steps:

	![Configure Single Sign-On](./media/active-directory-saas-appdynamics-tutorial/tutorial_appdynamics_url.png)

    a. In the **Sign-on URL** textbox, type a URL using the following pattern: `https://<companyname>.saas.appdynamics.com`

    b. In the **Identifier** textbox, type a URL using the following pattern: `https://<companyname>.saas.appdynamics.com/controller`

	> [!NOTE] 
	> These values are not real. Update these values with the actual Sign-On URL and Identifier. Contact [AppDynamics Client support team](https://www.appdynamics.com/support/) to get these values. 
 
4. On the **SAML Signing Certificate** section, click **Certificate (Base64)** and then save the certificate file on your computer.

	![Configure Single Sign-On](./media/active-directory-saas-appdynamics-tutorial/tutorial_appdynamics_certificate.png) 

5. Click **Save** button.

	![Configure Single Sign-On](./media/active-directory-saas-appdynamics-tutorial/tutorial_general_400.png)

6. On the **AppDynamics Configuration** section, click **Configure AppDynamics** to open **Configure sign-on** window. Copy the **Sign-Out URL, and SAML Single Sign-On Service URL** from the **Quick Reference section.**

	![Configure Single Sign-On](./media/active-directory-saas-appdynamics-tutorial/tutorial_appdynamics_configure.png) 

7. In a different web browser window, log in to your AppDynamics company site as an administrator.

8. In the toolbar on the top, click **Settings**, and then click **Administration**.
   
    ![Administration](./media/active-directory-saas-appdynamics-tutorial/ic790216.png "Administration")

9. Click the **Authentication Provider** tab.
   
    ![Authentication Provider](./media/active-directory-saas-appdynamics-tutorial/ic790224.png "Authentication Provider")

10. In the **Authentication Provider** section, perform the following steps:
   
    ![SAML Configuration](./media/active-directory-saas-appdynamics-tutorial/ic790225.png "SAML Configuration")   

    a. As **Authentication Provider**, select **SAML**.

    b. In the **Login URL** textbox, paste the value of **SAML Single Sign-On Service URL** which you have copied from Azure portal.

    c. In the **Logout URL** textbox, paste the value of **Sign-Out URL** which you have copied from Azure portal.
       
    d. Open your base-64 encoded certificate in notepad, copy the content of it into your clipboard, and then paste it to the **Certificate** textbox

    e. Click **Save**.

     ![Save](./media/active-directory-saas-appdynamics-tutorial/ic777673.png "Save")

> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)

### Creating an Azure AD test user
The objective of this section is to create a test user in the Azure portal called Britta Simon.

![Create Azure AD User][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure portal**, on the left navigation pane, click **Azure Active Directory** icon.

	![Creating an Azure AD test user](./media/active-directory-saas-appdynamics-tutorial/create_aaduser_01.png) 

2. To display the list of users, go to **Users and groups** and click **All users**.
	
	![Creating an Azure AD test user](./media/active-directory-saas-appdynamics-tutorial/create_aaduser_02.png) 

3. To open the **User** dialog, click **Add** on the top of the dialog.
 
	![Creating an Azure AD test user](./media/active-directory-saas-appdynamics-tutorial/create_aaduser_03.png) 

4. On the **User** dialog page, perform the following steps:
 
	![Creating an Azure AD test user](./media/active-directory-saas-appdynamics-tutorial/create_aaduser_04.png) 

    a. In the **Name** textbox, type **BrittaSimon**.

    b. In the **User name** textbox, type the **email address** of BrittaSimon.

	c. Select **Show Password** and write down the value of the **Password**.

    d. Click **Create**.
 
### Creating an AppDynamics test user

To enable Azure AD users to log in to AppDynamics, they must be provisioned into AppDynamics. In the case of AppDynamics, provisioning is a manual task.

**To configure user provisioning, perform the following steps:**

1. Log in to your AppDynamics company site as an administrator.

2. Go to **Users**, and then click **+** to open the **Create User** dialog.
   
    ![Users](./media/active-directory-saas-appdynamics-tutorial/ic790229.png "Users")

3. In the **Create User** section, perform the following steps:
   
    ![Create User](./media/active-directory-saas-appdynamics-tutorial/ic790230.png "Create User")
   
    a. Type the **Username**, **Name**, **Email**, **New Password**, **Repeat New Password** of a valid AAD account you want to provision into the related textboxes.

    b. Click **Save**.

    >[!NOTE]
    >You can use any other AppDynamics user account creation tools or APIs provided by AppDynamics to provision Azure AD user accounts.

### Assigning the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to AppDynamics.

![Assign User][200] 

**To assign Britta Simon to AppDynamics, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

2. In the applications list, select **AppDynamics**.

	![Configure Single Sign-On](./media/active-directory-saas-appdynamics-tutorial/tutorial_appdynamics_app.png) 

3. In the menu on the left, click **Users and groups**.

	![Assign User][202] 

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![Assign User][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.
	
### Testing single sign-on

The objective of this section is to test your Azure AD single sign-on configuration using the Access Panel.

When you click the AppDynamics tile in the Access Panel, you should get automatically signed-on to your AppDynamics application.

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)



<!--Image references-->

[1]: ./media/active-directory-saas-appdynamics-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-appdynamics-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-appdynamics-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-appdynamics-tutorial/tutorial_general_04.png

[100]: ./media/active-directory-saas-appdynamics-tutorial/tutorial_general_100.png

[200]: ./media/active-directory-saas-appdynamics-tutorial/tutorial_general_200.png
[201]: ./media/active-directory-saas-appdynamics-tutorial/tutorial_general_201.png
[202]: ./media/active-directory-saas-appdynamics-tutorial/tutorial_general_202.png
[203]: ./media/active-directory-saas-appdynamics-tutorial/tutorial_general_203.png


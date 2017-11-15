---
title: 'Tutorial: Azure Active Directory integration with Canvas Lms | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Canvas LMS.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila

ms.assetid: bfed291c-a33e-410d-b919-5b965a631d45
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/08/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Canvas LMS

In this tutorial, you learn how to integrate Canvas with Azure Active Directory (Azure AD).

Integrating Canvas with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Canvas
- You can enable your users to automatically get signed-on to Canvas (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure portal

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites

To configure Azure AD integration with Canvas, you need the following items:

- An Azure AD subscription
- A Canvas single-sign on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can get a one-month trial [here](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Canvas from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding Canvas from the gallery
To configure the integration of Canvas into Azure AD, you need to add Canvas from the gallery to your list of managed SaaS apps.

**To add Canvas from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![Active Directory][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![Applications][2]
	
3. To add new application, click **New application** button on the top of dialog.

	![Applications][3]

4. In the search box, type **Canvas**.

	![Creating an Azure AD test user](./media/active-directory-saas-canvas-lms-tutorial/tutorial_canvaslms_search.png)

5. In the results panel, select **Canvas**, and then click **Add** button to add the application.

	![Creating an Azure AD test user](./media/active-directory-saas-canvas-lms-tutorial/tutorial_canvaslms_addfromgallery.png)

##  Configuring and testing Azure AD single sign-on
In this section, you configure and test Azure AD single sign-on with Canvas based on a test user called "Britta Simon."

For single sign-on to work, Azure AD needs to know what the counterpart user in Canvas is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Canvas needs to be established.

In Canvas, assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with Canvas, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Creating a Canvas test user](#creating-a-canvas-test-user)** - to have a counterpart of Britta Simon in Canvas that is linked to the Azure AD representation of user.
4. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Canvas application.

**To configure Azure AD single sign-on with Canvas, perform the following steps:**

1. In the Azure portal, on the **Canvas** application integration page, click **Single sign-on**.

	![Configure Single Sign-On][4]

2. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Configure Single Sign-On](./media/active-directory-saas-canvas-lms-tutorial/tutorial_canvaslms_samlbase.png)

3. On the **Canvas Domain and URLs** section, perform the following steps:

	![Configure Single Sign-On](./media/active-directory-saas-canvas-lms-tutorial/tutorial_canvaslms_url.png)

    a. In the **Sign-on URL** textbox, type a URL using the following pattern: `https://<tenant-name>.instructure.com`

    b. In the **Identifier** textbox, type the value using the following pattern: `https://<tenant-name>.instructure.com/saml2`

	> [!NOTE] 
	> These values are not real. Update these values with the actual Sign-On URL and Identifier. Contact [Canvas Client support team](https://community.canvaslms.com/community/help) to get these values. 
 
4. On the **SAML Signing Certificate** section, copy the **THUMBPRINT** value of certificate.

	![Configure Single Sign-On](./media/active-directory-saas-canvas-lms-tutorial/tutorial_canvaslms_certificate.png) 

5. Click **Save** button.

	![Configure Single Sign-On](./media/active-directory-saas-canvas-lms-tutorial/tutorial_general_400.png)

6. On the **Canvas Configuration** section, click **Configure Canvas** to open **Configure sign-on** window. Copy the **Change Password URL, Sign-Out URL, SAML Entity ID, and SAML Single Sign-On Service URL** from the **Quick Reference section.**

	![Configure Single Sign-On](./media/active-directory-saas-canvas-lms-tutorial/tutorial_canvaslms_configure.png) 
 
7. In a different web browser window, log in to your Canvas company site as an administrator.

8. Go to **Courses \> Managed Accounts \> Microsoft**.
   
    ![Canvas](./media/active-directory-saas-canvas-lms-tutorial/IC775990.png "Canvas")

9. In the navigation pane on the left, select **Authentication**, and then click **Add New SAML Config**.
   
    ![Authentication](./media/active-directory-saas-canvas-lms-tutorial/IC775991.png "Authentication")

10. On the Current Integration page, perform the following steps:
   
    ![Current Integration](./media/active-directory-saas-canvas-lms-tutorial/IC775992.png "Current Integration")

    a. In **IdP Entity ID** textbox, paste the value of **SAML Entity ID** which you have copied from Azure portal.

    b. In **Log On URL** textbox, paste the value of **SAML Single Sign-On Service URL** which you have copied from Azure portal .

    c. In **Log Out URL** textbox, paste the value of **Sign-Out URL** which you have copied from Azure portal.

    d. In **Change Password Link** textbox, paste the value of **Change Password URL** which you have copied from Azure portal. 

    e. In **Certificate Fingerprint** textbox, paste the **Thumbprint** value of certificate which you have copied from Azure portal.      
        
    f. From the **Login Attribute** list, select **NameID**.

    g. From the **Identifier Format** list, select **emailAddress**.

    h. Click **Save Authentication Settings**.

> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)

### Creating an Azure AD test user
The objective of this section is to create a test user in the Azure portal called Britta Simon.

![Create Azure AD User][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure portal**, on the left navigation pane, click **Azure Active Directory** icon.

	![Creating an Azure AD test user](./media/active-directory-saas-canvas-lms-tutorial/create_aaduser_01.png) 

2. To display the list of users, go to **Users and groups** and click **All users**.
	
	![Creating an Azure AD test user](./media/active-directory-saas-canvas-lms-tutorial/create_aaduser_02.png) 

3. To open the **User** dialog, click **Add** on the top of the dialog.
 
	![Creating an Azure AD test user](./media/active-directory-saas-canvas-lms-tutorial/create_aaduser_03.png) 

4. On the **User** dialog page, perform the following steps:
 
	![Creating an Azure AD test user](./media/active-directory-saas-canvas-lms-tutorial/create_aaduser_04.png) 

    a. In the **Name** textbox, type **BrittaSimon**.

    b. In the **User name** textbox, type the **email address** of BrittaSimon.

	c. Select **Show Password** and write down the value of the **Password**.

    d. Click **Create**.
 
### Creating a Canvas test user

To enable Azure AD users to log in to Canvas, they must be provisioned into Canvas.

In case of Canvas, user provisioning is a manual task.

**To provision a user account, perform the following steps:**

1. Log in to your **Canvas** tenant.

2. Go to **Courses \> Managed Accounts \> Microsoft**.
   
   ![Canvas](./media/active-directory-saas-canvas-lms-tutorial/IC775990.png "Canvas")

3. Click **Users**.
   
   ![Users](./media/active-directory-saas-canvas-lms-tutorial/IC775995.png "Users")

4. Click **Add New User**.
   
   ![Users](./media/active-directory-saas-canvas-lms-tutorial/IC775996.png "Users")

5. On the Add a New User dialog page, perform the following steps:
   
   ![Add User](./media/active-directory-saas-canvas-lms-tutorial/IC775997.png "Add User")
   
   a. In the **Full Name** textbox, enter the name of user like **BrittaSimon**.

   b. In the **Email** textbox, enter the email of user like **brittasimon@contoso.com**.

   c. In the **Login** textbox, enter the user’s Azure AD email address like **brittasimon@contoso.com**.

   d. Select **Email the user about this account creation**.

   e. Click **Add User**.

>[!NOTE]
>You can use any other Canvas user account creation tools or APIs provided by Canvas to provision AAD user accounts.

### Assigning the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Canvas.

![Assign User][200] 

**To assign Britta Simon to Canvas, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

2. In the applications list, select **Canvas**.

	![Configure Single Sign-On](./media/active-directory-saas-canvas-lms-tutorial/tutorial_canvaslms_app.png) 

3. In the menu on the left, click **Users and groups**.

	![Assign User][202] 

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![Assign User][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.
	
### Testing single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Canvas tile in the Access Panel, you should get automatically signed-on to your Canvas application.
For more information about the Access Panel, see [Introduction to the Access Panel](active-directory-saas-access-panel-introduction.md).

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)

<!--Image references-->

[1]: ./media/active-directory-saas-canvas-lms-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-canvas-lms-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-canvas-lms-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-canvas-lms-tutorial/tutorial_general_04.png

[100]: ./media/active-directory-saas-canvas-lms-tutorial/tutorial_general_100.png

[200]: ./media/active-directory-saas-canvas-lms-tutorial/tutorial_general_200.png
[201]: ./media/active-directory-saas-canvas-lms-tutorial/tutorial_general_201.png
[202]: ./media/active-directory-saas-canvas-lms-tutorial/tutorial_general_202.png
[203]: ./media/active-directory-saas-canvas-lms-tutorial/tutorial_general_203.png


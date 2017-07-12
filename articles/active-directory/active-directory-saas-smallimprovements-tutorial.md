---
title: 'Tutorial: Azure Active Directory integration with Small Improvements | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Small Improvements.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila

ms.assetid: 59c8a112-41e1-4337-9ef3-3d7029780d61
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/12/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Small Improvements

In this tutorial, you learn how to integrate Small Improvements with Azure Active Directory (Azure AD).

Integrating Small Improvements with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Small Improvements
- You can enable your users to automatically get signed-on to Small Improvements (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure portal

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites

To configure Azure AD integration with Small Improvements, you need the following items:

- An Azure AD subscription
- A Small Improvements single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can get a one-month trial here [Trial offer](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Small Improvements from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding Small Improvements from the gallery
To configure the integration of Small Improvements into Azure AD, you need to add Small Improvements from the gallery to your list of managed SaaS apps.

**To add Small Improvements from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![Active Directory][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![Applications][2]
	
3. To add new application, click **New application** button on the top of dialog.

	![Applications][3]

4. In the search box, type **Small Improvements**.

	![Creating an Azure AD test user](./media/active-directory-saas-smallimprovements-tutorial/tutorial_smallimprovements_search.png)

5. In the results panel, select **Small Improvements**, and then click **Add** button to add the application.

	![Creating an Azure AD test user](./media/active-directory-saas-smallimprovements-tutorial/tutorial_smallimprovements_addfromgallery.png)

##  Configuring and testing Azure AD single sign-on
In this section, you configure and test Azure AD single sign-on with Small Improvements based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Small Improvements is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Small Improvements needs to be established.

In Small Improvements, assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with Small Improvements, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Creating a Small Improvements test user](#creating-a-small-improvements-test-user)** - to have a counterpart of Britta Simon in Small Improvements that is linked to the Azure AD representation of user.
4. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Small Improvements application.

**To configure Azure AD single sign-on with Small Improvements, perform the following steps:**

1. In the Azure portal, on the **Small Improvements** application integration page, click **Single sign-on**.

	![Configure Single Sign-On][4]

2. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Configure Single Sign-On](./media/active-directory-saas-smallimprovements-tutorial/tutorial_smallimprovements_samlbase.png)

3. On the **Small Improvements Domain and URLs** section, perform the following steps:

	![Configure Single Sign-On](./media/active-directory-saas-smallimprovements-tutorial/tutorial_smallimprovements_url.png)

    a. In the **Sign-on URL** textbox, type a URL using the following pattern: `https://<subdomain>.small-improvements.com`

	b. In the **Identifier** textbox, type a URL using the following pattern: `https://<subdomain>.small-improvements.com`

	> [!NOTE] 
	> These values are not real. Update these values with the actual Sign-On URL and Identifier. Contact [Small Improvements Client support team](mailto:support@small-improvements.com) to get these values. 
 
4. On the **SAML Signing Certificate** section, click **Certificate (Base64)** and then save the certificate file on your computer.

	![Configure Single Sign-On](./media/active-directory-saas-smallimprovements-tutorial/tutorial_smallimprovements_certificate.png) 

5. Click **Save** button.

	![Configure Single Sign-On](./media/active-directory-saas-smallimprovements-tutorial/tutorial_general_400.png)

6. On the **Small Improvements Configuration** section, click **Configure Small Improvements** to open **Configure sign-on** window. Copy the **SAML Single Sign-On Service URL** from the **Quick Reference section.**

	![Configure Single Sign-On](./media/active-directory-saas-smallimprovements-tutorial/tutorial_smallimprovements_configure.png) 

7. In another browser window, sign on to your Small Improvements company site as an administrator.

8. From the main dashboard page, click **Administration** button on the left.
   
    ![Configure Single Sign-On](./media/active-directory-saas-smallimprovements-tutorial/tutorial_smallimprovements_06.png) 

9. Click the **SAML SSO** button from **Integrations** section.
   
    ![Configure Single Sign-On](./media/active-directory-saas-smallimprovements-tutorial/tutorial_smallimprovements_07.png) 

10. On the SSO Setup page, perform the following steps:
   
    ![Configure Single Sign-On](./media/active-directory-saas-smallimprovements-tutorial/tutorial_smallimprovements_08.png)  

    a. In the **HTTP Endpoint** textbox, paste the value of **SAML Single Sign-On Service URL**, which you have copied from Azure portal.

    b. Open your downloaded certificate in Notepad, copy the content, and then paste it into the **x509 Certificate** textbox. 

    c. If you wish to have SSO and Login form authentication option available for users, then check the **Enable access via login/password too** option.  

    d. Enter the appropriate value to Name the SSO Login button in the **SAML Prompt** textbox.  

    e. Click **Save**.

> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)
> 

### Creating an Azure AD test user
The objective of this section is to create a test user in the Azure portal called Britta Simon.

![Create Azure AD User][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure portal**, on the left navigation pane, click **Azure Active Directory** icon.

	![Creating an Azure AD test user](./media/active-directory-saas-smallimprovements-tutorial/create_aaduser_01.png) 

2. To display the list of users, go to **Users and groups** and click **All users**.
	
	![Creating an Azure AD test user](./media/active-directory-saas-smallimprovements-tutorial/create_aaduser_02.png) 

3. To open the **User** dialog, click **Add** on the top of the dialog.
 
	![Creating an Azure AD test user](./media/active-directory-saas-smallimprovements-tutorial/create_aaduser_03.png) 

4. On the **User** dialog page, perform the following steps:
 
	![Creating an Azure AD test user](./media/active-directory-saas-smallimprovements-tutorial/create_aaduser_04.png) 

    a. In the **Name** textbox, type **BrittaSimon**.

    b. In the **User name** textbox, type the **email address** of BrittaSimon.

	c. Select **Show Password** and write down the value of the **Password**.

    d. Click **Create**.
 
### Creating a Small Improvements test user

To enable Azure AD users to log in to Small Improvements, they must be provisioned into Small Improvements. In the case of Small Improvements, provisioning is a manual task.

**To provision a user account, perform the following steps:**

1. Sign-on to your Small Improvements company site as an administrator.

2. From the Home page, go to the menu on the left, click **Administration**.

3. Click the **User Directory** button from User Management section. 
   
    ![Creating an Azure AD test user](./media/active-directory-saas-smallimprovements-tutorial/tutorial_smallimprovements_10.png) 

4. Click **Add users**.

    ![Creating an Azure AD test user](./media/active-directory-saas-smallimprovements-tutorial/tutorial_smallimprovements_11.png) 

5. On the **Add Users** dialog, perform the following steps: 

    ![Creating an Azure AD test user](./media/active-directory-saas-smallimprovements-tutorial/tutorial_smallimprovements_12.png)
	
	a. Enter the **first name** of user like **Britta**.

    b. Enter the **Last name** of user like **Simon**.

    c. Enter the **Email** of user like **brittasimon@contoso.com**. 

    d. You can also choose to enter the personal message in the **Send notification email** box. If you do not wish to send the notification, then uncheck this checkbox.

    e. Click **Create Users**.

### Assigning the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Small Improvements.

![Assign User][200] 

**To assign Britta Simon to Small Improvements, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

2. In the applications list, select **Small Improvements**.

	![Configure Single Sign-On](./media/active-directory-saas-smallimprovements-tutorial/tutorial_smallimprovements_app.png) 

3. In the menu on the left, click **Users and groups**.

	![Assign User][202] 

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![Assign User][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.
	
### Testing single sign-on

The objective of this section is to test your Azure AD SSO configuration using the Access Panel.  

When you click the Small Improvements tile in the Access Panel, you should get automatically signed-on to your Small Improvements application.

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)



<!--Image references-->

[1]: ./media/active-directory-saas-smallimprovements-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-smallimprovements-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-smallimprovements-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-smallimprovements-tutorial/tutorial_general_04.png

[100]: ./media/active-directory-saas-smallimprovements-tutorial/tutorial_general_100.png

[200]: ./media/active-directory-saas-smallimprovements-tutorial/tutorial_general_200.png
[201]: ./media/active-directory-saas-smallimprovements-tutorial/tutorial_general_201.png
[202]: ./media/active-directory-saas-smallimprovements-tutorial/tutorial_general_202.png
[203]: ./media/active-directory-saas-smallimprovements-tutorial/tutorial_general_203.png


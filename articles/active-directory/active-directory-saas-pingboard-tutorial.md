---
title: 'Tutorial: Azure Active Directory integration with Pingboard | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Pingboard.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila

ms.assetid: 28acce3e-22a0-4a37-8b66-6e518d777350
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/04/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Pingboard

In this tutorial, you learn how to integrate Pingboard with Azure Active Directory (Azure AD).

Integrating Pingboard with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Pingboard
- You can enable your users to automatically get signed-on to Pingboard (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure Management portal

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites

To configure Azure AD integration with Pingboard, you need the following items:

- An Azure AD subscription
- A Pingboard single-sign on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- You should not use your production environment, unless this is necessary.
- If you don't have an Azure AD trial environment, you can get an one-month trial [here](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Pingboard from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding Pingboard from the gallery
To configure the integration of Pingboard into Azure AD, you need to add Pingboard from the gallery to your list of managed SaaS apps.

**To add Pingboard from the gallery, perform the following steps:**

1. In the **[Azure Management Portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![Active Directory][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![Applications][2]
	
3. Click **Add** button on the top of the dialog.

	![Applications][3]

4. In the search box, type **Pingboard**.

	![Creating an Azure AD test user](./media/active-directory-saas-pingboard-tutorial/tutorial_pingboard_search.png)

5. In the results panel, select **Pingboard**, and then click **Add** button to add the application.

	![Creating an Azure AD test user](./media/active-directory-saas-pingboard-tutorial/tutorial_pingboard_addfromgallery.png)

##  Configuring and testing Azure AD single sign-on
In this section, you configure and test Azure AD single sign-on with Pingboard based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Pingboard is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Pingboard needs to be established.

This link relationship is established by assigning the value of the **user name** in Azure AD as the value of the **Username** in Pingboard.

To configure and test Azure AD single sign-on with Pingboard, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Creating a Pingboard test user](#creating-a-pingboard-test-user)** - to have a counterpart of Britta Simon in Pingboard that is linked to the Azure AD representation of her.
4. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure Management portal and configure single sign-on in your Pingboard application.

**To configure Azure AD single sign-on with Pingboard, perform the following steps:**

1. In the Azure Management portal, on the **Pingboard** application integration page, click **Single sign-on**.

	![Configure Single Sign-On][4]

2. On the **Single sign-on** dialog, as **Mode** select **SAML-based Sign-on** to enable single sign on.
 
	![Configure Single Sign-On](./media/active-directory-saas-pingboard-tutorial/tutorial_pingboard_samlbase.png)

3. On the **Pingboard Domain and URLs** section, perform the following steps if you wish to configure the application in **IDP** initiated mode:

	![Configure Single Sign-On](./media/active-directory-saas-pingboard-tutorial/tutorial_pingboard_url.png)

    a. In the **Identifier** textbox, type the value as: `http://<entity-id>.pingboard.com/sp`

	b. In the **Reply URL** textbox, type a URL using the following pattern:
`https://<entity-id>.pingboard.com/auth/saml/consume`

	> [!NOTE] 
	> Please note that these are not the real values. You have to update these values with the actual Identifier and Reply URL. Here we suggest you to use the unique value of string in the Identifier. Contact [Pingboard Client support team](https://support.pingboard.com/) to get these values. 

4. Check **Show advanced URL settings**, if you wish to configure the application in **SP** initiated mode:

	![Configure Single Sign-On](./media/active-directory-saas-pingboard-tutorial/tutorial_pingboard_sp_initiated01.png)

    a. In the **Sign-on URL** textbox, type the value as: `http://<sub-domain>.pingboard.com/sign_in`
	 
5. On the **SAML Signing Certificate** section, click **Metadata XML** and then save the XML file on your computer.

	![Configure Single Sign-On](./media/active-directory-saas-pingboard-tutorial/tutorial_pingboard_certificate.png) 

6. Click **Save** button.

	![Configure Single Sign-On](./media/active-directory-saas-pingboard-tutorial/tutorial_general_400.png)

7. To configure SSO on Pingboard side, open a new browser window and log in to your Pingboard Account. You must be a Pingboard admin to set up single sign on.

8. From the top menu select **Apps > Integrations**

	![Configure Single Sign-On](./media/active-directory-saas-pingboard-tutorial/Pingboard_integration.png)

9.	On the **Integrations** page, find the **"Azure Active Directory"** tile, and click it.

	![Configure Single Sign-On](./media/active-directory-saas-pingboard-tutorial/Pingboard_aad.png)

10. In the modal that follows click **"Configure"**

	![Configure Single Sign-On](./media/active-directory-saas-pingboard-tutorial/Pingboard_configure.png)

11. On the following page, you will notice that "Azure SSO Integration is enabled.". Open the downloaded Metadata XML file in a notepad and paste the content in **IDP Metadata**.

	![Configure Single Sign-On](./media/active-directory-saas-pingboard-tutorial/Pingboard_sso_configure.png)

12. The file will be validated, and if everything is correct, single sign on will now be enabled

### Creating an Azure AD test user
The objective of this section is to create a test user in the Azure Management portal called Britta Simon.

![Create Azure AD User][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure Management portal**, on the left navigation pane, click **Azure Active Directory** icon.

	![Creating an Azure AD test user](./media/active-directory-saas-pingboard-tutorial/create_aaduser_01.png) 

2. Go to **Users and groups** and click **All users** to display the list of users.
	
	![Creating an Azure AD test user](./media/active-directory-saas-pingboard-tutorial/create_aaduser_02.png) 

3. At the top of the dialog click **Add** to open the **User** dialog.
 
	![Creating an Azure AD test user](./media/active-directory-saas-pingboard-tutorial/create_aaduser_03.png) 

4. On the **User** dialog page, perform the following steps:
 
	![Creating an Azure AD test user](./media/active-directory-saas-pingboard-tutorial/create_aaduser_04.png) 

    a. In the **Name** textbox, type **BrittaSimon**.

    b. In the **User name** textbox, type the **email address** of BrittaSimon.

	c. Select **Show Password** and write down the value of the **Password**.

    d. Click **Create**.
 
### Creating a Pingboard test user

In order to enable Azure AD users to log into Pingboard, they must be provisioned into Pingboard.  
In the case of Pingboard, provisioning is a manual task.

**To provision a user accounts, perform the following steps:**

1. Log in to your Pingboard company site as an administrator.

2. Click **“Add Employee”** button on **Directory** page.

    ![Add Employee](./media/active-directory-saas-pingboard-tutorial/create_testuser_add.png)

3. On the **“Add Employee”** dialog page, perform the following steps.

	![Invite People](./media/active-directory-saas-pingboard-tutorial/create_testuser_name.png)

	a. In the **Full Name** textbox, type the full name of Britta Simon.

	b. In the **Email** textbox, type the email address of Britta Simon account.

	c. In the **Job Title** textbox, type the job title of Britta Simon.

	d. In the **Location** dropdown, select the location  of Britta Simon.
	
	e. Click **Add**.	

4. A confirmation screen will come up to confirm the addition of user.
	
	![confirm](./media/active-directory-saas-pingboard-tutorial/create_testuser_confirm.png)
		
	> [!NOTE]
    > The Azure Active Directory account holder will receive an email and follow a link to confirm their account before it becomes active.

### Assigning the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting her access to Pingboard.

![Assign User][200] 

**To assign Britta Simon to Pingboard, perform the following steps:**

1. In the Azure Management portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

2. In the applications list, select **Pingboard**.

	![Configure Single Sign-On](./media/active-directory-saas-pingboard-tutorial/tutorial_pingboard_app.png) 

3. In the menu on the left, click **Users and groups**.

	![Assign User][202] 

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![Assign User][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.
	
### Testing single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Pingboard tile in the Access Panel, you should get automatically signed-on to your Pingboard application.

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)



<!--Image references-->

[1]: ./media/active-directory-saas-pingboard-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-pingboard-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-pingboard-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-pingboard-tutorial/tutorial_general_04.png

[100]: ./media/active-directory-saas-pingboard-tutorial/tutorial_general_100.png

[200]: ./media/active-directory-saas-pingboard-tutorial/tutorial_general_200.png
[201]: ./media/active-directory-saas-pingboard-tutorial/tutorial_general_201.png
[202]: ./media/active-directory-saas-pingboard-tutorial/tutorial_general_202.png
[203]: ./media/active-directory-saas-pingboard-tutorial/tutorial_general_203.png

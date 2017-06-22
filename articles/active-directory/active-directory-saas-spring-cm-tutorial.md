---
title: 'Tutorial: Azure Active Directory integration with SpringCM | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and SpringCM.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila

ms.assetid: 4a42f797-ac58-4aca-a8e6-53bfe5529083
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/23/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with SpringCM

In this tutorial, you learn how to integrate SpringCM with Azure Active Directory (Azure AD).

Integrating SpringCM with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to SpringCM
- You can enable your users to automatically get signed-on to SpringCM (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure portal

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites

To configure Azure AD integration with SpringCM, you need the following items:

- An Azure AD subscription
- A SpringCM single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can get a one-month trial [here](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding SpringCM from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding SpringCM from the gallery
To configure the integration of SpringCM into Azure AD, you need to add SpringCM from the gallery to your list of managed SaaS apps.

**To add SpringCM from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![Active Directory][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![Applications][2]
	
3. To add new application, click **New application** button on the top of dialog.

	![Applications][3]

4. In the search box, type **SpringCM**.

	![Creating an Azure AD test user](./media/active-directory-saas-spring-cm-tutorial/tutorial_springcm_search.png)

5. In the results panel, select **SpringCM**, and then click **Add** button to add the application.

	![Creating an Azure AD test user](./media/active-directory-saas-spring-cm-tutorial/tutorial_springcm_addfromgallery.png)

##  Configuring and testing Azure AD single sign-on
In this section, you configure and test Azure AD single sign-on with SpringCM based on a test user called "Britta Simon."

For single sign-on to work, Azure AD needs to know what the counterpart user in SpringCM is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in SpringCM needs to be established.

In SpringCM, assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with SpringCM, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Creating a SpringCM test user](#creating-a-springcm-test-user)** - to have a counterpart of Britta Simon in SpringCM that is linked to the Azure AD representation of user.
4. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your SpringCM application.

**To configure Azure AD single sign-on with SpringCM, perform the following steps:**

1. In the Azure portal, on the **SpringCM** application integration page, click **Single sign-on**.

	![Configure Single Sign-On][4]

2. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Configure Single Sign-On](./media/active-directory-saas-spring-cm-tutorial/tutorial_springcm_samlbase.png)

3. On the **SpringCM Domain and URLs** section, perform the following steps:

	![Configure Single Sign-On](./media/active-directory-saas-spring-cm-tutorial/tutorial_springcm_url.png)

    In the **Sign-on URL** textbox, type a URL using the following pattern: `https://na11.springcm.com/atlas/SSO/SSOEndpoint.ashx?aid=<identifier>`

	> [!NOTE] 
	> This value is not real. Update this value with the actual Sign-On URL. Contact [SpringCM Client support team](https://knowledge.springcm.com/support) to get this value. 
 
4. On the **SAML Signing Certificate** section, click **Certificate(Raw)** and then save the certificate file on your computer.

	![Configure Single Sign-On](./media/active-directory-saas-spring-cm-tutorial/tutorial_springcm_certificate.png) 

5. Click **Save** button.

	![Configure Single Sign-On](./media/active-directory-saas-spring-cm-tutorial/tutorial_general_400.png)

6. On the **SpringCM Configuration** section, click **Configure SpringCM** to open **Configure sign-on** window. Copy the **SAML Entity ID, and SAML Single Sign-On Service URL** from the **Quick Reference section.**

	![Configure Single Sign-On](./media/active-directory-saas-spring-cm-tutorial/tutorial_springcm_configure.png) 	

7. In a different web browser window, sign on to your **SpringCM** company site as administrator.

8. In the menu on the top, click **GO TO**, click **Preferences**, and then, in the **Account Preferences** section, click **SAML SSO**.
   
    ![SAML SSO](./media/active-directory-saas-spring-cm-tutorial/ic797051.png "SAML SSO")

9. In the Identity Provider Configuration section, perform the following steps:
   
    ![Identity Provider Configuration](./media/active-directory-saas-spring-cm-tutorial/ic797052.png "Identity Provider Configuration")
	
	a. To upload your downloaded Azure Active Directory certificate, click **Select Issuer Certificate** or **Change Issuer Certificate**.
  	
	b. Paste **SAML Entity ID** value, which you have copied from Azure portal into the **Issuer** textbox.
  	
	c. Paste **SAML Single Sign-On Service URL** value, which you have copied from the Azure portal into the **Service Provider (SP) Initiated Endpoint** textbox.
	    	
	d. Select **SAML Enabled** as **Enable**.

	e. Click **Save**.
 
> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)
> 

### Creating an Azure AD test user
The objective of this section is to create a test user in the Azure portal called Britta Simon.

![Create Azure AD User][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure portal**, on the left navigation pane, click **Azure Active Directory** icon.

	![Creating an Azure AD test user](./media/active-directory-saas-spring-cm-tutorial/create_aaduser_01.png) 

2. To display the list of users, go to **Users and groups** and click **All users**.
	
	![Creating an Azure AD test user](./media/active-directory-saas-spring-cm-tutorial/create_aaduser_02.png) 

3. To open the **User** dialog, click **Add** on the top of the dialog.
 
	![Creating an Azure AD test user](./media/active-directory-saas-spring-cm-tutorial/create_aaduser_03.png) 

4. On the **User** dialog page, perform the following steps:
 
	![Creating an Azure AD test user](./media/active-directory-saas-spring-cm-tutorial/create_aaduser_04.png) 

    a. In the **Name** textbox, type **BrittaSimon**.

    b. In the **User name** textbox, type the **email address** of BrittaSimon.

	c. Select **Show Password** and write down the value of the **Password**.

    d. Click **Create**.
 
### Creating a SpringCM test user

To enable Azure Active Directory users to log in to SpringCM, they must be provisioned into SpringCM. In the case of SpringCM, provisioning is a manual task.

>[!NOTE]
>For more information, see [Create and Edit a SpringCM User](http://knowledge.springcm.com/create-and-edit-a-springcm-user). 

**To provision a user account to SpringCM, perform the following steps:**

1. Log in to your **SpringCM** company site as administrator.

2. Click **GOTO**, and then click **ADDRESS BOOK**.
   
    ![Create User](./media/active-directory-saas-spring-cm-tutorial/ic797054.png "Create User")

3. Click **Create User**.

4. Select a **User Role**.

5. Select **Send Activation Email**.

6. Type the first name, last name, and email address of a valid Azure Active Directory user account you want to provision into the related textboxes.

7. Add the user to a **Security group**.

8. Click **Save**.

  >[!NOTE]
  >You can use any other SpringCM user account creation tools or APIs provided by SpringCM to provision AAD user accounts.  
  > 

### Assigning the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to SpringCM.

![Assign User][200] 

**To assign Britta Simon to SpringCM, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

2. In the applications list, select **SpringCM**.

	![Configure Single Sign-On](./media/active-directory-saas-spring-cm-tutorial/tutorial_springcm_app.png) 

3. In the menu on the left, click **Users and groups**.

	![Assign User][202] 

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![Assign User][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.
	
### Testing single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.
 
When you click the SpringCM tile in the Access Panel, you should get automatically signed-on to your SpringCM application.

For more information about the Access Panel, see [Introduction to the Access Panel](active-directory-saas-access-panel-introduction.md). 

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)

<!--Image references-->

[1]: ./media/active-directory-saas-spring-cm-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-spring-cm-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-spring-cm-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-spring-cm-tutorial/tutorial_general_04.png

[100]: ./media/active-directory-saas-spring-cm-tutorial/tutorial_general_100.png

[200]: ./media/active-directory-saas-spring-cm-tutorial/tutorial_general_200.png
[201]: ./media/active-directory-saas-spring-cm-tutorial/tutorial_general_201.png
[202]: ./media/active-directory-saas-spring-cm-tutorial/tutorial_general_202.png
[203]: ./media/active-directory-saas-spring-cm-tutorial/tutorial_general_203.png


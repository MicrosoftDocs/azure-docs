---
title: 'Tutorial: Azure Active Directory integration with Halosys | Microsoft Docs'
description: Learn how to use Halosys with Azure Active Directory to enable single sign-on, automated provisioning, and more!
services: active-directory
author: jeevansd
documentationcenter: na
manager: mtillman

ms.assetid: 42a0eb7c-5cb7-44a9-b00b-b0e7df4b63e8
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 01/03/2018
ms.author: jeedes
ms.reviewer: jeedes
---
# Tutorial: Azure Active Directory integration with Halosys

In this tutorial, you learn how to integrate Halosys with Azure Active Directory (Azure AD).

Integrating Halosys with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Halosys
- You can enable your users to automatically get signed-on to Halosys (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure portal

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites

To configure Azure AD integration with Halosys, you need the following items:

- An Azure AD subscription
- A Halosys single-sign on enabled subscription


> [!NOTE] 
> To test the steps in this tutorial, we do not recommend using a production environment.


To test the steps in this tutorial, you should follow these recommendations:

- You should not use your production environment, unless this is necessary.
- If you don't have an Azure AD trial environment, you can get a one-month trial [here](https://azure.microsoft.com/pricing/free-trial/).


## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment.

The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Halosys from the gallery
2. Configuring and testing Azure AD single sign-on


## Adding Halosys from the gallery
To configure the integration of Halosys into Azure AD, you need to add Halosys from the gallery to your list of managed SaaS apps.

**To add Halosys from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![Active Directory][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![Applications][2]
	
3. To add new application, click **New application** button on the top of dialog.

	![Applications][3]

6. In the search box, type **Halosys**.

	![Creating an Azure AD test user](./media/active-directory-saas-Halosys-tutorial/tutorial_Halosys_01.png)
	
7. In the results pane, select **Halosys**, and then click **Complete** to add the application.

	![Creating an Azure AD test user](./media/active-directory-saas-Halosys-tutorial/tutorial_Halosys_011.png)

##  Configuring and testing Azure AD single sign-on
In this section, you configure and test Azure AD single sign-on with Halosys based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Halosys is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Halosys needs to be established.

This link relationship is established by assigning the value of the **user name** in Azure AD as the value of the **Username** in Halosys.

To configure and test Azure AD single sign-on with Halosys, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Creating a Halosys test user](#creating-a-halosys-test-user)** - to have a counterpart of Britta Simon in Halosys that is linked to the Azure AD representation of her.
4. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the portal and configure single sign-on in your Halosys application.


**To configure Azure AD single sign-on with Halosys, perform the following steps:**

1. In the Azure portal, on the **SCC LifeCycle** application integration page, click **Single sign-on**.

	![Configure Single Sign-On][4]

2. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Configure Single Sign-On](./media/active-directory-saas-scclifecycle-tutorial/tutorial_scclifecycle_samlbase.png)

3. On the **Halosys Domain and URLs** section, perform the following steps:
    1. In the **Sign-on URL** textbox, type a URL using the following pattern:
	`https://<sub-domain>.hs.com/ic7/welcome/customer/PICTtest.aspx`

	2. In the **Identifier** textbox, type a URL using the following pattern:
	| |
	|--|--|
	| `https://bs1.hs.com/<entity>`|
	| `https://lifecycle.hs.com/<entity>`|
	
	> [!NOTE] 
	> These values are not real. Update these values with the actual Sign-On URL and Identifier. Contact [SCC LifeCycle Client support team](mailto:lifecycle.support@scc.com) to get these values. 
		 
4. On the **SAML Signing Certificate** section, select **Metadata XML** under **Download**, and then save the metadata file on your computer.
   
5. To get single sign-on configured for your application, contact Halosys support team and provide them with the following:

  * The downloaded **metadata file**
  * The **SAML SSO URL**
	

  >[!NOTE]
  >Single sign-on has to be enabled by the Halosys support team.


### Creating an Azure AD test user
In this section, you create a test user in the portal called Britta Simon.


![Create Azure AD User][20]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure portal**, on the left navigation pane, click **Azure Active Directory** icon.

	![Creating an Azure AD test user](./media/active-directory-saas-scclifecycle-tutorial/create_aaduser_01.png) 

2. To display the list of users, go to **Users and groups** and click **All users**.
	
	![Creating an Azure AD test user](./media/active-directory-saas-scclifecycle-tutorial/create_aaduser_02.png) 

3. To open the **User** dialog, click **Add** on the top of the dialog.
 
	![Creating an Azure AD test user](./media/active-directory-saas-scclifecycle-tutorial/create_aaduser_03.png) 

4. On the **User** dialog page, perform the following steps:
 
	![Creating an Azure AD test user](./media/active-directory-saas-scclifecycle-tutorial/create_aaduser_04.png) 

    a. In the **Name** textbox, type **BrittaSimon**.

    b. In the **User name** textbox, type the **email address** of BrittaSimon.

	c. Select **Show Password** and write down the value of the **Password**.

    d. Click **Create**.


### Creating a Halosys test user

In this section, you create a user called Britta Simon in Halosys. Please work with Halosys support team to add the users in the Halosys platform.


### Assigning the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting her access to Halosys.

![Assign User][200] 

**To assign Britta Simon to Halosys, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications.**

	![Assign User][201] 

2. In the applications list, select **Halosys**.

3. In the menu on the left, click **Users and groups**.

	![Assign User][202] 

4. Click the **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![Assign User][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on the **Users and groups** dialog.

7. Click **Assign** button on the **Add Assignment** dialog.

### Testing single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Halosys tile in the Access Panel, you should get automatically signed-on to your Halosys application. For more information about the Access Panel, see [Introduction to the Access Panel](active-directory-saas-access-panel-introduction.md).


## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)


<!--Image references-->

[1]: ./media/active-directory-saas-Halosys-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-Halosys-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-Halosys-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-Halosys-tutorial/tutorial_general_04.png

[6]: ./media/active-directory-saas-Halosys-tutorial/tutorial_general_05.png
[10]: ./media/active-directory-saas-Halosys-tutorial/tutorial_general_06.png
[11]: ./media/active-directory-saas-Halosys-tutorial/tutorial_general_07.png
[20]: ./media/active-directory-saas-Halosys-tutorial/tutorial_general_100.png

[200]: ./media/active-directory-saas-Halosys-tutorial/tutorial_general_200.png
[201]: ./media/active-directory-saas-Halosys-tutorial/tutorial_general_201.png
[203]: ./media/active-directory-saas-Halosys-tutorial/tutorial_general_203.png
[204]: ./media/active-directory-saas-Halosys-tutorial/tutorial_general_204.png
[205]: ./media/active-directory-saas-Halosys-tutorial/tutorial_general_205.png
 
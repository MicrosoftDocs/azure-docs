---
title: 'Tutorial: Azure Active Directory integration with Datahug | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Datahug.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila

ms.assetid: 5c0dc1ea-7ff4-4554-b60b-0f2fa9f5abaa
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/18/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Datahug

In this tutorial, you learn how to integrate Datahug with Azure Active Directory (Azure AD).

Integrating Datahug with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Datahug
- You can enable your users to automatically get signed-on to Datahug (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure portal

If you want to know more details about SaaS app integration with Azure AD, see. [What is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites

To configure Azure AD integration with Datahug, you need the following items:

- An Azure AD subscription
- A Datahug single-sign on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can get a one-month trial [here](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Datahug from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding Datahug from the gallery
To configure the integration of Datahug into Azure AD, you need to add Datahug from the gallery to your list of managed SaaS apps.

**To add Datahug from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![Active Directory][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![Applications][2]
	
3. To add new application, click **New application** button on the top of dialog.

	![Applications][3]

4. In the search box, type **Datahug**.

	![Creating an Azure AD test user](./media/active-directory-saas-datahug-tutorial/tutorial_datahug_search.png)

5. In the results panel, select **Datahug**, and then click **Add** button to add the application.

	![Creating an Azure AD test user](./media/active-directory-saas-datahug-tutorial/tutorial_datahug_addfromgallery.png)

##  Configuring and testing Azure AD single sign-on
In this section, you configure and test Azure AD single sign-on with Datahug based on a test user called "Britta Simon."

For single sign-on to work, Azure AD needs to know what the counterpart user in Datahug is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Datahug needs to be established.

This link relationship is established by assigning the value of the **user name** in Azure AD as the value of the **Username** in Datahug.

To configure and test Azure AD single sign-on with Datahug, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Creating a Datahug test user](#creating-a-datahug-test-user)** - to have a counterpart of Britta Simon in Datahug that is linked to the Azure AD representation of user.
4. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Datahug application.

**To configure Azure AD single sign-on with Datahug, perform the following steps:**

1. In the Azure portal, on the **Datahug** application integration page, click **Single sign-on**.

	![Configure Single Sign-On][4]

2. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Configure Single Sign-On](./media/active-directory-saas-datahug-tutorial/tutorial_datahug_samlbase.png)

3. On the **Datahug Domain and URLs** section, If you wish to configure the application in **IDP** initiated mode:

	![Configure Single Sign-On](./media/active-directory-saas-datahug-tutorial/tutorial_datahug_ur1.png)

    a. In the **Identifier** textbox, type a URL using the following pattern: `https://apps.datahug.com/identity/<uniqueID>`

	b. In the **Reply URL** textbox, type a URL using the following pattern: `https://apps.datahug.com/identity/<uniqueID>/acs`

4. Check **Show advanced URL settings**. If you wish to configure the application in **SP** initiated mode:

	![Configure Single Sign-On](./media/active-directory-saas-datahug-tutorial/tutorial_datahug_url2.png)

    In the **Sign-on URL** textbox, type a URL as: `https://apps.datahug.com/`
	 
	> [!NOTE] 
	> These values are not the real. Update these values with the actual Identifier and Reply URL. Here we suggest you to use the unique value of string in the Identifier and Reply URL. Contact [Datahug Client support team](http://datahug.com/about/contact-us/) to get these values. 

5. On the **SAML Signing Certificate** section, click **Metadata XML** and then save the metadata file on your computer.

	![Configure Single Sign-On](./media/active-directory-saas-datahug-tutorial/tutorial_datahug_certificate.png) 

6.  Check **“Show advanced certificate signing settings”** and perform the following steps:

	![Configure Single Sign-On](./media/active-directory-saas-datahug-tutorial/tutorial_datahug_cert.png)

	a. In **Signing Option**, select **Sign SAML assertion**.
	
	b. In **Signing algorithm**, select **SHA1**.
 
7. Click **Save** button.

	![Configure Single Sign-On](./media/active-directory-saas-datahug-tutorial/tutorial_general_400.png)
	
8. On the **Datahug Configuration** section, click **Configure Datahug** to open **Configure sign-on** window. Copy the **SAML Entity ID** and **SAML Single Sign-On Service URL** from the **Quick Reference section.**

	![Configure Single Sign-On](./media/active-directory-saas-datahug-tutorial/tutorial_datahug_configure.png) 

9. To configure single sign-on on **Datahug** side, you need to send the downloaded **Metadata XML**, **SAML Entity ID** and **SAML Single Sign-On Service URL** to [Datahug support](http://datahug.com/about/contact-us/). They set this application up to have the SAML SSO connection set properly on both sides.

> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)
> 

### Creating an Azure AD test user
The objective of this section is to create a test user in the Azure portal called Britta Simon.

![Create Azure AD User][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure portal**, on the left navigation pane, click **Azure Active Directory** icon.

	![Creating an Azure AD test user](./media/active-directory-saas-datahug-tutorial/create_aaduser_01.png) 

2. To display the list of users, go to **Users and groups** and click **All users**.
	
	![Creating an Azure AD test user](./media/active-directory-saas-datahug-tutorial/create_aaduser_02.png) 

3. To open the **User** dialog, click **Add** on the top of the dialog.
 
	![Creating an Azure AD test user](./media/active-directory-saas-datahug-tutorial/create_aaduser_03.png) 

4. On the **User** dialog page, perform the following steps:
 
	![Creating an Azure AD test user](./media/active-directory-saas-datahug-tutorial/create_aaduser_04.png) 

    a. In the **Name** textbox, type **BrittaSimon**.

    b. In the **User name** textbox, type the **email address** of BrittaSimon.

	c. Select **Show Password** and write down the value of the **Password**.

    d. Click **Create**.
 
### Creating a Datahug test user

To enable Azure AD users to log in to Datahug, they must be provisioned into Datahug.  
When Datahug, provisioning is a manual task.

**To provision a user account, perform the following steps:**

1. Log in to your Datahug company site as an administrator.

2. Hover over the **cog** in the top right-hand corner and click **Settings**
   
   ![Add Employee](./media/active-directory-saas-datahug-tutorial/1.png)

3. Choose **People** and click the **Add Users** tab

	![Add Employee](./media/active-directory-saas-datahug-tutorial/2.png)

4. Type the email of the person you would like to create an account for and click **Add**.

	![Add Employee](./media/active-directory-saas-datahug-tutorial/3.png)

    > [!NOTE] 
	> You can send registration mail to user by selecting **Send welcome email** checkbox.	
	> If you are creating an account for Salesforce do not send the welcome email.

### Assigning the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Datahug.

![Assign User][200] 

**To assign Britta Simon to Datahug, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

2. In the applications list, select **Datahug**.

	![Configure Single Sign-On](./media/active-directory-saas-datahug-tutorial/tutorial_datahug_app.png) 

3. In the menu on the left, click **Users and groups**.

	![Assign User][202] 

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![Assign User][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.
	
### Testing single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.
When you click the Datahug tile in the Access Panel, you should get automatically signed-on to your Datahug application. For more information about the Access Panel, see [Introduction to the Access Panel](https://msdn.microsoft.com/library/dn308586). 

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)



<!--Image references-->

[1]: ./media/active-directory-saas-datahug-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-datahug-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-datahug-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-datahug-tutorial/tutorial_general_04.png

[100]: ./media/active-directory-saas-datahug-tutorial/tutorial_general_100.png

[200]: ./media/active-directory-saas-datahug-tutorial/tutorial_general_200.png
[201]: ./media/active-directory-saas-datahug-tutorial/tutorial_general_201.png
[202]: ./media/active-directory-saas-datahug-tutorial/tutorial_general_202.png
[203]: ./media/active-directory-saas-datahug-tutorial/tutorial_general_203.png


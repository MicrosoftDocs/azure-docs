---
title: 'Tutorial: Azure Active Directory integration with Rightscale | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Rightscale.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila

ms.assetid: 3a8d376d-95fb-4dd7-832a-4fdd4dd7c87c
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/03/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Rightscale

In this tutorial, you learn how to integrate Rightscale with Azure Active Directory (Azure AD).

Integrating Rightscale with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Rightscale
- You can enable your users to automatically get signed-on to Rightscale (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure portal

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites

To configure Azure AD integration with Rightscale, you need the following items:

- An Azure AD subscription
- A Rightscale single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can get a one-month trial [here](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Rightscale from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding Rightscale from the gallery
To configure the integration of Rightscale into Azure AD, you need to add Rightscale from the gallery to your list of managed SaaS apps.

**To add Rightscale from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![Active Directory][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![Applications][2]
	
3. To add new application, click **New application** button on the top of dialog.

	![Applications][3]

4. In the search box, type **Rightscale**.

	![Creating an Azure AD test user](./media/active-directory-saas-rightscale-tutorial/tutorial_rightscale_search.png)

5. In the results panel, select **Rightscale**, and then click **Add** button to add the application.

	![Creating an Azure AD test user](./media/active-directory-saas-rightscale-tutorial/tutorial_rightscale_addfromgallery.png)

##  Configuring and testing Azure AD single sign-on
In this section, you configure and test Azure AD single sign-on with Rightscale based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Rightscale is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Rightscale needs to be established.

In Rightscale, assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with Rightscale, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Creating a Rightscale test user](#creating-a-rightscale-test-user)** - to have a counterpart of Britta Simon in Rightscale that is linked to the Azure AD representation of user.
4. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Rightscale application.

**To configure Azure AD single sign-on with Rightscale, perform the following steps:**

1. In the Azure portal, on the **Rightscale** application integration page, click **Single sign-on**.

	![Configure Single Sign-On][4]

2. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Configure Single Sign-On](./media/active-directory-saas-rightscale-tutorial/tutorial_rightscale_samlbase.png)

3. On the **Rightscale Domain and URLs** section, the user does not have to perform any steps as the app is already pre-integrated with Azure:

	![Configure Single Sign-On](./media/active-directory-saas-rightscale-tutorial/tutorial_rightscale_url.png)

4. On the **Rightscale Domain and URLs** section, if you wish to configure the application in **SP initiated mode**, perform the following steps:
	
	![Configure Single Sign-On](./media/active-directory-saas-rightscale-tutorial/tutorial_rightscale_url1.png)

	a. Click on the **Show advanced URL settings**.

	b. In the **Sign On URL** textbox, type the URL: `https://login.rightscale.com/`

5. On the **SAML Signing Certificate** section, click **Certificate (Base64)** and then save the certificate file on your computer.

	![Configure Single Sign-On](./media/active-directory-saas-rightscale-tutorial/tutorial_rightscale_certificate.png) 

6. Click **Save** button.

	![Configure Single Sign-On](./media/active-directory-saas-rightscale-tutorial/tutorial_general_400.png)

7. On the **Rightscale Configuration** section, click **Configure Rightscale** to open **Configure sign-on** window. Copy the **SAML Entity ID, and SAML Single Sign-On Service URL** from the **Quick Reference section.**

	![Configure Single Sign-On](./media/active-directory-saas-rightscale-tutorial/tutorial_rightscale_configure.png) 

8. To get SSO configured for your application, you need to sign-on to your RightScale tenant as an administrator.

    a. In the menu on the top, click the **Settings** tab and select **Single Sign-On**.
   
    ![Configure Single Sign-On](./media/active-directory-saas-rightscale-tutorial/tutorial_rightscale_001.png) 

    b. Click the "**new**" button to add **Your SAML Identity Providers**.
   
    ![Configure Single Sign-On](./media/active-directory-saas-rightscale-tutorial/tutorial_rightscale_002.png) 
 
    c. In the textbox of **Display Name**, input your company name.
   
    ![Configure Single Sign-On](./media/active-directory-saas-rightscale-tutorial/tutorial_rightscale_003.png)
 
    d. Select **Allow RightScale-initiated SSO using a discovery hint** and input your **domain name** in the below textbox.
   
    ![Configure Single Sign-On](./media/active-directory-saas-rightscale-tutorial/tutorial_rightscale_004.png)

    e. Paste the value of **SAML Single Sign-On Service URL** which you have copied from Azure portal into **SAML SSO Endpoint** in RightScale.
   
    ![Configure Single Sign-On](./media/active-directory-saas-rightscale-tutorial/tutorial_rightscale_006.png)

    f. Paste the value of **SAML Entity ID** which you have copied from Azure portal into **SAML EntityID** in RightScale.
   
    ![Configure Single Sign-On](./media/active-directory-saas-rightscale-tutorial/tutorial_rightscale_008.png)

    g. Click **Browser** button to upload the certificate which you downloaded from Azure portal.
   
    ![Configure Single Sign-On](./media/active-directory-saas-rightscale-tutorial/tutorial_rightscale_009.png)

    h. Click **Save**.

> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)
> 

### Creating an Azure AD test user
The objective of this section is to create a test user in the Azure portal called Britta Simon.

![Create Azure AD User][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure portal**, on the left navigation pane, click **Azure Active Directory** icon.

	![Creating an Azure AD test user](./media/active-directory-saas-rightscale-tutorial/create_aaduser_01.png) 

2. To display the list of users, go to **Users and groups** and click **All users**.
	
	![Creating an Azure AD test user](./media/active-directory-saas-rightscale-tutorial/create_aaduser_02.png) 

3. To open the **User** dialog, click **Add** on the top of the dialog.
 
	![Creating an Azure AD test user](./media/active-directory-saas-rightscale-tutorial/create_aaduser_03.png) 

4. On the **User** dialog page, perform the following steps:
 
	![Creating an Azure AD test user](./media/active-directory-saas-rightscale-tutorial/create_aaduser_04.png) 

    a. In the **Name** textbox, type **BrittaSimon**.

    b. In the **User name** textbox, type the **email address** of BrittaSimon.

	c. Select **Show Password** and write down the value of the **Password**.

    d. Click **Create**.
 
### Creating a Rightscale test user

In this section, you create a user called Britta Simon in RightScale. Work with [Rightscale Client support team](mailto:support@rightscale.com) to add the users in the RightScale platform.

### Assigning the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Rightscale.

![Assign User][200] 

**To assign Britta Simon to Rightscale, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

2. In the applications list, select **Rightscale**.

	![Configure Single Sign-On](./media/active-directory-saas-rightscale-tutorial/tutorial_rightscale_app.png) 

3. In the menu on the left, click **Users and groups**.

	![Assign User][202] 

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![Assign User][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.
	
### Testing single sign-on

The objective of this section is to test your Azure AD SSO configuration using the Access Panel.  

When you click the RightScale tile in the Access Panel, you should get automatically signed-on to your RightScale application.

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)



<!--Image references-->

[1]: ./media/active-directory-saas-rightscale-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-rightscale-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-rightscale-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-rightscale-tutorial/tutorial_general_04.png

[100]: ./media/active-directory-saas-rightscale-tutorial/tutorial_general_100.png

[200]: ./media/active-directory-saas-rightscale-tutorial/tutorial_general_200.png
[201]: ./media/active-directory-saas-rightscale-tutorial/tutorial_general_201.png
[202]: ./media/active-directory-saas-rightscale-tutorial/tutorial_general_202.png
[203]: ./media/active-directory-saas-rightscale-tutorial/tutorial_general_203.png


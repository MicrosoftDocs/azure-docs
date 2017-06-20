---
title: 'Tutorial: Azure Active Directory integration with Syncplicity | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Syncplicity.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila

ms.assetid: 896a3211-f368-46d7-95b8-e4768c23be08
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/20/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Syncplicity

In this tutorial, you learn how to integrate Syncplicity with Azure Active Directory (Azure AD).

Integrating Syncplicity with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Syncplicity
- You can enable your users to automatically get signed-on to Syncplicity (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure portal

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites

To configure Azure AD integration with Syncplicity, you need the following items:

- An Azure AD subscription
- A Syncplicity single-sign on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can get a one-month trial [here](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Syncplicity from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding Syncplicity from the gallery
To configure the integration of Syncplicity into Azure AD, you need to add Syncplicity from the gallery to your list of managed SaaS apps.

**To add Syncplicity from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![Active Directory][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![Applications][2]
	
3. To add new application, click **New application** button on the top of dialog.

	![Applications][3]

4. In the search box, type **Syncplicity**.

	![Creating an Azure AD test user](./media/active-directory-saas-syncplicity-tutorial/tutorial_syncplicity_search.png)

5. In the results panel, select **Syncplicity**, and then click **Add** button to add the application.

	![Creating an Azure AD test user](./media/active-directory-saas-syncplicity-tutorial/tutorial_syncplicity_addfromgallery.png)

##  Configuring and testing Azure AD single sign-on
In this section, you configure and test Azure AD single sign-on with Syncplicity based on a test user called "Britta Simon."

For single sign-on to work, Azure AD needs to know what the counterpart user in Syncplicity is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Syncplicity needs to be established.

In Syncplicity, assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with Syncplicity, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Creating a Syncplicity test user](#creating-a-syncplicity-test-user)** - to have a counterpart of Britta Simon in Syncplicity that is linked to the Azure AD representation of user.
4. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Syncplicity application.

**To configure Azure AD single sign-on with Syncplicity, perform the following steps:**

1. In the Azure portal, on the **Syncplicity** application integration page, click **Single sign-on**.

	![Configure Single Sign-On][4]

2. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Configure Single Sign-On](./media/active-directory-saas-syncplicity-tutorial/tutorial_syncplicity_samlbase.png)

3. On the **Syncplicity Domain and URLs** section, perform the following steps:

	![Configure Single Sign-On](./media/active-directory-saas-syncplicity-tutorial/tutorial_syncplicity_url.png)

    a. In the **Sign-on URL** textbox, type a URL using the following pattern: `https://<companyname>.syncplicity.com`

    b. In the **Identifier** textbox, type a URL using the following pattern: `https://<companyname>.syncplicity.com/sp`

	> [!NOTE] 
	> These values are not real. Update these values with the actual Sign-On URL and Identifier. Contact [Syncplicity Client support team](https://www.syncplicity.com/contact-us) to get these values. 
 

4. On the **SAML Signing Certificate** section, click **Certificate (Base64)** and then save the certificate file on your computer.

	![Configure Single Sign-On](./media/active-directory-saas-syncplicity-tutorial/tutorial_syncplicity_certificate.png) 

  
5. Click **Save** button.

	![Configure Single Sign-On](./media/active-directory-saas-syncplicity-tutorial/tutorial_general_400.png)

6. On the **Syncplicity Configuration** section, click **Configure Syncplicity** to open **Configure sign-on** window. Copy the **Sign-Out URL, SAML Entity ID, and SAML Single Sign-On Service URL** from the **Quick Reference section.**

	![Configure Single Sign-On](./media/active-directory-saas-syncplicity-tutorial/tutorial_syncplicity_configure.png) 

7. Sign in to your **Syncplicity** tenant.

8. In the menu on the top, click **admin**, select **settings**, and then click **Custom domain and single sign-on**.
   
    ![Syncplicity](./media/active-directory-saas-syncplicity-tutorial/ic769545.png "Syncplicity")

9. On the **Single Sign-On (SSO)** dialog page, perform the following steps:
   
    ![Single Sign-On \(SSO\)](./media/active-directory-saas-syncplicity-tutorial/ic769550.png "Single Sign-On \\\(SSO\\\)")   

    a. In the **Custom Domain** textbox, type the name of your domain.
  
    b. Select **Enabled** as **Single Sign-On Status**.

    c. In the **Entity Id** textbox, Paste the value of **SAML Entity ID** which you have copied from Azure portal.

    d. In the **Sign-in page URL** textbox, Paste the **SAML Single Sign-On Service URL** which you have copied from Azure portal.

    e. In the **Logout page URL** textbox, Paste the **Sign-Out URL** which you have copied from Azure portal.

    f. In **Identity Provider Certificate**, click **Choose file**, and then upload the certificate which you have downloaded from the Azure portal. 

    g. Click **SAVE CHANGES**.

> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)
> 

### Creating an Azure AD test user
The objective of this section is to create a test user in the Azure portal called Britta Simon.

![Create Azure AD User][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure portal**, on the left navigation pane, click **Azure Active Directory** icon.

	![Creating an Azure AD test user](./media/active-directory-saas-syncplicity-tutorial/create_aaduser_01.png) 

2. To display the list of users, go to **Users and groups** and click **All users**.
	
	![Creating an Azure AD test user](./media/active-directory-saas-syncplicity-tutorial/create_aaduser_02.png) 

3. To open the **User** dialog, click **Add** on the top of the dialog.
 
	![Creating an Azure AD test user](./media/active-directory-saas-syncplicity-tutorial/create_aaduser_03.png) 

4. On the **User** dialog page, perform the following steps:
 
	![Creating an Azure AD test user](./media/active-directory-saas-syncplicity-tutorial/create_aaduser_04.png) 

    a. In the **Name** textbox, type **BrittaSimon**.

    b. In the **User name** textbox, type the **email address** of BrittaSimon.

	c. Select **Show Password** and write down the value of the **Password**.

    d. Click **Create**.
 
### Creating a Syncplicity test user
For AAD users to be able to sign in, they must be provisioned to Syncplicity application. This section describes how to create AAD user accounts in Syncplicity.

**To provision a user account to Syncplicity, perform the following steps:**

1. Log in to your **Syncplicity** tenant (for example: `https://company.Syncplicity.com`).

2. Click **admin** and select **user accounts**.

3. Click **ADD A USER**.
   
    ![Manage Users](./media/active-directory-saas-syncplicity-tutorial/ic769764.png "Manage Users")

4. Type the **Email addressess** of an AAD account you want to provision, select **User** as **Role**, and then click **NEXT**.
   
    ![Account Information](./media/active-directory-saas-syncplicity-tutorial/ic769765.png "Account Information")
   
    >[!NOTE]
    >The AAD account holder  gets an email including a link to confirm and activate the account. 
    > 

5. Select a group in your company that your new user should become a member of, and then click **NEXT**.
   
    ![Group Membership](./media/active-directory-saas-syncplicity-tutorial/ic769772.png "Group Membership")
   
    >[!NOTE]
    >If there are no groups listed, click **NEXT**. 
    > 

6. Select the folders you would like to place under Syncplicity’s control on the user’s computer, and then click **NEXT**.
   
    ![Syncplicity Folders](./media/active-directory-saas-syncplicity-tutorial/ic769773.png "Syncplicity Folders")

>[!NOTE]
>You can use any other Syncplicity user account creation tools or APIs provided by Syncplicity to provision AAD user accounts. 

### Assigning the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Syncplicity.

![Assign User][200] 

**To assign Britta Simon to Syncplicity, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

2. In the applications list, select **Syncplicity**.

	![Configure Single Sign-On](./media/active-directory-saas-syncplicity-tutorial/tutorial_syncplicity_app.png) 

3. In the menu on the left, click **Users and groups**.

	![Assign User][202] 

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![Assign User][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.
	
### Testing single sign-on

The objective of this section is to test your Azure AD single sign-on configuration using the Access Panel.

When you click the Syncplicity tile in the Access Panel, you should get automatically signed-on to your Syncplicity application.
## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)



<!--Image references-->

[1]: ./media/active-directory-saas-syncplicity-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-syncplicity-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-syncplicity-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-syncplicity-tutorial/tutorial_general_04.png

[100]: ./media/active-directory-saas-syncplicity-tutorial/tutorial_general_100.png

[200]: ./media/active-directory-saas-syncplicity-tutorial/tutorial_general_200.png
[201]: ./media/active-directory-saas-syncplicity-tutorial/tutorial_general_201.png
[202]: ./media/active-directory-saas-syncplicity-tutorial/tutorial_general_202.png
[203]: ./media/active-directory-saas-syncplicity-tutorial/tutorial_general_203.png


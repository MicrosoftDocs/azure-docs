---
title: 'Tutorial: Azure Active Directory integration with Kudos | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Kudos.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila

ms.assetid: 39c47ce6-4944-47ba-8f53-3afa95398034
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/19/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Kudos

In this tutorial, you learn how to integrate Kudos with Azure Active Directory (Azure AD).

Integrating Kudos with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Kudos
- You can enable your users to automatically get signed-on to Kudos (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure portal

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites

To configure Azure AD integration with Kudos, you need the following items:

- An Azure AD subscription
- A Kudos single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can get a one-month trial [here](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Kudos from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding Kudos from the gallery
To configure the integration of Kudos into Azure AD, you need to add Kudos from the gallery to your list of managed SaaS apps.

**To add Kudos from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![Active Directory][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![Applications][2]
	
3. To add new application, click **New application** button on the top of dialog.

	![Applications][3]

4. In the search box, type **Kudos**.

	![Creating an Azure AD test user](./media/active-directory-saas-kudos-tutorial/tutorial_kudos_search.png)

5. In the results panel, select **Kudos**, and then click **Add** button to add the application.

	![Creating an Azure AD test user](./media/active-directory-saas-kudos-tutorial/tutorial_kudos_addfromgallery.png)

##  Configuring and testing Azure AD single sign-on
In this section, you configure and test Azure AD single sign-on with Kudos based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Kudos is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Kudos needs to be established.

In Kudos, assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with Kudos, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Creating a Kudos test user](#creating-a-kudos-test-user)** - to have a counterpart of Britta Simon in Kudos that is linked to the Azure AD representation of user.
4. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Kudos application.

**To configure Azure AD single sign-on with Kudos, perform the following steps:**

1. In the Azure portal, on the **Kudos** application integration page, click **Single sign-on**.

	![Configure Single Sign-On][4]

2. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Configure Single Sign-On](./media/active-directory-saas-kudos-tutorial/tutorial_kudos_samlbase.png)

3. On the **Kudos Domain and URLs** section, perform the following steps:

	![Configure Single Sign-On](./media/active-directory-saas-kudos-tutorial/tutorial_kudos_url.png)

    In the **Sign-on URL** textbox, type a URL using the following pattern: `https://<company>.kudosnow.com`
	
	> [!NOTE] 
	> This value is not real. Update this value with the actual Sign-On URL. Contact [Kudos Client support team](http://success.kudosnow.com/home) to get this value. 
 
4. On the **SAML Signing Certificate** section, click **Certificate(Base64)** and then save the certificate file on your computer.

	![Configure Single Sign-On](./media/active-directory-saas-kudos-tutorial/tutorial_kudos_certificate.png) 

5. Click **Save** button.

	![Configure Single Sign-On](./media/active-directory-saas-kudos-tutorial/tutorial_general_400.png)

6. On the **Kudos Configuration** section, click **Configure Kudos** to open **Configure sign-on** window. Copy the **Sign-Out URL and SAML Single Sign-On Service URL** from the **Quick Reference section.**

	![Configure Single Sign-On](./media/active-directory-saas-kudos-tutorial/tutorial_kudos_configure.png) 

7. In a different web browser window, log into your Kudos company site as an administrator.

8. In the menu on the top, click **Settings**.
   
    ![Settings](./media/active-directory-saas-kudos-tutorial/ic787806.png "Settings")

9. Click **Integrations \> SSO**.

10. In the **SSO** section, perform the following steps:
   
    ![SSO](./media/active-directory-saas-kudos-tutorial/ic787807.png "SSO")
   
    a. In **Sign on URL** textbox, paste the value of  **SAML Single Sign-On Service URL** which you have copied from Azure portal. 

    b. Open your base-64 encoded certificate in notepad, copy the content of it into your clipboard, and then paste it to the **X.509 certificate** textbox
   
    c. In **Logout To URL**, paste the value of  **Sign-Out URL** which you have copied from Azure portal.
   
    d. In the **Your Kudos URL** textbox, type your company name.
   
    e. Click **Save**.

> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)


### Creating an Azure AD test user
The objective of this section is to create a test user in the Azure portal called Britta Simon.

![Create Azure AD User][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure portal**, on the left navigation pane, click **Azure Active Directory** icon.

	![Creating an Azure AD test user](./media/active-directory-saas-kudos-tutorial/create_aaduser_01.png) 

2. To display the list of users, go to **Users and groups** and click **All users**.
	
	![Creating an Azure AD test user](./media/active-directory-saas-kudos-tutorial/create_aaduser_02.png) 

3. To open the **User** dialog, click **Add** on the top of the dialog.
 
	![Creating an Azure AD test user](./media/active-directory-saas-kudos-tutorial/create_aaduser_03.png) 

4. On the **User** dialog page, perform the following steps:
 
	![Creating an Azure AD test user](./media/active-directory-saas-kudos-tutorial/create_aaduser_04.png) 

    a. In the **Name** textbox, type **BrittaSimon**.

    b. In the **User name** textbox, type the **email address** of BrittaSimon.

	c. Select **Show Password** and write down the value of the **Password**.

    d. Click **Create**.
 
### Creating a Kudos test user

In order to enable Azure AD users to log into Kudos, they must be provisioned into Kudos. 

In the case of Kudos, provisioning is a manual task.

**To provision a user accounts, perform the following steps:**

1. Log in to your **Kudos** company site as administrator.

2. In the menu on the top, click **Settings**.
   
   ![Settings](./media/active-directory-saas-kudos-tutorial/ic787806.png "Settings")

3. Click **User Admin**.

4. Click the **Users** tab, and then click **Add a user**.
   
   ![User Admin](./media/active-directory-saas-kudos-tutorial/ic787809.png "User Admin")

5. In the **Add a User** section, perform the following steps:
   
    ![Add a User](./media/active-directory-saas-kudos-tutorial/ic787810.png "Add a User")
   
    a. Type the **First Name**, **Last Name**, **Email** and other details of a valid Azure Active Directory account you want to provision into the related textboxes.
   
    b. Click **Create User**.

>[!NOTE]
>You can use any other Kudos user account creation tools or APIs provided by Kudos to provision AAD user accounts.

### Assigning the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Kudos.

![Assign User][200] 

**To assign Britta Simon to Kudos, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

2. In the applications list, select **Kudos**.

	![Configure Single Sign-On](./media/active-directory-saas-kudos-tutorial/tutorial_kudos_app.png) 

3. In the menu on the left, click **Users and groups**.

	![Assign User][202] 

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![Assign User][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.
	
### Testing single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Kudos tile in the Access Panel, you should get automatically signed-on to your Kudos application. For more information about the Access Panel, see [Introduction to the Access Panel](active-directory-saas-access-panel-introduction.md).

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)



<!--Image references-->

[1]: ./media/active-directory-saas-kudos-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-kudos-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-kudos-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-kudos-tutorial/tutorial_general_04.png

[100]: ./media/active-directory-saas-kudos-tutorial/tutorial_general_100.png

[200]: ./media/active-directory-saas-kudos-tutorial/tutorial_general_200.png
[201]: ./media/active-directory-saas-kudos-tutorial/tutorial_general_201.png
[202]: ./media/active-directory-saas-kudos-tutorial/tutorial_general_202.png
[203]: ./media/active-directory-saas-kudos-tutorial/tutorial_general_203.png


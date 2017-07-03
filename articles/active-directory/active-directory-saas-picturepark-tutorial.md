---
title: 'Tutorial: Azure Active Directory integration with Picturepark | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Picturepark.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila

ms.assetid: 31c21cd4-9c00-4cad-9538-a13996dc872f
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/06/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Picturepark

In this tutorial, you learn how to integrate Picturepark with Azure Active Directory (Azure AD).

Integrating Picturepark with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Picturepark
- You can enable your users to automatically get signed-on to Picturepark (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure portal

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites

To configure Azure AD integration with Picturepark, you need the following items:

- An Azure AD subscription
- A Picturepark single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can get a one-month trial [here](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Picturepark from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding Picturepark from the gallery
To configure the integration of Picturepark into Azure AD, you need to add Picturepark from the gallery to your list of managed SaaS apps.

**To add Picturepark from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![Active Directory][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![Applications][2]
	
3. To add new application, click **New application** button on the top of dialog.

	![Applications][3]

4. In the search box, type **Picturepark**.

	![Creating an Azure AD test user](./media/active-directory-saas-picturepark-tutorial/tutorial_picturepark_search.png)

5. In the results panel, select **Picturepark**, and then click **Add** button to add the application.

	![Creating an Azure AD test user](./media/active-directory-saas-picturepark-tutorial/tutorial_picturepark_addfromgallery.png)

##  Configuring and testing Azure AD single sign-on
In this section, you configure and test Azure AD single sign-on with Picturepark based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Picturepark is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Picturepark needs to be established.

In Picturepark, assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with Picturepark, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Creating a Picturepark test user](#creating-a-picturepark-test-user)** - to have a counterpart of Britta Simon in Picturepark that is linked to the Azure AD representation of user.
4. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Picturepark application.

**To configure Azure AD single sign-on with Picturepark, perform the following steps:**

1. In the Azure portal, on the **Picturepark** application integration page, click **Single sign-on**.

	![Configure Single Sign-On][4]

2. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Configure Single Sign-On](./media/active-directory-saas-picturepark-tutorial/tutorial_picturepark_samlbase.png)

3. On the **Picturepark Domain and URLs** section, perform the following steps:

	![Configure Single Sign-On](./media/active-directory-saas-picturepark-tutorial/tutorial_picturepark_url.png)

    a. In the **Sign-on URL** textbox, type a URL using the following pattern: `https://<companyname>.picturepark.com`

	b. In the **Identifier** textbox, type a URL using the following pattern: 
	
	|  |
	|--|
	| `https://<companyname>.current-picturepark.com`|
	| `https://<companyname>.picturepark.com`|
	| `https://<companyname>.next-picturepark.com`|
	| |

	> [!NOTE] 
	> These values are not real. Update these values with the actual Sign-On URL and Identifier. Contact [Picturepark Client support team](https://picturepark.com/about/contact/) to get these values. 
 
4. On the **SAML Signing Certificate** section, copy the **THUMBPRINT** value of certificate.

	![Configure Single Sign-On](./media/active-directory-saas-picturepark-tutorial/tutorial_picturepark_certificate.png) 

5. Click **Save** button.

	![Configure Single Sign-On](./media/active-directory-saas-picturepark-tutorial/tutorial_general_400.png)

6. On the **Picturepark Configuration** section, click **Configure Picturepark** to open **Configure sign-on** window. Copy the **SAML Single Sign-On Service URL** from the **Quick Reference section.**

	![Configure Single Sign-On](./media/active-directory-saas-picturepark-tutorial/tutorial_picturepark_configure.png) 

7. In a different web browser window, log into your Picturepark company site as an administrator.

8. In the toolbar on the top, click **Administrative tools**, and then click **Management Console**.
   
    ![Management Console](./media/active-directory-saas-picturepark-tutorial/ic795062.png "Management Console")

9. Click **Authentication**, and then click **Identity providers**.
   
    ![Authentication](./media/active-directory-saas-picturepark-tutorial/ic795063.png "Authentication")

10. In the **Identity provider configuration** section, perform the following steps:
   
    ![Identity provider configuration](./media/active-directory-saas-picturepark-tutorial/ic795064.png "Identity provider configuration")
   
    a. Click **Add**.
  
    b. Type a name for your configuration.
   
    c. Select **Set as default**.
   
    d. In **Issuer URI** textbox, paste the value of **SAML Single Sign-On Service URL** which you have copied from Azure portal.
   
    e. Copy the **Thumbprint** value from the **SAML Signing Certificate** section, and then paste it into the **Trusted Issuer Thumb Print** textbox.  

11. Click **JoinDefaultUsersGroup**.

12. To set the **Emailaddress** attribute in the **Claim** textbox, type `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress` and click **Save**.

      ![Configuration](./media/active-directory-saas-picturepark-tutorial/ic795065.png "Configuration")

> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)
> 

### Creating an Azure AD test user
The objective of this section is to create a test user in the Azure portal called Britta Simon.

![Create Azure AD User][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure portal**, on the left navigation pane, click **Azure Active Directory** icon.

	![Creating an Azure AD test user](./media/active-directory-saas-picturepark-tutorial/create_aaduser_01.png) 

2. To display the list of users, go to **Users and groups** and click **All users**.
	
	![Creating an Azure AD test user](./media/active-directory-saas-picturepark-tutorial/create_aaduser_02.png) 

3. To open the **User** dialog, click **Add** on the top of the dialog.
 
	![Creating an Azure AD test user](./media/active-directory-saas-picturepark-tutorial/create_aaduser_03.png) 

4. On the **User** dialog page, perform the following steps:
 
	![Creating an Azure AD test user](./media/active-directory-saas-picturepark-tutorial/create_aaduser_04.png) 

    a. In the **Name** textbox, type **BrittaSimon**.

    b. In the **User name** textbox, type the **email address** of BrittaSimon.

	c. Select **Show Password** and write down the value of the **Password**.

    d. Click **Create**.
 
### Creating a Picturepark test user

In order to enable Azure AD users to log into Picturepark, they must be provisioned into Picturepark. In the case of Picturepark, provisioning is a manual task.

**To provision a user account, perform the following steps:**

1. Log in to your **Picturepark** tenant.

2. In the toolbar on the top, click **Administrative tools**, and then click **Users**.
   
    ![Users](./media/active-directory-saas-picturepark-tutorial/ic795067.png "Users")

3. In the **Users overview** tab, click **New**.
   
    ![User management](./media/active-directory-saas-picturepark-tutorial/ic795068.png "User management")

4. On the **Create User** dialog, perform the following steps of a valid Azure Active Directory User you want to provision:
   
    ![Create User](./media/active-directory-saas-picturepark-tutorial/ic795069.png "Create User")
   
    a. In the **Email Address** textbox, type the **email address** of the user **BrittaSimon@contoso.com**.  
   
    b. In the **Password** and **Confirm Password** textboxes, type the **password** of BrittaSimon. 
   
    c. In the **First Name** textbox, type the **First Name** of the user **Britta**. 
   
    d. In the **Last Name** textbox, type the **Last Name** of the user **Simon**.
   
    e. In the **Company** textbox, type the **Company name** of the user. 
   
    f. In the **Country** textbox, select the **Country** of the user.
  
    g. In the **ZIP** textbox, type the **ZIP code** of the city.
   
    h. In the **City** textbox, type the **City name** of the user.

    i. Select a **Language**.
   
    j. Click **Create**.

>[!NOTE]
>You can use any other Picturepark user account creation tools or APIs provided by Picturepark to provision Azure AD user accounts.
> 

### Assigning the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Picturepark.

![Assign User][200] 

**To assign Britta Simon to Picturepark, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

2. In the applications list, select **Picturepark**.

	![Configure Single Sign-On](./media/active-directory-saas-picturepark-tutorial/tutorial_picturepark_app.png) 

3. In the menu on the left, click **Users and groups**.

	![Assign User][202] 

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![Assign User][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.
	
### Testing single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Picturepark tile in the Access Panel, you should get automatically signed-on to your Picturepark application. For more information about the Access Panel, see [Introduction to the Access Panel](active-directory-saas-access-panel-introduction.md).

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)



<!--Image references-->

[1]: ./media/active-directory-saas-picturepark-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-picturepark-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-picturepark-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-picturepark-tutorial/tutorial_general_04.png

[100]: ./media/active-directory-saas-picturepark-tutorial/tutorial_general_100.png

[200]: ./media/active-directory-saas-picturepark-tutorial/tutorial_general_200.png
[201]: ./media/active-directory-saas-picturepark-tutorial/tutorial_general_201.png
[202]: ./media/active-directory-saas-picturepark-tutorial/tutorial_general_202.png
[203]: ./media/active-directory-saas-picturepark-tutorial/tutorial_general_203.png


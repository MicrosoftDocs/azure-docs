---
title: 'Tutorial: Azure Active Directory integration with Sprinklr | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Sprinklr.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila

ms.assetid: b33938a1-25a5-484c-8e75-7dc6de2d534d
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/10/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Sprinklr

In this tutorial, you learn how to integrate Sprinklr with Azure Active Directory (Azure AD).

Integrating Sprinklr with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Sprinklr
- You can enable your users to automatically get signed-on to Sprinklr (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure portal

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites

To configure Azure AD integration with Sprinklr, you need the following items:

- An Azure AD subscription
- A Sprinklr single-sign on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can get a one-month trial [here](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Sprinklr from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding Sprinklr from the gallery
To configure the integration of Sprinklr into Azure AD, you need to add Sprinklr from the gallery to your list of managed SaaS apps.

**To add Sprinklr from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![Active Directory][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![Applications][2]
	
3. To add new application, click **New application** button on the top of dialog.

	![Applications][3]

4. In the search box, type **Sprinklr**.

	![Creating an Azure AD test user](./media/active-directory-saas-sprinklr-tutorial/tutorial_sprinklr_search.png)

5. In the results panel, select **Sprinklr**, and then click **Add** button to add the application.

	![Creating an Azure AD test user](./media/active-directory-saas-sprinklr-tutorial/tutorial_sprinklr_addfromgallery.png)

##  Configuring and testing Azure AD single sign-on
In this section, you configure and test Azure AD single sign-on with Sprinklr based on a test user called "Britta Simon."

For single sign-on to work, Azure AD needs to know what the counterpart user in Sprinklr is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Sprinklr needs to be established.

In Sprinklr, assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with Sprinklr, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Creating a Sprinklr test user](#creating-a-sprinklr-test-user)** - to have a counterpart of Britta Simon in Sprinklr that is linked to the Azure AD representation of user.
4. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Sprinklr application.

**To configure Azure AD single sign-on with Sprinklr, perform the following steps:**

1. In the Azure portal, on the **Sprinklr** application integration page, click **Single sign-on**.

	![Configure Single Sign-On][4]

2. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Configure Single Sign-On](./media/active-directory-saas-sprinklr-tutorial/tutorial_sprinklr_samlbase.png)

3. On the **Sprinklr Domain and URLs** section, perform the following steps:

	![Configure Single Sign-On](./media/active-directory-saas-sprinklr-tutorial/tutorial_sprinklr_url.png)

    a. In the **Sign-on URL** textbox, type a URL using the following pattern: `https://<subdomain>.sprinklr.com`

    b. In the **Identifier** textbox, type a URL using the following pattern: `https://<subdomain>.sprinklr.com`

	> [!NOTE] 
	> These values are not real. Update the value with the actual Sign-On URL and Identifier. Contact [Sprinklr Client support team](https://www.sprinklr.com/contact-us/) to get these values. 
 
4. On the **SAML Signing Certificate** section, click **Certificate (Base64)** and then save the certificate file on your computer.

	![Configure Single Sign-On](./media/active-directory-saas-sprinklr-tutorial/tutorial_sprinklr_certificate.png) 

5. Click **Save** button.

    ![Configure Single Sign-On](./media/active-directory-saas-sprinklr-tutorial/tutorial_general_400.png)

6. On the **Sprinklr Configuration** section, click **Configure Sprinklr** to open **Configure sign-on** window. Copy the **Sign-Out URL, SAML Entity ID, and SAML Single Sign-On Service URL** from the **Quick Reference section.**

7. In a different web browser window, log in to your Sprinklr company site as an administrator.

8. Go to **Administration \> Settings**.
   
    ![Administration](./media/active-directory-saas-sprinklr-tutorial/ic782907.png "Administration")

9. Go to **Manage Partner \> Single Sign** on from the left pane.
   
    ![Manage Partner](./media/active-directory-saas-sprinklr-tutorial/ic782908.png "Manage Partner")

10. Click **+Add Single Sign Ons**.
   
    ![Single Sign-Ons](./media/active-directory-saas-sprinklr-tutorial/ic782909.png "Single Sign-Ons")

11. On the **Single Sign on** page, perform the following steps:
   
    ![Single Sign-Ons](./media/active-directory-saas-sprinklr-tutorial/ic782910.png "Single Sign-Ons")

    a. In the **Name** textbox, type a name for your configuration (for example: *WAADSSOTest*).

    b. Select **Enabled**.

    c. Select **Use new SSO Certificate**.
             
    e. Open your base-64 encoded certificate in notepad, copy the content of it into your clipboard, and then paste it to the **Identity Provider Certificate** textbox.

    f. Paste the **SAML Entity ID** value which you have copied from Azure Portal into the **Entity Id** textbox.

    g. Paste the **SAML Single Sign-On Service URL** value which you have copied from Azure Portal into the **Identity Provider Login URL** textbox.

    h. Paste the **Sign-Out URL** value which you have copied from Azure Portal into the **Identity Provider Logout URL** textbox.
     
    i. As **SAML User ID Type**, select **Assertion contains User”s sprinklr.com username**.

    j. As **SAML User ID Location**, select **User ID is in the Name Identifier element of the Subject statement**.

    k. Click **Save**.
       
    ![SAML](./media/active-directory-saas-sprinklr-tutorial/ic782911.png "SAML")

> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)

### Creating an Azure AD test user
The objective of this section is to create a test user in the Azure portal called Britta Simon.

![Create Azure AD User][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure portal**, on the left navigation pane, click **Azure Active Directory** icon.

	![Creating an Azure AD test user](./media/active-directory-saas-sprinklr-tutorial/create_aaduser_01.png) 

2. To display the list of users, go to **Users and groups** and click **All users**.
	
	![Creating an Azure AD test user](./media/active-directory-saas-sprinklr-tutorial/create_aaduser_02.png) 

3. To open the **User** dialog, click **Add** on the top of the dialog.
 
	![Creating an Azure AD test user](./media/active-directory-saas-sprinklr-tutorial/create_aaduser_03.png) 

4. On the **User** dialog page, perform the following steps:
 
	![Creating an Azure AD test user](./media/active-directory-saas-sprinklr-tutorial/create_aaduser_04.png) 

    a. In the **Name** textbox, type **BrittaSimon**.

    b. In the **User name** textbox, type the **email address** of BrittaSimon.

	c. Select **Show Password** and write down the value of the **Password**.

    d. Click **Create**.
 
### Creating a Sprinklr test user

1. Log in to your Sprinklr company site as an administrator.

2. Go to **Administration \> Settings**.
   
    ![Administration](./media/active-directory-saas-sprinklr-tutorial/ic782907.png "Administration")

3. Go to **Manage Client \> Users** from the left pane.
   
    ![Settings](./media/active-directory-saas-sprinklr-tutorial/ic782914.png "Settings")

4. Click **Add User**.
   
    ![Settings](./media/active-directory-saas-sprinklr-tutorial/ic782915.png "Settings")

5. On the **Edit user** dialog, perform the following steps:
   
    ![Edit user](./media/active-directory-saas-sprinklr-tutorial/ic782916.png "Edit user") 

    a. In the **Email**, **First Name** and **Last Name** textboxes, type the information of an Azure AD user account you want to provision.

    b. Select **Password Disabled**.

    c. Select **Language**.

    d. Select **User Type**.

    e. Click **Update**.
   
     >[!IMPORTANT]
     >**Password Disabled** must be selected to enable a user to log in via an Identity provider. 
     
6. Go to **Role**, and then perform the following steps:
   
    ![Partner Roles](./media/active-directory-saas-sprinklr-tutorial/ic782917.png "Partner Roles")

    a. From the **Global** list, select **ALL\_Permissions**.  

    b. Click **Update**.

>[!NOTE]
>You can use any other Sprinklr user account creation tools or APIs provided by Sprinklr to provision Azure AD user accounts. 

### Assigning the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Sprinklr.

![Assign User][200] 

**To assign Britta Simon to Sprinklr, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

2. In the applications list, select **Sprinklr**.

	![Configure Single Sign-On](./media/active-directory-saas-sprinklr-tutorial/tutorial_sprinklr_app.png) 

3. In the menu on the left, click **Users and groups**.

	![Assign User][202] 

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![Assign User][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.
	
### Testing single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Sprinklr tile in the Access Panel, you should get automatically signed-on to your Sprinklr application
For more information about the Access Panel, see [Introduction to the Access Panel](active-directory-saas-access-panel-introduction.md). 

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)



<!--Image references-->

[1]: ./media/active-directory-saas-sprinklr-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-sprinklr-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-sprinklr-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-sprinklr-tutorial/tutorial_general_04.png

[100]: ./media/active-directory-saas-sprinklr-tutorial/tutorial_general_100.png

[200]: ./media/active-directory-saas-sprinklr-tutorial/tutorial_general_200.png
[201]: ./media/active-directory-saas-sprinklr-tutorial/tutorial_general_201.png
[202]: ./media/active-directory-saas-sprinklr-tutorial/tutorial_general_202.png
[203]: ./media/active-directory-saas-sprinklr-tutorial/tutorial_general_203.png


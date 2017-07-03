---
title: 'Tutorial: Azure Active Directory integration with Recognize | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Recognize.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila

ms.assetid: cfad939e-c8f4-45a0-bd25-c4eb9701acaa
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/06/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Recognize

In this tutorial, you learn how to integrate Recognize with Azure Active Directory (Azure AD).

Integrating Recognize with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Recognize
- You can enable your users to automatically get signed-on to Recognize (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure portal

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites

To configure Azure AD integration with Recognize, you need the following items:

- An Azure AD subscription
- A Recognize single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can get a one-month trial [here](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Recognize from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding Recognize from the gallery
To configure the integration of Recognize into Azure AD, you need to add Recognize from the gallery to your list of managed SaaS apps.

**To add Recognize from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![Active Directory][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![Applications][2]
	
3. To add new application, click **New application** button on the top of dialog.

	![Applications][3]

4. In the search box, type **Recognize**.

	![Creating an Azure AD test user](./media/active-directory-saas-recognize-tutorial/tutorial_recognize_search.png)

5. In the results panel, select **Recognize**, and then click **Add** button to add the application.

	![Creating an Azure AD test user](./media/active-directory-saas-recognize-tutorial/tutorial_recognize_addfromgallery.png)

##  Configuring and testing Azure AD single sign-on
In this section, you configure and test Azure AD single sign-on with Recognize based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Recognize is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Recognize needs to be established.

In Recognize, assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with Recognize, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Creating a Recognize test user](#creating-a-recognize-test-user)** - to have a counterpart of Britta Simon in Recognize that is linked to the Azure AD representation of user.
4. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Recognize application.

**To configure Azure AD single sign-on with Recognize, perform the following steps:**

1. In the Azure portal, on the **Recognize** application integration page, click **Single sign-on**.

	![Configure Single Sign-On][4]

2. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Configure Single Sign-On](./media/active-directory-saas-recognize-tutorial/tutorial_recognize_samlbase.png)

3. On the **Recognize Domain and URLs** section, perform the following steps:

	![Configure Single Sign-On](./media/active-directory-saas-recognize-tutorial/tutorial_recognize_url.png)

    a. In the **Sign-on URL** textbox, type a URL using the following pattern: `https://recognizeapp.com/<your-domain>/saml/sso`

	b. In the **Identifier** textbox, type a URL using the following pattern: `https://recognizeapp.com/<your-domain>`

	> [!NOTE] 
	> These values are not real. Update these values with the actual Sign-On URL and Identifier. Contact [Recognize Client support team](mailto:support@recognizeapp.com) to get these values. 
 


4. On the **SAML Signing Certificate** section, click **Certificate (Base64)** and then save the certificate file on your computer.

	![Configure Single Sign-On](./media/active-directory-saas-recognize-tutorial/tutorial_recognize_certificate.png) 

5. Click **Save** button.

	![Configure Single Sign-On](./media/active-directory-saas-recognize-tutorial/tutorial_general_400.png)

6. On the **Recognize Configuration** section, click **Configure Recognize** to open **Configure sign-on** window. Copy the **Sign-Out URL, SAML Entity ID, and SAML Single Sign-On Service URL** from the **Quick Reference section.**

	![Configure Single Sign-On](./media/active-directory-saas-recognize-tutorial/tutorial_recognize_configure.png) 

7. In a different web browser window, sign-on to your Recognize tenant as an administrator.

8. On the upper right corner, click **Menu**. Go to **Company Admin**.
   
    ![Configure Single Sign-On On App side](./media/active-directory-saas-recognize-tutorial/tutorial_recognize_000.png)

9. On the left navigation pane, click **Settings**.
   
    ![Configure Single Sign-On On App side](./media/active-directory-saas-recognize-tutorial/tutorial_recognize_001.png)

10. Perform the following steps on **SSO Settings** section.
   
    ![Configure Single Sign-On On App side](./media/active-directory-saas-recognize-tutorial/tutorial_recognize_002.png)
	
	a. As **Enable SSO**, select **ON**.

	b. In the **IDP Entity ID** textbox, paste the value of **SAML Entity ID** which you have copied from Azure portal.
	
	c. In the **Sso target url** textbox, paste the value of **SAML Single Sign-On Service URL** which you have copied from Azure portal.
	
	d. In the **Slo target url** textbox, paste the value of **Sign-Out URL** which you have copied from Azure portal. 
	
	e. Open your downloaded **Certificate (Base64)** file in notepad, copy the content of it into your clipboard, and then paste it to the **Certificate** textbox.
	
	f. Click the **Save settings** button. 

11. Beside the **SSO Settings** section, copy the URL under **Service Provider Metadata url**.
   
    ![Configure Single Sign-On On App side](./media/active-directory-saas-recognize-tutorial/tutorial_recognize_003.png)

12. Open the **Metadata URL link** under a blank browser to download the metadata document. Then use the EntityDescriptor value Recognize provided you for **Identifier** on the **Configure App Settings** dialog.
    
    ![Configure Single Sign-On On App side](./media/active-directory-saas-recognize-tutorial/tutorial_recognize_004.png)

> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)
> 

### Creating an Azure AD test user
The objective of this section is to create a test user in the Azure portal called Britta Simon.

![Create Azure AD User][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure portal**, on the left navigation pane, click **Azure Active Directory** icon.

	![Creating an Azure AD test user](./media/active-directory-saas-recognize-tutorial/create_aaduser_01.png) 

2. To display the list of users, go to **Users and groups** and click **All users**.
	
	![Creating an Azure AD test user](./media/active-directory-saas-recognize-tutorial/create_aaduser_02.png) 

3. To open the **User** dialog, click **Add** on the top of the dialog.
 
	![Creating an Azure AD test user](./media/active-directory-saas-recognize-tutorial/create_aaduser_03.png) 

4. On the **User** dialog page, perform the following steps:
 
	![Creating an Azure AD test user](./media/active-directory-saas-recognize-tutorial/create_aaduser_04.png) 

    a. In the **Name** textbox, type **BrittaSimon**.

    b. In the **User name** textbox, type the **email address** of BrittaSimon.

	c. Select **Show Password** and write down the value of the **Password**.

    d. Click **Create**.
 
### Creating a Recognize test user

In order to enable Azure AD users to log into Recognize, they must be provisioned into Recognize. In the case of Recognize, provisioning is a manual task.

This app doesn't support SCIM provisioning but has an alternate user sync that provisions users. 

**To provision a user account, perform the following steps:**

1. Log into your Recognize company site as an administrator.

2. On the upper right corner, click **Menu**. Go to **Company Admin**.

3. On the left navigation pane, click **Settings**.

4. Perform the following steps on **User Sync** section.
   
   ![New User](./media/active-directory-saas-recognize-tutorial/tutorial_recognize_005.png "New User")
   
   a. As **Sync Enabled**, select **ON**.
   
   b. As **Choose sync provider**, select **Microsoft / Office 365**.
   
   c. Click **Run User Sync**.

### Assigning the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Recognize.

![Assign User][200] 

**To assign Britta Simon to Recognize, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

2. In the applications list, select **Recognize**.

	![Configure Single Sign-On](./media/active-directory-saas-recognize-tutorial/tutorial_recognize_app.png) 

3. In the menu on the left, click **Users and groups**.

	![Assign User][202] 

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![Assign User][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.
	
### Testing single sign-on

The objective of this section is to test your Azure AD single sign-on configuration using the Access Panel.

When you click the Recognize tile in the Access Panel, you should get automatically signed-on to your Recognize application. For more information about the Access Panel, see [Introduction to the Access Panel](active-directory-saas-access-panel-introduction.md).

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)



<!--Image references-->

[1]: ./media/active-directory-saas-recognize-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-recognize-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-recognize-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-recognize-tutorial/tutorial_general_04.png

[100]: ./media/active-directory-saas-recognize-tutorial/tutorial_general_100.png

[200]: ./media/active-directory-saas-recognize-tutorial/tutorial_general_200.png
[201]: ./media/active-directory-saas-recognize-tutorial/tutorial_general_201.png
[202]: ./media/active-directory-saas-recognize-tutorial/tutorial_general_202.png
[203]: ./media/active-directory-saas-recognize-tutorial/tutorial_general_203.png


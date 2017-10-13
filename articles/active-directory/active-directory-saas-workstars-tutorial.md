---
title: 'Tutorial: Azure Active Directory integration with Workstars | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Workstars.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila
ms.reviewer: joflore

ms.assetid: 51a4a4e4-ff60-4971-b3f8-a0367b70d220
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/25/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Workstars

In this tutorial, you learn how to integrate Workstars with Azure Active Directory (Azure AD).

Integrating Workstars with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Workstars.
- You can enable your users to automatically get signed-on to Workstars (Single Sign-On) with their Azure AD accounts.
- You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites

To configure Azure AD integration with Workstars, you need the following items:

- An Azure AD subscription
- A Workstars single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Workstars from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding Workstars from the gallery
To configure the integration of Workstars into Azure AD, you need to add Workstars from the gallery to your list of managed SaaS apps.

**To add Workstars from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![The Azure Active Directory button][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![The Enterprise applications blade][2]
	
3. To add new application, click **New application** button on the top of dialog.

	![The New application button][3]

4. In the search box, type **Workstars**, select **Workstars** from result panel then click **Add** button to add the application.

	![Workstars in the results list](./media/active-directory-saas-workstars-tutorial/tutorial_workstars_addfromgallery.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Workstars based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Workstars is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Workstars needs to be established.

In Workstars, assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with Workstars, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Create a Workstars test user](#create-a-workstars-test-user)** - to have a counterpart of Britta Simon in Workstars that is linked to the Azure AD representation of user.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Workstars application.

**To configure Azure AD single sign-on with Workstars, perform the following steps:**

1. In the Azure portal, on the **Workstars** application integration page, click **Single sign-on**.

	![Configure single sign-on link][4]

2. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Single sign-on dialog box](./media/active-directory-saas-workstars-tutorial/tutorial_workstars_samlbase.png)

3. On the **Workstars Domain and URLs** section, perform the following steps:

	![Workstars Domain and URLs single sign-on information](./media/active-directory-saas-workstars-tutorial/tutorial_workstars_url.png)

    a. In the **Identifier** textbox, type the URL: `https://workstars.com`

	b. In the **Reply URL** textbox, type a URL using the following pattern: `https://<subdomain>.workstars.com/saml/login_check`

	> [!NOTE] 
	> The value is not real. Update the value with the actual Reply URL. Contact [Workstars support team](https://support.workstars.com) to get the value.
 
4. On the **SAML Signing Certificate** section, click **Certificate (Base64)** and then save the certificate file on your computer.

	![The Certificate download link](./media/active-directory-saas-workstars-tutorial/tutorial_workstars_certificate.png) 

5. Click **Save** button.

	![Configure Single Sign-On Save button](./media/active-directory-saas-workstars-tutorial/tutorial_general_400.png)

6. On the **Workstars Configuration** section, click **Configure Workstars** to open **Configure sign-on** window. Copy the **Sign-Out URL, SAML Entity ID, and SAML Single Sign-On Service URL** from the **Quick Reference section.**

	![Workstars Configuration](./media/active-directory-saas-workstars-tutorial/tutorial_workstars_configure.png) 

7. In another browser window, sign on to your Workstars company site as an administrator.

8. In the main toolbar, click **Settings**.

	![Workstars sett](./media/active-directory-saas-workstars-tutorial/tutorial_workstars_sett.png)

9. Go to **Sign On** > **Settings**.

	![Workstars signon](./media/active-directory-saas-workstars-tutorial/tutorial_workstars_signon.png)

    ![Workstars settings](./media/active-directory-saas-workstars-tutorial/tutorial_workstars_settings.png)

10. On the **Single Sign On (SAML) - Settings** page, perform the following steps:
	
	![Workstars saml](./media/active-directory-saas-workstars-tutorial/tutorial_workstars_saml.png)

	a. In **Identity Provider Name** textbox, type **Office 365**.

	b. In the **Identity Provider Entity ID** textbox, paste the value of **SAML Entity ID**, which you have copied from Azure portal.

	c. Copy the content of the downloaded certificate file in notepad, and then paste it into the **x509 Certificate** textbox. 

	d. In the **SAML SSO URL** textbox, paste the value of **SAML Single Sign-On Service URL**, which you have copied from Azure portal.
	
	e. In the **Remote Logout URL** textbox, paste the value of **Sign-Out URL**, which you have copied from Azure portal. 

	f. select **Name ID** as **Email (Default)**.

	g. Click **Confirm**.
	
> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

   ![Create an Azure AD test user][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the Azure portal, in the left pane, click the **Azure Active Directory** button.

    ![The Azure Active Directory button](./media/active-directory-saas-workstars-tutorial/create_aaduser_01.png)

2. To display the list of users, go to **Users and groups**, and then click **All users**.

    ![The "Users and groups" and "All users" links](./media/active-directory-saas-workstars-tutorial/create_aaduser_02.png)

3. To open the **User** dialog box, click **Add** at the top of the **All Users** dialog box.

    ![The Add button](./media/active-directory-saas-workstars-tutorial/create_aaduser_03.png)

4. In the **User** dialog box, perform the following steps:

    ![The User dialog box](./media/active-directory-saas-workstars-tutorial/create_aaduser_04.png)

    a. In the **Name** box, type **BrittaSimon**.

    b. In the **User name** box, type the email address of user Britta Simon.

    c. Select the **Show Password** check box, and then write down the value that's displayed in the **Password** box.

    d. Click **Create**.
  
### Create a Workstars test user

In this section, you create a user called Britta Simon in Workstars. Work with [Workstars support team](https://support.workstars.com) to add the users in the Workstars platform.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Workstars.

![Assign the user role][200] 

**To assign Britta Simon to Workstars, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

2. In the applications list, select **Workstars**.

	![The Workstars link in the Applications list](./media/active-directory-saas-workstars-tutorial/tutorial_workstars_app.png)  

3. In the menu on the left, click **Users and groups**.

	![The "Users and groups" link][202]

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![The Add Assignment pane][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.
	
### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Workstars tile in the Access Panel, you should get automatically signed-on to your Workstars application.
For more information about the Access Panel, see [Introduction to the Access Panel](active-directory-saas-access-panel-introduction.md). 

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)



<!--Image references-->

[1]: ./media/active-directory-saas-workstars-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-workstars-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-workstars-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-workstars-tutorial/tutorial_general_04.png

[100]: ./media/active-directory-saas-workstars-tutorial/tutorial_general_100.png

[200]: ./media/active-directory-saas-workstars-tutorial/tutorial_general_200.png
[201]: ./media/active-directory-saas-workstars-tutorial/tutorial_general_201.png
[202]: ./media/active-directory-saas-workstars-tutorial/tutorial_general_202.png
[203]: ./media/active-directory-saas-workstars-tutorial/tutorial_general_203.png


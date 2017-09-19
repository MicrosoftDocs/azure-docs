---
title: 'Tutorial: Azure Active Directory integration with Absorb LMS | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Absorb LMS.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila
ms.reviewer: joflore

ms.assetid: ba9f1b3d-a4a0-4ff7-b0e7-428e0ed92142
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/15/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Absorb LMS

In this tutorial, you learn how to integrate Absorb LMS with Azure Active Directory (Azure AD).

Integrating Absorb LMS with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Absorb LMS.
- You can enable your users to automatically get signed-on to Absorb LMS (Single Sign-On) with their Azure AD accounts.
- You can manage your accounts in one central location, the Azure portal.

If you want to know more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md).

## Prerequisites

To configure Azure AD integration with Absorb LMS, you need the following items:

- An Azure AD subscription
- An Absorb LMS single sign-on enabled subscription

> [!NOTE]
> We recommend not using a production environment for this tutorial.

To test the steps in this tutorial, follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

* Adding Absorb LMS from the gallery
* Configuring and testing Azure AD single sign-on

## Add Absorb LMS from the gallery
To configure the integration of Absorb LMS into Azure AD, add Absorb LMS from the gallery to your list of managed software as a service (SaaS) apps.

To add Absorb LMS from the gallery, do the following:

1. In the [Azure portal](https://portal.azure.com), in the left pane, select the **Azure Active Directory** icon. 

	![The Azure Active Directory button][1]

2. Go to **Enterprise applications** > **All applications**.

	![The Enterprise applications pane][2]
	
3. To add an application, select the **New application** button.

	![The New application button][3]

4. In the search box, type **Absorb LMS**, select **Absorb LMS** in result panel, and then select the **Add** button.

	![Absorb LMS in the results list](./media/active-directory-saas-absorblms-tutorial/tutorial_absorblms_addfromgallery.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Absorb LMS based on a test user called Britta Simon.

For single sign-on to work, Azure AD needs to know what the Absorb LMS counterpart user is in Azure AD. In other words, you must establish a link relationship between a user in Azure AD and the corresponding user in Absorb LMS.

You establish this link relationship by assigning the *user name* value in Azure AD as the *Username* value in Absorb LMS.

To configure and test Azure AD single sign-on with Absorb LMS, complete the building blocks in the next five sections.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Absorb LMS application.

To configure Azure AD single sign-on with Absorb LMS, do the following:

1. In the Azure portal, on the **Absorb LMS** application integration page, select **Single sign-on**.

	![Configure single sign-on link][4]

2. In the **Single sign-on** dialog box, In the **Mode** box, select **SAML-based Sign-on** to enable single sign-on.
 
	![Single sign-on dialog box](./media/active-directory-saas-absorblms-tutorial/tutorial_absorblms_samlbase.png)

3. In the **Absorb LMS Domain and URLs** section, do the following:

	![Absorb LMS Domain and URLs single sign-on information](./media/active-directory-saas-absorblms-tutorial/tutorial_absorblms_url.png)

    a. In the **Identifier** box, type a URL that uses the following syntax: `https://<subdomain>.myabsorb.com/Account/SAML`.

	b. In the **Reply URL** box, type a URL that uses the following syntax: `https://<subdomain>.myabsorb.com/Account/SAML`.
	 
	> [!NOTE] 
	> These URLs are not the real values. Update them with the actual Identifier and Reply URLs. To obtain these values, contact the [Absorb LMS client support team](https://www.absorblms.com/support). 

4. In the **SAML Signing Certificate** section, in the **Download** column, select **Metadata XML**, and then save the metadata file to your computer.

	![The signing certificate download link](./media/active-directory-saas-absorblms-tutorial/tutorial_absorblms_certificate.png) 

5. Select **Save**.

	![Configure Single Sign-On Save button](./media/active-directory-saas-absorblms-tutorial/tutorial_general_400.png)
	
6. In the **Absorb LMS Configuration** section, select **Configure Absorb LMS** to open **Configure sign-on** window, and then copy the **Sign-Out URL** in the **Quick Reference section.**

	![The Absorb LMS Configuration pane](./media/active-directory-saas-absorblms-tutorial/tutorial_absorblms_configure.png) 

7. In a new web browser window, sign in to your Absorb LMS company site as an administrator.

8. Select the **Account** button at the top right. 

	![The Account button](./media/active-directory-saas-absorblms-tutorial/1.png)

9. In the Account pane, select **Portal Settings**.

	![The Portal Settings link](./media/active-directory-saas-absorblms-tutorial/2.png)
	
10.	Select the **Users** tab.

	![The Users tab](./media/active-directory-saas-absorblms-tutorial/3.png)

11. On the Single Sign-On configuration page, do the following:

	![The single sign-on configuration page](./media/active-directory-saas-absorblms-tutorial/4.png)

	a. In the **Mode** box, select **Identity Provider Initiated**.

	b. In Notepad, open the certificate that you downloaded from the Azure portal, remove the **---BEGIN CERTIFICATE---** and **---END CERTIFICATE---** tags and then, in the **Key** box, paste the remaining content.
	
	c. In the **Id Property** box, select the attribute that you configured as the user identifier in Azure AD. For example, if *userPrincipalName* is selected in Azure AD, select **Username**.

	d. In the **Login URL** box, paste the **User Access URL** from the application's **Properties** page of the Azure portal.

	e. In the **Logout URL**, paste the **Sign-Out URL** value that you copied from the **Configure sign-on** window of the Azure portal.

12. Toggle **Only Allow SSO Login** to **On**.

	![The Only Allow SSO Login toggle](./media/active-directory-saas-absorblms-tutorial/5.png)

13. Select **Save.**

> [!TIP]
> You can read a concise version of these instructions in the [Azure portal](https://portal.azure.com) while you are setting up the app. After you add the app from the **Active Directory** > **Enterprise Applications** section, select the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. For more information, see [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985).

### Create an Azure AD test user

In this section, you create test user Britta Simon in the Azure portal.

![Create an Azure AD test user][100]

To create a test user in Azure AD, do the following:

1. In the Azure portal, in the left pane, select **Azure Active Directory**.

	![The Azure Active Directory button](./media/active-directory-saas-absorblms-tutorial/create_aaduser_01.png) 

2. To display the list of users, select **Users and groups** > **All users**.
	
	![The "Users and groups" and "All users" links](./media/active-directory-saas-absorblms-tutorial/create_aaduser_02.png) 

3. At the top of the dialog box, select **Add**.
 
	![The Add button](./media/active-directory-saas-absorblms-tutorial/create_aaduser_03.png) 

4. In the **User** dialog box, do the following:
 
	![The User dialog box](./media/active-directory-saas-absorblms-tutorial/create_aaduser_04.png) 

    a. In the **Name** box, type **BrittaSimon**.

    b. In the **User name** textbox, type the email address of Britta Simon.

	c. Select the **Show Password** check box, and then note the value in the **Password** box.

    d. Select **Create**.

### Create an Absorb LMS test user

For Azure AD users to sign in to Absorb LMS, they must be set up in Absorb LMS.  

For Absorb LMS, setup is a manual task.

To set up a user account, do the following:

1. Sign in to your Absorb LMS company site as an administrator.

2. In the left pane, select **Users**.

    ![The Absorb LMS Users link](./media/active-directory-saas-absorblms-tutorial/absorblms_users.png)

3. In the **Users** pane, select **Users**.

    ![The Users link](./media/active-directory-saas-absorblms-tutorial/absorblms_userssub.png)

4. In the **Add New** drop-down list, select **User**.

    ![The Add New drop-down list](./media/active-directory-saas-absorblms-tutorial/absorblms_createuser.png)

5. On the **Add User** page, do the following:

	![The Add User page](./media/active-directory-saas-absorblms-tutorial/user.png)

	a. In the **First Name** box, type the first name, such as **Britta**.

	b. In the **Last Name** box, type the last name, such as **Simon**.
	
	c. In the **Username** box, type a full name, such as **Britta Simon**.

	d. In the **Password** box, type Britta Simon's password.

	e. In the **Confirm Password** box, retype the password.
	
	f. Set the **Is Active** toggle to **Active**.	

6. Select **Save.**
 
### Assign the Azure AD test user

In this section, you enable user Britta Simon to use Azure single sign-on by granting access to Absorb LMS.

![Assign the user role][200]

To assign user Britta Simon to Absorb LMS, do the following:

1. In the Azure portal, open the applications view, go to the directory view, and then select **Enterprise applications** > **All applications**.

	![The "All applications" link][201] 

2. In the **Applications** list, select **Absorb LMS**.

	![The Absorb LMS link in the Applications list](./media/active-directory-saas-absorblms-tutorial/tutorial_absorblms_app.png) 

3. In the left pane, select **Users and groups**.

	![The "Users and groups" link][202] 

4. Select **Add** and then, in the **Add Assignment** pane, select **Users and groups**.

	![The Add Assignment pane][203]

5. In the **Users and groups** dialog box, in the **Users** list, select **Britta Simon**.

6. In the **Users and groups** dialog box, select the **Select** button.

7. In the **Add Assignment** dialog box, select the **Assign** button.
	
### Test single sign-on

In this section, you test your Azure AD single sign-on configuration by using the Access Panel.

In the Access Panel, selecting the **Absorb LMS** tile automatically signs you in to your Absorb LMS application. For more information about the Access Panel, see [Introduction to the Access Panel](https://msdn.microsoft.com/library/dn308586).

## Additional resources

* [List of tutorials on how to integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)



<!--Image references-->

[1]: ./media/active-directory-saas-absorblms-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-absorblms-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-absorblms-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-absorblms-tutorial/tutorial_general_04.png

[100]: ./media/active-directory-saas-absorblms-tutorial/tutorial_general_100.png

[200]: ./media/active-directory-saas-absorblms-tutorial/tutorial_general_200.png
[201]: ./media/active-directory-saas-absorblms-tutorial/tutorial_general_201.png
[202]: ./media/active-directory-saas-absorblms-tutorial/tutorial_general_202.png
[203]: ./media/active-directory-saas-absorblms-tutorial/tutorial_general_203.png


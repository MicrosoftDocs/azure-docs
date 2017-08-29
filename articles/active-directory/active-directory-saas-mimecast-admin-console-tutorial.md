---
title: 'Tutorial: Azure Active Directory integration with Mimecast Admin Console | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Mimecast Admin Console.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila
ms.reviewer: joflore

ms.assetid: 81c50614-f49b-4bbc-97d5-3cf77154305f
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/08/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Mimecast Admin Console

In this tutorial, you learn how to integrate Mimecast Admin Console with Azure Active Directory (Azure AD).

Integrating Mimecast Admin Console with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Mimecast Admin Console.
- You can enable your users to automatically get signed-on to Mimecast Admin Console (Single Sign-On) with their Azure AD accounts.
- You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites

To configure Azure AD integration with Mimecast Admin Console, you need the following items:

- An Azure AD subscription
- A Mimecast Admin Console single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Mimecast Admin Console from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding Mimecast Admin Console from the gallery
To configure the integration of Mimecast Admin Console into Azure AD, you need to add Mimecast Admin Console from the gallery to your list of managed SaaS apps.

**To add Mimecast Admin Console from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![The Azure Active Directory button][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![The Enterprise applications blade][2]
	
3. To add new application, click **New application** button on the top of dialog.

	![The New application button][3]

4. In the search box, type **Mimecast Admin Console**, select **Mimecast Admin Console** from result panel then click **Add** button to add the application.

	![Mimecast Admin Console in the results list](./media/active-directory-saas-mimecast-admin-console-tutorial/tutorial_mimecastadminconsole_addfromgallery.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Mimecast Admin Console based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Mimecast Admin Console is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Mimecast Admin Console needs to be established.

In Mimecast Admin Console, assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with Mimecast Admin Console, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Create a Mimecast Admin Console test user](#create-a-mimecast-admin-console-test-user)** - to have a counterpart of Britta Simon in Mimecast Admin Console that is linked to the Azure AD representation of user.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Mimecast Admin Console application.

**To configure Azure AD single sign-on with Mimecast Admin Console, perform the following steps:**

1. In the Azure portal, on the **Mimecast Admin Console** application integration page, click **Single sign-on**.

	![Configure single sign-on link][4]

2. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Single sign-on dialog box](./media/active-directory-saas-mimecast-admin-console-tutorial/tutorial_mimecastadminconsole_samlbase.png)

3. On the **Mimecast Admin Console Domain and URLs** section, perform the following steps:

	![Mimecast Admin Console Domain and URLs single sign-on information](./media/active-directory-saas-mimecast-admin-console-tutorial/tutorial_mimecastadminconsole_url.png)

    In the **Sign-on URL** textbox, type the URL:
	| |
	| -- |
	| `https://webmail-uk.mimecast.com`|
	| `https://webmail-us.mimecast.com`|

	> [!NOTE] 
	> The sign on URL is region specific.

4. On the **SAML Signing Certificate** section, click **Certificate(Base64)** and then save the certificate file on your computer.

	![The Certificate download link](./media/active-directory-saas-mimecast-admin-console-tutorial/tutorial_mimecastadminconsole_certificate.png) 

5. Click **Save** button.

	![Configure Single Sign-On Save button](./media/active-directory-saas-mimecast-admin-console-tutorial/tutorial_general_400.png)

6. On the **Mimecast Admin Console Configuration** section, click **Configure Mimecast Admin Console** to open **Configure sign-on** window. Copy the **SAML Entity ID, and SAML Single Sign-On Service URL** from the **Quick Reference section.**

	![Mimecast Admin Console Configuration](./media/active-directory-saas-mimecast-admin-console-tutorial/tutorial_mimecastadminconsole_configure.png) 

7. In a different web browser window, log into your Mimecast Admin Console as an administrator.

8. Go to **Services \> Application**.

	![Services](./media/active-directory-saas-mimecast-admin-console-tutorial/ic794998.png "Services")

9. Click **Authentication Profiles**.

	![Authentication Profiles](./media/active-directory-saas-mimecast-admin-console-tutorial/ic794999.png "Authentication Profiles")
	
10. Click **New Authentication Profile**.

	![New Authentication Profiles](./media/active-directory-saas-mimecast-admin-console-tutorial/ic795000.png "New Authentication Profiles")

11. In the **Authentication Profile** section, perform the following steps:

	![Authentication Profile](./media/active-directory-saas-mimecast-admin-console-tutorial/ic795015.png "Authentication Profile")
	
	a. In the **Description** textbox, type a name for your configuration.
	
	b. Select **Enforce SAML Authentication for Mimecast Admin Console**.
	
	c. As **Provider**, select **Azure Active Directory**.
	
	d. Paste **SAML Entity ID**, which you have copied from the Azure portal into the **Issuer URL** textbox.
	
	e. Paste **SAML Single Sign-On Service URL**, which you have copied from the Azure portal into the **Login URL** textbox.

	f. Paste **SAML Single Sign-On Service URL**, which you have copied from the Azure portal into the **Logout URL** textbox.
	
	>[!NOTE]
    >The Login URL value and the Logout URL value are for the Mimecast Admin Console the same.
	
	g. Open your base-64 certificate downloaded from Azure portal in notepad, remove the first line (“*--*“) and the last line (“*--*“), copy the remaining content of it into your clipboard, and then paste it to the **Identity Provider Certificate (Metadata)** textbox.
	
	h. Select **Allow Single Sign On**.
	
	i. Click **Save**.

> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985) 

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

   ![Create an Azure AD test user][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the Azure portal, in the left pane, click the **Azure Active Directory** button.

    ![The Azure Active Directory button](./media/active-directory-saas-mimecast-admin-console-tutorial/create_aaduser_01.png)

2. To display the list of users, go to **Users and groups**, and then click **All users**.

    ![The "Users and groups" and "All users" links](./media/active-directory-saas-mimecast-admin-console-tutorial/create_aaduser_02.png)

3. To open the **User** dialog box, click **Add** at the top of the **All Users** dialog box.

    ![The Add button](./media/active-directory-saas-mimecast-admin-console-tutorial/create_aaduser_03.png)

4. In the **User** dialog box, perform the following steps:

    ![The User dialog box](./media/active-directory-saas-mimecast-admin-console-tutorial/create_aaduser_04.png)

    a. In the **Name** box, type **BrittaSimon**.

    b. In the **User name** box, type the email address of user Britta Simon.

    c. Select the **Show Password** check box, and then write down the value that's displayed in the **Password** box.

    d. Click **Create**.
 
### Create a Mimecast Admin Console test user

In order to enable Azure AD users to log into Mimecast Admin Console, they must be provisioned into Mimecast Admin Console. In the case of Mimecast Admin Console, provisioning is a manual task.

* You need to register a domain before you can create users.

**To configure user provisioning, perform the following steps:**

1. Sign on to your **Mimecast Admin Console** as administrator.
2. Go to **Directories \> Internal**.
   
   ![Directories](./media/active-directory-saas-mimecast-admin-console-tutorial/ic795003.png "Directories")
3. Click **Register New Domain**.
   
   ![Register New Domain](./media/active-directory-saas-mimecast-admin-console-tutorial/ic795004.png "Register New Domain")
4. After your new domain has been created, click **New Address**.
   
   ![New Address](./media/active-directory-saas-mimecast-admin-console-tutorial/ic795005.png "New Address")
5. In the new address dialog, perform the following steps:
   
   ![Save](./media/active-directory-saas-mimecast-admin-console-tutorial/ic795006.png "Save")
   
   a. Type the **Email Address**, **Global Name**, **Password**, and **Confirm Password** attributes of a valid Azure AD account you want to provision into the related textboxes.

   b. Click **Save**.

>[!NOTE]
>You can use any other Mimecast Admin Console user account creation tools or APIs provided by Mimecast Admin Console to provision Azure AD user accounts. 

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Mimecast Admin Console.

![Assign the user role][200] 

**To assign Britta Simon to Mimecast Admin Console, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

2. In the applications list, select **Mimecast Admin Console**.

	![The Mimecast Admin Console link in the Applications list](./media/active-directory-saas-mimecast-admin-console-tutorial/tutorial_mimecastadminconsole_app.png)  

3. In the menu on the left, click **Users and groups**.

	![The "Users and groups" link][202]

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![The Add Assignment pane][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.
	
### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Mimecast Admin Console tile in the Access Panel, you should get automatically signed-on to your Mimecast Admin Console application.
For more information about the Access Panel, see [Introduction to the Access Panel](active-directory-saas-access-panel-introduction.md). 

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)

<!--Image references-->

[1]: ./media/active-directory-saas-mimecast-admin-console-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-mimecast-admin-console-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-mimecast-admin-console-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-mimecast-admin-console-tutorial/tutorial_general_04.png

[100]: ./media/active-directory-saas-mimecast-admin-console-tutorial/tutorial_general_100.png

[200]: ./media/active-directory-saas-mimecast-admin-console-tutorial/tutorial_general_200.png
[201]: ./media/active-directory-saas-mimecast-admin-console-tutorial/tutorial_general_201.png
[202]: ./media/active-directory-saas-mimecast-admin-console-tutorial/tutorial_general_202.png
[203]: ./media/active-directory-saas-mimecast-admin-console-tutorial/tutorial_general_203.png


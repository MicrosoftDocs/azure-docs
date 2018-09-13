---
title: 'Tutorial: Azure Active Directory integration with Rollbar | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Rollbar.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila
ms.reviewer: joflore

ms.assetid: 57537e54-9388-4272-a610-805ce45a451f
ms.service: active-directory
ms.component: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 1/04/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Rollbar

In this tutorial, you learn how to integrate Rollbar with Azure Active Directory (Azure AD).

Integrating Rollbar with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Rollbar.
- You can enable your users to automatically get signed-on to Rollbar (Single Sign-On) with their Azure AD accounts.
- You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Azure AD integration with Rollbar, you need the following items:

- An Azure AD subscription
- A Rollbar single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Rollbar from the gallery
1. Configuring and testing Azure AD single sign-on

## Adding Rollbar from the gallery
To configure the integration of Rollbar into Azure AD, you need to add Rollbar from the gallery to your list of managed SaaS apps.

**To add Rollbar from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![The Azure Active Directory button][1]

1. Navigate to **Enterprise applications**. Then go to **All applications**.

	![The Enterprise applications blade][2]
	
1. To add new application, click **New application** button on the top of dialog.

	![The New application button][3]

1. In the search box, type **Rollbar**, select **Rollbar** from result panel then click **Add** button to add the application.

	![Rollbar in the results list](./media/rollbar-tutorial/tutorial_rollbar_addfromgallery.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Rollbar based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Rollbar is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Rollbar needs to be established.

In Rollbar, assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with Rollbar, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
1. **[Create a Rollbar test user](#create-a-rollbar-test-user)** - to have a counterpart of Britta Simon in Rollbar that is linked to the Azure AD representation of user.
1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
1. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Rollbar application.

**To configure Azure AD single sign-on with Rollbar, perform the following steps:**

1. In the Azure portal, on the **Rollbar** application integration page, click **Single sign-on**.

	![Configure single sign-on link][4]

1. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Single sign-on dialog box](./media/rollbar-tutorial/tutorial_rollbar_samlbase.png)

1. On the **Rollbar Domain and URLs** section, perform the following steps if you wish to configure the application in **IDP** initiated mode:

	![Rollbar Domain and URLs single sign-on information](./media/rollbar-tutorial/tutorial_rollbar_url.png)

    a. In the **Identifier** textbox, type the URL: `https://saml.rollbar.com`

	b. In the **Reply URL** textbox, type a URL using the following pattern: `https://rollbar.com/<accountname>/saml/sso/azure/`

1. Check **Show advanced URL settings** and perform the following step if you wish to configure the application in **SP** initiated mode:

	![Rollbar Domain and URLs single sign-on information](./media/rollbar-tutorial/tutorial_rollbar_url1.png)

    In the **Sign-on URL** textbox, type a URL using the following pattern: `https://rollbar.com/<accountname>/saml/login/azure/`
	 
	> [!NOTE] 
	> These values are not real. Update these values with the actual Reply URL and Sign-On URL. Contact [Rollbar Client support team](mailto:support@rollbar.com) to get these values. 

1. On the **SAML Signing Certificate** section, click **Metadata XML** and then save the metadata file on your computer.

	![The Certificate download link](./media/rollbar-tutorial/tutorial_rollbar_certificate.png) 

1. Click **Save** button.

	![Configure Single Sign-On Save button](./media/rollbar-tutorial/tutorial_general_400.png)
	
1. In a different web browser window, log in to your Rollbar company site as an administrator.

1. Click on the **Profile Settings** on the right top corner and then click **Account Name settings**.
	
	![Configuration](./media/rollbar-tutorial/general.png)

1. Click **Identity Provider** under SECURITY.

	![Configuration](./media/rollbar-tutorial/configure1.png)

1. In the **SAML Identity Provider** section, perform the following steps:
	
	![Configuration](./media/rollbar-tutorial/configure2.png)

	a. Select **AZURE** from the **SAML Identity Provider** dropdown.

	b. Open your metadata file in notepad, copy the content of it into your clipboard, and then paste it to the **SAML Metadata** textbox.

	c. Click **Save**.

1. After clicking the save button, the screen will be like this:
	
	![Configuration](./media/rollbar-tutorial/configure3.png)
	> [!NOTE] 
	> In order to complete the following step, you must first add yourself as a user to the Rollbar app in Azure.
	a. If you want to require all users to authenticate via Azure, then click **log in via your identity provider** to re-authenticate via Azure.  

	b.  Once you're returned to the screen, select the **Require login via SAML Identity Provider** checkbox.

	b. Click **Save**.

> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

   ![Create an Azure AD test user][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the Azure portal, in the left pane, click the **Azure Active Directory** button.

    ![The Azure Active Directory button](./media/rollbar-tutorial/create_aaduser_01.png)

1. To display the list of users, go to **Users and groups**, and then click **All users**.

    ![The "Users and groups" and "All users" links](./media/rollbar-tutorial/create_aaduser_02.png)

1. To open the **User** dialog box, click **Add** at the top of the **All Users** dialog box.

    ![The Add button](./media/rollbar-tutorial/create_aaduser_03.png)

1. In the **User** dialog box, perform the following steps:

    ![The User dialog box](./media/rollbar-tutorial/create_aaduser_04.png)

    a. In the **Name** box, type **BrittaSimon**.

    b. In the **User name** box, type the email address of user Britta Simon.

    c. Select the **Show Password** check box, and then write down the value that's displayed in the **Password** box.

    d. Click **Create**.
 
### Create a Rollbar test user

To enable Azure AD users to log in to Rollbar, they must be provisioned into Rollbar. In the case of Rollbar, provisioning is a manual task.

**To provision a user account, perform the following steps:**

1. Log in to your Rollbar company site as an administrator.

1. Click on the **Profile Settings** on the right top corner and then click **Account Name settings**.

	![User](./media/rollbar-tutorial/general.png)

1. Click **Users**.
	
	![Add Employee](./media/rollbar-tutorial/user1.png)

1. Click **Invite Team Members**.

	![Invite People](./media/rollbar-tutorial/user2.png)

1. In the textbox, enter the name of user like **brittasimon@contoso.com** and the click **Add/Invite**.

	![Invite People](./media/rollbar-tutorial/user3.png)

1. User receives an invitation and after accepting it he/she created in the system.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Rollbar.

![Assign the user role][200] 

**To assign Britta Simon to Rollbar, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

1. In the applications list, select **Rollbar**.

	![The Rollbar link in the Applications list](./media/rollbar-tutorial/tutorial_rollbar_app.png)  

1. In the menu on the left, click **Users and groups**.

	![The "Users and groups" link][202]

1. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![The Add Assignment pane][203]

1. On **Users and groups** dialog, select **Britta Simon** in the Users list.

1. Click **Select** button on **Users and groups** dialog.

1. Click **Assign** button on **Add Assignment** dialog.
	
### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Rollbar tile in the Access Panel, you should get automatically signed-on to your Rollbar application.
For more information about the Access Panel, see [Introduction to the Access Panel](../user-help/active-directory-saas-access-panel-introduction.md). 

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)



<!--Image references-->

[1]: ./media/rollbar-tutorial/tutorial_general_01.png
[2]: ./media/rollbar-tutorial/tutorial_general_02.png
[3]: ./media/rollbar-tutorial/tutorial_general_03.png
[4]: ./media/rollbar-tutorial/tutorial_general_04.png

[100]: ./media/rollbar-tutorial/tutorial_general_100.png

[200]: ./media/rollbar-tutorial/tutorial_general_200.png
[201]: ./media/rollbar-tutorial/tutorial_general_201.png
[202]: ./media/rollbar-tutorial/tutorial_general_202.png
[203]: ./media/rollbar-tutorial/tutorial_general_203.png


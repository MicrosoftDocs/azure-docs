---
title: 'Tutorial: Azure Active Directory integration with Peoplecart | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Peoplecart.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: joflore

ms.assetid: c83b5d9d-2638-4689-b9f0-f56a9159e7a0
ms.service: active-directory
ms.component: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/19/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Peoplecart

In this tutorial, you learn how to integrate Peoplecart with Azure Active Directory (Azure AD).

Integrating Peoplecart with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Peoplecart
- You can enable your users to automatically get signed-on to Peoplecart (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure portal

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Azure AD integration with Peoplecart, you need the following items:

- An Azure AD subscription
- A Peoplecart single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Peoplecart from the gallery
1. Configuring and testing Azure AD single sign-on

## Adding Peoplecart from the gallery
To configure the integration of Peoplecart into Azure AD, you need to add Peoplecart from the gallery to your list of managed SaaS apps.

**To add Peoplecart from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![The Azure Active Directory button][1]

1. Navigate to **Enterprise applications**. Then go to **All applications**.

	![The Enterprise applications blade][2]
	
1. To add new application, click **New application** button on the top of dialog.

	![The New application button][3]

1. In the search box, type **Peoplecart**, select **Peoplecart** from result panel then click **Add** button to add the application.

	![Peoplecart in the results list](./media/peoplecart-tutorial/tutorial_peoplecart_addfromgallery.png)

##  Configure and test Azure AD single sign-on
In this section, you configure and test Azure AD single sign-on with Peoplecart based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Peoplecart is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Peoplecart needs to be established.

In Peoplecart, assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with Peoplecart, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
1. **[Create a Peoplecart test user](#create-a-peoplecart-test-user)** - to have a counterpart of Britta Simon in Peoplecart that is linked to the Azure AD representation of user.
1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
1. **[Test Single Sign-On](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Peoplecart application.

**To configure Azure AD single sign-on with Peoplecart, perform the following steps:**

1. In the Azure portal, on the **Peoplecart** application integration page, click **Single sign-on**.

	![Configure Single Sign-On][4]

1. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Configure Single Sign-On](./media/peoplecart-tutorial/tutorial_peoplecart_samlbase.png)

1. On the **Peoplecart Domain and URLs** section, perform the following steps:

	![Peoplecart Domain and URLs single sign-on information](./media/peoplecart-tutorial/tutorial_peoplecart_url.png)

    a. In the **Sign-on URL** textbox, type a URL using the following pattern: `https://<tenantname>.peoplecart.com/SignIn.aspx`

	b. In the **Identifier** textbox, type a URL using the following pattern: `https://<tenantname>.peoplecart.com`

	> [!NOTE] 
	> These values are not real. Update these values with the actual Sign-On URL, and Identifier. Contact [Peoplecart Client support team](https://peoplecart.com/ContactUs.aspx) to get these values. 
 
1. On the **SAML Signing Certificate** section, click **Metadata XML** and then save the metadata file on your computer.

	![The Certificate download link](./media/peoplecart-tutorial/tutorial_peoplecart_certificate.png) 

1. Click **Save** button.

	![Configure Single Sign-On Save button](./media/peoplecart-tutorial/tutorial_general_400.png)

1. On the **Peoplecart Configuration** section, click **Configure Peoplecart** to open **Configure sign-on** window. Copy the **SAML Single Sign-On Service URL** from the **Quick Reference section.**

	![Peoplecart Configuration](./media/peoplecart-tutorial/tutorial_peoplecart_configure.png) 

1. To configure single sign-on on **Peoplecart** side, you need to send the downloaded **Metadata XML** and **SAML Single Sign-On Service URL** to [Peoplecart support team](https://peoplecart.com/ContactUs.aspx). They set this setting to have the SAML SSO connection set properly on both sides.

> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)
> 

### Create an Azure AD test user
The objective of this section is to create a test user in the Azure portal called Britta Simon.

![Create an Azure AD test user][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure portal**, on the left navigation pane, click **Azure Active Directory** icon.

	![The Azure Active Directory button](./media/peoplecart-tutorial/create_aaduser_01.png) 

1. To display the list of users, go to **Users and groups** and click **All users**.
	
	![The "Users and groups" and "All users" links](./media/peoplecart-tutorial/create_aaduser_02.png) 

1. To open the **User** dialog, click **Add** on the top of the dialog.
 
	![The Add button](./media/peoplecart-tutorial/create_aaduser_03.png) 

1. On the **User** dialog page, perform the following steps:
 
	![The User dialog box](./media/peoplecart-tutorial/create_aaduser_04.png) 

    a. In the **Name** textbox, type **BrittaSimon**.

    b. In the **User name** textbox, type the **email address** of BrittaSimon.

	c. Select **Show Password** and write down the value of the **Password**.

    d. Click **Create**.
 
### Create a Peoplecart test user

In this section, you create a user called Britta Simon in Peoplecart. Work with [Peoplecart support team](https://peoplecart.com/ContactUs.aspx) to add the users in the Peoplecart platform. Users must be created and activated before you use single sign-on. 

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Peoplecart.

![Assign the user role][200] 

**To assign Britta Simon to Peoplecart, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

1. In the applications list, select **Peoplecart**.

	![The Peoplecart link in the Applications list](./media/peoplecart-tutorial/tutorial_peoplecart_app.png) 

1. In the menu on the left, click **Users and groups**.

	![The "Users and groups" link][202] 

1. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![The Add Assignment pane][203]

1. On **Users and groups** dialog, select **Britta Simon** in the Users list.

1. Click **Select** button on **Users and groups** dialog.

1. Click **Assign** button on **Add Assignment** dialog.
	
### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Peoplecart tile in the Access Panel, you should get login page of Peoplecart application.
For more information about the Access Panel, see [Introduction to the Access Panel](../user-help/active-directory-saas-access-panel-introduction.md).

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)



<!--Image references-->

[1]: ./media/peoplecart-tutorial/tutorial_general_01.png
[2]: ./media/peoplecart-tutorial/tutorial_general_02.png
[3]: ./media/peoplecart-tutorial/tutorial_general_03.png
[4]: ./media/peoplecart-tutorial/tutorial_general_04.png

[100]: ./media/peoplecart-tutorial/tutorial_general_100.png

[200]: ./media/peoplecart-tutorial/tutorial_general_200.png
[201]: ./media/peoplecart-tutorial/tutorial_general_201.png
[202]: ./media/peoplecart-tutorial/tutorial_general_202.png
[203]: ./media/peoplecart-tutorial/tutorial_general_203.png


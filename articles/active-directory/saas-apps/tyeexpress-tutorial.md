---
title: 'Tutorial: Azure Active Directory integration with T&E Express | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and T&E Express.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman

ms.assetid: B42374E5-2559-4309-8EF2-820BEE7EBB0C
ms.service: active-directory
ms.component: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/03/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with T&E Express

In this tutorial, you learn how to integrate T&E Express with Azure Active Directory (Azure AD).

Integrating T&E Express with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to T&E Express
- You can enable your users to automatically get signed-on to T&E Express (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure Management portal

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Azure AD integration with T&E Express, you need the following items:

- An Azure AD subscription
- A T&E Express single-sign on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- You should not use your production environment, unless this is necessary.
- If you don't have an Azure AD trial environment, you can get a one-month trial [here](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding T&E Express from the gallery
1. Configuring and testing Azure AD single sign-on

## Adding T&E Express from the gallery
To configure the integration of T&E Express into Azure AD, you need to add T&E Express from the gallery to your list of managed SaaS apps.

**To add T&E Express from the gallery, perform the following steps:**

1. In the **[Azure Management Portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![Active Directory][1]

1. Navigate to **Enterprise applications**. Then go to **All applications**.

	![Applications][2]
	
1. Click **Add** button on the top of the dialog.

	![Applications][3]

1. In the search box, type **T&E Express**.

	![Creating an Azure AD test user](./media/tyeexpress-tutorial/tutorial_tyeexpress_search.png)

1. In the results panel, select **T&E Express**, and then click **Add** button to add the application.

	![Creating an Azure AD test user](./media/tyeexpress-tutorial/tutorial_tyeexpress_addfromgallery.png)

##  Configuring and testing Azure AD single sign-on
In this section, you configure and test Azure AD single sign-on with T&E Express based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in T&E Express is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in T&E Express needs to be established.

This link relationship is established by assigning the value of the **user name** in Azure AD as the value of the **Username** in T&E Express.

To configure and test Azure AD single sign-on with T&E Express, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on)** - to enable your users to use this feature.
1. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
1. **[Creating a T&E Express test user](#creating-a-te-express-test-user)** - to have a counterpart of Britta Simon in T&E Express that is linked to the Azure AD representation of her.
1. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
1. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure Management portal and configure single sign-on in your T&E Express application.

**To configure Azure AD single sign-on with T&E Express, perform the following steps:**

1. In the Azure Management portal, on the **T&E Express** application integration page, click **Single sign-on**.

	![Configure Single Sign-On][4]

1. On the **Single sign-on** dialog, as **Mode** select **SAML-based Sign-on** to enable single sign on.
 
	![Configure Single Sign-On](./media/tyeexpress-tutorial/tutorial_tyeexpress_samlbase.png)

1. On the **T&E Express Domain and URLs** section, perform the following steps:

	![Configure Single Sign-On](./media/tyeexpress-tutorial/tutorial_tyeexpress_url.png)

    a. In the **Identifier** textbox, type the value as: `https://<domain>.tyeexpress.com`

	b. In the **Reply URL** textbox, type a URL using the following pattern: `https://<domain>.tyeexpress.com/authorize/samlConsume.aspx`

	> [!NOTE] 
	> Please note that these are not the real values. You have to update these values with the actual Identifier and Reply URL. Here we suggest you to use the unique value of string in the Identifier. Contact [T&E Express support team](http://www.tyeexpress.com/contacto.aspx) to get these values.

1. On the **SAML Signing Certificate** section, click **Metadata XML** and then save the XML file on your computer.

	![Configure Single Sign-On](./media/tyeexpress-tutorial/tutorial_tyeexpress_certificate.png) 

1. Click **Save** button.

	![Configure Single Sign-On](./media/tyeexpress-tutorial/tutorial_general_400.png)

1. To configure single sign-on on **T&E Express** side, login to the T&E express application without SAML single sign on using admin credentials.

1. Under the **Admin** Tab, Click on **SAML domain** to Open the SAML settings page.

	![Configure Single Sign-On](./media/tyeexpress-tutorial/tye-SAML.png)

1. Select the **Activar(Activate)** option from **No** to **SI(Yes)**. In the **Identity Provider Metadata** textbox, paste the metadata XML which you have donwloaded from Azure portal.

	![Configure Single Sign-On](./media/tyeexpress-tutorial/tyeAdmin.png)

1. Click on the **Guardar(Save)** button to save the settings.	


### Creating an Azure AD test user
The objective of this section is to create a test user in the Azure Management portal called Britta Simon.

![Create Azure AD User][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure Management portal**, on the left navigation pane, click **Azure Active Directory** icon.

	![Creating an Azure AD test user](./media/tyeexpress-tutorial/create_aaduser_01.png) 

1. Go to **Users and groups** and click **All users** to display the list of users.
	
	![Creating an Azure AD test user](./media/tyeexpress-tutorial/create_aaduser_02.png) 

1. At the top of the dialog click **Add** to open the **User** dialog.
 
	![Creating an Azure AD test user](./media/tyeexpress-tutorial/create_aaduser_03.png) 

1. On the **User** dialog page, perform the following steps:
 
	![Creating an Azure AD test user](./media/tyeexpress-tutorial/create_aaduser_04.png) 

    a. In the **Name** textbox, type **BrittaSimon**.

    b. In the **User name** textbox, type the **email address** of BrittaSimon.

	c. Select **Show Password** and write down the value of the **Password**.

    d. Click **Create**.
 
### Creating a T&E Express test user

In order to enable Azure AD users to log into T&E Express, they must be provisioned into T&E Express.  
In case of T&E Express, provisioning is a manual task.

**To provision a user accounts, perform the following steps:**

1. Log in to your T&E Express company site as an administrator.

1. Under Admin tag, click on Users to open the Users master page.

    ![Add Employee](./media/tyeexpress-tutorial/tye-adminusers.png)

1. On the home page, click on **+** to add the users.

	![Add Employee](./media/tyeexpress-tutorial/tye-usershome.png)

1. Enter all the mandatory details as asked in the form and click the save button to save the details.

	![Add Employee](./media/tyeexpress-tutorial/tye-usersadd.png)

	![Add Employee](./media/tyeexpress-tutorial/tye-userssave.png)


### Assigning the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting her access to T&E Express.

![Assign User][200] 

**To assign Britta Simon to T&E Express, perform the following steps:**

1. In the Azure Management portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

1. In the applications list, select **T&E Express**.

	![Configure Single Sign-On](./media/tyeexpress-tutorial/tutorial_tyeexpress_app.png) 

1. In the menu on the left, click **Users and groups**.

	![Assign User][202] 

1. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![Assign User][203]

1. On **Users and groups** dialog, select **Britta Simon** in the Users list.

1. Click **Select** button on **Users and groups** dialog.

1. Click **Assign** button on **Add Assignment** dialog.
	
### Testing single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the T&E Express tile in the Access Panel, you should get automatically signed-on to your T&E Express application.

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)



<!--Image references-->

[1]: ./media/tyeexpress-tutorial/tutorial_general_01.png
[2]: ./media/tyeexpress-tutorial/tutorial_general_02.png
[3]: ./media/tyeexpress-tutorial/tutorial_general_03.png
[4]: ./media/tyeexpress-tutorial/tutorial_general_04.png

[100]: ./media/tyeexpress-tutorial/tutorial_general_100.png

[200]: ./media/tyeexpress-tutorial/tutorial_general_200.png
[201]: ./media/tyeexpress-tutorial/tutorial_general_201.png
[202]: ./media/tyeexpress-tutorial/tutorial_general_202.png
[203]: ./media/tyeexpress-tutorial/tutorial_general_203.png


---
title: 'Tutorial: Azure Active Directory integration with Showpad | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Showpad.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman

ms.assetid: 48b6bee0-dbc5-4863-964d-75b25e517741
ms.service: active-directory
ms.component: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/12/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Showpad

In this tutorial, you learn how to integrate Showpad with Azure Active Directory (Azure AD).

Integrating Showpad with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Showpad
- You can enable your users to automatically get signed-on to Showpad (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure portal

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Azure AD integration with Showpad, you need the following items:

- An Azure AD subscription
- A Showpad single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can get a one-month trial [here](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Showpad from the gallery
1. Configuring and testing Azure AD single sign-on

## Adding Showpad from the gallery

To configure the integration of Showpad into Azure AD, you need to add Showpad from the gallery to your list of managed SaaS apps.

**To add Showpad from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![Active Directory][1]

1. Navigate to **Enterprise applications**. Then go to **All applications**.

	![Applications][2]
	
1. To add new application, click **New application** button on the top of dialog.

	![Applications][3]

1. In the search box, type **Showpad**.

	![Creating an Azure AD test user](./media/showpad-tutorial/tutorial_showpad_search.png)

1. In the results panel, select **Showpad**, and then click **Add** button to add the application.

	![Creating an Azure AD test user](./media/showpad-tutorial/tutorial_showpad_addfromgallery.png)

##  Configuring and testing Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Showpad based on a test user called "Britta Simon."

For single sign-on to work, Azure AD needs to know what the counterpart user in Showpad is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Showpad needs to be established.

In Showpad, assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with Showpad, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on)** - to enable your users to use this feature.
1. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
1. **[Creating a Showpad test user](#creating-a-showpad-test-user)** - to have a counterpart of Britta Simon in Showpad that is linked to the Azure AD representation of user.
1. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
1. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Showpad application.

**To configure Azure AD single sign-on with Showpad, perform the following steps:**

1. In the Azure portal, on the **Showpad** application integration page, click **Single sign-on**.

	![Configure Single Sign-On][4]

1. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Configure Single Sign-On](./media/showpad-tutorial/tutorial_showpad_samlbase.png)

1. On the **Showpad Domain and URLs** section, perform the following steps:

	![Configure Single Sign-On](./media/showpad-tutorial/tutorial_showpad_url.png)

    a. In the **Sign-on URL** textbox, type a URL using the following pattern: `https://<comapany-name>.showpad.biz/login`

	b. In the **Identifier** textbox, type a URL using the following pattern: `https://<company-name>.showpad.biz`

	> [!NOTE] 
	> These values are not real. Update these values with the actual Sign-On URL and Identifier. Contact [Showpad support team](https://help.showpad.com) to get these values. 
 


1. On the **SAML Signing Certificate** section, click **Metadata XML** and then save the metadata file on your computer.

	![Configure Single Sign-On](./media/showpad-tutorial/tutorial_showpad_certificate.png) 

1. Click **Save** button.

	![Configure Single Sign-On](./media/showpad-tutorial/tutorial_general_400.png)

1. Sign-on to your Showpad tenant as an administrator.

1. In the menu on the top, click the **Settings**.
   
    ![Configure Single Sign-On On App Side](./media/showpad-tutorial/tutorial_showpad_001.png) 

1. Navigate to "**Single Sign-On**" and click "**Enable**."
   
    ![Configure Single Sign-On On App Side](./media/showpad-tutorial/tutorial_showpad_002.png)

1. On the **Add a SAML 2.0 Service** dialog, perform the following steps:
   
    ![Configure Single Sign-On On App Side](./media/showpad-tutorial/tutorial_showpad_003.png) 
   
    a. In the **Name** textbox, type the name of Identifier Provider (for example: your company name).
   
    b. As **Metadata Source**, select **XML**.
   
    c. Copy the content of metadata XML file, which you have downloaded from the Azure portal, and then paste it into the **Metadata XML** textbox.
   
    d. Select **Auto-provision accounts for new users when they log in**.
   
    e. Click **Submit**.

> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)
> 

### Creating an Azure AD test user
The objective of this section is to create a test user in the Azure portal called Britta Simon.

![Create Azure AD User][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure portal**, on the left navigation pane, click **Azure Active Directory** icon.

	![Creating an Azure AD test user](./media/showpad-tutorial/create_aaduser_01.png) 

1. To display the list of users, go to **Users and groups** and click **All users**.
	
	![Creating an Azure AD test user](./media/showpad-tutorial/create_aaduser_02.png) 

1. To open the **User** dialog, click **Add** on the top of the dialog.
 
	![Creating an Azure AD test user](./media/showpad-tutorial/create_aaduser_03.png) 

1. On the **User** dialog page, perform the following steps:
 
	![Creating an Azure AD test user](./media/showpad-tutorial/create_aaduser_04.png) 

    a. In the **Name** textbox, type **BrittaSimon**.

    b. In the **User name** textbox, type the **email address** of BrittaSimon.

	c. Select **Show Password** and write down the value of the **Password**.

    d. Click **Create**.
 
### Creating a Showpad test user

The objective of this section is to create a user called Britta Simon in Showpad. 

Showpad supports just-in-time provisioning. You have enabled provisioning in **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on)**. 

There is no action item for you in this section. 

### Assigning the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Showpad.

![Assign User][200] 

**To assign Britta Simon to Showpad, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

1. In the applications list, select **Showpad**.

	![Configure Single Sign-On](./media/showpad-tutorial/tutorial_showpad_app.png) 

1. In the menu on the left, click **Users and groups**.

	![Assign User][202] 

1. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![Assign User][203]

1. On **Users and groups** dialog, select **Britta Simon** in the Users list.

1. Click **Select** button on **Users and groups** dialog.

1. Click **Assign** button on **Add Assignment** dialog.
	
### Testing single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Showpad tile in the Access Panel, you should get automatically signed-on to Showpad application.
For more information about the Access Panel, see [Introduction to the Access Panel](../user-help/active-directory-saas-access-panel-introduction.md).

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)



<!--Image references-->

[1]: ./media/showpad-tutorial/tutorial_general_01.png
[2]: ./media/showpad-tutorial/tutorial_general_02.png
[3]: ./media/showpad-tutorial/tutorial_general_03.png
[4]: ./media/showpad-tutorial/tutorial_general_04.png

[100]: ./media/showpad-tutorial/tutorial_general_100.png

[200]: ./media/showpad-tutorial/tutorial_general_200.png
[201]: ./media/showpad-tutorial/tutorial_general_201.png
[202]: ./media/showpad-tutorial/tutorial_general_202.png
[203]: ./media/showpad-tutorial/tutorial_general_203.png


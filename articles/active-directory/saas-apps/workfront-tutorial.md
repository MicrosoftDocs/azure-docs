---
title: 'Tutorial: Azure Active Directory integration with Workfront | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Workfront.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman

ms.assetid: aab8bd2f-f9dd-42da-a18e-d707865687d7
ms.service: active-directory
ms.component: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/22/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Workfront

In this tutorial, you learn how to integrate Workfront with Azure Active Directory (Azure AD).

Integrating Workfront with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Workfront
- You can enable your users to automatically get signed-on to Workfront (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure portal

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Azure AD integration with Workfront, you need the following items:

- An Azure AD subscription
- A Workfront single-sign on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can get a one-month trial [here](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Workfront from the gallery
1. Configuring and testing Azure AD single sign-on

## Adding Workfront from the gallery
To configure the integration of Workfront into Azure AD, you need to add Workfront from the gallery to your list of managed SaaS apps.

**To add Workfront from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![Active Directory][1]

1. Navigate to **Enterprise applications**. Then go to **All applications**.

	![Applications][2]
	
1. To add new application, click **New application** button on the top of dialog.

	![Applications][3]

1. In the search box, type **Workfront**.

	![Creating an Azure AD test user](./media/workfront-tutorial/tutorial_workfront_search.png)

1. In the results panel, select **Workfront**, and then click **Add** button to add the application.

	![Creating an Azure AD test user](./media/workfront-tutorial/tutorial_workfront_addfromgallery.png)

##  Configuring and testing Azure AD single sign-on
In this section, you configure and test Azure AD single sign-on with Workfront based on a test user called "Britta Simon."

For single sign-on to work, Azure AD needs to know what the counterpart user in Workfront is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Workfront needs to be established.

In Workfront, assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with Workfront, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on)** - to enable your users to use this feature.
1. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
1. **[Creating a Workfront test user](#creating-a-workfront-test-user)** - to have a counterpart of Britta Simon in Workfront that is linked to the Azure AD representation of user.
1. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
1. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Workfront application.

**To configure Azure AD single sign-on with Workfront, perform the following steps:**

1. In the Azure portal, on the **Workfront** application integration page, click **Single sign-on**.

	![Configure Single Sign-On][4]

1. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Configure Single Sign-On](./media/workfront-tutorial/tutorial_workfront_samlbase.png)

1. On the **Workfront Domain and URLs** section, perform the following steps:

	![Configure Single Sign-On](./media/workfront-tutorial/tutorial_workfront_url.png)

    a. In the **Sign-on URL** textbox, type a URL using the following pattern: `https://<companyname>.attask-ondemand.com`

	b. In the **Identifier** textbox, type a URL using the following pattern: `https://<companyname>.attasksandbox.com/SAML2`

	> [!NOTE] 
	> These values are not real. Update these values with the actual Sign-On URL and Identifier. Contact [Workfront Client support team](https://www.workfront.com/services-and-support) to get these values. 
 
1. On the **SAML Signing Certificate** section, click **Certificate(Base64)** and then save the Certificate file on your computer.

	![Configure Single Sign-On](./media/workfront-tutorial/tutorial_workfront_certificate.png) 

1. Click **Save** button.

	![Configure Single Sign-On](./media/workfront-tutorial/tutorial_general_400.png)

1. On the **Workfront Configuration** section, click **Configure Workfront** to open **Configure sign-on** window. Copy the **Sign-Out URL, and SAML Single Sign-On Service URL** from the **Quick Reference section.**

	![Configure Single Sign-On](./media/workfront-tutorial/tutorial_workfront_configure.png) 

1. Sign-on to your Workfront company site as administrator.

1. Go to **Single Sign On Configuration**.

1. On the **Single Sign-On** dialog, perform the following steps
	
	![Configure Single Sign-On][23]
   
    a. As **Type**, select **SAML 2.0**.
   
    b. Select **Service Provider ID**.
   
    c. Paste the **SAML Single Sign-On Service URL** into the **Login Portal URL** textbox.
   
    d. Paste **Single Sign-Out Service URL** into the **Sign-Out URL** textbox.
   
    e. Paste **Change Password URL** into the **Change Password URL** textbox.
   
    f. Click **Save**.

> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)

### Creating an Azure AD test user
The objective of this section is to create a test user in the Azure portal called Britta Simon.

![Create Azure AD User][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure portal**, on the left navigation pane, click **Azure Active Directory** icon.

	![Creating an Azure AD test user](./media/workfront-tutorial/create_aaduser_01.png) 

1. To display the list of users, go to **Users and groups** and click **All users**.
	
	![Creating an Azure AD test user](./media/workfront-tutorial/create_aaduser_02.png) 

1. To open the **User** dialog, click **Add** on the top of the dialog.
 
	![Creating an Azure AD test user](./media/workfront-tutorial/create_aaduser_03.png) 

1. On the **User** dialog page, perform the following steps:
 
	![Creating an Azure AD test user](./media/workfront-tutorial/create_aaduser_04.png) 

    a. In the **Name** textbox, type **BrittaSimon**.

    b. In the **User name** textbox, type the **email address** of BrittaSimon.

	c. Select **Show Password** and write down the value of the **Password**.

    d. Click **Create**.
 
### Creating a Workfront test user

The objective of this section is to create a user called Britta Simon in Workfront.

**To create a user called Britta Simon in Workfront, perform the following steps:**

1. Sign on to your Workfront company site as administrator.
1. In the menu on the top, click **People**.
1. Click **New Person**. 
1. On the New Person dialog, perform the following steps:
   
    ![Create an Workfront test user][21] 
   
    a. In the **First Name** textbox, type "Britta."
   
    b. In the **Last Name** textbox, type "Simon."
   
    c. In the **Email Address** textbox, type Britta Simon's email address in Azure Active Directory.
   
    d. Click **Add Person**.

### Assigning the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Workfront.

![Assign User][200] 

**To assign Britta Simon to Workfront, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

1. In the applications list, select **Workfront**.

	![Configure Single Sign-On](./media/workfront-tutorial/tutorial_workfront_app.png) 

1. In the menu on the left, click **Users and groups**.

	![Assign User][202] 

1. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![Assign User][203]

1. On **Users and groups** dialog, select **Britta Simon** in the Users list.

1. Click **Select** button on **Users and groups** dialog.

1. Click **Assign** button on **Add Assignment** dialog.
	
### Testing single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Workfront tile in the Access Panel, you should get login page of Workfront application.
For more information about the Access Panel, see [Introduction to the Access Panel](../user-help/active-directory-saas-access-panel-introduction.md). 

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

<!--Image references-->

[1]: ./media/workfront-tutorial/tutorial_general_01.png
[2]: ./media/workfront-tutorial/tutorial_general_02.png
[3]: ./media/workfront-tutorial/tutorial_general_03.png
[4]: ./media/workfront-tutorial/tutorial_general_04.png
[21]:./media/workfront-tutorial/tutorial_attask_08.png
[23]:./media/workfront-tutorial/tutorial_attask_06.png
[100]: ./media/workfront-tutorial/tutorial_general_100.png

[200]: ./media/workfront-tutorial/tutorial_general_200.png
[201]: ./media/workfront-tutorial/tutorial_general_201.png
[202]: ./media/workfront-tutorial/tutorial_general_202.png
[203]: ./media/workfront-tutorial/tutorial_general_203.png


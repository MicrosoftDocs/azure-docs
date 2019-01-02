---
title: 'Tutorial: Azure Active Directory integration with 10,000ft Plans | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and 10,000ft Plans.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman

ms.assetid: b60c955e-8fa3-4872-a897-c4e81fd7beac
ms.service: active-directory
ms.component: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/14/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with 10,000ft Plans

In this tutorial, you learn how to integrate 10,000ft Plans with Azure Active Directory (Azure AD).

Integrating 10,000ft Plans with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to 10,000ft Plans
- You can enable your users to automatically get signed-on to 10,000ft Plans (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure portal

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Azure AD integration with 10,000ft Plans, you need the following items:

- An Azure AD subscription
- A 10,000ft Plans single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can get a one-month trial here [trial offer](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding 10,000ft Plans from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding 10,000ft Plans from the gallery
To configure the integration of 10,000ft Plans into Azure AD, you need to add 10,000ft Plans from the gallery to your list of managed SaaS apps.

**To add 10,000ft Plans from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![Active Directory][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![Applications][2]
	
3. To add new application, click **New application** button on the top of dialog.

	![Applications][3]

4. In the search box, type **10,000ft Plans**.

	![Creating an Azure AD test user](./media/10000ftplans-tutorial/tutorial_10,000ftplans_search.png)

5. In the results panel, select **10,000ft Plans**, and then click **Add** button to add the application.

	![Creating an Azure AD test user](./media/10000ftplans-tutorial/tutorial_10,000ftplans_addfromgallery.png)

##  Configuring and testing Azure AD single sign-on
In this section, you configure and test Azure AD single sign-on with 10,000ft Plans based on a test user called "Britta Simon."

For single sign-on to work, Azure AD needs to know what the counterpart user in 10,000ft Plans is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in 10,000ft Plans needs to be established.

In 10,000ft Plans, assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with 10,000ft Plans, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Creating a 10,000ft Plans test user](#creating-a-10000ft-plans-test-user)** - to have a counterpart of Britta Simon in 10,000ft Plans that is linked to the Azure AD representation of user.
4. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your 10,000ft Plans application.

**To configure Azure AD single sign-on with 10,000ft Plans, perform the following steps:**

1. In the Azure portal, on the **10,000ft Plans** application integration page, click **Single sign-on**.

	![Configure Single Sign-On][4]

2. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Configure Single Sign-On](./media/10000ftplans-tutorial/tutorial_10,000ftplans_samlbase.png)

3. On the **10,000ft Plans Domain and URLs** section, perform the following steps:

	![Configure Single Sign-On](./media/10000ftplans-tutorial/tutorial_10,000ftplans_url.png)

    a. In the **Sign-on URL** textbox, type the URL: `https://app.10000ft.com`

	b. In the **Identifier** textbox, type the URL: `https://app.10000ft.com/saml/metadata`

	> [!NOTE] 
	> The value for **Identifier** is different if you have a custom domain. Contact [10,000ft Plans support team](https://www.10000ft.com/plans/support) to get this value. 
 
4. On the **SAML Signing Certificate** section, click **Certificate(Raw)** and then save the certificate file on your computer.

	![Configure Single Sign-On](./media/10000ftplans-tutorial/tutorial_10,000ftplans_certificate.png) 

5. Click **Save** button.

	![Configure Single Sign-On](./media/10000ftplans-tutorial/tutorial_general_400.png)

6. On the **10,000ft Plans Configuration** section, click **Configure 10,000ft Plans** to open **Configure sign-on** window. Copy the **Sign-Out URL, SAML Entity ID, and SAML Single Sign-On Service URL** from the **Quick Reference section.**

	![Configure Single Sign-On](./media/10000ftplans-tutorial/tutorial_10,000ftplans_configure.png) 

7. To configure single sign-on on **10,000ft Plans** side, you need to send the downloaded **Certificate(Raw), Sign-Out URL, SAML Entity ID, and SAML Single Sign-On Service URL** to [10,000ft Plans support team](https://www.10000ft.com/plans/support).

> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)

### Creating an Azure AD test user
The objective of this section is to create a test user in the Azure portal called Britta Simon.

![Create Azure AD User][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure portal**, on the left navigation pane, click **Azure Active Directory** icon.

	![Creating an Azure AD test user](./media/10000ftplans-tutorial/create_aaduser_01.png) 

2. To display the list of users, go to **Users and groups** and click **All users**.
	
	![Creating an Azure AD test user](./media/10000ftplans-tutorial/create_aaduser_02.png) 

3. To open the **User** dialog, click **Add** on the top of the dialog.
 
	![Creating an Azure AD test user](./media/10000ftplans-tutorial/create_aaduser_03.png) 

4. On the **User** dialog page, perform the following steps:
 
	![Creating an Azure AD test user](./media/10000ftplans-tutorial/create_aaduser_04.png) 

    a. In the **Name** textbox, type **BrittaSimon**.

    b. In the **User name** textbox, type the **email address** of BrittaSimon.

	c. Select **Show Password** and write down the value of the **Password**.

    d. Click **Create**.
 
### Creating a 10,000ft Plans test user

The objective of this section is to create a user called Britta Simon in 10,000ft Plans. 10,000ft Plans supports just-in-time provisioning, which is by default enabled. There is no action item for you in this section. A new user is created during an attempt to access 10,000ft Plans if it doesn't exist yet. 

> [!NOTE]
> If you need to create a user manually, you need to contact the [10,000ft Plans support team](https://www.10000ft.com/plans/support).

### Assigning the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to 10,000ft Plans.

![Assign User][200] 

**To assign Britta Simon to 10,000ft Plans, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

2. In the applications list, select **10,000ft Plans**.

	![Configure Single Sign-On](./media/10000ftplans-tutorial/tutorial_10,000ftplans_app.png) 

3. In the menu on the left, click **Users and groups**.

	![Assign User][202] 

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![Assign User][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.
	
### Testing single sign-on

The objective of this section is to test your Azure AD single sign-on configuration using the Access Panel.  
When you click the 10,000ft Plans tile in the Access Panel, you should get automatically signed-on to your 10,000ft Plans application.
 
## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

<!--Image references-->

[1]: ./media/10000ftplans-tutorial/tutorial_general_01.png
[2]: ./media/10000ftplans-tutorial/tutorial_general_02.png
[3]: ./media/10000ftplans-tutorial/tutorial_general_03.png
[4]: ./media/10000ftplans-tutorial/tutorial_general_04.png

[100]: ./media/10000ftplans-tutorial/tutorial_general_100.png

[200]: ./media/10000ftplans-tutorial/tutorial_general_200.png
[201]: ./media/10000ftplans-tutorial/tutorial_general_201.png
[202]: ./media/10000ftplans-tutorial/tutorial_general_202.png
[203]: ./media/10000ftplans-tutorial/tutorial_general_203.png


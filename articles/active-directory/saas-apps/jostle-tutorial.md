---
title: 'Tutorial: Azure Active Directory integration with Jostle | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Jostle.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman

ms.assetid: 9ca4ca1f-8f68-4225-81a6-1666b486d6a8
ms.service: active-directory
ms.component: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/30/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Jostle

In this tutorial, you learn how to integrate Jostle with Azure Active Directory (Azure AD).

Integrating Jostle with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Jostle
- You can enable your users to automatically get signed-on to Jostle (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure portal

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Azure AD integration with Jostle, you need the following items:

- An Azure AD subscription
- A Jostle single-sign on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can get a one-month trial [here](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment.
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Jostle from the gallery
1. Configuring and testing Azure AD single sign-on

## Adding Jostle from the gallery
To configure the integration of Jostle into Azure AD, you need to add Jostle from the gallery to your list of managed SaaS apps.

**To add Jostle from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![Active Directory][1]

1. Navigate to **Enterprise applications**. Then go to **All applications**.

	![Applications][2]

1. Click **Add** at the top of the window.

	![add_01](./media/jostle-tutorial/add_01.png)

1. In the search box under **Add an application** type **Jostle**.

	![add_02](./media/jostle-tutorial/add_02.png)

1. In the results panel, select **Jostle**, and then click **Add** button to add the application.

	![Creating an Azure AD test user](./media/jostle-tutorial/tutorial_jostle_addfromgallery.png)

##  Configuring and testing Azure AD single sign-on
In this section, you configure and test Azure AD single sign-on with Jostle based on a test user called "Britta Simon."

For single sign-on to work, Azure AD needs to know what the counterpart user in Jostle is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Jostle needs to be established.

In Jostle, assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with Jostle, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on)** - to enable your users to use this feature.
1. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
1. **[Creating a Jostle test user](#creating-a-jostle-test-user)** - to have a counterpart of Britta Simon in Jostle that is linked to the Azure AD representation of user.
1. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
1. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Jostle application.

**To configure Azure AD single sign-on with Jostle, perform the following steps:**

1. In the Azure portal, on the **Jostle** application integration page, click **Single sign-on**.

	![Configure Single Sign-On][4]

1. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.

	![Configure Single Sign-On](./media/jostle-tutorial/tutorial_jostle_samlbase.png)

1. On the **Jostle Domain and URLs** section, perform the following steps:

	![url_01](./media/jostle-tutorial/url_01.png)

  	a. In the **Sign-on URL** textbox, enter: `https://login-prod.jostle.us`

	b. In the **Identifier** textbox, enter: `https://jostle.us`

  	c. Check the box next to **Show advanced URL settings**

	d. In the **Reply URL** textbox, enter: `https://login-prod.jostle.us/saml/SSO/alias/newjostle.us`

1. On the **User Attributes** section, for the **User Identifier** field, enter: `user.userprincipalname`

	![url_02](./media/jostle-tutorial/url_02.png)

1. Click **Save** at the top of the window.

1. Go to **SAML Signing Certificate** and verify that it's set to **Active**. Then click **Metadata XML** to download the metadata file.

	![url_03](./media/jostle-tutorial/url_03.png)

1. To configure single sign-on on Jostle's side, you need to send the downloaded metadata XML to [Jostle support team](mailto:support@jostle.me). They set this setting to have the SAML SSO connection set properly on both sides.

> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)
>

### Creating an Azure AD test user
The objective of this section is to create a test user in the Azure portal called Britta Simon.

![Create Azure AD User][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure portal**, on the left navigation pane, click **Azure Active Directory** icon.

	![Creating an Azure AD test user](./media/jostle-tutorial/create_aaduser_01.png)

1. To display the list of users, go to **Users and groups** and click **All users**.

	![Creating an Azure AD test user](./media/jostle-tutorial/create_aaduser_02.png)

1. To open the **User** dialog, click **Add** on the top of the dialog.

	![Creating an Azure AD test user](./media/jostle-tutorial/create_aaduser_03.png)

1. On the **User** dialog page, perform the following steps:

	![Creating an Azure AD test user](./media/jostle-tutorial/create_aaduser_04.png)

    a. In the **Name** textbox, type **BrittaSimon**.

    b. In the **User name** textbox, type the **email address** of BrittaSimon.

	c. Select **Show Password** and write down the value of the **Password**.

    d. Click **Create**.

### Creating a Jostle test user

In this section, you create a user called Britta Simon in Jostle. If you don't know how to add Britta Simon in Jostle, please contact with [Jostle support team](mailto:support@jostle.me) to add the test user and enable SSO.

> [!NOTE]
> The Azure Active Directory account holder receives an email and follows a link to confirm their account before it becomes active.

### Assigning the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Jostle.

![Assign User][200]

**To assign Britta Simon to Jostle, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201]

1. In the applications list, select **Jostle**.

	![Configure Single Sign-On](./media/jostle-tutorial/tutorial_jostle_app.png)

1. In the menu on the left, click **Users and groups**.

	![Assign User][202]

1. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![Assign User][203]

1. On **Users and groups** dialog, select **Britta Simon** in the Users list.

1. Click **Select** button on **Users and groups** dialog.

1. Click **Assign** button on **Add Assignment** dialog.

### Testing single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Jostle tile in the Access Panel, you should get automatically login page of Jostle application.
For more information about the Access Panel, see [Introduction to the Access Panel](../user-help/active-directory-saas-access-panel-introduction.md).

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)



<!--Image references-->

[1]: ./media/jostle-tutorial/tutorial_general_01.png
[2]: ./media/jostle-tutorial/tutorial_general_02.png
[3]: ./media/jostle-tutorial/tutorial_general_03.png
[4]: ./media/jostle-tutorial/tutorial_general_04.png

[100]: ./media/jostle-tutorial/tutorial_general_100.png

[200]: ./media/jostle-tutorial/tutorial_general_200.png
[201]: ./media/jostle-tutorial/tutorial_general_201.png
[202]: ./media/jostle-tutorial/tutorial_general_202.png
[203]: ./media/jostle-tutorial/tutorial_general_203.png

---
title: 'Tutorial: Azure Active Directory integration with Fieldglass | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Fieldglass.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman

ms.assetid: 2510195f-d5b1-4684-b3da-283fb8619df2
ms.service: active-directory
ms.component: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/18/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Fieldglass

In this tutorial, you learn how to integrate Fieldglass with Azure Active Directory (Azure AD).

Integrating Fieldglass with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Fieldglass
- You can enable your users to automatically get signed-on to Fieldglass (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure portal

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Azure AD integration with Fieldglass, you need the following items:

- An Azure AD subscription
- A Fieldglass single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can get a one-month trial [here](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Fieldglass from the gallery
1. Configuring and testing Azure AD single sign-on

## Adding Fieldglass from the gallery
To configure the integration of Fieldglass into Azure AD, you need to add Fieldglass from the gallery to your list of managed SaaS apps.

**To add Fieldglass from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![Active Directory][1]

1. Navigate to **Enterprise applications**. Then go to **All applications**.

	![Applications][2]
	
1. To add new application, click **New application** button on the top of dialog.

	![Applications][3]

1. In the search box, type **Fieldglass**.

	![Creating an Azure AD test user](./media/fieldglass-tutorial/tutorial_fieldglass_search.png)

1. In the results panel, select **Fieldglass**, and then click **Add** button to add the application.

	![Creating an Azure AD test user](./media/fieldglass-tutorial/tutorial_fieldglass_addfromgallery.png)

##  Configuring and testing Azure AD single sign-on
In this section, you configure and test Azure AD single sign-on with Fieldglass based on a test user called "Britta Simon."

For single sign-on to work, Azure AD needs to know what the counterpart user in Fieldglass is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Fieldglass needs to be established.

In Fieldglass, assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with Fieldglass, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on)** - to enable your users to use this feature.
1. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
1. **[Creating a Fieldglass test user](#creating-a-fieldglass-test-user)** - to have a counterpart of Britta Simon in Fieldglass that is linked to the Azure AD representation of user.
1. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
1. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Fieldglass application.

**To configure Azure AD single sign-on with Fieldglass, perform the following steps:**

1. In the Azure portal, on the **Fieldglass** application integration page, click **Single sign-on**.

	![Configure Single Sign-On][4]

1. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Configure Single Sign-On](./media/fieldglass-tutorial/tutorial_fieldglass_samlbase.png)

1. On the **Fieldglass Domain and URLs** section, perform the following steps:

	![Configure Single Sign-On](./media/fieldglass-tutorial/tutorial_fieldglass_url.png)

    a. In the **Identifier** textbox, type a URL as  `https://www.fieldglass.com` or follow the pattern:  `https://<company name>.fgvms.com`

	b. In the **Reply URL** textbox, type a URL using the following pattern:
	| |
	|--|
	| `https://www.fieldglass.net/<company name>`|
	| `https://<company name>.fgvms.com/<company name>`|

	> [!NOTE] 
	> These values are not real. Update these values with the actual Identifier and Reply URL. Contact [Fieldglass support team](https://www.fieldglass.com/customer-support) to get these values.
 
1. On the **SAML Signing Certificate** section, click **Certificate(Base64)** and then save the certificate file on your computer.

	![Configure Single Sign-On](./media/fieldglass-tutorial/tutorial_fieldglass_certificate.png) 

1. Click **Save** button.

	![Configure Single Sign-On](./media/fieldglass-tutorial/tutorial_general_400.png)

1. On the **Fieldglass Configuration** section, click **Configure Fieldglass** to open **Configure sign-on** window. Copy the **Sign-Out URL and SAML Entity ID** from the **Quick Reference section.**

	![Configure Single Sign-On](./media/fieldglass-tutorial/tutorial_fieldglass_configure.png) 

1. To configure single sign-on on **Fieldglass** side, you need to send the downloaded **Certificate(Base64)** and **Sign-Out URL, SAML Entity ID** to [Fieldglass support team](https://www.fieldglass.com/customer-support). They set this setting to have the SAML SSO connection set properly on both sides.

> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)

### Creating an Azure AD test user
The objective of this section is to create a test user in the Azure portal called Britta Simon.

![Create Azure AD User][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure portal**, on the left navigation pane, click **Azure Active Directory** icon.

	![Creating an Azure AD test user](./media/fieldglass-tutorial/create_aaduser_01.png) 

1. To display the list of users, go to **Users and groups** and click **All users**.
	
	![Creating an Azure AD test user](./media/fieldglass-tutorial/create_aaduser_02.png) 

1. To open the **User** dialog, click **Add** on the top of the dialog.
 
	![Creating an Azure AD test user](./media/fieldglass-tutorial/create_aaduser_03.png) 

1. On the **User** dialog page, perform the following steps:
 
	![Creating an Azure AD test user](./media/fieldglass-tutorial/create_aaduser_04.png) 

    a. In the **Name** textbox, type **BrittaSimon**.

    b. In the **User name** textbox, type the **email address** of BrittaSimon.

	c. Select **Show Password** and write down the value of the **Password**.

    d. Click **Create**.
 
### Creating a Fieldglass test user

The objective of this section is to create a user called Britta Simon in FieldGlass. Please work with your [Fieldglass support team](https://www.fieldglass.com/customer-support) to add the users in the Fieldglass account.

### Assigning the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Fieldglass.

![Assign User][200] 

**To assign Britta Simon to Fieldglass, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

1. In the applications list, select **Fieldglass**.

	![Configure Single Sign-On](./media/fieldglass-tutorial/tutorial_fieldglass_app.png) 

1. In the menu on the left, click **Users and groups**.

	![Assign User][202] 

1. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![Assign User][203]

1. On **Users and groups** dialog, select **Britta Simon** in the Users list.

1. Click **Select** button on **Users and groups** dialog.

1. Click **Assign** button on **Add Assignment** dialog.
	
### Testing single sign-on

The objective of this section is to test your Azure AD single sign-on configuration using the Access Panel.

When you click the Fieldglass tile in the Access Panel, you should get automatically signed-on to your Fieldglass application.

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

<!--Image references-->

[1]: ./media/fieldglass-tutorial/tutorial_general_01.png
[2]: ./media/fieldglass-tutorial/tutorial_general_02.png
[3]: ./media/fieldglass-tutorial/tutorial_general_03.png
[4]: ./media/fieldglass-tutorial/tutorial_general_04.png

[100]: ./media/fieldglass-tutorial/tutorial_general_100.png

[200]: ./media/fieldglass-tutorial/tutorial_general_200.png
[201]: ./media/fieldglass-tutorial/tutorial_general_201.png
[202]: ./media/fieldglass-tutorial/tutorial_general_202.png
[203]: ./media/fieldglass-tutorial/tutorial_general_203.png


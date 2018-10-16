---
title: 'Tutorial: Azure Active Directory integration with Lessonly.com | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Lessonly.com.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman

ms.assetid: 8c9dc6e6-5d85-4553-8a35-c7137064b928
ms.service: active-directory
ms.component: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/23/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Lessonly.com

In this tutorial, you learn how to integrate Lessonly.com with Azure Active Directory (Azure AD).

Integrating Lessonly.com with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Lessonly.com
- You can enable your users to automatically get signed-on to Lessonly.com (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure portal

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Azure AD integration with Lessonly.com, you need the following items:

- An Azure AD subscription
- A Lessonly.com single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can get a one-month trial [here](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Lessonly.com from the gallery
1. Configuring and testing Azure AD single sign-on

## Adding Lessonly.com from the gallery
To configure the integration of Lessonly.com into Azure AD, you need to add Lessonly.com from the gallery to your list of managed SaaS apps.

**To add Lessonly.com from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![Active Directory][1]

1. Navigate to **Enterprise applications**. Then go to **All applications**.

	![Applications][2]
	
1. To add new application, click **New application** button on the top of dialog.

	![Applications][3]

1. In the search box, type **Lessonly.com**.

	![Creating an Azure AD test user](./media/lessonly-tutorial/tutorial_lessonly.com_search.png)

1. In the results panel, select **Lessonly.com**, and then click **Add** button to add the application.

	![Creating an Azure AD test user](./media/lessonly-tutorial/tutorial_lessonly.com_addfromgallery.png)

##  Configuring and testing Azure AD single sign-on
In this section, you configure and test Azure AD single sign-on with Lessonly.com based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Lessonly.com is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Lessonly.com needs to be established.

In Lessonly.com, assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with Lessonly.com, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on)** - to enable your users to use this feature.
1. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
1. **[Creating a Lessonly.com test user](#creating-a-lessonly-test-user)** - to have a counterpart of Britta Simon in Lessonly.com that is linked to the Azure AD representation of user.
1. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
1. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Lessonly.com application.

**To configure Azure AD single sign-on with Lessonly.com, perform the following steps:**

1. In the Azure portal, on the **Lessonly.com** application integration page, click **Single sign-on**.

	![Configure Single Sign-On][4]

1. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Configure Single Sign-On](./media/lessonly-tutorial/tutorial_lessonly.com_samlbase.png)

1. On the **Lessonly.com Domain and URLs** section, perform the following steps:

	![Configure Single Sign-On](./media/lessonly-tutorial/tutorial_lessonly.com_url.png)

    a. In the **Sign-on URL** textbox, type a URL using the following pattern:
	| |
	|--|
	| `https://<companyname>.lessonly.com/signin`|

	>[!NOTE]
	>When referencing a generic name that **companyname** needs to be replaced by an actual name.
	
	b. In the **Identifier** textbox, type a URL using the following pattern:
	| |
	|--|
	| `https://<companyname>.lessonly.com/auth/saml/metadata`|

	> [!NOTE] 
	> These values are not real. Update these values with the actual Sign-On URL and Identifier. Contact [Lessonly.com Client support team](mailto:support@lessonly.com) to get these values. 

1. On the **SAML Signing Certificate** section, click **Certificate(Base64)** and then save the certificate file on your computer.

	![Configure Single Sign-On](./media/lessonly-tutorial/tutorial_lessonly.com_certificate.png)

1. The Lessonly.com application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your **SAML Token Attributes** configuration.The following screenshot shows an example for this.

	![Configure Single Sign-On](./media/lessonly-tutorial/tutorial_lessonly_06.png)
      	   
1. In the **User Attributes** section on the **Single sign-on** dialog, configure SAML token attribute as shown in the preceding image and perform the following steps:

	| Attribute Name   | Attribute Value |
	| ---------------  | ----------------|
	| urn:oid:2.5.4.42 |user.givenname |
	| urn:oid:2.5.4.4  |user.surname |
	| urn:oid:0.9.2342.19200300.100.1.3 |user.mail |
	| urn:oid:1.3.6.1.4.1.5923.1.1.1.10 |user.objectid |

	a. Click **Add attribute** to open the **Add Attribute** dialog.

	![Configure Single Sign-On](./media/lessonly-tutorial/tutorial_attribute_04.png)

	![Configure Single Sign-On](./media/lessonly-tutorial/tutorial_attribute_05.png)

	b. In the **Name** textbox, type the attribute name shown for that row.

	c. From the **Value** list, type the attribute value shown for that row.
	
	d. Click **Ok**.	 

1. Click **Save** button.

	![Configure Single Sign-On](./media/lessonly-tutorial/tutorial_general_400.png)

1. On the **Lessonly.com Configuration** section, click **Configure Lessonly.com** to open **Configure sign-on** window. Copy the **Sign-Out URL, SAML Entity ID, and SAML Single Sign-On Service URL** from the **Quick Reference section.**

	![Configure Single Sign-On](./media/lessonly-tutorial/tutorial_lessonly.com_configure.png)

1. To configure single sign-on on **Lessonly.com** side, you need to send the downloaded **Certificate(Base64)** and **Sign-Out URL, SAML Entity ID, and SAML Single Sign-On Service URL** to [Lessonly.com support team](mailto:support@lessonly.com).

> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)

### Creating an Azure AD test user
The objective of this section is to create a test user in the Azure portal called Britta Simon.

![Create Azure AD User][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure portal**, on the left navigation pane, click **Azure Active Directory** icon.

	![Creating an Azure AD test user](./media/lessonly-tutorial/create_aaduser_01.png) 

1. To display the list of users, go to **Users and groups** and click **All users**.
	
	![Creating an Azure AD test user](./media/lessonly-tutorial/create_aaduser_02.png) 

1. To open the **User** dialog, click **Add** on the top of the dialog.
 
	![Creating an Azure AD test user](./media/lessonly-tutorial/create_aaduser_03.png) 

1. On the **User** dialog page, perform the following steps:
 
	![Creating an Azure AD test user](./media/lessonly-tutorial/create_aaduser_04.png) 

    a. In the **Name** textbox, type **BrittaSimon**.

    b. In the **User name** textbox, type the **email address** of BrittaSimon.

	c. Select **Show Password** and write down the value of the **Password**.

    d. Click **Create**.
 
### Creating a Lessonly.com test user

The objective of this section is to create a user called Britta Simon in Lessonly.com. Lessonly.com supports just-in-time provisioning, which is by default enabled.

There is no action item for you in this section. A new user will be created during an attempt to access Lessonly.com if it doesn't exist yet.

> [!NOTE]
> If you need to create an user manually, you need to contact the [Lessonly.com support team](mailto:support@lessonly.com).

### Assigning the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Lessonly.com.

![Assign User][200] 

**To assign Britta Simon to Lessonly.com, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

1. In the applications list, select **Lessonly.com**.

	![Configure Single Sign-On](./media/lessonly-tutorial/tutorial_lessonly.com_app.png)

1. In the menu on the left, click **Users and groups**.

	![Assign User][202] 

1. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![Assign User][203]

1. On **Users and groups** dialog, select **Britta Simon** in the Users list.

1. Click **Select** button on **Users and groups** dialog.

1. Click **Assign** button on **Add Assignment** dialog.
	
### Testing single sign-on

The objective of this section is to test your Azure AD single sign-on configuration using the Access Panel.

When you click the Lessonly.com tile in the Access Panel, you should get automatically signed-on to your Lessonly.com application.

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

<!--Image references-->

[1]: ./media/lessonly-tutorial/tutorial_general_01.png
[2]: ./media/lessonly-tutorial/tutorial_general_02.png
[3]: ./media/lessonly-tutorial/tutorial_general_03.png
[4]: ./media/lessonly-tutorial/tutorial_general_04.png

[100]: ./media/lessonly-tutorial/tutorial_general_100.png

[200]: ./media/lessonly-tutorial/tutorial_general_200.png
[201]: ./media/lessonly-tutorial/tutorial_general_201.png
[202]: ./media/lessonly-tutorial/tutorial_general_202.png
[203]: ./media/lessonly-tutorial/tutorial_general_203.png


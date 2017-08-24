---
title: 'Tutorial: Azure Active Directory integration with The Funding Portal | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and The Funding Portal.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila

ms.assetid: 4663cc8a-976a-4c6c-b3b4-1e5df9b66744
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/11/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with The Funding Portal

In this tutorial, you learn how to integrate The Funding Portal with Azure Active Directory (Azure AD).

Integrating The Funding Portal with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to The Funding Portal
- You can enable your users to automatically get signed-on to The Funding Portal (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure portal

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites

To configure Azure AD integration with The Funding Portal, you need the following items:

- An Azure AD subscription
- A The Funding Portal single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can get a one-month trial [here](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding The Funding Portal from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding The Funding Portal from the gallery
To configure the integration of The Funding Portal into Azure AD, you need to add The Funding Portal from the gallery to your list of managed SaaS apps.

**To add The Funding Portal from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![Active Directory][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![Applications][2]
	
3. To add new application, click **New application** button on the top of dialog.

	![Applications][3]

4. In the search box, type **The Funding Portal**.

	![Creating an Azure AD test user](./media/active-directory-saas-thefundingportal-tutorial/tutorial_thefundingportal_search.png)

5. In the results panel, select **The Funding Portal**, and then click **Add** button to add the application.

	![Creating an Azure AD test user](./media/active-directory-saas-thefundingportal-tutorial/tutorial_thefundingportal_addfromgallery.png)

##  Configuring and testing Azure AD single sign-on
In this section, you configure and test Azure AD single sign-on with The Funding Portal based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in The Funding Portal is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in The Funding Portal needs to be established.

In The Funding Portal, assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with The Funding Portal, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Creating The Funding Portal test user](#creating-the-funding-portal-test-user)** - to have a counterpart of Britta Simon in The Funding Portal that is linked to the Azure AD representation of user.
4. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your The Funding Portal application.

**To configure Azure AD single sign-on with The Funding Portal, perform the following steps:**

1. In the Azure portal, on the **The Funding Portal** application integration page, click **Single sign-on**.

	![Configure Single Sign-On][4]

2. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Configure Single Sign-On](./media/active-directory-saas-thefundingportal-tutorial/tutorial_thefundingportal_samlbase.png)

3. On the **The Funding Portal Domain and URLs** section, perform the following steps:

	![Configure Single Sign-On](./media/active-directory-saas-thefundingportal-tutorial/tutorial_thefundingportal_url.png)

    a. In the **Sign-on URL** textbox, type a URL using the following pattern: `https://<subdomain>.regenteducation.net/`

	b. In the **Identifier** textbox, type a URL using the following pattern: `https://<subdomain>.regenteducation.net`

	> [!NOTE] 
	> These values are not real. Update these values with the actual Sign-On URL and Identifier. Contact [The Funding Portal Client support team](mailto:info@regenteducation.com) to get these values. 

4. The Funding Portal application expects the SAML assertions to contain an attribute named "externalId1". The value of "externalId1" should be a recognized studentID. Configure the "externalId1" claim for this application. You can manage the values of these attributes from the **User Attributes** of the application. The following screenshot shows an example for this.

	![Configure Single Sign-On](./media/active-directory-saas-thefundingportal-tutorial/tutorial_thefundingportal_attribute.png)

5. In the **User Attributes** section on the **Single sign-on** dialog, configure SAML token attribute as shown in the image and perform the following steps:

	| Attribute Name | Attribute Value |
	| ------------------- | ---------------- |
	| externalId1 | user.extensionattribute1 |

	a. Click **Add attribute** to open the **Add Attribute** dialog.

	![Configure Single Sign-On](./media/active-directory-saas-thefundingportal-tutorial/tutorial_attribute_04.png)

	![Configure Single Sign-On](./media/active-directory-saas-thefundingportal-tutorial/tutorial_attribute_05.png)

	b. In the **Name** textbox, type the attribute name shown for that row.

	c. From the **Attribute Value** list, select the attribute you want to use for your implementation. For example, if you have stored the StudentID value in the ExtensionAttribute1, then select user.extensionattribute1.
	
	d. Click **Ok**.
 
6. On the **SAML Signing Certificate** section, click **Metadata XML** and then save the metadata file on your computer.

	![Configure Single Sign-On](./media/active-directory-saas-thefundingportal-tutorial/tutorial_thefundingportal_certificate.png) 

7. Click **Save** button.

	![Configure Single Sign-On](./media/active-directory-saas-thefundingportal-tutorial/tutorial_general_400.png)

8. To configure single sign-on on **The Funding Portal** side, you need to send the downloaded **Metadata XML** to [The Funding Portal support team](mailto:info@regenteducation.com). They set this setting to have the SAML SSO connection set properly on both sides.

> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)
> 

### Creating an Azure AD test user
The objective of this section is to create a test user in the Azure portal called Britta Simon.

![Create Azure AD User][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure portal**, on the left navigation pane, click **Azure Active Directory** icon.

	![Creating an Azure AD test user](./media/active-directory-saas-thefundingportal-tutorial/create_aaduser_01.png) 

2. To display the list of users, go to **Users and groups** and click **All users**.
	
	![Creating an Azure AD test user](./media/active-directory-saas-thefundingportal-tutorial/create_aaduser_02.png) 

3. To open the **User** dialog, click **Add** on the top of the dialog.
 
	![Creating an Azure AD test user](./media/active-directory-saas-thefundingportal-tutorial/create_aaduser_03.png) 

4. On the **User** dialog page, perform the following steps:
 
	![Creating an Azure AD test user](./media/active-directory-saas-thefundingportal-tutorial/create_aaduser_04.png) 

    a. In the **Name** textbox, type **BrittaSimon**.

    b. In the **User name** textbox, type the **email address** of BrittaSimon.

	c. Select **Show Password** and write down the value of the **Password**.

    d. Click **Create**.
 
### Creating The Funding Portal test user

In this section, you create a user called Britta Simon in The Funding Portal. Work with [The Funding Portal support team](mailto:info@regenteducation.com) to add the test user and enable SSO.

### Assigning the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to The Funding Portal.

![Assign User][200] 

**To assign Britta Simon to The Funding Portal, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

2. In the applications list, select **The Funding Portal**.

	![Configure Single Sign-On](./media/active-directory-saas-thefundingportal-tutorial/tutorial_thefundingportal_app.png) 

3. In the menu on the left, click **Users and groups**.

	![Assign User][202] 

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![Assign User][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.
	
### Testing single sign-on

The objective of this section is to test your Azure AD single sign-on configuration using the Access Panel.

When you click the The Funding Portal tile in the Access Panel, you should get automatically signed-on to your The Funding Portal application.

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)



<!--Image references-->

[1]: ./media/active-directory-saas-thefundingportal-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-thefundingportal-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-thefundingportal-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-thefundingportal-tutorial/tutorial_general_04.png

[100]: ./media/active-directory-saas-thefundingportal-tutorial/tutorial_general_100.png

[200]: ./media/active-directory-saas-thefundingportal-tutorial/tutorial_general_200.png
[201]: ./media/active-directory-saas-thefundingportal-tutorial/tutorial_general_201.png
[202]: ./media/active-directory-saas-thefundingportal-tutorial/tutorial_general_202.png
[203]: ./media/active-directory-saas-thefundingportal-tutorial/tutorial_general_203.png


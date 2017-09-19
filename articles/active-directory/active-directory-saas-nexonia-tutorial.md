---
title: 'Tutorial: Azure Active Directory integration with Nexonia | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Nexonia.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila

ms.assetid: a93b771a-9bc3-444a-bdc0-457f8bb7e780
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/1/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Nexonia

In this tutorial, you learn how to integrate Nexonia with Azure Active Directory (Azure AD).

Integrating Nexonia with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Nexonia
- You can enable your users to automatically get signed-on to Nexonia (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure portal

If you want to know more details about SaaS app integration with Azure AD, see. [What is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites

To configure Azure AD integration with Nexonia, you need the following items:

- An Azure AD subscription
- A Nexonia single-sign on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can get a one-month trial [here](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Nexonia from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding Nexonia from the gallery
To configure the integration of Nexonia into Azure AD, you need to add Nexonia from the gallery to your list of managed SaaS apps.

**To add Nexonia from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![Active Directory][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![Applications][2]
	
3. To add new application, click **New application** button on the top of dialog.

	![Applications][3]

4. In the search box, type **Nexonia**.

	![Creating an Azure AD test user](./media/active-directory-saas-nexonia-tutorial/tutorial_nexonia_search.png)

5. In the results panel, select **Nexonia**, and then click **Add** button to add the application.

	![Creating an Azure AD test user](./media/active-directory-saas-nexonia-tutorial/tutorial_nexonia_addfromgallery.png)

##  Configuring and testing Azure AD single sign-on
In this section, you configure and test Azure AD single sign-on with Nexonia based on a test user called "Britta Simon."

For single sign-on to work, Azure AD needs to know what the counterpart user in Nexonia is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Nexonia needs to be established.

In Nexonia, assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with Nexonia, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Creating a Nexonia test user](#creating-a-nexonia-test-user)** - to have a counterpart of Britta Simon in Nexonia that is linked to the Azure AD representation of user.
4. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Testing Single Sign-On](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Nexonia application.

>[!Note]
>If you have issues in the integration then refer this [link](https://docs.microsoft.com/azure/active-directory/application-sign-in-problem-federated-sso-gallery?WT.mc_id=UI_AAD_Enterprise_Apps_SupportOrTroubleshooting) for troubleshooting guide. If you still have not found the solution, then raise the support request from Azure portal.

**To configure Azure AD single sign-on with Nexonia, perform the following steps:**

1. In the Azure portal, on the **Nexonia** application integration page, click **Single sign-on**.

	![Configure Single Sign-On][4]

2. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Configure Single Sign-On](./media/active-directory-saas-nexonia-tutorial/tutorial_nexonia_samlbase.png)

3. On the **Nexonia Domain and URLs** section, perform the following steps:

	![Configure Single Sign-On](./media/active-directory-saas-nexonia-tutorial/tutorial_nexonia_url.png)

    In the **Reply URL** textbox, type a URL using the following pattern: `https://system.nexonia.com/assistant/saml.do?orgCode=<organizationcode>`

	> [!NOTE] 
	> This value is not real. Update this value with the actual Reply URL. Contact [Nexonia support team](https://nexonia.zendesk.com/hc/requests/new) to get this value. 


4. On the **SAML Signing Certificate** section, click **Certificate (Base64)** and then save the certificate file on your computer.

	![Configure Single Sign-On](./media/active-directory-saas-nexonia-tutorial/tutorial_nexonia_certificate.png) 

5. Click **Save** button.

	![Configure Single Sign-On](./media/active-directory-saas-nexonia-tutorial/tutorial_general_400.png)

6. On the **Nexonia Configuration** section, click **Configure Nexonia** to open **Configure sign-on** window. Copy the **Sign-Out URL, SAML Entity ID, and SAML Single Sign-On Service URL** from the **Quick Reference section.**

	![Configure Single Sign-On](./media/active-directory-saas-nexonia-tutorial/tutorial_nexonia_configure.png) 

7. To get SSO configured for your application, contact [Nexonia support team](https://nexonia.zendesk.com/hc/requests/new) and provide them with the following:

	• The downloaded **certificate**

	• The **SAML Entity ID**

	• The **SAML Single Sign-On Service URL**

	• The **Sign-Out URL**

> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)
> 


### Creating an Azure AD test user
The objective of this section is to create a test user in the Azure portal called Britta Simon.

![Create Azure AD User][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure portal**, on the left navigation pane, click **Azure Active Directory** icon.

	![Creating an Azure AD test user](./media/active-directory-saas-nexonia-tutorial/create_aaduser_01.png) 

2. To display the list of users, go to **Users and groups** and click **All users**.
	
	![Creating an Azure AD test user](./media/active-directory-saas-nexonia-tutorial/create_aaduser_02.png) 

3. To open the **User** dialog, click **Add** on the top of the dialog.
 
	![Creating an Azure AD test user](./media/active-directory-saas-nexonia-tutorial/create_aaduser_03.png) 

4. On the **User** dialog page, perform the following steps:
 
	![Creating an Azure AD test user](./media/active-directory-saas-nexonia-tutorial/create_aaduser_04.png) 

    a. In the **Name** textbox, type **BrittaSimon**.

    b. In the **User name** textbox, type the **email address** of BrittaSimon.

	c. Select **Show Password** and write down the value of the **Password**.

    d. Click **Create**.
 
### Creating a Nexonia test user

In this section, you create a user called Britta Simon in Nexonia. Work with [Nexonia support team](https://nexonia.zendesk.com/hc/requests/new) to add the users in the Nexonia platform. Users must be created and activated before you use single sign-on.


### Assigning the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Nexonia.

![Assign User][200] 

**To assign Britta Simon to Nexonia, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

2. In the applications list, select **Nexonia**.

	![Configure Single Sign-On](./media/active-directory-saas-nexonia-tutorial/tutorial_nexonia_app.png) 

3. In the menu on the left, click **Users and groups**.

	![Assign User][202] 

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![Assign User][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.
	
### Testing single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Nexonia tile in the Access Panel, you should get automatically signed-on to your Nexonia application.
For more information about the Access Panel, see [introduction to the Access Panel](https://msdn.microsoft.com/library/dn308586).

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)



<!--Image references-->

[1]: ./media/active-directory-saas-nexonia-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-nexonia-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-nexonia-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-nexonia-tutorial/tutorial_general_04.png

[100]: ./media/active-directory-saas-nexonia-tutorial/tutorial_general_100.png

[200]: ./media/active-directory-saas-nexonia-tutorial/tutorial_general_200.png
[201]: ./media/active-directory-saas-nexonia-tutorial/tutorial_general_201.png
[202]: ./media/active-directory-saas-nexonia-tutorial/tutorial_general_202.png
[203]: ./media/active-directory-saas-nexonia-tutorial/tutorial_general_203.png


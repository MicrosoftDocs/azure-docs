---
title: 'Tutorial: Azure Active Directory integration with Convercent | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Convercent.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila

ms.assetid: f9c9d290-0e13-490b-b559-0be772d6a690
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 3/10/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Convercent

In this tutorial, you learn how to integrate Convercent with Azure Active Directory (Azure AD).

Integrating Convercent with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Convercent
- You can enable your users to automatically get signed-on to Convercent single sign-on (SSO) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure new portal

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites

To configure Azure AD integration with Convercent, you need the following items:

- An Azure AD subscription
- A Convercent SSO enabled subscription

>[!NOTE]
>To test the steps in this tutorial, we do not recommend using a production environment.
>

To test the steps in this tutorial, you should follow these recommendations:

- You should not use your production environment, unless this is necessary.
- If you don't have an Azure AD trial environment, you can get a [one-month trial](https://azure.microsoft.com/pricing/free-trial/).


## Scenario description
In this tutorial, you test Azure AD SSO in a test environment. 

The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Convercent from the gallery
2. Configuring and testing Azure AD SSO

## Add Convercent from the gallery
To configure the integration of Convercent into Azure AD, you need to add Convercent from the gallery to your list of managed SaaS apps.

**To add Convercent from the gallery, perform the following steps:**

1. In the **Azure Management portal**, on the left navigation panel, click **Azure Active Directory** icon. 

	![Active Directory][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![Applications][2]
	
3. Click **Add** button on the top of the dialog.

	![Applications][3]

4. In the search box, type **Convercent**.

	![Creating an Azure AD test user](./media/active-directory-saas-convercent-tutorial/tutorial_convercent_001.png)

5. In the results panel, select **Convercent**, and then click **Add** button to add the application.

	![Creating an Azure AD test user](./media/active-directory-saas-convercent-tutorial/tutorial_convercent_0001.png)

##  Configure and test Azure AD single sign-on
In this section, you configure and test Azure AD SSO with Convercent based on a test user called "Britta Simon".

For SSO to work, Azure AD needs to know what the counterpart user in Convercent is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Convercent needs to be established.

This link relationship is established by assigning the value of the **user name** in Azure AD as the value of the **Username** in Convercent.

To configure and test Azure AD SSO with Convercent, you need to complete the following building blocks:

1. **[Configuring Azure AD single sign-on](#configuring-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Creating a Convercent test user](#creating-a-works-mobile-test-user)** - to have a counterpart of Britta Simon in Convercent that is linked to the Azure AD representation of her.
4. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Testing single sign-on](#testing-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD SSO in the Azure new portal and configure single sign-on in your Convercent application.

**To configure Azure AD single sign-on with Convercent, perform the following steps:**

1. In the Azure new portal, on the **Convercent** application integration page, click **Single sign-on**.

	![Configure Single Sign-On][4]

2. On the **Single sign-on** dialog page, as **Mode** select **SAML-based Sign-on** to enable single sign on.
 
	![Configure Single Sign-On](./media/active-directory-saas-convercent-tutorial/tutorial_convercent_01.png)

3. On the **Convercent Domain and URLs** section, If you wish to configure the application in **IDP initiated mode**, perform the following steps:

	![Configure Single Sign-On](./media/active-directory-saas-convercent-tutorial/tutorial_convercent_02.png)
  1. In the **Identifier** textbox, type: `https://sts.convercent.com/`
  2. Click **"Show advanced URL settings"**.
  3. In the **Relay State** textbox, type: `https://app.convercent.com/`
	
4. If you wish to configure the application in **SP initiated mode**, on the **Convercent Domain and URLs** section perform the following steps:
	
	![Configure Single Sign-On](./media/active-directory-saas-convercent-tutorial/tutorial_convercent_03.png)
  * In the **Sign On URL** textbox, type: `https://app.convercent.com/`
	>[!NOTE] 
	>Here we will suggest you to use the specified unique Identifier. Contact [Convercent support team](mailTo:support@convercent.com) to get this value.
	>

5. On the **Convercent Configuration** section, click **Configure Convercent** to open **Configure sign-on** dialog. Then click **SAML XML Metadata** and then save the metadata file on your computer.

	![Configure Single Sign-On](./media/active-directory-saas-convercent-tutorial/tutorial_convercent_04.png) 

	![Configure Single Sign-On](./media/active-directory-saas-convercent-tutorial/tutorial_convercent_05.png)

6. To get SSO configured for your application, contact [Convercent support team](mailTo:support@convercent.com) and provide them with the downloaded **metadata**.

7. In the Azure new portal, click **Save** button.  
  
### Create an Azure AD test user
The objective of this section is to create a test user in the new portal called Britta Simon.

![Create Azure AD User][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure Management portal**, on the left navigation pane, click **Azure Active Directory** icon.

	![Creating an Azure AD test user](./media/active-directory-saas-convercent-tutorial/create_aaduser_01.png) 

2. Go to **Users and groups** and click **All users** to display the list of users.
	
	![Creating an Azure AD test user](./media/active-directory-saas-convercent-tutorial/create_aaduser_02.png) 

3. At the top of the dialog click **Add** to open the **User** dialog.
 
	![Creating an Azure AD test user](./media/active-directory-saas-convercent-tutorial/create_aaduser_03.png) 

4. On the **User** dialog page, perform the following steps:
 
	![Creating an Azure AD test user](./media/active-directory-saas-convercent-tutorial/create_aaduser_04.png) 
 1. In the **Name** textbox, type **BrittaSimon**.
 2. In the **User name** textbox, type the **email address** of BrittaSimon.
 3. Select **Show Password** and write down the value of the **Password**.
 4. Click **Create**. 

### Create a Convercent test user

In this section, you create a user called Britta Simon in Convercent. Please work with [Convercent support team](emailto:support@convercent.com) to add the users in the Convercent platform.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure SSO by granting her access to Convercent.

![Assign User][200] 

**To assign Britta Simon to Convercent, perform the following steps:**

1. In the Azure Management portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

2. In the applications list, select **Convercent**.

	![Configure Single Sign-On](./media/active-directory-saas-convercent-tutorial/tutorial_convercent_50.png) 

3. In the menu on the left, click **Users and groups**.

	![Assign User][202] 

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![Assign User][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.
	
### Test single sign-on

In this section, you test your Azure AD SSO configuration using the Access Panel.

When you click the Convercent tile in the Access Panel, you should get automatically signed-on to your Convercent application.


## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)



<!--Image references-->

[1]: ./media/active-directory-saas-convercent-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-convercent-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-convercent-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-convercent-tutorial/tutorial_general_04.png

[100]: ./media/active-directory-saas-convercent-tutorial/tutorial_general_100.png

[200]: ./media/active-directory-saas-convercent-tutorial/tutorial_general_200.png
[201]: ./media/active-directory-saas-convercent-tutorial/tutorial_general_201.png
[202]: ./media/active-directory-saas-convercent-tutorial/tutorial_general_202.png
[203]: ./media/active-directory-saas-convercent-tutorial/tutorial_general_203.png
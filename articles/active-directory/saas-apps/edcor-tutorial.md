---
title: 'Tutorial: Azure Active Directory integration with Edcor | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Edcor.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila
ms.reviewer: joflore

ms.assetid: 5b06f2d8-9cd7-498d-bdd6-88570a0a0a15
ms.service: active-directory
ms.component: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 12/13/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Edcor

In this tutorial, you learn how to integrate Edcor with Azure Active Directory (Azure AD).

Integrating Edcor with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Edcor.
- You can enable your users to automatically get signed-on to Edcor (Single Sign-On) with their Azure AD accounts.
- You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Azure AD integration with Edcor, you need the following items:

- An Azure AD subscription
- An Edcor single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Edcor from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding Edcor from the gallery
To configure the integration of Edcor into Azure AD, you need to add Edcor from the gallery to your list of managed SaaS apps.

**To add Edcor from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![The Azure Active Directory button][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![The Enterprise applications blade][2]
	
3. To add new application, click **New application** button on the top of dialog.

	![The New application button][3]

4. In the search box, type **Edcor**, select **Edcor** from result panel then click **Add** button to add the application.

	![Edcor in the results list](./media/edcor-tutorial/tutorial_edcor_addfromgallery.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Edcor based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Edcor is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Edcor needs to be established.

In Edcor, assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with Edcor, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Create an Edcor test user](#create-an-edcor-test-user)** - to have a counterpart of Britta Simon in Edcor that is linked to the Azure AD representation of user.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Edcor application.

**To configure Azure AD single sign-on with Edcor, perform the following steps:**

1. In the Azure portal, on the **Edcor** application integration page, click **Single sign-on**.

	![Configure single sign-on link][4]

2. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Single sign-on dialog box](./media/edcor-tutorial/tutorial_edcor_samlbase.png)

3. On the **Edcor Domain and URLs** section, perform the following steps:

	![Edcor Domain and URLs single sign-on information](./media/edcor-tutorial/tutorial_edcor_url1.png)

    In the **Identifier** textbox, type a URL: `https://sso.edcor.com/sp/ACS.saml2`


4. On the **SAML Signing Certificate** section, click **Metadata XML** and then save the metadata file on your computer.

	![The Certificate download link](./media/edcor-tutorial/tutorial_edcor_certificate.png) 

5. Click **Save** button.

	![Configure Single Sign-On Save button](./media/edcor-tutorial/tutorial_general_400.png)

6. On the **Edcor Configuration** section, click **Configure Edcor** to open **Configure sign-on** window. Copy the **Sign-Out URL and SAML Entity ID** from the **Quick Reference section.**

	![Edcor Configuration](./media/edcor-tutorial/tutorial_edcor_configure.png) 

7. To configure single sign-on on **Edcor** side, you need to send the downloaded **Metadata XML**, **Sign-Out URL** and **SAML Entity ID** to [Edcor support team](http://www.edcor.com/contact-us-2/). They set this setting to have the SAML SSO connection set properly on both sides.

> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)
> 

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

   ![Create an Azure AD test user][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the Azure portal, in the left pane, click the **Azure Active Directory** button.

    ![The Azure Active Directory button](./media/edcor-tutorial/create_aaduser_01.png)

2. To display the list of users, go to **Users and groups**, and then click **All users**.

    ![The "Users and groups" and "All users" links](./media/edcor-tutorial/create_aaduser_02.png)

3. To open the **User** dialog box, click **Add** at the top of the **All Users** dialog box.

    ![The Add button](./media/edcor-tutorial/create_aaduser_03.png)

4. In the **User** dialog box, perform the following steps:

    ![The User dialog box](./media/edcor-tutorial/create_aaduser_04.png)

    a. In the **Name** box, type **BrittaSimon**.

    b. In the **User name** box, type the email address of user Britta Simon.

    c. Select the **Show Password** check box, and then write down the value that's displayed in the **Password** box.

    d. Click **Create**.
 
### Create an Edcor test user

In this section, you create a user called Britta Simon in Edcor. Work with [Edcor support team](http://www.edcor.com/contact-us-2/) to add the users in the Edcor platform. Users must be created and activated before you use single sign-on.  

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Edcor.

![Assign the user role][200] 

**To assign Britta Simon to Edcor, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

2. In the applications list, select **Edcor**.

	![The Edcor link in the Applications list](./media/edcor-tutorial/tutorial_edcor_app.png)  

3. In the menu on the left, click **Users and groups**.

	![The "Users and groups" link][202]

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![The Add Assignment pane][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.
	
### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Edcor tile in the Access Panel, you should get automatically signed-on to your Edcor application.
For more information about the Access Panel, see [Introduction to the Access Panel](../user-help/active-directory-saas-access-panel-introduction.md). 

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)



<!--Image references-->

[1]: ./media/edcor-tutorial/tutorial_general_01.png
[2]: ./media/edcor-tutorial/tutorial_general_02.png
[3]: ./media/edcor-tutorial/tutorial_general_03.png
[4]: ./media/edcor-tutorial/tutorial_general_04.png

[100]: ./media/edcor-tutorial/tutorial_general_100.png

[200]: ./media/edcor-tutorial/tutorial_general_200.png
[201]: ./media/edcor-tutorial/tutorial_general_201.png
[202]: ./media/edcor-tutorial/tutorial_general_202.png
[203]: ./media/edcor-tutorial/tutorial_general_203.png


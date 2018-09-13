---
title: 'Tutorial: Azure Active Directory integration with Teamwork.com | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Teamwork.com.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila
ms.reviewer: joflore

ms.assetid: bd4413c2-0d7c-41a7-aba4-b7a7a28c9448
ms.service: active-directory
ms.component: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/04/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Teamwork.com

In this tutorial, you learn how to integrate Teamwork.com with Azure Active Directory (Azure AD).

Integrating Teamwork.com with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Teamwork.com.
- You can enable your users to automatically get signed-on to Teamwork.com (Single Sign-On) with their Azure AD accounts.
- You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Azure AD integration with Teamwork.com, you need the following items:

- An Azure AD subscription
- A Teamwork.com single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Teamwork.com from the gallery
1. Configuring and testing Azure AD single sign-on

## Adding Teamwork.com from the gallery
To configure the integration of Teamwork.com into Azure AD, you need to add Teamwork.com from the gallery to your list of managed SaaS apps.

**To add Teamwork.com from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![The Azure Active Directory button][1]

1. Navigate to **Enterprise applications**. Then go to **All applications**.

	![The Enterprise applications blade][2]
	
1. To add new application, click **New application** button on the top of dialog.

	![The New application button][3]

1. In the search box, type **Teamwork.com**, select **Teamwork.com** from result panel then click **Add** button to add the application.

	![Teamwork.com in the results list](./media/teamwork-tutorial/tutorial_teamwork_addfromgallery.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Teamwork.com based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Teamwork.com is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Teamwork.com needs to be established.

In Teamwork.com, assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with Teamwork.com, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
1. **[Create a Teamwork.com test user](#create-a-teamworkcom-test-user)** - to have a counterpart of Britta Simon in Teamwork.com that is linked to the Azure AD representation of user.
1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
1. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Teamwork.com application.

**To configure Azure AD single sign-on with Teamwork.com, perform the following steps:**

1. In the Azure portal, on the **Teamwork.com** application integration page, click **Single sign-on**.

	![Configure single sign-on link][4]

1. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Single sign-on dialog box](./media/teamwork-tutorial/tutorial_teamwork_samlbase.png)

1. On the **Teamwork.com Domain and URLs** section, perform the following steps:

	![Teamwork.com Domain and URLs single sign-on information](./media/teamwork-tutorial/tutorial_teamwork_url.png)

    a. In the **Sign-on URL** textbox, type a URL using the following pattern: `https://<company name>.teamwork.com`

	b. In the **Identifier** textbox, type the URL:

	|||
	|-|-|
	| `https://teamwork.com/saml`|
	| `https://eu.teamwork.com/saml`|

	> [!NOTE] 
	> This  Sign-on URL value is not real. Update this value with the actual Sign-On URL. Contact [Teamwork.com support team](mailto:support@teamwork.com) to get this value. 

1. On the **SAML Signing Certificate** section, click **Metadata XML** and then save the metadata file on your computer.

	![The Certificate download link](./media/teamwork-tutorial/tutorial_teamwork_certificate.png) 

1. Click **Save** button.

	![Configure Single Sign-On Save button](./media/teamwork-tutorial/tutorial_general_400.png)

1. To configure single sign-on on **Teamwork.com** side, you need to send the downloaded **Metadata XML** to [Teamwork.com support team](mailto:support@teamwork.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

   ![Create an Azure AD test user][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the Azure portal, in the left pane, click the **Azure Active Directory** button.

    ![The Azure Active Directory button](./media/teamwork-tutorial/create_aaduser_01.png)

1. To display the list of users, go to **Users and groups**, and then click **All users**.

    ![The "Users and groups" and "All users" links](./media/teamwork-tutorial/create_aaduser_02.png)

1. To open the **User** dialog box, click **Add** at the top of the **All Users** dialog box.

    ![The Add button](./media/teamwork-tutorial/create_aaduser_03.png)

1. In the **User** dialog box, perform the following steps:

    ![The User dialog box](./media/teamwork-tutorial/create_aaduser_04.png)

    a. In the **Name** box, type **BrittaSimon**.

    b. In the **User name** box, type the email address of user Britta Simon.

    c. Select the **Show Password** check box, and then write down the value that's displayed in the **Password** box.

    d. Click **Create**.
 
### Create a Teamwork.com test user

In this section, you create a user called Britta Simon in Teamwork.com. Work with [Teamwork.com support team](mailto:support@teamwork.com) to add the users in the Teamwork.com platform. Users must be created and activated before you use single sign-on.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Teamwork.com.

![Assign the user role][200] 

**To assign Britta Simon to Teamwork.com, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

1. In the applications list, select **Teamwork.com**.

	![The Teamwork.com link in the Applications list](./media/teamwork-tutorial/tutorial_teamwork_app.png)  

1. In the menu on the left, click **Users and groups**.

	![The "Users and groups" link][202]

1. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![The Add Assignment pane][203]

1. On **Users and groups** dialog, select **Britta Simon** in the Users list.

1. Click **Select** button on **Users and groups** dialog.

1. Click **Assign** button on **Add Assignment** dialog.
	
### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Teamwork.com tile in the Access Panel, you should get automatically signed-on to your Teamwork.com application.
For more information about the Access Panel, see [Introduction to the Access Panel](../user-help/active-directory-saas-access-panel-introduction.md). 

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

<!--Image references-->

[1]: ./media/teamwork-tutorial/tutorial_general_01.png
[2]: ./media/teamwork-tutorial/tutorial_general_02.png
[3]: ./media/teamwork-tutorial/tutorial_general_03.png
[4]: ./media/teamwork-tutorial/tutorial_general_04.png

[100]: ./media/teamwork-tutorial/tutorial_general_100.png

[200]: ./media/teamwork-tutorial/tutorial_general_200.png
[201]: ./media/teamwork-tutorial/tutorial_general_201.png
[202]: ./media/teamwork-tutorial/tutorial_general_202.png
[203]: ./media/teamwork-tutorial/tutorial_general_203.png


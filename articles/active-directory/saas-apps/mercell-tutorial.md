---
title: 'Tutorial: Azure Active Directory integration with Mercell | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Mercell.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila
ms.reviewer: joflore

ms.assetid: bb94c288-2ed4-4683-acde-62474292df29
ms.service: active-directory
ms.component: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/17/2018
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Mercell

In this tutorial, you learn how to integrate Mercell with Azure Active Directory (Azure AD).

Integrating Mercell with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Mercell.
- You can enable your users to automatically get signed-on to Mercell (Single Sign-On) with their Azure AD accounts.
- You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Azure AD integration with Mercell, you need the following items:

- An Azure AD subscription
- A Mercell single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Mercell from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding Mercell from the gallery
To configure the integration of Mercell into Azure AD, you need to add Mercell from the gallery to your list of managed SaaS apps.

**To add Mercell from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![The Azure Active Directory button][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![The Enterprise applications blade][2]
	
3. To add new application, click **New application** button on the top of dialog.

	![The New application button][3]

4. In the search box, type **Mercell**, select **Mercell** from result panel then click **Add** button to add the application.

	![Mercell in the results list](./media/mercell-tutorial/tutorial_mercell_addfromgallery.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Mercell based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Mercell is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Mercell needs to be established.

To configure and test Azure AD single sign-on with Mercell, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Create a Mercell test user](#create-a-mercell-test-user)** - to have a counterpart of Britta Simon in Mercell that is linked to the Azure AD representation of user.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Mercell application.

**To configure Azure AD single sign-on with Mercell, perform the following steps:**

1. In the Azure portal, on the **Mercell** application integration page, click **Single sign-on**.

	![Configure single sign-on link][4]

2. On the **Single sign-on** dialog, select **Mode** as **SAML-based Sign-on** to enable single sign-on.

	![Single sign-on dialog box](./media/mercell-tutorial/tutorial_mercell_samlbase.png)

3. On the **Mercell Domain and URLs** section, perform the following steps:

	![Mercell Domain and URLs single sign-on information](./media/mercell-tutorial/tutorial_mercell_url.png)

    In the **Identifier** textbox, type the URL: `https://my.mercell.com/`

4. On the **SAML Signing Certificate** section, click the copy button to copy **App Federation Metadata Url** and paste it into notepad.
    
    ![Configure Single Sign-On](./media/mercell-tutorial/tutorial_metadataurl.png)
     
5. Click **Save** button.

	![Configure Single Sign-On Save button](./media/mercell-tutorial/tutorial_general_400.png)

6. To configure single sign-on on **Mercell** side, you need to send the generated **App Federation Metadata Url** to [Mercell support team](mailto:webmaster@mercell.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

   ![Create an Azure AD test user][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the Azure portal, in the left pane, click the **Azure Active Directory** button.

    ![The Azure Active Directory button](./media/mercell-tutorial/create_aaduser_01.png)

2. To display the list of users, go to **Users and groups**, and then click **All users**.

    ![The "Users and groups" and "All users" links](./media/mercell-tutorial/create_aaduser_02.png)

3. To open the **User** dialog box, click **Add** at the top of the **All Users** dialog box.

    ![The Add button](./media/mercell-tutorial/create_aaduser_03.png)

4. In the **User** dialog box, perform the following steps:

    ![The User dialog box](./media/mercell-tutorial/create_aaduser_04.png)

    a. In the **Name** box, type **BrittaSimon**.

    b. In the **User name** box, type the email address of user Britta Simon.

    c. Select the **Show Password** check box, and then write down the value that's displayed in the **Password** box.

    d. Click **Create**.
 
### Create a Mercell test user

The objective of this section is to create a user called Britta Simon in Mercell. Mercell supports just-in-time provisioning, which is by default enabled. There is no action item for you in this section. A new user is created during an attempt to access Mercell if it doesn't exist yet.
>[!Note]
>If you need to create a user manually, contact [Mercell support team](mailto:webmaster@mercell.com).

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Mercell.

![Assign the user role][200] 

**To assign Britta Simon to Mercell, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

2. In the applications list, select **Mercell**.

	![The Mercell link in the Applications list](./media/mercell-tutorial/tutorial_mercell_app.png)  

3. In the menu on the left, click **Users and groups**.

	![The "Users and groups" link][202]

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![The Add Assignment pane][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.
	
### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Mercell tile in the Access Panel, you should get automatically signed-on to your Mercell application.
For more information about the Access Panel, see [Introduction to the Access Panel](../user-help/active-directory-saas-access-panel-introduction.md). 

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)



<!--Image references-->

[1]: ./media/mercell-tutorial/tutorial_general_01.png
[2]: ./media/mercell-tutorial/tutorial_general_02.png
[3]: ./media/mercell-tutorial/tutorial_general_03.png
[4]: ./media/mercell-tutorial/tutorial_general_04.png

[100]: ./media/mercell-tutorial/tutorial_general_100.png

[200]: ./media/mercell-tutorial/tutorial_general_200.png
[201]: ./media/mercell-tutorial/tutorial_general_201.png
[202]: ./media/mercell-tutorial/tutorial_general_202.png
[203]: ./media/mercell-tutorial/tutorial_general_203.png


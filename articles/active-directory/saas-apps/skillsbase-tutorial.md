---
title: 'Tutorial: Azure Active Directory integration with Skills Base | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Skills Base.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila
ms.reviewer: joflore

ms.assetid: 237d90c4-8243-4f80-a305-b5ad9204159e
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/20/2018
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Skills Base

In this tutorial, you learn how to integrate Skills Base with Azure Active Directory (Azure AD).

Integrating Skills Base with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Skills Base.
- You can enable your users to automatically get signed-on to Skills Base (Single Sign-On) with their Azure AD accounts.
- You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Azure AD integration with Skills Base, you need the following items:

- An Azure AD subscription
- A Skills Base single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Skills Base from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding Skills Base from the gallery
To configure the integration of Skills Base into Azure AD, you need to add Skills Base from the gallery to your list of managed SaaS apps.

**To add Skills Base from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![The Azure Active Directory button][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![The Enterprise applications blade][2]
	
3. To add new application, click **New application** button on the top of dialog.

	![The New application button][3]

4. In the search box, type **Skills Base**, select **Skills Base** from result panel then click **Add** button to add the application.

	![Skills Base in the results list](./media/skillsbase-tutorial/tutorial_skillsbase_addfromgallery.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Skills Base based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Skills Base is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Skills Base needs to be established.

To configure and test Azure AD single sign-on with Skills Base, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Create a Skills Base test user](#create-a-skills-base-test-user)** - to have a counterpart of Britta Simon in Skills Base that is linked to the Azure AD representation of user.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Skills Base application.

**To configure Azure AD single sign-on with Skills Base, perform the following steps:**

1. In the Azure portal, on the **Skills Base** application integration page, click **Single sign-on**.

	![Configure single sign-on link][4]

2. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Single sign-on dialog box](./media/skillsbase-tutorial/tutorial_skillsbase_samlbase.png)

3. On the **Skills Base Domain and URLs** section, perform the following steps:

	![Skills Base Domain and URLs single sign-on information](./media/skillsbase-tutorial/tutorial_skillsbase_url.png)

    In the **Sign-on URL** textbox, type a URL using the following pattern: `https://app.skills-base.com/o/<customer-unique-key>`

	> [!NOTE] 
	> You can get the Sign-On URL from Skills Base application. Please login as an Administrator and to go to Admin-> Settings-> Instance details -> Shortcut link. Copy the Sign-On URL and paste it in above textbox.

4. On the **SAML Signing Certificate** section, click **Metadata XML** and then save the metadata file on your computer.

	![The Certificate download link](./media/skillsbase-tutorial/tutorial_skillsbase_certificate.png) 

5. Click **Save** button.

	![Configure Single Sign-On Save button](./media/skillsbase-tutorial/tutorial_general_400.png)

6. In a different web browser window, login to Skills Base as a Security Administrator.

7. From the left side of menu, under **ADMIN** click **Authentication**.

	![The admin](./media/skillsbase-tutorial/tutorial_skillsbase_auth.png)

8. On the **Authentication** Page, select Single Sign-On as **SAML 2**.

	![The single](./media/skillsbase-tutorial/tutorial_skillsbase_single.png)

9. On the **Authentication** Page, Perform the following steps:

	![The single](./media/skillsbase-tutorial/tutorial_skillsbase_save.png)

	a. Click on **Update IdP metadata** button next to **Status** option and paste the contents of Metadata XML that you downloaded from the Azure portal in the specified textbox.

	> [!Note]
	> You can also validate idp metadata through the **Metadata validator** tool as highlighted in screenshot above.

	b. Click **Save**.
	
### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

   ![Create an Azure AD test user][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the Azure portal, in the left pane, click the **Azure Active Directory** button.

    ![The Azure Active Directory button](./media/skillsbase-tutorial/create_aaduser_01.png)

2. To display the list of users, go to **Users and groups**, and then click **All users**.

    ![The "Users and groups" and "All users" links](./media/skillsbase-tutorial/create_aaduser_02.png)

3. To open the **User** dialog box, click **Add** at the top of the **All Users** dialog box.

    ![The Add button](./media/skillsbase-tutorial/create_aaduser_03.png)

4. In the **User** dialog box, perform the following steps:

    ![The User dialog box](./media/skillsbase-tutorial/create_aaduser_04.png)

    a. In the **Name** box, type **BrittaSimon**.

    b. In the **User name** box, type the email address of user Britta Simon.

    c. Select the **Show Password** check box, and then write down the value that's displayed in the **Password** box.

    d. Click **Create**.
 
### Create a Skills Base test user

The objective of this section is to create a user called Britta Simon in Skills Base. Skills Base supports just-in-time provisioning, which is by default enabled. There is no action item for you in this section. A new user is created during an attempt to access Skills Base if it doesn't exist yet.

>[!Note]
>If you need to create a user manually, follow the instructions [here](http://wiki.skills-base.net/index.php?title=Adding_people_and_enabling_them_to_log_in).

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Skills Base.

![Assign the user role][200] 

**To assign Britta Simon to Skills Base, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

2. In the applications list, select **Skills Base**.

	![The Skills Base link in the Applications list](./media/skillsbase-tutorial/tutorial_skillsbase_app.png)  

3. In the menu on the left, click **Users and groups**.

	![The "Users and groups" link][202]

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![The Add Assignment pane][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.
	
### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Skills Base tile in the Access Panel, you should get automatically signed-on to your Skills Base application.
For more information about the Access Panel, see [Introduction to the Access Panel](../active-directory-saas-access-panel-introduction.md). 

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)



<!--Image references-->

[1]: ./media/skillsbase-tutorial/tutorial_general_01.png
[2]: ./media/skillsbase-tutorial/tutorial_general_02.png
[3]: ./media/skillsbase-tutorial/tutorial_general_03.png
[4]: ./media/skillsbase-tutorial/tutorial_general_04.png

[100]: ./media/skillsbase-tutorial/tutorial_general_100.png

[200]: ./media/skillsbase-tutorial/tutorial_general_200.png
[201]: ./media/skillsbase-tutorial/tutorial_general_201.png
[202]: ./media/skillsbase-tutorial/tutorial_general_202.png
[203]: ./media/skillsbase-tutorial/tutorial_general_203.png


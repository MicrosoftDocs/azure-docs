---
title: 'Tutorial: Azure Active Directory integration with OneTrust Privacy Management Software | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and OneTrust Privacy Management Software.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila
ms.reviewer: joflore

ms.assetid: 71c2b6d0-3d28-4130-a2c8-1e72ab3d5814
ms.service: active-directory
ms.component: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 12/15/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with OneTrust Privacy Management Software

In this tutorial, you learn how to integrate OneTrust Privacy Management Software with Azure Active Directory (Azure AD).

Integrating OneTrust Privacy Management Software with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to OneTrust Privacy Management Software.
- You can enable your users to automatically get signed-on to OneTrust Privacy Management Software (Single Sign-On) with their Azure AD accounts.
- You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Azure AD integration with OneTrust Privacy Management Software, you need the following items:

- An Azure AD subscription
- A OneTrust Privacy Management Software single-sign on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding OneTrust Privacy Management Software from the gallery
1. Configuring and testing Azure AD single sign-on

## Adding OneTrust Privacy Management Software from the gallery
To configure the integration of OneTrust Privacy Management Software into Azure AD, you need to add OneTrust Privacy Management Software from the gallery to your list of managed SaaS apps.

**To add OneTrust Privacy Management Software from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![The Azure Active Directory button][1]

1. Navigate to **Enterprise applications**. Then go to **All applications**.

	![The Enterprise applications blade][2]
	
1. To add new application, click **New application** button on the top of dialog.

	![The New application button][3]

1. In the search box, type **OneTrust Privacy Management Software**, select **OneTrust Privacy Management Software** from result panel then click **Add** button to add the application.

	![OneTrust Privacy Management Software in the results list](./media/onetrust-tutorial/tutorial_onetrust_addfromgallery.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with OneTrust Privacy Management Software based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in OneTrust Privacy Management Software is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in OneTrust Privacy Management Software needs to be established.

In OneTrust Privacy Management Software, assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with OneTrust Privacy Management Software, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
1. **[Create a OneTrust Privacy Management Software test user](#create-a-onetrust-privacy-management-software-test-user)** - to have a counterpart of Britta Simon in OneTrust Privacy Management Software that is linked to the Azure AD representation of user.
1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
1. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your OneTrust Privacy Management Software application.

**To configure Azure AD single sign-on with OneTrust Privacy Management Software, perform the following steps:**

1. In the Azure portal, on the **OneTrust Privacy Management Software** application integration page, click **Single sign-on**.

	![Configure single sign-on link][4]

1. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Single sign-on dialog box](./media/onetrust-tutorial/tutorial_onetrust_samlbase.png)

1. On the **OneTrust Privacy Management Software Domain and URLs** section, perform the following steps if you wish to configure the application in **IDP** initiated mode:

	![OneTrust Privacy Management Software Domain and URLs single sign-on information](./media/onetrust-tutorial/tutorial_onetrust_url.png)

    a. In the **Identifier** textbox, type a URL: `https://www.onetrust.com/saml2`

	b. In the **Reply URL** textbox, type a URL using the following pattern: `https://<subdomain>.onetrust.com/auth/consumerservice`

1. Check **Show advanced URL settings** and perform the following step if you wish to configure the application in **SP** initiated mode:

	![OneTrust Privacy Management Software Domain and URLs single sign-on information](./media/onetrust-tutorial/tutorial_onetrust_url1.png)

    In the **Sign-on URL** textbox, type a URL using the following pattern: `https://<subdomain>.onetrust.com/auth/login`
	 
	> [!NOTE] 
	> These values are not real. Update these values with the actual Reply URL and Sign on URL. Contact [OneTrust Privacy Management Software Client support team](mailto:support@onetrust.com) to get these values. 

1. On the **SAML Signing Certificate** section, click **Metadata XML** and then save the metadata file on your computer.

	![The Certificate download link](./media/onetrust-tutorial/tutorial_onetrust_certificate.png) 

1. Click **Save** button.

	![Configure Single Sign-On Save button](./media/onetrust-tutorial/tutorial_general_400.png)

1. To configure single sign-on on **OneTrust Privacy Management Software** side, you need to send the downloaded **Metadata XML** to [OneTrust Privacy Management Software support team](mailto:support@onetrust.com). They set this setting to have the SAML SSO connection set properly on both sides.

> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

   ![Create an Azure AD test user][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the Azure portal, in the left pane, click the **Azure Active Directory** button.

    ![The Azure Active Directory button](./media/onetrust-tutorial/create_aaduser_01.png)

1. To display the list of users, go to **Users and groups**, and then click **All users**.

    ![The "Users and groups" and "All users" links](./media/onetrust-tutorial/create_aaduser_02.png)

1. To open the **User** dialog box, click **Add** at the top of the **All Users** dialog box.

    ![The Add button](./media/onetrust-tutorial/create_aaduser_03.png)

1. In the **User** dialog box, perform the following steps:

    ![The User dialog box](./media/onetrust-tutorial/create_aaduser_04.png)

    a. In the **Name** box, type **BrittaSimon**.

    b. In the **User name** box, type the email address of user Britta Simon.

    c. Select the **Show Password** check box, and then write down the value that's displayed in the **Password** box.

    d. Click **Create**.
 
### Create a OneTrust Privacy Management Software test user

The objective of this section is to create a user called Britta Simon in OneTrust Privacy Management Software. OneTrust Privacy Management Software supports just-in-time provisioning, which is by default enabled. There is no action item for you in this section. A new user is created during an attempt to access OneTrust Privacy Management Software if it doesn't exist yet.

>[!Note]
>If you need to create a user manually, Contact [OneTrust Privacy Management Software support team](mailto:support@onetrust.com).

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to OneTrust Privacy Management Software.

![Assign the user role][200] 

**To assign Britta Simon to OneTrust Privacy Management Software, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

1. In the applications list, select **OneTrust Privacy Management Software**.

	![The OneTrust Privacy Management Software link in the Applications list](./media/onetrust-tutorial/tutorial_onetrust_app.png)  

1. In the menu on the left, click **Users and groups**.

	![The "Users and groups" link][202]

1. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![The Add Assignment pane][203]

1. On **Users and groups** dialog, select **Britta Simon** in the Users list.

1. Click **Select** button on **Users and groups** dialog.

1. Click **Assign** button on **Add Assignment** dialog.
	
### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the OneTrust Privacy Management Software tile in the Access Panel, you should get automatically signed-on to your OneTrust Privacy Management Software application.
For more information about the Access Panel, see [Introduction to the Access Panel](../user-help/active-directory-saas-access-panel-introduction.md). 

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)



<!--Image references-->

[1]: ./media/onetrust-tutorial/tutorial_general_01.png
[2]: ./media/onetrust-tutorial/tutorial_general_02.png
[3]: ./media/onetrust-tutorial/tutorial_general_03.png
[4]: ./media/onetrust-tutorial/tutorial_general_04.png

[100]: ./media/onetrust-tutorial/tutorial_general_100.png

[200]: ./media/onetrust-tutorial/tutorial_general_200.png
[201]: ./media/onetrust-tutorial/tutorial_general_201.png
[202]: ./media/onetrust-tutorial/tutorial_general_202.png
[203]: ./media/onetrust-tutorial/tutorial_general_203.png


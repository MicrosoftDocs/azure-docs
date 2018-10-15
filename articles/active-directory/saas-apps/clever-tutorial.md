---
title: 'Tutorial: Azure Active Directory integration with Clever | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Clever.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila
ms.reviewer: joflore

ms.assetid: 069ff13a-310e-4366-a147-d6ec5cca12a5
ms.service: active-directory
ms.component: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/27/2018
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Clever

In this tutorial, you learn how to integrate Clever with Azure Active Directory (Azure AD).

Integrating Clever with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Clever.
- You can enable your users to automatically get signed-on to Clever (Single Sign-On) with their Azure AD accounts.
- You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Azure AD integration with Clever, you need the following items:

- An Azure AD subscription
- A Clever single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Clever from the gallery
1. Configuring and testing Azure AD single sign-on

## Adding Clever from the gallery
To configure the integration of Clever into Azure AD, you need to add Clever from the gallery to your list of managed SaaS apps.

**To add Clever from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![The Azure Active Directory button][1]

1. Navigate to **Enterprise applications**. Then go to **All applications**.

	![The Enterprise applications blade][2]
	
1. To add new application, click **New application** button on the top of dialog.

	![The New application button][3]

1. In the search box, type **Clever**, select **Clever** from result panel then click **Add** button to add the application.

	![Clever in the results list](./media/clever-tutorial/tutorial_clever_addfromgallery.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Clever based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Clever is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Clever needs to be established.

In Clever, assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with Clever, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
1. **[Create a Clever test user](#create-a-clever-test-user)** - to have a counterpart of Britta Simon in Clever that is linked to the Azure AD representation of user.
1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
1. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Clever application.

**To configure Azure AD single sign-on with Clever, perform the following steps:**

1. In the Azure portal, on the **Clever** application integration page, click **Single sign-on**.

	![Configure single sign-on link][4]

1. On the **Single sign-on** dialog, select **Mode** as **SAML-based Sign-on** to enable single sign-on.

	![Single sign-on dialog box](./media/clever-tutorial/tutorial_clever_samlbase.png)

1. On the **Clever Domain and URLs** section, perform the following steps:

	![Clever Domain and URLs single sign-on information](./media/clever-tutorial/tutorial_clever_url.png)

    a. In the **Sign-on URL** textbox, type a URL using the following pattern: `https://clever.com/in/<companyname>`

	b. In the **Identifier** textbox, type the URL: `https://clever.com/oauth/saml/metadata.xml`

	> [!NOTE]
	> Sign-on URL value is not real. Update this value with the actual Sign-On URL. Contact [Clever Client support team](https://clever.com/about/contact/) to get this value.

1. On the **SAML Signing Certificate** section, click the copy button to copy **App Federation Metadata Url** and paste it into Notepad.
    
    ![Configure Single Sign-On](./media/clever-tutorial/tutorial_metadataurl.png)

1. The Clever application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your **SAML Token Attributes** configuration.

	The following screenshot shows an example for this.

	![Configure Single Sign-On](./media/clever-tutorial/tutorial_clever_07.png)

1. In the **User Attributes** section on the **Single sign-on** dialog, configure SAML token attribute as shown in the image above and perform the following steps:
	
	| Attribute Name  | Attribute Value |
	| --------------- | -------------------- |
	| clever.teacher.credentials.district_username|user.userprincipalname|
	| clever.student.credentials.district_username| user.userprincipalname |
	| Firstname  | user.givenname |
	| Lastname  | user.surname |

	a. Click **Add attribute** to open the **Add Attribute** dialog.

	![Configure Single Sign-On](./media/clever-tutorial/tutorial_attribute_04.png)
	
	![Configure Single Sign-On](./media/clever-tutorial/tutorial_attribute_05.png)
	
	b. In the **Name** textbox, type the attribute name shown for that row.

	c. From the **Value** list, type the attribute value shown for that row.

	d. Leave the **Namespace** textbox blank.
	
	d. Click **Ok**.
    
1. Click **Save** button.

	![Configure Single Sign-On Save button](./media/clever-tutorial/tutorial_general_400.png)

1. In a different web browser window, log in to your Clever company site as an administrator.

1. In the toolbar, click **Instant Login**.

	![Instant Login](./media/clever-tutorial/ic798984.png "Instant Login")

	> [!NOTE]
	> Before you can Test single sign-on, You have to contact [Clever Client support team](https://clever.com/about/contact/) to enable Office 365 SSO in the back end.

1. On the **Instant Login** page, perform the following steps:
    
	  ![Instant Login](./media/clever-tutorial/ic798985.png "Instant Login")
	
	  a. Type the **Login URL**.
	
	  >[!NOTE]
	  >The **Login URL** is a custom value. Contact [Clever Client support team](https://clever.com/about/contact/) to get this value.
	
	  b. As **Identity System**, select **ADFS**.

	  c. In the **Metadata URL** textbox, paste **App Federation Metadata Url** value which you have copied from the Azure portal.
	
	  d. Click **Save**.

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

   ![Create an Azure AD test user][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the Azure portal, in the left pane, click the **Azure Active Directory** button.

    ![The Azure Active Directory button](./media/clever-tutorial/create_aaduser_01.png)

1. To display the list of users, go to **Users and groups**, and then click **All users**.

    ![The "Users and groups" and "All users" links](./media/clever-tutorial/create_aaduser_02.png)

1. To open the **User** dialog box, click **Add** at the top of the **All Users** dialog box.

    ![The Add button](./media/clever-tutorial/create_aaduser_03.png)

1. In the **User** dialog box, perform the following steps:

    ![The User dialog box](./media/clever-tutorial/create_aaduser_04.png)

    a. In the **Name** box, type **BrittaSimon**.

    b. In the **User name** box, type the email address of user Britta Simon.

    c. Select the **Show Password** check box, and then write down the value that's displayed in the **Password** box.

    d. Click **Create**.

### Create a Clever test user

To enable Azure AD users to log in to Clever, they must be provisioned into Clever.

In case of Clever, Work with [Clever Client support team](https://clever.com/about/contact/) to add the users in the Clever platform. Users must be created and activated before you use single sign-on.

>[!NOTE]
>You can use any other Clever user account creation tools or APIs provided by Clever to provision Azure AD user accounts.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Clever.

![Assign the user role][200]

**To assign Britta Simon to Clever, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201]

1. In the applications list, select **Clever**.

	![The Clever link in the Applications list](./media/clever-tutorial/tutorial_clever_app.png)

1. In the menu on the left, click **Users and groups**.

	![The "Users and groups" link][202]

1. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![The Add Assignment pane][203]

1. On **Users and groups** dialog, select **Britta Simon** in the Users list.

1. Click **Select** button on **Users and groups** dialog.

1. Click **Assign** button on **Add Assignment** dialog.

### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Clever tile in the Access Panel, you should get automatically signed-on to your Clever application.
For more information about the Access Panel, see [Introduction to the Access Panel](../user-help/active-directory-saas-access-panel-introduction.md).

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

<!--Image references-->

[1]: ./media/clever-tutorial/tutorial_general_01.png
[2]: ./media/clever-tutorial/tutorial_general_02.png
[3]: ./media/clever-tutorial/tutorial_general_03.png
[4]: ./media/clever-tutorial/tutorial_general_04.png

[100]: ./media/clever-tutorial/tutorial_general_100.png

[200]: ./media/clever-tutorial/tutorial_general_200.png
[201]: ./media/clever-tutorial/tutorial_general_201.png
[202]: ./media/clever-tutorial/tutorial_general_202.png
[203]: ./media/clever-tutorial/tutorial_general_203.png


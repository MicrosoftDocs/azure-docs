---
title: 'Tutorial: Azure Active Directory integration with Achieve3000 | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Achieve3000.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: joflore

ms.assetid: 83a83d07-ff9c-46c4-b5ba-25fe2b2cd003
ms.service: active-directory
ms.component: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/19/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Achieve3000

In this tutorial, you learn how to integrate Achieve3000 with Azure Active Directory (Azure AD).

Integrating Achieve3000 with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Achieve3000.
- You can enable your users to automatically get signed-on to Achieve3000 (Single Sign-On) with their Azure AD accounts.
- You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Azure AD integration with Achieve3000, you need the following items:

- An Azure AD subscription
- An Achieve3000 single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Achieve3000 from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding Achieve3000 from the gallery
To configure the integration of Achieve3000 into Azure AD, you need to add Achieve3000 from the gallery to your list of managed SaaS apps.

**To add Achieve3000 from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![The Azure Active Directory button][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![The Enterprise applications blade][2]
	
3. To add new application, click **New application** button on the top of dialog.

	![The New application button][3]

4. In the search box, type **Achieve3000**, select **Achieve3000** from result panel then click **Add** button to add the application.

	![Achieve3000 in the results list](./media/achieve3000-tutorial/tutorial_achieve3000_addfromgallery.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Achieve3000 based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Achieve3000 is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Achieve3000 needs to be established.

In Achieve3000, assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with Achieve3000, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Create an Achieve3000 test user](#create-an-achieve3000-test-user)** - to have a counterpart of Britta Simon in Achieve3000 that is linked to the Azure AD representation of user.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Achieve3000 application.

**To configure Azure AD single sign-on with Achieve3000, perform the following steps:**

1. In the Azure portal, on the **Achieve3000** application integration page, click **Single sign-on**.

	![Configure single sign-on link][4]

2. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Single sign-on dialog box](./media/achieve3000-tutorial/tutorial_achieve3000_samlbase.png)

3. On the **Achieve3000 Domain and URLs** section, perform the following steps:

	![Achieve3000 Domain and URLs single sign-on information](./media/achieve3000-tutorial/tutorial_achieve3000_url.png)

    a. In the **Sign-on URL** textbox, type a URL using the following: pattern: `https://saml.achieve3000.com/district/<District Identifier>`

    b. In the **Identifier** textbox, type the value: `achieve3000-saml`

	> [!NOTE] 
	> The Sign-On URL value is not real. Update the value with the actual Sign-On URL. Contact [Achieve3000 Client support team](https://www.achieve3000.com/contact-us/) to get the value. 

4. On the **SAML Signing Certificate** section, click **Metadata XML** and then save the metadata file on your computer.

	![The Certificate download link](./media/achieve3000-tutorial/tutorial_achieve3000_certificate.png) 

5. Achieve3000 application expects the unique **studentID** value in the Name Identifier claim. Customer can map the correct value for the Name Identifier claim. In this case, we have mapped the **user.mail** for the demo purpose. But according to your unique identifier, you should map the correct value for it.   

	![Configure Single Sign-On attb](./media/achieve3000-tutorial/tutorial_achieve3000_attribute.png)

6. In the **User Attributes** section on the **Single sign-on** dialog, configure SAML token attribute as shown in the image and perform the following steps:
	
	| Attribute Name | Attribute Value |
	| ------------------- | -------------------- |    
	| studentID 			  | user.mail |

	a. Click **Add attribute** to open the **Add Attribute** dialog.

	![Configure Single Sign-On Add](./media/achieve3000-tutorial/tutorial_officespace_04.png)

	![Configure Single Sign-On Addattb](./media/achieve3000-tutorial/tutorial_attribute_05.png)

	b. In the **Name** textbox, type the attribute name shown for that row.

	c. From the **Value** list, type the attribute value shown for that row.
	
	d. Click **Ok**.

7. Click **Save** button.

	![Configure Single Sign-On Save button](./media/achieve3000-tutorial/tutorial_general_400.png)
	
8. To configure single sign-on on **Achieve3000** side, you need to send the downloaded **Metadata XML** to [Achieve3000 support team](https://www.achieve3000.com/contact-us/). They set this setting to have the SAML SSO connection set properly on both sides.

> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

   ![Create an Azure AD test user][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the Azure portal, in the left pane, click the **Azure Active Directory** button.

    ![The Azure Active Directory button](./media/achieve3000-tutorial/create_aaduser_01.png)

2. To display the list of users, go to **Users and groups**, and then click **All users**.

    ![The "Users and groups" and "All users" links](./media/achieve3000-tutorial/create_aaduser_02.png)

3. To open the **User** dialog box, click **Add** at the top of the **All Users** dialog box.

    ![The Add button](./media/achieve3000-tutorial/create_aaduser_03.png)

4. In the **User** dialog box, perform the following steps:

    ![The User dialog box](./media/achieve3000-tutorial/create_aaduser_04.png)

    a. In the **Name** box, type **BrittaSimon**.

    b. In the **User name** box, type the email address of user Britta Simon.

    c. Select the **Show Password** check box, and then write down the value that's displayed in the **Password** box.

    d. Click **Create**.
 
### Create an Achieve3000 test user

In this section, you create a user called Britta Simon in Achieve3000. Work with [Achieve3000 support team](https://www.achieve3000.com/contact-us/) to add the users in the Achieve3000 platform. Users must be created and activated before you use single sign-on. 

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Achieve3000.

![Assign the user role][200] 

**To assign Britta Simon to Achieve3000, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

2. In the applications list, select **Achieve3000**.

	![The Achieve3000 link in the Applications list](./media/achieve3000-tutorial/tutorial_achieve3000_app.png)  

3. In the menu on the left, click **Users and groups**.

	![The "Users and groups" link][202]

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![The Add Assignment pane][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.
	
### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Achieve3000 tile in the Access Panel, you should get automatically signed-on to your Achieve3000 application.
For more information about the Access Panel, see [Introduction to the Access Panel](../user-help/active-directory-saas-access-panel-introduction.md). 

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)



<!--Image references-->

[1]: ./media/achieve3000-tutorial/tutorial_general_01.png
[2]: ./media/achieve3000-tutorial/tutorial_general_02.png
[3]: ./media/achieve3000-tutorial/tutorial_general_03.png
[4]: ./media/achieve3000-tutorial/tutorial_general_04.png

[100]: ./media/achieve3000-tutorial/tutorial_general_100.png

[200]: ./media/achieve3000-tutorial/tutorial_general_200.png
[201]: ./media/achieve3000-tutorial/tutorial_general_201.png
[202]: ./media/achieve3000-tutorial/tutorial_general_202.png
[203]: ./media/achieve3000-tutorial/tutorial_general_203.png


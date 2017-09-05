---
title: 'Tutorial: Azure Active Directory integration with RealtimeBoard | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and RealtimeBoard.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila
ms.reviewer: joflore

ms.assetid: a37fc1c0-4bae-4173-989b-00de53a0076f
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/31/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with RealtimeBoard

In this tutorial, you learn how to integrate RealtimeBoard with Azure Active Directory (Azure AD).

Integrating RealtimeBoard with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to RealtimeBoard.
- You can enable your users to automatically get signed-on to RealtimeBoard (Single Sign-On) with their Azure AD accounts.
- You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](active-directory-appssoaccess-whatis.md).

## Prerequisites

To configure Azure AD integration with RealtimeBoard, you need the following items:

- An Azure AD subscription
- A RealtimeBoard single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding RealtimeBoard from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding RealtimeBoard from the gallery
To configure the integration of RealtimeBoard into Azure AD, you need to add RealtimeBoard from the gallery to your list of managed SaaS apps.

**To add RealtimeBoard from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![The Azure Active Directory button][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![The Enterprise applications blade][2]
	
3. To add new application, click **New application** button on the top of dialog.

	![The New application button][3]

4. In the search box, type **RealtimeBoard**, select **RealtimeBoard** from result panel then click **Add** button to add the application.

	![RealtimeBoard in the results list](./media/active-directory-saas-realtimeboard-tutorial/tutorial_realtimeboard_addfromgallery.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with RealtimeBoard based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in RealtimeBoard is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in RealtimeBoard needs to be established.

In RealtimeBoard, assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with RealtimeBoard, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Create a RealtimeBoard test user](#create-a-realtimeboard-test-user)** - to have a counterpart of Britta Simon in RealtimeBoard that is linked to the Azure AD representation of user.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your RealtimeBoard application.

**To configure Azure AD single sign-on with RealtimeBoard, perform the following steps:**

1. In the Azure portal, on the **RealtimeBoard** application integration page, click **Single sign-on**.

	![Configure single sign-on link][4]

2. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Single sign-on dialog box](./media/active-directory-saas-realtimeboard-tutorial/tutorial_realtimeboard_samlbase.png)

3. On the **RealtimeBoard Domain and URLs** section, if you wish to configure the application in **IDP** initiated mode:

	![RealtimeBoard Domain and URLs single sign-on information](./media/active-directory-saas-realtimeboard-tutorial/tutorial_realtimeboard_url.png)

	In the **Identifier** textbox, type a URL as: `https://realtimeboard.com/`

4. Check **Show advanced URL settings**, if you wish to configure the application in **SP** initiated mode:

	![Configure Single Sign-On](./media/active-directory-saas-realtimeboard-tutorial/tutorial_realtimeboard_url2.png)

    In the **Sign-on URL** textbox, type a URL as: `https://realtimeboard.com/sso/saml`

5. On the **SAML Signing Certificate** section, click **Metadata XML** and then save the metadata file on your computer.

	![The Certificate download link](./media/active-directory-saas-realtimeboard-tutorial/tutorial_realtimeboard_certificate.png) 

6. Click **Save** button.

	![Configure Single Sign-On Save button](./media/active-directory-saas-realtimeboard-tutorial/tutorial_general_400.png)

7. To configure single sign-on on **RealtimeBoard** side, you need to send the downloaded **Metadata XML** to [RealtimeBoard support team](mailto:support@realtimeboard.com). They set this setting to have the SAML SSO connection set properly on both sides.

> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)
> 

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

   ![Create an Azure AD test user][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the Azure portal, in the left pane, click the **Azure Active Directory** button.

    ![The Azure Active Directory button](./media/active-directory-saas-realtimeboard-tutorial/create_aaduser_01.png)

2. To display the list of users, go to **Users and groups**, and then click **All users**.

    ![The "Users and groups" and "All users" links](./media/active-directory-saas-realtimeboard-tutorial/create_aaduser_02.png)

3. To open the **User** dialog box, click **Add** at the top of the **All Users** dialog box.

    ![The Add button](./media/active-directory-saas-realtimeboard-tutorial/create_aaduser_03.png)

4. In the **User** dialog box, perform the following steps:

    ![The User dialog box](./media/active-directory-saas-realtimeboard-tutorial/create_aaduser_04.png)

    a. In the **Name** box, type **BrittaSimon**.

    b. In the **User name** box, type the email address of user Britta Simon.

    c. Select the **Show Password** check box, and then write down the value that's displayed in the **Password** box.

    d. Click **Create**.
 
### Create a RealtimeBoard test user

The objective of this section is to create a user called Britta Simon in RealtimeBoard. RealtimeBoard supports just-in-time provisioning, which is by default enabled.

There is no action item for you in this section. If a user doesn't already exist in RealtimeBoard, a new one is created when you attempt to access RealtimeBoard.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to RealtimeBoard.

![Assign the user role][200] 

**To assign Britta Simon to RealtimeBoard, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

2. In the applications list, select **RealtimeBoard**.

	![The RealtimeBoard link in the Applications list](./media/active-directory-saas-realtimeboard-tutorial/tutorial_realtimeboard_app.png)  

3. In the menu on the left, click **Users and groups**.

	![The "Users and groups" link][202]

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![The Add Assignment pane][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.
	
### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the RealtimeBoard tile in the Access Panel, you should get automatically signed-on to your RealtimeBoard application.
For more information about the Access Panel, see [Introduction to the Access Panel](active-directory-saas-access-panel-introduction.md). 

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](active-directory-saas-tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](active-directory-appssoaccess-whatis.md)



<!--Image references-->

[1]: ./media/active-directory-saas-realtimeboard-tutorial/tutorial_general_01.png
[2]: ./media/active-directory-saas-realtimeboard-tutorial/tutorial_general_02.png
[3]: ./media/active-directory-saas-realtimeboard-tutorial/tutorial_general_03.png
[4]: ./media/active-directory-saas-realtimeboard-tutorial/tutorial_general_04.png

[100]: ./media/active-directory-saas-realtimeboard-tutorial/tutorial_general_100.png

[200]: ./media/active-directory-saas-realtimeboard-tutorial/tutorial_general_200.png
[201]: ./media/active-directory-saas-realtimeboard-tutorial/tutorial_general_201.png
[202]: ./media/active-directory-saas-realtimeboard-tutorial/tutorial_general_202.png
[203]: ./media/active-directory-saas-realtimeboard-tutorial/tutorial_general_203.png


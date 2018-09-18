---
title: 'Tutorial: Azure Active Directory integration with Insight4GRC | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Insight4GRC.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila
ms.reviewer: joflore

ms.assetid: db3b4bd1-b372-4660-88d7-aea0b0ca962e
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/22/2018
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Insight4GRC

In this tutorial, you learn how to integrate Insight4GRC with Azure Active Directory (Azure AD).

Integrating Insight4GRC with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Insight4GRC.
- You can enable your users to automatically get signed-on to Insight4GRC (Single Sign-On) with their Azure AD accounts.
- You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Azure AD integration with Insight4GRC, you need the following items:

- An Azure AD subscription
- An Insight4GRC single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Insight4GRC from the gallery
1. Configuring and testing Azure AD single sign-on

## Adding Insight4GRC from the gallery
To configure the integration of Insight4GRC into Azure AD, you need to add Insight4GRC from the gallery to your list of managed SaaS apps.

**To add Insight4GRC from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![The Azure Active Directory button][1]

1. Navigate to **Enterprise applications**. Then go to **All applications**.

	![The Enterprise applications blade][2]
	
1. To add new application, click **New application** button on the top of dialog.

	![The New application button][3]

1. In the search box, type **Insight4GRC**, select **Insight4GRC** from result panel then click **Add** button to add the application.

	![Insight4GRC in the results list](./media/insight4grc-tutorial/tutorial_insight_addfromgallery.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Insight4GRC based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Insight4GRC is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Insight4GRC needs to be established.

To configure and test Azure AD single sign-on with Insight4GRC, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
1. **[Create an Insight4GRC test user](#create-an-insight4grc-test-user)** - to have a counterpart of Britta Simon in Insight4GRC that is linked to the Azure AD representation of user.
1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
1. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Insight4GRC application.

**To configure Azure AD single sign-on with Insight4GRC, perform the following steps:**

1. In the Azure portal, on the **Insight4GRC** application integration page, click **Single sign-on**.

	![Configure single sign-on link][4]

1. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Single sign-on dialog box](./media/insight4grc-tutorial/tutorial_insight_samlbase.png)

1. On the **Insight4GRC Domain and URLs** section, perform the following steps if you wish to configure the application in **IDP** initiated mode:

	![Insight4GRC Domain and URLs single sign-on information](./media/insight4grc-tutorial/tutorial_insight_url.png)

    a. In the **Identifier** textbox, type a URL using the following pattern: `https://<subdomain>.Insight4GRC.com/SAML`

	b. In the **Reply URL** textbox, type a URL using the following pattern: `https://<subdomain>.Insight4GRC.com/Public/SAML/ACS.aspx`

1. Check **Show advanced URL settings** and perform the following step if you wish to configure the application in **SP** initiated mode:

	![Insight4GRC Domain and URLs single sign-on information](./media/insight4grc-tutorial/tutorial_insight_url1.png)

    In the **Sign-on URL** textbox, type a URL using the following pattern: `https://<subdomain>.Insight4GRC.com/Public/Login.aspx`
	 
	> [!NOTE] 
	> These values are not real. Update these values with the actual Identifier, Reply URL, and Sign-On URL. Contact [Insight4GRC Client support team](mailto:support.ss@rsmuk.com) to get these values. 

1. On the **SAML Signing Certificate** section, click the copy button to copy **App Federation Metadata Url** and paste it into notepad.

	![The Certificate download link](./media/insight4grc-tutorial/tutorial_insight_certificate.png) 

1. Click **Save** button.

	![Configure Single Sign-On Save button](./media/insight4grc-tutorial/tutorial_general_400.png)
	
1. To configure single sign-on on **Insight4GRC** side, you need to send the copied **App Federation Metadata Url** to [Insight4GRC support team](mailto:support.ss@rsmuk.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

   ![Create an Azure AD test user][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the Azure portal, in the left pane, click the **Azure Active Directory** button.

    ![The Azure Active Directory button](./media/insight4grc-tutorial/create_aaduser_01.png)

1. To display the list of users, go to **Users and groups**, and then click **All users**.

    ![The "Users and groups" and "All users" links](./media/insight4grc-tutorial/create_aaduser_02.png)

1. To open the **User** dialog box, click **Add** at the top of the **All Users** dialog box.

    ![The Add button](./media/insight4grc-tutorial/create_aaduser_03.png)

1. In the **User** dialog box, perform the following steps:

    ![The User dialog box](./media/insight4grc-tutorial/create_aaduser_04.png)

    a. In the **Name** box, type **BrittaSimon**.

    b. In the **User name** box, type the email address of user Britta Simon.

    c. Select the **Show Password** check box, and then write down the value that's displayed in the **Password** box.

    d. Click **Create**.
 
### Create an Insight4GRC test user

The objective of this section is to create a user called Britta Simon in Insight4GRC. Insight4GRC supports just-in-time provisioning, which is by default enabled. There is no action item for you in this section. A new user is created during an attempt to access Insight4GRC if it doesn't exist yet.

>[!Note]
>If you need to create a user manually, contact [Insight4GRC Client support team](mailto:support.ss@rsmuk.com).

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Insight4GRC.

![Assign the user role][200] 

**To assign Britta Simon to Insight4GRC, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

1. In the applications list, select **Insight4GRC**.

	![The Insight4GRC link in the Applications list](./media/insight4grc-tutorial/tutorial_insight_app.png)  

1. In the menu on the left, click **Users and groups**.

	![The "Users and groups" link][202]

1. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![The Add Assignment pane][203]

1. On **Users and groups** dialog, select **Britta Simon** in the Users list.

1. Click **Select** button on **Users and groups** dialog.

1. Click **Assign** button on **Add Assignment** dialog.
	
### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Insight4GRC tile in the Access Panel, you should get automatically signed-on to your Insight4GRC application.
For more information about the Access Panel, see [Introduction to the Access Panel](../user-help/active-directory-saas-access-panel-introduction.md). 

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)



<!--Image references-->

[1]: ./media/insight4grc-tutorial/tutorial_general_01.png
[2]: ./media/insight4grc-tutorial/tutorial_general_02.png
[3]: ./media/insight4grc-tutorial/tutorial_general_03.png
[4]: ./media/insight4grc-tutorial/tutorial_general_04.png

[100]: ./media/insight4grc-tutorial/tutorial_general_100.png

[200]: ./media/insight4grc-tutorial/tutorial_general_200.png
[201]: ./media/insight4grc-tutorial/tutorial_general_201.png
[202]: ./media/insight4grc-tutorial/tutorial_general_202.png
[203]: ./media/insight4grc-tutorial/tutorial_general_203.png


---
title: 'Tutorial: Azure Active Directory integration with Reviewsnap | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Reviewsnap.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila
ms.reviewer: joflore

ms.assetid: b00fb373-2b31-4dcf-84ce-abc29e4c639c
ms.service: active-directory
ms.component: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/16/2018
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Reviewsnap

In this tutorial, you learn how to integrate Reviewsnap with Azure Active Directory (Azure AD).

Integrating Reviewsnap with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Reviewsnap.
- You can enable your users to automatically get signed-on to Reviewsnap (Single Sign-On) with their Azure AD accounts.
- You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Azure AD integration with Reviewsnap, you need the following items:

- An Azure AD subscription
- A Reviewsnap single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Reviewsnap from the gallery
1. Configuring and testing Azure AD single sign-on

## Adding Reviewsnap from the gallery
To configure the integration of Reviewsnap into Azure AD, you need to add Reviewsnap from the gallery to your list of managed SaaS apps.

**To add Reviewsnap from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![The Azure Active Directory button][1]

1. Navigate to **Enterprise applications**. Then go to **All applications**.

	![The Enterprise applications blade][2]
	
1. To add new application, click **New application** button on the top of dialog.

	![The New application button][3]

1. In the search box, type **Reviewsnap**, select **Reviewsnap** from result panel then click **Add** button to add the application.

	![Reviewsnap in the results list](./media/reviewsnap-tutorial/tutorial_reviewsnap_addfromgallery.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Reviewsnap based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Reviewsnap is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Reviewsnap needs to be established.

To configure and test Azure AD single sign-on with Reviewsnap, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
1. **[Create a Reviewsnap test user](#create-a-reviewsnap-test-user)** - to have a counterpart of Britta Simon in Reviewsnap that is linked to the Azure AD representation of user.
1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
1. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Reviewsnap application.

**To configure Azure AD single sign-on with Reviewsnap, perform the following steps:**

1. In the Azure portal, on the **Reviewsnap** application integration page, click **Single sign-on**.

	![Configure single sign-on link][4]

1. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Single sign-on dialog box](./media/reviewsnap-tutorial/tutorial_reviewsnap_samlbase.png)

1. On the **Reviewsnap Domain and URLs** section, perform the following steps if you wish to configure the application in **IDP** initiated mode:

	![Reviewsnap Domain and URLs single sign-on information](./media/reviewsnap-tutorial/tutorial_reviewsnap_url.png)

    a. In the **Identifier** textbox, type a URL: `https://app.reviewsnap.com`

	b. In the **Reply URL** textbox, type a URL using the following pattern: `https://app.reviewsnap.com/auth/saml/callback?namespace=<CUSTOMER_NAMESPACE>
`

1. Check **Show advanced URL settings** and perform the following step if you wish to configure the application in **SP** initiated mode:

	![Reviewsnap Domain and URLs single sign-on information](./media/reviewsnap-tutorial/tutorial_reviewsnap_url1.png)

    In the **Sign-on URL** textbox, type a URL: `https://app.reviewsnap.com/login`
	 
	> [!NOTE] 
	> The Reply URL value is not real. Update the value with the actual Reply URL. Contact [Reviewsnap Client support team](mailto:support@reviewsnap.com) to get the value. 

1. On the **SAML Signing Certificate** section, click **Certificate (Base64)** and then save the certificate file on your computer.

	![The Certificate download link](./media/reviewsnap-tutorial/tutorial_reviewsnap_certificate.png) 

1. Click **Save** button.

	![Configure Single Sign-On Save button](./media/reviewsnap-tutorial/tutorial_general_400.png)
	
1. On the **Reviewsnap Configuration** section, click **Configure Reviewsnap** to open **Configure sign-on** window. Copy the **Sign-Out URL, SAML Entity ID, and SAML Single Sign-On Service URL** from the **Quick Reference section.**

	![Reviewsnap Configuration](./media/reviewsnap-tutorial/tutorial_reviewsnap_configure.png) 

1. To configure single sign-on on **Reviewsnap** side, you need to send the downloaded **Certificate (Base64), Sign-Out URL, SAML Entity ID, and SAML Single Sign-On Service URL** to [Reviewsnap support team](mailto:support@reviewsnap.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

   ![Create an Azure AD test user][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the Azure portal, in the left pane, click the **Azure Active Directory** button.

    ![The Azure Active Directory button](./media/reviewsnap-tutorial/create_aaduser_01.png)

1. To display the list of users, go to **Users and groups**, and then click **All users**.

    ![The "Users and groups" and "All users" links](./media/reviewsnap-tutorial/create_aaduser_02.png)

1. To open the **User** dialog box, click **Add** at the top of the **All Users** dialog box.

    ![The Add button](./media/reviewsnap-tutorial/create_aaduser_03.png)

1. In the **User** dialog box, perform the following steps:

    ![The User dialog box](./media/reviewsnap-tutorial/create_aaduser_04.png)

    a. In the **Name** box, type **BrittaSimon**.

    b. In the **User name** box, type the email address of user Britta Simon.

    c. Select the **Show Password** check box, and then write down the value that's displayed in the **Password** box.

    d. Click **Create**.
 
### Create a Reviewsnap test user

In this section, you create a user called Britta Simon in Reviewsnap. Work with [Reviewsnap support team](mailto:support@reviewsnap.com) to add the users in the Reviewsnap platform. Users must be created and activated before you use single sign-on

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Reviewsnap.

![Assign the user role][200] 

**To assign Britta Simon to Reviewsnap, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

1. In the applications list, select **Reviewsnap**.

	![The Reviewsnap link in the Applications list](./media/reviewsnap-tutorial/tutorial_reviewsnap_app.png)  

1. In the menu on the left, click **Users and groups**.

	![The "Users and groups" link][202]

1. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![The Add Assignment pane][203]

1. On **Users and groups** dialog, select **Britta Simon** in the Users list.

1. Click **Select** button on **Users and groups** dialog.

1. Click **Assign** button on **Add Assignment** dialog.
	
### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Reviewsnap tile in the Access Panel, you should get automatically signed-on to your Reviewsnap application.
For more information about the Access Panel, see [Introduction to the Access Panel](../user-help/active-directory-saas-access-panel-introduction.md). 

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)



<!--Image references-->

[1]: ./media/reviewsnap-tutorial/tutorial_general_01.png
[2]: ./media/reviewsnap-tutorial/tutorial_general_02.png
[3]: ./media/reviewsnap-tutorial/tutorial_general_03.png
[4]: ./media/reviewsnap-tutorial/tutorial_general_04.png

[100]: ./media/reviewsnap-tutorial/tutorial_general_100.png

[200]: ./media/reviewsnap-tutorial/tutorial_general_200.png
[201]: ./media/reviewsnap-tutorial/tutorial_general_201.png
[202]: ./media/reviewsnap-tutorial/tutorial_general_202.png
[203]: ./media/reviewsnap-tutorial/tutorial_general_203.png


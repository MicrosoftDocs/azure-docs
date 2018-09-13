---
title: 'Tutorial: Azure Active Directory integration with Uberflip | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Uberflip.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila
ms.reviewer: joflore

ms.assetid: 754b1f5b-6694-4fd6-9e1e-9fad769c64db
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/21/2018
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Uberflip

In this tutorial, you learn how to integrate Uberflip with Azure Active Directory (Azure AD).

Integrating Uberflip with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Uberflip.
- You can enable your users to automatically get signed-on to Uberflip (Single Sign-On) with their Azure AD accounts.
- You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md)

## Prerequisites

To configure Azure AD integration with Uberflip, you need the following items:

- An Azure AD subscription
- A Uberflip single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description

In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Uberflip from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding Uberflip from the gallery

To configure the integration of Uberflip into Azure AD, you need to add Uberflip from the gallery to your list of managed SaaS apps.

**To add Uberflip from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![The Azure Active Directory button][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![The Enterprise applications blade][2]

3. To add new application, click **New application** button on the top of dialog.

	![The New application button][3]

4. In the search box, type **Uberflip**, select **Uberflip** from result panel then click **Add** button to add the application.

	![Uberflip in the results list](./media/uberflip-tutorial/tutorial_uberflip_addfromgallery.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Uberflip based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Uberflip is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Uberflip needs to be established.

To configure and test Azure AD single sign-on with Uberflip, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Create an Uberflip test user](#create-an-uberflip-test-user)** - to have a counterpart of Britta Simon in Uberflip that is linked to the Azure AD representation of user.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Uberflip application.

**To configure Azure AD single sign-on with Uberflip, perform the following steps:**

1. In the Azure portal, on the **Uberflip** application integration page, click **Single sign-on**.

	![Configure single sign-on link][4]

2. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.

	![Single sign-on dialog box](./media/uberflip-tutorial/tutorial_uberflip_samlbase.png)

3. On the **Uberflip Domain and URLs** section, perform the following step if you wish to configure the application in **IDP** initiated mode:

	![Uberflip Domain and URLs single sign-on information](./media/uberflip-tutorial/tutorial_uberflip_url1.png)

    In the **Reply URL** textbox, type a URL using the following pattern: `https://app.uberflip.com/sso/saml2/<IDPID>/<ACCOUNTID>`

	> [!NOTE]
	> This value is not real. Update this value with the actual Reply URL. Contact [Uberflip Client support team](mailto:support@uberflip.com) to get this value.

4. Check **Show advanced URL settings** and perform the following step if you wish to configure the application in **SP** initiated mode:

	![Uberflip Domain and URLs single sign-on information](./media/uberflip-tutorial/tutorial_uberflip_url2.png)

    In the **Sign-on URL** textbox, type the URL: `https://app.uberflip.com/users/login`

5. On the **SAML Signing Certificate** section, click **Metadata XML** and then save the metadata file on your computer.

	![The Certificate download link](./media/uberflip-tutorial/tutorial_uberflip_certificate.png) 

6. Click **Save** button.

	![Configure Single Sign-On Save button](./media/uberflip-tutorial/tutorial_general_400.png)

7. To configure single sign-on on **Uberflip** side, you need to send the downloaded **Metadata XML** to [Uberflip support team](mailto:support@uberflip.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

   ![Create an Azure AD test user][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the Azure portal, in the left pane, click the **Azure Active Directory** button.

    ![The Azure Active Directory button](./media/uberflip-tutorial/create_aaduser_01.png)

2. To display the list of users, go to **Users and groups**, and then click **All users**.

    ![The "Users and groups" and "All users" links](./media/uberflip-tutorial/create_aaduser_02.png)

3. To open the **User** dialog box, click **Add** at the top of the **All Users** dialog box.

    ![The Add button](./media/uberflip-tutorial/create_aaduser_03.png)

4. In the **User** dialog box, perform the following steps:

    ![The User dialog box](./media/uberflip-tutorial/create_aaduser_04.png)

    a. In the **Name** box, type **BrittaSimon**.

    b. In the **User name** box, type the email address of user Britta Simon.

    c. Select the **Show Password** check box, and then write down the value that's displayed in the **Password** box.

    d. Click **Create**.

### Create an Uberflip test user

The objective of this section is to create a user called Britta Simon in Uberflip. Uberflip supports just-in-time provisioning, which is by default enabled. There is no action item for you in this section. A new user is created during an attempt to access Uberflip if it doesn't exist yet.

> [!Note]
> If you need to create a user manually, contact [Uberflip support team](mailto:support@uberflip.com).

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Uberflip.

![Assign the user role][200] 

**To assign Britta Simon to Uberflip, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

2. In the applications list, select **Uberflip**.

	![The Uberflip link in the Applications list](./media/uberflip-tutorial/tutorial_uberflip_app.png)  

3. In the menu on the left, click **Users and groups**.

	![The "Users and groups" link][202]

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![The Add Assignment pane][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.

### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Uberflip tile in the Access Panel, you should get automatically signed-on to your Uberflip application.
For more information about the Access Panel, see [Introduction to the Access Panel](../user-help/active-directory-saas-access-panel-introduction.md). 

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

<!--Image references-->

[1]: ./media/uberflip-tutorial/tutorial_general_01.png
[2]: ./media/uberflip-tutorial/tutorial_general_02.png
[3]: ./media/uberflip-tutorial/tutorial_general_03.png
[4]: ./media/uberflip-tutorial/tutorial_general_04.png

[100]: ./media/uberflip-tutorial/tutorial_general_100.png

[200]: ./media/uberflip-tutorial/tutorial_general_200.png
[201]: ./media/uberflip-tutorial/tutorial_general_201.png
[202]: ./media/uberflip-tutorial/tutorial_general_202.png
[203]: ./media/uberflip-tutorial/tutorial_general_203.png
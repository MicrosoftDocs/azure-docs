---
title: 'Tutorial: Azure Active Directory integration with Useall | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Useall.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila
ms.reviewer: joflore

ms.assetid: 8dd9e452-a5b6-4a16-a97c-b60211ea6b95
ms.service: active-directory
ms.component: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/30/2018
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Useall

In this tutorial, you learn how to integrate Useall with Azure Active Directory (Azure AD).

Integrating Useall with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Useall.
- You can enable your users to automatically get signed-on to Useall (Single Sign-On) with their Azure AD accounts.
- You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md)

## Prerequisites

To configure Azure AD integration with Useall, you need the following items:

- An Azure AD subscription
- A Useall single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description

In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Useall from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding Useall from the gallery

To configure the integration of Useall into Azure AD, you need to add Useall from the gallery to your list of managed SaaS apps.

**To add Useall from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![The Enterprise applications blade][2]

3. To add new application, click **New application** button on the top of dialog.

	![The New application button][3]

4. In the search box, type **Useall**, select **Useall** from result panel then click **Add** button to add the application.

	![Useall in the results list](./media/useall-tutorial/tutorial_useall_addfromgallery.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Useall based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Useall is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Useall needs to be established.

To configure and test Azure AD single sign-on with Useall, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Creating Useall test user](#creating-useall-test-user)** - to have a counterpart of Britta Simon in Useall that is linked to the Azure AD representation of user.
4. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Testing single sign-on](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Useall application.

**To configure Azure AD single sign-on with Useall, perform the following steps:**

1. In the Azure portal, on the **Useall** application integration page, click **Single sign-on**.

	![Configure single sign-on link][4]

2. On the **Select a Single sign-on method** dialog, Click **Select** for **SAML** mode to enable single sign-on.

    ![Configure Single Sign-On](common/tutorial_general_301.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Configure Single Sign-On](common/editconfigure.png)

4. On the **Basic SAML Configuration** section, perform the following steps:

	![Useall Domain and URLs single sign-on information](./media/useall-tutorial/tutorial_useall_url.png)

    a. In the **Sign on URL** textbox, type a URL using the following pattern: `https://<SUBDOMAIN>.useall.com.br/tenant/useall`

	b. In the **Identifier** textbox, type a URL using the following pattern: `https://<SUBDOMAIN>.useall.com.br/tenant/apiuseall/saml2`

	> [!NOTE]
	> These values are not real. Update these values with the actual Sign on URL and Identifier. Contact [Useall support team](mailto:luizotavio@useall.com.br) to get these values.

5. On the **Set up Single Sign-On with SAML** page, In the **SAML Signing Certificate** section, click copy button to copy **App Federation Metadata Url** and save it on your computer.

	![The Certificate download link](./media/useall-tutorial/tutorial_useall_certificate.png)

6. To configure single sign-on on **Useall** side, you need to send the downloaded **App Federation Metadata Url** to [Useall support team](mailto:luizotavio@useall.com.br). They set this setting to have the SAML SSO connection set properly on both sides.

### Creating an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

1. In the Azure portal, in the left pane, select **Azure Active Directory**, select **Users**, and then select **All users**.

	![Create Azure AD User][100]

2. Select **New user** at the top of the screen.

	![Creating an Azure AD test user](common/create_aaduser_01.png)

3. In the User properties, perform the following steps.

	![Creating an Azure AD test user](common/create_aaduser_02.png)

    a. In the **Name** field, enter **BrittaSimon**.
  
    b. In the **User name** field, type **brittasimon@yourcompanydomain.extension**  
    For example, BrittaSimon@contoso.com

    c. Select **Properties**, select the **Show password** check box, and then write down the value that's displayed in the Password box.

    d. Select **Create**.
  
### Creating Useall test user

In this section, you create a user called Britta Simon in Useall. Work with [Useall support team](mailto:luizotavio@useall.com.br) to add the users in the Useall platform. Users must be created and activated before you use single sign-on.

### Assigning the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Useall.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**.

	![Assign User][201]

2. In the applications list, select **Useall**.

	![Configure Single Sign-On](./media/useall-tutorial/tutorial_useall_app.png)

3. In the menu on the left, click **Users and groups**.

	![Assign User][202]

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![Assign User][203]

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. In the **Add Assignment** dialog select the **Assign** button.

### Testing single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Useall tile in the Access Panel, you should get automatically signed-on to your Useall application.
For more information about the Access Panel, see [Introduction to the Access Panel](../user-help/active-directory-saas-access-panel-introduction.md).

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

<!--Image references-->

[1]: common/tutorial_general_01.png
[2]: common/tutorial_general_02.png
[3]: common/tutorial_general_03.png
[4]: common/tutorial_general_04.png

[100]: common/tutorial_general_100.png

[200]: common/tutorial_general_200.png
[201]: common/tutorial_general_201.png
[202]: common/tutorial_general_202.png
[203]: common/tutorial_general_203.png
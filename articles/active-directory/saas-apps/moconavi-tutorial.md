---
title: 'Tutorial: Azure Active Directory integration with moconavi | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and moconavi.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila
ms.reviewer: joflore

ms.assetid: e1916224-e1c2-426f-b233-0a2518fa41db
ms.service: active-directory
ms.component: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/30/2018
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with moconavi

In this tutorial, you learn how to integrate moconavi with Azure Active Directory (Azure AD).

Integrating moconavi with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to moconavi.
- You can enable your users to automatically get signed-on to moconavi (Single Sign-On) with their Azure AD accounts.
- You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Azure AD integration with moconavi, you need the following items:

- An Azure AD subscription
- A moconavi single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment.
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding moconavi from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding moconavi from the gallery
To configure the integration of moconavi into Azure AD, you need to add moconavi from the gallery to your list of managed SaaS apps.

**To add moconavi from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![The Azure Active Directory button][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![The Enterprise applications blade][2]

3. To add new application, click **New application** button on the top of dialog.

	![The New application button][3]

4. In the search box, type **moconavi**, select **moconavi** from result panel then click **Add** button to add the application.

	![moconavi in the results list](./media/moconavi-tutorial/tutorial_moconavi_addfromgallery.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with moconavi based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in moconavi is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in moconavi needs to be established.

To configure and test Azure AD single sign-on with moconavi, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Create a moconavi test user](#create-a-moconavi-test-user)** - to have a counterpart of Britta Simon in moconavi that is linked to the Azure AD representation of user.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your moconavi application.

**To configure Azure AD single sign-on with moconavi, perform the following steps:**

1. In the Azure portal, on the **moconavi** application integration page, click **Single sign-on**.

	![Configure single sign-on link][4]

2. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.

	![Single sign-on dialog box](./media/moconavi-tutorial/tutorial_moconavi_samlbase.png)

3. On the **moconavi Domain and URLs** section, perform the following steps:

	![moconavi Domain and URLs single sign-on information](./media/moconavi-tutorial/tutorial_moconavi_url.png)

    a. In the **Sign-on URL** textbox, type a URL using the following pattern: `https://<yourserverurl>/moconavi-saml2/saml/login`

	b. In the **Identifier** textbox, type a URL using the following pattern: `https://<yourserverurl>/moconavi-saml2`

	C. In the **Reply URL** textbox, type a URL using the following pattern: `https://<yourserverurl>/moconavi-saml2/saml/SSO`

	> [!NOTE]
	> These values are not real. Update these values with the actual Sign-On URL, Identifier and Reply URL. Contact [moconavi Client support team](mailto:support@recomot.co.jp) to get these values.

4. On the **SAML Signing Certificate** section, click **Metadata XML** and then save the metadata file on your computer.

	![The Certificate download link](./media/moconavi-tutorial/tutorial_moconavi_certificate.png)

5. Click **Save** button.

	![Configure Single Sign-On Save button](./media/moconavi-tutorial/tutorial_general_400.png)

6. To configure single sign-on on **moconavi** side, you need to send the downloaded **Metadata XML** to [moconavi support team](mailto:support@recomot.co.jp). They set this setting to have the SAML SSO connection set properly on both sides.

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

   ![Create an Azure AD test user][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the Azure portal, in the left pane, click the **Azure Active Directory** button.

    ![The Azure Active Directory button](./media/moconavi-tutorial/create_aaduser_01.png)

2. To display the list of users, go to **Users and groups**, and then click **All users**.

    ![The "Users and groups" and "All users" links](./media/moconavi-tutorial/create_aaduser_02.png)

3. To open the **User** dialog box, click **Add** at the top of the **All Users** dialog box.

    ![The Add button](./media/moconavi-tutorial/create_aaduser_03.png)

4. In the **User** dialog box, perform the following steps:

    ![The User dialog box](./media/moconavi-tutorial/create_aaduser_04.png)

    a. In the **Name** box, type **BrittaSimon**.

    b. In the **User name** box, type the email address of user Britta Simon.

    c. Select the **Show Password** check box, and then write down the value that's displayed in the **Password** box.

    d. Click **Create**.

### Create a moconavi test user

In this section, you create a user called Britta Simon in moconavi. Work with [moconavi support team](mailto:support@recomot.co.jp) to add the users in the moconavi platform. Users must be created and activated before you use single sign-on.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to moconavi.

![Assign the user role][200]

**To assign Britta Simon to moconavi, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201]

2. In the applications list, select **moconavi**.

	![The moconavi link in the Applications list](./media/moconavi-tutorial/tutorial_moconavi_app.png)

3. In the menu on the left, click **Users and groups**.

	![The "Users and groups" link][202]

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![The Add Assignment pane][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.

### Test single sign-on

1. Install moconavi from Microsoft store.

2. Start moconavi.

3. Click **Connect setting** button.

	![Testing single sign-on](./media/moconavi-tutorial/testing1.png)

4. Enter `https://mcs-admin.moconavi.biz/gateway` into **Connect to URL** textbox and then click **Done** button.

	![Testing single sign-on](./media/moconavi-tutorial/testing2.png)

5. On the following screenshot, perform the following steps:

	![Testing single sign-on](./media/moconavi-tutorial/testing3.png)

	a. Enter **Input Authentication Key**:`azureAD` into **Input Authentication Key** textbox.

	b. Enter **Input User ID**: `your ad account` into **Input User ID** textbox.

	c. Click **LOGIN**.

6. Input your Azure AD password to **Password** textbox and then click **Login** button.

	![Testing single sign-on](./media/moconavi-tutorial/testing4.png)

7. Azure AD authentication is successful when the menu is displayed.

	![Testing single sign-on](./media/moconavi-tutorial/testing5.png)

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

<!--Image references-->

[1]: ./media/moconavi-tutorial/tutorial_general_01.png
[2]: ./media/moconavi-tutorial/tutorial_general_02.png
[3]: ./media/moconavi-tutorial/tutorial_general_03.png
[4]: ./media/moconavi-tutorial/tutorial_general_04.png

[100]: ./media/moconavi-tutorial/tutorial_general_100.png

[200]: ./media/moconavi-tutorial/tutorial_general_200.png
[201]: ./media/moconavi-tutorial/tutorial_general_201.png
[202]: ./media/moconavi-tutorial/tutorial_general_202.png
[203]: ./media/moconavi-tutorial/tutorial_general_203.png


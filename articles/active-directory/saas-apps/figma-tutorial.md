---
title: 'Tutorial: Azure Active Directory integration with Figma | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Figma.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila
ms.reviewer: joflore

ms.assetid: 8569cae1-87dd-4c40-9bbb-527ac80d6a96
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/30/2018
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Figma

In this tutorial, you learn how to integrate Figma with Azure Active Directory (Azure AD).

Integrating Figma with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Figma.
- You can enable your users to automatically get signed-on to Figma (Single Sign-On) with their Azure AD accounts.
- You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md)

## Prerequisites

To configure Azure AD integration with Figma, you need the following items:

- An Azure AD subscription
- A Figma [single sign-on enabled subscription](https://www.figma.com/pricing/)

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment. New customers and active subscribers of Figma Professional Team
may contact Figma to [upgrade their subscription](https://www.figma.com/pricing/) to the Figma Organization Tier.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description

In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Figma from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding Figma from the gallery

To configure the integration of Figma into Azure AD, you need to add Figma from the gallery to your list of managed SaaS apps.

**To add Figma from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![The Azure Active Directory button][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![The Enterprise applications blade][2]

3. To add new application, click **New application** button on the top of dialog.

	![The New application button][3]

4. In the search box, type **Figma**, select **Figma** from result panel then click **Add** button to add the application.

	![Figma in the results list](./media/figma-tutorial/tutorial_figma_addfromgallery.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Figma based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to be linked to Figma.  To configure and test Azure AD single sign-on with Figma, complete the following steps:

1. [**Contact Figma support team**](mailto:support@figma.com?subject=SAML+Config) to initiate a SAML configuration for your organization and get an ORG_SAML_CONFIG_ID.
2. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Create a Figma test user](#create-a-figma-test-user)** - to have a counterpart of Britta Simon in Figma that is linked to the Azure AD representation of user.
5. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Figma application.

**To configure Azure AD single sign-on with Figma, perform the following steps:**

1. In the Azure portal, on the **Figma** application integration page, click **Single sign-on**.

	![Configure single sign-on link][4]

2. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.

	![Single sign-on dialog box](./media/figma-tutorial/tutorial_figma_samlbase.png)

3. On the **Figma Domain and URLs** section, perform the following steps if you wish to configure the application in **IDP** initiated mode:

	![Figma Domain and URLs single sign-on information](./media/figma-tutorial/tutorial_figma_url1.png)

    a. In the **Identifier** textbox, type a URL using the following pattern: `https://www.figma.com/saml/<ORG_SAML_CONFIG_ID>`

	b. In the **Reply URL** textbox, type a URL using the following pattern: `https://www.figma.com/saml/<ORG_SAML_CONFIG_ID>/consume`

4. Check **Show advanced URL settings** and perform the following step if you wish to configure the application in **SP** initiated mode:

	![Figma Domain and URLs single sign-on information](./media/figma-tutorial/tutorial_figma_url2.png)

    In the **Sign-on URL** textbox, type a URL using the following pattern: `https://www.figma.com/saml/<ORG_SAML_CONFIG_ID>/start`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier, Reply URL, and Sign-On URL. Contact [Figma support team](mailto:support@figma.com?subject=SAML+Config) to get these values.

5. On the **SAML Signing Certificate** section, click the copy button to copy **App Federation Metadata Url** and paste it into notepad.

	![The Certificate download link](./media/figma-tutorial/tutorial_figma_certificate.png)

6. Click **Save** button.

	![Configure Single Sign-On Save button](./media/figma-tutorial/tutorial_general_400.png)

7. To configure single sign-on on Figma side, please fill out this form: [https://goo.gl/forms/XkRB1z5ed4eVUzXn2](https://goo.gl/forms/XkRB1z5ed4eVUzXn2). It will accept your **App Federation Metadata Url** from Step #5.

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

   ![Create an Azure AD test user][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the Azure portal, in the left pane, click the **Azure Active Directory** button.

    ![The Azure Active Directory button](./media/figma-tutorial/create_aaduser_01.png)

2. To display the list of users, go to **Users and groups**, and then click **All users**.

    ![The "Users and groups" and "All users" links](./media/figma-tutorial/create_aaduser_02.png)

3. To open the **User** dialog box, click **Add** at the top of the **All Users** dialog box.

    ![The Add button](./media/figma-tutorial/create_aaduser_03.png)

4. In the **User** dialog box, perform the following steps:

    ![The User dialog box](./media/figma-tutorial/create_aaduser_04.png)

    a. In the **Name** box, type **BrittaSimon**.

    b. In the **User name** box, type the email address of user Britta Simon.

    c. Select the **Show Password** check box, and then write down the value that's displayed in the **Password** box.

    d. Click **Create**.

### Create a Figma test user

The objective of this section is to create a user called Britta Simon in Figma. Figma supports just-in-time provisioning, which is by default enabled. There is no action item for you in this section. A new user is created during an attempt to access Figma if it doesn't exist yet.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Figma.

![Assign the user role][200]

**To assign Britta Simon to Figma, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

2. In the applications list, select **Figma**.

	![The Figma link in the Applications list](./media/figma-tutorial/tutorial_figma_app.png)  

3. In the menu on the left, click **Users and groups**.

	![The "Users and groups" link][202]

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![The Add Assignment pane][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.

### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Figma tile in the Access Panel, you should get automatically signed-on to your Figma application.
For more information about the Access Panel, see [Introduction to the Access Panel](../user-help/active-directory-saas-access-panel-introduction.md). 

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

<!--Image references-->

[1]: ./media/figma-tutorial/tutorial_general_01.png
[2]: ./media/figma-tutorial/tutorial_general_02.png
[3]: ./media/figma-tutorial/tutorial_general_03.png
[4]: ./media/figma-tutorial/tutorial_general_04.png

[100]: ./media/figma-tutorial/tutorial_general_100.png

[200]: ./media/figma-tutorial/tutorial_general_200.png
[201]: ./media/figma-tutorial/tutorial_general_201.png
[202]: ./media/figma-tutorial/tutorial_general_202.png
[203]: ./media/figma-tutorial/tutorial_general_203.png
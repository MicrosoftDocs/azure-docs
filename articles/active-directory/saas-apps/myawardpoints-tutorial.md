---
title: 'Tutorial: Azure Active Directory integration with My Award Points Top Sub/Top Team | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and My Award Points Top Sub/Top Team.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila
ms.reviewer: joflore

ms.assetid: a7a08eed-7a6b-4a83-8f8e-0add6d2fb8cf
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/27/2018
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with My Award Points Top Sub/Top Team

In this tutorial, you learn how to integrate My Award Points Top Sub/Top Team with Azure Active Directory (Azure AD).

Integrating My Award Points Top Sub/Top Team with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to My Award Points Top Sub/Top Team.
- You can enable your users to automatically get signed-on to My Award Points Top Sub/Top Team (Single Sign-On) with their Azure AD accounts.
- You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md)

## Prerequisites

To configure Azure AD integration with My Award Points Top Sub/Top Team, you need the following items:

- An Azure AD subscription
- A My Award Points Top Sub/Top Team single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description

In this tutorial, you test Azure AD single sign-on in a test environment.
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding My Award Points Top Sub/Top Team from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding My Award Points Top Sub/Top Team from the gallery

To configure the integration of My Award Points Top Sub/Top Team into Azure AD, you need to add My Award Points Top Sub/Top Team from the gallery to your list of managed SaaS apps.

**To add My Award Points Top Sub/Top Team from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![The Azure Active Directory button][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![The Enterprise applications blade][2]

3. To add new application, click **New application** button on the top of dialog.

	![The New application button][3]

4. In the search box, type **My Award Points Top Sub/Top Team**, select **My Award Points Top Sub/Top Team** from result panel then click **Add** button to add the application.

	![My Award Points Top Sub/Top Team in the results list](./media/myawardpoints-tutorial/tutorial_myawardpoints_addfromgallery.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with My Award Points Top Sub/Top Team based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in My Award Points Top Sub/Top Team is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in My Award Points Top Sub/Top Team needs to be established.

To configure and test Azure AD single sign-on with My Award Points Top Sub/Top Team, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Create a My Award Points Top Sub/Top Team test user](#create-a-my-award-points-top-subtop-team-test-user)** - to have a counterpart of Britta Simon in My Award Points Top Sub/Top Team that is linked to the Azure AD representation of user.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your My Award Points Top Sub/Top Team application.

**To configure Azure AD single sign-on with My Award Points Top Sub/Top Team, perform the following steps:**

1. In the Azure portal, on the **My Award Points Top Sub/Top Team** application integration page, click **Single sign-on**.

	![Configure single sign-on link][4]

2. On the **Single sign-on** dialog, select **Mode** as **SAML-based Sign-on** to enable single sign-on.

	![Single sign-on dialog box](./media/myawardpoints-tutorial/tutorial_myawardpoints_samlbase.png)

3. On the **My Award Points Top Sub/Top Team Domain and URLs** section, perform the following steps:

	![My Award Points Top Sub/Top Team Domain and URLs single sign-on information](./media/myawardpoints-tutorial/tutorial_myawardpoints_url.png)

    In the **Sign-on URL** textbox, type a URL using the following pattern: `https://microsoftrr.performnet.com/biwv1auth/Shibboleth.sso/Login?providerId=<SAMLENTITYID>`

	> [!NOTE]
	> You will get the `<SAMLENTITYID>` value in the later steps in this tutorial.

4. On the **SAML Signing Certificate** section, click **Metadata XML** and then save the metadata file on your computer.

	![The Certificate download link](./media/myawardpoints-tutorial/tutorial_myawardpoints_certificate.png)

5. Click **Save** button.

	![Configure Single Sign-On Save button](./media/myawardpoints-tutorial/tutorial_general_400.png)

6. In the **My Award Points Top Sub/Top Team Configuration** section, select **Configure My Award Points Top Sub/Top Team** to open the Configure sign-on window. Copy the SAML Entity ID from the **Quick Reference** section and append the SAML Entity ID value with the Sign on URL in the place of `<SAMLENTITYID>` in the **My Award Points Top Sub/Top Team Domain and URLs** section in the Azure portal.

7. To configure single sign-on on **My Award Points Top Sub/Top Team** side, you need to send the downloaded **Metadata XML** to [My Award Points Top Sub/Top Team support team](mailto:myawardpoints@biworldwide.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

   ![Create an Azure AD test user][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the Azure portal, in the left pane, click the **Azure Active Directory** button.

    ![The Azure Active Directory button](./media/myawardpoints-tutorial/create_aaduser_01.png)

2. To display the list of users, go to **Users and groups**, and then click **All users**.

    ![The "Users and groups" and "All users" links](./media/myawardpoints-tutorial/create_aaduser_02.png)

3. To open the **User** dialog box, click **Add** at the top of the **All Users** dialog box.

    ![The Add button](./media/myawardpoints-tutorial/create_aaduser_03.png)

4. In the **User** dialog box, perform the following steps:

    ![The User dialog box](./media/myawardpoints-tutorial/create_aaduser_04.png)

    a. In the **Name** box, type **BrittaSimon**.

    b. In the **User name** box, type the email address of user Britta Simon.

    c. Select the **Show Password** check box, and then write down the value that's displayed in the **Password** box.

    d. Click **Create**.

### Create a My Award Points Top Sub/Top Team test user

In this section, you create a user called Britta Simon in My Award Points Top Sub/Top Team. Work with [My Award Points Top Sub/Top Team support team](mailto:myawardpoints@biworldwide.com) to add the users in the My Award Points Top Sub/Top Team platform. Users must be created and activated before you use single sign-on.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to My Award Points Top Sub/Top Team.

![Assign the user role][200]

**To assign Britta Simon to My Award Points Top Sub/Top Team, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201]

2. In the applications list, select **My Award Points Top Sub/Top Team**.

	![The My Award Points Top Sub/Top Team link in the Applications list](./media/myawardpoints-tutorial/tutorial_myawardpoints_app.png)  

3. In the menu on the left, click **Users and groups**.

	![The "Users and groups" link][202]

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![The Add Assignment pane][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.

### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the My Award Points Top Sub/Top Team tile in the Access Panel, you should get automatically signed-on to your My Award Points Top Sub/Top Team application.
For more information about the Access Panel, see [Introduction to the Access Panel](../user-help/active-directory-saas-access-panel-introduction.md).

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

<!--Image references-->

[1]: ./media/myawardpoints-tutorial/tutorial_general_01.png
[2]: ./media/myawardpoints-tutorial/tutorial_general_02.png
[3]: ./media/myawardpoints-tutorial/tutorial_general_03.png
[4]: ./media/myawardpoints-tutorial/tutorial_general_04.png

[100]: ./media/myawardpoints-tutorial/tutorial_general_100.png

[200]: ./media/myawardpoints-tutorial/tutorial_general_200.png
[201]: ./media/myawardpoints-tutorial/tutorial_general_201.png
[202]: ./media/myawardpoints-tutorial/tutorial_general_202.png
[203]: ./media/myawardpoints-tutorial/tutorial_general_203.png
---
title: 'Tutorial: Azure Active Directory integration with Nimblex | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Nimblex.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila
ms.reviewer: joflore

ms.assetid: d3e165a5-f062-4b50-ac0b-b400838e99cd
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/05/2018
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Nimblex

In this tutorial, you learn how to integrate Nimblex with Azure Active Directory (Azure AD).

Integrating Nimblex with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Nimblex.
- You can enable your users to automatically get signed-on to Nimblex (Single Sign-On) with their Azure AD accounts.
- You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Azure AD integration with Nimblex, you need the following items:

- An Azure AD subscription
- A Nimblex single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Nimblex from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding Nimblex from the gallery
To configure the integration of Nimblex into Azure AD, you need to add Nimblex from the gallery to your list of managed SaaS apps.

**To add Nimblex from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![The Azure Active Directory button][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![The Enterprise applications blade][2]

1. To add new application, click **New application** button on the top of dialog.

	![The New application button][3]

4. In the search box, type **Nimblex**, select **Nimblex** from result panel then click **Add** button to add the application.

	![Nimblex in the results list](./media/nimblex-tutorial/tutorial_nimblex_addfromgallery.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Nimblex based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Nimblex is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Nimblex needs to be established.

To configure and test Azure AD single sign-on with Nimblex, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Create a Nimblex test user](#create-a-nimblex-test-user)** - to have a counterpart of Britta Simon in Nimblex that is linked to the Azure AD representation of user.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Nimblex application.

**To configure Azure AD single sign-on with Nimblex, perform the following steps:**

1. In the Azure portal, on the **Nimblex** application integration page, click **Single sign-on**.

	![Configure single sign-on link][4]

2. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.

	![Single sign-on dialog box](./media/nimblex-tutorial/tutorial_nimblex_samlbase.png)

3. On the **Nimblex Domain and URLs** section, perform the following steps:

	![Nimblex Domain and URLs single sign-on information](./media/nimblex-tutorial/tutorial_nimblex_url.png)

    a. In the **Sign-on URL** textbox, type a URL using the following pattern: `https://<YOUR APPLICATION PATH>/Login.aspx`

	b. In the **Identifier** textbox, type a URL using the following pattern: `https://<YOUR APPLICATION PATH>/`

	c. In the **Reply URL** textbox, type a URL using the following pattern: `https://<path-to-application>/SamlReply.aspx`

	> [!NOTE] 
	> These values are not real. Update these values with the actual Sign-On URL,Identifier and Reply URL. Contact [Nimblex Client support team](mailto:support@ebms.com.au) to get these values.

4. On the **SAML Signing Certificate** section, click **Certificate (Base64)** and then save the certificate file on your computer.

	![The Certificate download link](./media/nimblex-tutorial/tutorial_nimblex_certificate.png) 

5. Click **Save** button.

	![Configure Single Sign-On Save button](./media/nimblex-tutorial/tutorial_general_400.png)

6. On the **Nimblex Configuration** section, click **Configure Nimblex** to open **Configure sign-on** window. Copy the **SAML Single Sign-On Service URL** from the **Quick Reference section.**

	![Nimblex Configuration](./media/nimblex-tutorial/tutorial_nimblex_configure.png) 

7. In a different web browser window, log in to Nimblex as a Security Administrator.

9. On the top right side of the page, click **Settings** logo.

	![Nimblex settings](./media/nimblex-tutorial/tutorial_nimblex_settings.png)

10. On the **Control Panel** page, under **Security** section click **Single Sign-on**.

	![Nimblex settings](./media/nimblex-tutorial/tutorial_nimblex_single.png)

11. On the **Manage Single Sign-On** page, select your instance name and click **Edit**.

	![Nimblex saml](./media/nimblex-tutorial/tutorial_nimblex_saml.png)

12. On the **Edit SSO Provider** page, perform the following steps:

	![Nimblex saml](./media/nimblex-tutorial/tutorial_nimblex_sso.png)

	a. In the **Description** textbox, type your instance name.

	b. In Notepad, open the base-64 encoded certificate that you downloaded from the Azure portal, copy its content, and then paste it into the **Certificate** box.

	c. In the **Identity Provider Sso Target Url** textbox, paste the value of **SAML Single Sign-On Service URL**, which you have copied from the Azure portal.

	d. Click **Save**.

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

   ![Create an Azure AD test user][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the Azure portal, in the left pane, click the **Azure Active Directory** button.

    ![The Azure Active Directory button](./media/nimblex-tutorial/create_aaduser_01.png)

2. To display the list of users, go to **Users and groups**, and then click **All users**.

    ![The "Users and groups" and "All users" links](./media/nimblex-tutorial/create_aaduser_02.png)

3. To open the **User** dialog box, click **Add** at the top of the **All Users** dialog box.

    ![The Add button](./media/nimblex-tutorial/create_aaduser_03.png)

4. In the **User** dialog box, perform the following steps:

    ![The User dialog box](./media/nimblex-tutorial/create_aaduser_04.png)

    a. In the **Name** box, type **BrittaSimon**.

    b. In the **User name** box, type the email address of user Britta Simon.

    c. Select the **Show Password** check box, and then write down the value that's displayed in the **Password** box.

    d. Click **Create**.
 
### Create a Nimblex test user

The objective of this section is to create a user called Britta Simon in Nimblex. Nimblex supports just-in-time provisioning, which is by default enabled. There is no action item for you in this section. A new user is created during an attempt to access Nimblex if it doesn't exist yet.

>[!Note]
>If you need to create a user manually, contact [Nimblex Client support team](mailto:support@ebms.com.au).

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Nimblex.

![Assign the user role][200] 

**To assign Britta Simon to Nimblex, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

2. In the applications list, select **Nimblex**.

	![The Nimblex link in the Applications list](./media/nimblex-tutorial/tutorial_nimblex_app.png)  

3. In the menu on the left, click **Users and groups**.

	![The "Users and groups" link][202]

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![The Add Assignment pane][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.
	
### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Nimblex tile in the Access Panel, you should get automatically signed-on to your Nimblex application.
For more information about the Access Panel, see [Introduction to the Access Panel](../user-help/active-directory-saas-access-panel-introduction.md). 

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)



<!--Image references-->

[1]: ./media/nimblex-tutorial/tutorial_general_01.png
[2]: ./media/nimblex-tutorial/tutorial_general_02.png
[3]: ./media/nimblex-tutorial/tutorial_general_03.png
[4]: ./media/nimblex-tutorial/tutorial_general_04.png

[100]: ./media/nimblex-tutorial/tutorial_general_100.png

[200]: ./media/nimblex-tutorial/tutorial_general_200.png
[201]: ./media/nimblex-tutorial/tutorial_general_201.png
[202]: ./media/nimblex-tutorial/tutorial_general_202.png
[203]: ./media/nimblex-tutorial/tutorial_general_203.png


---
title: 'Tutorial: Azure Active Directory integration with LaunchDarkly | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and LaunchDarkly.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila
ms.reviewer: joflore

ms.assetid: 0e9cb37e-16bf-493b-bfc8-8d9840545a1e
ms.service: active-directory
ms.component: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/27/2018
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with LaunchDarkly

In this tutorial, you learn how to integrate LaunchDarkly with Azure Active Directory (Azure AD).

Integrating LaunchDarkly with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to LaunchDarkly.
- You can enable your users to automatically get signed-on to LaunchDarkly (Single Sign-On) with their Azure AD accounts.
- You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Azure AD integration with LaunchDarkly, you need the following items:

- An Azure AD subscription
- A LaunchDarkly single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding LaunchDarkly from the gallery
1. Configuring and testing Azure AD single sign-on

## Adding LaunchDarkly from the gallery
To configure the integration of LaunchDarkly into Azure AD, you need to add LaunchDarkly from the gallery to your list of managed SaaS apps.

**To add LaunchDarkly from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![The Azure Active Directory button][1]

1. Navigate to **Enterprise applications**. Then go to **All applications**.

	![The Enterprise applications blade][2]
	
1. To add new application, click **New application** button on the top of dialog.

	![The New application button][3]

1. In the search box, type **LaunchDarkly**, select **LaunchDarkly** from result panel then click **Add** button to add the application.

	![LaunchDarkly in the results list](./media/launchdarkly-tutorial/tutorial_launchdarkly_addfromgallery.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with LaunchDarkly based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in LaunchDarkly is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in LaunchDarkly needs to be established.

To configure and test Azure AD single sign-on with LaunchDarkly, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
1. **[Create a LaunchDarkly test user](#create-a-launchdarkly-test-user)** - to have a counterpart of Britta Simon in LaunchDarkly that is linked to the Azure AD representation of user.
1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
1. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your LaunchDarkly application.

**To configure Azure AD single sign-on with LaunchDarkly, perform the following steps:**

1. In the Azure portal, on the **LaunchDarkly** application integration page, click **Single sign-on**.

	![Configure single sign-on link][4]

1. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.

	![Single sign-on dialog box](./media/launchdarkly-tutorial/tutorial_launchdarkly_samlbase.png)

1. On the **LaunchDarkly Domain and URLs** section, perform the following steps if you wish to configure the application in **IDP** initiated mode:

	![LaunchDarkly Domain and URLs single sign-on information](./media/launchdarkly-tutorial/tutorial_launchdarkly_url.png)

    a. In the **Identifier (Entity ID)** textbox, type the URL: `app.launchdarkly.com`

	b. In the **Reply URL** textbox, type a URL using the following pattern: `https://app.launchdarkly.com/trust/saml2/acs/<customers-unique-id>`
	
	> [!NOTE]
	> The Reply URL value is not real. You will update the value with the actual Reply URL, which is explained later in the tutorial.

1. Check **Show advanced URL settings** and perform the following step if you wish to configure the application in **SP** initiated mode:

	![LaunchDarkly Domain and URLs single sign-on information](./media/launchdarkly-tutorial/tutorial_launchdarkly_url1.png)

    In the **Sign-on URL** textbox, type the URL: `https://app.launchdarkly.com`

1. On the **SAML Signing Certificate** section, click **Certificate (Base64)** and then save the certificate file on your computer.

	![The Certificate download link](./media/launchdarkly-tutorial/tutorial_launchdarkly_certificate.png) 

1. Click **Save** button.

	![Configure Single Sign-On Save button](./media/launchdarkly-tutorial/tutorial_general_400.png)
	
1. On the **LaunchDarkly Configuration** section, click **Configure LaunchDarkly** to open **Configure sign-on** window. Copy the **Single Sign-On Service URL** from the **Quick Reference section.**

	![LaunchDarkly Configuration](./media/launchdarkly-tutorial/tutorial_launchdarkly_configure.png)

1. In a different web browser window, log into your LaunchDarkly company site as an administrator.

1. Select **Account Settings** from the left navigation panel.

	![LaunchDarkly Configuration](./media/launchdarkly-tutorial/configure1.png)

1. Click **Security** tab.

	![LaunchDarkly Configuration](./media/launchdarkly-tutorial/configure2.png)

1. Click **ENABLE SSO** and then **EDIT SAML CONFIGURATION**.

	![LaunchDarkly Configuration](./media/launchdarkly-tutorial/configure3.png)

1. On the **Edit your SAML configuration** section, perform the following steps:

	![LaunchDarkly Configuration](./media/launchdarkly-tutorial/configure4.png)

	a. Copy the **SAML consumer service URL** for your instance and paste it in Reply URL textbox in **LaunchDarkly Domain and URLs** section on Azure portal.

	b. In the **Sign-on URL** textbox, paste the **Single Sign-On Service URL** value, which you have copied from the Azure portal.

	c. Open the downloaded certificate from the Azure portal into Notepad, copy the content and then paste it into the **X.509 certificate** box or you can directly upload the certificate by clicking the **upload one**.

	d. Click **Save**

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

   ![Create an Azure AD test user][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the Azure portal, in the left pane, click the **Azure Active Directory** button.

    ![The Azure Active Directory button](./media/launchdarkly-tutorial/create_aaduser_01.png)

1. To display the list of users, go to **Users and groups**, and then click **All users**.

    ![The "Users and groups" and "All users" links](./media/launchdarkly-tutorial/create_aaduser_02.png)

1. To open the **User** dialog box, click **Add** at the top of the **All Users** dialog box.

    ![The Add button](./media/launchdarkly-tutorial/create_aaduser_03.png)

1. In the **User** dialog box, perform the following steps:

    ![The User dialog box](./media/launchdarkly-tutorial/create_aaduser_04.png)

    a. In the **Name** box, type **BrittaSimon**.

    b. In the **User name** box, type the email address of user Britta Simon.

    c. Select the **Show Password** check box, and then write down the value that's displayed in the **Password** box.

    d. Click **Create**.

### Create a LaunchDarkly test user

The objective of this section is to create a user called Britta Simon in LaunchDarkly. LaunchDarkly supports just-in-time provisioning, which is by default enabled. There is no action item for you in this section. A new user is created during an attempt to access LaunchDarkly if it doesn't exist yet.
>[!Note]
>If you need to create a user manually, contact [LaunchDarkly Client support team](mailto:support@launchdarkly.com).

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to LaunchDarkly.

![Assign the user role][200] 

**To assign Britta Simon to LaunchDarkly, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

1. In the applications list, select **LaunchDarkly**.

	![The LaunchDarkly link in the Applications list](./media/launchdarkly-tutorial/tutorial_launchdarkly_app.png)  

1. In the menu on the left, click **Users and groups**.

	![The "Users and groups" link][202]

1. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![The Add Assignment pane][203]

1. On **Users and groups** dialog, select **Britta Simon** in the Users list.

1. Click **Select** button on **Users and groups** dialog.

1. Click **Assign** button on **Add Assignment** dialog.

### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the LaunchDarkly tile in the Access Panel, you should get automatically signed-on to your LaunchDarkly application.
For more information about the Access Panel, see [Introduction to the Access Panel](../user-help/active-directory-saas-access-panel-introduction.md). 

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)



<!--Image references-->

[1]: ./media/launchdarkly-tutorial/tutorial_general_01.png
[2]: ./media/launchdarkly-tutorial/tutorial_general_02.png
[3]: ./media/launchdarkly-tutorial/tutorial_general_03.png
[4]: ./media/launchdarkly-tutorial/tutorial_general_04.png

[100]: ./media/launchdarkly-tutorial/tutorial_general_100.png

[200]: ./media/launchdarkly-tutorial/tutorial_general_200.png
[201]: ./media/launchdarkly-tutorial/tutorial_general_201.png
[202]: ./media/launchdarkly-tutorial/tutorial_general_202.png
[203]: ./media/launchdarkly-tutorial/tutorial_general_203.png


---
title: 'Tutorial: Azure Active Directory integration with Salesforce | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Salesforce.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: joflore

ms.assetid: d2d7d420-dc91-41b8-a6b3-59579e043b35
ms.service: active-directory
ms.component: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/04/2018
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Salesforce

In this tutorial, you learn how to integrate Salesforce with Azure Active Directory (Azure AD).

Integrating Salesforce with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Salesforce.
- You can enable your users to automatically get signed-on to Salesforce (Single Sign-On) with their Azure AD accounts.
- You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Azure AD integration with Salesforce, you need the following items:

- An Azure AD subscription
- A Salesforce single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description

In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Salesforce from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding Salesforce from the gallery

To configure the integration of Salesforce into Azure AD, you need to add Salesforce from the gallery to your list of managed SaaS apps.

**To add Salesforce from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![The Enterprise applications blade][2]

3. To add new application, click **New application** button on the top of dialog.

	![The New application button][3]

4. In the search box, type **Salesforce**, select **Salesforce** from result panel then click **Add** button to add the application.

	![Salesforce in the results list](./media/salesforce-tutorial/tutorial_salesforce_addfromgallery.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Salesforce based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Salesforce is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Salesforce needs to be established.

In Salesforce, assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with Salesforce, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Create a Salesforce test user](#create-a-salesforce-test-user)** - to have a counterpart of Britta Simon in Salesforce that is linked to the Azure AD representation of user.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Salesforce application.

**To configure Azure AD single sign-on with Salesforce, perform the following steps:**

1. In the Azure portal, on the **Salesforce** application integration page, click **Single sign-on**.

	![Configure single sign-on link][4]

2. Click **Change Single sign-on mode** on top of the screen to select the **SAML** mode.

	![Configure single sign-on link](./media/salesforce-tutorial/tutorial_general_300.png)

3. On the **Select a Single sign-on method** dialog, Click **Select** for **SAML** mode to enable single sign-on.

    ![Configure single sign-on link](./media/salesforce-tutorial/tutorial_general_301.png)

4. On the **Set up Single Sign-On with SAML** page, click **Edit** button to open **Basic SAML Configuration** dialog.
   
    ![Configure single sign-on link](./media/salesforce-tutorial/tutorial_general_302.png)

5. On the **Basic SAML Configuration** section, perform the following steps:

    ![Salesforce Domain and URLs single sign-on information](./media/salesforce-tutorial/tutorial_salesforce_url.png)

    a. In the **Sign-on URL** textbox, type the value using the following pattern:

    Enterprise account: `https://<subdomain>.my.salesforce.com`

    Developer account: `https://<subdomain>-dev-ed.my.salesforce.com`

    b. In the **Identifier** textbox, type the value using the following pattern:

    Enterprise account: `https://<subdomain>.my.salesforce.com`

    Developer account: `https://<subdomain>-dev-ed.my.salesforce.com`

    > [!NOTE]
	> These values are not real. Update these values with the actual Sign-on URL and Identifier. Contact [Salesforce Client support team](https://help.salesforce.com/support) to get these values.

6. On the **SAML Signing Certificate** section, Click on **Download** to download **Federation Metadata XML** and then save the xml file on your computer.

	![The Certificate download link](./media/salesforce-tutorial/tutorial_salesforce_certificate.png) 

7. Open a new tab in your browser and log in to your Salesforce administrator account.

8. Click on the **Setup** under **settings icon** on the top right corner of the page.

	![Configure Single Sign-On](./media/salesforce-tutorial/configure1.png)

9. Scroll down to the **SETTINGS** in the navigation pane, click **Identity** to expand the related section. Then click **Single Sign-On Settings**.

    ![Configure Single Sign-On](./media/salesforce-tutorial/sf-admin-sso.png)

10. On the **Single Sign-On Settings** page, click the **Edit** button.

    ![Configure Single Sign-On](./media/salesforce-tutorial/sf-admin-sso-edit.png)

    > [!NOTE]
    > If you are unable to enable Single Sign-On settings for your Salesforce account, you may need to contact [Salesforce Client support team](https://help.salesforce.com/support).

11. Select **SAML Enabled**, and then click **Save**.

      ![Configure Single Sign-On](./media/salesforce-tutorial/sf-enable-saml.png)

12. To configure your SAML single sign-on settings, click **New from Metadata File**.

    ![Configure Single Sign-On](./media/salesforce-tutorial/sf-admin-sso-new.png)

13. Click **Choose File** to upload the metadata XML file which you have downloaded from the Azure portal and click **Create**.

    ![Configure Single Sign-On](./media/salesforce-tutorial/xmlchoose.png)

14. On the **SAML Single Sign-On Settings** page, fields populate automatically and click save.

    ![Configure Single Sign-On](./media/salesforce-tutorial/salesforcexml.png)

15. On the left navigation pane in Salesforce, click **Company Settings** to expand the related section, and then click **My Domain**.

    ![Configure Single Sign-On](./media/salesforce-tutorial/sf-my-domain.png)

16. Scroll down to the **Authentication Configuration** section, and click the **Edit** button.

    ![Configure Single Sign-On](./media/salesforce-tutorial/sf-edit-auth-config.png)

17. In the **Authentication Configuration** section, Check the **AzureSSO** as **Authentication Servie** of your SAML SSO configuration, and then click **Save**.

    ![Configure Single Sign-On](./media/salesforce-tutorial/sf-auth-config.png)

    > [!NOTE]
    > If more than one authentication service is selected, users are prompted to select which authentication service they like to sign in with while initiating single sign-on to your Salesforce environment. If you don’t want it to happen, then you should **leave all other authentication services unchecked**.

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

1. In the Azure portal, in the left pane, select **Azure Active Directory**, select **Users**, and then select **All users**.

	![Create Azure AD User][100]

2. Select **New user** at the top of the screen.

	![Creating an Azure AD test user](./media/salesforce-tutorial/create_aaduser_01.png) 

3. In the User properties, perform the following steps.

	![Creating an Azure AD test user](./media/salesforce-tutorial/create_aaduser_02.png)

	a. In the **Name** field enter **BrittaSimon**.
  
    b. In the **User name** field type **brittasimon@yourcompanydomain.extension**  
    For example, BrittaSimon@contoso.com

    c. Select **Properties**, select the **Show password** check box, and then write down the value that's displayed in the Password box.

    d. Select **Create**.

### Create a Salesforce test user

In this section, a user called Britta Simon is created in Salesforce. Salesforce supports just-in-time provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in Salesforce, a new one is created when you attempt to access Salesforce. Salesforce also supports automatic user provisioning, you can find more details [here](salesforce-provisioning-tutorial.md) on how to configure automatic user provisioning.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Salesforce.

![Assign the user role][200]

**To assign Britta Simon to Salesforce, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201]

2. In the applications list, select **Salesforce**.

	![The Salesforce link in the Applications list](./media/salesforce-tutorial/tutorial_salesforce_app.png)

3. In the menu on the left, click **Users and groups**.

	![The "Users and groups" link][202]

4. Click **Add user** button. Then select **Users and groups** on **Add Assignment** dialog.

	![The Add Assignment pane][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.

### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Salesforce tile in the Access Panel, you should get automatically signed-on to your Salesforce application.
For more information about the Access Panel, see [Introduction to the Access Panel](../user-help/active-directory-saas-access-panel-introduction.md).

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)
* [Configure User Provisioning](salesforce-provisioning-tutorial.md)

<!--Image references-->

[1]: ./media/salesforce-tutorial/tutorial_general_01.png
[2]: ./media/salesforce-tutorial/tutorial_general_02.png
[3]: ./media/salesforce-tutorial/tutorial_general_03.png
[4]: ./media/salesforce-tutorial/tutorial_general_04.png

[100]: ./media/salesforce-tutorial/tutorial_general_100.png

[200]: ./media/salesforce-tutorial/tutorial_general_200.png
[201]: ./media/salesforce-tutorial/tutorial_general_201.png
[202]: ./media/salesforce-tutorial/tutorial_general_202.png
[203]: ./media/salesforce-tutorial/tutorial_general_203.png
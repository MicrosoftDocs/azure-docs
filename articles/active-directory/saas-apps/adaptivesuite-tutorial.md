---
title: 'Tutorial: Azure Active Directory integration with Adaptive Insights | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Adaptive Insights.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila
ms.reviewer: joflore

ms.assetid: 13af9d00-116a-41b8-8ca0-4870b31e224c
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/16/2018
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Adaptive Insights

In this tutorial, you learn how to integrate Adaptive Insights with Azure Active Directory (Azure AD).

Integrating Adaptive Insights with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Adaptive Insights.
- You can enable your users to automatically get signed-on to Adaptive Insights (Single Sign-On) with their Azure AD accounts.
- You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Azure AD integration with Adaptive Insights, you need the following items:

- An Azure AD subscription
- An Adaptive Insights single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Adaptive Insights from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding Adaptive Insights from the gallery
To configure the integration of Adaptive Insights into Azure AD, you need to add Adaptive Insights from the gallery to your list of managed SaaS apps.

**To add Adaptive Insights from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![image](./media/adaptivesuite-tutorial/selectazuread.png)

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![image](./media/adaptivesuite-tutorial/a_select_app.png)
	
3. To add new application, click **New application** button on the top of dialog.

	![image](./media/adaptivesuite-tutorial/a_new_app.png)

4. In the search box, type **Adaptive Insights**, select **Adaptive Insights** from result panel then click **Add** button to add the application.

	 ![image](./media/adaptivesuite-tutorial/tutorial_adaptivesuite_addfromgallery.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Adaptive Insights based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Adaptive Insights is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Adaptive Insights needs to be established.

To configure and test Azure AD single sign-on with Adaptive Insights, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Create an Adaptive Insights test user](#create-an-adaptive-insights-test-user)** - to have a counterpart of Britta Simon in Adaptive Insights that is linked to the Azure AD representation of user.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Adaptive Insights application.

**To configure Azure AD single sign-on with Adaptive Insights, perform the following steps:**

1. In the [Azure portal](https://portal.azure.com/), on the **Adaptive Insights** application integration page, select **Single sign-on**.

    ![image](./media/adaptivesuite-tutorial/B1_B2_Select_SSO.png)

2. On the **Select a Single sign-on method** dialog, select **SAML** mode to enable single sign-on.

    ![image](./media/adaptivesuite-tutorial/b1_b2_saml_sso.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** button to open **Basic SAML Configuration** dialog.

	![image](./media/adaptivesuite-tutorial/b1-domains_and_urlsedit.png)

4. On the **Basic SAML Configuration** section, perform the following steps if you wish to configure the application in **IDP** intiated mode:

    ![image](./media/adaptivesuite-tutorial/tutorial_adaptivesuite_url.png)

    a. In the **Identifier(Entity ID)** textbox, type a URL using the following pattern: `https://login.adaptiveinsights.com:443/samlsso/<unique-id>`

	b. In the **Reply URL** textbox, type a URL using the following pattern: `https://login.adaptiveinsights.com:443/samlsso/<unique-id>`

	>[!NOTE]
	> You can get Identifier(Entity ID) and Reply URL values from the Adaptive Insights’s **SAML SSO Settings** page.
 
5. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Base64)** and save it on your computer.

	![image](./media/adaptivesuite-tutorial/tutorial_adaptivesuite_certficate.png) 

6. On the **Set up Adaptive Insights** section, copy the appropriate URL as per your requirement.

	Note that the URL may say the following:

	a. Login URL

	b. Azure Ad Identifier

	c. Logout URL

	![image](./media/adaptivesuite-tutorial/d1_samlsonfigure.png) 

7. In a different web browser window, log in to your Adaptive Insights company site as an administrator.

8. Go to **Admin**.

	![Admin](./media/adaptivesuite-tutorial/IC805644.png "Admin")

9. In the **Users and Roles** section, click **Manage SAML SSO Settings**.

	![Manage SAML SSO Settings](./media/adaptivesuite-tutorial/IC805645.png "Manage SAML SSO Settings")

10. On the **SAML SSO Settings** page, perform the following steps:

	![SAML SSO Settings](./media/adaptivesuite-tutorial/IC805646.png "SAML SSO Settings")

	a. In the **Identity provider name** textbox, type a name for your configuration.

	b. Paste the **Azure Ad Identifier** value copied from Azure portal into the **Identity provider Entity ID** textbox.

	c. Paste the **Login URL** value copied from Azure portal into the **Identity provider SSO URL** textbox.

	d. Paste the **Logout URL** value copied from Azure portal into the **Custom logout URL** textbox.

	e. To upload your downloaded certificate, click **Choose file**.

	f. Select the following, for:

    * **SAML user id**, select **User’s Adaptive Insights user name**.

    * **SAML user id location**, select **User id in NameID of Subject**.

    * **SAML NameID format**, select **Email address**.

    * **Enable SAML**, select **Allow SAML SSO and direct Adaptive Insights login**.

	g. Copy **Adaptive Insights SSO URL** and paste into the **Identifier(Entity ID)** and **Reply URL** textboxes in the **Adaptive Insights Domain and URLs** section in the Azure portal.

	h. Click **Save**.

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

1. In the Azure portal, in the left pane, select **Azure Active Directory**, select **Users**, and then select **All users**.

    ![image](./media/adaptivesuite-tutorial/d_users_and_groups.png)

2. Select **New user** at the top of the screen.

    ![image](./media/adaptivesuite-tutorial/d_adduser.png)

3. In the User properties, perform the following steps.

    ![image](./media/adaptivesuite-tutorial/d_userproperties.png)

    a. In the **Name** field enter **BrittaSimon**.
  
    b. In the **User name** field type **brittasimon@yourcompanydomain.extension**  
    For example, BrittaSimon@contoso.com

    c. Select **Properties**, select the **Show password** check box, and then write down the value that's displayed in the Password box.

    d. Select **Create**.
 
### Create an Adaptive Insights test user

To enable Azure AD users to log in to Adaptive Insights, they must be provisioned into Adaptive Insights. In the case of Adaptive Insights, provisioning is a manual task.

**To configure user provisioning, perform the following steps:** 

1. Log in to your **Adaptive Insights** company site as an administrator.
2. Go to **Admin**.

   ![Admin](./media/adaptivesuite-tutorial/IC805644.png "Admin")

3. In the **Users and Roles** section, click **Add User**.

   ![Add User](./media/adaptivesuite-tutorial/IC805648.png "Add User")
   
4. In the **New User** section, perform the following steps:

   ![Submit](./media/adaptivesuite-tutorial/IC805649.png "Submit")

   a. Type the **Name**, **Login**, **Email**, **Password** of a valid Azure Active Directory user you want to provision into the related textboxes.

   b. Select a **Role**.

   c. Click **Submit**.

>[!NOTE]
>You can use any other Adaptive Insights user account creation tools or APIs provided by Adaptive Insights to provision AAD user accounts.
>

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Adaptive Insights.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**.

	![image](./media/adaptivesuite-tutorial/d_all_applications.png)

2. In the applications list, select **Adaptive Insights**.

	![image](./media/adaptivesuite-tutorial/tutorial_adaptivesuite_app.png)

3. In the menu on the left, select **Users and groups**.

    ![image](./media/adaptivesuite-tutorial/d_leftpaneusers.png)

4. Select the **Add** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![image](./media/adaptivesuite-tutorial/d_assign_user.png)

4. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

5. In the **Add Assignment** dialog select the **Assign** button.
	
### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Adaptive Insights tile in the Access Panel, you should get automatically signed-on to your Adaptive Insights application.
For more information about the Access Panel, see [Introduction to the Access Panel](../active-directory-saas-access-panel-introduction.md). 

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

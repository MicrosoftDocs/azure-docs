---
title: 'Tutorial: Azure Active Directory integration with Snowflake | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Snowflake.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila
ms.reviewer: joflore

ms.assetid: 3488ac27-0417-4ad9-b9a3-08325fe8ea0d
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/25/2018
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Snowflake

In this tutorial, you learn how to integrate Snowflake with Azure Active Directory (Azure AD).

Integrating Snowflake with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Snowflake.
- You can enable your users to automatically get signed-on to Snowflake (Single Sign-On) with their Azure AD accounts.
- You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md)

## Prerequisites

To configure Azure AD integration with Snowflake, you need the following items:

- An Azure AD subscription
- A Snowflake single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description

In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Snowflake from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding Snowflake from the gallery

To configure the integration of Snowflake into Azure AD, you need to add Snowflake from the gallery to your list of managed SaaS apps.

**To add Snowflake from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![The Azure Active Directory button][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![The Enterprise applications blade][2]

3. To add new application, click **New application** button on the top of dialog.

	![The New application button][3]

4. In the search box, type **Snowflake**, select **Snowflake** from result panel then click **Add** button to add the application.

	![Snowflake in the results list](./media/snowflake-tutorial/tutorial_snowflake_addfromgallery.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Snowflake based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Snowflake is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Snowflake needs to be established.

To configure and test Azure AD single sign-on with Snowflake, you need to complete the following building blocks:

1. **[Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Creating an Azure AD test user](#creating-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Creating Snowflake test user](#creating-snowflake-test-user)** - to have a counterpart of Britta Simon in Snowflake that is linked to the Azure AD representation of user.
4. **[Assigning the Azure AD test user](#assigning-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Testing single sign-on](#testing-single-sign-on)** - to verify whether the configuration works.

### Configuring Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Snowflake application.

**To configure Azure AD single sign-on with Snowflake, perform the following steps:**

1. In the Azure portal, on the **Snowflake** application integration page, click **Single sign-on**.

	![Configure single sign-on link][4]

2. On the **Select a Single sign-on method** dialog, Click **Select** for **SAML** mode to enable single sign-on.

    ![Configure Single Sign-On](common/tutorial_general_301.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Configure Single Sign-On](common/editconfigure.png)

4. On the **Basic SAML Configuration** section, perform the following steps, if you wish to configure the application in **IDP** initiated mode:

	![Snowflake Domain and URLs single sign-on information](./media/snowflake-tutorial/tutorial_snowflake_url1.png)

    a. In the **Identifier** textbox, type a URL using the following pattern: `https://<SNOWFLAKE-URL>.snowflakecomputing.com`

	b. In the **Reply URL** textbox, type a URL using the following pattern: `https://<SNOWFLAKE-URL>.snowflakecomputing.com/fed/login`

5. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

	![Snowflake Domain and URLs single sign-on information](./media/snowflake-tutorial/tutorial_snowflake_url2.png)

    In the **Sign-on URL** textbox, type a URL using the following pattern: `https://<SNOWFLAKE-URL>.snowflakecomputing.com`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier, Reply URL, and Sign-On URL.

6. On the **SAML Signing Certificate** page, in the **SAML Signing Certificate** section, click **Download** to download **Certificate (Base64)** and then save certificate file on your computer.

	![The Certificate download link](./media/snowflake-tutorial/tutorial_snowflake_certificate.png) 

7. On the **Set up Snowflake** section, copy the appropriate URL as per your requirement.

	a. Login URL

	b. Azure AD Identifier

	c. Logout URL

	![Snowflake Configuration](common/configuresection.png)

8. In a different web browser window, login to Snowflake as a Security Administrator.

9. **Switch Role** to **ACCOUNTADMIN**, by clicking on **profile** on the top right side of page.

	> [!NOTE]
	> This is separate from the context you have selected in the top-right corner under your User Name
    
	![The Snowflake admin ](./media/snowflake-tutorial/tutorial_snowflake_accountadmin.png)

10. Open the **downloaded Base 64 certificate** in notepad. Copy the value between “-----BEGIN CERTIFICATE-----” and “-----END CERTIFICATE-----" and paste this into the quotation marks next to **certificate** below. In the **ssoUrl**, paste **Login URL** value which you have copied from the Azure portal. Select the **All Queries** and click **Run**.

	![Snowflake sql](./media/snowflake-tutorial/tutorial_snowflake_sql.png)

	```
	use role accountadmin;
	alter account set saml_identity_provider = '{
	"certificate": "<Paste the content of downloaded certificate from Azure portal>",
	"ssoUrl":"<Login URL value which you have copied from the Azure portal>",
	"type":"custom",
	"label":"AzureAD"
	}';
	alter account set sso_login_page = TRUE;
	```

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

### Creating Snowflake test user

To enable Azure AD users to log in to Snowflake, they must be provisioned into Snowflake. In Snowflake, provisioning is a manual task.

**To provision a user account, perform the following steps:**

1. Log in to Snowflake as a Security Administrator.

2. **Switch Role** to **ACCOUNTADMIN**, by clicking on **profile** on the top right side of page.  

	![The Snowflake admin ](./media/snowflake-tutorial/tutorial_snowflake_accountadmin.png)

3. Create the user by running the below SQL query, ensuring "Login name" is set to the Azure AD username on the worksheet as shown below.

	![The Snowflake adminsql ](./media/snowflake-tutorial/tutorial_snowflake_usersql.png)

	```
	use role accountadmin;
	CREATE USER britta_simon PASSWORD = '' LOGIN_NAME = 'BrittaSimon@contoso.com' DISPLAY_NAME = 'Britta Simon';
	```

### Assigning the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Snowflake.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**.

	![Assign User][201]

2. In the applications list, select **Snowflake**.

	![Configure Single Sign-On](./media/snowflake-tutorial/tutorial_snowflake_app.png) 

3. In the menu on the left, click **Users and groups**.

	![Assign User][202]

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![Assign User][203]

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. In the **Add Assignment** dialog select the **Assign** button.

### Testing single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Snowflake tile in the Access Panel, you should get automatically signed-on to your Snowflake application.
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

[201]: common/tutorial_general_201.png
[202]: common/tutorial_general_202.png
[203]: common/tutorial_general_203.png

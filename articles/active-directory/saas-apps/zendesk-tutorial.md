---
title: 'Tutorial: Azure Active Directory integration with Zendesk | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Zendesk.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: joflore

ms.assetid: 9d7c91e5-78f5-4016-862f-0f3242b00680
ms.service: active-directory
ms.component: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/21/2018
ms.author: jeedes

---
# SSO Tutorial: Azure Active Directory integration with Zendesk

In this tutorial, you learn how to integrate Zendesk with Azure Active Directory (Azure AD).
Integrating Zendesk with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to Zendesk.
* You can enable your users to be automatically signed-in to Zendesk (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with Zendesk, you need the following items:

* Azure AD subscription
* Zendesk single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment. The scenario outlined in this tutorial consists of two main building blocks:
Adding Zendesk from the gallery, and Configuring and testing Azure AD single sign-on.

## Adding Zendesk from the gallery

To configure the integration of Zendesk into Azure AD, you need to add Zendesk from the gallery to your list of managed SaaS apps.

**To add Zendesk from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![image](./media/zendesk-tutorial/selectazuread.png)

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![image](./media/zendesk-tutorial/a_select_app.png)
	
3. To add new application, click **New application** button on the top of dialog.

	![image](./media/zendesk-tutorial/a_new_app.png)

4. In the search box, type **Zendesk**, select **Zendesk** from result panel then click **Add** button to add the application.

	 ![image](./media/zendesk-tutorial/a_add_app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Zendesk based on a test user called "Britta Simon."
For single sign-on to work, a link relationship between an Azure AD user and the related user in Zendesk needs to be established.
In Zendesk, assign the value of the user name in Azure AD as the value of the Username to establish the link relationship.

To configure and test Azure AD single sign-on with Zendesk, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Create a Zendesk test user](#create-a-zendesk-test-user)** - to have a counterpart of Britta Simon in Zendesk that is linked to the Azure AD representation of user.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with Zendesk, perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **Zendesk** application integration page, select **Single sign-on**.

    ![image](./media/zendesk-tutorial/b1_b2_select_sso.png)

2. Click **Change Single sign-on mode** on top of the screen to select the **SAML** mode.

	  ![image](./media/zendesk-tutorial/b1_b2_saml_ssso.png)

3. On the **Select a Single sign-on method** dialog, Click **Select** for **SAML** mode to enable single sign-on.

    ![image](./media/zendesk-tutorial/b1_b2_saml_sso.png)

4. On the **Set up Single Sign-On with SAML** page, click **Edit** button to open **Basic SAML Configuration** dialog.

	![image](./media/zendesk-tutorial/b1-domains_and_urlsedit.png)

5. On the **Basic SAML Configuration** section, perform the following steps:

	a. In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://<subdomain>.zendesk.com`.

    b. In the **Identifier** text box, type a URL using the following pattern:
    `<subdomain>.zendesk.com`.

    ![image](./media/zendesk-tutorial/b1-domains_and_urls.png)

	> [!NOTE]
	> These values are not real. Update these values with the actual Sign-On URL and Identifier. Contact [Zendesk Client support team]([support]) to get these values.

6. Zendesk application expects the SAML assertions in a specific format. Configure the following claims for this application. You can manage the values of these attributes from the **User Attributes** section on application integration page. On the **Set up Single Sign-On with SAML** page, click **Edit** button to open **User Attributes** dialog.

	![image](./media/zendesk-tutorial/i4-attribute.png)

7. In the **User Claims** section on the **User Attributes** dialog, configure SAML token attribute as shown in the image above and perform the following steps:

	a. Click **Add new claim** to open the **Manage user claims** dialog.

	![image](./media/zendesk-tutorial/i2-attribute.png)

	![image](./media/zendesk-tutorial/i3-attribute.png)
	
	b. In the **Name** textbox, type the attribute name shown for that row.

	c. Leave the **Namespace** blank.

	d. Select Source as **Attribute**.
	
	c. From the **Source attribute** list, type the attribute value shown for that row.
	
	d. Click **Ok**

	f. Click **Save**.

8. In the SAML Signing Certificate section, in the **SAML Signing Certificate** section, copy the **Thumbprint**, and save it on your computer.

    ![image](./media/zendesk-tutorial/C3_certificate.png)

	a. Select the appropriate option for **Signing Option** if needed.

	b. Select the appropriate option for **Signing Algorithm** if needed.

	c. Click **Save**

9. On the **Set up Zendesk** section, click **View step-by-step instructions** to open **Configure sign-on** window. Copy the below URLs, from the **Quick Reference section.**

	Note that the url may say the following:

	a. SAML Single Sign-On Service URL

	b. Entity ID

	c. Sign-Out URL

	![image](./media/zendesk-tutorial/d1_saml.png) 

10. There are two ways in which Zendesk can be configured - Automatic and Manual.
  
11. For configuring Zendesk automatically through Azure AD, follow the below step:

    ![image](./media/zendesk-tutorial/d2_saml.png) 
  
    * Using the My Apps Browser extension, you can automate the configuration within Zendesk. Clicking on setup Zendesk will direct you to the Zendesk application. From there, provide the admin credentials to sign into Zendesk. The browser extension will automatically configure the application for you and automate step 10.

12. For configuring Zendesk manually, follow the below steps:

    * In a different web browser window, log into your Zendesk company site as an administrator.

    * Click **Admin**.

    * In the left navigation pane, click **Settings**, and then click **Security**.

    * On the **Security** page, perform the following steps:

      ![Security](././media/zendesk-tutorial/ic773089.png "Security")

      ![Single sign-on](././media/zendesk-tutorial/ic773090.png "Single sign-on")

      a. Click the **Admin & Agents** tab.

      b. Select **Single sign-on (SSO) and SAML**, and then select **SAML**.

      c. In **SAML SSO URL** textbox, paste the value of **SAML Single Sign-On Service URL** which you have copied from Azure portal.

      d. In **Remote Logout URL** textbox, paste the value of **Sign-Out URL** which you have copied from Azure portal.

      e. In **Certificate Fingerprint** textbox, paste the **Thumbprint** value of certificate which you have copied from Azure portal.

      f. Click **Save**.

### Create an Azure AD test user 

The objective of this section is to create a test user in the Azure portal called Britta Simon.

1. In the Azure portal, in the left pane, select **Azure Active Directory**, select **Users**, and then select **All users**.

    ![image](./media/zendesk-tutorial/d_users_and_groups.png)

2. Select **New user** at the top of the screen.

    ![image](./media/zendesk-tutorial/d_adduser.png)

3. In the User properties, perform the following steps.

    ![image](./media/zendesk-tutorial/d_userproperties.png)

    a. In the **Name** field enter **BrittaSimon**.
  
    b. In the **User name** field type **brittasimon@yourcompanydomain.extension**  
    For example, BrittaSimon@contoso.com

    c. Select **Properties**, select the **Show password** check box, and then write down the value that's displayed in the Password box.

    d. Select **Create**.

### Create a Zendesk test user

The objective of this section is to create a user called Britta Simon in Zendesk. Zendesk supports automatic user provisioning, which is by default enabled. You can find more details [here](Zendesk-provisioning-tutorial.md) on how to configure automatic user provisioning.

**If you need to create user manually, please perform following steps:**

> [!NOTE]
> **End-user** accounts are automatically provisioned when signing in. **Agent** and **Admin** accounts need to be manually provisioned in **Zendesk** before signing in.

1. Log in to your **Zendesk** tenant.

2. Select the **Customer List** tab.

3. Select the **User** tab, and click **Add**.

    ![Add user](././media/zendesk-tutorial/ic773632.png "Add user")
4. Type the **Name** and **Email** of an existing Azure AD account you want to provision, and then click **Save**.

    ![New user](././media/zendesk-tutorial/ic773633.png "New user")

> [!NOTE]
> You can use any other Zendesk user account creation tools or APIs provided by Zendesk to provision AAD user accounts.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Zendesk.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **Zendesk**.

	![image](./media/zendesk-tutorial/d_all_applications.png)

2. In the menu on the left, select **Users and groups**.

    ![image](./media/zendesk-tutorial/d_leftpaneusers.png)

3. Select the **Add** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![image](./media/zendesk-tutorial/d_assign_user.png)

4. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

5. In the **Add Assignment** dialog select the **Assign** button.

### Test single sign-on 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Zendesk tile in the Access Panel, you should be automatically signed in to the Zendesk for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources
- [ List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory ](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory? ](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)
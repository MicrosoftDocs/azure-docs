---
title: 'Tutorial: Azure Active Directory integration with Box | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Box.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila 
ms.reviewer: joflore

ms.assetid: 3b565c8d-35e2-482a-b2f4-bf8fd7d8731f
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/09/2018
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Box

In this tutorial, you learn how to integrate Box with Azure Active Directory (Azure AD).

Integrating Box with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Box.
- You can enable your users to automatically get signed-on to Box (Single Sign-On) with their Azure AD accounts.
- You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Azure AD integration with Box, you need the following items:

- An Azure AD subscription
- A Box single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Box from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding Box from the gallery
To configure the integration of Box into Azure AD, you need to add Box from the gallery to your list of managed SaaS apps.

**To add Box from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![image](./media/box-tutorial/selectazuread.png)

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![image](./media/box-tutorial/a_select_app.png)
	
3. To add new application, click **New application** button on the top of dialog.

	![image](./media/box-tutorial/a_new_app.png)

4. In the search box, type **Box**, select **Box** from result panel then click **Add** button to add the application.

	 ![image](./media/box-tutorial/tutorial_Box_addfromgallery.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Box based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Box is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Box needs to be established.

To configure and test Azure AD single sign-on with Box, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Create a Box test user](#create-a-box-test-user)** - to have a counterpart of Britta Simon in Box that is linked to the Azure AD representation of user.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Box application.

**To configure Azure AD single sign-on with Box, perform the following steps:**

1. In the [Azure portal](https://portal.azure.com/), on the **Box** application integration page, select **Single sign-on**.

    ![image](./media/box-tutorial/b1_b2_select_sso.png)

2. On the **Select a Single sign-on method** dialog, Click **Select** for **SAML** mode to enable single sign-on.

    ![image](./media/box-tutorial/b1_b2_saml_sso.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** button to open **Basic SAML Configuration** dialog.

	![image](./media/box-tutorial/b1-domains_and_urlsedit.png)

4. On the **Basic SAML Configuration** section, perform the following steps:

	a. In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://<SUBDOMAIN>.account.box.com`

	b. In the **Identifier** textbox, type a URL:`box.net`

    ![image](./media/box-tutorial/tutorial_box_url.png)

    > [!NOTE] 
	> The Sign-on URL value is not real. Update the value with the actual Sign-On URL. Contact [Box support team](https://community.box.com/t5/custom/page/page-id/submit_sso_questionaire) to get the value.
 
5. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Federation Metadata XML** and save it on your computer.

	![image](./media/box-tutorial/tutorial_Box_certificate.png)

6. To configure SSO for your application, follow the procedure in [Set up SSO on your own](https://community.box.com/t5/How-to-Guides-for-Admins/Setting-Up-Single-Sign-On-SSO-for-your-Enterprise/ta-p/1263#ssoonyourown). 

>[!NOTE]
>If you are unable to configure the SSO settings for your Box account, you need to send the downloaded **Federation Metadata XML** to [Box support team](https://community.box.com/t5/custom/page/page-id/submit_sso_questionaire). They set this setting to have the SAML SSO connection set properly on both sides.

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

1. In the Azure portal, in the left pane, select **Azure Active Directory**, select **Users**, and then select **All users**.

    ![image](./media/box-tutorial/d_users_and_groups.png)

2. Select **New user** at the top of the screen.

    ![image](./media/box-tutorial/d_adduser.png)

3. In the User properties, perform the following steps.

    ![image](./media/box-tutorial/d_userproperties.png)

    a. In the **Name** field enter **BrittaSimon**.
  
    b. In the **User name** field type **brittasimon@yourcompanydomain.extension**  
    For example, BrittaSimon@contoso.com

    c. Select **Properties**, select the **Show password** check box, and then write down the value that's displayed in the Password box.

    d. Select **Create**.
 
### Create a Box test user

The objective of this section is to create a user called Britta Simon in Box. Box supports just-in-time provisioning, which is by default enabled. There is no action item for you in this section. A new user is created during an attempt to access Box if it doesn't exist yet.
>[!Note]
>If you need to create a user manually, contact [Box support team](https://community.box.com/t5/custom/page/page-id/submit_sso_questionaire).

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Box.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**.

	![image](./media/box-tutorial/d_all_applications.png)

2. In the applications list, select **Box**.

	![image](./media/box-tutorial/tutorial_Box_app.png)

3. In the menu on the left, select **Users and groups**.

    ![image](./media/box-tutorial/d_leftpaneusers.png)

4. Select the **Add** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![image](./media/box-tutorial/d_assign_user.png)

4. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

5. In the **Add Assignment** dialog select the **Assign** button.
	
### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you select the **Box** tile in the Access Panel, you get the sign-in page for signing in to your Box application.

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)
* [Configure user provisioning](box-userprovisioning-tutorial.md)



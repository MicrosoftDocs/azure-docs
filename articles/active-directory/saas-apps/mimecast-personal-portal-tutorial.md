---
title: 'Tutorial: Azure Active Directory integration with Mimecast Personal Portal | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Mimecast Personal Portal.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: joflore

ms.assetid: 345b22be-d87e-45a4-b4c0-70a67eaf9bfd
ms.service: active-directory
ms.component: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/24/2018
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Mimecast Personal Portal

In this tutorial, you learn how to integrate Mimecast Personal Portal with Azure Active Directory (Azure AD).

Integrating Mimecast Personal Portal with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Mimecast Personal Portal.
- You can enable your users to automatically get signed-on to Mimecast Personal Portal (Single Sign-On) with their Azure AD accounts.
- You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Azure AD integration with Mimecast Personal Portal, you need the following items:

- An Azure AD subscription
- A Mimecast Personal Portal single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Mimecast Personal Portal from the gallery
1. Configuring and testing Azure AD single sign-on

## Adding Mimecast Personal Portal from the gallery
To configure the integration of Mimecast Personal Portal into Azure AD, you need to add Mimecast Personal Portal from the gallery to your list of managed SaaS apps.

**To add Mimecast Personal Portal from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![The Azure Active Directory button][1]

1. Navigate to **Enterprise applications**. Then go to **All applications**.

	![The Enterprise applications blade][2]
	
1. To add new application, click **New application** button on the top of dialog.

	![The New application button][3]

1. In the search box, type **Mimecast Personal Portal**, select **Mimecast Personal Portal** from result panel then click **Add** button to add the application.

	![Mimecast Personal Portal in the results list](./media/mimecast-personal-portal-tutorial/tutorial_mimecastpersonalportal_addfromgallery.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Mimecast Personal Portal based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Mimecast Personal Portal is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Mimecast Personal Portal needs to be established.

To configure and test Azure AD single sign-on with Mimecast Personal Portal, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
1. **[Create a Mimecast Personal Portal test user](#create-a-mimecast-personal-portal-test-user)** - to have a counterpart of Britta Simon in Mimecast Personal Portal that is linked to the Azure AD representation of user.
1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
1. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Mimecast Personal Portal application.

**To configure Azure AD single sign-on with Mimecast Personal Portal, perform the following steps:**

1. In the Azure portal, on the **Mimecast Personal Portal** application integration page, click **Single sign-on**.

	![Configure single sign-on link][4]

1. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Single sign-on dialog box](./media/mimecast-personal-portal-tutorial/tutorial_mimecastpersonalportal_samlbase.png)

1. On the **Mimecast Personal Portal Domain and URLs** section, perform the following steps:

	![Mimecast Personal Portal Domain and URLs single sign-on information](./media/mimecast-personal-portal-tutorial/tutorial_mimecastpersonalportal_url.png)

    a. In the **Sign-on URL** textbox, type a URL: 

	| Region  |  Value | 
	| --------------- | --------------- | 
	| Europe          | `https://eu-api.mimecast.com/login/saml`|
	| United States   | `https://us-api.mimecast.com/login/saml`|
	| South Africa    | `https://za-api.mimecast.com/login/saml`|
	| Australia       | `https://au-api.mimecast.com/login/saml`|
	| Offshore        | `https://jer-api.mimecast.com/login/saml`|

	b. In the **Identifier** textbox, type a URL using the following pattern:

    | Region  |  Value | 
	| --------------- | --------------- |
	| Europe          | `https://eu-api.mimecast.com/sso/<accountcode>`|
	| United States   | `https://us-api.mimecast.com/sso/<accountcode>`|    
	| South Africa    | `https://za-api.mimecast.com/sso/<accountcode>`|
	| Australia       | `https://au-api.mimecast.com/sso/<accountcode>`|
	| Offshore        | `https://jer-api.mimecast.com/sso/<accountcode>`|

	c. In the **Reply URL** textbox, type a URL: 

	| Region  |  Value | 
	| --------------- | --------------- | 
	| Europe          | `https://eu-api.mimecast.com/login/saml`|
	| United States   | `https://us-api.mimecast.com/login/saml`|
	| South Africa    | `https://za-api.mimecast.com/login/saml`|
	| Australia       | `https://au-api.mimecast.com/login/saml`|
	| Offshore        | `https://jer-api.mimecast.com/login/saml`|
    
	> [!NOTE] 
	> The Identifier value is not real. Update the value with the actual Identifier. Contact [Mimecast Personal Portal Client support team](http://www.mimecast.com/customer-success/technical-support/) to get the value. 

1. On the **SAML Signing Certificate** section, click **Certificate(Base64)** and then save the certificate file on your computer.

	![The Certificate download link](./media/mimecast-personal-portal-tutorial/tutorial_mimecastpersonalportal_certificate.png) 

1. Click **Save** button.

	![Configure Single Sign-On Save button](./media/mimecast-personal-portal-tutorial/tutorial_general_400.png)

1. On the **Mimecast Personal Portal Configuration** section, click **Configure Mimecast Personal Portal** to open **Configure sign-on** window. Copy the **Sign-Out URL, SAML Entity ID, and SAML Single Sign-On Service URL** from the **Quick Reference section.**

	![Mimecast Personal Portal Configuration](./media/mimecast-personal-portal-tutorial/tutorial_mimecastpersonalportal_configure.png) 

1. In a different web browser window, log into your Mimecast Personal Portal as an administrator.

1. Go to **Services \> Applications**.
   
    ![Applications](./media/mimecast-personal-portal-tutorial/ic794998.png "Applications")

1. Click **Authentication Profiles**.
   
    ![Authentication Profiles](./media/mimecast-personal-portal-tutorial/ic794999.png "Authentication Profiles")

1. Click **New Authentication Profile**.
   
    ![New Authentication Profile](./media/mimecast-personal-portal-tutorial/ic795000.png "New Authentication Profile")

1. In the **Authentication Profile** section, perform the following steps:
   
    ![Authentication Profile](./media/mimecast-personal-portal-tutorial/ic795001.png "Authentication Profile")
   
    a. In the **Description** textbox, type a name for your configuration.
   
    b. Select **Enforce SAML Authentication for Mimecast Personal Portal**.
   
    c. As **Provider**, select **Azure Active Directory**.
   
    d. In **Issuer URL** textbox, paste the value of **SAML Entity ID**, which you have copied from Azure portal.
   
    e. In **Login URL** textbox, paste the value of **SAML Single Sign-On Service URL**, which you have copied from Azure portal.
   
    f. In **Logout URL** textbox, paste the value of **Sign-Out URL**, which you have copied from Azure portal.

	g. Open your **base-64** encoded certificate in notepad downloaded from Azure portal, copy the content of it into your clipboard, and then paste it to the **Identity Provider Certificate (Metadata)** textbox.

    h. Select **Allow Single Sign On**.
   
    i. Click **Save**.

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

   ![Create an Azure AD test user][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the Azure portal, in the left pane, click the **Azure Active Directory** button.

    ![The Azure Active Directory button](./media/mimecast-personal-portal-tutorial/create_aaduser_01.png)

1. To display the list of users, go to **Users and groups**, and then click **All users**.

    ![The "Users and groups" and "All users" links](./media/mimecast-personal-portal-tutorial/create_aaduser_02.png)

1. To open the **User** dialog box, click **Add** at the top of the **All Users** dialog box.

    ![The Add button](./media/mimecast-personal-portal-tutorial/create_aaduser_03.png)

1. In the **User** dialog box, perform the following steps:

    ![The User dialog box](./media/mimecast-personal-portal-tutorial/create_aaduser_04.png)

    a. In the **Name** box, type **BrittaSimon**.

    b. In the **User name** box, type the email address of user Britta Simon.

    c. Select the **Show Password** check box, and then write down the value that's displayed in the **Password** box.

    d. Click **Create**.
 
### Create a Mimecast Personal Portal test user

In order to enable Azure AD users to log into Mimecast Personal Portal, they must be provisioned into Mimecast Personal Portal. In the case of Mimecast Personal Portal, provisioning is a manual task.

You need to register a domain before you can create users.

**To configure user provisioning, perform the following steps:**

1. Sign on to your **Mimecast Personal Portal** as administrator.

1. Go to **Directories \> Internal**.
   
    ![Directories](./media/mimecast-personal-portal-tutorial/ic795003.png "Directories")

1. Click **Register New Domain**.
   
    ![Register New Domain](./media/mimecast-personal-portal-tutorial/ic795004.png "Register New Domain")

1. After your new domain has been created, click **New Address**.
   
    ![New Address](./media/mimecast-personal-portal-tutorial/ic795005.png "New Address")

1. In the new address dialog, perform the following steps of a valid Azure AD account you want to provision:
   
    ![Save](./media/mimecast-personal-portal-tutorial/ic795006.png "Save")
   
    a. In the **Email Address** textbox, type **Email Address** of the user as **BrittaSimon@contoso.com**.
	
	b. In the **Global Name** textbox, type the **username** as **BrittaSimon**.

	c. In the **Password**, and **Confirm Password** textboxes, type the **Password** of the user.
   
    b. Click **Save**.

>[!NOTE]
>You can use any other Mimecast Personal Portal user account creation tools or APIs provided by Mimecast Personal Portal to provision Azure AD user accounts.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Mimecast Personal Portal.

![Assign the user role][200] 

**To assign Britta Simon to Mimecast Personal Portal, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

1. In the applications list, select **Mimecast Personal Portal**.

	![The Mimecast Personal Portal link in the Applications list](./media/mimecast-personal-portal-tutorial/tutorial_mimecastpersonalportal_app.png)  

1. In the menu on the left, click **Users and groups**.

	![The "Users and groups" link][202]

1. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![The Add Assignment pane][203]

1. On **Users and groups** dialog, select **Britta Simon** in the Users list.

1. Click **Select** button on **Users and groups** dialog.

1. Click **Assign** button on **Add Assignment** dialog.
	
### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Mimecast Personal Portal tile in the Access Panel, you should get automatically signed-on to your Mimecast Personal Portal application.
For more information about the Access Panel, see [Introduction to the Access Panel](../user-help/active-directory-saas-access-panel-introduction.md). 

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)



<!--Image references-->

[1]: ./media/mimecast-personal-portal-tutorial/tutorial_general_01.png
[2]: ./media/mimecast-personal-portal-tutorial/tutorial_general_02.png
[3]: ./media/mimecast-personal-portal-tutorial/tutorial_general_03.png
[4]: ./media/mimecast-personal-portal-tutorial/tutorial_general_04.png

[100]: ./media/mimecast-personal-portal-tutorial/tutorial_general_100.png

[200]: ./media/mimecast-personal-portal-tutorial/tutorial_general_200.png
[201]: ./media/mimecast-personal-portal-tutorial/tutorial_general_201.png
[202]: ./media/mimecast-personal-portal-tutorial/tutorial_general_202.png
[203]: ./media/mimecast-personal-portal-tutorial/tutorial_general_203.png


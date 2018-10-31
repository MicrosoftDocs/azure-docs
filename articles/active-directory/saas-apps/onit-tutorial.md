---
title: 'Tutorial: Azure Active Directory integration with Onit | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Onit.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: joflore

ms.assetid: bc479a28-8fcd-493f-ac53-681975a5149c
ms.service: active-directory
ms.component: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/24/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Onit

In this tutorial, you learn how to integrate Onit with Azure Active Directory (Azure AD).

Integrating Onit with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Onit.
- You can enable your users to automatically get signed-on to Onit (Single Sign-On) with their Azure AD accounts.
- You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Azure AD integration with Onit, you need the following items:

- An Azure AD subscription
- An Onit single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description

In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Onit from the gallery
1. Configuring and testing Azure AD single sign-on

## Adding Onit from the gallery
To configure the integration of Onit into Azure AD, you need to add Onit from the gallery to your list of managed SaaS apps.

**To add Onit from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![The Azure Active Directory button][1]

1. Navigate to **Enterprise applications**. Then go to **All applications**.

	![The Enterprise applications blade][2]
	
1. To add new application, click **New application** button on the top of dialog.

	![The New application button][3]

1. In the search box, type **Onit**, select **Onit** from result panel then click **Add** button to add the application.

	![Onit in the results list](./media/onit-tutorial/tutorial_onit_addfromgallery.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Onit based on a test user called "Britta Simon."

For single sign-on to work, Azure AD needs to know what the counterpart user in Onit is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Onit needs to be established.

In Onit, assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with Onit, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
1. **[Create an Onit test user](#create-an-onit-test-user)** - to have a counterpart of Britta Simon in Onit that is linked to the Azure AD representation of user.
1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
1. **[Test single sign-on](#test-single-sign-on)** to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Onit application.

**To configure Azure AD single sign-on with Onit, perform the following steps:**

1. In the Azure portal, on the **Onit** application integration page, click **Single sign-on**.

	![Configure single sign-on link][4]

1. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Single sign-on dialog box](./media/onit-tutorial/tutorial_onit_samlbase.png)

1. On the **Onit Domain and URLs** section, perform the following steps:

	![Onit Domain and URLs single sign-on information](./media/onit-tutorial/tutorial_onit_url.png)

    a. In the **Sign-on URL** textbox, type a URL using the following pattern: `https://<sub-domain>.onit.com`

	b. In the **Identifier** textbox, type a URL using the following pattern: `https://<sub-domain>.onit.com`

	> [!NOTE] 
	> These values are not real. Update these values with the actual Sign-On URL and Identifier. Contact [Onit Client support team](https://www.onit.com/support) to get these values. 
 
1. On the **SAML Signing Certificate** section, copy the **THUMBPRINT** value of certificate.

	![The Certificate download link](./media/onit-tutorial/tutorial_onit_certificate.png) 

1. Onit application expects the SAML assertions in a specific format. Please configure the following claims for this application. You can manage the values of these attributes from the **"Atrribute"** tab of the application. The following screenshot shows an example for this. 

	![Configure Single Sign-On](./media/onit-tutorial/tutorial_onit_attribute.png) 

1. In the **User Attributes** section on the **Single sign-on** dialog, configure SAML token attribute as shown in the image and perform the following steps:
	
	| Attribute Name | Attribute Value |
	| ------------------- | -------------------- |
	| email | user.mail |
	
	a. Click **Add attribute** to open the **Add Attribute** dialog.

	![Configure Single Sign-On](./media/onit-tutorial/tutorial_attribute_04.png)

	![Configure Single Sign-On](./media/onit-tutorial/tutorial_attribute_05.png)

	b. In the **Name** textbox, type the attribute name shown for that row.

	c. From the **Value** list, type the attribute value shown for that row.

	d. Leave the **Namespace** blank.
	
	e. Click **Ok**.

1. Click **Save** button.

	![Configure Single Sign-On Save button](./media/onit-tutorial/tutorial_general_400.png)

1. On the **Onit Configuration** section, click **Configure Onit** to open **Configure sign-on** window. Copy the **Sign-Out URL, SAML Single Sign-On Service URL** from the **Quick Reference section.**

	![Onit Configuration](./media/onit-tutorial/tutorial_onit_configure.png)

1. In a different web browser window, log into your Onit company site as an administrator.

1. In the menu on the top, click **Administration**.
   
   ![Administration](./media/onit-tutorial/IC791174.png "Administration")
1. Click **Edit Corporation**.
   
   ![Edit Corporation](./media/onit-tutorial/IC791175.png "Edit Corporation")
   
1. Click the **Security** tab.
    
    ![Edit Company Information](./media/onit-tutorial/IC791176.png "Edit Company Information")

1. On the **Security** tab, perform the following steps:

	![Single Sign-On](./media/onit-tutorial/IC791177.png "Single Sign-On")

	a. As **Authentication Strategy**, select **Single Sign On and Password**.
	
	b. In **Idp Target URL** textbox, paste the value of **SAML Single Sign-On Service URL**, which you have copied from Azure portal.

	c. In **Idp logout URL** textbox, paste the value of  **Sign-Out URL**, which you have copied from Azure portal.

	d. In **Idp Cert Fingerprint (SHA1)** textbox, paste the  **Thumbprint** value of certificate, which you have copied from Azure portal.

> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)
> 

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

   ![Create an Azure AD test user][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the Azure portal, in the left pane, click the **Azure Active Directory** button.

    ![The Azure Active Directory button](./media/onit-tutorial/create_aaduser_01.png)

1. To display the list of users, go to **Users and groups**, and then click **All users**.

    ![The "Users and groups" and "All users" links](./media/onit-tutorial/create_aaduser_02.png)

1. To open the **User** dialog box, click **Add** at the top of the **All Users** dialog box.

    ![The Add button](./media/onit-tutorial/create_aaduser_03.png)

1. In the **User** dialog box, perform the following steps:

    ![The User dialog box](./media/onit-tutorial/create_aaduser_04.png)

    a. In the **Name** box, type **BrittaSimon**.

    b. In the **User name** box, type the email address of user Britta Simon.

    c. Select the **Show Password** check box, and then write down the value that's displayed in the **Password** box.

    d. Click **Create**.
 
### Create an Onit test user

In order to enable Azure AD users to log into Onit, they must be provisioned into Onit.  

In the case of Onit, provisioning is a manual task.

**To configure user provisioning, perform the following steps:**

1. Sign on to your **Onit** company site as an administrator.
1. Click **Add User**.
   
   ![Administration](./media/onit-tutorial/IC791180.png "Administration")
1. On the **Add User** dialog page, perform the following steps:
   
   ![Add User](./media/onit-tutorial/IC791181.png "Add User")
   
  1. Type the **Name** and the **Email Address** of a valid Azure AD account you want to provision into the related textboxes.
  1. Click **Create**.    
   
 > [!NOTE]
 > The Azure Active Directory account holder receives an email and follows a link to confirm their account before it becomes active.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Onit.

![Assign the user role][200] 

**To assign Britta Simon to Onit, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

1. In the applications list, select **Onit**.

	![The Onit link in the Applications list](./media/onit-tutorial/tutorial_onit_app.png)  

1. In the menu on the left, click **Users and groups**.

	![The "Users and groups" link][202]

1. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![The Add Assignment pane][203]

1. On **Users and groups** dialog, select **Britta Simon** in the Users list.

1. Click **Select** button on **Users and groups** dialog.

1. Click **Assign** button on **Add Assignment** dialog.
	
### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Onit tile in the Access Panel, you should get automatically signed-on to your Onit application.
For more information about the Access Panel, see [Introduction to the Access Panel](../user-help/active-directory-saas-access-panel-introduction.md). 

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)



<!--Image references-->

[1]: ./media/onit-tutorial/tutorial_general_01.png
[2]: ./media/onit-tutorial/tutorial_general_02.png
[3]: ./media/onit-tutorial/tutorial_general_03.png
[4]: ./media/onit-tutorial/tutorial_general_04.png

[100]: ./media/onit-tutorial/tutorial_general_100.png

[200]: ./media/onit-tutorial/tutorial_general_200.png
[201]: ./media/onit-tutorial/tutorial_general_201.png
[202]: ./media/onit-tutorial/tutorial_general_202.png
[203]: ./media/onit-tutorial/tutorial_general_203.png


---
title: 'Tutorial: Azure Active Directory integration with TargetProcess | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and TargetProcess.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: joflore

ms.assetid: 7cb91628-e758-480d-a233-7a3caaaff50d
ms.service: active-directory
ms.component: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/20/2017
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with TargetProcess

In this tutorial, you learn how to integrate TargetProcess with Azure Active Directory (Azure AD).

Integrating TargetProcess with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to TargetProcess
- You can enable your users to automatically get signed-on to TargetProcess (Single Sign-On) with their Azure AD accounts
- You can manage your accounts in one central location - the Azure portal

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Azure AD integration with TargetProcess, you need the following items:

- An Azure AD subscription
- A TargetProcess single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Add TargetProcess from the gallery
1. Configure and test Azure AD single sign-on

## Add TargetProcess from the gallery
To configure the integration of TargetProcess into Azure AD, you need to add TargetProcess from the gallery to your list of managed SaaS apps.

**To add TargetProcess from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![Active Directory][1]

1. Navigate to **Enterprise applications**. Then go to **All applications**.

	![Applications][2]
	
1. To add new application, click **New application** button on the top of dialog.

	![Applications][3]

1. In the search box, type **TargetProcess**, select **TargetProcess**  from result panel then click **Add** button to add the application.

	![ADD TargetProcess from gallery](./media/target-process-tutorial/tutorial_target-process_addfromgallery.png)

##  Configure and test Azure AD single sign-on
In this section, you configure and test Azure AD single sign-on with TargetProcess based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in TargetProcess is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in TargetProcess needs to be established.

In TargetProcess, assign the value of the **user name** in Azure AD as the value of the **Username** to establish the link relationship.

To configure and test Azure AD single sign-on with TargetProcess, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
1. **[Create a TargetProcess test user](#create-a-targetprocess-test-user)** - to have a counterpart of Britta Simon in TargetProcess that is linked to the Azure AD representation of user.
1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
1. **[Test Single Sign-On](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your TargetProcess application.

**To configure Azure AD single sign-on with TargetProcess, perform the following steps:**

1. In the Azure portal, on the **TargetProcess** application integration page, click **Single sign-on**.

	![Configure Single Sign-On][4]

1. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![SAML-based Sign-on](./media/target-process-tutorial/tutorial_target-process_samlbase.png)

1. On the **TargetProcess Domain and URLs** section, perform the following steps:

	![TargetProcess Domain and URLs section](./media/target-process-tutorial/tutorial_target-process_url.png)

    a. In the **Sign-on URL** textbox, type a URL using the following pattern: `https://<subdomain>.tpondemand.com/`

	b. In the **Identifier** textbox, type a URL using the following pattern: `https://<subdomain>.tpondemand.com/`

	> [!NOTE] 
	> These values are not real. Update these values with the actual Sign-On URL and Identifier. Contact [TargetProcess Client support team](mailto:support@targetprocess.com) to get these values. 
 
1. On the **SAML Signing Certificate** section, click **Certificate (Base64)** and then save the certificate file on your computer.

	![SAML Signing Certificate section](./media/target-process-tutorial/tutorial_target-process_certificate.png) 

1. Click **Save** button.

	![Save button](./media/target-process-tutorial/tutorial_general_400.png)

1. On the **TargetProcess Configuration** section, click **Configure TargetProcess** to open **Configure sign-on** window. Copy the **SAML Single Sign-On Service URL** from the **Quick Reference section.**

	![TargetProcess Configuration section](./media/target-process-tutorial/tutorial_target-process_configure.png) 

1. Sign-on to your TargetProcess application as an administrator.

1. In the menu on the top, click **Setup**.
   
    ![Setup](./media/target-process-tutorial/tutorial_target_process_05.png)

1. Click **Settings**.
   
    ![Settings](./media/target-process-tutorial/tutorial_target_process_06.png) 

1. Click **Single Sign-on**.
   
    ![click Single Sign-On](./media/target-process-tutorial/tutorial_target_process_07.png) 

1. On the Single Sign-on settings dialog, perform the following steps:
   
    ![Configure Single Sign-On](./media/target-process-tutorial/tutorial_target_process_08.png)
	
	a. Click **Enable Single Sign-on**.
    
	b. In **Sign-on URL** textbox, paste the value of **SAML Single Sign-On Service URL** which you have copied from Azure portal.

	c. Open your downloaded certificate in notepad, copy the content, and then paste it into the **Certificate** textbox.
    
	d. click **Enable JIT Provisioning**.

	e. Click **Save**.

> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app!  After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)
> 

### Create an Azure AD test user
The objective of this section is to create a test user in the Azure portal called Britta Simon.

![Create Azure AD User][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the **Azure portal**, on the left navigation pane, click **Azure Active Directory** icon.

	![Creating an Azure AD test user](./media/target-process-tutorial/create_aaduser_01.png) 

1. To display the list of users, go to **Users and groups** and click **All users**.
	
	![To display the list of users](./media/target-process-tutorial/create_aaduser_02.png) 

1. To open the **User** dialog, click **Add** on the top of the dialog.
 
	![Add button](./media/target-process-tutorial/create_aaduser_03.png) 

1. On the **User** dialog page, perform the following steps:
 
	![User section](./media/target-process-tutorial/create_aaduser_04.png) 

    a. In the **Name** textbox, type **BrittaSimon**.

    b. In the **User name** textbox, type the **email address** of BrittaSimon.

	c. Select **Show Password** and write down the value of the **Password**.

    d. Click **Create**.
 
### Create a TargetProcess test user

The objective of this section is to create a user called Britta Simon in TargetProcess.

TargetProcess supports just-in-time provisioning. You have already enabled it in [Configuring Azure AD Single Sign-On](#configuring-azure-ad-single-sign-on).

There is no action item for you in this section.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to TargetProcess.

![Assign User][200] 

**To assign Britta Simon to TargetProcess, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

1. In the applications list, select **TargetProcess**.

	![TargetProcess in app list](./media/target-process-tutorial/tutorial_target-process_app.png) 

1. In the menu on the left, click **Users and groups**.

	![Assign User][202] 

1. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![Assign User][203]

1. On **Users and groups** dialog, select **Britta Simon** in the Users list.

1. Click **Select** button on **Users and groups** dialog.

1. Click **Assign** button on **Add Assignment** dialog.
	
### Test single sign-on

The objective of this section is to test your Azure AD single sign-on configuration using the Access Panel.

When you click the TargetProcess tile in the Access Panel, you should get automatically signed-on to your TargetProcess application. For more information about the Access Panel, see [Introduction to the Access Panel](../user-help/active-directory-saas-access-panel-introduction.md).

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)



<!--Image references-->

[1]: ./media/target-process-tutorial/tutorial_general_01.png
[2]: ./media/target-process-tutorial/tutorial_general_02.png
[3]: ./media/target-process-tutorial/tutorial_general_03.png
[4]: ./media/target-process-tutorial/tutorial_general_04.png

[100]: ./media/target-process-tutorial/tutorial_general_100.png

[200]: ./media/target-process-tutorial/tutorial_general_200.png
[201]: ./media/target-process-tutorial/tutorial_general_201.png
[202]: ./media/target-process-tutorial/tutorial_general_202.png
[203]: ./media/target-process-tutorial/tutorial_general_203.png


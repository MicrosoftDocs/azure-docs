---
title: 'Tutorial: Azure Active Directory integration with MyWorkDrive | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and MyWorkDrive.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila
ms.reviewer: joflore

ms.assetid: 4d049778-3c7b-46c0-92a4-f2633a32334b
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/19/2018
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with MyWorkDrive

In this tutorial, you learn how to integrate MyWorkDrive with Azure Active Directory (Azure AD).

Integrating MyWorkDrive with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to MyWorkDrive.
- You can enable your users to automatically get signed-on to MyWorkDrive (Single Sign-On) with their Azure AD accounts.
- You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Azure AD integration with MyWorkDrive, you need the following items:

- An Azure AD subscription
- A MyWorkDrive single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding MyWorkDrive from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding MyWorkDrive from the gallery
To configure the integration of MyWorkDrive into Azure AD, you need to add MyWorkDrive from the gallery to your list of managed SaaS apps.

**To add MyWorkDrive from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![The Azure Active Directory button][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![The Enterprise applications blade][2]
	
3. To add new application, click **New application** button on the top of dialog.

	![The New application button][3]

4. In the search box, type **MyWorkDrive**, select **MyWorkDrive** from result panel then click **Add** button to add the application.

	![MyWorkDrive in the results list](./media/myworkdrive-tutorial/tutorial_myworkdrive_addfromgallery.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with MyWorkDrive based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in MyWorkDrive is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in MyWorkDrive needs to be established.

To configure and test Azure AD single sign-on with MyWorkDrive, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Create a MyWorkDrive test user](#create-a-myworkdrive-test-user)** - to have a counterpart of Britta Simon in MyWorkDrive that is linked to the Azure AD representation of user.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your MyWorkDrive application.

**To configure Azure AD single sign-on with MyWorkDrive, perform the following steps:**

1. In the Azure portal, on the **MyWorkDrive** application integration page, click **Single sign-on**.

	![Configure single sign-on link][4]

2. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Single sign-on dialog box](./media/myworkdrive-tutorial/tutorial_myworkdrive_samlbase.png)

3. On the **MyWorkDrive Domain and URLs** section, perform the following steps if you wish to configure the application in **IDP** initiated mode:

	![MyWorkDrive Domain and URLs single sign-on information](./media/myworkdrive-tutorial/tutorial_myworkdrive_url.png)

	In the **Reply URL** textbox, type a URL using the following pattern: `https://<SERVER.DOMAIN.COM>/SAML/AssertionConsumerService.aspx`

4. Check **Show advanced URL settings** and perform the following step if you wish to configure the application in **SP** initiated mode:

	![MyWorkDrive Domain and URLs single sign-on information](./media/myworkdrive-tutorial/tutorial_myworkdrive_url1.png)

    In the **Sign-on URL** textbox, type a URL using the following pattern: `https://<SERVER.DOMAIN.COM>/Account/Login-saml`
	 
	> [!NOTE] 
	> These values are not real. Update these values with the actual Reply URL, and Sign-On URL. Contact [MyWorkDrive Client support team](mailto:support@myworkdrive.com) to get these values. 

5. On the **SAML Signing Certificate** section, click **Certificate (Base64)** and then save the certificate file on your computer.

	![The Certificate download link](./media/myworkdrive-tutorial/tutorial_myworkdrive_certificate.png) 

6. Click **Save** button.

	![Configure Single Sign-On Save button](./media/myworkdrive-tutorial/tutorial_general_400.png)
	
7. On the **MyWorkDrive Configuration** section, click **Configure MyWorkDrive** to open **Configure sign-on** window. Copy the **Sign-Out URL, SAML Entity ID, and SAML Single Sign-On Service URL** from the **Quick Reference section.**

	![MyWorkDrive Configuration](./media/myworkdrive-tutorial/tutorial_myworkdrive_configure.png) 

8. To configure single sign-on on **MyWorkDrive** side, you need to send the downloaded **Certificate (Base64)**, **Sign-Out URL, SAML Entity ID, and SAML Single Sign-On Service URL** to [MyWorkDrive support team](mailto:support@myworkdrive.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

   ![Create an Azure AD test user][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the Azure portal, in the left pane, click the **Azure Active Directory** button.

    ![The Azure Active Directory button](./media/myworkdrive-tutorial/create_aaduser_01.png)

2. To display the list of users, go to **Users and groups**, and then click **All users**.

    ![The "Users and groups" and "All users" links](./media/myworkdrive-tutorial/create_aaduser_02.png)

3. To open the **User** dialog box, click **Add** at the top of the **All Users** dialog box.

    ![The Add button](./media/myworkdrive-tutorial/create_aaduser_03.png)

4. In the **User** dialog box, perform the following steps:

    ![The User dialog box](./media/myworkdrive-tutorial/create_aaduser_04.png)

    a. In the **Name** box, type **BrittaSimon**.

    b. In the **User name** box, type the email address of user Britta Simon.

    c. Select the **Show Password** check box, and then write down the value that's displayed in the **Password** box.

    d. Click **Create**.
 
### Create a MyWorkDrive test user

In this section, you create a user called Britta Simon in MyWorkDrive. Work with [MyWorkDrive support team](mailto:support@myworkdrive.com) to add the users in the MyWorkDrive platform. Users must be created and activated before you use single sign-on.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to MyWorkDrive.

![Assign the user role][200] 

**To assign Britta Simon to MyWorkDrive, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

2. In the applications list, select **MyWorkDrive**.

	![The MyWorkDrive link in the Applications list](./media/myworkdrive-tutorial/tutorial_myworkdrive_app.png)  

3. In the menu on the left, click **Users and groups**.

	![The "Users and groups" link][202]

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![The Add Assignment pane][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.
	
### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the MyWorkDrive tile in the Access Panel, you should get automatically signed-on to your MyWorkDrive application.
For more information about the Access Panel, see [Introduction to the Access Panel](../active-directory-saas-access-panel-introduction.md). 

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)



<!--Image references-->

[1]: ./media/myworkdrive-tutorial/tutorial_general_01.png
[2]: ./media/myworkdrive-tutorial/tutorial_general_02.png
[3]: ./media/myworkdrive-tutorial/tutorial_general_03.png
[4]: ./media/myworkdrive-tutorial/tutorial_general_04.png

[100]: ./media/myworkdrive-tutorial/tutorial_general_100.png

[200]: ./media/myworkdrive-tutorial/tutorial_general_200.png
[201]: ./media/myworkdrive-tutorial/tutorial_general_201.png
[202]: ./media/myworkdrive-tutorial/tutorial_general_202.png
[203]: ./media/myworkdrive-tutorial/tutorial_general_203.png


---
title: 'Tutorial: Azure Active Directory integration with Attendance Management Services | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Attendance Management Services.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila
ms.reviewer: joflore

ms.assetid: 1f56e612-728b-4203-a545-a81dc5efda00
ms.service: active-directory
ms.component: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/13/2018
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Attendance Management Services

In this tutorial, you learn how to integrate Attendance Management Services with Azure Active Directory (Azure AD).

Integrating Attendance Management Services with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to Attendance Management Services.
- You can enable your users to automatically get signed-on to Attendance Management Services (Single Sign-On) with their Azure AD accounts.
- You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Azure AD integration with Attendance Management Services, you need the following items:

- An Azure AD subscription
- An Attendance Management Services single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description
In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding Attendance Management Services from the gallery
1. Configuring and testing Azure AD single sign-on

## Adding Attendance Management Services from the gallery
To configure the integration of Attendance Management Services into Azure AD, you need to add Attendance Management Services from the gallery to your list of managed SaaS apps.

**To add Attendance Management Services from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![The Azure Active Directory button][1]

1. Navigate to **Enterprise applications**. Then go to **All applications**.

	![The Enterprise applications blade][2]
	
1. To add new application, click **New application** button on the top of dialog.

	![The New application button][3]

1. In the search box, type **Attendance Management Services**, select **Attendance Management Services** from result panel then click **Add** button to add the application.

	![Attendance Management Services in the results list](./media/attendancemanagementservices-tutorial/tutorial_attendancemanagementservices_addfromgallery.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Attendance Management Services based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in Attendance Management Services is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in Attendance Management Services needs to be established.

To configure and test Azure AD single sign-on with Attendance Management Services, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
1. **[Create an Attendance Management Services test user](#create-an-attendance-management-service-test-user)** - to have a counterpart of Britta Simon in Attendance Management Services that is linked to the Azure AD representation of user.
1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
1. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your Attendance Management Services application.

**To configure Azure AD single sign-on with Attendance Management Services, perform the following steps:**

1. In the Azure portal, on the **Attendance Management Services** application integration page, click **Single sign-on**.

	![Configure single sign-on link][4]

1. On the **Single sign-on** dialog, select **Mode** as	**SAML-based Sign-on** to enable single sign-on.
 
	![Single sign-on dialog box](./media/attendancemanagementservices-tutorial/tutorial_attendancemanagementservices_samlbase.png)

1. On the **Attendance Management Services Domain and URLs** section, perform the following steps:

	![Attendance Management Services Domain and URLs single sign-on information](./media/attendancemanagementservices-tutorial/tutorial_attendancemanagementservices_url.png)

    a. In the **Sign-on URL** textbox, type a URL using the following pattern: `https://id.obc.jp/<tenant information >/`

	b. In the **Identifier** textbox, type a URL using the following pattern: `https://id.obc.jp/<tenant information >/`

	> [!NOTE]
	> These values are not real. Update these values with the actual Sign-On URL and Identifier. Contact [Attendance Management Services Client support team](http://www.obcnet.jp/) to get these values.

1. On the **SAML Signing Certificate** section, click **Certificate(Base64)** and then save the certificate file on your computer.

	![The Certificate download link](./media/attendancemanagementservices-tutorial/tutorial_attendancemanagementservices_certificate.png) 

1. Click **Save** button.

	![Configure Single Sign-On Save button](./media/attendancemanagementservices-tutorial/tutorial_general_400.png)

1. On the **Attendance Management Services Configuration** section, click **Configure Attendance Management Services** to open **Configure sign-on** window. Copy the **SAML Entity ID, and SAML Single Sign-On Service URL** from the **Quick Reference section.**

	![Attendance Management Services Configuration](./media/attendancemanagementservices-tutorial/tutorial_attendancemanagementservices_configure.png) 

1. In a different browser window, sign-on to your Attendance Management Services company site as administrator.

1. Click on **SAML authentication** under the **Security management section**.

	![Attendance Management Services Configuration](./media/attendancemanagementservices-tutorial/user1.png)

1. Perform the following steps:

	![Attendance Management Services Configuration](./media/attendancemanagementservices-tutorial/user2.png)

	a. Select **Use SAML authentication**.

	b. In the **Identifier** textbox, paste the value of **SAML Entity ID**, which you have copied from Azure portal. 

	c. In the **Authentication endpoint URL** textbox, paste the value of **SAML Single Sign-On Service URL**, which you have copied from Azure portal.

	d. Click **Select a file** to upload the certificate which you downloaded from Azure AD.

	e. Select **Disable password authentication**.

	f. Click **Registration**

> [!TIP]
> You can now read a concise version of these instructions inside the [Azure portal](https://portal.azure.com), while you are setting up the app! After adding this app from the **Active Directory > Enterprise Applications** section, simply click the **Single Sign-On** tab and access the embedded documentation through the **Configuration** section at the bottom. You can read more about the embedded documentation feature here: [Azure AD embedded documentation]( https://go.microsoft.com/fwlink/?linkid=845985)
> 

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

   ![Create an Azure AD test user][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the Azure portal, in the left pane, click the **Azure Active Directory** button.

    ![The Azure Active Directory button](./media/attendancemanagementservices-tutorial/create_aaduser_01.png)

1. To display the list of users, go to **Users and groups**, and then click **All users**.

    ![The "Users and groups" and "All users" links](./media/attendancemanagementservices-tutorial/create_aaduser_02.png)

1. To open the **User** dialog box, click **Add** at the top of the **All Users** dialog box.

    ![The Add button](./media/attendancemanagementservices-tutorial/create_aaduser_03.png)

1. In the **User** dialog box, perform the following steps:

    ![The User dialog box](./media/attendancemanagementservices-tutorial/create_aaduser_04.png)

    a. In the **Name** box, type **BrittaSimon**.

    b. In the **User name** box, type the email address of user Britta Simon.

    c. Select the **Show Password** check box, and then write down the value that's displayed in the **Password** box.

    d. Click **Create**.
 
### Create an Attendance Management Services test user

To enable Azure AD users to log in to Attendance Management Services, they must be provisioned into Attendance Management Services. In the case of Attendance Management Services, provisioning is a manual task.

**To provision a user account, perform the following steps:**

1. Log in to your Attendance Management Services company site as an administrator.

1. Click on **User management** under the **Security management section**.

	![Add Employee](./media/attendancemanagementservices-tutorial/user5.png)

1. Click **New rules login**.

    ![Add Employee](./media/attendancemanagementservices-tutorial/user3.png)

1. In the **OBCiD information** section, perform the following steps:

	![Add Employee](./media/attendancemanagementservices-tutorial/user4.png)

	a. In the **OBCiD** textbox, type the email of user like **BrittaSimon@contoso.com**.

	b. In the **Password** textbox, type the password of user.

	c. Click **Registration**


### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Attendance Management Services.

![Assign the user role][200] 

**To assign Britta Simon to Attendance Management Services, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201] 

1. In the applications list, select **Attendance Management Services**.

	![The Attendance Management Services link in the Applications list](./media/attendancemanagementservices-tutorial/tutorial_attendancemanagementservices_app.png)  

1. In the menu on the left, click **Users and groups**.

	![The "Users and groups" link][202]

1. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![The Add Assignment pane][203]

1. On **Users and groups** dialog, select **Britta Simon** in the Users list.

1. Click **Select** button on **Users and groups** dialog.

1. Click **Assign** button on **Add Assignment** dialog.
	
### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Attendance Management Services tile in the Access Panel, you should get automatically signed-on to your Attendance Management Services application.
For more information about the Access Panel, see [Introduction to the Access Panel](../user-help/active-directory-saas-access-panel-introduction.md). 

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

<!--Image references-->

[1]: ./media/attendancemanagementservices-tutorial/tutorial_general_01.png
[2]: ./media/attendancemanagementservices-tutorial/tutorial_general_02.png
[3]: ./media/attendancemanagementservices-tutorial/tutorial_general_03.png
[4]: ./media/attendancemanagementservices-tutorial/tutorial_general_04.png

[100]: ./media/attendancemanagementservices-tutorial/tutorial_general_100.png

[200]: ./media/attendancemanagementservices-tutorial/tutorial_general_200.png
[201]: ./media/attendancemanagementservices-tutorial/tutorial_general_201.png
[202]: ./media/attendancemanagementservices-tutorial/tutorial_general_202.png
[203]: ./media/attendancemanagementservices-tutorial/tutorial_general_203.png


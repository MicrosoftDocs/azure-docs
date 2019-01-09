---
title: 'Tutorial: Azure Active Directory integration with N2F - Expense reports | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and N2F - Expense reports.
services: active-directory
documentationCenter: na
author: jeevansd
manager: femila
ms.reviewer: joflore

ms.assetid: f56d53d7-5a08-490a-bfb9-78fefc2751ec
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/08/2018
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with N2F - Expense reports

In this tutorial, you learn how to integrate N2F - Expense reports with Azure Active Directory (Azure AD).

Integrating N2F - Expense reports with Azure AD provides you with the following benefits:

- You can control in Azure AD who has access to N2F - Expense reports.
- You can enable your users to automatically get signed-on to N2F - Expense reports (Single Sign-On) with their Azure AD accounts.
- You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [what is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md)

## Prerequisites

To configure Azure AD integration with N2F - Expense reports, you need the following items:

- An Azure AD subscription
- A N2F - Expense reports single sign-on enabled subscription

> [!NOTE]
> To test the steps in this tutorial, we do not recommend using a production environment.

To test the steps in this tutorial, you should follow these recommendations:

- Do not use your production environment, unless it is necessary.
- If you don't have an Azure AD trial environment, you can [get a one-month trial](https://azure.microsoft.com/pricing/free-trial/).

## Scenario description

In this tutorial, you test Azure AD single sign-on in a test environment. 
The scenario outlined in this tutorial consists of two main building blocks:

1. Adding N2F - Expense reports from the gallery
2. Configuring and testing Azure AD single sign-on

## Adding N2F - Expense reports from the gallery

To configure the integration of N2F - Expense reports into Azure AD, you need to add N2F - Expense reports from the gallery to your list of managed SaaS apps.

**To add N2F - Expense reports from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon. 

	![The Azure Active Directory button][1]

2. Navigate to **Enterprise applications**. Then go to **All applications**.

	![The Enterprise applications blade][2]

3. To add new application, click **New application** button on the top of dialog.

	![The New application button][3]

4. In the search box, type **N2F - Expense reports**, select **N2F - Expense reports** from result panel then click **Add** button to add the application.

	![N2F - Expense reports in the results list](./media/n2f-expensereports-tutorial/tutorial_n2f-expensereports_addfromgallery.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with N2F - Expense reports based on a test user called "Britta Simon".

For single sign-on to work, Azure AD needs to know what the counterpart user in N2F - Expense reports is to a user in Azure AD. In other words, a link relationship between an Azure AD user and the related user in N2F - Expense reports needs to be established.

To configure and test Azure AD single sign-on with N2F - Expense reports, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
3. **[Create a N2F - Expense reports test user](#create-a-n2f---expense-reports-test-use)** - to have a counterpart of Britta Simon in N2F - Expense reports that is linked to the Azure AD representation of user.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal and configure single sign-on in your N2F - Expense reports application.

**To configure Azure AD single sign-on with N2F - Expense reports, perform the following steps:**

1. In the Azure portal, on the **N2F - Expense reports** application integration page, click **Single sign-on**.

	![Configure single sign-on link][4]

2. On the **Single sign-on** dialog, select **Mode** as **SAML-based Sign-on** to enable single sign-on.

	![Single sign-on dialog box](./media/n2f-expensereports-tutorial/tutorial_n2f-expensereports_samlbase.png)

3. On the **N2F - Expense reports Domain and URLs** section, if you wish to configure the application in **IDP** initiated mode, the user does not have to perform any steps as the app is already pre-integrated with Azure.

	![N2F - Expense reports Domain and URLs single sign-on information](./media/n2f-expensereports-tutorial/tutorial_n2f-expensereports_url1.png)

4. Check **Show advanced URL settings** and perform the following step if you wish to configure the application in **SP** initiated mode:

	![N2F - Expense reports Domain and URLs single sign-on information](./media/n2f-expensereports-tutorial/tutorial_n2f-expensereports_url2.png)

    In the **Sign-on URL** textbox, type the URL: `https://www.n2f.com/app/`

5. On the **SAML Signing Certificate** section, click the copy button to copy **App Federation Metadata Url** and paste it into Notepad.

	![The Certificate download link](./media/n2f-expensereports-tutorial/tutorial_n2f-expensereports_certificate.png)

6. Click **Save** button.

	![Configure Single Sign-On Save button](./media/n2f-expensereports-tutorial/tutorial_general_400.png)

7. On the **N2F - Expense reports Configuration** section, click **Configure N2F - Expense reports** to open **Configure sign-on** window. Copy the **SAML Entity ID** from the **Quick Reference section.**

	![N2F - Expense reports Configuration](./media/n2f-expensereports-tutorial/tutorial_n2f-expensereports_configure.png)

8. In a different web browser window, sign in to your N2F - Expense reports company site as an administrator.

9. Click on **Settings** and then select **Advance Settings** from the dropdown.

	![N2F - Expense reports Configuration](./media/n2f-expensereports-tutorial/configure1.png)

10. Select **Account settings** tab.

	![N2F - Expense reports Configuration](./media/n2f-expensereports-tutorial/configure2.png)

11. Select **Authentication** and then select **+ Add an authentication method** tab.

	![N2F - Expense reports Configuration](./media/n2f-expensereports-tutorial/configure3.png)

12. Select **SAML Microsoft Office 365** as Authentication method.

	![N2F - Expense reports Configuration](./media/n2f-expensereports-tutorial/configure4.png)

13. On the **Authentication method** section, perform the following steps:

	![N2F - Expense reports Configuration](./media/n2f-expensereports-tutorial/configure5.png)

	a. In the **Entity ID** textbox, paste the **SAML Entity ID** value, which you have copied from the Azure portal.

	b. In the **Metadata URL** textbox, paste the **App Federation Metadata Url** value, which you have copied from the Azure portal.

	c. Click **Save**.

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

   ![Create an Azure AD test user][100]

**To create a test user in Azure AD, perform the following steps:**

1. In the Azure portal, in the left pane, click the **Azure Active Directory** button.

    ![The Azure Active Directory button](./media/n2f-expensereports-tutorial/create_aaduser_01.png)

2. To display the list of users, go to **Users and groups**, and then click **All users**.

    ![The "Users and groups" and "All users" links](./media/n2f-expensereports-tutorial/create_aaduser_02.png)

3. To open the **User** dialog box, click **Add** at the top of the **All Users** dialog box.

    ![The Add button](./media/n2f-expensereports-tutorial/create_aaduser_03.png)

4. In the **User** dialog box, perform the following steps:

    ![The User dialog box](./media/n2f-expensereports-tutorial/create_aaduser_04.png)

    a. In the **Name** box, type **BrittaSimon**.

    b. In the **User name** box, type the email address of user Britta Simon.

    c. Select the **Show Password** check box, and then write down the value that's displayed in the **Password** box.

    d. Click **Create**.

### Create a N2F - Expense reports test user

To enable Azure AD users to log in to N2F - Expense reports, they must be provisioned into N2F - Expense reports. In the case of N2F - Expense reports, provisioning is a manual task.

**To provision a user account, perform the following steps:**

1. Log in to your N2F - Expense reports company site as an administrator.

2. Click on **Settings** and then select **Advance Settings** from the dropdown.

   ![N2F - Expense Add user](./media/n2f-expensereports-tutorial/configure1.png)

3. Select **Users** tab from left navigation panel.

	![N2F - Expense reports Configuration](./media/n2f-expensereports-tutorial/user1.png)

4. Select **+ New user** tab.

   ![N2F - Expense reports Configuration](./media/n2f-expensereports-tutorial/user2.png)

5. On the **User** section, perform the following steps:

	![N2F - Expense reports Configuration](./media/n2f-expensereports-tutorial/user3.png)

	a. In the **Email address** textbox, enter the email address of user like **brittasimon@contoso.com**.

	b. In the **First name** textbox, enter the first name of user like **Britta**.

	c. In the **Name** textbox, enter the name of user like **BrittaSimon**.

	d. Choose **Role, Direct manager (N+1)**, and **Division** as per your organization requirement.

	e. Click **Validate and send invitation**.

	> [!NOTE]
	> If you are facing any problems while adding the user, please contact [N2F - Expense reports support team](mailto:support@n2f.com)

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to N2F - Expense reports.

![Assign the user role][200]

**To assign Britta Simon to N2F - Expense reports, perform the following steps:**

1. In the Azure portal, open the applications view, and then navigate to the directory view and go to **Enterprise applications** then click **All applications**.

	![Assign User][201]

2. In the applications list, select **N2F - Expense reports**.

	![The N2F - Expense reports link in the Applications list](./media/n2f-expensereports-tutorial/tutorial_n2f-expensereports_app.png)  

3. In the menu on the left, click **Users and groups**.

	![The "Users and groups" link][202]

4. Click **Add** button. Then select **Users and groups** on **Add Assignment** dialog.

	![The Add Assignment pane][203]

5. On **Users and groups** dialog, select **Britta Simon** in the Users list.

6. Click **Select** button on **Users and groups** dialog.

7. Click **Assign** button on **Add Assignment** dialog.

### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the N2F - Expense reports tile in the Access Panel, you should get automatically signed-on to your N2F - Expense reports application.
For more information about the Access Panel, see [Introduction to the Access Panel](../user-help/active-directory-saas-access-panel-introduction.md).

## Additional resources

* [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](tutorial-list.md)
* [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

<!--Image references-->

[1]: ./media/n2f-expensereports-tutorial/tutorial_general_01.png
[2]: ./media/n2f-expensereports-tutorial/tutorial_general_02.png
[3]: ./media/n2f-expensereports-tutorial/tutorial_general_03.png
[4]: ./media/n2f-expensereports-tutorial/tutorial_general_04.png

[100]: ./media/n2f-expensereports-tutorial/tutorial_general_100.png

[200]: ./media/n2f-expensereports-tutorial/tutorial_general_200.png
[201]: ./media/n2f-expensereports-tutorial/tutorial_general_201.png
[202]: ./media/n2f-expensereports-tutorial/tutorial_general_202.png
[203]: ./media/n2f-expensereports-tutorial/tutorial_general_203.png


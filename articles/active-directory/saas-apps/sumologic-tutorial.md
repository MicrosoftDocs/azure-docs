---
title: 'Tutorial: Azure Active Directory integration with SumoLogic | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and SumoLogic.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: fbb76765-92d7-4801-9833-573b11b4d910
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 03/07/2019
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with SumoLogic

In this tutorial, you learn how to integrate SumoLogic with Azure Active Directory (Azure AD).
Integrating SumoLogic with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to SumoLogic.
* You can enable your users to be automatically signed-in to SumoLogic (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with SumoLogic, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get one-month trial [here](https://azure.microsoft.com/pricing/free-trial/)
* SumoLogic single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* SumoLogic supports **SP** initiated SSO

## Adding SumoLogic from the gallery

To configure the integration of SumoLogic into Azure AD, you need to add SumoLogic from the gallery to your list of managed SaaS apps.

**To add SumoLogic from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Navigate to **Enterprise Applications** and then select the **All Applications** option.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add new application, click **New application** button on the top of dialog.

	![The New application button](common/add-new-app.png)

4. In the search box, type **SumoLogic**, select **SumoLogic** from result panel then click **Add** button to add the application.

	 ![SumoLogic in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with SumoLogic based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in SumoLogic needs to be established.

To configure and test Azure AD single sign-on with SumoLogic, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure SumoLogic Single Sign-On](#configure-sumologic-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Create SumoLogic test user](#create-sumologic-test-user)** - to have a counterpart of Britta Simon in SumoLogic that is linked to the Azure AD representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with SumoLogic, perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **SumoLogic** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, perform the following steps:

    ![SumoLogic Domain and URLs single sign-on information](common/sp-identifier.png)

	a. In the **Sign on URL** text box, type a URL using the following pattern:
    `https://<tenantname>.SumoLogic.com`

   b. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:

	| |
	|--|
	| `https://<tenantname>.us2.sumologic.com` |
	| `https://<tenantname>.sumologic.com` |
	| `https://<tenantname>.us4.sumologic.com` |
	| `https://<tenantname>.eu.sumologic.com` |
	| `https://<tenantname>.au.sumologic.com` |

    > [!NOTE]
    > These values are not real. Update these values with the actual Sign on URL and Identifier. Contact [SumoLogic Client support team](https://www.sumologic.com/contact-us/) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

5. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Certificate (Base64)** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

6. On the **Set up SumoLogic** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Azure AD Identifier

	c. Logout URL

### Configure SumoLogic Single Sign-On

1. In a different web browser window, sign in to your SumoLogic company site as an administrator.

1. Go to **Manage \> Security**.

    ![Manage](./media/sumologic-tutorial/ic778556.png "Manage")

1. Click **SAML**.

    ![Global security settings](./media/sumologic-tutorial/ic778557.png "Global security settings")

1. From the **Select a configuration or create a new one** list, select **Azure AD**, and then click **Configure**.

    ![Configure SAML 2.0](./media/sumologic-tutorial/ic778558.png "Configure SAML 2.0")

1. On the **Configure SAML 2.0** dialog, perform the following steps:

    ![Configure SAML 2.0](./media/sumologic-tutorial/ic778559.png "Configure SAML 2.0")

    a. In the **Configuration Name** textbox, type **Azure AD**.

    b. Select **Debug Mode**.

    c. In the **Issuer** textbox, paste the value of **Azure AD Identifier**, which you have copied from Azure portal.

    d. In the **Authn Request URL** textbox, paste the value of **Login URL**, which you have copied from Azure portal.

    e. Open your base-64 encoded certificate in notepad, copy the content of it into your clipboard, and then paste the entire Certificate into **X.509 Certificate** textbox.

    f. As **Email Attribute**, select **Use SAML subject**.  

    g. Select **SP initiated Login Configuration**.

    h. In the **Login Path** textbox, type **Azure** and click **Save**.

### Create an Azure AD test user

The objective of this section is to create a test user in the Azure portal called Britta Simon.

1. In the Azure portal, in the left pane, select **Azure Active Directory**, select **Users**, and then select **All users**.

    ![The "Users and groups" and "All users" links](common/users.png)

2. Select **New user** at the top of the screen.

    ![New user Button](common/new-user.png)

3. In the User properties, perform the following steps.

    ![The User dialog box](common/user-properties.png)

    a. In the **Name** field enter **BrittaSimon**.
  
    b. In the **User name** field type **brittasimon@yourcompanydomain.extension**  
    For example, BrittaSimon@contoso.com

    c. Select **Show password** check box, and then write down the value that's displayed in the Password box.

    d. Click **Create**.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to SumoLogic.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **SumoLogic**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **SumoLogic**.

	![The SumoLogic link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog click the **Assign** button.

### Create SumoLogic test user

In order to enable Azure AD users to sign in to SumoLogic, they must be provisioned to SumoLogic. In the case of SumoLogic, provisioning is a manual task.

**To provision a user account, perform the following steps:**

1. Sign in to your **SumoLogic** tenant.

1. Go to **Manage \> Users**.

    ![Users](./media/sumologic-tutorial/ic778561.png "Users")

1. Click **Add**.

    ![Users](./media/sumologic-tutorial/ic778562.png "Users")

1. On the **New User** dialog, perform the following steps:

    ![New User](./media/sumologic-tutorial/ic778563.png "New User") 

    a. Type the related information of the Azure AD account you want to provision into the **First Name**, **Last Name**, and **Email** textboxes.
  
    b. Select a role.
  
    c. As **Status**, select **Active**.
  
    d. Click **Save**.

> [!NOTE]
> You can use any other SumoLogic user account creation tools or APIs provided by SumoLogic to provision AAD user accounts.

### Test single sign-on

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the SumoLogic tile in the Access Panel, you should be automatically signed in to the SumoLogic for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)


---
title: 'Tutorial: Azure Active Directory integration with Panorama9 | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Panorama9.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 5e28d7fa-03be-49f3-96c8-b567f1257d44
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 03/25/2019
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Panorama9

In this tutorial, you learn how to integrate Panorama9 with Azure Active Directory (Azure AD).
Integrating Panorama9 with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to Panorama9.
* You can enable your users to be automatically signed-in to Panorama9 (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with Panorama9, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get one-month trial [here](https://azure.microsoft.com/pricing/free-trial/)
* Panorama9 single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Panorama9 supports **SP** initiated SSO

## Adding Panorama9 from the gallery

To configure the integration of Panorama9 into Azure AD, you need to add Panorama9 from the gallery to your list of managed SaaS apps.

**To add Panorama9 from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Navigate to **Enterprise Applications** and then select the **All Applications** option.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add new application, click **New application** button on the top of dialog.

	![The New application button](common/add-new-app.png)

4. In the search box, type **Panorama9**, select **Panorama9** from result panel then click **Add** button to add the application.

	 ![Panorama9 in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Panorama9 based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in Panorama9 needs to be established.

To configure and test Azure AD single sign-on with Panorama9, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure Panorama9 Single Sign-On](#configure-panorama9-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Create Panorama9 test user](#create-panorama9-test-user)** - to have a counterpart of Britta Simon in Panorama9 that is linked to the Azure AD representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with Panorama9, perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **Panorama9** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, perform the following steps:

    ![Panorama9 Domain and URLs single sign-on information](common/sp-identifier.png)

	a. In the **Sign on URL** text box, type a URL:
    `https://dashboard.panorama9.com/saml/access/3262`

    b. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:
    `https://www.panorama9.com/saml20/<tenant-name>`

	> [!NOTE]
	> These values are not real. Update these values with the actual Sign on URL and Identifier. Contact [Panorama9 Client support team](https://support.panorama9.com/) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

5. In the **SAML Signing Certificate** section, click **Edit** button to open **SAML Signing Certificate** dialog.

	![Edit SAML Signing Certificate](common/edit-certificate.png)

6. In the **SAML Signing Certificate** section, copy the **Thumbprint** and save it on your computer.

    ![Copy Thumbprint value](common/copy-thumbprint.png)

7. On the **Set up Panorama9** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Azure AD Identifier

	c. Logout URL

### Configure Panorama9 Single Sign-On

1. In a different web browser window, sign in to your Panorama9 company site as an administrator.

2. In the toolbar on the top, click **Manage**, and then click **Extensions**.
   
	![Extensions](./media/panorama9-tutorial/ic790023.png "Extensions")

3. On the **Extensions** dialog, click **Single Sign-On**.
   
	![Single Sign-On](./media/panorama9-tutorial/ic790024.png "Single Sign-On")

4. In the **Settings** section, perform the following steps:
   
	![Settings](./media/panorama9-tutorial/ic790025.png "Settings")
   
	a. In **Identity provider URL** textbox, paste the value of **Login URL**, which you have copied from Azure portal.
   
	b. In **Certificate fingerprint** textbox, paste the **Thumbprint** value of certificate, which you have copied from Azure portal.    
         
5. Click **Save**.

### Create an Azure AD test user 

The objective of this section is to create a test user in the Azure portal called Britta Simon.

1. In the Azure portal, in the left pane, select **Azure Active Directory**, select **Users**, and then select **All users**.

    ![The "Users and groups" and "All users" links](common/users.png)

2. Select **New user** at the top of the screen.

    ![New user Button](common/new-user.png)

3. In the User properties, perform the following steps.

    ![The User dialog box](common/user-properties.png)

    a. In the **Name** field enter **BrittaSimon**.
  
    b. In the **User name** field type brittasimon@yourcompanydomain.extension. For example, BrittaSimon@contoso.com

    c. Select **Show password** check box, and then write down the value that's displayed in the Password box.

    d. Click **Create**.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Panorama9.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **Panorama9**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **Panorama9**.

	![The Panorama9 link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog click the **Assign** button.

### Create Panorama9 test user

In order to enable Azure AD users to sign in to Panorama9, they must be provisioned into Panorama9.  

In the case of Panorama9, provisioning is a manual task.

**To configure user provisioning, perform the following steps:**

1. Sign in to your **Panorama9** company site as an administrator.

2. In the menu on the top, click **Manage**, and then click **Users**.
   
	![Users](./media/panorama9-tutorial/ic790027.png "Users")

3. In the Users section, Click **+** to add new user.

	![Users](./media/panorama9-tutorial/ic790028.png "Users")

4. Go to the User data section, type the email address of a valid Azure Active Directory user you want to provision into the **Email** textbox.

5. Come to the Users section, Click **Save**.
   
	> [!NOTE]
    > The Azure Active Directory account holder receives an email and follows a link to confirm their account before it becomes active.

### Test single sign-on 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Panorama9 tile in the Access Panel, you should be automatically signed in to the Panorama9 for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)


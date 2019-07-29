---
title: 'Tutorial: Azure Active Directory integration with Onit | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Onit.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: bc479a28-8fcd-493f-ac53-681975a5149c
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 03/13/2019
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with Onit

In this tutorial, you learn how to integrate Onit with Azure Active Directory (Azure AD).
Integrating Onit with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to Onit.
* You can enable your users to be automatically signed-in to Onit (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with Onit, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get one-month trial [here](https://azure.microsoft.com/pricing/free-trial/)
* Onit single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Onit supports **SP** initiated SSO

## Adding Onit from the gallery

To configure the integration of Onit into Azure AD, you need to add Onit from the gallery to your list of managed SaaS apps.

**To add Onit from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Navigate to **Enterprise Applications** and then select the **All Applications** option.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add new application, click **New application** button on the top of dialog.

	![The New application button](common/add-new-app.png)

4. In the search box, type **Onit**, select **Onit** from result panel then click **Add** button to add the application.

	 ![Onit in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Onit based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in Onit needs to be established.

To configure and test Azure AD single sign-on with Onit, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure Onit Single Sign-On](#configure-onit-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Create Onit test user](#create-onit-test-user)** - to have a counterpart of Britta Simon in Onit that is linked to the Azure AD representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with Onit, perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **Onit** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, perform the following steps:

    ![Onit Domain and URLs single sign-on information](common/sp-identifier.png)

	a. In the **Sign on URL** text box, type a URL using the following pattern:
    `https://<sub-domain>.onit.com`

    b. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:
    `https://<sub-domain>.onit.com`

	> [!NOTE]
	> These values are not real. Update these values with the actual Sign on URL and Identifier. Contact [Onit Client support team](https://www.onit.com/support) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

5. Onit application expects the SAML assertions in a specific format, which requires you to add custom attribute mappings to your SAML token attributes configuration. The following screenshot shows the list of default attributes. Click **Edit** icon to open **User Attributes** dialog.

	![image](common/edit-attribute.png)

6. In addition to above, Onit application expects few more attributes to be passed back in SAML response. In the **User Claims** section on the **User Attributes** dialog, perform the following steps to add SAML token attribute as shown in the below table:

	| Name | Source Attribute|
	| ---------------| --------------- |
	| email | user.mail |

	a. Click **Add new claim** to open the **Manage user claims** dialog.

	![image](common/new-save-attribute.png)

	![image](common/new-attribute-details.png)

	b. In the **Name** textbox, type the attribute name shown for that row.

	c. Leave the **Namespace** blank.

	d. Select Source as **Attribute**.

	e. From the **Source attribute** list, type the attribute value shown for that row.

	f. Click **Ok**

	g. Click **Save**.

7. In the **SAML Signing Certificate** section, click **Edit** button to open **SAML Signing Certificate** dialog.

	![Edit SAML Signing Certificate](common/edit-certificate.png)

8. In the **SAML Signing Certificate** section, copy the **Thumbprint** and save it on your computer.

    ![Copy Thumbprint value](common/copy-thumbprint.png)

9. On the **Set up Onit** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Azure AD Identifier

	c. Logout URL

### Configure Onit Single Sign-On

1. In a different web browser window, log into your Onit company site as an administrator.

2. In the menu on the top, click **Administration**.
   
    ![Administration](./media/onit-tutorial/IC791174.png "Administration")

3. Click **Edit Corporation**.
   
    ![Edit Corporation](./media/onit-tutorial/IC791175.png "Edit Corporation")
   
4. Click the **Security** tab.
    
    ![Edit Company Information](./media/onit-tutorial/IC791176.png "Edit Company Information")

5. On the **Security** tab, perform the following steps:

	![Single Sign-On](./media/onit-tutorial/IC791177.png "Single Sign-On")

	a. As **Authentication Strategy**, select **Single Sign On and Password**.
	
	b. In **Idp Target URL** textbox, paste the value of **Login URL**, which you have copied from Azure portal.

	c. In **Idp logout URL** textbox, paste the value of  **Logout URL**, which you have copied from Azure portal.

	d. In **Idp Cert Fingerprint (SHA1)** textbox, paste the  **Thumbprint** value of certificate, which you have copied from Azure portal.

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

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Onit.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **Onit**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **Onit**.

	![The Onit link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog click the **Assign** button.

### Create Onit test user

In order to enable Azure AD users to log into Onit, they must be provisioned into Onit. In the case of Onit, provisioning is a manual task.

**To configure user provisioning, perform the following steps:**

1. Sign on to your **Onit** company site as an administrator.

2. Click **Add User**.
   
    ![Administration](./media/onit-tutorial/IC791180.png "Administration")

3. On the **Add User** dialog page, perform the following steps:
   
    ![Add User](./media/onit-tutorial/IC791181.png "Add User")
   
    a. Type the **Name** and the **Email Address** of a valid Azure AD account you want to provision into the related textboxes.

    b. Click **Create**.    
   
    > [!NOTE]
    > The Azure Active Directory account holder receives an email and follows a link to confirm their account before it becomes active.

### Test single sign-on 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Onit tile in the Access Panel, you should be automatically signed in to the Onit for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)


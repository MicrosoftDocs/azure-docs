---
title: 'Tutorial: Azure Active Directory integration with MobileIron | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and MobileIron.
services: active-directory
documentationCenter: na
author: jeevansd
manager: daveba
ms.reviewer: barbkess

ms.assetid: 3e4bbd5b-290e-4951-971b-ec0c1c11aaa2
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 12/31/2018
ms.author: jeedes

ms.collection: M365-identity-device-management
---
# Tutorial: Azure Active Directory integration with MobileIron

In this tutorial, you learn how to integrate MobileIron with Azure Active Directory (Azure AD).
Integrating MobileIron with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to MobileIron.
* You can enable your users to be automatically signed-in to MobileIron (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with MobileIron, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get one-month trial [here](https://azure.microsoft.com/pricing/free-trial/)
* MobileIron single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* MobileIron supports **SP and IDP** initiated SSO

## Adding MobileIron from the gallery

To configure the integration of MobileIron into Azure AD, you need to add MobileIron from the gallery to your list of managed SaaS apps.

**To add MobileIron from the gallery, perform the following steps:**

1. In the **[Azure portal](https://portal.azure.com)**, on the left navigation panel, click **Azure Active Directory** icon.

	![The Azure Active Directory button](common/select-azuread.png)

2. Navigate to **Enterprise Applications** and then select the **All Applications** option.

	![The Enterprise applications blade](common/enterprise-applications.png)

3. To add new application, click **New application** button on the top of dialog.

	![The New application button](common/add-new-app.png)

4. In the search box, type **MobileIron**, select **MobileIron** from result panel then click **Add** button to add the application.

	 ![MobileIron in the results list](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with MobileIron based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in MobileIron needs to be established.

To configure and test Azure AD single sign-on with MobileIron, you need to complete the following building blocks:

1. **[Configure Azure AD Single Sign-On](#configure-azure-ad-single-sign-on)** - to enable your users to use this feature.
2. **[Configure MobileIron Single Sign-On](#configure-mobileiron-single-sign-on)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.
5. **[Create MobileIron test user](#create-mobileiron-test-user)** - to have a counterpart of Britta Simon in MobileIron that is linked to the Azure AD representation of user.
6. **[Test single sign-on](#test-single-sign-on)** - to verify whether the configuration works.

### Configure Azure AD single sign-on

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with MobileIron, perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **MobileIron** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, perform the following steps if you wish to configure the application in **IDP** initiated mode:

    ![MobileIron Domain and URLs single sign-on information](common/idp-intiated.png)

    a. In the **Identifier** text box, type a URL using the following pattern:
    `https://www.mobileiron.com/<key>`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://<host>.mobileiron.com/saml/SSO/alias/<key>`

    c. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    ![MobileIron Domain and URLs single sign-on information](common/metadata-upload-additional-signon.png)

	In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://<host>.mobileiron.com/user/login.html`

    > [!NOTE]
    > These values are not real. Update these values with the actual Identifier, Reply URL, and Sign-On URL. You will get the values of key and host from the ​administrative​ ​portal of MobileIron which is explained later in the tutorial.

5. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

### Configure MobileIron Single Sign-On

1. In a different web browser window, log in to your MobileIron company site as an administrator.

2. Go to **Admin** > **Identity** and select **AAD** option in the **Info on Cloud IDP Setup** field.

    ![Configure Single Sign-On Admin button](./media/mobileiron-tutorial/tutorial_mobileiron_admin.png)

3. Copy the values of **Key** and **Host** and paste them to complete the URLs in the **Basic SAML Configuration** section in Azure portal.

    ![Configure Single Sign-On Admin button](./media/mobileiron-tutorial/key.png)

4. In the **Export​​ ​metadata​ file ​from​ ​A​AD​ and import to MobileIron Cloud Field** click **Choose File** to upload the downloaded metadata from Azure portal. Click **Done** once uploaded.

    ![Configure Single Sign-On admin metadata button](./media/mobileiron-tutorial/tutorial_mobileiron_adminmetadata.png)

### Create an Azure AD test user 

The objective of this section is to create a test user in the Azure portal called Britta Simon.

1. In the Azure portal, in the left pane, select **Azure Active Directory**, select **Users**, and then select **All users**.

    ![The "Users and groups" and "All users" links](common/users.png)

2. Select **New user** at the top of the screen.

    ![New user Button](common/new-user.png)

3. In the User properties, perform the following steps.

    ![The User dialog box](common/user-properties.png)

    a. In the **Name** field enter **BrittaSimon**.
  
    b. In the **User name** field type **brittasimon\@yourcompanydomain.extension**  
    For example, BrittaSimon@contoso.com

    c. Select **Show password** check box, and then write down the value that's displayed in the Password box.

    d. Click **Create**.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to MobileIron.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **MobileIron**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, type and select **MobileIron**.

	![The MobileIron link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog click the **Assign** button.

### Create MobileIron test user

To enable Azure AD users to log in to MobileIron, they must be provisioned into MobileIron.  
In the case of MobileIron, provisioning is a manual task.

**To provision a user account, perform the following steps:**

1. Log in to your MobileIron company site as an administrator.

1. Go to **Users** and Click on **Add** > **Single User**.

    ![Configure Single Sign-On user button](./media/mobileiron-tutorial/tutorial_mobileiron_user.png)

1. On the **“Single User”** dialog page, perform the following steps:

    ![Configure Single Sign-On user add button](./media/mobileiron-tutorial/tutorial_mobileiron_useradd.png)

	a. In **E-mail Address** text box, enter the email of user like brittasimon@contoso.com.

	b. In **First Name** text box, enter the first name of user like Britta.

	c. In **Last Name** text box, enter the last name of user like Simon.

    d. Click **Done**.

### Test single sign-on 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the MobileIron tile in the Access Panel, you should be automatically signed in to the MobileIron for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)


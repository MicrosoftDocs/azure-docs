---
title: 'Tutorial: Azure Active Directory integration with Tableau Online | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Tableau Online.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 1d4b1149-ba3b-4f4e-8bce-9791316b730d
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: tutorial
ms.date: 01/31/2020
ms.author: jeedes

---
# Tutorial: Azure Active Directory single sign-on (SSO) integration with Tableau Online

In this tutorial, you'll learn how to integrate Tableau Online with Azure Active Directory (Azure AD). When you integrate Tableau Online with Azure AD, you can:

* Control in Azure AD who has access to Tableau Online.
* Enable your users to be automatically signed-in to Tableau Online with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Tableau Online single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Tableau Online supports **SP** initiated SSO
* Once you configure Tableau Online you can enforce Session control, which protect exfiltration and infiltration of your organization’s sensitive data in real-time. Session control extend from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/proxy-deployment-aad)

## Adding Tableau Online from the gallery

To configure the integration of Tableau Online into Azure AD, you need to add Tableau Online from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Tableau Online** in the search box.
1. Select **Tableau Online** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Tableau Online based on a test user called **Britta Simon**.
For single sign-on to work, a link relationship between an Azure AD user and the related user in Tableau Online needs to be established.

To configure and test Azure AD SSO with Tableau Online, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Tableau Online SSO](#configure-tableau-online-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Tableau Online test user](#create-tableau-online-test-user)** - to have a counterpart of B.Simon in Tableau Online that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

### Configure Azure AD SSO

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with Tableau Online, perform the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **Tableau Online** application integration page, select **Single sign-on**.

    ![Configure single sign-on link](common/select-sso.png)

2. On the **Select a Single sign-on method** dialog, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, click **Edit** icon to open **Basic SAML Configuration** dialog.

	![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, perform the following steps:

    ![Tableau Online Domain and URLs single sign-on information](common/sp-identifier.png)

	a. In the **Sign on URL** text box, type the URL:
    `https://sso.online.tableau.com/public/sp/login?alias=<entityid>`

    b. In the **Identifier (Entity ID)** text box, type the URL:
    `https://sso.online.tableau.com/public/sp/metadata?alias=<entityid>`

    > [!NOTE]
    > You will get the `<entityid>` value from the **Set up Tableau Online** section in this tutorial. The entity ID value will be **Azure AD identifier** value in **Set up Tableau Online** section.

5. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

6. On the **Set up Tableau Online** section, copy the appropriate URL(s) as per your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

	a. Login URL

	b. Azure AD Identifier

	c. Logout URL

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
    For example, BrittaSimon\@contoso.com

    c. Select **Show password** check box, and then write down the value that's displayed in the Password box.

    d. Click **Create**.

### Assign the Azure AD test user

In this section, you enable Britta Simon to use Azure single sign-on by granting access to Tableau Online.

1. In the Azure portal, select **Enterprise Applications**, select **All applications**, then select **Tableau Online**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the applications list, select **Tableau Online**.

	![The Tableau Online link in the Applications list](common/all-applications.png)

3. In the menu on the left, select **Users and groups**.

    ![The "Users and groups" link](common/users-groups-blade.png)

4. Click the **Add user** button, then select **Users and groups** in the **Add Assignment** dialog.

    ![The Add Assignment pane](common/add-assign-user.png)

5. In the **Users and groups** dialog select **Britta Simon** in the Users list, then click the **Select** button at the bottom of the screen.

6. If you are expecting any role value in the SAML assertion then in the **Select Role** dialog select the appropriate role for the user from the list, then click the **Select** button at the bottom of the screen.

7. In the **Add Assignment** dialog click the **Assign** button.

## Configure Tableau Online SSO

1. In a different browser window, sign-on to your Tableau Online application. Go to **Settings** and then **Authentication**.

    ![Configure Single Sign-On](./media/tableauonline-tutorial/tutorial_tableauonline_09.png)

2. To enable SAML, Under **Authentication types** section. Check **Enable an additional authentication method** and then check **SAML** checkbox.

    ![Configure Single Sign-On](./media/tableauonline-tutorial/tutorial_tableauonline_12.png)

3. Scroll down up to **Import metadata file into Tableau Online** section.  Click Browse and import the metadata file, which you have downloaded from Azure AD. Then, click **Apply**.

   ![Configure Single Sign-On](./media/tableauonline-tutorial/tutorial_tableauonline_13.png)

4. In the **Match assertions** section, insert the corresponding Identity Provider assertion name for **email address**, **first name**, and **last name**. To get this information from Azure AD: 
  
    a. In the Azure portal, go on the **Tableau Online** application integration page.

	b. In the **User Attributes & Claims** section, click on the edit icon.

   ![Configure Single Sign-On](./media/tableauonline-tutorial/attributesection.png)

	c. Copy the namespace value for these attributes: givenname, email and surname by using the following steps:

   ![Azure AD Single Sign-On](./media/tableauonline-tutorial/tutorial_tableauonline_10.png)

    d. Click **user.givenname** value

    e. Copy the value from the **Namespace** textbox.

    ![Configure Single Sign-On](./media/tableauonline-tutorial/attributesection2.png)

    f. To copy the namespace values for the email and surname repeat the above steps.

    g. Switch to the Tableau Online application, then set the **User Attributes & Claims** section as follows:

    * Email: **mail** or **userprincipalname**

    * First name: **givenname**

    * Last name: **surname**

    ![Configure Single Sign-On](./media/tableauonline-tutorial/tutorial_tableauonline_14.png)

### Create Tableau Online test user

In this section, you create a user called Britta Simon in Tableau Online.

1. On **Tableau Online**, click **Settings** and then **Authentication** section. Scroll down to **Manage Users** section. Click **Add Users** and then click **Enter Email Addresses**.
  
    ![Creating an Azure AD test user](./media/tableauonline-tutorial/tutorial_tableauonline_15.png)

2. Select **Add users for (SAML) authentication**. In the **Enter email addresses** textbox add britta.simon\@contoso.com
  
    ![Creating an Azure AD test user](./media/tableauonline-tutorial/tutorial_tableauonline_11.png)

3. Click **Add Users**.

### Test SSO

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Tableau Online tile in the Access Panel, you should be automatically signed in to the Tableau Online for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [What is session control in Microsoft Cloud App Security?](https://docs.microsoft.com/cloud-app-security/proxy-intro-aad)
---
title: 'Tutorial: Azure Active Directory integration with ITRP | Microsoft Docs'
description: In this tutorial, you'll learn how to configure single sign-on between Azure Active Directory and ITRP.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: e09716a3-4200-4853-9414-2390e6c10d98
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 03/25/2019
ms.author: jeedes

---
# Tutorial: Azure Active Directory integration with ITRP

In this tutorial, you'll learn how to integrate ITRP with Azure Active Directory (Azure AD).
This integration provides these benefits:

* You can use Azure AD to control who has access to ITRP.
* You can enable your users to be automatically signed in to ITRP (single sign-on) with their Azure AD accounts.
* You can manage your accounts in one central location: the Azure portal.

To learn more about SaaS app integration with Azure AD, see [Single sign-on to applications in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with ITRP, you need to have:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get a [free account](https://azure.microsoft.com/free/).
* An ITRP subscription that has single sign-on enabled.

## Scenario description

In this tutorial, you'll configure and test Azure AD single sign-on in a test environment.

* ITRP supports SP-initiated SSO.

## Add ITRP from the gallery

To set up the integration of ITRP into Azure AD, you need to add ITRP from the gallery to your list of managed SaaS apps.

1. In the [Azure portal](https://portal.azure.com), in the left pane, select **Azure Active Directory**:

	![Select Azure Active Directory](common/select-azuread.png)

2. Go to **Enterprise applications** > **All applications**:

	![Enterprise applications blade](common/enterprise-applications.png)

3. To add an application, select **New application** at the top of the window:

	![Select New application](common/add-new-app.png)

4. In the search box, enter **ITRP**. Select **ITRP** in the search results and then select **Add**.

	 ![Search results](common/search-new-app.png)

## Configure and test Azure AD single sign-on

In this section, you'll configure and test Azure AD single sign-on with ITRP by using a test user named Britta Simon.
To enable single sign-on, you need to establish a relationship between an Azure AD user and the corresponding user in ITRP.

To configure and test Azure AD single sign-on with ITRP, you need to complete these steps:

1. **[Configure Azure AD single sign-on](#configure-azure-ad-single-sign-on)** to enable the feature for your users.
2. **[Configure ITRP single sign-on](#configure-itrp-single-sign-on)** on the application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** to test Azure AD single sign-on.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** to enable Azure AD single sign-on for the user.
5. **[Create an ITRP test user](#create-an-itrp-test-user)** that's linked to the Azure AD representation of the user.
6. **[Test single sign-on](#test-single-sign-on)** to verify that the configuration works.

### Configure Azure AD single sign-on

In this section, you'll enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with ITRP, take these steps:

1. In the [Azure portal](https://portal.azure.com/), on the ITRP application integration page, select **Single sign-on**:

    ![Select single sign-on](common/select-sso.png)

2. In the **Select a single sign-on method** dialog box, select **SAML/WS-Fed** mode to enable single sign-on:

    ![Select a single sign-on method](common/select-saml-option.png)

3. On the **Set up Single Sign-On with SAML** page, select the **Edit** icon to open the **Basic SAML Configuration** dialog box:

	![Edit icon](common/edit-urls.png)

4. In the **Basic SAML Configuration** dialog box, take the following steps.

    ![Basic SAML Configuration dialog box](common/sp-identifier.png)

	1. In the **Sign on URL** box, enter a URL in this pattern:
    
       `https://<tenant-name>.itrp.com`

    1. In the **Identifier (Entity ID)** box, enter a URL in this pattern:

       `https://<tenant-name>.itrp.com`

	> [!NOTE]
	> These values are placeholders. You need to use the actual sign-on URL and identifier. Contact the [ITRP support team](https://www.4me.com/support/) to get the values. You can also refer to the patterns shown in the **Basic SAML Configuration** dialog box in the Azure portal.

5. In the **SAML Signing Certificate** section, select the **Edit** icon to open the **SAML Signing Certificate** dialog box:

	![Edit icon](common/edit-certificate.png)

6. In the **SAML Signing Certificate** dialog box, copy the **Thumbprint** value and save it:

    ![Copy the Thumbprint value](common/copy-thumbprint.png)

7. In the **Set up ITRP** section, copy the appropriate URLs, based on your requirements:

	![Copy the configuration URLs](common/copy-configuration-urls.png)

	1. **Login URL**.

	1. **Azure AD Identifier**.

	1. **Logout URL**.

### Configure ITRP single sign-on

1. In a new web browser window, sign in to your ITRP company site as an admin.

1. At the top of the window, select the **Settings** icon:

    ![Settings icon](./media/itrp-tutorial/ic775570.png "Settings icon")

1. In the left pane, select **Single Sign-On**:

    ![Select Single Sign-On](./media/itrp-tutorial/ic775571.png "Select Single Sign-On")

1. In the **Single Sign-On** configuration section, take the following steps.

    ![Single Sign-On section](./media/itrp-tutorial/ic775572.png "Single Sign-On section")

    ![Single Sign-On section](./media/itrp-tutorial/ic775573.png "Single Sign-On section")

	1. Select **Enabled**.

	1. In the **Remote logout URL** box, paste the **Logout URL** value that you copied from the Azure portal.

	1. In the **SAML SSO URL** box, paste the **Login URL** value that you copied from the Azure portal.

	1. In the **Certificate fingerprint** box, paste the **Thumbprint** value of the certificate, which you copied from the Azure portal.

    1. Select **Save**.

### Create an Azure AD test user

In this section, you'll create a test user named Britta Simon in the Azure portal.

1. In the Azure portal, select **Azure Active Directory** in the left pane, select **Users**, and then select **All users**:

    ![Select All users](common/users.png)

2. Select **New user** at the top of the screen:

    ![Select New user](common/new-user.png)

3. In the **User** dialog box, take the following steps.

    ![User dialog box](common/user-properties.png)

    1. In the **Name** box, enter **BrittaSimon**.
  
    1. In the **User name** box, enter **BrittaSimon@\<yourcompanydomain>.\<extension>**. (For example, BrittaSimon@contoso.com.)

    1. Select **Show Password**, and then write down the value that's in the **Password** box.

    1. Select **Create**.

### Assign the Azure AD test user

In this section, you'll enable Britta Simon to use Azure single sign-on by granting her access to ITRP.

1. In the Azure portal, select **Enterprise applications**, select **All applications**, and then select **ITRP**.

	![Enterprise applications blade](common/enterprise-applications.png)

2. In the list of applications, select **ITRP**.

	![List of applications](common/all-applications.png)

3. In the left pane, select **Users and groups**:

    ![Select Users and groups](common/users-groups-blade.png)

4. Select **Add user**, and then select **Users and groups** in the **Add Assignment** dialog box.

    ![Select Add user](common/add-assign-user.png)

5. In the **Users and groups** dialog box, select **Britta Simon** in the users list, and then click the **Select** button at the bottom of the window.

6. If you expect a role value in the SAML assertion, in the **Select Role** dialog box, select the appropriate role for the user from the list. Click the **Select** button at the bottom of the window.

7. In the **Add Assignment** dialog box, select **Assign**.

### Create an ITRP test user

To enable Azure AD users to sign in to ITRP, you need to add them to ITRP. You need to add them manually.

To create a user account, take these steps:

1. Sign in to your ITRP tenant.

1. At the top of the window, select the **Records** icon:

    ![Records icon](./media/itrp-tutorial/ic775575.png "Records icon")

1. In the menu, select **People**:

    ![Select People](./media/itrp-tutorial/ic775587.png "Select People")

1. Select the plus sign (**+**) to add a new person:

    ![Select the plus sign](./media/itrp-tutorial/ic775576.png "Select the plus sign")

1. In the **Add New Person** dialog box, take the following steps.

    ![Add New Person dialog box](./media/itrp-tutorial/ic775577.png "Add New Person dialog box")

    1. Enter the name and email address of a valid Azure AD account that you want to add.

    1. Select **Save**.

> [!NOTE]
> You can use any user account creation tool or API provided by ITRP to provision Azure AD user accounts.

### Test single sign-on

Now you need to test your Azure AD single sign-on configuration by using the Access Panel.

When you select the ITRP tile in the Access Panel, you should be automatically signed in to the ITRP instance for which you set up SSO. For more information about the Access Panel, see [Access and use apps on the My Apps portal](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [Tutorials for integrating SaaS applications with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

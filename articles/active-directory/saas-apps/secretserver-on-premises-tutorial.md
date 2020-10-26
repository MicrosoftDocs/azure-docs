---
title: 'Tutorial: Azure Active Directory integration with Secret Server (On-Premises) | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Secret Server (On-Premises).
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 08/07/2019
ms.author: jeedes
---

# Tutorial: Integrate Secret Server (On-Premises) with Azure Active Directory

In this tutorial, you'll learn how to integrate Secret Server (On-Premises) with Azure Active Directory (Azure AD). When you integrate Secret Server (On-Premises) with Azure AD, you can:

* Control in Azure AD who has access to Secret Server (On-Premises).
* Enable your users to be automatically signed-in to Secret Server (On-Premises) with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Secret Server (On-Premises) single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Secret Server (On-Premises) supports **SP and IDP** initiated SSO

## Adding Secret Server (On-Premises) from the gallery

To configure the integration of Secret Server (On-Premises) into Azure AD, you need to add Secret Server (On-Premises) from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Secret Server (On-Premises)** in the search box.
1. Select **Secret Server (On-Premises)** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.


## Configure and test Azure AD single sign-on

Configure and test Azure AD SSO with Secret Server (On-Premises) using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Secret Server (On-Premises).

To configure and test Azure AD SSO with Secret Server (On-Premises), complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
2. **[Configure Secret Server (On-Premises) SSO](#configure-secret-server-on-premises-sso)** - to configure the Single Sign-On settings on application side.
3. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
4. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
5. **[Create Secret Server (On-Premises) test user](#create-secret-server-on-premises-test-user)** - to have a counterpart of B.Simon in Secret Server (On-Premises) that is linked to the Azure AD representation of user.
6. **[Test SSO](#test-sso)** - to verify whether the configuration works.

### Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **Secret Server (On-Premises)** application integration page, find the **Manage** section and select **Single sign-on**.
1. On the **Select a Single sign-on method** page, select **SAML**.
1. On the **Set up Single Sign-On with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, enter the values for the following fields:

    a. In the **Identifier** text box, enter the user chosen value as an example:
    `https://secretserveronpremises.azure`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://<SecretServerURL>/SAML/AssertionConsumerService.aspx`

    > [!NOTE]
	> The Entity ID shown above is an example only and you are free to choose any unique value that identifies your Secret Server instance in Azure AD. You need to send this Entity ID to [Secret Server (On-Premises) Client support team](https://thycotic.force.com/support/s/) and they configure it on their side. For more details, please read [this article](https://thycotic.force.com/support/s/article/Configuring-SAML-in-Secret-Server).

1. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://<SecretServerURL>/login.aspx`

	> [!NOTE]
	> These values are not real. Update these values with the actual Reply URL and Sign-On URL. Contact [Secret Server (On-Premises) Client support team](https://thycotic.force.com/support/s/) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. On the **Set up Single Sign-On with SAML** page, click the **Edit** icon to open **SAML Signing Certificate** dialog.

    ![Signing options](./media/secretserver-on-premises-tutorial/edit-saml-signon.png)

1. Select **Signing Option** as **Sign SAML response and assertion**.

    ![Signing options](./media/secretserver-on-premises-tutorial/signing-option.png)

1. On the **Set up Secret Server (On-Premises)** section, copy the appropriate URL(s) based on your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

### Configure Secret Server (On-Premises) SSO

To configure single sign-on on the **Secret Server (On-Premises)** side, you need to send the downloaded **Certificate (Base64)** and appropriate copied URLs from the Azure portal to the [Secret Server (On-Premises) support team](https://thycotic.force.com/support/s/). They set this setting to have the SAML SSO connection set properly on both sides.

### Create an Azure AD test user

In this section, you'll create a test user in the Azure portal called B.Simon.

1. From the left pane in the Azure portal, select **Azure Active Directory**, select **Users**, and then select **All users**.
1. Select **New user** at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Name** field, enter `B.Simon`.  
   1. In the **User name** field, enter the username@companydomain.extension. For example, `B.Simon@contoso.com`.
   1. Select the **Show password** check box, and then write down the value that's displayed in the **Password** box.
   1. Click **Create**.

### Assign the Azure AD test user

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Secret Server (On-Premises).

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Secret Server (On-Premises)**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

### Create Secret Server (On-Premises) test user

In this section, you create a user called Britta Simon in Secret Server (On-Premises). Work with [Secret Server (On-Premises) support team](https://thycotic.force.com/support/s/) to add the users in the Secret Server (On-Premises) platform. Users must be created and activated before you use single sign-on.

### Test SSO

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Secret Server (On-Premises) tile in the Access Panel, you should be automatically signed in to the Secret Server (On-Premises) for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [ List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory ](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory? ](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)
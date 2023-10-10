---
title: 'Tutorial: Microsoft Entra integration with Uberflip'
description: Learn how to configure single sign-on between Microsoft Entra ID and Uberflip.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 11/21/2022
ms.author: jeedes
---
# Tutorial: Microsoft Entra integration with Uberflip

In this tutorial, you learn how to integrate Uberflip with Microsoft Entra ID.

Integrating Uberflip with Microsoft Entra ID provides you with the following benefits:

* You can control in Microsoft Entra ID who has access to Uberflip.
* You can enable your users to be automatically signed in to Uberflip (single sign-on) with their Microsoft Entra accounts.
* You can manage your accounts in one central location: the Azure portal.

For details about software as a service (SaaS) app integration with Microsoft Entra ID, see [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Microsoft Entra integration with Uberflip, you need the following items:

* A Microsoft Entra subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.
* An Uberflip subscription with single sign-on enabled.

## Scenario description

In this tutorial, you configure and test Microsoft Entra single sign-on in a test environment.

Uberflip supports the following features:

* SP-initiated and IDP-initiated single sign-on (SSO).
* Just-in-time user provisioning.

## Add Uberflip from the Azure Marketplace

To configure the integration of Uberflip into Microsoft Entra ID, you need to add Uberflip from the Azure Marketplace to your list of managed SaaS apps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.

   ![The New application option](common/add-new-app.png)

1. In the search box, enter **Uberflip**. In the search results, select **Uberflip**, and then select **Add** to add the application.

   ![Uberflip in the results list](common/search-new-app.png)

<a name='configure-and-test-azure-ad-single-sign-on'></a>

## Configure and test Microsoft Entra single sign-on

In this section, you configure and test Microsoft Entra single sign-on with Uberflip based on a test user named **B Simon**. For single sign-on to work, you need to establish a link between a Microsoft Entra user and a related user in Uberflip.

To configure and test Microsoft Entra single sign-on with Uberflip, you need to complete the following building blocks:

1. **[Configure Microsoft Entra single sign-on](#configure-azure-ad-single-sign-on)** to enable your users to use this feature.
1. **[Configure Uberflip single sign-on](#configure-uberflip-single-sign-on)** to configure the single sign-on settings on the application side.
1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** to test Microsoft Entra single sign-on with B. Simon.
1. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** to enable B. Simon to use Microsoft Entra single sign-on.
1. **[Create an Uberflip test user](#create-an-uberflip-test-user)** so that there's a user named B. Simon in Uberflip who's linked to the Microsoft Entra user named B. Simon.
1. **[Test single sign-on](#test-single-sign-on)** to verify whether the configuration works.

<a name='configure-azure-ad-single-sign-on'></a>

### Configure Microsoft Entra single sign-on

In this section, you enable Microsoft Entra single sign-on.

To configure Microsoft Entra single sign-on with Uberflip, take the following steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Uberflip** application integration page, select **Single sign-on**.

    ![Configure single sign-on option](common/select-sso.png)

1. In the **Select a single sign-on method** pane, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

1. On the **Set up Single Sign-On with SAML** pane, select **Edit** (the pencil icon) to open the **Basic SAML Configuration** pane.

   ![Screenshot shows the Basic SAML Configuration, where you can enter a Reply U R L.](common/edit-urls.png)

1. On the **Basic SAML Configuration** pane, do one of the following steps, depending on which SSO mode you want to configure:

   * To configure the application in IDP-initiated SSO mode, in the **Reply URL (Assertion Consumer Service URL)** box, enter a URL by using the following pattern:

     `https://app.uberflip.com/sso/saml2/<IDPID>/<ACCOUNTID>`

     ![Uberflip domain and URLs single sign-on information](common/both-replyurl.png)

     > [!NOTE]
     > This value isn't real. Update this value with the actual reply URL. To get the actual value, contact the [Uberflip support team](mailto:support@uberflip.com). You can also refer to the patterns shown in the **Basic SAML Configuration** pane.

   * To configure the application in SP-initiated SSO mode, select **Set additional URLs**, and in the **Sign-on URL** box, enter this URL:

     `https://app.uberflip.com/users/login`

     ![Screenshot shows Set additional U R Ls where you can enter a Sign on U R L.](common/both-signonurl.png)

1. On the **Set up Single Sign-On with SAML** pane, in the **SAML Signing Certificate** section, select **Download** to download the **Federation Metadata XML** from the given options and save it on your computer.

   ![The Federation Metadata XML download option](common/metadataxml.png)

1. In the **Set up Uberflip** pane, copy the URL or URLs that you need:

   * **Login URL**
   * **Microsoft Entra Identifier**
   * **Logout URL**

   ![Copy configuration URLs](common/copy-configuration-urls.png)

### Configure Uberflip single sign-on

To configure single sign-on on the Uberflip side, you need to send the downloaded Federation Metadata XML and the appropriate copied URLs to the [Uberflip support team](mailto:support@uberflip.com). The Uberflip team will make sure the SAML SSO connection is set properly on both sides.

<a name='create-an-azure-ad-test-user'></a>

### Create a Microsoft Entra test user

In this section, you create a test user named B. Simon.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [User Administrator](../roles/permissions-reference.md#user-administrator).
1. Browse to **Identity** > **Users** > **All users**.
1. Select **New user** > **Create new user**, at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Display name** field, enter `B.Simon`.  
   1. In the **User principal name** field, enter the username@companydomain.extension. For example, `B.Simon@contoso.com`.
   1. Select the **Show password** check box, and then write down the value that's displayed in the **Password** box.
   1. Select **Review + create**.
1. Select **Create**.

<a name='assign-the-azure-ad-test-user'></a>

### Assign the Microsoft Entra test user

In this section, you enable B. Simon to use Azure single sign-on by granting their access to Uberflip.

1. Browse to **Identity** > **Applications** > **Enterprise applications** > **Uberflip**.

    ![Enterprise applications pane](common/enterprise-applications.png)

1. In the applications list, select **Uberflip**.

    ![Uberflip in the applications list](common/all-applications.png)

1. In the left pane, under **MANAGE**, select **Users and groups**.

    ![The "Users and groups" option](common/users-groups-blade.png)

1. Select **+ Add user**, and then select **Users and groups** in the **Add Assignment** pane.

    ![The Add Assignment pane](common/add-assign-user.png)

1. In the **Users and groups** pane, select **B Simon** in the **Users** list, and then choose **Select** at the bottom of the pane.

1. If you're expecting a role value in the SAML assertion, then in the **Select Role** pane, select the appropriate role for the user from the list. At the bottom of the pane, choose **Select**.

1. In the **Add Assignment** pane, select **Assign**.

### Create an Uberflip test user

A user named B. Simon is now created in Uberflip. You don't have to do anything to create this user. Uberflip supports just-in-time user provisioning, which is enabled by default. If a user named B. Simon doesn't already exist in Uberflip, a new one is created after authentication.

> [!NOTE]
> If you need to create a user manually, contact the [Uberflip support team](mailto:support@uberflip.com).

### Test single sign-on

In this section, you test your Microsoft Entra single sign-on configuration by using the My Apps portal.

When you select **Uberflip** in the My Apps portal, you should be automatically signed in to the Uberflip subscription for which you set up single sign-on. For more information about the My Apps portal, see [Access and use apps on the My Apps portal](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Additional resources

* [List of tutorials for integrating SaaS applications with Microsoft Entra ID](./tutorial-list.md)

* [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

* [What is Conditional Access in Microsoft Entra ID?](../conditional-access/overview.md)

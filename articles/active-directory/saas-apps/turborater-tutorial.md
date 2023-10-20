---
title: 'Tutorial: Microsoft Entra integration with TurboRater'
description: Learn how to configure single sign-on between Microsoft Entra ID and TurboRater.
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
# Tutorial: Microsoft Entra integration with TurboRater

In this tutorial, you learn how to integrate TurboRater with Microsoft Entra ID.

Integrating TurboRater with Microsoft Entra ID provides you with the following benefits:

* You can control in Microsoft Entra ID who has access to TurboRater.
* You can enable your users to be automatically signed in to TurboRater (single sign-on) with their Microsoft Entra accounts.
* You can manage your accounts in one central location: the Azure portal.

For details about software as a service (SaaS) app integration with Microsoft Entra ID, see [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To configure Microsoft Entra integration with TurboRater, you need the following items:

* A Microsoft Entra subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.
* A TurboRater subscription with single sign-on enabled.

## Scenario description

In this tutorial, you configure and test Microsoft Entra single sign-on in a test environment.

TurboRater supports IDP-initiated single sign-on (SSO).

## Add TurboRater from the Azure Marketplace

To configure the integration of TurboRater into Microsoft Entra ID, you need to add TurboRater from the Azure Marketplace to your list of managed SaaS apps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. In the **Add from the gallery** section, type **TurboRater** in the search box.
1. Select **TurboRater** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

<a name='configure-and-test-azure-ad-single-sign-on'></a>

## Configure and test Microsoft Entra single sign-on

In this section, you configure and test Microsoft Entra single sign-on with TurboRater based on a test user named  **B Simon**. For single sign-on to work, you must establish a link between a Microsoft Entra user and the related user in TurboRater.

To configure and test Microsoft Entra single sign-on with TurboRater, you need to complete the following building blocks:

1. **[Configure Microsoft Entra single sign-on](#configure-azure-ad-single-sign-on)** to enable your users to use this feature.
1. **[Configure TurboRater single sign-on](#configure-turborater-single-sign-on)** to configure the single sign-on settings on the application side.
1. **[Create a Microsoft Entra test user](#create-an-azure-ad-test-user)** to test Microsoft Entra single sign-on with B. Simon.
1. **[Assign the Microsoft Entra test user](#assign-the-azure-ad-test-user)** to enable B. Simon to use Microsoft Entra single sign-on.
1. **[Create a TurboRater test user](#create-a-turborater-test-user)** so that there's a user named B. Simon in TurboRater who's linked to the Microsoft Entra user named B. Simon.
1. **[Test single sign-on](#test-single-sign-on)** to verify whether the configuration works.

<a name='configure-azure-ad-single-sign-on'></a>

### Configure Microsoft Entra single sign-on

In this section, you enable Microsoft Entra single sign-on.

To configure Microsoft Entra single sign-on with TurboRater, take the following steps:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **TurboRater** application integration page, select **Single sign-on**.

    ![Configure single sign-on option](common/select-sso.png)

1. On the **Select a single sign-on method** pane, select **SAML/WS-Fed** mode to enable single sign-on.

    ![Single sign-on select mode](common/select-saml-option.png)

1. On the **Set up Single Sign-On with SAML** page, select **Edit** (the pencil icon) to open the **Basic SAML Configuration** pane.

    ![Edit Basic SAML Configuration](common/edit-urls.png)

1. In the **Basic SAML Configuration** pane, do the following steps:

    ![TurboRater domain and URLs single sign-on information](common/idp-intiated.png)

    1. In the **Identifier (Entity ID)** box, enter a URL:

       `https://www.itcdataservices.com`

    1. In the **Reply URL (Assertion Consumer Service URL)** box, enter a URL by using the following pattern:

       | Environment | URL |
       | ---------------| --------------- |
       | Test  | `https://ratingqa.itcdataservices.com/webservices/imp/saml/login` |
       | Live  | `https://www.itcratingservices.com/webservices/imp/saml/login` |

    > [!NOTE]
    > These values aren't real. Update these values with the actual identifier and reply URL. To get these values, contact the [TurboRater support team](https://www.getitc.com/support). You can also refer to the patterns shown in the **Basic SAML Configuration** pane.

1. On the **Set up Single Sign-On with SAML** pane, in the **SAML Signing Certificate** section, select **Download** to download the **Federation Metadata XML** from the given options and save it on your computer.

    ![The Federation Metadata XML download option](common/metadataxml.png)

1. In the **Set up TurboRater** section, copy the URL or URLs that you need:

   * **Login URL**
   * **Microsoft Entra Identifier**
   * **Logout URL**

    ![Copy configuration URLs](common/copy-configuration-urls.png)

### Configure TurboRater single sign-on

To configure single sign-on on the TurboRater side, you need to send the downloaded Federation Metadata XML and the appropriate copied URLs to the [TurboRater support team](https://www.getitc.com/support). The TurboRater team will make sure the SAML SSO connection is set properly on both sides.

<a name='create-an-azure-ad-test-user'></a>

### Create a Microsoft Entra test user

In this section, you create a test user named Britta Simon.

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

In this section, you enable B. Simon to use Azure single sign-on by granting their access to TurboRater.

1. Browse to **Identity** > **Applications** > **Enterprise applications** > **TurboRater**.

    ![Enterprise applications pane](common/enterprise-applications.png)

1. In the applications list, select **TurboRater**.

    ![TurboRater in the applications list](common/all-applications.png)

1. In the left pane, under **MANAGE**, select **Users and groups**.

    ![The "Users and groups" option](common/users-groups-blade.png)

1. Select **+ Add user**, and then select **Users and groups** in the **Add Assignment** pane.

    ![The Add Assignment pane](common/add-assign-user.png)

1. In the **Users and groups** pane, select **B. Simon** in the **Users** list, and then choose **Select** at the bottom of the pane.

1. If you're expecting a role value in the SAML assertion, then in the **Select Role** pane, select the appropriate role for the user from the list. At the bottom of the pane, choose **Select**.

1. In the **Add Assignment** pane, select **Assign**.

### Create a TurboRater test user

In this section, you create a user called B. Simon in TurboRater. Work with the [TurboRater support team](https://www.getitc.com/support) to add B. Simon as a user in TurboRater. Users must be created and activated before you use single sign-on.

### Test single sign-on

In this section, you test your Microsoft Entra single sign-on configuration by using the My Apps portal.

When you select **TurboRater** in the My Apps portal, you should be automatically signed in to the TurboRater subscription for which you set up single sign-on. For more information about the My Apps portal, see [Access and use apps on the My Apps portal](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Additional resources

* [List of tutorials for integrating SaaS applications with Microsoft Entra ID](./tutorial-list.md)

* [What is application access and single sign-on with Microsoft Entra ID?](../manage-apps/what-is-single-sign-on.md)

* [What is Conditional Access in Microsoft Entra ID?](../conditional-access/overview.md)

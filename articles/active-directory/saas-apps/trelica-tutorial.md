---
title: 'Tutorial: Azure AD SSO integration with Trelica'
description: Learn how to configure single sign-on between Azure Active Directory and Trelica.
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

# Tutorial: Azure AD SSO integration with Trelica

In this tutorial, you learn how to integrate Trelica with Azure Active Directory (Azure AD). When you integrate Trelica with Azure AD, you can:

* Control in Azure AD who has access to Trelica.
* Enable your users to be automatically signed in to Trelica with their Azure AD accounts.
* Manage your accounts in one central location: the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* A Trelica subscription with single sign-on (SSO) enabled.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Trelica supports IDP-initiated SSO.
* Trelica supports just-in-time user provisioning.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Add Trelica from the gallery

To configure the integration of Trelica into Azure AD, you need to add Trelica from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal by using either a work or school account, or a personal Microsoft account.
1. On the leftmost navigation pane, select the **Azure Active Directory** service.
1. Go to **Enterprise Applications**, and then select **All Applications**.
1. To add a new application, select **New application**.
1. In the **Add from the gallery** section, enter **Trelica** in the search box.
1. Select **Trelica** from the search results, and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for Trelica

Configure and test Azure AD SSO with Trelica by using a test user called **B.Simon**. For SSO to work, you must establish a linked relationship between an Azure AD user and the related user in Trelica.

To configure and test Azure AD SSO with Trelica, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Trelica SSO](#configure-trelica-sso)** to configure the single sign-on settings on the application side.
    1. **[Create a Trelica test user](#create-a-trelica-test-user)** to have a counterpart of B.Simon in Trelica. This counterpart is linked to the Azure AD representation of the user.
1. **[Test SSO](#test-sso)** to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal:

1. In the Azure portal, on the **Trelica** application integration page, go to the **Manage** section. Select **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up Single Sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![The Set up Single Sign-On with SAML page, with the pencil icon for Basic SAML Configuration highlighted](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, perform the following steps:

    1. In the **Identifier** box, type the URL:
    `https://app.trelica.com`.

    1. In the **Reply URL** box, type a URL using the following pattern:
    `https://app.trelica.com/Id/Saml2/<CUSTOM_IDENTIFIER>/Acs`.

	> [!NOTE]
	> The Reply URL value is not real. Update this value with the actual Reply URL (also known as the ACS).
    > You can find this by logging in to Trelica and going to the [SAML identity providers configuration page](https://app.trelica.com/Admin/Profile/SAML) (Admin > Account > SAML). Click on the copy button next to the **Assertion Consumer Service (ACS) URL** to put this onto the clipboard, ready for pasting into the **Reply URL** text box in Azure AD.
    > Read the [Trelica help documentation](https://docs.trelica.com/admin/saml/azure-ad) or contact the [Trelica Client support team](mailto:support@trelica.com) if you have questions.

1. On the **Set up single sign-on with SAML** page, In the **SAML Signing Certificate** section, click the copy button to copy **App Federation Metadata Url** and save it on your computer.

    ![The SAML Signing Certificate section, with the copy button highlighted next to App Federation Metadata URL](common/copy-metadataurl.png)

### Create an Azure AD test user

In this section, you create a test user called B.Simon in the Azure portal.

1. On the leftmost pane in the Azure portal, select **Azure Active Directory** > **Users** > **All users**.
1. At the top of the screen, select **New user**.
1. In the **User** properties, follow these steps:
   1. In the **Name** field, enter **B.Simon**.
   1. In the **User name** field, enter **B.Simon@**_companydomain_**.**_extension_. For example, B.Simon@contoso.com.
   1. Select the **Show password** check box, and then write down the value that's shown in the **Password** box.
   1. Select **Create**.

### Assign the Azure AD test user

In this section, you enable B.Simon to use Azure single sign-on by granting access to Trelica.

1. In the Azure portal, select **Enterprise Applications** > **All applications**.
1. In the applications list, select **Trelica**.
1. In the app's overview page, go to the **Manage** section, and select **Users and groups**.
1. Select **Add user**. In the **Add Assignment** dialog box, select **Users and groups**.
1. In the **Users and groups** dialog box, select **B.Simon** from the users list. Then choose the **Select** button at the bottom of the screen.
1. If you expect any role value in the SAML assertion, in the **Select Role** dialog box, select the appropriate role for the user from the list. Then choose the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog box, select **Assign**.

## Configure Trelica SSO

To configure single sign-on on the **Trelica** side, go to the [SAML identity providers configuration page](https://app.trelica.com/Admin/Profile/SAML) (Admin > Account > SAML). Click on the **New** button. Enter **Azure AD** as the Name and choose **Metadata from url** for the Metadata type. Paste the **App Federation Metadata Url** you took from Azure AD into the **Metadata url** field in Trelica.

Read the [Trelica help documentation](https://docs.trelica.com/admin/saml/azure-ad) or contact the [Trelica Client support team](mailto:support@trelica.com) if you have questions.

### Create a Trelica test user

Trelica supports just-in-time user provisioning, which is enabled by default. There's no action for you to take in this section. If a user doesn't already exist in Trelica, a new one is created after authentication.

## Test SSO

In this section, you test your Azure AD single sign-on configuration with following options.

* Click on Test this application in Azure portal and you should be automatically signed in to the Trelica for which you set up the SSO.

* You can use Microsoft My Apps. When you click the Trelica tile in the My Apps, you should be automatically signed in to the Trelica for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure Trelica you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).
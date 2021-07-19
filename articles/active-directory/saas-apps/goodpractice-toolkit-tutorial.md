---
title: 'Tutorial: Azure Active Directory integration with Mind Tools Toolkit | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Mind Tools Toolkit.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 05/28/2021
ms.author: jeedes
---
# Tutorial: Azure Active Directory integration with Mind Tools Toolkit

In this tutorial, you'll learn how to integrate Mind Tools Toolkit with Azure Active Directory (Azure AD). When you integrate Mind Tools Toolkit with Azure AD, you can:

* Control in Azure AD who has access to Mind Tools Toolkit.
* Enable your users to be automatically signed in to Mind Tools Toolkit (single sign-on) with their Azure AD accounts.
* Manage your accounts in one central location: the Azure portal.

## Prerequisites

To configure Azure AD integration with Mind Tools Toolkit, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* A Mind Tools Toolkit subscription with single sign-on (SSO) enabled.

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Mind Tools Toolkit supports SP-initiated SSO.
* Mind Tools Toolkit supports just-in-time user provisioning.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Add Mind Tools Toolkit from the gallery

To configure the integration of Mind Tools Toolkit into Azure AD, you need to add Mind Tools Toolkit from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal by using either a work or school account, or a personal Microsoft account.
1. On the leftmost navigation pane, select the **Azure Active Directory** service.
1. Go to **Enterprise Applications**, and then select **All Applications**.
1. To add a new application, select **New application**.
1. In the **Add from the gallery** section, enter **Mind Tools Toolkit** in the search box.
1. Select **Mind Tools Toolkit** from the search results, and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD SSO for Mind Tools Toolkit

Configure and test Azure AD SSO with Mind Tools Toolkit using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Mind Tools Toolkit.

To configure and test Azure AD SSO with Mind Tools Toolkit, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Mind Tools Toolkit SSO](#configure-mind-tools-toolkit-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Mind Tools Toolkit test user](#create-mind-tools-toolkit-test-user)** - to have a counterpart of B.Simon in Mind Tools Toolkit that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Mind Tools Toolkit** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. In the **Basic SAML Configuration** section, in the **Sign-on URL** box, enter a URL having the pattern `https://app.goodpractice.net/#/<subscriptionUrl>/s/<LOCATION_ID>`.

    > [!NOTE]
    > The **Sign-on URL** value isn't real. Update the value with the actual sign-on URL. Contact the [Mind Tools Toolkit Client support team](mailto:support@goodpractice.com) to get the value.

1. On the **Set-up Single Sign-On with SAML** page, go to the **SAML Signing Certificate** section. To the right of **Federation Metadata XML**, select **Download** to download the XML text and save it on your computer. The XML contents depend on the options you select.

    ![The SAML Signing Certificate section, with Download highlighted next to Federation Metadata XML](common/metadataxml.png)

1. In the **Set up Mind Tools Toolkit** section, copy whichever of the following URLs you need.

    ![The Set up Mind Tools Toolkit section, with the configuration URLs highlighted](common/copy-configuration-urls.png)

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Mind Tools Toolkit.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Mind Tools Toolkit**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Mind Tools Toolkit SSO

To configure single sign-on on the **Mind Tools Toolkit** side, send the downloaded **Federation Metadata XML** text and the previously copied URLs to the [Mind Tools Toolkit support team](mailto:support@goodpractice.com). They configure this setting to have the SAML SSO connection set properly on both sides.

### Create Mind Tools Toolkit test user

In this section, a user called B.Simon is created in Mind Tools Toolkit. Mind Tools Toolkit supports just-in-time user provisioning, which is enabled by default. There's no action item for you in this section. If a user doesn't already exist in Mind Tools Toolkit, a new one is created after authentication.

## Test SSO

In this section, you test your Azure AD single sign-on configuration with following options. 

* Click on **Test this application** in Azure portal. This will redirect to Mind Tools Toolkit Sign-on URL where you can initiate the login flow. 

* Go to Mind Tools Toolkit Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Mind Tools Toolkit tile in the My Apps, this will redirect to Mind Tools Toolkit Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure Mind Tools Toolkit you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).

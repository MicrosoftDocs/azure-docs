---
title: 'Tutorial: Azure Active Directory integration with Mind Tools Toolkit | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Mind Tools Toolkit.
services: active-directory
documentationCenter: na
author: jeevansd
manager: daveba
ms.reviewer: barbkess

ms.assetid: 65b2979d-9e2f-4530-bc08-546975269ebc
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: tutorial
ms.date: 03/12/2020
ms.author: jeedes

ms.collection: M365-identity-device-management
---
# Tutorial: Azure Active Directory integration with Mind Tools Toolkit

In this tutorial, you learn how to integrate Mind Tools Toolkit with Azure Active Directory (Azure AD).

With this integration, you can:

* Control in Azure AD who has access to Mind Tools Toolkit.
* Enable your users to be automatically signed in to Mind Tools Toolkit (single sign-on) with their Azure AD accounts.
* Manage your accounts in one central location: the Azure portal.

To learn more about software as a service (SaaS) app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on).

## Prerequisites

To configure Azure AD integration with Mind Tools Toolkit, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* A Mind Tools Toolkit subscription with single sign-on (SSO) enabled.

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Mind Tools Toolkit supports SP-initiated SSO.
* Mind Tools Toolkit supports just-in-time user provisioning.
* After you configure Mind Tools Toolkit, you can enforce session control. This control protects exfiltration and infiltration of your organization's sensitive data in real time. Session control extends from conditional access. [Learn how to enforce session control with Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/proxy-deployment-any-app).

## Add Mind Tools Toolkit from the gallery

To configure the integration of Mind Tools Toolkit into Azure AD, you need to add Mind Tools Toolkit from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) by using either a work or school account, or a personal Microsoft account.
1. On the leftmost navigation pane, select the **Azure Active Directory** service.
1. Go to **Enterprise Applications**, and then select **All Applications**.
1. To add a new application, select **New application**.
1. In the **Add from the gallery** section, enter **Mind Tools Toolkit** in the search box.
1. Select **Mind Tools Toolkit** from the search results, and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD single sign-on

In this section, you configure and test Azure AD single sign-on with Mind Tools Toolkit by using a test user called **B.Simon**. For single sign-on to work, you must establish a linked relationship between an Azure AD user and the related user in Mind Tools Toolkit.

To configure and test Azure AD single sign-on with Mind Tools Toolkit, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Mind Tools Toolkit SSO](#configure-mind-tools-toolkit-sso)** to configure the single sign-on settings on the application side.
    1. **[Create a Mind Tools Toolkit test user](#create-a-mind-tools-toolkit-test-user)** to have a counterpart of B.Simon in Mind Tools Toolkit. This counterpart is linked to the Azure AD representation of the user.
1. **[Test SSO](#test-sso)** to verify whether the configuration works.

### Configure Azure AD SSO

In this section, you configure Azure AD single sign-on with Mind Tools Toolkit by following these steps:

1. In the [Azure portal](https://portal.azure.com/), on the **Mind Tools Toolkit** application integration page, select **Single sign-on**.

    ![The Manage section, with Single sign-on highlighted](common/select-sso.png)

1. In the **Select a Single sign-on method** dialog box, select **SAML/WS-Fed** to enable single sign-on.

    ![The Select a single sign-on method dialog box, with SAML highlighted](common/select-saml-option.png)

1. On the **Set up Single Sign-On with SAML** page, select the pencil icon for **Basic SAML Configuration** to edit the settings.

    ![The Set up Single Sign-On with SAML page, with the pencil icon for Basic SAML Configuration highlighted](common/edit-urls.png)

1. In the **Basic SAML Configuration** section, in the **Sign-on URL** box, enter a URL having the pattern `https://app.goodpractice.net/#/<subscriptionUrl>/s/<locationId>`.

    > [!NOTE]
    > The **Sign-on URL** value isn't real. Update the value with the actual sign-on URL. Contact the [Mind Tools Toolkit Client support team](mailto:support@goodpractice.com) to get the value.

1. On the **Set-up Single Sign-On with SAML** page, go to the **SAML Signing Certificate** section. To the right of **Federation Metadata XML**, select **Download** to download the XML text and save it on your computer. The XML contents depend on the options you select.

    ![The SAML Signing Certificate section, with Download highlighted next to Federation Metadata XML](common/metadataxml.png)

1. In the **Set up Mind Tools Toolkit** section, copy whichever of the following URLs you need.

    * **Login URL**

    * **Azure AD Identifier**

    * **Logout URL**

    ![The Set up Mind Tools Toolkit section, with the configuration URLs highlighted](common/copy-configuration-urls.png)

### Create an Azure AD test user

In this section, you create a test user called B.Simon in the Azure portal:

1. On the leftmost side of the Azure portal, select **Azure Active Directory** > **Users** > **All users**.
1. At the top of the screen, select **New user**.
1. In the **User** properties, follow these steps:
   1. In the **Name** field, enter **B.Simon**.  
   1. In the **User name** field, enter **B.Simon@**_companydomain_**.**_extension_. For example, B.Simon@contoso.com.
   1. Select the **Show password** check box, and then write down the value that's shown in the **Password** box.
   1. Select **Create**.

### Assign the Azure AD test user

In this section, you enable B.Simon to use Azure single sign-on by granting access to Mind Tools Toolkit.

1. In the Azure portal, select **Enterprise Applications** > **All applications**.
1. In the applications list, select **Mind Tools Toolkit**.
1. In the app's overview page, go to the **Manage** section, and select **Users and groups**.

   ![The Manage section, with Users and groups highlighted](common/users-groups-blade.png)

1. Select **Add user**. In the **Add Assignment** dialog box, select **Users and groups**.

   ![The Users and groups window, with Add user highlighted](common/add-assign-user.png)

1. In the **Users and groups** dialog box, select **B.Simon** from the users list. Then  choose the **Select** button at the bottom of the screen.
1. If you expect any role value in the SAML assertion, in the **Select Role** dialog box, select the appropriate role for the user from the list. Then choose the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog box, select **Assign**.

## Configure Mind Tools Toolkit SSO

To configure single sign-on on the **Mind Tools Toolkit** side, send the downloaded **Federation Metadata XML** text and the previously copied URLs to the [Mind Tools Toolkit support team](mailto:support@goodpractice.com). They configure this setting to have the SAML SSO connection set properly on both sides.

### Create a Mind Tools Toolkit test user

In this section, you create a user called B.Simon in Mind Tools Toolkit.

Mind Tools Toolkit supports just-in-time provisioning, which is enabled by default. There's no action for you to take in this section. If a user doesn't already exist in Mind Tools Toolkit, a new one is created when you attempt to access Mind Tools Toolkit.

### Test SSO

In this section, you test your Azure AD single sign-on configuration by using the My Apps portal.

When you select the Mind Tools Toolkit tile in the My Apps portal, you are automatically signed in to the Mind Tools Toolkit for which you set up SSO. For more information about the My Apps portal, see [Introduction to the My Apps portal](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [Tutorials for integrating SaaS apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [Try Mind Tools Toolkit with Azure AD](https://aad.portal.azure.com/)

- [What is session control in Microsoft Cloud App Security?](https://docs.microsoft.com/cloud-app-security/proxy-intro-aad)

- [How to protect Mind Tools Toolkit with advanced visibility and controls](https://docs.microsoft.com/cloud-app-security/proxy-intro-aad)

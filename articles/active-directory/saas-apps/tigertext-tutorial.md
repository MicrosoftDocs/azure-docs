---
title: 'Tutorial: Azure Active Directory integration with TigerConnect Secure Messenger | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and TigerConnect Secure Messenger.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 08/21/2020
ms.author: jeedes
---

# Tutorial: Azure Active Directory integration with TigerConnect Secure Messenger

In this tutorial, you learn how to integrate TigerConnect Secure Messenger with Azure Active Directory (Azure AD).

Integrating TigerConnect Secure Messenger with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to TigerConnect Secure Messenger.
* You can enable your users to be automatically signed in to TigerConnect Secure Messenger (single sign-on) with their Azure AD accounts.
* You can manage your accounts in one central location: the Azure portal.

For details about software as a service (SaaS) app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).

## Prerequisites

To configure Azure AD integration with TigerConnect Secure Messenger, you need the following items:

* An Azure AD subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.
* A TigerConnect Secure Messenger subscription with single sign-on enabled.

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment and integrate TigerConnect Secure Messenger with Azure AD.

* TigerConnect Secure Messenger supports **SP** initiated SSO
* Once you configure TigerConnect Secure Messenger you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/proxy-deployment-any-app).

## Adding TigerConnect Secure Messenger from the gallery

To configure the integration of TigerConnect Secure Messenger into Azure AD, you need to add TigerConnect Secure Messenger from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **TigerConnect Secure Messenger** in the search box.
1. Select **TigerConnect Secure Messenger** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD SSO

In this section, you configure and test Azure AD single sign-on with TigerConnect Secure Messenger based on a test user named **Britta Simon**. For single sign-on to work, you must establish a link between an Azure AD user and the related user in TigerConnect Secure Messenger.

To configure and test Azure AD single sign-on with TigerConnect Secure Messenger, you need to complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** to enable your users to use this feature.
    * **[Create an Azure AD test user](#create-an-azure-ad-test-user)** to test Azure AD single sign-on with Britta Simon.
    * **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** to enable Britta Simon to use Azure AD single sign-on.
1. **[Configure TigerConnect Secure Messenger SSO](#configure-tigerconnect-secure-messenger-sso)** to configure the single sign-on settings on the application side.
    * **[Create a TigerConnect Secure Messenger test user](#create-a-tigerconnect-secure-messenger-test-user)** so that there's a user named Britta Simon in TigerConnect Secure Messenger who's linked to the Azure AD user named Britta Simon.
1. **[Test SSO](#test-sso)** to verify whether the configuration works.

### Configure Azure AD SSO

In this section, you enable Azure AD single sign-on in the Azure portal.

To configure Azure AD single sign-on with TigerConnect Secure Messenger, take the following steps:

1. In the [Azure portal](https://portal.azure.com/), on the **TigerConnect Secure Messenger** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. In the **Basic SAML Configuration** section, enter the values for the following fields:

    1. In the **Sign on URL** box, enter a URL:

       `https://home.tigertext.com`

    1. In the **Identifier (Entity ID)** box, type a URL by using the following pattern:

       `https://saml-lb.tigertext.me/v1/organization/<instance ID>`

    > [!NOTE]
    > The **Identifier (Entity ID)** value isn't real. Update this value with the actual identifier. To get the value, contact the [TigerConnect Secure Messenger support team](mailto:prosupport@tigertext.com). You can also refer to the patterns shown in the **Basic SAML Configuration** pane in the Azure portal.

1. On the **Set up Single Sign-On with SAML** pane, in the **SAML Signing Certificate** section, select **Download** to download the **Federation Metadata XML** from the given options and save it on your computer.

    ![The Federation Metadata XML download option](common/metadataxml.png)

1. In the **Set up TigerConnect Secure Messenger** section, copy the appropriate URL(s) based on your requirement.

    ![Copy configuration URLs](common/copy-configuration-urls.png)


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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to TigerConnect Secure Messenger.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **TigerConnect Secure Messenger**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure TigerConnect Secure Messenger SSO

To configure single sign-on on the TigerConnect Secure Messenger side, you need to send the downloaded Federation Metadata XML and the appropriate copied URLs from the Azure portal to the [TigerConnect Secure Messenger support team](mailto:prosupport@tigertext.com). The TigerConnect Secure Messenger team will make sure the SAML SSO connection is set properly on both sides.

## Create a TigerConnect Secure Messenger test user

In this section, you create a user called Britta Simon in TigerConnect Secure Messenger. Work with the [TigerConnect Secure Messenger support team](mailto:prosupport@tigertext.com) to add Britta Simon as a user in TigerConnect Secure Messenger. Users must be created and activated before you use single sign-on.

## Test SSO

In this section, you test your Azure AD single sign-on configuration by using the My Apps portal.

When you select **TigerConnect Secure Messenger** in the My Apps portal, you should be automatically signed in to the TigerConnect Secure Messenger subscription for which you set up single sign-on. For more information about the My Apps portal, see [Access and use apps on the My Apps portal](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [List of tutorials for integrating SaaS apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is Conditional Access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [Try TigerConnect Secure Messenger with Azure AD](https://aad.portal.azure.com/)

- [What is session control in Microsoft Cloud App Security?](https://docs.microsoft.com/cloud-app-security/proxy-intro-aad)
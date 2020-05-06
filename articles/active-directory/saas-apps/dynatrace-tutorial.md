---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with Dynatrace | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Dynatrace.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 267ad37f-feda-4fac-bd15-7610174caf45
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: tutorial
ms.date: 10/22/2019
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with Dynatrace

In this tutorial, you'll learn how to integrate Dynatrace with Azure Active Directory (Azure AD). When you integrate Dynatrace with Azure AD, you can:

* Control in Azure AD who has access to Dynatrace.
* Enable your users to be automatically signed-in to Dynatrace with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Dynatrace single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Dynatrace supports **SP and IDP** initiated SSO
* Dynatrace supports **Just In Time** user provisioning

> [!NOTE]
> The identifier of this application is a fixed string value. Only one instance can be configured in one tenant.

## Adding Dynatrace from the gallery

To configure the integration of Dynatrace into Azure AD, you need to add Dynatrace from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications**, and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Dynatrace** in the search box.
1. Select **Dynatrace** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD single sign-on for Dynatrace

Configure and test Azure AD SSO with Dynatrace using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Dynatrace.

To configure and test Azure AD SSO with Dynatrace, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    * **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    * **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Dynatrace SSO](#configure-dynatrace-sso)** - to configure the single sign-on settings on application side.
    * **[Create Dynatrace test user](#create-dynatrace-test-user)** - to have a counterpart of B.Simon in Dynatrace that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **Dynatrace** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. In the **Basic SAML Configuration** section, the application is pre-configured in **IDP** initiated mode and the necessary URLs are already pre-populated with Azure. The user needs to save the configuration by clicking the **Save** button.

1. Click **Set additional URLs** and complete the following step to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type a URL:
    `https://sso.dynatrace.com/`

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section, find **Federation Metadata XML**. Select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

1. In the **SAML Signing Certificate** section, select the **Edit** button to open the **SAML Signing Certificate** dialog box. Complete the following steps:

	![Edit SAML Signing Certificate](common/edit-certificate.png)

	a. The **Signing Option** setting is pre-populated. Please review the settings as per your organization.

	b. Click **Save**.

	![Communifire Signing option](./media/dynatrace-tutorial/tutorial-dynatrace-signing-option.png)

1. In the **Set up Dynatrace** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Dynatrace.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Dynatrace**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, and then select **Users and groups** in the **Add Assignment** dialog box.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog box, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog box, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog box, click the **Assign** button.

## Configure Dynatrace SSO

To configure single sign-on on the **Dynatrace** side, you need to send the downloaded **Federation Metadata XML** file and the appropriate copied URLs from the Azure portal to [Dynatrace](https://www.dynatrace.com/support/help/shortlink/users-sso-hub). You can follow the instructions on the Dynatrace website to configure the SAML SSO connection on both sides.

### Create Dynatrace test user

In this section, a user called B.Simon is created in Dynatrace. Dynatrace supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in Dynatrace, a new one is created after authentication.

## Test SSO

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Dynatrace tile in the Access Panel, you should be automatically signed in to the Dynatrace, for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/active-directory-appssoaccess-whatis)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [Try Dynatrace with Azure AD](https://aad.portal.azure.com/)

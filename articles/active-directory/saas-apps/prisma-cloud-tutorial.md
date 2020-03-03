---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with Prisma Cloud SSO | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Prisma Cloud SSO.
services: active-directory
documentationCenter: na
author: jeevansd
manager: mtillman
ms.reviewer: barbkess

ms.assetid: 00f2ee0d-92e7-4f5a-a865-837de26b5255
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: tutorial
ms.date: 02/07/2020
ms.author: jeedes

ms.collection: M365-identity-device-management
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with Prisma Cloud SSO

In this tutorial, you'll learn how to integrate Prisma Cloud SSO with Azure Active Directory (Azure AD). When you integrate Prisma Cloud SSO with Azure AD, you can:

* Control in Azure AD who has access to Prisma Cloud SSO.
* Enable your users to be automatically signed-in to Prisma Cloud SSO with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Prisma Cloud SSO single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Prisma Cloud SSO supports **IDP** initiated SSO

* Prisma Cloud SSO supports **Just In Time** user provisioning

* Once you configure the Prisma Cloud SSO you can enforce session controls, which protect exfiltration and infiltration of your organization’s sensitive data in real-time. Session controls extend from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/proxy-deployment-any-app).

## Adding Prisma Cloud SSO from the gallery

To configure the integration of Prisma Cloud SSO into Azure AD, you need to add Prisma Cloud SSO from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Prisma Cloud SSO** in the search box.
1. Select **Prisma Cloud SSO** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD single sign-on for Prisma Cloud SSO

Configure and test Azure AD SSO with Prisma Cloud SSO using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Prisma Cloud SSO.

To configure and test Azure AD SSO with Prisma Cloud SSO, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Prisma Cloud SSO](#configure-prisma-cloud-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Prisma Cloud SSO test user](#create-prisma-cloud-sso-test-user)** - to have a counterpart of B.Simon in Prisma Cloud SSO that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **Prisma Cloud SSO** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Set up single sign-on with SAML** page, enter the values for the following fields:

    a. In the **Identifier** text box, type a URL using the following pattern:
    `https://app2.prismacloud.io/customer/<CUSTOMERID>`

    b. The **Reply URL** values are fixed and already pre-populated in Azure portal. You need to select the appropriate URL according to your requirement.

	> [!NOTE]
	> The Identifier value is not real. Update the value with the actual Identifier. Contact [Prisma Cloud SSO Client support team](mailto:support@paloaltonetworks.com) to get the value. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. On the **Set up Prisma Cloud SSO** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Prisma Cloud SSO.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Prisma Cloud SSO**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Prisma Cloud SSO

To configure single sign-on on **Prisma Cloud SSO** side, you need to send the downloaded **Certificate (Base64)** and appropriate copied URLs from Azure portal to [Prisma Cloud SSO support team](mailto:support@paloaltonetworks.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Prisma Cloud SSO test user

In this section, a user called B.Simon is created in Prisma Cloud SSO. Prisma Cloud SSO supports just-in-time provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in Prisma Cloud SSO, a new one is created when you attempt to access Prisma Cloud SSO.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Prisma Cloud SSO tile in the Access Panel, you should be automatically signed in to the Prisma Cloud SSO for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Additional resources

- [ List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory ](https://docs.microsoft.com/azure/active-directory/active-directory-saas-tutorial-list)

- [What is application access and single sign-on with Azure Active Directory? ](https://docs.microsoft.com/azure/active-directory/manage-apps/what-is-single-sign-on)

- [What is conditional access in Azure Active Directory?](https://docs.microsoft.com/azure/active-directory/conditional-access/overview)

- [What is session control in Microsoft Cloud App Security?](https://docs.microsoft.com/cloud-app-security/proxy-intro-aad)

- [Try Prisma Cloud SSO with Azure AD](https://aad.portal.azure.com/)

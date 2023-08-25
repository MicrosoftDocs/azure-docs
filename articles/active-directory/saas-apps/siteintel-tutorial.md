---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with SiteIntel'
description: Learn how to configure single sign-on between Azure Active Directory and SiteIntel.
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

# Tutorial: Azure Active Directory single sign-on (SSO) integration with SiteIntel

In this tutorial, you'll learn how to integrate SiteIntel with Azure Active Directory (Azure AD). When you integrate SiteIntel with Azure AD, you can:

* Control in Azure AD who has access to SiteIntel.
* Enable your users to be automatically signed in to SiteIntel with their Azure AD accounts.
* Manage your accounts in one central location, the Azure portal.

To learn more about software as a service (SaaS) app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* SiteIntel single sign-on (SSO)-enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* SiteIntel supports SP-initiated and IdP-initiated SSO.
* After you configure SiteIntel, you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-any-app).

## Add SiteIntel from the gallery

To configure the integration of SiteIntel into Azure AD, you need to add SiteIntel from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) by using either a work or school account, or a personal Microsoft account.
1. On the left pane, select **Azure Active Directory**.
1. Go to **Enterprise Applications**, and then select **All Applications**.
1. To add a new application, select **New application**.
1. In the **Add from the gallery** box, enter **SiteIntel**.
1. In the results list, select **SiteIntel**, and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD single sign-on for SiteIntel

Configure and test Azure AD SSO with SiteIntel by using a test user called *B.Simon*. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in SiteIntel.

To configure and test Azure AD SSO with SiteIntel, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** to enable your users to use this feature.  

    a. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** to test Azure AD single sign-on with user B.Simon.  

    b. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** to enable user B.Simon to use Azure AD single sign-on.

1. **[Configure SiteIntel SSO](#configure-siteintel-sso)** to configure the single sign-on settings on the application side.

    * **[Create a SiteIntel test user](#create-a-siteintel-test-user)** to have a counterpart of user B.Simon in SiteIntel that's linked to the Azure AD representation of the user.

1. **[Test SSO](#test-sso)** to verify that the configuration works.

## Configure Azure AD SSO

To enable Azure AD SSO in the Azure portal, do the following:

1. In the [Azure portal](https://portal.azure.com/), on the **SiteIntel** application integration page, go to the **Manage** section, and then select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, next to **Basic SAML Configuration**, select **Edit** (pen icon).

   ![Screenshot of "Set up Single-Sign-On with SAML" pane](common/edit-urls.png)

1. To configure the application in IdP-initiated mode, in the **Basic SAML Configuration** section, do the following:

    a. In the **Identifier** box, type a URL in the following format:
    `urn:amazon:cognito:sp:<REGION>_<USERPOOLID>`

    b. In the **Reply URL** box, type a URL in the following format:
    `https://<CLIENT>.auth.siteintel.com/saml2/idpresponse`

    c. In the **Relay State** box, type a URL in the following format:
    `https://<CLIENT>.siteintel.com`

1. To configure the application in SP-initiated mode, select **Set additional URLs**, and then do the following:

   * In the **Sign-on URL** box, type a URL in the following format:
    `https://<CLIENT>.siteintel.com`

    > [!NOTE]
    > These values are not real. Update them with the actual Identifier, Reply URL, Sign-on URL, and Relay State. To get these values, contact [SiteIntel Client support team](mailto:support@intalytics.com). You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section, select the **Copy** button to copy the URL in the **App Federation Metadata Url** box.

	![Screenshot of the "App Federation Metadata URL" Copy button](common/copy-metadataurl.png)

### Create an Azure AD test user

In this section, you create a test user in the Azure portal called B.Simon.

1. On the left pane in the Azure portal, select **Azure Active Directory** > **Users** > **All users**.
1. Select **New user** at the top of the pane.
1. In **User** properties, do the following:

   a. In the **Name** box, enter **B.Simon**.  

   b. In the **User name** box, enter the username in the following format: 
   `username@companydomain.extension` (for example, `B.Simon@contoso.com`).

   c. Select the **Show password** check box, and then write down the value that's displayed in the **Password** box.

   d. Select **Create**.

### Assign the Azure AD test user

In this section, you enable user B.Simon to use Azure single sign-on by granting access to SiteIntel.

1. In the Azure portal, select **Enterprise Applications** > **All applications**.
1. In the **Applications** list, select **SiteIntel**.
1. On the app overview page, in the **Manage** section, select **Users and groups**.

   ![Screenshot of the "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user** and then, on the **Add Assignment** pane, select **Users and groups**.

	![Screenshot of the "Add user" button](common/add-assign-user.png)

1. On the **Users and groups** pane, select **B.Simon**, and then select the **Select** button at the lower part of the screen.
1. If you're expecting any role value in the SAML assertion, on the **Select Role** pane, select the appropriate role for the user from the list, and then select the **Select** button.
1. On the **Add Assignment** pane, select the **Assign** button.

## Configure SiteIntel SSO

To configure single sign-on on the SiteIntel side, send the URL you copied from the **App Federation Metadata Url** box to the [SiteIntel support team](mailto:support@intalytics.com). They set this value to establish the SAML SSO connection properly on both sides.

### Create a SiteIntel test user

In this section, you create a user called *Britta Simon* in SiteIntel. Work with [SiteIntel support team](mailto:support@intalytics.com) to add the users in the SiteIntel platform. Users must be created and activated before you use single sign-on.

## Test SSO

In this section, you test your Azure AD single sign-on configuration by using the Access Panel.

When you select the **SiteIntel** tile in the Access Panel, you should be automatically signed in to the SiteIntel for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Additional resources

- [List of tutorials about how to integrate SaaS apps with Azure Active Directory ](./tutorial-list.md)
- [What are application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)
- [What is Conditional Access in Azure Active Directory?](../conditional-access/overview.md)
- [What is session control in Microsoft Defender for Cloud Apps?](/cloud-app-security/proxy-intro-aad)
- [How to protect SiteIntel with advanced visibility and controls](/cloud-app-security/proxy-intro-aad)

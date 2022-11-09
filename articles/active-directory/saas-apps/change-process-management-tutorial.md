---
title: 'Tutorial: Azure AD SSO integration with Change Process Management'
description: Learn how to configure single sign-on between Azure Active Directory and Change Process Management.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 07/09/2022
ms.author: jeedes
---

# Tutorial: Azure AD SSO integration with Change Process Management

In this tutorial, you'll learn how to integrate Change Process Management with Azure Active Directory (Azure AD). When you integrate Change Process Management with Azure AD, you can:

* Use Azure AD to control who can access Change Process Management.
* Enable your users to be automatically signed in to Change Process Management with their Azure AD accounts.
* Manage your accounts in one central location: the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* A Change Process Management subscription with single sign-on (SSO) enabled.
* Along with Cloud Application Administrator, Application Administrator can also add or manage applications in Azure AD.
For more information, see [Azure built-in roles](../roles/permissions-reference.md).

## Scenario description

In this tutorial, you'll configure and test Azure AD SSO in a test environment.

Change Process Management supports IDP-initiated SSO.

## Add Change Process Management from the gallery

To configure the integration of Change Process Management into Azure AD, you need to add Change Process Management from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal with a work or school account or with a personal Microsoft account.
1. In the left pane, select **Azure Active Directory**.
1. Go to **Enterprise applications** and then select **All Applications**.
1. To add an application, select **New application**.
1. In the **Add from the gallery** section, enter **Change Process Management** in the search box.
1. Select **Change Process Management** in the results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for Change Process Management

You'll configure and test Azure AD SSO with Change Process Management by using a test user named B.Simon. For SSO to work, you need to establish a link relationship between an Azure AD user and the corresponding user in Change Process Management.

To configure and test Azure AD SSO with Change Process Management, you'll take these high-level steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** to enable your users to use the feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** to test Azure AD single sign-on.
    1. **[Grant access to the test user](#grant-access-to-the-test-user)** to enable the user to use Azure AD single sign-on.
1. **[Configure Change Process Management SSO](#configure-change-process-management-sso)** on the application side.
    1. **[Create a Change Process Management test user](#create-a-change-process-management-test-user)** as a counterpart to the Azure AD representation of the user.
1. **[Test SSO](#test-sso)** to verify that the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Change Process Management** application integration page, in the **Manage** section, select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up Single Sign-On with SAML** page, select the pencil button for **Basic SAML Configuration** to edit the settings:

   ![Screenshot shows to edit Basic S A M L Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier** box, type a URL using the following pattern:
    `https://<hostname>:8443/`

    b. In the **Reply URL** box, type a URL using the following pattern:
    `https://<hostname>:8443/changepilot/saml/sso`

	> [!NOTE]
	> The preceding **Identifier** and **Reply URL** values aren't the actual values that you should use. Contact the [Change Process Management support team](mailto:support@realtech-us.com) to get the actual values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, select the **Download** link for **Certificate (Base64)** to download the certificate and save it on your computer:

	![Screenshot shows the Certificate download link.](common/certificatebase64.png "Certificate")

1. In the **Set up Change Process Management** section, copy the appropriate URL or URLs, based on your requirements:

	![Screenshot shows to copy configuration appropriate U R L.](common/copy-configuration-urls.png "Metadata")

### Create an Azure AD test user

In this section, you'll create a test user named B.Simon in the Azure portal.

1. In the left pane of the Azure portal, select **Azure Active Directory**. Select **Users**, and then select **All users**.
1. Select **New user** at the top of the screen.
1. In the **User** properties, complete these steps:
   1. In the **Name** box, enter **B.Simon**.  
   1. In the **User name** box, enter \<username>@\<companydomain>.\<extension>. For example, `B.Simon@contoso.com`.
   1. Select **Show password**, and then write down the value that's displayed in the **Password** box.
   1. Select **Create**.

### Grant access to the test user

In this section, you'll enable B.Simon to use Azure single sign-on by granting that user access to Change Process Management.

1. In the Azure portal, select **Enterprise applications**, and then select **All applications**.
1. In the applications list, select **Change Process Management**.
1. In the app's overview page, in the **Manage** section, select **Users and groups**:
1. Select **Add user**, and then select **Users and groups** in the **Add Assignment** dialog box.
1. In the **Users and groups** dialog box, select **B.Simon** in the **Users** list, and then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog box, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog box, select **Assign**.

## Configure Change Process Management SSO

To configure single sign-on on the Change Process Management side, you need to send the downloaded Base64 certificate and the appropriate URLs that you copied from the Azure portal to the [Change Process Management support team](mailto:support@realtech-us.com). They configure the SAML SSO connection to be correct on both sides.

### Create a Change Process Management test user

Work with the [Change Process Management support team](mailto:support@realtech-us.com) to add a user named B.Simon in Change Process Management. Users must be created and activated before you use single sign-on.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options.

* Click on Test this application in Azure portal and you should be automatically signed in to the Change Process Management for which you set up the SSO.

* You can use Microsoft My Apps. When you click the Change Process Management tile in the My Apps, you should be automatically signed in to the Change Process Management for which you set up the SSO. For more information about the My Apps, see [Introduction to the My Apps](../user-help/my-apps-portal-end-user-access.md).

## Next steps

Once you configure Change Process Management you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad).
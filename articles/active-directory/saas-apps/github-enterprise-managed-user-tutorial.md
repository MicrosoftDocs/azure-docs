---
title: 'Tutorial: Microsoft Entra single sign-on (SSO) integration with GitHub Enterprise Managed User'
description: Learn how to configure single sign-on between Microsoft Entra ID and GitHub Enterprise Managed User.
author: jeevansd
manager: CelesteDG
ms.reviewer: CelesteDG
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 11/21/2022
ms.author: jeedes

---

# Tutorial: Microsoft Entra single sign-on (SSO) integration with GitHub Enterprise Managed User

In this tutorial, you'll learn how to integrate GitHub Enterprise Managed User (EMU) with Microsoft Entra ID. When you integrate GitHub Enterprise Managed User with Microsoft Entra ID, you can:

* Control in Microsoft Entra ID who has access to GitHub Enterprise Managed User.
* Enable your users to be automatically signed-in to GitHub Enterprise Managed User with their Microsoft Entra accounts.
* Manage your accounts in one central location.

> [!NOTE]
> [GitHub Enterprise Managed Users](https://docs.github.com/enterprise-cloud@latest/admin/authentication/managing-your-enterprise-users-with-your-identity-provider/about-enterprise-managed-users) is a feature of GitHub Enterprise Cloud which is different from GitHub Enterprise's standard SAML SSO implementation. If you haven't specifically requested EMU instance, you have standard GitHub Enterprise Cloud plan. In that case, please refer to relevant documentation to configure your non-EMU [organisation](./github-tutorial.md) or [enterprise account](./github-enterprise-cloud-enterprise-account-tutorial.md) to authenticate with Microsoft Entra ID.


## Prerequisites

To get started, you need the following items:

* A Microsoft Entra subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* GitHub Enterprise Managed User single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Microsoft Entra SSO in a test environment.

* GitHub Enterprise Managed User supports **SP and IDP** initiated SSO.
* GitHub Enterprise Managed User requires [**Automated** user provisioning](./github-enterprise-managed-user-provisioning-tutorial.md).

## Adding GitHub Enterprise Managed User from the gallery

To configure the integration of GitHub Enterprise Managed User into Microsoft Entra ID, you need to add GitHub Enterprise Managed User from the gallery to your list of managed SaaS apps.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **New application**.
1. Type **GitHub Enterprise Managed User** in the search box.
1. Select **GitHub Enterprise Managed User** from results panel and then click on the **Create** button. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)


<a name='configure-and-test-azure-ad-sso-for-github-enterprise-managed-user'></a>

## Configure and test Microsoft Entra SSO for GitHub Enterprise Managed User

To configure and test Microsoft Entra SSO with GitHub Enterprise Managed User, perform the following steps:

1. **[Configure Microsoft Entra SSO](#configure-azure-ad-sso)** - to enable SAML Single Sign On in your Microsoft Entra tenant.
1. **[Configure GitHub Enterprise Managed User SSO](#configure-github-enterprise-managed-user-sso)** - to configure the single sign-on settings in your GitHub Enterprise.

<a name='configure-azure-ad-sso'></a>

## Configure Microsoft Entra SSO

Follow these steps to enable Microsoft Entra SSO.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **GitHub Enterprise Managed User** > **Single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. Ensure that you have your Enterprise URL before you begin. The ENTITY field mentioned below is the Enterprise name of your EMU-enabled Enterprise URL. For example, https://github.com/enterprises/contoso - **contoso** is the ENTITY. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, enter the values for the following fields:

    a. In the **Identifier** text box, type a URL using the following pattern:
    `https://github.com/enterprises/<ENTITY>`
    
    > [!NOTE]
    > Note the identifier format is different from the application's suggested format - please follow the format above. In addition, please ensure the **Identifier does not contain a trailing slash.
    
    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://github.com/enterprises/<ENTITY>/saml/consume`
    

1. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

    In the **Sign-on URL** text box, type a URL using the following pattern:
    `https://github.com/enterprises/<ENTITY>/sso`

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificate-base64-download.png)

1. On the **Set up GitHub Enterprise Managed User** section, copy the URLs below and save it for configuring GitHub below.

	![Copy configuration URLs](common/copy-configuration-urls.png)

<a name='assign-the-azure-ad-test-user'></a>

### Assign the Microsoft Entra test user

In this section, you'll assign your account to GitHub Enterprise Managed User in order to complete SSO setup.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Cloud Application Administrator](../roles/permissions-reference.md#cloud-application-administrator).
1. Browse to **Identity** > **Applications** > **Enterprise applications** > **GitHub Enterprise Managed User**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select your account from the Users list, then click the **Select** button at the bottom of the screen.
1. In the **Select a role** dialog, select the **Enterprise Owner** role, then click the **Select** button at the bottom of the screen. Your account is assigned as an Enterprise Owner for your GitHub instance when you provision your account in the next tutorial. 
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure GitHub Enterprise Managed User SSO

To configure single sign-on on **GitHub Enterprise Managed User** side, you will require the following items:

1. The URLs from your Microsoft Entra Enterprise Managed User Application above: Login URL; Microsoft Entra Identifier; and Logout URL
1. The account name and password for the first administrator user of your GitHub Enterprise. The credentials are provided by a password reset email from your GitHub Solutions Engineering contact. 

### Enable GitHub Enterprise Managed User SAML SSO

In this section, you'll take the information provided from Microsoft Entra ID above and enter them into your Enterprise settings to enable SSO support.

1. Go to https://github.com
1. Click on Sign In at the top-right corner
1. Enter the credentials for the first administrator user account. The login handle should be in the format: `<your enterprise short code>_admin`
1. Navigate to `https://github.com/enterprises/` `<your enterprise name>`. This information should be provided by your Solutions Engineering contact.
1. On the navigation menu on the left, select **Settings**, then **Authentication security**.
1. Click on the checkbox **Require SAML authentication**
1. Enter the Sign-on URL. This URL is the Login URL that you copied from Microsoft Entra ID above.
1. Enter the Issuer. This URL is the Microsoft Entra Identifier that you copied from Microsoft Entra ID above.
1. Enter the Public Certificate. Please open the base64 certificate that you downloaded above and paste the text contents of that file into this dialog.
1. Click on **Test SAML configuration**. This will open up a dialog for you to log in with your Microsoft Entra credentials to validate that SAML SSO is configured correctly. Log in with your Microsoft Entra credentials. you will receive a message **Passed: Successfully authenticated your SAML SSO identity** upon successful validation.
1. Click **Save** to persist these settings.
1. Please save (download, print, or copy) the recovery codes in a secure place.
1. Click on **Enable SAML authentication**.
1. At this point, only accounts with SSO are able to log into your Enterprise. Follow the instructions in the document below on provisioning in order to provision accounts backed by SSO.

## Next steps

GitHub Enterprise Managed User **requires** all accounts to be created through automatic user provisioning, you can find more details [here](./github-enterprise-managed-user-provisioning-tutorial.md) on how to configure automatic user provisioning.

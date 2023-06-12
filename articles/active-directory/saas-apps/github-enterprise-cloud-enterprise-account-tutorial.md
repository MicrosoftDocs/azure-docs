---
title: 'Tutorial: Azure Active Directory SSO integration with GitHub Enterprise Cloud - Enterprise Account'
description: Learn how to configure single sign-on between Azure Active Directory and GitHub Enterprise Cloud - Enterprise Account.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 03/29/2023
ms.author: jeedes
---

# Tutorial: Azure Active Directory SSO integration with GitHub Enterprise Cloud - Enterprise Account

In this tutorial, you learn how to setup an Azure Active Directory (Azure AD) SAML integration with a GitHub Enterprise Cloud - Enterprise Account. When you integrate GitHub Enterprise Cloud - Enterprise Account with Azure AD, you can:

* Control in Azure AD who has access to a GitHub Enterprise Account and any organizations within the Enterprise Account.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* A [GitHub Enterprise Account](https://docs.github.com/en/enterprise-cloud@latest/admin/overview/about-enterprise-accounts).
* A GitHub user account that is an Enterprise Account owner. 

## Scenario description

In this tutorial, you will configure a SAML integration for a GitHub Enterprise Account, and test enterprise account owner and enterprise/organization member authentication and access. 

> [!NOTE]
> The GitHub `Enterprise Cloud - Enterprise Account` application does not support enabling [automatic SCIM provisioning](../fundamentals/sync-scim.md). If you need to setup provisioning for your GitHub Enterprise Cloud environment, SAML must be configured at the organization level and the `GitHub Enterprise Cloud - Organization` Azure AD application must be used instead. If you are setting up a SAML and SCIM provisioning integration for an enterprise that is enabled for [Enterprise Managed Users (EMUs)](https://docs.github.com/enterprise-cloud@latest/admin/identity-and-access-management/using-enterprise-managed-users-for-iam/about-enterprise-managed-users), then you must use the `GitHub Enterprise Managed User` Azure AD application for SAML/Provisioning integrations or the `GitHub Enterprise Managed User (OIDC)` Azure AD application for OIDC/Provisioning integrations.

* GitHub Enterprise Cloud - Enterprise Account supports **SP** and **IDP** initiated SSO.

## Adding GitHub Enterprise Cloud - Enterprise Account from the gallery

To configure the integration of GitHub Enterprise Cloud - Enterprise Account into Azure AD, you need to add GitHub Enterprise Cloud - Enterprise Account from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **GitHub Enterprise Cloud - Enterprise Account** in the search box.
1. Select **GitHub Enterprise Cloud - Enterprise Account** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, and walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)


## Configure and test Azure AD SSO for GitHub Enterprise Cloud - Enterprise Account

Configure and test Azure AD SSO with GitHub Enterprise Cloud - Enterprise Account using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in GitHub Enterprise Cloud - Enterprise Account.

To configure and test Azure AD SSO with GitHub Enterprise Cloud - Enterprise Account, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign your Azure AD user and the test user account to the GitHub app](#assign-your-azure-ad-user-and-the-test-user-account-to-the-github-app)** - to enable your user account and test user `B.Simon` to use Azure AD single sign-on.
1. **[Enable and Test SAML for the Enterprise Account and its organizations](#enable-and-test-saml-for-the-enterprise-account-and-its-organizations)** - to configure the single sign-on settings on application side.
    1. **[Test SSO with another enterprise account owner or organization member account](#test-sso-with-another-enterprise-account-owner-or-organization-member-account)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **GitHub Enterprise Cloud - Enterprise Account** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:
    `https://github.com/enterprises/<ENTERPRISE-SLUG>`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://github.com/enterprises/<ENTERPRISE-SLUG>/saml/consume`

1. Perform the following step if you wish to configure the application in **SP** initiated mode:

     In the **Sign on URL** text box, type a URL using the following pattern:
    `https://github.com/enterprises/<ENTERPRISE-SLUG>/sso`

	> [!NOTE]
	> Replace `<ENTERPRISE-SLUG>` with the actual name of your GitHub Enterprise Account.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificateBase64.png)

1. On the **Set up GitHub Enterprise Cloud - Enterprise Account** section, copy the appropriate URL(s) based on your requirement.

	![Copy configuration URLs](common/copy-configuration-urls.png)

### Create an Azure AD test user

In this section, you'll create a test user in the Azure portal called `B.Simon`.

1. From the left pane in the Azure portal, select **Azure Active Directory**, select **Users**, and then select **All users**.
1. Select **New user** at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Name** field, enter `B.Simon`.  
   1. In the **User name** field, enter the username@companydomain.extension. For example, `B.Simon@contoso.com`.
   1. Select the **Show password** check box, and then write down the value that's displayed in the **Password** box.
   1. Click **Create**.

<a name="assign-the-azure-ad-test-user"></a>

### Assign your Azure AD user and the test user account to the GitHub app

In this section, you'll enable `B.Simon` and your user account to use Azure single sign-on by granting access to GitHub Enterprise Cloud - Enterprise Account.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **GitHub Enterprise Cloud - Enterprise Account**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** and your user account from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Enable and Test SAML for the Enterprise Account and its organizations

To configure single sign-on on the **GitHub Enterprise Cloud - Enterprise Account** side, follow the steps listed in [this GitHub documentation](https://docs.github.com/en/enterprise-cloud@latest/admin/policies/enforcing-policies-for-your-enterprise/enforcing-policies-for-security-settings-in-your-enterprise#enabling-saml-single-sign-on-for-organizations-in-your-enterprise-account). 
1. Sign in to GitHub.com with a user account that is an [enterprise account owner](https://docs.github.com/en/enterprise-cloud@latest/admin/user-management/managing-users-in-your-enterprise/roles-in-an-enterprise#enterprise-owner). 
1. Copy the value from the `Login URL` field in the app from the Azure portal and paste it in the `Sign on URL` field in the GitHub Enterprise Account SAML settings. 
1. Copy the value from the `Azure AD Identifier` field in the app from the Azure portal and paste it in the `Issuer` field in the GitHub Enterprise Account SAML settings. 
1. Copy the contents of the **Certificate (Base64)** file you downloaded in the steps above from Azure portal and paste them in the appropriate field in the GitHub Enterprise Account SAML settings. 
1. Click the `Test SAML configuration` and confirm that you are able to authenticate from the GitHub Enterprise Account to Azure AD successfully.
1. Once the test is successful, save the settings. 
1. After authenticating via SAML for the first time from the GitHub enterprise account, a _linked external identity_ will be created in the GitHub enterprise account that associates the signed in GitHub user account with the Azure AD user account.  
 
After you enable SAML SSO for your GitHub Enterprise Account, SAML SSO is enabled by default for all organizations owned by your Enterprise Account. All members will be required to authenticate using SAML SSO to gain access to the organizations where they are a member, and enterprise owners will be required to authenticate using SAML SSO when accessing an Enterprise Account.

<a name="test-sso"></a>

## Test SSO with another enterprise account owner or organization member account

After the SAML integration is set up for the GitHub enterprise account (which also applies to the GitHub organizations in the enterprise account), other enterprise account owners who are assigned to the app in Azure AD should be able to navigate to the GitHub enterprise account URL (`https://github.com/enterprises/<enterprise account>`), authenticate via SAML, and access the policies and settings under the GitHub enterprise account. 

An organization owner for an organization in an enterprise account should be able to [invite a user to join their GitHub organization](https://docs.github.com/en/free-pro-team@latest/github/setting-up-and-managing-organizations-and-teams/inviting-users-to-join-your-organization). Sign in to GitHub.com with an organization owner account and follow the steps in the article to invite `B.Simon` to the organization. A GitHub user account will need to be created for `B.Simon` if one does not already exist. 

To test GitHub organization access under the Enterprise Account with the `B.Simon` test user account:
1. Invite `B.Simon` to an organization under the Enterprise Account as an organization owner. 
1. Sign in to GitHub.com using the user account you would like to link to the `B.Simon` Azure AD user account.
1. Sign in to Azure AD using the `B.Simon` user account.
1. Go to the GitHub organization. The user should be prompted to authenticate via SAML. After successful SAML authentication, `B.Simon` should be able to access organization resources. 

## Next steps

Once you configure GitHub Enterprise Cloud - Enterprise Account you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-any-app).

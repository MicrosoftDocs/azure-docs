---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with GitHub Enterprise Cloud - Enterprise Account | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and GitHub Enterprise Cloud - Enterprise Account.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 07/29/2020
ms.author: jeedes
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with GitHub Enterprise Cloud - Enterprise Account

In this tutorial, you'll learn how to integrate GitHub Enterprise Cloud - Enterprise Account with Azure Active Directory (Azure AD). When you integrate GitHub Enterprise Cloud - Enterprise Account with Azure AD, you can:

* Control in Azure AD who has access to a GitHub Enterprise Account and any organizations within the Enterprise Account.

To learn more about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* A [GitHub Enterprise Account](https://docs.github.com/en/free-pro-team@latest/github/setting-up-and-managing-your-enterprise/about-enterprise-accounts)
* A GitHub user account that is an Enterprise Account owner. 

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* GitHub Enterprise Cloud - Enterprise Account supports **SP** and **IDP** initiated SSO
* GitHub Enterprise Cloud - Enterprise Account supports **Just In Time** user provisioning
* Once you configure GitHub Enterprise Cloud - Enterprise Account you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-any-app).

## Adding GitHub Enterprise Cloud - Enterprise Account from the gallery

To configure the integration of GitHub Enterprise Cloud - Enterprise Account into Azure AD, you need to add GitHub Enterprise Cloud - Enterprise Account from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **GitHub Enterprise Cloud - Enterprise Account** in the search box.
1. Select **GitHub Enterprise Cloud - Enterprise Account** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.


## Configure and test Azure AD SSO for GitHub Enterprise Cloud - Enterprise Account

Configure and test Azure AD SSO with GitHub Enterprise Cloud - Enterprise Account using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in GitHub Enterprise Cloud - Enterprise Account.

To configure and test Azure AD SSO with GitHub Enterprise Cloud - Enterprise Account, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign your Azure AD user and the test user account to the GitHub app](#assign-the-azure-ad-test-user)** - to enable your user account and test user `B.Simon` to use Azure AD single sign-on.
1. **[Enable and Test SAML for the Enterprise Account and its organizations](#configure-github-enterprise-cloud-enterprise-account-sso)** - to configure the single sign-on settings on application side.
    1. **[Test SSO with another enterprise account owner or organization member account](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **GitHub Enterprise Cloud - Enterprise Account** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, if you wish to configure the application in **IDP** initiated mode, enter the values for the following fields:

    a. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:
    `https://github.com/enterprises/<ENTERPRISE-SLUG>`

    b. In the **Reply URL** text box, type a URL using the following pattern:
    `https://github.com/enterprises/<ENTERPRISE-SLUG>/saml/consume`

1. Click **Set additional URLs** and perform the following step if you wish to configure the application in **SP** initiated mode:

     In the **Sign on URL** text box, type a URL using the following pattern:
    `https://github.com/enterprises/<ENTERPRISE-SLUG>/sso`

	> [!NOTE]
	> These values are not real. Update these values with the actual Sign on URL, Reply URL and Identifier. Contact [GitHub Enterprise Cloud - Enterprise Account Client support team](mailto:support@github.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

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

### Assign your Azure AD user and the test user account to the GitHub app

In this section, you'll enable `B.Simon` and your user account to use Azure single sign-on by granting access to GitHub Enterprise Cloud - Enterprise Account.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **GitHub Enterprise Cloud - Enterprise Account**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** and your user account from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Enable and Test SAML for the Enterprise Account and its organizations

To configure single sign-on on the **GitHub Enterprise Cloud - Enterprise Account** side, follow the steps listed in [this GitHub documentation](https://docs.github.com/en/free-pro-team@latest/github/setting-up-and-managing-your-enterprise/enforcing-security-settings-in-your-enterprise-account#enabling-saml-single-sign-on-for-organizations-in-your-enterprise-account). 
 - Sign in to GitHub.com with a user account that is an [enterprise account owner](https://docs.github.com/en/free-pro-team@latest/github/setting-up-and-managing-your-enterprise/roles-in-an-enterprise#enterprise-owner). 
 - Copy the value from the `Login URL` field in the app from the Azure portal and paste it in the `Sign on URL` field in the GitHub Enterprise Account SAML settings. 
 - Copy the value from the `Azure AD Identifier` field in the app from the Azure portal and paste it in the `Issuer` field in the GitHub Enterprise Account SAML settings. 
 - Copy the contents of the **Certificate (Base64)** file you downloaded in the steps above from Azure portal and paste them in the appropriate field in the GitHub Enterprise Account SAML settings. 
 - Click the `Test SAML configuration` and confirm that you are able to authenticate from the GitHub Enterprise Account to Azure AD successfully.
 - Once the test is successful, save the settings. 
 - After authenticating via SAML for the first time from the GitHub enterprise account, a _linked external identity_ will be created in the GitHub enterprise account that associates the signed in GitHub user account with the Azure AD user account.  
 
After you enable SAML SSO for your GitHub Enterprise Account, SAML SSO is enabled by default for all organizations owned by your Enterprise Account. All members will be required to authenticate using SAML SSO to gain access to the organizations where they are a member, and enterprise owners will be required to authenticate using SAML SSO when accessing an Enterprise Account.

## Test SSO with another enterprise account owner or organization member account

- Once the SAML integration is setup for the GitHub enterprise account (which also applies to the GitHub organizations in the enterprise account), enterprise account owners should be able to navigate to the GitHub enterprise account URL (`https://github.com/enterprises/<enterprise account>`), authenticate via SAML, and access the policies and settings under the GitHub enterprise account. 
- An organization owner for an organization in an enterprise account should be able to [invite a user to join their GitHub organization](https://docs.github.com/en/free-pro-team@latest/github/setting-up-and-managing-organizations-and-teams/inviting-users-to-join-your-organization). Sign in to GitHub.com with an organization owner account and follow the steps in the article to invite `B.Simon` to the organization. A GitHub user account will need to be created for `B.Simon` if one does not already exist. 
- To test GitHub organization access under the enterprise account with the `B.Simon` test user account:
  - Sign in to GitHub.com using the user account you would like to link to the `B.Simon` Azure AD user account.
  - Sign in to Azure AD using the `B.Simon` user account.
  - Navigate to the GitHub organization. The user should be prompted to authenticate via SAML. After successful SAML authentication, `B.Simon` should be able to access organization resources. 

## Additional resources

- [ List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory ](./tutorial-list.md)

- [What is application access and single sign-on with Azure Active Directory? ](../manage-apps/what-is-single-sign-on.md)

- [What is conditional access in Azure Active Directory?](../conditional-access/overview.md)

- [Try GitHub Enterprise Cloud - Enterprise Account with Azure AD](https://aad.portal.azure.com/)

- [What is session control in Microsoft Cloud App Security?](/cloud-app-security/proxy-intro-aad)

- [How to protect GitHub Enterprise Cloud - Enterprise Account with advanced visibility and controls](/cloud-app-security/proxy-intro-aad)

---
title: 'Tutorial: Azure Active Directory integration with Keeper Password Manager & Digital Vault | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Keeper Password Manager & Digital Vault.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 08/07/2020
ms.author: jeedes
---
# Tutorial: Azure Active Directory integration with Keeper Password Manager & Digital Vault

In this tutorial, you learn how to integrate Keeper Password Manager & Digital Vault with Azure Active Directory (Azure AD).
Integrating Keeper Password Manager & Digital Vault with Azure AD provides you with the following benefits:

* You can control in Azure AD who has access to Keeper Password Manager & Digital Vault.
* You can enable your users to be automatically signed-in to Keeper Password Manager & Digital Vault (Single Sign-On) with their Azure AD accounts.
* You can manage your accounts in one central location - the Azure portal.

If you want to know more details about SaaS app integration with Azure AD, see [What is application access and single sign-on with Azure Active Directory](../manage-apps/what-is-single-sign-on.md).
If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To configure Azure AD integration with Keeper Password Manager & Digital Vault, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get one-month trial [here](https://azure.microsoft.com/pricing/free-trial/)
* Keeper Password Manager & Digital Vault single sign-on enabled subscription

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Keeper Password Manager & Digital Vault supports **SP** initiated SSO

* Keeper Password Manager & Digital Vault supports **Just In Time** user provisioning

* Once you configure Keeper Password Manager & Digital Vault you can enforce Session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](/cloud-app-security/proxy-deployment-aad)

## Adding Keeper Password Manager & Digital Vault from the gallery

To configure the integration of Keeper Password Manager & Digital Vault into Azure AD, you need to add Keeper Password Manager & Digital Vault from the gallery to your list of managed SaaS apps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Keeper Password Manager & Digital Vault** in the search box.
1. Select **Keeper Password Manager & Digital Vault** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD SSO for Keeper Password Manager & Digital Vault

Configure and test Azure AD SSO with Keeper Password Manager & Digital Vault using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Keeper Password Manager & Digital Vault.

To configure and test Azure AD SSO with Keeper Password Manager & Digital Vault, complete the following building blocks::

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.

    * **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with Britta Simon.
    * **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable Britta Simon to use Azure AD single sign-on.

1. **[Configure Keeper Password Manager & Digital Vault SSO](#configure-keeper-password-manager--digital-vault-sso)** - to configure the Single Sign-On settings on application side.
    * **[Create Keeper Password Manager & Digital Vault test user](#create-keeper-password-manager--digital-vault-test-user)** - to have a counterpart of Britta Simon in Keeper Password Manager & Digital Vault that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

### Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the [Azure portal](https://portal.azure.com/), on the **Keeper Password Manager & Digital Vault** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the edit/pen icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the **Basic SAML Configuration** section, perform the following steps:

	a. In the **Sign on URL** text box, type a URL using the following pattern:
    * For **Cloud SSO** : `https://keepersecurity.com/api/rest/sso/saml/sso/<CLOUD_INSTANCE_ID>`
    * For **on-prem SSO** : `https://<KEEPER_FQDN>/sso-connect/saml/login`

    b. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:
    * For **Cloud SSO** : `https://keepersecurity.com/api/rest/sso/saml/<CLOUD_INSTANCE_ID>`
    * For **on-prem SSO** : `https://<KEEPER_FQDN>/sso-connect`

    c. In the **Reply URL** textbox, type a URL using the following pattern:
    * For **Cloud SSO** : `https://keepersecurity.com/api/rest/sso/saml/sso/<CLOUD_INSTANCE_ID>`
    * For **on-prem SSO** : `https://<KEEPER_FQDN>/sso-connect/saml/sso`

	> [!NOTE]
	> These values are not real. Update these values with the actual Sign on URL, Identifier and Reply URL. Contact [Keeper Password Manager & Digital Vault Client support team](https://keepersecurity.com/contact.html) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

5. On the **Set up Single Sign-On with SAML** page, in the **SAML Signing Certificate** section, click **Download** to download the **Federation Metadata XML** from the given options as per your requirement and save it on your computer.

	![The Certificate download link](common/metadataxml.png)

6. On the **Set up Keeper Password Manager & Digital Vault** section, copy the appropriate URL(s) as per your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Keeper Password Manager & Digital Vault.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Keeper Password Manager & Digital Vault**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.

   ![The "Users and groups" link](common/users-groups-blade.png)

1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.

	![The Add User link](common/add-assign-user.png)

1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting any role value in the SAML assertion, in the **Select Role** dialog, select the appropriate role for the user from the list and then click the **Select** button at the bottom of the screen.
1. In the **Add Assignment** dialog, click the **Assign** button.


## Configure Keeper Password Manager & Digital Vault SSO

To configure single sign-on on **Keeper Password Manager & Digital Vault Configuration** side, follow the guidelines given at [Keeper Support Guide](https://docs.keeper.io/sso-connect-guide/).

### Create Keeper Password Manager & Digital Vault test user

To enable Azure AD users to log in to Keeper Password Manager & Digital Vault, they must be provisioned into Keeper Password Manager & Digital Vault. Application supports Just in time user provisioning and after authentication users will be created in the application automatically. You can contact [Keeper Support](https://keepersecurity.com/contact.html), if you want to setup users manually.

## Test SSO

In this section, you test your Azure AD single sign-on configuration using the Access Panel.

When you click the Keeper Password Manager & Digital Vault tile in the Access Panel, you should be automatically signed in to the Keeper Password Manager & Digital Vault for which you set up SSO. For more information about the Access Panel, see [Introduction to the Access Panel](../user-help/my-apps-portal-end-user-access.md).

## Additional Resources

- [List of Tutorials on How to Integrate SaaS Apps with Azure Active Directory](./tutorial-list.md)

- [What is application access and single sign-on with Azure Active Directory?](../manage-apps/what-is-single-sign-on.md)

- [What is Conditional Access in Azure Active Directory?](../conditional-access/overview.md)

- [Try Keeper Password Manager & Digital Vault with Azure AD](https://aad.portal.azure.com/)

- [What is session control in Microsoft Cloud App Security?](/cloud-app-security/proxy-intro-aad)
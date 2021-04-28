---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with Terraform Enterprise | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Terraform Enterprise.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 04/05/2021
ms.author: jeedes
ms.custom: devx-track-terraform
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with Terraform Enterprise

In this tutorial, you'll learn how to integrate Terraform Enterprise with Azure Active Directory (Azure AD). When you integrate Terraform Enterprise with Azure AD, you can:

* Control in Azure AD who has access to Terraform Enterprise.
* Enable your users to be automatically signed-in to Terraform Enterprise with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Terraform Enterprise single sign-on (SSO) enabled subscription.

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Terraform Enterprise supports **SP** initiated SSO.
* Terraform Enterprise supports **Just In Time** user provisioning.

## Add Terraform Enterprise from the gallery

To configure the integration of Terraform Enterprise into Azure AD, you need to add Terraform Enterprise from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Terraform Enterprise** in the search box.
1. Select **Terraform Enterprise** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

## Configure and test Azure AD SSO for Terraform Enterprise

Configure and test Azure AD SSO with Terraform Enterprise using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Terraform Enterprise.

To configure and test Azure AD SSO with Terraform Enterprise, complete the following building blocks:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    * **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    * **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Terraform Enterprise SSO](#configure-terraform-enterprise-sso)** - to configure the single sign-on settings on application side.
    * **[Create Terraform Enterprise test user](#create-terraform-enterprise-test-user)** - to have a counterpart of B.Simon in Terraform Enterprise that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal on the **Terraform Enterprise** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, enter the values for the following fields:

	a. In the **Sign on URL** text box, type a URL using the following pattern:
    `https://<TFE HOSTNAME>/session`

    b. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:
    `https://<TFE HOSTNAME>/users/saml/metadata`

	> [!NOTE]
	> These values are not real. Update these values with the actual Sign on URL and Identifier. Contact [Terraform Enterprise Client support team](https://support.hashicorp.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. On the **Set up single sign-on with SAML** page, in the **SAML Signing Certificate** section,  find **Certificate (Base64)** and select **Download** to download the certificate and save it on your computer.

	![The Certificate download link](common/certificatebase64.png)

1. On the **Set up Terraform Enterprise** section, copy the appropriate URL(s) based on your requirement.

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Terraform Enterprise.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Terraform Enterprise**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Terraform Enterprise SSO

To configure single sign-on on **Terraform Enterprise** side, you need to send the downloaded **Certificate (Base64)** and appropriate copied URLs from Azure portal to [Terraform Enterprise support team](https://support.hashicorp.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Terraform Enterprise test user

In this section, a user called B.Simon is created in Terraform Enterprise. Terraform Enterprise supports just-in-time user provisioning, which is enabled by default. There is no action item for you in this section. If a user doesn't already exist in Terraform Enterprise, a new one is created after authentication.

## Test SSO

In this section, you test your Azure AD single sign-on configuration with following options. 

* Click on **Test this application** in Azure portal. This will redirect to Terraform Enterprise Sign-on URL where you can initiate the login flow. 

* Go to Terraform Enterprise Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Terraform Enterprise tile in the My Apps, this will redirect to Terraform Enterprise Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](https://docs.microsoft.com/azure/active-directory/active-directory-saas-access-panel-introduction).

## Next steps

Once you configure Terraform Enterprise you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Cloud App Security](https://docs.microsoft.com/cloud-app-security/proxy-deployment-any-app).
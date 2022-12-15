---
title: 'Tutorial: Azure AD SSO integration with Broker groupe Achat Solutions'
description: Learn how to configure single sign-on between Azure Active Directory and Broker groupe Achat Solutions.
services: active-directory
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

# Tutorial: Azure AD SSO integration with Broker groupe Achat Solutions

In this tutorial, you'll learn how to integrate Broker groupe Achat Solutions with Azure Active Directory (Azure AD). When you integrate Broker groupe Achat Solutions with Azure AD, you can:

* Control in Azure AD who has access to Broker groupe Achat Solutions.
* Enable your users to be automatically signed-in to Broker groupe Achat Solutions with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* Broker groupe Achat Solutions single sign-on (SSO) enabled subscription.
* Along with Cloud Application Administrator, Application Administrator can also add or manage applications in Azure AD.
For more information, see [Azure built-in roles](../roles/permissions-reference.md).

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a test environment.

* Broker groupe Achat Solutions supports **SP** initiated SSO.

> [!NOTE]
> Identifier of this application is a fixed string value so only one instance can be configured in one tenant.

## Add Broker groupe Achat Solutions from the gallery

To configure the integration of Broker groupe Achat Solutions into Azure AD, you need to add Broker groupe Achat Solutions from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Broker groupe Achat Solutions** in the search box.
1. Select **Broker groupe Achat Solutions** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. You can learn more about Office 365 wizards [here](/microsoft-365/admin/misc/azure-ad-setup-guides?view=o365-worldwide&preserve-view=true).

## Configure and test Azure AD SSO for Broker groupe Achat Solutions

Configure and test Azure AD SSO with Broker groupe Achat Solutions using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Broker groupe Achat Solutions.

To configure and test Azure AD SSO with Broker groupe Achat Solutions, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
   1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
   1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Broker groupe Achat Solutions SSO](#configure-broker-groupe-achat-solutions-sso)** - to configure the single sign-on settings on application side.
   1. **[Create Broker groupe Achat Solutions test user](#create-broker-groupe-achat-solutions-test-user)** - to have a counterpart of B.Simon in Broker groupe Achat Solutions that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Broker groupe Achat Solutions** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Screenshot shows to edit Basic SAML Configuration.](common/edit-urls.png "Basic Configuration")

1. On the **Basic SAML Configuration** section, perform the following steps:
   
   a. In the **Reply URL** text box, type the URL:
   `https://id.awsolutions.fr/auth/realms/awsolutions`

   b. In the **Sign-on URL** text box, type a URL using the following pattern:
   `https://app.marcoweb.fr/Marco?idp_hint=<INSTANCENAME>`
   
   > [!NOTE]
   > This value is not real. Update this value with the actual Sign-on URL. Contact [Broker groupe Achat Solutions Client support team](mailto:devops@achatsolutions.fr) to get the value. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. On the **Set up single sign-on with SAML** page, In the **SAML Signing Certificate** section, click copy button to copy **App Federation Metadata Url** and save it on your computer.

	![Screenshot shows the Certificate download link.](common/copy-metadataurl.png "Certificate")

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

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Broker groupe Achat Solutions.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Broker groupe Achat Solutions**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Broker groupe Achat Solutions SSO

To configure single sign-on on **Broker groupe Achat Solutions** side, you need to send the **App Federation Metadata Url** to [Broker groupe Achat Solutions support team](mailto:devops@achatsolutions.fr). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Broker groupe Achat Solutions test user

In this section, you create a user called Britta Simon at Broker groupe Achat Solutions. Work with [Broker groupe Achat Solutions support team](mailto:devops@achatsolutions.fr) to add the users in the Broker groupe Achat Solutions platform. Users must be created and activated before you use single sign-on.

## Test SSO 

In this section, you test your Azure AD single sign-on configuration with following options. 

* Click on **Test this application** in Azure portal. This will redirect to Broker groupe Achat Solutions Sign-on URL where you can initiate the login flow. 

* Go to Broker groupe Achat Solutions Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Broker groupe Achat Solutions tile in the My Apps, this will redirect to Broker groupe Achat Solutions Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

Once you configure Broker groupe Achat Solutions you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-any-app).
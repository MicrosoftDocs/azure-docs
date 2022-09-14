---
title: 'Tutorial: Azure Active Directory single sign-on (SSO) integration with Bizagi for Digital Process Automation | Microsoft Docs'
description: Learn how to configure single sign-on between Azure Active Directory and Bizagi for Digital Process Automation.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 08/27/2021
ms.author: jeedes
---

# Tutorial: Azure Active Directory single sign-on (SSO) integration with Bizagi for Digital Process Automation

In this tutorial, you'll learn how to integrate Bizagi for Digital Process Automation Services or Server with Azure Active Directory (Azure AD). When you integrate Bizagi for Digital Process Automation with Azure AD, you can:

* Control in Azure AD who has access to a Bizagi project for Digital Process Automation Services or Server.
* Enable your users to be automatically signed-in to a project of Bizagi for Digital Process AutomationServices or Server with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To get started, you need the following items:

* An Azure AD subscription. If you don't have a subscription, you can get a [free account](https://azure.microsoft.com/free/).
* A Bizagi project using Automation Services or Server. 
* Have your own certificates for SAML assertion signatures. This certificates must be generate in p12 or pfx format.
* Have a metadata file in XML format generated from the Bizagi project. 

## Scenario description

In this tutorial, you configure and test Azure AD SSO in a Bizagi project using Automation services or server.

* Bizagi for Digital Process Automation supports **SP** initiated SSO.
* Bizagi for Digital Process Automation supports [Automated user provisioning](bizagi-studio-for-digital-process-automation-provisioning-tutorial.md).

## Add Bizagi for Digital Process Automation from the gallery

To configure the integration of Bizagi for Digital Process Automation into Azure AD, you need to add Bizagi for Digital Process Automation from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Bizagi for Digital Process Automation** in the search box.
1. Select **Bizagi for Digital Process Automation** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, as well as walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for Bizagi for Digital Process Automation

Configure and test Azure AD SSO with Bizagi for Digital Process Automation using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in the Bizagi project.

To configure and test Azure AD SSO with Bizagi for Digital Process Automation, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Bizagi for Digital Process Automation SSO](#configure-bizagi-for-digital-process-automation-sso)** - to configure the single sign-on settings on application side.
    1. **[Create Bizagi for Digital Process Automation test user](#create-bizagi-for-digital-process-automation-test-user)** - to have a counterpart of B.Simon in Bizagi for Digital Process Automation that is linked to the Azure AD representation of user.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Bizagi for Digital Process Automation** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

1. On the **Basic SAML Configuration** section, perform the following steps:

    a. In the **Identifier (Entity ID)** text box, type a URL using the following pattern:
    `https://<COMPANY_NAME>.bizagi.com/<PROJECT_NAME>`

	b. In the **Sign on URL** text box, type a URL using the following pattern:
    `https://<COMPANY_NAME>.bizagi.com/<PROJECT_NAME>`

	> [!NOTE]
	> These values are not real. Update these values with the actual Identifier and Sign on URL. Contact [Bizagi for Digital Process Automation support team](mailto:jarvein.rivera@bizagi.com) to get these values. You can also refer to the patterns shown in the **Basic SAML Configuration** section in the Azure portal.

1. On the **Set up single sign-on with SAML** page, In the **SAML Signing Certificate** section, click copy button to copy **App Federation Metadata Url** and save it on your computer.

	![The Certificate download link](common/copy-metadataurl.png)
	
	This metadata URL must be registered in the authentication options of your Bizagi project.
	
1. On the **Set up single sign-on with SAML**page, click the pencil icon for **User Attributes & Claims** to edit the Unique User Identifier.
	
	Set the Unique User Identifier as the user.mail.

### Create an Azure AD test 

In this section, you'll create a test user in the Azure portal called B.Simon.

1. From the left pane in the Azure portal, select **Azure Active Directory**, select **Users**, and then select **All users**.
1. Select **New user** at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Name** field, enter `B.Simon`.  
   1. In the **User name** field, enter the username@companydomain.extension. For example, `B.Simon@contoso.com`.
   1. Select the **Show password** check box, and then write down the value that's displayed in the **Password** box.
   1. Click **Create**.

### Assign the Azure AD test user

In this section, you'll enable B.Simon to use Azure single sign-on by granting access to Bizagi for Digital Process Automation.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Bizagi for Digital Process Automation**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you are expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Bizagi for Digital Process Automation SSO

To configure single sign-on on **Bizagi for Digital Process Automation** side, you need to send the **App Federation Metadata Url** to [Bizagi for Digital Process Automation support team](mailto:jarvein.rivera@bizagi.com). They set this setting to have the SAML SSO connection set properly on both sides.

### Create Bizagi for Digital Process Automation test user

In this section, you create a user called Britta Simon in Bizagi for Digital Process Automation. Work with [Bizagi for Digital Process Automation support team](mailto:jarvein.rivera@bizagi.com) to add the users in the Bizagi for Digital Process Automation platform. Users must be created and activated before you use single sign-on.

Bizagi for Digital Process Automation also supports automatic user provisioning, you can find more details [here](./bizagi-studio-for-digital-process-automation-provisioning-tutorial.md) on how to configure automatic user provisioning.

## Test SSO

In this section, you test your Azure AD single sign-on configuration with following options. 

* Click on **Test this application** in Azure portal. This will redirect to Bizagi for Digital Process Automation Sign-on URL where you can initiate the login flow. 

* Go to Bizagi for Digital Process Automation Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Bizagi for Digital Process Automation tile in the My Apps, this will redirect to Bizagi for Digital Process Automation Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Next steps

Once you configure Bizagi for Digital Process Automation you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).

---
title: 'Tutorial: Azure Active Directory SSO integration with Infinite Campus'
description: Learn how to configure single sign-on between Azure Active Directory and Infinite Campus.
services: active-directory
author: jeevansd
manager: CelesteDG
ms.reviewer: celested
ms.service: active-directory
ms.subservice: saas-app-tutorial
ms.workload: identity
ms.topic: tutorial
ms.date: 03/07/2023
ms.author: jeedes
---
# Tutorial: Azure Active Directory SSO integration with Infinite Campus

In this tutorial, you learn how to integrate Infinite Campus with Azure Active Directory (Azure AD). When you integrate Infinite Campus with Azure AD, you can:

* Control in Azure AD who has access to Infinite Campus.
* Enable your users to be automatically signed-in to Infinite Campus with their Azure AD accounts.
* Manage your accounts in one central location - the Azure portal.

## Prerequisites

To configure Azure AD integration with Infinite Campus, you need the following items:

* An Azure AD subscription. If you don't have an Azure AD environment, you can get a [free account](https://azure.microsoft.com/free/).
* Infinite Campus single sign-on enabled subscription.
* At minimum, you need to be an Azure Active Directory administrator, and have a Campus Product Security Role of "Student Information System (SIS)" to complete the configuration.

## Scenario description

In this tutorial, you configure and test Azure AD single sign-on in a test environment.

* Infinite Campus supports **SP** initiated SSO.

## Add Infinite Campus from the gallery

To configure the integration of Infinite Campus into Azure AD, you need to add Infinite Campus from the gallery to your list of managed SaaS apps.

1. Sign in to the Azure portal using either a work or school account, or a personal Microsoft account.
1. On the left navigation pane, select the **Azure Active Directory** service.
1. Navigate to **Enterprise Applications** and then select **All Applications**.
1. To add new application, select **New application**.
1. In the **Add from the gallery** section, type **Infinite Campus** in the search box.
1. Select **Infinite Campus** from results panel and then add the app. Wait a few seconds while the app is added to your tenant.

 Alternatively, you can also use the [Enterprise App Configuration Wizard](https://portal.office.com/AdminPortal/home?Q=Docs#/azureadappintegration). In this wizard, you can add an application to your tenant, add users/groups to the app, assign roles, and walk through the SSO configuration as well. [Learn more about Microsoft 365 wizards.](/microsoft-365/admin/misc/azure-ad-setup-guides)

## Configure and test Azure AD SSO for Infinite Campus

Configure and test Azure AD SSO with Infinite Campus using a test user called **B.Simon**. For SSO to work, you need to establish a link relationship between an Azure AD user and the related user in Infinite Campus.

To configure and test Azure AD SSO with Infinite Campus, perform the following steps:

1. **[Configure Azure AD SSO](#configure-azure-ad-sso)** - to enable your users to use this feature.
    1. **[Create an Azure AD test user](#create-an-azure-ad-test-user)** - to test Azure AD single sign-on with B.Simon.
    1. **[Assign the Azure AD test user](#assign-the-azure-ad-test-user)** - to enable B.Simon to use Azure AD single sign-on.
1. **[Configure Infinite Campus SSO](#configure-infinite-campus-sso)** - to configure the single sign-on settings on application side.
1. **[Test SSO](#test-sso)** - to verify whether the configuration works.

## Configure Azure AD SSO

Follow these steps to enable Azure AD SSO in the Azure portal.

1. In the Azure portal, on the **Infinite Campus** application integration page, find the **Manage** section and select **single sign-on**.
1. On the **Select a single sign-on method** page, select **SAML**.
1. On the **Set up single sign-on with SAML** page, click the pencil icon for **Basic SAML Configuration** to edit the settings.

   ![Edit Basic SAML Configuration](common/edit-urls.png)

4. On the Basic SAML Configuration section, perform the following steps (note that the domain varies with Hosting Model, but the **FULLY-QUALIFIED-DOMAIN** value must match your Infinite Campus installation):

	a. In the **Sign-on URL** textbox, type a URL using the following pattern: `https://<DOMAIN>.infinitecampus.com/campus/SSO/<DISTRICTNAME>/SIS`

	b. In the **Identifier** textbox, type a URL using the following pattern: `https://<DOMAIN>.infinitecampus.com/campus/<DISTRICTNAME>`

	c. In the **Reply URL** textbox, type a URL using the following pattern: `https://<DOMAIN>.infinitecampus.com/campus/SSO/<DISTRICTNAME>`

5. On the **Set up Single Sign-On with SAML** page, In the **SAML Signing Certificate** section, click copy button to copy **App Federation Metadata Url** and save it on your computer.

	![The Certificate download link](common/copy-metadataurl.png)

### Create an Azure AD test user

In this section, you create a test user in the Azure portal called B.Simon.

1. From the left pane in the Azure portal, select **Azure Active Directory**, select **Users**, and then select **All users**.
1. Select **New user** at the top of the screen.
1. In the **User** properties, follow these steps:
   1. In the **Name** field, enter `B.Simon`.  
   1. In the **User name** field, enter the username@companydomain.extension. For example, `B.Simon@contoso.com`.
   1. Select the **Show password** check box, and then write down the value that's displayed in the **Password** box.
   1. Click **Create**.

### Assign the Azure AD test user

In this section, you enable B.Simon to use Azure single sign-on by granting access to Infinite Campus.

1. In the Azure portal, select **Enterprise Applications**, and then select **All applications**.
1. In the applications list, select **Infinite Campus**.
1. In the app's overview page, find the **Manage** section and select **Users and groups**.
1. Select **Add user**, then select **Users and groups** in the **Add Assignment** dialog.
1. In the **Users and groups** dialog, select **B.Simon** from the Users list, then click the **Select** button at the bottom of the screen.
1. If you're expecting a role to be assigned to the users, you can select it from the **Select a role** dropdown. If no role has been set up for this app, you see "Default Access" role selected.
1. In the **Add Assignment** dialog, click the **Assign** button.

## Configure Infinite Campus SSO

For detailed steps on how to configure SSO within Infinite Campus, [please follow the steps in this document](https://kb.infinitecampus.com/help/sso-service-provider-configuration#SSOServiceProviderConfiguration-EnableandConfigureSAMLSSOFunctionality).

Once you have completed configuring SSO within Infinite Campus, if you would like users to be signed out their Azure SSO connection when logging out of Infinite Campus, [follow these steps](https://kb.infinitecampus.com/help/sso-service-provider-configuration#SSOServiceProviderConfiguration-AddtheInfiniteCampusLogoutURLtotheMicrosoftAzureSAMLSSOConfiguration).

## Test SSO

In this section, you test your Azure AD single sign-on configuration with following options. 

* Click on **Test this application** in Azure portal. This will redirect to Infinite Campus Sign-on URL where you can initiate the login flow. 

* Go to Infinite Campus Sign-on URL directly and initiate the login flow from there.

* You can use Microsoft My Apps. When you click the Infinite Campus tile in the My Apps, this will redirect to Infinite Campus Sign-on URL. For more information about the My Apps, see [Introduction to the My Apps](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510).

## Configure Azure SSO for Non-Production Infinite Campus Environments (Sandbox, Staging)

If your district has other Infinite Campus environments, this entire setup process must be repeated for each environment. For example, if your district has an Infinite Campus sandbox site, add the Infinite Campus app from the gallery again and complete the process while referencing the SSO Service Provider Configuration screen within your Infinite Campus sandbox site. If your district also has, for example, an Infinite Campus staging site, you need to complete this process a third time.

See Infinite Campus [documentation](https://kb.infinitecampus.com/help/sso-service-provider-configuration#sandbox/staging/non-production-environments) for more information about this process. 

## Replacing an Expiring SAML Certificate

The SAML certificate of this integration relies on which eventually need to be renewed so users can continue logging into Infinite Campus through single sign-on. For districts with proper Campus Messenger Email Settings established, Infinite Campus sends warning emails as the certificate expiration approaches. (Subject: "Action required: Your certificate is expiring.") 

These are the steps to take to replace an expiring SAML certificate: 
1. Have your district's Microsoft Azure Active Directory admin sign in to the Azure portal.
1.	On the left navigation pane, select the Azure Active Directory service.
1.	Navigate to Enterprise Applications and select your Infinite Campus application set up previously. (If you have multiple Infinite Campus environments like a sandbox or staging site, you have multiple Infinite Campus applications set up here. You need to complete this process in each respective Infinite Campus environment for any with an expiring certificate.)
1.	Select Single sign-on.
1.	Navigate to the SAML Certificate and copy the App Federation Metadata URL.
1.	Within Infinite Campus, navigate to the SSO Service Provider Configuration tool, select the configuration, and paste the App Federation Metadata URL copied in the previous step into the Metadata URL field.
1.	In a separate window, go back to the Azure portal. Under SAML Certificates, in the Token Signing Certificate area, select Edit.
1.	Select New Certificate. Modify the expiration date if desired. 
1.	Select Save. (Leave the Signing Option and Signing Algorithm as-is)
1.	Return to the Infinite Campus window and click the Sync button next to the Metadata URL. It says "IDP Synchronization successful". Select OK and Save.
1.	Return to the Azure portal, still on the SAML Signing Certificate edit screen, select the three dots (...) next to the new certificate. Select Make Certificate Active and click Save.
1.	Select the three dots next to the old certificate. Select Delete Certificate.
1.	Return to Infinite Campus and hit the Sync button next to the Metadata URL again. It says "IDP Synchronization successful" again. Hit OK and Save again.

This completes the process of replacing an expiring certificate. For more information, see Infinite Campus [documentation](https://kb.infinitecampus.com/help/sso-service-provider-configuration#SSOServiceProviderConfiguration-CertificateExpirationWarnings).

## Next steps

Once you configure Infinite Campus you can enforce session control, which protects exfiltration and infiltration of your organization’s sensitive data in real time. Session control extends from Conditional Access. [Learn how to enforce session control with Microsoft Defender for Cloud Apps](/cloud-app-security/proxy-deployment-aad).

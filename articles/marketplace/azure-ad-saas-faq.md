---
title: Azure AD authentication FAQs for transactable SaaS offers
description: Frequently asked Azure AD authentication questions for transactable SaaS offers in the commercial marketplace
author: mingshen-ms 
ms.author: mingshen
ms.reviewer: dannyevers 
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 07/10/2020
---

# Common Azure AD authentication questions for transactable SaaS offers

This article answers commonly asked Azure Active Directory (Azure AD) authentication questions for transactable software as a service (SaaS) offers in the Microsoft commercial marketplace.

## What do I do if I’m not using Azure AD?

You need to have an [app registration on Azure AD](./partner-center-portal/pc-saas-registration.md#register-an-azure-ad-secured-app), and that app’s Azure AD tenant ID and Application ID must be part of the offer’s technical configuration to be able to call the fulfillment and metering service APIs.

The landing page also needs to log users on with Azure AD, according to the [authentication options policy](https://aka.ms/commercial-marketplace-certification-policies#10003-authentication-options). The app that signs users in may also ask for their consent to access other resources, such as the Microsoft Graph API, on their behalf.

## What if I’m using SSO from another identity provider?

To take advantage of the benefits of Azure AD, you need to add it as a provider. Benefits include the following:
- Streamline the customer experience from marketplace to trial.
- Automate the creation of the buyer’s account in your domain. This decreases the risk of abandonment improves the time-to-value.
- Reduce deployment barriers for the large population of Azure AD users.

For more information, see [Using Azure Active Directory to enable trials](marketplace-saas-applications-technical-publishing-guide.md#using-azure-active-directory-to-enable-trials).

## How do I ensure I’ve configured Azure AD correctly?

To verify your configuration, work through these five checkpoints.

1. Confirm that the application that hosts your landing page is registered with Azure AD. Check with your administrator that the landing page is using the correct [Application ID and client secret](https://docs.microsoft.com/azure/active-directory/develop/quickstart-register-app).
2. Verify that your app’s landing page URI is configured properly. In Partner Center, review your [landing page URL](./partner-center-portal/create-new-saas-offer.md#technical-configuration) on the **Technical configuration** tab of your offer in Partner Center.  
3. Test that your landing page is enabled for sign-in. Using a non-administrator account, follow the link to your landing page. The page is properly enabled if it requests that you go through the Azure AD sign-in process. If it doesn’t, refer to the quickstart documentation linked from the Azure AD app registration.
4. Check that your app is enabled for multitenant Azure AD access, including personal Microsoft accounts. Go to your application’s [authentication page](https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/Authentication/appId/[app_id]/isMSAApp/) in the Azure portal, and then select one of the multitenant options. 

   > [!TIP]
   > If your app doesn’t accept login requests from Skype or Xbox, then select **Accounts in any organizational directory (Any Azure AD directory – Multitenant)**.

   If your application was already configured as multi-tenant but with no personal Microsoft accounts, you may need to use the manifest editor to make this change.

1. Review the permissions your app requires. Navigate to your application’s [API permissions page](https://ms.portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationMenuBlade/CallAnAPI/appId/%5Bapp_id%5D/isMSAApp/) in the Azure portal, and then confirm that you’ve selected only the minimum required [permissions](https://docs.microsoft.com/azure/active-directory/develop/perms-for-given-api). Make sure that those permissions don’t require administrator approval unless the app requires administrator consent.

## Next steps

- [Azure AD and transactable SaaS offers in the commercial marketplace](./azure-ad-saas.md)

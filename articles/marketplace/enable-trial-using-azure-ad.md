---
title: Enable a trial in the Azure Marketplace by using Azure Active Directory | Azure
description: Enable a Trial listing type by using Azure Active Directory in the Azure Marketplace and AppSource for app and service publishers.
services: Azure, Marketplace, Compute, Storage, Networking, Blockchain, Security
documentationcenter:
author: jm-aditi-ms
manager: pabutler
editor:

ms.assetid: 
ms.service: marketplace
ms.workload: 
ms.tgt_pltfrm: 
ms.devlang: 
ms.topic: article
ms.date: 06/04/2018
ms.author: ellacroi

---

# Enable a trial listing by using Azure Active Directory

Azure Active Directory (Azure AD) is a cloud identity service that enables authentication with a Microsoft work or school account by using industry-standard frameworks. Azure AD supports OAuth and OpenID Connect authentication. The [Azure Marketplace](https://azuremarketplace.microsoft.com) uses Azure AD to authenticate you and your customers.

For more information about Azure AD, see [Azure Active Directory](https://azure.microsoft.com/services/active-directory).

After a customer selects your trial listing in the Marketplace, your customer is redirected to your trial environment. In your trial environment, you can set up your customer directly without requiring additional sign-in steps. Your app or offer receives a token from Azure AD during authentication. The token includes valuable user information that's used to create a user account in your app or offer. You can automate customer setup and increase the likelihood of conversion.

For more information about the token that's sent from Azure AD during authentication, see [Sample tokens](https://docs.microsoft.com/azure/active-directory/develop/active-directory-token-and-claims#sample-tokens).

Use Azure AD to enable one-click authentication in your app or trial. Azure AD gives you the following benefits: 
*   Streamline the customer experience from the Marketplace to trial.
*   Maintain the feel of an in-product experience, even when the user is redirected from the Marketplace to your domain or trial environment.
*   Reduce the likelihood of abandonment upon redirect, because there are no additional sign-in steps.
*   Reduce deployment barriers for the large population of Azure AD users.

## Verify your Azure AD integration in the Marketplace: Multitenant apps
Use Azure AD to support the following options for your solution:
*   Register your app in storefronts in the Marketplace.
*   Enable the multitenancy support feature in Azure AD to get a one-click trial experience.

For more information about app registration, see [Integrating applications with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/develop/active-directory-integrating-applications).

If you are new to using Azure AD federated single sign-on (SSO), complete these steps:
1.  Register your app in the Marketplace. 
2.  Develop SSO with Azure AD by using OAuth 2.0 or OpenID Connect.
    *   For more information about OAuth 2.0, see [OAuth 2.0](https://docs.microsoft.com/azure/active-directory/develop/active-directory-protocols-oauth-code).
    *   For more information about Open ID Connect, see [OpenID Connect](https://docs.microsoft.com/azure/active-directory/develop/active-directory-protocols-openid-connect-code).
3.  Enable the multitenancy support feature in Azure AD to provide a one-click trial experience.
    
    For more information about AppSource certification, see [AppSource certification](https://docs.microsoft.com/azure/active-directory/develop/active-directory-devhowto-appsource-certified). 

## Verify your Azure AD integration in the Marketplace: Single-tenant apps
Use Azure AD to support one of the following options for your single-tenant solution: 
*   Add users to your directory as guest users by using Azure Active Directory B2B (Azure AD B2B).
    
    For more information about Azure AD B2B, see [What is Azure AD B2B collaboration](https://docs.microsoft.com/azure/active-directory/active-directory-b2b-what-is-azure-ad-b2b).
*   Manually set up trials for customers by using the Contact Me publishing option.
*   Develop a per-customer test drive.
*   Build a multitenant sample demo app that uses SSO.

## Next steps
*   Review the [Azure Marketplace and AppSource publishing guide](./marketplace-publishers-guide.md).

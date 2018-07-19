---  
title: Enable Trial using Azure AD | Azure
description: Enable Trial listing type using Azure Active Directory (Azure AD) in Azure Marketplace and AppSource for app and service publishers
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

# Enable Trial using Azure AD  
Azure Active Directory (Azure AD) is a cloud identity service that enables authentication with a Microsoft work or school account by using industry-standard frameworks: OAuth and OpenID Connect.  
*   For more information about Azure AD, visit the Azure Active Directory page located at [azure.microsoft.com/services/active-directory](https://azure.microsoft.com/services/active-directory).  

You and your customers are authenticated on the marketplace using Azure AD. After your customer selects your trial listing on the marketplace, your customer is redirected to your trial environment.  In your trial environment, you may set up your customer directly without requiring additional sign-in steps. Your app or offer receives a token from Azure AD during authentication that includes valuable user information for creating a user account in your app or offer. You may automate your set-up and increase the likelihood of conversion.  
*   For more information about the token sent from Azure AD during authentication, visit the Sample Tokens section located at [docs.microsoft.com/azure/active-directory/develop/active-directory-token-and-claims#sample-tokens](https://docs.microsoft.com/azure/active-directory/develop/active-directory-token-and-claims#sample-tokens)

Use Azure AD to enable one-click authentication in your app or trial.  
*   Streamline the customer experience from marketplace to trial.  
*   Maintain the feel of an in-product experience, even when the user is redirected from the Marketplace to your domain or trial environment.  
*   Reduce the likelihood of abandonment on redirect, because there are no additional sign-in steps.  
*   Reduce deployment barriers for the large population of Azure AD users.  

## Verify Your Azure AD Integration on the marketplace: Multitenant Apps  
Support the following options for your solution using Azure AD.  
*   Register your app in the storefronts on the marketplace.  
*   Enable the multitenancy support feature in Azure AD to get a one-click trial experience.  
    *   For more information about app registration, visit the Integrating applications with Azure Active Directory page located at [docs.microsoft.com/azure/active-directory/develop/active-directory-integrating-applications](https://docs.microsoft.com/azure/active-directory/develop/active-directory-integrating-applications).  

If you are new to using Azure AD federated single sign-on (SSO), then follow these steps.  
1.  Register your app on the marketplace. 
2.  Develop SSO with Azure AD by using OAuth 2.0 or OpenID Connect.  
    *   For more information about OAuth 2.0, visit the OAuth 2.0 page located at [docs.microsoft.com/azure/active-directory/develop/active-directory-protocols-oauth-code](https://docs.microsoft.com/azure/active-directory/develop/active-directory-protocols-oauth-code).  
    *   For more information about Open ID Connect, visit the OpenID Connect page located at [docs.microsoft.com/azure/active-directory/develop/active-directory-protocols-openid-connect-code](https://docs.microsoft.com/azure/active-directory/develop/active-directory-protocols-openid-connect-code).  
3.  Enable the multitenancy support feature in Azure AD to provide a one-click trial experience.  
    *   For more information about AppSource certification, visit the AppSource certification page located at [docs.microsoft.com/azure/active-directory/develop/active-directory-devhowto-appsource-certified](https://docs.microsoft.com/azure/active-directory/develop/active-directory-devhowto-appsource-certified). 

## Verify Your Azure AD Integration on the marketplace: Single-Tenant Apps  
Support one of the following options for your single-tenant solution.  
*   Add users to your directory as guest users by using Azure AD B2B.  
    *   For more information about Azure AD B2B, visit the What is Azure AD B2B collaboration page located at [docs.microsoft.com/azure/active-directory/active-directory-b2b-what-is-azure-ad-b2b](https://docs.microsoft.com/azure/active-directory/active-directory-b2b-what-is-azure-ad-b2b).
*   Manually set up trials for customers using Contact Me.  
*   Develop a per-customer test drive.  
*   Build a multitenant sample demo app with SSO.  

## Next steps
*   Visit the [Azure Marketplace and AppSource Publisher Guide](./marketplace-publishers-guide.md) page.  
 
---  


---
title: Enable a Microsoft AppSource and Azure Marketplace listing by using Azure Active Directory | Azure
description: Enable a listing type by using Azure Active Directory in the Azure Marketplace and AppSource for app and service publishers.
services: Azure, AppSource, Marketplace, Compute, Storage, Networking, Blockchain, Security
documentationcenter:
author: qianw211
manager: pabutler
editor:

ms.assetid: 
ms.service: marketplace
ms.workload: 
ms.tgt_pltfrm: 
ms.devlang: 
ms.topic: article
ms.date: 09/12/2018
ms.author: qianw211

---
# Enable a Microsoft AppSource and Azure Marketplace listing by using Azure Active Directory

Microsoft Azure Active Directory (Azure AD) is a cloud identity service that enables authentication with a Microsoft account by using industry-standard frameworks.  For more information about Azure AD, see [Azure Active Directory](https://azure.microsoft.com/services/active-directory).

## Benefits of using Azure Active Directory

Microsoft AppSource and Azure Marketplace customers use in-product experiences to search the listing catalogs, which will require them to sign-in to the product.  By integrating your application with Azure AD, you can expedite engagement and optimize the customer experience. Azure AD:

- Enables single sign-on (SSO) for millions of enterprise users.
- Enables consistent user sign-on experience across applications published by different partners.
- Provides scalable, cross-platform authentication for your mobile and cloud apps.

As detailed in the section below, certain offers are required to implement Azure AD to publish to Marketplace.

## Azure Active Directory Requirements by listing options and offer types

There are different [listing options and offer types](https://docs.microsoft.com/en-us/azure/marketplace/determine-your-listing-type) for Microsoft AppSource and Azure Marketplace.  Azure AD requirements for these listing options and offer types are shown below:

| **Offer Type**    | **AAD SSO Required?**  |  |   |  |
| :------------------- | :-------------------|:-------------------|:-------------------|:-------------------|
|  | Contact Me | Trial	| Test Drive | Transact |
| Virtual Machine | N/A | No | No | No |
| Azure Apps (solution template)  | N/A | N/A | N/A | N/A |
| Managed Apps  | N/A | N/A | N/A | No |
| SaaS  | No | Yes | Yes | Yes |
| Containers  | N/A | N/A | N/A | No |
| Consulting Services  | No | N/A | N/A | N/A |

For more information about SaaS technical requirements, see [SaaS applications Offer Publishing Guide](https://docs.microsoft.com/en-us/azure/marketplace/marketplace-saas-applications-technical-publishing-guide).

## Integration with Azure Active Directory

For information on how to integrate with Azure AD to enable SSO, visit https://aka.ms/aaddev.

For more information about Azure AD SSO, see [What is application access and single sign-on with Azure Active Directory](https://docs.microsoft.com/en-us/azure/active-directory/manage-apps/what-is-single-sign-on)?

## Enable a trial listing by using Azure Active Directory

After a customer selects your trial listing in the Marketplace, your customer is redirected to your trial environment. In your trial environment, you can set up your customer directly without requiring additional sign-in steps. Your app or offer receives a token from Azure AD during authentication. The token includes valuable user information that's used to create a user account in your app or offer. You can automate customer setup and increase the likelihood of conversion.

For more information about the token that's sent from Azure AD during authentication, see [Sample tokens](https://docs.microsoft.com/azure/active-directory/develop/active-directory-token-and-claims#sample-tokens).

Use Azure AD to enable one-click authentication in your app or trial. Azure AD gives you the following benefits: 
*   Streamline the customer experience from the Marketplace to trial.
*   Maintain the feel of an in-product experience, even when the user is redirected from the Marketplace to your domain or trial environment.
*   Reduce the likelihood of abandonment upon redirect, because there are no additional sign-in steps.
*   Reduce deployment barriers for the large population of Azure AD users.

### Verify your Azure AD integration in the Marketplace: Multitenant apps
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

### Verify your Azure AD integration in the Marketplace: Single-tenant apps
Use Azure AD to support one of the following options for your single-tenant solution: 
*   Add users to your directory as guest users by using Azure Active Directory B2B (Azure AD B2B). For more information about Azure AD B2B, see [What is Azure AD B2B collaboration](https://docs.microsoft.com/azure/active-directory/active-directory-b2b-what-is-azure-ad-b2b).
*   Manually set up trials for customers by using the Contact Me publishing option.
*   Develop a per-customer test drive.
*   Build a multi-tenant sample demo app that uses SSO.

## Next steps

If you haven't already done so, 
- [Register](https://azuremarketplace.microsoft.com/sell) in the marketplace.

If you're registered and are creating a new offer or working on an existing one,
- [Log in to Cloud Partner Portal](https://cloudpartner.azure.com/) to create or complete your offer.


---
title: Integrate your Microsoft commercial marketplace offer with Azure Active Directory
description: Use Azure Active Directory to authenticate your Microsoft AppSource and Azure Marketplace offers.
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
author: keferna
ms.author: keferna
ms.date: 07/24/2020
---
# Integrate your commercial marketplace listing with Azure Active Directory

 This article explains requirements for integrating a commercial marketplace listing or offer with Azure Active Directory (Azure AD). Azure AD is a cloud identity service that uses industry-standard frameworks to enable authentication with a Microsoft account. [Learn more about Azure Active Directory](https://azure.microsoft.com/services/active-directory).

## Azure AD benefits

Microsoft AppSource and Azure Marketplace customers use in-product experiences to search online store listing catalogs. These actions require customers to sign in to the product. Azure AD integration provides the following benefits:

- Faster engagement and an optimized customer experience
- Single sign-on (SSO) for millions of enterprise users
- Consistent, sign-in experience across applications published by different partners
- Scalable, cross-platform authentication for mobile and cloud apps

## Offers that require Azure AD

The various commercial marketplace [listing options and offer types](determine-your-listing-type.md) have different requirements for Azure AD implementation. See the following table for details.

| Offer type    | Azure AD SSO required for Contact Me?  | Azure AD SSO required for Trial? | Azure AD SSO required for Test Drive?  | Azure AD SSO required for Transact |
| :------------------- | :-------------------|:-------------------|:-------------------|:-------------------|
| Virtual Machine | N/A | No | No | No |
| Azure Apps (solution template)  | N/A | N/A | N/A | N/A |
| Managed Apps  | N/A | N/A | N/A | No |
| SaaS  | No | Yes | Yes | Yes |
| Containers  | N/A | N/A | N/A | No |
| Consulting Services  | No | N/A | N/A | N/A |

For more information about SaaS technical requirements, see [Azure AD and transactable SaaS offers in the commercial marketplace](./azure-ad-saas.md).

## Azure AD integration

- For details about how to integrate Azure AD for your transactable software as a service (SaaS) offers, see [Azure AD and transactable SaaS offers in the commercial marketplace](./azure-ad-saas.md).
- For information on how to enable single sign-on by integrating Azure AD into your listing, see [Azure Active Directory for developers](../active-directory/develop/index.yml).
- To get details about Azure AD single sign-on, see [What is application access and single sign-on with Azure Active Directory?](../active-directory/manage-apps/what-is-single-sign-on.md).

## Enable a trial listing

Automated customer setup can increase the likelihood of conversion. When your customer selects your trial listing and is redirected to your trial environment, you can set up the customer directly without requiring additional sign-in steps.

During authentication, Azure AD sends a token to your app or offer. The user information provided by the token enables the creation of a user account in your app or offer. To learn more, see [Sample tokens](../active-directory/develop/id-tokens.md).

When you use Azure AD to enable one-click authentication in your app or trial listing, you:

- Streamline the customer experience from the commercial marketplace to your trial listing.
- Maintain the feel of an in-product experience even when the user is redirected from the commercial marketplace to your domain or trial environment.
- Reduce the likelihood of abandonment when users are redirected because there are no additional sign-in steps.
- Reduce deployment barriers for the large population of Azure AD users.

## Verify Azure AD integration

### Multitenant solutions

Use Azure AD to support the following actions:

- Register your app in one of the commercial marketplace online stores. View [App registration](../active-directory/develop/quickstart-register-app.md) or [AppSource certification](../active-directory/azuread-dev/howto-get-appsource-certified.md) for more information.
- Enable the multitenancy support feature in Azure AD to get a one-click trial experience.

If you're new to using Azure AD federated single sign-on, take these steps:

1. Register your app in the commercial marketplace.
1. Develop SSO with Azure AD by using [OAuth 2.0](../active-directory/azuread-dev/v1-protocols-oauth-code.md) or [OpenID Connect](../active-directory/azuread-dev/v1-protocols-openid-connect-code.md).
1. Enable the multitenancy support feature in Azure AD to provide a one-click trial experience.

### Single-tenant solutions

Use Azure AD to support one of the following actions:

- Add guest users to your directory by using [Azure AD B2B](../active-directory/b2b/what-is-b2b.md).
- Manually set up trials for customers by using the **Contact Me** publishing option.
- Develop a per-customer test drive.
- Build a multi-tenant sample demo app that uses SSO.

## Next steps

If you haven't already done so, 

- [Learn](https://azuremarketplace.microsoft.com/sell) about the commercial marketplace.

To register in Partner Center, start creating a new offer or working on an existing one:

- [Sign in to Partner Center](https://partner.microsoft.com/dashboard/account/v3/enrollment/introduction/partnership) to create or complete your offer.

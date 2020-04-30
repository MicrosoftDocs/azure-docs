---
title: Publishing guide for SaaS applications in Azure Marketplace
description: A step-by-step guide and checklist for publishing SaaS applications to Azure Marketplace.
services: Marketplace, Compute, Storage, Networking, Blockchain, Security, SaaS
author: dsindona
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 04/23/2020
ms.author: dsindona
---

# Publishing guide for SaaS applications offers

You can publish software as a service (SaaS) applications in Azure Marketplace with three different calls to action: *Contact Me*, *Try it Now*, and *Get it Now*. This guide explains these call-to-action options, including the requirements for each. 

## Offer overview  

SaaS applications are available in Microsoft AppSource and Azure Marketplace.  Both storefronts support *List*, *Trial*, and *Transaction* offers.

* **List**:  The *List* publishing option consists of a *Contact Me* offer type and is used when a *Trial*-level or *Transaction*-level participation is not feasible. The benefit of this approach is that it enables publishers with a solution in-market to immediately begin receiving leads that can be turned into deals to increase your business.

* **Trial or Transaction**:  The customer has the option to directly buy or request a trial for your solution. Providing a *Trial* experience increases the engagement level that's offered to customers and enables them to explore your solution before they buy. With a Trial experience, you will have better chances of promotion in the storefronts, and you should expect more and richer leads from customer engagements. Trials must include free support for at least the duration of the trial period.  

| SaaS application offer | Business requirement | Technical requirement |  
| --- | --- | --- |  
| Contact Us | Yes | No |  
| Power BI or Dynamics 365 | Yes | Yes, Azure Active Directory (Azure AD) integration |  
| SaaS applications| Yes | Yes, Azure AD integration |     

## SaaS List

The call to action for a SaaS listing with no trial and no billing functionality is *Contact Me*. 

You don't need to configure Azure Active Directory to list a SaaS application. 

|Requirements  |Details  |
|---------|---------|
|Your application is a SaaS offering.  |   Your solution is a SaaS offering and you offer a multi-tenant SaaS product.      |


## SaaS Trial

You provide a solution or application with a free-to-try, software as a service (SaaS)-based trial. You can present free trial offers as a limited-use or limited-duration trial account. 


|Requirements  |Details  |
|---------|---------|
|Your application is a SaaS offering.  |   Your solution is a SaaS offering and you offer a multi-tenant SaaS product.      |
|Your application is Azure AD-enabled.     |   Customers are redirected to your domain, and you transact with them directly.       |


## SaaS Trial technical requirements

The technical requirements for SaaS applications are simple. To have your offers published, you're required only to be integrated with Azure AD. Azure AD integration with applications is well documented, and Microsoft provides multiple SDKs and resources for this purpose.  

To start, we recommend that you have a subscription that's dedicated to Azure Marketplace publishing, which lets you isolate this work from other initiatives. After this is done, you can start deploying your SaaS application in this subscription to start the development work.  

For the best Azure AD documentation, samples, and guidance, see: 

* [Azure AD developer's guide](https://docs.microsoft.com/azure/active-directory/develop/active-directory-developers-guide)

* [Integrating with Azure AD](https://docs.microsoft.com/azure/active-directory/develop/active-directory-how-to-integrate)

* [Integrating applications with Azure AD](https://docs.microsoft.com/azure/active-directory/develop/active-directory-integrating-applications)

* [Azure roadmap: Security and identity](https://azure.microsoft.com/roadmap/?category=security-identity)

For video tutorials, see:

* [Azure Active Directory Authentication with Vittorio Bertocci](https://channel9.msdn.com/Shows/XamarinShow/Episode-27-Azure-Active-Directory-Authentication-with-Vittorio-Bertocci?term=azure%20active%20directory%20integration)

* [Azure Active Directory Identity Technical Briefing - Part 1 of 2](https://channel9.msdn.com/Blogs/MVP-Enterprise-Mobility/Azure-Active-Directory-Identity-Technical-Briefing-Part-1-of-2?term=azure%20active%20directory%20integration)

* [Azure Active Directory Identity Technical Briefing - Part 2 of 2](https://channel9.msdn.com/Blogs/MVP-Azure/Azure-Active-Directory-Identity-Technical-Briefing-Part-2-of-2?term=azure%20active%20directory%20integration)

* [Building Apps with Microsoft Azure Active Directory](https://channel9.msdn.com/Blogs/Windows-Development-for-the-Enterprise/Building-Apps-with-Microsoft-Azure-Active-Directory?term=azure%20active%20directory%20integration)

* [Microsoft Azure Videos focused on Active Directory](https://azure.microsoft.com/resources/videos/index/?services=active-directory)

For free Azure AD training, see:  
* [Microsoft Azure for IT Pros Content Series: Azure Active Directory](https://mva.microsoft.com/training-courses/microsoft-azure-for-it-pros-content-series-azure-active-directory-16754?l=N0e23wtxC_2106218965)

To check for Azure AD service updates, see:   
* [Azure AD service updates](https://azure.microsoft.com/updates/?product=active-directory)

## Use Azure Active Directory to enable trials  

Microsoft authenticates all Azure Marketplace users with Azure AD. When authenticated customers click through your Trial listing in Azure Marketplace and are redirected to your Trial environment, you can set up their Trial without requiring an additional sign-in step. 

The token that your application receives from Azure AD during authentication includes valuable customer information that you can use to create a user account in your application. This information can help you automate the customer setup experience and increase the likelihood of conversion. For more information about the token, see [Microsoft identity platform ID tokens](https://docs.microsoft.com/azure/active-directory/develop/active-directory-token-and-claims).

Using Azure AD to enable one-click authentication to your application or Trial does the following:  
* Streamlines the customer experience from Azure Marketplace to Trial.  
* Maintains the feel of an "in-product experience" even when the customer is redirected from Azure Marketplace to your domain or Trial environment.  
* Decreases the likelihood of abandonment on redirect because there is no additional sign-in step.  
* Reduces deployment barriers for the large population of Azure AD users.  

## Certify your Azure AD integration with Azure Marketplace  

You can certify your Azure AD integration in a few different ways, depending on whether your application is single-tenant or multi-tenant, and whether you're new to Azure AD federated single sign-on (SSO) or you already support it.  

For multi-tenant applications, do either of the following:  

* If you already support Azure AD:
    1. Register your application in the Azure portal.
    1. Enable the multi-tenancy support feature in Azure AD to give customers a "one-click" trial experience. For more information, see [Register an application with the Microsoft identity platform](https://docs.microsoft.com/azure/active-directory/develop/active-directory-integrating-applications).  

* If you're new to Azure AD federated SSO: 
    1. Register your application in the Azure portal.
    1. Develop SSO with Azure AD by using [OpenID Connect](https://docs.microsoft.com/azure/active-directory/develop/active-directory-protocols-openid-connect-code) or [OAuth 2.0](https://docs.microsoft.com/azure/active-directory/develop/active-directory-protocols-oauth-code).
    1. Enable the multi-tenancy support feature in Azure AD to give customers a "one-click" trial experience. For more information, see [Get AppSource Certified for Azure Active Directory](https://docs.microsoft.com/azure/active-directory/develop/active-directory-devhowto-appsource-certified).  

For single-tenant applications, use any of the following options:  
* Add users to your directory as guest users using [Azure B2B](https://docs.microsoft.com/azure/active-directory/active-directory-b2b-what-is-azure-ad-b2b).
* Manually provision trials for customers by using *Contact Me*.
* Develop a per-customer *Test Drive*.
* Build a multi-tenant sample demo application with SSO.

## SaaS subscriptions

Use the *SaaS application* offer type to enable customers to buy your SaaS-based, technical solution as a subscription. Your SaaS application must meet the following requirements:
- Price and bill the service at a flat rate (monthly or yearly) or at a per-user rate.
- Provide a way for customers to upgrade or cancel the service at any time.

Microsoft hosts the commercial transaction and bills your customers on your behalf. To offer a SaaS application as a subscription, you must integrate with the SaaS Fulfillment APIs.  Your service must support provisioning, upgrading, and canceling.

| Requirement | Details |  
|:--- |:--- |  
|Billing and metering | Your offer is priced based on the pricing model (flat rate or per-user) that you select before publishing.  If you're using the flat rate model, you can optionally include additional dimensions to charge customers for usage that's not included in the flat rate. |  
|Cancellation | Your offer is cancelable by the customer at any time. |  
|Transaction landing page | You host an Azure co-branded transaction landing page where customers can create and manage their SaaS service account. |   
| Subscription API | You expose a service that can interact with the SaaS subscription to create, update, and delete a user account and service plan. Critical API changes must be supported within 24 hours. Non-critical API changes will be released periodically. |  

>[!Note]
>The Cloud Solution Provider (CSP) partner channel opt-in is now available. For more information about marketing your offer through the Microsoft CSP partner channels, see [Cloud Solution Providers](./cloud-solution-providers.md).

## Next steps

If you haven't already done so, learn how to [Grow your cloud business with Azure Marketplace](https://azuremarketplace.microsoft.com/sell).

To register for and start working in Partner Center:

- [Sign in to Partner Center](https://partner.microsoft.com/dashboard/account/v3/enrollment/introduction/partnership) to create or complete your offer.  
- See [create a SaaS application offer](./partner-center-portal/create-new-saas-offer.md) for more information.

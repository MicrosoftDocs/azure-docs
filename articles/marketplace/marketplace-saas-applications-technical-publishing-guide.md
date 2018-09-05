---
title: Azure Marketplace SaaS Applications Technical Publishing Guide
description: Step-by-step guide and publishing checklists for publishing SaaS applications to Azure Marketplace
services: Marketplace, Compute, Storage, Networking, Blockchain, Security, SaaS
documentationcenter:
author: keithcharlie
manager: nunoc
editor: keithcharlie

ms.assetid: 
ms.service: marketplace
ms.workload: 
ms.tgt_pltfrm: 
ms.devlang: 
ms.topic: article
ms.date: 07/09/2018
ms.author: keithcharlie

---

# SaaS Apps Offer Publishing Guide

SaaS Apps can be published in the marketplace with three different calls to action: "Contact Me," "Free Trial," and "Get It Now." This guide explains these three options, including requirements for each. 

## Offer Overview  

SaaS Apps are available in both the Azure Marketplace and Appsource storefronts The following table describes the available options:

| Storefront| List | Trial | Transact |  
| --- | --- | --- |  --- |
| AppSource | Yes | Yes | No |
| Azure marketplace | Yes | Yes | Yes

**List:**  The List publishing option uses the SaaS App offer type configured with a Contacct Me call-to-action and is used when a Trial- or Transaction-level participation is not feasible. The benefit of this approach is that it enables publishers with a solution in-market to immediately begin receiving leads that can be turned into deals. When ready to purchase, the customer buys from the publisher directly, and the publisher keeps 100% of the software license revenue from the transaction.  

**Trial:**  The Trial publishing option uses the SaaS App offer type configured with a Free Trial call-to-action. This approach enables a customer discover a solution in marketplace, securely redirect to the publisher's single- or multi-tenant trial environment with Azure Active Directory, then buy directly from the publisher. Like the List publishng option, since the customer is buying directly, the publisher keeps 100% of the software license revenue. Providing a customer-led trial increases engagement via marketplace and enables a "try before you buy" experience. The Trial pubishing option also qualifies publshers for additional storefront promotion which can drive richer leads and more focused customer engagements. Trials must include free support at least for the duration of the trial period. 

**Transact:** The Transact publishing option uses the SaaS App offer type configured with the Get It Now call-to-action. This publishing option enables publishers to sell their offer using the customer's Azure subscription, preferred payment instrument, and selected invoicing method, including the Enterprise Agreement. Microsoft keeps 20% of the software license fee when hosting the transaction, effectively saving the publisher from creating and managing a direct procurement relationship with the customer.  

## SaaS App List

The call to action for a SaaS listing with no trial and no billing functionality is "Contact Me." 

The publisher's application does need to support Azure Active Directory to list a SaaS app without Trial or Transact capabilities. 

|Requirements  |Details  |
|---------|---------|
|Your app is a SaaS offering  |   Your solution is a SaaS offering and you offer a multi-tenant SaaS product.      |


## SaaS App Trial

You provide a solution or app using a free-to-try, SaaS trial. Free trial offers typically leverage limited-use or limited-duration trial account. 


|Requirements  |Details  |
|---------|---------|
|Your app is a SaaS offering  |   Your solution is a SaaS offering and you offer a multi-tenant SaaS product.      |
|Your app is AAD enabled     |   The customer will be re-directed to your domain and you will transact with the customer directly       |


## SaaS App Trial Technical Requirements

The key technical requirement to publish a SaaS App for Trial use is a lightweight integration with Azure Active Directory (Azure AD) to facilitate a redirect of the user from a Microsoft domain to the publisher domain. Azure AD enables an authenticated marketplace user to remain authenticated while seamlessly moving between domains. The Azure AD integration with applications is well-documented with multiple SDKs and development resources.

To start, we recommend that you have an Azure subscription dedicated for your Azure Marketplace publishing, allowing you to isolate the work from other initiatives.

The best Azure Active Directory documentation, samples and guidance can be found here: 

* [Azure Active Directory Developer's Guide](https://docs.microsoft.com/azure/active-directory/develop/active-directory-developers-guide)

* [Integrating with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/develop/active-directory-how-to-integrate)

* [Integrating Applications with Azure Active Directory](https://docs.microsoft.com/azure/active-directory/develop/active-directory-integrating-applications)

For video tutorials, review the following:

* [Azure Active Directory Authentication with Vittorio Bertocci](https://channel9.msdn.com/Shows/XamarinShow/Episode-27-Azure-Active-Directory-Authentication-with-Vittorio-Bertocci?term=azure%20active%20directory%20integration)

* [Azure Active Directory Identity Technical Briefing - Part 1 of 2](https://channel9.msdn.com/Blogs/MVP-Enterprise-Mobility/Azure-Active-Directory-Identity-Technical-Briefing-Part-1-of-2?term=azure%20active%20directory%20integration)

* [Azure Active Directory Identity Technical Briefing - Part 2 of 2](https://channel9.msdn.com/Blogs/MVP-Azure/Azure-Active-Directory-Identity-Technical-Briefing-Part-2-of-2?term=azure%20active%20directory%20integration)

* [Building Apps with Microsoft Azure Active Directory](https://channel9.msdn.com/Blogs/Windows-Development-for-the-Enterprise/Building-Apps-with-Microsoft-Azure-Active-Directory?term=azure%20active%20directory%20integration)

* [Microsoft Azure Videos focused on Active Directory](https://azure.microsoft.com/resources/videos/index/?services=active-directory)

Free Azure Active Directory training is available at  
* [Microsoft Azure for IT Pros Content Series: Azure Active Directory](https://mva.microsoft.com/en-US/training-courses/microsoft-azure-for-it-pros-content-series-azure-active-directory-16754?l=N0e23wtxC_2106218965)

In addition, Azure Active Directory provides a site to check for Service Updates   
* [Azure AD Service updates](https://azure.microsoft.com/updates/?product=active-directory)

## Using Azure Active Directory to Enable Trials  

Microsoft authenticates all Marketplace users with Azure AD, hence when an authenticated user clicks through your Trial listing in Marketplace and is redirected to your Trial environment, you can provision the user directly into a Trial without requiring an additional sign-in step. The token that your app receives from Azure AD during authentication includes valuable user information that you can use to create a user account in your app, enabling you to automate the provisioning experience and increase the likelihood of conversion. For more information about the token, see [Sample Tokens](https://docs.microsoft.com/azure/active-directory/develop/active-directory-token-and-claims) .

Using Azure AD to enable 1-click authentication to your app or Trial does the following:  
* Streamlines the customer experience from Marketplace to Trial.  
* Maintains the feel of an 'in-product experience' even when the user is redirected from Marketplace to your domain or Trial environment.  
* Decreases the likelihood of abandonment on redirect because there is not an additional sign-in step.  
* Reduces deployment barriers for the large population of Azure AD users.  

## Certifying your Azure AD integration for Marketplace  

You can certify your Azure AD integration in a few different ways, depending on whether your application is single-tenant or multi-tenant, and whether you are new to Azure AD federated single sign-on (SSO), or already support it.  

**For multi-tenant applications:**  

If you already support Azure AD, do the following:
1.	Register your application in the Azure portal
2.	Enable the multi-tenancy support feature in Azure AD to get a 'one-click' trial experience. More specific information can be found [here](https://docs.microsoft.com/azure/active-directory/develop/active-directory-integrating-applications).  

If you are new to Azure AD Federated SSO, do the following: 
1.  Register your application in the Azure portal
2.  Develop SSO with Azure AD using [OpenID Connect](https://docs.microsoft.com/azure/active-directory/develop/active-directory-protocols-openid-connect-code) or [OAuth 2.0](https://docs.microsoft.com/azure/active-directory/develop/active-directory-protocols-oauth-code).
3.  Enable multi-tenancy support feature in AAD to get 'one-click' trial experience More specific information can be found [here](https://docs.microsoft.com/azure/active-directory/develop/active-directory-devhowto-appsource-certified).  

**For single-tenant application, use any of the following options:**  
* Add users to your directory as guest users using [Azure B2B](https://docs.microsoft.com/azure/active-directory/active-directory-b2b-what-is-azure-ad-b2b)
* Manually provision trials for customers by using 'Contact Me'
* Develop a per-customer 'Test Drive'
* Build a multi-tenant sample demo app with SSO

## SaaS App Subscriptions (Sell Through Azure)

Use SaaS App offer type configured to "Sell Through Azure" to enable your customer to buy your SaaS-based, technical solution as a subscription using Microsoft's customer payment and billing relationship. The following requirements must be met for your SaaS App offer:
- Price and bill the service at a flat, monthly rate. Annual pricing and metered billing support are not available at this time.
- Provide a method to upgrade or cancel the service at any time. Customers that cancel mid-month pay the full subscription amount for that month. In this scenario offers are presnented as Plans, Customers selects a Plan at time of checkout and can  choose to upgrade or downgrade to alternate Plans after purchasing.

Microsoft hosts the commerce transaction. Microsoft bills your customer on your behalf. To configure a SaaS App to be sold through Azure, the publisher must expose a subscription management service API from their own domain to Microsoft's own subscription managemrnt service. The publisher's subscription management service API must support 3 API calls: Create plan, upgrade (or change plan), and cancel plan.

| Requirement | Details |  
|:--- |:--- |  
|Billing and metering | Your offer is priced at a monthly flat rate. Usage-based pricing and usage-based "true-up" capabilities are not supported at this time. |  
|Cancelation | Your offer is cancelable by the customer at any time. |  
|Transaction landing page | You host an Azure co-branded transaction landing page where users can create and manage their SaaS service account. |   
| Subscription API | You expose a service that can interact with the SaaS Subscription to create, update, and delete a user account and service plan. Critical API changes must be supported within 24 hours. Non-critical API changes will be released periodically. |  

## Next Steps
If you haven't already done so, 

- [Register](https://azuremarketplace.microsoft.com/sell) in the marketplace

If you're registered and are creating a new offer or working on an existing one,

- [Log in to Cloud Partner Portal](https://cloudpartner.azure.com) to create or complete your offer

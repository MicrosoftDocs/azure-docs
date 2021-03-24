---
title: Introduction to listing options - Microsoft commercial marketplace
description: This article describes listing options for offers published to Microsoft AppSource and Azure Marketplace.
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
author: trkeya
ms.author: trkeya
ms.date: 01/14/2021
---

# Introduction to listing options

When you create an offer type, you choose one or more listing options. These options determine the buttons customers see on the offer listing page in the online stores. The listing options include _Free Trial_, _Test Drive_, _Contact Me_, and _Get It Now_.

This table shows which listing options are available for each offer type.

| Offer type | Free Trial | Test Drive | Contact Me | Get It Now `*` |
| ------------ | ------------- | ------------- | ------------- | ------------- |
| Azure Application (Managed app) |   | &#10004; |   | &#10004; |
| Azure Application (Solution template) |  |  |  | &#10004; |
| Consulting service |  |  | &#10004; |  |
| Azure Container |  |  |  | &#10004; |
| Dynamics 365 business central | &#10004; | &#10004; | &#10004; | &#10004; |
| Dynamics 365 Customer Engagement & PowerApps | &#10004; | &#10004; | &#10004; | &#10004; |
| Dynamics 365 for operations | &#10004; | &#10004; | &#10004; | &#10004; |
| IoT Edge module |  |  |  | &#10004; |
| Managed Service |  |  |  | &#10004; |
| Power BI App |  |  |  | &#10004; |
| Azure Virtual Machine | &#10004; | &#10004; |  | &#10004; |
| Software as a service | &#10004; | &#10004; | &#10004; | &#10004; |
||||||

&#42; The Get It Now listing option includes Get It Now (Free), bring your own license (BYOL), Subscription, and Usage-based pricing. For details, see [Get It Now](#get-it-now).

## Changing offer type

[!INCLUDE [change-offer-type](./includes/change-offer-type.md)]

## Free Trial

Use the commercial marketplace to enhance discoverability and automate provisioning of your solution's trial experience. This enables prospective customers to use your software as a service (SaaS), IaaS or Microsoft in-app experience at no cost from 30 days to six months, depending on the offer type.

Customers use the _Free Trial_ button on your offer’s listing page to try your offer. If you provide a free trial on multiple plans within the same offer, customers can switch to a free trial on another plan, but the trial period does not restart.

For virtual machine offers, customers are charged Azure infrastructure costs for using the offer during a trial period. Upon expiration of the trial period, customers are automatically charged for the last plan they tried based on standard rates unless they cancel before the end of the trial period.

## Test Drive

Customers use the _Test Drive_ button on your offer’s listing page to get access to a preconfigured environment for a fixed number of hours. To learn more about test drives, see [What is a test drive?](what-is-test-drive.md)

> [!TIP]
> A test drive is different from a free trial. You can offer a test drive, free trial, or both. They both provide your customers with your solution for a fixed period-of-time. But a test drive also includes a hands-on, self-guided tour of your product’s key features and benefits being demonstrated in a real-world implementation scenario.

## Contact Me

Simple listing of your application or service. Customers use the _Contact Me_ button on your offer’s listing page to request that you connect with them about your offer.

## Get It Now

This listing option includes transactable offers (subscriptions and user-based pricing), bring your own license offers, and Get It Now (Free). Transactable offers are sold through the commercial marketplace. Microsoft is responsible for billing and collections. Customers use the _Get It Now button_ to get the offer.

The Get It Now listing option can include the following pricing options, depending on the offer type:

- Get It Now (Free)
- Bring your own license (BYOL)
- Subscription
- Usage-based pricing

This table shows which offer types support the additional pricing options that are included with the Get It Now listing option.

| Offer type | Get It Now (Free) | BYOL | Subscription | Usage-based pricing |
| ------------ | ------------- | ------------- | ------------- | ------------- |
| Azure Application (Managed app) |   |   | &#10004; | &#10004; |
| Azure Application (Solution template) | &#10004; |   |   |   |
| Consulting service |   |   |   |   |
| Azure Container | &#10004;<sup>1</sup> | &#10004;<sup>1</sup> |   |   |
| Dynamics 365 business central | &#10004; |   |   |   |
| Dynamics 365 Customer Engagement & PowerApps | &#10004; |   |   |   |
| Dynamics 365 for operations | &#10004; |   |   |   |
| IoT Edge module | &#10004;<sup>1</sup> | &#10004;<sup>1</sup> |   |   |
| Managed Service |   | &#10004; |   |   |
| Power BI App | &#10004; |   |   |   |
| Azure Virtual Machine |   | &#10004; |   | &#10004;<sup>2</sup> |
| Software as a service | &#10004; |   | &#10004; | &#10004; |
||||||

**Legend**

<sup>1</sup> The **Pricing model** column of the **Plan overview** tab shows _Free_ or _BYOL_ but it’s not selectable.

<sup>2</sup> Priced per hour and billed monthly.

### Get It Now (Free)

Use this listing option to offer your application for free. Customers use the _Get It Now_ button to get your free offer.

> [!NOTE]
> Get It Now (Free) offers are not eligible for Marketplace Rewards benefits for transactable offers. Because there is no transaction through the storefront, these are categorized as “Trial.” See [Marketplace Rewards](#marketplace-rewards) below.

### Bring Your Own License (BYOL)

Use this listing option to let customers deploy your offer using a license purchased outside the commercial marketplace. This option is ideal for on-premises-to-cloud migrations. Customers use the _Get It Now_ button to purchase your offer using a license they pre-purchased from you.

> [!NOTE]
> BYOL offers are not eligible for Marketplace Rewards benefits for transactable offers. Because these require a customer to acquire the license from the partner and there is no transaction through the commercial marketplace storefront, these are categorized as “List.” See [Marketplace Rewards](#marketplace-rewards) below.

### Subscription

You can charge a flat fee for these offer types:

- Azure Application (Managed app) offers support monthly subscriptions.
- SaaS offers support both monthly and annual subscriptions.

### Usage-based pricing

The following offer types support usage-based pricing:

- Azure Application (Managed app) offer support metered billing. For more details, see [Managed application metered billing](partner-center-portal/azure-app-metered-billing.md).
- SaaS offers supports Metered billing and per user (per seat) pricing. For more information about metered billing, see [Metered billing for SaaS using the commercial marketplace metering service](partner-center-portal/saas-metered-billing.md).
- Azure virtual machine offers support Per core, Per core size, and Per market and core size pricing. These pricing options are priced per hour and billed monthly.

When creating a transactable offer, it is important to understand the pricing, billing, invoicing, and payout considerations before selecting an offer type and creating your offer. To learn more, see [Commercial marketplace online stores](overview.md#commercial-marketplace-online-stores).

## Sample offer

After your offer is published, the listing option(s) you chose appear as a button in the upper-left corner of the listing page in the online store(s). For example, the following screen shows an offer listing page in the Microsoft AppSource online store with the **Get It Now** and **Test Drive** buttons:

:::image type="content" source="media/listing-options.png" alt-text="Illustrates the listing page for an offer with the Contact Me and Test Drive buttons.":::

## Listing and pricing options by online store

Based on a variety of criteria, we determine whether your offer is listed on Azure Marketplace, Microsoft AppSource, or both online stores. For more information about the differences between the two online stores, see [Commercial marketplace online stores](overview.md#commercial-marketplace-online-stores).

The following table shows the options that are available for different offer types and add-ins and which online stores your offer can be listed on.

| Offer types and add-ins | Contact Me | Free Trial | Get It Now (Free) | BYOL | Get It Now (Transact) |
| ------------ | ------------- | ------------- | ------------- | ------------- | ------------- |
| Azure Virtual Machine |   |   |   | Azure Marketplace | Azure Marketplace |
| Azure Application |   |   | Azure Marketplace | Azure Marketplace | Azure Marketplace |
| Azure Container  |   |   | Azure Marketplace | Azure Marketplace |   |
| IoT Edge module |   |   | Azure Marketplace | Azure Marketplace |   |
| Managed service |   |   |   | Azure Marketplace |   |
| Consulting service | Both online stores |   |   |   |   |
| SaaS  | Both online stores | Both online stores | Both online stores |   | Both online stores &#42; |
| Microsoft 365 App | AppSource | AppSource |   |   | AppSource &#42;&#42; |
| Dynamics 365 business central | AppSource | AppSource |   |   |   |
| Dynamics 365 for Customer Engagements & PowerApps | AppSource | AppSource |   |   |   |
| Dynamics 365 for operations | AppSource | AppSource |   |   |   |
| Power BI App |   |   | AppSource |   |   |
|||||||

&#42; SaaS transactable offers in AppSource are currently credit card only.

&#42;&#42; Microsoft 365 add-ins are free to install and can be monetized using a SaaS offer. For more information, see [Monetize your Office 365 add-in through the Microsoft commercial marketplace](/office/dev/store/monetize-addins-through-microsoft-commercial-marketplace).

## Marketplace Rewards

Your Marketplace Rewards are differentiated based on the listing option you choose. To learn more, see [Your commercial marketplace benefits](gtm-your-marketplace-benefits.md).

If your offer is transactable, you will earn benefits as you increase your billed sales.

Non-transactable offers earn benefits based on whether or not a free trial is attached.

## Next steps

- To choose an offer type to create, see [publishing guide by offer type](publisher-guide-by-offer-type.md).

---
title: Introduction to listing options - Microsoft commercial marketplace
description: This article describes listing options for offers published to Microsoft AppSource and Azure Marketplace.
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
author: trkeya
ms.author: trkeya
ms.date: 04/12/2021
---

# Introduction to listing options

When you create an offer type, you choose one or more listing options. These options determine the buttons that customers see on the offer listing page in the online stores. The listing options include **Free Trial**, **Test Drive**, **Contact Me**, and **Get It Now**.

This table shows which listing options are available for each offer type:

| Offer type | Free Trial | Test Drive | Contact Me | Get It Now |
| ------------ | ------------- | ------------- | ------------- | ------------- |
| Azure Application (Managed app) |   | &#10004; |   | &#10004;<sup>1</sup> |
| Azure Application (Solution template) |  |  |  | &#10004;<sup>1</sup> |
| Azure Container |  |  |  | &#10004;<sup>1</sup> |
| Azure Virtual Machine | &#10004; | &#10004; |  | &#10004;<sup>1</sup> |
| Consulting service |  |  | &#10004; |  |
| Dynamics 365 Business Central | &#10004; | &#10004; | &#10004; | &#10004;<sup>1</sup> |
| Dynamics 365 apps on Dataverse and Power Apps | &#10004; | &#10004; | &#10004; | &#10004;<sup>1</sup> <sup>2</sup> |
| Dynamics 365 Operations Apps | &#10004; | &#10004; | &#10004; | &#10004;<sup>1</sup> |
| IoT Edge module |  |  |  | &#10004;<sup>1</sup> |
| Managed Service |  |  |  | &#10004;<sup>1</sup> |
| Power BI App |  |  |  | &#10004;<sup>1</sup> |
| Software as a service | &#10004; | &#10004; | &#10004; | &#10004;<sup>1</sup> |

<sup>1</sup> The **Get It Now** listing option includes Get It Now (Free), bring your own license (BYOL), Subscription, and Usage-based pricing. For more information, see [Get It Now](#get-it-now).

<sup>2</sup> Customers will see a **Get it now** button on the offer listing page in AppSource for offers configured for [ISV app license management](isv-app-license.md). Customers can select this button to contact you to purchase licenses for the app.

## Change the offer type

[!INCLUDE [change-offer-type](./includes/change-offer-type.md)]

## Free Trial

Use the commercial marketplace to enhance discoverability and automate provisioning of your solution's trial experience. This enables prospective customers to use your software as a service (SaaS), infrastructure as a service (IaaS), or Microsoft in-app experience at no cost from 30 days to six months, depending on the offer type.

Customers use the **Free Trial** button on your offer's listing page to try your offer. If you provide a free trial on multiple plans within the same offer, customers can switch to a free trial on another plan, but the trial period doesn't restart.

For virtual machine offers, customers are charged Azure infrastructure costs for using the offer during a trial period. Upon expiration of the trial period, customers are automatically charged for the last plan they tried based on standard rates unless they cancel before the end of the trial period.

## Test Drive

Customers use the **Test Drive** button on your offer's listing page to get access to a preconfigured environment for a fixed number of hours. To learn more about test drives, see [What is a test drive?](what-is-test-drive.md).

> [!TIP]
> The Test Drive option is different from the Free Trial. You can offer Test Drive, Free Trial, or both. They both provide your customers with your solution for a fixed time period. However, the Test Drive also includes a hands-on, self-guided tour of your product's key features and benefits being demonstrated in a real-world implementation scenario.

## Contact Me

This option is a simple listing of your application or service. Customers use the **Contact Me** button on your offer's listing page to request that you connect with them about your offer.

## Get It Now

This listing option includes transactable offers (subscriptions or user-based pricing), bring your own license (BYOL) offers, and **Get It Now (Free)**. Transactable offers are sold through the commercial marketplace. Microsoft is responsible for billing and collections. Customers use the **Get It Now** button to get the offer.

> [!NOTE]
> Customers will see a **Get it now** button on the offer listing page in AppSource for offers configured for [ISV app license management](isv-app-license.md). Customers can select this button to contact you to purchase licenses for the app.

This table shows which offer types support the pricing options that are included with the **Get It Now** listing option.

| Offer type | Get It Now (Free) | BYOL | Subscription | Usage-based pricing |
| ------------ | ------------- | ------------- | ------------- | ------------- |
| Azure Application (Managed app) |   |   | &#10004; | &#10004; |
| Azure Application (Solution template) | &#10004; |   |   |   |
| Consulting service |   |   |   |   |
| Azure Container | &#10004;<sup>1</sup> | &#10004;<sup>1</sup> |   |   |
| Dynamics 365 Business Central | &#10004; |   |   |   |
| Dynamics 365 apps on Dataverse and Power Apps | &#10004; |   |   |   |
| Dynamics 365 Operations Apps | &#10004; |   |   |   |
| IoT Edge module | &#10004;<sup>1</sup> | &#10004;<sup>1</sup> |   |   |
| Managed Service |   | &#10004; |   |   |
| Power BI App | &#10004; |   |   |   |
| Azure Virtual Machine |   | &#10004; |   | &#10004;<sup>2</sup> |
| Software as a service | &#10004; |   | &#10004; | &#10004; |

<sup>1</sup> The **Pricing model** column of the **Plan overview** tab shows **Free** or **BYOL**, but it's not selectable.

<sup>2</sup> Priced per hour and billed monthly.

<sup>3</sup> Customers will see a **Get it now** button on the offer listing page in AppSource for offers configured for [ISV app license management](isv-app-license.md).

### Get It Now (Free)

Use this listing option to offer your application for free. Customers use the **Get It Now** button to get your free offer.

> [!NOTE]
> Get It Now (Free) offers aren't eligible for Marketplace Rewards benefits for transactable offers. Because there's no transaction through the storefront, these are categorized as **Trial**. See [Marketplace Rewards](#marketplace-rewards).

### Bring Your Own License (BYOL)

Use this listing option to let customers deploy your offer using a license purchased outside the commercial marketplace. This option is ideal for on-premises-to-cloud migrations. Customers use the **Get It Now** button to purchase your offer using a license they pre-purchased from you.

> [!NOTE]
> BYOL offers aren't eligible for Marketplace Rewards benefits for transactable offers. Because these require a customer to acquire the license from the partner and there's no transaction through the commercial marketplace storefront, these are categorized as **List**. See [Marketplace Rewards](#marketplace-rewards).

### Subscription

You can charge a flat fee for these offer types:

- Azure Application (Managed app) offers support for monthly subscriptions.
- SaaS offers support for both monthly and annual subscriptions.

### Usage-based pricing

The following offer types support usage-based pricing:

- Azure Application (Managed app) offer support for metered billing. For more information, see [Managed application metered billing](marketplace-metering-service-apis.md).
- SaaS offers support for Metered billing and per user (per seat) pricing. For more information about metered billing, see [Metered billing for SaaS using the commercial marketplace metering service](partner-center-portal/saas-metered-billing.md).
- Azure virtual machine offers support for **Per core**, **Per core size**, and **Per market and core size** pricing. These options are priced per hour and billed monthly.

When you create a transactable offer, it's important to understand the pricing, billing, invoicing, and payout considerations before you select an offer type and create your offer. To learn more, see [Commercial marketplace online stores](overview.md#commercial-marketplace-online-stores) and [Changing prices in active commercial marketplace offers](price-changes.md).

## Sample offer

After your offer is published, the listing options you chose appear as buttons in the upper-left corner of the listing page in the online store. For example, the following image shows an offer listing page in the Microsoft AppSource online store with the **Get It Now** and **Test Drive** buttons:

:::image type="content" source="media/listing-options.png" alt-text="Screenshot that illustrates the listing page for an offer with the Get It Now and Test Drive buttons.":::

## Listing and pricing options by online store

Based on various criteria, we determine whether your offer is listed on Azure Marketplace, Microsoft AppSource, or both online stores. For more information about the differences between the two online stores, see [Commercial marketplace online stores](overview.md#commercial-marketplace-online-stores).

The following table shows the options that are available for different offer types and add-ins, and which online stores your offer can be listed on.

| Offer types and add-ins | Contact Me | Free Trial | Get It Now (Free) | BYOL | Get It Now (Transact) |
| ------------ | ------------- | ------------- | ------------- | ------------- | ------------- |
| Azure Virtual Machine |   |   |   | Azure Marketplace | Azure Marketplace |
| Azure Application |   |   | Azure Marketplace | Azure Marketplace | Azure Marketplace |
| Azure Container  |   |   | Azure Marketplace | Azure Marketplace |   |
| IoT Edge module |   |   | Azure Marketplace | Azure Marketplace |   |
| Managed service |   |   |   | Azure Marketplace |   |
| Consulting service | Both online stores |   |   |   |   |
| SaaS  | Both online stores | Both online stores | Both online stores |   | Both online stores <sup>1</sup>|
| Microsoft 365 App | AppSource | AppSource |   |   | AppSource <sup>2</sup> |
| Dynamics 365 Business Central | AppSource | AppSource |   |   |   |
| Dynamics 365 apps on Dataverse and Power Apps | AppSource | AppSource |   |   | AppSource <sup>3</sup>  |
| Dynamics 365 Operations Apps | AppSource | AppSource |   |   |   |
| Power BI App |   |   | AppSource |   |   |

<sup>1</sup> SaaS transactable offers in AppSource only accept credit cards at this time.

<sup>2</sup> Microsoft 365 add-ins are free to install and can be monetized using an SaaS offer. For more information, see [Monetize your app through the commercial marketplace](/office/dev/store/monetize-addins-through-microsoft-commercial-marketplace).

<sup>3</sup> Applies to offers configured for [ISV app license management](isv-app-license.md).

## Marketplace Rewards

Your Marketplace Rewards benefits depend on the listing option you choose. To learn more, see [Your commercial marketplace benefits](gtm-your-marketplace-benefits.md).

If your offer is transactable, you will earn benefits as you increase your billed sales.

Non-transactable offers earn benefits based on whether or not a free trial is attached.

## Next steps

- To choose an offer type, see [Publishing guide by offer type](publisher-guide-by-offer-type.md).

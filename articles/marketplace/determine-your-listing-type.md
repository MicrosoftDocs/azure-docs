---
title: Determine your publishing option - Microsoft commercial marketplace
description: This article describes eligibility criteria and requirements for publishing offers to Microsoft AppSource and Azure Marketplace.
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
author: keferna
ms.author: keferna
ms.date: 09/04/2020
---

# Determine your publishing option

The publishing option that you choose for your offer relates directly to both the eligibility requirements and commercial marketplace GTM benefits. More importantly, the selection of publishing option and offer type defines how users will interact with your commercial marketplace offer.

To configure your offer, you'll need to understand the following key commercial marketplace concepts: the publishing options, offer types and configuration, and listing options that will govern how and where your offer is presented in the commercial marketplace online stores.

In this article, you will learn:

- How to determine the appropriate online store for your solution.
- Which publishing options and listing options are available in each online store.
- Which offer types are available for each publishing option.

## Commercial marketplace publishing options

The following table shows the publishing options for offer types in Microsoft AppSource and Azure Marketplace.

|   | **List (Contact)**  | **List (Trial)**  | **Free** | **BYOL** | **Transact**|
| :--------- | :----------- | :------------ | :----------- | :---------- |:---------- |
| **Virtual Machine** |  |  |  | Azure Marketplace |  Azure Marketplace |
| **Azure Apps (multi-VM)** |  |  | Azure Marketplace | Azure Marketplace | Azure Marketplace  |
| **Container image** |  |  | Azure Marketplace | Azure Marketplace |   |
| **IoT Edge module** |  |  | Azure Marketplace | Azure Marketplace |   |
| **Managed services** |  |  |  | Azure Marketplace |   |
| **Consulting services** | Both online stores |  |  |  |   |
| **SaaS app** | Both online stores | Both online stores | Both online stores |  | Both online stores* |
| **Microsoft 365 App** | AppSource | AppSource |  |  | AppSource**  |
| **Dynamics 365 add-in** |  AppSource | AppSource |  |  |   |
| **PowerApps** | AppSource |AppSource  |  |  |   |

&#42; SaaS app Transact offers in Microsoft AppSource are currently credit card only.

&#42;&#42; Microsoft 365 offers are free to install and can be monetized via SaaS offer as a licensing service. For more information, see [Monetize your Microsoft 365 add-in through the Microsoft commercial marketplace](/office/dev/store/monetize-addins-through-microsoft-commercial-marketplace).

## Choose a listing option

The listing options that are available offer differentiated customer engagement while giving you access to lead sharing and [commercial marketplace benefits](./gtm-your-marketplace-benefits.md). Note the listing options that correspond with the publishing option:

| **Publishing option**    | **Description**  |
| :------------------- | :-------------------|
| **List** | Simple listing of your application or service that enables a commercial marketplace user to request you to connect with the customer via the **Contact Me** listing options. |
| **Trial** | Use the commercial marketplace to enhance discoverability and automate provisioning of your solution's trial experience, enabling prospective users to use your SaaS, IaaS, or Microsoft in-app experience at no cost for a limited time before they buy. The listing options used for the trial publishing option are either **Free Trial** or **Test Drive**. |
| **BYOL** | Use the commercial marketplace to enhance discoverability and automate provisioning of your solution, and complete the financial transaction separately. BYOL offer types are ideal for on-premises to cloud migrations. The listing option is **Get it Now**.
| **Transact** | Transact offers are sold through the commercial marketplace. Microsoft is responsible for billing and collections. The listing option is **Get it Now**.|

> [!Note]
> When using the Transact publishing option, it is important to understand the pricing, billing, invoicing, and payout considerations before selecting an offer type and creating your offer. To learn more, review the article [Commercial marketplace transact capabilities](./marketplace-commercial-transaction-capabilities-and-considerations.md).

## Selecting an online store

Each online store serves different customer requirements for business and IT solutions. Your offer type, transact capabilities, and category will determine where your offer will be published. Categories and subcategories are mapped to each online store based on the type of solution you publish:

**Microsoft AppSource** offers business solutions, such as industry solutions and consulting services, for Dynamics 365, Microsoft 365, and Power Platform.

**Azure Marketplace** offers IT solutions built for or on Azure as well as consulting services that accelerate your customers' use of Azure.

Select the category and subcategory that best align with your solution type. For example, a web application firewall is an IT solution that should be published to Azure Marketplace, under the Security category. A contract management app is a business solution that should be published to AppSource under the Sales category. Selecting the incorrect category or subcategory may result in your offer being published to the wrong online store.

### Publishing to both online stores (SaaS offers only)

SaaS offers can be published to Azure Marketplace or AppSource. If your SaaS offer is *both* an IT solution (Azure Marketplace) and a business solution (AppSource), select a category and/or a subcategory applicable to each online store. Offers published to both online stores should have a value proposition as an IT solution *and* a business solution.

> [!IMPORTANT]
> SaaS offers with [metered billing](partner-center-portal/saas-metered-billing.md) are available through Azure Marketplace and the Azure portal. SaaS offers with only private plans are available through the Azure portal.

| Metered billing | Public plan | Private plan | Available in: |
|---|---|---|---|
| Yes             | Yes         | No           | Azure Marketplace and Azure portal |
| Yes             | Yes         | Yes          | Azure Marketplace and Azure portal* |
| Yes             | No          | Yes          | Azure portal only |
| No              | No          | Yes          | Azure portal only |

&#42; The private plan of the offer will only be available via the Azure portal

For example, an offer with metered billing and a private plan only (no public plan), will be purchased by customers in the Azure portal. Learn more about [Private offers in Microsoft commercial marketplace](private-offers.md).

### Categories

Categories and subcategories are mapped to each online store based on the solution type. Select the categories and subcategories that best align with your solution. You can select:

- At least one and up to two categories. You can choose a primary and a secondary category.
- Up to two subcategories for each primary and/or secondary category. If you don’t select any subcategory, your offer will still be discoverable under the selected category.

[!INCLUDE [categories and subcategories](./includes/categories.md)]

## Next steps

- Once you decide on a publishing option, review the [publishing guide by offer type](./publisher-guide-by-offer-type.md).
---
title: Determine your publishing option - Microsoft commercial marketplace
description: This article describes eligibility criteria and requirements for publishing offers to Microsoft AppSource and Azure Marketplace.
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
author: keferna
ms.author: keferna
ms.date: 07/30/2020
---

# Determine your publishing option

The publishing option that you choose for your offer relates directly to both the eligibility requirements and commercial marketplace GTM benefits. More importantly, the selection of publishing option and offer type defines how users will interact with your commercial marketplace offer.

To configure your offer, you'll need to understand the following key commercial marketplace concepts: the publishing options, offer types and configuration, and calls-to-action that will govern how and where your offer is presented in the commercial marketplace storefronts.

In this article, you will learn:

- How to determine the appropriate storefront for your solution
- Which publishing options and calls-to-action are available in each storefront
- Which offer types are available for each publishing option

## Commercial marketplace publishing options

The following table shows the publishing options for offer types in Microsoft AppSource and Azure Marketplace.

|   | **List (Contact)**  | **List (Trial)**  | **Free** | **BYOL** | **Transact**|
| :--------- | :----------- | :------------ | :----------- | :---------- |:---------- |
| **Virtual Machine** |  |  |  | Azure Marketplace |  Azure Marketplace |
| **Azure Apps (multi-VM)** |  |  | Azure Marketplace | Azure Marketplace | Azure Marketplace  |
| **Container image** |  |  | Azure Marketplace | Azure Marketplace |   |
| **IoT Edge module** |  |  | Azure Marketplace | Azure Marketplace |   |
| **Managed services** |  |  |  | Azure Marketplace |   |
| **Consulting services** | Both storefronts |  |  |  |   |
| **SaaS app** | Both storefronts | Both storefronts | Both storefronts |  | Both storefronts* |
| **Microsoft 365 App** | AppSource | AppSource |  |  | AppSource**  |
| **Dynamics 365 add-in** |  AppSource | AppSource |  |  |   |
| **PowerApps** | AppSource |AppSource  |  |  |   |

&#42; SaaS app Transact offers in Microsoft AppSource are currently credit card only.

&#42;&#42; Microsoft 365 offers are free to install and can be monetized via SaaS offer as a licensing service. For more information, see [Monetize your Office 365 add-in through the Microsoft commercial marketplace](/office/dev/store/monetize-addins-through-microsoft-commercial-marketplace).

## Choose a call to action

The publishing options available offer differentiated customer engagement while giving you access to lead sharing and [commercial marketplace benefits](https://docs.microsoft.com/azure/marketplace/gtm-your-marketplace-benefits). Note the calls-to-action that correspond with the publishing option:

| **Publishing option**    | **Description**  |
| :------------------- | :-------------------|
| **List** | Simple listing of your application or service that enables a commercial marketplace user to request you to connect with the customer via the **Contact Me** call-to-action. |
| **Trial** | Use the commercial marketplace to enhance discoverability and automate provisioning of your solution's trial experience, enabling prospective users to use your SaaS, IaaS, or Microsoft in-app experience at no cost for a limited time before they buy. The calls-to-action used for the trial publishing option are either **Free Trial** or **Test Drive**. |
| **BYOL** | Use the commercial marketplace to enhance discoverability and automate provisioning of your solution, and complete the financial transaction separately. BYOL offer types are ideal for on-premises to cloud migrations. The call-to-action is **Get it Now**.
| **Transact** | Transact offers are sold through the commercial marketplace. Microsoft is responsible for billing and collections. The call-to-action is **Get it Now**.|

> [!Note]
> When using the Transact publishing option, it is important to understand the pricing, billing, invoicing, and payout considerations before selecting an offer type and creating your offer. To learn more, review the article [Commercial marketplace transact capabilities](./marketplace-commercial-transaction-capabilities-and-considerations.md).

## Selecting a storefront

Each storefront serves unique customer requirements and targets specific audiences. Your offer type, transact capabilities, and category will determine where your offer will be published. Categories and subcategories are mapped to each storefront based on the target audience:

**Microsoft AppSource** targets business users looking for line-of-business or industry solutions and consulting services for Dynamics 365, Microsoft 365, and Power Platform.

**Azure Marketplace** targets IT professionals and developers looking for solutions built for or on Azure as well as consulting services that accelerate their use of Azure.

Select the category and subcategory that best align with your target audience. For example, a web application firewall should be published to Azure Marketplace, under the Security category, as the intended audience is IT professionals. A contract management app should instead be published to AppSource under the Sales category, since the intended audience is business users. Selecting the incorrect category or subcategory may result in your offer being published to the wrong storefront.

### Publishing to both Storefronts (SaaS offers only)

SaaS offers can be published to Azure Marketplace or AppSource. If your SaaS offer is intended for *both* a technical audience (Azure Marketplace) and a business audience (AppSource), select a category and/or a subcategory applicable to each storefront. Offers published to both storefronts should have a value proposition that extends to IT professionals *and* business users.

> [!IMPORTANT]
> SaaS offers with metered billing are available through Azure Marketplace and the Azure portal. SaaS offers with only private plans are available through the Azure portal.

| Metered billing | Public plan | Private plan | Available in: |
|---|---|---|---|
| Yes             | Yes         | No           | Azure Marketplace and Azure portal |
| Yes             | Yes         | Yes          | Azure Marketplace and Azure portal* |
| Yes             | No          | Yes          | Azure portal only |
| No              | No          | Yes          | Azure portal only |

&#42; The private plan of the offer will only be available via the Azure portal

For example, an offer with metered billing and a private plan only (no public plan), will be purchased by customers in the Azure portal. Learn more about [Private offers in Microsoft commercial marketplace](private-offers.md).

### Categories

Categories and subcategories are mapped to each storefront based on the target audience. Select the categories and subcategories that best align with your offer and the intended audience. You can select:

- At least one and up to two categories. You have the option to choose a primary and a secondary category.
- Up to two subcategories for each primary and/or secondary category. If you don’t select any subcategory, your offer will still be discoverable under the selected category.

[!INCLUDE [categories and subcategories](./includes/categories.md)]

## Next steps

- Once you decide on a publishing option, you are ready to [select the offer type](./publisher-guide-by-offer-type.md) that will be used to present your offer.
- Review the eligibility requirements in the publishing options by offer type section to finalize the selection and configuration of your offer.
- Review the publishing patterns by storefront for examples on how your solution maps to an offer type and configuration.

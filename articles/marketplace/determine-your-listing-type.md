---
title: Determine your publishing option - Microsoft commercial marketplace
description: This article describes eligibility criteria and requirements for publishing offers to Microsoft AppSource and Azure Marketplace.
author: dsindona
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 04/14/2020
ms.author: dsindona
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

## Selecting a storefront

Before you select a publishing option, it's important to understand the storefront eligibility requirements for commercial marketplace solutions, apps, and services. Each storefront serves unique customer requirements and targets specific audiences. Your offer type, transact capabilities, and category or industry will determine where to publish your offer.

**Microsoft AppSource** applications are line-of-business solutions that can be built-on Azure or built-for: Dynamics 365, Office 365, Power BI, or Power Apps. AppSource consulting services are professional services offerings that help customers get started with or accelerate usage of Dynamics 365 and Power BI.

**Azure Marketplace** applications are technical "building-block" solutions built-on or built-for Azure and intended for an IT or developer audience. Azure Marketplace consulting services are professional services offerings that help customers get started with or accelerate the use of Azure.

>[!Note]
>Cross-listing (for SaaS Apps only): when a list or trial-based offer meets the criteria for both a technical and business user audience, your offer will be listed in both storefronts. Learn more about the publishing options below.

## Choose a publishing option

The publishing options available offer differentiated customer engagement while giving you access to lead sharing and [commercial marketplace benefits](https://docs.microsoft.com/azure/marketplace/gtm-your-marketplace-benefits). Note the calls-to-action that correspond with the publishing option:

| **Publishing option**    | **Description**  |
| :------------------- | :-------------------|
| **List** | Simple listing of your application or service that enables a commercial marketplace user to request you to connect with the customer via the **Contact Me** call-to-action. |
| **Trial** | Use the commercial marketplace to enhance discoverability and automate provisioning of your solution's trial experience, enabling prospective users to use your SaaS, IaaS, or Microsoft in-app experience at no cost for a limited time before they buy. The calls-to-action used for the trial publishing option are either **Free Trial** or **Test Drive**. |
| **BYOL** | Use the commercial marketplace to enhance discoverability and automate provisioning of your solution, and complete the financial transaction separately. BYOL offer types are ideal for on-premises to cloud migrations. The call-to-action is **Get it Now**.
| **Transact** | Transact offers are sold through the commercial marketplace. Microsoft is responsible for billing and collections. The call-to-action is **Get it Now**.|

> [!Note]
> When using the Transact publishing option, it is important to understand the pricing, billing, invoicing, and payout considerations before selecting an offer type and creating your offer. To learn more, review the article [Commercial marketplace transact capabilities](./marketplace-commercial-transaction-capabilities-and-considerations.md).

## Next steps

- Once you decide on a publishing option, you are ready to [select the offer type](./publisher-guide-by-offer-type.md) that will be used to present your offer.
- Review the eligibility requirements in the publishing options by offer type section to finalize the selection and configuration of your offer.
- Review the publishing patterns by storefront for examples on how your solution maps to an offer type and configuration.

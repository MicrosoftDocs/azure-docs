---
title: Determine your publishing option - Microsoft commercial marketplace
description: This article describes eligibility criteria and requirements for publishing offers to Microsoft AppSource and Azure Marketplace.
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
author: keferna
ms.author: keferna
ms.date: 07/28/2020
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

Each storefront serves unique customer requirements and targets specific audiences. Your offer type, transact capabilities, and category or industry will determine where your offer will be published. Categories and subcategories are mapped to each storefront based on the target audience:

**Microsoft AppSource** targets business users looking for line-of-business or industry solutions and consulting services for Dynamics 365, Microsoft 365, and Power Platform.

**Azure Marketplace** targets IT professionals and developers looking for solutions built for or on Azure as well as consulting services that accelerate their use of Azure.

For example, a web application firewall should be published to Azure Marketplace, under the Security category, as the intended audience is IT professionals. A contract management app should instead be published to AppSource under the Sales category, since the intended audience is business users. Selecting the incorrect category or subcategory may result in your offer being published to the wrong storefront.

### Publishing to both Storefronts (SaaS offers only)

SaaS offers can be published to Azure Marketplace or AppSource. If your SaaS offer is intended for *both* a technical audience (Azure Marketplace) and a business audience (AppSource), select a category and/or a subcategory applicable to either storefront. Offers published to both storefronts should have a value proposition that extends to IT professionals *and* business users.

> [!IMPORTANT]
> Transactable SaaS offers with metered billing and/or private plans are available only through Azure Marketplace and/or the Azure portal.

| Metered billing | Public plan | Private plan | Available in: |
|---|---|---|---|
| Yes             | Yes         | No           | Azure Marketplace and Azure portal |
| Yes             | Yes         | Yes          | Azure Marketplace and Azure portal* |
| Yes             | No          | Yes          | Azure portal only |
| No              | No          | Yes          | Azure portal only |

&#42; The private plan of the offer will only be available via the Azure portal

For example, an offer with metered billing and a private plan only (no public plan), will be purchased by customers in the Azure Portal. Learn more about [Private offers in Microsoft commercial marketplace](private-offers.md).

### Categories

Categories and subcategories are mapped to each storefront based on the target audience. Select the categories and subcategories that best align with your offer and the intended audience. You can select:

* At least one and up to two categories. You have the option to choose a primary and a secondary category.
* Up to two subcategories for each primary and/or secondary category. If you don’t select any subcategory, your offer will still be discoverable under the selected category.

| [**Azure Marketplace**](https://azuremarketplace.microsoft.com/marketplace/apps)  | [**AppSource**](https://appsource.microsoft.com/marketplace/apps) |
| :------------------- |:----------------|
|**Analytics** | **Analytics** |
| &nbsp;&nbsp;Data Insights | &nbsp;&nbsp;Advanced Analytics  |
| &nbsp;&nbsp;Data Analytics |  &nbsp;&nbsp;Visualization & Reporting |
| &nbsp;&nbsp;Big Data | **AI + Machine Learning**  |
| &nbsp;&nbsp;Predictive Analytics | &nbsp;&nbsp;AI for Business |
| &nbsp;&nbsp;Real-time/Streaming Analytics | &nbsp;&nbsp;Bot Apps |
| **AI + Machine Learning** | **Collaboration** |
| &nbsp;&nbsp;Bot Service | &nbsp;&nbsp;Contact & People |
| &nbsp;&nbsp;Cognitive Services | &nbsp;&nbsp;Meeting Management |
| &nbsp;&nbsp;ML Service | &nbsp;&nbsp;Site Design & Management |
| &nbsp;&nbsp;Automated ML | &nbsp;&nbsp;Task & Project Management |
| &nbsp;&nbsp;Business/Robotic Process Automation | &nbsp;&nbsp;Voice & Video Conferencing |
| &nbsp;&nbsp;Data Labeling | **Compliance & Legal** |
| &nbsp;&nbsp;Data Preparation | &nbsp;&nbsp;Tax & Audit |
| &nbsp;&nbsp;Knowledge Mining | &nbsp;&nbsp;Legal |
| &nbsp;&nbsp;ML Operations | &nbsp;&nbsp;Data, Governance & Privacy |
| **Blockchain**  | &nbsp;&nbsp;Health & Safety |
| &nbsp;&nbsp;App Accelerators | **Customer Service**  |
| &nbsp;&nbsp;Single-node Ledger | &nbsp;&nbsp;Contact Center |
| &nbsp;&nbsp;Multi-node Ledger | &nbsp;&nbsp;Face to Face Service |
| &nbsp;&nbsp;Tools | &nbsp;&nbsp;Back Office & Employee Service |
| **Compute**  | &nbsp;&nbsp;Knowledge & Case Management |
| &nbsp;&nbsp;Application Infrastructure | &nbsp;&nbsp;Social Media & Omnichannel Engagement |
| &nbsp;&nbsp;Operating Systems | **Finance** |
| &nbsp;&nbsp;Cache | &nbsp;&nbsp;Accounting |
| **Containers**  | &nbsp;&nbsp;Asset Management |
| &nbsp;&nbsp;Get Started with Containers | &nbsp;&nbsp;Analytics, Consolidation & Reporting |
| &nbsp;&nbsp;Container Apps | &nbsp;&nbsp;Credit & Collections |
| &nbsp;&nbsp;Container Images | &nbsp;&nbsp;Compliance & Risk Management |
| **Databases**  | **Geolocation** |
| &nbsp;&nbsp;NoSQL Databases | &nbsp;&nbsp;Maps |
| &nbsp;&nbsp;Relational Databases | &nbsp;&nbsp;News & Weather |
| &nbsp;&nbsp;Ledger/Blockchain Databases | **Human Resources** |
| &nbsp;&nbsp;Data Lakes | &nbsp;&nbsp;Talent Acquisition |
| &nbsp;&nbsp;Data Warehouse | &nbsp;&nbsp;Talent Management |
| **Developer Tools**  | &nbsp;&nbsp;HR Operations |
| &nbsp;&nbsp;Tools | &nbsp;&nbsp;Workforce Planning & Analytics |
| &nbsp;&nbsp;Scripts | **IT & Management Tools** |
| &nbsp;&nbsp;Developer Service | &nbsp;&nbsp;Management Solutions |
| **DevOps**  | &nbsp;&nbsp;Business Applications |
| **Integration**  | **Internet of Things** |
| &nbsp;&nbsp;Messaging | &nbsp;&nbsp;Asset Management & Operations |
| **IT & Management Tools**  | &nbsp;&nbsp;Connected Products |
| &nbsp;&nbsp;Management Solutions | &nbsp;&nbsp;Intelligent Supply Chain |
| &nbsp;&nbsp;Business Applications | &nbsp;&nbsp;Predictive Maintenance |
| **Identity**  | &nbsp;&nbsp;Remote Monitoring |
| &nbsp;&nbsp;Access Management | &nbsp;&nbsp;Safety & Security |
| **Internet of Things**  | &nbsp;&nbsp;Smart Infrastructure & Resources |
| &nbsp;&nbsp;IoT Connectivity | &nbsp;&nbsp;Vehicles & Mobility |
| &nbsp;&nbsp;IoT Core Services | **Marketing** |
| &nbsp;&nbsp;IoT Edge Modules | &nbsp;&nbsp;Advertisement |
| &nbsp;&nbsp;IoT Solutions | &nbsp;&nbsp;Analytics |
| &nbsp;&nbsp;Data Analytics & Visualization | &nbsp;&nbsp;Campaign Management & Automation |
| **Media**  | &nbsp;&nbsp;Email Marketing |
| &nbsp;&nbsp;Media Services | &nbsp;&nbsp;Events & Resource Management |
| &nbsp;&nbsp;Content Protection | &nbsp;&nbsp;Research & Analysis |
| &nbsp;&nbsp;Live & On-Demand Streaming | &nbsp;&nbsp;Social Media |
| **Monitoring & Diagnostics**  | **Operations & Supply Chain** |
| **Migration**  | &nbsp;&nbsp;Asset & Production Management |
| &nbsp;&nbsp;Data Migration | &nbsp;&nbsp;Demand Forecasting |
| **Mixed Reality**  | &nbsp;&nbsp;Information Management & Connectivity |
| **Networking**  | &nbsp;&nbsp;Planning, Purchasing & Reporting |
| &nbsp;&nbsp;Appliance Managers | &nbsp;&nbsp;Quality & Service Management |
| &nbsp;&nbsp;Connectivity | &nbsp;&nbsp;Sales & Order Management |
| &nbsp;&nbsp;Firewalls | &nbsp;&nbsp;Transportation & Warehouse Management |
| &nbsp;&nbsp;Load Balancers | **Productivity** |
| **Security**  | &nbsp;&nbsp;Content Creation & Management |
| &nbsp;&nbsp;Identity & Access Management | &nbsp;&nbsp;Document Management |
| &nbsp;&nbsp;Threat Protection | &nbsp;&nbsp;Email Management |
| &nbsp;&nbsp;Information Protection | &nbsp;&nbsp;Language & Translation |
| **Storage**  | &nbsp;&nbsp;Search & Reference |
| &nbsp;&nbsp;Backup & Recovery | &nbsp;&nbsp;Gamification |
| &nbsp;&nbsp;Enterprise Hybrid Storage | **Sales** |
| &nbsp;&nbsp;File Sharing | &nbsp;&nbsp;Telesales |
| &nbsp;&nbsp;Data Life-cycle Management | &nbsp;&nbsp;Configure, Price, Quote (CPQ) |
| **Web**  | &nbsp;&nbsp;Contract Management |
| &nbsp;&nbsp;Blogs & CMSs | &nbsp;&nbsp;CRM |
| &nbsp;&nbsp;Starter Web Apps | &nbsp;&nbsp;E-commerce |
| &nbsp;&nbsp;E-commerce | &nbsp;&nbsp;Business Data Enrichment  |
| &nbsp;&nbsp;Web App Frameworks | &nbsp;&nbsp;Sales Enablement  |
| &nbsp;&nbsp;Web Apps |  |

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

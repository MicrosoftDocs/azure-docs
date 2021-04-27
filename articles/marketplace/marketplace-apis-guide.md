---
title: Aligning your Business with our eCommerce Platform
description: Learn how to Aligning your Business with our eCommerce Platform (Azure Marketplace).
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
author: mingshen-ms
ms.author: mingshen
ms.date: 04/23/2021
---

# Aligning your Business with our eCommerce Platform

This article describes how the commercial marketplace User Interface (UI) and programmatic Application Programming Interfaces (API's) combine to support your business processes. The links under the API point to the specific interfaces developers can use to integrate your CRM system with the commercial marketplace.

## Overview of processes

| | Overview of ISV sales processes | Overview of Marketplace APIs vs processes | Overview of Marketplace UI vs processes |
| -- | -- | -- | -- |
| <center><img src="media/api-guide/icon-product-marketing.png" alt-text="The icon for product marketing"> **Product Marketing** | Create product messaging, positioning, promotion, pricing | Create product messaging, positioning, promotion, pricing<br>[Partner Ingestion API](https://apidocs.microsoft.com/services/partneringestion/)<br>[Azure Apps Onboarding API](https://docs.microsoft.com/azure/marketplace/partner-center-portal/azure-app-apis)<br>**Partner Ingestion API v.2**</ul> | Create product messaging, positioning, promotion, pricing<br>Partner Center ( **PC** ) -> Offer Creation |
| <center><img src="media/api-guide/icon-demand-generation.png" alt-text="The icon for demand generation"> **Demand Generation** | Product Promotion<br>Lead nurturing<br>Eval, trial & PoC | Product Promotion<br>Lead nurturing<br>Eval, trial & PoC<br>**Lead Sharing API & Lead Navigator UI**<br>[Lead CRM Connector for D365, SFDC and Marketo](https://docs.microsoft.com/azure/marketplace/partner-center-portal/commercial-marketplace-get-customer-leads)<br>[Co-Sell Connector for SalesForce CRM](https://docs.microsoft.com/partner-center/connector-salesforce)<br>[Co-Sell Connector for Dynamics 365 CRM](https://docs.microsoft.com/partner-center/connector-dynamics) | Product Promotion<br>Lead nurturing<br>Eval, trial & PoC<br>**Azure Marketplace** and **AppSource**<br>**PC** Marketplace Insights<br>**PC** Co-Sell Opportunities |
| <center><img src="media/api-guide/icon-negotiation-quote-creation.png" alt-text="The icon for negotiation and quote creation"> **Negotiation and Quote Creation** | T&Cs<br>Pricing<br>Discount approvals<br>Final quote | T&Cs<br>Pricing<br>Discount approvals<br>Final quote<br>**Private Offer API**<br>[CPP API for VM's](https://docs.microsoft.com/azure/marketplace/cloud-partner-portal-api-overview)<br>[Microsoft Graph for AAD API](https://docs.microsoft.com/azure/active-directory/reports-monitoring/concept-reporting-api)<br>[Partner Center '7' API Family](https://apidocs.microsoft.com/services/partnercenter) | T&Cs<br>Pricing<br>Discount approvals<br>Final quote<br>**PC** -> Plans (public or private) |
| <center><img src="media/api-guide/icon-sale.png" alt-text="The icon for sale"><br>**Sale** | Contract signing<br>Revenue Recognition<br>Invoicing<br>Billing | Contract signing<br>Revenue Recognition<br>Invoicing<br>Billing<br>**Marketplace Rewards API**<br>[SaaS fulfillment API v.2](https://docs.microsoft.com/azure/marketplace/partner-center-portal/pc-saas-fulfillment-api-v2)<br>[Reporting APIs](https://partneranalytics-api.azureedge.net/partneranalytics-api/Programmatic%20Access%20to%20Commercial%20Marketplace%20Analytics%20Data_v1.pdf) | Contract signing<br>Revenue Recognition<br>Invoicing<br>Billing<br>**Azure Portal / Admin Center**<br>**PC** Marketplace Rewards<br>**PC** Payouts Reports<br>**PC** Marketplace Analytics<br>**PC** Co-Sell Closing |
| <center><img src="media/api-guide/icon-maintenance.png" alt-text="The icon for maintenance"> **Maintenance** | Recurring billing<br>Overages<br>Product Support | Recurring billing<br>Overages<br>Product Support<br>[SaaS/AMAs: Billing APIs](https://partneranalytics-api.azureedge.net/partneranalytics-api/Programmatic%20Access%20to%20Commercial%20Marketplace%20Analytics%20Data_v1.pdf)<br>[SaaS fulfillment API v.2](https://docs.microsoft.com/azure/marketplace/partner-center-portal/pc-saas-fulfillment-api-v2)<br>[Partner Payouts API](https://apidocs.microsoft.com/services/partnerpayouts) <br>[github](https://github.com/microsoft/Partner-Center-Payout-APIs)<br>[Metered billing API](https://docs.microsoft.com/azure/marketplace/partner-center-portal/marketplace-metering-service-apis)<br>[(EA Customer) Azure Consumption API](https://docs.microsoft.com/rest/api/consumption/)<br>[(EA Customer) Azure Charges List API](https://docs.microsoft.com/rest/api/consumption/charges/list)<br>[Payment Services Providers API](https://revapi.developer.azure-api.net/) | Recurring billing<br>Overages<br>Product Support<br>**PC** Payouts Reports<br>**PC** Marketplace Analytics |
| <center><img src="media/api-guide/icon-contract-end.png" alt-text="The icon for contract end"> **Contract End** | Renew or<br>Terminate |Renew or<br>Terminate <br>[SaaS fulfillment API v.2](https://docs.microsoft.com/azure/marketplace/partner-center-portal/pc-saas-fulfillment-api-v2)<br>AMA/VM's: auto-renew | Renew or<br>Terminate<br>**PC** Marketplace Analytics |

## Next steps

- need one
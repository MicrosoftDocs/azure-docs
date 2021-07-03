---
title: Align your business with our eCommerce platform and Azure Marketplace
description: Align your business with our eCommerce platform (Azure Marketplace).
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
author: MarlEva
ms.author: maevan
ms.date: 05/13/2021
---

# Align your business with our e-commerce platform

This article describes how the commercial marketplace User Interface (UI) and programmatic Application Programming Interfaces (APIs) combine to support your business processes. The links under the API point to the specific interfaces developers can use to integrate their CRM system with the commercial marketplace.

## Overview of activities

The activities below are not sequential. The activity you use is dependent on your business needs and sales processes. This guide shows how to integrate different APIs to automate each activity.

| <center>Activity | ISV sales activities | Corresponding Marketplace API | Corresponding Marketplace UI |
| --- | --- | --- | --- |
| <center>**1. Product Marketing**<br><img src="media/api-guide/icon-product-marketing.png" alt="The icon for product marketing"> | Create product messaging, positioning, promotion, pricing | Create product messaging, positioning, promotion, pricing<br>[Partner Ingestion API](https://apidocs.microsoft.com/services/partneringestion/)<br>[Azure Apps Onboarding API](azure-app-apis.md)</ul> | Create product messaging, positioning, promotion, pricing<br>Partner Center (PC) → Offer Creation |
| <center>**2. Demand Generation**<br><img src="media/api-guide/icon-demand-generation.png" alt="The icon for demand generation"> | Product Promotion<br>Lead nurturing<br>Eval, trial & PoC | Product Promotion<br>Lead nurturing<br>Eval, trial & PoC<br>[Lead CRM Connector for D365, SFDC and Marketo](partner-center-portal/commercial-marketplace-get-customer-leads.md)<br>[Co-Sell Connector for SalesForce CRM](/partner-center/connector-salesforce)<br>[Co-Sell Connector for Dynamics 365 CRM](/partner-center/connector-dynamics) | Product Promotion<br>Lead nurturing<br>Eval, trial & PoC<br>Azure Marketplace and AppSource<br>PC Marketplace Insights<br>PC Co-Sell Opportunities |
| <center>**3. Negotiation and Quote Creation**<br><img src="media/api-guide/icon-negotiation-quote-creation.png" alt="The icon for negotiation and quote creation"> | T&Cs<br>Pricing<br>Discount approvals<br>Final quote | T&Cs<br>Pricing<br>Discount approvals<br>Final quote<br>[CPP API for VM's](cloud-partner-portal-api-overview.md)<br>[Microsoft Graph for AAD API](../active-directory/reports-monitoring/concept-reporting-api.md)<br>[Partner Center '7' API Family](https://apidocs.microsoft.com/services/partnercenter) | T&Cs<br>Pricing<br>Discount approvals<br>Final quote<br>PC → Plans (public or private) |
| <center>**4. Sale**<br><img src="media/api-guide/icon-sale.png" alt="The icon for sale"> | Contract signing<br>Revenue Recognition<br>Invoicing<br>Billing | Contract signing<br>Revenue Recognition<br>Invoicing<br>Billing<br>[SaaS fulfillment API v.2](partner-center-portal/pc-saas-fulfillment-api-v2.md)<br>[Reporting APIs](https://partneranalytics-api.azureedge.net/partneranalytics-api/Programmatic%20Access%20to%20Commercial%20Marketplace%20Analytics%20Data_v1.pdf) | Contract signing<br>Revenue Recognition<br>Invoicing<br>Billing<br>Azure portal / Admin Center<br>PC Marketplace Rewards<br>PC Payouts Reports<br>PC Marketplace Analytics<br>PC Co-Sell Closing |
| <center>**5. Maintenance**<br><img src="media/api-guide/icon-maintenance.png" alt="The icon for maintenance"> | Recurring billing<br>Overages<br>Product Support | Recurring billing<br>Overages<br>Product Support<br>[SaaS/AMAs: Billing APIs](https://partneranalytics-api.azureedge.net/partneranalytics-api/Programmatic%20Access%20to%20Commercial%20Marketplace%20Analytics%20Data_v1.pdf)<br>[SaaS fulfillment API v.2](partner-center-portal/pc-saas-fulfillment-api-v2.md)<br>[Partner Payouts API](https://apidocs.microsoft.com/services/partnerpayouts) <br>[github](https://github.com/microsoft/Partner-Center-Payout-APIs)<br>[Metered billing API](marketplace-metering-service-apis.md)<br>[(EA Customer) Azure Consumption API](/rest/api/consumption/)<br>[(EA Customer) Azure Charges List API](/rest/api/consumption/charges/list) | Recurring billing<br>Overages<br>Product Support<br>PC Payouts Reports<br>PC Marketplace Analytics |
| <center>**6. Contract End**<br><img src="media/api-guide/icon-contract-end.png" alt="The icon for contract end"> | Renew or<br>Terminate |Renew or<br>Terminate <br>[SaaS fulfillment API v.2](partner-center-portal/pc-saas-fulfillment-api-v2.md)<br>AMA/VM's: auto-renew | Renew or<br>Terminate<br>PC Marketplace Analytics |
|

## Next steps

- Visit the links above for each API as needed.
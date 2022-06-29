---
title: Align your business with our e-commerce platform and Azure Marketplace.
description: Align your business with our e-commerce platform (Azure Marketplace).
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
author: mingshen-ms
ms.author: mingshen
ms.date: 06/21/2022
---

# Align your business with our e-commerce platform

In this article, you will learn how the commercial marketplace user interface (UI) and programmatic application programming interfaces (APIs) combine to support your business processes. 

## Overview of activities

The following guide shows how to integrate different APIs to automate each nonsequestial activity. The links in the API column point to the specific interfaces developers can use to integrate their CRM system with the commercial marketplace. The activity you use depends on your business needs and sales processes.

| <center>Activity | ISV sales activities | Corresponding Marketplace API | Corresponding Marketplace UI |
| --- | --- | --- | --- |
| <center>**Product Marketing**<br><img src="media/api-guide/icon-product-marketing.png" alt="The icon for product marketing"> | product messaging, positioning, promotion, and pricing | product messaging, positioning, promotion, and pricing; <br>the Partner Ingestion API;<br>the [Product Ingestion API](product-ingestion-api.md)</ul> | product messaging, positioning, promotion, and pricing;<br>Partner Center (PC) → offer creation |
| <center>**Demand Generation**<br><img src="media/api-guide/icon-demand-generation.png" alt="The icon for demand generation"> | product promotion,<br>lead nurturing,<br>eval, trial, and PoC | product promotion;<br>lead nurturing;<br>eval, trial, and PoC; <br>[lead CRM connector for D365, SFDC, and Marketo](partner-center-portal/commercial-marketplace-get-customer-leads.md); <br>[co-sell Connector for SalesForce CRM](/partner-center/connector-salesforce); <br>[co-sell connector for Dynamics 365 CRM](/partner-center/connector-dynamics) | product promotion,<br>lead nurturing,<br>eval, trial, and PoC;<br>Azure Marketplace and AppSource;<br>PC Marketplace insights;<br>PC co-sell opportunities |
| <center>**Negotiation and Quote Creation**<br><img src="media/api-guide/icon-negotiation-quote-creation.png" alt="The icon for negotiation and quote creation"> | T&Cs,<br>pricing,<br>discount approvals,<br>final quote | T&Cs,<br>pricing,<br>discount approvals,<br>final quote;<br>the [Cloud Partner Portal API for virtual machines (VMs);](cloud-partner-portal-api-overview.md)<br>[Microsoft Graph for the Azure Active Directory API;](../active-directory/reports-monitoring/concept-reporting-api.md)<br>[Partner Center '7' API family](/partner-center/) | T&Cs,<br>pricing,<br>discount approvals,<br>final quote,<br>PC → plans (public or private) |
| <center>**Sale**<br><img src="media/api-guide/icon-sale.png" alt="The icon for sale"> | contract signing,<br>revenue recognition,<br>invoicing,<br>billing | contract signing<br>revenue recognition,<br>invoicing,<br>billing,<br>[SaaS fulfillment API v.2](partner-center-portal/pc-saas-fulfillment-apis.md),<br>[reporting APIs](https://partneranalytics-api.azureedge.net/partneranalytics-api/Programmatic%20Access%20to%20Commercial%20Marketplace%20Analytics%20Data_v1.pdf) | contract signing,<br>revenue recognition,<br>invoicing,<br>billing,<br>Azure portal / admin center,<br>PC Marketplace Rewards,<br>PC payouts reports,<br>PC marketplace analytics,<br>PC co-sell closing |
| <center>**Maintenance**<br><img src="media/api-guide/icon-maintenance.png" alt="The icon for maintenance"> | recurring billing,<br>overages,<br>product support | recurring billing,<br>overages,<br>product support,<br>[SaaS/AMAs: billing APIs](https://partneranalytics-api.azureedge.net/partneranalytics-api/Programmatic%20Access%20to%20Commercial%20Marketplace%20Analytics%20Data_v1.pdf),<br>[SaaS fulfillment API v.2](partner-center-portal/pc-saas-fulfillment-apis.md),<br>Partner Payouts API<br>[GitHub](https://github.com/microsoft/Partner-Center-Payout-APIs),<br>[Metered billing API](marketplace-metering-service-apis.md)<br>[(EA Customer), Azure Consumption API](/rest/api/consumption/)<br>[(EA Customer), Azure charges list API](/rest/api/consumption/charges/list) | recurring billing,<br>overages,<br>product support,<br>PC payouts reports,<br>PC marketplace analytics |
| <center>**Contract End**<br><img src="media/api-guide/icon-contract-end.png" alt="The icon for contract end"> | Renew or<br>terminate |Renew or<br>terminate, <br>[SaaS fulfillment API v.2](./partner-center-portal/pc-saas-fulfillment-apis.md),<br>AMA/VM's: auto-renew | Renew or<br>terminate,<br>PC marketplace analytics |

## Next steps

- Visit the links above for each API as needed.

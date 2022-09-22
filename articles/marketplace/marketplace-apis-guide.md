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

This article describes how the commercial marketplace user interface (UI) and programmatic application programming interfaces (APIs) combine to support your business processes.

## Overview of activities

The following guide shows how to integrate different APIs to automate each activity. The links in the API column point to the specific interfaces that developers can use to integrate their customer relationship management (CRM) system with the commercial marketplace. The activity that you use depends on your business needs and sales processes.

| <center>Activity | ISV sales activities | Corresponding marketplace API | Corresponding marketplace UI |
| --- | --- | --- | --- |
| <center>**Product marketing**<br><img src="media/api-guide/icon-product-marketing.png" alt="The icon for product marketing"> | Product messaging, positioning, promotion, and pricing | Product messaging, positioning, promotion, and pricing; <br>the Partner Ingestion API;<br>the [Product Ingestion API](product-ingestion-api.md)</ul> | Product messaging, positioning, promotion, and pricing;<br>Partner Center: offer creation |
| <center>**Demand generation**<br><img src="media/api-guide/icon-demand-generation.png" alt="The icon for demand generation"> | Product promotion,<br>lead nurturing,<br>evaluation, trial, and proof of concept (PoC) | Product promotion,<br>lead nurturing,<br>evaluation, trial, and PoC; <br>[lead CRM connector for Dynamics 365, SFDC, and Marketo](partner-center-portal/commercial-marketplace-get-customer-leads.md); <br>[co-sell Connector for Salesforce CRM](/partner-center/connector-salesforce); <br>[co-sell connector for Dynamics 365 CRM](/partner-center/connector-dynamics) | Product promotion,<br>lead nurturing,<br>evaluation, trial, and PoC;<br>Azure Marketplace and AppSource;<br>Partner Center Marketplace insights;<br>Partner Center co-sell opportunities |
| <center>**Negotiation and quote creation**<br><img src="media/api-guide/icon-negotiation-quote-creation.png" alt="The icon for negotiation and quote creation"> | Terms and conditions (T&Cs),<br>pricing,<br>discount approvals,<br>final quote | T&Cs,<br>pricing,<br>discount approvals,<br>final quote;<br>the [Cloud Partner Portal API for virtual machines (VMs);](cloud-partner-portal-api-overview.md)<br>[Microsoft Graph for the Azure Active Directory API;](../active-directory/reports-monitoring/concept-reporting-api.md)<br>[Partner Center 7 API family](/partner-center/) | T&Cs,<br>pricing,<br>discount approvals,<br>final quote,<br>Partner Center: plans (public or private) |
| <center>**Sale**<br><img src="media/api-guide/icon-sale.png" alt="The icon for sale"> | Contract signing,<br>revenue recognition,<br>invoicing,<br>billing | Contract signing,<br>revenue recognition,<br>invoicing,<br>billing,<br>[SaaS fulfillment API v.2](partner-center-portal/pc-saas-fulfillment-apis.md),<br>[reporting APIs](https://partneranalytics-api.azureedge.net/partneranalytics-api/Programmatic%20Access%20to%20Commercial%20Marketplace%20Analytics%20Data_v1.pdf) | Contract signing,<br>revenue recognition,<br>invoicing,<br>billing,<br>Azure portal / admin center,<br>Partner Center Marketplace Rewards,<br>Partner Center payouts reports,<br>Partner Center marketplace analytics,<br>Partner Center co-sell closing |
| <center>**Maintenance**<br><img src="media/api-guide/icon-maintenance.png" alt="The icon for maintenance"> | Recurring billing,<br>overages,<br>product support | Recurring billing,<br>overages,<br>product support,<br>[SaaS/Azure Monitor agents: billing APIs](https://partneranalytics-api.azureedge.net/partneranalytics-api/Programmatic%20Access%20to%20Commercial%20Marketplace%20Analytics%20Data_v1.pdf),<br>[SaaS fulfillment API v.2](partner-center-portal/pc-saas-fulfillment-apis.md),<br>Partner Payouts API,<br>[GitHub](https://github.com/microsoft/Partner-Center-Payout-APIs),<br>[Metered billing API](marketplace-metering-service-apis.md), <br>[Enterprise Agreement (EA) Customer, Azure Consumption API](/rest/api/consumption/)<br>[(EA customer), Azure charges list API](/rest/api/consumption/charges/list) | Recurring billing,<br>overages,<br>product support,<br>Partner Center payouts reports,<br>Partner Center marketplace analytics |
| <center>**Contract end**<br><img src="media/api-guide/icon-contract-end.png" alt="The icon for contract end"> | Renew or<br>terminate |Renew or<br>terminate, <br>[SaaS fulfillment API v.2](./partner-center-portal/pc-saas-fulfillment-apis.md),<br>Azure Monitor agent/VMs: auto-renew | Renew or<br>terminate,<br>Partner Center marketplace analytics |

## Next steps

- Visit the API links in the table, as needed.

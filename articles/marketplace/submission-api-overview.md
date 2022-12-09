---
title: Overview of commercial marketplace submission APIs in Partner Center
description: Gain an overview of commercial marketplace submission APIs. 
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.author: mingshen
author: mingshen-ms
ms.date: 09/23/2022
---

# Commercial marketplace submission API overview

Use API to programmatically query, create submissions for, and publish offers. API is useful if your account manages many offers and you want to automate and optimize the submission process for these offers.

## Types of APIs

There are two sets of submission API available:

- **Partner Center submission API** – The common set of APIs that work across consumer and commercial products to publish through Partner Center. New capabilities are continuously added to this set of APIs. For more information on how to integrate with this API, see [Partner Center submission API onboarding](submission-api-onboard.md).
- **Product Ingestion API** – The new set of modern APIs to create and manage commercial offers through Partner Center. New capabilities are continuously added to this set of APIs. The APIs are in preview state and will soon be launched for all offer types and will eventually replace the Partner Center submission and Legacy Cloud Partner Portal APIs. For more information on how to integrate with the modern Product Ingestion API, see [Product Ingestion API for the commercial marketplace](product-ingestion-api.md).  
- **Legacy Cloud Partner Portal API** – The APIs carried over from the deprecated Cloud Partner Portal; it is integrated with and continues to work in Partner Center. This set of APIs is in maintenance mode only; new capabilities introduced in Partner Center may not be supported, and it should only be used for existing products that were already integrated before transition to Partner Center. For more information on how to continue to use the Cloud Partner Portal APIs, see [Cloud Partner Portal API Reference](cloud-partner-portal-api-overview.md).

Refer to the following table for supported submission APIs for each offer type.

| Offer type | Legacy Cloud Partner Portal API Support | Partner Center submission API support | Product Ingestion API support |
| --- | :---: | :---: |--------------------|
| Azure Application |  | &#x2714; | |
| Azure Container | &#x2714; |  | |
| Azure Virtual Machine | &#x2714; |  | &#x2714;|
| Consulting Service | &#x2714; |  | |
| Dynamics 365 |  | &#x2714; | |
| IoT Edge Module | &#x2714; |  | |
| Managed Service | &#x2714; |  | |
| Power BI App | &#x2714; |  | |
| Software as a Service |  | &#x2714; | |

Microsoft 365 Office add-ins, Microsoft 365 SharePoint solutions, Microsoft 365 Teams apps, and Power BI Visuals don’t have submission API support.

## Next steps

- Visit the API link appropriate for your offer type as needed

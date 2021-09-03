---
title: Overview of commercial marketplace submission APIs
description: Gain an overview of commercial marketplace submission APIs in Azure Marketplace. 
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.author: mingshen
author: mingshen-ms
ms.date: 09/03/2021
---

# Commercial marketplace submission API overview

Use API to programmatically query, create submissions for, and publish offers. API is useful if your account manages many offers and you want to automate and optimize the submission process for these offers.

## Types of APIs

There are two sets of submission API available:

- **Partner Center submission API** – The common set of APIs that work across consumer and commercial products to publish through Partner Center. New capabilities are continuously added to this set of APIs. For more information on how to integrate with this API, see [Partner Center submission API prerequisites](need-link.md). 
- **Legacy Cloud Partner Portal API** – The APIs carried over from the deprecated Cloud Partner Portal; it is integrated with and continues to work in Partner Center. This set of APIs is in maintenance mode only; new capabilities introduced in Partner Center are not supported, and it should only be used for existing products that were already integrated before transition to Partner Center. For more information on how to continue to use the Cloud Partner Portal APIs, see [Cloud Partner Portal API Reference](cloud-partner-portal-api-overview.md). 

Not all offer types are supported by both sets of APIs. Refer to the following table for supported submission APIs for each offer type.

| Offer type | Legacy Cloud Partner Portal API Support |	Partner Center submission API support |
| --- | :---: | :---: |
| Software as a Service |  | &#x2714; |
| Azure Application |  | &#x2714; |
| Dynamics 365 |  | &#x2714; |
| Consulting Service | &#x2714; |  |
| Azure Container | &#x2714; |  |
| IoT Edge Module | &#x2714; |  |
| Managed Service | &#x2714; |  |
| Power BI App | &#x2714; |  |
| Power BI Visual |  |  |
| Azure Virtual Machine | &#x2714; |  |
|

## Next steps

- ???
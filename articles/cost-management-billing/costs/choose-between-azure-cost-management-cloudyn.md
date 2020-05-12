---
title: Choose between Azure Cost Management and Cloudyn
description: This article helps you determine whether Azure Cost Management or Cloudyn is best for your cost management needs.
author: bandersmsft
ms.author: banders
ms.date: 03/20/2020
ms.topic: conceptual
ms.service: cost-management-billing
ms.reviewer: adwise

---

# Choose between Azure Cost Management and Cloudyn

Cloudyn is being deprecated by the end of 2020. Existing Cloudyn features are being integrated directly into the Azure portal wherever possible. With the exception of CSP customers, no new customers can onboard at this time. Support for the existing product will remain until it is fully deprecated.

Microsoft acquired Cloudyn and is migrating its cost management features from the Cloudyn portal natively into Azure. To use the new features, sign in to the Azure portal and navigate to [Cost Management and Billing](https://ms.portal.azure.com/#blade/Microsoft_Azure_CostManagement/Menu/overview) in the list of Azure services. Compared to Cloudyn, the native experience offers improved performance and lower data latency of about eight hours.

Key feature migration for Enterprise Agreement, Pay-As-You-Go, and MSDN offer categories to Azure Cost Management is complete. CSP subscriptions are in the process of being migrated over to Azure Cost Management.

If you have an offer category not yet migrated, you should continue to use the Cloudyn portal. Everyone else can use Azure Cost Management.

## Recommended services by offer

| Microsoft Azure offers | Recommended cost management service |
| --- | --- |
| Azure Enterprise Agreement | [Azure Cost Management](https://ms.portal.azure.com/#blade/Microsoft_Azure_CostManagement/Menu/overview) |
| Azure Web Direct (PAYG/MSDN) | [Azure Cost Management](https://ms.portal.azure.com/#blade/Microsoft_Azure_CostManagement/Menu/overview) |
| Azure Government | [Azure Cost Management](https://ms.portal.azure.com/#blade/Microsoft_Azure_CostManagement/Menu/overview) |
| Microsoft Customer Agreement | [Azure Cost Management](https://ms.portal.azure.com/#blade/Microsoft_Azure_CostManagement/Menu/overview)|
| Microsoft Customer Agreement supported by partners | [Azure Cost Management](https://ms.portal.azure.com/#blade/Microsoft_Azure_CostManagement/Menu/overview)|
| Azure CSP | [Cloudyn](https://azure.cloudyn.com) |


## Available Cost Management features

Some of the following features are available in Cloudyn, but all of them are available now in Azure Cost Management.

- APIs
- Azure cost optimization recommendations, including but not limited to:
    - Azure instance right sizing and shutdown recommendations
    - Azure Reservation recommendations
- Budgets
- Cost analysis
- Export data to an Azure storage account
- Lower latency
- Power BI template app
- Resource tag support
- Cross-cloud cost analysis support for AWS

## Next steps
- Learn more about [Azure Cost Management](../cost-management-billing-overview.md).
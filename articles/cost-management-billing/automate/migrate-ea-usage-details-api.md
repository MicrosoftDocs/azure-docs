---
title: Migrate from the EA Usage Details APIs
titleSuffix: Azure Cost Management + Billing
description: This article has information to help you migrate from the EA Usage Details APIs.
author: bandersmsft
ms.author: banders
ms.date: 05/18/2022
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: adwise
---

# Migrate from EA Usage Details APIs

EA customers who were previously using the Enterprise Reporting APIs behind the consumption.azure.com endpoint to obtain usage details and marketplace charges need to migrate to a parity Azure Resource Manager API. Instructions to do this are outlined below along with any contract differences between the old API and the new API.

## Migration destinations

We've merged Azure Marketplace and Azure usage records into a single usage details dataset. Read the [Usage details best practices](usage-details-best-practices.md) article before you choose the solution that's right for your workload. Generally, we recommend using [Exports](../costs/tutorial-export-acm-data.md) if you have ongoing data ingestion needs or a large monthly usage details dataset. For more information, see [Ingest usage details data](automation-ingest-usage-details-overview.md).

If you have a smaller usage details dataset or a scenario that isn't met by Exports, consider using the [Cost Details API-UNPUBLISHED-UNPUBLISHED](../index.yml) instead. For more information, see [Get small cost datasets on demand](get-small-usage-datasets-on-demand.md).

## Migration benefits

New solutions provide many benefits over the Consumption Usage Details API. Here's a summary:

- **Single dataset for all usage details** - Azure and Azure Marketplace usage details were merged into one dataset. It reduces the number of APIs that you need to call to get see all your charges.
- **Scalability** - The Marketplaces API is deprecated because it promotes a call pattern that isn't able to scale as your Azure usage increases. The usage details dataset can get extremely large as you deploy more resources into the cloud. The Marketplaces API is a paginated synchronous API so it isn't optimized to effectively transfer large volumes of data over a network with high efficiency and reliability. Exports and the [Cost Details API-UNPUBLISHED-UNPUBLISHED](../index.yml) are asynchronous. They provide you with a CSV file that can be directly downloaded over the network.
- **API improvements** - Exports and the Cost Details API-UNPUBLISHED are the solutions that Azure supports moving forward. All new features are being integrated into them.
- **Schema consistency** - The [Cost Details API-UNPUBLISHED-UNPUBLISHED](../index.yml) and [Exports](../costs/tutorial-export-acm-data.md) provide files with matching fields os you can move from one solution to the other, based on your scenario.
- **Cost Allocation integration** - Enterprise Agreement and Microsoft Customer Agreement customers using Exports or the Cost Details API-UNPUBLISHED can view charges in relation to the cost allocation rules that they have configured. For more information about cost allocation, see [Allocate costs](../costs/allocate-costs.md).

## Assign permissions to an SPN to call the API

Before calling the API, you need to configure a Service Principal with the correct permission. You use the service principal to call the API. For more information, see [Assign permissions to ACM APIs](cost-management-api-permissions.md).

NEED INFO ON UD AND MARKETPLACE CHARGE SCHEMA MAPPINGS

## Next steps

- Read the [Migrate from EA Reporting to ARM APIs overview](migrate-ea-reporting-arm-apis-overview.md) article.

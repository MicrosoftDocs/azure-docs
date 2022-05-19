---
title: Cost Management + Billing automation FAQ
titleSuffix: Azure Cost Management + Billing
description: This FAQ is a list of frequently asked questions and answers about Cost Management + Billing automation.
author: bandersmsft
ms.author: banders
ms.date: 05/18/2022
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: adwise
---

# Cost Management + Billing automation FAQ

### What's the difference between the Invoice API, the Transaction API, and the Usage Details API?

These APIs provide a different view of the same data:

- The [Invoice API](/api/billing/2019-10-01-preview/invoices) provides an aggregated view of your monthly charges.
- The [Transactions API](/rest/api/billing/2020-05-01/transactions/list-by-invoice) provides a view of your monthly charges aggregated at product/service family level.
- The [Cost Details API-UNPUBLISHED-UNPUBLISHED](../index.yml) provides a granular view of the usage and cost records for each day. Both Enterprise and Microsoft Customer Agreement customers can use it. If you're a legacy pay-as-you-go customer, see [Get Usage Details as a legacy customer](get-usage-details-legacy-customer.md).

### I recently migrated from an EA to an MCA agreement. How do I migrate my API workloads?

See [Migrate from EA to MCA APIs](../costs/migrate-cost-management-api.md).

### When will the [Enterprise Reporting APIs](../manage/enterprise-api.md) get turned off?

The Enterprise Reporting APIs are deprecated. The date that the API will be turned off is still being determined. We recommend that you migrate away from the APIs as soon as possible. For more information, see [Migrate from Enterprise Reporting to Azure Resource Manager APIs](../costs/migrate-from-enterprise-reporting-to-azure-resource-manager-apis.md).

### When will the [Consumption Usage Details API](/rest/api/consumption/usage-details/list) get turned off?

The Consumption Usage Details API is deprecated. The date that the API will bet turned off is still being determined. We recommend that you migrate away from the API as soon as possible. For more information, see [Migrate from Consumption Usage Details API](migrate-consumption-usage-details-api.md).

### When will the [Consumption Marketplaces API](/rest/api/consumption/marketplaces/list) get turned off?

The Marketplaces API is deprecated. The date that the API will be turned off is still being determined. Data from the API is available in the [Cost Details API-UNPUBLISHED-UNPUBLISHED](../index.yml). We recommend that you migrate to it as soon as possible. For more information, see [Migrate from Consumption Marketplaces API](migrate-consumption-marketplaces-api.md).

### When will the [Consumption Forecasts API](/rest/api/consumption/forecasts/list) get turned off?

The Forecasts API is deprecated. The date that the API will be turned off is still being determined. Data from the API is available in the [Cost Management Forecast API](/rest/api/cost-management/forecast). We recommend that you migrate to it as soon as possible. For more information, see [Migrate from Consumption Forecasts API](migrate-consumption-forecasts-api.md).

## Next steps

- Learn more about Cost Management + Billing automation at [Cost Management automation overview](automation-overview.md).
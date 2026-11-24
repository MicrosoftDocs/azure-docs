---
title: Compare downloads and exports for cost and price data
titleSuffix: Microsoft Cost Management
description: Learn how usage files and price sheets that you download differ from exports, including where to get them, which schema version they use, and where new columns appear for each agreement type.
author: Britt-Henderson
ms.author: britth
ms.reviewer: vikdesai
ms.service: cost-management-billing
ms.subservice: cost-management
ms.topic: concept-article
ms.date: 11/19/2026
---

# Compare downloads and exports for cost and price data

You can get your cost and usage details and your price sheet in two ways:

- **Downloads**: Download a file from the Azure portal, or request one by using a download API.
- **Exports**: Have Cost Management write the data to an Azure Storage account, once or on a schedule.

Both provide the same kinds of data, but they differ in how you get the data and in how their columns change over time. This article explains the differences and shows where to download usage files and price sheets for each agreement type.

## Differences between downloads and exports

| Feature | Downloads | Exports |
| --- | --- | --- |
| How you get the data | Cost Management + Billing in the Azure portal, or a download API | The **Exports** page in Cost Management, or the Exports API |
| Where the data goes | Your browser, or a file location that the API returns | An Azure Storage account that you choose |
| When | On demand, one file at a time | One time, daily, or monthly |
| Schema version | Fixed to the latest API version. | You select a dataset version, such as 2026-10-01. | 
| Best for | Reviewing one billing period associated with an invoice. | Recurring reports, large datasets, and automation |

For more information about exports, see [Create and manage exports](../costs/tutorial-improved-exports.md).

## How schema versions work

Each dataset, such as cost and usage details or the price sheet, has versions that define its columns. For the list of datasets and versions, see [Dataset schema index](../dataset-schema/schema-index.md).

- **Exports**: You select the dataset version when you create or update an export. To get new columns, select the latest version. 
- **Downloads**: You can't select a version, and the version doesn't always change if new columns are added (but when new columns are added to the same API version, they're added at the end of the downloaded file, so existing columns keep their positions).

New values in existing columns can appear in every version and in downloads. For example, as of November 2026, the `pricingModel` column shows `FlexPlan` for Flex Plan purchases and covered usage in MCA price sheets in every version.

## Where to download usage files and price sheets

Where you download your data depends on your agreement type. To check your agreement type, see [Check your billing account type](../manage/ea-pricing.md#check-your-billing-account-type).

| Agreement type | Usage file | Price sheet | Column descriptions |
| --- | --- | --- | --- |
| Enterprise Agreement (EA), direct | [Download usage for EA customers](download-azure-daily-usage.md#download-usage-for-ea-customers) | [Download pricing for an Enterprise Agreement](../manage/ea-pricing.md#download-pricing-for-an-enterprise-agreement) | [EA cost and usage details](../dataset-schema/cost-usage-details-ea.md), [EA price sheet](../dataset-schema/price-sheet-ea.md) |
| EA, indirect (managed by a partner) | [Download usage for an indirect Enterprise Agreement](download-azure-daily-usage.md#download-usage-for-an-indirect-enterprise-agreement) | [Download pricing for an indirect Enterprise Agreement](../manage/ea-pricing.md#download-pricing-for-an-indirect-enterprise-agreement) | Same as direct EA |
| Microsoft Customer Agreement (MCA) | [Download usage for your Microsoft Customer Agreement](download-azure-daily-usage.md#download-usage-for-your-microsoft-customer-agreement) | [Download pricing for an MCA or MPA account](../manage/ea-pricing.md#download-pricing-for-an-mca-or-mpa-account) | [MCA cost and usage details](../dataset-schema/cost-usage-details-mca.md), [Terms in your MCA price sheet](../manage/mca-understand-pricesheet.md) |
| Microsoft Partner Agreement (MPA), for CSP partners | [Download usage for a Microsoft Partner Agreement](download-azure-daily-usage.md#download-usage-for-a-microsoft-partner-agreement) | [Download pricing for an MCA or MPA account](../manage/ea-pricing.md#download-pricing-for-an-mca-or-mpa-account) | [MPA cost and usage details](../dataset-schema/cost-usage-details-mca-partner.md) |
| Customers of CSP partners | Not available. If your partner allows it, view your costs in cost analysis or export them. | Not available. Your partner provides your prices. | [CSP subscription cost and usage details](../dataset-schema/cost-usage-details-mca-partner-subscription.md) |


## Related content

- [View and download your Azure usage and charges](download-azure-daily-usage.md)
- [View and download your organization's Azure pricing](../manage/ea-pricing.md)
- [Create and manage exports](../costs/tutorial-improved-exports.md)
- [Dataset schema index](../dataset-schema/schema-index.md)

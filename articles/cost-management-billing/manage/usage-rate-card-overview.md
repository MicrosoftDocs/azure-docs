---
title: Get Azure usage with Azure Billing APIs | Microsoft Docs
description: Learn about Azure Billing Usage and RateCard APIs, which are used to provide insights into Azure resource consumption and trends.
services: ''
documentationcenter: ''
author: tonguyen
manager: mumami
editor: ''
tags: billing

ms.assetid: 3e817b43-0696-400c-a02e-47b7817f9b77
ms.service: cost-management-billing
ms.devlang: na
ms.topic: reference
ms.tgt_pltfrm: na
ms.workload: billing
ms.date: 10/01/2019
ms.author: banders
ms.custom: seodec18
---

# Use Azure Billing APIs to programmatically get insight into your Azure usage
Use Azure Billing APIs to pull usage and resource data into your preferred data analysis tools. The Azure Resource Usage and RateCard APIs can help you accurately predict and manage your costs. The APIs are implemented as a Resource Provider and part of the family of APIs exposed by the Azure Resource Manager.  

## Azure Invoice Download API (Preview)
Once the [opt-in has been complete](manage-billing-access.md#opt-in), download invoices using the preview version of [Invoice API](/rest/api/billing). The features include:

* **Azure Role-based Access Control** - Configure access policies on the [Azure portal](https://portal.azure.com) or through [Azure PowerShell cmdlets](/powershell/azure/overview) to specify which users or applications can get access to the subscription’s usage data. Callers must use standard Azure Active Directory tokens for authentication. Add the caller to either the Billing Reader, Reader, Owner, or Contributor role to get access to the usage data for a specific Azure subscription.
* **Date Filtering** - Use the `$filter` parameter to get all the invoices in reverse chronological order by the invoice period end date.

> [!NOTE]
> This feature is in first version of preview and may be subject to backward-incompatible changes. Currently, it's not available for certain subscription offers (EA, CSP, AIO not supported) and Azure Germany.

## Azure Resource Usage API (Preview)
Use the Azure [Resource Usage API](/previous-versions/azure/reference/mt219003(v=azure.100)) to get your estimated Azure consumption data. The API includes:

* **Azure Role-based Access Control** - Configure access policies on the [Azure portal](https://portal.azure.com) or through [Azure PowerShell cmdlets](/powershell/azure/overview) to specify which users or applications can get access to the subscription’s usage data. Callers must use standard Azure Active Directory tokens for authentication. Add the caller to either the Billing Reader, Reader, Owner, or Contributor role to get access to the usage data for a specific Azure subscription.
* **Hourly or Daily Aggregations** - Callers can specify whether they want their Azure usage data in hourly buckets or daily buckets. The default is daily.
* **Instance metadata (includes resource tags)** – Get instance-level detail like the fully qualified resource uri (/subscriptions/{subscription-id}/..), the resource group information, and resource tags. This metadata helps you deterministically and programmatically allocate usage by the tags, for use-cases like cross-charging.
* **Resource metadata** - Resource details such as the meter name, meter category, meter sub category, unit, and region give the caller a better understanding of what was consumed. We're also working to align resource metadata terminology across the Azure portal, Azure usage CSV, EA billing CSV, and other public-facing experiences, to let you correlate data across experiences.
* **Usage for different offer types** – Usage data is available for offer types like Pay-as-you-go, MSDN, Monetary commitment, Monetary credit, and EA, except [CSP](https://docs.microsoft.com/partner-center).

## Azure Resource RateCard API (Preview)
Use the [Azure Resource RateCard API](/previous-versions/azure/reference/mt219005(v=azure.100)) to get the list of available Azure resources and estimated pricing information for each. The API includes:

* **Azure Role-based Access Control** - Configure your access policies on the [Azure portal](https://portal.azure.com) or through [Azure PowerShell cmdlets](/powershell/azure/overview) to specify which users or applications can get access to the RateCard data. Callers must use standard Azure Active Directory tokens for authentication. Add the caller to either the Reader, Owner, or Contributor role to get access to the usage data for a particular Azure subscription.
* **Support for Pay-as-you-go, MSDN, Monetary commitment, and Monetary credit offers (EA and [CSP](https://docs.microsoft.com/partner-center) not supported)** - This API provides Azure offer-level rate information.  The caller of this API must pass in the offer information to get resource details and rates. We're currently unable to provide EA rates because EA offers have customized rates per enrollment.

## Scenarios
Here are some of the scenarios that are made possible with the combination of the Usage and the RateCard APIs:

* **Azure spend during the month** - Use the combination of the Usage and RateCard APIs to get better insights into your cloud spend during the month. You can analyze the hourly and daily buckets of usage and charge estimates.
* **Set up alerts** – Use the Usage and the RateCard APIs to get estimated cloud consumption and charges, and set up resource-based or monetary-based alerts.
* **Predict bill** – Get your estimated consumption and cloud spend, and apply machine learning algorithms to predict what the bill would be at the end of the billing cycle.
* **Pre-consumption cost analysis** – Use the RateCard API to predict how much your bill would be for your expected usage when you move your workloads to Azure. If you have existing workloads in other clouds or private clouds, you can also map your usage with the Azure rates to get a better estimate of Azure spend. This estimate gives you the ability to pivot on offer, and compare and contrast between the different offer types beyond Pay-As-You-Go, like Monetary commitment and Monetary credit. The API also gives you the ability to see cost differences by region and allows you to do a what-if cost analysis to help you make deployment decisions.
* **What-if analysis** -

  * You can determine whether it is more cost-effective to run workloads in another region, or on another configuration of the Azure resource. Azure resource costs may differ based on the Azure region you're using.
  * You can also determine if another Azure offer type gives a better rate on an Azure resource.


## Next steps
* Check out the code samples on GitHub:
  * [Invoice API code sample](https://go.microsoft.com/fwlink/?linkid=845124)

  * [Usage API code sample](https://github.com/Azure-Samples/billing-dotnet-usage-api)

  * [RateCard API code sample](https://github.com/Azure-Samples/billing-dotnet-ratecard-api)

* To learn more about the Azure Resource Manager, see [Azure Resource Manager Overview](../../azure-resource-manager/management/overview.md).

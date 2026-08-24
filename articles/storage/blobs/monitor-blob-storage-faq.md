---
title: Metrics and logs FAQ
titleSuffix: Azure Blob Storage
description: Frequently asked questions about metrics and logs for Azure Blob Storage.
ms.topic: faq
ms.service: azure-blob-storage
ms.date: 08/24/2026
ms.author: normesta
author: normesta
---

# Metrics and logs FAQ

This article answers frequently asked questions about metrics and logs for Azure Blob Storage.

## Does Azure Storage support metrics for Managed Disks or Unmanaged Disks?

No. Azure Compute supports the metrics on disks. For more information, see [Per disk metrics for Managed and Unmanaged Disks](https://azure.microsoft.com/blog/per-disk-metrics-managed-disks/).

## What does a dashed line in an Azure Metric chart indicate?

Some Azure metrics charts, such as the ones that display availability and latency data, use a dashed line to indicate that there's a missing value (also known as null value) between two known time grain data points. For example, if in the time selector you picked `1 minute` time granularity, but the metric was reported at 07:26, 07:27, 07:29, and 07:30, then a dashed line connects 07:27 and 07:29 because there's a minute gap between those two data points. A solid line connects all other data points. The dashed line drops down to zero when the metric uses count and sum aggregation. For the avg, min or max aggregations, a dashed line connects the two nearest known data points. Also, when the data is missing on the rightmost or leftmost side of the chart, the dashed line expands to the direction of the missing data point.

## How do I track availability of my storage account?

You can configure a resource health alert based on the [Azure Resource Health](/azure/service-health/resource-health-overview) service to track the availability of your storage account. If there are no transactions on the account, then the alert reports based on the health of the Storage cluster where your storage account is located.

## How often does the blob count and blob capacity metric get updated?

The blob capacity and blob count metric are emitted hourly. A background process computes these metrics and updates them multiple times a day.

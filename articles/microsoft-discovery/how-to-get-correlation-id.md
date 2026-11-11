---
title: Get an Activity Log correlation ID for Microsoft Discovery
description: Learn how to find the correlation ID for a Microsoft Discovery operation in the Azure Activity Log to troubleshoot faster.
author: anzaman
ms.author: alzam
ms.topic: how-to
ms.service: azure
ms.date: 11/10/2026

# Customer intent: "As a network administrator, I want to retrieve the correlation ID from the Activity Log so that I can effectively troubleshoot issues across multiple services."
---

# Get operation correlation ID from Activity Log for Microsoft Discovery

Use the Azure Activity Log to find a correlation ID for a Microsoft Discovery control-plane operation.

## Summary

The Azure Resource Manager Activity Log records resource modifications. Events that share a **correlation ID** belong to the same broader action. This guide shows you how to retrieve that ID for troubleshooting or a support request. For field definitions, see [Activity Log schema](/azure/azure-monitor/platform/activity-log-schema).

Don't assume that an Activity Log `correlationId` is interchangeable with an application API response-header ID or a `CorrelationId` in Discovery application logs. For application request tracing, see [Query workspace logs](how-to-query-workspace-logs.md).

## Prerequisites

- **Reader** access (or equivalent activity-log read permission) on the resource group in the Azure portal.

## Get operation correlation ID

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Go to the resource group in the Azure portal. Select **Activity log** from the left menu.

1. On **Activity log**, apply filters to narrow down the results. For example, filter by **operation type**, **resource type**, or **date/time range** to show activities for a specific resource. By default, the Activity Log shows all activities for the resource group. Select the timespan as appropriate.

    :::image type="content" source="./media/get-correlation-id/filter-log.jpg" alt-text="Screenshot of the activity log filters section." lightbox="./media/get-correlation-id/filter-log.jpg":::

1. Select an activity log entry to view its details.

1. Select the **JSON** view and locate the `correlationId` field in the activity log entry.

    :::image type="content" source="./media/get-correlation-id/correlation-id.jpg" alt-text="Screenshot of an activity log entry's JSON view with the correlationId field highlighted." lightbox="./media/get-correlation-id/correlation-id.jpg":::

1. Use the **Find** feature in your browser to quickly search for the correlation ID. Note this correlation ID for your support request submission.


## Next steps

* File a support request with the correlation ID to help troubleshoot your issue. For more information, see [How to create an Azure support request](/azure/azure-portal/supportability/how-to-create-azure-support-request).
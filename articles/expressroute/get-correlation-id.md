---
title: Get operation correlation ID from Activity Log
titleSuffix: Azure ExpressRoute
description: Learn how to obtain the correlation ID for an ExpressRoute operation from the Azure Activity log.
author: duongau
ms.topic: how-to
ms.author: duau
ms.service: azure-expressroute
ms.date: 11/18/2024
---

# Get operation correlation ID from Activity Log

The Azure Resource Manager Activity Log provides information about resource modifications and helps trace request flows between services. Each operation has a unique **Correlation ID** that aids in troubleshooting issues by correlating them with other signals across multiple services. This guide shows you how to obtain the correlation ID from the Activity Log for an ExpressRoute resource, such as a circuit, gateway, connection, or peering.

## Prerequisites

- Access to an ExpressRoute circuit, gateway, or connection resource.

## Obtain operation correlation ID

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Navigate to your ExpressRoute resource in the Azure portal. Select **Activity log** from the left menu.

    :::image type="content" source="./media/get-correlation-id/circuit-overview.png" alt-text="Screenshot of the Activity log button on the left menu pane on the overview page of an ExpressRoute circuit." lightbox="./media/get-correlation-id/circuit-overview.png":::

1. On the Activity log page, apply filters to narrow down the results. For example, filter by **operation type**, **resource type**, or **date/time range** to show activities for a specific ExpressRoute resource. By default, the Activity Log shows all activities for the selected resource.

    :::image type="content" source="./media/get-correlation-id/filter-log.png" alt-text="Screenshot of the activity log filters section for an ExpressRoute circuit." lightbox="./media/get-correlation-id/filter-log.png":::

1. Select an activity log entry to view its details.

    :::image type="content" source="./media/get-correlation-id/select-log-entry.png" alt-text="Screenshot of log entry after filter was applied." lightbox="./media/get-correlation-id/select-log-entry.png":::

1. Select the **JSON** view and locate the **Correlation ID** in the activity log entry.

    :::image type="content" source="./media/get-correlation-id/entry-selected.png" alt-text="Screenshot of the summary page of a log entry after selected." lightbox="./media/get-correlation-id/entry-selected.png":::

1. Use the **Find** feature in your browser to quickly search for the correlation ID. Note this correlation ID for your support request submission.

    :::image type="content" source="./media/get-correlation-id/correlation-id.png" alt-text="Screenshot of the correlation ID found in the JSON format of the log entry." lightbox="./media/get-correlation-id/correlation-id.png":::

## Next steps

* File a support request with the correlation ID to help troubleshoot your issue. For more information, see [How to create an Azure support request](/azure/azure-portal/supportability/how-to-create-azure-support-request).

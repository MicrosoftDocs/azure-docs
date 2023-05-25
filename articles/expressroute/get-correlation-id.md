---
title: Get operation correlation ID from Activity Log
titleSuffix: Azure ExpressRoute
description: This article shows you how to obtain the correlation ID for an ExpressRoute operation from the Azure Activity log.
author: duongau
ms.topic: how-to
ms.author: duau
ms.service: expressroute
ms.date: 05/23/2023
---

# Get operation correlation ID from Activity Log

The Azure Resource Manager Activity Log contains information about when a resource gets modified and can help you trace the flow of requests between services. Each operation has a unique identifier called a **Correlation ID** that can help investigate issues by correlating them with other signals collected that spans multiple services. This identifier can help troubleshoot issues with your resources, such as connectivity problems or errors in provisioning and configuration. 

This guide walks you through the steps to obtain the operation correlation ID from the Activity Log for an ExpressRoute Resource such as circuit, gateway, connection or peering. 

## Prerequisites

- You need to have access to an ExpressRoute circuit, ExpressRoute gateway, or ExpressRoute connection resource.

## Obtain operation correlation ID

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. In the Azure portal, navigate to your ExpressRoute resource. Select **Activity log** from the left side menu.

    :::image type="content" source="./media/get-correlation-id/circuit-overview.png" alt-text="Screenshot of the Activity log button on the left menu pane on the overview page of an ExpressRoute circuit." lightbox="./media/get-correlation-id/circuit-overview.png":::

1. On the Activity log page, you can select to add filters to narrow down the results. For example, you can filter by **operation type** and **resource type** or **date/time range** to only show the activity log for a specific ExpressRoute resource. By default, Activity Log shows all activities for the selected ExpressRoute resource.

    :::image type="content" source="./media/get-correlation-id/filter-log.png" alt-text="Screenshot of the activity log filters section for an ExpressRoute circuit." lightbox="./media/get-correlation-id/filter-log.png":::

1. Once you apply the filters, you can select an activity log entry to view the details.

    :::image type="content" source="./media/get-correlation-id/select-log-entry.png" alt-text="Screenshot of log entry after filter was applied." lightbox="./media/get-correlation-id/select-log-entry.png":::

1. Select the **JSON** view and then locate the **Correlation ID** in the activity log entry.

    :::image type="content" source="./media/get-correlation-id/entry-selected.png" alt-text="Screenshot of the summary page of a log entry after selected." lightbox="./media/get-correlation-id/entry-selected.png":::

1. To quickly search for the correlation ID, you can use the **Find** feature in your browser. Make note of this correlation ID and provide it as part of your support request submission.

    :::image type="content" source="./media/get-correlation-id/correlation-id.png" alt-text="Screenshot of the correlation ID found in the JSON format of the log entry." lightbox="./media/get-correlation-id/correlation-id.png":::

## Next steps

* File a support request with the correlation ID to help troubleshoot your issue. For more information, see [How to create an Azure support request](../azure-portal/supportability/how-to-create-azure-support-request.md).
---
title: Review TrackAvailability() test results
description: This article explains how to review data logged by TrackAvailability() tests
ms.topic: conceptual
ms.date: 04/06/2023
---

# Review TrackAvailability() test results

This article explains how to review [TrackAvailability()](/dotnet/api/microsoft.applicationinsights.telemetryclient.trackavailability) test results in the Azure portal and query the data using [Log Analytics](../logs/log-analytics-overview.md#overview-of-log-analytics-in-azure-monitor).

## Prerequisites

> [!div class="checklist"]
> - [Workspace-based Application Insights resource](create-workspace-resource.md)
> - Custom [Azure Functions app](../../azure-functions/functions-overview.md#introduction-to-azure-functions) running [TrackAvailability()](/dotnet/api/microsoft.applicationinsights.telemetryclient.trackavailability) with your own business logic

## Check availability

Start by reviewing the graph on the **Availability** tab of your Application Insights resource.

> [!NOTE]
> Tests created with `TrackAvailability()` will appear with **CUSTOM** next to the test name.

 :::image type="content" source="media/availability-azure-functions/availability-custom.png" alt-text="Screenshot that shows the Availability tab with successful results." lightbox="media/availability-azure-functions/availability-custom.png":::

To see the end-to-end transaction details, under **Drill into**, select **Successful** or **Failed**. Then select a sample. You can also get to the end-to-end transaction details by selecting a data point on the graph.

:::image type="content" source="media/availability-azure-functions/sample.png" alt-text="Screenshot that shows selecting a sample availability test.":::

:::image type="content" source="media/availability-azure-functions/end-to-end.png" alt-text="Screenshot that shows end-to-end transaction details." lightbox="media/availability-azure-functions/end-to-end.png":::

## Query in Log Analytics

You can use Log Analytics to view your availability results, dependencies, and more. To learn more about Log Analytics, see [Log query overview](../logs/log-query-overview.md).

:::image type="content" source="media/availability-azure-functions/availabilityresults.png" alt-text="Screenshot that shows availability results." lightbox="media/availability-azure-functions/availabilityresults.png":::

:::image type="content" source="media/availability-azure-functions/dependencies.png" alt-text="Screenshot that shows the New Query tab with dependencies limited to 50." lightbox="media/availability-azure-functions/dependencies.png":::

## Next steps

* [Standard tests](availability-standard-tests.md)
* [Availability alerts](availability-alerts.md)
* [Application Map](./app-map.md)
* [Transaction diagnostics](./transaction-diagnostics.md)

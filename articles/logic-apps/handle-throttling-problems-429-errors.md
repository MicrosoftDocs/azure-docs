---
title: Handle throttling problems, or 'Too many requests (429)' errors
description: How to work around throttling problems, or 'Too many requests (429)' errors, in Azure Logic Apps
services: logic-apps
ms.suite: integration
ms.reviewer: klam, logicappspm
ms.topic: conceptual
ms.date: 01/14/2020
---

# Handle throttling problems ("Too many requests (429)") in Azure Logic Apps

When you use Azure Logic Apps, you might experience these kinds of throttling:

* [Logic app](#logic-app-throttling)
* [Connector](#connector-throttling)
* [Destination service or system](#destination-throttling)

<a name="logic-app-throttling"></a>

## Logic app throttling

The Azure Logic Apps service has its own [throughput limits](../logic-apps/logic-apps-limits-and-config.md#throughput-limits). If your logic app exceeds these limits, throttling happens at the logic app's level, not the logic app's run level, Azure subscription level, or Azure resource group level.

To find throttling errors at this level, check your logic app's **Metrics** pane in the Azure portal.

1. In the [Azure portal](https://portal.azure.com), open your logic app in the Logic App Designer.

1. On the logic app menu, under **Monitoring**, select **Metrics**. 

To handle throttling at this level, you have these options:

* Your logic app has a default limit on the number of actions that can run in a 5-minute rolling interval. To raise this limit to the maximum number of actions, enable [high throughput mode](../logic-apps/logic-apps-workflow-actions-triggers.md#run-high-throughput-mode) on your logic app.

* Consider whether you can break down your logic app into smaller logic apps, each running a number of actions below either the default or maximum limit.

<a name="connector-throttling"></a>

## Connector throttling

Each connector has its own throttling limits, which you can find on the connector's technical reference page. For example, the [Azure Service Bus connector](https://docs.microsoft.com/connectors/servicebus/) has a throttling limit that permits up to 6,000 calls per minute.

To find throttling errors at this level, check the connector's "retry" history. You might have trouble differentiating between connector throttling and [destination throttling](#destination-throttling). In this case, you might have to review the response details or perform some calculations to identify the source. 

For logic apps that run in the public, multi-tenant Azure Logic Apps service, versus an [integration service environment (ISE)](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md), throttling happens at the *connection* level, not connector level.

To handle throttling at this level, you have these options:

* Consider whether you can spread the workload across different connections, even if those connections communicate with same service or system, but still use the same credentials.

  For example, suppose your logic app gets a row from a SQL Server database, processes the data from that row, and then updates that row with the results. You can use separate connections so that one connection gets the row, while the other connection updates the row.

* Your logic app can have multiple connections for a single action and then choose the connection to actually use at run time.

<a name="destination-throttling"></a>

## Destination service or system throttling

The destination service or system that a connector calls might have its own throttling limits. For example, the Office 365 Outlook connector has a higher throttling limit than some Microsoft Exchange Server APIS.


## Next steps




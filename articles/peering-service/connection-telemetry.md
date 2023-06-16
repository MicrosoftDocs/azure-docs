---
title: Access connection telemetry
titleSuffix: Azure Peering Service
description: Learn how to access Azure Peering Service connection telemetry including prefix latency and prefix events.
services: peering-service
author: halkazwini
ms.service: peering-service
ms.topic: how-to
ms.date: 06/06/2023
ms.author: halkazwini
ms.custom: template-how-to, engagement-fy23
# Customer intent: Customer wants to access their connection telemetry per prefix to Microsoft services with Azure Peering Service.
---

# Access Peering Service connection telemetry
 
Connection telemetry provides insights collected for the connectivity between the customer's location and the Microsoft network.

In this article, you learn how to access your Peering Service connection telemetry to view the latency report and prefix states for the Peering Service connection. 

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- A Peering Service connection. To learn how to create a connection, see [Create, change, or delete a Peering Service connection](azure-portal.md).

## View the latency report

To view the latency report for a specific Peering Service connection, follow these steps.

1. In the search box at the top of the portal, enter *Peering Service*. Select **Peering Services** in the search results.

    :::image type="content" source="./media/connection-telemetry/peering-service-portal-search.png" alt-text="Screenshot shows how to search for Peering Service in the Azure portal." lightbox="./media/connection-telemetry/peering-service-portal-search.png":::

1. Select the Peering Service connection that you want to view its latency report. 

    :::image type="content" source="./media/connection-telemetry/peering-service-connection-page.png" alt-text="Screenshot shows the selected Peering Service in the Azure portal." lightbox="./media/connection-telemetry/peering-service-connection-page.png":::

1. Under **Settings**, select **Prefixes** to see the prefixes associated with the Peering Service connection. 

    :::image type="content" source="./media/connection-telemetry/peering-service-prefixes.png" alt-text="Screenshot shows the prefixes associated with the Peering Service connection in the Azure portal." lightbox="./media/connection-telemetry/peering-service-prefixes.png":::
    
1. Select the prefix that you want to view its latency report. From **Show data for last**, you can see the prefix latency for the last 6 hours, 12 hours, 1 day, 7 days, or 30 days.

    :::image type="content" source="./media/connection-telemetry/peering-service-prefixes-latency.png" alt-text="Screenshot shows the prefix latency in the Azure portal." lightbox="./media/connection-telemetry/peering-service-prefixes-latency.png":::

    > [!NOTE]
    > Prefix latency data for prefixes smaller than /24 is approximated at /24. This is because we can view the client IP addresses on the measurements only with a resolution of /24 or higher due to compliance reasons.


## View prefix state report

To view events for a specific prefix, select the prefix name and select **Prefix events** under **Diagnostic**. The events that are captured are listed.

:::image type="content" source="./media/connection-telemetry/peering-service-prefixes-events.png" alt-text="Screenshot shows the prefix events in the Azure portal." lightbox="./media/connection-telemetry/peering-service-prefixes-events.png":::

Some of the possible events that are captured in the **Prefix events** list are shown in the following table.

| **Event type** | **Event impact**|**Details**|
|----------------|-----------------|---------|
| PrefixAnnouncementEvent |Information|Prefix announcement was received. |
| PrefixWithdrawalEvent|Warning| Prefix withdrawal was received. |
| PrefixBackupRouteAnnouncementEvent |Information|Prefix backup route announcement was received. |
| PrefixBackupRouteWithdrawalEvent|Warning|Prefix backup route withdrawal was received. |
| PrefixActivePath |Information| Current prefix active route. |
| PrefixBackupPath | Information|Current prefix backup route. |
| PrefixOriginAsChangeEvent|Critical| Exact prefix received with different origin autonomous system number (for active route). | 
| PrefixBackupRouteOriginAsChangeEvent  | Error|Prefix received with different origin autonomous system number (for backup route). |

## Next steps

- To learn about Peering Service connection, see [Peering Service connection](connection.md).
- To learn how to create a connection, see [Create, change, or delete a Peering Service connection](azure-portal.md).
- To learn about available Peering Service partners, see [Peering Service partners](location-partners.md).

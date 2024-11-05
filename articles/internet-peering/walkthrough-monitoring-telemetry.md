---
title: View metrics
titleSuffix: Internet peering
description: Learn how to use the Azure portal to monitor and view telemetry for an internet peering with Azure Peering Service.
author: halkazwini
ms.author: halkazwini
ms.service: internet-peering
ms.topic: how-to
ms.date: 10/23/2024
---

# View metrics for an internet peering

In this article, as an internet peering partner (direct or exchange), you learn how to use the Azure portal to view various metrics associated with a direct peering or an exchange peering.

## View received routes

You can view routes that are announced to Microsoft by using the Azure portal.

1. In the Azure portal, go to the peering.

1. On the service menu under **Settings**, select **Received Routes**.

    :::image type="content" source="./media/walkthrough-monitoring-telemetry/peering-received-routes.png" alt-text="Screenshot shows how to view received routes in the Azure portal." lightbox="./media/walkthrough-monitoring-telemetry/peering-received-routes.png":::

## View peering metrics

You can view the following metrics for a peering in the **Connections** pane of a peering:

- Session availability
- Ingress traffic rate
- Egress traffic rate
- Flap events count
- Packet drop rate

:::image type="content" source="./media/walkthrough-monitoring-telemetry/peering-metrics-telemetry.png" alt-text="Screenshot shows how to view various metrics related to a peering in the Azure portal." lightbox="./media/walkthrough-monitoring-telemetry/peering-metrics-telemetry-expanded.png":::

## View registered prefix latency

As an Azure Peering Service partner or communication services partner, you can view your registered prefix latency in the **Overview** pane of the registered prefix.

:::image type="content" source="./media/walkthrough-monitoring-telemetry/registered-prefix-latency-telemetry.png" alt-text="Screenshot shows how to view registered prefix latency in the Azure portal." lightbox="./media/walkthrough-monitoring-telemetry/registered-prefix-latency-telemetry.png":::

## View customer prefix latency

As an Azure Peering Service Exchange Route Server partner, you can view the average latency for all of your customer prefixes in the **Overview** pane of the registered ASN.

:::image type="content" source="./media/walkthrough-monitoring-telemetry/registered-asn-latency-telemetry.png" alt-text="Screenshot shows how to view the average customer prefix latency under a specific registered asn in the Azure portal." lightbox="./media/walkthrough-monitoring-telemetry/registered-asn-latency-telemetry.png":::

## View Peering Service metrics

All Peering Service resources display the session availability metric for their Peering Service in the **Overview** pane of a Peering Service resource.

- Provider primary peering session availability: indicates the state of the BGP (Border Gateway Protocol) session between the Peering Service provider and Microsoft at the primary peering location.

- Provider backup peering session availability: indicates the state of the BGP session between the Peering Service provider and Microsoft at the backup peering location if there's one selected for the Peering Service.

    :::image type="content" source="./media/walkthrough-monitoring-telemetry/peering-service-session-availability.png" alt-text="Screenshot shows how to view the provider peering session availability for a specific Peering Service in the Azure portal." lightbox="./media/walkthrough-monitoring-telemetry/peering-service-session-availability.png":::

## View peering service prefix metrics

All Peering Service prefix resources display the following metrics for their Peering Service prefix in their Peering Service pane:

- **Peering service prefix latency**: Shows the median latencies observed over time for prefixes registered under a Peering Service. Latency for prefixes that are smaller than /24 are shown at the /24 level.

    :::image type="content" source="./media/walkthrough-monitoring-telemetry/peering-service-prefix-latency-telemetry.png" alt-text="Screenshot shows how to view the peering service prefix latency under a specific peering service prefix in the Azure portal." lightbox="./media/walkthrough-monitoring-telemetry/peering-service-prefix-latency-telemetry.png":::

- **Peering service prefix events**: Shows various BGP events like route announcements, withdrawals, and routes becoming active on the primary or backup links for each prefix in the **Prefix events** pane of the Peering Service prefix.

    :::image type="content" source="./media/walkthrough-monitoring-telemetry/peering-service-prefix-events.png" alt-text="Screenshot shows how to view the prefix events under a specific peering service prefix in the Azure portal." lightbox="./media/walkthrough-monitoring-telemetry/peering-service-prefix-events.png":::

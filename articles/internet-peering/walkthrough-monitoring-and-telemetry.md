---
title: Internet peering for Peering Monitoring and Telemetry walkthrough
description: Learn about Internet peering for Communications Services, its requirements, the steps to establish direct interconnect, and how to register and activate a prefix.
services: internet-peering
author: hugobaldner
ms.service: internet-peering
ms.topic: how-to
ms.date: 07/12/2023
ms.author: hugobaldner
ms.custom: template-how-to
---

# Azure Peering Monitoring and Telemetry walkthrough

In this article, you learn how to use the Azure Portal to view various metrics associated with a (direct or exchange) peering

## View recieved routes

All peering partners (direct or exchange) can view the routes they have announced to Microsoft through their peering sessions under **Recieved Routes** tab under the **Settings** section  of their Peering's page. 

    :::image type="content" source="./media/walkthrough-monitoring-and-telemetry/peering-recieved-routes.png" alt-text="Screenshot shows how to view recieved routes in the Azure portal." lightbox="./media/walkthrough-monitoring-and-telemetry/peering-recieved-routes.png":::

## View peering metrics

All peering partners can view the following metrics for their peering under **Connections** tab under the **Settings** section  of their Peering's page. 

-  Session availability
-  Ingress traffic rate 
-  Egress traffic rate
-  Flap events count 
-  Packet drop rate 

    :::image type="content" source="./media/walkthrough-monitoring-and-telemetry/peering-metrics-telemetry.png" alt-text="Screenshot shows how to view various metrics relating a peering in the Azure portal." lightbox="./media/walkthrough-monitoring-and-telemetry/peering-metrics-telemetry.png":::

## View registered prefix latency

Microsoft Azure Peering Service partners and communication services partners can view their registered prefix latency under the **Overview** section of the Registered Prefix page.

    :::image type="content" source="./media/walkthrough-monitoring-and-telemetry/registered-prefix-latency-telemetry.png" alt-text="Screenshot shows how to view registered prefix latency in the Azure portal." lightbox="./media/walkthrough-monitoring-and-telemetry/registered-prefix-latency-telemetry.png":::

## View customer prefix latency

Microsoft Azure Peering Service Exchange Route Server partners can view the average latency for all their customer prefixes under a specific registered asn under the **Overview** section of the Registered ASN page.

    :::image type="content" source="./media/walkthrough-monitoring-and-telemetry/registered-asn-latency-telemetry.png" alt-text="Screenshot shows how to view the average customer prefix latency under a specific registered asn in the Azure portal." lightbox="./media/walkthrough-monitoring-and-telemetry/registered-asn-latency-telemetry.png":::

## View peering service metrics

All peering service resources display the following metrics for their peering service under **Overview** section of a Peering Service's page. 

-  Session availability
    - Provider primary peering session availability

        This indicates the state of the Border Gateway Protocol session between the peering service provider and Microsoft at the priamry peering location.

        :::image type="content" source="./media/walkthrough-monitoring-and-telemetry/peering-service-primary-session-availability.png" alt-text="Screenshot shows how to view the provider primary peering session availability under a specific peering service in the Azure portal." lightbox="./media/walkthrough-monitoring-and-telemetry/peering-service-primary-session-availability.png":::

    - Provider backup  peering session availability

        This indicates the state of the Border Gateway Protocol session between the peering service provider and Microsoft at the backup peering location if there is one selected for the peering service.

        :::image type="content" source="./media/walkthrough-monitoring-and-telemetry/peering-service-backup-session-availability.png" alt-text="Screenshot shows how to view the provider backup peering session availability under a specific peering service in the Azure portal." lightbox="./media/walkthrough-monitoring-and-telemetry/peering-service-backup-session-availability.png":::

## View peering service prefix metrics

All peering service prefix resources display the following metrics for their peering service prefix under various sections of a Peering Service Prefix's page. 

- Peering service prefix latency

    This shows the median latencies observed over time for prefixes registered under a peering service under the **Overview** section of a Peering Service Prefix's page. Latency for prefixes which are smaller than /24 are shown at the /24 level. 

    :::image type="content" source="./media/walkthrough-monitoring-and-telemetry/peering-service-prefix-latency-telemetry.png" alt-text="Screenshot shows how to view the peering service prefix latency under a specific peering service prefix in the Azure portal." lightbox="./media/walkthrough-monitoring-and-telemetry/peering-service-prefix-latency-telemetry.png":::

- Peering service prefix events

    Various Border Gateway Protocol events like route announcements, withdrawals and routes becoming active on the primary or backup links are displayed for each prefix under the **Prefix events** tab of the **Diagnostics** section of a Peering Service Prefix's page

    :::image type="content" source="./media/walkthrough-monitoring-and-telemetry/peering-service-prefix-events.png" alt-text="Screenshot shows how to view the prefix events under a specific peering service prefix in the Azure portal." lightbox="./media/walkthrough-monitoring-and-telemetry/peering-service-prefix-events.png":::
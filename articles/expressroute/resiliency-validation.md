---
title: Azure ExpressRoute Gateway Resiliency Validation (preview)
description: This article helps you understand the Azure ExpressRoute Gateway Resiliency Validation feature and how to use it.
services: expressroute
author: duongau
ms.service: azure-expressroute
ms.topic: conceptual
ms.date: 03/26/2025
ms.author: duau
ms.custom: ai-usage
---

# Azure ExpressRoute Gateway Resiliency Validation (preview)

Ensuring uninterrupted connectivity to Azure workloads through ExpressRoute is essential for maintaining business continuity. We're committed to providing you with new capabilities to help maintain a resilient network. The *gateway resiliency validation* feature assesses how resilient your network is by testing a failure scenario and validating the failover mechanisms. By proactively testing your network resiliency, you can ensure that your workloads remain available and can recover quickly from disruptions. 

Another key aspect of this feature is the ability to identify misconfigurations and provide insights about your ExpressRoute connections from the ExpressRoute gateway perspective. This proactive approach allows you to validate the network behavior before major changes are implemented while also ensuring that your network is prepared for unexpected events.

> [!IMPORTANT]
> **Azure ExpressRoute Resiliency Validation** is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Key features

- **Simulate circuit failover** - Connections are disconnected temporarily from the gateway of interest to the selected ExpressRoute circuit to simulate a failover from one peering location to another.
- **Route redundancy** - Insights into duplicate routes are provided for all prefixes received from the selected peering location.
- **Traffic visualization** - Visualize traffic going through the ExpressRoute gateway and all connections to an ExpressRoute circuit during testing.
- **Test history** - Detailed information of previously conducted tests.

### Common use cases

- Facilitate in identifying and solving potential problems within your network to enhance the overall reliability and resiliency of your network infrastructure.

- Essential for high availability and disaster recovery (HA/DR) procedures and migration validation. It ensures your systems are prepared for unplanned events and maintains seamless operations by validating maintenance behavior at the workload level.

- Serves as a prerequisite for migrating from one ExpressRoute peering location to another, ensuring network resiliency before implementing major changes.

### Limitations

- The Resiliency Validation feature is available only for ExpressRoute gateways connected to ExpressRoute circuits in at least two distinct peering locations.
- The **Route List** tab can only be refreshed once per hour.
- This feature isn't supported for Virtual WAN or ExpressRoute Metro.
- You can't run the Resiliency Validation test if there are any ongoing tests or if any of the circuits are currently undergoing maintenance.

## Prerequisites

- To participate in the preview, contact the [**Azure ExpressRoute**](mailto:exr-resiliency@microsoft.com) team.
- Ensure that you have an ExpressRoute circuit in at least two distinct peering locations and an ExpressRoute gateway connected to those circuits.

## Using the gateway resiliency validation

The gateway resiliency validation can be accessed from any ExpressRoute gateway resource by navigating to the **Monitoring** section in the left-hand menu.

:::image type="content" source="media/resiliency-validation/resiliency-validation.png" alt-text="Screenshot of the Resiliency Validation feature, accessible under the monitoring section in the left-hand menu of the ExpressRoute gateway resource.":::

The dashboard provides a detailed overview of all ExpressRoute circuits connected to the ExpressRoute virtual network gateway, categorized by peering location. It displays the most recent test status, the timestamp of the last test conducted, the results of the latest test, and an action button to initiate a new test.

> [!WARNING]
> During the test, the ExpressRoute circuit disconnects from the ExpressRoute gateway, causing a temporary loss of connectivity for nonredundant routes. Ensure your routing policies are configured to support traffic failover.

### Starting the test

1. Navigate to the desired peering location and select the **Start new test** button.

1. Review the autopopulated configuration, which includes:

    - Gateway name
    - Peering location
    - Route redundancy information
    - Traffic details
    - Status of all connections to the ExpressRoute gateway

1. Ensure that all critical routes are marked as redundant by reviewing the **Route List** tab.

    :::image type="content" source="media/resiliency-validation/route-list.png" alt-text="Screenshot showing the Route List tab with details of redundant and nonredundant routes.":::

1. Confirm that the circuits listed on this page aren't undergoing maintenance by selecting the first checkbox.

1. Acknowledge that you reviewed the **Route List** tab and that all critical routes are marked as redundant by selecting the second checkbox.

1. Enter the name of the gateway to confirm that you're aware of the potential effect of the test on your network.

1. Select **Start Simulation** to initiate the test.

    :::image type="content" source="media/resiliency-validation/start-test.png" alt-text="Screenshot showing the Resiliency Validation testing page.":::

1. The resiliency validation status shows as **In progress**.

### During the test

1. Navigate to the **Test Status** tab to validate connectivity to your Azure workloads through each redundant connection. Review the traffic flow graph for the ExpressRoute gateway, which displays the average bits per second traffic flow. The tab also provides ingress and egress traffic information for connected and disconnected peering locations.

    :::image type="content" source="media/resiliency-validation/test-status.png" alt-text="Screenshot of the traffic flow graph for an ExpressRoute gateway and the traffic data on the connections to the gateway.":::

1. Validate connectivity from your on-premises network to your Azure workloads through the redundant connection by sending data packets. Tools like [iPerf](https://iperf.fr/) can be used for this purpose.

1. Select the **Stop Simulation** button to end the test. Confirm if the test was completed successfully when prompted.

1. Once confirmed, connectivity for all connections to the ExpressRoute gateway gets restored.

1. You can view the test result by selecting **View** under the *Test History* column on the dashboard for the selected peering location.

## Frequently asked questions

1. Can control the gateway validation tests other than the Azure portal?

    Yes, you can use REST API to start and stop the Gateway resiliency validation tests.  

1. What happens if I don't terminate a test?

    The tests continue to run indefinitely.

1. What metrics or alerts are available to monitor during the test?

    The purpose of configuring redundant connections is to ensure network resilience during outages. If a single circuit is utilized at more than 50% of its bandwidth, packet drops might occur. During validation tests, the **Test Status** tab helps monitor traffic through the connections. You should expect [alerts](monitor-expressroute.md#alerts) if they're configured, providing an opportunity to validate their effectiveness.

    For more information, see [Circuit utilization](monitor-expressroute-reference.md#category-circuit-traffic) or [Connection traffic](monitor-expressroute-reference.md#category-traffic) for metrics you can set up alerts on.

1. Can I control traffic on demand using the gateway resiliency validation tool?

    Yes, the gateway resiliency validation tool allows you to control traffic on demand. This is useful for testing different traffic scenarios and ensuring your network can handle various failovers. It can also be used to validate connectivity after successful site migrations before disconnecting the redundant circuit.

1. Are there specific Role-Based Access Controls (RBAC) policies for this feature?

    Yes, there are specific RBAC policies to ensure that only authorized users with contributor access to the gateway can initiate downtime.

1. Does this feature work with FastPath and Private Link?

    For FastPath, although the data path bypasses the gateway, the gateway still manages control plane activities like route management. During a disconnect between the ExpressRoute circuit and the ExpressRoute gateway, routes are withdrawn from the gateway. However, connectivity for the failover connection to FastPath and Private Link is maintained during the failover.

1. Is packet loss expected during this activity?

    During the failover simulation, a brief connectivity disruption occurs as BGP (Border Gateway Protocol) reestablishes. Performance tests using iPerf on TCP (Transmission Control Protocol) up to 500 Mbps show no packet loss. However, in a real outage scenario, some packet loss occurs until the traffic successfully fails over.

1. How long does it take to fail over?

    Once the simulation starts, it can take up to 15 seconds for the traffic to fail over.

## Next steps

- Learn more about the [ExpressRoute gateway](expressroute-about-virtual-network-gateways.md) and how to [monitor ExpressRoute circuits](monitor-expressroute.md).
- Learn about [ExpressRoute Resiliency Insights](resiliency-insights.md).
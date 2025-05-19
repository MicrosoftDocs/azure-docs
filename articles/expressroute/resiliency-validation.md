---
title: Azure ExpressRoute Gateway Resiliency Validation (preview)
description: This article helps you understand the Azure ExpressRoute Gateway Resiliency Validation feature and how to use it.
services: expressroute
author: duongau
ms.service: azure-expressroute
ms.topic: concept-article
ms.date: 03/31/2025
ms.author: duau
ms.custom: ai-usage
---

# Azure ExpressRoute Gateway Resiliency Validation (preview)

Resiliency validation is a capability designed to assess the resiliency of network connectivity for ExpressRoute-enabled workloads. This feature allows you to perform site failovers for your virtual network gateway, helping to evaluate network resiliency during site outages and validate setup during migrations by testing the effectiveness of failover mechanisms. By proactively testing your network, you can ensure continuous connectivity to Azure workloads and ensure the robustness of your connections.

> [!IMPORTANT]
> **Azure ExpressRoute Resiliency Validation** is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Key features

- **Simulate circuit failover** - Connections are disconnected temporarily from the gateway of interest to the selected ExpressRoute circuit to simulate a failover from one peering location to another.
- **Route redundancy** - Insights into duplicate routes are provided for all prefixes received from the selected peering location.
- **Traffic visualization** - Visualize traffic on the ExpressRoute gateway and all connections associated to it during testing.
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
- Ensure that you have an ExpressRoute circuit in at least two distinct peering locations and an ExpressRoute virtual network gateway connected to those circuits.

## Using the gateway resiliency validation

> [!IMPORTANT]
> - During the test, the ExpressRoute virtual network gateway disconnects from the target ExpressRoute circuit, resulting in a temporary loss of connectivity for non-redundant routes. Make sure your routing policies are configured to enable traffic failover.
> - The targeted ExpressRoute circuit remains connected to other ExpressRoute virtual network gateways, and the gateway performing the test stays connected to other ExpressRoute circuits.

The gateway resiliency validation can be accessed from any ExpressRoute gateway resource by navigating to the **Monitoring** section in the left-hand menu.

:::image type="content" source="media/resiliency-validation/resiliency-validation.png" alt-text="Screenshot of the Resiliency Validation feature, accessible under the monitoring section in the left-hand menu of the ExpressRoute gateway resource.":::

The dashboard provides a detailed overview of all ExpressRoute circuits connected to the ExpressRoute virtual network gateway, categorized by peering location. It displays the most recent test status, the timestamp of the last test conducted, the results of the latest test, and an action button to initiate a new test.

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

    :::image type="content" source="media/resiliency-validation/test-status.png" alt-text="Screenshot showing the traffic flow graph for an ExpressRoute gateway and traffic data for connections to the gateway.":::

    > [!NOTE]
    > Traffic metrics are updated every minute and displayed in the **Test Status** tab. Allow up to 5 minutes for the metrics to appear after initiating the test.

1. Validate connectivity from your on-premises network to your Azure workloads through the redundant connection by sending data packets. Tools like [iPerf](https://iperf.fr/) can be used for this purpose.

1. Select the **Stop Simulation** button to end the test. Confirm if the test was completed successfully when prompted and select the failover peering location.

1. Once confirmed, connectivity for all connections to the ExpressRoute gateway gets restored.

1. You can view the test report by selecting **View** under the *Test History* column on the dashboard for the selected peering location.

## Frequently asked questions

1. Why can't I see the Resiliency Insights feature in my ExpressRoute virtual network gateway?

    - The Resiliency Insights feature is currently in preview. To gain access, contact the [Azure ExpressRoute team](mailto:exR-Resiliency@microsoft.com) for onboarding.
    - This feature is only available for ExpressRoute virtual network gateways configured in a Max Resiliency model. It isn't supported for Virtual WAN ExpressRoute gateways.
    - You must have Contributor-level authorization to access this feature.

1. Why is the Route List not updated to the latest?

    The Route List tab has a polling interval of 1 hour. This means the pane won't refresh for 1 hour from the last updated time.

1. Does the feature support Microsoft Peering or VPN connectivity?

    No, the Resiliency Insights feature supports only ExpressRoute Private Peering connectivity. It doesn't support Microsoft Peering or VPN connectivity.

1. Can control the gateway validation tests other than the Azure portal?

    Yes, you can use REST API to start and stop the Gateway resiliency validation tests.  

1. What happens if I don't terminate a test?

    The test continues to run indefinitely.

1. What metrics or alerts can I monitor during the resiliency validation test?

    To ensure network resilience during outages, redundant connections should be configured. During a failover, if the backup circuit exceeds 100% of its bandwidth, packet drops might occur. Use [Circuit QoS](monitor-expressroute-reference.md#category-circuit-qos) metrics to monitor packet drops caused by rate limiting. Additionally, the **Test Status** tab in the Resiliency Validation feature provides traffic monitoring for the connections. Ensure alerts are configured to validate their effectiveness during the test.

1. Can I control traffic on demand using the gateway resiliency validation tool?

    Yes, if the routes are advertised redundantly through circuits in different peering locations, the gateway resiliency validation tool allows you to control traffic on demand by failing traffic over to connections in an alternative site.

1. Does this feature support FastPath and Private Link?

    For FastPath, while the data path bypasses the gateway, the gateway still handles control plane activities such as route management. During a disconnect between the ExpressRoute circuit and the gateway, routes are withdrawn from the affected circuit. However, if redundant circuits are properly configured, connectivity for failover connections to FastPath and Private Link is maintained during the failover.

1. Is packet loss expected during a failover simulation?

    A brief connectivity disruption occurs during the failover simulation as BGP (Border Gateway Protocol) reconverges. Performance tests using iPerf on TCP (up to 500 Mbps) show no packet loss during the simulation. However, in an actual outage scenario, some packet loss can occur until traffic successfully fails over.

1. How long does a failover take?

    Once the simulation begins, traffic failover typically completes within 15 seconds.

## Next steps

- Learn more about the [ExpressRoute gateway](expressroute-about-virtual-network-gateways.md) and how to [monitor ExpressRoute circuits](monitor-expressroute.md).
- Learn about [ExpressRoute Resiliency Insights](resiliency-insights.md).

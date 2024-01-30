---
title: Planned maintenance guidance for ExpressRoute
description: Learn how to plan for ExpressRoute maintenance events.
author: duongau
ms.author: duau
ms.service: expressroute
ms.topic: conceptual
ms.date: 05/10/2023
---

# Planned maintenance guidance for ExpressRoute

ExpressRoute circuits and Direct Ports are configured with a primary and a secondary connection to Microsoft Enterprise Edge (MSEE) devices at Microsoft peering locations. These connections are established on physically different devices to offer reliable connectivity from on-premises to your Azure resources if there are planned or unplanned events.

This article explains what happens during an ExpressRoute circuit maintenance and provide actions you should take to minimize service outage affected by a planned or an unplanned maintenance.

## Prepare for maintenance

MSEE devices undergo maintenance to improve the platform reliability, apply security patches, replace faulty hardware, etc. Operations of maintenance are required on Microsoft Enterprise Edge routers (MSEE) routers to improve the ExpressRoute circuit services or apply new software release. The maintenance activity is planned and scheduled in advance to minimize the effect on your services.

### Resiliency of ExpressRoute circuit

The resiliency of an ExpressRoute circuit is achieved with two connections to two MSEEs at an [ExpressRoute location](expressroute-locations.md#expressroute-locations). 

Microsoft requires dual BGP sessions from the connectivity provider or your network edge – one to each MSEE. To be in compliant with the SLA (service-level agreement) associated with the ExpressRoute circuit, dual BGP sessions between the MSEE routers and your edge routers must be simultaneously established. 

:::image type="content" source="./media/planned-maintenance/circuit-connections.png" alt-text="Diagram of a typical ExpressRoute circuit connection to on-premises.":::

### Turn on maintenance alerts
 
When a planned maintenance is scheduled, you're notified at least 14 days prior to the work window through Azure Service Health notifications. With Service Health, you can configure alerts for ExpressRoute Circuit maintenance, view planned and scheduled maintenance. To learn more about Service Health for ExpressRoute maintenance, see [view and configure ExpressRoute maintenance alerts](maintenance-alerts.md). It's crucial that you subscribe to the Azure Service Health to be informed in advanced of the maintenance events. 

## How are maintenance events scheduled 

Planned maintenance on the MSEE is scheduled to occur over two different time windows. This separation is to ensure connectivity over your ExpressRoute circuits aren't disrupted due to the maintenance event and at least one path is always available to reach your Azure services. 

During maintenance, we enable AS path prepend which allows the traffic to drain to the redundant path gracefully. The AS Path prepend is done by prepending AS *12076* (eight times) to the BGP routes towards on-premises and the ExpressRoute gateway connection. 
You need to ensure any on-premises devices in the path are set up to accept the AS path prepend and allow traffic from on-premises to move over to the redundant ExpressRoute path.

Check with your service provider to confirm they're set up to allow AS path prepend on your connections if they're managing your network.

## Maintenance activity between MSEE routers and Microsoft core network

During the maintenance activity, the BGP session between your on-premises network and MSEE may be in an established state and advertising routes from your on-premises network to the MSEE routers. In this case, you can't rely only on presence of established BGP session on your edge router to determine the integrity of the connection. Your routing policy might force traffic to be sent to a specific connection anyway. This setup may cause traffic discard as traffic is routed to the connection that is undergoing maintenance and your return traffic is over the redundant path. To avoid traffic discard from happening, the setup on your edge routers must be configured to forward traffic when the connection receives BGP advertisements from AS 12076 and with traffic forwarding to the connection with the best BGP metric. When the BGP metric in the primary and secondary connection are identical, traffic gets load balanced.

:::image type="content" source="./media/planned-maintenance/msee-maintenance.png" alt-text="Diagram of where connectivity is lost during a planned maintenance on the ExpressRoute circuit.":::

##	Validation of the ExpressRoute circuit failover

After you complete the activation of an ExpressRoute circuit and before being used in production, the recommended practice is to run a failover test to verify the customer’s edge router BGP configurations is correct.

The process of validation of ExpressRoute circuit failover can be executed in two steps:

1. Shutdown the BGP session between your on-premises edge router and the primary connection on the MSEE router. This forces the traffic only through the secondary connection. You can monitor the traffic statistics on the MSEE connection using the [`Get-AzExpressRouteCircuitStats`](expressroute-troubleshooting-expressroute-overview.md#confirm-the-traffic-flow) command. The **BitsInPerSecond** and **BitsOutPerSecond** traffic metrics should only increment on the path that is currently active.  

    :::image type="content" source="./media/planned-maintenance/primary-down.png" alt-text="Diagram of BGP peering down for primary connection of an ExpressRoute circuit.":::

    When the test is completed successful, move to the second step.

1. Shutdown the BGP session between your on-premises edge router and the secondary MSEE connection. Repeat the verification actions in Step 1 to validate the traffic is only incrementing on the primary path.

    :::image type="content" source="./media/planned-maintenance/secondary-down.png" alt-text="Diagram of BGP peering down for secondary connection of an ExpressRoute circuit.":::

You can run more tests by introducing AS path prepend on each path from your on-premises towards the MSEE to verify the traffic flow failover. A similar testing can be performed working with your service provider to introduce AS path prepend towards your on-premises network from provider edge. The described failover procedure should be verified for the ExpressRoute private peering and ExpressRoute Microsoft peering.

To check the status of BGP sessions in the failover test, you can use the guidelines described in the [Verify ExpressRoute connectivity](expressroute-troubleshooting-expressroute-overview.md) documentation.

The failover validation of an ExpressRoute circuit reduces the risk of outages during planned ExpressRoute circuits maintenance.

If the verification of ExpressRoute circuit failover hasn't been completed and the ExpressRoute circuit is already in production, it's never too late to schedule a customer’s maintenance, out of working hours, and proceed with failover test. 

> [!NOTE]
> As general guideline, terminating ExpressRoute BGP connections on stateful devices (such as firewalls) can cause issues with failover during planned or unplanned maintenances by Microsoft or your ExpressRoute service provider. You should evaluate your set up to ensure your traffic will failover properly, and when possible, terminate BGP sessions on stateless devices.

##	Monitor of ExpressRoute circuit

You should track the status of connections through ExpressRoute circuits. Tracking the health of network connectivity is important to react to unhealthy status and taking prompt remediation. [Azure Monitor alerts](monitor-expressroute.md)  proactively notifies you when conditions causing negative effects are found in your monitoring data.

Review the available metrics for [ExpressRoute monitoring](expressroute-monitoring-metrics-alerts.md) for ExpressRoute circuit and Direct ports. At the minimum you should configure alerts to trigger for **ARP availability**, **BGP availability** and **Line Protocol**. Then configure email notifications to be sent when an out of service occurs.  

You can elevate the monitor information by using [Connection Monitor for ExpressRoute](how-to-configure-connection-monitor.md). Connection monitor is a cloud-based network monitoring solution that monitors connectivity between on-premises networks (branch offices, etc.) and Azure cloud deployments. This service is used to track not only service disruptions but also end-to-end performance degradation for your services.

## Next steps

* Learn about [Network Insights for ExpressRoute](expressroute-network-insights.md) to monitor and troubleshoot your ExpressRoute circuit.

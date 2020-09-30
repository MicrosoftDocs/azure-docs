---
title: Azure Monitor for Networks (Preview)
description: A quick overview for Azure Monitor for Network which provides a comprehensive view of health and metrics for all deployed network resource without any configuration.
ms.subservice: 
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 09/24/2020

---

# Azure Monitor for Networks (Preview)
Azure Monitor for Network provides a comprehensive view of [health](https://docs.microsoft.com/azure/service-health/resource-health-checks-resource-types) and [metrics](../platform/metrics-supported.md) for all deployed network resource without any configuration.  It also provides access to all network monitoring capabilities such as [Connection Monitor](../../network-watcher/connection-monitor-preview.md), [flow logging for network security groups (NSGs)](../../network-watcher/network-watcher-nsg-flow-logging-overview.md), [Traffic Analytics](../../network-watcher/traffic-analytics.md), and other network [diagnostic](../../network-watcher/network-watcher-monitoring-overview.md#diagnostics) features.

Azure Monitor for Networks is structured around the following key components of monitoring:
- [Network health and metrics](#networkhealth)
- [Connectivity](#connectivity)
- [Traffic](#traffic)
- [Diagnostic Toolkit](#diagnostictoolkit)

## <a name="networkhealth"></a>Network Health and metrics

The Azure Monitor for Networks **Overview** page provides an effortless way to visualize the inventory of your networking resources along with resource health and alerts. It is divided into four key functional areas - Search and filtering, Resource Health and Metrics, Alerts. and Dependency view

![Overview page](media/network-insights-overview/overview.png)

### Search and filtering
The resource health and alerts view can be customized using filters like **Subscription**, **Resource Group** and **Resource Type**. The search box provides the capability to search through resource properties.

The search box can be used to search for resources and associated resources. For example, a Public IP is associated to an Application Gateway. Searching for the Public IPs DNS name will identify both Public IP and the associated Application Gateway.

![Azure Monitor for Networks  - Search](media/network-insights-overview/search.png)


### Resource Health and Metric
Each tile represents a resource type, with the number of instances deployed across all subscriptions selected along with resource health status. In the example below, there are 45 ER and VPN Connections deployed, 44 are healthy, and 1 unavailable.

![Azure Monitor for Networks  - Resource health](media/network-insights-overview/resource-health.png)

Clicking on the Unavailable ER and VPN connections, launches a metric view. 

![Azure Monitor for Networks  - Metric view](media/network-insights-overview/metric-view.png)

You can click on each element in the grid view. Click on the Health icon to redirect to resource health for that connection. Click on Alerts to redirect to alerts and metrics page respectively for that connection. 

### Alerts
The **Alerts** grid on the right provides a view of all the alerts generated for the selected resources across all subscriptions. Click on the alert counts to navigate to detailed alerts page.

### Dependency view
The **Dependency** view helps visualize how the resource is configured. Currently dependency view is now supported for Application Gateway, Virtual WAN, and Load Balancer. For example, in the case of Application Gateway, Dependency view can be accessed by clicking on the Application Gateway resource name from the metrics grid view. This also applies to Virtual WAN and Load Balancer.

![Azure Monitor for Networks  - Application Gateway view](media/network-insights-overview/application-gateway.png)

The **Dependency** view for Application Gateway provides a simplified view of how the front-end IPs are connected to the listeners, rules and backend pool. The connecting edges are color coded and provide additional details based on the backend pool health. The view also provides a detailed view of Application Gateway metrics and metrics for all related backend pools such as virtual machine scale set and VM instances.

![Azure Monitor for Networks  - Dependency view](media/network-insights-overview/dependency-view.png)

The dependency graph enables easy navigation to configuration settings. Right-click on a backend pool to access to other functionality. For example, if the backend pool is a VM, you can directly access VM Insights and Network Watcher connection troubleshoot to identify connectivity issues.

![Azure Monitor for Networks - Dependency view menu](media/network-insights-overview/dependency-view-menu.png)

The search and filter bar on the dependency view provide an effortless way to search through the graph. For example, searching for *AppGWTestRule* in the example below will narrow down the graphical view to all nodes connected via *AppGWTestRule*.

![Azure Monitor for Networks  - Search example](media/network-insights-overview/search-example.png)

Different filters provide help to narrow down on to a specific path and state. For example, select only *Unhealthy* from the **Health Status** drop down to show all the edges where state is *Unhealthy*.

Click on **Detailed Metric View** to launch a pre-configured workbook with detailed metrics for the Application Gateway, all backend pool resources and front end IPs. 

## <a name="connectivity"></a>Connectivity

The **Connectivity** tab provides an effortless way to visualize all tests configured using Connection Monitor and [Connection Monitor (Preview)](../../network-watcher/connection-monitor-preview.md) for the selected set of subscriptions.

![Connectivity tab in Azure Monitor for Networks](media/network-insights-overview/azure-monitor-for-networks-connectivity-tab.png)

Tests are grouped by Sources and Destinations tiles and display the reachability status for each test. Reachable settings provide an easy access to configure your reachability criteria based on Checks failed (%) and RTT (ms). Once the values are set the status for each test is updated based on the selection criteria.

![Connectivity tests in Azure Monitor for Networks](media/network-insights-overview/azure-monitor-for-networks-connectivity-tests.png)

Clicking on any source or destination tile launches a metric view.

![Connectivity metrics in Azure Monitor for Networks](media/network-insights-overview/azure-monitor-for-networks-connectivity-metrics.png)


You can click on each element in the grid view. Click on **Reachability** icon to redirect to the **Connection Monitor** portal page to view the hop by hop topology and connectivity impacting issues identified. Click on **Alerts** to redirect to alerts and **Checks Failed Percent/Round-Trip Time** to redirect to metrics page for the selected Connection Monitor.

The **Alerts** grid on the right provides a view of all the alerts generated for the connectivity tests configured across all subscriptions. Click on the alert counts to navigate to detailed alerts page.

## <a name="traffic"></a>Traffic
Traffic tab provides access to all NSGs configured for [NSG Flow logs](../../network-watcher/network-watcher-nsg-flow-logging-overview.md) and [Traffic Analytics](../../network-watcher/traffic-analytics.md) for the selected set of subscriptions and grouped by locations. The search functionality provided on this tab enables identifying the NSGs configured for the searched IP address. You can search for any IP address in your environment and the tiled regional view will display all NSGs along with the NSG Flow logs and Traffic analytics configuration status.

![Traffic view in Azure Monitor for Networks](media/network-insights-overview/azure-monitor-for-networks-traffic-view.png)

Clicking on any region tile launches a grid view that provides easy to view and configure NSG flow logs and Traffic Analytics.  

![Traffic region view in Azure Monitor for Networks](media/network-insights-overview/azure-monitor-for-networks-traffic-region-view.png)

You can click on each element in the grid view. Click on configuration status to edit the NSG flow log and Traffic Analytics configuration. Click on alerts to redirect to the Traffic Alerts configured for the selected NSG. Similarly, you can navigate to the Traffic Analytics view by clicking on the Workspace.  

The **Alerts** grid on the right provides a view of all the Traffic Analytics workspace based alerts across all subscriptions. Click on the alert counts to navigate to detailed alerts page.

## <a name="diagnostictoolkit"></a> Diagnostic toolkit
Diagnostic Toolkit provides access to all Diagnostic features available for troubleshooting the network. From this dropdown you get can access to features such as [Packet Capture](../../network-watcher/network-watcher-packet-capture-overview.md), [VPN Troubleshoot](../../network-watcher/network-watcher-troubleshoot-overview.md), [Connection Troubleshoot](../../network-watcher/network-watcher-connectivity-overview.md), [Next Hop](../../network-watcher/network-watcher-next-hop-overview.md) and [IP Flow Verify](../../network-watcher/network-watcher-ip-flow-verify-overview.md).

![Diagnostic toolkit tab](media/network-insights-overview/azure-monitor-for-networks-diagnostic-toolkit.png)

## Next steps

- Learn more about network monitoring at [What is Azure Network Watcher?](../../network-watcher/network-watcher-monitoring-overview.md).

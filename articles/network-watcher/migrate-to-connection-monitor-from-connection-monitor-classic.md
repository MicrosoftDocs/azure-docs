---
title: Migrate to Connection monitor from Connection monitor (classic)
titleSuffix: Azure Network Watcher
description: Learn how to migrate your connection monitors from Connection monitor (classic) to the new Connection monitor.
author: halkazwini
ms.author: halkazwini
ms.service: network-watcher
ms.topic: how-to
ms.date: 03/12/2024

#CustomerIntent: As an Azure administrator, I want to migrate my connection monitors from Connection monitor (classic) to the new Connection monitor so I avoid service disruption. 
---

# Migrate to Connection monitor from Connection monitor (classic)

In this article, you learn how to migrate your existing connection monitors from Connection monitor (classic) to the new Connection monitor with zero downtime. For more information, see [Connection monitor overview](connection-monitor-overview.md).

> [!IMPORTANT]
> Connection monitor (Classic) is deprecated and no longer available. To minimize service disruption to your current workloads, migrate from Connection monitor (classic) to the new Connection monitor.

## Key benefits of the new Connection monitor

The following are key benefits of the new Connection monitor:

- Unified connectivity monitoring experience for Azure and Hybrid endpoints 

    - Virtual machines (VMs) and scale sets support as source and destination endpoints.  

    - Azure Monitor agent enabled ARC servers as source and destination endpoints. 

    - Cross subscription, cross workspace and cross region monitoring support.   

- Ease of experience with simplified agent support 

    - Lightweight Azure Network Watcher extension compatible with ARC endpoints. 

    - Auto upgrade of agents with automated agent enablement support.

- Visualize & measure end-to-end network path performance with the new Topology (preview)

    - Deep insights into network performance metrics with synthetic monitoring across TCP, ICMP and HTTP protocols.

    - Enhanced visibility into end-to-end network path and connections with per hop latency and path loss across path components, highlighting links with high latency or packet loss.  

- Enhanced troubleshooting with clear actionable insights  

    - Fast detection with real-time alerting network connectivity issues. 

    - Smart insights into changes across networking path components to highlight the underlying cause for connectivity errors. 

    - Identification of blocking rules and resources responsible for endpoint connectivity failures.  

## Connection monitor (classic) vs new Connection monitor

The following table compares Connection monitor (classic) and the new Connection monitor:

| Feature | Connection monitor (classic) | Connection monitor |
| ------- | --------------------------- | ------------------ |
| Unified experience for Azure and hybrid monitoring | Not available | Available |
| Support for ARC enabled Azure Monitor agent supported endpoints as source and destination endpoints | Not available | Available |
| Compound resources - Virtual networks, subnets, and on-premises custom networks | Not available | Available |
| Cross subscription, cross-region, and cross-workspace monitoring | Not available | Available |
| Centralized workspace support  | Not available | Available |
| Multiple sources can ping multiple destinations  | Not available | Available |
| Unified topology across on-premises, internet, and Azure hops | Not available | Available |
| HTTP status code checks | Not available | Available |
| Enhanced connectivity diagnostics  | Not available | Available |
| Connectivity metrics and dimension measurements with Log Analytics support | Not available | Available with TCP, ICMP and HTTP |
| Automation – PowerShell, the Azure CLI, Terraform | Available | Available |
| Support for Linux | Available  | Available |
| Support for public, Government, China, and air-gapped cloud | Available | Available |

## Key points to note

The migration helps produce the following results:

- Agents and firewall settings work as is. No changes are required. 
- Existing connection monitors are mapped to Connection monitor > Test group > Test format. By selecting **Edit**, you can view and modify the properties of the new Connection monitor, download a template to make changes to Connection monitor, and submit it via Azure Resource Manager. 
- Azure virtual machines with the Network Watcher extension send data to both the workspace and the metrics. Connection monitor makes the data available through the new metrics `ChecksFailedPercent` and `RoundTripTimeMs` instead of the old metrics `ProbesFailedPercent` and `AverageRoundtripMs` respectively.
- Data monitoring:
   - **Alerts**: Migrated automatically to the new metrics.
   - **Dashboards and integrations**: Require manual editing of the metrics set. 
	
## Prerequisites

- If you're using a custom workspace, ensure that Network Watcher is enabled in your subscription and in the region of your Log Analytics workspace. If not, you get an error stating "Before you attempt to migrate, please enable Network watcher extension in the subscription and location of LA workspace selected."
- In case virtual machines used as sources in Connection monitor (classic) no longer have the Network Watcher extension enabled, you get an error message stating "Connection monitors having following tests cannot be imported as one or more Azure virtual machines don't have network watcher extension installed. Install Network Watcher extension and click refresh to import them."

## Migrate the connection monitors

1. To migrate the older connection monitors to the new Connection monitor, select **Connection monitor**, and then select **Migrate Connection Monitors**.

    :::image type="content" source="./media/migrate-to-connection-monitor-from-connection-monitor-classic/migrate-classic-connection-monitors.png" alt-text="Screenshot showing the migration of connection monitors to the new Connection monitor." lightbox="./media/migrate-to-connection-monitor-from-connection-monitor-classic/migrate-classic-connection-monitors.png":::
	
1. Select your subscription and the connection monitors you want to migrate, and then select **Migrate selected**. 

You can now customize Connection monitor properties, change the default workspace, download templates, and check the migration status. 

After the migration begins, the following changes take place:

- The Azure Resource Manager resource changes to the newer connection monitor:
	- The name, region, and subscription of the connection monitor remain unchanged. The resource ID is unaffected.
	- Unless the connection monitor is customized, a default Log Analytics workspace is created in the subscription and in the region of the connection monitor. This workspace is where monitoring data is stored. The test result data is also stored in the metrics.
	- Each test is migrated to a test group called *defaultTestGroup*.
	- Source and destination endpoints are created and used in the new test group. The default names are *defaultSourceEndpoint* and *defaultDestinationEndpoint*.
	- The destination port and probing interval are moved to a test configuration called *defaultTestConfiguration*. The protocol is set based on the port values. Success thresholds and other optional properties are left blank.
- Metrics alerts are migrated to Connection monitor metrics alerts. The metrics are different, hence the change. For more information, see [Metrics in Azure Monitor](connection-monitor-overview.md#metrics-in-azure-monitor).
- The migrated connection monitors are no longer displayed as the older connection monitor solution. They're now available for use only in Connection monitor.
- Any external integrations, such as dashboards in Power BI and Grafana, and integrations with Security Information and Event Management (SIEM) systems, must be migrated manually. This is the only manual step you need to perform to migrate your setup.

## Common errors encountered

The following table list common errors that you might encounter during the migration:

| Error | Reason |
| ----- | ------ |
| Following Connection monitors cannot be imported as one or more Subscription/Region combinations don't have network watcher enabled. Enable network watcher and click refresh to import them. | This error occurs when you migrate tests from Connection monitor (classic) to Connection monitor and Network Watcher extension isn't enabled in one or more subscriptions and regions of Connection monitor (classic). You need to enable Network Watcher extension in all subscriptions and regions used in Connection monitor (classic). |
| Connection monitors having following tests cannot be imported as one or more Azure virtual machines don't have Network Watcher extension installed. Install Network Watcher extension and select refresh to import the tests. | This error occurs when you migrate tests from Connection monitor (classic) to Connection monitor and Network Watcher extension isn't installed in one or more Azure VMs of Connection monitor (classic). You need to install the Network Watcher extension in all Azure VMs of Connection monitor (classic), and then refresh before migrating again. |
| No rows to display | This error occurs when you try to migrate subscriptions from Connection monitor (classic) to Connection monitor but no Connection monitor (classic) is created in the subscriptions. |

## Related content

- [Migrate from Network performance monitor to Connection monitor](migrate-to-connection-monitor-from-network-performance-monitor.md).
- [Create a connection monitor using the Azure portal](connection-monitor-create-using-portal.md).
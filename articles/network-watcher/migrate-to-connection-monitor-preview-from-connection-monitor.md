---
title: Migrate to Connection Monitor (Preview) from Connection Monitor
titleSuffix: Azure Network Watcher
description: Learn how to migrate to Connection Monitor (Preview) from Connection Monitor.
services: network-watcher
documentationcenter: na
author: vinynigam
ms.service: network-watcher
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload:  infrastructure-services
ms.date: 08/20/2020
ms.author: vinigam
#Customer intent: I need to migrate from Connection Monitor to Connection Monitor (Preview). 
---
# Migrate to Connection Monitor (Preview) from Connection Monitor

You can migrate existing connection monitors to new, improved Connection Monitor (Preview) with only a few clicks and with zero downtime. To learn more about the benefits, see [Connection Monitor (Preview)](https://docs.microsoft.com/azure/network-watcher/connection-monitor-preview).

## Key points to note

The migration helps produce the following results:

* Agents and firewall settings work as is. No changes are required. 
* Existing connection monitors are mapped to Connection Monitor (Preview) > Test Group > Test format. By selecting **Edit**, you can view and modify the properties of the new Connection Monitor, download a template to make changes to Connection Monitor, and submit it via Azure Resource Manager. 
* Azure virtual machines with the Network Watcher extension send data to both the workspace and the metrics. Connection Monitor makes the data available through the new metrics (ChecksFailedPercent [Preview] and RoundTripTimeMs [Preview]) instead of the old metrics (ProbesFailedPercent and AverageRoundtripMs). 
* Data monitoring:
   * **Alerts**: Migrated automatically to the new metrics.
   * **Dashboards and integrations**: Require manually editing of the metrics set. 
	
## Prerequisites

If you're using a custom workspace, ensure that Network Watcher is enabled in your subscription and in the region of your Log Analytics workspace. 

## Migrate the connection monitors

1. To migrate the older connection monitors to the newer one, select **Connection Monitor**, and then select **Migrate Connection Monitors**.

	![Screenshot showing the migration of connection monitors to Connection Monitor (Preview).](./media/connection-monitor-2-preview/migrate-cm-to-cm-preview.png)
	
1. Select your subscription and the connection monitors you want to migrate, and then select **Migrate selected**. 

With only a few clicks, you've migrated the existing connection monitors to Connection Monitor (Preview). 

You can now customize Connection Monitor (Preview) properties, change the default workspace, download templates, and check the migration status. 

After the migration begins, the following changes take place: 
* The Azure Resource Manager resource changes to the newer connection monitor.
	* The name, region, and subscription of the connection monitor remain unchanged. The resource ID is unaffected.
	* Unless the connection monitor is customized, a default Log Analytics workspace is created in the subscription and in the region of the connection monitor. This workspace is where monitoring data is stored. The test result data is also stored in the metrics.
	* Each test is migrated to a test group called *defaultTestGroup*.
	* Source and destination endpoints are created and used in the new test group. The default names are *defaultSourceEndpoint* and *defaultDestinationEndpoint*.
	* The destination port and probing interval are moved to a test configuration called *defaultTestConfiguration*. The protocol is set based on the port values. Success thresholds and other optional properties are left blank.
* Metrics alerts are migrated to Connection Monitor (Preview) metrics alerts. The metrics are different, hence the change. For more information, see [Network connectivity monitoring with Connection Monitor (Preview)](https://docs.microsoft.com/azure/network-watcher/connection-monitor-preview#metrics-in-azure-monitor).
* The migrated connection monitors are no longer displayed as the older connection monitor solution. They're now available for use only in Connection Monitor (Preview).
* Any external integrations, such as dashboards in Power BI and Grafana, and integrations with Security Information and Event Management (SIEM) systems, must be migrated manually. This is the only manual step you need to perform to migrate your setup.

## Next steps

To learn more about Connection Monitor (Preview), see:
* [Migrate from Network Performance Monitor to Connection Monitor (Preview)](migrate-to-connection-monitor-preview-from-network-performance-monitor.md)
* [Create Connection Monitor (Preview) by using the Azure portal](https://docs.microsoft.com/azure/network-watcher/connection-monitor-preview-create-using-portal)

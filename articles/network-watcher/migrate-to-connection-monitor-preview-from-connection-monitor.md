---
title: Migrate to Connection Monitor (preview) from Connection Monitor
titleSuffix: Azure Network Watcher
description: Learn how to migrate to Connection Monitor (preview) from Connection Monitor.
services: network-watcher
documentationcenter: na
author: vinigam
ms.service: network-watcher
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload:  infrastructure-services
ms.date: 08/20/2020
ms.author: vinigam
#Customer intent: I need to migrate from Connection Monitor to Connection Monitor (preview). 
---
# Migrate to Connection Monitor (preview) from Connection Monitor

You can migrate existing connection monitors to new, improved Connection Monitor (preview) with a single click and with zero downtime. To learn more about the benefits, see [Connection Monitor (preview)](https://docs.microsoft.com/azure/network-watcher/connection-monitor-preview).

## Key points to note

The migration helps produce the following results:

* Agents and firewall settings work as is (no touch required). 
* Existing connection monitors are mapped to Connection Monitor (preview) > Test Group > Test format. By selecting **Edit**, you can view and modify the properties of the new Connection Monitor, download a template to make changes to Connection Monitor, and submit it via Azure Resource Manager. 
* Azure virtual machines with the Network Watcher extension send data to both the workspace and the metrics. Connection Monitor makes the data available through the new metrics (ChecksFailedPercent [preview] and RoundTripTimeMs [preview]) instead of the stop old metrics (ProbesFailedPercent and AverageRoundtripMs). 
* Monitoring data
	* Alerts are migrated automatically to the new metrics.
	* Dashboards and integrations require manually editing of the metrics set. 
	
## Prerequisites

If you're using a custom workspace, ensure that Network Watcher is enabled in your subscription and the region of the Log Analytics workspace. 

## Perform the migration

1. To migrate from the older connection monitor to the newer one, select **Connection Monitor**, and then select **Migrate Connection Monitors**.

	![Screenshot showing the migration of connection monitors to Connection Monitor (preview).](./media/connection-monitor-2-preview/migrate-cm-to-cm-preview.png)
	
1. Select your subscription and connection monitors, and then select **Migrate selected**. 

With a single click, you've migrated the existing connection monitors to Connection Monitor (preview). 

You can now customize Connection Monitor (preview) properties, change the default workspace, download templates, and check the migration status. 

After the migration begins, the following changes take place: 
* The Azure Resource Manager resource changes to the newer connection monitor.
	* The name, region, and subscription of the connection monitor remain unchanged. There is no impact on the resource ID.
	* Unless the connection monitor is customized, a default Log Analytics workspace is created in the region and subscription of the connection monitor. This workspace is where monitoring data will be stored. The test result data is also stored in metrics.
	* Each test is migrated to a test group called *defaultTestGroup*.
	* Source and destination endpoints are created and used in the new test group. The default names are *defaultSourceEndpoint* and *defaultDestinationEndpoint*.
	* The destination port and probing interval are moved to the test configuration called *defaultTestConfiguration*. Based on the port values, the protocol is set. Success thresholds and other optional properties are left blank.
* Metrics alerts are migrated to Connection Monitor (preview) metrics alerts. The metrics are different, hence the change.
* The migrated connection monitors are no longer displayed as the older connection monitor solution. They're now available for use only in Connection Monitor (preview).
* Any external integrations, such as dashboards in Power BI and Grafana and integrations with SIEM systems, must be migrated by users directly. This is the only manual step you need to perform to migrate your setup.

## Next steps

To learn more about Connection Monitor (preview), see:
* [Migrate from Network Performance Monitor to Connection Monitor (preview)](migrate-to-connection-monitor-preview-from-network-performance-monitor.md)
* [Create Connection Monitor (preview) by using the Azure portal](https://docs.microsoft.com/azure/network-watcher/connection-monitor-preview-create-using-portal)

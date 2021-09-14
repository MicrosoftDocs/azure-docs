---
title: Migrate to Connection Monitor from Network Performance Monitor
titleSuffix: Azure Network Watcher
description: Learn how to migrate to Connection Monitor from Network Performance Monitor.
services: network-watcher
documentationcenter: na
author: vinynigam
ms.service: network-watcher
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload:  infrastructure-services
ms.date: 01/07/2021
ms.author: vinigam
#Customer intent: I need to migrate from Network Performance Monitor to Connection Monitor. 
---
# Migrate to Connection Monitor from Network Performance Monitor

> [!IMPORTANT]
> Starting 1 July 2021, you will not be able to add new tests in an existing workspace or enable a new workspace with Network Performance Monitor. You can continue to use the tests created prior to 1 July 2021. To minimize service disruption to your current workloads, migrate your tests from Network Performance Monitor to the new Connection Monitor in Azure Network Watcher before 29 February 2024.

You can migrate tests from Network Performance Monitor (NPM) to new, improved Connection Monitor with a single click and with zero downtime. To learn more about the benefits, see [Connection Monitor](./connection-monitor-overview.md).


## Key points to note

The migration helps produce the following results:

* On-premises agents and firewall settings work as is. No changes are required. Log Analytics agents that are installed on Azure virtual machines need to be replaced with the [Network Watcher extension](../virtual-machines/extensions/network-watcher-windows.md).
* Existing tests are mapped to Connection Monitor > Test Group > Test format. By selecting **Edit**, you can view and modify the properties of the new Connection Monitor, download a template to make changes to it, and submit the template via Azure Resource Manager.
* Agents send data to both the Log Analytics workspace and the metrics.
* Data monitoring:
   * **Data in Log Analytics**: Before migration, the data remains in the workspace in which NPM is configured in the NetworkMonitoring table. After the migration, the data goes to the NetworkMonitoring table, NWConnectionMonitorTestResult table and NWConnectionMonitorPathResult table in the same workspace. After the tests are disabled in NPM, the data is stored only in the NWConnectionMonitorTestResult table and NWConnectionMonitorPathResult table.
   * **Log-based alerts, dashboards, and integrations**: You must manually edit the queries based on the new NWConnectionMonitorTestResult table and NWConnectionMonitorPathResult table. To re-create the alerts in metrics, see [Network connectivity monitoring with Connection Monitor](./connection-monitor-overview.md#metrics-in-azure-monitor).
* For ExpressRoute Monitoring:
	* **End to end loss and latency**:  Connection Monitor will power this, and it will easier than NPM as users do not need to configure which circuits and peerings to monitor. Circuits in the path will automatically be discovered , data will be available in metrics (faster than LA which was where NPM stored the results). Topology will work as is as well.
	* **Bandwidth measurements**: With the launch of bandwidth related metrics, NPM’s log analytics based approach was not effective in bandwidth monitoring for ExpressRoute customers. This capability is now not available in Connection Monitor.
	
## Prerequisites

* Ensure that Network Watcher is enabled in your subscription and the region of the Log Analytics workspace. If not done, you will see an error stating "Before you attempt migrate, please enable Network watcher extension in selection subscription and location of LA workspace selected."
* In case Azure VM belonging to a different region/subscription than that of Log Analytics workspace is used as an endpoint, make sure Network Watcher is enabled for that subscription and region.   
* Azure virtual machines with Log Analytics agents installed must be enabled with the Network Watcher extension.

## Migrate the tests

To migrate the tests from Network Performance Monitor to Connection Monitor, do the following:

1. In Network Watcher, select **Connection Monitor**, and then select the **Import tests from NPM** tab. 

	:::image type="content" source="./media/connection-monitor-2-preview/migrate-npm-to-cm-preview.png" alt-text="Migrate tests from Network Performance Monitor to Connection Monitor" lightbox="./media/connection-monitor-2-preview/migrate-npm-to-cm-preview.png":::
	
1. In the drop-down lists, select your subscription and workspace, and then select the NPM feature you want to migrate. 
1. Select **Import** to migrate the tests.
* If NPM is not enabled on the workspace, you will see an error stating "No valid NPM config found". 
* If no tests exist in the feature you chose in step2 , you will see an error stating "Workspace selected does not have <feature> config".
* If there are no valid tests, you will see an error stating "Workspace selected does not have valid tests"
* Your tests may contain agents that are no longer active, but may have been active in the past. You will see an error stating "Few tests contain agents that are no longer active. List of inactive agents - {0}. These agents may be running in the past but are shut down/not running any more. Enable agents and migrate to Connection Monitor. Click continue to migrate the tests that do not contain agents that are not active."

After the migration begins, the following changes take place: 
* A new connection monitor resource is created.
   * One connection monitor per region and subscription is created. For tests with on-premises agents, the new connection monitor name is formatted as `<workspaceName>_"workspace_region_name"`. For tests with Azure agents, the new connection monitor name is formatted as `<workspaceName>_<Azure_region_name>`.
   * Monitoring data is now stored in the same Log Analytics workspace in which NPM is enabled, in new tables called NWConnectionMonitorTestResult table and NWConnectionMonitorPathResult table. 
   * The test name is carried forward as the test group name. The test description isn't migrated.
   * Source and destination endpoints are created and used in the new test group. For on-premises agents, the endpoints are formatted as `<workspaceName>_<FQDN of on-premises machine>`.The Agent description isn't migrated.
   * Destination port and probing interval are moved to a test configuration called `TC_<protocol>_<port>` and `TC_<protocol>_<port>_AppThresholds`. The protocol is set based on the port values. For ICMP, the test configurations are named as `TC_<protocol>` and `TC_<protocol>_AppThresholds`. Success thresholds and other optional properties if set are migrated, otherwise are left blank.
   * If the migrating tests contain agents that aren't running, you need to enable the agents and migrate again.
* NPM isn't disabled, so the migrated tests can continue to send data to the NetworkMonitoring table, NWConnectionMonitorTestResult table and NWConnectionMonitorPathResult table. This approach ensures that existing log-based alerts and integrations are unaffected.
* The newly created connection monitor is visible in Connection Monitor.

After the migration, be sure to:
* Manually disable the tests in NPM. Until you do so, you'll continue to be charged for them. 
* While you're disabling NPM, re-create your alerts on the NWConnectionMonitorTestResult and NWConnectionMonitorPathResult tables or use metrics. 
* Migrate any external integrations to the NWConnectionMonitorTestResult and NWConnectionMonitorPathResult tables. Examples of external integrations are dashboards in Power BI and Grafana, and integrations with Security Information and Event Management (SIEM) systems.

## Common Errors Encountered

Below are some common errors faced during the migration : 

| Error  |    Reason   |
|---|---|
| No valid NPM config found. Go to NPM UI to check config     |     This error occurs when User is selecting Import Tests from NPM to migrate the tests but NPM is not enabled in the workspace   |
|Workspace selected does not have 'Service Connectivity Monitor' config    |       This error occurs when User is migrating tests from NPM’s Service Connectivity Monitor to Connection Monitor but there are no tests configured in Service Connectivity Monitor |
|Workspace selected does not have 'ExpressRoute Monitor' config    |     This error occurs when User is migrating tests from NPM’s ExpressRoute Monitor to Connection Monitor but there are no tests configured in ExpressRoute Monitor  |
|Workspace selected does not have 'Performance Monitor' config    |      This error occurs when User is migrating tests from NPM’s Performance Monitor to Connection Monitor but there are no tests configured in Performance Monitor |
|Workspace selected does not have valid '{0}' tests    |      This error occurs when User is migrating tests from NPM to Connection Monitor but there are no valid tests present in the feature chosen by User to migrate  |
|Before you attempt migrate, please enable Network watcher extension in selection subscription and location of LA workspace selected      |      This error occurs when User is migrating tests from NPM to Connection Monitor and Network Watcher Extension is not enabled in the LA workspace selected. User needs to enable NW Extension before migrating tests |
|Few {1} tests contain agents that are no longer active. List of inactive agents - {0}. These agents may be running in the past but are shut down/not running any more. Enable agents and migrate to Connection Monitor. Click continue to migrate the tests that do not contain agents that are not active       |    This error occurs when User is migrating tests from NPM to Connection Monitor and some selected tests contain inactive Network Watcher Agents or such NW Agents which are no longer active but used to be active in the past and have been shut down. User can deselect these tests and continue to select and migrate the tests which do not contain any such inactive agents  |
|Your {1} tests contain agents that are no longer active. List of inactive agents -  {0}. These agents may be running in the past but are shut down/not running any more. Enable agents and migrate to Connection Monitor     | This error occurs when User is migrating tests from NPM to Connection Monitor and selected tests contain inactive Network Watcher Agents or such NW Agents which are no longer active but used to be active in the past and have been shut down. User needs to enable the agents and then continue to migrate these tests to Connection Monitor    |
|An error occurred while importing tests to connection monitor     |    This error occurs when User is trying to migrate tests from NPM to CM but due to errors the migration is not successful |



## Next steps

To learn more about Connection Monitor, see:
* [Migrate from Connection Monitor (classic) to Connection Monitor](./migrate-to-connection-monitor-from-connection-monitor-classic.md)
* [Create Connection Monitor by using the Azure portal](./connection-monitor-create-using-portal.md)

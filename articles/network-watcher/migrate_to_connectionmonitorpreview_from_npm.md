---
title: Migrate to Connection Monitor (Preview) from Network Performance Monitor
titleSuffix: Azure Network Watcher
description: Learn how to migrate to Connection Monitor (Preview) from Network Performance Monitor.
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
#Customer intent: I need to migrate from Network Performance Monitor to connection montior preview 
---
# Migrate to Connection Monitor (Preview) from Network Performance Monitor

You can migrate tests from Network Performance Monitor to the new and improved Connection Monitor(Preview) in one click and with zero downtime. To know more about the benefits of Connection Monitor (Preview) [click here](https://docs.microsoft.com/azure/network-watcher/connection-monitor-preview). 

>[!NOTE]
> Only tests from Service Connectivity Monitor can be migrated to Connection Monitor(preview).
>

## Key points to note

* On-premises agents and firewall settings will work as is. No changes required. Log Analytics agents installed on Azure Virtual Machines need to be replaced with Network Watcher extension
* Existing tests will be mapped to Connection Monitor (Preview)-> Test Group -> Test format. Users can click *Edit* to view and modify properties of the new Connection Monitor and download template to make changes to Connection Monitor and submit it via ARM.
* Agents send data to both – Log Analytics workspace and metrics.
* Monitoring data
	* Data in Log Analytics – All data pre migration continues to be in the workspace in which NPM is configured in NetworkMonitoring table. Post migration, data goes to NetworkMonitoring table and ConnectionMonitor_CL table in the same workspace. Once tests are disabled from NPM, data will only be stored in ConnectionMonitor_CL table
	* Log based alerts, dashboards and Integrations – You will have to manually edit the queries based on the new table ConnectionMonitor_CL. You can also recreate the alerts in metrics using this link. Ability to migrate log based alerts on NetworkMonitoring table to  metrics based alerts automatically as a part of migration will be available soon
	
## Perquisites

*	Ensure Network Watcher is enabled in subscription and region of the Log Analytics workspace
*	Azure virtual machines with Log analytics agents installed will need to be enabled with Network Watcher extension

## Steps to migrate tests from Network Performance Monitor to Connection Monitor (Preview)

1.	Click on “Connection Monitor”, navigate to “Migrate tests from NPM” to migrate tests to Connection Monitor(Preview)

	![Screenshot showing migrate tests from NPM to Connection Monitor (Preview)](./media/connection-monitor-2-preview/migrate npm to cm preview.png)

1.	Select subscription, workspace and the NPM feature you want to migrate. Currently you can migrate only tests from Service Connectivity Monitor.  
1.	Click “Import” to migrate tests
1.	Once migration begins, following changes happen: 
	a. A new connection monitor resource is created
		i. One connection monitor per region and subscription is created. For tests with on-premises agents the new connection monitor name is of the format <workspaceName>_”Onpremises”. For tests with Azure agents the new connection monitor name is of the format <workspaceName>_<Azure_region_name>
		ii. Monitoring data is now stored in the same Log Analytics workspace in which NPM is enabled, in a new table called Connectionmonitor_CL table. 
		iii. Test name is carried forward to test group name. Test description will not be migrated.
		iv. Source and destination endpoints are created and used in the created test group. For on-premises agents, the endpoints are named in the format <workspaceName>_”endpoint”_<FQDN of on-premises machine>.For AzureIf the migrating tests contain agents are not running, you will need to enable the agents and migrate again.
		v. Destination port and probing interval are moved to the test configuration namely “TC”_<testname>” and “TC”_<testname>_”AppThresholds” . Based on the port values, the protocol is set. Success thresholds and other optional properties are left blank.
	b. NPM is not disabled. Hence migrated tests continue to send data to NetworkMonitoring table as well as ConnectionMonitor_CL table. This ensures that existing log based alerts and integrations are not impacted.. Migrating log based alerts on NetworkMonitoring table to metrics based alerts automatically as a part of migration will be available soon.
	c. Newly created connection monitor will be visible in  Connection Monitor (Preview)
1.	Post migration, you would need to manually disable the tests in NPM. Until you do, you would continue to be charged for the same. While disabling NPM, ensure that you recreate your alerts on ConnectionMonitor_CL table or use metrics. Also ensure that any external integrations like dashboards in PowerBI, Grafana, integrations with SIEM systems, will need to be migrated to ConnectionMonitor_CL table


## Next steps

* Learn [how to migrate from Connection Monitor to Connection Montior (Preview)](migrate_to_connectionmonitorpreview_from_connection_monitor.md)
* Learn [how to create Connection Monitor (Preview) using Azure portal](https://docs.microsoft.com/azure/network-watcher/connection-monitor-preview-create-using-portal)
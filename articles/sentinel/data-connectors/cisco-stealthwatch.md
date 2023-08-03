---
title: "Cisco Stealthwatch connector for Microsoft Sentinel"
description: "Learn how to install the connector Cisco Stealthwatch to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 02/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Cisco Stealthwatch connector for Microsoft Sentinel

The [Cisco Stealthwatch](https://www.cisco.com/c/en/us/products/security/stealthwatch/index.html) data connector provides the capability to ingest [Cisco Stealthwatch events](https://www.cisco.com/c/dam/en/us/td/docs/security/stealthwatch/management_console/securit_events_alarm_categories/SW_7_2_1_Security_Events_and_Alarm_Categories_DV_1_0.pdf) into Microsoft Sentinel. Refer to [Cisco Stealthwatch documentation](https://www.cisco.com/c/dam/en/us/td/docs/security/stealthwatch/system_installation_configuration/SW_7_3_2_System_Configuration_Guide_DV_1_0.pdf) for more information.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | Syslog (StealthwatchEvent)<br/> |
| **Data collection rules support** | [Workspace transform DCR](../../azure-monitor/logs/tutorial-workspace-transformations-portal.md) |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**Top 10 Sources**
   ```kusto
StealthwatchEvent
 
   | summarize count() by tostring(DvcHostname)
 
   | top 10 by count_
   ```



## Vendor installation instructions


> [!NOTE]
   >  This data connector depends on a parser based on a Kusto Function to work as expected [**StealthwatchEvent**](https://aka.ms/sentinel-stealthwatch-parser) which is deployed with the Microsoft Sentinel Solution.


> [!NOTE]
   >  This data connector has been developed using Cisco Stealthwatch version 7.3.2

1. Install and onboard the agent for Linux or Windows

Install the agent on the Server where the Cisco Stealthwatch logs are forwarded.

> Logs from Cisco Stealthwatch Server deployed on Linux or Windows servers are collected by **Linux** or **Windows** agents.




2. Configure Cisco Stealthwatch event forwarding

Follow the configuration steps below to get Cisco Stealthwatch logs into Microsoft Sentinel.
1. Log in to the Stealthwatch Management Console (SMC) as an administrator.
2. In the menu bar, click **Configuration** **>** **Response Management**.
3. From the **Actions** section in the **Response Management** menu, click **Add > Syslog Message**.
4. In the Add Syslog Message Action window, configure parameters.
5. Enter the following custom format:
|Lancope|Stealthwatch|7.3|{alarm_type_id}|0x7C|src={source_ip}|dst={target_ip}|dstPort={port}|proto={protocol}|msg={alarm_type_description}|fullmessage={details}|start={start_active_time}|end={end_active_time}|cat={alarm_category_name}|alarmID={alarm_id}|sourceHG={source_host_group_names}|targetHG={target_host_group_names}|sourceHostSnapshot={source_url}|targetHostSnapshot={target_url}|flowCollectorName={device_name}|flowCollectorIP={device_ip}|domain={domain_name}|exporterName={exporter_hostname}|exporterIPAddress={exporter_ip}|exporterInfo={exporter_label}|targetUser={target_username}|targetHostname={target_hostname}|sourceUser={source_username}|alarmStatus={alarm_status}|alarmSev={alarm_severity_name}

6. Select the custom format from the list and click **OK**
7. Click **Response Management > Rules**.
8. Click **Add** and select **Host Alarm**.
9. Provide a rule name in the **Name** field.
10. Create rules by selecting values from the Type and Options menus. To add more rules, click the ellipsis icon. For a Host Alarm, combine as many possible types in a statement as possible.



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-ciscostealthwatch?tab=Overview) in the Azure Marketplace.
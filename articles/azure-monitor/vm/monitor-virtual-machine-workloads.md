---
title: Monitor Azure virtual machines with Azure Monitor
description: Describes how to collect and analyze monitoring data from virtual machines in Azure using Azure Monitor.
ms.service:  azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 05/05/2020

---

# Monitoring virtual machines with Azure Monitor - Workloads



## Windows or Syslog event
Create an alert when a Windows or Syslog event is created. You can alert as soon as a single event is found or wait for a series of matching events within a particular time window.

### Data collection
Configure Log Analytics workspace to collect [Windows events](../agents/data-sources-windows-events.md) or [Syslog events](../agents/data-sources-windows-events.md).

### Tables

| Table | Description |
|:---|:---|
| [Event](/azure/azure-monitor/reference/tables/event) | Windows events |
| [Syslog](/azure/azure-monitor/reference/tables/syslog) | Syslog events |


### Sample alert rules
The following sample creates an alert when a specific Windows event is created. It uses a metric measurement alert rule to create a separate alert for each computer.

The *Period* defines the time window for the events that are processed. For example, if you want to look for a number of events with an hour, set the Period to 60 minutes. The query will only consider the events created over the previous hour. You should use this value rather than setting a time window in your query.

| Property | Value| Notes |
|:---|:---|:---|
| Name | Server Virtual Disk Redundancy Lost - System Event 2123 ||
| Scope | Log Analytics Workspace ||
| Signal Type | Logs ||
| Signal Name | Custom Log Search ||
| Search Query | `Event | where EventID == 123 | summarize AggregatedValue = count() by Computer, bin(TimeGenerated, 15m)`| Change to a query using `Syslog` table for Syslog alert. |
| Based on | Metric measurement | Ensures a separate alert for each machine. |
| Threshold | Greater than 0 | |
| Trigger | Breaches greater than 0 | Increase this value to require multiple consecutive events.  |
| Period | 15 | Change this value to specify the time window for repeated events. |
| Frequency | 15 minutes | Change this value to run the alert rule more frequently with an increase in cost. | 


## Text logs
Create an alert from an event in a text log. 

### Data collection
Define a [custom log](../agents/data-sources-custom-logs.md) in the Log Analytics workspace.


### Tables

| Table | Description |
|:---|:---|
| MyTable_CL | Define the name and properties of the log when you configure it. |

### Sample alert rule


## Service or deamon down


### Data collection
The recommended method to alert on service up/down is the [Change Tracking solution]().  Azure Monitor alone doesn’t have a means to alert when a service is down. There are some possible methods such as looking for events in the Windows event log, but this is unreliable. You could also look for the process associated with the service running on the machine from the [VMProcess](/azure/azure-monitor/reference/tables/vmprocess) table, but this only updated every hour which is not typically sufficient for alerting.

### Tables

| Table | Description |
|:---|:---|
| [ConfigurationChange](/azure/azure-monitor/reference/tables/configurationdata) | Changes to in-guest configuration data. |
| [ConfigurationData](/azure/azure-monitor/reference/tables/configurationdata) | Last reported state for in-guest configuration data. |

### Alert rule samples

**Alert on a specific service**


```kusto
ConfigurationData
| where SvcName == "W3SVC" 
| where SvcState == "Stopped"
| where ConfigDataType == "WindowsServices"
| where SvcStartupType == "Auto"
| summarize AggregatedValue = count() by Computer, SvcName, SvcDisplayName, SvcState, bin(TimeGenerated, 15m)
```

**Alert on multiple services**


```kusto
let services = dynamic(["omskd","cshost","schedule","wuauserv","heathservice","efs","wsusservice","SrmSvc","CertSvc","wmsvc","vpxd","winmgmt","netman","smsexec","w3svc","sms_site_vss_writer","ccmexe","spooler","eventsystem","netlogon","kdc","ntds","lsmserv","gpsvc","dns","dfsr","dfs","dhcp","DNSCache","dmserver","messenger","w32time","plugplay","rpcss","lanmanserver","lmhosts","eventlog","lanmanworkstation","wnirm","mpssvc","dhcpserver","VSS","ClusSvc","MSExchangeTransport","MSExchangeIS"]);
ConfigurationData
| where ConfigDataType == "WindowsServices"
| where SvcStartupType == "Auto"
| where SvcName in (services)
| where SvcState == "Stopped"
| project TimeGenerated, Computer, SvcName, SvcDisplayName, SvcState
| summarize AggregatedValue = count() by Computer, SvcName, SvcDisplayName, SvcState, bin(TimeGenerated, 15m)
```



## Port monitoring
Port monitoring verifies that a machine is listening on a particular port. 

## Data collection
There are two methods for port monitoring. 

## Tables

| Table | Description |
|:---|:---|
| [VMBoundPort](/azure/azure-monitor/reference/tables/vmbounport) | Traffic for open server ports on the monitored machine. |
| [ConfigurationData](/azure/azure-monitor/reference/tables/configurationdata) | Last reported state for in-guest configuration data. |



## IIS logs

## Custom performance counters


## Port monitoring

## Application monitoring (synthetic transactions)



## Converting from management packs
A significant number of customers implementing Azure Monitor currently monitor their virtual machine workloads using management packs in System Center Operations Manager. There are no migration tools to convert assets from Operations Manager to Azure Monitor since the platforms are fundamentally different. Your migration will instead constitute a standard Azure Monitor implementation while you continue to use Operations Manager. As you customize Azure Monitor to meet your requirements for different applications and components and as it gains more features, then you can start to retire different management packs and agents in Operations Manager.

In many cases, you can configure data collection and alert rules in Azure Monitor that will replicate enough functionality that you can retire a particular management pack. Management packs can often include hundreds and even thousands of rules and monitors. Rather than attempting to replicate the entire functionality of a management pack, analyze the critical monitoring provided by the management pack and whether you can replicate those monitoring requirements using on the methods described in the previous sections.

You must configure data collection and an alert rule for any alerting scenarios. In most scenarios SCOM combines data collection and alerting conditions in the same rule or monitor. 

One strategy is to focus on those monitors and rules that have triggered alerts in your environment. Run the following query on the Operations Database to evaluate the most common alerts in your environment. Evaluate the output to identify specific alerts for migration. Ignore any alerts that have been tuned out or known to be problematic. Review your management packs to identify any additional critical alerts of interest that have never fired. Identify 25-50 alerts for a pilot migration.



```sql
select AlertName, COUNT(AlertName) as 'Total Alerts' from
Alert.vAlertResolutionState ars
inner join Alert.vAlertDetail adt on ars.AlertGuid = adt.AlertGuid
inner join Alert.vAlert alt on ars.AlertGuid = alt.AlertGuid
group by AlertName
order by 'Total Alerts' DESC
```



## Next steps

* [Learn how to analyze data in Azure Monitor logs using log queries.](../logs/get-started-queries.md)
* [Learn about alerts using metrics and logs in Azure Monitor.](../alerts/alerts-overview.md)
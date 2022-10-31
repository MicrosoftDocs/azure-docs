---
title: 'Monitor virtual machines with Azure Monitor: Workloads'
description: Learn how to monitor the guest workloads of virtual machines in Azure Monitor.
ms.service: azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 06/28/2022
ms.reviewer: Xema Pathak

---

# Monitor virtual machines with Azure Monitor: Workloads
This article is part of the scenario [Monitor virtual machines and their workloads in Azure Monitor](monitor-virtual-machine.md). It describes how to monitor workloads that are running on the guest operating systems of your virtual machines. This article includes details on analyzing and alerting on different sources of data on your virtual machines.

> [!NOTE]
> This scenario describes how to implement complete monitoring of your Azure and hybrid virtual machine environment. To get started monitoring your first Azure virtual machine, see [Monitor Azure virtual machines](../../virtual-machines/monitor-vm.md) or [Tutorial: Collect guest logs and metrics from Azure virtual machine](tutorial-monitor-vm-guest.md). 

## Configure additional data collection
VM insights collects only performance data from the guest operating system of enabled machines. You can enable the collection of additional performance data, events, and other monitoring data from the agent by configuring the Log Analytics workspace. It's configured only once because any agent that connects to the workspace automatically downloads the configuration and immediately starts collecting the defined data.

For a list of the data sources available and details on how to configure them, see [Agent data sources in Azure Monitor](../agents/agent-data-sources.md).

> [!IMPORTANT]
> Be careful to collect only the data that you require. Costs are associated with any data collected in your workspace. The data that you collect should only support particular analysis and alerting scenarios.

## Convert management pack logic
A significant number of customers who implement Azure Monitor currently monitor their virtual machine workloads by using management packs in System Center Operations Manager. There are no migration tools to convert assets from Operations Manager to Azure Monitor because the platforms are fundamentally different. Your migration instead constitutes a standard Azure Monitor implementation while you continue to use Operations Manager. As you customize Azure Monitor to meet your requirements for different applications and components and as it gains more features, then you can start to retire different management packs and agents in Operations Manager.

Instead of attempting to replicate the entire functionality of a management pack, analyze the critical monitoring provided by the management pack. Decide whether you can replicate those monitoring requirements by using the methods described in the previous sections. In many cases, you can configure data collection and alert rules in Azure Monitor that replicate enough functionality that you can retire a particular management pack. Management packs can often include hundreds and even thousands of rules and monitors.

In most scenarios, Operations Manager combines data collection and alerting conditions in the same rule or monitor. In Azure Monitor, you must configure data collection and an alert rule for any alerting scenarios.

One strategy is to focus on those monitors and rules that triggered alerts in your environment. Refer to [existing reports available in Operations Manager](/system-center/scom/manage-reports-installed-during-setup), such as **Alerts** and **Most Common Alerts**, which can help you identify alerts over time. You can also run the following query on the Operations Database to evaluate the most common recent alerts.

```sql
select AlertName, COUNT(AlertName) as 'Total Alerts' from
Alert.vAlertResolutionState ars
inner join Alert.vAlertDetail adt on ars.AlertGuid = adt.AlertGuid
inner join Alert.vAlert alt on ars.AlertGuid = alt.AlertGuid
group by AlertName
order by 'Total Alerts' DESC
```

Evaluate the output to identify specific alerts for migration. Ignore any alerts that were tuned out or are known to be problematic. Review your management packs to identify any critical alerts of interest that never fired.

## Windows or Syslog event
In this common monitoring scenario, the operating system and applications write to the Windows events or Syslog. Create an alert as soon as a single event is found. Or you can wait for a series of matching events within a particular time window.

To collect these events, configure a Log Analytics workspace to collect [Windows events](../agents/data-sources-windows-events.md) or [Syslog events](../agents/data-sources-windows-events.md). There's a cost for the ingestion and retention of this data in the workspace.

Windows events are stored in the [Event](/azure/azure-monitor/reference/tables/event) table and Syslog events are stored in the [Syslog](/azure/azure-monitor/reference/tables/syslog) table in the Log Analytics workspace.

### Sample log queries

- **Count the number of events by computer event log and event type.**

    ```kusto
    Event
    | summarize count() by Computer, EventLog, EventLevelName
    | sort by Computer, EventLog, EventLevelName
    ```

- **Count the number of events by computer event log and event ID.**
    
    ```kusto
    Event
    | summarize count() by Computer, EventLog, EventLevelName
    | sort by Computer, EventLog, EventLevelName
    ```

### Sample alert rules
The following sample creates an alert when a specific Windows event is created. It uses a metric measurement alert rule to create a separate alert for each computer.

- **Create an alert rule on a specific Windows event.**

   This example shows an event in the Application log. Specify a threshold of 0 and consecutive breaches greater than 0.

    ```kusto
    Event 
    | where EventLog == "Application"
    | where EventID == 123 
    | summarize AggregatedValue = count() by Computer, bin(TimeGenerated, 15m)
    ```

- **Create an alert rule on Syslog events with a particular severity.**

   The following example shows error authorization events. Specify a threshold of 0 and consecutive breaches greater than 0.

    ```kusto
    Syslog
    | where Facility == "auth"
    | where SeverityLevel == "err"
    | summarize AggregatedValue = count() by Computer, bin(TimeGenerated, 15m)
    ```

## Custom performance counters
You might need performance counters created by applications or the guest operating system that aren't collected by VM insights. Configure the Log Analytics workspace to collect this [performance data](../agents/data-sources-windows-events.md). There's a cost for the ingestion and retention of this data in the workspace. Be careful to not collect performance data that's already being collected by VM insights.

Performance data configured by the workspace is stored in the [Perf](/azure/azure-monitor/reference/tables/perf) table. This table has a different structure than the [InsightsMetrics](/azure/azure-monitor/reference/tables/insightsmetrics) table used by VM insights.

### Sample log queries

For examples of log queries that use custom performance counters, see [Log queries with Performance records](../agents/data-sources-performance-counters.md#log-queries-with-performance-records).

### Sample alerts

- **Create an alert on the maximum value of a counter.**
    
    ```kusto
    Perf 
    | where CounterName == "My Counter" 
    | summarize AggregatedValue = max(CounterValue) by Computer
    ```

- **Create an alert on the average value of a counter.**

    ```kusto
    Perf 
    | where CounterName == "My Counter" 
    | summarize AggregatedValue = avg(CounterValue) by Computer
    ```

## Text logs
Some applications write events written to a text log stored on the virtual machine. Define a [custom log](../agents/data-sources-custom-logs.md) in the Log Analytics workspace to collect these events. You define the location of the text log and its detailed configuration. There's a cost for the ingestion and retention of this data in the workspace.

Events from the text log are stored in a table with a name similar to **MyTable_CL**. You define the name and structure of the log when you configure it.

### Sample log queries
The column names used here are for example only. You define the column names for your particular log when you define it. The column names for your log will most likely be different.

- **Count the number of events by code.**
    
    ```kusto
    MyApp_CL
    | summarize count() by code
    ```

### Sample alert rule

- **Create an alert rule on any error event.**
    
    ```kusto
    MyApp_CL
    | where status == "Error"
    | summarize AggregatedValue = count() by Computer, bin(TimeGenerated, 15m)
    ```
## IIS logs
IIS running on Windows machines writes logs to a text file. Configure a Log Analytics workspace to collect [IIS logs](../agents/data-sources-iis-logs.md). There's a cost for the ingestion and retention of this data in the workspace.

Records from the IIS log are stored in the [W3CIISLog](/azure/azure-monitor/reference/tables/w3ciislog) table in the Log Analytics workspace.

### Sample log queries

- **Count the IIS log entries by URL for the host www.contoso.com.**
    
    ```kusto
    W3CIISLog 
    | where csHost=="www.contoso.com" 
    | summarize count() by csUriStem
    ```

- **Review the total bytes received by each IIS machine.**

    ```kusto
    W3CIISLog 
    | summarize sum(csBytes) by Computer
    ```

### Sample alert rule

- **Create an alert rule on any record with a return status of 500.**
    
    ```kusto
    W3CIISLog 
    | where scStatus==500
    | summarize AggregatedValue = count() by Computer, bin(TimeGenerated, 15m)
    ```

## Service or daemon
To monitor the status of a Windows service or Linux daemon, enable the [Change Tracking and Inventory](../../automation/change-tracking/overview.md) solution in [Azure Automation](../../automation/automation-intro.md). 
Azure Monitor has no ability to monitor the status of a service or daemon. There are some possible methods to use, such as looking for events in the Windows event log, but this method is unreliable. You can also look for the process associated with the service running on the machine from the [VMProcess](/azure/azure-monitor/reference/tables/vmprocess) table. This table only updates every hour, which isn't typically sufficient for alerting.

> [!NOTE]
> The Change Tracking and Analysis solution is different from the [Change Analysis](vminsights-change-analysis.md) feature in VM insights. This feature is in public preview and not yet included in this scenario.

For different options to enable the Change Tracking solution on your virtual machines, see [Enable Change Tracking and Inventory](../../automation/change-tracking/overview.md#enable-change-tracking-and-inventory). This solution includes methods to configure virtual machines at scale. You'll have to [create an Azure Automation account](../../automation/quickstarts/create-azure-automation-account-portal.md) to support the solution.

When you enable Change Tracking and Inventory, two new tables are created in your Log Analytics workspace. Use these tables for log query alert rules.

| Table | Description |
|:---|:---|
| [ConfigurationChange](/azure/azure-monitor/reference/tables/configurationdata) | Changes to in-guest configuration data |
| [ConfigurationData](/azure/azure-monitor/reference/tables/configurationdata) | Last reported state for in-guest configuration data |


### Sample log queries

- **List all services and daemons that have recently started.**
    
    ```kusto
    ConfigurationChange
    | where ConfigChangeType == "Daemons" or ConfigChangeType == "WindowsServices"
    | where SvcState == "Running"
    | sort by Computer, SvcName
    ```

### Alert rule samples

- **Create an alert rule based on when a specific service stops.**

    
    ```kusto
    ConfigurationData
    | where SvcName == "W3SVC" 
    | where SvcState == "Stopped"
    | where ConfigDataType == "WindowsServices"
    | where SvcStartupType == "Auto"
    | summarize AggregatedValue = count() by Computer, SvcName, SvcDisplayName, SvcState, bin(TimeGenerated, 15m)
    ```

- **Create an alert rule based on when one of a set of services stops.**
    
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
Port monitoring verifies that a machine is listening on a particular port. Two potential strategies for port monitoring are described here.

### Dependency agent tables
Use [VMConnection](/azure/azure-monitor/reference/tables/vmconnection) and [VMBoundPort](/azure/azure-monitor/reference/tables/vmboundport) to analyze connections and ports on the machine. The VMBoundPort table is updated every minute with each process running on the computer and the port it's listening on. You can create a log query alert similar to the missing heartbeat alert to find processes that have stopped or to alert when the machine isn't listening on a particular port.

### Sample log queries

- **Review the count of ports open on your VMs, which is useful for assessing which VMs have configuration and security vulnerabilities.**

    ```kusto
    VMBoundPort
    | where Ip != "127.0.0.1"
    | summarize by Computer, Machine, Port, Protocol
    | summarize OpenPorts=count() by Computer, Machine
    | order by OpenPorts desc
    ```

- **List the bound ports on your VMs, which is useful for assessing which VMs have configuration and security vulnerabilities.**

    ```kusto
    VMBoundPort
    | distinct Computer, Port, ProcessName
    ```


- **Analyze network activity by port to determine how your application or service is configured.**

    ```kusto
    VMBoundPort
    | where Ip != "127.0.0.1"
    | summarize BytesSent=sum(BytesSent), BytesReceived=sum(BytesReceived), LinksEstablished=sum(LinksEstablished), LinksTerminated=sum(LinksTerminated), arg_max(TimeGenerated, LinksLive) by Machine, Computer, ProcessName, Ip, Port, IsWildcardBind
    | project-away TimeGenerated
    | order by Machine, Computer, Port, Ip, ProcessName
    ```

- **Review bytes sent and received trends for your VMs.**

    ```kusto
    VMConnection
    | summarize sum(BytesSent), sum(BytesReceived) by bin(TimeGenerated,1hr), Computer
    | order by Computer desc
    | render timechart
    ```

- **Use connection failures over time to determine if the failure rate is stable or changing.**

    ```kusto
    VMConnection
    | where Computer == <replace this with a computer name, e.g. 'acme-demo'>
    | extend bythehour = datetime_part("hour", TimeGenerated)
    | project bythehour, LinksFailed
    | summarize failCount = count() by bythehour
    | sort by bythehour asc
    | render timechart
    ```

- **Link status trends to analyze the behavior and connection status of a machine.**

    ```kusto
    VMConnection
    | where Computer == <replace this with a computer name, e.g. 'acme-demo'>
    | summarize  dcount(LinksEstablished), dcount(LinksLive), dcount(LinksFailed), dcount(LinksTerminated) by bin(TimeGenerated, 1h)
    | render timechart
    ```

### Connection Manager
The [Connection Monitor](../../network-watcher/connection-monitor-overview.md) feature of [Network Watcher](../../network-watcher/network-watcher-monitoring-overview.md) is used to test connections to a port on a virtual machine. A test verifies that the machine is listening on the port and that it's accessible on the network.
Connection Manager requires the Network Watcher extension on the client machine initiating the test. It doesn't need to be installed on the machine being tested. For details, see [Tutorial - Monitor network communication using the Azure portal](../../network-watcher/connection-monitor.md).

There's an extra cost for Connection Manager. For details, see [Network Watcher pricing](https://azure.microsoft.com/pricing/details/network-watcher/).

## Run a process on a local machine
Monitoring of some workloads requires a local process. An example is a PowerShell script that runs on the local machine to connect to an application and collect or process data. You can use [Hybrid Runbook Worker](../../automation/automation-hybrid-runbook-worker.md), which is part of [Azure Automation](../../automation/automation-intro.md), to run a local PowerShell script. There's no direct charge for Hybrid Runbook Worker, but there is a cost for each runbook that it uses.

The runbook can access any resources on the local machine to gather required data. It can't send data directly to Azure Monitor or create an alert. To create an alert, have the runbook write an entry to a custom log and then configure that log to be collected by Azure Monitor. Create a log query alert rule that fires on that log entry.

## Synthetic transactions
A synthetic transaction connects to an application or service running on a machine to simulate a user connection or actual user traffic. If the application is available, you can assume that the machine is running properly. [Application insights](../app/app-insights-overview.md) in Azure Monitor provides this functionality. It only works for applications that are accessible from the internet. For internal applications, you must open a firewall to allow access from specific Microsoft URLs performing the test. Or you can use an alternate monitoring solution, such as System Center Operations Manager.

|Method | Description |
|:---|:---|
| [URL test](../app/monitor-web-app-availability.md) | Ensures that HTTP is available and returning a web page |
| [Multistep test](../app/availability-multistep.md) | Simulates a user session |

## SQL Server

Use [SQL Insights (preview)](/azure/azure-sql/database/sql-insights-overview) to monitor SQL Server running on your virtual machines.

## Next steps

* [Learn how to analyze data in Azure Monitor logs using log queries](../logs/get-started-queries.md)
* [Learn about alerts using metrics and logs in Azure Monitor](../alerts/alerts-overview.md)
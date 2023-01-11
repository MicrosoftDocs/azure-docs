---
title: 'Monitor virtual machines with Azure Monitor: Workloads'
description: Learn how to monitor the guest workloads of virtual machines in Azure Monitor.
ms.service: azure-monitor
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 01/10/2023
ms.reviewer: Xema Pathak

---

# Monitor virtual machines with Azure Monitor: Migrate management pack logic
This article is part of the guide [Monitor virtual machines and their workloads in Azure Monitor](monitor-virtual-machine.md). 
> [!NOTE]
> This guide describes how to implement complete monitoring of your Azure and hybrid virtual machine environment. To get started monitoring your first Azure virtual machine, see [Monitor Azure virtual machines](../../virtual-machines/monitor-vm.md) or [Tutorial: Collect guest logs and metrics from Azure virtual machine](tutorial-monitor-vm-guest.md). 

A significant number of customers who implement Azure Monitor currently monitor their virtual machine workloads by using management packs in System Center Operations Manager. There are no migration tools to convert assets from Operations Manager to Azure Monitor because the platforms are fundamentally different. Your migration instead constitutes a standard Azure Monitor implementation while you continue to use Operations Manager. As you customize Azure Monitor to meet your requirements for different applications and components and as it gains more features, then you can start to retire different management packs and agents in Operations Manager.

> [!NOTE]
> [Azure Monitor SCOM Managed Instance (preview)](scom-managed-instance-overview.md) is now in public preview. This allows you to move your existing SCOM environment into the Azure portal with Azure Monitor while continuing to use the same management packs. The rest of the recommendations in this article still apply as you migrate your monitoring logic into Azure Monitor.



## Convert management pack logic

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


## Monitor a service or daemon
To monitor the status of a Windows service or Linux daemon, enable the [Change Tracking and Inventory](../../automation/change-tracking/overview.md) solution in [Azure Automation](../../automation/automation-intro.md). 
Azure Monitor has no ability to monitor the status of a service or daemon. There are some possible methods to use, such as looking for events in the Windows event log, but this method is unreliable. You can also look for the process associated with the service running on the machine from the [VMProcess](/azure/azure-monitor/reference/tables/vmprocess) table populated by VM insights. This table only updates every hour, which isn't typically sufficient for alerting.

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
If you're using VM insights with Processes and dependencies collection enabled, you can use [VMConnection](/azure/azure-monitor/reference/tables/vmconnection) and [VMBoundPort](/azure/azure-monitor/reference/tables/vmboundport) to analyze connections and ports on the machine. The VMBoundPort table is updated every minute with each process running on the computer and the port it's listening on. You can create a log query alert similar to the missing heartbeat alert to find processes that have stopped or to alert when the machine isn't listening on a particular port.


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

## Next steps

* [Learn how to analyze data in Azure Monitor logs using log queries](../logs/get-started-queries.md)
* [Learn about alerts using metrics and logs in Azure Monitor](../alerts/alerts-overview.md)
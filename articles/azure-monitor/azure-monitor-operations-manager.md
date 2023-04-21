---
title: Migrate from SCOM to Azure Monitor
description: Guidance for existing users of Operations Manager to transition monitoring of certain workloads to Azure Monitor as part of a transition to the cloud.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 03/16/2023
ms.reviewer: bwren

---

# Migrate from SCOM to Azure Monitor
This article provides guidance for customers who currently use [System Center Operations Manager (SCOM)](/system-center/scom/welcome) and are planning a transition to cloud based monitoring with [Azure Monitor](overview.md) as they migrate business applications and other resources into Azure. 

There's no standard process for migrating from SCOM, and depending on your business and technical requirements, you may rely on SCOM management packs for an extending period of time as opposed to performing a quick migration. This article describes the different options available and decision criteria you can use to determine the best strategy for your particular environment.



## Hybrid cloud monitoring
Most customers will use a [hybrid cloud monitoring](/azure/cloud-adoption-framework/manage/monitor/cloud-models-monitor-overview#hybrid-cloud-monitoring) strategy that allows you to make a gradual transition to the cloud. Even though some features may overlap, this strategy will allow you to maintain your existing business processes as you become more familiar with the new platform. Only move away from Operations Manager functionality as you can replace it with Azure Monitor. Using multiple monitoring tools does add complexity, but it allows you to take advantage of Azure Monitor's ability to monitor next generation cloud workloads while retaining Operations Manager's ability to monitor server software and infrastructure components that may be on-premises or in other clouds. 

Your environment prior to moving any components into Azure is based on virtual and physical machines located on-premises or with a managed service provider. It relies on Operations Manager to monitor business applications, server software, and other infrastructure components in your environment such as physical servers and networks. You use standard management packs for server software such as IIS, SQL Server, and various vendor software, and you tune those management packs for your specific requirements. You create custom management packs for your business applications and other components that can't be monitored with existing management packs and configure Operations Manager to support your business processes.

As you move services into the cloud, Azure Monitor starts collecting [platform metrics]() and the [activity log]() for each of your resources, and you create [diagnostic settings]() to collect [resource logs]() to be collected so you can interactively analyze all available telemetry using [log queries]() and [insights]().

During this period of transition, you will have two independent monitoring tools. You'll use insights and workbooks to analyze your cloud telemetry in the Azure portal while still using the Operations console to analyze your data collected by SCOM. Since each system has its own alerting, you need to create action groups in Azure Monitor equivalent to your notification groups in SCOM.

The following table describes the different features and strategies that are available for a hybrid monitoring environment using Operations Manager and Azure Monitor.

| Method | Description |
|:---|:---|
| Dual-homed agents | SCOM uses the Microsoft Management Agent (MMA) which is the same as [Log Analytics agent]() used by Azure Monitor. You can configure this agent to have a single machine connect to both SCOM and Azure Monitor simultaneously. This does require that your Azure VMs have a connection to your on-premises management servers.<br><br>The [Log Analytics agent]() has been replaced with the [Azure Monitor agent]() which provides significant advantages including simpler management and better control over data collection. The two agents can coexist on the same machine allowing you to connect to both Azure Monitor and SCOM. |
| Connected management group | [Connect your SCOM management group to Azure Monitor](agents/om-agents.md) to forward data collected from your SCOM agents to Azure Monitor. This is similar to using dual-homed agents, but doesn't require each agent to be configured to connect to Azure Monitor.<br><br>This strategy requires the legacy agent, so you can't specify monitoring with data collection rules. You will also need the VM to connect directly to Azure Monitor to use VM insights. |
| SCOM Managed instance (preview) | SCOM managed instance is a full implementation of SCOM in Azure allowing you to continue running the same management packs that you run in your on-premises SCOM environment. There is no current integration between the data and alerts from SCOM and Azure Monitor, and you continue to use the same Operations console for analyzing your health and alerts.<br><br>This is similar to maintaining your existing SCOM environment, although you can consolidate your monitoring configuration in Azure and retire your on-premises components such as database and management servers. Agents from Azure VMs can connect to the SCOM managed instance in Azure rather than connecting to management servers in your own data center. |
|  Azure management packs | The [Azure management pack](https://www.microsoft.com/download/details.aspx?id=50013) allows Operations Manager to discover Azure resources and monitor their health based on a particular set of monitoring scenarios. This management pack does require you to perform additional configuration for each resource in Azure, but it may be helpful to provide some visibility of your Azure resources in the Operations Console until you evolve your business processes to focus on Azure Monitor. |

## Monitor business applications
You typically require custom management packs to monitor your business applications with Operations Manager, leveraging agents installed on each virtual machine. Application Insights in Azure Monitor monitors web-based applications whether they're in Azure, other clouds, or on-premises, so it can be used for all of your applications whether or not they've been migrated to Azure.

If your monitoring of a business application is limited to functionality provided by the [.NET app performance template](/system-center/scom/net-application-performance-monitoring-template) in Operations Manager, then you can most likely migrate to Application Insights with no loss of functionality. In fact, Application Insights will include a significant number of additional features including the following:

- Automatically discover and monitor application components.
- Collect detailed application usage and performance data such as response time, failure rates, and request rates.
- Collect browser data such as page views and load performance.
- Detect exceptions and drill into stack trace and related requests.
- Perform advanced analysis using features such as [distributed tracing](app/distributed-tracing-telemetry-correlation.md) and [smart detection](alerts/proactive-diagnostics.md).
- Use [metrics explorer](essentials/metrics-getting-started.md) to interactively analyze performance data.
- Use [log queries](logs/log-query-overview.md) to interactively analyze collected telemetry together with data collected for Azure services and VM insights.

There are certain scenarios though where you may need to continue using Operations Manager in addition to Application Insights until you're able to achieve required functionality. Examples where you may need to continue with Operations Manager include the following:

-  [Availability tests](/previous-versions/azure/azure-monitor/app/monitor-web-app-availability), which allow you to monitor and alert on the availability and responsiveness of your applications require incoming requests from the IP addresses of web test agents. If your policy won't allow such access, you may need to keep using [Web Application Availability Monitors](/system-center/scom/web-application-availability-monitoring-template) in Operations Manager.
- In Operations Manager you can set any polling interval for availability tests, with many customers checking every 60-120 seconds. Application Insights has a minimum polling interval of 5 minutes which may be too long for some customers.
- A significant amount of monitoring in Operations Manager is performed by collecting events generated by applications and by running scripts on the local agent. These aren't standard options in Application Insights, so you could require custom work to achieve your business requirements. This might include custom alert rules using event data stored in a Log Analytics workspace and scripts launched in a virtual machines guest using [hybrid runbook worker](../automation/automation-hybrid-runbook-worker.md).
- Depending on the language that your application is written in, you may be limited in the [instrumentation you can use with Application Insights](app/app-insights-overview.md#supported-languages).

Following the basic strategy in the other sections of this guide, continue to use Operations Manager for your business applications, but take advantage of additional features provided by Application Insights. As you're able to replace critical functionality with Azure Monitor, you can start to retire your custom management packs.



## Monitor virtual machines

Monitoring the software on your machines in a hybrid environment will often use a combination of Azure Monitor and Operations Manager, depending on the requirements of each machine and on your maturity developing operational processes around Azure Monitor. While Azure Monitor provides a complete solution for monitoring your cloud resources, management packs in SCOM provide unique monitoring for particular VM workloads. Continue to use management packs for functionality that cannot be provided by other features in Azure Monitor. This includes management packs for critical server software like IIS, SQL Server, or Exchange. You may also have custom management packs developed for on-premises infrastructure that can't be reached with Azure Monitor. Also continue to use Operations Manager if it is tightly integrated into your operational processes until you can transition to modernizing your service operations where Azure Monitor and other Azure services can augment or replace. Use Azure Monitor to enhance your current monitoring even if it doesn't immediately replace Operations Manager.

As soon as a virtual machine is created in Azure, [platform metrics]() and [activity logs]() for the VM host automatically start being collected. Enable [VM insights]() to install the Azure Monitor agent and begin collecting common performance data from the client operating system. This may overlap with some data that you're already collecting in SCOM, but it will allow you to start viewing trends over time and monitor your Azure VMs with other cloud resources. You may also choose to enable the [map feature]() which will give you insight into the processes running on your virtual machines and their dependencies on other services.

In addition to Azure virtual machines, Azure Monitor can monitor machines on-premises and in other clouds using [Azure Arc-enabled servers](../azure-arc/servers/overview.md). Azure Arc-enabled servers allow you to manage your Windows and Linux machines hosted outside of Azure, on your corporate network, or other cloud provider consistent with how you manage native Azure virtual machines.

> [!NOTE]
> If you enable VM Insights with the Log Analytics agent instead of the Azure Monitor agent, then no additional agent needs to be installed on the VM. Azure Monitor agent is recommended though because of its significant improvements in monitoring the VM in the cloud. The complexity from maintaining multiple agents is offset by the ability to define monitoring in data collection rules which allow you to configure different data collection for different sets of VMs, similar to your strategy for designing management packs.



## Migrate management pack logic
There are no migration tools to convert SCOM management packs to Azure Monitor because they're logic is fundamentally different than Azure Monitor data collection. Migrating your logic instead constitutes a standard Azure Monitor implementation while you continue to use SCOM. As you customize Azure Monitor to meet your requirements for different applications and components and as it gains more features, then you can start to retire different management packs and agents in Operations Manager.

Management packs in SCOM contain rules and monitors that combine collection of data and the resulting alert into a single end-to-end workflow. Data that's already been collected by SCOM is rarely used for alerting. Azure Monitor separates data collection and alerts into separate processes. Alert rules access data from Azure Monitor Logs and Azure Monitor Metrics that has already been collected from agents. Also, rules and monitors are typically narrowly focused on very specific data such as a particular event or performance counter. Data collection rules in Azure Monitor are typically more broad collecting multiple sets of events and performance counters in a single DCR.

- Data that you need to collect to support alerting, analysis, and visualization. See [Monitor virtual machines with Azure Monitor: Data collection](vm/monitor-virtual-machine-data-collection.md)
- Alerts rules that analyze the collected data to proactively notify of you of issues. See [Monitor virtual machines with Azure Monitor: Alerts](vm/monitor-virtual-machine-alerts.md)

### Identify critical management pack logic

Instead of attempting to replicate the entire functionality of a management pack, analyze the critical monitoring that each provides. Decide whether you can replicate those monitoring requirements by using the methods described in the previous sections. In many cases, you can configure data collection and alert rules in Azure Monitor that replicate enough functionality that you can retire a particular management pack. Management packs can often include hundreds and even thousands of rules and monitors.

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

### Synthetic transactions
Management packs often make use of synthetic transactions that connect to an application or service running on a machine to simulate a user connection or actual user traffic. If the application is available, you can assume that the machine is running properly. [Application Insights availability tests](app/availability-overview.md) in Azure Monitor provides this functionality. It only works for applications that are accessible from the internet. For internal applications, you must open a firewall to allow access from specific Microsoft URLs performing the test. Or you can continue to use your existing management pack.

## Next steps

- See the [Cloud Monitoring Guide](/azure/cloud-adoption-framework/manage/monitor/) for a detailed comparison of Azure Monitor and System Center Operations Manager and more details on designing and implementing a hybrid monitoring environment.
- Read more about [monitoring Azure resources in Azure Monitor](essentials/monitor-azure-resource.md).
- Read more about [monitoring Azure virtual machines in Azure Monitor](vm/monitor-vm-azure.md).
- Read more about [VM insights](vm/vminsights-overview.md).
- Read more about [Application Insights](app/app-insights-overview.md).


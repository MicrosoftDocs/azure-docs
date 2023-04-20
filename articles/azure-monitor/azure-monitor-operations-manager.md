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

> [!IMPORTANT]
> There is a cost to implementing several Azure Monitor features described here, so you should evaluate their value before deploying across your entire environment. See [Cost optimization and Azure Monitor](best-practices-cost.md) for strategies for reducing your cost for Azure Monitor.



## On-premises SCOM
Your environment prior to moving any components into Azure is based on virtual and physical machines located on-premises or with a managed service provider. It relies on Operations Manager to monitor business applications, server software, and other infrastructure components in your environment such as physical servers and networks. You use standard management packs for server software such as IIS, SQL Server, and various vendor software, and you tune those management packs for your specific requirements. You create custom management packs for your business applications and other components that can't be monitored with existing management packs and configure Operations Manager to support your business processes.

Your migration to Azure typically starts with IaaS, moving virtual machines supporting business applications into Azure. The monitoring requirements for these applications and the server software they depend on don't change, so you can continue using Operations Manager on these servers with your existing management packs. This does require that you allow your agents in the cloud to access your on-premises management servers.


## Existing integration with SCOM
There are multiple ways to combine your SCOM and Azure Monitor environments.

| Method | Description |
|:---|:---|
| Dual-homed agents | SCOM uses the Microsoft Management Agent (MMA) which is the same as [Log Analytics agent]() used by Azure Monitor. You can configure this agent to connect to both SCOM and Azure Monitor simultaneously. This does require that your agents have a connection to your on-premises management servers. The Log Analytics agent has been replaced with the [Azure Monitor agent]() which provides significant advantages including simpler management and better control over data collection. The two agents can coexist on the same machine allowing you to connect to both systems. |
| Connected management group | [Connect your SCOM management group to Azure Monitor](agents/om-agents.md) to forward data collected from your agents to Azure Monitor. This allows you to send client data from your VMs to Azure Monitor while still allowing them to be monitored by SCOM, but it requires the legacy agent, so you can't specify monitoring with data collection rules. |
| SCOM Managed instance | SCOM managed instance is a full implementation of SCOM in Azure allowing you to continue running the same management packs that you run in your on-premises SCOM environment. There is no current integration between the data and alerts from SCOM and Azure Monitor, and you continue to use the same Operations console for analyzing your health and alerts. This allows you to consolidate your monitoring environment in the Azure cloud though, and agents can connect to the SCOM managed instance in Azure rather than connecting to management servers in your own data center. |
|  Azure management packs | The [Azure management pack](https://www.microsoft.com/download/details.aspx?id=50013) allows Operations Manager to discover Azure resources and monitor their health based on a particular set of monitoring scenarios. This management pack does require you to perform additional configuration for each resource in Azure, but it may be helpful to provide some visibility of your Azure resources in the Operations Console until you evolve your business processes to focus on Azure Monitor. |



## Enable VM monitoring
As soon as a virtual machine is created in Azure, [platform metrics]() and [activity logs]() for the VM host automatically start being collected, but you need to enable VM insights to install the Azure Monitor agent and start collecting data from the client. Even though SCOM is collecting similar data, this will allow you to start migrating your monitoring logic to Azure Monitor. VM insights will collect common performance counters for the client operating system and allow to start viewing trends over time. You may also choose to enable the [map feature]() which will give you insight into the processes running on your virtual machines and their dependencies on other services.

This allows you to continue with the same SCOM monitoring that you've been relying on while gaining additional insights provided by Azure Monitor.

> [!NOTE]
> If you enable VM Insights with the Log Analytics agent instead of the Azure Monitor agent, then no additional agent needs to be installed on the VM. Azure Monitor agent is recommended though because of its significant improvements in monitoring the VM in the cloud. The complexity from maintaining multiple agents is offset by the ability to define monitoring in data collection rules which allow you to configure different data collection for different sets of VMs, similar to your strategy for designing management packs.


## Migrate to SCOM Managed instance
[Azure Monitor SCOM Managed Instance (preview)](vm/scom-managed-instance-overview.md) allows you to consolidate all of your monitoring into Azure, moving your existing SCOM environment into the cloud without any changes to your management packs. The only change required for your agents is to connect them to SCOM MI instead of your on-premises management server.

See [Migrate from Operations Manager on-premises to Azure Monitor SCOM Managed Instance (preview)](https://learn.microsoft.com/en-us/system-center/scom/migrate-to-operations-manager-managed-instance?view=sc-om-2022&tabs=mp-overrides) for the detailed steps on migration to SCOM Managed Instance.


## Migrate workloads






## Azure Monitor for cloud components
When you first start your migration into the cloud, use Azure Monitor to monitor your cloud components. This includes creating diagnostic settings to collect resource logs from your Azure components and enabling features such as Container insights for your Kubernetes clusters and XXX.

Use Azure Arc for hybrid resources either on-premises or in other clouds.

During this phase, continue to use your existing SCOM environment to monitor the workloads running on your virtual machines. Even as you migrate your machines into Azure, the MMA running on them can connect to your existing SCOM environment and continue running the same management packs.


## Azure Monitor for virtual machine host

Continue using your on-premises SCOM environment to monitor the workloads on your virtual machines, but enable Azure Monitor to monitor your virtual machine hosts. Platform metrics and activity log will start collecting as soon as the virtual machines are collected.

Enable VM insights to install the 




## Components to monitor
It helps to categorize the different types of workloads that you need to monitor in order to determine a distinct monitoring strategy for each. [Cloud monitoring guide: Formulate a monitoring strategy](/azure/cloud-adoption-framework/strategy/monitoring-strategy#high-level-modeling) provides a detailed breakdown of the different layers in your environment that need monitoring as you progress from legacy enterprise applications to modern applications in the cloud.

Before the cloud, you used Operations Manager to monitor all layers. As you start your transition with Infrastructure as a Service (IaaS), you continue to use Operations Manager for your virtual machines but start to use Azure Monitor for your cloud resources. As you further transition to modern applications using Platform as a Service (PaaS), you can focus more on Azure Monitor and start to retire Operations Manager functionality.

:::image type="content" source="media/azure-monitor-operations-manager/cloud-models.png" alt-text="Diagram showing different cloud models: on-premises, infrastructure as a service (IaaS), platform as a service (PaaS), and software as a service (SaaS).":::

These layers can be simplified into the following categories. While every monitoring workload in your environment may not fit neatly into one of these categories, each should be close enough to a particular category for the general recommendations to apply.

**Business applications.** Applications that provide functionality specific to your business. They may be internal or external and are often developed internally using custom code. Your legacy applications will typically be hosted on virtual or physical machines running either Windows or Linux, while your newer applications will be based on application services in Azure such as Azure Web Apps and Azure Functions.

**Azure services.** Resources in Azure that support your business applications that have migrated to the cloud. This includes services such as Azure Storage, Azure SQL, and Azure IoT. This also includes Azure virtual machines since they are monitored like other Azure services, but the applications and software running on the guest operating system of those virtual machines require more  monitoring beyond the host.

**Server software.** Software running on virtual and physical machines that support your business applications or packaged applications that provide general functionality to your business. Examples include Internet Information Server (IIS), SQL Server, Exchange, and SharePoint. This also includes the Windows or Linux operating system on your virtual and physical machines.

**Local infrastructure.** Components specific to your on-premises environment that require monitoring. This includes such resources as physical servers, storage, and network components. These are the components that are virtualized when you move to the cloud.





## Monitor server software and local infrastructure
When you move machines to the cloud, the monitoring requirements for their software don't change. You no longer need to monitor their physical components since they're virtualized, but the guest operating system and its workloads have the same requirements regardless of their environment.

The [Azure Monitor agent](agents/agents-overview.md) uses [data collection rules](essentials/data-collection-rule-overview.md) to collect data from the guest operating system of virtual machines. This is the same performance and event data typically used by management packs for analysis and alerting. [VM insights](vm/vminsights-overview.md) allows you to easily deploy and manage the agent and gets you started with preexisting data collection rules and performance views. 

> [!NOTE]
> Azure Monitor previously used the same Microsoft Management Agent (referred to as the Log Analytics agent in Azure Monitor) as Operations Manager. The Azure Monitor agent can coexist with this agent on the same machine during migration.


[![VM insights performance](media/azure-monitor-operations-manager/vm-insights-performance.png)](media/azure-monitor-operations-manager/vm-insights-performance.png#lightbox)


Examples of features unique to Azure Monitor include the following:

- Discover and monitor relationships between virtual machines and their external dependencies.
- View aggregated performance data across multiple virtual machines in interactive charts and workbooks.
- Use [log queries](logs/log-query-overview.md) to interactively analyze telemetry from your virtual machines with data from your other Azure resources.
- Create [log alert rules](alerts/alerts-log-query.md) based on complex logic across multiple virtual machines.

In addition to Azure virtual machines, Azure Monitor can monitor machines on-premises and in other clouds using [Azure Arc-enabled servers](../azure-arc/servers/overview.md). Azure Arc-enabled servers allow you to manage your Windows and Linux machines hosted outside of Azure, on your corporate network, or other cloud provider consistent with how you manage native Azure virtual machines.

[![VM insights map](media/azure-monitor-operations-manager/vm-insights-map.png)](media/azure-monitor-operations-manager/vm-insights-map.png#lightbox)



Azure Monitor though doesn't have preexisting rules to identify and alert on issues for the business applications and server software running in your virtual machines. You must create your own alert rules to be proactively notified of any detected issues.


Azure Monitor also doesn't measure the health of different applications and services running on a virtual machine. Metric alerts can automatically resolve when a value drops below a threshold, but Azure Monitor doesn't currently have the ability to define health criteria for applications and services running on the machine, nor does it provide health rollup to group the health of related components.

Monitoring the software on your machines in a hybrid environment will often use a combination of Azure Monitor and Operations Manager, depending on the requirements of each machine and on your maturity developing operational processes around Azure Monitor. 

Continue to use Operations Manager for functionality that cannot yet be provided by Azure Monitor. This includes management packs for critical server software like IIS, SQL Server, or Exchange. You may also have custom management packs developed for on-premises infrastructure that can't be reached with Azure Monitor. Also continue to use Operations Manager if it is tightly integrated into your operational processes until you can transition to modernizing your service operations where Azure Monitor and other Azure services can augment or replace. Use Azure Monitor to enhance your current monitoring even if it doesn't immediately replace Operations Manager. 


## Monitor business applications
You typically require custom management packs to monitor your business applications with Operations Manager, leveraging agents installed on each virtual machine. Application Insights in Azure Monitor monitors web-based applications whether they're in Azure, other clouds, or on-premises, so it can be used for all of your applications whether or not they've been migrated to Azure.

If your monitoring of a business application is limited to functionality provided by the [.NET app performance template](https://learn.microsoft.com/en-us/system-center/scom/net-application-performance-monitoring-template) in Operations Manager, then you can most likely migrate to Application Insights with no loss of functionality. In fact, Application Insights will include a significant number of additional features including the following:

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


## Migrate management pack logic
There are no migration tools to convert SCOM management packs to Azure Monitor because they're logic is fundamentally different than Azure Monitor data collection. Migrating your logic instead constitutes a standard Azure Monitor implementation while you continue to use SCOM. As you customize Azure Monitor to meet your requirements for different applications and components and as it gains more features, then you can start to retire different management packs and agents in Operations Manager.

Management packs in SCOM contain rules and monitors that combine collection of data and the resulting alert into a single end-to-end workflow. Data that's already been collected by SCOM is rarely used for alerting. Azure Monitor separates data collection and alerts into separate processes. Alert rules access data from Azure Monitor Logs and Azure Monitor Metrics that has already been collected from agents. Also, rules and monitors are typically narrowly focused on very specific data such as a particular event or performance counter. Data collection rules in Azure Monitor are typically more broad collecting multiple sets of events and performance counters in a single DCR.

- Data that you need to collect to support alerting, analysis, and visualization. See [Monitor virtual machines with Azure Monitor: Data collection](monitor-virtual-machine-data-collection.md)
- Alerts rules that analyze the collected data to proactively notify of you of issues. See [Monitor virtual machines with Azure Monitor: Alerts](monitor-virtual-machine-alerts.md)

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
Management packs often make use of synthetic transactions that connect to an application or service running on a machine to simulate a user connection or actual user traffic. If the application is available, you can assume that the machine is running properly. [Application Insights availability tests](../app/availability-overview.md) in Azure Monitor provides this functionality. It only works for applications that are accessible from the internet. For internal applications, you must open a firewall to allow access from specific Microsoft URLs performing the test. Or you can continue to use your existing management pack.

## Next steps

- See the [Cloud Monitoring Guide](/azure/cloud-adoption-framework/manage/monitor/) for a detailed comparison of Azure Monitor and System Center Operations Manager and more details on designing and implementing a hybrid monitoring environment.
- Read more about [monitoring Azure resources in Azure Monitor](essentials/monitor-azure-resource.md).
- Read more about [monitoring Azure virtual machines in Azure Monitor](vm/monitor-vm-azure.md).
- Read more about [VM insights](vm/vminsights-overview.md).
- Read more about [Application Insights](app/app-insights-overview.md).



## Sample walkthrough
The following is a hypothetical walkthrough of a migration from Operations Manager to Azure Monitor. This is not intended to represent the full complexity of an actual migration, but it does at least provide the basic steps and sequence. The sections below describe each of these steps in more detail.

Your environment prior to moving any components into Azure is based on virtual and physical machines located on-premises or with a managed service provider. It relies on Operations Manager to monitor business applications, server software, and other infrastructure components in your environment such as physical servers and networks. You use standard management packs for server software such as IIS, SQL Server, and various vendor software, and you tune those management packs for your specific requirements. You create custom management packs for your business applications and other components that can't be monitored with existing management packs and configure Operations Manager to support your business processes.

Your migration to Azure starts with IaaS, moving virtual machines supporting business applications into Azure. The monitoring requirements for these applications and the server software they depend on don't change, and you continue using Operations Manager on these servers with your existing management packs. 

Azure Monitor is enabled for your Azure services as soon as you create an Azure subscription. It automatically collects platform metrics and the Activity log, and you configure resource logs to be collected so you can interactively analyze all available telemetry using log queries. You enable VM insights on your virtual machines to analyze monitoring data across your entire environment together and to discover relationships between machines and processes. You extend your use of Azure Monitor to your on-premises physical and virtual machines by enabling Azure Arc-enabled servers on them. 

You enable Application Insights for each of your business applications. It identifies the different components of each application, begins to collect usage and performance data, and identifies any errors that occur in the code. You create availability tests to proactively test your external applications and alert you to any performance or availability problems. While Application Insights gives you powerful features that you don't have in Operations Manager, you continue to rely on custom management packs that you developed for your business applications since they include monitoring scenarios not yet covered by Azure Monitor. 

As you gain familiarity with Azure Monitor, you start to create alert rules that are able to replace some management pack functionality and start to evolve your business processes to use the new monitoring platform. This allows you to start removing machines and management packs from the Operations Manager management group. You continue to use management packs for critical server software and on-premises infrastructure but continue to watch for new features in Azure Monitor that will allow you to retire additional functionality.
---
title: Common questions - discovery, assessment, and dependency analysis in Azure Migrate
description: Get answers to common questions about discovery, assessment, and dependency analysis in Azure Migrate.
ms.topic: conceptual
ms.date: 02/17/2020

---

# Common questions about discovery, assessment, and dependency analysis

This article answers common questions about discovery, assessment, and dependency analysis in Azure Migrate. If you have other questions, review these articles:

- [General questions](resources-faq.md) about Azure Migrate.
- [Questions](common-questions-appliance.md) about the Azure Migrate appliance.
- [Questions](common-questions-server-migration.md) about server migration.
- Post questions on the [Azure Migrate forum](https://aka.ms/AzureMigrateForum)



## How many VMs can I discover with an appliance?

You can discover up to 10,000 VMware VMs, up to 5,000 Hyper-V VMs, and up to 250 physical servers with a single appliance. If you have more machines, review articles about scaling [Hyper-V](scale-hyper-v-assessment.md), [VMware](scale-vmware-assessment.md), and [physical server](scale-physical-assessment.md) assessment.



## VM size changed. Can I run an assessment again?

The Azure Migrate appliance continuously collects information about on-premises machines, and an assessment is a point-in-time snapshot. If you change the settings on a VM that you want to assess, use the recalculate option to update the assessment with the latest changes.

## How do I discover VMs in a multitenant environment?

- **VMware**: If an environment is shared across tenants, and you don't want to discover a tenant's VMs in another tenant's subscription, create vCenter Server credentials that can access only the VMs you want to discover. Then, use those credentials when you start discovery in the Azure Migrate appliance.
- **Hyper-v**: Discovery uses Hyper-V host credentials. If VMs share the same Hyper-V host, there's currently no way to separate the discovery.  


## Do I need vCenter Server?

Yes, Azure Migrate needs vCenter Server to perform discovery in a VMware environment. It doesn't support discovery of ESXi hosts that aren't managed by vCenter Server.


## What's are the sizing options?

With as-on-premises sizing, Azure Migrate doesn't consider VM performance data for assessment. It assesses VM sizes based on the on-premises configuration. With performance-based sizing, sizing is based on utilization data.

- For example, if an on-premises VM has 4 cores and 8 GB of memory at 50% CPU utilization and 50% memory utilization:
    - As-on-premises sizing will recommend an Azure VM SKU that has four cores and 8 GB of memory.
    - Performance-based sizing will recommend a VM SKU that has two cores and 4 GB of memory, because the utilization percentage is considered.

- Similarly, disk sizing depends on sizing criteria and storage type.
    - If the sizing criteria is performance-based and the storage type is automatic, Azure Migrate takes the IOPS and throughput values of the disk into account when it identifies the target disk type (standard or premium).
    - If the sizing criteria is performance-based and the storage type is premium, Azure Migrate recommends a premium disk SKU, based on the size of the on-premises disk. The same logic is applied to disk sizing, when the sizing is as-on-premises, and the storage type is standard or premium.

## Does performance history/utilization impact sizing?

These properties are only applicable for performance-based sizing.

- Azure Migrate collects the performance history of on-premises machines, and uses it to recommend the VM size and disk type in Azure.
- The appliance continuously profiles the on-premises environment, to gather real-time utilization data every 20 seconds.
- The appliance rolls up the 20-second samples and creates a single data point every 15 minutes.
- To create the data point, the appliance selects the peak value from all the 20-second samples.
- The appliance sends this data point to Azure.

When you create an assessment in Azure, based on performance duration and performance history percentile value, Azure Migrate calculates the effective utilization value, and uses it for sizing.

- For example, if you set the performance duration to one day and the percentile value to 95 percentile, Azure Migrate sorts the 15-minute sample points sent by collector for the past day in ascending order, and picks the 95th percentile value as the effective utilization.
- Using the 95th percentile value ensures outliers are ignored. Outliers could be included if you use the 99th percentile. If you want to pick the peak usage for the period, without missing any outliers, select the 99th percentile.

## What is dependency visualization?

Use dependency visualization to assess groups of VMs for migration with greater confidence. Dependency visualization cross-checks machine dependencies before you run an assessment. It helps ensure that nothing is left behind, and thus helps to avoid unexpected outages when you migrate to Azure. Azure Migrate uses the Service Map solution in Azure Monitor to enable dependency visualization. [learn more](concepts-dependency-visualization.md).

> [!NOTE]
> Dependency visualization isn't available in Azure Government.

## What's the difference between agent-based and agentless?

The differences between agentless visualization and agent-based visualization are summarized in the table.

**Requirement** | **Agentless** | **Agent-based**
--- | --- | ---
Support | This option is currently in preview, and is only available for VMware VMs. [Review](migrate-support-matrix-vmware.md#agentless-dependency-visualization) supported operating systems. | In general availability (GA).
Agent | No need to install agents on machines you want to cross-check. | Agents to be installed on each on-premises machine that you want to analyze: The [Microsoft Monitoring agent (MMA)](https://docs.microsoft.com/azure/log-analytics/log-analytics-agent-windows), and the [Dependency agent](https://docs.microsoft.com/azure/azure-monitor/platform/agents-overview#dependency-agent). 
Prerequisites | [Review](concepts-dependency-visualization.md#agentless-visualization) the prerequisites and deployment requirements. | [Review](concepts-dependency-visualization.md#agent-based-visualization) the prerequisites and deployment requirements.
Log Analytics | Not required. | Azure Migrate uses the [Service Map](https://docs.microsoft.com/azure/operations-management-suite/operations-management-suite-service-map) solution in [Azure Monitor logs](https://docs.microsoft.com/azure/log-analytics/log-analytics-overview) for dependency visualization. [Learn more](concepts-dependency-visualization.md#agent-based-visualization).
How it works | Captures TCP connection data on machines enabled for dependency visualization. After discovery, it gathers data at intervals of five minutes. | Service Map agents installed on a machine gather data about TCP processes and inbound/outbound connections for each process.
Data | Source machine server name, process, application name.<br/><br/> Destination machine server name, process, application name, and port. | Source machine server name, process, application name.<br/><br/> Destination machine server name, process, application name, and port.<br/><br/> Number of connections, latency, and data transfer information are gathered and available for Log Analytics queries. 
Visualization | Dependency map of single server can be viewed over a duration of one hour to 30 days. | Dependency map of a single server.<br/><br/> Map can be viewed over an hour only.<br/><br/> Dependency map of a group of servers.<br/><br/> Add and remove servers in a group from the map view.
Data export | Can't currently be downloaded in tabular format. | Data can be queried with Log Analytics.




## Do I pay for dependency visualization?
No. [Learn more](https://azure.microsoft.com/pricing/details/azure-migrate/) about Azure Migrate pricing.

## What do I install for agent-based dependency visualization?

To use agent-based dependency visualization, you need to download and install agents on each on-premises machine that you want to evaluate.

Install the following agents on each machine:
- [Microsoft Monitoring Agent (MMA)](https://docs.microsoft.com/azure/log-analytics/log-analytics-agent-windows).
- [Dependency agent](../azure-monitor/platform/agents-overview.md#dependency-agent).
- If you have machines with no internet connectivity, you need to download and install Log Analytics gateway on them.

You don't need these agents unless you're using agent-based dependency visualization.

## Can I use an existing workspace?

Yes, for agent-based dependency visualization you can attach an existing workspace to the migration project and use it for dependency visualization. 

## Can I export the dependency visualization report?

No, the dependency visualization report in agent-based visualization can't be exported. However, Azure Migrate uses Service Map, and you can use the [Service Map REST API](https://docs.microsoft.com/rest/api/servicemap/machines/listconnections) to retrieve the dependencies in JSON format.

## Can I automate agent installation?
For agent-based dependency visualization, automate as follows:

- Use this [script to install the Dependency agent](../azure-monitor/insights/vminsights-enable-hybrid-cloud.md#installation-script-examples).
- For MMA, follow these [instructions](../azure-monitor/platform/log-analytics-agent.md#installation-and-configuration) to use the command line or automation, or use [this script](https://gallery.technet.microsoft.com/scriptcenter/Install-OMS-Agent-with-2c9c99ab).
- In addition to scripts, you can also use deployment tools like Microsoft Endpoint Configuration Manager and [Intigua](https://www.intigua.com/getting-started-intigua-for-azure-migration) to deploy the agents.


## What operating systems does MMA support?

- View the list of [Windows operating systems supported by MMA](https://docs.microsoft.com/azure/log-analytics/log-analytics-concept-hybrid#supported-windows-operating-systems).
- View the list of [Linux operating systems supported by MMA](https://docs.microsoft.com/azure/log-analytics/log-analytics-concept-hybrid#supported-linux-operating-systems).

## Can I visualize dependencies for more than an hour?
For agent-based visualization, you can visualize dependencies for up to an hour. You can go back to a particular date in history, as far back as a month, but the maximum duration for visualization is an hour. For example, you can use the time duration in the dependency map to view dependencies for yesterday, but you can view dependencies for a one-hour window only. However, you can use Azure Monitor logs to [query dependency data](https://docs.microsoft.com/azure/migrate/how-to-create-group-machine-dependencies) over a longer duration.

For agentless visualization, you can view the dependency map of a single server from a duration of one hour to 30 days.


## Can visualize dependencies for groups of more than 10 VMs?
You can [visualize dependencies](https://docs.microsoft.com/azure/migrate/how-to-create-group-dependencies) for groups containing up to 10 VMs. If you have a group with more than 10 VMs, we recommend that you split the group into smaller groups, and then visualize the dependencies.




## Next steps
Read the [Azure Migrate overview](migrate-services-overview.md).

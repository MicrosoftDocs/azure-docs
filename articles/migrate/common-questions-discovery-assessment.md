---
title: Common questions - discovery, assessment, and dependency analysis in Azure Migrate
description: Get answers to common questions about discovery, assessment, and dependency analysis in Azure Migrate.
ms.topic: conceptual
ms.date: 12/29/2019

---

# Common questions about discovery, assessment, and dependency analysis

This article answers common questions about discovery, assessment, and dependency analysis in Azure Migrate. If you have further queries after reading this article, post them on the [Azure Migrate forum](https://aka.ms/AzureMigrateForum). If you have other questions, review these articles:

- [General questions](resources-faq.md) about Azure Migrate.
- [Questions](common-questions-appliance.md) about the Azure Migrate appliance.


## How many VMs can I discover with an appliance?

You can discover up to 10,000 VMware VMs, up to 5,000 Hyper-V VMs and up to 250 servers with a single appliance. If you have more machines in your on-premises environment, read about scaling [Hyper-V](scale-hyper-v-assessment.md), [VMware](scale-vmware-assessment.md) and [physical](scale-physical-assessment.md) assessment.



## VM size changed. Can I run an assessment again?

The Azure Migrate appliance continuously collects information about the on-premises environment. But an assessment is a point-in-time snapshot of on-premises VMs. If you change the settings on a VM that you want to assess, use the recalculate option to update the assessment with the latest changes.

### How do I discover VMs in a multitenant environment?

- For VMware, if your environment is shared across tenants, and you don't want to discover the VMs of one tenant in another tenant's subscription, create vCenter Server credentials that can access only the VMs you want to discover. Then, use those credentials when you start discovery in the Azure Migrate appliance.
- For Hyper-V, discovery uses Hyper-V host credentials. If VMs share the same Hyper-V host, there's currently no way to separate the discovery.  


### Do I need vCenter Server for VMWare VM discovery?

Yes, Azure Migrate needs vCenter Server to perform discovery in a VMware environment. It doesn't support discovery of ESXi hosts that aren't managed by vCenter Server.


## What's the difference sizing options?

With as-on-premises sizing, Azure Migrate doesn't consider VM performance data for assessment. It assesses VM sizes based on the on-premises configuration. With performance-based sizing, sizing is based on utilization data.

- For example, if an on-premises VM has 4 cores and 8 GB of memory at 50% CPU utilization and 50% memory utilization, the following will occur:
    - As-on-premises sizing will recommend an Azure VM SKU that has 4 cores and 8 GB of memory.
    - Performance-based sizing will recommend a VM SKU that has 2 cores and 4 GB of memory, because the utilization percentage is considered.

- Similarly, disk sizing depends on two assessment properties: sizing criteria and storage type.
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

## Do I pay for dependency visualization?
No. [Learn more](https://azure.microsoft.com/pricing/details/azure-migrate/) about Azure Migrate pricing.

## What do I install for dependency visualization?

To use dependency visualization, you need to download and install agents on each on-premises machine that you want to evaluate.

You need to install the following agents on each machine:
- [Microsoft Monitoring Agent (MMA)](https://docs.microsoft.com/azure/log-analytics/log-analytics-agent-windows).
- [Dependency agent](../azure-monitor/platform/agents-overview.md#dependency-agent).
- If you have machines with no internet connectivity, you need to download and install Log Analytics gateway on them.

You don't need these agents unless you're using dependency visualization.

## Can I use an existing workspace?

Yes, you can attach an existing workspace to the migration project and use it for dependency visualization. [Learn more](concepts-dependency-visualization.md#how-does-it-work).

## Can I export the dependency visualization report?

No, the dependency visualization can't be exported. However, Azure Migrate uses Service Map, and you can use the [Service Map REST API](https://docs.microsoft.com/rest/api/servicemap/machines/listconnections) to retrieve the dependencies in JSON format.

## Can I automate  MMA/Dependency agent installation?

Use this [script to install the Dependency agent](../azure-monitor/insights/vminsights-enable-hybrid-cloud.md#installation-script-examples). Follow these [instructions to install MMA](https://docs.microsoft.com/azure/azure-monitor/platform/log-analytics-agent#install-and-configure-agent) by using the command line or automation. For
MMA, use [this script](https://gallery.technet.microsoft.com/scriptcenter/Install-OMS-Agent-with-2c9c99ab).

In addition to scripts, you can also use deployment tools like System Center Configuration Manager and [Intigua](https://www.intigua.com/getting-started-intigua-for-azure-migration) to deploy the agents.


## What operating systems does MMA support?

- View the list of [Windows operating systems supported by MMA](https://docs.microsoft.com/azure/log-analytics/log-analytics-concept-hybrid#supported-windows-operating-systems).
- View the list of [Linux operating systems supported by MMA](https://docs.microsoft.com/azure/log-analytics/log-analytics-concept-hybrid#supported-linux-operating-systems).

## Can I visualize dependencies for more than an hour?
No. You can visualize dependencies for up to an hour. You can go back to a particular date in history, as far back as a month, but the maximum duration for visualization is an hour. For example, you can use the time duration in the dependency map to view dependencies for yesterday, but you can view dependencies for a one-hour window only. However, you can use Azure Monitor logs to [query dependency data](https://docs.microsoft.com/azure/migrate/how-to-create-group-machine-dependencies) over a longer duration.

## Can visualize dependencies for groups of more than 10 VMs?
You can [visualize dependencies](https://docs.microsoft.com/azure/migrate/how-to-create-group-dependencies) for groups containing up to 10 VMs. If you have a group with more than 10 VMs, we recommend that you split the group into smaller groups, and then visualize the dependencies.




## Next steps
Read the [Azure Migrate overview](migrate-services-overview.md).

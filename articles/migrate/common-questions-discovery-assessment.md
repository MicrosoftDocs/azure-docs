---
title: Common questions - Discovery, assessment, and dependency analysis in Azure Migrate
description: Get answers to common questions about discovery, assessment, and dependency analysis in Azure Migrate.
ms.topic: conceptual
ms.date: 02/17/2020

---

# Common questions about discovery, assessment, and dependency analysis

This article answers common questions about discovery, assessment, and dependency analysis in Azure Migrate. If you have other questions, check these resources:

- [General questions](resources-faq.md) about Azure Migrate
- Questions about the [Azure Migrate appliance](common-questions-appliance.md)
- Questions about [server migration](common-questions-server-migration.md)
- Get questions answered in the [Azure Migrate forum](https://aka.ms/AzureMigrateForum)

## How many VMs can I discover with an appliance?

You can discover up to 10,000 VMware VMs, up to 5,000 Hyper-V VMs, and up to 250 physical servers with a single appliance. If you have more machines in your on-premises environment, read about [scaling a Hyper-V assessment](scale-hyper-v-assessment.md), [scaling a VMware assessment](scale-vmware-assessment.md), and [scaling a physical server assessment](scale-physical-assessment.md).

## The size of my VM changed. Can I run an assessment again?

The Azure Migrate appliance continuously collects information about the on-premises environment.  An assessment is a point-in-time snapshot of on-premises VMs. If you change the settings on a VM that you want to assess, use the recalculate option to update the assessment with the latest changes.

## How do I discover VMs in a multitenant environment?

- **VMware**: If your environment is shared across tenants and you don't want to discover the VMs of one tenant in another tenant's subscription, create VMware vCenter Server credentials that can access only the VMs you want to discover. Then, use those credentials when you start discovery in the Azure Migrate appliance.
- **Hyper-V**: Hyper-V discovery uses Hyper-V host credentials. If VMs share the same Hyper-V host, currently, you cannot isolate discovery by tenant.  

### Do I need vCenter Server for VMWare VM discovery?

Yes. To perform discovery in a VMware environment, Azure Migrate requires vCenter Server. The appliance doesn't support discovery of ESXi hosts that aren't managed by vCenter Server.

## What's the difference in sizing options?

With *as-on-premises* sizing, Azure Migrate doesn't consider VM performance data for assessment. It assesses VM sizes based on the on-premises configuration.

With *performance-based* sizing, sizing is based on utilization data.

For example, if an on-premises VM has 4 cores and 8 GB of memory at 50% CPU utilization and 50% memory utilization:
- As-on-premises sizing recommends an Azure VM SKU that has 4 cores and 8 GB of memory.
- Performance-based sizing recommends a VM SKU that has 2 cores and 4 GB of memory, because the utilization percentage is considered.

Similarly, disk sizing depends on two assessment properties: sizing criteria and storage type.
- If the sizing criteria is performance-based and the storage type is automatic, Azure Migrate takes the IOPS and throughput values of the disk into account when it identifies the target disk type (Standard or Premium).
- If the sizing criteria is performance-based and the storage type is Premium, Azure Migrate recommends a Premium disk SKU that's based on the size of the on-premises disk. The same logic is applied to disk sizing when the sizing is as-on-premises and the storage type is Standard or Premium.

## Does performance history and utilization affect sizing?

Performance history and utilization are applicable only in *performance-based* sizing.

Azure Migrate uses this process to assess size requirements:

1. Azure Migrate collects the performance history of on-premises machines and uses it to recommend the VM size and disk type in Azure.
1. The appliance continuously profiles the on-premises environment to gather real-time utilization data every 20 seconds.
1. The appliance rolls up the 20-second samples and creates a single data point every 15 minutes.
1. To create the data point, the appliance selects the peak value from all 20-second samples.
1. The appliance sends the data point to Azure.

When you create an assessment in Azure, depending on performance duration and the performance history percentile value that is set, Azure Migrate calculates the effective utilization value, and then uses it for sizing.

For example, if you set the performance duration to 1 day and the percentile value to 95 percentile, Azure Migrate sorts the 15-minute sample points sent by the collector for the past day in ascending order. It picks the 95th percentile value as the effective utilization.

Using the 95th percentile value ensures that outliers are ignored. Outliers might be included if your Azure Migrate uses the 99th percentile. To pick the peak usage for the period without missing any outliers, set Azure Migrate to use the 99th percentile.

## What is dependency visualization?

Dependency visualization can help you assess groups of VMs to migrate with greater confidence. Dependency visualization cross-checks machine dependencies before you run an assessment. It helps ensure that nothing is left behind, and it helps avoid unexpected outages when you migrate to Azure. Azure Migrate uses the Service Map solution in Azure Monitor to enable dependency visualization. [Learn more](concepts-dependency-visualization.md).

> [!NOTE]
> Dependency visualization isn't available in Azure Government.

## Do I pay for dependency visualization?

No. Learn more about [Azure Migrate pricing](https://azure.microsoft.com/pricing/details/azure-migrate/).

## What do I install for dependency visualization?

To use dependency visualization, download and install agents on each on-premises machine that you want to evaluate:

- [Microsoft Monitoring Agent (MMA)](https://docs.microsoft.com/azure/log-analytics/log-analytics-agent-windows)
- [Dependency agent](../azure-monitor/platform/agents-overview.md#dependency-agent)
- If you have machines that don't have internet connectivity, download and install the Log Analytics gateway on them.

You need these agents only if you use dependency visualization.

## Can I use an existing workspace?

Yes, you can attach an existing workspace to the migration project and use it for dependency visualization. 

## Can I export the dependency visualization report?

No, the dependency visualization can't be exported. However, Azure Migrate uses Service Map, and you can use the [Service Map REST API](https://docs.microsoft.com/rest/api/servicemap/machines/listconnections) to retrieve the dependencies in JSON format.

## Can I automate MMA and Dependency agent installation?

Use a [script to install the Dependency agent](../azure-monitor/insights/vminsights-enable-hybrid-cloud.md#installation-script-examples). Follow the [instructions to install MMA](https://docs.microsoft.com/azure/azure-monitor/platform/log-analytics-agent#install-and-configure-agent) by using the command line or automation. For
MMA, download and use the [script](https://gallery.technet.microsoft.com/scriptcenter/Install-OMS-Agent-with-2c9c99ab) script that's available.

You can also use deployment tools like Microsoft Endpoint Configuration Manager and [Intigua](https://www.intigua.com/getting-started-intigua-for-azure-migration) to deploy the agents.

## What operating systems does MMA support?

- View the list of [Windows operating systems that MMA supports](https://docs.microsoft.com/azure/log-analytics/log-analytics-concept-hybrid#supported-windows-operating-systems).
- View the list of [Linux operating systems that MMA supports](https://docs.microsoft.com/azure/log-analytics/log-analytics-concept-hybrid#supported-linux-operating-systems).

## Can I visualize dependencies for more than one hour?

No. You can visualize dependencies for up to one hour. You can go back as far as a month to a specific date in history, but the maximum duration for visualization is one hour. 

For example, you can use the time duration in the dependency map to view dependencies for yesterday, but you can view the dependencies from yesterday only for a one-hour window. 

However, you can use Azure Monitor logs to [query dependency data](https://docs.microsoft.com/azure/migrate/how-to-create-group-machine-dependencies) over a longer duration.

## Can I visualize dependencies for groups of more than 10 VMs?

You can [visualize dependencies](https://docs.microsoft.com/azure/migrate/how-to-create-group-dependencies) for groups that have up to 10 VMs. If you have a group that has more than 10 VMs, we recommend that you split the group into smaller groups, and then visualize the dependencies.

## Next steps

Read the [Azure Migrate overview](migrate-services-overview.md).

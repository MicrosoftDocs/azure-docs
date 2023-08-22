---
title: Questions about assessments in Azure Migrate
description: Get answers to common questions about assessments in Azure Migrate.
author: rashijoshi
ms.author: rajosh
ms.manager: abhemraj
ms.topic: conceptual
ms.service: azure-migrate
ms.date: 06/06/2023
ms.custom: engagement-fy23
---

# Assessment - Common questions

This article answers common questions about assessments in Azure Migrate. If you have other questions, check these resources:

- [General questions](resources-faq.md) about Azure Migrate
- Questions about the [Azure Migrate appliance](common-questions-appliance.md)
- Questions about [Migration and modernization](common-questions-server-migration.md)
- Get questions answered in the [Azure Migrate forum](https://social.msdn.microsoft.com/forums/azure/home?forum=AzureMigrate)

## What geographies are supported for discovery and assessment with Azure Migrate?

Review the supported geographies for [public](migrate-support-matrix.md#public-cloud) and [government clouds](migrate-support-matrix.md#azure-government).

## How many servers can I discover with an appliance?

You can discover up to 10,000 servers from VMware environment, up to 5,000 servers from Hyper-V environment, and up to 1000 physical servers by using a single appliance. If you have more servers, read about [scaling a Hyper-V assessment](scale-hyper-v-assessment.md), [scaling a VMware assessment](scale-vmware-assessment.md), or [scaling a physical server assessment](scale-physical-assessment.md).

## How do I choose the assessment type?

- Use **Azure VM assessments** when you want to assess servers from your on-premises [VMware](how-to-set-up-appliance-vmware.md) and [Hyper-V](how-to-set-up-appliance-hyper-v.md) environment, and [physical servers](how-to-set-up-appliance-physical.md) for migration to Azure VMs. [Learn More](concepts-assessment-calculation.md).
- Use assessment type **Azure SQL** when you want to assess your on-premises SQL Server in your VMware, Microsoft Hyper-V, and Physical/Bare metal environments as well as IaaS Servers of other public clouds such as AWS, GCP, etc. for migration to SQL Server on Azure VM or Azure SQL Database or Azure SQL Managed Instance. [Learn More](concepts-azure-sql-assessment-calculation.md).
- Use assessment type **Azure App Service** when you want to assess your on-premises ASP.NET web apps running on IIS web server from your VMware environment for migration to Azure App Service. [Learn More](concepts-assessment-calculation.md).
- Use **Azure VMware Solution (AVS)** assessments when you want to assess your on-premises [VMware VMs](how-to-set-up-appliance-vmware.md) for migration to [Azure VMware Solution (AVS)](../azure-vmware/introduction.md) using this assessment type. [Learn more](concepts-azure-vmware-solution-assessment-calculation.md).
- You can use a common group with VMware machines only to run both types of assessments. If you're running AVS assessments in Azure Migrate for the first time, it's advisable to create a new group of VMware machines.

## Why is performance data missing for some/all servers in my Azure VM and/or AVS assessment report?

For "Performance-based" assessment, the assessment report export says 'PercentageOfCoresUtilizedMissing' or 'PercentageOfMemoryUtilizedMissing' when the Azure Migrate appliance can't collect performance data for the on-premises servers. You can check the *Resolve issues* blade on the Azure Migrate hub page for detailed issues or check the following manually:

- If the servers are powered on for the duration for which you're creating the assessment
- If only memory counters are missing and you're trying to assess servers in Hyper-V environment. In this scenario, enable dynamic memory on the servers and 'Recalculate' the assessment to reflect the latest changes. The appliance can collect memory utilization values for severs in Hyper-V environment only when the server has dynamic memory enabled.

- If all of the performance counters are missing, ensure that outbound connections on ports 443 (HTTPS) are allowed.

    > [!Note]
    > If any of the performance counters are missing, Azure Migrate: Server Assessment falls back to the allocated cores/memory on-premises and recommends a VM size accordingly.

## How can I understand details of errors causing performance data collection issues?

You can now understand what errors you need to remediate to resolve performance data collection issues in Azure VM and Azure VMware Solution assessments. Follow these steps:
- Go to Azure Migrate > **Servers, databases and web apps** > **Migration goals**, select **Resolve issues** on the Discovery and assessment tool.
- Select **Affected objects** next to the assessment and select the link in the error ID column to review the error details and remediation actions.

You can also review these errors/issues while creating the assessment in the **Select servers to assess** step or in the readiness tab of an existing assessment. If you don't see any errors/issues in the assessment but see non-zero errors in the resolve issues blade, recalculate the assessment to see the issues within the assessment blade. 

## Why is performance data missing for some/all SQL instances/databases in my Azure SQL assessment?

To ensure performance data is collected, check:

- If the SQL Servers are powered on for the duration for which you're creating the assessment.
- If the connection status of the SQL agent in Azure Migrate is 'Connected', and check the last heartbeat. 
- If Azure Migrate connection status for all SQL instances is 'Connected' in the discovered SQL instance section.
- If all of the performance counters are missing, ensure that outbound connections on ports 443 (HTTPS) are allowed.

If any of the performance counters are missing, Azure SQL assessment recommends the smallest Azure SQL configuration for that instance/database.

## Why is confidence rating not available for Azure App Service assessments?

Performance data isn't captured for Azure App Service assessment and hence you don't see confidence rating for this assessment type. Azure App Service assessment takes configuration data of web apps in to account while performing assessment calculation.

## Why is the confidence rating of my assessment low?

The confidence rating is calculated for "Performance-based" assessments based on the percentage of [available data points](./concepts-assessment-calculation.md#ratings) needed to compute the assessment. Below are the reasons why an assessment could get a low confidence rating:

- You didn't profile your environment for the duration for which you're creating the assessment. For example, if you're creating an assessment with performance duration set to one week, you need to wait for at least a week after you start the discovery for all the data points to get collected. If you can't wait for the duration, change the performance duration to a smaller period and **Recalculate** the assessment.
- Assessment isn't able to collect the performance data for some or all the servers in the assessment period. For a high confidence rating, ensure that: 
    - Servers are powered on for the duration of the assessment
    - Outbound connections on ports 443 are allowed
    - For Hyper-V Servers, dynamic memory is enabled
    - The connection status of agents in Azure Migrate are 'Connected' and check the last heartbeat
    - For Azure SQL assessments, Azure Migrate connection status for all SQL instances is "Connected" in the discovered SQL instance section.

    **Recalculate** the assessment to reflect the latest changes in confidence rating.

- For Azure VM and AVS assessments, few servers were created after discovery had started. For example, if you're creating an assessment for the performance history of last one month, but few servers were created in the environment only a week ago. In this case, the performance data for the new servers won't be available for the entire duration and the confidence rating would be low. [Learn more](./concepts-assessment-calculation.md#confidence-ratings-performance-based).
- For Azure SQL assessments, few SQL instances or databases were created after discovery had started. For example, if you're creating an assessment for the performance history of last one month, but few SQL instances or databases were created in the environment only a week ago. In this case, the performance data for the new servers won't be available for the entire duration and the confidence rating would be low. [Learn more](./concepts-azure-sql-assessment-calculation.md#confidence-ratings).

## Why is my RAM utilization greater than 100%?

By design, in Hyper-V if maximum memory provisioned is less than what is required by the VM, Assessment will show memory utilization to be more than 100%.

## I see a banner on my assessment that the assessment now also considers processor parameters. What will be the impact of recalculating the assessment?

The assessment now considers processor parameters such as number of operational cores, sockets, etc. and calculates its optimal performance over a period in a simulated environment. This is done to benchmark all processor-based available processor information. Recalculate your assessments to see the updated recommendations.

The processor benchmark numbers are now considered along with the resource utilization to ensure, we match the processor performance of your on-premises VMware, Hyper-V, and Physical servers and recommend the target Azure SKU sizes accordingly. This is a way to further improve the assessment recommendations to match your performance needs more closely.

Due to this, the target Azure VM cost can differ from your earlier assessments of the same target. Also, the number of cores allocated in the target Azure SKU could also vary if the processor performance of target is a match for your on-premises VMware, Hyper-V, and Physical servers.

## For scenarios where customers choose "as on premises", is there any impact due to processor benchmarking?

No, there will be no impact as we don't consider it for as on premises scenario.

## I see an increase in my monthly costs after I recalculate my assessments? Is this the most optimized cost for me?

If you've selected all available options for your “VM Series” in your assessment settings, you'll get the most optimized cost recommendation for your VMs. However, if you choose only some of the available options for the VM series, the recommendation might skip the most optimized option for you while assigning you an Azure VM SKU while matching your processor performance numbers.

## Why can't I see all Azure VM families in the Azure VM assessment properties?

There could be two reasons:
- You've chosen an Azure region where a particular series isn't supported. Azure VM families shown in Azure VM assessment properties are dependent on the availability of the VM series in the chosen Azure location, storage type and Reserved Instance. 
- The VM series isn't support in the assessment and isn't in the consideration logic of the assessment. We currently don't support B-series burstable, accelerated and high performance SKU series. We're trying to keep the VM series updated, and the ones mentioned are on our roadmap. 

## The number of Azure VM or AVS assessments on the Discovery and assessment tool are incorrect

 To remediate this, select the total number of assessments to navigate to all the assessments and recalculate the Azure VM or AVS assessment. The discovery and assessment tool will then show the correct count for that assessment type.

## I want to try out the new Azure SQL assessment

Discovery and assessment of SQL Server instances and databases running in your VMware, Microsoft Hyper-V, and Physical/Bare metal environments as well as IaaS Servers of other public clouds such as AWS, GCP, etc. is now in preview. Get started with [this tutorial](tutorial-discover-vmware.md). If you want to try out this feature in an existing project, ensure that you've completed the [prerequisites](how-to-discover-sql-existing-project.md) in this article.

## I want to try out the new Azure App Service assessment

Discovery and assessment of .NET web apps running in your VMware environment is now in preview. Get started with [this tutorial](tutorial-discover-vmware.md). If you want to try out this feature in an existing project, ensure that you've completed the [prerequisites](how-to-discover-sql-existing-project.md) in this article.

## I can't see some servers when I am creating an Azure SQL assessment

- Azure SQL assessment can only be done on servers running where SQL instances were discovered. If you don't see the servers and SQL instances that you wish to assess, wait for some time for the discovery, and then create the assessment.
- If you're not able to see a previously created group while creating the assessment, remove any server without a SQL instance from the group.
- If you're running Azure SQL assessments in Azure Migrate for the first time, it's advisable to create a new group of servers.

## I can't see some servers when I am creating an Azure App Service assessment

- Azure App Service assessment can only be done on servers running where web server role was discovered. If you don't see the servers that you wish to assess, wait for some time for the discovery to get completed, and then create the assessment.
- If you're not able to see a previously created group while creating the assessment, remove any non-VMware server or any server without a web app from the group.
- If you're running Azure App Service assessments in Azure Migrate for the first time, it's advisable to create a new group of servers.

## I want to understand how was the readiness for my instance computed?

The readiness for your SQL instances has been computed after doing a feature compatibility check with the targeted Azure SQL deployment type (SQL Server on Azure VM or Azure SQL Managed Instance or Azure SQL Database). [Learn more](./concepts-azure-sql-assessment-calculation.md#calculate-readiness). 

## I want to understand how was the readiness for my web apps is computed?

The readiness for your web apps is computed by running series of technical checks to determine if your web app will run successfully in Azure App service or not. These checks are documented [here](https://github.com/Azure/App-Service-Migration-Assistant/wiki/Readiness-Checks).

## Why is my web app marked as Ready with conditions or Not ready in my Azure App Service assessment?

This can happen when one or more technical checks fail for a given web app. You may select the readiness status for the web app to find out details and remediation for failed checks.

## Why is the readiness for all my SQL instances marked as unknown?

If your discovery was started recently and is still in progress, you might see the readiness for some or all SQL instances as unknown. We recommend that you wait for some time for the appliance to profile the environment and then recalculate the assessment.
The SQL discovery is performed once every 24 hours and you might need to wait upto a day for the latest configuration changes to reflect.

## Why is the readiness for some of my SQL instances marked as unknown?

This could happen if:

- The discovery is still in progress. We recommend that you wait for some time for the appliance to profile the environment and then recalculate the assessment.
- There are some discovery issues that you need to fix in **Errors and notifications**.

The SQL discovery is performed once every 24 hours and you might need to wait upto a day for the latest configuration changes to reflect.

## My assessment is in Outdated state

### Azure VM/AVS assessment

If there are on-premises changes to servers that are in a group that's been assessed, the assessment is marked outdated. An assessment can be marked as “Outdated” because of one or more changes in below properties:

- Number of processor cores
- Allocated memory
- Boot type or firmware
- Operating system name, version and architecture
- Number of disks
- Number of network adaptor
- Disk size change(GB Allocated)
- Nic properties update. Example: Mac address changes, IP address addition etc.

**Recalculate** the assessment to reflect the latest changes in the assessment.

### Azure SQL assessment

If there are changes to on-premises SQL instances and databases that are in a group that's been assessed, the assessment is marked **outdated**:

- SQL instance was added or removed from a server
- SQL database was added or removed from a SQL instance
- Total database size in a SQL instance changed by more than 20%
- Change in number of processor cores and/or allocated memory

**Recalculate** the assessment to reflect the latest changes in the assessment.

## Why was I recommended a particular target deployment type?

Azure Migrate recommends a specific Azure SQL deployment type that is compatible with your SQL instance. Migrating to a Microsoft recommended target reduces your overall migration effort. This Azure SQL configuration (SKU) has been recommended after considering the performance characteristics of your SQL instance and the databases it manages. If multiple Azure SQL configurations are eligible, we recommend the one, which is the most cost effective. [Learn more](./concepts-azure-sql-assessment-calculation.md#calculate-sizing).

## What deployment target should I choose if my SQL instance is ready for Azure SQL DB and Azure SQL MI?

If your instance is ready for both Azure SQL DB and Azure SQL MI, we recommend the target deployment type for which the estimated cost of Azure SQL configuration is lower.

## I can't see some databases in my assessment even though the instance is part of the assessment

The Azure SQL assessment only includes databases that are in online status. In case the database is in any other status, the assessment ignores the readiness, sizing, and cost calculation for such databases. In case you wish you assess such databases, change the status of the database and recalculate the assessment in some time.

## I want to compare costs for running my SQL instances on Azure VM vs Azure SQL Database/Azure SQL Managed Instance

You can create a single **Azure SQL** assessment consisting of desired SQL servers across VMware, Microsoft Hyper-V and Physical/Bare metal environments as well as IaaS Servers of other public clouds such as AWS, GCP, etc. A single assessment covers readiness, SKUs, estimated costs and migration blockers for all the available SQL migration targets in Azure - Azure SQL Managed Instance, Azure SQL Database and SQL Server on Azure VM. You can then compare the assessment output for the desired targets. [Learn More](./concepts-azure-sql-assessment-calculation.md)

## The storage cost in my Azure SQL assessment is zero

For Azure SQL Managed Instance, there's no storage cost added for the first 32 GB/instance/month storage and additional storage cost is added for storage in 32-GB increments. [Learn More](https://azure.microsoft.com/pricing/details/azure-sql/sql-managed-instance/single/).

## I can't see some groups when I am creating an Azure VMware Solution (AVS) assessment

- AVS assessment can be done on groups that have only VMware machines. Remove any non-VMware machine from the group if you intend to perform an AVS assessment.
- If you're running AVS assessments in Azure Migrate for the first time, it's advisable to create a new group of VMware machines.

## Queries regarding Ultra disks

### Can I migrate my disks to Ultra disk using Azure Migrate?

No. Currently, both Azure Migrate and Azure Site Recovery don't support migration to Ultra disks. Find steps to deploy Ultra disk [here](../virtual-machines/disks-enable-ultra-ssd.md?tabs=azure-portal#deploy-an-ultra-disk)

### Why are the provisioned IOPS and throughput in my Ultra disk more than my on-premises IOPS and throughput?

As per the [official pricing page](https://azure.microsoft.com/pricing/details/managed-disks/), Ultra Disk is billed based on the provisioned size, provisioned IOPS and provisioned throughput. As per an example provided:

If you provisioned a 200 GiB Ultra Disk, with 20,000 IOPS and 1,000 MB/second and deleted it after 20 hours, it will map to the disk size offer of 256 GiB and you'll be billed for the 256 GiB, 20,000 IOPS and 1,000 MB/second for 20 hours.

IOPS to be provisioned =  (Throughput discovered) *1024/256

### Does the Ultra disk recommendation consider latency?

No, currently only disk size, total throughput, and total IOPS are used for sizing and costing.

### I can see M series supports Ultra disk, but in my assessment where Ultra disk was recommended, it says “No VM found for this location”?

This is possible as not all VM sizes that support Ultra disk are present in all Ultra disk supported regions. Change the target assessment region to get the VM size for this server.

## I can't see some VM types and sizes in Azure Government

VM types and sizes supported for assessment and migration depend on availability in Azure Government location. You can [review and compare](https://azure.microsoft.com/global-infrastructure/services/?regions=usgov-non-regional,us-dod-central,us-dod-east,usgov-arizona,usgov-iowa,usgov-texas,usgov-virginia&products=virtual-machines) VM types in Azure Government.

## The size of my server changed. Can I run an assessment again?

The Azure Migrate appliance continuously collects information about the on-premises environment.  An assessment is a point-in-time snapshot of on-premises servers. If you change the settings on a server that you want to assess, use the recalculate option to update the assessment with the latest changes.

## How do I discover servers in a multitenant environment?

- **VMware**: If an environment is shared across tenants and you don't want to discover a tenant's servers in another tenant's subscription, create VMware vCenter Server credentials that can access only the servers you want to discover. Then, use those credentials when you start discovery in the Azure Migrate appliance.
- **Hyper-V**: Discovery uses Hyper-V host credentials. If servers share the same Hyper-V host, there's currently no way to separate the discovery.  

## Do I need vCenter Server?

Yes, Azure Migrate requires vCenter Server in a VMware environment to perform discovery. Azure Migrate doesn't support discovery of ESXi hosts that aren't managed by vCenter Server.

## What are the sizing options in an Azure VM assessment?

With as-on-premises sizing, Azure Migrate doesn't consider server performance data for assessment. Azure Migrate assesses VM sizes based on the on-premises configuration. With performance-based sizing, sizing is based on utilization data.

For example, if an on-premises server has 4 cores and 8 GB of memory at 50% CPU utilization and 50% memory utilization:

- As-on-premises sizing will recommend an Azure VM SKU that has 4 cores and 8 GB of memory.
- Performance-based sizing will recommend a VM SKU that has 2 cores and 4 GB of memory because the utilization percentage is considered.

Similarly, disk sizing depends on sizing criteria and storage type:

- If the sizing criteria is "performance-based" and the storage type is automatic, Azure Migrate takes the IOPS and throughput values of the disk into account when it identifies the target disk type (Standard, Premium or Ultra disk).
- If the sizing criteria is "as on premises" and the storage type is Premium, Azure Migrate recommends a Premium disk SKU based on the size of the on-premises disk. The same logic is applied to disk sizing when the sizing is as-on-premises and the storage type is Standard, Premium or Ultra disk.

## Does performance history and utilization affect sizing in an Azure VM assessment?

Yes, performance history and utilization affect sizing in an Azure VM assessment.

### Performance history

For performance-based sizing only, Azure Migrate collects the performance history of on-premises machines, and then uses it to recommend the VM size and disk type in Azure:

1. The appliance continuously profiles the on-premises environment to gather real-time utilization data every 20 seconds.
2. The appliance rolls up the collected 20-second samples and uses them to create a single data point every 15 minutes.
3. To create the data point, the appliance selects the peak value from all 20-second samples.
4. The appliance sends the data point to Azure.

### Utilization

When you create an assessment in Azure, depending on performance duration and the performance history percentile value that is set, Azure Migrate calculates the effective utilization value, and then uses it for sizing.

For example, if you set the performance duration to one day and the percentile value to 95th percentile, Azure Migrate sorts the 15-minute sample points sent by the collector for the past day in ascending order. It picks the 95th percentile value as the effective utilization.

Using the 95th percentile value ensures that outliers are ignored. Outliers might be included if your Azure Migrate uses the 99th percentile. To pick the peak usage for the period without missing any outliers, set Azure Migrate to use the 99th percentile.

## How are import-based assessments different from assessments with discovery source as appliance?

Import-based Azure VM assessments are assessments created with machines that are imported into Azure Migrate using a CSV file. Only four fields are mandatory to import: Server name, cores, memory, and operating system. Here are some things to note:

 - The readiness criteria is less stringent in import-based assessments on the boot type parameter. If the boot type isn't provided, it's assumed the machine has BIOS boot type, and the machine isn't marked as **Conditionally Ready**. In assessments with discovery source as appliance, the readiness is marked as **Conditionally Ready** if the boot type is missing. This difference in readiness calculation is because users may not have all information on the machines in the early stages of migration planning when import-based assessments are done.
 - Performance-based import assessments use the utilization value provided by the user for right-sizing calculations. Since the utilization value is provided by the user, the **Performance history** and **Percentile utilization** options are disabled in the assessment properties. In assessments with discovery source as appliance, the chosen percentile value is picked from the performance data collected by the appliance.

## Why is the suggested migration tool in import-based AVS assessment marked as unknown?

For machines imported via a CSV file, the default migration tool in an AVS assessment is unknown. Though, for VMware machines, it's recommended to use the VMware Hybrid Cloud Extension (HCX) solution. [Learn More](../azure-vmware/install-vmware-hcx.md).

## Next steps

Read the [Azure Migrate overview](migrate-services-overview.md).

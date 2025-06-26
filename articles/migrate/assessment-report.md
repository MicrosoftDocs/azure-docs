--- 
title: Overview of Azure Migrate assessment report 
description: Learn about assessment report, Azure readiness, and recommendations. 
author: habibaum
ms.author: v-uhabiba
ms.service: azure-migrate 
ms.topic: concept-article 
ms.date: 04/17/2025
ms.custom: engagement-fy24 
monikerRange: migrate
--- 

# Assessment report of Azure readiness

Each assessment provides four key outputs: Azure readiness, right sized target recommendations, cost details, and migration guidance. 

## Understanding Azure readiness 

Not all workloads are suitable to run in Azure. An Azure Migrate assessment evaluates all workloads in the group and categorizes them based on their readiness.

- **Ready for Azure**: The workloads can be migrated as-is to Azure without any changes. It starts in Azure with full Azure support. 

- **Conditionally ready for Azure**: The workloads might start in Azure but might not have full Azure support. For example, Azure doesn't support a server that's running an old version of Windows Server. You must be careful before you migrate these servers to Azure. To fix any readiness problems, follow the remediation guidance the assessment suggests. 

- **Not ready for Azure**: The server won't start in Azure. For example, if an on-premises server's disk stores more than 64 TB, Azure can't host the server. Follow the remediation guidance to fix the problem before migration. 

- **Readiness unknown**: Azure Migrate can't determine the readiness of the server because of insufficient metadata. 

Readiness calculations differ based on the source and targets and the methodology to calculate also differs across assessment types. 

## Right sized recommendations 

After the server is marked as ready for Azure, the assessment makes sizing recommendations in the assessment. These recommendations identify the target for the on-premises workloads being assessed. Sizing calculations depend on whether you're using as-is on-premises sizing or performance-based sizing. 

**Assessment type** | **Details** | **Data** 
--- | --- | --- 
**Performance-based** | Assessments that make recommendations based on collected performance data. |  The compute recommendation is based on CPU and memory utilization data.<br/><br/> The storage recommendation is based on the input/output operations per second (IOPS) and throughput of the on-premises disks. Disk types are Azure Standard HDD, Azure Standard SSD, Azure Premium disks, and Azure Ultra disks. 
**As-is on-premises** | Assessments that don't use performance data to make recommendations. |  The compute recommendation is based on the on-premises server size.<br/><br/> The recommended storage is based on the selected storage type for the assessment. 

In performance-based assessment the assessment identifies the appropriate data point to use for right-sizing. Identification is based on the percentile values for performance history and percentile utilization taken as input as assessment setting.   

For example, if the performance history selected is one week and the percentile utilization is the 95th percentile, the assessment sorts the performance data sample points for the last week. It sorts them in ascending order and picks the 95th percentile value for rightsizing. 
 
The 95th percentile value makes sure you ignore any outliers, which might be included if you picked the 99th percentile. 

If you want to pick the peak usage for the period and don't want to miss any outliers, select the 99th percentile for percentile utilization. 

This value is multiplied by the comfort factor(taken as an input in assessment setting) to get the effective performance utilization data for these metrics that the appliance collects and right size the target requirements. 

>[!Note] 
>Azure SQL assessments are only performance-based and Webapp assessments are only As-is on premises. You can create Azure VM assessments and AVS assessments with both performance-based and As-is on premises sizing. 

### Monthly costs 

After right-sizing target candidates are selected, and if more than one suitable candidate is available the recommended target is selected based on selected migration strategy. By default **Minimizing the cost** is the selected strategy. In the case of Azure VM and AVS assessment that is the only strategy. Once the targets are finalized a monthly cost is calculated by aggregating the cost of all resources, licenses and ancillary services like security. Based on the selected input from assessment settings the prices and offer details are fetched to arrive at the final cost. Learn more [about how pricing](cost-estimation.md) works in Azure Migrate assessments. 

### Confidence ratings (performance-based) 

Each performance-based Azure VM assessment in Azure Migrate is associated with a confidence rating. The rating ranges from one (lowest) to five (highest) stars. The confidence rating helps you estimate the reliability of the size recommendations Azure Migrate provides. 

- The confidence rating is assigned to an assessment. The rating is based on the availability of data points that are needed to compute the assessment. 

- For performance-based sizing, the assessment needs: 

  - The utilization data for CPU and RAM. 

  - The disk IOPS and throughput data for every disk attached to the server. 

  - The network I/O to handle performance-based sizing for each network adapter attached to a server. 

If any of these utilization numbers isn't available, the size recommendations might be unreliable. 

>[!Note]
>Confidence ratings aren't assigned for servers assessed using an imported CSV file. Ratings also aren't applicable for as-is on-premises assessment. 

### Ratings 

The table below shows the confidence ratings for assessment, which depend on the percentage of available data points: 

**Availability of data points** | **Confidence rating** 
--- | --- 
0-20% | One star 
21-40% | Two stars 
41-60% | Three stars 
61-80% | Four stars 
81-100% | Five stars 

### Low confidence ratings 

Here are a few reasons why an assessment could get a low confidence rating: 

- You didn't profile your environment for the duration for which you're creating the assessment. For example, if you create the assessment with performance duration set to one day, you must wait at least a day after you start discovery for all the data points to get collected. 

- Assessment isn't able to collect the performance data for some or all the servers in the assessment period. For a high confidence rating, ensure that: 

  - Servers are powered on for the duration of the assessment 

  - Outbound connections on ports 443 are allowed 

  - For Hyper-V servers, dynamic memory is enabled 

**Recalculate** the assessment to reflect the latest changes in confidence rating. 

- Some servers were created during the time for which the assessment was calculated. For example, assume you created an assessment for the performance history of the last month, but some servers were created only a week ago. In this case, the performance data for the new servers will not be available for the entire duration and the confidence rating would be low. 

>[!Note]
>If the confidence rating of any assessment is less than five stars, we recommend that you wait at least a day for the appliance to profile the environment and then recalculate the assessment. Otherwise, performance-based sizing might be unreliable. In that case, we recommend that you switch the assessment to on-premises sizing. 

## Next steps 

- [Review](./best-practices-assessment.md) best practices for creating assessments. 
- Learn about running assessments for servers running in [VMware](./tutorial-discover-vmware.md) and [Hyper-V](./tutorial-discover-hyper-v.md) environment, and [physical servers](./tutorial-discover-physical.md). 
- Learn about assessing servers [imported with a CSV file](./tutorial-discover-import.md). 
- Learn about setting up [dependency visualization](./concepts-dependency-visualization.md). 

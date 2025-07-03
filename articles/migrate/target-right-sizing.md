---
title:  Performance vs As-is on-premises assessments
description: Describes how Azure Migrate provides sizing recommendations for the assessed workloads.
author: rashi-ms
ms.author: v-uhabiba
ms.service: azure-migrate
ms.topic: concept-article
ms.date: 04/17/2025
monikerRange: migrate
# Customer intent: As an IT administrator, I want to evaluate workload sizing using performance-based assessments, so that I can ensure optimal resource allocation on Azure and reduce costs without compromising resilience.
---

# Target right-sizing 

Azure Migrate assessments evaluate the readiness of source workloads, recommend right sized targets, and estimate the cost of hosting these workloads on Azure. Once the readiness of the source workload is determined, the assessment provides sizing recommendations based on either as-is on-premises sizing or performance-based sizing.

## Sizing criteria

Azure Migrate supports two types of target sizing:  

| Sizing criteria    | Details   | Examples |
|--------------------|-----------|----------|
| **Performance-based**  | Assessments that make target size recommendations based on collected performance data.  | The compute recommendation is based on CPU and memory utilization data. <br> <br> The storage recommendation is based on the input/output operations per second (IOPS) and the throughput of the on-premises disks. Disk types are Azure Standard HDD, Azure Standard SSD, Azure Premium disks, and Azure Ultra disks.  |
| **As-is on-premises**  | Assessments that don't use performance data to make target size recommendations. The targets are sized based on the configuration data available.  | The compute recommendation is based on the on-premises source workload size. <br> The recommended storage is based on the storage type selected for the assessment.|

For identifying the right-sized Azure target that isn't overprovisioned but still resilient, we recommend creating performance-based assessments. The performance-based assessments use resource utilization data (CPU & memory utilization etc.) and resource configuration data. The appliance collects the required performance data at regular intervals and modeled to perform the assessments.  

### Appliance aggregate and model performance data 

If you use the appliance for discovery, it collects performance data directly from the hypervisor your workloads are hosted on. This is how a typical performance data modeling process looks: 

1. The appliance collects a real-time sample point. 
   - VMware VMs: A sample point is collected every 20 seconds. 
   - Hyper-V VMs: A sample point is collected every 30 seconds. 
   - Physical servers: A sample point is collected every five minutes. 

2. The appliance combines the sample points to create a single data point every 10 minutes for VMware and Hyper-V servers, and every 5 minutes for physical servers. To create the data point, the appliance selects the peak values from all samples. It then sends the data point to Azure. 

3. The assessment stores all the 10-minute data points for the last month. All the peaks are arranged in the ascending order to identify the appropriate data point to use for right-sizing.  

### Performance data collected for import-based discovery  

If you import servers using a CSV file, the performance values you specify (CPU utilization, Memory utilization, Disk IOPS, and throughput) are used if you choose performance-based sizing. You won't be able to provide performance history and percentile information.  

This method is especially helpful if you've over-allocated the on-premises server, its utilization is low, and you want to right-size the Azure VM to save costs.  

If you don't want to use the performance data, reset the sizing criteria to as-is on-premises, as described in the previous section.  

### Performance data used for right-sizing

When you create an assessment, the assessment identifies the appropriate level of utilization to consider for right-sizing. It's identified based on the performance history and percentile utilization. The performance history specifies the duration used when performance data is evaluated, and percentile utilization specifies the percentile value of the performance sample used for right-sizing. 

For example, let us consider for a server with 16 vCPUs attached. The performance history selected is one week and the percentile utilization is the 95th percentile. The assessment sorts the performance data sample points for the last week. It sorts them in ascending order and picks the 95th percentile value for right-sizing. Based on the above values, the assessment identifies that this server utilizes only 20% of CPU available at 95th percentile. Thus only 4 vCPUs are enough to manage the load for the given server. To confirm, the user can add a comfort factor which is used as a multiplier over the identified usage to provide a safety headroom and ensure availability of the server even if some spike happens over expectation. Consider that if the user asks for 1.5x as the comfort factor, the final recommendation is an 8 core VM. 

> [!Note]
> Since the appliance does not collect any performance data for web apps, they will be assessed only for As-is on premises sizing. Servers and SQL databases can be assessed for targets using both performance-based and as-is on premises sizing.  

## Next steps
[Review the Azure VM assessment report](review-assessment.md)
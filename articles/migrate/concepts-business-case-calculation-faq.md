---
title: Business case FAQ in Azure Migrate 
description: FAQ for Business case in Azure Migrate 
author: rashi-ms
ms.author: rajosh
ms.manager: ronai
ms.topic: conceptual
ms.service: azure-migrate
ms.date: 04/15/2024
ms.custom: engagement-fy24
---

# Business case (preview) - FAQ

This article provides answers to some of the most common questions about Business case. Refer to the [Business case](./concepts-business-case-calculation.md) article to learn about a business case.


## How do I use the appliance?

If you're deploying an Azure Migrate appliance to discover on-premises servers, do the following steps:

1. Set up Azure and your on-premises environment to work with Azure Migrate.
1. For your first Business case, create an Azure project and add the Discovery and assessment tool to it.
1. Deploy a lightweight Azure Migrate appliance. The appliance continuously discovers on-premises servers and sends server metadata and performance data to Azure Migrate. Deploy the appliance as a VM. You don't need to install anything on servers that you want to assess.

After the appliance begins server discovery, you can start building your Business case. Follow our tutorials for [VMware](./tutorial-discover-vmware.md) or [Hyper-V](tutorial-discover-hyper-v.md) or [Physical/Bare-metal or other clouds](tutorial-discover-physical.md) to try out these steps.

We recommend that you wait at least a day after starting discovery before you build a Business case so that enough performance/resource utilization data points are collected. Also, review the notifications/resolve issues blades on Azure Migrate hub to identify any discovery related issues prior to Business case computation. It ensures that the IT estate in your datacenter is represented more accurately and the Business case recommendations are more valuable.

## What data does the appliance collect?

If you're using the Azure Migrate appliance, learn about the metadata and performance data that's collected for:
- [VMware](discovered-metadata.md#collected-metadata-for-vmware-servers).
- [Hyper-V](discovered-metadata.md#collected-metadata-for-hyper-v-servers)
- [Physical](discovered-metadata.md#collected-data-for-physical-servers)

## How does the appliance calculate performance data?

If you use the appliance for discovery, it collects performance data for compute settings with these steps:

1. The appliance collects a real-time sample point.
    - **VMware VMs**: A sample point is collected every 20 seconds.
    - **Hyper-V VMs**: A sample point is collected every 30 seconds.
    - **Physical servers**: A sample point is collected every five minutes.

1. The appliance combines the sample points to create a single data point every 10 minutes for VMware and Hyper-V servers, and every 5 minutes for physical servers. To create the data point, the appliance selects the peak values from all samples. It then sends the data point to Azure.
1. The assessment service stores all the 10-minute data points for the last month.
1. When you create a Business case, multiple assessments are triggered in the background.
1. The assessments identify the appropriate data point to use for rightsizing. Identification is based on the percentile values for *performance history* and *percentile utilization*.

    - For example, if the performance history is one week and the percentile utilization is the 95th percentile, the assessment sorts the 10-minute sample points for the last week. It sorts them in ascending order and picks the 95th percentile value for rightsizing.
    - The 95th percentile value makes sure you ignore any outliers, which might be included if you picked the 99th percentile.

1. This value is multiplied by the comfort factor to get the effective performance utilization data for these metrics that the appliance collects.

## How are utilization insights derived?

It covers which servers are ideal for cloud, servers that can be decommissioned on-premises, and servers that can't be classified based on resource utilization/performance data:

- **Ideal for cloud**: These servers are best fit for migrating to Azure and comprises of active and idle servers:
    - **Active servers**: These servers delivered business value by being on and had their CPU and memory utilization above 5% and network utilization above 2%.
    - **Idle servers**: These servers were on but didn't deliver business value by having their CPU and memory utilization below 5% and network utilization below 2%.
- **Decommission**: These servers were expected to deliver business value, but didn't and can be decommissioned on-premises and recommended to not migrate to Azure:
    - **Zombie**: The CPU, memory and network utilization were 0% with no performance data collection issues.
- These servers were on but don't have adequate metrics available:
    - **Unknown**: Many servers can land in this section if the discovery is still ongoing or has some unaddressed discovery issues.

## What comprises a business case?

There are four major reports that you need to review:

- **Overview**: This report is an executive summary of the Business case and covers:
    - Potential savings (TCO).
    - Estimated year on year cashflow savings based on the estimated migration completed that year.
    - Savings from unique Azure benefits like Azure Hybrid Benefit.
    - Savings from Security and Management capabilities.
    - Discovery insights covering the scope of the Business case.
- **On-premises vs Azure**: This report covers the breakdown of the total cost of ownership by cost categories and insights on savings.
- **Azure IaaS**: This report covers the Azure and on-premises footprint of the servers and workloads recommended for migrating to Azure IaaS.
- **Azure PaaS**: This report covers the Azure and on-premises footprint of the workloads recommended for migrating to Azure PaaS.


## Next steps
- [Learn more](./concepts-business-case-calculation.md) about business case.

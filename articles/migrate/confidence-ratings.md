---
title: Performance coverage
description: Describes how performance coverage is calculated in an assessment.
author: ankitsurkar06
ms.author: ankitsurkar
ms.service: azure-migrate
ms.topic: concept-article
ms.date: 04/17/2025
ms.reviewer: v-uhabiba
monikerRange:
# Customer intent: As a cloud architect, I want to understand the factors influencing performance coverage in performance-based assessments, so that I can ensure reliable size recommendations for virtual machines during migration planning.
---

# Performance-based Performance Coverage

Each performance-based Azure VM assessment in Azure Migrate is associated with a performance coverage. The coverage ranges from one (lowest) to five (highest) stars. The performance coverage helps you estimate the reliability of the size recommendations Azure Migrate provides. 

- The performance coverage is assigned to an assessment. The coverage is based on the availability of data points that are needed to compute the assessment. 

- For performance-based sizing, the assessment needs: 

  - The utilization data for CPU and RAM. 
  - The disk IOPS and throughput data for every disk attached to the server. 
  - The network I/O to handle performance-based sizing for each network adapter attached to a server. 

If any of these utilization numbers isn't available, the size recommendations might be unreliable. 

>[!Note]
>Performance coverage ratings aren't assigned for servers assessed using an imported CSV file. Ratings also aren't applicable for as-is on-premises assessment. 

## Ratings 

This table shows the assessment performance coverage ratings, which depend on the percentage of available data points: 

## Low performance coverage ratings 

Here are a few reasons why an assessment could get a low performance coverage rating: 

- You didn't profile your environment for the duration for which you're creating the assessment. For example, if you create the assessment with performance duration set to one day, you must wait at least a day after you start discovery for all the data points to get collected. 

- Assessment isn't able to collect the performance data for some or all the servers in the assessment period. For a high performance coverage rating, ensure that: 

  - Servers are powered on for the duration of the assessment.
  - Outbound connections on ports 443 are allowed.
  - For Hyper-V servers, dynamic memory is enabled.

**Recalculate** the assessment to reflect the latest changes in performance coverage rating. 

- Some servers were created during the time for which the assessment was calculated. For example, assume you created an assessment for the performance history of the last month, but some servers were created only a week ago. In this case, the performance data for the new servers won't be available for the entire duration and the performance coverage rating would be low. 

>[!Note]
>If the performance coverage rating of any assessment is less than 80%, we recommend that you wait at least a day for the appliance to profile the environment and then recalculate the assessment. Otherwise, performance-based sizing might be unreliable. In that case, we recommend that you switch the assessment to on-premises sizing. 

## Next steps 

- [Review](./best-practices-assessment.md) best practices for creating assessments. 
- Learn about discovering servers running in [VMware](./tutorial-discover-vmware.md) and [Hyper-V](./tutorial-discover-hyper-v.md) environment, and [physical servers](./tutorial-discover-physical.md).

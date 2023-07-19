---
title: Monitor managed virtual network integration runtime in Azure Data Factory 
description: Learn how to monitor managed virtual network integration runtime in Azure Data Factory.  
ms.service: data-factory
ms.subservice: monitoring
ms.topic: conceptual
ms.date: 19/07/2023
author: lrtoyou1223
ms.author: lle
ms.custom:
---

# Enhanced Monitoring with Managed Virtual Network Integration Runtime
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]
Azure Data Factory Managed Virtual Network is a feature that allows you to securely connect your data sources to a virtual network managed by Azure Data Factory service. By using this capability, you can establish a private and isolated environment for your data integration and orchestration processes. By using Azure Data Factory Managed Virtual Network, you can combine the power of Azure Data Factory's data integration and orchestration capabilities with the security and flexibility provided by Azure virtual networks. It empowers you to build robust, scalable, and secure data integration pipelines that seamlessly connect to your network resources, whether they're on-premises or in the cloud.
One common pain point of managed compute is the lack of visibility into the performance and health especially within a managed virtual network environment. Without proper monitoring, identifying and resolving issues becomes challenging, leading to potential delays, errors, and performance degradation.
By using our new enhanced monitoring feature, users can gain valuable insights into their data integration processes, leading to improved efficiency, better resource utilization, and enhanced overall performance. With proactive monitoring and timely alerts, users can proactively address issues, optimize workflows, and ensure the smooth execution of their data integration pipelines within the managed virtual network environment.

## New Metrics
The introduction of the new metrics in the Managed Virtual Network Integration Runtime feature significantly enhances the visibility and monitoring capabilities within virtual network environments. These new metrics have been designed to address the pain point of limited monitoring, providing users with valuable insights into the performance and health of their data integration workflows.
Azure Data Factory provides three distinct types of compute pools, each tailored to handle specific activity execution requirements. These compute pools offer flexibility and scalability to accommodate diverse workloads and ensure optimal resource allocation:
 - Compute for Copy activity
 - Compute for Pipeline activity such as Lookup
 - Compute for External activity such as Databricks notebook

To ensure consistent and comprehensive monitoring across all compute pools, we have implemented the same sets of monitoring metrics. 
 - Capacity Utilization
 - Available Capacity Percentage
 - Waiting Queue Length

Regardless of the type of compute pool being used, users can access and analyze a standardized set of metrics to gain insights into the performance and health of their data integration activities.

|Metric|Unit|Description|
|------|----|-----------|
|Copy capacity utilization of MVNet integration runtime|Percent|The maximum percentage of DIU utilization for managed vNet Integration runtime time-to-live copy activities within 1-minute window.|
|Copy available capacity percentage of MVNet integration runtime|Percent|The maximum percentage of available DIU for managed vNet Integration runtime time-to-live copy activities within 1-minute window.|
|Copy waiting queue length of MVNet integration runtime|Count|The waiting queue length of managed vNet Integration runtime time-to-live copy activities within 1-minute window.|
|Pipeline capacity utilization of MVNet integration runtime|Percent|The maximum percentage of DIU utilization for managed vNet Integration runtime pipeline activities within 1-minute window.|
|Pipeline available capacity percentage of MVNet integration runtime|Percent|The maximum percentage of available DIU for managed vNet Integration runtime pipeline activities within 1-minute window.|
|Pipeline waiting queue length of MVNet integration runtime|Count|The waiting queue length of managed vNet Integration runtime pipeline activities within 1-minute window.|
|External capacity utilization of MVNet integration runtime|Percent|The maximum percentage of DIU utilization for managed vNet Integration runtime external activities within 1-minute window.|
|External available capacity percentage of MVNet integration runtime|Percent|The maximum percentage of available DIU for managed vNet Integration runtime external activities within 1-minute window.|
|External waiting queue length of MVNet integration runtime|Count|The waiting queue length of managed vNet Integration runtime external activities within 1-minute window.|

## Using Metrics for Performance Optimization
By using these metrics, you can seamlessly track and assess the performance and robustness of your integration runtime within a managed virtual network. Moreover, you can uncover potential areas for continuous improvement by optimizing the compute settings and workflow to maximize efficiency. 

To provide further clarity on the practical application of these metrics, here are a few example scenarios:

### Balanced
If you observe that the Capacity Utilization is below 100% and the Available Capacity Percentage is high, it indicates that the compute resources you have reserved are being efficiently utilized. Additionally, if the Waiting Queue Length remains consistently low or experiences occasional short spikes, it's advisable to queue other activities until the Capacity Utilization reaches 100%. This ensures optimal utilization of resources and helps maintain a smooth workflow with minimal delays.

:::image type="content" source="media\monitor-managed-virtual-network-integration-runtime\monitor-managed-virtual-network-integration-runtime-balanced.png" alt-text="Screenshot of managed virtual network integration runtime balanced scenario.":::

### Performance-oriented
If you observe that the Capacity Utilization is consistently low, and the Waiting Queue Length remains consistently low or experiences occasional short spikes, it indicates that the compute resources you have reserved are higher than the actual demand for activities. In such cases, regardless of whether the Available Capacity Percentage is high or low, it's recommended to reduce the allocated compute resources to lower your costs. By rightsizing the compute to match the actual workload requirements, you can optimize your resource utilization and achieve cost savings without compromising the efficiency of your operations.

:::image type="content" source="media\monitor-managed-virtual-network-integration-runtime\monitor-managed-virtual-network-integration-runtime-performance-oriented.png" alt-text="Screenshot of managed virtual network integration runtime performance oriented scenario.":::

### Cost-Oriented
If you notice that all metrics, including Capacity Utilization, Available Capacity Percentage, and Waiting Queue Length, are high, it suggests that the compute resources you have reserved are insufficient for your activities. In this scenario, it's recommended to increase the allocated compute resources to reduce queue time. By adding more compute capacity, you can ensure that your activities have sufficient resources to execute efficiently, minimizing any delays caused by a crowded queue.

:::image type="content" source="media\monitor-managed-virtual-network-integration-runtime\monitor-managed-virtual-network-integration-runtime-cost-oriented.png" alt-text="Screenshot of managed virtual network integration runtime cost oriented scenario.":::

### Intermittent Activity Execution
If you notice that the Available Capacity Percentage fluctuates between low and high within a specific time period, it's likely due to the intermittent execution of your activities, where the Time-To-Live (TTL) period you have configured is shorter than the interval between your activities. This can have a significant impact on the performance of your workflow and can increase costs, as we charge for the warm-up time of the compute for up to 2 minutes.
To address this issue, there are two possible solutions. First, you can queue more activities to maintain a consistent workload and utilize the available compute resources more effectively. By keeping the compute continuously engaged, you can avoid the warm-up time and achieve better performance.
Alternatively, you can consider enlarging the TTL period to align with the interval between your activities. This ensures that the compute resources remain available for a longer duration, reducing the frequency of warm-up periods and optimizing cost-efficiency.
By implementing either of these solutions, you can enhance the performance of your workflow, minimize cost implications, and ensure a smoother execution of your intermittent activities.

:::image type="content" source="media\monitor-managed-virtual-network-integration-runtime\monitor-managed-virtual-network-integration-runtime-intermittent-activity.png" alt-text="Screenshot of managed virtual network integration runtime intermittent activity scenario.":::

## Next Steps
Advance to the following tutorial to learn about Managed Virtual Network: [Managed virtual network and managed private endpoints](managed-virtual-network-private-endpoint.md).
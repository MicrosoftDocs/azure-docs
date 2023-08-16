---
title: Azure Database for MySQL - Flexible Server storage iops
description: This article describes the storage IOPS in Azure Database for MySQL - Flexible Server.
ms.service: mysql
ms.subservice: flexible-server
ms.topic: conceptual
author: code-sidd 
ms.author: sisawant
ms.date: 07/20/2023
---

# Storage IOPS in Azure Database for MySQL - Flexible Server

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]


Storage IOPS (I/O Operations Per Second) refer to the number of read and write operations that can be performed by the storage system per second. Higher IOPS values indicate better storage performance, allowing your database to handle more simultaneous read and write operations, resulting in faster data retrieval and improved overall efficiency. When the IOPS setting is set too low, the database server may experience delays in processing requests, resulting in slow performance and reduced throughput. On the other hand, if the IOPS setting is set too high, it may lead to unnecessary resource allocation and potentially increased costs without significant performance improvements.

Azure database for MySQL Flexible Server currently offers two settings for IOPS management, Pre-provisioned IOPS and Autoscale IOPS.

## Pre-provisioned IOPS
Azure Database for MySQL Flexible Server offers pre-provisioned IOPS, allowing you to allocate a specific number of IOPS to your MySQL database server. This setting ensures consistent and predictable performance for your workloads. With pre-provisioned IOPS, you can define a specific IOPS limit for your storage volume, guaranteeing the ability to handle a certain number of requests per second. This results in a reliable and assured level of performance.

Moreover, Additional IOPS with pre-provisioned refers to the flexibility of increasing the provisioned IOPS for the storage volume associated with the server. You have the option to add extra IOPS beyond the default provisioned level, allowing you to customize the performance aligning with your workload requirements at any time.

## Autoscale IOPS

Autoscale IOPS offer the flexibility to scale IOPS on demand, eliminating the need to pre-provision a specific amount of IO per second. By enabling Autoscale IOPS, your server will automatically adjust IOPS based on workload requirements. With the Autoscale IOPS featured enable, you can now enjoy worry free IO management in Azure Database for MySQL - Flexible Server because the server scales IOPs up or down automatically depending on workload needs. 
With this feature, you'll only be charged for the IO your server actually utilizes, avoiding unnecessary provisioning and expenses for underutilized resources. This ensures both cost savings and optimal performance, making it a smart choice for managing your database workload efficiently.


## Monitor Storage performance
Monitoring Storage IOPS utilization is easy with [Metrics available under Monitoring](./concepts-monitoring.md#list-of-metrics) .  

#### Overview
To obtain a comprehensive view of the IO utilization for the selected time period.
Navigate to the Monitoring in the Azure portal for Azure Database for MySQL Flexible Server under the Overview blade.

[:::image type="content" source="./media/concepts-storage-iops/1-overview.png" alt-text="Screenshot of overview metrics.":::](./media/concepts-storage-iops/1-overview.png#lightbox)

#### Enhanced Metrics Workbook
- Navigate to Workbooks under Monitoring section on your Azure portal.
- Select "Enhanced Metrics" workbook.
- Check for Storage IO Percentage metrics under Overview section of the workbook.

[:::image type="content" source="./media/concepts-storage-iops/2-workbook.png" alt-text="Screenshot of enhanced metrics.":::](./media/concepts-storage-iops/2-workbook.png#lightbox)

#### Metrics under Monitoring
- Navigate to Metrics, under  Monitoring section on your Azure portal.
- Select "Add metric" option.
- Choose “Storage IO Percent” from the drop-down of available metrics.
- Choose "Storage IO count" from the drop-down of available metrics.

[:::image type="content" source="./media/concepts-storage-iops/3-metrics.png" alt-text="Screenshot of monitoring metrics.":::](./media/concepts-storage-iops/3-metrics.png#lightbox)


## Selecting the Optimal IOPS Setting

Having learned how to monitor your IOPS usage effectively, you're now equipped to explore the best settings for your server. When choosing the IOPS setting for your Azure Database for MySQL Flexible Server, several important factors should be considered. Understanding these factors can help you make an informed decision to ensure the best performance and cost-efficiency for your workload.

### Performance Optimization

With Autoscale IOPS, consistent requirements can be met for workload, which is predictable without facing the drawback of storage throttling and manual interaction to add more IOPS.
If your workload has consistent throughput or requires consistent IOPS, Pre-provisioned IOPS may be preferable. It provides a predictable performance level, and the fixed allocation of IOPS correlates with workload within the specified limits.
Although for any requirement of higher throughput from usual requirement, Additional IOPS can be allotted with Pre-provisioned IOPS, which requires manual interaction and understanding of throughput increase time.

### Throttling impact

Consider the impact of throttling on your workload. If the potential performance degradation due to throttling is a concern, Autoscale IOPS can dynamically handle workload spikes, minimizing the risk of throttling and maintaining performance to optimal level.
 
Ultimately, the decision between Autoscale and Pre-provisioned IOPS depends on your specific workload requirements and performance expectations. Analyze your workload patterns, evaluate the cost implications, and consider the potential impact of throttling to make an informed choice that aligns with your priorities.
By considering the specific characteristics of your database workload, such as traffic fluctuations, query patterns, and performance requirements, you can make an informed decision regarding the choice between Autoscale and Pre-provisioned IOPS.


| **Workload Considerations** | **Pre-Provisioned IOPS** | **Autoscale IOPS** |
|---|---|---|
| Workloads with consistent and predictable I/O patterns | Recommended as it utilizes only  provisioned IOPS  | Compatible, no manual provisioning of IOPS required   |
| Workloads with varying usage patterns | Not Recommended as it may not provide efficient performance during high usage periods. | Recommended  as it automatically adjusts to handle varying workloads |
| Workloads with dynamic growth or changing performance need | Not recommended as it requires constant adjustments as per changing IOPS requirement | Recommended as no extra settings is required for specific throughput requirement  |

### Cost considerations
If you have a fluctuating workload with unpredictable peaks, opting for Autoscale IOPS may be more cost-effective. It ensures that you only pay for the higher IOPS used during peak periods, offering flexibility and cost savings. Pre-provisioned IOPS, while providing consistent and max IOPS, may come at a higher cost depending on the workload. Consider the trade-off between cost and performance required from your server.

### Test and Evaluate
If unsure about the optimal IOPS setting, consider running performance tests using both Autoscale IOPS and Pre-provisioned IOPS. Assess the results and determine which setting meets your workload requirements and performance expectations.

**Example workloads: E-commerce websites**

If you own an e-commerce website that experiences fluctuations in traffic throughout the year. During normal periods, the workload is moderate, but during holiday seasons or special promotions, the traffic surges exponentially. 

Autoscale IOPS: With Autoscale IOPS, your database can dynamically adjust its IOPS to handle the increased workload during peak periods. When traffic spikes, such as during Black Friday sales, the auto scale feature allows your database to seamlessly scale up the IOPS to meet the demand. This ensures smooth and uninterrupted performance, preventing slowdowns or service disruptions. After the peak period, when the traffic subsides, the IOPS scale back down, allowing for cost savings as you only pay for the resources utilized during the surge.
 
Pre-provisioned IOPS: If you opt for pre-provisioned IOPS, you need to estimate the maximum workload capacity and allocate a fixed number of IOPS accordingly. However, during peak periods, the workload might exceed the predetermined IOPS limit. As a result, the storage I/O could throttle, impacting performance and potentially causing delays or timeouts for your users.

**Example workloads: Reporting /Data Analytics Platforms**

Suppose you have Azure Database for MySQL Flexible Server used for data analytics where users submit complex queries and large-scale data processing tasks. 
The workload pattern is relatively consistent, with a steady flow of queries throughout the day.

Pre-provisioned IOPS: With pre-provisioned IOPS, you can select a suitable number of IOPS based on the expected workload. As long as the chosen IOPS adequately handle the daily query volume, there's no risk of throttling or performance degradation. This approach provides cost predictability and allows you to optimize resources efficiently without the need for dynamic scaling.

Autoscale IOPS: The Autoscale feature might not provide significant advantages in this case. Since the workload is consistent, the database can be provisioned with a fixed number of IOPS that comfortably meets the demand. Autoscaling might not be necessary as there are no sudden bursts of activity that require additional IOPS. By using Pre-provisioned IOPS, you have predictable performance without the need for scaling, and the cost is directly tied to the allocated storage.


## Frequent Asked Questions 

#### How to move from pre-provisioned IOPS to Autoscale IOPS?
- Access your Azure portal and locate the relevant Azure database for MySQL Flexible Server.
- Go to the Settings blade and choose the Compute + Storage section.
- Within the IOPS section, opt for Auto Scale IOPS and save the settings to apply the modifications.

#### How soon does Autoscale IOPS take effect after making the change?
Once you enable Autoscale IOPS for your Azure database for MySQL Flexible Server and save the settings, the changes take effect immediately after the deployment to the resource has completed successfully. This means that the Autoscale IOPS feature will be applied to your database without any delay.

#### How to know when IOPS have scaled up and scaled down when the server is using Autoscale IOPS feature? Or Can I monitor IOPS usage for my server?
Refer to [“Monitor Storage performance”](#monitor-storage-performance) section, which will help to identify if your server has scaled up or scaled down during specific time window.

#### Can I switch between Autoscale IOPS and pre-provisioned IOPS later?
Yes, you can move back to pre-provisioned IOPS by opting for pre-provisioned IOPS under Compute + Storage section under Settings blade.

#### How do I know how much IOPS have been utilized for Azure database for MySQL Flexible Server?
My navigating to Monitoring under Overview section. Or navigate to [IO count metrics](./concepts-monitoring.md#list-of-metrics) under Monitoring blade. IO count metric gives sum of IOPS used by server in the selected timeframe.



## Next steps
- Learn more about [service limitations](./concepts-limitations.md).
- Learn more about [Pricing](./concepts-service-tiers-storage.md#pricing) information.




---
title: Azure Storage migration execution guide
description: The Azure Storage migration execution guide describes basic guidance for storage migration execution stages.
author: bapic
ms.author: bchakra
ms.topic: concept-article 
ms.date: 08/11/2025
ms.service: azure-storage
ms.subservice: storage-common-concepts
---

<!--
Initial score: 78 (522/14)
Current score: 100 (634/0)
-->

# Execute the migration

The execution phase is the final phase in the migration process. All data movement and migration tasks occur in this phase. Typically, you take an iterative approach by working through the execution several times to ensure that all changes and updates are captured. This process helps to accomplish an easier switchover and keep data loss to a minimum. 

The execution phase consists of the following steps:

1. **Initial migration:** Beginning with the bulk copy, migrate the initial set of data using the most appropriate recommended tools.
2. **Iterate**: You might discover errors that require remediation, and possibly rerunning some of the tasks. Optimize concurrency settings if needed to improve speed and efficiency.
3. **Incremental sync:** If the source data is dynamic, changes at the source are expected during the initial seeding or migration process. In this case, run incremental synchronization to sync any changes. You can repeat this step several times if there are numerous changes. The goal of running multiple sync operations is to reduce the time required for the final cutover. Inactive data, archival data, or backup data that remains static can be excluded from this step.
4. **Final cutover to Azure:**  The final cutover step involves consuming that active data located at the target destination and retiring the source data. Before scheduling a final cutover window, however, freeze all source changes and schedule sufficient downtime to run the final incremental sync. Verify that all last-minute changes are captured in Azure, and update configurations so users and applications now point to the Azure target location.
5. **Post migration tasks:** After the target is active, you need to complete a thorough data validation to ensure all appropriate security, monitoring, and protection mechanisms are in place. These validation activities differ based on your target service and workloads. 

The following examples include best-practice recommendations for post-migration validation using Azure Blob Storage.

- [Data protection](../blobs/security-recommendations.md#data-protection)
- [Identity and access management](../blobs/security-recommendations.md#identity-and-access-management)
- [Networking](../blobs/security-recommendations.md#networking)
- [Monitoring](../blobs/monitor-blob-storage.md#monitor-azure-blob-storage) and [monitoring best practices](../blobs/blob-storage-monitoring-scenarios.md)

### Best practices

The following recommendations contain best practices that should be followed during your Azure migration. These best practices are gleaned from our experience with both small and enterprise-level customers, and are intended to be a resource for IT pros.

- **Ensure that there are no concurrent or overlapping changes to the target dataset within Azure until all data is migrated from the source.** Unexpected changes within both the target and source might lead to unexpected failures and data loss.
- **When migrating an application workload, don't migrate the application's data and infrastructure separately.** Plan to move the application and its unstructured data together - or at least within the closest possible timeframe. Leaving data and application infrastructure separated between on-premises and Azure might cause latency and lead to application failures and unexpected downtimes. Whenever possible, perform necessary proof-of-concept testing to validate application requirements.
- **Avoid direct changeovers or *"big-bang cutovers"*.** Instead of replacing your previous system abruptly with no transition period, aim to reduce downtime at cutover by planning the cutover window during off-peak usage hours. Communicate to stakeholders about any read-only period needed well in advance.
- **Migrate in parallel streams wherever possible to accelerate throughput.** Ensure that source systems aren't overloaded, and use bandwidth throttling if necessary to avoid performance degradation.
- **Perform a sample migration using a representative data sample before beginning the full run.** This exercise can help identify potential issues and validate your migration approach.
- **Maintain a migration log throughout the execution phase, monitoring all activities.** Record the details surrounding each workload's transfer, including start time, duration, issues encountered, and their resolution. These details help with accountability and future audits or post-mortem analysis.
- **After the final cutover, retain the source data in a read-only state as a fallback.** Only decommission source data once you're confident the Azure copy is complete and correct.
---
title: Azure Storage migration execution guide
description: Azure Storage migration execution guide describes basic guidance for storage migration execution stages
author: bapic
ms.author: bapic
ms.topic: concept-article 
ms.date: 08/11/2025
ms.service: azure-storage
ms.subservice: storage-common-concepts
---
# Execute the migration

The migration phase is the final migration step that does data movement and migration. Typically, you'll run through the migration phase several times to accomplish an easier switchover. The migration phase consists of the following steps:

1. **Initial migration:** Begin with the bulk copy, move the initial bulk data using one of the appropriate/recommended tools.
2. **Iterate**: You might discover errors that need fixing and rerunning some of the tasks. Optimize concurrency settings if needed to improve speed etc.
3. **Incremental syncs:** If the source data is not static and changes are expected at the source during the initial seed/migration process, run incremental synchronization to catch up on changes. You can repeat this step several times if there are numerous changes. The goal of running multiple resync operations is to reduce the time it takes for the final step. For inactive data and for data that has no changes (like backup or archive data), you can skip this step.
4. **Final Cutover & Switch to Azure:**  The final switchover step switches the active usage of the data from the source to the target and retires the source. Schedule a final cutover window, freeze changes on source if possible (downtime) and run final incremental sync. Verify last minute changes are captured in Azure and update configurations so users and applications now point to the Azure location.
5. **Post migration tasks:** Once target is active, you need to complete data validation and ensure all appropriate security, monitoring, protection mechanisms are in place. Depending on your target service and workloads, the activities will differ. Here are a few more recommendations for blob storage:

    - [Data protection](/azure/storage/blobs/security-recommendations)
    - [Identity and access management](/azure/storage/blobs/security-recommendations)
    - [Networking](/azure/storage/blobs/security-recommendations)
    - [Monitoring](/azure/storage/blobs/monitor-blob-storage) & [monitoring best practices](/azure/storage/blobs/blob-storage-monitoring-scenarios)

### Best practices

* Ensure no concurrent or overlapping changes to the target dataset in Azure until entire data is migrated from the source. Unexpected changes both in target and source may lead to failures or data loss. 
* Do not migrate the data and application infrastructure separately. Plan to move the application and its unstructured data together or at least in close timeframes. Leaving data on-premises and applications in Azure may lead to latency and retriable errors leading to application failures, negative user experiences and unexpected downtimes. It is advisable to perform necessary PoC tests wherever possible (keeping in mind application needs).
* Avoid big-bang cutovers and aim to reduce downtime at cutover. Plan the cutover window at a low-usage time and communicate to stakeholders about any read-only period needed
* Migrate in parallel streams wherever possible to accelerate throughput. *Be mindful* not to overload source systems - throttle if needed so you don't impact production use
* Do a trial migration on a representative sample of data before the full run
* Throughout execution, maintain a migration log. Record what was transferred when, any issues encountered, and their resolution. This helps with accountability and any future audit or post-mortem analysis
* After the final cutover, keep the source in read-only a bit longer as a fallback. Only decommission source data once you're confident the Azure copy is complete and correct.
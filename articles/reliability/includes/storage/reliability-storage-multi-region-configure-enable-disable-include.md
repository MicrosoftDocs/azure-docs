---
 title: Description of Azure Storage geo-redundant storage configuration steps for existing storage accounts
 description: Description of Azure Storage geo-redundant storage configuration steps for existing storage accounts
 author: anaharris-ms
 ms.service: azure
 ms.topic: include
 ms.date: 07/02/2024
 ms.author: anaharris
 ms.custom: include file
---

- **Enable geo-redundancy on an existing storage account.** To convert an existing storage account to geo-redundant storage (GRS), see [Change how a storage account is replicated](/azure/storage/common/redundancy-migration) for step-by-step conversion procedures.

  > [!WARNING]
  > After your account is reconfigured for geo-redundancy, it might take a significant amount of time before existing data in the new primary region is fully copied to the new secondary region.
  >
  > **To avoid a major data loss**, check the value of the [Last Sync Time property](/azure/storage/common/last-sync-time-get) before you initiate an unplanned failover. To evaluate potential data loss, compare the last sync time to the last time that data was written to the new primary region.

- **Disable geo-redundancy.** Convert GRS accounts back to single-region configurations like locally redundant storage (LRS) or zone-redundant storage (ZRS) by using the same redundancy configuration change process.

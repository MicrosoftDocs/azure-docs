---
author: normesta
ms.service: azure-storage-actions
ms.topic: include
ms.date: 07/15/2025
ms.author: normesta
---

Storage accounts with GRS and GZRS replicate data to a secondary region in the event of storage account failovers. The business continuity of storage actions significantly depends on the redundancy configuration of the target storage account. Storage accounts that are configured with geo-redundancy benefit from an automated failover process. This automatic management ensures that future task assignment run iterations, whether single or recurrent, executes in the secondary region without issues. However, storage tasks that were in progress at the time of failover might encounter failures. New storage tasks and storage task assignments continue to function as expected.

Consistent monitoring of the storage account is crucial. With a failover, you should thoroughly review task reporting and monitoring to verify the successful completion of all blob operations and to identify any discrepancies that need attention.
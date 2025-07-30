---
 title: Description of Azure Storage geo-redundant storage region-down experience
 description: Description of Azure Storage geo-redundant storage region-down experience
 author: anaharris-ms
 ms.service: azure
 ms.topic: include
 ms.date: 07/02/2024
 ms.author: anaharris
 ms.custom: include file
---

This section describes what to expect when a storage account is configured for geo-redundancy and there's an outage in the primary region.

- **Customer-managed failover (unplanned)**: An unplanned failover is intended to be used when storage in the primary region is unavailable.

    - **Detection and response:** In the unlikely event that your storage account is unavailable in your primary region, you can consider initiating a customer-managed unplanned failover. To make this decision, consider the following factors:

      - Whether [Azure Resource Health](/azure/service-health/resource-health-overview) show problems accessing the storage account in your primary region.
      - Whether Microsoft has advised you to perform failover to another region.

      > [!WARNING]
      > An unplanned failover [can result in data loss](/azure/storage/common/storage-disaster-recovery-guidance#anticipate-data-loss-and-inconsistencies). Before initiating a customer-managed failover, decide whether the risk of data loss is justified by the restoration of service.
    
    - **Active requests:** During the failover process, both the primary and secondary storage account endpoints become temporarily unavailable for both reads and writes. Any active requests might be dropped, and client applications need to retry after the failover completes.

    - **Expected data loss:** During an unplanned failover, it's likely that you will have some data loss. This is because of the asynchronous replication lag, which means that recent writes may not be replicated. You can check the [Last Sync time](/azure/storage/common/last-sync-time-get) to understand how much data could be lost during an unplanned failover. Typically the data loss is expected to be less than 15 minutes, but that's not guaranteed.

    - **Expected downtime:** Failover typically completes within 60 minutes, depending on the account size and complexity.

    - **Traffic rerouting:** As the failover completes, Azure automatically updates the storage account endpoints so that applications don't need to be reconfigured. If your application keeps DNS entries cached, it might be necessary to clear the cache to ensure that the application sends traffic to the new primary. 

    - **Post-failover configuration:** After an unplanned failover completes, your storage account in the destination region uses the LRS tier. If you need to geo-replicate it again, you need to re-enable GRS and wait for the data to be replicated to the new secondary region.

    For more information on initiating customer-managed failover, see [How customer-managed (unplanned) failover works](/azure/storage/common/storage-failover-customer-managed-unplanned) and [Initiate a storage account failover](/azure/storage/common/storage-initiate-account-failover).

- **Customer-managed failover (planned)**: A planned failover is intended to be used when storage remains operational in the primary region, but you need to fail over your whole solution to a secondary region for another reason.

    - **Detection and response:** You're responsible for deciding to fail over. You'd typically do so if you need to fail over between regions even though your storage account is healthy. For example, you might trigger a failover when there's a major outage of another application component that you can't recover from in the primary region.

    - **Active requests:** During the failover process, both the primary and secondary storage account endpoints become temporarily unavailable for both reads and writes. Any active requests might be dropped, and client applications need to retry after the failover completes.

    - **Expected data loss:** No data loss is expected because the failover process waits for all data to be synchronized.

    - **Expected downtime:** Failover typically completes within 60 minutes, depending on the account size and complexity. During the failover process, both the primary and secondary storage account endpoints become temporarily unavailable for both reads and writes.

    - **Traffic rerouting:** As the failover completes, Azure automatically updates the storage account endpoints so that applications don't need to be reconfigured. If your application keeps DNS entries cached, it might be necessary to clear the cache to ensure that the application sends traffic to the new primary. 

    - **Post-failover configuration:** After a planned failover completes, your storage account in the destination region continues to be geo-replicated and remains on the GRS tier.

    For more information on initiating customer-managed failover, see [How customer-managed (planned) failover works](/azure/storage/common/storage-failover-customer-managed-planned) and [Initiate a storage account failover](/azure/storage/common/storage-initiate-account-failover).

- **Microsoft-managed failover**: In the rare case of a major disaster, where Microsoft determines the primary region is permanently unrecoverable, Microsoft might initiate automatic failover to the secondary region. This process is managed entirely by Microsoft and requires no customer action. The amount of time that elapses before failover occurs depends on the severity of the disaster and the time required to assess the situation.

  > [!IMPORTANT]
  > Use customer-managed failover options to develop, test, and implement your disaster recovery plans. **Do not rely on Microsoft-managed failover**, which might only be used in extreme circumstances. A Microsoft-managed failover would likely be initiated for an entire region. It can't be initiated for individual storage accounts, subscriptions, or customers. Failover might occur at different times for different Azure services. We recommend you use customer-managed failover.

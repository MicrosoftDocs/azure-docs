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

- **Customer-managed failover (unplanned):** Use an unplanned failover when storage in the primary region is unavailable.

    - **Detection and response:** In the unlikely event that your storage account is unavailable in your primary region, you can consider initiating a customer-managed unplanned failover. To make this decision, consider the following factors:

      - Whether [Azure Resource Health](/azure/service-health/resource-health-overview) shows problems accessing the storage account in your primary region
      
      - Whether Microsoft advises you to perform failover to another region

      > [!WARNING]
      > An unplanned failover [can result in data loss](/azure/storage/common/storage-disaster-recovery-guidance#anticipate-data-loss-and-inconsistencies). Before you initiate a customer-managed failover, decide whether the restoration of service justifies the risk of data loss.
    
    - **Notification:** Region failure events can be monitored through Azure Service Health and Resource Health. Set up alerts on these services to receive notifications of region-level issues.

    - **Active requests:** During the failover process, both the primary and secondary storage account endpoints become temporarily unavailable for both reads and writes. Any active requests might be dropped, and client applications need to retry after the failover completes.

    - **Expected data loss:** Data loss is common during an unplanned failover because of the asynchronous replication lag, which means that recent writes might not be replicated. You can check the [Last Sync Time property](/azure/storage/common/last-sync-time-get) to understand how much data might be lost during an unplanned failover. You can typically expect the data loss to be less than 15 minutes, but that time isn't guaranteed.

    - **Expected downtime:** Failover typically completes within 60 minutes, depending on the account size and complexity.

    - **Traffic rerouting:** As the failover completes, Azure automatically updates the storage account endpoints so that applications don't need to be reconfigured. If your application keeps Domain Name System (DNS) entries cached, it might be necessary to clear the cache to ensure that the application sends traffic to the new primary region. 

    - **Post-failover configuration:** After an unplanned failover completes, your storage account in the destination region uses the locally redundant storage (LRS) tier. If you need to geo-replicate it again, you need to re-enable geo-redundant storage (GRS) and wait for the data to be replicated to the new secondary region.

    For more information about how to initiate customer-managed failover, see [How customer-managed (unplanned) failover works](/azure/storage/common/storage-failover-customer-managed-unplanned) and [Initiate a storage account failover](/azure/storage/common/storage-initiate-account-failover).

- **Customer-managed failover (planned):** Use a planned failover when storage remains operational in the primary region, but you need to fail over your whole solution to a secondary region for another reason.

    - **Detection and response:** You're responsible for deciding to fail over. You typically make this decision if you need to fail over between regions even though your storage account is healthy. For example, you might trigger a failover when there's a major outage of another application component that you can't recover from in the primary region.

    - **Notification:** Region failure events can be monitored through Azure Service Health and Resource Health. Set up alerts on these services to receive notifications of region-level issues.

    - **Active requests:** During the failover process, both the primary and secondary storage account endpoints become temporarily unavailable for both reads and writes. Any active requests might be dropped, and client applications need to retry after the failover completes.

    - **Expected data loss:** No data loss is expected because the failover process waits for all data to be synchronized.

    - **Expected downtime:** Failover typically completes within 60 minutes, depending on the account size and complexity. During the failover process, both the primary and secondary storage account endpoints become temporarily unavailable for both reads and writes.

    - **Traffic rerouting:** As the failover completes, Azure automatically updates the storage account endpoints so that applications don't need to be reconfigured. If your application keeps DNS entries cached, it might be necessary to clear the cache to ensure that the application sends traffic to the new primary region. 

    - **Post-failover configuration:** After a planned failover completes, your storage account in the destination region continues to be geo-replicated and remains on the GRS tier.

    For more information about how to initiate customer-managed failover, see [How customer-managed (planned) failover works](/azure/storage/common/storage-failover-customer-managed-planned) and [Initiate a storage account failover](/azure/storage/common/storage-initiate-account-failover).

- **Microsoft-managed failover:** In the rare case of a major disaster, where Microsoft determines that the primary region is permanently unrecoverable, Microsoft might initiate automatic failover to the secondary region. This process is managed entirely by Microsoft and requires no customer action. The amount of time that elapses before failover occurs depends on the severity of the disaster and the time required to assess the situation.

  - **Notification:** Region failure events can be monitored through Azure Service Health and Resource Health. Set up alerts on these services to receive notifications of region-level issues.

  > [!IMPORTANT]
  > Use customer-managed failover options to develop, test, and implement your disaster recovery plans. **Don't rely on Microsoft-managed failover**, which might only be used in extreme circumstances. A Microsoft-managed failover is likely initiated for an entire region. It can't be initiated for individual storage accounts, subscriptions, or customers. Failover might occur at different times for different Azure services. We recommend that you use customer-managed failover.

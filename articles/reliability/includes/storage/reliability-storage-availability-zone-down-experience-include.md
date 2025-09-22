---
 title: Description of Azure Storage availability zone zone-down experience
 description: Description of Azure Storage availability zone zone-down experience
 author: anaharris-ms
 ms.service: azure
 ms.topic: include
 ms.date: 07/02/2024
 ms.author: anaharris
 ms.custom: include file
---

- **Detection and response:** Microsoft automatically detects zone failures and initiates recovery processes. No customer action is required for zone-redundant storage (ZRS) accounts.

    If a zone becomes unavailable, Azure undertakes networking updates such as Domain Name System (DNS) repointing.

- **Notification**: Azure Storage doesn't notify you when a zone is down. However, you can use [Azure Resource Health](/azure/service-health/resource-health-overview) to monitor for the health of your storage account. You can also use [Azure Service Health](/azure/service-health/overview) to understand the overall health of the Azure Storage service, including any zone failures.
        
    Set up alerts on these services to receive notifications of zone-level problems. For more information, see [Create Service Health alerts in the Azure portal](/azure/service-health/alerts-activity-log-service-notifications-portal) and [Create and configure Resource Health alerts](/azure/service-health/resource-health-alert-arm-template-guide).

- **Active requests:** In-flight requests might be dropped during the recovery process and should be retried. Applications should [implement retry logic](#transient-faults) to handle these temporary interruptions.

- **Expected data loss:** No data loss occurs during zone failures because data is synchronously replicated across multiple zones before write operations complete.

- **Expected downtime:** A small amount of downtime, typically, a few seconds, might occur during automatic recovery as traffic is redirected to healthy zones. When you design applications for ZRS, follow practices for [transient fault handling](#transient-faults), including implementing retry policies with exponential back-off.

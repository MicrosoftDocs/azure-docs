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

- **Detection and response:** Microsoft automatically detects zone failures and initiates recovery processes. No customer action is required for zone-redundant storage accounts.

    If a zone becomes unavailable, Azure undertakes networking updates such as Domain Name System (DNS) repointing.

- **Active requests:** In-flight requests might be dropped during the recovery process and should be retried. Applications should [implement retry logic](#transient-faults) to handle these temporary interruptions.

- **Expected data loss:** No data loss occurs during zone failures because data is synchronously replicated across multiple zones before write operations complete.

- **Expected downtime:** A small amount of downtime - typically, a few seconds - may occur during automatic recovery as traffic is redirected to healthy zones. When designing applications for ZRS, follow practices for [transient fault handling](#transient-faults), including implementing retry policies with exponential back-off.

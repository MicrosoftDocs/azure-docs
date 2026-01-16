---
 title: Description of Azure Storage availability zone zone-down experience - active requests
 description: Description of Azure Storage availability zone zone-down experience - active requests
 author: anaharris-ms
 ms.service: azure
 ms.topic: include
 ms.date: 07/02/2024
 ms.author: anaharris
 ms.custom: include file
---

In-flight requests might be dropped during the recovery process and should be retried. Applications should [implement retry logic](#resilience-to-transient-faults) to handle these temporary interruptions.

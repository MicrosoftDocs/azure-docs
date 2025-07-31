---
 title: Description of Azure Storage availability zone failback experience
 description: Description of Azure Storage availability zone failback experience
 author: anaharris-ms
 ms.service: azure
 ms.topic: include
 ms.date: 07/02/2024
 ms.author: anaharris
 ms.custom: include file
---

When the failed availability zone recovers, Azure Storage automatically restores normal operations across all of the availability zones. During failback, the service automatically ensures data consistency by synchronizing any operations that occurred during the outage period.

---
 title: Description of Azure Storage availability zone zone-down experience - detection and response
 description: Description of Azure Storage availability zone zone-down experience - detection and response
 author: anaharris-ms
 ms.service: azure
 ms.topic: include
 ms.date: 07/02/2024
 ms.author: anaharris
 ms.custom: include file
---

Microsoft automatically detects zone failures and initiates recovery processes. No customer action is required for zone-redundant storage (ZRS) accounts.

If a zone becomes unavailable, Azure undertakes networking updates such as Domain Name System (DNS) repointing.

---
 title: Description of Azure Storage geo-redundant storage failover types
 description: Description of Azure Storage geo-redundant storage failover types
 author: anaharris-ms
 ms.service: azure
 ms.topic: include
 ms.date: 07/02/2024
 ms.author: anaharris
 ms.custom: include file
---

#### Failover types

Azure Storage supports three types of failover for different scenarios.

- **Customer-managed unplanned failover:** You're responsible for initiating recovery if there's a region-wide storage failure in your primary region.

- **Customer-managed planned failover:** You are responsible for initiating recovery if another part of your solution has a failure in your primary region, and you need to switch your whole solution over to a secondary region. Use a planned failover when storage remains operational in the primary region, but you need to fail over your whole solution to a secondary region, such as for disaster recovery drills designed to ensure compliance and audit requirements.

- **Microsoft-managed failover:** In exceptional circumstances, Microsoft might initiate failover for all geo-redundant storage (GRS) accounts in a region. However, Microsoft-managed failover is a last resort and is expected to only be performed after an extended period of outage. You shouldn't rely on Microsoft-managed failover.

GRS accounts can use any of these failover types. You don't need to preconfigure a storage account to use any of the failover types ahead of time.

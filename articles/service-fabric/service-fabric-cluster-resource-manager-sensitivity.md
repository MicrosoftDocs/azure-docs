---
title: Service sensitivity
description: An introduction to service sensitivity and how to set/get service sensitivity description
author: tracygooo

ms.topic: conceptual
ms.date: 09/07/2023
ms.author: jinghuafeng
---

# Introduction to service sensitivity
Service Fabric Cluster Resource Manager provides the interface of move cost to allow the adjustment of the service failover priority when movements has to be conducted for balancing, defragmentation, and other requirements. However, move cost has a few limitations to satisfy the customers' needs. For instance, Move cost cannot explicitly optimize for an individual move as Cluster Resource Manager (CRM) relies on the total score for all movements made in a single run. Move cost does not function when CRM conducts swaps as all replicas share the same swap cost, which results in the failure of limiting the swap failover for sensitive replicas.  Another limitation is the move cost only provides four possible values  (Zero, Low, Medium, High) and one special value (Very High) to adjust the priority of a replica. This does not provide enough flexibility for differentiation of replica sensitivity to failover. Moreover, even Very high move cost (VHMC) does not provide enough protection on a high-priority replica, i.e., the replica with VHMC is allowed to be moved in quite a few cases.

CRM sensitivity feature offers an option for service fabric customers to finely tune the sensitivity of a service replica. This allows the customers to set levels of SLOs to their interruptions in service.

## Enable service sensitivity
* XML
* Json

## Set service sensitivity
### Use service Manifest
### Use Powershell API
### Use C# API


# Next steps

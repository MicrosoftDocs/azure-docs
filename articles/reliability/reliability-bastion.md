---
title: Reliability in Azure Bastion
description: Find out about reliability in Azure Bastion  
author: anaharris-ms 
ms.author: anaharris
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: bastion
ms.date: 05/01/2024
---


# Reliability in Azure Bastion

This article describes reliability support in Azure Bastion and covers both intra-regional resiliency with [availability zones](#availability-zone-support) and information on [cross-region recovery and business continuity](#cross-region-disaster-recovery-and-business-continuity). 



For a more detailed overview of reliability in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview).

## Availability zone support

[!INCLUDE [Availability zone description](includes/reliability-availability-zone-description-include.md)]

Currently, by default, new Bastion deployments don't support zone redundancies. Previously deployed bastions might or might not be zone-redundant. The exceptions are Bastion deployments in Korea Central and Southeast Asia, which do support zone redundancies.

### Prerequisites



### Cross-region disaster recovery in multi-region geography

[!INCLUDE [introduction to disaster recovery](includes/reliability-disaster-recovery-description-include.md)]

Azure Bastion is deployed within virtual networks or peered virtual networks, and is associated with an Azure region. You're responsible for deploying Azure Bastion to a Disaster Recovery (DR) site virtual network. 


If there's an Azure region failure:

1. Perform a failover operation for your VMs to the DR region. For more information on diaster recovery failover for VMs, see [Reliability in Azure Virtual Machines](./reliability-virtual-machines.md).

2. Use the Azure Bastion host that's deployed in the DR region to connect to the VMs that are now deployed there.

## Related content

> [!div class="nextstepaction"]
> [Reliability in Azure](/azure/availability-zones/overview)

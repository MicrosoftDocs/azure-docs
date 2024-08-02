---
title: Reliability in Azure Bastion
description: Find out about reliability in Azure Bastion  
author: anaharris-ms 
ms.author: anaharris
ms.topic: reliability-article
ms.custom: subject-reliability
ms.service: azure-bastion
ms.date: 06/24/2024
---


# Reliability in Azure Bastion

This article describes reliability support in Azure Bastion and covers both intra-regional resiliency with [availability zones](#availability-zone-support) and information on [cross-region recovery and business continuity](#cross-region-disaster-recovery-and-business-continuity). 

For a more detailed overview of reliability in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview).

## Availability zone support

[!INCLUDE [Availability zone description](includes/reliability-availability-zone-description-include.md)]


Bastion support for availability zones with a [zone-redundant](./availability-zones-overview.md#zonal-and-zone-redundant-services) configuration is currently in preview. 

Previously deployed Bastion resources may be zone-redundant and are limited to the following regions:
- Korea Central 
- Southeast Asia

### Prerequisites

For a zone-redundant deployment, your Bastion resource must be in one of the following regions:

- East US
- Australia East
- East US 2
- Central US
- Qatar Central
- South Africa North
- West Europe
- West US 2
- North Europe
- Sweden Central
- UK South
- Canada Central

### SLA improvements

There's no change to pricing for availability zone support.

### Create a resource with availability zones enabled

To choose a region for a zone-redundant configuration:

1. Go to the [Azure portal](https://portal.azure.com).
1. [Create your Bastion resource](/azure/bastion/tutorial-create-host-portal).

    - For **Region**, select one of the regions listed in the [Prerequisites section](#prerequisites).
    - For **Availability zone**, select the zones.

    :::image type="content" source="./media/reliability-bastion/create-bastion-zonal.png" alt-text="Screenshot showing the Availability zone setting while creating a Bastion resource.":::

>[!NOTE]
>You can't change the availability zone setting after your Bastion resource is deployed. 


### Zone down experience

When a zone goes down, the VM and Bastion should still be accessible. See [Reliability in Virtual Machines: Zone down experience](./reliability-virtual-machines.md#zone-down-experience) for more information on the VM zone down experience.

### Migrate to availability zone support

Migration from non-availability zone support to availability zone support isn't possible. Instead, you need to [create a Bastion resource](/azure/bastion/tutorial-create-host-portal) in the new region and delete the old one.

### Cross-region disaster recovery and business continuity

[!INCLUDE [introduction to disaster recovery](includes/reliability-disaster-recovery-description-include.md)]

Azure Bastion is deployed within virtual networks or peered virtual networks, and is associated with an Azure region. You're responsible for deploying Azure Bastion to a Disaster Recovery (DR) site virtual network. 


If there's an Azure region failure:

1. Perform a failover operation for your VMs to the DR region. For more information on diaster recovery failover for VMs, see [Reliability in Azure Virtual Machines](./reliability-virtual-machines.md).

2. Use the Azure Bastion host that's deployed in the DR region to connect to the VMs that are now deployed there.

## Related content

> [!div class="nextstepaction"]
> [Reliability in Azure](/azure/availability-zones/overview)

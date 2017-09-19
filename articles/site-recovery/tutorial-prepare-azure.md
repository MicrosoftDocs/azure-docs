---
title: Prepare Azure resources for replication of on-premises machines using Azure Site Recovery | Microsoft Docs
description: Learn how to prepare Azure for replication of on-premises machines using the Azure Site Recovery service.
services: site-recovery
documentationcenter: ''
author: rayne-wiselman
manager: carmonm
editor: ''

ms.assetid: 321e304f-b29e-49e4-aa64-453878490ea7
ms.service: site-recovery
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/18/2017
ms.author: raynew

---
# Prepare Azure resources for replication of on-premises machines

The [Azure Site Recovery](site-recovery-overview.md) service contributes to your business continuity and disaster recovery (BCDR) strategy by keeping your business apps up and running available during planned and unplanned outages. Site Recovery manages and orchestrates disaster recovery of on-premises machines and Azure virtual machines (VMs), including replication, failover, and recovery.

This tutorial shows you how to prepare Azure components when you want to replicate on-premises VMs and physical servers to Azure. In this tutorial, you learn how to:

> [!div class="checklist"]
> * Set up an Azure account
> * Verify your account has replication permissions 
> * Create an Azure storage account.
> * Set an Azure network. When Azure VMs are created after failover, they're joined to this Azure network.



## Set up an Azure account

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin. 

## Verify account permissions

Make sure your Azure account has the permissions it needs to replicate VMs. To enable replication for a new virtual machine, a user must have:
- Permission to create a virtual machine in the selected resource group
- Permission to create a virtual machine in the selected virtual network
- Permission to write to the selected Storage account
- The 'Virtual Machine Contributor' built-in role has these permissions.
- The 'Site Recovery Contributor' role has all permissions required to manage Azure Site Recovery operations in a Recovery Services vault. This role is best suited for disaster recovery administrators who can enable and manage disaster recovery for applications or entire organizations.

## Create a storage account

Images of replicated machines are held in Azure storage. Azure VMs are created from the storage when you fail over from on-premises to Azure. 

1. In the Azure portal. the **Hub** menu, select **New** -> **Storage** -> **Storage account**.
2. Enter a name for your storage account. The name must be unique within Azure, and be between 3 and 24 characters, witn numbers and lowercase letters only.
3. Use the **Resource Manager** deployment model.
4. Select **General purpose** > **Standard**.
5. Select the default **RA-GRS** for storage redundancy. [learn more](../storage/common/storage-redundancy.md).
6. Select the subscription in which you want to create the new storage account.
7. Specify a new resource group. [Learn more](../azure-resource-manager/resource-group-overview.md).
8. Select the geographic location for your storage account. The storage account must be in the same region as the Recovery Services vault.
9. Click **Create** to create the storage account.


## Set up an Azure network

When Azure VMs are created from storage after failover, they're joined to this network.

1. In the **Favorites** pane of the portal, click **New**.
2. Click **Networking** > **Virtual network**
3. Leave **Resource Manager** selected as the deployment model, and click **Create**.
    - Specify a network name. The name must be unique within the Azure resource group. 
    - Specify the network address range in CIDR notation. For example 10.0.0.0/16.
    - For this tutorial we don't need a subnet.
    - Select the subscription in which to create the network.
    - Select the location in which the create the network. The network must be in the same region as the Recovery Services vault.

	The virtual network takes a few seconds to create. After it’s created, you see it in the Azure portal dashboard.


## Next steps

- [Prepare the on-premises VMware infrastructure for disaster recovery to Azure](tutorial-prepare-on-premises-vmware.md)
- [Migrate on-premises VMware VMs to Azure](tutorial-migrate-on-premises-to-azure.md)
- [Migrate AWS instances to Azure](tutorial-migrate-aws-to-azure.md)




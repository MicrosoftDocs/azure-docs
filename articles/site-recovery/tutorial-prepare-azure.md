---
title: Create resources for use with Azure Site Recovery | Microsoft Docs
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
ms.date: 11/01/2017
ms.author: raynew
ms.custom: MVC

---
# Prepare Azure resources for replication of on-premises machines

The [Azure Site Recovery](site-recovery-overview.md) service contributes to your business
continuity and disaster recovery (BCDR) strategy by keeping your business apps up and running
available during planned and unplanned outages. Site Recovery manages and orchestrates disaster
recovery of on-premises machines and Azure virtual machines (VMs), including replication, failover,
and recovery.

This tutorial shows you how to prepare Azure components when you want to replicate on-premises VMs
and physical servers to Azure. In this tutorial, you learn how to:

> [!div class="checklist"]
> * Verify your account has replication permissions
> * Create an Azure storage account.
> * Set an Azure network. When Azure VMs are created after failover, they're joined to this Azure network.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.

## Log in to Azure

Log in to the Azure portal at http://portal.azure.com.

## Verify account permissions

If you have just created your free Azure account then you are the administrator of your
subscription. If you are not the subscription administrator, work with the administrator to assign
the permissions you need. To enable replication for a new virtual machine, you must have:

- Permission to create a virtual machine in the selected resource group
- Permission to create a virtual machine in the selected virtual network
- Permission to write to the selected Storage account

The 'Virtual Machine Contributor' built-in role has these permissions. You also need permission to
manage Azure Site Recovery operations. The 'Site Recovery Contributor' role has all permissions
required to manage Site Recovery operations in a Recovery Services vault.

## Create a storage account

Images of replicated machines are held in Azure storage. Azure VMs are created from the storage
when you fail over from on-premises to Azure.

1. In the [Azure portal](https://portal.azure.com) menu, click **New** -> **Storage** -> **Storage account**.
2. Enter a name for your storage account. For these tutorials we will use the name
   **contosovmsacct1910171607**. The name must be unique within Azure, and be between 3 and 24
   characters, witn numbers and lowercase letters only.
3. Use the **Resource Manager** deployment model.
4. Select **General purpose** > **Standard**.
5. Select the default **RA-GRS** for storage redundancy.
6. Select the subscription in which you want to create the new storage account.
7. Specify a new resource group. An Azure resource group is a logical container into which Azure
   resources are deployed and managed. For these tutorials we use the name **ContosoRG**.
8. Select the geographic location for your storage account. The storage account must be in the same
   region as the Recovery Services vault. For these tutorials we use the location **West Europe**.

   ![create-storageacct](media/tutorial-prepare-azure/create-storageacct.png)

9. Click **Create** to create the storage account.

## Create a vault

1. In the Azure portal menu, click **New** > **Monitoring & Management** >
   **Backup and Site Recovery**.
2. In **Name**, specify a friendly name to identify the vault. For this tutorial we use **ContosoVMVault**.
3. Select the existing resource group named **contosoRG**.
4. Specify the Azure region **West Europe**.
5. To quickly access the vault from the dashboard, click **Pin to dashboard** > **Create**.

   ![New vault](./media/tutorial-prepare-azure/new-vault-settings.png)

   The new vault will appear on the **Dashboard** > **All resources**, and on the main **Recovery Services vaults** page.

## Set up an Azure network

When Azure VMs are created from storage after failover, they're joined to this network.

1. In the [Azure portal](https://portal.azure.com) menu, click **New** > **Networking** >
   **Virtual network**
2. Leave **Resource Manager** selected as the deployment model. Resource Manager is the preferred
   deployment model.
   - Specify a network name. The name must be unique within the Azure resource group. We will use
     the name **ContosoASRnet**
   - Use the existing resource group **contosoRG**.
   - Specify the network address range 10.0.0.0/24.
   - For this tutorial we don't need a subnet.
   - Select the subscription in which to create the network.
   - Select the location **West Europe**. The network must be in the same region as the Recovery
     Services vault.
3. Click **Create**.

   ![create-network](media/tutorial-prepare-azure/create-network.png)

   The virtual network takes a few seconds to create. After it’s created, you see it in the Azure
   portal dashboard.

## Next steps

> [!div class="nextstepaction"]
> [Prepare the on-premises VMware infrastructure for disaster recovery to Azure](tutorial-prepare-on-premises-vmware.md)

---
title: Prepare Azure for disaster recovery of on-premises machines with Azure Site Recovery | Microsoft Docs
description: Learn how to prepare Azure for disaster recovery of on-premises machines using Azure Site Recovery.
services: site-recovery
author: rayne-wiselman
ms.service: site-recovery
services: site-recovery
ms.topic: tutorial
ms.date: 03/18/2019
ms.author: raynew
ms.custom: MVC

---
# Prepare Azure resources for disaster recovery of on-premises machines

 [Azure Site Recovery](site-recovery-overview.md) contributes to your business continuity and disaster recovery (BCDR) strategy by keeping your business apps up and running during planned and unplanned outages. Site Recovery manages and orchestrates disaster recovery of on-premises machines and Azure virtual machines (VMs), including replication, failover, and recovery.

This article is the first tutorial in a series that shows you how to set up disaster recovery for on-premises VMs. It's relevant whether you're protecting on-premises VMware VMs, Hyper-V VMs, or physical servers.

> [!NOTE]
> Tutorials are designed to show you the simplest deployment path for a scenario. They use default options where possible, and don't show all possible settings and paths. For detailed instructions , refer to **How To's** section for the corresponding scenario.

This article shows you how to prepare Azure components when you want to replicate on-premises VMs (Hyper-V or VMware) or Windows/Linux physical servers to Azure. In this tutorial, you learn how to:

> [!div class="checklist"]
> * Verify that your Azure account has replication permissions.
> * Create a Recovery Services vault. A vault holds metadata and configuration information for VMs, and other replication components.
> * Set up an Azure network. When Azure VMs are created after failover, they're joined to this Azure network.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Verify account permissions

If you just created your free Azure account, you're the administrator of your subscription. If you're not the subscription administrator, work with the administrator to assign the permissions you need. To enable replication for a new virtual machine, you must have permission to:

- Create a VM in the selected resource group.
- Create a VM in the selected virtual network.
- Write to storage account.
- Write to managed disk.

To complete these tasks your account should be assigned the Virtual Machine Contributor built-in role. In addition, to manage Site Recovery operations in a vault, your account should be assigned the Site Recovery Contributor build-in role.


## Create a Recovery Services vault

1. In the Azure portal, click **+Create a resource**, and search the Marketplace for **Recovery services**.
2. Click **Backup and Site Recovery (OMS)**, and in the Backup and Site Recovery page, click **Create**. 
1. In **Recovery Services vault** > **Name**, enter a friendly name to identify the vault. For this set of tutorials we're using **ContosoVMVault**.
2. In **Resource group**, select an existing resource group or create a new one. For this tutorial we're using **contosoRG**.
3. In **Location**, select the region in which the vault should be located. We're using **West Europe**.
4. To quickly access the vault from the dashboard, select **Pin to dashboard** > **Create**.

   ![Create a new vault](./media/tutorial-prepare-azure/new-vault-settings.png)

   The new vault appears on **Dashboard** > **All resources**, and on the main **Recovery Services vaults** page.

## Set up an Azure network

When Azure VMs are created from managed disks after failover, they're joined to this network.

1. In the [Azure portal](https://portal.azure.com), select **Create a resource** > **Networking** > **Virtual network**.
2. We're leaving **Resource Manager** selected as the deployment model.
3. In **Name**, enter a network name. The name must be unique within the Azure resource group. We're using **ContosoASRnet** in this tutorial.
4. Specify the resource group in which the network will be created. We're using the existing resource group **contosoRG**.
5. In **Address range**, enter the range for the network **10.0.0.0/24**. In this network we're not using a subnet.
6. In **Subscription**, select the subscription in which to create the network.
7. In **Location**, select **West Europe**. The network must be in the same region as the Recovery Services vault.
8. We're leaving the default options of basic DDoS protection, with no service endpoint on the network.
9. Click **Create**.

   ![Create a virtual network](media/tutorial-prepare-azure/create-network.png)

   The virtual network takes a few seconds to create. After it's created, you see it in the Azure portal dashboard.

## Useful links

- [Learn about](https://docs.microsoft.com/azure/virtual-network/virtual-networks-overview) Azure networks.
- [Learn about](https://docs.microsoft.com/azure/virtual-machines/windows/managed-disks-overview) managed disks.



## Next steps

> [!div class="nextstepaction"]
> [Prepare the on-premises VMware infrastructure for disaster recovery to Azure](tutorial-prepare-on-premises-vmware.md)

---
title: Prepare Azure Site Recovery resources for disaster recovery of Azure VMware Solution VMs
description: Learn how to prepare Azure resources for disaster recovery of Azure VMware Solution machines using Azure Site Recovery.
services: site-recovery
author: ankitaduttaMSFT
manager: rochakm
ms.service: site-recovery
ms.topic: tutorial
ms.date: 12/22/2022
ms.author: ankitadutta
ms.custom: MVC, engagement-fy23

---
# Prepare Azure Site Recovery resources for disaster recovery of Azure VMware Solution VMs

This article describes how to prepare Azure resources and components so that you can set up disaster recovery of Azure VMware Solution VMs using [Azure Site Recovery](site-recovery-overview.md) service. [Azure VMware Solution](../azure-vmware/introduction.md) provides private clouds in Azure. These private clouds contain vSphere clusters, built from dedicated bare-metal Azure infrastructure.

This article is the first tutorial in a series that shows you how to set up disaster recovery for Azure VMware Solution VMs. 


In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a Recovery Services vault. A vault holds metadata and configuration information for VMs, and other replication components.
> * Set up an Azure virtual network (VNet). When Azure VMs are created after failover, they're joined to this network.

> [!NOTE]
> - Tutorials show you the simplest deployment path for a scenario. They use default options where possible, and don't show all possible settings and paths. For detailed instructions, review the article in the How To section of the Site Recovery Table of Contents.
> - Some of the concepts of using Azure Site Recovery for Azure VMware Solution overlap with disaster recovery of on-prem VMware VMs and hence documentation will be cross-referenced accordingly.

## Sign in to Azure

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin. Then sign in to the [Azure portal](https://portal.azure.com).


## Prerequisites

**Before you begin, verify the following:**

- [Deploy](../azure-vmware/tutorial-create-private-cloud.md) an Azure VMware Solution private cloud in Azure
- Review the architecture for [VMware](vmware-azure-architecture.md) disaster recovery
- Read common questions for [VMware](vmware-azure-common-questions.md)

**Verify account permissions**

If you just created your free Azure account, you're the administrator of your subscription and you have the permissions you need. If you're not the subscription administrator, work with the administrator to assign the permissions you need. To enable replication for a new virtual machine, you must have permission to:

- Create a VM in the selected resource group.
- Create a VM in the selected virtual network.
- Write to an Azure storage account.
- Write to an Azure managed disk.

To complete these tasks your account should be assigned the Virtual Machine Contributor built-in role. In addition, to manage Site Recovery operations in a vault, your account should be assigned the Site Recovery Contributor built-in role.


## Create a recovery services vault

1. In the [Azure portal](https://portal.azure.com), select **Create a resource**.
1. Search the Azure Marketplace for *Recovery Services*.
1. Select **Backup and Site Recovery** from the search results. Next, select **Create**.
1. In the **Create Recovery Services vault** page, under the **Basics** > **Project details** section, do the following: 
    1. Under **Subscription**, select the subscription in which you want to create the new recovery services vault.
    1. In **Resource group**, select an existing resource group or create a new one. For example, **contosoRG**.

1. In the **Create Recovery Services vault** page, under **Basics** > **Instance details** section, do the following:
    1. In **Vault name**, enter a friendly name to identify the vault. For example, **ContosoVMVault**.
    1. In **Region**, select the region where the vault should be located. For example, **(Europe) West Europe**.
    1. Select **Review + create** > **Create** to create the recovery vault.
    
> [!TIP]
> To quickly access the vault from the dashboard, select **Pin to dashboard**.

The new vault appears on **Dashboard** > **All resources**, and on the main **Recovery Services vaults** page.

:::image type="content" source="./media/tutorial-prepare-azure/new-vault-settings.png" alt-text="Screenshot of the Create Recovery Services vault page.":::



## Set up an Azure network

Azure VMware Solution VMs are replicated to Azure managed disks. When failover occurs,  Azure VMs are created from these managed disks, and joined to the Azure network you specify in this procedure.

1. In the [Azure portal](https://portal.azure.com), select **Create a resource**.
1. Under categories, select **Networking** > **Virtual network**. 
1. In **Create virtual network** page, under the **Basics** tab, do the following:
    1. In **Subscription**, select the subscription in which to create the network.
    2. In **Resource group**, select the resource group in which to create the network. For this tutorial, use the existing resource group **contosoRG**.
    1. In **Virtual network name**, enter a network name. The name must be unique within the Azure resource group. For example, **ContosoASRnet**.
    1.  In **Region**, choose **(Europe) West Europe**. The network must be in the same region as the Recovery Services vault.
    
      :::image type="Protection state" source="media/tutorial-prepare-azure/create-network.png" alt-text="Screenshot of the Create virtual network options."::: 

1. In **Create virtual network**  > **IP addresses** tab, do the following:
    1. As there's no subnet for this network, you will first delete the pre-existing address range. To do so, select the ellipsis (...), under available IP address range, then select **Delete address space**.
     
       :::image type="Protection state" source="media/tutorial-prepare-azure/delete-ip-address.png" alt-text="Screenshot of the delete address space."::: 
    1. After deleting the pre-existing address range, select **Add an IP address space**.
    
       :::image type="Protection state" source="media/tutorial-prepare-azure/add-ip-address-space.png" alt-text="Screenshot of the adding IP.":::

    1. In **Starting address** enter **10.0.0.**
    1. Under **Address space size**, select **/24 (256 addresses)**.
    1. Select **Add**.
    
       :::image type="Content" source="media/tutorial-prepare-azure/homepage-ip-address.png" alt-text="Screenshot of the add virtual network options.":::
1. Select **Review + create** > **Create** to create a new virtual network.


The virtual network takes a few seconds to create. After it's created, you'll see it in the Azure portal dashboard.

## Next steps

Learn more about:
- [Prepare infrastructure](avs-tutorial-prepare-avs.md)
- [Learn about](../virtual-network/virtual-networks-overview.md) Azure networks.
- [Learn about](../virtual-machines/managed-disks-overview.md) managed disks.

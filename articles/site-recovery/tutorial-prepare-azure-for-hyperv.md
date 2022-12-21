---
title: Prepare Azure for Hyper-V disaster recovery with Azure Site Recovery
description: Learn how to prepare Azure for disaster recovery of on-premises Hyper-V VMs by using Azure Site Recovery
ms.service: site-recovery
ms.topic: tutorial
ms.date: 12/21/2022
ms.custom: MVC, engagement-fy23
ms.author: ankitadutta
author: ankitaduttaMSFT
---
# Prepare Azure resources for Hyper-V disaster recovery

 [Azure Site Recovery](site-recovery-overview.md) helps business continuity and disaster recovery (BCDR) by keeping business apps running during planned and unplanned outages. Site Recovery manages and orchestrates disaster recovery of on-premises machines and Azure virtual machines (VMs), including replication, failover, and recovery.

This tutorial is the first in a series that describes how to set up disaster recovery for on-premises Hyper-V VMs.

> [!NOTE]
> We design tutorials to show the simplest deployment path for a scenario. These tutorials use default options when possible, and don't show all possible settings and paths. For more information, see the *How To* section for each corresponding scenario.

This tutorial shows you how to prepare Azure components when you want to replicate on-premises VMs (Hyper-V) to Azure. You'll learn how to:

> [!div class="checklist"]
> * Verify that your Azure account has replication permissions.
> * Create an Azure storage account, which stores images of replicated machines.
> * Create a Recovery Services vault, which stores metadata and configuration information for VMs and other replication components.
> * Set up an Azure network. When Azure VMs are created after failover, they're joined to this network.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.

## Sign in to Azure

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin. Sign in to the [Azure portal](https://portal.azure.com).

## Prerequisites

**Verify account permissions**

If you just created a free Azure account, you're the administrator for that subscription. If you're not the administrator, work with the administrator to assign the permissions you need. To enable replication for a new virtual machine, you must have permission to:

- Create a VM in the selected resource group.
- Create a VM in the selected virtual network.
- Write to the selected storage account.

To complete these tasks, your account should be assigned the Virtual Machine Contributor built-in role. To manage Site Recovery operations in a vault, your account should be assigned the Site Recovery Contributor built-in role.

## Create a storage account

Images of replicated machines are held in Azure storage. Azure VMs are created from the storage when you fail over from on-premises to Azure. The storage account must be in the same region as the Recovery Services vault.

1. In the [Azure portal](https://portal.azure.com) portal, select **Create a resource**.
1. Under categories, select **Storage** > **Storage account** > **Create storage account**.
1. In the **Create storage account** page, under the **Basics** > **Project details** section, do the following:
    1. Under **Subscription**, choose the subscription in which you want to create the new storage account.
    1. Under **Resource group**, enter a new resource group. An Azure resource group is a logical container in which Azure resources are deployed and managed. For example, **ContosoRG**.
        > [!Note]
        > You can also create a new resource group by selecting **Create new**.

1. In the **Create storage account** page, under **Basics** > **Instance details** section, do the following:
    1. Under **Storage account name**, enter a name for the account.  The name you choose must be unique within Azure. It must be 3 to 24 characters long, and only use lowercase letters and numbers. For example, **contosovmsacct1910171607**.
    1. In **Region**, select the geographic location for your storage account. For example, **(Europe) West Europe**.
    1. In **Performance**, select **Standard**.
    1. In **Redundancy**, retain the default **Geo-redundant storage (GRS)** for storage redundancy.
1. Select **Review** and review your settings.
1. Select **Create**.

:::image type="Protection state" source="media/tutorial-prepare-azure/create-storage-account.png" alt-text="Screenshot of the Create a storage account options.":::


> [!NOTE]
> If you want to create a legacy storage account type, select the provided link under **Basics** > **Instance details** section. This redirects you to **Create storage account** page to a create legacy storage account.
> :::image type="Protection state" source="media/tutorial-prepare-azure/create-legacy-storage-account.png" alt-text="Screenshot of the Create a legacy storage account options.":::

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
    
> [!NOTE]
> To quickly access the vault from the dashboard, select **Pin to dashboard**.

:::image type="content" source="./media/tutorial-prepare-azure/new-vault-settings.png" alt-text="Screenshot of the Create Recovery Services vault page.":::

The new vault appears on **Dashboard** > **All resources**, and on the main **Recovery Services vaults** page.

## Set up an Azure network

When Azure VMs are created from storage after failover, they're joined to this network.

1. In the [Azure portal](https://portal.azure.com), select **Create a resource**.
1. Under categories, select **Networking** > **Virtual network**. 
1. In **Create virtual network** page, under the **Basics** tab, do the following:
    1. In **Subscription**, select the subscription in which to create the network.
    2. In **Resource group**, select the resource group in which to create the network. For this tutorial, use the existing resource group **contosoRG**.
    1. In **Virtual network name**, enter a network name. The name must be unique within the Azure resource group. For example, **ContosoASRnet**.
    1.  In **Region**, choose **(Europe) West Europe**. The network must be in the same region as the Recovery Services vault.
         :::image type="Protection state" source="media/tutorial-prepare-azure/create-network.png" alt-text="Screenshot of the Create virtual network options."::: 

1. In **Create storage account** page, under the **IP addresses** tab, do the following:
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

Learn about:
- [Preparing the on-premises Hyper-V infrastructure for disaster recovery to Azure](hyper-v-prepare-on-premises-tutorial.md)
- [Azure networks](../virtual-network/virtual-networks-overview.md)
- [Managed disks](../virtual-machines/managed-disks-overview.md)
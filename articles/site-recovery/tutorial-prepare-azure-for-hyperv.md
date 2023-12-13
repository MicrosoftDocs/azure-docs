---
title: Prepare Azure resources for Hyper-V disaster recovery by using Azure Site Recovery
description: Learn how to prepare Azure resources for disaster recovery of on-premises Hyper-V VMs by using Azure Site Recovery
ms.service: site-recovery
ms.topic: tutorial
ms.date: 12/22/2022
ms.custom: MVC, engagement-fy23
ms.author: ankitadutta
author: ankitaduttaMSFT
---
# Prepare Azure resources for Hyper-V disaster recovery

[Azure Site Recovery](site-recovery-overview.md) helps organizations with business continuity and disaster recovery by keeping business apps running during planned and unplanned outages. Site Recovery manages and orchestrates disaster recovery of on-premises machines and Azure virtual machines (VMs), including replication, failover, and recovery.

This tutorial is the first in a series that describes how to set up disaster recovery for on-premises Hyper-V VMs.

> [!NOTE]
> We design tutorials to show the simplest deployment path for a scenario. The tutorials use default options when possible, and they don't show all possible settings and paths. For more information about a scenario, see the *How-to Guides* section of the [Site Recovery documentation](./index.yml).

This tutorial shows you how to prepare Azure components when you want to replicate on-premises Hyper-V VMs to Azure.

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Create an Azure Storage account to store images of replicated machines.
> - Create a Recovery Services vault to store metadata and configuration information for VMs and other replication components.
> - Set up an Azure network. When Azure VMs are created after failover, the VMs are joined to this network.

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com). If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.

## Prerequisites

Before you begin the tutorial, make sure that you meet the prerequisites.

### Verify account permissions

If you just created a free Azure account, you're the administrator for that subscription by default. If you're not the administrator for the Azure subscription you'll use to complete the tutorial, work with the subscription administrator to get the permissions you need.

To enable replication for a new VM, you must have permissions to:

- Create a VM in the selected resource group.
- Create a VM in the selected virtual network.
- Write to the selected storage account.

To complete these tasks, your account should be assigned the Virtual Machine Contributor built-in role.

To manage Site Recovery operations in a vault, your account should be assigned the Site Recovery Contributor built-in role.

## Create a storage account

Images of replicated machines are held in an Azure storage account. Azure VMs are created from the storage account when you fail over from on-premises to Azure. The storage account must be in the same region as your Recovery Services vault.

1. In the [Azure portal](https://portal.azure.com) portal, select **Create a resource**.
1. On the **Categories** menu, select **Storage**, and then select **Storage account**.
1. On **Create a storage account**, on the **Basics** tab, complete these steps:
    1. For **Subscription**, select the Azure subscription in which to create the storage account.
    1. For **Resource group**, select **Create new**, and then enter a new resource group name. For example, enter **ContosoRG**.

        An Azure resource group is a logical container in which Azure resources are deployed and managed.
    1. For **Storage account name**, enter a name for the account. For example, enter **contosovmsacct1910171607**.

        The account name must be unique within Azure. It must be between 3 and 24 characters long and use only lowercase letters and numbers.
    1. For **Region**, select the geographic location for your storage account. For example, select **West Europe**.
    1. For **Performance**, select **Standard**.
    1. For **Redundancy**, retain the default **Geo-redundant storage (GRS)** for storage redundancy.

    :::image type="content" source="media/tutorial-prepare-azure/create-storage-account.png" alt-text="Screenshot that shows an example of Create a storage account options.":::
1. Select **Review** and review your settings.
1. Select **Create**.

> [!NOTE]
> If you want to create a legacy storage account type, select the related link in the **Instance details** section. The link redirects you to the **Create a storage account** pane to create a legacy storage account.
>
> :::image type="content" source="media/tutorial-prepare-azure/create-legacy-storage-account.png" alt-text="Screenshot that shows the Create a legacy storage account link.":::

## Create a Recovery Services vault

1. In the [Azure portal](https://portal.azure.com), select **Create a resource**.
1. Search Azure Marketplace for *Recovery Services*.
1. In the search results, select **Backup and Site Recovery**. Next, select **Create**.
1. On **Create Recovery Services vault**, on the **Basics** tab, complete these steps:
    1. For **Subscription**, select the subscription in which to create the new Recovery Services vault.
    1. For **Resource group**, select an existing resource group or create a new one. For example, select **contosoRG**.
    1. For **Vault name**, enter a name you can use to identify the vault. For example, enter **ContosoVMVault**.
    1. For **Region**, select the region where the vault should be located. For example, select **West Europe**.
  
   :::image type="content" source="./media/tutorial-prepare-azure/new-vault-settings.png" alt-text="Screenshot that shows the Create Recovery Services vault pane."::: 
1. Select **Review + create**, and then select **Create** to create the recovery vault.
  
> [!NOTE]
> To quickly access the vault from your dashboard in the Azure portal, select **Pin to dashboard**.

The new vault appears on **Dashboard** > **All resources** and on the main **Recovery Services vaults** pane.

## Set up an Azure network

When an Azure VM is created from storage after failover, the VM is joined to this network.

1. In the [Azure portal](https://portal.azure.com), select **Create a resource**.
1. On the **Categories** menu, select **Networking**, and then select **Virtual Network**.
1. On **Create virtual network**, on the **Basics** tab, complete these steps:
    1. For **Subscription**, select the subscription in which to create the network.
    1. For **Resource group**, select the resource group in which to create the network. For this tutorial, select the existing resource group **contosoRG**.
    1. For **Name**, enter a name for the network. The name must be unique within the Azure resource group. For example, enter **ContosoASRnet**.
    1. For **Region**, select **West Europe**. The network must be in the same region as your Recovery Services vault.
  
    :::image type="content" source="media/tutorial-prepare-azure/create-network.png" alt-text="Screenshot that shows the Create virtual network options.":::

1. On **Create virtual network**, on the **IP addresses** tab, complete these steps:
    1. Because there's no subnet for this network, first delete the existing address range. To delete the range, select the ellipsis (**...**), under the available IP address range, and then select **Delete address space**.

        :::image type="content" source="media/tutorial-prepare-azure/delete-ip-address.png" alt-text="Screenshot that shows deleting the address space.":::
    1. After you delete the existing address range, select **Add an IP address space**.

        :::image type="content" source="media/tutorial-prepare-azure/add-ip-address-space.png" alt-text="Screenshot that shows adding an IP address space.":::
    1. For **Starting address**, enter **10.0.0**.
    1. For **Address space size**, select **/24 (256 addresses)**.

        :::image type="content" source="media/tutorial-prepare-azure/homepage-ip-address.png" alt-text="Screenshot that shows the Add virtual network options.":::
1. Select **Add**.
1. Select **Review + create**, and then select **Create** to create a new virtual network.

It takes a few minutes for the virtual network to be created. After it's created, it's included on your Azure portal dashboard.

## Next steps

- [Prepare the on-premises Hyper-V infrastructure](hyper-v-prepare-on-premises-tutorial.md) for disaster recovery to Azure.
- Learn about [Azure networks](../virtual-network/virtual-networks-overview.md).
- Learn about [Managed disks](../virtual-machines/managed-disks-overview.md).

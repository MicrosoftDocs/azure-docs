---
title: Prepare Azure Site Recovery resources for disaster recovery of Azure VMware Solution VMs
description: Learn how to prepare Azure resources for disaster recovery of Azure VMware Solution machines by using Azure Site Recovery.
services: site-recovery
author: ankitaduttaMSFT
manager: rochakm
ms.service: site-recovery
ms.topic: tutorial
ms.date: 08/29/2023
ms.author: ankitadutta
ms.custom: MVC, engagement-fy23

---
# Prepare Azure Site Recovery resources for disaster recovery of Azure VMware Solution VMs

This tutorial describes how to prepare Azure resources and components so that you can set up disaster recovery of Azure VMware Solution virtual machines (VMs) by using the [Azure Site Recovery](site-recovery-overview.md) service. [Azure VMware Solution](../azure-vmware/introduction.md) provides private clouds in Azure. These private clouds contain vSphere clusters that are built from dedicated bare-metal Azure infrastructure.

This is the first tutorial in a series that shows you how to set up disaster recovery for Azure VMware Solution VMs.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Create a Recovery Services vault. A vault holds metadata and configuration information for VMs, along with other replication components.
> * Set up an Azure virtual network. When Azure VMs are created after failover, they're joined to this network.

> [!NOTE]
> * Tutorials show you the simplest deployment path for a scenario. They use default options where possible, and they don't show all possible settings and paths.
> * Some of the concepts of using Azure Site Recovery for Azure VMware Solution overlap with disaster recovery of on-premises VMware VMs. Documentation is cross-referenced accordingly.

## Sign in to Azure

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin. Then sign in to the [Azure portal](https://portal.azure.com).

## Prerequisites

Before you begin:

* Deploy an [Azure VMware Solution private cloud](../azure-vmware/tutorial-create-private-cloud.md) in Azure.
* Review the [architecture for VMware](vmware-azure-architecture.md) disaster recovery.
* Read [common questions for VMware](vmware-azure-common-questions.md).

If you just created your free Azure account, you're the administrator of your subscription and you have the necessary permissions. If you're not the subscription administrator, work with the administrator to assign the necessary permissions. To enable replication for a new virtual machine, you must have permission to:

* Create a VM in the selected resource group.
* Create a VM in the selected virtual network.
* Write to an Azure storage account.
* Write to an Azure managed disk.

To complete these tasks, your account should be assigned the Virtual Machine Contributor built-in role. In addition, to manage Site Recovery operations in a vault, your account should be assigned the Site Recovery Contributor built-in role.

## Create a Recovery Services vault

1. In the [Azure portal](https://portal.azure.com), select **Create a resource**.
1. Search Azure Marketplace for **Recovery Services**.
1. Select **Backup and Site Recovery** from the search results. Then, select **Create**.
1. On the **Create Recovery Services vault** page, on the **Basics** tab, do the following:

    1. For **Subscription**, select the subscription in which you want to create the Recovery Services vault.
    1. For **Resource group**, select an existing resource group or create a new one. For example, create one named **contosoRG**.
    1. For **Vault name**, enter a friendly name to identify the vault. For example, enter **ContosoVMVault**.
    1. For **Region**, select the region where the vault should be located. For example, select **West Europe**.
    1. Select **Review + create**.

    :::image type="content" source="./media/tutorial-prepare-azure/new-vault-settings.png" alt-text="Screenshot of the basic options for creating a Recovery Services vault.":::

1. On the **Review + create** tab, select **Create**.

   > [!TIP]
   > To quickly access the vault from the dashboard, select **Pin to dashboard**.

The new vault appears on **Dashboard** > **All resources**, and on the main **Recovery Services vaults** page.

## Set up an Azure network

Azure VMware Solution VMs are replicated to Azure managed disks. When failover occurs, Azure VMs are created from these managed disks and joined to the Azure network that you specify in this procedure.

1. In the [Azure portal](https://portal.azure.com), select **Create a resource**.
1. Under **Categories**, select **Networking** > **Virtual network**.
1. On the **Create virtual network** page, on the **Basics** tab, do the following:
    1. For **Subscription**, select the subscription in which to create the network.
    1. For **Resource group**, select the resource group in which to create the network. For this tutorial, use the existing resource group **contosoRG**.
    1. For **Virtual network name**, enter a network name. The name must be unique within the Azure resource group. For example, enter **ContosoASRnet**.
    1. For **Region**, select **(Europe) West Europe**. The network must be in the same region as the Recovery Services vault.

    :::image type="Protection state" source="media/tutorial-prepare-azure/create-network.png" alt-text="Screenshot of basic options for creating a virtual network.":::

1. On the **IP addresses** tab, do the following:
    1. Because there's no subnet for this network, you first delete the pre-existing address range. To do so, select the ellipsis (**...**) for the available IP address range, and then select **Delete address space**.

       :::image type="Protection state" source="media/tutorial-prepare-azure/delete-ip-address.png" alt-text="Screenshot of selections for deleting an address space.":::
    1. Select **Add an IP address space**.

       :::image type="Protection state" source="media/tutorial-prepare-azure/add-ip-address-space.png" alt-text="Screenshot of the button for adding an IP address space.":::

    1. For **Starting address**, enter **10.0.0.**
    1. For **Address space size**, select **/24 (256 addresses)**.
    1. Select **Add**.

       :::image type="Content" source="media/tutorial-prepare-azure/homepage-ip-address.png" alt-text="Screenshot of selections for adding an IP address space for a virtual network.":::
    1. Select **Review + create**.

1. On the **Review + create** tab, select **Create**.

The virtual network takes a few seconds to create. After it's created, it appears on the Azure portal dashboard.

## Next steps

Learn more about:

> [!div class="nextstepaction"]
> [Preparing your infrastructure](avs-tutorial-prepare-avs.md)

> [!div class="nextstepaction"]
> [Azure networks](../virtual-network/virtual-networks-overview.md)

> [!div class="nextstepaction"]
> [Managed disks](../virtual-machines/managed-disks-overview.md)

---
title: Prepare Azure Site Recovery resources for disaster recovery of Azure VMware Solution VMs
description: Learn how to prepare Azure resources for disaster recovery of Azure VMware Solution machines using Azure Site Recovery.
services: site-recovery
author: v-pgaddala
manager: rochakm
ms.service: site-recovery
ms.topic: tutorial
ms.date: 09/29/2020
ms.author: v-pgaddala
ms.custom: MVC

---
# Prepare Azure Site Recovery resources for disaster recovery of Azure VMware Solution VMs

This article describes how to prepare Azure resources and components so that you can set up disaster recovery of Azure VMware Solution VMs using [Azure Site Recovery](site-recovery-overview.md) service. [Azure VMware Solution](../azure-vmware/introduction.md) provides private clouds in Azure. These private clouds contain vSphere clusters, built from dedicated bare-metal Azure infrastructure.

This article is the first tutorial in a series that shows you how to set up disaster recovery for Azure VMware Solution VMs. 


In this tutorial, you learn how to:

> [!div class="checklist"]
> * Verify that the Azure account has replication permissions.
> * Create a Recovery Services vault. A vault holds metadata and configuration information for VMs, and other replication components.
> * Set up an Azure virtual network (VNet). When Azure VMs are created after failover, they're joined to this network.

> [!NOTE]
> Tutorials show you the simplest deployment path for a scenario. They use default options where possible, and don't show all possible settings and paths. For detailed instructions, review the article in the How To section of the Site Recovery Table of Contents.

> [!NOTE]
> Some of the concepts of using Azure Site Recovery for Azure VMware Solution overlap with disaster recovery of on-prem VMware VMs and hence documentation will be cross-referenced accordingly.

## Before you start

- [Deploy](../azure-vmware/tutorial-create-private-cloud.md) an Azure VMware Solution private cloud in Azure
- Review the architecture for [VMware](vmware-azure-architecture.md) disaster recovery
- Read common questions for [VMware](vmware-azure-common-questions.md)

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin. Then sign in to the [Azure portal](https://portal.azure.com).


## Verify account permissions

If you just created your free Azure account, you're the administrator of your subscription and you have the permissions you need. If you're not the subscription administrator, work with the administrator to assign the permissions you need. To enable replication for a new virtual machine, you must have permission to:

- Create a VM in the selected resource group.
- Create a VM in the selected virtual network.
- Write to an Azure storage account.
- Write to an Azure managed disk.

To complete these tasks your account should be assigned the Virtual Machine Contributor built-in role. In addition, to manage Site Recovery operations in a vault, your account should be assigned the Site Recovery Contributor built-in role.


## Create a Recovery Services vault

1. From the Azure portal menu, select **Create a resource**, and search the Marketplace for **Recovery**.
2. Select **Backup and Site Recovery** from the search results, and in the Backup and Site Recovery page, click **Create**. 
3. In the **Create Recovery Services vault** page, select the **Subscription**. We're using **Contoso Subscription**.
4. In **Resource group**, select an existing resource group or create a new one. For this tutorial we're using **contosoRG**.
5. In **Vault name**, enter a friendly name to identify the vault. For this set of tutorials we're using **ContosoVMVault**.
6. In **Region**, select the region in which the vault should be located. We're using **West Europe**.
7. Select **Review + create**.

   ![Screenshot of the Create Recovery Services vault page.](./media/tutorial-prepare-azure/new-vault-settings.png)

   The new vault will now be listed in **Dashboard** > **All resources**, and on the main **Recovery Services vaults** page.

## Set up an Azure network

 Azure VMware Solution VMs are replicated to Azure managed disks. When failover occurs,  Azure VMs are created from these managed disks, and joined to the Azure network you specify in this procedure.

1. In the [Azure portal](https://portal.azure.com), select **Create a resource** > **Networking** > **Virtual network**.
2. Keep **Resource Manager** selected as the deployment model.
3. In **Name**, enter a network name. The name must be unique within the Azure resource group. We're using **ContosoASRnet** in this tutorial.
4. In **Address space**, enter the virtual network's address range in CDR notation. We're using **10.1.0.0/24**.
5. In **Subscription**, select the subscription in which to create the network.
6. Specify the **Resource group** in which the network will be created. We're using the existing resource group **contosoRG**.
7. In **Location**, select the same region as that in which the Recovery Services vault was created. In our tutorial it's **West Europe**. The network must be in the same region as the vault.
8. In **Address range**, enter the range for the network. We're using **10.1.0.0/24**, and not using a subnet.
9. We're leaving the default options of basic DDoS protection, with no service endpoint, or firewall on the network.
9. Select **Create**.

   ![Screenshot of the Create virtual network options.](media/tutorial-prepare-azure/create-network.png)

The virtual network takes a few seconds to create. After it's created, you'll see it in the Azure portal dashboard.




## Next steps
> [!div class="nextstepaction"]
> [Prepare infrastructure](avs-tutorial-prepare-avs.md)
- [Learn about](../virtual-network/virtual-networks-overview.md) Azure networks.
- [Learn about](../virtual-machines/managed-disks-overview.md) managed disks.

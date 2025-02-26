---
title: Migrate VMware servers to Azure by using Private Link
description: Use Azure Migrate with private endpoints to migrate on-premises VMware VMs to Azure.
author: vijain
ms.author: vijain
ms.topic: how-to
ms.service: azure-migrate
ms.date: 12/14/2022
ms.custom: engagement-fy23
---

# Migrate VMware servers to Azure using Private Link (agentless)

This article describes how to use Azure Migrate to migrate servers over a private network by using [Azure Private Link](../../private-link/private-endpoint-overview.md). You can use the [Migration and modernization](../migrate-services-overview.md) tool to connect privately and securely to Azure Migrate over an Azure ExpressRoute private peering or a site-to-site (S2S) VPN connection by using Private Link. 

[!INCLUDE [scenario-banner.md](../includes/scenario-banner.md)]

This article shows how to migrate on-premises VMware VMs to Azure, using the [Migration and modernization tool](../migrate-services-overview.md), with agentless migration.

## Set up the Azure Migrate appliance

The Migration and modernization tool runs a lightweight VMware VM appliance to enable the discovery, assessment, and agentless migration of VMware VMs. If you have followed the [Discovery and assessment tutorial](../discover-and-assess-using-private-endpoints.md), you've already set the appliance up. If you didn't, [set up and configure the appliance](../discover-and-assess-using-private-endpoints.md#set-up-the-azure-migrate-appliance) before you proceed.

To use a private connection for replication, you can use the storage account created earlier during Azure Migrate project setup or create a new cache storage account and configure private endpoint. To create a new storage account with private endpoint, see [Private endpoint for storage account](../../private-link/tutorial-private-endpoint-storage-portal.md#create-storage-account-with-a-private-endpoint).

 - The private endpoint allows the Azure Migrate appliance to connect to the cache storage account using a private connection like an ExpressRoute private peering or VPN. Data can then be transferred directly on the private IP address.

> [!Important]
> - In addition to replication data, the Azure Migrate appliance communicates with the Azure Migrate service for its control plane activities. These activities include orchestrating replication. Control plane communication between the Azure Migrate appliance and the Azure Migrate service continues to happen over the internet on the Azure Migrate service's public endpoint.
> - The private endpoint of the storage account should be accessible from the network where the Azure Migrate appliance is deployed.
> - DNS must be configured to resolve DNS queries by the Azure Migrate appliance for the cache storage account's blob service endpoint to the private IP address of the private endpoint attached to the cache storage account.
> - The cache storage account must be accessible on its public endpoint. Azure Migrate uses the cache storage account's public endpoint to move data from the storage account to replica-managed disks.

## Replicate VMs

After setting up the appliance and completing discovery, you can begin replicating VMware VMs to Azure.

The following diagram illustrates the agentless replication workflow with private endpoints by using the Migration and modernization tool.

:::image type="content" source="../media/how-to-use-azure-migrate-with-private-endpoints/agentless-replication-architecture.png" alt-text="Diagram that shows agentless replication architecture." lightbox="../media/how-to-use-azure-migrate-with-private-endpoints/agentless-replication-architecture.png":::

Enable replication as follows:

1. In the Azure Migrate project > **Servers, databases and web apps** > **Migration and modernization** > **Migration tools**, select **Replicate**.
1. In **Replicate** > **Basics** > **Are your machines virtualized?**, select **Yes, with VMware vSphere**.
1. In **On-premises appliance**, select the name of the Azure Migrate appliance. Select **OK**.
1. In **Virtual machines**, select the machines you want to replicate. To apply VM sizing and disk type from an assessment, in **Import migration settings from an Azure Migrate assessment?**,
     - Select **Yes**, and select the VM group and assessment name.  
     - Select **No** if you aren't using assessment settings.

1. In **Virtual machines**, select VMs you want to migrate. Then select **Next**. 

1. In **Target settings**, select the **target region** in which the Azure VMs will reside after migration.  

1. In **Replication storage account**, use the dropdown list to select a storage account to replicate over a private link. 
    >[!NOTE] 
    > Only the storage accounts in the selected target region and Azure Migrate project subscription are listed.

1. Next, [**create a private endpoint for the storage account**](#create-a-private-endpoint-for-the-storage-account) to enable replications over a private link. Ensure that the Azure Migrate appliance has network connectivity to the storage account on its private endpoint. Learn how to [verify network connectivity](../troubleshoot-network-connectivity.md#verify-dns-resolution).  
    >[!NOTE] 
    > - The storage account cannot be changed after you enable replication.  
    > - To orchestrate replications, Azure Migrate will grant the trusted Microsoft services and the Recovery Services vault managed identity access to the selected storage account. 

    >[!Tip] 
    > You can manually update the DNS records by editing the DNS hosts file on the Azure Migrate appliance with the private link FQDNs and  private IP address of the storage account. 

1. Select the **Subscription** and **Resource group** in which the Azure VMs reside after migration. 
1. In **Virtual network**, select the Azure VNet/subnet for the migrated  Azure VMs.  
1. In **Availability options**, select: 

    - Availability Zone to pin the migrated machine to a specific Availability Zone in the region. Use this option to distribute servers that form a multi-node application tier across Availability Zones. If you select this option, you'll need to specify the Availability Zone to use for each of the selected machine in the Compute tab. This option is only available if the target region selected for the migration supports Availability Zones. 

    - Availability Set to place the migrated machine in an Availability Set. The target Resource Group that was selected must have one or more availability sets in order to use this option. 

    - No infrastructure redundancy required option if you don't need either of these availability configurations for the migrated machines. 
1. In **Disk encryption type**, select: 

    - Encryption-at-rest with platform-managed key 

    - Encryption-at-rest with customer-managed key 

    - Double encryption with platform-managed and customer-managed keys 

    >[!Note] 
    > To replicate VMs with CMK, you'll need to [create a disk encryption set](/azure/virtual-machines/disks-enable-customer-managed-keys-portal) under the target Resource Group. A disk encryption set object maps Managed Disks to a Key Vault that contains the CMK to use for SSE. 
1. In **Azure Hybrid Benefit**: 

    - Select **No** if you don't want to apply Azure Hybrid Benefit and select **Next**. 

    - Select **Yes** if you have Windows Server machines that are covered with active Software Assurance or Windows Server subscriptions, and you want to apply the benefit to the machines you're migrating and select **Next**. 
1. In **Compute**, review the VM name, size, OS disk type, and availability configuration (if selected in the previous step). VMs must conform with [Azure requirements](migrate-support-matrix-vmware-migration.md#azure-vm-requirements). 

    - **VM size**: If you're using assessment recommendations, the VM size dropdown shows the recommended size. Otherwise, Azure Migrate picks a size based on the closest match in the Azure subscription. Alternatively, pick a manual size in **Azure VM size**. 

    - **OS disk**: Specify the OS (boot) disk for the VM. The OS disk is the disk that has the operating system bootloader and installer. 

    - **Availability Zone**: Specify the Availability Zone to use. 

    - **Availability Set**: Specify the Availability Set to use. 
    >[!Note] 
    > If you want to select a different availability option for a set of virtual machines, go to step 1 and repeat the steps by selecting different availability options after starting replication for one set of virtual machines. 
1. In **Disks**, specify whether the VM disks should be replicated to Azure, and select the disk type (standard SSD/HDD or premium-managed disks) in Azure. Then select **Next**. 

1. In **Tags**, add tags to your migrated virtual machines, disks, and NICs.

1. In **Review and start replication**, review the settings, and select **Replicate** to start the initial replication for the servers. 
    Next, follow the instructions to [perform migrations](tutorial-migrate-vmware.md#run-a-test-migration). 

#### Provisioning for the first time  

Azure Migrate doesn't create any additional resources for replications using Azure Private Link (Service Bus, Key Vault, and storage accounts aren't created). Azure Migrate will make use of the selected storage account for uploading replication data, state data, and orchestration messages.

## Create a private endpoint for the storage account  

To replicate by using ExpressRoute with private peering, [**create a private endpoint**](../../private-link/tutorial-private-endpoint-storage-portal.md#create-storage-account-with-a-private-endpoint) for the cache/replication storage account (target subresource: *blob*). 

>[!Note] 
> You can create private endpoints only on a general-purpose v2 storage account. For pricing information, see [Azure Page Blobs pricing](https://azure.microsoft.com/pricing/details/storage/page-blobs/) and [Azure Private Link pricing](https://azure.microsoft.com/pricing/details/private-link/). 

Create the private endpoint for the storage account in the same virtual network as the Azure Migrate project private endpoint or another virtual network connected to this network. 

Select **Yes** and integrate with a private DNS zone. The private DNS zone helps in routing the connections from the virtual network to the storage account over a private link. Selecting **Yes** automatically links the DNS zone to the virtual network. It also adds the DNS records for the resolution of new IPs and FQDNs that are created. Learn more about [private DNS zones](../../dns/private-dns-overview.md). 

If the user who created the private endpoint is also the storage account owner, the private endpoint creation will be auto approved. Otherwise, the owner of the storage account must approve the private endpoint for use. To approve or reject a requested private endpoint connection, on the storage account page under **Networking**, go to **Private endpoint connections**. 

Review the status of the private endpoint connection state before you continue. 

Ensure that the on-premises appliance has network connectivity to the storage account via its private endpoint. To validate the private link connection, perform a DNS resolution of the storage account endpoint (private link resource FQDN) from the on-premises server hosting the Migrate appliance and ensure that it resolves to a private IP address. Learn how to verify [network connectivity.](../troubleshoot-network-connectivity.md#verify-dns-resolution)

## Next steps 

 - [Migrate VMs](tutorial-migrate-vmware.md#migrate-vms)
 - Complete the [migration process](tutorial-migrate-vmware.md#complete-the-migration).
 - Review the [post-migration best practices](tutorial-migrate-vmware.md#post-migration-best-practices). 
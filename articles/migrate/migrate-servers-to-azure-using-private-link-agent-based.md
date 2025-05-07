---
title: Migrate servers to Azure using Private Link through agent-based replications
description: Use Azure Migrate to migrate servers over a private network using Azure Private Link for agent-based replications.
author: vijain
ms.author: vijain
ms.topic: how-to
ms.service: azure-migrate
ms.date: 12/14/2022
ms.custom: engagement-fy23
---

# Migrate servers to Azure using Private Link (agent-based)

This article describes how to use Azure Migrate to migrate servers over a private network by using [Azure Private Link](../private-link/private-endpoint-overview.md). You can use the [Migration and modernization](migrate-services-overview.md) tool to connect privately and securely to Azure Migrate over an Azure ExpressRoute private peering or a site-to-site (S2S) VPN connection by using Private Link. 

This article shows a proof-of-concept deployment path for agent-based replications to migrate your [VMware VMs](./vmware/tutorial-migrate-vmware-agent.md), [Hyper-V VMs](tutorial-migrate-physical-virtual-machines.md), [physical servers](tutorial-migrate-physical-virtual-machines.md), [VMs running on AWS](tutorial-migrate-aws-virtual-machines.md), [VMs running on GCP](tutorial-migrate-gcp-virtual-machines.md), or VMs running on a different virtualization provider by using Azure private endpoints. 

## Set up a replication appliance for migration

The following diagram illustrates the agent-based replication workflow with private endpoints by using the Migration and modernization tool.

The tool uses a replication appliance to replicate your servers to Azure. Follow these steps to create the required resources for migration.

1. In **Discover machines** > **Are your machines virtualized?**, select **Not virtualized/Other**.
1. In **Target region**, select and confirm the Azure region to which you want to migrate the machines.
1. Select **Create resources** to create the required Azure resources. Don't close the page during the creation of resources.
    - This step creates a Recovery Services vault in the background and enables a managed identity for the vault. A Recovery Services vault is an entity that contains the replication information of servers and is used to trigger replication operations.
    - If the Azure Migrate project has private endpoint connectivity, a private endpoint is created for the Recovery Services vault. This step adds five fully qualified domain names (FQDNs) to the private endpoint, one for each microservice linked to the Recovery Services vault.
    - The five domain names are formatted in this pattern:  *{Vault-ID}-asr-pod01-{type}-.{target-geo-code}*.privatelink.siterecovery.windowsazure.com
    - By default, Azure Migrate automatically creates a private DNS zone and adds DNS A records for the Recovery Services vault microservices. The private DNS is then linked to the private endpoint virtual network.

>[!Note]
> Before you register the replication appliance, ensure that the vault's private link FQDNs are reachable from the machine that hosts the replication appliance. Additional DNS configuration can be required for the on-premises replication appliance to resolve the private link FQDNs to their private IP addresses. Learn more about [how to verify network connectivity](./troubleshoot-network-connectivity.md#verify-dns-resolution). 

After you verify the connectivity, download the appliance setup and key file, run the installation process, and register the appliance to Azure Migrate. Learn more about how to [set up the replication appliance](./tutorial-migrate-physical-virtual-machines.md#prepare-a-machine-for-the-replication-appliance). After you set up the replication appliance, follow these instructions to [install the mobility service](./tutorial-migrate-physical-virtual-machines.md#install-the-mobility-service-agent) on the machines you want to migrate.

>[!Note]
> If Migrate Project has Private Endpoints enabled, you will need to install MySQL on the configuration server manually. Follow the steps [here](../site-recovery/vmware-azure-deploy-configuration-server.md#configure-settings) to perform the manual installation. 

## Replicate servers

Now, select machines for replication and migration.

>[!Note]
> You can replicate up to 10 machines together. If you need to replicate more, then replicate them simultaneously in batches of 10. 

1. In the Azure Migrate project > **Servers, databases and web apps** > **Migration and modernization** > **Migration tools**, select **Replicate**.
1. In **Replicate** > **Basics** > **Are your machines virtualized?**, select **Not virtualized/Other**. 
1. In **On-premises appliance**, select the name of the Azure Migrate appliance that you set up. 
1. In **Process Server**, select the name of the replication appliance. 
1. In **Guest credentials**, select the dummy account created previously during the [replication installer setup](tutorial-migrate-physical-virtual-machines.md#download-the-replication-appliance-installer) to install the Mobility service manually (push install isn't supported). Then select **Next: Virtual machines.**
1. In **Virtual machines**, in **Import migration settings from an assessment?**, leave the default setting **No, I'll specify the migration settings manually**.
1. Select each VM you want to migrate. Then select **Next:Target settings**. 
1. In **Target settings**, select the subscription, the target region to which you'll migrate, and the resource group in which the Azure VMs will reside after migration.  
1. In **Virtual network**, select the Azure VNet/subnet for the migrated  Azure VMs. 
1. In **Cache storage account**, use the dropdown list to select a storage account to replicate over a private link.  

1. Next, [**create a private endpoint for the storage account**](./vmware/migrate-vmware-servers-to-azure-using-private-link.md#create-a-private-endpoint-for-the-storage-account) and [**grant permissions to the Recovery Services vault managed identity**](migrate-servers-to-azure-using-private-link.md#grant-access-permissions-to-the-recovery-services-vault) to access the storage account required by Azure Migrate. This is mandatory before you proceed.   

    - Ensure that the server hosting the replication appliance has network connectivity to the storage accounts via the private endpoints before you proceed. Learn how to [verify network connectivity](./troubleshoot-network-connectivity.md#verify-dns-resolution).     
    
        >[!Tip] 
        > You can manually update the DNS records by editing the DNS hosts file on the Azure Migrate appliance with the private link FQDNs and private IP addresses of the storage account. 

1. In **Availability options**, select: 

    - Availability Zone to pin the migrated machine to a specific Availability Zone in the region. Use this option to distribute servers that form a multi-node application tier across Availability Zones. If you select this option, you'll need to specify the Availability Zone to use for each of the selected machine in the Compute tab. This option is only available if the target region selected for the migration supports Availability Zones. 

    - Availability Set to place the migrated machine in an Availability Set. The target Resource Group that was selected must have one or more availability sets in order to use this option. 

    - No infrastructure redundancy required option if you don't need either of these availability configurations for the migrated machines. 
1. In **Disk encryption type**, select: 

    - Encryption-at-rest with platform-managed key 
    - Encryption-at-rest with customer-managed key 
    - Double encryption with platform-managed and customer-managed keys 
    > [!Note]
    > To replicate VMs with CMK, you'll need to [create a disk encryption set](/azure/virtual-machines/disks-enable-customer-managed-keys-portal) under the target Resource Group. A disk encryption set object maps Managed Disks to a Key Vault that contains the CMK to use for SSE. 
1. In **Azure Hybrid Benefit**: 
    - Select **No** if you don't want to apply Azure Hybrid Benefit and select **Next**. 
    - Select **Yes** if you have Windows Server machines that are covered with active Software Assurance or Windows Server subscriptions, and you want to apply the benefit to the machines you're migrating. Then select **Next**.    
1. In **Compute**, review the VM name, size, OS disk type, and availability configuration (if selected in the previous step). VMs must conform with [Azure requirements](migrate-support-matrix-physical-migration.md#azure-vm-requirements). 
    - **VM size**: If you're using assessment recommendations, the VM size dropdown shows the recommended size. Otherwise, Azure Migrate picks a size based on the closest match in the Azure subscription. Alternatively, pick a manual size in **Azure VM size**. 

    - **OS disk**: Specify the OS (boot) disk for the VM. The OS disk is the disk that has the operating system bootloader and installer. 

    - **Availability Zone**: Specify the Availability Zone to use. 

    - **Availability Set**: Specify the Availability Set to use. 

1. In **Disks**, specify whether the VM disks should be replicated to Azure, and select the disk type (standard SSD/HDD or premium managed disks) in Azure. Then select **Next**. 
    - You can exclude disks from replication. 
    - If you exclude disks, they won't be present on the Azure VM after migration. 
1. In **Tags**, add tags to your migrated virtual machines, disks, and NICs.

1. In **Review and start replication**, review the settings, and select **Replicate** to start the initial replication for the servers. 

    > [!Note]
    > You can update replication settings any time before replication starts, **Manage** > **Replicating machines**. Settings can't be changed after replication starts. 

   Next, follow the instructions to [perform migrations](tutorial-migrate-physical-virtual-machines.md#run-a-test-migration).

### Grant access permissions to the Recovery Services vault

You must grant the permissions to the Recovery Services vault for authenticated access to the cache/replication storage account.

To identify the Recovery Services vault created by Azure Migrate and grant the required permissions, follow these steps.

**Identify the Recovery Services vault and the managed identity object ID**

You can find the details of the Recovery Services vault on the **Migration and modernization** page.

1. Go to the **Azure Migrate** hub, and on the **Migration and modernization** tile, select **Overview**.
1. In the left pane, select **Properties**. Make a note of the Recovery Services vault name and managed identity ID. The vault will have **Private endpoint** as the **Connectivity type** and **Other** as the **Replication type**. You'll need this information when you provide access to the vault.

**Permissions to access the storage account**

 To the managed identity of the vault, you must grant the following role permissions on the storage account required for replication. In this case, you must create the storage account in advance.

The role permissions for the Azure Resource Manager vary depending on the type of storage account.

|**Storage account type** | **Role permissions**|
|--- | ---|
|Standard type | [Contributor](../role-based-access-control/built-in-roles.md#contributor)<br>[Storage Blob Data Contributor](../role-based-access-control/built-in-roles.md#storage-blob-data-contributor)|
|Premium type | [Contributor](../role-based-access-control/built-in-roles.md#contributor)<br>[Storage Blob Data Owner](../role-based-access-control/built-in-roles.md#storage-blob-data-owner)

1. Go to the replication/cache storage account selected for replication. In the left pane, select **Access control (IAM)**.
1. Select **+ Add**, and select **Add role assignment**.
1. On the **Add role assignment** page in the **Role** box, select the appropriate role from the permissions list previously mentioned. Enter the name of the vault noted previously and select **Save**.
1. In addition to these permissions, you must also allow access to Microsoft trusted services. If your network access is restricted to selected networks, on the **Networking** tab in the **Exceptions** section, select **Allow trusted Microsoft services to access this storage account**.
## Create a private endpoint for the storage account

To replicate by using ExpressRoute with private peering, [create a private endpoint](../private-link/tutorial-private-endpoint-storage-portal.md#create-storage-account-with-a-private-endpoint) for the cache/replication storage accounts (target subresource: *blob*).

>[!Note]
> You can create private endpoints only on a general-purpose v2 storage account. For pricing information, see [Azure Page Blobs pricing](https://azure.microsoft.com/pricing/details/storage/page-blobs/) and [Azure Private Link pricing](https://azure.microsoft.com/pricing/details/private-link/).

Create the private endpoint for the storage account in the same virtual network as the Azure Migrate project private endpoint or another virtual network connected to this network.

Select **Yes**, and integrate with a private DNS zone. The private DNS zone helps in routing the connections from the virtual network to the storage account over a private link. Selecting **Yes** automatically links the DNS zone to the virtual network. It also adds the DNS records for the resolution of new IPs and FQDNs that are created. Learn more about [private DNS zones](../dns/private-dns-overview.md).

If the user who created the private endpoint is also the storage account owner, the private endpoint creation will be auto-approved. Otherwise, the owner of the storage account must approve the private endpoint for use. To approve or reject a requested private endpoint connection, on the storage account page under **Networking**, go to **Private endpoint connections**.

Review the status of the private endpoint connection state before you continue.

After you've created the private endpoint, use the dropdown list in **Replicate** > **Target settings** > **Cache storage account** to select the storage account for replicating over a private link.

Ensure that the on-premises replication appliance has network connectivity to the storage account on its private endpoint. To validate the private link connection, perform a DNS resolution of the storage account endpoint (private link resource FQDN) from the on-premises server hosting the replication appliance and ensure that it resolves to a private IP address. Learn how to verify [network connectivity.](./troubleshoot-network-connectivity.md#verify-dns-resolution)

## Next steps
- [Migrate VMs](tutorial-migrate-physical-virtual-machines.md#migrate-vms)
- Complete the [migration process](tutorial-migrate-physical-virtual-machines.md#complete-the-migration). 
- Review the [post-migration best practices](tutorial-migrate-physical-virtual-machines.md#post-migration-best-practices).


---
title: Migrate Hyper-V servers to Azure by using Private Link
description: Use Azure Migrate with private endpoints to migrate on-premises Hyper-V VMs to Azure.
author: vijain
ms.author: vijain
ms.topic: how-to
ms.service: azure-migrate
ms.date: 12/14/2022
ms.custom: engagement-fy23
---

# Migrate Hyper-V servers to Azure using Private Link

This article describes how to use Azure Migrate to migrate servers over a private network by using [Azure Private Link](../private-link/private-endpoint-overview.md). You can use the [Migration and modernization](migrate-services-overview.md) tool to connect privately and securely to Azure Migrate over an Azure ExpressRoute private peering or a site-to-site (S2S) VPN connection by using Private Link. 

This article shows you how to [migrate on-premises Hyper-V VMs to Azure](tutorial-migrate-hyper-v.md), using the [Migration and modernization](migrate-services-overview.md) tool, with agentless migration. You can also migrate using agent-based migration.  

## Set up the replication provider for migration 

The following diagram illustrates the agentless migration workflow with private endpoints by using the Migration and modernization tool. 

:::image type="content" source="./media/how-to-use-azure-migrate-with-private-endpoints/replication-architecture.png" alt-text="Diagram that shows replication architecture." lightbox="./media/how-to-use-azure-migrate-with-private-endpoints/replication-architecture.png":::

For migrating Hyper-V VMs, the Migration and modernization tool installs software providers (Microsoft Azure Site Recovery provider and Microsoft Azure Recovery Service agent) on Hyper-V Hosts or cluster nodes.  

1. In the Azure Migrate project > **Servers, databases and web apps** > **Migration and modernization**, select **Discover**.
1. In **Discover machines** > **Are your machines virtualized?**, select **Yes, with Hyper-V**.
1. In **Target region**, select the Azure region to which you want to migrate the machines.
1. Select **Confirm that the target region for migration is region-name**. 
1. Select **Create resources**. This creates an Azure Site Recovery vault in the background. Don't close the page during the creation of resources. If you have already set up migration with the Migration and modernization tool, this option won't appear since resources were set up previously. 
    - This step creates a Recovery Services vault in the background and enables a managed identity for the vault. A Recovery Services vault is an entity that contains the replication information of servers and is used to trigger replication operations.
    - If the Azure Migrate project has private endpoint connectivity, a private endpoint is created for the Recovery Services vault. This step adds five fully qualified domain names (FQDNs) to the private endpoint, one for each microservice linked to the Recovery Services vault.
    - The five domain names are formatted in this pattern:  *{Vault-ID}-asr-pod01-{type}-.{target-geo-code}*.privatelink.siterecovery.windowsazure.com
    - By default, Azure Migrate automatically creates a private DNS zone and adds DNS A records for the Recovery Services vault microservices. The private DNS is then linked to the private endpoint virtual network.
1. In **Prepare Hyper-V host servers**, download the Hyper-V Replication provider, and the registration key file. 

    - The registration key is needed to register the Hyper-V host with the Migration and modernization tool. 

    - The key is valid for five days after you generate it. 
1. Copy the provider setup file and registration key file to each Hyper-V host (or cluster node) running VMs you want to replicate. 

> [!Note]
>Before you register the replication provider, ensure that the vault's private link FQDNs are reachable from the machine that hosts the replication provider. Additional DNS configuration can be required for the on-premises replication appliance to resolve the private link FQDNs to their private IP addresses. Learn more about [how to verify network connectivity](./troubleshoot-network-connectivity.md#verify-dns-resolution). 

Next, follow these instructions to [install and register the replication provider](tutorial-migrate-hyper-v.md#install-and-register-the-provider). 
  
## Replicate Hyper-V VMs

With discovery completed, you can begin replication of Hyper-V VMs to Azure.  

> [!Note]
> You can replicate up to 10 machines together. If you need to replicate more, then replicate them simultaneously in batches of 10.

1. In the Azure Migrate project > **Servers, databases and web apps** > **Migration and modernization** > **Migration tools**, select **Replicate**. 
1. In **Replicate** > **Basics** > **Are your machines virtualized?**, select **Yes, with Hyper-V**. Then select **Next: Virtual machines**.
1. In **Virtual machines**, select the machines you want to replicate. 
    - If you've run an assessment for the VMs, you can apply VM sizing and disk type (premium/standard) recommendations from the assessment results. To do this, in **Import migration settings from an Azure Migrate assessment?**, select the **Yes** option. 
    - If you didn't run an assessment, or you don't want to use the assessment settings, select the **No** option. 
    - If you selected to use the assessment, select the VM group, and assessment name. 

1. In **Virtual machines**, search for VMs as needed, and select each VM you want to migrate. Then select **Next:Target settings**. 

1. In **Target settings**, select the target region to which you'll migrate, the subscription, and the resource group in which the Azure VMs will reside after migration.  

1. In **Replication storage account**, select the Azure storage account in which replicated data will be stored in Azure.  

1. Next, [**create a private endpoint for the storage account**](/azure/migrate/migrate-servers-to-azure-using-private-link?pivots=agentlessvmware#create-a-private-endpoint-for-the-storage-account) and [**grant permissions to the Recovery Services vault managed identity**](/azure/migrate/migrate-servers-to-azure-using-private-link?pivots=agentbased#grant-access-permissions-to-the-recovery-services-vault-1) to access the storage account required by Azure Migrate. This is mandatory before you proceed. 

    -  For Hyper-V VM migrations to Azure, if the replication storage account is of *Premium* type, you must select another storage account of *Standard* type for the cache storage account. In this case, you must create private endpoints for both the replication and cache storage account.

    - Ensure that the server hosting the replication provider has network connectivity to the storage accounts via the private endpoints before you proceed. Learn how to [verify network connectivity](./troubleshoot-network-connectivity.md#verify-dns-resolution).  
        >[!Tip] 
        > You can manually update the DNS records by editing the DNS hosts file on the Azure Migrate appliance with the private link FQDNs and private IP addresses of the storage account. 

1. In **Virtual network**, select the Azure VNet/subnet for the migrated Azure VMs.

1. In **Availability options**, select: 

    - Availability Zone to pin the migrated machine to a specific Availability Zone in the region. Use this option to distribute servers that form a multi-node application tier across Availability Zones. If you select this option, you'll need to specify the Availability Zone to use for each of the selected machine in the Compute tab. This option is only available if the target region selected for the migration supports Availability Zones. 

    - Availability Set to place the migrated machine in an Availability Set. The target Resource Group that was selected must have one or more availability sets in order to use this option. 

    - No infrastructure redundancy required option if you don't need either of these availability configurations for the migrated machines. 

1. In **Azure Hybrid Benefit**: 

    - Select **No** if you don't want to apply Azure Hybrid Benefit. Then, select **Next**. 

    - Select **Yes** if you have Windows Server machines that are covered with active Software Assurance or Windows Server subscriptions, and you want to apply the benefit to the machines you're migrating. Then select **Next**.

1. In **Compute**, review the VM name, size, OS disk type, and availability configuration (if selected in the previous step). VMs must conform with [Azure requirements](migrate-support-matrix-hyper-v-migration.md#azure-vm-requirements). 

    - **VM size**: If you're using assessment recommendations, the VM size dropdown shows the recommended size. Otherwise, Azure Migrate picks a size based on the closest match in the Azure subscription. Alternatively, pick a manual size in **Azure VM size**. 

    - **OS disk**: Specify the OS (boot) disk for the VM. The OS disk is the disk that has the operating system bootloader and installer. 

    - **Availability Set**: If the VM should be in an Azure availability set after migration, specify the set. The set must be in the target resource group you specify for the migration.

1. In **Disks**, specify the VM disks that need to be replicated to Azure. Then select **Next**. 
    - You can exclude disks from replication. 
    - If you exclude disks, they won't be present on the Azure VM after migration. 

1. In **Tags**, add tags to your migrated virtual machines, disks, and NICs.

1. In **Review and start replication**, review the settings, and select **Replicate** to start the initial replication for the servers. 

    > [!Note]
    > You can update replication settings any time before replication starts, **Manage** > **Replicating machines**. Settings can't be changed after replication starts. 

    Next, follow the instructions to [perform migrations](tutorial-migrate-hyper-v.md#migrate-vms). 

### Grant access permissions to the Recovery Services vault

You must grant the permissions to the Recovery Services vault for authenticated access to the cache/replication storage account.

To identify the Recovery Services vault created by Azure Migrate and grant the required permissions, follow these steps.

**Identify the Recovery Services vault and the managed identity object ID**

You can find the details of the Recovery Services vault on the Migration and modernization tool **Properties** page.

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

Select **Yes** and integrate with a private DNS zone. The private DNS zone helps in routing the connections from the virtual network to the storage account over a private link. Selecting **Yes** automatically links the DNS zone to the virtual network. It also adds the DNS records for the resolution of new IPs and FQDNs that are created. Learn more about [private DNS zones](../dns/private-dns-overview.md).

If the user who created the private endpoint is also the storage account owner, the private endpoint creation will be auto approved. Otherwise, the owner of the storage account must approve the private endpoint for use. To approve or reject a requested private endpoint connection, on the storage account page under **Networking**, go to **Private endpoint connections**.

Review the status of the private endpoint connection state before you continue.

After you've created the private endpoint, use the dropdown list in **Replicate** > **Target settings** > **Cache storage account** to select the storage account for replicating over a private link.

Ensure that the on-premises replication appliance has network connectivity to the storage account on its private endpoint. Learn more about how to verify [network connectivity](./troubleshoot-network-connectivity.md). 

Ensure that the replication provider has network connectivity to the storage account via its private endpoint. To validate the private link connection, perform a DNS resolution of the storage account endpoint (private link resource FQDN) from the on-premises server hosting the replication provider and ensure that it resolves to a private IP address. Learn how to verify [network connectivity.](./troubleshoot-network-connectivity.md#verify-dns-resolution)


>[!Note]
> For Hyper-V VM migrations to Azure, if the replication storage account is of *Premium* type, you must select another storage account of *Standard* type for the cache storage account. In this case, you must create private endpoints for both the replication and cache storage account. 


## Next steps

 - [Migrate VMs](tutorial-migrate-hyper-v.md#migrate-vms)
 - Complete the [migration process](tutorial-migrate-hyper-v.md#complete-the-migration).
 - Review the [post-migration best practices](tutorial-migrate-hyper-v.md#post-migration-best-practices).





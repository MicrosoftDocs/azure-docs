---
title: Migrate servers to Azure by using Private Link
description: Use Azure Migrate with private endpoints for migrations by using ExpressRoute private peering or VPN connections.
author: deseelam
ms.author: deseelam
ms.manager: bsiva
zone_pivot_groups: migrate-agentlessvmware-hyperv-agentbased
ms.topic: how-to
ms.date: 12/29/2021
---

# Migrate servers to Azure by using Private Link

::: zone pivot="agentlessvmware"

The following sections describe the steps required to use Azure Migrate with [private endpoints](../private-link/private-endpoint-overview.md) for migrations by using ExpressRoute private peering or VPN connections.


# Perform agentless VMware migration using Private Link
This article shows you how to [migrate on-premises VMware VMs to Azure](./tutorial-migrate-vmware.md), using the [Azure Migrate: Server Migration tool](migrate-services-overview.md#azure-migrate-server-migration-tool), with agentless migration. You can also migrate using agent-based migration. [Compare](server-migrate-overview.md#compare-migration-methods) the methods.


## Set up the Azure Migrate appliance

Azure Migrate Server Migration runs a lightweight VMware VM appliance that's used for discovery, assessment, and agentless migration of VMware VMs. If you followed the [assessment tutorial](tutorial-assess-vmware-azure-vm.md), you've already set the appliance up. If you didn't, set it up now using one of these methods: 
- **OVA template**: [Set up](how-to-set-up-appliance-vmware.md) on a VMware VM using a downloaded OVA template. 
- **Script**: [Set up](deploy-appliance-script.md) on a VMware VM or physical machine, using a PowerShell installer script. This method should be used if you can't set up a VM using an OVA template, or if you're in Azure Government. 
After creating the appliance, check that it can connect to Azure Migrate: Server Assessment, configure it for the first time, and register it with the Azure Migrate project. 

## Replicate VMs to Azure by using Private Link

The following diagram illustrates the agentless replication workflow with private endpoints by using the Azure Migrate: Server Migration tool.

![Diagram that shows agentless replication architecture.](./media/how-to-use-azure-migrate-with-private-endpoints/agentless-replication-architecture.png)

After setting up the appliance and completing discovery, you can begin the replication of VMware VMs to Azure.
- You can run up to 500 replications simultaneously.
- In the portal, you can select up to 10 VMs at once for migration. To migrate more machines, add them to groups in batches of 10. 

Enable replication as follows:
1. In the Azure Migrate project > **Servers** > **Migration tools** > Azure Migrate: Server Migration, click **Replicate**. 

    ![Diagram that shows how to replicate servers.](./media/how-to-use-azure-migrate-with-private-endpoints/replicate-servers.png)

1. In **Replicate** > **Source settings** > **Are your machines virtualized?**, select **Yes, with VMware vSphere**.
1. In **On-premises appliance**, select the name of the Azure Migrate appliance that you set up and click **OK**.

    ![Diagram that shows how to complete source settings.](./media/how-to-use-azure-migrate-with-private-endpoints/source-settings-vmware.png)

1. In **Virtual machines**, select the machines you want to replicate. To apply VM sizing and disk type from an assessment if you've run one, in **Import migration settings from an Azure Migrate assessment?**, select **Yes**, and select the VM group and assessment name. If you aren't using assessment settings, select **No**. 

    ![Diagram that shows how to select the VMs.](./media/how-to-use-azure-migrate-with-private-endpoints/migrate-machines-vmware.png) 

1. In **Virtual machines**, select VMs you want to migrate. Then click **Next**. 

    ![Screenshot of selected VMs to be replicated.](./media/how-to-use-azure-migrate-with-private-endpoints/select-vm-vmware.png) 

1. In **Target settings**, select the **target region** in which the Azure VMs will reside after migration.  

    ![Screenshot of the Target settings screen.](./media/how-to-use-azure-migrate-with-private-endpoints/target-settings-agentless-vmware.png)

1. In **Replication storage account**, use the dropdown list to select a storage account to replicate over a private link.  
    Next, [create a private endpoint for the storage account](migrate-servers-to-azure-using-private-link.md#Create-a-private-endpoint-for-the-storage-account) to enable replications over a private link.   
1. Select the **Subscription** and **Resource group** in which the Azure VMs reside after migration. 
1. In **Virtual network**, select the Azure VNet/subnet which the Azure VMs join after migration. 
1. In **Availability options**, select: 

    - Availability Zone to pin the migrated machine to a specific Availability Zone in the region. Use this option to distribute servers that form a multi-node application tier across Availability Zones. If you select this option, you'll need to specify the Availability Zone to use for each of the selected machine in the Compute tab. This option is only available if the target region selected for the migration supports Availability Zones 

    - Availability Set to place the migrated machine in an Availability Set. The target Resource Group that was selected must have one or more availability sets in order to use this option. 

    - No infrastructure redundancy required option if you don't need either of these availability configurations for the migrated machines. 
1. In **Disk encryption type**, select: 

    - Encryption-at-rest with platform-managed key 

    - Encryption-at-rest with customer-managed key 

    - Double encryption with platform-managed and customer-managed keys 

    >[!Note] 
    > To replicate VMs with CMK, you'll need to [create a disk encryption set](./virtual-machines/disks-enable-customer-managed-keys-portal.md#set-up-your-disk-encryption-set)under the target Resource Group. A disk encryption set object maps Managed Disks to a Key Vault that contains the CMK to use for SSE. 
1. In **Azure Hybrid Benefit**: 

    - Select **No** if you don't want to apply Azure Hybrid Benefit. Then click **Next**. 

    - Select **Yes** if you have Windows Server machines that are covered with active Software Assurance or Windows Server subscriptions, and you want to apply the benefit to the machines you're migrating. Then click **Next**. 

1. In **Compute**, review the VM name, size, OS disk type, and availability configuration (if selected in the previous step). VMs must conform with [Azure requirements](migrate-support-matrix-vmware-migration.md#azure-vm-requirements). 

    - **VM size**: If you're using assessment recommendations, the VM size dropdown shows the recommended size. Otherwise, Azure Migrate picks a size based on the closest match in the Azure subscription. Alternatively, pick a manual size in **Azure VM size**. 

    - **OS disk**: Specify the OS (boot) disk for the VM. The OS disk is the disk that has the operating system bootloader and installer. 

    - **Availability Zone**: Specify the Availability Zone to use. 

    - **Availability Set**: Specify the Availability Set to use. 
>[!Note] 
> If you want to select a different availability option for a set of virtual machines, go to step 1 and repeat the steps by selecting different availability options after starting replication for one set of virtual machines. 
1. In **Disks**, specify whether the VM disks should be replicated to Azure, and select the disk type (standard SSD/HDD or premium-managed disks) in Azure. Then click **Next**. 

     ![Screenshot shows the Disks tab of the Replicate dialog box.](./media/how-to-use-azure-migrate-with-private-endpoints/disks-agentless-vmware.png)

1. In **Review and start replication**, review the settings, and click **Replicate** to start the initial replication for the servers. 
    Next, follow the instructions to [perform migrations](tutorial-migrate-vmware.md#run-a-test-migration). 

## Create a private endpoint for the storage account  

To replicate by using ExpressRoute with private peering, [create a private endpoint](./private-link/tutorial-private-endpoint-storage-portal#create-storage-account-with-a-private-endpoint) for the cache/replication storage account (target subresource: *blob*). 

>[!Note] 
> You can create private endpoints only on a general-purpose v2 storage account. For pricing information, see [Azure Page Blobs pricing](https://azure.microsoft.com/pricing/details/storage/page-blobs/) and [Azure Private Link pricing](https://azure.microsoft.com/pricing/details/private-link/). 

Create the private endpoint for the storage account in the same virtual network as the Azure Migrate project private endpoint or another virtual network connected to this network. 

Select **Yes** and integrate with a private DNS zone. The private DNS zone helps in routing the connections from the virtual network to the storage account over a private link. Selecting **Yes** automatically links the DNS zone to the virtual network. It also adds the DNS records for the resolution of new IPs and FQDNs that are created. Learn more about [private DNS zones](../dns/private-dns-overview). 

If the user who created the private endpoint is also the storage account owner, the private endpoint creation will be auto approved. Otherwise, the owner of the storage account must approve the private endpoint for use. To approve or reject a requested private endpoint connection, on the storage account page under **Networking**, go to **Private endpoint connections**. 

Review the status of the private endpoint connection state before you continue. 

![Screenshot that shows the Private endpoint approval status.](./media/how-to-use-azure-migrate-with-private-endpoints/private-endpoint-status-vmware.png)

After you've created the private endpoint, use the dropdown list in **Replicate** > **Target settings** > **Cache storage account** to select the storage account for replicating over a private link. 

Ensure that the on-premises replication appliance has network connectivity to the storage account on its private endpoint. Learn more about how to verify [network connectivity](./troubleshoot-network-connectivity.md). 

## Next steps 

 - Complete the [migration process](./tutorial-migrate-physical-virtual-machines.md#complete-the-migration).
 - Review the [post-migration best practices](./tutorial-migrate-physical-virtual-machines.md#post-migration-best-practices). 

::: zone-end


::: zone pivot="hyperv"


# Perform agentless Hyper-V migrations using Private Link 

This article shows you how to [migrate on-premises Hyper-V VMs to Azure](tutorial-migrate-hyper-v.md), using the [Azure Migrate:Server Migration](migrate-services-overview.md#azure-migrate-server-migration-tool) tool, with agentless migration. You can also migrate using agent-based migration.  

## Set up the replication provider for migration 

The following diagram illustrates the agentless migration workflow with private endpoints by using the Azure Migrate: Server Migration tool. 

 ![Diagram that shows replication architecture.](./media/how-to-use-azure-migrate-with-private-endpoints/replication-architecture.png)

For migrating Hyper-V VMs, Azure Migrate: Server Migration installs software providers (Microsoft Azure Site Recovery provider and Microsoft Azure Recovery Service agent) on Hyper-V Hosts or cluster nodes.  
1. In the Azure Migrate project > **Servers**, in **Azure Migrate: Server Migration**, click **Discover**. 
1. In **Discover machines** > **Are your machines virtualized?**, select **Yes, with Hyper-V**.
1. In **Target region**, select the Azure region to which you want to migrate the machines.
1. Select **Confirm that the target region for migration is region-name**. 
1. Select **Create resources**. This creates an Azure Site Recovery vault in the background. Don't close the page during the creation of resources. If you have already set up migration with Azure Migrate Server Migration, this option won't appear since resources were set up previously. 
    - This step creates a Recovery Services vault in the background and enables a managed identity for the vault. A Recovery Services vault is an entity that contains the replication information of servers and is used to trigger replication operations.
    - If the Azure Migrate project has private endpoint connectivity, a private endpoint is created for the Recovery Services vault. This step adds five fully qualified domain names (FQDNs) to the private endpoint, one for each microservice linked to the Recovery Services vault.
    - The five domain names are formatted in this pattern: <br/> _{Vault-ID}-asr-pod01-{type}-.{target-geo-code}_.privatelink.siterecovery.windowsazure.com
    - By default, Azure Migrate automatically creates a private DNS zone and adds DNS A records for the Recovery Services vault microservices. The private DNS is then linked to the private endpoint virtual network.
1. In **Prepare Hyper-V host servers**, download the Hyper-V Replication provider, and the registration key file. 

    - The registration key is needed to register the Hyper-V host with Azure Migrate Server Migration. 

    - The key is valid for five days after you generate it. 

    ![Screenshot of discover machines screen.](./media/how-to-use-azure-migrate-with-private-endpoints/discover-machines-hyperv.png)
1. Copy the provider setup file and registration key file to each Hyper-V host (or cluster node) running VMs you want to replicate.
> [!Note]
>Before you register the replication provider, ensure that the vault's private link FQDNs are reachable from the machine that hosts the replication appliance. Additional DNS configuration may be required for the on-premises replication appliance to resolve the private link FQDNs to their private IP addresses. Learn more about [how to verify network connectivity](./troubleshoot-network-connectivity.md#verify-dns-resolution)

Next, follow these instructions to [install and register the replication provider](tutorial-migrate-hyper-v?tabs=UI.md#install-and-register-the-provider). 
  
## Replicate Hyper-V VMs

With discovery completed, you can begin replication of Hyper-V VMs to Azure.  

> [!Note] 
> You can replicate up to 10 machines together. If you need to replicate more, then replicate them simultaneously in batches of 10. 

1. In the Azure Migrate project > **Servers** > **Migration tools** > Azure Migrate: Server Migration, click **Replicate**. 
1. In **Replicate** > **Source settings** > **Are your machines virtualized?**, select **Yes, with Hyper-V**. Then click **Next: Virtual machines**.
1. In **Virtual machines**, select the machines you want to replicate. 
    - If you've run an assessment for the VMs, you can apply VM sizing and disk type (premium/standard) recommendations from the assessment results. To do this, in **Import migration settings from an Azure Migrate assessment?**, select the **Yes** option. 
    - If you didn't run an assessment, or you don't want to use the assessment settings, select the **No** option. 
    - If you selected to use the assessment, select the VM group, and assessment name. 

    ![Screenshot of migrate machines screen.](./media/how-to-use-azure-migrate-with-private-endpoints/migrate-machines-vmware.png) 

1. In **Virtual machines**, search for VMs as needed, and select each VM you want to migrate. Then click **Next:Target settings**. 

    ![Screenshot of selected VMs.](./media/how-to-use-azure-migrate-with-private-endpoints/select-vm-vmware.png) 

1. In **Target settings**, select the target region to which you'll migrate, the subscription, and the resource group in which the Azure VMs will reside after migration.  

    ![Screenshot of target settings.](./media/how-to-use-azure-migrate-with-private-endpoints/target-settings-agentless-hyperv.png)

1. In **Replication storage account**, select the Azure storage account in which replicated data will be stored in Azure.  

    Next, [create a private endpoint for the storage account](bookmark://_Create_a_private) and [grant permissions to the Recovery Services vault managed identity](bookmark://_Grant_access_permissions)to access the storage account required by Azure Migrate. This is mandatory before you proceed. 

    For Hyper-V VM migrations to Azure, if the replication storage account is of *Premium* type, you must select another storage account of *Standard* type for the cache storage account. In this case, you must create private endpoints for both the replication and cache storage account.

1. In **Virtual network**, select the Azure VNet/subnet which the Azure VMs join after migration. 

1. In **Availability options**, select: 

    - Availability Zone to pin the migrated machine to a specific Availability Zone in the region. Use this option to distribute servers that form a multi-node application tier across Availability Zones. If you select this option, you'll need to specify the Availability Zone to use for each of the selected machine in the Compute tab. This option is only available if the target region selected for the migration supports Availability Zones. 

    - Availability Set to place the migrated machine in an Availability Set. The target Resource Group that was selected must have one or more availability sets in order to use this option. 

    - No infrastructure redundancy required option if you don't need either of these availability configurations for the migrated machines. 

1. In **Azure Hybrid Benefit**: 

    - Select **No** if you don't want to apply Azure Hybrid Benefit. Then, click **Next**. 

    - Select **Yes** if you have Windows Server machines that are covered with active Software Assurance or Windows Server subscriptions, and you want to apply the benefit to the machines you're migrating. Then click **Next**.

    ![Screenshot of Azure Hybrid benefit selection.](./media/how-to-use-azure-migrate-with-private-endpoints/azure-hybrid-benefit.png)

1. In **Compute**, review the VM name, size, OS disk type, and availability configuration (if selected in the previous step). VMs must conform with [Azure requirements](migrate-support-matrix-hyper-v-migration.md#azure-vm-requirements). 

    - **VM size**: If you're using assessment recommendations, the VM size dropdown shows the recommended size. Otherwise, Azure Migrate picks a size based on the closest match in the Azure subscription. Alternatively, pick a manual size in **Azure VM size**. 

    - **OS disk**: Specify the OS (boot) disk for the VM. The OS disk is the disk that has the operating system bootloader and installer. 

    - **Availability Set**: If the VM should be in an Azure availability set after migration, specify the set. The set must be in the target resource group you specify for the migration.

 ![Screenshot of Compute screen with VMs.](./media/how-to-use-azure-migrate-with-private-endpoints/compute-hyperv.png)

1. In **Disks**, specify the VM disks that need to be replicated to Azure. Then click **Next**. 
    - You can exclude disks from replication. 
    - If you exclude disks, they won't be present on the Azure VM after migration. 

    ![Screenshot shows the Disks tab of the Replicate dialog box.](./media/how-to-use-azure-migrate-with-private-endpoints/disks-agentless-vmware.png)

1. In **Review and start replication**, review the settings, and click **Replicate** to start the initial replication for the servers. 

>[!Note]
> You can update replication settings any time before replication starts, **Manage** > **Replicating machines**. Settings can't be changed after replication starts. 

Next, follow the instructions to [perform migrations](tutorial-migrate-physical-virtual-machines.md#run-a-test-migration). 

### Grant access permissions to the Recovery Services vault

You must grant the permissions to the Recovery Services vault for authenticated access to the cache/replication storage account.

To identify the Recovery Services vault created by Azure Migrate and grant the required permissions, follow these steps.

**Identify the Recovery Services vault and the managed identity object ID**

You can find the details of the Recovery Services vault on the Azure Migrate: Server Migration **Properties** page.

1. Go to the **Azure Migrate** hub, and on the **Azure Migrate: Server Migration** tile, select **Overview**.

    ![Screenshot that shows the Overview page on the Azure Migrate hub.](./media/how-to-use-azure-migrate-with-private-endpoints/hub-overview.png)

1. In the left pane, select **Properties**. Make a note of the Recovery Services vault name and managed identity ID. The vault will have **Private endpoint** as the **Connectivity type** and **Other** as the **Replication type**. You'll need this information when you provide access to the vault.

    ![Screenshot that shows the Azure Migrate: Server Migration Properties page.](./media/how-to-use-azure-migrate-with-private-endpoints/vault-info.png)

**Permissions to access the storage account**

 To the managed identity of the vault, you must grant the following role permissions on the storage account required for replication. In this case, you must create the storage account in advance.

The role permissions for the Azure Resource Manager vary depending on the type of storage account.

|**Storage account type** | **Role permissions**|
|--- | ---|
|Standard type | [Contributor](../role-based-access-control/built-in-roles.md#contributor)<br>[Storage Blob Data Contributor](../role-based-access-control/built-in-roles.md#storage-blob-data-contributor)|
|Premium type | [Contributor](../role-based-access-control/built-in-roles.md#contributor)<br>[Storage Blob Data Owner](../role-based-access-control/built-in-roles.md#storage-blob-data-owner)

1. Go to the replication/cache storage account selected for replication. In the left pane, select **Access control (IAM)**.

1. Select **+ Add**, and select **Add role assignment**.

   ![Screenshot that shows Add role assignment.](./media/how-to-use-azure-migrate-with-private-endpoints/storage-role-assignment.png)

1. On the **Add role assignment** page in the **Role** box, select the appropriate role from the permissions list previously mentioned. Enter the name of the vault noted previously and select **Save**.

    ![Screenshot that shows the Add role assignment page.](./media/how-to-use-azure-migrate-with-private-endpoints/storage-role-assignment-select-role.png)

1. In addition to these permissions, you must also allow access to Microsoft trusted services. If your network access is restricted to selected networks, on the **Networking** tab in the **Exceptions** section, select **Allow trusted Microsoft services to access this storage account**.

   ![Screenshot that shows the Allow trusted Microsoft services to access this storage account option.](./media/how-to-use-azure-migrate-with-private-endpoints/exceptions.png)

## Create a private endpoint for the storage account 

To replicate by using ExpressRoute with private peering, [create a private endpoint](../private-link/tutorial-private-endpoint-storage-portal.md#create-storage-account-with-a-private-endpoint) for the cache/replication storage accounts (target subresource: _blob_).

>[!Note]
> You can create private endpoints only on a general-purpose v2 storage account. For pricing information, see [Azure Page Blobs pricing](https://azure.microsoft.com/pricing/details/storage/page-blobs/) and [Azure Private Link pricing](https://azure.microsoft.com/pricing/details/private-link/).

Create the private endpoint for the storage account in the same virtual network as the Azure Migrate project private endpoint or another virtual network connected to this network.

Select **Yes** and integrate with a private DNS zone. The private DNS zone helps in routing the connections from the virtual network to the storage account over a private link. Selecting **Yes** automatically links the DNS zone to the virtual network. It also adds the DNS records for the resolution of new IPs and FQDNs that are created. Learn more about [private DNS zones](../dns/private-dns-overview.md).

If the user who created the private endpoint is also the storage account owner, the private endpoint creation will be auto approved. Otherwise, the owner of the storage account must approve the private endpoint for use. To approve or reject a requested private endpoint connection, on the storage account page under **Networking**, go to **Private endpoint connections**.

Review the status of the private endpoint connection state before you continue.

![Screenshot that shows the Private endpoint approval status.](./media/how-to-use-azure-migrate-with-private-endpoints/private-endpoint-connection-state.png)

After you've created the private endpoint, use the dropdown list in **Replicate** > **Target settings** > **Cache storage account** to select the storage account for replicating over a private link.

Ensure that the on-premises replication appliance has network connectivity to the storage account on its private endpoint. Learn more about how to verify [network connectivity](./troubleshoot-network-connectivity.md).

>[!Note]
> For Hyper-V VM migrations to Azure, if the replication storage account is of _Premium_ type, you must select another storage account of _Standard_ type for the cache storage account. In this case, you must create private endpoints for both the replication and cache storage account.

## Next steps
 - Complete the [migration process](./tutorial-migrate-physical-virtual-machines.md#complete-the-migration).
 - Review the [post-migration best practices](./tutorial-migrate-physical-virtual-machines.md#post-migration-best-practices).

::: zone-end


::: zone pivot="agentbased"


# Perform agent-based migrations using Azure Private Link 
This article shows a proof-of-concept deployment path for agent-based replications to migrate your [VMware VMs](tutorial-migrate-vmware-agent.md), [Hyper-V VMs](tutorial-migrate-physical-virtual-machines.md), [physical servers](tutorial-migrate-physical-virtual-machines.md), [VMs running on AWS](tutorial-migrate-aws-virtual-machines.md), [VMs running on GCP](tutorial-migrate-gcp-virtual-machines.md), or VMs running on a different virtualization provider by using Azure private endpoints. 

## Set up a replication appliance for migration

The following diagram illustrates the agent-based replication workflow with private endpoints by using the Azure Migrate: Server Migration tool.

![Diagram that shows replication architecture.](./media/how-to-use-azure-migrate-with-private-endpoints/replication-architecture.png)

The tool uses a replication appliance to replicate your servers to Azure. Follow these steps to create the required resources for migration.

1. In **Discover machines** > **Are your machines virtualized?**, select **Not virtualized/Other**.
1. In **Target region**, select and confirm the Azure region to which you want to migrate the machines.
1. Select **Create resources** to create the required Azure resources. Don't close the page during the creation of resources.
    - This step creates a Recovery Services vault in the background and enables a managed identity for the vault. A Recovery Services vault is an entity that contains the replication information of servers and is used to trigger replication operations.
    - If the Azure Migrate project has private endpoint connectivity, a private endpoint is created for the Recovery Services vault. This step adds five fully qualified domain names (FQDNs) to the private endpoint, one for each microservice linked to the Recovery Services vault.
    - The five domain names are formatted in this pattern: <br/> _{Vault-ID}-asr-pod01-{type}-.{target-geo-code}_.privatelink.siterecovery.windowsazure.com
    - By default, Azure Migrate automatically creates a private DNS zone and adds DNS A records for the Recovery Services vault microservices. The private DNS is then linked to the private endpoint virtual network.

>[!Note]
> Before you register the replication appliance, ensure that the vault's private link FQDNs are reachable from the machine that hosts the replication appliance. Additional DNS configuration may be required for the on-premises replication appliance to resolve the private link FQDNs to their private IP addresses. Learn more about [how to verify network connectivity](./troubleshoot-network-connectivity.md#verify-dns-resolution).

After you verify the connectivity, download the appliance setup and key file, run the installation process, and register the appliance to Azure Migrate. Learn more about how to [set up the replication appliance](./tutorial-migrate-physical-virtual-machines#prepare-a-machine-for-the-replication-appliance). After you set up the replication appliance, follow these instructions to [install the mobility service](./tutorial-migrate-physical-virtual-machines.md#install-the-mobility-service) on the machines you want to migrate.

## Replicate servers

Now, select machines for replication and migration.

>[!Note]
> You can replicate up to 10 machines together. If you need to replicate more, then replicate them simultaneously in batches of 10. 

1. In the Azure Migrate project > **Servers** > **Migration tools** > Azure Migrate: Server Migration, click **Replicate**. 

    ![Diagram that shows how to replicate servers.](./media/how-to-use-azure-migrate-with-private-endpoints/replicate-servers.png)

1. In **Replicate** > **Source settings** > **Are your machines virtualized?**, select **Not virtualized/Other**. 
1. In **On-premises appliance**, select the name of the Azure Migrate appliance that you set up. 
1. In **Process Server**, select the name of the replication appliance. 
1. In **Guest credentials**, please select the dummy account created previously during the [replication installer setup](tutorial-migrate-physical-virtual-machines.md#download-the-replication-appliance-installer) to install the Mobility service manually (push install is not supported). Then click **Next: Virtual machines.**

    ![Diagram that shows how to complete source settings.](./media/how-to-use-azure-migrate-with-private-endpoints/source-settings-agent.png)

1. In **Virtual machines**, in **Import migration settings from an assessment?**, leave the default setting **No, I'll specify the migration settings manually**.
1. Select each VM you want to migrate. Then click **Next:Target settings**. 

    ![Screenshot of selected VMs to be replicated.](./media/how-to-use-azure-migrate-with-private-endpoints/select-vm-agent.png) 

1. In **Target settings**, select the subscription,the target region to which you'll migrate, and the resource group in which the Azure VMs will reside after migration.  

    ![Screenshot of target settings.](./media/how-to-use-azure-migrate-with-private-endpoints/target-settings-agentless-hyperv.png)

1. In **Virtual network**, select the Azure VNet/subnet which the Azure VMs join after migration. 
1. In **Cache storage account**, use the dropdown list to select a storage account to replicate over a private link.  

Next, [create a private endpoint for the storage account](../private-link/tutorial-private-endpoint-storage-portal.md#create-storage-account-with-a-private-endpoint) and [grant permissions to the Recovery Services vault managed identity](bookmark://_Grant_access_permissions) to access the storage account required by Azure Migrate. This is mandatory before you proceed.  

1. In **Availability options**, select: 

    - Availability Zone to pin the migrated machine to a specific Availability Zone in the region. Use this option to distribute servers that form a multi-node application tier across Availability Zones. If you select this option, you'll need to specify the Availability Zone to use for each of the selected machine in the Compute tab. This option is only available if the target region selected for the migration supports Availability Zones. 

    - Availability Set to place the migrated machine in an Availability Set. The target Resource Group that was selected must have one or more availability sets in order to use this option. 

    - No infrastructure redundancy required option if you don't need either of these availability configurations for the migrated machines. 
1. In **Disk encryption type**, select: 

    - Encryption-at-rest with platform-managed key 
    - Encryption-at-rest with customer-managed key 
    - Double encryption with platform-managed and customer-managed keys 
> [!Note]
> To replicate VMs with CMK, you'll need to [create a disk encryption set](../virtual-machines/disks-enable-customer-managed-keys-portal.md#set-up-your-disk-encryption-set) under the target Resource Group. A disk encryption set object maps Managed Disks to a Key Vault that contains the CMK to use for SSE. 
1. In **Azure Hybrid Benefit**: 
    - Select **No** if you don't want to apply Azure Hybrid Benefit. Then, click **Next**. 
    - Select **Yes** if you have Windows Server machines that are covered with active Software Assurance or Windows Server subscriptions, and you want to apply the benefit to the machines you're migrating. Then click **Next**.    
1. In **Compute**, review the VM name, size, OS disk type, and availability configuration (if selected in the previous step). VMs must conform with [Azure requirements](migrate-support-matrix-physical-migration.md#azure-vm-requirements). 
 - **VM size**: If you're using assessment recommendations, the VM size dropdown shows the recommended size. Otherwise, Azure Migrate picks a size based on the closest match in the Azure subscription. Alternatively, pick a manual size in **Azure VM size**. 

 - **OS disk**: Specify the OS (boot) disk for the VM. The OS disk is the disk that has the operating system bootloader and installer. 

 - **Availability Zone**: Specify the Availability Zone to use. 

 - **Availability Set**: Specify the Availability Set to use. 

    ![Screenshot of Compute screen with VMs.](./media/how-to-use-azure-migrate-with-private-endpoints/compute-hyperv.png)

1. In **Disks**, specify whether the VM disks should be replicated to Azure, and select the disk type (standard SSD/HDD or premium managed disks) in Azure. Then click **Next**. 
    - You can exclude disks from replication. 
    - If you exclude disks, they won't be present on the Azure VM after migration. 

    ![Screenshot shows the Disks tab of the Replicate dialog box.](./media/how-to-use-azure-migrate-with-private-endpoints/disks-agentless-vmware.png) 

1. In **Review and start replication**, review the settings, and click **Replicate** to start the initial replication for the servers. 

    > [!Note]
    > You can update replication settings any time before replication starts, **Manage** > **Replicating machines**. Settings can't be changed after replication starts. 

    Next, follow the instructions to [perform migrations](tutorial-migrate-physical-virtual-machines#run-a-test-migration).


### Grant access permissions to the Recovery Services vault

You must grant the permissions to the Recovery Services vault for authenticated access to the cache/replication storage account.

To identify the Recovery Services vault created by Azure Migrate and grant the required permissions, follow these steps.

**Identify the Recovery Services vault and the managed identity object ID**

You can find the details of the Recovery Services vault on the Azure Migrate: Server Migration **Properties** page.

1. Go to the **Azure Migrate** hub, and on the **Azure Migrate: Server Migration** tile, select **Overview**.

    ![Screenshot that shows the Overview page on the Azure Migrate hub.](./media/how-to-use-azure-migrate-with-private-endpoints/hub-overview.png)

1. In the left pane, select **Properties**. Make a note of the Recovery Services vault name and managed identity ID. The vault will have **Private endpoint** as the **Connectivity type** and **Other** as the **Replication type**. You'll need this information when you provide access to the vault.

    ![Screenshot that shows the Azure Migrate: Server Migration Properties page.](./media/how-to-use-azure-migrate-with-private-endpoints/vault-info.png)

**Permissions to access the storage account**

 To the managed identity of the vault, you must grant the following role permissions on the storage account required for replication. In this case, you must create the storage account in advance.

The role permissions for the Azure Resource Manager vary depending on the type of storage account.

|**Storage account type** | **Role permissions**|
|--- | ---|
|Standard type | [Contributor](../role-based-access-control/built-in-roles.md#contributor)<br>[Storage Blob Data Contributor](../role-based-access-control/built-in-roles.md#storage-blob-data-contributor)|
|Premium type | [Contributor](../role-based-access-control/built-in-roles.md#contributor)<br>[Storage Blob Data Owner](../role-based-access-control/built-in-roles.md#storage-blob-data-owner)

1. Go to the replication/cache storage account selected for replication. In the left pane, select **Access control (IAM)**.

1. Select **+ Add**, and select **Add role assignment**.

   ![Screenshot that shows Add role assignment.](./media/how-to-use-azure-migrate-with-private-endpoints/storage-role-assignment.png)

1. On the **Add role assignment** page in the **Role** box, select the appropriate role from the permissions list previously mentioned. Enter the name of the vault noted previously and select **Save**.

    ![Screenshot that shows the Add role assignment page.](./media/how-to-use-azure-migrate-with-private-endpoints/storage-role-assignment-select-role.png)

1. In addition to these permissions, you must also allow access to Microsoft trusted services. If your network access is restricted to selected networks, on the **Networking** tab in the **Exceptions** section, select **Allow trusted Microsoft services to access this storage account**.

   ![Screenshot that shows the Allow trusted Microsoft services to access this storage account option.](./media/how-to-use-azure-migrate-with-private-endpoints/exceptions.png)

## Create a private endpoint for the storage account

To replicate by using ExpressRoute with private peering, [create a private endpoint](../private-link/tutorial-private-endpoint-storage-portal.md#create-storage-account-with-a-private-endpoint) for the cache/replication storage accounts (target subresource: _blob_).

>[!Note]
> You can create private endpoints only on a general-purpose v2 storage account. For pricing information, see [Azure Page Blobs pricing](https://azure.microsoft.com/pricing/details/storage/page-blobs/) and [Azure Private Link pricing](https://azure.microsoft.com/pricing/details/private-link/).

Create the private endpoint for the storage account in the same virtual network as the Azure Migrate project private endpoint or another virtual network connected to this network.

Select **Yes**, and integrate with a private DNS zone. The private DNS zone helps in routing the connections from the virtual network to the storage account over a private link. Selecting **Yes** automatically links the DNS zone to the virtual network. It also adds the DNS records for the resolution of new IPs and FQDNs that are created. Learn more about [private DNS zones](../dns/private-dns-overview.md).

If the user who created the private endpoint is also the storage account owner, the private endpoint creation will be auto-approved. Otherwise, the owner of the storage account must approve the private endpoint for use. To approve or reject a requested private endpoint connection, on the storage account page under **Networking**, go to **Private endpoint connections**.

Review the status of the private endpoint connection state before you continue.

![Screenshot that shows the Private endpoint approval status.](./media/how-to-use-azure-migrate-with-private-endpoints/private-endpoint-connection-state.png)

After you've created the private endpoint, use the dropdown list in **Replicate** > **Target settings** > **Cache storage account** to select the storage account for replicating over a private link.

Ensure that the on-premises replication appliance has network connectivity to the storage account on its private endpoint. Learn more about how to verify [network connectivity](./troubleshoot-network-connectivity.md).

## Next steps
- Complete the [migration process](tutorial-migrate-physical-virtual-machines.md#complete-the-migration). 
- Review the [post-migration best practices](tutorial-migrate-physical-virtual-machines.md#post-migration-best-practices).


::: zone-end


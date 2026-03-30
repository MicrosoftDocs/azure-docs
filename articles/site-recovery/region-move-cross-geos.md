---
title: Move Azure virtual machines between government and public regions with Azure Site Recovery
description: Use Azure Site Recovery to move Azure virtual machines between Azure Government and public regions.
author: Jeronika-MS
ms.service: azure-site-recovery
ms.topic: tutorial
ms.date: 02/13/2026
ms.author: v-gajeronika
ms.reviewer: v-gajeronika
ms.custom: MVC, engagement-fy23
# Customer intent: As a cloud administrator, I want to move Azure virtual machines between Government and Public regions using a disaster recovery service, so that I can enhance availability and manageability while adhering to compliance requirements.
---
# Move Azure virtual machines between Azure Government and public regions 

You might want to move your IaaS virtual machines between Azure Government and public regions to increase availability of your existing virtual machines, improve manageability, or for governance reasons, as detailed [here](azure-to-azure-move-overview.md).

In addition to using the [Azure Site Recovery](site-recovery-overview.md) service to manage and orchestrate disaster recovery of on-premises machines and Azure virtual machines for the purposes of business continuity and disaster recovery (BCDR), you can also use Site Recovery to manage move Azure virtual machines to a secondary region.       

This tutorial shows you how to move Azure virtual machines between Azure Government and public regions using Azure Site Recovery. You can also use this process to move virtual machines between region pairs that aren't within the same geographic cluster. In this tutorial, you learn how to:

> [!div class="checklist"]
> * Verify prerequisites
> * Prepare the source virtual machines
> * Prepare the target region
> * Copy data to the target region
> * Test the configuration
> * Perform the move
> * Discard the resources in the source region

> [!IMPORTANT]
> This tutorial shows you how to move Azure virtual machines between Azure Government and public regions, or between regions pairs that aren't supported by the regular disaster recovery solution for Azure virtual machines. If your source and target regions pairs are [supported](./azure-to-azure-support-matrix.md#region-support), see [Migrate Azure VMs to another region](azure-to-azure-tutorial-migrate.md). If you want to improve availability by moving virtual machines in an availability set to zone pinned virtual machines in a different region, see the tutorial [Move Azure VMs from an availability set to a zone redundant virtual machine](move-azure-VMs-AVset-Azone.md).

> [!IMPORTANT]
> It is not advisable to use this method to configure DR between unsupported region pairs as the pairs are defined keeping data latency in mind, which is critical for a DR scenario.

## Verify prerequisites

> [!NOTE]
> Make sure that you understand the [architecture and components](physical-azure-architecture.md) for this scenario. This architecture is used to move Azure virtual machines **by treating the VMs as physical servers**.

- Review the [support requirements](vmware-physical-secondary-support-matrix.md) for all components.
- Make sure that the servers you want to replicate comply with [Azure VM requirements](vmware-physical-secondary-support-matrix.md#replicated-vm-support).
- Prepare an account for automatic installation of the Mobility service on each server you want to replicate.

- After you fail over to the target region in Azure, you can't directly perform a fail back to the source region. You have to set up replication again back to the target.

### Verify Azure account permissions

Make sure your Azure account has permissions for replication of virtual machines to Azure.

- Review the [permissions](site-recovery-role-based-linked-access-control.md#permissions-required-to-enable-replication-for-new-virtual-machines) you need to replicate machines to Azure.
- Verify and modify [Azure role-based access control (Azure RBAC)](/azure/role-based-access-control/role-assignments-portal) permissions. 

### Set up an Azure network

Set up the target [Azure network](../virtual-network/quick-create-portal.md).

- You place Azure virtual machines in this network when you create them after failover.
- The network should be in the same region as the Recovery Services vault.

### Set up an Azure storage account

Set up an [Azure storage account](../storage/common/storage-account-create.md).

- Site Recovery replicates on-premises machines to Azure storage. Azure virtual machines are created from the storage after failover occurs.
- The storage account must be in the same region as the Recovery Services vault.


## Prepare the source virtual machines

### Prepare an account for Mobility service installation

You must install the Mobility service on each server you want to replicate. Site Recovery installs this service automatically when you enable replication for the server. To install automatically, prepare an account that Site Recovery uses to access the server.

- Use a domain or local account.
- For Windows virtual machines, if you're not using a domain account, disable Remote User Access control on the local machine. To do this, in the register under **HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System**, add the DWORD entry **LocalAccountTokenFilterPolicy**, with a value of 1.
- To add the registry entry and disable the setting from a CLI, type:
  `REG ADD HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System /v LocalAccountTokenFilterPolicy /t REG_DWORD /d 1.`
- For Linux, use the root account on the source Linux server.


## Prepare the target region

1. Verify that your Azure subscription allows you to create virtual machines in the target region used for disaster recovery. Contact support to enable the required quota.

1. Make sure your subscription has enough resources to support virtual machines with sizes that match your source virtual machines. If you're using Site Recovery to copy data to the target, it picks the same size or the closest possible size for the target virtual machine.

1. Ensure that you create a target resource for every component identified in the source networking layout. This step ensures that after you cut over to the target region, your virtual machines have all the functionality and features that you had in the source.

    > [!NOTE]
    > Azure Site Recovery automatically discovers and creates a virtual network when you enable replication for the source virtual machine. You can also pre-create a network and assign it to the virtual machine in the user flow for enable replication. For any other resources, you need to manually create them in the target region.

     Please refer to the following documents to create the most commonly used network resources relevant for you, based on the source virtual machine configuration.

    - [Network Security Groups](../virtual-network/manage-network-security-group.md)
    - [Load balancers](../load-balancer/index.yml)
    - [Public IP](../virtual-network/ip-services/virtual-network-public-ip-address.md)
    
    For any other networking components, refer to the networking [documentation](../index.yml?pivot=products&panel=network).

1. Manually [create a non-production network](../virtual-network/quick-create-portal.md) in the target region if you want to test the configuration before you perform the final cut over to the target region. This network creates minimal interference with the production environment and is recommended.

## Copy data to the target region
The following steps guide you through using Azure Site Recovery to copy data to the target region.

### Create the vault in any region, except the source region.

1. Sign in to the [Azure portal](https://portal.azure.com) > **Recovery Services**.
2. Click **Create a resource** > **Management Tools** > **Backup and Site Recovery**.
3. In **Name**, specify the friendly name **ContosoVMVault**. If you have more than one
    a. subscription, select the appropriate one.
4. Create a resource group **ContosoRG**.
5. Specify an Azure region. To check supported regions, see geographic availability in [Azure Site Recovery Pricing Details](https://azure.microsoft.com/pricing/details/site-recovery/).
6. In Recovery Services vaults, click **Overview** > **ContosoVMVault** > **+Replicate**
7. Select **To Azure** > **Not virtualized/Other**.

### Set up the configuration server to discover virtual machines.


Set up the configuration server, register it in the vault, and discover virtual machines.

1. Click **Site Recovery** > **Prepare Infrastructure** > **Source**.
2. If you don't have a configuration server ready, you can use the **Add Configuration Server** option.
3. In **Add Server**, check that **Configuration Server** appears in **Server type**.
4. Download the Site Recovery Unified Setup installation file.
5. Download the vault registration key. You need this when you run Unified Setup. The key is valid for five days after you generate it.

   :::image type="content" source="./media/physical-azure-disaster-recovery/add-server.png" alt-text="Screenshot of add server page.":::


### Register the configuration server in the vault

Complete the following steps before you start: 

#### Verify time accuracy
On the configuration server machine, make sure that the system clock is synchronized with a [Time Server](/windows-server/networking/windows-time-service/windows-time-service-top). The times should match. If the system clock is 15 minutes ahead or behind, setup might fail.

#### Verify connectivity
Make sure the machine can access these URLs based on your environment: 

[!INCLUDE [site-recovery-URLS](../../includes/site-recovery-URLS.md)]  

IP address-based firewall rules should allow communication to all of the Azure URLs that are listed earlier over HTTPS (443) port. To simplify and limit the IP ranges, it is recommended that you use URL filtering.

- **Commercial IPs** - Allow the [Azure Datacenter IP Ranges](https://www.microsoft.com/download/details.aspx?id=41653), and the HTTPS (443) port. Allow IP address ranges for the Azure region of your subscription to support the Microsoft Entra ID, Backup, Replication, and Storage URLs.  
- **Government IPs** - Allow the [Azure Government Datacenter IP Ranges](https://www.microsoft.com/en-us/download/details.aspx?id=57063), and the HTTPS (443) port for all USGov Regions (Virginia, Texas, Arizona, and Iowa) to support Microsoft Entra ID, Backup, Replication, and Storage URLs.  

#### Run setup
Run Unified Setup as a Local Administrator, to install the configuration server. The process server and the primary target server are also installed by default on the configuration server.

[!INCLUDE [site-recovery-add-configuration-server](../../includes/site-recovery-add-configuration-server.md)]

After registration finishes, the configuration server appears on the **Settings** > **Servers** page in the vault.

### Configure target settings for replication

Select and verify target resources.

1. Select **Prepare infrastructure** > **Target**, and select the Azure subscription you want to use.
1. On the **Target settings** tab, complete the following:

    1. Under **Subscription**, select the Azure subscription you want to use.
    1. Under **Post-failover deployment model**, specify the target deployment model.
1. Site Recovery checks that you have one or more compatible Azure storage accounts and networks.
    :::image type="content" source="./media/physical-azure-disaster-recovery/target-settings.png" alt-text="Screenshot of the target setting page.":::


### Create a replication policy

1. To create a new replication policy, select **Site Recovery infrastructure** > **Replication Policies** > **+Replication Policy**.
1. In **Create replication policy**, specify a policy name.
1. In **RPO threshold**, specify the recovery point objective (RPO) limit. This value specifies how often data recovery points are created. An alert is generated if continuous replication exceeds this limit.
1. In **Recovery point retention**, specify how long (in hours) the retention window is for each recovery point. You can recover replicated virtual machines to any point in a window. Up to 24 hours retention is supported for machines replicated to premium storage, and 72 hours for standard storage.
1. In **App-consistent snapshot frequency**, specify how often (in minutes) recovery points containing application-consistent snapshots are created. Select **OK** to create the policy.
    :::image type="content" source="./media/physical-azure-disaster-recovery/create-policy.png" alt-text="Screenshot of replication policy page.":::



The configuration server automatically associates the policy. By default, a matching policy is automatically created for failback. For example, if the replication policy is **rep-policy** the failback policy **rep-policy-failback** is created. This policy isn't used until you initiate a failback from Azure.

### Enable replication

- Site Recovery installs the Mobility service when you enable replication.
- When you enable replication for a server, it can take 15 minutes or longer for changes to take effect and appear in the portal.

1. Select **Replicate application** > **Source**.
1. In **Source**, select the configuration server.
1. In **Machine type**, select **Physical machines**.
1. Select the process server (the configuration server). Then select **OK**.
1. In **Target**, select the subscription and the resource group in which you want to create the Azure virtual machines after failover. Choose the deployment model that you want to use in Azure (classic or resource management).
1. Select the Azure storage account you want to use for replicating data. 
1. Select the Azure network and subnet to which Azure virtual machines connect when they're created after failover.
1. Select **Configure now for selected machines** to apply the network setting to all machines you select for protection. Select **Configure later** to select the Azure network per machine. 
1. In **Physical Machines**, select **+Physical machine**. Specify the name and IP address. Select the operating system of the machine you want to replicate. It takes a few minutes for the servers to be discovered and listed. 

   > [!WARNING]
   > You need to enter the IP address of the Azure virtual machine you intend to move

1. In **Properties** > **Configure properties**, select the account that the process server uses to automatically install the Mobility service on the machine.
1. In **Replication settings** > **Configure replication settings**, verify that the correct replication policy is selected. 
1. Select **Enable Replication**. You can track progress of the **Enable Protection** job in **Settings** > **Jobs** > **Site Recovery Jobs**. After the **Finalize Protection** job runs, the machine is ready for failover.


To monitor servers you add, check the last discovered time for them in **Configuration Servers** > **Last Contact At**. To add machines without waiting for a scheduled discovery time, highlight the configuration server (don't select it), and select **Refresh**.

## Test the configuration


1. Go to the vault, and under **Settings** > **Replicated items**, select the virtual machine you want to move to the target region. Select the **+Test Failover** icon.
1. In **Test Failover**, select a recovery point to use for the failover:

   - **Latest processed**: Fails the virtual machine over to the latest recovery point that the
     Site Recovery service processed. The time stamp appears. By using this option, the service spends no time processing
     data, so it provides a low RTO (Recovery Time Objective).
   - **Latest app-consistent**: This option fails over all virtual machines to the latest app-consistent
     recovery point. The time stamp appears.
   - **Custom**: Select any recovery point.

1. Select the target Azure virtual network to which you want to move the Azure virtual machines to test the configuration. 

   > [!IMPORTANT]
   > Use a separate Azure virtual machine network for the test failover. Don't use the production network that you want to move your virtual machines to. Set up this network when you enable replication.

1. Select **OK** to start testing the move. To track progress, select the virtual machine to open its properties. Or,
   you can select the **Test Failover** job in the vault name > **Settings** > **Jobs** > **Site Recovery jobs**.
1. After the failover finishes, the replica Azure virtual machine appears in the Azure portal > **Virtual Machines**. Make sure that the virtual machine is running, sized appropriately, and connected to the appropriate network.
1. If you want to delete the virtual machine created as part of testing the move, select **Cleanup test failover** on the replicated item. In **Notes**, record and save any observations associated with the test.

## Perform the move to the target region and confirm

1. Go to the vault. In **Settings** > **Replicated items**, select the virtual machine, and then select **Failover**.
1. In **Failover**, select **Latest**. 
1. Select **Shut down machine before beginning failover**. Site Recovery attempts to shut down the source virtual machine before triggering the failover. Failover continues even if shutdown fails. You can follow the failover progress on the **Jobs** page. 
1. Once the job is complete, check that the virtual machine appears in the target Azure region as expected.
1. In **Replicated items**, right-click the virtual machine > **Commit**. This finishes the move process to the target region. Wait till the commit job completes.

## Discard the resource in the source region 

- Go to the virtual machine. Select **Disable Replication**. This action stops the process of copying the data for the virtual machine.  

   > [!IMPORTANT]
   > It's important to perform this step to avoid getting charged for ASR replication.

If you don't plan to reuse any of the source resources, proceed with the next set of steps.

1. Delete all the relevant network resources in the source region that you listed as part of Step 4 in [Prepare the source virtual machines](#prepare-the-source-virtual-machines). 
1. Delete the corresponding storage account in the source region.



## Next steps

In this tutorial, you moved an Azure virtual machine to a different Azure region. Now you can configure disaster recovery for the moved virtual machine:
- [Set up disaster recovery after migration](azure-to-azure-quickstart.md).

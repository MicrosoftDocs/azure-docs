---
title: Migrate Hyper-V VMs to Azure with the Migration and modernization tool
description: Learn how to migrate on-premises Hyper-V VMs to Azure with the Migration and modernization tool.
author: vijain
ms.author: vijain
ms.manager: kmadnani
ms.topic: tutorial
ms.service: azure-migrate
ms.reviewer: v-uhabiba
ms.date: 04/11/2025
ms.custom:
  - MVC
  - fasttrack-edit
  - engagement-fy24
  - sfi-image-nochange
# Customer intent: "As an IT administrator, I want to migrate my on-premises Hyper-V virtual machines to Azure using a dedicated migration tool, so that I can leverage cloud resources while ensuring a seamless transition and maintaining operational continuity."
---

# Migrate Hyper-V VMs to Azure

This article shows you how to migrate on-premises Hyper-V virtual machines (VMs) to Azure tool.

> [!NOTE]
> Tutorials show you the simplest deployment path for a scenario so that you can quickly set up a proof of concept. Tutorials use default options where possible and don't show all possible settings and paths.

 In this tutorial, you learn how to:

> [!div class="checklist"]
> * Discover VMs you want to migrate.
> * Start replicating VMs.
> * Run a test migration to make sure everything's working as expected.
> * Run a full VM migration.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.

## Prerequisites

Before you begin:

1. [Review](hyper-v-migration-architecture.md) the Hyper-V migration architecture.
1. [Review](migrate-support-matrix-hyper-v-migration.md#hyper-v-host-requirements) Hyper-V host requirements for migration and the Azure URLs to which Hyper-V hosts and clusters need access for VM migration.
1. [Review](migrate-support-matrix-hyper-v-migration.md#hyper-v-vms) the requirements for Hyper-V VMs that you want to migrate to Azure.
1. We recommend that you complete the [assess Hyper-V VMs](tutorial-assess-hyper-v.md) tutorial before you migrate Hyper-V servers to Azure.
1. Go to an existing project or [create a new project](./create-manage-projects.md).
1. Verify permissions for your Azure account.
     - Your Azure account needs permissions to create a VM.
     - Write to an Azure managed disk.
     - Manage failover operations for the Recovery Services vault associated with your Azure Migrate project.
1. For the required Azure Migrate built‑in roles and permission details to create a project and run discovery, assessments, and migrations, see [Prepare Azure accounts for Azure Migrate](prepare-azure-accounts.md).

> [!NOTE]
> If you're planning to upgrade your Windows operating system (OS), Azure Migrate and Modernize might download the Windows SetupDiag for error details in case upgrade fails. Ensure that the VM created in Azure after the migration has access to [SetupDiag](https://go.microsoft.com/fwlink/?linkid=870142). If there's no access to SetupDiag, you might not be able to get detailed OS upgrade failure error codes, but the upgrade can still proceed.

## Download the provider

For migrating Hyper-V VMs, you need to install the software provider (Azure Site Recovery provider and Recovery Services agent) on Hyper-V hosts or cluster nodes. The [Azure Migrate appliance](migrate-appliance.md) isn't used for Hyper-V migration.

> [!NOTE]
> Azure migrate appliance based discovery is a prerequisite to set up site recovery provider and track Hyper-V migrations in the new portal. To execute standalone migrations using the provider, use the link available in Azure Migrate project > Execute > Migrations to open the classic portal.

1. In the Azure Migrate project > **Execute** > **Migration**, select **Start execution**.
2. On the Specify intent page, under **What do you want to migrate**, select Servers or virtual machines (VMs). Under **Where do you want to migrate to**, select Azure VM.
3. Under **How will you select workloads**, select one of the following options:
     - From all inventory to manually select servers.
     - From an assessment to use an existing assessment.
4. Under **Discovery method**, select the appliance that matches your source environment (Hyper-V), and then select Next.
5. To prepare the Hyper-V hosts for VM replication, Click the link provided in the portal to start the site recovery provider setup.
6. In **Discover** > **Where do you want to migrate to?**, select **Azure VM**.
7. The virtualization type is prepopulated and unavailable for editing, based on the Azure Migrate appliance used for discovery.
8. In **Target region**, select the Azure region to which you want to migrate the machines.
9. Select **Confirm that the target region for migration is region-name**.
10. Select **Create resources**. This step creates a Recovery Services vault in the background.
    - You can't change the target region for this project after you select this button.
    - All subsequent migrations are to this region.

11. In **Prepare Hyper-V host servers**, download the Hyper-V Replication provider and the registration key file.
    - The registration key is needed to register the Hyper-V host with the Migration and modernization tool.
    - The key is valid for five days after you generate it.

    :::image type="content" source="./media/tutorial-migrate-hyper-v/download-provider-hyper-v-one.png" alt-text="Screenshot shows the download provider and key." lightbox="./media/tutorial-migrate-hyper-v/download-provider-hyper-v-one.png":::    


12. Copy the provider setup file and registration key file to each Hyper-V host (or cluster node) running the VMs you want to replicate.

## Install and register the provider

To install and register the provider, use the following steps by using either the UI or commands.

# [Use UI](#tab/UI)

Run the provider setup file on each host:

1. Select the file icon in the taskbar to open the folder where the installer file and registration key are downloaded.
1. Select the *AzureSiteRecoveryProvider.exe* file.
    1. In the provider installation wizard, ensure that **On (recommended)** is selected and then select **Next**.
    1. Select **Install** to accept the default installation folder.
    1. Select **Register** to register this server in the Recovery Services vault.
    1. Select **Browse**.
    1. Locate the registration key and select **Open**.
    1. Select **Next**.
    1. Ensure that **Connect directly to Azure Site Recovery without a proxy server** is selected and then select **Next**.
    1. Select **Finish**.

# [Use commands](#tab/commands)

Run the following commands on each host:

1. Extract the contents of the installer file (*AzureSiteRecoveryProvider.exe*) to a local folder (for example, *.\Temp*) on the machine, as follows:

    ```
     AzureSiteRecoveryProvider.exe /q /x:.\Temp\Extracted
    ```

1. Go to the folder with the extracted files.

    ```
    cd .\Temp\Extracted
    ```
1. Install the Hyper-V replication provider. The results are logged to *%Programdata%\ASRLogs\DRASetupWizard.log*.

    ```
    .\setupdr.exe /i 
    ```

1. Register the Hyper-V host to **Azure Migrate**.

    > [!NOTE]
    > If your Hyper-V host is registered with another Azure Migrate project that you're no longer using or deleted, you need to deregister it from that project and register it in the new one. For more information, see [Remove servers and disable protection](../site-recovery/site-recovery-manage-registration-and-protection.md?WT.mc_id=modinfra-39236-thmaure).

    ```
    "C:\Program Files\Microsoft Azure Site Recovery Provider\DRConfigurator.exe" /r /Credentials <key file path>
    ```

    - **Configure proxy rules:** If you need to connect to the internet via a proxy, use the optional parameters `/proxyaddress` and `/proxyport` to specify the proxy address (in the form `http://ProxyIPAddress`) and proxy listening port. For authenticated proxy, you can use the optional parameters `/proxyusername` and `/proxypassword`.

        ``` 
       "C:\Program Files\Microsoft Azure Site Recovery Provider\DRConfigurator.exe" /r [/proxyaddress http://ProxyIPAddress] [/proxyport portnumber] [/proxyusername username] [/proxypassword password]
        ```
 
    - **Configure proxy bypass rules:** To configure proxy bypass rules, use the optional parameter `/AddBypassUrls` and provide bypass URLs for proxy separated by ';' and run the following commands:

        ```
        "C:\Program Files\Microsoft Azure Site Recovery Provider\DRConfigurator.exe" /r [/proxyaddress http://ProxyIPAddress] [/proxyport portnumber] [/proxyusername username] [/proxypassword password] [/AddBypassUrls URLs]
        ```
        and
        ```
        "C:\Program Files\Microsoft Azure Site Recovery Provider\DRConfigurator.exe" /configure /AddBypassUrls URLs 
        ```
---

After you install the provider on hosts, go to the Azure portal to the site recovery provider setup page and select **Finalize registration**.

![Screenshot that shows the Finalize registration screen.](./media/tutorial-migrate-hyper-v/finalize-registration.png)

It can take up to 15 minutes after finalizing registration until discovered VMs appear in the tool.

## Execute migrations

> [!NOTE]
> In the portal, you can select up to 10 machines at once for replication. If you need to replicate more, then group them in batches of 10.

1. In the Azure Migrate project > **Execute** > **Migration**, select **Start execution**.

2. On the Specify intent page, under **What do you want to migrate**, select Servers or virtual machines (VMs). Under **Where do you want to migrate to**, select Azure VM.

3. Under **How will you select workloads**, select one of the following options:
    - **From all inventory** to manually select servers
    - **From an assessment** to use an existing assessment

4. In **Discovery method**, select the appliance that matches your source environment (Hyper-V) and then select Next. If you have completed the site recovery provider setup for Hyper-V, you can proceed to the next section. Else, complete the setup as per the steps provided in the previous section.

5. In **Workloads**, select the **Target VM security type**. Azure Migrate supports migration to Trusted Launch Virtual Machines (TVMs). By default, it migrates eligible VMs as TVMs. These VMs provide enhanced security features such as secure boot and virtual TPM at no extra cost. We recommend using them wherever applicable. Then, select the VMs you want to replicate and then click Next.

6. In **Target settings**, select the subscription and target region to which you want to migrate, and specify the resource group where the Azure VMs will reside after migration. Complete the following settings:

  - **Availability options**: Select one of the following:
      - **Availability Zone** – Pins the migrated machine to a specific Availability Zone in the region. Use this option to distribute machines that are part of a multi-node application tier across Availability Zones. If you select this option, specify the Availability Zone for each selected machine on the Compute tab. This option is available only if the selected target region supports Availability Zones.
      - **Availability Set** – Places the migrated machine in an Availability Set. The selected target resource group must contain one or more availability sets.
      - **No infrastructure redundancy required **– Select this option if you don’t require Availability Zones or Availability Sets for the migrated machines.
   
  - **Virtual network**: Select the Azure virtual network and subnet that the Azure VMs will join after migration.
  - **Cache storage account**: Keep the default option to use the cache storage account that is automatically created for the project. To use a different storage account for replication, select it from the drop-down list.

   > [!NOTE]
   > - If you use private endpoint as the connectivity method for the Azure Migrate project, grant the Recovery Services vault access to the cache storage account. [**Learn more**](migrate-servers-to-azure-using-private-link.md#grant-access-permissions-to-the-recovery-services-vault)
   > - To replicate using ExpressRoute with private peering, create a private endpoint for the cache storage account. For more information, See [**create private end point for storage account**](migrate-servers-to-azure-using-private-link.md#create-a-private-endpoint-for-the-storage-account-1)
   
 - **Disk encryption type**, select:
   - Encryption-at-rest with platform-managed key
   - Encryption-at-rest with customer-managed key
   - Double encryption with platform-managed and customer-managed keys
 
   > [!NOTE]
   > To replicate VMs with customer-managed-keys (CMK), you'll need to [create a disk encryption set](/azure/virtual-machines/disks-enable-customer-managed-keys-portal#set-up-your-disk-encryption-set) under the target Resource Group. A disk encryption set object       maps managed disks to a Key Vault that contains the CMK to use for SSE.
   
- **Azure Hybrid Benefit**:
    -  Select **No** if you don't want to apply Azure Hybrid Benefit and then select **Next**.
    -  Select **Yes** if you have Windows Server machines that are covered with active Software Assurance or Windows Server subscriptions, and you want to apply the benefit to the machines you're migrating. Then click **Next**.
      
7. In **Compute**, review the VM name, size, OS disk type, and availability configuration (if selected in the previous step). VMs must conform to [Azure requirements](migrate-support-matrix-vmware-migration.md#azure-vm-requirements).

   - **VM size**: If you're using assessment recommendations, the VM size dropdown shows the recommended size. Otherwise Azure Migrate picks a size based on the closest match in the Azure subscription. Alternatively, pick a manual size in **Azure VM size**.
   - **OS disk**: Specify the OS (boot) disk for the VM. The OS disk contains the operating system bootloader and installer.
   - **Availability Zone**: Specify the Availability Zone to use.
   - **Availability Set**: Specify the Availability Set to use.
   - **Capacity reservation**: If you already have a capacity reservation for the VM SKU in the target subscription and location, specify it here for this deployment. Capacity reservations ensure that the required VM SKU is available when you start migration. You can associate a reservation now or skip this step and configure it later during the migration. The capacity reservation for the SKU can be in any resource group within the target subscription and location.[Learn more](/azure/virtual-machines/capacity-reservation-create).

8. In **Disks**, specify whether the VM disks should be replicated to Azure, and select the disk type (Premium v2, Ultra Disk, Standard SSD, Standard HDD, or Premium Managed disks) in Azure. Then select **Next**.
    - You can exclude disks from replication.
    - If you exclude disks, they won't be present on the Azure VM after migration.
    - You can exclude disks if the mobility agent is already installed on that server. [Learn more](../site-recovery/exclude-disks-replication.md#exclude-limitations).

9. In **Tags**, choose to add tags to your Virtual machines, Disks, and NICs.

10. In **Review and start execution**, review the settings, and select **Review and start execution** to start the initial replication for the servers.

## Provision for the first time

If this is the first VM you're replicating in the Azure Migrate project, the Migration and modernization tool automatically provisions these resources in the same resource group as the project.

- **Cache storage account**: The Site Recovery provider software installed on Hyper-V hosts uploads replication data for the VMs configured for replication to a storage account (known as the cache storage account or log storage account) in your subscription. Azure Migrate and Modernize then copies the uploaded replication data from the storage account to the replica-managed disks corresponding to the VM. The cache storage account needs to be specified while configuring replication for a VM. The Azure Migrate portal automatically creates one for the Azure Migrate project when replication is configured for the first time in the project.

## Track and monitor

1. In Azure Migrate project, go to Execute > Migrations. Use **View by applications** or **View by workloads** to switch how items are grouped.

2. Replication works as follows: 
      - After the Start Replication job finishes successfully, the machines start initial replication to Azure.
	     - During initial replication, Azure Migrate creates a VM snapshot and replicates disk data from the snapshot to replica managed disks in Azure.
	     - After initial replication finishes, delta replication begins. Incremental changes to the source disks are periodically replicated to the replica disks in Azure.

3. Execution progress is shown in Execution stage and Execution status:
      - **Execution stage**: Preparation, Testing, or Completion.
      - **Execution status**: In progress, In error, Action pending, or Completed.
  
4. Execution progress is tracked across three stages:
      - **Preparation**: Servers enabled for replication remain in the Preparation stage while initial replication (data replication) is in progress. During this stage, you can select Stop, Start, Pause, or Resume from the actions available in the server drill-down blade. After initial replication completes, the servers move to the Testing stage.
        
      -  **Testing**: Servers move to the Testing stage after initial replication completes and while delta replication is in progress. In this stage, you can run test migrations on a test virtual network before starting the actual migration (recommended). You can also skip the Testing stage and start migration directly by selecting the appropriate action in the Completion stage.

      - **Completion**: Servers move to the Completion stage after test migrations complete or are skipped. In this stage, you can start the final migration (cutover). After migration completes, select Complete migration to clean up migration resources from the actions available in the server drill-down list.

## Run a test migration

When delta replication begins, you can run a test migration for the VMs, before running a full migration to Azure. We highly recommend that you do this at least once for each machine, before you migrate it.

- Running a test migration checks that migration works as expected, without impacting the source (on-premises or AVS) machines, which remain operational, and continue replicating.
- Test migration simulates the migration by creating an Azure VM using replicated data (usually migrating to a non-production VNet in your Azure subscription).
- You can use the replicated test Azure VM to validate the migration, perform app testing, and address any issues before full migration.

Do a test migration as follows:

1. In Azure Migrate project, Under **Execute** > **Migrations** > sand select the server by selecting its name in the Workloads column.

2. In the drill-down menu, under **Testing** drop-down, select **Start test migration**.

3. In **Test migration**, select the Azure Virtual Network(Vnet) in which the Azure VM will be located during testing. We recommend you use a non-production VNet. 
4. Select the subnet to associate with each network interface card (NIC) on the migrated VM.

    :::image type="content" source="./media/tutorial-migrate-vmware/test-migration-subnet-selection.png" alt-text="Screenshot shows subnet selection during test migration.":::
5. You have an option to upgrade the Windows Server OS during test migration. To upgrade, select the **Upgrade available** option.
6. In the pane that appears, select the target OS version that you want to upgrade to and select **Apply**. [Learn more](./how-to-upgrade-windows.md).
7.After you select Test migration, the job starts. Monitor the status under Execution status in the Azure portal. After the test migration completes, clean up the test resources. Go to the server, and then select **Clean up test migration** from the **Testing** drop-down.

    :::image type="content" source="./media/tutorial-migrate-vmware/clean-up-inline.png" alt-text="Screenshot of Clean up migration." lightbox="./media/tutorial-migrate-vmware/clean-up-expanded.png":::

    > [!NOTE]
    > You can now register your servers running SQL server with SQL VM RP to take advantage of automated patching, automated backup and simplified license management using SQL IaaS Agent Extension.
    >- Select the server under **Workloads** column in Execute> Migrations page. In Compute and Network settings, select checkbox associated with register with SQL IaaS extension.
    >- Select Azure Hybrid benefit for SQL Server if you have SQL Server instances that are covered with active Software Assurance or SQL Server subscriptions and you want to apply the benefit to the machines you're migrating.hs.

## Migrate VMs

After you've verified that the test migration works as expected, you can migrate the source machines.

1. In Azure Migrate project, Under **Execute** > **Migrations** > and select the server by selecting its name in the Workloads column.
2. In the drill-down menu, under **Completion** drop-down, select **Migrate**.
3. In **Migrate** > **Shut down virtual machines and perform a planned migration with no data loss**, select **Yes**.
    - By default Azure Migrate shuts down the source VM, and runs an on-demand replication to synchronize any VM changes that occurred since the last replication occurred. This ensures no data loss.
    - If you don't want to shut down the VM, select **No**
4. You have an option to upgrade the Windows Server OS during migration.
5. To upgrade, select the **Upgrade available** option. In the pane that appears, select the target OS version that you want to upgrade to and select **Apply**. [Learn more](./how-to-upgrade-windows.md).
6. If you already have a capacity reservation for the VM SKU in the target subscription and location, specify it here for this deployment. Capacity reservations ensure that the required VM SKU is available when you start migration. The capacity reservation for the SKU can be in any resource group within the target subscription and location. [Learn more](/azure/virtual-machines/capacity-reservation-create).
7. After completing the settings, select **Migrate**. A migration job starts for the server. Track the job in Azure notifications.
8. After the job finishes, you can view and manage the server from the **Migrations** page which will be tracked under **Completion** stage.

## Complete the migration

1. After the migration completes, open the server drill-down page. Under Completion, select Complete migration.
   This action stops replication for the source machine and cleans up the replication state information for the VM.
1. Verify and [troubleshoot any Windows activation issues on the Azure VM](/troubleshoot/azure/virtual-machines/troubleshoot-activation-problems).
1. Perform any post-migration app tweaks, such as updating host names, database connection strings, and web server configurations.
1. Perform final application and migration acceptance testing on the migrated application now running in Azure.
1. Cut over traffic to the migrated Azure VM instance.
1. Remove the on-premises VMs from your local VM inventory.
1. Remove the on-premises VMs from local backups.
1. Update any internal documentation to show the new location and IP address of the Azure VMs.

## Post-migration best practices

- For increased resilience:
    - Keep data secure by backing up Azure VMs by using Azure Backup. [Learn more](../backup/quick-backup-vm-portal.md).
    - Keep workloads running and continuously available by replicating Azure VMs to a secondary region with Site Recovery. [Learn more](../site-recovery/azure-to-azure-tutorial-enable-replication.md).
- For increased security:
    - Lock down and limit inbound traffic access with [Microsoft Defender for Cloud - Just-in-time administration](../security-center/security-center-just-in-time.md).
    - Manage and govern updates on Windows and Linux machines with [Azure Update Manager](../update-manager/overview.md).
    - Restrict network traffic to management endpoints with [network security groups](../virtual-network/network-security-groups-overview.md).
    - Deploy [Azure Disk Encryption](/azure/virtual-machines/disk-encryption-overview) to help secure disks and keep data safe from theft and unauthorized access.
    - Read more about [securing IaaS resources](https://azure.microsoft.com/services/virtual-machines/secure-well-managed-iaas/) and [Microsoft Defender for Cloud](https://azure.microsoft.com/services/security-center/).
- For monitoring and management:
-  Consider deploying [Microsoft Cost Management](../cost-management-billing/cost-management-billing-overview.md) to monitor resource usage and spending.

## Next steps

Investigate the [cloud migration journey](/azure/architecture/cloud-adoption/getting-started/migrate) in the Cloud Adoption Framework for Azure.

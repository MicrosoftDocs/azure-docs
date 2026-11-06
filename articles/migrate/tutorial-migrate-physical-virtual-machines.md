---
title: Migrate machines as physical servers to Azure with Azure Migrate and Modernize
description: This article describes how to migrate physical machines to Azure with Azure Migrate and Modernize.
author: dhananjayanr98
ms.author: dhananjayanr
ms.manager: kmadnani
ms.topic: tutorial
ms.service: azure-migrate
ms.reviewer: v-gajeronika
ms.date: 08/26/2025
ms.update-cycle: 365-days
ms.custom: MVC, engagement-fy25

# Customer intent: "As an IT administrator planning a cloud migration, I want to migrate physical servers to Azure using a replication appliance, so that I can leverage cloud resources for improved efficiency and scalability."
---


# Migrate machines as physical servers to Azure

This article shows you how to migrate machines as physical servers to Azure by using the Azure Migration and modernization tool. Migrating machines by treating them as physical servers is useful in many scenarios:

- Migrate on-premises physical servers.
- Migrate virtual machines (VMs) virtualized by platforms such as Xen and KVM.
- Migrate Hyper-V or VMware VMs, if you're unable to use the standard migration process for [Hyper-V](tutorial-migrate-hyper-v.md) or [VMware](server-migrate-overview.md) agentless migration.
- Migrate VMs running in private clouds.
- Migrate VMs running in public clouds, such as Amazon Web Services (AWS) or Google Cloud Platform (GCP).

 In this tutorial, you learn how to:

> [!div class="checklist"]
> * Prepare Azure with required permissions to use Azure Migrate.
> * Check requirements for machines you want to migrate. Prepare a machine for the Azure Migrate and Modernize replication appliance that's used to discover and migrate machines to Azure.
> * Set up the replication appliance.
> * Install the Mobility service on machines you want to migrate.
> * Start migration execution.
> * Track and monitor migrations.
> * Run a test migration to make sure everything's working as expected.
> * Run a full VM migration.

> [!NOTE]
> Tutorials show you the simplest deployment path for a scenario so that you can quickly set up a proof of concept. Tutorials use default options where possible and don't show all possible settings and paths. For detailed instructions, review the how-to articles for Azure Migrate and Modernize.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.

## Prerequisites

Before you begin:

1. Go to an existing project or [create a new project](create-manage-projects.md).
2. [Complete the tutorial](tutorial-discover-physical.md) to prepare Azure and discover physical servers for migration.
3. We recommend that you complete the [assess physical servers](how-to-create-assessment.md) tutorial before migrating servers to Azure.
1. Verify permissions for your Azure account. You need permissions to:
    - Create a VM.
    - Write to an Azure managed disk.
5.  For the required Azure Migrate built‑in roles and permission details to create a project and run discovery, assessments, and migrations, see [Prepare Azure accounts for Azure Migrate](prepare-azure-accounts.md).
6.  Assign permissions to register the Replication Appliance in Microsoft Entra ID. For more information, see [required permissions](../site-recovery/deploy-vmware-azure-replication-appliance-modernized.md#required-permissions).

Also,

- [Review](./agent-based-migration-architecture.md) the migration architecture.
- [Review](../site-recovery/migrate-tutorial-windows-server-2008.md#limitations-and-known-issues) the limitations related to migrating Windows Server 2008 servers to Azure.

[!INCLUDE [end-of-life-notes-windows-server-2008.md](./includes/end-of-life-notes-windows-server-2008.md)]

> [!NOTE]
> If you're planning to upgrade your Windows operating system, Azure Migrate and Modernize might download the Windows SetupDiag utility for error details in case upgrade fails. Ensure that the VM created in Azure after the migration has access to [SetupDiag](https://go.microsoft.com/fwlink/?linkid=870142). If there's no access to SetupDiag, you might not be able to get detailed OS upgrade failure error codes but the upgrade can still proceed.

### Create an Azure network

> [!IMPORTANT]
> Virtual networks are a regional service, so make sure you create your virtual network in the desired target Azure region. For example, if you're planning on replicating and migrating VMs from your on-premises environment to the East US Azure Region, your target virtual network *must be created* in the East US Region. To connect virtual networks in different regions, see [Virtual network peering](../virtual-network/virtual-network-peering-overview.md).

[Set up](../virtual-network/manage-virtual-network.yml#create-a-virtual-network) an Azure virtual network. When you replicate to Azure, Azure VMs are created and joined to the Azure virtual network that you specified when you set up migration.

## Prepare for migration

To prepare for migrating physical servers,  ensure that you:

- **Check machine requirements**: Verify that your source machines are supported for physical server migration.
-  **Set up a replication appliance**: Physical server migrations require a separate replication appliance to execute agent-based migrations. You can’t use the Azure Migrate appliance created for discovery to execute physical server migrations.

### Check machine requirements for migration

Make sure machines comply with requirements for migration to Azure.

> [!NOTE]
> When you migrate physical machines, the Migration and modernization tool uses the same replication architecture as agent-based disaster recovery in Azure Site Recovery. Some components share the same code base. Some content might link to Site Recovery documentation.

1. [Verify](migrate-support-matrix-physical-migration.md#physical-server-requirements) physical server requirements.
1. Verify that on-premises machines that you replicate to Azure comply with [Azure VM requirements](migrate-support-matrix-physical-migration.md#azure-vm-requirements).
1. Some changes are needed on VMs before you migrate them to Azure:

    - For some operating systems, Azure Migrate and Modernize makes these changes automatically.
    - Make these changes before you begin migration. If you migrate the VM before you make the change, the VM might not boot up in Azure.
Review [Windows](prepare-for-migration.md#windows-machines) and [Linux](prepare-for-migration.md#linux-machines) changes you need to make.

### Prepare a machine for the replication appliance

The Azure Site Recovery Replication appliance is used to replicate machines to Azure. [Learn more](../site-recovery/physical-server-azure-architecture-modernized.md).

To set up a new appliance, you can use PowerShell installer script. Ensure you meet the [hardware](../site-recovery/replication-appliance-support-matrix.md#hardware-requirements) and [software](../site-recovery/replication-appliance-support-matrix.md#software-requirements) requirements, and any other prerequisites. 

> [!NOTE]
> The replication appliance shouldn't be installed on a source machine that you want to replicate or on the Azure Migrate: Discovery and assessment appliance you might have installed before.

## Set up the replication appliance

This section describes how to download and use the PowerShell installer script to set up the replication appliance.

1. In the Azure Migrate project, go to **Manage** > **Server replication**, and select **Start replication**.
   
2. On **Specify intent**, under **What do you want to migrate**, select **Servers** or **virtual machines (VMs)**. Under **Where do you want to migrate to**, select **Azure VM**.
   
3. In **How will you select workloads**, under **Other sources**, select **From replication appliance (Physical or Others)**. Select the link available in the page to start the setup.
4. In the setup page, the virtualization type is prepopulated based on the selection you made in the previous step (Physical).
5. In **Target region**, select the Azure region where you want to migrate the machines.
6. Select **Confirm that the target region for migration is ``region-name``**.
7. Select **Create resources**. This action creates an Azure Site Recovery vault in the background.
    > [!NOTE]
    > You can't change the target region for this project after selecting the **Create resources** button, and all subsequent migrations go to this region.

**Set up the appliance using PowerShell**

This section describes how to set up the appliance by using PowerShell.

1. Download the installers from the portal or from the provided [link](https://aka.ms/V2ARcmApplianceCreationPowershellZip), and place them on the replication appliance you created in your environment. Ensure that the appliance meets the [requirements](#prepare-for-migration).
   
2. Unzip and extract the components.
   
3. Execute the **DRInstaller.ps1 PowerShell** script as an administrator.

### Register appliance

After the appliance is created, the **Microsoft Azure Appliance Configuration Manager** launches automatically. It validates prerequisites such as internet connectivity, time synchronization, system configurations, and group policies.

- **CheckRegistryAccessPolicy** - Prevents access to registry editing tools
     - Key: `HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System`.
    - The `DisableRegistryTools` value shouldn't be equal to 0.

- **CheckCommandPromptPolicy** - Prevents access to the command prompt
     - Key: `HKLM\SOFTWARE\Policies\Microsoft\Windows\System`.
    - The `DisableCMD` value should be equal to 0.

- **CheckTrustLogicAttachmentsPolicy** - Trust logic for file attachments.
     - Key: `HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Attachments`.
    - The `UseTrustedHandlers` value shouldn't be equal to 3.

- **CheckPowershellExecutionPolicy** - Turn on Script Execution.
     - PowerShell execution policy shouldn't be set to **AllSigned or Restricted**.
     - Ensure the group policy **Turn on Script Execution Attachment Manager** isn't set to Disabled or **Allow only signed scripts**.

Use the following steps to register the appliance:

1. If the appliance uses a proxy for internet access, configure the proxy settings by toggling on the 'Use proxy to connect to internet' option.
    - All Azure Site Recovery services use these settings to connect to the internet.
    
    > [!Note]
    > Only HTTP proxy is supported.

1. Ensure the [required URLs](../site-recovery/replication-appliance-support-matrix.md#allow-urls) are allowed and reachable from the Azure Site Recovery replication appliance to maintain continuous connectivity.
1. After the prerequisites are verified, the appliance fetches all its component information in the next step. Review the status of all components and then select **Continue**.
1. **Save** the details, and then proceed to choose the appliance connectivity method. You can select either FQDN or a NAT IP to define how communication with the appliance occurs.

    :::image type="content" source="./media/tutorial-migrate-physical-virtual-machines/select-replication-appliance-connectivity.png" alt-text=" Screenshot shows how to select replication appliance connectivity":::.

1. After saving the connectivity details, select **Continue** to proceed with registration in Microsoft Azure. 
1. Ensure the [prerequisites](../site-recovery/replication-appliance-support-matrix.md#prerequisites) are met, and then proceed with the registration.

    :::image type="content" source="./media/tutorial-migrate-physical-virtual-machines/registry-with-recovery-service-vault.png" alt-text="Screenshot shows the registry with recovery service vault.":::.
1. **Friendly name of appliance**: Provide a friendly name to track this appliance in the Azure portal under Recovery Services Vault infrastructure. 

   > [!Note]
   > The name can't be changed once set.
1. **Azure Migrate replication appliance key**: Copy the key from the portal's discovery screen.
    
    :::image type="content" source="./media/tutorial-migrate-physical-virtual-machines/generate-key.png" alt-text="Screenshot shows the generated key":::.

1. After pasting the key, select **Login**. You're redirected to a new authentication tab. By default, an authentication code is generated on the **Appliance Configuration Manager** page. Use the following code in the authentication tab. 
1. Enter your Microsoft Azure credentials to complete the registration. 
1. After successful registration, you can close the tab and return to the **Appliance Configuration Manager** to continue the setup.

    :::image type="content" source="./media/tutorial-migrate-physical-virtual-machines/microsoft-code.png" alt-text="Screenshot that shows the Microsoft code.":::

    > [!Note]
    > An authentication code expires within 5 minutes of generation. If there is inactivity for longer than this duration, you're prompted to re-log in to Azure.

1. After successfully signing in, the details for Subscription, Resource Group, and Recovery Services Vault are displayed. 
1. Select **Continue** to proceed.

    :::image type="content" source="./media/tutorial-migrate-physical-virtual-machines/register-with-recovery-services.png" alt-text="Screenshot shows how to register with recovery services":::.

1. After successful registration, proceed to configure physical server details. Expand **Provide Physical Server Details** to add information about any physical servers you plan to migrate.

    :::image type="content" source="./media/tutorial-migrate-physical-virtual-machines/provide-physical-server-details.png" alt-text=" Screenshot provides physical server details":::.

1. Select **Add Credentials** to add the credentials of the machines you plan to protect. Provide all necessary details, such as the **Operating System**, a friendly name for the credential, **username**, and **Password**. The user account details are encrypted and stored locally on the machine.

     > [!Note]
     > * For Linux OS, ensure to provide root credentials.
     > * For Windows OS, a user account with admin privileges should be added. These credentials are used to push the installation of the mobility agent onto the source VM during the enable replication operation. The credentials can be chosen per VM in the Azure portal during the enable replication workflow.
     > * Visit the **Appliance Configurator** to edit or add credentials to access your machines.
     
1. Finally, select **Add**.

    :::image type="content" source="./media/tutorial-migrate-physical-virtual-machines/add-physical-server-credentials.png" alt-text="Screenshot shows how to add physical server credentials":::.

1. Select **Add Server** to add the physical server details. Provide the machine's **IP address or FQDN**.
1. Select the **credential account**, and then select **Add**.

    :::image type="content" source="./media/tutorial-migrate-physical-virtual-machines/add-physical-server-details.png" alt-text="Screenshot shows how to add physical server details":::.

## Install the Mobility service agent

When you enable replication for VMware virtual machines and physical servers, the Mobility service is installed on each on-premises machine. The Mobility service captures data writes it to the machine, and forwards it to the Site Recovery process server.

You can install the Mobility service using the Mobility service agent software. The following methods are available for deployment:

- [Push installation](../site-recovery/vmware-physical-mobility-service-overview.md#push-installation): When protection is enabled via the Azure portal, Site Recovery installs the Mobility service on the server.
- Manual installation: You can install the Mobility service manually on each machine through the [user interface (UI)](../site-recovery/vmware-physical-mobility-service-overview.md#install-the-mobility-service-using-ui) or [command prompt](../site-recovery/vmware-physical-mobility-service-overview.md#install-the-mobility-service-using-command-prompt).
- [Automated deployment](../site-recovery/vmware-azure-mobility-install-configuration-mgr.md): You can automate the Mobility service installation with software deployment tools such as Configuration Manager.
  
 [Learn more](../site-recovery/vmware-physical-mobility-service-overview.md) about mobility service agent installation.

## Execute migrations

> [!NOTE]
> In the portal you can select up to 10 machines at once for replication. If you need to replicate more, then group them in batches of 10.

1. In the Azure Migrate project, go to **Manage** > **Server replication**, and select **Start replication**.

2. On the Specify intent page, under **What do you want to migrate**, select Servers or virtual machines (VMs). Under **Where do you want to migrate to**, select Azure VM.

3. Under **How will you select workloads**, select one of the following options:
     - If you have an existing Azure Migrate appliance, select one of the following options and proceed to **Discovery method**.
         - **From all inventory** to manually select servers.
         - **From an assessment** to use an existing assessment.
     - If you don't have an existing Azure Migrate appliance (required for assessments, wave planning, and other planning capabilities) and want to directly execute agent-based migrations, select **From a replication appliance (Physical or others)**. If you completed the replication appliance setup, you can proceed
       to **Workloads**. Otherwise, complete the setup as per the steps provided in the previous section.

4. In **Discovery method**, select the appliance that matches your source environment (Physical) and then select **Next**.

5.  In **Workloads**:
    - Select the **Target VM security type**.
        - Azure Migrate supports migration to Trusted Launch Virtual Machines (TVMs). By default, it migrates eligible VMs as TVMs. These VMs provide enhanced security features such as secure boot and virtual TPM at no extra cost.
        - You can also migrate eligible machines to Confidential virtual machines [Learn more](../confidential-computing/confidential-vm-overview.md). If you select **Confidential virtual machines**, only eligible servers are available for selection and the rest are greyed out. Refer [CVM support matrix](migrate-to-trusted-launch-virtual-machines-with-azure-migrate.md#supported-operating-systems-for-migrating-to-confidential-virtual-machines).
     - Select the replication appliance you set up from the drop-down menu or set up a new replication appliance by referring to the steps provided in the previous section.
         - In **Guest credentials**, specify the VM admin account that you use for push installation of the Mobility service.
     - Then, select **Next** after selecting the VMs you want to replicate.
6. In **Target settings**, select the subscription and target region to which you want to migrate, and specify the resource group where the Azure VMs reside after migration. Complete the following settings:

     - **Storage account**: Keep the default option to use the cache storage account that the portal automatically creates for the project. To use a different storage account for replication, select it from the drop-down list.
    
   > [!NOTE]
   > - If you use private endpoint as the connectivity method for the Azure Migrate project, grant the Recovery Services vault access to the cache storage account. [**Learn more**](migrate-servers-to-azure-using-private-link.md#grant-access-permissions-to-the-recovery-services-vault)
   > - To replicate using ExpressRoute with private peering, create a private endpoint for the cache storage account. [**Learn more**](migrate-servers-to-azure-using-private-link.md#create-a-private-endpoint-for-the-storage-account-1)
   
    - **Azure Hybrid Benefit**: Apply Azure Hybrid Benefit and save up to 76% vs. pay-as-you-go costs by using an eligible Windows Server and/or Enterprise Linux license. Check the boxes applicable to your license (Windows Server license or Enterprise Linux license).
    - **Virtual network**: Select the Azure virtual network and subnet that the Azure VMs join after migration.
    - **Availability options**: Select one of the following options:
         - **Availability Zone** pins the migrated machine to a specific Availability Zone in the region. Use this option to distribute machines that are part of a multinode application tier across Availability Zones. If you select this option, specify the Availability Zone for each selected machine on the **Compute** tab. This option is available only if the selected target region supports Availability Zones.
         - **Availability Set** places the migrated machine in an Availability Set. The selected target resource group must contain one or more availability sets.
         - **No infrastructure redundancy required**– Select this option if you don't require Availability Zones or Availability Sets for the migrated machines.
        
    -  In **Security Details**,
         - If the selected target security type is **Standard or Trusted Launch virtual machines**:
            - **Secure boot** is enabled by default (recommended). You can choose to remove this option. Then, proceed to **Disk encryption type** selection.
         - If the selected target security type is **Confidential virtual machines**:
            - You can optionally choose to confidentially encrypt the OS disks. This encryption provides an additional layer of encryption that binds the disk encryption keys to the
              virtual machine's TPM and makes the disk content accessible only to the VM.
            - To enable this encryption, select the **Confidential compute encryption** option and proceed to **OS disk encryption type** selection. Otherwise, proceed to **Disk
              encryption type** selection.
            - Under **OS disk encryption type**, select one of the following options:
               - Encryption at rest with platform-managed key (default, if you didn't select **Confidential compute encryption**)
               - Confidential encryption with platform-managed key (available, if you selected **Confidential compute encryption**)
               - Confidential encryption with customer-managed key (available, if you selected **Confidential compute encryption**)
                  > [!NOTE]
                  > - Secure Boot is enabled by default on target VMs when Confidential OS disk encryption is selected.
                  > - Only customer-managed key (CMK) are supported for confidential OS disk encryption for disks larger than 127 GB. For disks smaller than 127 GB, both platform-managed key (PMK) and customer-managed key (CMK) are supported.
                  > - Confidential OS disk encryption can lengthen the standard initial VM creation time during migration due to the encryption process.
                  > - Data disks currently don't support confidential encryption. However, you can secure them by using host-based encryption with customer-managed keys (CMK) or platform-managed keys (PMK).
  
	   
         - **Disk encryption type**, select:
              - Encryption-at-rest with platform-managed key
              - Encryption-at-rest with customer-managed key
              - Double encryption with platform-managed and customer-managed keys   
         
   > [!NOTE]
   > - To replicate VMs with customer-managed keys (CMK), [create a disk encryption set](/azure/virtual-machines/disks-enable-customer-managed-keys-portal#set-up-your-disk-encryption-set) under the target resource group. A disk encryption set object maps managed disks to a Key Vault that contains the
     CMK to use for SSE.
   > - The seed disk is created in Azure during replication/staging before cutover. Encrypting it protects data right from the first write while it resides in Azure. The **Disk encryption type** setting applies to both seed disks and the managed disks after final migration.
      
7. In **Compute**, review the VM name, size, OS disk type, and availability configuration (if selected in the previous step). VMs must conform to [Azure requirements](migrate-support-matrix-vmware-migration.md#azure-vm-requirements).

   - **VM size**: If you're using assessment recommendations, the VM size dropdown shows the recommended size. Otherwise Azure Migrate picks a size based on the closest match in the Azure subscription. Alternatively, pick a manual size in **Azure VM size**.
   - **OS disk**: Specify the OS (boot) disk for the VM. The OS disk contains the operating system bootloader and installer.
   - **Availability Zone**: Specify the Availability Zone to use.
   - **Availability Set**: Specify the Availability Set to use.
   - **Capacity reservation**: If you already have a capacity reservation for the VM SKU in the target subscription and location, specify it here for this deployment. Capacity reservations ensure that the required VM SKU is available when you start migration. You can associate a reservation now or skip this step and configure it later during the migration. The capacity reservation for the SKU can be in any resource group within the target subscription and location. [Learn more](/azure/virtual-machines/capacity-reservation-create).

8. In **Disks**, specify whether the VM disks should be replicated to Azure, and select the disk type (Premium v2, Ultra Disk, Standard SSD, Standard HDD, or Premium Managed disks) in Azure. Then select **Next**.
    - You can exclude disks from replication.
    - If you exclude disks, they won't be present on the Azure VM after migration.
    - You can exclude disks if the mobility agent is already installed on that server. [Learn more](../site-recovery/exclude-disks-replication.md#exclude-limitations).

9. In **Tags**, choose to add tags to your Virtual machines, Disks, and NICs.

10. In **Review and start execution**, review the settings, and select **Execute migration** to start the initial replication for the servers.
11. When you select **Execute migration**, you start replication for the selected servers. Replication proceeds as follows:
    - When the start replication job finishes successfully, the server begins initial replication to Azure.
    - During initial replication, a VM snapshot is created. Disk data from the snapshot is replicated to replica managed disks (seed disks) in Azure.
    - After initial replication finishes, delta replication begins. The process periodically replicates incremental changes to the source disks to the replica disks in Azure and the server is ready for migration in delta replication.  

## Track and migrate replicating servers

This section explains how to track replicating servers and perform test and final migrations.

1. In your Azure Migrate project, go to **Manage** > **Server replication**. Navigate to **Other**.
2. The following columns show the replication and migration status of your servers for which you initiated replication:
    - **Replication status**: Displays the current state of replication for the server. Learn more about [replication states](concepts-vmware-agentless-migration.md#replication-states).
    - **Replication health**: Indicates whether replication is Healthy, Warning, or Critical.
    - **Last sync**: Shows when the latest replication data was synchronized to Azure.
    - **Test migration status**: Indicates the current or most recent test migration status for the replicating server or shows as **Pending**.
    - **Migration status**: Displays the current or most recent migration status for the replicating server or shows as **Ready to migrate** if the initial replication is completed.
3. **Test migration**:
    - For servers that complete initial replication and are in **Delta sync**, you can run a test migration to validate your workloads and applications in Azure before final migration. Use an isolated Azure virtual network to avoid impacting your production environment. Test migration doesn't interrupt ongoing delta replication, and you can run multiple test migrations as needed. After validation is complete, ensure to clean up the test migration resources.
    - For the server you want to test, select the menu on the right, and then select **Test migration**.
  
       :::image type="content" source="./media/tutorial-migrate-physical-virtual-machines/start-test-migration.png" alt-text="Screenshot how to navigate to start test migration." lightbox="./media/tutorial-migrate-physical-virtual-machines/start-test-migration.png":::
       
    - In **Test migration** page:
       - Choose the **Virtual network** and **Subnet**.
       - Optionally, upgrade the operating system. To perform OS upgrade, select **Upgrade available** (only supported for Windows OS, currently in preview). Learn more about [Upgrading windows OS upgrade](how-to-upgrade-windows.md). 
       - After configuring the above settings, select **Test migration**.
        
After validation is complete, select the menu on the right of the server, and then select **Clean up test migration** to remove the test VM and associated resources.

1.  **Migration**:
    - Servers that are ready for migration show as **Ready to migrate** under the column **Migration status**.
    - To perform migration for these servers, select **Migrate** in the **Server replication** page.
    - In the **Migrate** page,
       - Select the servers you want to migrate.
       - Optionally, select the Target OS if you want to upgrade the OS (only supported for Windows OS, currently in preview). Learn more about [Upgrading windows OS upgrade](how-to-upgrade-windows.md).
       - Choose to shut down virtual machines if you want to perform a planned migration with no data loss.
       - After configuring the above settings, select **Migrate**.
  
2. View the status and migration completion time for migrated servers in the **Migration status** column.
3. . **Optional replication actions**:
   The following actions are optional and needed only for specific replication or recovery scenarios. You can access them from the menu for each server.    
     - **Stop replication**: Stops replication for the server when you no longer want to replicate or migrate it.
     - **Resynchronize**: Resynchronizes the server when replication needs to be re-established to bring the replica back in sync with the source.
  
    > [!NOTE]
    > You can now register your servers running SQL Server with SQL VM RP to take advantage of automated patching, automated backup, and simplified license management by using SQL IaaS Agent Extension.
    >- Select the servers replicating under **Manage** >**Server replication** page. In Compute and Network settings, select checkbox associated with register with SQL IaaS extension.
    >- Select Azure Hybrid Benefit for SQL Server if you have SQL Server instances that are covered by active Software Assurance or SQL Server subscriptions and you want to apply the benefit to the machines you're migrating.hs.

## Post-migration best practices

- For increased resilience:
    - Keep data secure by backing up Azure VMs by using the Azure Backup service. [Learn more](../backup/quick-backup-vm-portal.md).
    - Keep workloads running and continuously available by replicating Azure VMs to a secondary region with Site Recovery. [Learn more](../site-recovery/azure-to-azure-tutorial-enable-replication.md).
- For increased security:
    - Lock down and limit inbound traffic access with [Microsoft Defender for Cloud - Just-in-time administration](../security-center/security-center-just-in-time.md).
    - Manage and govern updates on Windows and Linux machines with [Azure Update Manager](../update-manager/overview.md).
    - Restrict network traffic to management endpoints with [network security groups](../virtual-network/network-security-groups-overview.md).
    - Deploy [Azure Disk Encryption](/azure/virtual-machines/disk-encryption-overview) to help secure disks and keep data safe from theft and unauthorized access.
    - Read more about [securing IaaS resources](https://azure.microsoft.com/services/virtual-machines/secure-well-managed-iaas/) and [Microsoft Defender for Cloud](https://azure.microsoft.com/services/security-center/).
- For monitoring and management:
    - Consider deploying [Microsoft Cost Management](../cost-management-billing/cost-management-billing-overview.md) to monitor resource usage and spending.

## Next steps

Investigate the [cloud migration journey](/azure/architecture/cloud-adoption/getting-started/migrate) in the Cloud Adoption Framework for Azure. 

---
title: Migrate machines as physical servers to Azure with Azure Migrate and Modernize
description: This article describes how to migrate physical machines to Azure with Azure Migrate and Modernize.
author: dhananjayanr98
ms.author: dhananjayanr
ms.manager: kmadnani
ms.topic: tutorial
ms.service: azure-migrate
ms.reviewer: v-uhabiba
ms.date: 08/26/2025
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
> * Enable replication.
> * Run a test migration to make sure everything's working as expected.
> * Run a full migration to Azure.

> [!NOTE]
> Tutorials show you the simplest deployment path for a scenario so that you can quickly set up a proof of concept. Tutorials use default options where possible and don't show all possible settings and paths. For detailed instructions, review the how-to articles for Azure Migrate and Modernize.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/free-trial/) before you begin.

## Prerequisites

Before you begin this tutorial, you should:

- [Review](./agent-based-migration-architecture.md) the migration architecture.
- [Review](../site-recovery/migrate-tutorial-windows-server-2008.md#limitations-and-known-issues) the limitations related to migrating Windows Server 2008 servers to Azure.

> [!NOTE]
> If you're planning to upgrade your Windows operating system, Azure Migrate and Modernize might download the Windows SetupDiag utility for error details in case upgrade fails. Ensure that the VM created in Azure after the migration has access to [SetupDiag](https://go.microsoft.com/fwlink/?linkid=870142). If there's no access to SetupDiag, you might not be able to get detailed OS upgrade failure error codes but the upgrade can still proceed.

## Prepare Azure

Prepare Azure for migration with the Migration and modernization tool.

Task | Details
--- | ---
Create an Azure Migrate project | Your Azure account needs Contributor or Owner permissions to [create a new project](./create-manage-projects.md).
Verify permissions for your Azure account | Your Azure account needs permissions to create a VM and write to an Azure managed disk.

### Assign permissions to create a project

1. In the Azure portal, open the subscription and select **Access control (IAM)**.
1. In **Check access**, find the relevant account and select it to view permissions.
1. You should have **Contributor** or **Owner** permissions.
    - If you just created a free Azure account, you're the owner of your subscription.
    - If you're not the subscription owner, work with the owner to assign the role.

### Assign Azure account permissions

Assign the VM Contributor role to the Azure account. This role provides permissions to:

- Create a VM in the selected resource group.
- Create a VM in the selected virtual network.
- Write to an Azure managed disk.

### Create an Azure network

> [!IMPORTANT]
> Virtual networks are a regional service, so make sure you create your virtual network in the desired target Azure region. For example, if you're planning on replicating and migrating VMs from your on-premises environment to the East US Azure Region, your target virtual network *must be created* in the East US Region. To connect virtual networks in different regions, see [Virtual network peering](../virtual-network/virtual-network-peering-overview.md).

[Set up](../virtual-network/manage-virtual-network.yml#create-a-virtual-network) an Azure virtual network. When you replicate to Azure, Azure VMs are created and joined to the Azure virtual network that you specified when you set up migration.

## Prepare for migration
> [!NOTE]
> We recommend that you perform discovery and assessment prior to the migration by using the Azure Migrate: Discovery and assessment tool, a separate lightweight Azure Migrate appliance. You can deploy the appliance as a physical server to continuously discover servers and performance metadata. [Learn more](tutorial-discover-physical.md).

To prepare for physical server migration, you need to verify the physical server settings and prepare to deploy a replication appliance.

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

To set up a new appliance, you can use PowerShell installer script. Ensure you meet all the [hardware](../site-recovery/replication-appliance-support-matrix.md#hardware-requirements) and [software](../site-recovery/replication-appliance-support-matrix.md#software-requirements) requirements, and any other prerequisites. 

> [!NOTE]
> The replication appliance shouldn't be installed on a source machine that you want to replicate or on the Azure Migrate: Discovery and assessment appliance you might have installed before.

## Set up the replication appliance

The first step of migration is to set up the replication appliance. To set up the appliance for physical server migration, download the installer file for the appliance. Then run it on the machine you prepared. After you install the appliance, register it with your migrate project using the key copied from the portal.

## Classic experience (Retiring)

> [!NOTE]
> Classic experience is scheduled for retirement on **30 September 2026**. Your existing replications and migrations will be supported till the retirement date.
> Please use [simplified experience](simplified-experience-for-azure-migrate.md) for all new migrations. [Learn more](tutorial-migrate-physical-virtual-machines.md#simplified-experience-recommended) on how to set up the simplified experience.
> 
### Download the replication appliance installer

1. In the Azure Migrate project, select **Servers, databases, and web apps** > **Migration and modernization** > **Discover**.

1. In **Discover machines** > **Are your machines virtualized?**, select **Not virtualized/Other**.
1. In **Target region**, select the Azure region to which you want to migrate the machines.
1. Select **Confirm that the target region for migration is region-name**.
1. Select **Create resources** to create a Site Recovery vault in the background.
    - If you already set up migration with the Migration and modernization tool, the target option can't be configured because resources were set up previously.
    - You can't change the target region for this project after selecting this button.
    - All subsequent migrations are to this region.
    
     > [!NOTE]
     > If you selected private endpoint as the connectivity method for the Azure Migrate project when it was created, the Recovery Services vault is also configured for private endpoint connectivity. Ensure that the private endpoints are reachable from the replication appliance. [Learn more](troubleshoot-network-connectivity.md).

1. In **Do you want to install a new replication appliance?**, select **Install a replication appliance**.
1. In **Download and install the replication appliance software**, download the appliance installer and the registration key. You need the key to register the appliance. The key is valid for five days after it was downloaded.

    :::image type="content" source="./media/tutorial-migrate-physical-virtual-machines/simplified-experience.png" alt-text="Screenshot shows the simplified experience":::.

1. Copy the appliance setup file and key file to the Windows Server 2016 machine you created for the appliance.

1. After the installation finishes, the Appliance configuration wizard launches automatically. (You can also launch the wizard manually by using the `cspsconfigtool` shortcut that was created on the appliance desktop.) In this tutorial, we manually install the Mobility service on the source VMs to be replicated. You need to create a dummy account in this step to proceed. For your dummy account, use "guest" as the friendly name, "username" as the username, and "password" as the password for the account. You use this dummy account in the Enable Replication stage.

1. After the appliance restarts after setup, in **Discover machines**, select the new appliance in **Select Configuration Server**. Then select **Finalize registration**. The **Finalize registration** step performs a couple of final tasks to prepare the replication appliance.

    ![Screenshot that shows Finalize registration.](./media/tutorial-migrate-physical-virtual-machines/finalize-registration.png)

The mobility service agent must be installed on the servers to get them discovered by using the replication appliance. Discovered machines appear in **Azure Migrate: Server Migration**. As VMs are discovered, the **Discovered servers** count rises.


## Simplified experience (Recommended)

This section introduces a new process, which is simplified experience. Users will follow a streamlined flow that begins with discovery, followed by replication, and finally migration.

It introduces an upgraded agent-based migration stack for physical and VMware environments. Customers benefit from the ability to migrate newer Linux distributions to Azure, use WS2022 for the replication appliance, and utilize a unified OS support matrix. 

## Navigate to Azure Migrate project

Follow the steps to navigate to the Azure Migrate project:

**Step 1**: Navigate to Azure Migrate project

1. Open [Azure portal](https://portal.azure.com). 
1. Search for the **Azure Migrate** service.
1. Create a new project or select an existing one. [Learn more](/azure/migrate/).

**Step 2**: Select the required Agent-Based Migration Scenario

1. Select **Discover** from the Migration tools.
1. Select the scenario **VMware agent-based replication** or **Physical or other**.
1. If resources aren't already created, select a target region for your migration and create the resources.

     :::image type="content" source="./media/tutorial-migrate-physical-virtual-machines/azure-migrate-discover.png" alt-text="Screenshot shows the azure migrate discover screen":::.

    - If you already set up migration with the Migration and modernization tool, the target option can't be configured because resources were set up previously.
    - You can't change the target region for this project after selecting this button.
    - All subsequent migrations are to this region.
      
    
     > [!NOTE]
     > If you selected private endpoint as the connectivity method when creating the Azure Migrate project, the Recovery Services vault is also configured to use private endpoint connectivity. Ensure the replication appliance can reach the private endpoints. [Learn more](troubleshoot-network-connectivity.md).
     

1. Select **Simplified experience** from the **Experience type** dropdown.

> [!Note]
> For more detailed information on deploying the appliance, refer to the appendix section at the end of this document.

**Step 3**: Deploy the Appliance

1. Follow the steps with OVA or PowerShell for VMware and PowerShell for the physical scenario. 
1. After deployment and completing the registration key process, wait for 30 minutes for the appliance to connect.

**Step 4**: Start the Replication
1. Select **Replicate**.
1. Select the appropriate scenario (Physical or VMware agent-based) and proceed. 
1. Select the VMs you want to replicate and configure the target settings.

**Step 5**: Test migrate and Migrate

1. Navigate to the migration overview page.
1. Select **Test Migrate** and perform test migration on the machines you want to migrate.
1. After successful test migration, Perform the final migration.

**Step 6**: Verify the virtual machine in Azure VM 

Verify if the VM boots up on Azure: 
* By going to the target resource group and searching for your VM. 
* Or by navigating to the Azure VM section on the Azure portal and searching for your migrated VM.

### Set up the replication appliance using the OVA template for VMware agent-based migration

We recommend using this approach as it ensures all prerequisite configurations are handled by the template. The OVA template creates a machine with the required specifications.

:::image type="content" source="./media/tutorial-migrate-physical-virtual-machines/download-ova-file.png" alt-text="Screenshot shows the download option of the ova file":::.

Follow the steps:

1. [Download](https://aka.ms/V2ARcmOvaDownloadLink_ccy) the OVA template here or from the portal to set up an appliance on your on-premises environment.
1. Power on the appliance VM to accept the Microsoft Evaluation license. 
1. Provide a password for the administrator user. 
1. Select **Finalize** the system reboots, and you can log in with the administrator user account.

**Set up the appliance using PowerShell**

If your organization has restrictions, you can manually set up the replication appliance using PowerShell.
For physical servers, use PowerShell to install the appliance.

Follow these steps:

1. [Download](https://aka.ms/V2ARcmApplianceCreationPowershellZip) the installers and place them on the replication appliance.
1. Unzip and extract the components.
1. Execute the **DRInstaller.ps1 PowerShell** script as an administrator.

### Register appliance

After the appliance is created, the **Microsoft Azure Appliance Configuration Manager** launches automatically. It validates prerequisites such as internet connectivity, time synchronization, system configurations, and group policies.

**CheckRegistryAccessPolicy** - Prevents access to registry editing tools
    - Key: `HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System`.
    - The DisableRegistryTools value shouldn't be equal to 0.

**CheckCommandPromptPolicy** - Prevents access to the command prompt
    - Key: `HKLM\SOFTWARE\Policies\Microsoft\Windows\System`.
    - The DisableCMD value should be equal to 0.

**CheckTrustLogicAttachmentsPolicy** - Trust logic for file attachments.
    - Key: `HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Attachments`.
    - The UseTrustedHandlers value shouldn't be equal to 3.

**CheckPowershellExecutionPolicy** - Turn on Script Execution.
    - PowerShell execution policy shouldn't be set to **AllSigned or Restricted**.
    - Ensure the group policy **Turn on Script Execution Attachment Manager** isn't set to Disabled or **Allow only signed scripts**.

Use the following steps to register the appliance:

1. If the appliance uses a proxy for internet access, configure the proxy settings by toggling on the 'Use proxy to connect to internet' option.
    - All Azure Site Recovery services use these settings to connect to the internet.
    
    > [!Note]
    > Only HTTP proxy is supported.

1. Ensure the [required URLs](../site-recovery/replication-appliance-support-matrix.md#allow-urls) are allowed and reachable from the Azure Site Recovery replication appliance to maintain continuous connectivity.
1. After the prerequisites are verified, the appliance fetch all its component information in the next step. Review the status of all components and then select **Continue**.
1. **Save** the details, and then proceed to choose the appliance connectivity method. You can select either FQDN or a NAT IP to define how communication with the appliance occurs.

    :::image type="content" source="./media/tutorial-migrate-physical-virtual-machines/select-replication-appliance-connectivity.png" alt-text=" Screenshot shows how to select replication appliance connectivity":::.

1. After saving the connectivity details, select **Continue** to proceed with registration in Microsoft Azure. 
1. Ensure the [prerequisites](../site-recovery/replication-appliance-support-matrix.md#pre-requisites) are met, and then proceed with the registration.

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

1. After successful registration, proceed to configure **vCenter** details.

    :::image type="content" source="./media/tutorial-migrate-physical-virtual-machines/provide-vcenter-information.png" alt-text="Screenshot shows how to provide vcenter information":::.

1. Select **Add vCenter Server** to input the vCenter information.
1. Enter the server name or IP address of the vCenter, including the port number and then provide the username, password, and a friendly name.
This information is used to retrieve details about the virtual machines managed through the vCenter. The user account details are encrypted and stored locally on the machine. [Learn more](../site-recovery/vmware-azure-tutorial-prepare-on-premises.md).

    > [!Note]
    > If you're adding the same vCenter Server to multiple appliances, ensure that the same friendly name is used across all appliances.

1. After successfully saving the vCenter information, select **Add Virtual Machine** credentials to provide user details for the VMs discovered through the vCenter.

     > [!Note]
     > * For Linux OS, ensure to provide root credentials.
     > * For Windows OS, a user account with admin privileges should be added. These credentials are used to push the installation of the mobility agent onto the source VM during the enable replication operation. The credentials can be chosen per VM in the Azure portal during the enable replication workflow.
     > * Visit the **Appliance Configurator** to edit or add credentials to access your machines.

1. After adding the vCenter details, expand **Provide Physical Server Details** to add information about any physical servers you plan to protect.

    :::image type="content" source="./media/tutorial-migrate-physical-virtual-machines/provide-physical-server-details.png" alt-text=" Screenshot provides physical server details":::.

1. Select **Add Credentials** to add the credentials of the machine(s) you plan to protect. Provide all necessary details, such as the **Operating System**, a friendly name for the credential, **username**, and **Password**. The user account details are encrypted and stored locally on the machine.
1. Finally, select **Add**.

    :::image type="content" source="./media/tutorial-migrate-physical-virtual-machines/add-physical-server-credentials.png" alt-text="Screenshot shows how to add physical server credentials":::.

1. Select **Add Server** to add the physical server details. Provide the machine's **IP address or FQDN**
1. Select the **credential account**, and then select **Add**.

    :::image type="content" source="./media/tutorial-migrate-physical-virtual-machines/add-physical-server-details.png" alt-text="Screenshot shows how to add physical server details":::.

## Install the Mobility service agent

When you enable replication for VMware virtual machines and physical servers, the Mobility service is installed on each on-premises machine. The Mobility service captures data, writes it to the machine, and forwards it to the Site Recovery process server.

You can install the Mobility service using the Mobility service agent software. The following methods are available for deployment:

- [Push installation](../site-recovery/vmware-physical-mobility-service-overview.md#push-installation): When protection is enabled via the Azure portal, Site Recovery installs the Mobility service on the server.
- Manual installation: You can install the Mobility service manually on each machine through the [user interface (UI)](../site-recovery/vmware-physical-mobility-service-overview.md#install-the-mobility-service-using-ui-modernized) or [command prompt](../site-recovery/vmware-physical-mobility-service-overview.md#install-the-mobility-service-using-command-prompt-modernized).
- [Automated deployment](../site-recovery/vmware-azure-mobility-install-configuration-mgr.md): You can automate the Mobility service installation with software deployment tools such as Configuration Manager.
  
 [Learn more](../site-recovery/vmware-physical-mobility-service-overview.md) about mobility service agent installation.

 ::: moniker range="migrate" 
 
## Replicate machines

Now, select machines for migration.

> [!NOTE]
> You can replicate up to 10 machines together. If you need to replicate more, replicate them simultaneously in batches of 10.

1. In the Azure Migrate project, select **Execute** > **Migrations** > **Replicate**.
1. In **Replicate**, > **Source settings** > **Are your machines virtualized?**, select **Physical or other (AWS, GCP, Xen, etc.)**.
1. In **On-premises appliance**, select the name of the replication appliance that you set up and then select **continue**.
1. In **Guest credentials**, select the friendly name of the credentials created previously during the replication appliance setup and then select **Next: Virtual machines**.

    :::image type="content" source="./media/tutorial-migrate-physical-virtual-machines/source-settings.png" alt-text="Screenshot that shows source settings.":::

1. In **Virtual machines**, in **Import migration settings from an assessment?**, leave the default setting **No, I'll specify the migration settings manually**.
1. By default, **VMs that are eligible for Trusted Launch are migrated as TVMs**. Trusted Launch VMs provide enhanced security features such as secure boot and virtual TPM at no additional cost. We recommend using them wherever applicable.

    :::image type="content" source="./media/tutorial-migrate-physical-virtual-machines/select-vms-inline.png" alt-text="Screenshot that shows selecting VMs." lightbox="./media/tutorial-migrate-physical-virtual-machines/select-vms-inline.png":::

1. Check each VM you want to migrate. Then select **Next: Target settings**.

    :::image type="content" source="./media/tutorial-migrate-physical-virtual-machines/migrate-vm.png" alt-text="Screenshot that shows migrating VMs." lightbox="./media/tutorial-migrate-physical-virtual-machines/migrate-vm.png":::

1. In **Target settings**, select the subscription to which you'll migrate. (The region is set to your selection in the previous step and can't be modified.) Specify the resource group in which the Azure VMs will reside after migration.
1. In **Virtual Network**, select the Azure virtual network/subnet to which the Azure VMs will be joined after migration.
1. In **Cache storage account**, keep the default option to use the cache storage account that's automatically created for the project. Use the dropdown list if you want to specify a different storage account to use as the cache storage account for replication. <br/>

    >[!NOTE]
    > - If you selected private endpoint as the connectivity method for the Azure Migrate project, grant the Recovery Services vault access to the cache storage account. [Learn more](migrate-servers-to-azure-using-private-link.md#grant-access-permissions-to-the-recovery-services-vault).
    > - To replicate by using Azure ExpressRoute with private peering, create a private endpoint for the cache storage account. [Learn more](migrate-servers-to-azure-using-private-link.md#create-a-private-endpoint-for-the-storage-account-1).

1. In **Availability options**, select:
    -  **Availability Zone**: Pins the migrated machine to a specific availability zone in the region. Use this option to distribute servers that form a multinode application tier across availability zones. If you select this option, you need to specify the availability zone to use for each of the selected machines on the **Compute** tab. This option is only available if the target region selected for the migration supports availability zones.
    -  **Availability Set**: Places the migrated machine in an availability set. The target resource group that was selected must have one or more availability sets in order to use this option.
    - **No infrastructure redundancy required**: Select this option if you don't need either of the availability configurations for the migrated machines.

1. In **Disk encryption type**, select:
    - Encryption-at-rest with platform-managed key.
    - Encryption-at-rest with customer-managed key.
    - Double encryption with platform-managed and customer-managed keys.

   > [!NOTE]
   > To replicate VMs with customer-managed keys, you need to [create a disk encryption set](/azure/virtual-machines/disks-enable-customer-managed-keys-portal) under the target resource group. A disk encryption set object maps managed disks to an Azure Key Vault instance that contains the customer-managed key to use for server-side encryption.

1. In **Azure Hybrid Benefit**:

    - Select **No** if you don't want to apply Azure Hybrid Benefit. Then select **Next**.
    - Select **Yes** if you have Windows Server machines that are covered with active Software Assurance or Windows Server subscriptions, and you want to apply the benefit to the machines you're migrating. Then select **Next**.

    :::image type="content" source="./media/tutorial-migrate-physical-virtual-machines/target-settings.png" alt-text="Screenshot that shows Target settings.":::

1. In **Compute**, review the VM name, size, OS disk type, and availability configuration (if selected in the previous step). VMs must conform with [Azure requirements](migrate-support-matrix-physical-migration.md#azure-vm-requirements).
    - **VM size**: If you're using assessment recommendations, the VM size dropdown list shows the recommended size. Otherwise, Azure Migrate and Modernize picks a size based on the closest match in the Azure subscription. Alternatively, pick a manual size in **Azure VM size**.
    - **OS disk**: Specify the OS (boot) disk for the VM. The OS disk is the disk that has the operating system bootloader and installer.
    - **Availability Zone**: Specify the availability zone to use.
    - **Availability Set**: Specify the availability set to use. 
    - **VM Security Type**: Azure Migrate recommends migrating eligible VMs to **Trusted Launch Virtual Machines (TVMs)** for enhanced security. By default, the **VM security type is set to Trusted Launch**. VMs that are not eligible for Trusted Launch are automatically configured as **standard security VMs**. 

1. In **Disks**, specify whether the VM disks should be replicated to Azure. Select the disk type (standard SSD/HDD or premium managed disks) in Azure. Then select **Next**.
    - You can exclude disks from replication.
    - If you exclude disks, they won't be present on the Azure VM after migration.

    :::image type="content" source="./media/tutorial-migrate-physical-virtual-machines/disks-inline.png" alt-text="Screenshot that shows the Disks tab in the Replicate dialog." lightbox="./media/tutorial-migrate-physical-virtual-machines/disks-expanded.png":::

1. In **Tags**, choose to add tags to your VMs, disks, and NICs.

    :::image type="content" source="./media/tutorial-migrate-physical-virtual-machines/tags-inline.png" alt-text="Screenshot that shows the tags tab in the Replicate dialog." lightbox="./media/tutorial-migrate-physical-virtual-machines/tags-expanded.png":::

1. In **Review and start replication**, review the settings and select **Replicate** to start the initial replication for the servers.

> [!NOTE]
> You can update replication settings any time before replication starts. Select **Manage** > **Replicating machines**. Settings can't be changed after replication starts.

## Track and monitor

- When you select **Replicate**, a Start Replication job begins.
- After the Start Replication job finishes successfully, the machines begin their initial replication to Azure.
- After initial replication finishes, delta replication begins. Incremental changes to on-premises disks are periodically replicated to the replica disks in Azure.

You can track job status in the portal notifications.

You can monitor replication status by selecting **Replications summary** in the project under **Migrations**.

## Run a test migration

When delta replication begins, you can run a test migration for the VMs before you run a full migration to Azure. We highly recommend that you do this step at least once for each machine before you migrate it.

- Running a test migration checks that migration works as expected, without affecting the on-premises machines, which remain operational and continue replicating.
- Test migration simulates the migration by creating an Azure VM using replicated data. (The test usually migrates to a nonproduction virtual network in your Azure subscription.)
- You can use the replicated test Azure VM to validate the migration, perform app testing, and address any issues before full migration.

To do a test migration:

1. In **Migrations**, select **Replications summary** and then select **other** under **Replications**.

1. In the **Replicating machines** tab, right-click the VM to test and select **Test migrate**.

    :::image type="content" source="./media/tutorial-migrate-physical-virtual-machines/test-migrate-inline.png" alt-text="Screenshot that shows the result after selecting Test migrate." lightbox="./media/tutorial-migrate-physical-virtual-machines/test-migrate-expanded.png":::

1. In **Test Migration**, select the Azure virtual network in which the Azure VM will be located after the migration. We recommend that you use a nonproduction virtual network.
1. You can upgrade the Windows Server OS during test migration. To upgrade, select the **Upgrade available** option. In the pane that appears, select the target OS version that you want to upgrade to and select **Apply**. [Learn more](how-to-upgrade-windows.md).
1. The Test Migration job starts. Monitor the job in the portal notifications.
1. After the migration finishes, view the migrated Azure VM in **Virtual Machines** in the Azure portal. The machine name has the suffix **-Test**.
1. After the test is finished, right-click the Azure VM in **Replicating machines** and select **Clean up test migration**.

    :::image type="content" source="./media/tutorial-migrate-physical-virtual-machines/clean-up-inline.png" alt-text="Screenshot that shows Clean up test migration." lightbox="./media/tutorial-migrate-physical-virtual-machines/clean-up-expanded.png":::

    > [!NOTE]
    > You can now register your servers running SQL Server with SQL VM RP to take advantage of automated patching, automated backup, and simplified license management by using the SQL IaaS Agent Extension.
    >- Select **Manage** > **Replicating servers** > **Machine containing SQL server** > **Compute and Network** and select **yes** to register with SQL VM RP.
    >- Select **Azure Hybrid Benefit for SQL Server** if you have SQL Server instances that are covered with active Software Assurance or SQL Server subscriptions and you want to apply the benefit to the machines you're migrating.

## Migrate VMs

After you verify that the test migration works as expected, you can migrate the on-premises machines.

1. In the Azure Migrate project, select **Migrationss** > **Replications summary** and then select **Other** under **Replications**.
1. In **Replicating machines**, right-click the VM and select **Migrate**.
1. In **Migrate** > **Shut down virtual machines and perform a planned migration with no data loss**, select **No** > **OK**.

    > [!NOTE]
    > For minimal data loss, we recommend that you bring the application down manually as part of the migration window. (Don't let the applications accept any connections.) Then initiate the migration. The server needs to be kept running so that remaining changes can be synchronized before the migration is finished.

1. You can upgrade the Windows Server OS during migration. To upgrade, select the **Upgrade available** option. In the pane that appears, select the target OS version that you want to upgrade to and select **Apply**. [Learn more](how-to-upgrade-windows.md).
1. A migration job starts for the VM. Track the job in Azure notifications.
1. After the job finishes, you can view and manage the VM from the **Virtual Machines** page.

## Complete the migration

1. After the migration is finished, right-click the VM and select **Stop replication**. This action:
    - Stops replication for the on-premises machine.
    - Removes the machine from the **Replicated servers** count in the Migration and modernization tool.
    - Cleans up replication state information for the machine.
1. Verify and [troubleshoot any Windows activation issues on the Azure VM](/troubleshoot/azure/virtual-machines/troubleshoot-activation-problems).
1. Perform any post-migration app tweaks, such as updating host names, database connection strings, and web server configurations.
1. Perform final application and migration acceptance testing on the migrated application now running in Azure.
1. Cut over traffic to the migrated Azure VM instance.
1. Remove the on-premises VMs from your local VM inventory.
1. Remove the on-premises VMs from local backups.
1. Update any internal documentation to show the new location and IP address of the Azure VMs.

## Post-migration best practices

- For increased resilience:
    - Keep data secure by backing up Azure VMs by using the Azure Backup service. [Learn more](../backup/quick-backup-vm-portal.md).
    - Keep workloads running and continuously available by replicating Azure VMs to a secondary region with Site Recovery. [Learn more](../site-recovery/azure-to-azure-tutorial-enable-replication.md).
- For increased security:
    - Lock down and limit inbound traffic access with [Microsoft Defender for Cloud - Just-in-time administration](../security-center/security-center-just-in-time.md).
    - Manage and govern updates on Windows and Linux machines with [Azure Update Manager](../update-manager/overview.md).
    - Restrict network traffic to management endpoints with [network security groups](../virtual-network/network-security-groups-overview.md).
    - Deploy [Azure Disk Encryption](/azure/virtual-machines/disk-encryption-overview) to help secure disks and keep data safe from theft and unauthorized access.
    - Read more about [securing IaaS resources](https://azure.microsoft.com/services/virtual-machines/secure-well-managed-iaas/)and [Microsoft Defender for Cloud](https://azure.microsoft.com/services/security-center/).
- For monitoring and management:
    - Consider deploying [Microsoft Cost Management](../cost-management-billing/cost-management-billing-overview.md) to monitor resource usage and spending.

## Next steps

Investigate the [cloud migration journey](/azure/architecture/cloud-adoption/getting-started/migrate) in the Cloud Adoption Framework for Azure.

::: moniker-end

::: moniker range="migrate-classic" 

## Replicate machines

Now, select machines for migration.

> [!NOTE]
> You can replicate up to 10 machines together. If you need to replicate more, replicate them simultaneously in batches of 10.

1. In the Azure Migrate project, select **Servers, databases, and web apps** > **Migration and modernization** > **Replicate**.
1. In **Replicate**, > **Source settings** > **Are your machines virtualized?**, select **Physical or other (AWS, GCP, Xen, etc.)**.
1. In **On-premises appliance**, select the name of the replication appliance that you set up and then select **continue**.
1. In **Guest credentials**, select the friendly name of the credentials created previously during the replication appliance setup and then select **Next: Virtual machines**.

    :::image type="content" source="./media/tutorial-migrate-physical-virtual-machines/source-settings.png" alt-text="Screenshot that shows source settings.":::

1. In **Virtual machines**, in **Import migration settings from an assessment?**, leave the default setting **No, I'll specify the migration settings manually**.
1. By default, **VMs that are eligible for Trusted Launch are migrated as TVMs**. Trusted Launch VMs provide enhanced security features such as secure boot and virtual TPM at no additional cost. We recommend using them wherever applicable.

    :::image type="content" source="./media/tutorial-migrate-physical-virtual-machines/select-vms-inline.png" alt-text="Screenshot that shows selecting VMs." lightbox="./media/tutorial-migrate-physical-virtual-machines/select-vms-inline.png":::

1. Check each VM you want to migrate. Then select **Next: Target settings**.

    :::image type="content" source="./media/tutorial-migrate-physical-virtual-machines/migrate-vm.png" alt-text="Screenshot that shows migrating VMs." lightbox="./media/tutorial-migrate-physical-virtual-machines/migrate-vm.png":::

1. In **Target settings**, select the subscription to which you'll migrate. (The region is set to your selection in the previous step and can't be modified.) Specify the resource group in which the Azure VMs will reside after migration.
1. In **Virtual Network**, select the Azure virtual network/subnet to which the Azure VMs will be joined after migration.
1. In **Cache storage account**, keep the default option to use the cache storage account that's automatically created for the project. Use the dropdown list if you want to specify a different storage account to use as the cache storage account for replication. <br/>

    >[!NOTE]
    > - If you selected private endpoint as the connectivity method for the Azure Migrate project, grant the Recovery Services vault access to the cache storage account. [Learn more](migrate-servers-to-azure-using-private-link.md#grant-access-permissions-to-the-recovery-services-vault).
    > - To replicate by using Azure ExpressRoute with private peering, create a private endpoint for the cache storage account. [Learn more](migrate-servers-to-azure-using-private-link.md#create-a-private-endpoint-for-the-storage-account-1).

1. In **Availability options**, select:
    -  **Availability Zone**: Pins the migrated machine to a specific availability zone in the region. Use this option to distribute servers that form a multinode application tier across availability zones. If you select this option, you need to specify the availability zone to use for each of the selected machines on the **Compute** tab. This option is only available if the target region selected for the migration supports availability zones.
    -  **Availability Set**: Places the migrated machine in an availability set. The target resource group that was selected must have one or more availability sets in order to use this option.
    - **No infrastructure redundancy required**: Select this option if you don't need either of the availability configurations for the migrated machines.

1. In **Disk encryption type**, select:
    - Encryption-at-rest with platform-managed key.
    - Encryption-at-rest with customer-managed key.
    - Double encryption with platform-managed and customer-managed keys.

   > [!NOTE]
   > To replicate VMs with customer-managed keys, you need to [create a disk encryption set](/azure/virtual-machines/disks-enable-customer-managed-keys-portal) under the target resource group. A disk encryption set object maps managed disks to an Azure Key Vault instance that contains the customer-managed key to use for server-side encryption.

1. In **Azure Hybrid Benefit**:

    - Select **No** if you don't want to apply Azure Hybrid Benefit. Then select **Next**.
    - Select **Yes** if you have Windows Server machines that are covered with active Software Assurance or Windows Server subscriptions, and you want to apply the benefit to the machines you're migrating. Then select **Next**.

    :::image type="content" source="./media/tutorial-migrate-physical-virtual-machines/target-settings.png" alt-text="Screenshot that shows Target settings.":::

1. In **Compute**, review the VM name, size, OS disk type, and availability configuration (if selected in the previous step). VMs must conform with [Azure requirements](migrate-support-matrix-physical-migration.md#azure-vm-requirements).
    - **VM size**: If you're using assessment recommendations, the VM size dropdown list shows the recommended size. Otherwise, Azure Migrate and Modernize picks a size based on the closest match in the Azure subscription. Alternatively, pick a manual size in **Azure VM size**.
    - **OS disk**: Specify the OS (boot) disk for the VM. The OS disk is the disk that has the operating system bootloader and installer.
    - **Availability Zone**: Specify the availability zone to use.
    - **Availability Set**: Specify the availability set to use. 
    - **VM Security Type**: Azure Migrate recommends migrating eligible VMs to **Trusted Launch Virtual Machines (TVMs)** for enhanced security. By default, the **VM security type is set to Trusted Launch**. VMs that are not eligible for Trusted Launch are automatically configured as **standard security VMs**. 

1. In **Disks**, specify whether the VM disks should be replicated to Azure. Select the disk type (standard SSD/HDD or premium managed disks) in Azure. Then select **Next**.
    - You can exclude disks from replication.
    - If you exclude disks, they won't be present on the Azure VM after migration.

    :::image type="content" source="./media/tutorial-migrate-physical-virtual-machines/disks-inline.png" alt-text="Screenshot that shows the Disks tab in the Replicate dialog." lightbox="./media/tutorial-migrate-physical-virtual-machines/disks-expanded.png":::

1. In **Tags**, choose to add tags to your VMs, disks, and NICs.

    :::image type="content" source="./media/tutorial-migrate-physical-virtual-machines/tags-inline.png" alt-text="Screenshot that shows the tags tab in the Replicate dialog." lightbox="./media/tutorial-migrate-physical-virtual-machines/tags-expanded.png":::

1. In **Review and start replication**, review the settings and select **Replicate** to start the initial replication for the servers.

> [!NOTE]
> You can update replication settings any time before replication starts. Select **Manage** > **Replicating machines**. Settings can't be changed after replication starts.

## Track and monitor

- When you select **Replicate**, a Start Replication job begins.
- After the Start Replication job finishes successfully, the machines begin their initial replication to Azure.
- After initial replication finishes, delta replication begins. Incremental changes to on-premises disks are periodically replicated to the replica disks in Azure.

You can track job status in the portal notifications.

You can monitor replication status by selecting **Replicating servers** in **Azure Migrate: Server Migration**.

## Run a test migration

When delta replication begins, you can run a test migration for the VMs before you run a full migration to Azure. We highly recommend that you do this step at least once for each machine before you migrate it.

- Running a test migration checks that migration works as expected, without affecting the on-premises machines, which remain operational and continue replicating.
- Test migration simulates the migration by creating an Azure VM using replicated data. (The test usually migrates to a nonproduction virtual network in your Azure subscription.)
- You can use the replicated test Azure VM to validate the migration, perform app testing, and address any issues before full migration.

To do a test migration:

1. In **Migration goals**, select **Servers, databases and web apps** > **Migration and modernization**, select **Replicated servers** under **Replications**.

1. In the **Replicating machines** tab, right-click the VM to test and select **Test migrate**.

    :::image type="content" source="./media/tutorial-migrate-physical-virtual-machines/test-migrate-inline.png" alt-text="Screenshot that shows the result after selecting Test migrate." lightbox="./media/tutorial-migrate-physical-virtual-machines/test-migrate-expanded.png":::

1. In **Test Migration**, select the Azure virtual network in which the Azure VM will be located after the migration. We recommend that you use a nonproduction virtual network.
1. You can upgrade the Windows Server OS during test migration. To upgrade, select the **Upgrade available** option. In the pane that appears, select the target OS version that you want to upgrade to and select **Apply**. [Learn more](how-to-upgrade-windows.md).
1. The Test Migration job starts. Monitor the job in the portal notifications.
1. After the migration finishes, view the migrated Azure VM in **Virtual Machines** in the Azure portal. The machine name has the suffix **-Test**.
1. After the test is finished, right-click the Azure VM in **Replicating machines** and select **Clean up test migration**.

    :::image type="content" source="./media/tutorial-migrate-physical-virtual-machines/clean-up-inline.png" alt-text="Screenshot that shows Clean up test migration." lightbox="./media/tutorial-migrate-physical-virtual-machines/clean-up-expanded.png":::

    > [!NOTE]
    > You can now register your servers running SQL Server with SQL VM RP to take advantage of automated patching, automated backup, and simplified license management by using the SQL IaaS Agent Extension.
    >- Select **Manage** > **Replicating servers** > **Machine containing SQL server** > **Compute and Network** and select **yes** to register with SQL VM RP.
    >- Select **Azure Hybrid Benefit for SQL Server** if you have SQL Server instances that are covered with active Software Assurance or SQL Server subscriptions and you want to apply the benefit to the machines you're migrating.

## Migrate VMs

After you verify that the test migration works as expected, you can migrate the on-premises machines.

1. In the Azure Migrate project, select **Servers, databases, and web apps** > **Migration and modernization**, select **Replicated servers** under **Replications**.
1. In **Replicating machines**, right-click the VM and select **Migrate**.
1. In **Migrate** > **Shut down virtual machines and perform a planned migration with no data loss**, select **No** > **OK**.

    > [!NOTE]
    > For minimal data loss, we recommend that you bring the application down manually as part of the migration window. (Don't let the applications accept any connections.) Then initiate the migration. The server needs to be kept running so that remaining changes can be synchronized before the migration is finished.

1. You can upgrade the Windows Server OS during migration. To upgrade, select the **Upgrade available** option. In the pane that appears, select the target OS version that you want to upgrade to and select **Apply**. [Learn more](how-to-upgrade-windows.md).
1. A migration job starts for the VM. Track the job in Azure notifications.
1. After the job finishes, you can view and manage the VM from the **Virtual Machines** page.

## Complete the migration

1. After the migration is finished, right-click the VM and select **Stop replication**. This action:
    - Stops replication for the on-premises machine.
    - Removes the machine from the **Replicated servers** count in the Migration and modernization tool.
    - Cleans up replication state information for the machine.
1. Verify and [troubleshoot any Windows activation issues on the Azure VM](/troubleshoot/azure/virtual-machines/troubleshoot-activation-problems).
1. Perform any post-migration app tweaks, such as updating host names, database connection strings, and web server configurations.
1. Perform final application and migration acceptance testing on the migrated application now running in Azure.
1. Cut over traffic to the migrated Azure VM instance.
1. Remove the on-premises VMs from your local VM inventory.
1. Remove the on-premises VMs from local backups.
1. Update any internal documentation to show the new location and IP address of the Azure VMs.

## Post-migration best practices

- For increased resilience:
    - Keep data secure by backing up Azure VMs by using the Azure Backup service. [Learn more](../backup/quick-backup-vm-portal.md).
    - Keep workloads running and continuously available by replicating Azure VMs to a secondary region with Site Recovery. [Learn more](../site-recovery/azure-to-azure-tutorial-enable-replication.md).
- For increased security:
    - Lock down and limit inbound traffic access with [Microsoft Defender for Cloud - Just-in-time administration](../security-center/security-center-just-in-time.md).
    - Manage and govern updates on Windows and Linux machines with [Azure Update Manager](../update-manager/overview.md).
    - Restrict network traffic to management endpoints with [network security groups](../virtual-network/network-security-groups-overview.md).
    - Deploy [Azure Disk Encryption](/azure/virtual-machines/disk-encryption-overview) to help secure disks and keep data safe from theft and unauthorized access.
    - Read more about [securing IaaS resources](https://azure.microsoft.com/services/virtual-machines/secure-well-managed-iaas/)and [Microsoft Defender for Cloud](https://azure.microsoft.com/services/security-center/).
- For monitoring and management:
    - Consider deploying [Microsoft Cost Management](../cost-management-billing/cost-management-billing-overview.md) to monitor resource usage and spending.

## Next steps

Investigate the [cloud migration journey](/azure/architecture/cloud-adoption/getting-started/migrate) in the Cloud Adoption Framework for Azure.

 ::: moniker-end


---
title: Redeploy servers to Azure VMs with scoped data copy
description: Learn how to redeploy servers to Azure VMs with scoped data copy in Azure Catalyst
author: dhananjayanr98
ms.author: dhananjayanr
ms.topic: how-to
ms.service: azure-migrate
ms.reviewer: v-gajeronika
ms.date: 11/10/2025
ms.update-cycle: 365-days
ms.custom: engagement-fy25
# Customer intent: As a system administrator, I want to automate server redeployment to Azure with selective data transfer so that I can streamline migration and avoid copying unnecessary data.
---

# Redeploy servers to Azure VMs with scoped data copy

Azure Catalyst supports redeploying servers to Azure by provisioning a new virtual machine (VM) or using an existing Azure VM and transferring selected files and folders from the source server. Unlike traditional lift-and-shift migration, server redeploy doesn't replicate the source operating system and disks. Instead, it helps you establish a new server environment in Azure and selectively migrate the data required by your workload.

You can orchestrate server redeploy via migration waves in Azure Catalyst. This process includes:
 - Deployment of a new Azure VM using a supported Marketplace or Azure Compute Gallery image, or use an existing Azure VM.
 - Configure target operating system settings, data disks, file systems, and supported prerequisites.
 - Transfer selected files and folders from the source server to the target VM by using Azure Blob Storage as an intermediate staging location.
 - Preserve supported file and folder permissions.
 - Perform a final data copy to synchronize changes made since the initial transfer.

This article describes the prerequisites and step-by-step process for redeploying servers to Azure VMs with scoped data copy by using Azure Catalyst migration waves.
  
  >[!NOTE]
  > - Server redeploy by using Azure Catalyst doesn't automatically migrate applications, configurations, or dependencies. You must manually deploy and configure applications on the target VM, validate their functionality, and approve cutover to Azure.
  > - Migration waves in Azure Catalyst support adding custom steps and scripts to automate application deployment and configuration on target VMs as part of the orchestrated execution flow. [Learn more](configure-customize-wave.md#add-steps-if-needed).


## Prerequisites and supported scenarios for server redeploy in Azure Catalyst

This section outlines the supported scenarios and prerequisites for server redeploy to Azure VMs through migration waves in Azure Catalyst.

### **Supported source and target operating systems** 
    
   | **Support** | **Details** |
   | --- | --- |
   | **Supported operating systems** | - Windows Server: 2022, 2025 <br/> - RHEL 9.X <br/> - Ubuntu LTS 22.04, 24.04 |
   | **Architecture** | Source and target VMs must be x64; ARM64 isn't supported. |
   | **Disk controller** | Target VMs must use SCSI; NVMe controllers aren't supported. |
   | **Guest execution** | Azure VM Agent must be enabled and capable of running commands. |
   | **Migration compatibility** | Windows-to-Windows and Linux-to-Linux migrations are supported. Cross-family migrations aren't supported. |
   | **Data volumes** | - Windows: GPT disks with NTFS. <br/> - Linux: GPT disks with XFS or ext4. <br/> - Blank disks can be formatted. User consent is required if the disk was already created as part of existing VM. <br/> - Existing customer volumes can be reused without reformatting. |
   | **OS layout** | Existing OS layout is retained, including RHEL images with LVM-based OS disks. |
   | **Storage limitations** | Data-disk LVM automation, guest OS-partition extension, and arbitrary disk resizing aren't supported. |
   | **Identity limitations** | Linux Active Directory join and Microsoft Entra join aren't supported. |
   | **New VM images** | - Select an x64 Marketplace or Azure Compute Gallery image for a supported OS, available in the selected region. <br/> - New Gallery deployments require a **Generalized** OS state; Specialized image definitions aren't supported. <br/> - VM size, image generation, and SCSI support must be compatible. |
   | **VM security type** | - **Trusted Launch:** Requires a Gen2 image supporting Trusted Launch. <br/> - **Standard:** Supports compatible Gen1 or Gen2 images. |
   | **Marketplace requirements** | Accept applicable Marketplace terms and provide publisher-required purchase-plan details. |
   | **Image validation** | Verify the publisher's OS description, architecture, generation, and security properties in the Azure portal or Azure CLI. The `osType` property alone doesn't identify the OS release. |
   | **Existing target VMs** | - Must meet the same target requirements and reside in the selected region. <br/> -  The VM might be started automatically with its system-assigned managed identity enabled. <br/> - The **Generalized** OS state requirement applies only to new Gallery deployments, not existing VM adoption. |
  
### **Requirements for scoped data copy**
- Data copy from source to target VMs requires an **Execution Agent** installed on your Windows appliance or Linux Arc-based host. The following requirements must be met for successful data copy using the **Execution Agent**.

     | **Requirement** | **Details** |
     | --- | --- |
     | **Linux permission preservation** | Requires the `acl` package on the source Linux VM. Source packages aren't installed automatically. |
     | **Execution Agent compatibility** | - **Windows appliance-based Execution Agent:** Supports Windows and Linux sources. <br/> - **Linux Arc-based Execution Agent:** Supports Linux sources only. |
     | **Shell prerequisites** | - **Windows:** PowerShell 5.1 is required on source and target VMs. <br/> - **Linux:** Bash is required on source and target VMs. <br/> - Shells must be preinstalled; the Execution Agent doesn't install them. |
     | **Network connectivity** | - Allow VMware guest access, WinRM, or SSH connectivity to the source, as applicable. <br/> - Allow required Azure connectivity, including HTTPS (port 443) to Blob staging storage. <br/> - Private staging storage requires appropriate DNS resolution and routing. |
     | **Source disk space and permissions** | - Maintain at least 1 GiB of free space on the source, plus additional space based on transfer requirements. <br/> - Source paths must be readable, and destination paths must reside on configured volumes. |
     | **Target package installation** | Linux target VMs must have access to OS package repositories when downloads are required. Target packages are installed automatically. |
     | **Data consistency** | Synchronize system clocks and quiesce applications before the final copy. Copying live files is best effort and doesn't provide application-consistent snapshots. |

 -  **Credential requirement for data copy**
  
     | **Purpose** | **Requirement** |
     | --- | --- |
     | **Source execution** | Saved account on the selected Execution Agent host with permissions for remote execution, file read/traverse, working-file creation, and permission-read access when preserving permissions. |
     | **VMware/Hyper-V** | Saved infrastructure-account reference. Not required for physical servers. |
     | **New VM administrator** | - **Windows:** Key Vault secret reference from a deployment-enabled vault. <br/> - **Linux:** SSH public key. |
     | **Windows domain join** | Secret reference in an RBAC-enabled Key Vault, Active Directory join permissions, and domain connectivity. |
     | **Data transfer authentication** | - Source uploads use an agent-issued SAS token. <br/> - Target operations use SYSTEM/root privileges and managed identity. <br/> - Storage account keys, separate target guest credentials, and inbound appliance-to-target connections aren't required. |
     | **Credential security** | Don't provide raw passwords or SAS tokens. Use saved account or secret references as applicable. |
     | **Permission preservation** | File permissions are restored as-is. User accounts and identity IDs aren't migrated or translated. |


### **Managed identity permissions requirements for Azure Catalyst project**

By using the Project MSI permissions described in the following table, the project automatically grants the required VM and staging storage access to the Execution Agent and target identity. You don't need to manually assign roles for the VM or staging storage.

   >[!IMPORTANT]
   > - Contributor access to the target resource group alone isn't sufficient. Project MSI also requires constrained role-assignment delegation at the target and staging scopes.
   > - Azure RBAC permissions don't provide network connectivity or override Azure Policy or Active Directory permissions.

 - **Least-privilege setup**: Create or validate custom roles for the enabled features, scoped to the resources used.

      | **Scope** | **Required permissions** |
      | --- | --- |
      | **Project/master site and Arc machine** | Metadata reads, execution and status operations, and Arc machine read access (when applicable). |
      | **Target resource group** | Deployment and VM/NIC/disk read/write; VM start/restart, instance view, extensions, and managed Run Command read/delete for cleanup. |
      | **Staging resource group/storage account** | Storage account creation/read, container management, and deployment operations. |
      | **Referenced VNet, subnet, and NSG** | Read access and required subnet/NSG join permissions. |
      | **Subscription and dependencies** | Name, SKU, image, and Marketplace terms lookups; selected Gallery/DES read access and user-assigned managed identity attachment. |
      | **Credential vaults** | Vault metadata read; `Microsoft.KeyVault/vaults/deploy/action` for Windows VM creation; Key Vault Secrets User delegation for domain join. |
      | **Optional monitoring and backup** | Required read permissions, VM associations/extensions, and backup protection operations. |
      | **Role-assignment delegation** | Include role-assignment read, write, and delete permissions at the staging, target VM, and applicable secret scopes. Constrain role-assignment write and delete operations to the following roles for the intended Execution Agent and target identities: <br/> <br/> - Storage Blob Data Contributor <br/> - Virtual Machine Contributor <br/> - Storage Blob Data Reader <br/> - Key Vault Secrets User (for Windows domain join). <br/> <br/> These permissions enable automatic delegated role assignments.    |
  

 - **Use existing Azure Migrate roles**: This option simplifies permission configuration but grants broader access than least-privilege custom roles.

     | **Role assigned to Project MSI** | **Scope** |
     | --- | --- |
     | **Contributor** | Target subscription |
     | **Azure Migrate Execute Expert** | Target subscription |
     | **Key Vault Data Access Administrator** | Domain-join secret or dedicated join-credential vault |

   > [!NOTE]
   > - You can use **Azure Migrate Owner** instead of **Azure Migrate Execute Expert**. You don't need both roles.
   > - For Windows domain join, grant the Azure Catalyst project managed identity permission to assign the **Key Vault Secrets User** role. By using this permission, you can automatically assign the role to the target VM's managed identity so it can access the domain-join credentials.
   > - The existing Azure Migrate roles support delegation of the required storage and VM roles, but not **Key Vault Secrets User**. Assign **Key Vault Data Access Administrator** to the project managed identity at the required secret or vault scope, unless custom role-assignment permissions are already configured. This role can also assign other Key Vault roles, so restrict its scope.
   > - Ensure that the project managed identity has the required permissions on all referenced resources, including those in other resource groups or subscriptions.
   > - Azure RBAC permissions don't replace network connectivity, Azure Policy, or Active Directory requirements. Ensure these prerequisites are also met.
  
## Configure and execute server redeploy by using migration waves
   1. To redeploy servers as Azure VMs by using migration waves, go to **Execute** > **Waves**.
   2. Open the wave, and select **Overview** > **Configure settings** > **Configure workload settings**.
   3. In the CSV file, set **Target service** to **Azure VM** and **Migration method** to **ServerMigrationRedeployWithDataCopy**.
   4. Save and upload the updated file, review the generated execution plan, and select **Start execution** to begin the redeploy execution run.
   5. Track the execution progress by using the **Execution run** page in the wave.

By default, redeploying servers to Azure VMs with data copy via Azure Catalyst includes the following steps. You can add extra steps to deploy and configure your applications on the target VM. [Learn more](configure-customize-wave.md#add-steps-if-needed)

   | Step name | Description |
   | --- |--- |
   | **1. Set up staging storage account for VM Redeploy** | This step creates the entity's staging storage account in the selected target region, or resolves its selected existing account without reconfiguring it. |
   | **2. Validate source and target prerequisites** | This step validates Execution Agent and source readiness, prepares staging containers, shares, directories, and agent access, and checks agent and source access to staging alongside the required target prerequisites. |
   | **3. Deploy target Azure VM** | This step deploys the target Azure VM using the configuration defined for the workload, including the selected compute, storage, networking, availability, security, and identity settings. |
   | **3. Configure OS and data disks** | This step configures the target VM's OS and data disks according to the defined target configuration, including the required disks, partitions, volumes, and mount points or drive letter assignments. This prepares the VM to receive the source data and applications. |
   | **4. Copy source data to staging** | This step copies the configured source directories and files to the migration staging location. This step establishes the initial staged copy of the workload data, which is then transferred to the target VM. |
   | **5. Download staged data to target VM** | This step transfers the staged source data to the configured destination disks and paths to the target VM. |
   | **6. Reapply data permissions** | This step reapplies the captured file and folder permissions, ownership, and associated user or group identities to the transferred data on the target VM. |
   | **7. Approve final data copy** | When you approve this step, it captures changes to the configured source paths since the initial transfer and brings the target data up to date. Before you approve, deploy and configure the application on the target VM. Validate application and workload compatibility and complete any required functional steps. Manually stop activity on the source VM and close any open files to prevent further data changes. |
   | **8. Final data copy** | This step performs the final synchronization of the configured source paths to capture changes made since the initial data transfer and bring the target data up to date. |
   | **9. Sign off migration** | Sign off migration to consider this VM as migrated. Before signing off, perform final validation of the target VM and your app. Complete the required cutover activities to transition the workload to the target VM and finalize the migration. This approval gate also authorizes cleanup of staging data if the **Clean up staging resources** step is present. Remove that step if you want to retain staging data and perform cleanup manually. |
   | **10. Update VM Redeploy migration status** | This step updates the migration status as completed and proceeds to clean up staging resources step if exists. |
   | **11. Clean up staging resources** | This step removes workload-specific staging data and temporary migration resources that are no longer required after a successful migration. This step is optional. You can delete this step if you want to keep the staging data on the staging storage account and manually clean up. |   

For more information about wave configuration, execution plan generation, wave execution, and progress tracking, see the following articles:
 - [Configure and customize a migration wave](configure-customize-wave.md).
 - [Execute a migration wave](execute-wave-migration.md).
 - [Track and troubleshoot wave migrations](track-wave-migrations.md).

## Related documentation
 - [Constrained role-assignment delegation](../role-based-access-control/delegate-role-assignments-overview.md).





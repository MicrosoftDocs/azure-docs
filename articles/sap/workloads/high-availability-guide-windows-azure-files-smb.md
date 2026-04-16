---
title: Install high-availability SAP NetWeaver with Azure Files SMB
description: Install high-availability SAP NetWeaver on Azure VMs on Windows with Azure Files premium SMB for SAP applications.
author: stmuelle
ms.author: stmuelle
ms.date: 04/07/2026
ms.topic: how-to
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.custom: sfi-image-nochange
# Customer intent: As an SAP system administrator, I want to install high availability for SAP NetWeaver using Azure Files premium SMB, so that I can ensure reliable and efficient access to necessary file shares and meet the required configurations for optimal performance.
---

# Install high-availability SAP NetWeaver with Azure Files SMB

This article walks you through installing a high-availability (HA) SAP NetWeaver system on Windows-based Azure virtual machines (VMs) by using Azure Files premium Server Message Block (SMB) file shares for shared storage. Azure Files premium SMB is a managed platform as a service (PaaS) option for hosting the *sapmnt*, *transport*, and *interface* directories that SAP requires.

When you deploy SAP in an HA configuration, the system needs highly available shared file storage to avoid a single point of failure. Azure Files premium SMB eliminates the need to maintain a dedicated file-server infrastructure while supporting availability-zone and disaster-recovery (DR) deployments.

This article guides you through sizing Azure Files premium SMB shares, preparing the Azure and Active Directory (AD) infrastructure, and installing the SAP NetWeaver HA system.

## Prerequisites

> [!IMPORTANT]
> The installation of SAP HA systems on Azure Files premium SMB with AD integration requires cross-team collaboration. We recommend that the following teams work together to achieve tasks:
>
> * Azure team: Set up and configure storage accounts, script execution, and AD synchronization.
> * AD team: Create user accounts and groups.
> * Basis team: Run the SAP Software Provisioning Manager (SWPM) and set access control lists (ACLs), if necessary.

- SAP servers joined to an AD domain.
- The AD domain that contains the SAP servers replicated to Microsoft Entra ID by using Microsoft Entra Connect.
- At least one AD domain controller in the Azure landscape, to avoid traversing Azure ExpressRoute to contact domain controllers on-premises.
- The Azure support team reviewed the documentation for Azure Files SMB with [AD integration](../../storage/files/storage-files-identity-auth-active-directory-enable.md#videos). The video shows extra configuration options, which were modified (DNS) and skipped (DFS-N) for simplicity. However, these configuration options are valid.
- The user who runs the Azure Files PowerShell script has permission to create objects in AD.
- SWPM version 1.0 SP32 or SWPM 2.0 SP09 or later. The SAPinst patch must be 749.0.91 or later.
- An up-to-date release of PowerShell installed on the Windows Server instance where you run the script.
- Clustering SAP ASCS/SCS instances by using a file share is supported for SAP systems with SAP Kernel 7.22 (and later). For details, see SAP Note [2698948](https://launchpad.support.sap.com/#/notes/2698948).

## Size and distribute Azure Files premium SMB shares

Evaluate the following points when you're planning the deployment of Azure Files premium SMB:

* You can create the *sapmnt* file share name once per storage account. You can also create extra security IDs (SIDs) as directories on the same */sapmnt* share, such as */sapmnt/\<SID1\>* and */sapmnt/\<SID2\>*.
* Choose an appropriate size, IOPS, and throughput. A suggested size for the share is 256 GB per SID. The maximum size for a share is 5,120 GB.
* Azure Files premium SMB might not perform as desired with extra large *sapmnt* shares with more than 1 million files per storage account. Customers who have millions of batch jobs that create millions of job log files should regularly reorganize them, as described in SAP Note [16083][16083]. If needed, you can move or archive old job logs to another Azure Files premium SMB file share. If you expect *sapmnt* to be extra large, consider other options (such as Azure NetApp Files).
* We recommend that you use a private network endpoint.
* Avoid putting too many SIDs in a single storage account and its file share.
* As general guidance, don't combine more than four nonproduction SIDs.
* Don't put the entire development, production, and quality assurance system (QAS) landscape in one storage account or file share. Failure of the share leads to downtime of the entire SAP landscape.
* We recommend that you put the *sapmnt* and *transport* directories on different storage accounts, except in smaller systems. During the installation of the SAP primary application server, SAPinst requests the *transport* host name. Enter the FQDN of a different storage account as *<storage_account>.file.core.windows.net*.
* Don't put the file system used for interfaces onto the same storage account as */sapmnt/\<SID>*.
* You must add the SAP users and groups to the *sapmnt* share. Set the Storage File Data SMB Share Elevated Contributor permission for them in the Azure portal.

Distributing *transport*, *interface*, and *sapmnt* among separate storage accounts improves throughput and resiliency. It also simplifies performance analysis. Combining many SIDs and other file systems in one storage account makes it difficult to identify which SID or application is causing throughput issues.

## Install the SAP system

### Create users and groups

The AD administrator should create, in advance, three domain users with Local Administrator rights and one global group in the local Windows Server AD instance.

`SAPCONT_ADMIN@SAPCONTOSO.local` has Domain Administrator rights and is used to run *SAPinst*, *\<sid>adm*, and *SAPService\<SID>* as SAP system users and the *SAP_\<SAPSID>_GlobalAdmin* group. The SAP Installation Guide contains the specific details required for these accounts.

> [!NOTE]
> SAP user accounts shouldn't be Domain Administrator. We recommend that you don't use *\<sid>adm* to run SAPinst.

### Check Synchronization Service Manager

The AD administrator or Azure administrator should check Synchronization Service Manager in Microsoft Entra Connect. By default, it takes about 30 minutes to replicate to Microsoft Entra ID.

### Create a storage account, private endpoint, and file share

The Azure administrator should complete the following tasks:

1. On the **Basics** tab, create a storage account with either premium zone-redundant storage (ZRS) or locally redundant storage (LRS). Customers with zonal deployment should choose ZRS. Here, the administrator chooses between a **Standard** or **Premium** account.

   ![Screenshot of the Azure portal that shows basic information for creating a storage account.](media/virtual-machines-shared-sap-high-availability-guide/create-storage-account-1.png)

   > [!IMPORTANT]
   > For production use, we recommend choosing a **Premium** account. For non-production use, a **Standard** account should be sufficient.

1. On the **Advanced** tab, the default settings should be OK.

   ![Screenshot of the Azure portal that shows advanced information for creating a storage account.](media/virtual-machines-shared-sap-high-availability-guide/create-storage-account-2.png)

1. On the **Networking** tab, the administrator decides whether to use a private endpoint.

   ![Screenshot of the Azure portal that shows networking information for creating a storage account.](media/virtual-machines-shared-sap-high-availability-guide/create-sa-4.png)

   1. Select **Add private endpoint** for the storage account, and then enter the information for creating a private endpoint.

      ![Screenshot of the Azure portal that shows options for private endpoint definition.](media/virtual-machines-shared-sap-high-availability-guide/create-sa-3.png)

   1. If necessary, add a DNS A record into Windows DNS for `<storage_account_name>.file.core.windows.net`. The record might need to be in a new DNS zone. Discuss with your DNS administrator. The new zone shouldn't update outside an organization.

      ![Screenshot of DNS Manager that shows private endpoint DNS definition.](media/virtual-machines-shared-sap-high-availability-guide/pe-dns-1.png)

1. Create the *sapmnt* file share with an appropriate size. The suggested size is 256 GB, which delivers 650 IOPS, 75-MB/sec egress, and 50-MB/sec ingress.

   ![Screenshot of the Azure portal that shows SMB share definition.](media/virtual-machines-shared-sap-high-availability-guide/create-sa-5.png)

1. Download the [Azure Files GitHub](../../storage/files/storage-files-identity-ad-ds-enable.md#download-azfileshybrid-module) content and run the [script](../../storage/files/storage-files-identity-ad-ds-enable.md#run-join-azstorageaccount).

   This script creates either a computer account or a service account in AD. It has the following requirements:

   * The user who's running the script must have permission to create objects in the AD domain that contains the SAP servers. Typically, an organization uses a Domain Administrator account such as `SAPCONT_ADMIN@SAPCONTOSO.local`.
   * Before the user runs the script, confirm that this AD domain user account is synchronized with Microsoft Entra ID. An example would be to open the Azure portal and go to Microsoft Entra users, check that the user `SAPCONT_ADMIN@SAPCONTOSO.local` exists, and verify the Microsoft Entra user account.
   * Grant the **Contributor** role to this Microsoft Entra user account for the resource group that contains the storage account that holds the file share. In this example, the **Contributor** role to the respective resource group is granted to the user `SAPCONT_ADMIN@SAPCONTOSO.onmicrosoft.com`.
   * Run the script while signed in to a Windows Server instance with an AD domain user account that has the permissions described earlier.

   In this example scenario, the AD administrator would sign in to the Windows Server instance as `SAPCONT_ADMIN@SAPCONTOSO.local`. When the administrator uses the PowerShell command `Connect-AzAccount`, the administrator connects as user `SAPCONT_ADMIN@SAPCONTOSO.onmicrosoft.com`. Ideally, the AD administrator and the Azure administrator should work together on this task.

   ![Screenshot of the PowerShell script that creates a local Active Directory account.](media/virtual-machines-shared-sap-high-availability-guide/ps-script-1.png)

   ![Screenshot of the Azure portal after successful PowerShell script execution.](media/virtual-machines-shared-sap-high-availability-guide/smb-config-1.png)

   > [!IMPORTANT]
   > When a user runs the PowerShell script command `Connect-AzAccount`, we recommend entering the Microsoft Entra user account that corresponds to the AD domain user account used to sign in to a Windows Server instance.

   After the script runs successfully, go to **Storage** > **File Shares** and verify that **Active Directory: Configured** appears.

1. Assign SAP users *\<sid>adm* and *SAPService\<SID>*, and the *SAP_\<SAPSID>_GlobalAdmin* group, to the Azure Files premium SMB file share. Select the role **Storage File Data SMB Share Elevated Contributor** in the Azure portal.

1. Check the ACL on the *sapmnt* file share after the installation. Then add the *DOMAIN\CLUSTER_NAME$* account, *DOMAIN\\\<sid>adm* account, *DOMAIN\SAPService\<SID>* account, and *SAP_\<SID>_GlobalAdmin* group. These accounts and group should have full control of the *sapmnt* directory.

   > [!IMPORTANT]
   > Complete this step before the SAPinst installation. It's difficult or impossible to change ACLs after SAPinst creates directories and files on the file share.

   The following screenshots show how to add computer accounts.

   ![Screenshot of Windows Server that shows adding the cluster name to the local Active Directory instance.](media/virtual-machines-shared-sap-high-availability-guide/add-computer-account-2.png)

   You can find the *DOMAIN\CLUSTER_NAME$* account by selecting **Computers** under **Object types**.

   ![Screenshot of selecting an object type for an Active Directory computer account.](media/virtual-machines-shared-sap-high-availability-guide/add-computer-account-3.png)

   ![Screenshot of options for the computer object type.](media/virtual-machines-shared-sap-high-availability-guide/add-computer-account-4.png)

   ![Screenshot of computer account access properties.](media/virtual-machines-shared-sap-high-availability-guide/add-computer-account-5.png)

1. If necessary, move the computer account created for Azure Files to an AD container that doesn't have account expiration. The name of the computer account is the short name of the storage account.

   > [!IMPORTANT]
   > To initialize the Windows ACL for the SMB share, mount the share once to a drive letter.

   The storage key is the password, and the user is *Azure\\\<SMB share name>*.

   ![Windows screenshot of the one-time mount of the SMB share.](media/virtual-machines-shared-sap-high-availability-guide/one-time-net-use-mount-1.png)

### Complete SAP Basis tasks

An SAP Basis administrator should complete these tasks:

1. [Install the Windows cluster on ASCS/ERS nodes and add the cloud witness](sap-high-availability-infrastructure-wsfc-shared-disk.md#install-and-configure-windows-failover-cluster).

1. The first cluster node installation asks for the Azure Files SMB storage account name. Enter the FQDN `<storage_account_name>.file.core.windows.net`. If SAPinst doesn't accept more than 13 characters, the SWPM version is too old.

1. [Modify the SAP profile of the ASCS/SCS instance](sap-high-availability-installation-wsfc-shared-disk.md#add-a-probe-port).

1. [Update the probe port for the SAP \<SID> role in Windows Server Failover Cluster](sap-high-availability-installation-wsfc-shared-disk.md#add-a-probe-port).

1. Continue with SWPM installation for the second ASCS/ERS node. SWPM requires only the path of the profile directory. Enter the full UNC path to the profile directory.

1. Enter the UNC profile path for the database and for the installation of the primary application server (PAS) and additional application server (AAS).

1. The PAS installation asks for the *transport* host name. Provide the FQDN of a separate storage account name for the *transport* directory.

1. Verify the ACLs on the SID and *transport* directory.

## Set up disaster recovery

Azure Files premium SMB supports disaster recovery scenarios and cross-region replication scenarios. All data in Azure Files premium SMB directories can be continuously synchronized to a DR region's storage account. For more information, see the procedure for synchronizing files in [Transfer data with AzCopy and file storage](../../storage/common/storage-use-azcopy-files.md#synchronize-files).

After a DR event and failover of the ASCS instance to the DR region, change the `SAPGLOBALHOST` profile parameter to point to Azure Files SMB in the DR region. Perform the same preparation steps on the DR storage account to join the storage account to AD and assign RBAC roles for SAP users and groups.

## Troubleshoot the configuration

The PowerShell scripts that you downloaded earlier contain a debug script to conduct basic checks for validating the configuration.

```azurepowershell
Debug-AzStorageAccountAuth -StorageAccountName $StorageAccountName -ResourceGroupName $ResourceGroupName -Verbose
```

Here's a PowerShell screenshot of the debug script output.

![Screenshot of the PowerShell script to validate configuration.](media/virtual-machines-shared-sap-high-availability-guide/smb-share-validation-2.png)

The following screenshot shows the technical information to validate a successful domain join.

![Screenshot of the PowerShell script to retrieve technical info.](media/virtual-machines-shared-sap-high-availability-guide/smb-share-validation-1.png)

## Configure optional settings

The following diagrams show multiple SAP instances on Azure VMs running Windows Server Failover Cluster to reduce the total number of VMs.

This configuration can be either local SAP application servers on an SAP ASCS/SCS cluster or an SAP ASCS/SCS cluster role on Microsoft SQL Server Always On nodes.

> [!IMPORTANT]
> Installing a local SAP application server on a SQL Server Always On node isn't supported.

Both SAP ASCS/SCS and the Microsoft SQL Server database are single points of failure (SPOFs). Using Azure Files SMB helps protect these SPOFs in a Windows environment.

Although the resource consumption of the SAP ASCS/SCS is fairly small, we recommend reducing the memory configuration by 2 GB for either SQL Server or the SAP application server.

### SAP application servers on Windows Server Failover Cluster nodes using Azure Files SMB

The following diagram shows SAP application servers locally installed.

![Diagram of a high-availability setup with additional application servers.](media/virtual-machines-shared-sap-high-availability-guide/ha-azure-files-smb-as.png)

> [!NOTE]
> The diagram shows the use of extra local disks. This setup is optional for customers who don't install application software on the OS drive (**C:**).

### SAP ASCS/SCS on SQL Server Always-on nodes using Azure Files SMB

The following diagram shows Azure Files SMB with local SQL Server setup.

> [!IMPORTANT]
> Using Azure Files SMB for any SQL Server volume isn't supported.

![Diagram of SAP ASCS/SCS on SQL Server Always On nodes using Azure.](media/virtual-machines-shared-sap-high-availability-guide/ha-sql-ascs-azure-files-smb.png)

> [!NOTE]
> The diagram shows the use of extra local disks. This setup is optional for customers who don't install application software on the OS drive (**C:**).

## Related content

- [SAP Note 2273806](https://launchpad.support.sap.com/#/notes/2273806) (SAP support for solutions related to storage or file systems)
- [Install SAP NetWeaver high availability on a Windows failover cluster and file share for SAP ASCS/SCS instances on Azure](./sap-high-availability-installation-wsfc-file-share.md)
- [Azure Virtual Machines high-availability architecture and scenarios for SAP NetWeaver](./sap-high-availability-architecture-scenarios.md)
- [Add a probe port in an ASCS cluster configuration](sap-high-availability-installation-wsfc-file-share.md)

[16083]:https://launchpad.support.sap.com/#/notes/16083

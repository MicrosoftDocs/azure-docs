---
title: Set up disaster recovery of VMware VMs or physical servers to a secondary site with Azure Site Recovery | Microsoft Docs
description: Learn how to set up disaster recovery of VMware VMs, or Windows and Linux physical servers, to a secondary site with Azure Site Recovery.
services: site-recovery
author: nsoneji
manager: gauarvd
ms.service: site-recovery
ms.workload: backup-recovery
ms.tgt_pltfrm: na
ms.topic: article
ms.date: 08/01/2018
ms.author: raynew

---
# Set up disaster recovery of on-premises VMware virtual machines or physical servers to a secondary site

InMage Scout in [Azure Site Recovery](site-recovery-overview.md) provides real-time replication between on-premises VMware sites. InMage Scout is included in Azure Site Recovery service subscriptions.

## End-of-support announcement

The Azure Site Recovery scenario for replication between on-premises VMware or physical datacenters is reaching end-of-support.

-	From August 2018, the scenario can’t be configured in the Recovery Services vault, and the  InMage Scout software can’t be downloaded from the vault. Existing deployments will be supported. 
-	From December 31 2020, the scenario won’t be supported.
- Existing partners can onboard new customers to the scenario until support ends.

During 2018 and 2019, two updates will be released: 

-	Update 7: Fixes network configuration and compliance issues, and provides TLS 1.2 support.
-	Update 8: Adds support for Linux operating systems RHEL/CentOS 7.3/7.4/7.5, and for SUSE 12

After Update 8, no further updates will be released. There will be limited hotfix support for the operating systems added in Update 8, and bug fixes based on best effort.

Azure Site Recovery continues to innovate by providing VMware and Hyper-V customers a seamless and best-in-class DRaaS solution with Azure as a disaster recovery site. Microsoft recommends that existing InMage / ASR Scout customers consider using Azure Site Recovery’s VMware to Azure scenario for their business continuity needs. Azure Site Recovery's VMware to Azure scenario is an enterprise-class DR solution for VMware applications, which offers RPO and RTO of minutes, support for multi-VM application replication and recovery, seamless onboarding, comprehensive monitoring, and significant TCO advantage.

### Scenario migration
As an alternative, we recommend setting up disaster recovery for on-premises VMware VMs and physical machines by replicating them to Azure. Do this as follows:

1.	Review the quick comparison below. Before you can replicate on-premises machines, you need check that they meet [requirements](./vmware-physical-azure-support-matrix.md#replicated-machines) for replication to Azure. If you’re replicating VMware VMs, we recommend that you review [capacity planning guidelines](./site-recovery-plan-capacity-vmware.md), and run the [Deployment Planner tool](./site-recovery-deployment-planner.md) to identity capacity requirements, and verify compliance.
2.	After running the Deployment Planner, you can set up replication:
o	For VMware VMs, follow these tutorials to [prepare Azure](./tutorial-prepare-azure.md), [prepare your on-premises VMware environment](./vmware-azure-tutorial-prepare-on-premises.md), and [set up disaster recovery](./vmware-azure-tutorial-prepare-on-premises.md).
o	For physical machines, follow this [tutorial](./physical-azure-disaster-recovery.md).
3.	After machines are replicating to Azure, you can run a [disaster recovery drill](./site-recovery-test-failover-to-azure.md) to make sure everything’s working as expected.

### Quick comparison

**Feature** | **Replication to Azure** |**Replication between VMware datacenters**
--|--|--
**Required components** |Mobility service on replicated machines. On-premises configuration server, process server, master target server.Temporary process server in Azure for failback.|Mobility service, Process Server, Configuration Server and Master Target
**Configuration and orchestration** |Recovery Services vault in the Azure portal | Using vContinuum 
**Replicated**|Disk (Windows and Linux) |Volume-Windows<br> Disk-Linux
**Shared disk cluster**|Not supported|Supported
**Data churn limits (average)** |10 MB/s data per disk<br> 25MB/s data per VM<br> [Learn more](./site-recovery-vmware-deployment-planner-analyze-report.md#azure-site-recovery-limits) | > 10 MB/s data per disk  <br> > 25 MB/s data per VM
**Monitoring** |From Azure portal|From CX (Configuration Server)
**Support Matrix**| [Click here for details](./vmware-physical-azure-support-matrix.md)|[Download ASR Scout compatible matrix](https://aka.ms/asr-scout-cm)


## Prerequisites
To complete this tutorial:

- [Review](vmware-physical-secondary-support-matrix.md) the support requirements for all components.
- Make sure that the machines you want to replicate comply with [replicated machine support](vmware-physical-secondary-support-matrix.md#replicated-vm-support).


## Create a vault

[!INCLUDE [site-recovery-create-vault](../../includes/site-recovery-create-vault.md)]

## Choose a protection goal

Select what to replicate, and where to replicate it to.

1. Click **Site Recovery** > **Prepare Infrastructure** > **Protection goal**.
2. Select **To recovery site** > **Yes, with VMware vSphere Hypervisor**. Then click **OK**.
3. In **Scout Setup**, download the InMage Scout 8.0.1 GA software, and the registration key. The setup files for all components are included in the downloaded .zip file.

## Download and install component updates

 Review and install the latest [updates](#updates). Updates should be installed on servers in the following order:

1. RX server (if applicable)
2. Configuration servers
3. Process servers
4. Master Target servers
5. vContinuum servers
6. Source server (both Windows and Linux Servers)

Install the updates as follows:

> [!NOTE]
>All Scout components' file update version may not be the same in the update .zip file. The older version indicate that there is no change in the component since previous update to this update.

Download the [update](https://aka.ms/asr-scout-update6) .zip file. The file contains the following components: 
  - RX_8.0.4.0_GA_Update_4_8725872_16Sep16.tar.gz
  - CX_Windows_8.0.6.0_GA_Update_6_13746667_18Sep17.exe
  - UA_Windows_8.0.5.0_GA_Update_5_11525802_20Apr17.exe
  - UA_RHEL6-64_8.0.4.0_GA_Update_4_9035261_26Sep16.tar.gz
  - vCon_Windows_8.0.6.0_GA_Update_6_11525767_21Sep17.exe
  - UA update4 bits for RHEL5, OL5, OL6, SUSE 10, SUSE 11: UA_<Linux OS>_8.0.4.0_GA_Update_4_9035261_26Sep16.tar.gz
1. Extract the .zip files.
2. **RX server**: Copy **RX_8.0.4.0_GA_Update_4_8725872_16Sep16.tar.gz** to the RX server, and extract it. In the extracted folder, run **/Install**.
3. **Configuration server and process server**: Copy **CX_Windows_8.0.6.0_GA_Update_6_13746667_18Sep17.exe** to the configuration server and process server. Double-click to run it.<br>
4. **Windows Master Target server**: To update the unified agent, copy **UA_Windows_8.0.5.0_GA_Update_5_11525802_20Apr17.exe** to the server. Double-click it to run it. The same unified agent update is also applicable for the source server. If source hasn't been updated to Update 4, you should update the unified agent.
  The update does not need to apply on the Master target prepared with **InMage_Scout_vContinuum_MT_8.0.1.0_Windows_GA_10Oct2017_release.exe**  as this is new GA installer with all the latest changes.
5. **vContinuum server**:  Copy **vCon_Windows_8.0.6.0_GA_Update_6_11525767_21Sep17.exe** to the server.  Make sure that you've closed the vContinuum wizard. Double-click on the file to run it.
	The update does not need to apply on the Master Target prepared with **InMage_Scout_vContinuum_MT_8.0.1.0_Windows_GA_10Oct2017_release.exe** as this is new GA installer with all the latest changes.
6. **Linux master target server**: To update the unified agent, copy **UA_RHEL6-64_8.0.4.0_GA_Update_4_9035261_26Sep16.tar.gz** to the master target server and extract it. In the extracted folder, run **/Install**.
7. **Windows source server**: To update the unified agent, copy **UA_Windows_8.0.5.0_GA_Update_5_11525802_20Apr17.exe** to the source server. Double-click on the file to run it. 
	You don't need to install the Update 5 agent on the source server if it has already been updated to Update 4 or source agent is installed with latest base installer **InMage_UA_8.0.1.0_Windows_GA_28Sep2017_release.exe**.
8. **Linux source server**: To update the unified agent, copy the corresponding version of the unified agent file to the Linux server, and extract it. In the extracted folder, run **/Install**.  Example: For RHEL 6.7 64-bit server, copy **UA_RHEL6-64_8.0.4.0_GA_Update_4_9035261_26Sep16.tar.gz** to the server, and extract it. In the extracted folder, run **/Install**.

## Enable replication

1. Set up replication between the source and target VMware sites.
2. Refer to following documents to learn more about installation, protection, and recovery:

   * [Release notes](https://aka.ms/asr-scout-release-notes)
   * [Compatibility matrix](https://aka.ms/asr-scout-cm)
   * [User guide](https://aka.ms/asr-scout-user-guide)
   * [RX user guide](https://aka.ms/asr-scout-rx-user-guide)
   * [Quick installation guide](https://aka.ms/asr-scout-quick-install-guide)

## Updates

### Site Recovery Scout 8.0.1 Update 6 
Updated: October 12, 2017

Download [Scout update 6](https://aka.ms/asr-scout-update6).

Scout Update 6 is a cumulative update. It contains all fixes from Update 1 to Update 5 plus  the new fixes and enhancements described below. 

#### New platform support
* Support has been added for Source Windows Server 2016
* Support has been added for following  Linux operating systems:
    - Red Hat Enterprise Linux (RHEL) 6.9
    - CentOS 6.9
    - Oracle Linux 5.11
    - Oracle Linux 6.8
* Support has been added for VMware Center 6.5

> [!NOTE]
> * Base Unified Agent(UA) installer for Windows has been refreshed to support Windows Server 2016. The new installer **InMage_UA_8.0.1.0_Windows_GA_28Sep2017_release.exe** is packaged with the base Scout GA package (**InMage_Scout_Standard_8.0.1 GA-Oct17.zip**). The same installer will be used for all supported Windows version. 
> * Base Windows vContinuum & Master Target installer has been refreshed to support Windows Server 2016. The new installer **InMage_Scout_vContinuum_MT_8.0.1.0_Windows_GA_10Oct2017_release.exe** is packaged with the base Scout GA package (**InMage_Scout_Standard_8.0.1 GA-Oct17.zip**). The same installer will be used to deploy Windows 2016 Master Target and Windows 2012R2 Master Target.
> * Download the GA package from the portal, as described in [create a vault](#create-a-vault).
>

#### Bug fixes and enhancements
- Failback protection fails for Linux VM with list of disks to be replicated is empty at the end of config.

### Site Recovery Scout 8.0.1 Update 5
Scout Update 5 is a cumulative update. It contains all fixes from Update 1 to Update 4, and the new fixes described below.
- Fixes from Site Recovery Scout Update 4 to Update 5 are specifically for the master target and vContinuum components.
- If source servers, the master target, configuration, process, and RX servers are already running Update 4, then apply it only on the master target server. 

#### New platform support
* SUSE Linux Enterprise Server 11 Service Pack 4(SP4)
* SLES 11 SP4 64 bit  **InMage_UA_8.0.1.0_SLES11-SP4-64_GA_13Apr2017_release.tar.gz** is packaged with the base Scout GA package (**InMage_Scout_Standard_8.0.1 GA.zip**). Download the GA package from the portal, as described in [create a vault](#create-a-vault).


#### Bug fixes and enhancements

* Fixes for increased Windows cluster support reliability:
	* Fixed- Some of the P2V MSCS cluster disks become RAW after recovery.
	* Fixed- P2V MSCS cluster recovery fails due to a disk order mismatch.
	* Fixed- The MSCS cluster operation to add disks fails with a disk size mismatch error.
	* Fixed- The readiness check for the source MSCS cluster with RDM LUNs mapping fails in size verification.
	* Fixed- Single node cluster protection fails because of a SCSI mismatch issue. 
	* Fixed- Re-protection of the P2V Windows cluster server fails if target cluster disks are present. 
	
* Fixed: During failback protection, if the selected master target server isn't on the same ESXi server as the protected source machine (during forward protection), then vContinuum picks up the wrong master target server during failback recovery, and the recovery operation fails.

> [!NOTE]
> * The P2V cluster fixes are applicable only to physical MSCS clusters that are newly protected with Site Recovery Scout Update 5. To install the cluster fixes on protected P2V MSCS clusters with older updates, follow the upgrade steps mentioned in section 12 of the [Site Recovery Scout Release Notes](https://aka.ms/asr-scout-release-notes).
> * if at the time of re-protection, the same set of disks are active on each of the cluster nodes as they were when initially protected, then re-protection of a physical MSCS cluster can only reuse existing target disks. If not, then use the manual steps in section 12 of [Site Recovery Scout Release Notes](https://aka.ms/asr-scout-release-notes), to  move the target side disks to the correct datastore path, for reuse during re-protection. If you reprotect the MSCS cluster in P2V mode without following the upgrade steps, it creates a new disk on the target ESXi server. You will need to manually delete the old disks from the datastore.
> * When a source SLES11 or SLES11 (with any service pack) server is rebooted gracefully, then manually mark the **root** disk replication pairs for re-synchronization. There's no notification in the CX interface. If you don't mark the root disk for resynchronization, you might notice data integrity issues.


### Azure Site Recovery Scout 8.0.1 Update 4
Scout Update 4 is a cumulative update. It includes all fixes from Update 1 to Update 3, and the new fixes described below.

#### New platform support

* Support has been added for vCenter/vSphere 6.0, 6.1 and 6.2
* Support has been added for these Linux operating systems:
  * Red Hat Enterprise Linux (RHEL) 7.0, 7.1 and 7.2
  * CentOS 7.0, 7.1 and 7.2
  * Red Hat Enterprise Linux (RHEL) 6.8
  * CentOS 6.8

> [!NOTE]
> RHEL/CentOS 7 64 bit  **InMage_UA_8.0.1.0_RHEL7-64_GA_06Oct2016_release.tar.gz** is packaged with the base Scout GA package **InMage_Scout_Standard_8.0.1 GA.zip**. Download the Scout GA package from the portal as described in [create a vault](#create-a-vault).

#### Bug fixes and enhancements

* Improved shutdown handling for the following Linux operating systems and clones, to prevent unwanted resynchronization issues:
	* Red Hat Enterprise Linux (RHEL) 6.x
	* Oracle Linux (OL) 6.x
* For Linux, all folder access permissions in the unified agent installation directory are now restricted to the local user only.
* On Windows, a fix for a timing out issue that occurred when issuing common distributed consistency bookmarks, on heavily loaded distributed applications such as SQL Server and Share Point clusters.
* A log related fix in the configuration server base installer.
* A download link to VMware vCLI 6.0  was added to the Windows master target base installer.
* Additional checks and logs were added, for network configuration changes during failover and disaster recovery drills.
* A fix for an issue that caused retention information not to be reported to the configuration server.  
* For physical clusters, a fix for an issue that caused volume resizing to fail in the vContinuum wizard, when shrinking the source volume.
* A fix for a cluster protection issue that failed with error: "Failed to find the disk signature", when the cluster disk is a PRDM disk.
* A fix for a cxps transport server crash, caused by an out-of-range exception.
* Server name and IP address columns are now resizable in the **Push Installation** page of the vContinuum wizard.
* RX API enhancements:
  * The five latest available common consistency points now available (only guaranteed tags).
  * Capacity and free space details are displayed for all protected devices.
  * Scout driver state on the source server is available.

> [!NOTE]
> * **InMage_Scout_Standard_8.0.1_GA.zip** base package has:
	* An updated configuration server base installer (**InMage_CX_8.0.1.0_Windows_GA_26Feb2015_release.exe**)
	* A Windows master target base installer (**InMage_Scout_vContinuum_MT_8.0.1.0_Windows_GA_26Feb2015_release.exe**).
	* For all new installations, use the new configuration server and Windows master target GA bits.
> * Update 4 can be applied directly on 8.0.1 GA.
> * The configuration server and RX updates can’t be rolled back after they've been applied.


### Azure Site Recovery Scout 8.0.1 Update 3

All Site Recovery updates are cumulative. Update 3 contains all fixes from Update 1 and Update 2. Update 3 can be directly applied on 8.0.1 GA. The configuration server and RX updates can’t be rolled back after they've been applied.

#### Bug fixes and enhancements
Update 3 fixes the following issues:

* The configuration server and RX aren't registered in the vault when they're behind the proxy.
* The number of hours in which the recovery point objective (RPO) wasn't reached is not updated in the health report.
* The configuration server isn't syncing with RX when the ESX hardware details, or network details, contain any UTF-8 characters.
* Windows Server 2008 R2 domain controllers don't start after recovery.
* Offline synchronization isn't working as expected.
* After VM failover, replication-pair deletion doesn't progress in the configuration server console for a long time. Users can't complete the failback or resume operations.
* Overall snapshot operations by the consistency job have been optimized, to help reduce application disconnects such as SQL Server clients.
* Consistency tool (VACP.exe) performance has been improved. Memory usage required for creating snapshots on Windows has been reduced.
* The push install service crashes when the password is larger than 16 characters.
* vContinuum doesn't check and prompt for new vCenter credentials, when credentials are modified.
* On Linux, the master target cache manager (cachemgr) isn't downloading files from the process server. This results in replication pair throttling.
* When the physical failover cluster (MSCS) disk order isn't the same on all nodes, replication isn't set for some of the cluster volumes. The cluster must be reprotected to take advantage of this fix.  
* SMTP functionality isn't working as expected, after RX is upgraded from Scout 7.1 to Scout 8.0.1.
* More statistics have been added in the log for the rollback operation, to track the time taken to complete it.
* Support has been added for Linux operating systems on the source server:
  * Red Hat Enterprise Linux (RHEL) 6 update 7
  * CentOS 6 update 7
* The configuration server and RX consoles now show notifications for the pair, which goes into bitmap mode.
* The following security fixes have been added in RX:
	* Authorization bypass via parameter tampering: Restricted access to non-applicable users.
	* Cross-site request forgery: The page-token concept was implemented, and it generates randomly for every page. This means there's only a single sign-in instance for the same user, and page refresh doesn't work. Instead, it redirects to the dashboard.
	* Malicious file upload: Files are restricted to specific extensions: z, aiff, asf, avi, bmp, csv, doc, docx, fla, flv, gif, gz, gzip, jpeg, jpg, log, mid, mov, mp3, mp4, mpc, mpeg, mpg, ods, odt, pdf, png, ppt, pptx, pxd, qt, ram, rar, rm, rmi, rmvb, rtf, sdc, sitd, swf, sxc, sxw, tar, tgz, tif, tiff, txt, vsd, wav, wma, wmv, xls, xlsx, xml, and zip.
	* Persistent cross-site scripting: Input validations were added.

### Azure Site Recovery Scout 8.0.1 Update 2 (Update 03Dec15)

Fixes in Update 2 include:

* **Configuration server**: Issues that prevented the 31-day free metering feature from working as expected, when the configuration server was registered to Azure Site Recovery vault.
* **Unified agent**: Fix for an issue in Update 1 that resulted in the update not being installed on the master target server, during upgrade from version 8.0 to 8.0.1.

### Azure Site Recovery Scout 8.0.1 Update 1
Update 1 includes the following bug fixes and new features:

* 31 days of free protection per server instance. This enables you to test functionality, or set up a proof-of-concept.
* All operations on the server, including failover and failback, are free for the first 31 days. The time starts when a server is first protected with Site Recovery Scout. From the 32nd day, each protected server is charged at the standard instance rate for Site Recovery protection to a customer-owned site.
* At any time, the number of protected servers currently being charged is available on the **Dashboard** in the vault.
* Support was added for vSphere Command-Line Interface (vCLI) 5.5 Update 2.
* Support was added for these Linux operating systems on the source server:
	* RHEL 6 Update 6
	* RHEL 5 Update 11
	* CentOS 6 Update 6
	* CentOS 5 Update 11
* Bug fixes to address the following issues:
  * Vault registration fails for the configuration server, or RX server.
  * Cluster volumes don't appear as expected when clustered VMs are reprotected as they resume.
  * Failback fails when the master target server is hosted on a different ESXi server from the on-premises production VMs.
  * Configuration file permissions are changed when you upgrade to 8.0.1. This change affects protection and operations.
  * The resynchronization threshold isn't enforced as expected, causing inconsistent replication behavior.
  * The RPO settings don't appear correctly in the configuration server console. The uncompressed data value incorrectly shows the compressed value.
  * The Remove operation doesn't delete as expected in the vContinuum wizard, and replication isn't deleted from the configuration server console.
  * In the vContinuum wizard, the disk is automatically unselected when you click **Details** in the disk view, during protection of MSCS VMs.
  * In the physical-to-virtual (P2V) scenario, required HP services (such as CIMnotify and CqMgHost) aren't moved to manual in VM recovery. This issue results in additional boot time.
  * Linux VM protection fails when there are more than 26 disks on the master target server.


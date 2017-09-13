---
title: Set up disaster recovery of VMware VMs or physical servers to a secondary site with Azure Site Recovery | Microsoft Docs
description: Learn how to set up disaster recovery of VMware VMs or Windows/Linux physical servers to a secondary site with Azure Site Recovery.
services: site-recovery
documentationcenter: ''
author: nsoneji
manager: jwhit
editor: ''

ms.assetid: 68616d15-398c-4f40-8323-17b6ae1e65c0
ms.service: site-recovery
ms.workload: backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/13/2017
ms.author: raynew

---
# Set up disaster recovery of on-premises VMware virtual machines or physical servers to a secondary site

InMage Scout in [Azure Site Recovery](site-recovery-overview.md) provides real-time replication between on-premises VMware sites. InMage Scout is included in Azure Site Recovery service subscriptions. 


## Prerequisites

To complete this tutorial:

- [Review](site-recovery-support-matrix-to-sec-site.md) the support requirements for all components.
- Make sure that the machines you want to replicate comply with [replicated machine support](site-recovery-support-matrix-to-sec-site.md#support-for-replicated-machine-os-versions).


## Create a vault

[!INCLUDE [site-recovery-create-vault](../../includes/site-recovery-create-vault.md)]

## Choose a protection goal

Select what to replicate, and where to replicate it to.

1. Click **Site Recovery** > **Prepare Infrastructure** > **Protection goal**.
2. Select **To recovery site**, and select **Yes, with VMware vSphere Hypervisor**. Then click **OK**.
3. In **Scout Setup**, download InMage Scout 8.0.1 GA software and registration key. The setup files for all of the required components are in the downloaded .zip file.

## Install component updates

 Review and install the latest [updates](#updates). Updates should be installed on servers in the following order:

1. RX server if there is one
2. Configuration servers
3. Process servers
4. Master target servers
5. vContinuum servers
6. Source server (both Windows and Linux Server)

To install the updates:

1. Download the [update](https://aka.ms/asr-scout-update5) .zip file. This .zip file contains the following files:

   * RX_8.0.4.0_GA_Update_4_8725872_16Sep16.tar.gz
   * CX_Windows_8.0.4.0_GA_Update_4_8725865_14Sep16.exe
   * UA_Windows_8.0.5.0_GA_Update_5_11525802_20Apr17.exe
   * UA_RHEL6-64_8.0.4.0_GA_Update_4_9035261_26Sep16.tar.gz
   * vCon_Windows_8.0.5.0_GA_Update_5_11525767_20Apr17.exe
   * UA update4 bits for RHEL5, OL5, OL6, SUSE 10, SUSE 11: UA_<Linux OS>_8.0.4.0_GA_Update_4_9035261_26Sep16.tar.gz
2. Extract the .zip files.
3. **For the RX server**: Copy **RX_8.0.4.0_GA_Update_4_8725872_16Sep16.tar.gz** to the RX server and extract it. In the extracted folder, run **/Install**.<br>
4. **For the configuration server/process server**: Copy **CX_Windows_8.0.4.0_GA_Update_4_8725865_14Sep16.exe** to the configuration server and process server. Double-click to run it.<br>
5. **For the Windows master target server**: To update the unified agent, copy **UA_Windows_8.0.5.0_GA_Update_5_11525802_20Apr17.exe** to the master target server. Double-click it to run it. Note that the unified agent is also applicable to the source server if source is not updated till Update4. You should install it on the source server as well, as mentioned later in this list.<br>
6. **For the vContinuum server**:  Copy **vCon_Windows_8.0.5.0_GA_Update_5_11525767_20Apr17.exe** to the vContinuum server.  Make sure that you've closed the vContinuum wizard. Double-click on the file to run it.<br>
7. **For the Linux master target server**: To update the unified agent, copy **UA_RHEL6-64_8.0.4.0_GA_Update_4_9035261_26Sep16.tar.gz** to the master target server and extract it. In the extracted folder, run **/Install**.<br>
8. **For the Windows source server**: You do not need to install Update 5 agent on source if soruce is already on update4. If it is less than update4, apply the update 5 agent.
To update the unified agent, copy **UA_Windows_8.0.5.0_GA_Update_5_11525802_20Apr17.exe** to the source server. Double-click it to run it. <br>
9. **For the Linux source server**: To update the unified agent, copy the corresponding version of the UA file to the Linux server, and extract it. In the extracted folder, run **/Install**.  Example: For RHEL 6.7 64 bit server,  copy **UA_RHEL6-64_8.0.4.0_GA_Update_4_9035261_26Sep16.tar.gz**  to the server and extract it. In the extracted folder, run **/Install**.

## Enable replication

1. Set up replication between the source and target VMware sites.
2. For guidance, use the InMage Scout documentation that's downloaded with the product. Alternatively, you can access the documentation as follows:

   * [Release notes](https://aka.ms/asr-scout-release-notes)
   * [Compatibility matrix](https://aka.ms/asr-scout-cm)
   * [User guide](https://aka.ms/asr-scout-user-guide)
   * [RX user guide](https://aka.ms/asr-scout-rx-user-guide)
   * [Quick installation guide](https://aka.ms/asr-scout-quick-install-guide)

## Updates

### Azure Site Recovery Scout 8.0.1 Update 5
Scout Update 5 is a cumulative update. It has all the fixes from Update 1 to Update 4, and the new fixes described below. Fixes from Site Recovery Scout Update 4 to Update 5 are specifically for the master target and vContinuum components. If source servers, master target, configuration server, process server and RX are already running Update 5, then only apply it on the master target server. 

#### New platform support
* SUSE Linux Enterprise Server 11 Service Pack 4(SP4)
* SLES 11 SP4 64 bit  **InMage_UA_8.0.1.0_SLES11-SP4-64_GA_13Apr2017_release.tar.gz** is packaged with the base Scout GA package **InMage_Scout_Standard_8.0.1 GA.zip**. Download the GA package from the portal, as described in [create a vault](#create-a-vault).


#### Bug fixes and enhancements**

* Increased Windows Cluster support reliability
	* Fixed- Some of the P2V MSCS cluster disks become RAW after recovery.
	* Fixed- P2V MSCS cluster recovery fails due to a disk order mismatch.
	* Fixed- The MSCS cluster add disks operation fails with a disk size mismatch error.
	* Fixed- The readiness check for the source MSCS cluster with RDM LUNs mapping fails in size verification.
	* Fixed- Single node cluster protection fails because of a SCSI mismatch issue. 
	* Fixed- Re-protection of the P2V Windows cluster server fails if target cluster disks are present. 
	
* During failback protection, if the selected master target server isn't on the same ESXi server as the protected source machine (during forward protection), then vContinuum picks up the wrong master target server during failback recovery, and the recovery operation fails.

#### Issues
* The P2V cluster fixes are applicable only to physical MSCS clusters that are newly protected with Site Recovery Scout Update 5. To get the cluster fixes on protected P2V MSCS clusters with older updates, follow the upgrade steps mentioned in section 12 of the [Site Recovery Scout Release Notes](https://aka.ms/asr-scout-release-notes).
* Re-protection of a physical MSCS cluster can only reuse existing target disks, if at the time of re-protection, the same set of disks are active on each of the cluster nodes as they were when initially protected. If not, then use the manual steps in section 12 of [Site Recovery Scout Release Notes](https://aka.ms/asr-scout-release-notes), to  move the target side disks to the correct datastore path, to re-use them during re-protection. If you reprotect the MSCS cluster in P2V mode without following the upgrade steps, it will create a new disk on the target ESXi server. You need to manually delete the old disks from the datastore.
* When a source SLES11 or SLES11 (with any service pack) server is rebooted gracefully, then manually mark the **root** disk replication pairs for re-synchronization. There isn't any notification in the CX interface. If you dont' mark the root disk for resynchronization, you might notice data integrity issues.
> 

### Azure Site Recovery Scout 8.0.1 Update 4
Scout Update 4 is a cumulative update. It has all the fixes from Update 1 to Update 3, and the new fixes described below.

#### New platform support

* Support has been added for vCenter/vSphere 6.0, 6.1 and 6.2
* Support has been added for following Linux operating systems:
  * Red Hat Enterprise Linux (RHEL) 7.0, 7.1 and 7.2
  * CentOS 7.0, 7.1 and 7.2
  * Red Hat Enterprise Linux (RHEL) 6.8
  * CentOS 6.8

> [!NOTE]
> RHEL/CentOS 7 64 bit  **InMage_UA_8.0.1.0_RHEL7-64_GA_06Oct2016_release.tar.gz** is packaged with the base Scout GA package **InMage_Scout_Standard_8.0.1 GA.zip**. Download Scout GA package from the portal as described in [create a vault](#step-1-create-a-vault).

#### Bug fixes and enhancements

* Improved shutdown handling for the following Linux operating systems and clones, to prevent unwanted re-synchronization issues.
	* Red Hat Enterprise Linux (RHEL) 6.x
	* Oracle Linux (OL) 6.x
* For Linux, complete folder access permissions in the unified agent installation directory, are now restricted to the local user only.
* On Windows, a fix for a timing out issue that occurred when issuing common distributed consistency bookmarks, on heavily loaded distributed applications such as SQL Server and Share Point clusters.
* A log related fix in the CX base installer.
* VMware vCLI 6.0 download link was added to the Windows master target base installer.
* More checks and logs for network configuratios changes during failover and disaster recovery drills were added.
* A fix for an issue that causes retention information not to be reported to the CX.  
* For physical clusters, a fix for an issue that caused volume resize operation in the vContinuum wizard to fail, when the source volume shrinks.
* A fix for a cluster protection issue, that failed with error "Failed to find the disk signature" when the cluster disk is a PRDM disk.
* A fix for cxps transport server crash caused by an out-of-range exception.
* Server name and IP address columns are now resizable in the Push Installation page of the vContinuum wizard.
* RX API enhancements:
  * Five latest available common consistency points now available (only guaranteed tags).
  * Capacity and free space details for all the protected devices.
  * Scout driver state on the source server.

#### Issues

* **InMage_Scout_Standard_8.0.1_GA.zip** base package now has an updated CX base installer: **InMage_CX_8.0.1.0_Windows_GA_26Feb2015_release.exe**, and a Windows master target base installer: **InMage_Scout_vContinuum_MT_8.0.1.0_Windows_GA_26Feb2015_release.exe**. For all new installations, use the new CX and Windows master target GA bits.
* Update 4 can be applied directly on 8.0.1 GA.
* The configuration server and RX updates can’t be rolled back, after they've been applied.


### Azure Site Recovery Scout 8.0.1 Update 3

All Site Recovery updates are cumulative. Update 3 has all the fixes of Update 1 and Update 2. Update 3 can be directly applied on 8.0.1 GA. The configuration server and RX updates can’t be rolled back after they're applied on the system.

#### Bug fixes and enhancements
Update 3 includes the following bug fixes and enhancements:

* The configuration server and RX aren't registered in the vault when they're behind the proxy.
* The number of hours in which the recovery point objective (RPO) isn't achieved does not get updated in the health report.
* The configuration server isn't syncing with RX when the ESX hardware details, or network details, contain any UTF-8 characters.
* Windows Server 2008 R2 domain controllers don't start after recovery.
* Offline synchronization isn't working as expected.
* After VM failover, replication-pair deletion is stuck in the CX UI for a long time, and users can't complete the failback or resume operations.
* Overall snapshot operations by the consistency job have been optimized, to help reduce application disconnects such as SQL Server clients.
* The performance of the consistency tool (VACP.exe) has been improved, by reducing the memory usage required for creating snapshots on Windows.
* The push install service crashes when the password is larger than 16 characters.
* vContinuum doesn't check and prompt for new vCenter credentials, when the credentials are changed.
* On Linux, the master target cache manager (cachemgr) isn't downloading files from the process server. This results in replication pair throttling.
* When the physical failover cluster (MSCS) disk order isn't the same on all nodes, replication isn't set for some of the cluster volumes. The cluster needs to be reprotected to take advantage of this fix.  
* SMTP functionality isn't working as expected, after RX is upgraded from Scout 7.1 to Scout 8.0.1.
* More statistics have been added in the log for the rollback operation, to track the time taken to complete it.
* Support has been added for Linux operating systems on the source server:
  * Red Hat Enterprise Linux (RHEL) 6 update 7
  * CentOS 6 update 7
* The CX and RX UI can now show notifications for the pair, which goes into bitmap mode.
* The following security fixes have been added in RX:

| **Issue description** | **Implementation procedures** |
| --- | --- |
| Authorization bypass via parameter tampering |Restricted access to non-applicable users. |
| Cross-site request forgery |Implemented the page-token concept, which generates randomly for every page. <br/>With this, you will see: <li> There is only a single sign-in instance for the same user.</li><li>Page refresh does not work--it will redirect to the dashboard.</li> |
| Malicious file upload |Restricted files to certain extensions. Allowed extensions are: 7z, aiff, asf, avi, bmp, csv, doc, docx, fla, flv, gif, gz, gzip, jpeg, jpg, log, mid, mov, mp3, mp4, mpc, mpeg, mpg, ods, odt, pdf, png, ppt, pptx, pxd, qt, ram, rar, rm, rmi, rmvb, rtf, sdc, sitd, swf, sxc, sxw, tar, tgz, tif, tiff, txt, vsd, wav, wma, wmv, xls, xlsx, xml, and zip. |
| Persistent cross-site scripting |Added input validations. |



### Azure Site Recovery Scout 8.0.1 Update 2 (Update 03Dec15)

Fixes in Update 2 include:

* **Configuration server**: Fix for an issue that prevented the 31-day free metering feature from working as expected when the configuration server was registered in Site Recovery.
* **Unified agent**: Fix for an issue in Update 1 that resulted in the update not being installed on the master target server when it was upgraded from version 8.0 to 8.0.1.

### Azure Site Recovery Scout 8.0.1 Update 1
Update 1 includes the following bug fixes and new features:

* 31 days of free protection per server instance. This enables you to test functionality or set up a proof-of-concept.
  * All operations on the server, including failover and failback, are free for the first 31 days, starting from the time that a server is first protected with Site Recovery Scout.
  * From the 32nd day onwards, each protected server will be charged at the standard instance rate for Azure Site Recovery protection to a customer-owned site.
  * At any time, the number of protected servers that are currently being charged is available on the Dashboard page of the Azure Site Recovery vault.
* Support added for vSphere Command-Line Interface (vCLI) 5.5 Update 2.
* Support added for Linux operating systems on the source server:
  * RHEL 6 Update 6
  * RHEL 5 Update 11
  * CentOS 6 Update 6
  * CentOS 5 Update 11
* Bug fixes to address the following issues:
  * Vault registration fails for the configuration server or RX server.
  * Cluster volumes don't appear as expected when clustered virtual machines are reprotected when they resume.
  * Failback fails when the master target server is hosted on a different ESXi server from the on-premises production virtual machines.
  * Configuration file permissions are changed when you upgrade to 8.0.1, which affects protection and operations.
  * The resynchronization threshold isn't enforced as expected, which leads to inconsistent replication behavior.
  * The RPO settings are not appearing correctly in the configuration server interface. The uncompressed data value incorrectly shows the compressed value.
  * The Remove operation doesn't delete as expected in the vContinuum wizard, and replication isn't deleted from the configuration server interface.
  * In the vContinuum wizard, the disk is automatically unselected when you click **Details** in the disk view during protection of MSCS virtual machines.
  * During the physical-to-virtual (P2V) scenario, required HP services, such as CIMnotify and CqMgHost, aren't moved to manual in virtual machine recovery. This results in additional boot time.
  * Linux virtual machine protection fails when there are more than 26 disks on the master target server.


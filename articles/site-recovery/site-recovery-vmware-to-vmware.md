<properties
	pageTitle="Replicate on-premises VMware virtual machines or physical servers to a secondary site | Microsoft Azure"
	description="Use this article to replicate VMware VMs or Windows/Linux physical servers to a secondary site with Azure Site Recovery."
	services="site-recovery"
	documentationCenter=""
	authors="nsoneji"
	manager="jwhit"
	editor=""/>

<tags
	ms.service="site-recovery"
	ms.workload="backup-recovery"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/14/2016"
	ms.author="nisoneji"/>


# Replicate on-premises VMware virtual machines or physical servers to a secondary site


## Overview

InMage Scout in Azure Site Recovery provides real-time replication between on-premises VMware sites. InMage Scout is included in Azure Site Recovery service subscriptions.


## Prerequisites

**Azure account**: You'll need a [Microsoft Azure](https://azure.microsoft.com/) account. You can start with a [free trial](https://azure.microsoft.com/pricing/free-trial/). [Learn more](https://azure.microsoft.com/pricing/details/site-recovery/) about Site Recovery pricing.


## Step 1: Create a vault

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Click **Data Services** > **Recovery Services** > **Site Recovery Vault**.
3. Click **Create New** > **Quick Create**.
4. In **Name**, enter a friendly name to identify the vault.
5. In **Region**, select the geographic region for the vault. To check supported regions, see [Azure Site Recovery
Pricing](https://azure.microsoft.com/pricing/details/site-recovery/).

Check the status bar to confirm that the vault was successfully created. The vault will be listed as **Active** on the main **Recovery Services** page.

## Step 2: Configure the vault and download InMage Scout components

1. Click **Create vault**.
2. On the **Recovery Services** page, click the vault to open the **Quick Start** page.
3. In the dropdown list, select **Between two on-premises VMware sites**.
4. Download InMage Scout. The setup files for all of the required components are in the downloaded .zip file.


## Step 3: Install component updates

Read about the latest [updates](#updates). You'll install the update files on servers in the following order:

1. RX server if there is one
2. Configuration servers
3. Process servers
3. Master target servers
4. vContinuum servers
5. Source server (only for Windows Server)

Install the updates as follows:

1. Download the [update](https://aka.ms/asr-scout-update3) .zip file. This .zip file contains the following files:

	-  RX_8.0.3.0_GA_Update_3_6684045_17Mar16.tar.gz
	-  CX_Windows_8.0.3.0_GA_Update_3_5048668_16Mar16.exe
	-  UA_Windows_8.0.3.0_GA_Update_3_7101745_04Apr16.exe
	-  UA_RHEL6-64_8.0.3.0_GA_Update_3_7101745_04Apr16.zip
	-  vCon_Windows_8.0.3.0_GA_Update_3_6873369_16Mar16.exe

2. Extract the .zip files.
3. **For the RX server**: Copy **RX_8.0.3.0_GA_Update_3_6684045_17Mar16.tar.gz** to the RX server and extract it. In the extracted folder, run **/Install**.
4. **For the configuration server/process server**: Copy **CX_Windows_8.0.3.0_GA_Update_3_5048668_16Mar16.exe** to the configuration server and process server. Double-click to run it.
5. **For the Windows master target server**: To update the unified agent, copy **UA_Windows_8.0.3.0_GA_Update_3_7101745_04Apr16.exe** to the master target server. Double-click it to run it. Note that the unified agent is also applicable to the source server. You should install it on the source server as well, as mentioned later in this list.
6. **For the Linux master target server**: To update the unified agent, copy **UA_RHEL6-64_8.0.3.0_GA_Update_3_7101745_04Apr16.zip** to the master target server and extract it. In the extracted folder, run **/Install**.
7. **For the vContinuum server**: Copy **vCon_Windows_8.0.3.0_GA_Update_3_6873369_16Mar16.exe** to the vContinuum server. Make sure that you've closed the vContinuum wizard. Double-click on the file to run it.
8. **For the Windows source server**: To update the unified agent, copy **UA_Windows_8.0.3.0_GA_Update_3_7101745_04Apr16.exe** to the source server. Double-click it to run it.

## Step 4: Set up replication
1. Set up replication between the source and target VMware sites.
2. For guidance, use the InMage Scout documentation that's downloaded with the product. Alternatively, you can access the documentation as follows:

	- [Release notes](https://aka.ms/asr-scout-release-notes)
	- [Compatibility matrix](https://aka.ms/asr-scout-cm)
	- [User guide](https://aka.ms/asr-scout-user-guide)
	- [RX user guide](https://aka.ms/asr-scout-rx-user-guide)
	- [Quick installation guide](https://aka.ms/asr-scout-quick-install-guide)


## Updates

### Azure Site Recovery Scout 8.0.1 Update 3
Update 3 includes the following bug fixes and enhancements:

- The configuration server and RX fail to register to the Site Recovery vault when they're behind the proxy.
- The number of hours that the recovery point objective (RPO) is not met is not getting updated in the health report.
- The configuration server is not syncing with RX when the ESX hardware details or network details contain any UTF-8 characters.
- Windows Server 2008 R2 domain controllers fail to boot after recovery.
- Offline sync is not working as expected.
- After virtual machine (VM) failover, replication-pair deletion gets stuck in the CX UI for a long time, and users cannot complete the failback or resume operation.
- Overall snapshot operations that are done by the consistency job have been optimized to help reduce application disconnects like SQL clients.
- The performance of the consistency tool (VACP.exe) has been improved by reducing the memory usage that is required for creating snapshots on Windows.
- The push install service crashes when the password is greater than 16 characters.
- vContinuum is not checking and prompting for new vCenter credentials when the credentials are changed.
- On Linux, the master target cache manager (cachemgr) is not downloading files from the process server, which results in replication pair throttling.
- When the physical failover cluster (MSCS) disk order is not the same on all the nodes, replication is not set for some of the cluster volumes.
<br/>Note that the cluster needs to be reprotected to take advantage of this fix.  
- SMTP functionality is not working as expected after RX is upgraded from Scout 7.1 to Scout 8.0.1.
- More stats have been added in the log for the rollback operation to track the time it has taken to complete it.
- Support has been added for Linux operating systems on the source server:
	- Red Hat Enterprise Linux (RHEL) 6 update 7
	- CentOS 6 update 7
- The CX and RX UI can now show the notification for the pair, which goes into bitmap mode.
- The following security fixes have been added in RX:

**Issue description**|**Implementation procedures**
---|---
Authorization bypass via parameter tampering|Restricted access to non-applicable users.
Cross-site request forgery|Implemented the page-token concept, which generates randomly for every page. <br/>With this, you will see: <li> There is only a single sign-in instance for the same user.</li><li>Page refresh does not work--it will redirect to the dashboard.</li>
Malicious file upload|Restricted files to certain extensions. Allowed extensions are: 7z, aiff, asf, avi, bmp, csv, doc, docx, fla, flv, gif, gz, gzip, jpeg, jpg, log, mid, mov, mp3, mp4, mpc, mpeg, mpg, ods, odt, pdf, png, ppt, pptx, pxd, qt, ram, rar, rm, rmi, rmvb, rtf, sdc, sitd, swf, sxc, sxw, tar, tgz, tif, tiff, txt, vsd, wav, wma, wmv, xls, xlsx, xml, and zip.
Persistent cross-site scripting | Added input validations.


>[AZURE.NOTE]
>
>-	All Site Recovery updates are cumulative. Update 3 has all the fixes of Update 1 and Update 2. Update 3 can be directly applied on 8.0.1 GA.
>-	The configuration server and RX updates can’t be rolled back after they're applied on the system.

### Azure Site Recovery Scout 8.0.1 Update 2 (Update 03Dec15)

Fixes in Update 2 include:

- **Configuration server**: Fix for an issue that prevented the 31-day free metering feature from working as expected when the configuration server was registered in Site Recovery.
- **Unified agent**: Fix for an issue in Update 1 that resulted in the update not being installed on the master target server when it was upgraded from version 8.0 to 8.0.1.


### Azure Site Recovery Scout 8.0.1 Update 1

Update 1 includes the following bug fixes and new features:

- 31 days of free protection per server instance. This enables you to test functionality or set up a proof-of-concept.
	- All operations on the server, including failover and failback, are free for the first 31 days, starting from the time that a server is first protected with Site Recovery Scout.
	- From the 32nd day onwards, each protected server will be charged at the standard instance rate for Azure Site Recovery protection to a customer-owned site.
	- At any time, the number of protected servers that are currently being charged is available on the Dashboard page of the Azure Site Recovery vault.
- Support added for vSphere Command-Line Interface (vCLI) 5.5 Update 2.
- Support added for Linux operating systems on the source server:
	- RHEL 6 Update 6
	- RHEL 5 Update 11
	- CentOS 6 Update 6
	- CentOS 5 Update 11
- Bug fixes to address the following issues:
	- Vault registration fails for the configuration server or RX server.
	- Cluster volumes don't appear as expected when clustered virtual machines are reprotected when they resume.
	- Failback fails when the master target server is hosted on a different ESXi server from the on-premises production virtual machines.
	- Configuration file permissions are changed when you upgrade to 8.0.1, which affects protection and operations.
	- The resynchronization threshold isn't enforced as expected, which leads to inconsistent replication behavior.
	- The RPO settings are not appearing correctly in the configuration server interface. The uncompressed data value incorrectly shows the compressed value.
	-  The Remove operation doesn't delete as expected in the vContinuum wizard, and replication isn't deleted from the configuration server interface.
	-  In the vContinuum wizard, the disk is automatically unselected when you click **Details** in the disk view during protection of MSCS virtual machines.
	- During the physical-to-virtual (P2V) scenario, required HP services, such as CIMnotify and CqMgHost, aren't moved to manual in virtual machine recovery. This results in additional boot time.
	- Linux virtual machine protection fails when there are more than 26 disks on the master target server.

## Next steps

Post any questions that you have on the [Azure Recovery Services forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).

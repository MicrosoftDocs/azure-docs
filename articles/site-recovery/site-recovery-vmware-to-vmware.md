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

- **Azure account**—You'll need a [Microsoft Azure](https://azure.microsoft.com/) account. You can start with a [free trial](https://azure.microsoft.com/pricing/free-trial/). [Learn more](https://azure.microsoft.com/pricing/details/site-recovery/) about Site Recovery pricing.


## Step 1: Create a vault

1. Sign in to the [Management Portal](https://portal.azure.com).
2. Click **Data Services** > **Recovery Services** > **Site Recovery Vault**.
3. Click **Create New** > **Quick Create**.
4. In **Name** enter a friendly name to identify the vault.
5. In **Region** select the geographic region for the vault. To check supported regions see Geographic Availability in [Azure Site Recovery Pricing Details](https://azure.microsoft.com/pricing/details/site-recovery/).

Check the status bar to confirm that the vault was successfully created. The vault will be listed as **Active** on the main Recovery Services page.

## Step 2: Configure the vault and download InMage Scout components

1. Click **Create vault**.
2. In the **Recovery Services** page, click the vault to open the Quick Start page.
3. In the dropdown list, select **Between two on-premises VMware sites**.
4. Download InMage Scout. The setup files for all of the required components are in the downloaded zip file.


## Step 3: Install component updates

Read about the latest [updates](#updates). You'll install the update files in the following order:

1. RX server if there is one
2. Configuration servers
3. Process servers
3. Master target servers.
4. vContinuum servers.
5. Source server (only for Windows server)

Install as follows:

1. Download the [update](https://aka.ms/asr-scout-update3) zip file. This zip file contains the following files:

	-  RX_8.0.3.0_GA_Update_3_6684045_17Mar16.tar.gz
	-  CX_Windows_8.0.3.0_GA_Update_3_5048668_16Mar16.exe
	-  UA_Windows_8.0.3.0_GA_Update_3_7101745_04Apr16.exe
	-  UA_RHEL6-64_8.0.3.0_GA_Update_3_7101745_04Apr16.zip
	-  vCon_Windows_8.0.3.0_GA_Update_3_6873369_16Mar16.exe

2. Extract the zip files.
3. **RX server**: Copy **RX_8.0.3.0_GA_Update_3_6684045_17Mar16.tar.gz** to the RX server and extract it. In the extracted folder run **/Install**.
4. **Configuration server/process server**: Copy **CX_Windows_8.0.3.0_GA_Update_3_5048668_16Mar16.exe** to the configuration server and process server. Double click to run it.
5. **Windows master target server**: To update the  unified agent copy **UA_Windows_8.0.3.0_GA_Update_3_7101745_04Apr16.exe** to the master target server. Double click it to run it. Note that the unified agent is also applicable for the source server. It should be installed on the source server as well as mentioned below.
6. **Linux master target server**:  To update the unified agent copy **UA_RHEL6-64_8.0.3.0_GA_Update_3_7101745_04Apr16.zip** to the master target server and extract it. In the extracted folder run **/Install**.
7. **vContinuum server**: Copy **vCon_Windows_8.0.3.0_GA_Update_3_6873369_16Mar16.exe** to the vContinuum server. Make sure you've closed the vContinuum Wizard. Double click on the file to run it.
8. **Windows source server**: To update the unified agent copy **UA_Windows_8.0.3.0_GA_Update_3_7101745_04Apr16.exe** to the source server. Double click it to run it. 

## Step 4: Set up replication
1. Set up replication between the source and target VMware sites.
2. For guidance, use the InMage Scout documentation that's downloaded with the product. Alternatively you can access the documentation as follows:

	- [Release notes](https://aka.ms/asr-scout-release-notes)
	- [Compatibility matrix](https://aka.ms/asr-scout-cm)
	- [User guide](https://aka.ms/asr-scout-user-guide)
	- [RX user guide](https://aka.ms/asr-scout-rx-user-guide)
	- [Quick installation guide](https://aka.ms/asr-scout-quick-install-guide)


## Updates

### ASR Scout 8.0.1 Update 3
Update 3 includes following bug fixes and enhancements :

1. Configuration server and RX  failed to register to ASR vault when they are behind the proxy.
2. Number of hours RPO not met is not getting updated in the health report.
3. Configuration Server is not syncing with RX when ESX hardware details or network details contains any UTF-8 characters.
4. Windows 2008 Server R2 DC machines fails to boot after recovery.
5. Offline sync is not working as expected. 
6. After VM failover, replication pair deletion get stuck in CX UI for long time  and user cannot do failback resume operation.
7. Optimized overall snapshot operations done by consistency job to help reduce the application disconnects like SQL Clients.
8. Improved the VACP's  performance by reducing the memory usage required for creating snapshots on Windows..
9. Push install service get crashed when password is > 16 characters
10. vContinuum is not checking & prompting for new vCenter credentials when the credentials is changed.
11. On Linux Master target cache manger(cachemgr) is not downloading files from process server resulting replication pair throttling.
12. When Physical MSCS cluster disks order are not same on all the nodes, replication are not set for some of the cluster volumes. 
<br/>NOTE: To make avail of this fix, cluster need to be re-protected.  
13. SMTP functionality is not working as expected after RX is upgraded from Scout 7.1 to Scout 8.0.1.
14. Added more stats in the log for the rollback operation to track the time it has taken to complete it.
15. Support added for Linux Operating systems on the source server 
	- RHEL 6 update 7
	- CentOS 6 update 7 
16. CX and RX UI can now show the notification for the pair which goes into bitmap mode.
17. Following security fixes are added in RX.

**#**|**Issue Description**|**Implementation Procedures**
---|---|---
1. |Authorization bypass via parameter tampering|Access restricted to non-applicable users
2. |Cross-site request forgery|Implemented page-token concept which generate randomly for every page. <br/>With this you will see <br/>1) only single login instance for the same user.,br/>2) Page refresh will not work which will redirect to dashboard. <br/>
3. |Malicious file upload|Restricted files to certain extensions. Allowed are : 7z, aiff, asf, avi, bmp, csv, doc, docx, fla, flv, gif, gz, gzip, jpeg, jpg, log, mid, mov, mp3, mp4, mpc, mpeg, mpg, ods, odt, pdf, png, ppt, pptx, pxd, qt, ram, rar, rm, rmi, rmvb, rtf, sdc, sitd, swf, sxc, sxw, tar, tgz, tif, tiff, txt, vsd, wav, wma, wmv, xls, xlsx, xml, zip
4. | Persistent cross-site scripting | Added input validations


>[AZURE.NOTE]
>
>-	All ASR updates are cumulative. Update3 has all the fixes of update1 and update2. Update 3 can be directly applied on 8.0.1 GA.
>-	The CS and RX updates can’t be rolled back once it is applied on the system.

### ASR Scout 8.0.1 Update 03Dec15 (Update2)

Fixes in Update 2 includes:

- **Configuration server** —Fixes an issue that prevented the 31-day free metering feature from working as expected when the configuration server was registered in Site Recovery.
- **Unified agent** —Fixes an issue in Update 1 for the Master Target, that resulted in the update not being installed on the master target server when it’s upgraded from version 8.0 to 8.0.1.


### ASR Scout 8.0.1 Update 1

Update 1 includes bug fixes and new features:

- 31 days of free protection per server instances. This enables you to test functionality or set up a proof-of-concept.
	- All operations on the server, including failover and failback are free for the first 31 days starting from the time that a server is first protected using ASR Scout.
	- From the 32nd day onwards, each protected server will be charged at the standard instance rate for Azure Site Recovery protection to a customer owned site.
	- At any time, the number of protected servers that are currently being charged is available on the Dashboard page of the Azure Site Recovery vault.
- Support added for vCLI 5.5 Update 2.
- Support added for Linux operating systems on the source server:
	- RHEL 6 Update 6
	- RHEL 5 Update 11
	- CentOS 6 Update 6
	- CentOS 5 Update 11
- Bug fixes to address the following issues:
	- Vault registration fails for the configuration server or RX server.
	- Cluster volumes don't appear as expected when clustered virtual machines are reprotected during resume.
	- Failback fails when master target server is hosted on a different ESXi server from the on-premises production virtual machines.
	- Configuration file permissions are changed when upgrading to 8.0.1, affecting protection and operations.
	- Resynchronization threshold isn't enforced as expected, leading to inconsistent replication behavior.
	- RPO settings not appearing correctly in the configuration server interface. Uncompressed data value incorrectly shows compressed value.
	-  The Remove operation doesn't delete as expected in the vContinuum wizard and replication isn't deleted from the configuration server interface.
	-  In the vContinuum wizard the disk is automatically unselected when clicking on **Details** in the disk view during protection of MSCS virtual machines.
	- During P2V scenario required HP sevices such as CIMnotify, CqMgHost aren't moved to Manual in the recover virtual machine, resulting is additional boot time.
	- Linux virtual machine protected fails when there are more than 26 disks on the master target server.

## Next steps

Post any questions on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).

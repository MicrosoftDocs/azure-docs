<properties 
	pageTitle="Set up protection between on-premises VMware Sites" 
	description="Use this article to configure protection between two VMware sites using Azure Site Recovery." 
	services="site-recovery" 
	documentationCenter="" 
	authors="rayne-wiselman" 
	manager="jwhit" 
	editor=""/>

<tags 
	ms.service="site-recovery" 
	ms.workload="backup-recovery" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="08/05/2015" 
	ms.author="raynew"/>


# Set up protection between on-premises VMware sites


## Overview

InMage Scout in Azure Site Recovery provides real-time replication between on-premises VMware sites. InMage Scout is included in Azure Site Recovery service subscriptions.


## Prerequisites

- **Azure account**—You'll need a [Microsoft Azure](http://azure.microsoft.com/) account. You can start with a [free trial](pricing/free-trial/).


## Step 1: Create a vault

1. Sign in to the [Management Portal](https://portal.azure.com).
2. Click **Data Services** > **Recovery Services** > **Site Recovery Vault**.
3. Click **Create New** > **Quick Create**.
4. In **Name** enter a friendly name to identify the vault.
5. In **Region** select the geographic region for the vault. To check supported regions see Geographic Availability in [Azure Site Recovery Pricing Details](pricing/details/site-recovery/).

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

Install as follows:

1. Download the [update](http://download.microsoft.com/download/9/F/D/9FDC6001-1DD0-4C10-BDDD-8A9EBFC57FDF/ASR Scout 8.0.1 Update1.zip) zip file. This zip file contains the following files:

	-  RX_8.0.1.0_GA_Update_1_3279231_23Jun15.tar.gz
	-  CX_Windows_8.0.1.0_GA_Update_1_3259146_23Jun15.exe
	-  UA_Windows_8.0.1.0_GA_Update_1_3259401_23Jun15.exe
	-  UA_RHEL6-64_8.0.1.0_GA_Update_1_3259401_23Jun15.tar.gz
	-  vCon_Windows_8.0.1.0_GA_Update_1_3259523_23Jun15.exe
2. Extract the zip files.
2. **RX server**: Copy **RX_8.0.1.0_GA_Update_1_3279231_23Jun15.tar.gz** to the RX server and extract it. In the extracted folder run **/Install**.
2. **Configuration server/process server**: Copy **CX_Windows_8.0.1.0_GA_Update_1_3259146_23Jun15.exe** to the configuration server and process server. Double click to run it.
3. **Windows master target server**: To update the  unified agent copy **UA_Windows_8.0.1.0_GA_Update_1_3259401_23Jun15.exe** to the master target server. Double click it to run it. Note that the unified agent for Windows isn't applicable on the source server. It should be installed on the Windows master target server only.
4. **Linux master target server**:  To update the unified agent copy **UA_RHEL6-64_8.0.1.0_GA_Update_1_3259401_23Jun15.tar.gz** to the master target server and extract it. In the extracted folder run **/Install**.
5. **vContinuum server**: Copy **vCon_Windows_8.0.1.0_GA_Update_1_3259523_23Jun15.exe** to the vContinuum server. Make sure you've closed the vContinuum Wizard. Double click on the file to run it.

## Step 4: Set up replication
5. Set up replication between the source and target VMware sites.
6. For guidance, use the InMage Scout documentation that's downloaded with the product. Alternatively you can access the documentation as follows:

	- [Release notes](http://download.microsoft.com/download/4/5/0/45008861-4994-4708-BFCD-867736D5621A/InMage_Scout_Standard_Release_Notes.pdf)
	- [Compatibility matrix](http://download.microsoft.com/download/C/D/A/CDA1221B-74E4-4CCF-8F77-F785E71423C0/InMage_Scout_Standard_Compatibility_Matrix.pdf)
	- [User guide](http://download.microsoft.com/download/E/0/8/E08B3BCE-3631-4CED-8E65-E3E7D252D06D/InMage_Scout_Standard_User_Guide_8.0.1.pdf)
	- [RX user guide](http://download.microsoft.com/download/A/7/7/A77504C5-D49F-4799-BBC4-4E92158AFBA4/InMage_ScoutCloud_RX_User_Guide_8.0.1.pdf)
	- [Quick installation guide](http://download.microsoft.com/download/6/8/5/685E761C-8493-42EB-854F-FE24B5A6D74B/InMage_Scout_Standard_Quick_Install_Guide.pdf)


## Updates

### ASR Scout 8.0.1 Update 1

This latest update includes bug fixes and new features:

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

Post any questions on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).< 

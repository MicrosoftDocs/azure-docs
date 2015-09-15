<properties
	pageTitle="Site Recovery components"
	description="This article provides an overview of Site Recovery components and how to manage them"
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
	ms.topic="get-started-article"
	ms.date="08/10/2015"
	ms.author="raynew"/>

# Site Recovery components

Azure Site Recovery contributes to your business continuity and disaster recovery (BCDR) strategy by orchestrating replication, failover and recovery of virtual machines and physical servers. Machines can be replicated to Azure, or to a secondary on-premises data center. [Read an overview](site-recovery-overview.md).

This article summarizes and describes the Site Recovery components that are installed on servers and virtual machines.

You can post any questions about this article on the [Azure Recovery Services Forum](https://social.msdn.microsoft.com/forums/azure/home?forum=hypervrecovmgr).

## Overview

Site Recovery components will vary slightly depending on the protection scenario.

### Protection between two datacenters with VMM

**Scenario** | **Description** | **Required components** | **Details**
--- | --- | --- | ---
You deploy Azure Site Recovery to replicate virtual machines between two datacenters | <p>Each datacenter has a VMM server</p><p>Each VMM server has a private cloud that contains one or more Hyper-V host servers with virtual machines you want to protect</p> | The Azure Site Recovery Provider will be installed on both VMM servers | <p>No components are installed on the Hyper-V host servers or protected virtual machines</p><p>The Azure Site Recovery Provider on the VMM server communicates with the Site Recovery service over HTTPS 443 to orchestrate protection</p><p>Replication occurs between the primary and secondary Hyper-V host servers over the internet using Kerberos and certificate authentication on ports 8083 and 8084.</p>

![On-premises to on-premises](./media/site-recovery-components/Components_Onprem2Onprem.png)


### Protection between a datacenter with VMM and Azure

**Scenario** | **Description** | **Required components** | **Details**
--- | --- | --- | ---
You deploy Azure Site Recovery to replicate virtual machines between a datacenter and Azure | <p>The on-premises datacenter has a VMM server with a private cloud that contains one or more Hyper-V host servers with virtual machines you want to protect</p> | <p>The Azure Site Recovery Provider will be installed on the VMM server</p><p>The Microsoft Recovery Services agent will be installed on source Hyper-V host servers</p> | <p>No components are installed on protected virtual machines</p><p>The Azure Site Recovery Provider on the VMM server communicates with the Site Recovery service over HTTPS 443 to orchestrate protection</p><p>Replication occurs between Microsoft Recovery Services agent running on the source Hyper-V host servers and Azure over HTTPS 443.</p>

![On-premises VMM to Azure](./media/site-recovery-components/Components_OnpremVMM2Azure.png)

###  Protection between a Hyper-V site and Azure

**Scenario** | **Description** | **Required components** | **Details**
--- | --- | --- | ---
You deploy Azure Site Recovery to replicate virtual machines between a datacenter and Azure | <p>The on-premises datacenter has one or more Hyper-V host servers with virtual machines you want to protect</p><p>During configuration you define a Hyper-V site that contains one or more of these Hyper-V host servers</p> | <p>A single component installation runs to install both the Azure Site Recovery Provider and the Microsoft Recovery Services agent on the Hyper-V host servers</p> | <p>No VMM server in the deployment</p><p>No components are installed on protected virtual machines</p><p>The Azure Site Recovery Provider on the Hyper-V host server communicates with the Site Recovery service over HTTPS 443 to orchestrate protection</p><p>Replication occurs between the Microsoft Recovery Services agent running on the Hyper-V host server and Azure over HTTPS 443.</p>

![On-premises VMM to Azure](./media/site-recovery-components/Components_OnpremHyperVSite2Azure.png)

### Protection between an on-premises physical server or VMware virtual machine and Azure

In this scenario replication can happen in two ways:

- Over a VPN connection (using Azure ExpressRoute or a site-to-site VPN)
- Over a secure connection on the internet

#### Over a VPN site-to-site connection (or ExpressRoute)

Communications from on-premises servers are directed to internal ports on the Azure virtual network to which the configuration and master target virtual machines are connected.

![VMware or physical machine to Azure over the internet ](./media/site-recovery-components/Components_OnpremVMware2AzureVPN.png)

#### Over the internet

All communications from on-premises servers are directed to mapped public endpoints on the Azure cloud service for the configuration server virtual machine and master target server virtual machine. The endpoints are dynamically created when you deploy the virtual machines.

![VMware or physical machine to Azure over the internet ](./media/site-recovery-components/Components_OnpremVMware2AzureInternet.png)

#### Ports

**Component** | **Port** | **Details**
--- | --- | --- | ---
**Process server** |9080 | Protected machines send data for replication to the process server over TCP 9080.
**Configuration server** | HTTPS/443 | The Mobility service running on protected machines sends replication metadata to the configuration server on port 443.
 | HTTPS/443 | The configuration server coordinates and orchestrates machine protection. The process server communicates with the configuration server on 443 or the mapped public endpoint to receive management and control information.
 | 9443 | In the failback direction, the vContinuum tool requests control and metadata from the configuration server on port 9443 (not shown on diagram)
 | 5986 | Remote management with PowerShell uses port 5986 (not shown on diagram)
 | 3389 | RDP connection to the configuration server using 3389 (not shown on diagram)
**Master target server** | 80 | The process site sends communications about replication traffic to the master target server over 9080
 | HTTP/443 | The process server replicates data to the master target server over HTTP or 443 (VPN)
 | HTTP/443 | The process server replicates data to the master target server over HTTP or 443 (VPN)
**Firewall rules** |  | <p>For push installation of the Mobility service to work correctly the firewall on protected machines should allow File and Printer Sharing and Windows Management Instrumentation.</p><p>The firewall rules on machines you want to protect should allow them to reach the configuration server.</p><p>To connect to Azure virtual machines over the internet after failover, firewall rules on the machines should allow Remote Desktop connections over the internet. To connect to a failed over Linux machine in Azure the Secure Shell service should be set to start automatically on system, and firewall rules should allow an ssh connection.</p>


## Site Recovery components

**Component** | **Details** | **Installation** | **Deployment scenario**
--- | --- | --- | ---
**Azure Site Recovery Provider for VMM** | Handles communication between the VMM server and the Site Recovery service. | Installed on a VMM server | Used when you set up protection between two VMM sites or between a VMM site and Azure
**Azure Site Recovery Provider for Hyper-V** | Handles communication between the Hyper-V host and the Site Recovery service when VMM isn't deployed. | Installed on a Hyper-V host server | Used when you set up protection between a Hyper-V site and Azure.
**Microsoft Recovery Services Agent** | Handles communication between the Hyper-V host server and the Site Recovery service | Installed on the Hyper-V host server | <p>Used when you set up protection between a Hyper-V site and Azure.</p><p>You download a single provider that includes both the Azure Site Recovery Provider for Hyper-V and the Microsoft Recovery Services Agent.</p>
**Process server/Failback process server** | <p>Optimizes data from protected VMware machines or Windows/Linux physical server before sending it to the master target server in Azure</p><p>Does push installation of the Mobility Service on VMware virtual machines or physical servers</p><p>Performs automatic discovery of VMware virtual machines.</p> <p>Failback process server: Only the first point on optimizing data before replication is applicable for the failback process server</p> | <p>Installed on a on-premises server running at least Windows Server 2012 R2</p><p>Failback process server: Runs on a standard A4 size Azure virtual machine</p> | <p>Used when you set up protection between an on-premises physical server or VMware virtual machines, and Azure.</p><p>Failback process server: Used for failback from Azure to on-premises</p>
**Mobility service** | Captures changes on protected machines and communicates them to the on-premises process server for replication to Azure. | Installed on on-premises VMware virtual machines or on physical servers that you want to protect| Used when you set up protection between an on-premises physical server or VMware virtual machines, and Azure.
**Master target server/failback master target server** | <p>Holds replicated data from your protected machines using attached VHDs created on blob storage in your Azure storage account</p><p>Failback master target server: Holds replication data from failed over virtual machines in Azure. Data is held on VMDKs created in the data store that's selected when reverse replication is enabled for failback.</p> | <p>Installed as an Azure virtual machine as a Windows server based on a Windows Server 2012 R2 gallery image (to protect Windows machines) or as a Linux server based on a OpenLogic CentOS 6.6 gallery image (to protect Linux machines)</p><p>Two sizing options are available – standard A3 and standard D14</p><p>Failback master target server: Runs on a VMware virtual machine. It's provisioned on the same host to which the machine will be failed back.</p>| <p>Used when you set up protection between an on-premises physical server or VMware virtual machines, and Azure.</p><p>Failback master target server: Used for failback of failed over virtual from Azure back to on-premises.</p>
**Configuration server** | <p>Coordinates communication between protected machines, the process server, and master target servers in Azure</p><p>Sets up replication and coordinates recovery in Azure when failover occurs</p> | Installed on an Azure Standard A3 virtual machine in the same Azure subscription as Site Recovery. | Used when you set up protection between an on-premises physical server or VMware virtual machines, and Azure.


## Planning for component deployment

### Azure Site Recovery Provider

The Provider runs on your VMM servers, Hyper-V host servers if you don't have a VMM server in your deployment, or on a configuration server. It connects to the Site Recovery service over the internet with an encrypted HTTPS connection. Note that:

- You don't need to add specific firewall exception to connect the Provider to Site Recovery.
- If you want the server on which the provider runs to connect to the internet using a proxy server you can either use the existing proxy settings, or specify a custom proxy.
- The proxy needs to allow these addresses through the firewall:

	-  *.accesscontrol.windows.net
	-  .backup.windowsazure.com
	-  *.blob.core.windows.net
	-  *.store.core.windows.net

- If you have IP address-based rules on your firewall make sure they allow communication from the configuration server to IP addresses described in [Azure Datacenter IP ranges](https://www.microsoft.com/download/details.aspx?id=41653) and for HTTPS (443). You'll need to whitelist IP address ranges of the Azure region you plan to use and for West US.
- If you're deploying Site Recovery with VMM and you use a custom proxy, a VMM RunAs account (DRAProxyAccount) will be created automatically using the proxy credentials you specify in the custom proxy settings in the Site Recovery portal. You'll need to set up the proxy server so that this account can authenticate successfully.
- If you're using a proxy traffic sent from the provider installed on a Hyper-V host server to the proxy must be sent over HTTP.

### Microsoft Recovery Services agent

The agent connects to the Site Recovery service over the internet with an encrypted HTTPS connection. No specify firewall exceptions are required.

### Components for VMware or physical server protection

#### Master target server

- The master target server can e Azure standard A4 or D14 virtual machine.
- With a standard A4 master target you can add 16 data disks (maximum of 1023 GB per data disk) to each virtual machine.
- With a standard D14 master target you can add 32 data disks (maximum of 1023 GB per data disk) to each virtual machine.
- A standard D14 sized master target server is required only if you wish to protect a server that has more than 15 disks attached to it; for all other configurations you can deploy standard A4 sized master target servers.
- Note that one disk attached to the master target server is reserved as a retention drive. Azure Site Recovery allows you to define retention windows and recover protected machines to a recovery point within that window. The retention drive maintains a journal of disk changes for the duration of the window.  This reduces the maximum disks available for replication on an A4 to 15 and on a D14 to 31.

#### Process server

- The process server uses disk based cache. Ensure that there's enough free space C:/ for the cache. Cache sizing will be affected by the data change rate of the machines you're protecting. Generally we recommend a cache directory size of 600 GB for medium size deployments.
- You should deploy an additional process server if the data change rate of protected machines exceeds the capacity of an existing process server.
- To scale your deployment you add multiple process servers and master target servers. You should deploy a second master target server if you don't have enough free disks on an existing master target server.
-  Note that process servers and master target servers don't require one-to-one mapping. You can deploy the first process server with the second master target server and so on.

#### Configuration server

- The configuration server is a standard A3 virtual machine based on an Azure Site Recovery Windows Server 2012 R2 gallery image will be created in your subscription for the configuration server. It's created as the first instance in a new cloud service with a reserved public IP address.
- Installation path in English characters only.

#### Mobility service

Install on VMware virtual machines or physical servers. Machines and servers must comply with the  following requirements:

- **Windows servers**:
	-  64-bit operating system: Windows Server 2012 R2, Windows Server 2012, or Windows Server 2008 R2 with at least SP1.
	-  Host name, mount points, device names, Windows system path (eg: C:\Windows) in English only.
	-  The operating system  on C:\ drive.
	-  Only basic disks are supported. Dynamic disks aren't supported.

- **Linux servers**:
	- A supported 64 bit operating system: Centos 6.4, 6.5, 6.6; Oracle Enterprise Linux 6.4, 6.5 running either the Red Hat compatible kernel or Unbreakable Enterprise Kernel Release 3 (UEK3), SUSE Linux Enterprise Server 11 SP3.
	- /etc/hosts files on protected machines should contain entries that map the local host name to IP addresses associated with all NICs.
	- Host name, mount points, device names, and Linux system paths and file names (eg /etc/; /usr) in English only.
	-  Following storage supported: File system: EXT3, ETX4, ReiserFS, XFS/Multipath software-Device Mapper (multipath)/Volume manager: LVM2\. Physical servers with HP CCISS controller storage aren't supported.


For detailed planning information about these components read the capacity planning section in [this article](site-recovery-vmware-to-azure.md).


## Keep components up-to-date

**Component** | **How to update**
--- | ---
<p>**Azure Site Recovery Provider for VMM**</p><p>**Azure Recovery Services Agent**</p> | <p></p>**First time installation**: download the latest version from the Quick Start page<p></p>**Ongoing**: You can download the latest (and previous) versions from the Dashboard in Site Recovery. Alternatively if you opt in for Microsoft Updates the latest version of the Provider and agent will be installed automatically on the server.
<p>**Process server**</p><p>**Configuration server**</p><p>**Master target server**</p> | Check for updates on the Site Recovery Dashboard.
**Mobility service** | <p>Ensure you have the latest Mobility service updates on each machine you want to protect:<p><p>You can download the latest updates:</p><p>[Windows](http://download.microsoft.com/download/7/C/7/7C70CA53-2D8E-4FE0-BD85-8F7A7A8FA163/Microsoft-ASR_UA_8.3.0.0_Windows_GA_03Jul2015_release.exe)</p><p>[RHELP6-64](http://download.microsoft.com/download/B/4/5/B45D1C8A-C287-4339-B60A-70F2C7EB6CFE/Microsoft-ASR_UA_8.3.0.0_RHEL6-64_GA_03Jul2015_release.tar.gz)</p><p>[OL6-64](http://download.microsoft.com/download/9/4/8/948A2D75-FC47-4DED-B2D7-DA4E28B9E339/Microsoft-ASR_UA_8.3.0.0_OL6-64_GA_03Jul2015_release.tar.gz)</p><p>[SLES11-SP3-64](http://download.microsoft.com/download/6/A/2/6A22BFCD-E978-41C5-957E-DACEBD43B353/Microsoft-ASR_UA_8.3.0.0_SLES11-SP3-64_GA_03Jul2015_release.tar.gz)</p><p>Alternatively after ensuring that the process server is up-to-date you can download the latest version of Mobility service from the C:\pushinstallsvc\repository folder on the process server</p>  

## Next steps

Start configuring the components for your deployment scenario. [Learn more](site-recovery-overview.md).

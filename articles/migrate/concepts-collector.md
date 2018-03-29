---
title: Collector appliance in Azure Migrate | Microsoft Docs
description: Provides an overview of the Collector appliance and how to configure it.
author: ruturaj
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 01/23/2017
ms.author: ruturajd
services: azure-migrate
---

# Collector appliance

[Azure Migrate](migrate-overview.md) assesses on-premises workloads for migration to Azure. This article provides information about how to use the Collector appliance.



## Overview

An Azure Migrate Collector is a lightweight appliance that can be used to discover your on-premises vCenter environment. This appliance discovers on-premises VMware machines, and sends metadata about them to the Azure Migrate service.

The Collector appliance is an OVF that you can download from the Azure Migrate project. It instantiates a VMware virtual machine with 4 cores, 8 GB RAM and one disk of 80 GB. The Operating system of the appliance is Windows Server 2012 R2 (64 bit).

You can create the Collector by following the steps here - [How to create the Collector VM](tutorial-assessment-vmware.md#create-the-collector-vm).

## Collector communication diagram

![Collector communication diagram](./media/tutorial-assessment-vmware/portdiagram.PNG)


| Component      | To communicate with   | Port required                            | Reason                                   |
| -------------- | --------------------- | ---------------------------------------- | ---------------------------------------- |
| Collector      | Azure Migrate service | TCP 443                                  | Collector should be able to communicate with the service over the SSL port 443 |
| Collector      | vCenter Server        | Default 443                             | Collector should be able to communicate with the vCenter server. It connects to vCenter on 443 by default. If the vCenter listens on a different port, that port should be available as outgoing port on the collector |
| Collector		 | RDP|   | TCP 3389 | For you to be able to RDP into the Collector machine |





## Collector pre-requisites

The Collector needs to pass a few pre-requisite checks to ensure it can connect to the Azure Migrate service and upload the discovered data. This article looks at each of the prerequisites and understand why it is required.

### Internet connectivity

The collector appliance needs to be connected to the internet to send the discovered machines information. You can connect the machine to the internet in one of the two following ways.

1. You can configure the Collector to have direct internet connectivity.
2. You can configure the Collector to connect via a proxy server.
	* If the proxy server requires authentication, you can specify the username and password in the connection settings.
	* The IP address/FQDN of the Proxy server should be of the form http://IPaddress or http://FQDN. Only http proxy is supported.

> [!NOTE]
> HTTPS-based proxy servers are not supported by the collector.

#### Whitelisting URLs for internet connection

The pre-requisite check is successful if the Collector can connect to the internet via the provided settings. The connectivity check is validated by connecting to a list of URLs as given in the following table. If you are using any URL-based firewall proxy to control outbound connectivity, be sure to whitelist these required URLs:

**URL** | **Purpose**  
--- | ---
*.portal.azure.com | Required to check connectivity with the Azure service and validate time synchronization issues.

Additionally, the check also tries to validate connectivity to the following URLs but does not fail the check if not accessible. Configuring whitelist for the following URLs is optional, but you need to take manual steps to mitigate the pre-requisite check.

**URL** | **Purpose**  | **What if you don't whitelist**
--- | --- | ---
*.oneget.org:443 | Required to download the powershell based vCenter PowerCLI module. | PowerCLI installation fails. Install the module manually.
*.windows.net:443 | Required to download the powershell based vCenter PowerCLI module. | PowerCLI installation fails. Install the module manually.
*.windowsazure.com:443 | Required to download the powershell based vCenter PowerCLI module. | PowerCLI installation fails. Install the module manually.
*.powershellgallery.com:443 | Required to download the powershell based vCenter PowerCLI module. | PowerCLI installation fails. Install the module manually.
*.msecnd.net:443 | Required to download the powershell based vCenter PowerCLI module. | PowerCLI installation fails. Install the module manually.
*.visualstudio.com:443 | Required to download the powershell based vCenter PowerCLI module. | PowerCLI installation fails. Install the module manually.

### Time is in sync with the internet server

The Collector should be in sync with the internet time server to ensure the requests to the service are authenticated. The portal.azure.com url should be reachable from the Collector so that the time can be validated. If the machine is out of sync, you need to change the clock time on the Collector VM to match the current time, as follows:

1. Open an admin command prompt on the VM.
1. To check the time zone, run w32tm /tz.
1. To synchronize the time, run w32tm /resync.

### Collector service should be running

The Azure Migrate Collector service should be running on the machine. This service is started automatically when the machine boots. If the service is not running, you can start the *Azure Migrate Collector* service via control panel. The Collector service is responsible to connect to the vCenter server, collect the machine metadata and performance data, and send it to the service.

### VMware PowerCLI 6.5 

The VMware PowerCLI powershell module needs to be installed so that the Collector can communicate with the vCenter server and query for the machine details and their performance data. The powershell module is automatically downloaded and installed as part of the pre-requisite check. Automatic download requires a few URLs whitelisted, failing which you need either provide access by whitelisting them, or installing the module manually.

Install the module manually using the following steps:

1. To install the PowerCli on Collector without internet connection, follow the steps given in [this link](https://blogs.vmware.com/PowerCLI/2017/04/powercli-install-process-powershell-gallery.html) .
2. Once you have installed the PowerShell module on a different computer, which has internet access, copy the files VMware.* from that machine to the Collector machine.
3. Restart the prerequisite checks and confirm that PowerCLI is installed.

## Connecting to vCenter Server

The Collector should connect to the vCenter Server and be able to query for the virtual machines, their metadata, and their performance counters. This data is used by the project to calculate an assessment.

1. To connect to the vCenter Server, a read-only account with permissions as given in the following table can be used to run the discovery. 

    |Task  |Required role/account  |Permissions  |
    |---------|---------|---------|
    |Collector appliance based discovery    | You need at least a read-only user        |Data Center object –> Propagate to Child Object, role=Read-only         |

2. Only those datacenters that are accessible to the vCenter account specified can be accessed for discovery.
3. You need to specify the vCenter FQDN/IP address to connect to the vCenter server. By default, it will connect over the port 443. If you have configured the vCenter to listen on a different port number, you can specify it as part of the server address in the form  IPAddress:Port_Number or FQDN:Port_Number.
4. The statistics settings for vCenter Server should be set to level 3 before you start deployment. If the level is lower than 3, the discovery will complete, but performance data for storage and network won't be collected. The assessment size recommendations in this case will be based on performance data for CPU and memory, and only configuration data for disk and network adapters. [Read more](./concepts-collector.md) on what data is collected and how it impacts the assessment.
5. The Collector should have a network line of sight to the vCenter server.

> [!NOTE]
> Only vCenter Server versions 5.5, 6.0 and 6.5 are officially supported.

> [!IMPORTANT]
> We recommend that you set the highest common level (3) for the statistics level so that all the counters are collected correctly. If you have vCenter set at a lower level, only a few counters might be collected completely, with the rest set to 0. The assessment might then show incomplete data. 

### Selecting the scope for discovery

Once connected to the vCenter, you can select a scope to discover. Selecting a scope discovers all the virtual machines from the specified vCenter inventory path.

1. The scope can be either a datacenter, a folder, or a ESXi host. 
2. You can only select one scope at a time. To select more virtual machines, you can complete one discovery, and restart the discovery process with a new scope.
3. You can only select a scope that has *less than 1000 virtual machines*. If you select a scope that has more than 1000 virtual machines, you need to split the scope into smaller units by creating folders. Next, you need to run independent discoveries of the smaller folders.

## Specify migration project

Once the on-premises vCenter is connected, and a scope is specified, you can now specify the migration project details that need to be used for discovery and assessment. Specify the project ID and Key and connect.

## Start discovery and view collection progress

Once the discovery starts, the vCenter virtual machines are discovered, and their metadata and performance data is sent to the server. The progress status also informs you of the following IDs:

1. Collector ID: A unique ID that is given to your Collector machine. This ID does not change for a given machine across different discoveries. You can use this ID in case of failures when reporting the issue to Microsoft Support.
2. Session ID: A unique ID for the running collection job. You can refer to the same session ID in the portal when the discovery job completes. This ID changes for every collection job. In case of failures, you can report this ID to Microsoft Support.

### What data is collected?

The collection job discovers the following static metadata about the selected virtual machines. 

1. VM Display name (on vCenter)
2. VM’s inventory path (host/folder in vCenter)
3. IP address
4. MAC address
5. Number of cores, disks, NICs
6. RAM, Disk sizes
7. And performance counters of the VM, Disk and Network as listed in the table below.

The following table lists the performance counters that are collected, and also lists the assessment results that are impacted if a particular counter is not collected.

|Counter                                  |Level    |Per-device level  |Assessment impact                               |
|-----------------------------------------|---------|------------------|------------------------------------------------|
|cpu.usage.average                        | 1       |NA                |Recommended VM size and cost                    |
|mem.usage.average                        | 1       |NA                |Recommended VM size and cost                    |
|virtualDisk.read.average                 | 2       |2                 |Disk size, storage cost, and VM size         |
|virtualDisk.write.average                | 2       |2                 |Disk size, storage cost, and VM size         |
|virtualDisk.numberReadAveraged.average   | 1       |3                 |Disk size, storage cost, and VM size         |
|virtualDisk.numberWriteAveraged.average  | 1       |3                 |Disk size, storage cost, and VM size         |
|net.received.average                     | 2       |3                 |VM size and network cost                        |
|net.transmitted.average                  | 2       |3                 |VM size and network cost                        |

> [!WARNING]
> If you have just set a higher statistics level, it will take up to a day to generate the performance counters. So, we recommend that you run the discovery after one day.

### Time required to complete the collection

The Collector only discovers the machine data and sends it to the project. The project might take additional time before the discovered data is displayed on the portal and you can start creating an assessment.

Based on the number of virtual machines in the selected scope, it takes upto 15 minutes to send the static metadata to the project. Once the static metadata is available on the portal, you can see the list of machines in the portal and start creating groups. A assessment cannot be created until the collection job completes and the project has processed the data. Once the collection job completed on the Collector, it can take upto one hour for the performance data to be available on the portal, based on the number of virtual machines in the selected scope.

## Locking down the collector appliance
We recommend running continuous Windows updates on the collector appliance. If a collector is not updated for 45 days, the collector will start auto-shutting down the machine. If a discovery is running, the machine will not be turned off, even if it is past its 45 day period. Post the discovery job completes, the machine will be turned off. If you are using the collector for more than 45 days, we recommend keeping the machine updated at all times by running Windows update.

We also recommend the following steps to secure your appliance
1. Do not share or misplace administrator passwords with unauthorized parties.
2. Shut down the appliance when not in use.
3. Place the appliance in a secured network.
4. Once the migration work is complete, delete the appliance instance. Be sure to also delete the disk backing files (VMDKs), as the disks may have vCenter credentials cached on them.

## How to upgrade Collector

You can upgrade the Collector to the latest version without downloading the OVA once again.

1. Download the latest [upgrade package](https://aka.ms/migrate/col/latestupgrade).
2. To ensure that the downloaded hotfix is secure, open Administrator command window and run the following command to generate the hash for the ZIP file. The generated hash should match with the hash mentioned against the specific version:

	```C:\>CertUtil -HashFile <file_location> [Hashing Algorithm]```
	
	(example usage C:\>CertUtil -HashFile C:\AzureMigrate\CollectorUpdate_release_1.0.9.5.zip SHA256)
3. Copy the zip file to the Azure Migrate collector virtual machine (collector appliance).
4. Right-click on the zip file and select Extract All.
5. Right-click on Setup.ps1 and select Run with PowerShell and follow the instructions on screen to install the update.

### List of updates

#### Upgrade to version 1.0.9.5

For Upgrade to version 1.0.9.5 download [package](https://aka.ms/migrate/col/upgrade_9_5)

**Algorithm** | **Hash value**
--- | ---
MD5 | d969ebf3bdacc3952df0310d8891ffdf
SHA1 | f96cc428eaa49d597eb77e51721dec600af19d53
SHA256 | 07c03abaac686faca1e82aef8b80e8ad8eca39067f1f80b4038967be1dc86fa1

## Next steps

[Set up an assessment for on-premises VMware VMs](tutorial-assessment-vmware.md)

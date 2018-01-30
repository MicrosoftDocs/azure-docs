---
title: Collector appliance in Azure Migrate | Microsoft Docs
description: Provides an overview of the collector appliance and how to configure it.
author: ruturaj
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 01/23/2017
ms.author: ruturajd
---

# Collector aapliance

[Azure Migrate](migrate-overview.md) assesses on-premises workloads for migration to Azure. This article provides information about how to use the collector appliance.



## Overview

An Azure Migrate Collector is a ligh-weight appliance that can be used to discover your on-premises vCenter environment. This VM discovers on-premises VMware VMs, and sends metadata about them to the Azure Migrate service. The virtual machine can be downloaded as an OVA template from your Azure Migrate project. 

You can create the collector by following the steps here - [How to create the collector VM](tutorial-assessment-vmware.md#create-the-collector-vm).


## Collector pre-requisites

The collector needs to pass a few pre-requisite checks to ensure it can connect to the Azure Migrate servce and upload the discovered data. We look at each of the requirements and understand why it is required.

### Internet connectivity

The collector appliance needs to be connected to the internet to send the discovered machines information. You can connect the machine to the internet in one of the two following ways.

1. You can configure the collector to have direct internet connectivity.
2. You can configure the collector to connect via a proxy server.
	* If the proxy server requires authentication, you can specify the username and password in the connection settings.
	* The IP address/FQDN of the Proxy server should be of the form http://IPaddress or http://FQDN. Note that only http proxy is supported.

> [!NOTE]
> HTTPS-based proxy servers are not supported by the collector.

#### Whitelisting URLs for internet connection

The pre-requisite check is successful if the collector can connect to the internet via the provided settings. For this the machine tries to connect to the following URLs. If you are using any URL-based firewall proxy to control outbound connectivity, be sure to whitelist these required URLs:

**URL** | **Purpose**  
--- | ---
*.portal.azure.com | Required to check connectivity with the Azure service and validate time synchronization issues.

Additionally, the check also tries to validate connectivity to the following URLs but does not fail the check if not accessible. Configuring whitelist for the following URLs is optional, but you will need to take manual steps to mitigate the pre-requisite check.

**URL** | **Purpose**  | ** What if you dont whitelist **
--- | --- | ---
*.oneget.org:443 | Required to download the powershell based vCenter PowerCLI module. | PowerCLI installation will fail. You will need to install the module manually.
*.windows.net:443 | Required to download the powershell based vCenter PowerCLI module. | PowerCLI installation will fail. You will need to install the module manually.
*.windowsazure.com:443 | Required to download the powershell based vCenter PowerCLI module. | PowerCLI installation will fail. You will need to install the module manually.
*.powershellgallery.com:443 | Required to download the powershell based vCenter PowerCLI module. | PowerCLI installation will fail. You will need to install the module manually.
*.msecnd.net:443 | Required to download the powershell based vCenter PowerCLI module. | PowerCLI installation will fail. You will need to install the module manually.
*.visualstudio.com:443 | Required to download the powershell based vCenter PowerCLI module. | PowerCLI installation will fail. You will need to install the module manually.

### Time is in sync with the internet server

The collector needs to be in sync with the internet time server. The portal.azure.com url should be reachable from the collector so that the time can be validated. If the machine is out of sync, you need to change the clock time on the collector VM to match the current time, as follows:

1. Open an admin command prompt on the VM.
1. To check the time zone, run w32tm /tz.
1. To synchronize the time, run w32tm /resync.

### Collector service should be running

The Azure Migrate Collector service should be running on the machine. This service is started automatically when the machine boots. If the service is not running, you can start the *Azure Migrate Collector* service via control panel. 

### VMware PowerCLI 6.5 

The VMware PowerCLI powershell module needs to be installed so that the collector can communicate with the vCenter server and query for the machine details and their performance data. The powershell module is automatically downloaded and installed as part of the pre-requisite check. This requires a few URLs whitelisted if you are using the 

If you have not whitelisted the URLs, the automatic installation will fail. You need to install the module manually using the following steps.

1. Follow the steps given in [this link](https://blogs.vmware.com/PowerCLI/2017/04/powercli-install-process-powershell-gallery.html) to install the PowerCli on collector without internet connection.
2. Once you have installed the PowerShell module on a different computer which has internet access, copy the files VMware.* from that machine to the collector machine.
3. Restart the prerequisite checks and confirm that PowerCLI is installed.

## Connecting to vCenter Server

The collector needs to connect to the vCenter Server and be able to query for the virtual machines, their metadata, and their performance counters. This data is used by the project to calculate an assessment.

To connect to the vCenter Server, a read-only account can be used to run the discovery. 


|Task  |Required role/account  |Permissions  |
|---------|---------|---------|
|Collector Appliance Discovery    | You need at least a read-only user        |Data Center object –> Propagate to Child Object, role=Read-only         |




**Check** | **Details**
--- | ---
**Boot type** | The boot type of the guest OS disk must be BIOS, and not UEFI.
**Cores** | The number of cores in the machines must be equal to (or less than) the maximum number of cores (32) supported for an Azure VM.<br/><br/> If performance history is available, Azure Migrate considers the utilized cores for comparison. If a comfort factor is specified in the assessment settings, the number of utilized cores is multiplied by the comfort factor.<br/><br/> If there's no performance history, Azure Migrate uses the allocated cores, without applying the comfort factor.
**Memory** | The machine memory size must be equal to (or less than) the maximum memory (448 GB) allowed for an Azure VM. <br/><br/> If performance history is available, Azure Migrate considers the utilized memory for comparison. If a comfort factor is specified, the utilized memory is multiplied by the comfort factor.<br/><br/> If there's no history the allocated memory is used, without applying the comfort factor.<br/><br/> 
**Windows Server 2003-2008 R2** | 32-bit and 64-bit support.<br/><br/> Azure provides best effort support only.
**Windows Server 2008 R2 with all SPs** | 64-bit support.<br/><br/> Azure provides full support.
**Windows Server 2012 & all SPs** | 64-bit support.<br/><br/> Azure provides full support.
**Windows Server 2012 R2 & all SPs** | 64-bit support.<br/><br/> Azure provides full support.
**Windows Server 2016 & all SPs** | 64-bit support.<br/><br/> Azure provides full support.
**Windows Client 7 and later** | 64-bit support.<br/><br/> Azure provides support with Visual Studio subscription only.
**Linux** | 64-bit support.<br/><br/> Azure provides full support for these [operating systems](../virtual-machines/linux/endorsed-distros.md).
**Storage disk** | Allocated size of a disk must be 4 TB (4096 GB) or less.<br/><br/> The number of disks attached to the machine must be 65 or less, including the OS disk. 
**Networking** | A machine must have 32 or less NICs attached to it.


## Performance-based sizing

After a machine is marked as suitable for Azure, Azure Migrate maps it to a VM size in Azure, using the following criteria:

- **Storage check**: Azure Migrate tries to map every disk attached to the machine to a disk in Azure:
    - Azure Migrate multiplies the I/O per second (IOPS) by the comfort factor. It also multiples the throughput ( in MBps) of each disk by the comfort factor. This provides the effective disk IOPS and throughput. Based on this, Azure Migrate maps the disk to a standard or premium disk in Azure.
      - If the service can't find a disk with the required IOPS & throughput, it marks the machine as unsuitable for Azure.
      - If it finds a set of suitable disks, Azure Migrate selects the ones that support the storage redundancy method, and the location specified in the assessment settings.
      - If there are multiple eligible disks, it selects the one with the lowest cost.
- **Storage disk throughput**: [Learn more](../azure-subscription-service-limits.md#storage-limits) about Azure limits per disk and VM.
- **Disk type**: Azure Migrate supports managed disks only.
- **Network check**: Azure Migrate tries to find an Azure VM that can support the number of NICs on the on-premises machine.
    - To do this, it aggregates the data transmitted per second (MBps) out of the machine (network out) across all NICs, and applies the comfort factor to the aggregated number. This number if used to find an Azure VM that can support the required network performance.
    - Azure Migrate takes the network settings from the VM, and assumes it to be a network outside the datacenter.
    - If no network performance data is available, only the NIC count is considered for VM sizing.
- **Compute check**: After storage and network requirements are calculated, Azure Migrate considers compute
requirements:
    - If the performance data is available for the VM, it looks at the utilized cores and memory, and applies the comfort factor. Based on that number, it tries to find a suitable VM size in Azure.
    - If no suitable size is found, the machine is marked as unsuitable for Azure.
    - If a suitable size is found, Azure Migrate applies the storage and networking calculations. It then applies location and pricing tier settings, for the final VM size recommendation.


## Monthly cost estimation

After sizing recommendations are complete, Azure Migrate calculates post-migration compute and storage costs.

- **Compute cost**: Using the recommended Azure VM size, Azure Migrate uses the Billing API to calculate
the monthly cost for the VM. The calculation takes the operating system, software assurance, location, and currency settings into account. It aggregates the cost across all machines, to calculate the total monthly compute cost.
- **Storage cost**: The monthly storage cost for a machine is calculated by aggregating the monthly cost of
all disks attached to the machine. Azure Migrate calculates the total monthly storage costs by aggregating the storage costs of all machines. Currently, the calculation doesn't take offers specified in the assessment settings into account.

Costs are displayed in the currency specified in the assessment settings. 


## Next steps

[Set up an assessment for on-premises VMware VMs](tutorial-assessment-vmware.md)
